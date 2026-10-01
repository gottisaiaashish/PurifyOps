"""
Autonomous Enterprise Dataset Profiler & Quality Metrics Calculator
Calculates real data quality metrics, anomalies, and issue breakdown directly from dataframes/records.
"""

import re
from typing import List, Dict, Any, Tuple
from collections import Counter

# Standard Sentinels to treat as missing / blank values
NULL_SENTINELS = {
    "", "na", "n/a", "null", "none", "-", "?", "missing", "nan", "nil", "\\n", "undefined"
}

# Regex Rules
EMAIL_SYNTAX_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$")
KNOWN_DOMAIN_TYPOS = {
    "gmial.com": "gmail.com",
    "gamil.com": "gmail.com",
    "gmal.com": "gmail.com",
    "yaho.com": "yahoo.com",
    "yaho.co": "yahoo.com",
    "hotmial.com": "hotmail.com",
    "outlok.com": "outlook.com",
    "gnail.com": "gmail.com"
}

INTEGER_REGEX = re.compile(r"^-?\d+$")
FLOAT_REGEX = re.compile(r"^-?\d+(\.\d+)?$")
DATE_REGEX = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def is_null_val(val: Any) -> bool:
    if val is None:
        return True
    s = str(val).strip().lower()
    return s in NULL_SENTINELS or len(s) == 0


def is_valid_phone(val: Any) -> Tuple[bool, str]:
    """
    Normalizes common phone formatting (+91 9876543210, +919876543210, 98765-43211, 9999999999)
    and checks structural validity. Returns (is_valid, normalized_phone).
    """
    if is_null_val(val):
        return True, ""  # Missing phone handled under Missing Values
    
    s = str(val).strip()
    # Check for non-phone text like "abcd"
    if re.search(r"[a-zA-Z]", s):
        return False, s

    # Strip formatting characters: spaces, dashes, dots, parentheses, leading '+'
    digits_only = re.sub(r"[^\d]", "", s)
    
    # Common country code prefix handling (+91, 91, 1 if len > 10)
    if len(digits_only) == 12 and digits_only.startswith("91"):
        digits_only = digits_only[2:]
    elif len(digits_only) == 11 and digits_only.startswith("0"):
        digits_only = digits_only[1:]
    elif len(digits_only) == 11 and digits_only.startswith("1"):
        digits_only = digits_only[1:]

    # Check valid digit count (standard 10-digit mobile/landline or 7-15 digits globally)
    if 7 <= len(digits_only) <= 15:
        return True, digits_only
    
    return False, s


def classify_email(val: Any) -> str:
    """
    Returns: 'missing', 'valid', 'invalid_syntax', 'suspicious_domain_typo'
    """
    if is_null_val(val):
        return 'missing'
    s = str(val).strip().lower()
    
    # Check syntax errors: e.g. anjali@gmail (missing extension), suresh@@gmail.com (double @)
    if not EMAIL_SYNTAX_REGEX.match(s) or "@@" in s or ".." in s:
        return 'invalid_syntax'

    parts = s.split("@")
    if len(parts) == 2:
        domain = parts[1]
        if domain in KNOWN_DOMAIN_TYPOS:
            return 'suspicious_domain_typo'

    return 'valid'


