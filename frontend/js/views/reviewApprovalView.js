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
        <div class="card" style="margin-bottom: 24px; padding: 20px; background: rgba(18, 20, 32, 0.45); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: var(--radius-md);" data-pair-id="${pair.id}">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
            <div style="display: flex; align-items: center; gap: var(--space-3);">
              <span class="badge ${pair.confidence > 90 ? 'badge-high' : 'badge-medium'}">
                Similarity Match: ${pair.confidence}%
              </span>
              <span style="font-weight: 700; font-size: var(--text-md); color: var(--text-primary);">
                Duplicate Candidate: ${pair.recordA?.name || 'Record A'} ↔ ${pair.recordB?.name || 'Record B'}
              </span>
              <span style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
                Reason: ${pair.matchReason || 'Identical phone & fuzzy email match'}
              </span>
            </div>

            <div>
              <span class="badge ${pair.status === 'merged' ? 'badge-success' : pair.status === 'separated' ? 'badge-neutral' : 'badge-medium'}">
                ${(pair.status || 'PENDING REVIEW').toUpperCase()}
              </span>
            </div>
          </div>

          <!-- Interactive Side-by-Side Attribute Selection Table -->
          <div style="overflow-x: auto; margin-bottom: 16px;">
            <table class="enterprise-table" style="font-size: 13px;">
              <thead>
                <tr>
                  <th style="width: 22%;">Attribute Field</th>
                  <th style="width: 39%;">Record A (ID: ${pair.recordA?.id || 'Rec-A'})</th>
                  <th style="width: 39%;">Record B (ID: ${pair.recordB?.id || 'Rec-B'})</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="font-weight: 600; color: var(--text-secondary);">Customer Name</td>
                  <td>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="attr-name-${pair.id}" value="A" checked style="accent-color: var(--accent-primary);" />
                      <span style="color: var(--text-primary); font-weight: 600;">${pair.recordA?.name || 'Acme Corp'}</span>
                    </label>
                  </td>
                  <td>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="attr-name-${pair.id}" value="B" style="accent-color: var(--accent-primary);" />
                      <span style="color: var(--text-primary); font-weight: 600;">${pair.recordB?.name || 'Acme Corporation'}</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td style="font-weight: 600; color: var(--text-secondary);">Email Address</td>
                  <td>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="attr-email-${pair.id}" value="A" checked style="accent-color: var(--accent-primary);" />
                      <span style="font-family: var(--font-mono); color: var(--accent-light);">${pair.recordA?.email || 'support@acme.com'}</span>
                    </label>
                  </td>
                  <td>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="attr-email-${pair.id}" value="B" style="accent-color: var(--accent-primary);" />
                      <span style="font-family: var(--font-mono); color: var(--status-warning);">${pair.recordB?.email || 'contact@acme.com'}</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td style="font-weight: 600; color: var(--text-secondary);">Phone Number</td>
                  <td>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="attr-phone-${pair.id}" value="A" style="accent-color: var(--accent-primary);" />
                      <span style="font-family: var(--font-mono); color: var(--text-muted);">${pair.recordA?.phone || '+1 415-555-0199'}</span>
                    </label>
                  </td>
                  <td>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="attr-phone-${pair.id}" value="B" checked style="accent-color: var(--accent-primary);" />
                      <span style="font-family: var(--font-mono); color: var(--status-success);">${pair.recordB?.phone || '+1 (415) 555-0199 (Standardized)'}</span>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td style="font-weight: 600; color: var(--text-secondary);">Annual Revenue</td>
                  <td>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="attr-rev-${pair.id}" value="A" style="accent-color: var(--accent-primary);" />
                      <span style="font-family: var(--font-mono); color: var(--text-primary);">$120,000</span>
                    </label>
                  </td>
                  <td>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                      <input type="radio" name="attr-rev-${pair.id}" value="B" checked style="accent-color: var(--accent-primary);" />
                      <span style="font-family: var(--font-mono); color: var(--status-success); font-weight: 700;">$150,000 (Latest Verified)</span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: var(--text-xs); color: var(--text-muted);">
              💡 Select which values to preserve for the final merged record.
            </span>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-outline btn-sm btn-action-separate" data-id="${pair.id}">
                Keep as 2 Separate Records
              </button>
              <button class="btn btn-primary btn-sm btn-action-merge" data-id="${pair.id}">
                ✓ Merge Selected Attributes into 1 Clean Record
              </button>
            </div>
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
