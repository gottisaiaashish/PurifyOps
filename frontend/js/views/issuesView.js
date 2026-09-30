/**
 * View 7: Issues Detected
 * Dynamic rendering from active dataset profiling - Zero mock data
 */
import { stateStore } from "../services/stateManager.js";

export function renderIssues(container) {
  const state = stateStore.getState();
  const issues = state.issues || [];
  const datasetName = state.activeDataset && state.activeDataset.name ? state.activeDataset.name : "No Dataset Loaded";

  const duplicateIssues = issues.filter(i => (i.category || "").toLowerCase().includes("duplicate") || (i.type || "").toLowerCase().includes("duplicate"));
  const duplicateCount = duplicateIssues.reduce((sum, i) => sum + (i.affectedRecords || 1), 0);

  const formatIssues = issues.filter(i => (i.type || "").toLowerCase().includes("email") || (i.category || "").toLowerCase().includes("syntax") || (i.category || "").toLowerCase().includes("format") || (i.category || "").toLowerCase().includes("validity"));
  const formatCount = formatIssues.reduce((sum, i) => sum + (i.affectedRecords || 1), 0);

  const missingIssues = issues.filter(i => (i.category || "").toLowerCase().includes("completeness") || (i.type || "").toLowerCase().includes("missing") || (i.type || "").toLowerCase().includes("null"));
  const missingCount = missingIssues.reduce((sum, i) => sum + (i.affectedRecords || 1), 0);

  const anomalyIssues = issues.filter(i => (i.category || "").toLowerCase().includes("outlier") || (i.type || "").toLowerCase().includes("phone") || (i.type || "").toLowerCase().includes("anomaly") || (i.type || "").toLowerCase().includes("range"));
  const anomalyCount = anomalyIssues.reduce((sum, i) => sum + (i.affectedRecords || 1), 0);

  const totalAffected = issues.reduce((sum, i) => sum + (i.affectedRecords || 0), 0);

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge ${issues.length > 0 ? 'badge-high' : 'badge-neutral'}">${issues.length.toLocaleString()} Issues Detected</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${datasetName}</span>
        </div>
        <h1>Detected Data Quality Issues</h1>
        <p class="page-description">Automated anomaly clustering, duplicate discovery, format violations, and semantic inconsistencies.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-profile">← Data Profile</button>
        <button class="btn btn-primary" id="btn-goto-plan">
          Generate Cleaning Plan →
        </button>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Possible Duplicates</span>
          <span class="badge ${duplicateCount > 0 ? 'badge-high' : 'badge-neutral'}">Entity Resolution</span>
        </div>
        <div class="metric-value">${duplicateCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${duplicateCount > 0 ? 'negative' : 'neutral'}">●</span> ${duplicateIssues.length} duplicate rule(s)
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Format / Validity</span>
          <span class="badge ${formatCount > 0 ? 'badge-high' : 'badge-neutral'}">Validation</span>
        </div>
        <div class="metric-value">${formatCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${formatCount > 0 ? 'negative' : 'neutral'}">●</span> ${formatIssues.length} format rule(s)
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Missing Values</span>
          <span class="badge ${missingCount > 0 ? 'badge-medium' : 'badge-neutral'}">Completeness</span>
        </div>
        <div class="metric-value">${missingCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${missingCount > 0 ? 'warning' : 'neutral'}">●</span> ${missingIssues.length} field(s) with nulls
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Outliers & Anomalies</span>
          <span class="badge ${anomalyCount > 0 ? 'badge-critical' : 'badge-neutral'}">Outliers</span>
        </div>
        <div class="metric-value">${anomalyCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${anomalyCount > 0 ? 'negative' : 'neutral'}">●</span> ${anomalyIssues.length} boundary anomalies
        </div>
      </div>
    </div>

    <!-- Issues Detailed List -->
    <div style="display: flex; flex-direction: column; gap: var(--space-4);" id="issues-list">
      ${issues.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-12); background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <div style="font-size: 2rem; margin-bottom: var(--space-3); color: var(--text-muted);">🛡️</div>
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-2);">No Issues Detected</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto var(--space-5); font-size: var(--text-sm);">
            ${datasetName === "No Dataset Loaded" 
              ? "No dataset has been uploaded yet. Upload your CSV or Excel file to automatically profile columns and detect quality anomalies."
              : "This dataset has zero detected quality issues or all checks passed clean!"}
          </p>
          ${datasetName === "No Dataset Loaded" ? `
            <a href="#upload-dataset" class="btn btn-primary" style="display: inline-block;">Upload Real Dataset</a>
          ` : `
            <a href="#cleaning-plan" class="btn btn-primary" style="display: inline-block;">Proceed to Cleaning Plan</a>
          `}
        </div>
      ` : issues.map(iss => `
        <div class="metric-card" style="border-left: 4px solid ${iss.severity === 'Critical' ? 'var(--status-danger)' : iss.severity === 'High' ? '#f97316' : 'var(--status-warning)'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <span class="badge ${iss.severity === 'Critical' ? 'badge-critical' : iss.severity === 'High' ? 'badge-high' : 'badge-medium'}">
                ${(iss.severity || 'INFO').toUpperCase()}
              </span>
              <h3 style="font-size: var(--text-md); font-weight: 600; color: var(--text-primary); margin: 0;">
                ${iss.type}
              </h3>
              <span class="badge badge-neutral">${iss.category}</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <span style="font-size: var(--text-xs); color: var(--text-muted);">
                Confidence: <strong style="color: var(--text-primary); font-family: var(--font-mono);">${iss.confidence || 90}%</strong>
              </span>
              <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
                Affected: <strong style="color: var(--accent-light);">${(iss.affectedRecords || 0).toLocaleString()} rows</strong>
              </span>
            </div>
          </div>

          <div style="margin: var(--space-2) 0; font-size: var(--text-sm); color: var(--text-secondary);">
            <strong style="color: var(--text-muted); font-size: var(--text-xs); text-transform: uppercase;">Reason:</strong>
            ${iss.explanation}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--border-subtle);">
            <div style="font-size: var(--text-xs); color: var(--accent-light); display: flex; align-items: center; gap: 6px;">
              <span>💡 Recommended Action:</span>
              <span style="color: var(--text-primary);">${iss.recommendedAction || "Inspect and standardize values"}</span>
            </div>
            <div style="display: flex; gap: var(--space-2);">
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-surface-elevated); padding: 2px 8px; border-radius: var(--radius-xs);">
                Columns: ${Array.isArray(iss.affectedColumns) ? iss.affectedColumns.join(', ') : (iss.affectedColumns || '-')}
              </span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="margin-top: var(--space-6); text-align: right;">
      <button class="btn btn-primary" id="btn-goto-plan-bottom">
        Proceed to AI Cleaning Plan →
      </button>
    </div>
  `;

  container.querySelector("#btn-back-profile")?.addEventListener("click", () => {
    window.location.hash = "#data-profile";
  });
  container.querySelector("#btn-goto-plan")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-goto-plan-bottom")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
}
