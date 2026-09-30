/**
 * View 5: Dataset Overview
 */
import { stateStore } from "../services/stateManager.js";

export function renderDatasetOverview(container) {
  const state = stateStore.getState();
  const ds = state.activeDataset;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-low">CSV Table</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${ds.fileSize}</span>
        </div>
        <h1>${ds.name}</h1>
        <p class="page-description">Ingested telemetry and baseline quality benchmark before agentic transformation.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-reanalyze">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          Re-Analyze
        </button>
        <button class="btn btn-primary" id="btn-goto-profile">
          Data Profile →
        </button>
      </div>
    </div>

    <!-- Metadata Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Total Records</span>
          <span class="badge badge-neutral">Rows</span>
        </div>
        <div class="metric-value">${ds.recordsCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">100%</span> parsed successfully
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Columns</span>
          <span class="badge badge-neutral">Attributes</span>
        </div>
        <div class="metric-value">${ds.columnsCount}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> 1 Inferred Primary Key
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Total Cells</span>
          <span class="badge badge-neutral">Volume</span>
        </div>
        <div class="metric-value">${ds.profilingSummary.totalCells.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator negative">● ${ds.profilingSummary.missingCells.toLocaleString()}</span> missing cells
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Duplicate Clusters</span>
          <span class="badge badge-high">Action Required</span>
        </div>
        <div class="metric-value">${ds.profilingSummary.duplicateRows}</div>
        <div class="metric-meta">
          <span class="metric-indicator negative">● 6.7%</span> redundancy rate
        </div>
      </div>
    </div>

    <!-- Quality Score & Dimensions Hero Section -->
    <div class="overview-hero">
      <div class="quality-score-panel">
        <div class="score-radial-wrapper">
          <svg viewBox="0 0 100 100">
            <circle class="circle-bg" cx="50" cy="50" r="40" />
            <circle class="circle-bar" cx="50" cy="50" r="40" stroke-dasharray="251.2" stroke-dashoffset="${251.2 - (251.2 * ds.qualityScore) / 100}" />
          </svg>
          <div class="score-radial-text">
            <span class="score-radial-number">${ds.qualityScore}</span>
            <span class="score-radial-label">Quality Score</span>
          </div>
        </div>
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--status-warning); margin-bottom: 4px;">
          Moderate Data Debt Detected
        </div>
        <p style="font-size: var(--text-xs); color: var(--text-muted); max-width: 240px;">
          Dataset requires standardization, entity resolution, and missing value imputation before production consumption.
        </p>
      </div>

      <div class="dimensions-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <h3 style="font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
            4-Dimensional Quality Breakdown
          </h3>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">Analyzed ${ds.lastAnalyzed}</span>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Completeness (Missingness & Null Ratios)</span>
            <span class="dimension-value">${ds.dimensions.completeness}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill warning" style="width: ${ds.dimensions.completeness}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Consistency (Cross-field Relational Integrity)</span>
            <span class="dimension-value">${ds.dimensions.consistency}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill danger" style="width: ${ds.dimensions.consistency}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Validity (Domain Bounds & Format Conformance)</span>
            <span class="dimension-value">${ds.dimensions.validity}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill warning" style="width: ${ds.dimensions.validity}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Uniqueness (Key Collisions & Entity Duplicates)</span>
            <span class="dimension-value">${ds.dimensions.uniqueness}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill danger" style="width: ${ds.dimensions.uniqueness}%;"></div>
          </div>
        </div>

        <div style="margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: var(--text-xs); color: var(--text-muted);">
            Information Loss Risk Index: <strong style="color: var(--accent-light);">${ds.profilingSummary.entropyLossIndex}</strong>
          </span>
          <button class="btn btn-outline btn-sm" id="btn-goto-issues">
            Inspect 2,512 Issues →
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach Navigation buttons
  container.querySelector("#btn-goto-profile")?.addEventListener("click", () => {
    window.location.hash = "#data-profile";
  });
  container.querySelector("#btn-goto-issues")?.addEventListener("click", () => {
    window.location.hash = "#issues";
  });
  container.querySelector("#btn-reanalyze")?.addEventListener("click", () => {
    const btn = container.querySelector("#btn-reanalyze");
    btn.textContent = "Analyzing...";
    setTimeout(() => {
      btn.textContent = "Re-Analyze";
      alert("Dataset re-analysis complete. 0 structural changes detected.");
    }, 500);
  });
}
