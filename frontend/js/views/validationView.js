/**
 * View 11: Validation (Test-Driven Cleaning Engine)
 * Clean 2-Color Design (Obsidian Slate + Violet Accent, Zero Noisy Badges)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderValidation(container) {
  const state = stateStore.getState();
  const suite = state.validationSuite || { rules: [] };
  const rules = suite.rules || [];
  const dataset = state.activeDataset || {};
  const totalRecords = dataset.recordsCount || 0;

  const passedCount = rules.filter(r => r.status === "PASS").length;
  const warningCount = rules.filter(r => r.status === "WARNING").length;
  const failedCount = rules.filter(r => r.status === "FAIL").length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;">Pre-Flight Certification •</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${suite.suiteId || 'VAL-INIT'}</span>
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
        </div>
        <div class="metric-value" style="color: var(--text-primary);">${passedCount}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${rules.length > 0 ? Math.round((passedCount / rules.length) * 100) : 0}% assertions green
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Warnings</span>
        </div>
        <div class="metric-value" style="color: var(--text-primary);">${warningCount}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${warningCount} non-fatal advisory warnings
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Failed Tests</span>
        </div>
        <div class="metric-value" style="color: var(--text-primary);">${failedCount}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${failedCount} blocking defects
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Execution Readiness</span>
        </div>
        <div class="metric-value" style="font-size: var(--text-lg); color: var(--accent-light); margin-top: 4px;">
          ${rules.length > 0 && failedCount === 0 ? 'CLEARED FOR RUN' : 'AWAITING TESTS'}
        </div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> Sandboxed container ready
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
          Evaluated against ${totalRecords.toLocaleString()} records
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
            <th>Assertion Logic</th>
          </tr>
        </thead>
        <tbody>
          ${rules.length === 0 ? `
            <tr>
              <td colspan="6" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
                No validation test rules run yet. Click "Re-Run Test Suite" to execute constraint verification.
              </td>
            </tr>
          ` : rules.map(rule => `
            <tr>
              <td>
                <span style="font-size: 11px; font-weight: 600; color: var(--accent-light);">
                  ${rule.status}
                </span>
              </td>
              <td>
                <div style="font-weight: 600; color: var(--text-primary);">${rule.name}</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">${rule.description}</div>
              </td>
              <td><span style="font-size: var(--text-xs); color: var(--text-muted);">${rule.category}</span></td>
              <td style="font-family: var(--font-mono);">${(rule.recordsEvaluated || totalRecords).toLocaleString()}</td>
              <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted);">${rule.executionTime || '< 10ms'}</td>
              <td>
                <code style="font-family: var(--font-mono); font-size: 11px; background: var(--bg-primary); padding: 3px 8px; border-radius: var(--radius-xs); border: 1px solid var(--border-subtle); color: var(--accent-light);">
                  ${rule.codeSnippet || '# assertion logic'}
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
  container.querySelector("#btn-re-run-validation")?.addEventListener("click", async () => {
    const activeProjId = state.projects[0]?.id || "proj-001";
    const res = await ApiService.runValidationSuite(activeProjId);
    if (res) {
      stateStore.state.validationSuite = res;
      stateStore.saveState();
      renderValidation(container);
    }
  });
}
