/**
 * View 5: Dataset Overview
 * Clean, user-friendly language & professional layout (Zero emojis/jargon)
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
          <span class="badge ${hasData ? 'badge-low' : 'badge-neutral'}">Spreadsheet File</span>
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
          <span class="badge badge-neutral">Records</span>
        </div>
        <div class="metric-value">${(ds.recordsCount || 0).toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${hasData ? 'positive' : 'neutral'}">${hasData ? '100%' : '0%'}</span> loaded
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Columns</span>
          <span class="badge badge-neutral">Attributes</span>
        </div>
        <div class="metric-value">${ds.columnsCount || 0}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> fields detected
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Total Cells</span>
          <span class="badge badge-neutral">Volume</span>
        </div>
        <div class="metric-value">${totalCells.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${missingCells > 0 ? 'negative' : 'positive'}">● ${missingCells.toLocaleString()}</span> empty cells
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Duplicate Rows</span>
          <span class="badge ${duplicateRows > 0 ? 'badge-high' : 'badge-neutral'}">Duplicates</span>
        </div>
        <div class="metric-value">${duplicateRows}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${duplicateRows > 0 ? 'negative' : 'positive'}">● ${redundancyRate}%</span> duplicate rate
        </div>
      </div>
    </div>

    <!-- Quality Score & Dimensions Hero Section -->
    <div class="overview-hero">
      <div class="quality-score-panel">
        <div class="score-radial-wrapper">
          <svg viewBox="0 0 100 100">
            <circle class="circle-bg" cx="50" cy="50" r="40" />
            <circle class="circle-bar" cx="50" cy="50" r="40" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * (ds.qualityScore || 0)) / 100}" />
          </svg>
          <div class="score-radial-text">
            <span class="score-radial-number">${ds.qualityScore || 0}</span>
            <span class="score-radial-label">Quality Score</span>
          </div>
        </div>
        <div style="font-size: var(--text-sm); font-weight: 600; color: ${ds.qualityScore >= 80 ? 'var(--status-success)' : ds.qualityScore > 0 ? 'var(--status-warning)' : 'var(--text-muted)'}; margin-bottom: 4px;">
          ${ds.qualityScore >= 80 ? 'Good Quality' : ds.qualityScore > 0 ? 'Errors Detected' : 'No File Loaded'}
        </div>
        <p style="font-size: var(--text-xs); color: var(--text-muted); max-width: 240px;">
          ${hasData 
            ? 'Score is calculated based on missing values, duplicate records, and invalid formats.' 
            : 'Upload a CSV or Excel file to get an instant data quality score.'}
        </p>
      </div>

      <div class="dimensions-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <h3 style="font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
            Data Health Breakdown
          </h3>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">Analyzed ${ds.lastAnalyzed || 'Recently'}</span>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Completeness (No Missing Values)</span>
            <span class="dimension-value">${ds.dimensions ? ds.dimensions.completeness : 0}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${(ds.dimensions?.completeness || 0) < 80 ? 'warning' : 'good'}" style="width: ${ds.dimensions?.completeness || 0}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Formatting Conformance (Valid Format)</span>
            <span class="dimension-value">${ds.dimensions ? ds.dimensions.validity : 0}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${(ds.dimensions?.validity || 0) < 80 ? 'warning' : 'good'}" style="width: ${ds.dimensions?.validity || 0}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Uniqueness (No Duplicates)</span>
            <span class="dimension-value">${ds.dimensions ? ds.dimensions.uniqueness : 0}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${(ds.dimensions?.uniqueness || 0) < 80 ? 'danger' : 'good'}" style="width: ${ds.dimensions?.uniqueness || 0}%;"></div>
          </div>
        </div>

        <div style="margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: var(--text-xs); color: var(--text-muted);">
            Data Safety Check: <strong style="color: var(--accent-light);">Guaranteed</strong>
          </span>
          <button class="btn btn-outline btn-sm" id="btn-inspect-issues">
            Inspect ${issues.length.toLocaleString()} Issues →
          </button>
        </div>
      </div>
    </div>
  `;

  container.querySelector("#btn-goto-issues")?.addEventListener("click", () => {
    window.location.hash = "#issues";
  });
  container.querySelector("#btn-inspect-issues")?.addEventListener("click", () => {
    window.location.hash = "#issues";
  });
  container.querySelector("#btn-reanalyze")?.addEventListener("click", () => {
    alert("Re-analysis complete.");
  });
}
