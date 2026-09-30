/**
 * View 2: Projects Directory
 */
import { stateStore } from "../services/stateManager.js";

export function renderProjects(container) {
  const projects = stateStore.getState().projects;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Projects Directory</h1>
        <p class="page-description">Manage enterprise cleaning workspaces, target schemas, and audit pipelines.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="btn-projects-new">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Project
        </button>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-toolbar">
        <div class="table-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="project-search-input" placeholder="Search projects by name or dataset..." />
        </div>
        <div class="table-filters">
          <select class="filter-select" id="project-status-filter">
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Completed">Completed</option>
          </select>
          <select class="filter-select" id="project-source-filter">
            <option value="all">All Sources</option>
            <option value="csv">CSV File</option>
            <option value="database">Database</option>
            <option value="parquet">Parquet</option>
          </select>
        </div>
      </div>

      <table class="enterprise-table" id="projects-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Source Type</th>
            <th>Dataset</th>
            <th>Records</th>
            <th>Quality Index</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${projects.map(p => `
            <tr data-status="${p.status}" data-source="${p.sourceType}">
              <td>
                <div style="font-weight: 600; color: var(--text-primary);">${p.name}</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">${p.description}</div>
              </td>
              <td>
                <span class="badge badge-neutral">${p.sourceType.toUpperCase()}</span>
              </td>
              <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--accent-light);">
                ${p.datasetName}
              </td>
              <td style="font-family: var(--font-mono);">${p.recordsCount.toLocaleString()}</td>
              <td>
                <span class="badge ${p.qualityScore > 80 ? 'badge-success' : p.qualityScore > 65 ? 'badge-medium' : 'badge-high'}">
                  ${p.qualityScore} / 100
                </span>
              </td>
              <td>
                <span class="badge ${p.status === 'Completed' ? 'badge-success' : p.status === 'Needs Review' ? 'badge-medium' : 'badge-neutral'}">
                  ${p.status}
                </span>
              </td>
              <td style="color: var(--text-muted); font-size: var(--text-xs);">${p.lastUpdated}</td>
              <td>
                <button class="btn btn-primary btn-sm btn-open-project" data-id="${p.id}">Open</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Attach Listeners
  container.querySelector("#btn-projects-new")?.addEventListener("click", () => {
    window.location.hash = "#create-project";
  });
  container.querySelectorAll(".btn-open-project").forEach(b => {
    b.addEventListener("click", () => {
      window.location.hash = "#dataset-overview";
    });
  });

  const searchInput = container.querySelector("#project-search-input");
  searchInput?.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    const rows = container.querySelectorAll("#projects-table tbody tr");
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = txt.includes(val) ? "" : "none";
    });
  });
}
