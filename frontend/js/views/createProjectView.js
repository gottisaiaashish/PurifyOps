/**
 * View 3: Create Project Wizard
 */
import { stateStore } from "../services/stateManager.js";

export function renderCreateProject(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Create Data Project</h1>
        <p class="page-description">Configure target dataset source, domain context, and agentic inference boundary.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-cancel-create">Cancel</button>
      </div>
    </div>

    <div style="max-width: 760px; margin: 0 auto;">
      <div class="settings-content-card">
        <form id="form-create-project">
          <div class="form-group">
            <label class="form-label" for="proj-name">Project Name <span style="color: var(--status-danger)">*</span></label>
            <input type="text" id="proj-name" class="form-input" placeholder="e.g. Q4 Financial Ledger Reconciliation" required />
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Descriptive workspace name for team auditing and lineage tracking.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="proj-desc">Description</label>
            <textarea id="proj-desc" class="form-textarea" placeholder="Describe the messy data symptoms, expected semantics, and cleaning objective..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Dataset Source <span style="color: var(--status-danger)">*</span></label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); margin-top: var(--space-2);">
              <label class="source-card active" data-source="csv">
                <input type="radio" name="sourceType" value="csv" checked style="display: none;" />
                <div style="font-size: 20px; margin-bottom: 4px;">📄</div>
                <div style="font-weight: 600; font-size: var(--text-sm);">CSV File</div>
                <div style="font-size: 10px; color: var(--text-muted);">Local or S3 dump</div>
              </label>

              <label class="source-card" data-source="excel">
                <input type="radio" name="sourceType" value="excel" style="display: none;" />
                <div style="font-size: 20px; margin-bottom: 4px;">📊</div>
                <div style="font-weight: 600; font-size: var(--text-sm);">Excel / Sheets</div>
                <div style="font-size: 10px; color: var(--text-muted);">.xlsx / .xlsm</div>
              </label>

              <label class="source-card" data-source="database">
                <input type="radio" name="sourceType" value="database" style="display: none;" />
                <div style="font-size: 20px; margin-bottom: 4px;">🗄️</div>
                <div style="font-weight: 600; font-size: var(--text-sm);">Database</div>
                <div style="font-size: 10px; color: var(--text-muted);">Postgres / Snowflake</div>
              </label>

              <label class="source-card" data-source="api">
                <input type="radio" name="sourceType" value="api" style="display: none;" />
                <div style="font-size: 20px; margin-bottom: 4px;">⚡</div>
                <div style="font-weight: 600; font-size: var(--text-sm);">REST API</div>
                <div style="font-size: 10px; color: var(--text-muted);">JSON Endpoints</div>
              </label>
            </div>
          </div>

          <!-- Dynamic Source Config Panel -->
          <div id="source-config-panel" style="background-color: var(--bg-primary); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: var(--space-4); margin-bottom: var(--space-6);">
            <div style="font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; color: var(--accent-light); margin-bottom: var(--space-2);">
              Source Ingestion Parameters (CSV Mode)
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
              <div>
                <label class="form-label">Default Delimiter</label>
                <select class="form-select">
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab (\t)</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
              <div>
                <label class="form-label">Character Encoding</label>
                <select class="form-select">
                  <option value="utf-8">UTF-8 (Standard)</option>
                  <option value="latin-1">ISO-8859-1 (Latin-1)</option>
                  <option value="utf-16">UTF-16</option>
                </select>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: var(--space-3);">
            <button type="button" class="btn btn-outline" id="btn-cancel-create-2">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-submit-create">
              Create Project & Upload Dataset →
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Source card toggle styles
  const style = document.createElement("style");
  style.textContent = `
    .source-card {
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: var(--space-3);
      text-align: center;
      cursor: pointer;
      background-color: var(--bg-primary);
      transition: all var(--transition-fast);
    }
    .source-card:hover {
      border-color: var(--border-medium);
    }
    .source-card.active {
      border-color: var(--accent-light);
      background-color: var(--accent-subtle);
    }
  `;
  container.appendChild(style);

  // Attach Radio selection
  const cards = container.querySelectorAll(".source-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      const radio = card.querySelector("input[type=radio]");
      if (radio) radio.checked = true;
    });
  });

  // Handle Form Submit
  const form = container.querySelector("#form-create-project");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = container.querySelector("#proj-name").value;
    const desc = container.querySelector("#proj-desc").value;
    const sourceRadio = container.querySelector("input[name=sourceType]:checked");
    const sourceType = sourceRadio ? sourceRadio.value : "csv";

    stateStore.createProject({
      name,
      description: desc,
      sourceType,
      datasetName: `${name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.csv`
    });

    window.location.hash = "#upload-dataset";
  });

  container.querySelector("#btn-cancel-create")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });
  container.querySelector("#btn-cancel-create-2")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });
}
