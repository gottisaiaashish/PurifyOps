/**
 * View 6: Data Profile (Column-Level Profiling)
 * Zero mock data - Dynamic column telemetry
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
        <h1>Column-Level Semantic Profile</h1>
        <p class="page-description">Detailed distribution statistics, nullability, uniqueness, inferred semantic constraints, and anomaly counts.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-overview">← Dataset Overview</button>
        <button class="btn btn-primary" id="btn-goto-issues">View Detected Issues (${issueCount.toLocaleString()}) →</button>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-toolbar">
        <div class="table-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="column-search-input" placeholder="Search columns by name or type..." />
        </div>
        <div class="table-filters">
          <select class="filter-select" id="column-role-filter">
            <option value="all">All Roles</option>
            <option value="ID">Primary Key / ID</option>
            <option value="Contact">Contact / Identifiers</option>
            <option value="Demographic">Demographics</option>
            <option value="Metric">Metrics & Revenue</option>
          </select>
          <select class="filter-select" id="column-status-filter">
            <option value="all">All Health States</option>
            <option value="danger">High Risk / Anomalies</option>
            <option value="warning">Warnings</option>
            <option value="good">Clean</option>
          </select>
        </div>
      </div>

      <table class="enterprise-table" id="columns-table">
        <thead>
          <tr>
            <th>Column Name</th>
            <th>Inferred Type</th>
            <th>Semantic Role</th>
            <th>Missing %</th>
            <th>Unique %</th>
            <th>Validity %</th>
            <th>Inferred Constraints</th>
            <th>Anomalies</th>
            <th>Health</th>
          </tr>
        </thead>
        <tbody>
          ${columns.length === 0 ? `
            <tr>
              <td colspan="9" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
                No column profile data available. Upload a dataset to automatically compute semantic profiles.
              </td>
            </tr>
          ` : columns.map(col => `
            <tr data-name="${(col.name || '').toLowerCase()}" data-role="${(col.semanticRole || '').toLowerCase()}" data-status="${col.status}">
              <td>
                <div style="font-weight: 600; font-family: var(--font-mono); color: var(--text-primary); font-size: var(--text-sm);">
                  ${col.name}
                </div>
                <div style="font-size: 11px; color: var(--text-muted);">${col.statusNote || ''}</div>
              </td>
              <td><span class="badge badge-neutral">${col.type || 'text'}</span></td>
              <td style="color: var(--text-secondary); font-size: var(--text-xs);">${col.semanticRole || 'Attribute'}</td>
              <td style="font-family: var(--font-mono); color: ${(col.missingPct || 0) > 3 ? 'var(--status-warning)' : 'var(--text-primary)'};">
                ${(col.missingPct || 0).toFixed(1)}%
              </td>
              <td style="font-family: var(--font-mono);">${(col.uniquePct || 0).toFixed(1)}%</td>
              <td style="font-family: var(--font-mono); color: ${(col.validityPct || 100) < 90 ? 'var(--status-danger)' : (col.validityPct || 100) < 95 ? 'var(--status-warning)' : 'var(--status-success)'};">
                ${(col.validityPct || 100).toFixed(1)}%
              </td>
              <td>
                <span style="font-size: 11px; font-family: var(--font-mono); color: var(--accent-light); background: rgba(56, 189, 248, 0.08); padding: 2px 6px; border-radius: var(--radius-xs);">
                  ${col.inferredConstraint || 'None'}
                </span>
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

    <!-- Quick Profiling Callout -->
    <div style="margin-top: var(--space-6); background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-4); display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: var(--space-3);">
        <div style="font-size: 24px;">🤖</div>
        <div>
          <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">
            Semantic Profiling Engine
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-secondary);">
            ${columns.length > 0 
              ? `Profiled ${columns.length} columns and identified ${issueCount} actionable quality issues.`
              : `Ready to profile columns as soon as a dataset is ingested.`}
          </div>
        </div>
      </div>
      <button class="btn btn-primary" id="btn-goto-issues-bottom">Inspect Issues (${issueCount.toLocaleString()}) →</button>
    </div>
  `;

  // Attach search and filter
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
