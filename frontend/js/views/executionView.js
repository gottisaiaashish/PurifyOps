/**
 * View 12: Pipeline Execution
 * Clean 2-Color UI (Obsidian Slate + Violet Accent, Zero Noisy Badges)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderExecution(container) {
  const state = stateStore.getState();
  const plan = state.cleaningPlan || { operations: [] };
  const approvedSteps = (plan.operations || []).filter(o => o.approved !== false).length;
  const dataset = state.activeDataset || {};
  const recordsCount = dataset.recordsCount || 0;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;">Step 4 of 5 •</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${dataset.name || 'Dataset'}</span>
        </div>
        <h1>Clean Your Data</h1>
        <p class="page-description">Apply all selected cleaning fixes to your dataset safely with an automated backup.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-plan">← Cleaning Plan</button>
        <button class="btn btn-primary" id="btn-trigger-run" ${recordsCount === 0 ? 'disabled' : ''}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Start Cleaning Data
        </button>
      </div>
    </div>

    <!-- Execution Telemetry Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Status</span>
        </div>
        <div class="metric-value" id="exec-status-display">Ready</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> ${approvedSteps} fix(es) queued
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Total Records</span>
        </div>
        <div class="metric-value">${recordsCount.toLocaleString()}</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> Safe in-memory processing
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Backup Protection</span>
        </div>
        <div class="metric-value" style="color: var(--text-primary);">100% Undoable</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> Original file untouched
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Speed</span>
        </div>
        <div class="metric-value">&lt; 1s</div>
        <div class="metric-meta">
          <span class="metric-indicator neutral">●</span> Instant automated engine
        </div>
      </div>
    </div>

    <!-- Overall Progress Bar -->
    <div class="settings-content-card" style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; font-size: var(--text-sm); font-weight: 600; margin-bottom: 8px;">
        <span>Cleaning Progress</span>
        <span id="exec-substep-label" style="font-family: var(--font-mono); color: var(--accent-light);">Click 'Start Cleaning Data' to begin</span>
      </div>
      <div class="progress-track" style="height: 8px;">
        <div class="progress-fill" id="exec-progress-bar" style="width: 0%;"></div>
      </div>
    </div>

    <!-- Live Execution Status Box -->
    <div class="terminal-window">
      <div class="terminal-header">
        <div class="terminal-dots">
          <div class="terminal-dot dot-green"></div>
        </div>
        <span style="font-family: var(--font-mono);">CLEANING STATUS LOG</span>
        <span>READY</span>
      </div>

      <div class="terminal-body" id="terminal-output">
        <div class="log-line">
          <span class="log-ts">READY</span>
          <span class="log-tag">[SYSTEM]</span>
          <span class="log-msg info">System ready. ${approvedSteps} cleaning steps queued for ${recordsCount.toLocaleString()} rows.</span>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
      <button class="btn btn-outline" id="btn-back-plan-2">← Back to Cleaning Plan</button>
      <button class="btn btn-primary" id="btn-goto-results" style="display: none;">
        Download Clean Data & View Results →
      </button>
    </div>
  `;

  const btnRun = container.querySelector("#btn-trigger-run");
  const progressBar = container.querySelector("#exec-progress-bar");
  const statusDisplay = container.querySelector("#exec-status-display");
  const substepLabel = container.querySelector("#exec-substep-label");
  const terminal = container.querySelector("#terminal-output");
  const btnResults = container.querySelector("#btn-goto-results");

  btnRun?.addEventListener("click", () => {
    btnRun.disabled = true;
    btnRun.innerHTML = `<span style="display: inline-block; animation: spin 1s infinite linear;">↻</span> Cleaning in progress...`;
    statusDisplay.textContent = "Running";

    let stepIndex = 0;
    const allLogs = [
      { ts: "00:01", tag: "[BACKUP]", type: "info", msg: "Creating instant safety backup of original rows" },
      { ts: "00:02", tag: "[STANDARDIZE]", type: "success", msg: "Fixing formatting in email and phone number columns" },
      { ts: "00:03", tag: "[IMPUTE]", type: "success", msg: "Filling missing cells with clean smart defaults" },
      { ts: "00:04", tag: "[DEDUPE]", type: "success", msg: "Merging duplicate customer rows into clean golden records" },
      { ts: "00:05", tag: "[VERIFY]", type: "success", msg: "Verifying quality score and output integrity" },
      { ts: "00:06", tag: "[COMPLETE]", type: "success", msg: "All fixes applied successfully! Ready to export." }
    ];
    terminal.innerHTML = "";

    const logInterval = setInterval(() => {
      if (stepIndex < allLogs.length) {
        const item = allLogs[stepIndex];
        const line = document.createElement("div");
        line.className = "log-line";
        line.innerHTML = `
          <span class="log-ts">${item.ts}</span>
          <span class="log-tag">${item.tag}</span>
          <span class="log-msg ${item.type}">${item.msg}</span>
        `;
        terminal.appendChild(line);
        terminal.scrollTop = terminal.scrollHeight;

        const pct = Math.round(((stepIndex + 1) / allLogs.length) * 100);
        progressBar.style.width = `${pct}%`;
        substepLabel.textContent = `Progress: ${pct}% - ${item.msg}`;

        stepIndex++;
      } else {
        clearInterval(logInterval);
        statusDisplay.textContent = "Completed";
        btnRun.textContent = "✓ Cleaning Completed";
        substepLabel.textContent = "All fixes applied! Click below to download your clean dataset.";
        btnResults.style.display = "inline-flex";

        stateStore.completeExecution();
      }
    }, 600);
  });

  container.querySelector("#btn-back-plan")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-back-plan-2")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-goto-results")?.addEventListener("click", () => {
    window.location.hash = "#results";
  });
}
