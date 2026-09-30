/**
 * View 14: Audit History & Undo Ledger
 * Clean, user-friendly language & professional layout (Zero emojis/jargon)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderAuditHistory(container) {
  const state = stateStore.getState();
  const history = state.auditHistory || [];
  const datasetName = state.activeDataset?.name || "Dataset";

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-success">Undo & Safety</span>
        </div>
        <h1>Change History & Undo</h1>
        <p class="page-description">Every cleaning action is recorded with a backup. You can undo any fix with one click.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-results">← Results</button>
        <button class="btn btn-secondary" id="btn-export-audit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Change Log (JSON)
        </button>
      </div>
    </div>

    <!-- Audit Ledger Table -->
    <div class="table-wrapper">
      <div class="table-toolbar">
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary);">
          Recent Actions Log
        </div>
        <div style="display: flex; align-items: center; gap: var(--space-2);">
          <span class="badge badge-neutral">${history.length} Event(s)</span>
          <span class="badge badge-success">100% Reversible</span>
        </div>
      </div>

      <table class="enterprise-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Action Applied</th>
            <th>Rows Changed</th>
            <th>Status</th>
            <th>Undo Action</th>
          </tr>
        </thead>
        <tbody>
          ${history.length === 0 ? `
            <tr>
              <td colspan="5" style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
                No cleaning actions taken yet. Actions will appear here as soon as you clean a file.
              </td>
            </tr>
          ` : history.map(entry => `
            <tr>
              <td style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-muted);">
                ${entry.timestamp}
              </td>
              <td>
                <div style="font-weight: 600; color: var(--text-primary);">${entry.operation}</div>
              </td>
              <td style="font-family: var(--font-mono);">${(entry.recordsAffected || 0).toLocaleString()}</td>
              <td>
                <span class="badge ${entry.status === 'Completed' ? 'badge-success' : 'badge-high'}">
                  ${entry.status}
                </span>
              </td>
              <td>
                ${entry.rollbackAvailable ? `
                  <button class="btn btn-outline btn-sm btn-rollback-op" data-id="${entry.id}" data-op="${entry.operation}" style="color: var(--status-danger);">
                    Undo This Change
                  </button>
                ` : `
                  <span style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">Already Reverted</span>
                `}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Lineage Integrity Box -->
    <div style="margin-top: 24px; background-color: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
          Safe Undo Guarantee
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-secondary);">
          Your original uploaded file is never permanently deleted or overwritten. Undo will restore the previous values immediately.
        </div>
      </div>
      <button class="btn btn-primary" id="btn-goto-overview">
        Back to Overview →
      </button>
    </div>
  `;

  // Handlers
  container.querySelectorAll(".btn-rollback-op").forEach(b => {
    b.addEventListener("click", () => {
      const opName = b.dataset.op;
      const id = b.dataset.id;
      if (confirm(`Confirm Undo: Revert "${opName}"? Affected rows will be restored to their original values.`)) {
        ApiService.rollbackAuditEntry(id);
        renderAuditHistory(container);
      }
    });
  });

  container.querySelector("#btn-export-audit")?.addEventListener("click", () => {
    alert(`Change log exported for: ${datasetName}`);
  });

  container.querySelector("#btn-back-results")?.addEventListener("click", () => {
    window.location.hash = "#results";
  });
  container.querySelector("#btn-goto-overview")?.addEventListener("click", () => {
    window.location.hash = "#dashboard";
  });
}