def infer_column_type(values: List[str]) -> Tuple[str, str]:
    """
    Returns (Inferred Type, Semantic Role)
    """
    non_nulls = [v.strip() for v in values if not is_null_val(v)]
    if not non_nulls:
        return "String", "Generic Attribute"
    
    # Check email
    email_matches = sum(1 for v in non_nulls if EMAIL_SYNTAX_REGEX.match(v.lower()))
    if email_matches / len(non_nulls) > 0.5:
        return "String", "Contact / Identifier"
    
    # Check phone
    phone_matches = sum(1 for v in non_nulls if is_valid_phone(v)[0])
    if phone_matches / len(non_nulls) > 0.6:
        return "String", "Contact Identifier"

    # Check date
    date_matches = sum(1 for v in non_nulls if DATE_REGEX.match(v))
    if date_matches / len(non_nulls) > 0.7:
        return "Date", "Temporal Dimension"

    # Check numeric
    clean_nums = [v.replace("$", "").replace(",", "").strip() for v in non_nulls]
    int_matches = sum(1 for v in clean_nums if INTEGER_REGEX.match(v))
    float_matches = sum(1 for v in clean_nums if FLOAT_REGEX.match(v))
    
    if (int_matches + float_matches) / len(non_nulls) > 0.8:
        if float_matches > 0:
            return "Float", "Financial / Metric"
        return "Integer", "Metric / Demographic"
        
    # Check categorical vs unique
    distinct_ratio = len(set(non_nulls)) / len(non_nulls)
    if distinct_ratio < 0.2:
        return "Categorical", "Category / Status"
        
    return "String", "Descriptive Attribute"


