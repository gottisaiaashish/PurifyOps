/**
 * View 8: Cleaning Plan
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderCleaningPlan(container) {
  const plan = stateStore.getState().cleaningPlan;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-low">DAG Pipeline</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${plan.planId}</span>
        </div>
        <h1>AI-Generated Cleaning Plan</h1>
        <p class="page-description">Autonomous reasoning graph synthesized by ${plan.agentModel} based on inferred constraints.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-re-generate-plan">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Re-Generate Cleaning Plan
        </button>
        <button class="btn btn-primary" id="btn-goto-impact">
          Impact Analysis →
        </button>
      </div>
    </div>

    <!-- Plan Telemetry Banner -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Pipeline Steps</span>
          <span class="badge badge-neutral">Sequential DAG</span>
        </div>
        <div class="metric-value">${plan.operations.length}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">100%</span> reversible transformations
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Affected Records</span>
          <span class="badge badge-low">Scope</span>
        </div>
        <div class="metric-value">${plan.totalRecordsAffected.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> 20.1% of entire dataset
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Est. Polars Runtime</span>
          <span class="badge badge-neutral">Throughput</span>
        </div>
        <div class="metric-value">${plan.estimatedRuntimeSeconds}s</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Vectorized</span> PyArrow memory pool
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Entropy Loss Index</span>
          <span class="badge badge-success">Safe</span>
        </div>
        <div class="metric-value">Δ 0.04</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Minimal</span> Shannon information loss
        </div>
      </div>
    </div>

    <!-- Operations List -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
      <h3 style="font-size: var(--text-md); font-weight: 600; color: var(--text-primary);">
        Planned Transformation Operations
      </h3>
      <button class="btn btn-outline btn-sm" id="btn-approve-all-safe">
        ✓ Approve All Safe Changes
      </button>
    </div>

    <div class="plan-operations-list" id="operations-container">
      ${plan.operations.map(op => `
        <div class="operation-card" data-step-id="${op.stepId}">
          <div class="operation-left">
            <div class="operation-step-badge">${op.stepId}</div>
            <div class="operation-info">
              <h4>${op.title}</h4>
              <p>${op.reason}</p>
              <div style="margin-top: 6px; display: flex; gap: var(--space-2); align-items: center;">
                <span class="badge badge-neutral">${op.actionType}</span>
                <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">
                  Target: ${op.targetColumns.join(', ')}
                </span>
                <span class="badge ${op.informationLossLevel === 'None' || op.informationLossLevel === 'Low' ? 'badge-low' : 'badge-medium'}">
                  Loss: ${op.informationLossLevel}
                </span>
              </div>
            </div>
          </div>

          <div class="operation-metrics">
            <div class="metric-pill">
              <span class="metric-pill-label">Affected</span>
              <span class="metric-pill-value">${op.affectedRecords.toLocaleString()}</span>
            </div>

            <div class="metric-pill">
              <span class="metric-pill-label">Confidence</span>
              <span class="metric-pill-value" style="color: var(--accent-light);">${op.confidence}%</span>
            </div>

            <div style="display: flex; align-items: center; gap: var(--space-3); margin-left: var(--space-4);">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
                <input type="checkbox" class="op-approval-toggle" data-step="${op.stepId}" ${op.approved ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--accent-primary);" />
                <span style="font-size: var(--text-xs); font-weight: 600; color: ${op.approved ? 'var(--status-success)' : 'var(--text-muted)'};">
                  ${op.approved ? 'APPROVED' : 'PENDING'}
                </span>
              </label>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-6);">
      <button class="btn btn-outline" id="btn-back-issues">← Back to Issues</button>
      <button class="btn btn-primary" id="btn-goto-impact-bottom">
        Proceed to Impact & Information Loss Analysis →
      </button>
    </div>
  `;

  // Attach Event Handlers
  container.querySelectorAll(".op-approval-toggle").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const stepId = parseInt(e.target.dataset.step, 10);
      ApiService.toggleOperationApproval(stepId);
      renderCleaningPlan(container);
    });
  });

  container.querySelector("#btn-approve-all-safe")?.addEventListener("click", () => {
    ApiService.approveAllSafeOperations();
    renderCleaningPlan(container);
  });

  container.querySelector("#btn-re-generate-plan")?.addEventListener("click", () => {
    const btn = container.querySelector("#btn-re-generate-plan");
    btn.textContent = "Synthesizing DAG with Claude 3.5 Sonnet...";
    setTimeout(() => {
      renderCleaningPlan(container);
    }, 400);
  });

  container.querySelector("#btn-back-issues")?.addEventListener("click", () => {
    window.location.hash = "#issues";
  });
  container.querySelector("#btn-goto-impact")?.addEventListener("click", () => {
    window.location.hash = "#impact-analysis";
  });
  container.querySelector("#btn-goto-impact-bottom")?.addEventListener("click", () => {
    window.location.hash = "#impact-analysis";
  });
}
