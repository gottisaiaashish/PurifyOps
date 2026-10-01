/**
 * View 5: Dataset Overview
 * Clean 2-Color UI (Obsidian Slate + Violet Accent, Zero Noisy Badges)
 */
import { stateStore } from "../services/stateManager.js";

export function renderDatasetOverview(container) {
  const state = stateStore.getState();
  const ds = state.activeDataset || {};
  const issues = state.issues || [];
  const hasData = ds.recordsCount > 0 && ds.name !== "No Dataset Loaded";

  const totalCells = (ds.profilingSummary && ds.profilingSummary.totalCells) || (ds.recordsCount * ds.columnsCount) || 0;
  const missingCells = (ds.profilingSummary && ds.profilingSummary.missingCells) || 0;
  const duplicateRows = (ds.profilingSummary && ds.profilingSummary.duplicateRows) || 0;
  const redundancyRate = ds.recordsCount > 0 ? ((duplicateRows / ds.recordsCount) * 100).toFixed(1) : "0.0";

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;">Spreadsheet File •</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${ds.fileSize || '0 KB'}</span>
        </div>
        <h1>${ds.name || 'No Dataset Loaded'}</h1>
        <p class="page-description">Overview of file size, record volume, column count, and current health score.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-reanalyze">
          Re-Analyze
        </button>
        <button class="btn btn-primary" id="btn-goto-issues">
          View Errors & Issues →
        </button>
      </div>
    </div>

    <!-- Metadata Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Total Rows</span>
        </div>
        <div class="metric-value">${hasData ? (ds.recordsCount || 0).toLocaleString() : '--'}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${hasData ? '100% loaded' : 'Awaiting file'}
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Columns</span>
        </div>
        <div class="metric-value">${hasData ? (ds.columnsCount || 0) : '--'}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${hasData ? 'fields detected' : 'Awaiting file'}
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Total Cells</span>
        </div>
        <div class="metric-value">${hasData ? totalCells.toLocaleString() : '--'}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${hasData ? `${missingCells.toLocaleString()} empty cells` : 'Awaiting file'}
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Duplicate Rows</span>
        </div>
        <div class="metric-value">${hasData ? duplicateRows : '--'}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${hasData ? `${redundancyRate}% duplicate rate` : 'Awaiting file'}
        </div>
      </div>
    </div>

    <!-- Quality Score & Dimensions Hero Section -->
    <div class="overview-hero" style="display: grid; grid-template-columns: 240px 1fr; gap: 24px; margin-bottom: 24px;">
      <div class="quality-score-panel" style="padding: 24px; text-align: center; background: rgba(18, 20, 32, 0.45); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: var(--radius-md);">
        <div class="score-radial-wrapper" style="position: relative; width: 120px; height: 120px; margin: 0 auto 16px;">
          <svg viewBox="0 0 100 100" style="width: 100%; height: 100%; transform: rotate(-90deg);">
            <circle class="circle-bg" cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8" />
            <circle class="circle-bar" cx="50" cy="50" r="40" fill="none" stroke="var(--accent-light)" stroke-width="8" stroke-linecap="round" stroke-dasharray="251.2" stroke-dashoffset="${hasData ? 251.2 - (251.2 * (ds.qualityScore || 0)) / 100 : 251.2}" />
          </svg>
          <div class="score-radial-text" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <span class="score-radial-number" style="font-size: 28px; font-weight: 800; color: var(--text-primary);">${hasData ? (ds.qualityScore || 0) : '--'}</span>
            <span class="score-radial-label" style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">Health Score</span>
          </div>
        </div>
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
          ${hasData ? (ds.qualityScore >= 80 ? 'Good Quality' : 'Errors Detected') : 'Awaiting Data Upload'}
        </div>
        <p style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.4;">
          ${hasData ? 'Target after automated cleaning: <strong>98/100</strong>' : 'Upload a CSV/Excel file to start profiling health.'}
        </p>
      </div>

      <div class="dimensions-panel" style="padding: 24px; background: rgba(18, 20, 32, 0.45); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: var(--radius-md);">
        <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 16px;">
          Quality Dimensions
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); margin-bottom: 4px;">
              <span style="color: var(--text-secondary);">Completeness</span>
              <span style="color: var(--accent-light); font-weight: 600;">${hasData ? `${ds.dimensions?.completeness || 0}%` : '--'}</span>
            </div>
            <div class="progress-track" style="height: 6px;"><div class="progress-fill" style="width: ${hasData ? ds.dimensions?.completeness || 0 : 0}%;"></div></div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); margin-bottom: 4px;">
              <span style="color: var(--text-secondary);">Consistency</span>
              <span style="color: var(--accent-light); font-weight: 600;">${hasData ? `${ds.dimensions?.consistency || 0}%` : '--'}</span>
            </div>
            <div class="progress-track" style="height: 6px;"><div class="progress-fill" style="width: ${hasData ? ds.dimensions?.consistency || 0 : 0}%;"></div></div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); margin-bottom: 4px;">
              <span style="color: var(--text-secondary);">Validity</span>
              <span style="color: var(--accent-light); font-weight: 600;">${hasData ? `${ds.dimensions?.validity || 0}%` : '--'}</span>
            </div>
            <div class="progress-track" style="height: 6px;"><div class="progress-fill" style="width: ${hasData ? ds.dimensions?.validity || 0 : 0}%;"></div></div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: var(--text-xs); margin-bottom: 4px;">
              <span style="color: var(--text-secondary);">Uniqueness</span>
              <span style="color: var(--accent-light); font-weight: 600;">${hasData ? `${ds.dimensions?.uniqueness || 0}%` : '--'}</span>
            </div>
            <div class="progress-track" style="height: 6px;"><div class="progress-fill" style="width: ${hasData ? ds.dimensions?.uniqueness || 0 : 0}%;"></div></div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector("#btn-goto-issues")?.addEventListener("click", () => {
    window.location.hash = "#issues";
  });
  container.querySelector("#btn-reanalyze")?.addEventListener("click", () => {
    window.location.hash = "#upload-dataset";
  });
}
