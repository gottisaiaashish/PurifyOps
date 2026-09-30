/**
 * View 6: Data Profile (Column Analysis)
 * Clean, user-friendly language & professional layout (Zero emojis/jargon)
 */
import { stateStore } from "../services/stateManager.js";

export function renderDataProfile(container) {
  const state = stateStore.getState();
  const columns = state.columnsProfile || [];
  const issues = state.issues || [];
  const issueCount = issues.length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Column Details & Statistics</h1>
        <p class="page-description">Detailed look at each column in your dataset: detected type, missing percentages, and errors.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-overview">← Data Summary</button>
        <button class="btn btn-primary" id="btn-goto-issues">View Errors & Issues (${issueCount.toLocaleString()}) →</button>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-toolbar">
        <div class="table-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="column-search-input" placeholder="Search columns by name..." />
        </div>
        <div class="table-filters">
          <select class="filter-select" id="column-status-filter">
            <option value="all">All Columns</option>
            <option value="danger">Needs Fix (Errors)</option>
            <option value="good">Clean Columns</option>
          </select>
        </div>
      </div>

      <table class="enterprise-table" id="columns-table">
        <thead>
          <tr>
            <th>Column Name</th>
            <th>Data Type</th>
            <th>Missing %</th>
            <th>Unique %</th>
            <th>Valid %</th>
            <th>Errors Found</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${columns.length === 0 ? `
            <tr>
              <td colspan="7" style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
                No column data available. Upload your file to see column statistics.
              </td>
            </tr>
          ` : columns.map(col => `
            <tr data-name="${(col.name || '').toLowerCase()}" data-status="${col.status}">
              <td>
                <div style="font-weight: 600; font-family: var(--font-mono); color: var(--text-primary); font-size: var(--text-sm);">
                  ${col.name}
                </div>
                <div style="font-size: 11px; color: var(--text-muted);">${col.statusNote || ''}</div>
              </td>
              <td><span class="badge badge-neutral">${col.type || 'text'}</span></td>
              <td style="font-family: var(--font-mono); color: ${(col.missingPct || 0) > 3 ? 'var(--status-warning)' : 'var(--text-primary)'};">
                ${(col.missingPct || 0).toFixed(1)}%
              </td>
              <td style="font-family: var(--font-mono);">${(col.uniquePct || 0).toFixed(1)}%</td>
              <td style="font-family: var(--font-mono); color: ${(col.validityPct || 100) < 90 ? 'var(--status-danger)' : (col.validityPct || 100) < 95 ? 'var(--status-warning)' : 'var(--status-success)'};">
                ${(col.validityPct || 100).toFixed(1)}%
              </td>
              <td style="font-family: var(--font-mono); font-weight: 600; color: ${(col.potentialAnomalies || 0) > 50 ? 'var(--status-danger)' : (col.potentialAnomalies || 0) > 0 ? 'var(--status-warning)' : 'var(--status-success)'};">
                ${(col.potentialAnomalies || 0) > 0 ? col.potentialAnomalies : '0'}
              </td>
              <td>
                <span class="badge ${col.status === 'danger' ? 'badge-high' : col.status === 'warning' ? 'badge-medium' : 'badge-success'}">
                  ${(col.status || 'CLEAN').toUpperCase()}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Callout -->
    <div style="margin-top: 24px; background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">
          Column Scan Complete
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px;">
          ${columns.length > 0 
            ? `Analyzed ${columns.length} columns and detected ${issueCount} issues to fix.`
            : `Ready to analyze columns once a dataset is uploaded.`}
        </div>
      </div>
      <button class="btn btn-primary" id="btn-goto-issues-bottom">View Issues (${issueCount.toLocaleString()}) →</button>
    </div>
  `;

  // Search
  const searchInput = container.querySelector("#column-search-input");
  searchInput?.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    const rows = container.querySelectorAll("#columns-table tbody tr");
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = txt.includes(val) ? "" : "none";
    });
  });

  container.querySelector("#btn-back-overview")?.addEventListener("click", () => {
    window.location.hash = "#dataset-overview";
  });
  container.querySelector("#btn-goto-issues")?.addEventListener("click", () => {
    window.location.hash = "#issues";
  });
  container.querySelector("#btn-goto-issues-bottom")?.addEventListener("click", () => {
    window.location.hash = "#issues";
  });
}
