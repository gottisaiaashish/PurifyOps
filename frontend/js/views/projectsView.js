/**
 * View 2: Projects Directory
 * Clean, user-friendly language & professional layout (Zero emojis/jargon)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderProjects(container) {
  const projects = stateStore.getState().projects;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Projects Directory</h1>
        <p class="page-description">Manage all your data cleaning projects and files in one place.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" id="btn-projects-new">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + New Project
        </button>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-toolbar">
        <div class="table-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px; color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="project-search-input" placeholder="Search projects by name..." />
        </div>
        <div class="table-filters">
          <select class="filter-select" id="project-status-filter">
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Needs Review">Needs Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <table class="enterprise-table" id="projects-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Type</th>
            <th>Dataset</th>
            <th>Rows</th>
            <th>Quality</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${projects.length === 0 ? `
            <tr>
              <td colspan="8" style="text-align: center; padding: 48px 16px;">
                <div style="font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">No Projects Yet</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Create a new project to start cleaning your data.</div>
                <button class="btn btn-primary btn-sm" id="btn-empty-new-proj">+ Create Project</button>
              </td>
            </tr>
          ` : projects.map(p => `
            <tr data-status="${p.status}">
              <td>
                <div style="font-weight: 600; color: var(--text-primary);">${p.name}</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">${p.description}</div>
              </td>
              <td>
                <span class="badge badge-neutral">${(p.sourceType || 'FILE').toUpperCase()}</span>
              </td>
              <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--accent-light);">
                ${p.datasetName}
              </td>
              <td style="font-family: var(--font-mono);">${(p.recordsCount || 0).toLocaleString()}</td>
              <td>
                <span class="badge ${p.qualityScore > 80 ? 'badge-success' : p.qualityScore > 65 ? 'badge-medium' : 'badge-high'}">
                  ${p.qualityScore || 0} / 100
                </span>
              </td>
              <td>
                <span class="badge ${p.status === 'Completed' ? 'badge-success' : p.status === 'Needs Review' ? 'badge-medium' : 'badge-neutral'}">
                  ${p.status || 'Active'}
                </span>
              </td>
              <td style="color: var(--text-muted); font-size: var(--text-xs);">${p.lastUpdated || 'Recently'}</td>
              <td>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <button class="btn btn-primary btn-sm btn-open-project" data-id="${p.id}">Open</button>
                  <button class="btn btn-danger btn-sm btn-delete-project" data-id="${p.id}" data-name="${p.name}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Filter & Search
  const searchInput = container.querySelector("#project-search-input");
  searchInput?.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    const rows = container.querySelectorAll("#projects-table tbody tr");
    rows.forEach(r => {
      const txt = r.textContent.toLowerCase();
      r.style.display = txt.includes(val) ? "" : "none";
    });
  });

  container.querySelector("#btn-projects-new")?.addEventListener("click", () => {
    window.location.hash = "#create-project";
  });
  container.querySelector("#btn-empty-new-proj")?.addEventListener("click", () => {
    window.location.hash = "#create-project";
  });

  container.querySelectorAll(".btn-open-project").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      if (id) {
        stateStore.setActiveProject(id);
        ApiService.syncStateWithBackend(id);
      }
      window.location.hash = "#issues";
    });
  });

  // Delete project handler
  container.querySelectorAll(".btn-delete-project").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      if (confirm(`Are you sure you want to permanently delete project "${name}" from the database?`)) {
        btn.disabled = true;
        btn.textContent = "Deleting...";
        await ApiService.deleteProject(id);
        renderProjects(container);
      }
    });
  });
}
