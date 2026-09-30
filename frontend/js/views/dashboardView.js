/**
 * View 1: Dashboard
 */
import { stateStore } from "../services/stateManager.js";

export function renderDashboard(container) {
  const state = stateStore.getState();
  const metrics = state.platformMetrics;
  const recentProjects = state.projects;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Enterprise Data Quality Overview</h1>
        <p class="page-description">Autonomous telemetry, semantic anomaly detection, and agentic cleaning pipelines.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-export-telemetry">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report
        </button>
        <button class="btn btn-primary" id="btn-dash-create-proj">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create Data Project
        </button>
      </div>
    </div>

    <!-- Telemetry Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Active Projects</span>
          <span class="badge badge-neutral">SaaS Enterprise</span>
        </div>
        <div class="metric-value">${metrics.totalProjects}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${metrics.totalProjects > 0 ? 'positive' : 'neutral'}">●</span> ${metrics.totalProjects} active workspace(s)
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Datasets Processed</span>
          <span class="badge badge-neutral">Ingestion</span>
        </div>
        <div class="metric-value">${metrics.datasetsProcessed}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${metrics.datasetsProcessed > 0 ? 'positive' : 'neutral'}">●</span> ${metrics.datasetsProcessed} dataset(s) ingested
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Issues Detected</span>
          <span class="badge ${metrics.issuesDetected > 0 ? 'badge-high' : 'badge-neutral'}">Attention</span>
        </div>
        <div class="metric-value">${metrics.issuesDetected.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${metrics.issuesDetected > 0 ? 'negative' : 'positive'}">● ${metrics.issuesDetected.toLocaleString()}</span> in active review
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Transformations Executed</span>
          <span class="badge ${metrics.transformationsExecuted > 0 ? 'badge-success' : 'badge-neutral'}">Reversible</span>
        </div>
        <div class="metric-value">${metrics.transformationsExecuted.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">100%</span> audit delta coverage
        </div>
      </div>
    </div>

    <!-- Data Quality Overview Hero -->
    <div class="overview-hero">
      <div class="quality-score-panel">
        <div class="score-radial-wrapper">
          <svg viewBox="0 0 100 100">
            <circle class="circle-bg" cx="50" cy="50" r="40" />
            <circle class="circle-bar" cx="50" cy="50" r="40" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * metrics.averageQualityScore) / 100}" />
          </svg>
          <div class="score-radial-text">
            <span class="score-radial-number">${Math.round(metrics.averageQualityScore)}</span>
            <span class="score-radial-label">Average Score</span>
          </div>
        </div>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); max-width: 200px;">
          Weighted composite index across completeness, consistency, validity, and uniqueness.
        </p>
      </div>

      <div class="dimensions-panel">
        <h3 style="font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-4);">
          Quality Dimensions Benchmark
        </h3>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Completeness</span>
            <span class="dimension-value">${metrics.dimensions.completeness}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill warning" style="width: ${metrics.dimensions.completeness}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Consistency</span>
            <span class="dimension-value">${metrics.dimensions.consistency}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill danger" style="width: ${metrics.dimensions.consistency}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Validity</span>
            <span class="dimension-value">${metrics.dimensions.validity}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill warning" style="width: ${metrics.dimensions.validity}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Uniqueness</span>
            <span class="dimension-value">${metrics.dimensions.uniqueness}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill danger" style="width: ${metrics.dimensions.uniqueness}%;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Projects Table -->
    <div class="table-wrapper">
      <div class="table-toolbar">
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">
          Recent Cleaning Projects
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
            <th>Records</th>
            <th>Quality Score</th>
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
                <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
                <div style="font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">Zero Datasets Ingested Yet</div>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">All dummy records cleared. Create your first real enterprise data project to begin autonomous profiling.</div>
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
                  Open Pipeline →
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

  // Attach Event Handlers
  container.querySelector("#btn-dash-create-proj")?.addEventListener("click", () => {
    window.location.hash = "#create-project";
  });
  container.querySelector("#btn-view-all-projects")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });
  container.querySelectorAll(".btn-open-pipeline").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = "#dataset-overview";
    });
  });
}