def profile_columns(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not records:
        return []

    total_rows = len(records)
    columns = list(records[0].keys())
    profiles = []

    for col in columns:
        vals = [str(r.get(col, "")) if r.get(col) is not None else "" for r in records]
        non_null_vals = [v for v in vals if not is_null_val(v)]
        
        missing_count = total_rows - len(non_null_vals)
        missing_pct = round((missing_count / total_rows) * 100, 1)
        
        unique_count = len(set(non_null_vals))
        unique_pct = round((unique_count / max(1, len(non_null_vals))) * 100, 1)

        inferred_type, semantic_role = infer_column_type(vals)
        
        validity_pct = 100.0
        anomalies_count = 0
        status = "good"
        status_note = "Valid column structure"
        inferred_constraint = "Standard Nullable Column"

        col_lower = col.lower()
        
        if "id" in col_lower:
            semantic_role = "Primary Key / ID"
            inferred_constraint = "Unique, Non-null Identifier"
            id_counts = Counter(non_null_vals)
            dups = sum(cnt for cnt in id_counts.values() if cnt > 1)
            anomalies_count = dups
            if dups > 0:
                status = "warning"
                status_note = f"{dups} key collisions detected"
                validity_pct = round(100.0 - (dups / total_rows * 100), 1)

        elif "email" in col_lower:
            inferred_constraint = "RFC-5322 Standard Email Syntax"
            invalid_emails = [v for v in non_null_vals if classify_email(v) == 'invalid_syntax']
            anomalies_count = len(invalid_emails)
            validity_pct = round((1.0 - (anomalies_count / max(1, len(non_null_vals)))) * 100, 1)
            if anomalies_count > 0:
                status = "danger" if validity_pct < 90 else "warning"
                status_note = f"{anomalies_count} invalid email formats / syntax errors"

        elif "phone" in col_lower:
            inferred_constraint = "Normalized Phone Number Validation"
            invalid_phones = [v for v in non_null_vals if not is_valid_phone(v)[0]]
            anomalies_count = len(invalid_phones)
            validity_pct = round((1.0 - (anomalies_count / max(1, len(non_null_vals)))) * 100, 1)
            if anomalies_count > 0:
                status = "warning"
                status_note = f"{anomalies_count} invalid non-numeric phone values"

        elif "age" in col_lower:
            inferred_constraint = "Domain Bounds: 0 <= Age <= 120"
            out_of_bounds = []
            for v in non_null_vals:
                try:
                    num = float(v)
                    if num < 0 or num > 120:
                        out_of_bounds.append(v)
                except ValueError:
                    out_of_bounds.append(v)
            anomalies_count = len(out_of_bounds)
            validity_pct = round((1.0 - (anomalies_count / max(1, len(non_null_vals)))) * 100, 1)
            if anomalies_count > 0:
                status = "warning"
                status_note = f"{anomalies_count} out-of-range bounds (< 0 or > 120)"

        elif "revenue" in col_lower:
            inferred_constraint = "Monetary >= 0, Log-normal distribution"
            negatives = []
            for v in non_null_vals:
                try:
                    clean = v.replace("$", "").replace(",", "")
                    if float(clean) < 0:
                        negatives.append(v)
                except ValueError:
                    pass
            anomalies_count = len(negatives)
            if anomalies_count > 0:
                status = "warning"
                status_note = f"{anomalies_count} negative revenue values"

        profiles.append({
            "name": col,
            "type": inferred_type,
            "semanticRole": semantic_role,
            "uniquePct": unique_pct,
            "missingPct": missing_pct,
            "validityPct": validity_pct,
            "inferredConstraint": inferred_constraint,
            "potentialAnomalies": anomalies_count,
            "sampleValues": non_null_vals[:4],
            "status": status,
            "statusNote": status_note
        })

    return profiles


def calculate_quality_dimensions(records: List[Dict[str, Any]], profiles: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not records:
        return {"completeness": 100, "consistency": 100, "validity": 100, "uniqueness": 100, "overall_score": 100}

    total_cells = len(records) * len(profiles)
    total_missing = sum(sum(1 for val in r.values() if is_null_val(val)) for r in records)
    completeness = round(max(0.0, min(100.0, (1.0 - (total_missing / max(1, total_cells))) * 100)), 1)

    avg_validity = round(sum(p["validityPct"] for p in profiles) / max(1, len(profiles)), 1)
    
    # Calculate duplicates based on exact or key attributes
    seen = set()
    dup_rows = 0
    for r in records:
        row_tuple = tuple(str(v).strip().lower() for v in r.values())
        if row_tuple in seen:
            dup_rows += 1
        else:
            seen.add(row_tuple)

    uniqueness = round(max(0.0, min(100.0, (1.0 - (dup_rows / max(1, len(records)))) * 100)), 1)
    consistency = round(min(completeness, avg_validity) * 0.95, 1)
    overall = round((completeness * 0.30) + (avg_validity * 0.25) + (uniqueness * 0.25) + (consistency * 0.20))

    return {
        "completeness": completeness,
        "consistency": consistency,
        "validity": avg_validity,
        "uniqueness": uniqueness,
        "overall_score": overall
    }


def detect_issues(records: List[Dict[str, Any]], profiles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not records:
        return []

    issues = []

    # 1. Missing Values (Detect every missing cell across all rows/cols)
    total_missing_cells = 0
    missing_by_col = {}
    missing_evidence = []
    
    for r_idx, r in enumerate(records):
        for col_name, val in r.items():
            if is_null_val(val):
                total_missing_cells += 1
                missing_by_col[col_name] = missing_by_col.get(col_name, 0) + 1
                if len(missing_evidence) < 10:
                    missing_evidence.append({
                        "id": f"r{r_idx + 1}-{col_name}",
                        "row_id": r_idx + 1,
                        "original": f"{col_name}: [Blank / Null]",
                        "value": "[Missing]",
                        "fix": f"Impute {col_name} using default / median"
                    })

    if total_missing_cells > 0:
        affected_cols = list(missing_by_col.keys())
        issues.append({
            "id": "iss-001",
            "type": "Missing Values",
            "category": "Completeness",
            "severity": "Medium",
            "affectedRecords": total_missing_cells,
            "affected_count": total_missing_cells,
            "affectedColumns": affected_cols,
            "columns": affected_cols,
            "confidence": 99.0,
            "explanation": f"Identified {total_missing_cells} missing / null cells across columns: {', '.join(affected_cols)}.",
            "evidence": missing_evidence,
            "recommendedAction": "Impute missing demographic entries via statistical defaults or cohort medians.",
            "safeToAutoApprove": True
        })

    # 2. Invalid Email Syntax vs Suspicious Domain Typo
    invalid_email_rows = []
    invalid_email_evidence = []
    suspicious_domain_rows = []
    suspicious_domain_evidence = []

    for r_idx, r in enumerate(records):
        email_val = r.get("Email") or r.get("email") or r.get("EMAIL")
        if email_val is not None:
            status = classify_email(email_val)
            if status == "invalid_syntax":
                invalid_email_rows.append(r_idx + 1)
                invalid_email_evidence.append({
                    "id": f"r{r_idx + 1}-email",
                    "row_id": r_idx + 1,
                    "original": str(email_val),
                    "value": str(email_val),
                    "fix": "Fix email format / add domain extension"
                })
            elif status == "suspicious_domain_typo":
                parts = str(email_val).strip().lower().split("@")
                corrected_domain = KNOWN_DOMAIN_TYPOS.get(parts[1], parts[1])
                suggested = f"{parts[0]}@{corrected_domain}"
                suspicious_domain_rows.append(r_idx + 1)
                suspicious_domain_evidence.append({
                    "id": f"r{r_idx + 1}-email-typo",
                    "row_id": r_idx + 1,
                    "original": str(email_val),
                    "value": str(email_val),
                    "fix": f"Change domain to {corrected_domain} ({suggested})"
                })

    if invalid_email_rows:
        issues.append({
            "id": "iss-002",
            "type": "Invalid Email Syntax",
            "category": "Format Validity",
            "severity": "High",
            "affectedRecords": len(invalid_email_rows),
            "affected_count": len(invalid_email_rows),
            "affected_rows": invalid_email_rows,
            "affectedColumns": ["Email"],
            "columns": ["Email"],
            "confidence": 98.0,
            "explanation": f"Found {len(invalid_email_rows)} emails with structural syntax errors (missing TLD extension, double '@', etc.).",
            "evidence": invalid_email_evidence,
            "recommendedAction": "Correct syntax errors, strip invalid characters, and flag unparseable addresses.",
            "safeToAutoApprove": True
        })

    if suspicious_domain_rows:
        issues.append({
            "id": "iss-003",
            "type": "Suspicious Email Domain Typo",
            "category": "Domain Validation",
            "severity": "Low",
            "affectedRecords": len(suspicious_domain_rows),
            "affected_count": len(suspicious_domain_rows),
            "affected_rows": suspicious_domain_rows,
            "affectedColumns": ["Email"],
            "columns": ["Email"],
            "confidence": 92.0,
            "explanation": f"Found {len(suspicious_domain_rows)} valid email formats with likely domain typos (e.g. 'gmial.com' -> 'gmail.com').",
            "evidence": suspicious_domain_evidence,
            "recommendedAction": "Standardize domain spelling to canonical provider domains.",
            "safeToAutoApprove": True
        })

    # 3. Invalid Phone Number (Non-numeric / Malformed)
    invalid_phone_rows = []
    invalid_phone_evidence = []
    for r_idx, r in enumerate(records):
        phone_val = r.get("Phone") or r.get("phone") or r.get("PHONE")
        if phone_val is not None and not is_null_val(phone_val):
            valid, norm = is_valid_phone(phone_val)
            if not valid:
                invalid_phone_rows.append(r_idx + 1)
                invalid_phone_evidence.append({
                    "id": f"r{r_idx + 1}-phone",
                    "row_id": r_idx + 1,
                    "original": str(phone_val),
                    "value": str(phone_val),
                    "fix": "Remove non-numeric characters or mark invalid"
                })

    if invalid_phone_rows:
        issues.append({
            "id": "iss-004",
            "type": "Invalid Phone Number",
            "category": "Standardization",
            "severity": "Medium",
            "affectedRecords": len(invalid_phone_rows),
            "affected_count": len(invalid_phone_rows),
            "affected_rows": invalid_phone_rows,
            "affectedColumns": ["Phone"],
            "columns": ["Phone"],
            "confidence": 95.0,
            "explanation": f"Found {len(invalid_phone_rows)} phone numbers containing invalid non-numeric text.",
            "evidence": invalid_phone_evidence,
            "recommendedAction": "Clean non-numeric characters and format to E.164 standard.",
            "safeToAutoApprove": True
        })

    # 4. Out-of-Bounds & Negative Anomalies (Age < 0 or > 120, Revenue < 0)
    outlier_rows = []
    outlier_evidence = []
    outlier_cols = set()

    for r_idx, r in enumerate(records):
        age_val = r.get("Age") or r.get("age")
        if age_val is not None and not is_null_val(age_val):
            try:
                age_num = float(str(age_val).replace("$", "").replace(",", "").strip())
                if age_num < 0 or age_num > 120:
                    outlier_rows.append(r_idx + 1)
                    outlier_cols.add("Age")
                    outlier_evidence.append({
                        "id": f"r{r_idx + 1}-age",
                        "row_id": r_idx + 1,
                        "original": f"Age: {age_val}",
                        "value": str(age_val),
                        "fix": "Clip age to valid range [0 - 120]"
                    })
            except ValueError:
                pass

        rev_val = r.get("Annual_Revenue") or r.get("annual_revenue") or r.get("Revenue")
        if rev_val is not None and not is_null_val(rev_val):
            try:
                rev_num = float(str(rev_val).replace("$", "").replace(",", "").strip())
                if rev_num < 0:
                    outlier_rows.append(r_idx + 1)
                    outlier_cols.add("Annual_Revenue")
                    outlier_evidence.append({
                        "id": f"r{r_idx + 1}-rev",
                        "row_id": r_idx + 1,
                        "original": f"Annual_Revenue: {rev_val}",
                        "value": str(rev_val),
                        "fix": "Convert negative revenue to absolute or 0"
                    })
            except ValueError:
                pass

    if outlier_rows:
        issues.append({
            "id": "iss-005",
            "type": "Domain Out-of-Bounds",
            "category": "Outliers & Bounds",
            "severity": "Critical",
            "affectedRecords": len(outlier_rows),
            "affected_count": len(outlier_rows),
            "affected_rows": sorted(list(set(outlier_rows))),
            "affectedColumns": list(outlier_cols),
            "columns": list(outlier_cols),
            "confidence": 98.0,
            "explanation": f"Identified {len(outlier_rows)} domain bounds violations (e.g. Age < 0 or > 120, Annual_Revenue < 0).",
            "evidence": outlier_evidence,
            "recommendedAction": "Clamp out-of-range metrics to valid domain boundaries.",
            "safeToAutoApprove": False
        })

    # 5. Duplicate & Near-Duplicate Records
    duplicate_row_indices = set()
    duplicate_evidence = []
    
    seen_exact = {}
    seen_entity = {}

    for r_idx, r in enumerate(records):
        row_tuple = tuple(str(r.get(k, "")).strip().lower() for k in sorted(r.keys()))
        if row_tuple in seen_exact:
            duplicate_row_indices.add(r_idx + 1)
            duplicate_row_indices.add(seen_exact[row_tuple])
            duplicate_evidence.append({
                "id": f"r{r_idx + 1}-dup",
                "row_id": r_idx + 1,
                "original": f"Exact duplicate of row #{seen_exact[row_tuple]}",
                "value": "Duplicate Row",
                "fix": "Merge duplicate record"
            })
        else:
            seen_exact[row_tuple] = r_idx + 1

        first_name = str(r.get("First_Name") or r.get("first_name") or "").strip().lower()
        last_name = str(r.get("Last_Name") or r.get("last_name") or "").strip().lower()
        email_key = str(r.get("Email") or r.get("email") or "").strip().lower()
        
        entity_key = f"{first_name}_{last_name}" if (first_name and last_name) else (email_key if email_key else None)
        if entity_key and not is_null_val(entity_key):
            if entity_key in seen_entity:
                orig_idx = seen_entity[entity_key]
                if r_idx + 1 != orig_idx:
                    duplicate_row_indices.add(r_idx + 1)
                    duplicate_row_indices.add(orig_idx)
                    duplicate_evidence.append({
                        "id": f"r{r_idx + 1}-fuzzy-dup",
                        "row_id": r_idx + 1,
                        "original": f"Matching entity with row #{orig_idx} ({entity_key})",
                        "value": "Near-Duplicate Record",
                        "fix": "Deduplicate & merge contact info"
                    })
            else:
                seen_entity[entity_key] = r_idx + 1

    if duplicate_row_indices:
        issues.append({
            "id": "iss-006",
            "type": "Duplicate Records",
            "category": "Duplicates",
            "severity": "High",
            "affectedRecords": len(duplicate_row_indices),
            "affected_count": len(duplicate_row_indices),
            "affected_rows": sorted(list(duplicate_row_indices)),
            "affectedColumns": ["First_Name", "Last_Name", "Email", "Phone"],
            "columns": ["First_Name", "Last_Name", "Email", "Phone"],
            "confidence": 96.0,
            "explanation": f"Identified {len(duplicate_row_indices)} duplicate or near-duplicate customer records sharing identical contact details.",
            "evidence": duplicate_evidence[:10],
            "recommendedAction": "Deduplicate customer entities and preserve most complete record.",
            "safeToAutoApprove": False
        })

    # 6. City Consistency Check
    city_vals = {}
    for r_idx, r in enumerate(records):
        city = r.get("City") or r.get("city")
        if city is not None and not is_null_val(city):
            norm_city = str(city).strip().title()
            raw_city = str(city).strip()
            city_vals.setdefault(norm_city, set()).add(raw_city)

    casing_inconsistencies = [norm for norm, raws in city_vals.items() if len(raws) > 1]
    if casing_inconsistencies:
        inconsistent_rows = []
        inconsistent_evidence = []
        for r_idx, r in enumerate(records):
            city = r.get("City") or r.get("city")
            if city is not None and not is_null_val(city):
                norm = str(city).strip().title()
                if norm in casing_inconsistencies:
                    inconsistent_rows.append(r_idx + 1)
                    inconsistent_evidence.append({
                        "id": f"r{r_idx + 1}-city",
                        "row_id": r_idx + 1,
                        "original": str(city),
                        "value": str(city),
                        "fix": f"Normalize to '{norm}'"
                    })
        if inconsistent_rows:
            issues.append({
                "id": "iss-007",
                "type": "City Name Inconsistency",
                "category": "Standardization",
                "severity": "Low",
                "affectedRecords": len(inconsistent_rows),
                "affected_count": len(inconsistent_rows),
                "affected_rows": inconsistent_rows,
                "affectedColumns": ["City"],
                "columns": ["City"],
                "confidence": 94.0,
                "explanation": f"Found {len(inconsistent_rows)} city entries with inconsistent casing or whitespace formatting (e.g. 'HYDERABAD' vs 'Hyderabad').",
                "evidence": inconsistent_evidence[:10],
                "recommendedAction": "Standardize city names into proper Title Case formatting.",
                "safeToAutoApprove": True
            })

    return issues


def generate_debug_summary(records: List[Dict[str, Any]], issues: List[Dict[str, Any]]) -> Dict[str, Any]:
    rows_scanned = len(records)
    cols_scanned = len(records[0].keys()) if records else 0

    missing_cells = 0
    duplicate_rows = 0
    invalid_values = 0
    anomalies = 0

    for iss in issues:
        itype = (iss.get("type") or "").lower()
        acount = iss.get("affectedRecords") or iss.get("affected_count") or 0
        if "missing" in itype:
            missing_cells += acount
        elif "duplicate" in itype:
            duplicate_rows += acount
        elif "email" in itype or "phone" in itype:
            invalid_values += acount
        else:
            anomalies += acount

    return {
        "rows_scanned": rows_scanned,
        "columns_scanned": cols_scanned,
        "missing_cells": missing_cells,
        "duplicate_rows": duplicate_rows,
        "invalid_values": invalid_values,
        "anomalies": anomalies
    }
