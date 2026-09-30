/**
 * View 11: Validation (Test-Driven Cleaning Engine)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderValidation(container) {
  const suite = stateStore.getState().validationSuite;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-success">Pre-Flight Certification</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${suite.suiteId}</span>
        </div>
        <h1>Automated Test-Driven Validation</h1>
        <p class="page-description">Automated unit and integration test assertions verifying relational, schema, and mathematical boundary constraints.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-review">← Review & Approval</button>
        <button class="btn btn-secondary" id="btn-re-run-validation">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Re-Run Test Suite
        </button>
        <button class="btn btn-primary" id="btn-goto-execution">
          Execute Cleaning Pipeline →
        </button>
      </div>
    </div>

    <!-- Validation Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Passed Tests</span>
          <span class="badge badge-success">PASSED</span>
        </div>
        <div class="metric-value" style="color: var(--status-success);">${suite.passedCount}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">100%</span> critical assertions green
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Warnings</span>
          <span class="badge badge-medium">Review</span>
        </div>
        <div class="metric-value" style="color: var(--status-warning);">${suite.warningCount}</div>
        <div class="metric-meta">
          <span class="metric-indicator warning">Non-fatal</span> foreign key mismatch
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Failed Tests</span>
          <span class="badge badge-neutral">BLOCKED</span>
        </div>
        <div class="metric-value">${suite.failedCount}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">0</span> blocking defects
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Execution Readiness</span>
          <span class="badge badge-success">CERTIFIED</span>
        </div>
        <div class="metric-value" style="font-size: var(--text-lg); color: var(--status-success); margin-top: 4px;">
          CLEARED FOR RUN
        </div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Safe</span> Sandboxed container ready
        </div>
      </div>
    </div>

    <!-- Test Rules Table -->
    <div class="table-wrapper">
      <div class="table-toolbar">
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">
          Automated Assertion Matrix
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
          Evaluated against 12,450 records in 80ms
        </div>
      </div>

      <table class="enterprise-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Test Assertion</th>
            <th>Category</th>
            <th>Records Evaluated</th>
            <th>Execution Time</th>
            <th>Assertion Logic (Polars / Python)</th>
          </tr>
        </thead>
        <tbody>
          ${suite.rules.map(rule => `
            <tr>
              <td>
                <span class="badge ${rule.status === 'PASS' ? 'badge-success' : rule.status === 'WARNING' ? 'badge-medium' : 'badge-high'}">
                  ${rule.status}
                </span>
              </td>
              <td>
                <div style="font-weight: 600; color: var(--text-primary);">${rule.name}</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">${rule.description}</div>
              </td>
              <td><span class="badge badge-neutral">${rule.category}</span></td>
              <td style="font-family: var(--font-mono);">${rule.recordsEvaluated.toLocaleString()}</td>
              <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted);">${rule.executionTime}</td>
              <td>
                <code style="font-family: var(--font-mono); font-size: 11px; background: var(--bg-primary); padding: 3px 8px; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); color: var(--accent-light);">
                  ${rule.codeSnippet}
                </code>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-6);">
      <button class="btn btn-outline" id="btn-back-review-bottom">← Back to Review & Approval</button>
      <button class="btn btn-primary" id="btn-goto-execution-bottom">
        Launch Sandboxed Worker Execution →
      </button>
    </div>
  `;

  // Attach handlers
  container.querySelector("#btn-re-run-validation")?.addEventListener("click", () => {
    const btn = container.querySelector("#btn-re-run-validation");
    btn.textContent = "Executing Test Suite...";
    setTimeout(() => {
      ApiService.runValidationSuite();
      renderValidation(container);
    }, 300);
  });

  container.querySelector("#btn-back-review")?.addEventListener("click", () => {
    window.location.hash = "#review-approval";
  });
  container.querySelector("#btn-back-review-bottom")?.addEventListener("click", () => {
    window.location.hash = "#review-approval";
  });
  container.querySelector("#btn-goto-execution")?.addEventListener("click", () => {
    window.location.hash = "#execution";
  });
  container.querySelector("#btn-goto-execution-bottom")?.addEventListener("click", () => {
    window.location.hash = "#execution";
  });
}
