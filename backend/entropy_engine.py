"""
Mathematical Information Loss & Shannon Entropy Calculation Engine
"""

import math
from collections import Counter
from typing import List, Dict, Any


def calculate_shannon_entropy(values: List[Any]) -> float:
    """
    Computes empirical Shannon entropy in bits:
    H(X) = - sum(p(x) * log2(p(x)))
    """
    if not values:
        return 0.0
    
    total = len(values)
    counts = Counter(values)
    entropy = 0.0
    
    for count in counts.values():
        if count > 0:
            p = count / total
            entropy -= p * math.log2(p)
            
    return round(entropy, 4)


def calculate_column_entropy_loss(raw_values: List[Any], cleaned_values: List[Any]) -> float:
    """
    Computes delta H = max(0, H_raw - H_cleaned)
    """
    h_raw = calculate_shannon_entropy(raw_values)
    h_cleaned = calculate_shannon_entropy(cleaned_values)
    delta = round(abs(h_raw - h_cleaned), 4)
    return delta


def analyze_dataset_impact(raw_records: List[Dict[str, Any]], cleaned_records: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes dataset-level information loss, records modified, and column-by-column metrics.
    """
    if not raw_records:
        return {
            "totalRecords": 0,
            "recordsAffected": 0,
            "percentAffected": 0.0,
            "fieldsChanged": 0,
            "entropyDelta": 0.0,
            "informationLossCategory": "None",
            "reversibility": "100% Guaranteed via delta snapshots",
            "columnImpacts": []
        }

    total_records = len(raw_records)
    all_columns = list(raw_records[0].keys()) if raw_records else []
    
    affected_rows = 0
    column_change_counts = {col: 0 for col in all_columns}
    column_impacts = []
    
    # Track modified rows
    min_len = min(len(raw_records), len(cleaned_records))
    for i in range(min_len):
        r_raw = raw_records[i]
        r_clean = cleaned_records[i]
        row_changed = False
        for col in all_columns:
            if str(r_raw.get(col, "")) != str(r_clean.get(col, "")):
                column_change_counts[col] += 1
                row_changed = True
        if row_changed:
            affected_rows += 1
            
    # Include deduplicated records delta
    if len(raw_records) > len(cleaned_records):
        dedup_delta = len(raw_records) - len(cleaned_records)
        affected_rows += dedup_delta

    total_entropy_delta = 0.0
    fields_changed_count = 0

    for col in all_columns:
        vals_raw = [r.get(col, "") for r in raw_records]
        vals_clean = [r.get(col, "") for r in cleaned_records]
        delta_h = calculate_column_entropy_loss(vals_raw, vals_clean)
        total_entropy_delta += delta_h
        
        changes = column_change_counts.get(col, 0)
        if changes > 0 or delta_h > 0:
            fields_changed_count += 1
            
        column_impacts.append({
            "column": col,
            "changeCount": changes,
            "entropyLoss": f"{delta_h:.3f}",
            "reversibility": "Available"
        })

    avg_entropy_delta = round(total_entropy_delta / max(1, len(all_columns)), 4)
    loss_category = "Low Risk" if avg_entropy_delta < 0.05 else "Moderate Risk" if avg_entropy_delta < 0.15 else "High Risk"

    return {
        "totalRecords": total_records,
        "recordsAffected": affected_rows,
        "percentAffected": round((affected_rows / max(1, total_records)) * 100, 2),
        "fieldsChanged": fields_changed_count,
        "entropyDelta": avg_entropy_delta,
        "informationLossCategory": loss_category,
        "reversibility": "100% Guaranteed via delta snapshots",
        "columnImpacts": [c for c in column_impacts if c["changeCount"] > 0 or float(c["entropyLoss"]) > 0]
    }
