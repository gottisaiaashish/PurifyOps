/**
 * View 3: Create Project Wizard
 * Clean, user-friendly language & professional layout (Zero emojis/jargon)
 */
import { stateStore } from "../services/stateManager.js";

export function renderCreateProject(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Create Data Project</h1>
        <p class="page-description">Start a new cleaning project to organize and clean your dataset.</p>
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
            <input type="text" id="proj-name" class="form-input" placeholder="e.g. Customer Contacts Cleanup" required />
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Give your cleaning project a clear name.
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="proj-desc">Description (Optional)</label>
            <textarea id="proj-desc" class="form-textarea" placeholder="Brief note about this data (e.g. Sales list with duplicate entries and invalid phone numbers)..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Data Format <span style="color: var(--status-danger)">*</span></label>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px;">
              <label class="source-card active" data-source="csv" style="padding: 16px; border: 1px solid var(--border-medium); border-radius: var(--radius-sm); text-align: center; cursor: pointer;">
                <input type="radio" name="sourceType" value="csv" checked style="display: none;" />
                <div style="font-weight: 600; font-size: var(--text-sm);">CSV File</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">.csv spreadsheet</div>
              </label>

              <label class="source-card" data-source="excel" style="padding: 16px; border: 1px solid var(--border-medium); border-radius: var(--radius-sm); text-align: center; cursor: pointer;">
                <input type="radio" name="sourceType" value="excel" style="display: none;" />
                <div style="font-weight: 600; font-size: var(--text-sm);">Excel Spreadsheet</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">.xlsx / .xls</div>
              </label>

              <label class="source-card" data-source="database" style="padding: 16px; border: 1px solid var(--border-medium); border-radius: var(--radius-sm); text-align: center; cursor: pointer;">
                <input type="radio" name="sourceType" value="database" style="display: none;" />
                <div style="font-weight: 600; font-size: var(--text-sm);">Database / JSON</div>
                <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">SQL or JSON format</div>
              </label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button type="button" class="btn btn-outline" id="btn-cancel-create-2">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-submit-create">
              Create Project & Upload Data →
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Attach card selection
  const sourceCards = container.querySelectorAll(".source-card");
  sourceCards.forEach(card => {
    card.addEventListener("click", () => {
      sourceCards.forEach(c => {
        c.classList.remove("active");
        c.style.borderColor = "var(--border-medium)";
      });
      card.classList.add("active");
      card.style.borderColor = "var(--accent-light)";
      const radio = card.querySelector("input[type='radio']");
      if (radio) radio.checked = true;
    });
  });

  const form = container.querySelector("#form-create-project");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = container.querySelector("#proj-name").value.trim();
    const desc = container.querySelector("#proj-desc").value.trim();
    const sourceType = container.querySelector("input[name='sourceType']:checked")?.value || "csv";

    if (!name) return;

    stateStore.createProject({
      name,
      description: desc,
      sourceType
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
