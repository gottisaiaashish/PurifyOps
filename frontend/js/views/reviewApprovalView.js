/**
 * View 10: Review & Approval
 * Clean, user-friendly language & professional layout (Zero emojis/jargon)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderReviewApproval(container) {
  const pairs = stateStore.getState().reviewPairs || [];

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-high">Manual Review</span>
        </div>
        <h1>Review Possible Duplicates</h1>
        <p class="page-description">Inspect pairs of rows that look like duplicates and decide whether to merge them or keep them separate.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-plan">← Cleaning Plan</button>
        <button class="btn btn-secondary" id="btn-approve-all-safe-review">
          ✓ Merge All High Confidence
        </button>
        <button class="btn btn-primary" id="btn-goto-execution">
          Proceed to Cleaning Run →
        </button>
      </div>
    </div>

    <!-- Review Candidates List -->
    <div class="review-cards-container" id="review-list">
      ${pairs.length === 0 ? `
        <div class="card" style="text-align: center; padding: 48px 24px; background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: 8px;">No Ambiguous Duplicates</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 20px; font-size: var(--text-sm);">
            No conflicting duplicate pairs were found that need manual approval. All rows are uniquely resolved.
          </p>
          <a href="#execution" class="btn btn-primary" style="display: inline-block;">Proceed to Run Cleaning</a>
        </div>
      ` : pairs.map(pair => `
        <div class="review-card" data-pair-id="${pair.id}">
          <div class="review-card-header">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <span class="badge ${pair.confidence > 90 ? 'badge-high' : 'badge-medium'}">
                Match: ${pair.confidence}%
              </span>
              <span style="font-weight: 600; font-size: var(--text-sm); color: var(--text-primary);">
                Pair: ${pair.recordA?.id || 'Record 1'} ↔ ${pair.recordB?.id || 'Record 2'}
              </span>
              <span style="font-size: var(--text-xs); color: var(--text-muted);">
                ${pair.matchReason || 'Similar name and contact info'}
              </span>
            </div>

            <div>
              <span class="badge ${pair.status === 'merged' ? 'badge-success' : pair.status === 'separated' ? 'badge-neutral' : 'badge-medium'}">
                ${(pair.status || 'PENDING').toUpperCase()}
              </span>
            </div>
          </div>

          <div class="review-diff-grid">
            <div class="record-box">
              <div class="record-title">
                <span>Record 1</span>
              </div>
              <div class="record-field">
                <span class="field-name">Name</span>
                <span class="field-val">${pair.recordA?.name || '-'}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Email</span>
                <span class="field-val">${pair.recordA?.email || '-'}</span>
              </div>
            </div>

            <div class="record-box">
              <div class="record-title">
                <span>Record 2</span>
              </div>
              <div class="record-field">
                <span class="field-name">Name</span>
                <span class="field-val">${pair.recordB?.name || '-'}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Email</span>
                <span class="field-val">${pair.recordB?.email || '-'}</span>
              </div>
            </div>
          </div>

          <div class="review-card-actions">
            <button class="btn btn-outline btn-sm btn-action-separate" data-id="${pair.id}">
              Keep Separate
            </button>
            <button class="btn btn-primary btn-sm btn-action-merge" data-id="${pair.id}">
              ✓ Merge Records
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
      <button class="btn btn-outline" id="btn-back-plan-bottom">← Back to Cleaning Plan</button>
      <button class="btn btn-primary" id="btn-goto-execution-bottom">
        Proceed to Run Cleaning →
      </button>
    </div>
  `;

  // Attach Action Handlers
  container.querySelectorAll(".btn-action-merge").forEach(b => {
    b.addEventListener("click", () => {
      ApiService.submitReviewDecision(b.dataset.id, "merged");
      renderReviewApproval(container);
    });
  });

  container.querySelectorAll(".btn-action-separate").forEach(b => {
    b.addEventListener("click", () => {
      ApiService.submitReviewDecision(b.dataset.id, "separated");
      renderReviewApproval(container);
    });
  });

  container.querySelector("#btn-approve-all-safe-review")?.addEventListener("click", () => {
    pairs.forEach(p => {
      if (p.confidence >= 90) {
        ApiService.submitReviewDecision(p.id, "merged");
      }
    });
    renderReviewApproval(container);
  });

  container.querySelector("#btn-back-plan")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-back-plan-bottom")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-goto-execution")?.addEventListener("click", () => {
    window.location.hash = "#execution";
  });
  container.querySelector("#btn-goto-execution-bottom")?.addEventListener("click", () => {
    window.location.hash = "#execution";
  });
}
