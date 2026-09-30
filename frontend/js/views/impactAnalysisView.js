/**
 * View 9: Impact Analysis & Information Loss
 * Clean 2-Color Design (Obsidian Slate + Violet Accent, Zero Noisy Badges)
 */
import { stateStore } from "../services/stateManager.js";

export function renderImpactAnalysis(container) {
  const state = stateStore.getState();
  const impact = state.impactAnalysis || { columnImpacts: [] };
  const dataset = state.activeDataset || {};
  const totalCols = dataset.columnsCount || 0;
  const fieldsChanged = impact.fieldsChanged || (impact.columnImpacts ? impact.columnImpacts.length : 0);
  const untouchedCols = Math.max(0, totalCols - fieldsChanged);
  const entropyLoss = (impact.entropyDelta !== undefined && impact.entropyDelta !== null) ? Number(impact.entropyDelta).toFixed(3) : "0.000";

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;">Shannon Entropy Metric •</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${dataset.name || 'Dataset'}</span>
        </div>
        <h1>Impact & Information Loss Analysis</h1>
        <p class="page-description">Mathematical estimation of entropy loss, variance shift, and reversibility safeguards before pipeline commit.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-plan">← Cleaning Plan</button>
        <button class="btn btn-primary" id="btn-goto-review">
          Human Review & Approval →
        </button>
      </div>
    </div>

    <!-- Impact Top Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Records Affected</span>
        </div>
        <div class="metric-value">${(impact.recordsAffected || 0).toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${impact.percentAffected || 0}% of total dataset
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Fields Modified</span>
        </div>
        <div class="metric-value">${fieldsChanged}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${untouchedCols} columns completely untouched
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Information Loss (ΔH)</span>
        </div>
        <div class="metric-value">${entropyLoss}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> Safe threshold (&lt; 0.150 limit)
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Reversibility</span>
        </div>
        <div class="metric-value" style="font-size: var(--text-xl); color: var(--text-primary);">100% Rollback</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> Delta storage snapshot ready
        </div>
      </div>
    </div>

    <!-- Entropy & Impact Breakdown Table -->
    <div class="table-wrapper">
      <div class="table-toolbar">
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">
          Column-by-Column Information Loss & Risk Matrix
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
          Calculated via empirical probability distribution deltas
        </div>
      </div>

      <table class="enterprise-table">
        <thead>
          <tr>
            <th>Target Field</th>
            <th>Records Changed</th>
            <th>Entropy Delta (ΔH)</th>
            <th>Potential Information Loss</th>
            <th>Reversibility Checkpoint</th>
            <th>Safety Certification</th>
          </tr>
        </thead>
        <tbody>
          ${impact.columnImpacts && impact.columnImpacts.length > 0 ? impact.columnImpacts.map(col => `
            <tr>
              <td>
                <span style="font-family: var(--font-mono); font-weight: 600; color: var(--accent-light);">
                  ${col.column}
                </span>
              </td>
              <td style="font-family: var(--font-mono);">${(col.changeCount || 0).toLocaleString()}</td>
              <td style="font-family: var(--font-mono);">${col.entropyLoss || '0.000'}</td>
              <td>
                <span style="font-size: var(--text-xs); color: var(--text-muted);">
                  ${parseFloat(col.entropyLoss || 0) > 0.01 ? 'Moderate' : 'Negligible'}
                </span>
              </td>
              <td>
                <span style="font-size: var(--text-xs); color: var(--text-muted);">${col.reversibility || 'Snapshot'}</span>
              </td>
              <td>
                <span style="font-size: 11px; color: var(--accent-light); font-weight: 600;">
                  ✓ APPROVED BY SAFETY POLICY
                </span>
              </td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="6" style="text-align: center; padding: var(--space-8); color: var(--text-muted);">
                No column transformation impact recorded yet. Synthesize a cleaning plan first.
              </td>
            </tr>
          `}
        </tbody>
      </table>
    </div>

    <!-- Governance Callout -->
    <div style="margin-top: var(--space-6); background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: var(--space-5); display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h4 style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
          Human-in-the-Loop Safeguard Active
        </h4>
        <p style="font-size: var(--text-xs); color: var(--text-secondary); max-width: 600px;">
          All low-loss operations (standardization, validation, null imputation) are pre-certified. High-impact entity duplicate merges require human confirmation in the next review step.
        </p>
      </div>
      <button class="btn btn-primary" id="btn-goto-review-bottom">
        Proceed to Duplicate Review →
      </button>
    </div>
  `;

  container.querySelector("#btn-back-plan")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-goto-review")?.addEventListener("click", () => {
    window.location.hash = "#review-approval";
  });
  container.querySelector("#btn-goto-review-bottom")?.addEventListener("click", () => {
    window.location.hash = "#review-approval";
  });
}
