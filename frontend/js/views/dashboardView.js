/**
 * View 1: Dashboard
 * Clean, user-friendly language & professional layout (Zero emojis/jargon)
 */
import { stateStore } from "../services/stateManager.js";

export function renderDashboard(container) {
  const state = stateStore.getState();
  const metrics = state.platformMetrics;
  const recentProjects = state.projects;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Data Cleaning Overview</h1>
        <p class="page-description">Overview of your active data cleaning workspaces and files.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-quick-upload">
          Upload Dataset
        </button>
        <button class="btn btn-primary" id="btn-dash-create-proj">
          + New Project
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Active Projects</span>
          <span class="badge badge-neutral">Workspaces</span>
        </div>
        <div class="metric-value">${metrics.totalProjects}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${metrics.totalProjects > 0 ? 'positive' : 'neutral'}">●</span> ${metrics.totalProjects} project(s) created
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Files Processed</span>
          <span class="badge badge-neutral">Files</span>
        </div>
        <div class="metric-value">${metrics.datasetsProcessed}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${metrics.datasetsProcessed > 0 ? 'positive' : 'neutral'}">●</span> ${metrics.datasetsProcessed} uploaded
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Issues Found</span>
          <span class="badge ${metrics.issuesDetected > 0 ? 'badge-high' : 'badge-neutral'}">Errors</span>
        </div>
        <div class="metric-value">${metrics.issuesDetected.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${metrics.issuesDetected > 0 ? 'negative' : 'positive'}">●</span> ${metrics.issuesDetected.toLocaleString()} to resolve
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Cleaned Records</span>
          <span class="badge ${metrics.transformationsExecuted > 0 ? 'badge-success' : 'badge-neutral'}">Safe</span>
        </div>
        <div class="metric-value">${metrics.transformationsExecuted.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">100%</span> undo protection
        </div>
      </div>
    </div>

    <!-- Quick Start Banner -->
    <div class="card" style="margin: 24px 0; padding: 24px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h3 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">
          Clean your data in 3 simple steps
        </h3>
        <p style="font-size: 13px; color: var(--text-muted); margin: 0; max-width: 520px;">
          1. Upload your CSV or Excel file • 2. Check errors and duplicate rows • 3. Download the clean file with one click.
        </p>
      </div>
      <button class="btn btn-primary" id="btn-banner-upload">
        Upload File Now →
      </button>
    </div>

    <!-- Recent Projects Table -->
    <div class="table-wrapper">
      <div class="table-toolbar">
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">
          Recent Projects
        </div>
        <div class="table-filters">
          <button class="btn btn-outline btn-sm" id="btn-view-all-projects">View All Projects →</button>
        </div>
      </div>
      <table class="enterprise-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Dataset</th>
            <th>Rows</th>
            <th>Quality</th>
            <th>Issues</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${recentProjects.length === 0 ? `
            <tr>
              <td colspan="8" style="text-align: center; padding: 48px 16px;">
                <div style="font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">No Projects Yet</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">Create your first data project or directly upload a file to begin cleaning.</div>
                <button class="btn btn-primary btn-sm" id="btn-empty-create-proj">+ Create First Project</button>
              </td>
            </tr>
          ` : recentProjects.map(p => `
            <tr>
              <td>
                <div style="font-weight: 600; color: var(--text-primary);">${p.name}</div>
                <div style="font-size: var(--text-xs); color: var(--text-muted);">${p.description}</div>
              </td>
              <td><span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--accent-light);">${p.datasetName}</span></td>
              <td style="font-family: var(--font-mono);">${p.recordsCount.toLocaleString()}</td>
              <td>
                <span class="badge ${p.qualityScore > 80 ? 'badge-success' : p.qualityScore > 65 ? 'badge-medium' : 'badge-high'}">
                  ${p.qualityScore} / 100
                </span>
              </td>
              <td style="font-family: var(--font-mono); color: ${p.issuesCount > 1000 ? 'var(--status-danger)' : 'var(--text-secondary)'};">
                ${p.issuesCount.toLocaleString()}
              </td>
              <td>
                <span class="badge ${p.status === 'Completed' ? 'badge-success' : p.status === 'Needs Review' ? 'badge-medium' : 'badge-neutral'}">
                  ${p.status}
                </span>
              </td>
              <td style="color: var(--text-muted); font-size: var(--text-xs);">${p.lastUpdated}</td>
              <td>
                <button class="btn btn-outline btn-sm btn-open-pipeline" data-project-id="${p.id}">
                  Open →
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Attach Event Handlers
  container.querySelector("#btn-empty-create-proj")?.addEventListener("click", () => {
    window.location.hash = "#create-project";
  });
  container.querySelector("#btn-dash-create-proj")?.addEventListener("click", () => {
    window.location.hash = "#create-project";
  });
  container.querySelector("#btn-quick-upload")?.addEventListener("click", () => {
    window.location.hash = "#upload-dataset";
  });
  container.querySelector("#btn-banner-upload")?.addEventListener("click", () => {
    window.location.hash = "#upload-dataset";
  });
  container.querySelector("#btn-view-all-projects")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });
  container.querySelectorAll(".btn-open-pipeline").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = "#issues";
    });
  });
}
