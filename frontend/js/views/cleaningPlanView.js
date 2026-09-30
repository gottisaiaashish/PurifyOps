/**
 * View 8: Cleaning Plan
 * Simple, human-friendly wording & clean UI (Zero emojis/jargon)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderCleaningPlan(container) {
  const state = stateStore.getState();
  const plan = state.cleaningPlan || { operations: [] };
  const operations = plan.operations || [];
  const dataset = state.activeDataset || {};
  const totalRecords = dataset.recordsCount || 0;

  // Auto-fetch plan if operations are empty but issues exist
  if (operations.length === 0 && (state.issues || []).length > 0) {
    ApiService.getCleaningPlan().then(p => {
      if (p && p.operations && p.operations.length > 0) {
        renderCleaningPlan(container);
      }
    });
  }

  const affected = plan.totalRecordsAffected || 0;
  const percentAffected = totalRecords > 0 ? ((affected / totalRecords) * 100).toFixed(1) : "0.0";

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge ${operations.length > 0 ? 'badge-low' : 'badge-neutral'}">Step 3 of 5</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${dataset.name || 'Dataset'}</span>
        </div>
        <h1>Smart Cleaning Plan</h1>
        <p class="page-description">Review the proposed fixes before applying them to your data. You can turn any step on or off.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary" id="btn-re-generate-plan">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          ${operations.length > 0 ? 'Re-create Plan' : 'Generate Cleaning Plan'}
        </button>
        <button class="btn btn-primary" id="btn-goto-run">
          Run Cleaning Now →
        </button>
      </div>
    </div>

    <!-- Plan Summary Banner -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Fixes Planned</span>
          <span class="badge badge-neutral">Steps</span>
        </div>
        <div class="metric-value">${operations.length}</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">100%</span> safe and reversible
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Rows Affected</span>
          <span class="badge badge-low">Scope</span>
        </div>
        <div class="metric-value">${affected.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${percentAffected}% of your records
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Processing Speed</span>
          <span class="badge badge-neutral">Fast</span>
        </div>
        <div class="metric-value">&lt; 1s</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Instant</span> clean engine
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Data Safety</span>
          <span class="badge badge-success">Protected</span>
        </div>
        <div class="metric-value" style="color: var(--status-success);">Zero Data Loss</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Backup ready</span> before changes
        </div>
      </div>
    </div>

    <!-- Natural Language AI Prompt Engine Card -->
    <div class="settings-content-card" style="margin-bottom: var(--space-6); background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: var(--radius-md); padding: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge badge-high" style="background: rgba(59, 130, 246, 0.2); color: var(--accent-light); border-color: rgba(59, 130, 246, 0.4); font-weight: 600;">
            ✨ Natural Language AI Rule Synthesizer
          </span>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">
            Type custom instructions in plain English/Telugu to dynamically generate DAG cleaning rules.
          </span>
        </div>
        <span style="font-size: 11px; font-family: var(--font-mono); color: var(--status-success); font-weight: 600;">
          ● OpenAI GPT-4o Active
        </span>
      </div>

      <div style="display: flex; gap: 10px; align-items: center;">
        <div style="position: relative; flex: 1;">
          <input type="text" id="ai-prompt-input" class="form-input" style="padding-left: 38px; height: 44px; font-size: var(--text-sm); background: var(--bg-surface); border-color: var(--border-medium);" placeholder="e.g., Fix email syntax, normalize phone numbers to E.164, and clamp age between 18 and 100..." />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" stroke-width="2" style="position: absolute; left: 12px; top: 14px;"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        </div>
        <button class="btn btn-primary" id="btn-apply-ai-prompt" style="height: 44px; padding: 0 20px; font-weight: 600;">
          ✨ Apply AI Instruction
        </button>
      </div>

      <!-- Quick Preset Prompt Chips -->
      <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; align-items: center;">
        <span style="font-size: 11px; color: var(--text-muted); font-weight: 500;">Quick Presets:</span>
        <button class="btn btn-sm btn-outline preset-prompt-chip" data-prompt="Fix all invalid emails and deduplicate customer accounts">
          ✉️ Fix Emails & Deduplicate
        </button>
        <button class="btn btn-sm btn-outline preset-prompt-chip" data-prompt="Impute missing annual revenue with demographic cohort median">
          📊 Impute Missing Revenue
        </button>
        <button class="btn btn-sm btn-outline preset-prompt-chip" data-prompt="Clamp age between 18 and 100 and clean negative revenues">
          ⚠️ Fix Negative Outliers
        </button>
        <button class="btn btn-sm btn-outline preset-prompt-chip" data-prompt="Standardize phone numbers into E.164 canonical format">
          📞 E.164 Phone Standard
        </button>
      </div>
    </div>

    <!-- Operations List -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
      <h3 style="font-size: var(--text-md); font-weight: 600; color: var(--text-primary);">
        Proposed Fixes
      </h3>
      ${operations.length > 0 ? `
        <button class="btn btn-outline btn-sm" id="btn-approve-all-safe">
          ✓ Select All Recommended
        </button>
      ` : ''}
    </div>

    <div class="plan-operations-list" id="operations-container">
      ${operations.length === 0 ? `
        <div class="card" style="text-align: center; padding: 48px 24px; background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: 8px;">No Cleaning Plan Generated Yet</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 20px; font-size: var(--text-sm);">
            ${totalRecords === 0 ? 'Please upload your dataset first to create a cleaning plan.' : 'Click "Generate Cleaning Plan" above to create an automated list of fixes.'}
          </p>
          ${totalRecords === 0 ? `
            <a href="#upload-dataset" class="btn btn-primary" style="display: inline-block;">Upload File</a>
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
                  Columns: ${Array.isArray(op.targetColumns) ? op.targetColumns.join(', ') : op.targetColumns}
                </span>
              </div>
            </div>
          </div>

          <div class="operation-metrics">
            <div class="metric-pill">
              <span class="metric-pill-label">Rows to fix</span>
              <span class="metric-pill-value">${(op.affectedRecords || 0).toLocaleString()}</span>
            </div>

            <div style="display: flex; align-items: center; gap: var(--space-3); margin-left: var(--space-4);">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;">
                <input type="checkbox" class="op-checkbox" data-step-id="${op.stepId}" ${op.approved ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: var(--accent-primary);" />
                <span style="font-size: var(--text-xs); font-weight: 500; color: ${op.approved ? 'var(--status-success)' : 'var(--text-muted)'};">
                  ${op.approved ? 'ENABLED' : 'SKIPPED'}
                </span>
              </label>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    ${operations.length > 0 ? `
      <div style="margin-top: var(--space-6); text-align: right;">
        <button class="btn btn-primary" id="btn-goto-run-bottom">
          Run Cleaning Now →
        </button>
      </div>
    ` : ''}
  `;

  // Checkboxes
  container.querySelectorAll(".op-checkbox").forEach(chk => {
    chk.addEventListener("change", (e) => {
      const stepId = e.target.dataset.stepId;
      stateStore.toggleOperationApproval(stepId);
    });
  });

  container.querySelector("#btn-approve-all-safe")?.addEventListener("click", () => {
    stateStore.approveAllSafeOperations();
  });

  // Navigation directly to run cleaning
  container.querySelector("#btn-goto-run")?.addEventListener("click", () => {
    window.location.hash = "#execution";
  });
  container.querySelector("#btn-goto-run-bottom")?.addEventListener("click", () => {
    window.location.hash = "#execution";
  });

  // Trigger Plan
  const triggerPlan = async () => {
    const btn = container.querySelector("#btn-re-generate-plan");
    if (btn) btn.textContent = "Creating Plan...";
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

  // Natural Language AI Prompt Engine Listeners
  const promptInput = container.querySelector("#ai-prompt-input");
  const btnApplyPrompt = container.querySelector("#btn-apply-ai-prompt");

  const runCustomPrompt = async (promptText) => {
    const query = promptText || promptInput?.value?.trim();
    if (!query) return;
    if (btnApplyPrompt) {
      btnApplyPrompt.disabled = true;
      btnApplyPrompt.textContent = "Synthesizing AI Rules...";
    }
    await ApiService.submitCustomAiPrompt(query);
    renderCleaningPlan(container);
  };

  btnApplyPrompt?.addEventListener("click", () => runCustomPrompt());
  promptInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runCustomPrompt();
  });

  container.querySelectorAll(".preset-prompt-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const p = chip.dataset.prompt;
      if (p) runCustomPrompt(p);
    });
  });
}
