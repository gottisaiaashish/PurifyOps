/**
 * View 8: Cleaning Plan
 * Dynamic DAG pipeline rendering - Zero mock data
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderCleaningPlan(container) {
  const state = stateStore.getState();
  const plan = state.cleaningPlan || { operations: [] };
  const operations = plan.operations || [];
  const dataset = state.activeDataset || {};
  const totalRecords = dataset.recordsCount || 0;
  const affected = plan.totalRecordsAffected || 0;
  const percentAffected = totalRecords > 0 ? ((affected / totalRecords) * 100).toFixed(1) : "0.0";
  const entropyLoss = (plan.overallEntropyLoss !== undefined && plan.overallEntropyLoss !== null) ? Number(plan.overallEntropyLoss).toFixed(3) : "0.000";

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge ${operations.length > 0 ? 'badge-low' : 'badge-neutral'}">DAG Pipeline</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${plan.planId || 'Draft'}</span>
        </div>
        <h1>AI-Generated Cleaning Plan</h1>
        <p class="page-description">Autonomous reasoning graph synthesized by ${plan.agentModel || 'PurifyOps DAG Planner'} based on inferred constraints.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-re-generate-plan">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          ${operations.length > 0 ? 'Re-Generate Cleaning Plan' : 'Generate Cleaning Plan'}
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
        <div class="metric-value">${operations.length}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">100%</span> reversible transformations
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Affected Records</span>
          <span class="badge badge-low">Scope</span>
        </div>
        <div class="metric-value">${affected.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${percentAffected}% of entire dataset
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Est. Polars Runtime</span>
          <span class="badge badge-neutral">Throughput</span>
        </div>
        <div class="metric-value">${plan.estimatedRuntimeSeconds || 0}s</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Vectorized</span> PyArrow memory pool
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Entropy Loss Index</span>
          <span class="badge ${Number(entropyLoss) < 0.15 ? 'badge-success' : 'badge-medium'}">ΔH</span>
        </div>
        <div class="metric-value">Δ ${entropyLoss}</div>
        <div class="metric-meta">
          <span class="metric-indicator ${Number(entropyLoss) < 0.15 ? 'positive' : 'warning'}">●</span> Shannon information shift
        </div>
      </div>
    </div>

    <!-- Operations List -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
      <h3 style="font-size: var(--text-md); font-weight: 600; color: var(--text-primary);">
        Planned Transformation Operations
      </h3>
      ${operations.length > 0 ? `
        <button class="btn btn-outline btn-sm" id="btn-approve-all-safe">
          ✓ Approve All Safe Changes
        </button>
      ` : ''}
    </div>

    <div class="plan-operations-list" id="operations-container">
      ${operations.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-12); background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <div style="font-size: 2rem; margin-bottom: var(--space-3); color: var(--text-muted);">📋</div>
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-2);">No Cleaning Plan Generated Yet</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto var(--space-5); font-size: var(--text-sm);">
            ${totalRecords === 0 ? 'Upload a dataset first, then synthesize an autonomous cleaning DAG.' : 'Click "Generate Cleaning Plan" above to create reasoning-backed transformation steps.'}
          </p>
          ${totalRecords === 0 ? `
            <a href="#upload-dataset" class="btn btn-primary" style="display: inline-block;">Upload Dataset</a>
          ` : `
            <button class="btn btn-primary" id="btn-trigger-plan-empty">Generate Cleaning Plan Now</button>
          `}
        </div>
      ` : operations.map(op => `
        <div class="operation-card" data-step-id="${op.stepId}">
          <div class="operation-left">
            <div class="operation-step-badge">${op.stepId}</div>
            <div class="operation-info">
              <h4>${op.title}</h4>
              <p>${op.reason}</p>
              <div style="margin-top: 6px; display: flex; gap: var(--space-2); align-items: center;">
                <span class="badge badge-neutral">${op.actionType}</span>
                <span style="font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);">
                  Target: ${Array.isArray(op.targetColumns) ? op.targetColumns.join(', ') : op.targetColumns}
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
              <span class="metric-pill-value">${(op.affectedRecords || 0).toLocaleString()}</span>
            </div>

            <div class="metric-pill">
              <span class="metric-pill-label">Confidence</span>
              <span class="metric-pill-value" style="color: var(--accent-light);">${op.confidence}%</span>
            </div>

            <div style="display: flex; align-items: center; gap: var(--space-3); margin-left: var(--space-4);">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
                <input type="checkbox" class="op-checkbox" data-step-id="${op.stepId}" ${op.approved ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--accent-primary);" />
                <span style="font-size: var(--text-xs); font-weight: 500; color: ${op.approved ? 'var(--status-success)' : 'var(--text-muted)'};">
                  ${op.approved ? 'APPROVED' : 'PENDING'}
                </span>
              </label>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    ${operations.length > 0 ? `
      <div style="margin-top: var(--space-6); text-align: right;">
        <button class="btn btn-primary" id="btn-goto-impact-bottom">
          Proceed to Impact Analysis →
        </button>
      </div>
    ` : ''}
  `;

  // Attach Checkboxes
  container.querySelectorAll(".op-checkbox").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const stepId = e.target.dataset.stepId;
      stateStore.toggleOperationApproval(stepId);
    });
  });

  // Approve all
  container.querySelector("#btn-approve-all-safe")?.addEventListener("click", () => {
    stateStore.approveAllSafeOperations();
  });

  // Navigation
  container.querySelector("#btn-goto-impact")?.addEventListener("click", () => {
    window.location.hash = "#impact-analysis";
  });
  container.querySelector("#btn-goto-impact-bottom")?.addEventListener("click", () => {
    window.location.hash = "#impact-analysis";
  });

  // Re-generate
  const triggerPlan = async () => {
    const btn = container.querySelector("#btn-re-generate-plan");
    if (btn) btn.textContent = "Synthesizing Plan...";
    try {
      const activeProjId = state.projects[0]?.id || "proj-001";
      const newPlan = await ApiService.generateCleaningPlan(activeProjId);
      if (newPlan) {
        stateStore.state.cleaningPlan = newPlan;
        stateStore.saveState();
        renderCleaningPlan(container);
      }
    } catch (e) {
      console.error("Plan synthesis error:", e);
    }
  };

  container.querySelector("#btn-re-generate-plan")?.addEventListener("click", triggerPlan);
  container.querySelector("#btn-trigger-plan-empty")?.addEventListener("click", triggerPlan);
}
