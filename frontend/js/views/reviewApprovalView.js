/**
 * View 10: Human Review & Safe Correction Queue
 * Clean 2-Color UI (Obsidian Slate + Violet Accent)
 * AI Detects & Recommends • Human Verifies & Enters Correct Values
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";
import { showToast } from "../app.js";

let activeTab = "human-queue"; // "human-queue" | "duplicates"
let pendingCorrections = {}; // { [itemId]: { recordId, column, originalValue, verifiedValue, status } }

export function renderReviewApproval(container) {
  const state = stateStore.getState();
  const humanQueue = stateStore.getHumanReviewQueue() || [];
  const duplicatePairs = state.reviewPairs || [];

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;">Step 3.5 • Safe Human Review</span>
        </div>
        <h1>Human Review & Verified Corrections</h1>
        <p class="page-description">AI detects ambiguous values. Enter verified values from trusted sources before applying changes.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-back-plan">← Cleaning Plan</button>
        <button class="btn btn-primary" id="btn-apply-human-corrections">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Apply Approved Corrections
        </button>
      </div>
    </div>

    <!-- Mode Selector Tabs -->
    <div style="display: flex; gap: 12px; margin-bottom: 24px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
      <button class="btn ${activeTab === 'human-queue' ? 'btn-primary' : 'btn-outline'}" id="tab-human-queue" style="font-size: 13px;">
        📋 Field-Level Human Corrections (${humanQueue.length})
      </button>
      <button class="btn ${activeTab === 'duplicates' ? 'btn-primary' : 'btn-outline'}" id="tab-duplicates" style="font-size: 13px;">
        👥 Ambiguous Duplicate Resolution (${duplicatePairs.length})
      </button>
    </div>

    <!-- TAB 1: FIELD-LEVEL HUMAN CORRECTION QUEUE -->
    <div id="content-human-queue" style="display: ${activeTab === 'human-queue' ? 'block' : 'none'};">
      <div class="card" style="margin-bottom: 20px; padding: 16px 20px; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: var(--radius-md);">
        <div style="font-weight: 600; color: var(--text-primary); font-size: 14px; margin-bottom: 4px;">
          🛡️ Safe Correction Guarantee
        </div>
        <div style="font-size: 13px; color: var(--text-muted);">
          AI does <strong>NOT</strong> guess or invent numbers for invalid/missing data. Enter verified values obtained from customer verification or accounting ledgers below. Applying a correction updates <strong>only the target field</strong> and records a permanent audit trail.
        </div>
      </div>

      ${humanQueue.length === 0 ? `
        <div class="card" style="text-align: center; padding: 48px 24px; background: rgba(18, 20, 32, 0.45); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
          <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: 8px;">✓ All Fields Clean & Verified</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 20px; font-size: var(--text-sm);">
            No ambiguous or out-of-bounds field entries currently require manual human entry.
          </p>
          <button class="btn btn-primary" id="btn-goto-execution-empty">Proceed to Cleaning Execution →</button>
        </div>
      ` : `
        <div class="table-wrapper">
          <table class="enterprise-table" style="font-size: 13px;">
            <thead>
              <tr>
                <th style="width: 15%;">Customer / Record</th>
                <th style="width: 12%;">Target Column</th>
                <th style="width: 12%;">Current Value</th>
                <th style="width: 22%;">Issue & AI Recommendation</th>
                <th style="width: 23%;">Verified Value Input</th>
                <th style="width: 16%;">Action Status</th>
              </tr>
            </thead>
            <tbody>
              ${humanQueue.map(item => {
                const pending = pendingCorrections[item.id] || {};
                const currentStatus = pending.status || item.status || "PENDING";
                const isApproved = currentStatus === "APPROVED";
                const isRejected = currentStatus === "REJECTED";

                return `
                  <tr data-id="${item.id}">
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary);">${item.custName}</div>
                      <div style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">${item.rowId}</div>
                    </td>
                    <td>
                      <span class="badge badge-neutral" style="font-family: var(--font-mono); font-weight: 600;">${item.column}</span>
                    </td>
                    <td>
                      <span style="font-family: var(--font-mono); color: var(--status-danger, #ef4444); font-weight: 700; background: rgba(239, 68, 68, 0.1); padding: 2px 8px; border-radius: 4px;">
                        ${item.currentValue}
                      </span>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: var(--text-primary); font-size: 12px; margin-bottom: 2px;">
                        ${item.issueType}
                      </div>
                      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
                        ${item.reason}
                      </div>
                      <div style="font-size: 11px; color: var(--accent-light); font-weight: 500;">
                        💡 ${item.aiRecommendation}
                      </div>
                    </td>
                    <td>
                      <div style="display: flex; gap: 6px; align-items: center;">
                        <input type="text" 
                          class="form-input input-verified-val" 
                          data-id="${item.id}"
                          placeholder="Enter verified ${item.column}..." 
                          value="${pending.verifiedValue || item.verifiedValue || ''}"
                          style="font-family: var(--font-mono); font-size: 12px; padding: 6px 10px; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); color: var(--text-primary); width: 100%;"
                          ${isApproved ? 'readonly' : ''}
                        />
                      </div>
                    </td>
                    <td>
                      <div style="display: flex; gap: 6px; align-items: center;">
                        ${isApproved ? `
                          <span style="font-size: 11px; font-weight: 700; color: var(--status-success, #10b981); display: inline-flex; align-items: center; gap: 4px;">
                            ✓ Approved (${pending.verifiedValue})
                          </span>
                          <button class="btn btn-outline btn-sm btn-undo-item" data-id="${item.id}" style="padding: 2px 6px; font-size: 10px;">Edit</button>
                        ` : isRejected ? `
                          <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">
                            ✕ Kept Original
                          </span>
                          <button class="btn btn-outline btn-sm btn-undo-item" data-id="${item.id}" style="padding: 2px 6px; font-size: 10px;">Reset</button>
                        ` : `
                          <button class="btn btn-primary btn-sm btn-approve-val" data-id="${item.id}" style="padding: 5px 10px; font-size: 11px;">
                            ✓ Approve Entry
                          </button>
                          <button class="btn btn-outline btn-sm btn-reject-val" data-id="${item.id}" style="padding: 5px 8px; font-size: 11px;">
                            Skip
                          </button>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>

    <!-- TAB 2: AMBIGUOUS DUPLICATE RESOLUTION QUEUE -->
    <div id="content-duplicates" style="display: ${activeTab === 'duplicates' ? 'block' : 'none'};">
      <div class="review-cards-container" id="review-list">
        ${duplicatePairs.length === 0 ? `
          <div class="card" style="text-align: center; padding: 48px 24px; background: rgba(18, 20, 32, 0.45); border: 1px dashed var(--border-subtle); border-radius: var(--radius-md);">
            <h3 style="font-size: var(--text-lg); color: var(--text-primary); margin-bottom: 8px;">No Ambiguous Duplicates</h3>
            <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 20px; font-size: var(--text-sm);">
              No conflicting duplicate pairs were found that need manual approval. All rows are uniquely resolved.
            </p>
          </div>
        ` : duplicatePairs.map(pair => `
          <div class="card" style="margin-bottom: 24px; padding: 20px; background: rgba(18, 20, 32, 0.45); border: 1px solid rgba(255, 255, 255, 0.09); border-radius: var(--radius-md);" data-pair-id="${pair.id}">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-subtle);">
              <div style="display: flex; align-items: center; gap: var(--space-3);">
                <span style="font-size: var(--text-xs); color: var(--accent-light); font-weight: 600;">
                  Similarity Match: ${pair.confidence}%
                </span>
                <span style="font-weight: 700; font-size: var(--text-md); color: var(--text-primary);">
                  Duplicate Candidate: ${pair.recordA?.name || 'Record A'} ↔ ${pair.recordB?.name || 'Record B'}
                </span>
              </div>
              <span style="font-size: 11px; font-weight: 600; color: var(--text-secondary);">
                ${(pair.status || 'PENDING REVIEW').toUpperCase()}
              </span>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button class="btn btn-outline btn-sm btn-action-separate" data-id="${pair.id}">
                Keep as 2 Separate Records
              </button>
              <button class="btn btn-primary btn-sm btn-action-merge" data-id="${pair.id}">
                ✓ Merge Selected Attributes into 1 Clean Record
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach Tab Listeners
  container.querySelector("#tab-human-queue")?.addEventListener("click", () => {
    activeTab = "human-queue";
    renderReviewApproval(container);
  });
  container.querySelector("#tab-duplicates")?.addEventListener("click", () => {
    activeTab = "duplicates";
    renderReviewApproval(container);
  });

  // Attach Header Buttons
  container.querySelector("#btn-back-plan")?.addEventListener("click", () => {
    window.location.hash = "#cleaning-plan";
  });
  container.querySelector("#btn-goto-execution-empty")?.addEventListener("click", () => {
    window.location.hash = "#execution";
  });

  // Handle Approve Value Button Click
  container.querySelectorAll(".btn-approve-val").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.id;
      const row = container.querySelector(`tr[data-id="${itemId}"]`);
      const input = row?.querySelector(".input-verified-val");
      const val = input ? input.value.trim() : "";

      if (!val) {
        showToast("Please enter a verified value before approving.", "error");
        input?.focus();
        return;
      }

      const item = humanQueue.find(q => q.id === itemId);
      if (item) {
        pendingCorrections[itemId] = {
          recordId: item.rowId,
          customerName: item.custName,
          column: item.column,
          originalValue: item.currentValue,
          verifiedValue: val,
          status: "APPROVED"
        };
        showToast(`Approved verified ${item.column}: "${val}" for ${item.custName}`, "info");
        renderReviewApproval(container);
      }
    });
  });

  // Handle Reject / Skip Button Click
  container.querySelectorAll(".btn-reject-val").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.id;
      const item = humanQueue.find(q => q.id === itemId);
      if (item) {
        pendingCorrections[itemId] = {
          recordId: item.rowId,
          customerName: item.custName,
          column: item.column,
          originalValue: item.currentValue,
          verifiedValue: item.currentValue,
          status: "REJECTED"
        };
        renderReviewApproval(container);
      }
    });
  });

  // Handle Undo / Edit Button Click
  container.querySelectorAll(".btn-undo-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const itemId = btn.dataset.id;
      delete pendingCorrections[itemId];
      renderReviewApproval(container);
    });
  });

  // Apply Approved Corrections to Dataset Safely
  container.querySelector("#btn-apply-human-corrections")?.addEventListener("click", async () => {
    const approvedList = Object.entries(pendingCorrections).filter(([_, obj]) => obj.status === "APPROVED");

    if (approvedList.length === 0) {
      showToast("No approved human corrections ready to apply. Enter a verified value and click 'Approve Entry'.", "info");
      window.location.hash = "#execution";
      return;
    }

    const state = stateStore.getState();
    const dataset = state.activeDataset || {};
    const records = dataset.cleanedRecords || dataset.rawRecords || [];

    // Map corrections to records strictly targeting the specified column
    const correctionsMap = {};
    approvedList.forEach(([_, item]) => {
      const key = `${item.customerName}_${item.column}`;
      correctionsMap[key] = item.verifiedValue;

      // Add to Audit History
      state.auditHistory = state.auditHistory || [];
      state.auditHistory.unshift({
        id: `audit-human-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        recordIdentifier: `${item.customerName} (${item.recordId})`,
        column: item.column,
        originalValue: item.originalValue,
        newValue: item.verifiedValue,
        action: "Human Verified Correction",
        operator: "Human Operator (Verified Entry)",
        reason: "Customer verified external value",
        status: "Applied",
        checksum: "sha256:verified"
      });
    });

    // Apply to dataset records
    const updatedRecords = stateStore.transformDatasetRecords(records, correctionsMap);
    dataset.cleanedRecords = updatedRecords;
    stateStore.saveState();
    stateStore.emit("state:changed", stateStore.state);

    showToast(`✓ ${approvedList.length} Human Correction(s) Applied Safely to Dataset!`, "success");

    setTimeout(() => {
      window.location.hash = "#execution";
    }, 600);
  });

  // Handle Duplicate Merges & Separations
  container.querySelectorAll(".btn-action-merge").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const targetPair = duplicatePairs.find(p => String(p.id) === String(id));
      if (targetPair) {
        targetPair.status = "merged";
        stateStore.saveState();
        renderReviewApproval(container);
      }
    });
  });

  container.querySelectorAll(".btn-action-separate").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const targetPair = duplicatePairs.find(p => String(p.id) === String(id));
      if (targetPair) {
        targetPair.status = "separated";
        stateStore.saveState();
        renderReviewApproval(container);
      }
    });
  });
}
