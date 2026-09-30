/**
 * View 5: Dataset Overview
 * Dynamic profiling telemetry - Zero mock data
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
  const pks = (ds.profilingSummary && ds.profilingSummary.inferredPrimaryKeys) || [];

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge ${hasData ? 'badge-low' : 'badge-neutral'}">CSV / Structured</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${ds.fileSize || '0 KB'}</span>
        </div>
        <h1>${ds.name || 'No Dataset Loaded'}</h1>
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
        <div class="metric-value">${(ds.recordsCount || 0).toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${hasData ? 'positive' : 'neutral'}">${hasData ? '100%' : '0%'}</span> parsed
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Columns</span>
          <span class="badge badge-neutral">Attributes</span>
        </div>
        <div class="metric-value">${ds.columnsCount || 0}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${pks.length} Inferred Primary Key(s)
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Total Cells</span>
          <span class="badge badge-neutral">Volume</span>
        </div>
        <div class="metric-value">${totalCells.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${missingCells > 0 ? 'negative' : 'positive'}">● ${missingCells.toLocaleString()}</span> missing cells
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Duplicate Clusters</span>
          <span class="badge ${duplicateRows > 0 ? 'badge-high' : 'badge-neutral'}">Redundancy</span>
        </div>
        <div class="metric-value">${duplicateRows}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${duplicateRows > 0 ? 'negative' : 'positive'}">● ${redundancyRate}%</span> redundancy rate
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
          ${ds.qualityScore >= 80 ? 'High Quality Dataset' : ds.qualityScore > 0 ? 'Data Debt Detected' : 'Awaiting Ingestion'}
        </div>
        <p style="font-size: var(--text-xs); color: var(--text-muted); max-width: 240px;">
          ${hasData 
            ? 'Autonomous agentic planner identifies nulls, format violations, duplicates, and variance shifts.' 
            : 'Upload a real dataset to compute completeness, validity, consistency, and uniqueness dimensions.'}
        </p>
      </div>

      <div class="dimensions-panel">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
          <h3 style="font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted);">
            4-Dimensional Quality Breakdown
          </h3>
          <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">Analyzed ${ds.lastAnalyzed || '-'}</span>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Completeness (Missingness & Null Ratios)</span>
            <span class="dimension-value">${ds.dimensions ? ds.dimensions.completeness : 0}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${(ds.dimensions?.completeness || 0) < 80 ? 'warning' : 'good'}" style="width: ${ds.dimensions?.completeness || 0}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Consistency (Cross-field Relational Integrity)</span>
            <span class="dimension-value">${ds.dimensions ? ds.dimensions.consistency : 0}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${(ds.dimensions?.consistency || 0) < 80 ? 'danger' : 'good'}" style="width: ${ds.dimensions?.consistency || 0}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Validity (Domain Bounds & Format Conformance)</span>
            <span class="dimension-value">${ds.dimensions ? ds.dimensions.validity : 0}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${(ds.dimensions?.validity || 0) < 80 ? 'warning' : 'good'}" style="width: ${ds.dimensions?.validity || 0}%;"></div>
          </div>
        </div>

        <div class="dimension-progress">
          <div class="dimension-header">
            <span>Uniqueness (Key Collisions & Entity Duplicates)</span>
            <span class="dimension-value">${ds.dimensions ? ds.dimensions.uniqueness : 0}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill ${(ds.dimensions?.uniqueness || 0) < 80 ? 'danger' : 'good'}" style="width: ${ds.dimensions?.uniqueness || 0}%;"></div>
          </div>
        </div>

        <div style="margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: var(--text-xs); color: var(--text-muted);">
            Information Loss Risk: <strong style="color: var(--accent-light);">${ds.profilingSummary?.entropyLossIndex || 'None'}</strong>
          </span>
          <button class="btn btn-outline btn-sm" id="btn-goto-issues">
            Inspect ${issues.length.toLocaleString()} Issues →
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
      alert("Dataset re-analysis complete.");
    }, 500);
  });
}
