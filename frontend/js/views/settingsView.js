/**
 * View 15: Platform Settings & AI Governance
 */
import { stateStore } from "../services/stateManager.js";

export function renderSettings(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Platform Settings & AI Governance</h1>
        <p class="page-description">Configure agentic planner models, mathematical entropy guardrails, and worker sandboxing.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-reset-state">
          Reset Demo State
        </button>
        <button class="btn btn-primary" id="btn-save-settings">
          Save Configuration
        </button>
      </div>
    </div>

    <div class="settings-grid">
      <!-- Settings Tabs -->
      <div class="settings-nav">
        <div class="settings-nav-item active" data-tab="ai-planner">AI Agent & LLM Models</div>
        <div class="settings-nav-item" data-tab="safety">Safety & Entropy Bounds</div>
        <div class="settings-nav-item" data-tab="workers">Sandboxed Workers</div>
        <div class="settings-nav-item" data-tab="database">Database & Storage</div>
      </div>

      <!-- Settings Content -->
      <div class="settings-content-card">
        <div id="tab-ai-planner" class="settings-tab-pane">
          <h3 style="font-size: var(--text-md); font-weight: 600; margin-bottom: var(--space-4);">
            Agentic Reasoning Planner Configuration
          </h3>

          <div class="form-group">
            <label class="form-label">Primary Agent Model</label>
            <select class="form-select" id="model-select">
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Recommended - Best DAG Planning & Schema Reasoning)</option>
              <option value="gpt-4o">GPT-4o (High Speed Multimodal)</option>
              <option value="llama-3-70b">Llama 3 70B (Local Air-Gapped Enterprise)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Sampling Temperature</label>
            <input type="number" class="form-input" min="0.0" max="1.0" step="0.05" value="0.10" />
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Low temperature (0.05 - 0.15) enforces strictly reproducible and deterministic data cleaning DAGs.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Max Autonomous Reasoning Iterations</label>
            <input type="number" class="form-input" min="1" max="20" value="8" />
          </div>
        </div>

        <div id="tab-safety" class="settings-tab-pane" style="display: none;">
          <h3 style="font-size: var(--text-md); font-weight: 600; margin-bottom: var(--space-4);">
            Mathematical Safety Bounds & Guardrails
          </h3>

          <div class="form-group">
            <label class="form-label">Max Allowed Shannon Entropy Delta (ΔH)</label>
            <input type="number" class="form-input" min="0.01" max="0.50" step="0.01" value="0.15" />
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Transformations exceeding ΔH = 0.15 are automatically halted and routed to human review.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">Auto-Approval Confidence Threshold (%)</label>
            <input type="number" class="form-input" min="50" max="100" value="95" />
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Changes with confidence >= 95% and Low information loss can be automatically staged.
            </span>
          </div>
        </div>

        <div id="tab-workers" class="settings-tab-pane" style="display: none;">
          <h3 style="font-size: var(--text-md); font-weight: 600; margin-bottom: var(--space-4);">
            Sandboxed Data Processing Workers
          </h3>

          <div class="form-group">
            <label class="form-label">Execution Engine</label>
            <select class="form-select">
              <option value="polars">Polars (Vectorized Multi-Threaded Engine)</option>
              <option value="duckdb">DuckDB (Analytical SQL In-Memory)</option>
              <option value="pyarrow">PyArrow Compute Kernels</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Worker Memory Limit per Job</label>
            <input type="text" class="form-input" value="16 GB" />
          </div>

          <div class="form-group">
            <label class="form-label">Execution Sandbox Timeout</label>
            <input type="text" class="form-input" value="300 seconds" />
          </div>
        </div>

        <div id="tab-database" class="settings-tab-pane" style="display: none;">
          <h3 style="font-size: var(--text-md); font-weight: 600; margin-bottom: var(--space-4);">
            Enterprise Storage & Lineage Target
          </h3>

          <div class="form-group">
            <label class="form-label">PostgreSQL Target Connection String (Level 2)</label>
            <input type="text" class="form-input" value="postgresql://postgres:********@127.0.0.1:5432/purifyops_production" />
          </div>

          <div class="form-group">
            <label class="form-label">Delta Snapshots Bucket URI</label>
            <input type="text" class="form-input" value="s3://purifyops-lineage-vault/deltas/" />
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Tab Switchers
  const tabs = container.querySelectorAll(".settings-nav-item");
  const panes = container.querySelectorAll(".settings-tab-pane");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const target = tab.dataset.tab;
      panes.forEach(p => {
        p.style.display = p.id === `tab-${target}` ? "block" : "none";
      });
    });
  });

  container.querySelector("#btn-save-settings")?.addEventListener("click", () => {
    const btn = container.querySelector("#btn-save-settings");
    btn.textContent = "Saved ✓";
    setTimeout(() => {
      btn.textContent = "Save Configuration";
    }, 1200);
  });

  container.querySelector("#btn-reset-state")?.addEventListener("click", () => {
    if (confirm("Reset all local state and resume pristine demo environment?")) {
      stateStore.resetToDefault();
      window.location.hash = "#dashboard";
    }
  });
}
