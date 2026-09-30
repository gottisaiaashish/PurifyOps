/**
 * View 13: Results (Before vs After Quality Certification)
 */
import { stateStore } from "../services/stateManager.js";

export function renderResults(container) {
  const res = stateStore.getState().resultsComparison;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-success">CERTIFIED CLEAN</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">Customer_Master.csv</span>
        </div>
        <h1>Pipeline Transformation Results</h1>
        <p class="page-description">Before vs After benchmark verification across completeness, consistency, validity, and uniqueness.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-export-clean-data">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Clean Dataset (.csv)
        </button>
        <button class="btn btn-outline" id="btn-export-pipeline-code">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Export Polars Script (.py)
        </button>
        <button class="btn btn-primary" id="btn-goto-audit">
          Audit History & Rollback →
        </button>
      </div>
    </div>

    <!-- Delta Summary Cards -->
    <div class="metrics-grid">
      <div class="metric-card" style="border-color: var(--status-success-border);">
        <div class="metric-card-header">
          <span class="metric-label">Quality Score</span>
          <span class="badge badge-success">${res.scoreDelta} PTS</span>
        </div>
        <div class="metric-value" style="display: flex; align-items: baseline; gap: 8px;">
          <span style="color: var(--text-muted); font-size: var(--text-lg); text-decoration: line-through;">${res.beforeQualityScore}</span>
          <span style="color: var(--status-success); font-size: var(--text-3xl);">${res.afterQualityScore}</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">/ 100</span>
        </div>
        <div class="metric-meta">
          <span class="metric-indicator positive">↑ 52.4%</span> quality improvement
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Issues Resolved</span>
          <span class="badge badge-success">92.7% REDUCTION</span>
        </div>
        <div class="metric-value" style="display: flex; align-items: baseline; gap: 8px;">
          <span style="color: var(--text-muted); font-size: var(--text-lg); text-decoration: line-through;">${res.beforeIssuesCount.toLocaleString()}</span>
          <span style="color: var(--accent-light); font-size: var(--text-3xl);">${res.afterIssuesCount}</span>
        </div>
        <div class="metric-meta">
          <span class="metric-indicator positive">2,328 defects</span> sanitized
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Records Processed</span>
          <span class="badge badge-neutral">Volume</span>
        </div>
        <div class="metric-value">${res.recordsProcessed.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">0 records lost</span> during execution
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Test-Driven Suite</span>
          <span class="badge badge-success">ALL PASSED</span>
        </div>
        <div class="metric-value" style="color: var(--status-success);">${res.criticalTestsPassed}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Certified</span> enterprise ready
        </div>
      </div>
    </div>

    <!-- Before vs After Dimension Progression -->
    <div class="comparison-hero">
      <div class="comparison-card">
        <div class="comparison-header">
          <h3>Raw Ingestion Baseline</h3>
          <span class="badge badge-medium">SCORE: 61/100</span>
        </div>
        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Completeness</span>
            <span class="dimension-value">71%</span>
          </div>
          <div class="progress-track"><div class="progress-fill warning" style="width: 71%;"></div></div>
        </div>
        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Consistency</span>
            <span class="dimension-value">58%</span>
          </div>
          <div class="progress-track"><div class="progress-fill danger" style="width: 58%;"></div></div>
        </div>
        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Validity</span>
            <span class="dimension-value">74%</span>
          </div>
          <div class="progress-track"><div class="progress-fill warning" style="width: 74%;"></div></div>
        </div>
        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Uniqueness</span>
            <span class="dimension-value">61%</span>
          </div>
          <div class="progress-track"><div class="progress-fill danger" style="width: 61%;"></div></div>
        </div>
      </div>

      <div class="comparison-card" style="border-color: var(--status-success-border);">
        <div class="comparison-header">
          <h3 style="color: var(--status-success);">Cleaned & Standardized Output</h3>
          <span class="badge badge-success">SCORE: 93/100</span>
        </div>
        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Completeness</span>
            <span class="dimension-value" style="color: var(--status-success);">96% (+25%)</span>
          </div>
          <div class="progress-track"><div class="progress-fill success" style="width: 96%;"></div></div>
        </div>
        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Consistency</span>
            <span class="dimension-value" style="color: var(--status-success);">94% (+36%)</span>
          </div>
          <div class="progress-track"><div class="progress-fill success" style="width: 94%;"></div></div>
        </div>
        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Validity</span>
            <span class="dimension-value" style="color: var(--status-success);">98% (+24%)</span>
          </div>
          <div class="progress-track"><div class="progress-fill success" style="width: 98%;"></div></div>
        </div>
        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Uniqueness</span>
            <span class="dimension-value" style="color: var(--status-success);">99% (+38%)</span>
          </div>
          <div class="progress-track"><div class="progress-fill success" style="width: 99%;"></div></div>
        </div>
      </div>
    </div>

    <!-- Sample Cleaned Records Table -->
    <div class="table-wrapper">
      <div class="table-toolbar">
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">
          Cleaned Golden Records Preview (Resolved Entities)
        </div>
        <span class="badge badge-success">Verification Complete</span>
      </div>

      <table class="enterprise-table">
        <thead>
          <tr>
            <th>Canonical Customer ID</th>
            <th>Standardized Name</th>
            <th>Sanitized Email</th>
            <th>E.164 Phone</th>
            <th>Bounded Age</th>
            <th>Imputed Revenue</th>
            <th>Resolution Status</th>
          </tr>
        </thead>
        <tbody>
          ${res.sampleCleanedRows.map(row => `
            <tr>
              <td>
                <span style="font-family: var(--font-mono); font-weight: 600; color: var(--accent-light);">${row.id}</span>
              </td>
              <td style="font-weight: 500;">${row.name}</td>
              <td style="font-family: var(--font-mono); font-size: var(--text-xs);">${row.email}</td>
              <td style="font-family: var(--font-mono); font-size: var(--text-xs);">${row.phone}</td>
              <td style="font-family: var(--font-mono);">${row.age}</td>
              <td style="font-family: var(--font-mono);">${row.revenue}</td>
              <td>
                <span class="badge badge-success">${row.status}</span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-6);">
      <button class="btn btn-outline" id="btn-back-exec">← Back to Execution</button>
      <button class="btn btn-primary" id="btn-goto-audit-bottom">
        Inspect Immutable Audit Ledger & Reversibility →
      </button>
    </div>
  `;

  // Attach Handlers
  container.querySelector("#btn-export-clean-data")?.addEventListener("click", () => {
    alert("Export initiated: Customer_Master_CLEANED_2026.csv (4.6 MB) downloaded.");
  });

  container.querySelector("#btn-export-pipeline-code")?.addEventListener("click", () => {
    alert("Export initiated: pipeline_cleaner_polars.py (Self-contained runnable script) downloaded.");
  });

  container.querySelector("#btn-back-exec")?.addEventListener("click", () => {
    window.location.hash = "#execution";
  });
  container.querySelector("#btn-goto-audit")?.addEventListener("click", () => {
    window.location.hash = "#audit-history";
  });
  container.querySelector("#btn-goto-audit-bottom")?.addEventListener("click", () => {
    window.location.hash = "#audit-history";
  });
}
