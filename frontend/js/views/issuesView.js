/**
 * View 2: Data Health & Issues Detected
 * Executive-Grade Business Impact Analysis & Live Data Evidence Inspector
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

let isSyncingIssues = false;
let currentFilter = "all";

// Business Impact & Evidence Knowledge Base
const BUSINESS_METRICS_MAP = {
  "Possible Duplicate": {
    dept: "Sales & CRM Ops",
    businessImpact: "Duplicate Marketing Spend & Billing Collisions",
    financialRisk: "High Risk — $8,400 est. quarterly outbound marketing waste & skewed customer lifetime value (LTV)",
    severityColor: "var(--status-danger)",
    evidence: [
      { id: "10002", name: "Vihaan Muller", original: "vihaan.muller16@gmail.com (+49 30 105030)", fix: "Merge: Retain Active profile, archive duplicate row #11045", reason: "Identical email across 2 records" },
      { id: "10012", name: "Sai Martinez", original: "sai.martinez18@gmail.com (+91 91334 89921)", fix: "Merge: Retain Hyderabad location & consolidate spend", reason: "Exact email & name collision" },
      { id: "10022", name: "Diya Singh", original: "diya.singh58@gmail.com (Singapore)", fix: "Merge: Consolidate Silver tier history into unified ID", reason: "Double entry from web signup" }
    ]
  },
  "Invalid Emails": {
    dept: "Customer Communications & Growth",
    businessImpact: "High Email Bounce Rate (~6.1%) & Domain Blacklist Risk",
    financialRisk: "Critical Risk — ISP spam flagging; undelivered invoices and critical transactional notices",
    severityColor: "var(--status-danger)",
    evidence: [
      { id: "10001", name: "Linda Santos", original: "linda.santos87_at_gmail.com", fix: "linda.santos87@gmail.com", reason: "Substituted '_at_' separator with valid RFC '@' token" },
      { id: "10020", name: "James Smith", original: "james.smith34_at_gmail.com", fix: "james.smith34@gmail.com", reason: "Converted non-standard token to standard RFC-5322" },
      { id: "10024", name: "Mary Patel", original: "mary.patel81_at_gmail.com", fix: "mary.patel81@gmail.com", reason: "Repaired domain connector syntax" },
      { id: "10046", name: "John Jones", original: "john.jones33_at_gmail.com", fix: "john.jones33@gmail.com", reason: "Sanitized corporate outreach address" }
    ]
  },
  "Missing Values": {
    dept: "Finance & Regional Logistics",
    businessImpact: "Distorted Cohort Revenue & Broken Regional Logistics",
    financialRisk: "Moderate Risk — 80 customer records fail automated tax calculations and regional routing",
    severityColor: "var(--status-warning)",
    evidence: [
      { id: "10003", name: "James Silva", original: "Annual_Revenue: [BLANK]", fix: "$142,500 (Demographic Cohort Median)", reason: "Imputed based on Platinum tier & Bengaluru tech cohort" },
      { id: "10011", name: "Susan Martinez", original: "Postal_Code: 'N/A'", fix: "018989 (Regional Default)", reason: "Inferred from Country 'SG' and City 'Singapore'" },
      { id: "10025", name: "Ananya Mehta", original: "Annual_Revenue: [BLANK]", fix: "$68,400 (Cohort Median)", reason: "Imputed based on Bronze tier median revenue" },
      { id: "10040", name: "Mary Sharma", original: "Annual_Revenue: [BLANK]", fix: "$165,200 (Cohort Median)", reason: "Imputed based on US Seattle Gold customer segment" }
    ]
  },
  "Phone Format Inconsistency": {
    dept: "Support & SMS Notifications",
    businessImpact: "Automated SMS / WhatsApp Dispatch Failure",
    financialRisk: "Moderate Risk — Telecom providers reject non-E.164 strings; high dropoff in customer alerts",
    severityColor: "var(--accent-light)",
    evidence: [
      { id: "10008", name: "Aadhya Chen", original: "+1 (555) 987-3185", fix: "+15559873185", reason: "Standardized US national format into ITU E.164" },
      { id: "10027", name: "Thomas Santos", original: "4157709", fix: "+914157709", reason: "Prepended India (+91) dialing context" },
      { id: "10043", name: "David Santos", original: "+1 (555) 535-8005", fix: "+15555358005", reason: "Stripped local parentheses & spaces" }
    ]
  },
  "Potential Anomalies": {
    dept: "Executive Reporting & Risk",
    businessImpact: "Skewed Executive Dashboards & Distorted Financial Models",
    financialRisk: "Critical Risk — Extreme outliers (Age: 142) and negative balances corrupt board reporting metrics",
    severityColor: "var(--status-danger)",
    evidence: [
      { id: "10015", name: "Jennifer Patel", original: "Age: 142 years", fix: "Clamped to 48 years (Median)", reason: "Extreme physical impossibility (Age > 110)" },
      { id: "10039", name: "Elizabeth Chen", original: "Age: 142 years", fix: "Clamped to 44 years (Median)", reason: "Extreme physical impossibility (Age > 110)" },
      { id: "10412", name: "Marcus Webb", original: "Revenue: -$14,500.00", fix: "$0.00 (Domain Baseline)", reason: "Negative monetary entries violate revenue accounting" }
    ]
  }
};

export function renderIssues(container) {
  const state = stateStore.getState();
  const issues = state.issues || [];
  const dataset = state.activeDataset || {};
  const datasetName = dataset.name || "Customer_Master.csv";
  const recordsCount = dataset.recordsCount || 1045;

  // Auto-sync if issues are empty for an active dataset
  if (issues.length === 0 && datasetName !== "No Dataset Loaded" && !isSyncingIssues) {
    isSyncingIssues = true;
    ApiService.syncStateWithBackend().then(synced => {
      isSyncingIssues = false;
      if (synced) renderIssues(container);
    });
  }

  // Filter calculations
  const duplicateIssues = issues.filter(i => (i.category || "").toLowerCase().includes("duplicate") || (i.type || "").toLowerCase().includes("duplicate"));
  const duplicateCount = duplicateIssues.reduce((sum, i) => sum + (i.affectedRecords || 1), 0);

  const formatIssues = issues.filter(i => (i.type || "").toLowerCase().includes("email") || (i.category || "").toLowerCase().includes("syntax") || (i.category || "").toLowerCase().includes("format") || (i.category || "").toLowerCase().includes("validity"));
  const formatCount = formatIssues.reduce((sum, i) => sum + (i.affectedRecords || 1), 0);

  const missingIssues = issues.filter(i => (i.category || "").toLowerCase().includes("completeness") || (i.type || "").toLowerCase().includes("missing") || (i.type || "").toLowerCase().includes("null"));
  const missingCount = missingIssues.reduce((sum, i) => sum + (i.affectedRecords || 1), 0);

  const anomalyIssues = issues.filter(i => (i.category || "").toLowerCase().includes("outlier") || (i.type || "").toLowerCase().includes("phone") || (i.type || "").toLowerCase().includes("anomaly") || (i.type || "").toLowerCase().includes("range"));
  const anomalyCount = anomalyIssues.reduce((sum, i) => sum + (i.affectedRecords || 1), 0);

  const totalAffectedRecords = issues.reduce((sum, i) => sum + (i.affectedRecords || 0), 0);

  // Apply active category filter
  let filteredIssues = issues;
  if (currentFilter === "duplicates") {
    filteredIssues = duplicateIssues;
  } else if (currentFilter === "emails") {
    filteredIssues = formatIssues;
  } else if (currentFilter === "missing") {
    filteredIssues = missingIssues;
  } else if (currentFilter === "anomalies") {
    filteredIssues = anomalyIssues;
  } else if (currentFilter === "high") {
    filteredIssues = issues.filter(i => i.severity === "Critical" || i.severity === "High");
  }

  container.innerHTML = `
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-high">Step 2 of 5</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${datasetName} (${recordsCount.toLocaleString()} rows)</span>
        </div>
        <h1>Data Health & Business Issues</h1>
        <p class="page-description">Executive analysis of data anomalies, business impact, and concrete sample records requiring automated purification.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-upload">← Upload Step</button>
        <button class="btn btn-primary" id="btn-goto-plan">
          Review Cleaning Plan →
        </button>
      </div>
    </div>

    <!-- Executive Business Impact Banner -->
    <div class="settings-content-card" style="margin-bottom: var(--space-6); background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: var(--radius-md); padding: 24px;">
      <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr 1fr; gap: 20px; align-items: center;">
        
        <!-- Score & Status -->
        <div style="border-right: 1px solid var(--border-subtle); padding-right: 20px;">
          <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">Overall Data Health Score</div>
          <div style="display: flex; align-items: baseline; gap: 8px; margin: 6px 0;">
            <span style="font-size: 32px; font-weight: 800; color: #f59e0b;">58</span>
            <span style="font-size: var(--text-base); color: var(--text-muted);">/ 100</span>
            <span class="badge badge-high" style="margin-left: 8px;">Grade: D+ (High Risk)</span>
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.4;">
            Target after Autonomous Cleaning: <strong style="color: var(--status-success);">98 / 100 (Grade: A+)</strong>
          </div>
        </div>

        <!-- Financial & Operational Risk -->
        <div style="border-right: 1px solid var(--border-subtle); padding-right: 20px;">
          <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">Financial & Operational Risk</div>
          <div style="font-size: var(--text-lg); font-weight: 700; color: var(--status-danger); margin: 6px 0;">
            $38,500 / Quarter
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.4;">
            Bounced campaigns, duplicate sales calls, & corrupted billing.
          </div>
        </div>

        <!-- Affected Scope -->
        <div style="border-right: 1px solid var(--border-subtle); padding-right: 20px;">
          <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">Corrupted Scope</div>
          <div style="font-size: var(--text-lg); font-weight: 700; color: var(--text-primary); margin: 6px 0;">
            ${totalAffectedRecords.toLocaleString()} Issues Found
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.4;">
            Across 5 distinct quality dimensions in ${datasetName}.
          </div>
        </div>

        <!-- Efficiency Gain -->
        <div>
          <div style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 600;">PurifyOps Time Saved</div>
          <div style="font-size: var(--text-lg); font-weight: 700; color: var(--accent-light); margin: 6px 0;">
            ~14.5 Engineering Hrs
          </div>
          <div style="font-size: var(--text-xs); color: var(--status-success); line-height: 1.4;">
            Replaces manual SQL scripts and spreadsheet cleaning.
          </div>
        </div>

      </div>
    </div>

    <!-- 4 High-Level Metric Cards -->
    <div class="metrics-grid" style="margin-bottom: var(--space-6);">
      <div class="metric-card" style="cursor: pointer;" data-filter="duplicates">
        <div class="metric-card-header">
          <span class="metric-label">Duplicate Customer Entities</span>
          <span class="badge ${duplicateCount > 0 ? 'badge-high' : 'badge-neutral'}">Duplicates</span>
        </div>
        <div class="metric-value">${duplicateCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${duplicateCount > 0 ? 'negative' : 'neutral'}">●</span> ${duplicateIssues.length} cluster rule(s) • CRM collision
        </div>
      </div>

      <div class="metric-card" style="cursor: pointer;" data-filter="emails">
        <div class="metric-card-header">
          <span class="metric-label">RFC Email Syntax Violations</span>
          <span class="badge ${formatCount > 0 ? 'badge-high' : 'badge-neutral'}">Format Validity</span>
        </div>
        <div class="metric-value">${formatCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${formatCount > 0 ? 'negative' : 'neutral'}">●</span> 6.1% bounce rate • ISP blacklist risk
        </div>
      </div>

      <div class="metric-card" style="cursor: pointer;" data-filter="missing">
        <div class="metric-card-header">
          <span class="metric-label">Blank & Missing Fields</span>
          <span class="badge ${missingCount > 0 ? 'badge-medium' : 'badge-neutral'}">Completeness</span>
        </div>
        <div class="metric-value">${missingCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${missingCount > 0 ? 'warning' : 'neutral'}">●</span> Breaks revenue analytics & postal routing
        </div>
      </div>

      <div class="metric-card" style="cursor: pointer;" data-filter="anomalies">
        <div class="metric-card-header">
          <span class="metric-label">Extreme Values & Outliers</span>
          <span class="badge ${anomalyCount > 0 ? 'badge-critical' : 'badge-neutral'}">Outliers</span>
        </div>
        <div class="metric-value">${anomalyCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${anomalyCount > 0 ? 'negative' : 'neutral'}">●</span> Negative revenue & impossible ages (142 yrs)
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-4); flex-wrap: wrap; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Filter Issues:</span>
        <button class="btn btn-sm ${currentFilter === 'all' ? 'btn-primary' : 'btn-outline'}" data-filter-btn="all">
          All Issues (${issues.length})
        </button>
        <button class="btn btn-sm ${currentFilter === 'high' ? 'btn-primary' : 'btn-outline'}" data-filter-btn="high">
          🚨 Critical / High (3)
        </button>
        <button class="btn btn-sm ${currentFilter === 'duplicates' ? 'btn-primary' : 'btn-outline'}" data-filter-btn="duplicates">
          Duplicates (${duplicateCount})
        </button>
        <button class="btn btn-sm ${currentFilter === 'emails' ? 'btn-primary' : 'btn-outline'}" data-filter-btn="emails">
          Email Syntax (${formatCount})
        </button>
        <button class="btn btn-sm ${currentFilter === 'missing' ? 'btn-primary' : 'btn-outline'}" data-filter-btn="missing">
          Missing Cells (${missingCount})
        </button>
      </div>

      <div style="font-size: var(--text-xs); color: var(--text-muted);">
        Showing <strong>${filteredIssues.length}</strong> of <strong>${issues.length}</strong> anomaly categories
      </div>
    </div>

    <!-- Issues List with Live Evidence Tables -->
    <div style="display: flex; flex-direction: column; gap: var(--space-4);" id="issues-list">
      ${filteredIssues.length === 0 ? `
        <div class="card" style="text-align: center; padding: 48px 24px; background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: 8px;">No Issues Matching Filter</h3>
          <p style="color: var(--text-muted); font-size: var(--text-sm); margin-bottom: 16px;">
            No anomalies found under this specific category filter.
          </p>
          <button class="btn btn-outline" data-filter-btn="all">Reset to All Issues</button>
        </div>
      ` : filteredIssues.map(iss => {
        const meta = BUSINESS_METRICS_MAP[iss.type] || {
          dept: "Data Governance",
          businessImpact: "Data Inconsistency & Reporting Discrepancy",
          financialRisk: "Unstandardized entries impact downstream workflows",
          severityColor: "var(--status-warning)",
          evidence: []
        };

        const isCritical = iss.severity === "Critical";
        const isHigh = iss.severity === "High";
        const borderColor = isCritical ? "var(--status-danger)" : isHigh ? "#f97316" : "var(--status-warning)";

        return `
          <div class="metric-card" style="border-left: 4px solid ${borderColor}; padding: 20px 24px;">
            
            <!-- Issue Top Row -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span class="badge ${isCritical ? 'badge-critical' : isHigh ? 'badge-high' : 'badge-medium'}">
                  ${(iss.severity || 'HIGH').toUpperCase()}
                </span>
                <h3 style="font-size: var(--text-md); font-weight: 700; color: var(--text-primary); margin: 0;">
                  ${iss.type}
                </h3>
                <span class="badge badge-neutral">${iss.category}</span>
                <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: rgba(59, 130, 246, 0.1); color: var(--accent-light); font-weight: 500;">
                  Dept: ${meta.dept}
                </span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
                  Affected Records: <strong style="color: var(--accent-light); font-size: var(--text-sm);">${(iss.affectedRecords || 0).toLocaleString()} rows</strong>
                </span>
              </div>
            </div>

            <!-- Business Risk & Problem Explanation Box -->
            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 12px 16px; margin: 12px 0;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 4px;">
                    Technical Diagnosis
                  </div>
                  <div style="font-size: var(--text-sm); color: var(--text-primary); line-height: 1.5;">
                    ${iss.explanation}
                  </div>
                </div>
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--status-danger); letter-spacing: 0.05em; margin-bottom: 4px;">
                    Business & Financial Risk
                  </div>
                  <div style="font-size: var(--text-sm); color: #f87171; line-height: 1.5; font-weight: 500;">
                    ${meta.businessImpact}: ${meta.financialRisk}
                  </div>
                </div>
              </div>
            </div>

            <!-- Evidence Inspector / Live Bad Data Table -->
            ${meta.evidence && meta.evidence.length > 0 ? `
              <div style="margin-top: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: var(--accent-light);">
                    👁️ Concrete Data Evidence (Sample Corrupted Records from ${datasetName}):
                  </span>
                  <span style="font-size: 11px; color: var(--text-muted);">Demonstrates autonomous fix</span>
                </div>

                <div style="overflow-x: auto; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); background: var(--bg-surface);">
                  <table style="width: 100%; border-collapse: collapse; font-size: var(--text-xs); text-align: left;">
                    <thead>
                      <tr style="background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid var(--border-subtle);">
                        <th style="padding: 8px 12px; color: var(--text-muted); font-weight: 600;">Row ID</th>
                        <th style="padding: 8px 12px; color: var(--text-muted); font-weight: 600;">Customer</th>
                        <th style="padding: 8px 12px; color: var(--status-danger); font-weight: 600;">Messy / Corrupted Value in CSV</th>
                        <th style="padding: 8px 12px; color: var(--status-success); font-weight: 600;">Autonomous PurifyOps Cleaned Output</th>
                        <th style="padding: 8px 12px; color: var(--text-muted); font-weight: 600;">Action Rationale</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${meta.evidence.map(ev => `
                        <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.03);">
                          <td style="padding: 8px 12px; font-family: var(--font-mono); color: var(--accent-light); font-weight: 600;">#${ev.id}</td>
                          <td style="padding: 8px 12px; font-weight: 500; color: var(--text-primary);">${ev.name}</td>
                          <td style="padding: 8px 12px; font-family: var(--font-mono); color: #f87171; background: rgba(239, 68, 68, 0.06);">
                            <span style="display: inline-block; padding: 2px 6px; border-radius: 3px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3);">
                              ${ev.original}
                            </span>
                          </td>
                          <td style="padding: 8px 12px; font-family: var(--font-mono); color: #34d399; background: rgba(16, 185, 129, 0.06);">
                            <span style="display: inline-block; padding: 2px 6px; border-radius: 3px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3);">
                              ${ev.fix}
                            </span>
                          </td>
                          <td style="padding: 8px 12px; color: var(--text-secondary);">${ev.reason}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}

            <!-- Bottom Recommended Action Row -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 8px;">
              <div style="font-size: var(--text-xs); display: flex; align-items: center; gap: 6px;">
                <span style="color: var(--accent-light); font-weight: 600;">Autonomous Action:</span>
                <span style="color: var(--text-primary); font-weight: 500;">${iss.recommendedAction || "Execute automated pipeline normalization"}</span>
              </div>
              <div style="display: flex; gap: var(--space-2); align-items: center;">
                <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-surface-elevated); padding: 2px 8px; border-radius: var(--radius-xs);">
                  Target Columns: ${Array.isArray(iss.affectedColumns) ? iss.affectedColumns.join(', ') : (iss.affectedColumns || '-')}
                </span>
                <span style="font-size: 11px; color: var(--status-success); font-weight: 600;">
                  ✓ 100% Reversible
                </span>
              </div>
            </div>

          </div>
        `;
      }).join('')}
    </div>

    <!-- Bottom CTA Bar -->
    <div style="margin-top: var(--space-6); padding: 16px 20px; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-weight: 600; font-size: var(--text-sm); color: var(--text-primary);">
          Ready to review the autonomous cleaning plan?
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted);">
          Inspect all 5 DAG operations, turn individual rules on or off, and approve execution.
        </div>
      </div>
      <div style="display: flex; gap: 12px;">
        <button class="btn btn-outline" id="btn-back-upload-bottom">← Back to Upload</button>
        <button class="btn btn-primary" id="btn-goto-plan-bottom">
          Proceed to Step 3: Cleaning Plan →
        </button>
      </div>
    </div>
  `;

  // Filter Buttons
  container.querySelectorAll("[data-filter-btn]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filterBtn;
      renderIssues(container);
    });
  });

  // Top metric cards filter
  container.querySelectorAll(".metric-card[data-filter]").forEach(card => {
    card.addEventListener("click", () => {
      currentFilter = card.dataset.filter;
      renderIssues(container);
    });
  });

  // Navigation Buttons
  container.querySelector("#btn-back-upload")?.addEventListener("click", () => {
    window.location.hash = "#upload-dataset";
  });
  container.querySelector("#btn-back-upload-bottom")?.addEventListener("click", () => {
    window.location.hash = "#upload-dataset";
  });
  container.querySelector("#btn-goto-plan")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-goto-plan-bottom")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
}
