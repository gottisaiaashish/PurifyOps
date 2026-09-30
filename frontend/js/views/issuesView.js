/**
 * View 7: Issues Detected
 * User-friendly language & clean professional styling (Zero emojis/jargon)
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

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge ${issues.length > 0 ? 'badge-high' : 'badge-neutral'}">${issues.length.toLocaleString()} Issues Found</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${datasetName}</span>
        </div>
        <h1>Data Health & Issues</h1>
        <p class="page-description">Here is what needs fixing in your file: missing values, duplicate rows, and invalid formats.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-upload">← Upload Step</button>
        <button class="btn btn-primary" id="btn-goto-plan">
          Review Cleaning Plan →
        </button>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Duplicate Rows</span>
          <span class="badge ${duplicateCount > 0 ? 'badge-high' : 'badge-neutral'}">Duplicates</span>
        </div>
        <div class="metric-value">${duplicateCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${duplicateCount > 0 ? 'negative' : 'neutral'}">●</span> ${duplicateIssues.length} duplicate rule(s)
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Format Errors</span>
          <span class="badge ${formatCount > 0 ? 'badge-high' : 'badge-neutral'}">Formatting</span>
        </div>
        <div class="metric-value">${formatCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${formatCount > 0 ? 'negative' : 'neutral'}">●</span> invalid emails, dates or phones
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Missing Fields</span>
          <span class="badge ${missingCount > 0 ? 'badge-medium' : 'badge-neutral'}">Empty Cells</span>
        </div>
        <div class="metric-value">${missingCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${missingCount > 0 ? 'warning' : 'neutral'}">●</span> empty values to fill safely
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Extreme Values</span>
          <span class="badge ${anomalyCount > 0 ? 'badge-critical' : 'badge-neutral'}">Outliers</span>
        </div>
        <div class="metric-value">${anomalyCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${anomalyCount > 0 ? 'negative' : 'neutral'}">●</span> unusual numbers or negative values
        </div>
      </div>
    </div>

    <!-- Issues Detailed List -->
    <div style="display: flex; flex-direction: column; gap: var(--space-4);" id="issues-list">
      ${issues.length === 0 ? `
        <div class="card" style="text-align: center; padding: 48px 24px; background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: 8px;">No Issues Detected</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 20px; font-size: var(--text-sm);">
            ${datasetName === "No Dataset Loaded" 
              ? "No file has been uploaded yet. Upload your CSV or Excel file to check for data errors."
              : "Great news! This dataset is completely clean with zero detected errors."}
          </p>
          ${datasetName === "No Dataset Loaded" ? `
            <a href="#upload-dataset" class="btn btn-primary" style="display: inline-block;">Upload Your File</a>
          ` : `
            <a href="#cleaning-plan" class="btn btn-primary" style="display: inline-block;">Go to Cleaning Plan</a>
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
              <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
                Affected Rows: <strong style="color: var(--accent-light);">${(iss.affectedRecords || 0).toLocaleString()}</strong>
              </span>
            </div>
          </div>

          <div style="margin: var(--space-2) 0; font-size: var(--text-sm); color: var(--text-secondary);">
            <strong style="color: var(--text-muted); font-size: var(--text-xs); text-transform: uppercase;">Problem:</strong>
            ${iss.explanation}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--border-subtle);">
            <div style="font-size: var(--text-xs); color: var(--accent-light); display: flex; align-items: center; gap: 6px;">
              <span>Recommended Fix:</span>
              <span style="color: var(--text-primary);">${iss.recommendedAction || "Standardize format and clean values"}</span>
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
        Proceed to Cleaning Plan →
      </button>
    </div>
  `;

  container.querySelector("#btn-back-upload")?.addEventListener("click", () => {
    window.location.hash = "#upload-dataset";
  });
  container.querySelector("#btn-goto-plan")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-goto-plan-bottom")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
}
