/**
 * View 4: Upload Dataset
 * Simple, human, clean upload page (Zero emojis/gimmicks)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderUploadDataset(container) {
  let selectedFile = null;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span class="badge badge-low">Step 1 of 5</span>
        </div>
        <h1>Upload Your Data File</h1>
        <p class="page-description">Upload your messy CSV, TSV, or Excel spreadsheet to find and fix errors automatically.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-browse-file">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Select File From Computer
        </button>
      </div>
    </div>

    <div style="max-width: 800px; margin: 0 auto;">
      <div class="dropzone-container" id="dataset-dropzone" style="cursor: pointer; padding: 48px 24px; text-align: center; border: 2px dashed var(--border-medium); border-radius: var(--radius-md); background: var(--bg-surface);">
        <h3 style="font-size: var(--text-lg); font-weight: 600; margin-bottom: 8px;" id="dropzone-title">
          Drag & Drop your file here, or <span style="color: var(--accent-light); text-decoration: underline;">click to browse</span>
        </h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted); max-width: 460px; margin: 0 auto 16px;" id="dropzone-sub">
          Works with CSV, Excel (.xlsx), TSV, and JSON files. Your data is analyzed privately on your server.
        </p>
        <input type="file" id="file-input" style="display: none;" accept=".csv,.tsv,.xlsx,.xls,.parquet,.json" />
        <div style="display: inline-flex; gap: 8px;">
          <span class="badge badge-neutral">CSV</span>
          <span class="badge badge-neutral">EXCEL (.XLSX)</span>
          <span class="badge badge-neutral">TSV</span>
          <span class="badge badge-neutral">JSON</span>
        </div>
      </div>

      <!-- Quick 1-Click Benchmark Demo Loader -->
      <div style="margin-top: 16px; padding: 14px 20px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(59, 130, 246, 0.18); display: flex; align-items: center; justify-content: center; color: var(--accent-light);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <div style="font-weight: 600; font-size: var(--text-sm); color: var(--text-primary);">
              Enterprise Benchmark: Customer_Master.csv (1,045 rows)
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-muted);">
              Pre-built test file with duplicate customer clusters, RFC syntax errors, blank cells & boundary anomalies.
            </div>
          </div>
        </div>
        <button class="btn btn-secondary" id="btn-load-sample-csv" style="white-space: nowrap; font-weight: 600; border-color: rgba(59, 130, 246, 0.4);">
          ⚡ Load Sample Dataset
        </button>
      </div>

      <!-- Upload Progress Container (Hidden by default) -->
      <div id="upload-progress-card" class="metric-card" style="display: none; margin: 24px 0;">
        <div class="metric-card-header">
          <span class="metric-label" id="upload-filename">Processing File...</span>
          <span class="badge badge-low" id="upload-pct-badge">0%</span>
        </div>
        <div class="progress-track" style="margin: 8px 0;">
          <div class="progress-fill" id="upload-progress-bar" style="width: 0%;"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); display: flex; justify-content: space-between;">
          <span id="upload-status-msg">Reading file...</span>
          <span>Fast Analysis</span>
        </div>
      </div>

      <!-- File Settings -->
      <div class="settings-content-card" style="margin: 24px 0;">
        <h4 style="font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 12px;">
          Optional Upload Options
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <label class="form-label">Treated as Blank / Missing</label>
            <input type="text" class="form-input" id="null-tokens" value="NA, N/A, null, NULL, -, None" />
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Words treated as empty cells.
            </span>
          </div>
          <div>
            <label class="form-label">Scan Depth</label>
            <select class="form-select" id="sample-strategy">
              <option value="full">Check Every Row (Recommended)</option>
              <option value="head">Check First 50,000 Rows</option>
            </select>
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Full scan checks every row for errors and duplicates.
            </span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button class="btn btn-outline" id="btn-back-projects">Back to Projects</button>
        <button class="btn btn-primary" id="btn-start-profiling">
          Check Data & Find Issues →
        </button>
      </div>
    </div>
  `;

  const dropzone = container.querySelector("#dataset-dropzone");
  const fileInput = container.querySelector("#file-input");
  const dropzoneTitle = container.querySelector("#dropzone-title");
  const dropzoneSub = container.querySelector("#dropzone-sub");
  const progressCard = container.querySelector("#upload-progress-card");
  const progressBar = container.querySelector("#upload-progress-bar");
  const pctBadge = container.querySelector("#upload-pct-badge");
  const statusMsg = container.querySelector("#upload-status-msg");
  const uploadFilename = container.querySelector("#upload-filename");

  dropzone?.addEventListener("click", () => fileInput?.click());
  container.querySelector("#btn-browse-file")?.addEventListener("click", () => fileInput?.click());

  dropzone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--accent-light)";
  });

  dropzone?.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "var(--border-medium)";
  });

  dropzone?.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--border-medium)";
    if (e.dataTransfer.files.length) {
      setFile(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener("change", (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
    }
  });

  function setFile(file) {
    selectedFile = file;
    dropzoneTitle.innerHTML = `Selected: <span style="color: var(--accent-light);">${file.name}</span>`;
    dropzoneSub.innerHTML = `File size: <strong>${(file.size / (1024 * 1024)).toFixed(2)} MB</strong>. Click "Check Data & Find Issues" below to proceed.`;
  }

  container.querySelector("#btn-start-profiling")?.addEventListener("click", async () => {
    if (!selectedFile) {
      fileInput?.click();
      return;
    }
    await uploadRealFile(selectedFile);
  });

  container.querySelector("#btn-load-sample-csv")?.addEventListener("click", async () => {
    progressCard.style.display = "block";
    uploadFilename.textContent = "Loading Customer_Master.csv (1,045 rows)";
    progressBar.style.width = "25%";
    pctBadge.textContent = "25%";
    pctBadge.className = "badge badge-low";
    statusMsg.textContent = "Fetching 1,045-row benchmark dataset...";

    try {
      progressBar.style.width = "50%";
      pctBadge.textContent = "50%";
      statusMsg.textContent = "Scanning columns, finding empty values, duplicate records, and RFC errors...";

      await ApiService.loadDemoDataset((p) => {
        progressBar.style.width = `${p}%`;
        pctBadge.textContent = `${p}%`;
      });

      progressBar.style.width = "100%";
      pctBadge.textContent = "100%";
      pctBadge.className = "badge badge-success";
      statusMsg.textContent = "Dataset loaded and issues profiled successfully!";

      setTimeout(() => {
        window.location.hash = "#issues";
      }, 500);
    } catch (e) {
      pctBadge.textContent = "Failed";
      pctBadge.className = "badge badge-critical";
      statusMsg.textContent = `Error loading demo dataset: ${e.message}`;
    }
  });

  container.querySelector("#btn-back-projects")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });

  async function uploadRealFile(file) {
    progressCard.style.display = "block";
    uploadFilename.textContent = `Uploading ${file.name}`;
    progressBar.style.width = "20%";
    pctBadge.textContent = "20%";
    statusMsg.textContent = "Uploading file...";

    try {
      progressBar.style.width = "60%";
      pctBadge.textContent = "60%";
      statusMsg.textContent = "Scanning columns, finding empty values and duplicate records...";

      const result = await ApiService.uploadDataset(file, (p) => {
        progressBar.style.width = `${p}%`;
        pctBadge.textContent = `${p}%`;
      });

      progressBar.style.width = "100%";
      pctBadge.textContent = "100%";
      pctBadge.className = "badge badge-success";
      statusMsg.textContent = `Done! Scanned ${result?.recordsCount || 0} rows across ${result?.columnsCount || 0} columns.`;

      setTimeout(() => {
        // Go directly to Step 2: Errors & Issues!
        window.location.hash = "#issues";
      }, 600);
    } catch (err) {
      progressBar.style.width = "100%";
      pctBadge.className = "badge badge-critical";
      pctBadge.textContent = "Failed";
      statusMsg.textContent = `Upload error: ${err.message}`;
    }
  }
}
