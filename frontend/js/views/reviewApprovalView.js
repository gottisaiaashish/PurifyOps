/**
 * View 10: Review & Approval (Human-in-the-loop)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderReviewApproval(container) {
  const pairs = stateStore.getState().reviewPairs;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-high">Human-in-the-Loop</span>
          <span style="font-size: var(--text-xs); color: var(--text-muted);">Probabilistic Deduplication Resolution</span>
        </div>
        <h1>Review & Approval Verification</h1>
        <p class="page-description">Inspect candidate duplicate clusters with conflicting or fuzzy fields before pipeline execution.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-impact">← Impact Analysis</button>
        <button class="btn btn-secondary" id="btn-approve-all-safe-review">
          ✓ Approve All Safe Changes
        </button>
        <button class="btn btn-primary" id="btn-goto-validation">
          Proceed to Validation Tests →
        </button>
      </div>
    </div>

    <!-- Review Candidates List -->
    <div class="review-cards-container" id="review-list">
      ${pairs.length === 0 ? `
        <div class="card" style="text-align: center; padding: var(--space-12); background: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <div style="font-size: 2rem; margin-bottom: var(--space-3); color: var(--text-muted);">👥</div>
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: var(--space-2);">No Duplicate Candidates Pending Review</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto var(--space-5); font-size: var(--text-sm);">
            No high-ambiguity entity duplicate clusters were detected in this dataset. All records are uniquely identified or auto-resolved.
          </p>
          <a href="#validation" class="btn btn-primary" style="display: inline-block;">Proceed to Validation Tests</a>
        </div>
      ` : pairs.map(pair => `
        <div class="review-card" data-pair-id="${pair.id}">
          <div class="review-card-header">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <span class="badge ${pair.confidence > 90 ? 'badge-high' : 'badge-medium'}">
                Confidence: ${pair.confidence}%
              </span>
              <span style="font-weight: 600; font-size: var(--text-sm); color: var(--text-primary);">
                Entity Pair: ${pair.recordA.id} ↔ ${pair.recordB.id}
              </span>
              <span style="font-size: var(--text-xs); color: var(--text-muted);">
                ${pair.matchReason}
              </span>
            </div>

            <div>
              <span class="badge ${pair.status === 'merged' ? 'badge-success' : pair.status === 'separated' ? 'badge-neutral' : 'badge-medium'}">
                ${pair.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div class="review-diff-grid">
            <!-- Record A -->
            <div class="record-box">
              <div class="record-title">
                <span>Record A (Primary Golden Record)</span>
                <span style="font-family: var(--font-mono); color: var(--text-muted);">${pair.recordA.id}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Customer Name:</span>
                <span class="field-val">${pair.recordA.name}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Email Address:</span>
                <span class="field-val">${pair.recordA.email}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Telephone:</span>
                <span class="field-val">${pair.recordA.phone}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Country Code:</span>
                <span class="field-val">${pair.recordA.country}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Annual Revenue:</span>
                <span class="field-val">${pair.recordA.revenue}</span>
              </div>
            </div>

            <!-- Record B -->
            <div class="record-box">
              <div class="record-title">
                <span>Record B (Candidate Duplicate)</span>
                <span style="font-family: var(--font-mono); color: var(--text-muted);">${pair.recordB.id}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Customer Name:</span>
                <span class="field-val highlight">${pair.recordB.name}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Email Address:</span>
                <span class="field-val">${pair.recordB.email}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Telephone:</span>
                <span class="field-val highlight">${pair.recordB.phone}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Country Code:</span>
                <span class="field-val">${pair.recordB.country}</span>
              </div>
              <div class="record-field">
                <span class="field-name">Annual Revenue:</span>
                <span class="field-val highlight">${pair.recordB.revenue}</span>
              </div>
            </div>
          </div>

          <div class="review-actions">
            <span style="font-size: var(--text-xs); color: var(--text-muted); margin-right: auto;">
              Recommended Action: Merge B into A and inherit non-empty attributes.
            </span>
            <button class="btn btn-outline btn-sm btn-action-ignore" data-id="${pair.id}">
              Ignore
            </button>
            <button class="btn btn-secondary btn-sm btn-action-separate" data-id="${pair.id}">
              Keep Separate
            </button>
            <button class="btn btn-primary btn-sm btn-action-merge" data-id="${pair.id}">
              ✓ Merge Records
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-6);">
      <button class="btn btn-outline" id="btn-back-impact-bottom">← Back to Impact Analysis</button>
      <button class="btn btn-primary" id="btn-goto-validation-bottom">
        All Approvals Staged — Proceed to Validation Tests →
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

  container.querySelectorAll(".btn-action-ignore").forEach(b => {
    b.addEventListener("click", () => {
      ApiService.submitReviewDecision(b.dataset.id, "ignored");
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

  container.querySelector("#btn-back-impact")?.addEventListener("click", () => {
    window.location.hash = "#impact-analysis";
  });
  container.querySelector("#btn-back-impact-bottom")?.addEventListener("click", () => {
    window.location.hash = "#impact-analysis";
  });
  container.querySelector("#btn-goto-validation")?.addEventListener("click", () => {
    window.location.hash = "#validation";
  });
  container.querySelector("#btn-goto-validation-bottom")?.addEventListener("click", () => {
    window.location.hash = "#validation";
  });
}
