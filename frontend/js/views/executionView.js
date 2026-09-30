/**
 * View 12: Pipeline Execution (Sandboxed Worker Telemetry & Live Logs)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderExecution(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-success">SANDBOX ACTIVE</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">Polars Worker Node-04</span>
        </div>
        <h1>Pipeline Execution Engine</h1>
        <p class="page-description">Executing approved cleaning DAG within isolated sandboxed workers with atomic delta tracking.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-validation">← Validation</button>
        <button class="btn btn-primary" id="btn-trigger-run">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Run Full Pipeline
        </button>
      </div>
    </div>

    <!-- Execution Telemetry Cards -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Execution Progress</span>
          <span class="badge badge-low" id="exec-progress-pct">Ready</span>
        </div>
        <div class="metric-value" id="exec-status-display">Idle</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">5 Approved Steps</span> queued
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Memory Footprint</span>
          <span class="badge badge-neutral">PyArrow Buffer</span>
        </div>
        <div class="metric-value">42.8 MB</div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Zero-Copy</span> in-memory batching
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Throughput</span>
          <span class="badge badge-neutral">Speed</span>
        </div>
        <div class="metric-value">4,296 <span style="font-size: var(--text-xs); color: var(--text-muted);">rows/s</span></div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Multi-threaded</span> Polars vectorization
        </div>
      </div>

      <div class="metric-card">
        <div class="metric-card-header">
          <span class="metric-label">Atomic Checkpoint</span>
          <span class="badge badge-success">Enabled</span>
        </div>
        <div class="metric-value" style="font-size: var(--text-md); font-family: var(--font-mono); color: var(--status-success);">
          SHA-256 Verified
        </div>
        <div class="metric-meta">
          <span class="metric-indicator positive">Rollback ready</span> in Audit Ledger
        </div>
      </div>
    </div>

    <!-- Overall Pipeline Progress Bar -->
    <div class="settings-content-card" style="margin-bottom: var(--space-6);">
      <div style="display: flex; justify-content: space-between; font-size: var(--text-sm); font-weight: 600; margin-bottom: var(--space-2);">
        <span>Pipeline Execution Progress</span>
        <span id="exec-substep-label" style="font-family: var(--font-mono); color: var(--accent-light);">Awaiting launch trigger</span>
      </div>
      <div class="progress-track" style="height: 8px;">
        <div class="progress-fill" id="exec-progress-bar" style="width: 0%;"></div>
      </div>
    </div>

    <!-- Streaming Live Terminal Console -->
    <div class="terminal-window">
      <div class="terminal-header">
        <div class="terminal-dots">
          <div class="terminal-dot dot-red"></div>
          <div class="terminal-dot dot-yellow"></div>
          <div class="terminal-dot dot-green"></div>
        </div>
        <span style="font-family: var(--font-mono);">polars-worker@sandbox-worker-04: /app/cleaning-engine</span>
        <span>STREAMING TELEMETRY</span>
      </div>

      <div class="terminal-body" id="terminal-output">
        <div class="log-line">
          <span class="log-ts">09:42:00.000</span>
          <span class="log-tag">[SYSTEM]</span>
          <span class="log-msg info">Engine initialized. Ready to process 12,450 records in sandboxed environment.</span>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-6);">
      <button class="btn btn-outline" id="btn-back-val-2">← Back to Validation</button>
      <button class="btn btn-primary" id="btn-goto-results" style="display: none;">
        View Transformation Results & Certification →
      </button>
    </div>
  `;

  const btnRun = container.querySelector("#btn-trigger-run");
  const progressBar = container.querySelector("#exec-progress-bar");
  const progressPct = container.querySelector("#exec-progress-pct");
  const statusDisplay = container.querySelector("#exec-status-display");
  const substepLabel = container.querySelector("#exec-substep-label");
  const terminal = container.querySelector("#terminal-output");
  const btnResults = container.querySelector("#btn-goto-results");

  btnRun?.addEventListener("click", () => {
    btnRun.disabled = true;
    btnRun.innerHTML = `<span style="display: inline-block; animation: spin 1s infinite linear;">↻</span> Executing Pipeline...`;
    statusDisplay.textContent = "Running";
    progressPct.className = "badge badge-medium";
    progressPct.textContent = "In Progress";

    let stepIndex = 0;
    const allLogs = stateStore.getState().executionLogs;
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
        progressPct.textContent = `${pct}%`;
        substepLabel.textContent = item.msg;

        stepIndex++;
      } else {
        clearInterval(logInterval);
        statusDisplay.textContent = "Completed";
        statusDisplay.style.color = "var(--status-success)";
        progressPct.className = "badge badge-success";
        progressPct.textContent = "100% DONE";
        substepLabel.textContent = "Pipeline execution successful. 2,328 transformations committed.";
        btnRun.style.display = "none";
        btnResults.style.display = "inline-flex";

        stateStore.completeExecution();
      }
    }, 220);
  });

  btnResults?.addEventListener("click", () => {
    window.location.hash = "#results";
  });
  container.querySelector("#btn-back-validation")?.addEventListener("click", () => {
    window.location.hash = "#validation";
  });
  container.querySelector("#btn-back-val-2")?.addEventListener("click", () => {
    window.location.hash = "#validation";
  });
}
