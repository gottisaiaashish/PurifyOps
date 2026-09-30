/**
 * View 7: Issues Detected
 */
import { stateStore } from "../services/stateManager.js";

export function renderIssues(container) {
  const issues = stateStore.getState().issues;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-high">2,512 Issues Detected</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">Customer_Master.csv</span>
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
          <span class="badge badge-high">Entity Resolution</span>
        </div>
        <div class="metric-value">842</div>
        <div class="metric-meta">
          <span class="metric-indicator negative">High Confidence</span> (94.5%)
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Invalid Emails</span>
          <span class="badge badge-high">RFC-5322</span>
        </div>
        <div class="metric-value">316</div>
        <div class="metric-meta">
          <span class="metric-indicator negative">●</span> Syntax & MX Failures
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Missing Values</span>
          <span class="badge badge-medium">Completeness</span>
        </div>
        <div class="metric-value">1,204</div>
        <div class="metric-meta">
          <span class="metric-indicator warning">●</span> Imputation candidates
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Phone & Anomalies</span>
          <span class="badge badge-critical">Outliers</span>
        </div>
        <div class="metric-value">150</div>
        <div class="metric-meta">
          <span class="metric-indicator negative">●</span> 97 phone + 53 bounds
        </div>
      </div>
    </div>

    <!-- Issues Detailed List -->
    <div style="display: flex; flex-direction: column; gap: var(--space-4);" id="issues-list">
      ${issues.map(iss => `
        <div class="metric-card" style="border-left: 4px solid ${iss.severity === 'Critical' ? 'var(--status-danger)' : iss.severity === 'High' ? '#f97316' : 'var(--status-warning)'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <span class="badge ${iss.severity === 'Critical' ? 'badge-critical' : iss.severity === 'High' ? 'badge-high' : 'badge-medium'}">
                ${iss.severity.toUpperCase()}
              </span>
              <h3 style="font-size: var(--text-md); font-weight: 600; color: var(--text-primary); margin: 0;">
                ${iss.type}
              </h3>
              <span class="badge badge-neutral">${iss.category}</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <span style="font-size: var(--text-xs); color: var(--text-muted);">
                Confidence: <strong style="color: var(--text-primary); font-family: var(--font-mono);">${iss.confidence}%</strong>
              </span>
              <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
                Affected: <strong style="color: var(--accent-light);">${iss.affectedRecords.toLocaleString()} rows</strong>
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
              <span style="color: var(--text-primary);">${iss.recommendedAction}</span>
            </div>
            <div style="display: flex; gap: var(--space-2);">
              <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted); background: var(--bg-surface-elevated); padding: 2px 8px; border-radius: var(--radius-xs);">
                Columns: ${iss.affectedColumns.join(', ')}
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
