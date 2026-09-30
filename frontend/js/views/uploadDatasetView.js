/**
 * View 4: Upload Dataset
 * Real file upload pipeline with FastAPI backend ingestion
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderUploadDataset(container) {
  let selectedFile = null;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Upload Enterprise Dataset</h1>
        <p class="page-description">Ingest raw telemetry, tabular schemas, or relational snapshots for automated agentic profiling.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-browse-file">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Select File From Computer
        </button>
      </div>
    </div>

    <div style="max-width: 860px; margin: 0 auto;">
      <div class="dropzone-container" id="dataset-dropzone">
        <div class="dropzone-icon">☁️</div>
        <h3 style="font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-2);" id="dropzone-title">
          Drag & Drop your dataset here, or <span style="color: var(--accent-light); text-decoration: underline;">browse files</span>
        </h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted); max-width: 480px; margin: 0 auto var(--space-4);" id="dropzone-sub">
          Supports CSV, TSV, Parquet, JSONL, and Excel files up to 2.5 GB. Real column profiling, entropy delta, and zero mock data.
        </p>
        <input type="file" id="file-input" style="display: none;" accept=".csv,.tsv,.xlsx,.xls,.parquet,.json" />
        <div style="display: inline-flex; gap: var(--space-2);">
          <span class="badge badge-neutral">CSV</span>
          <span class="badge badge-neutral">XLSX</span>
          <span class="badge badge-neutral">PARQUET</span>
          <span class="badge badge-neutral">JSON</span>
        </div>
      </div>

      <!-- Upload Progress Container (Hidden by default) -->
      <div id="upload-progress-card" class="metric-card" style="display: none; margin-bottom: var(--space-6);">
        <div class="metric-card-header">
          <span class="metric-label" id="upload-filename">Processing Dataset...</span>
          <span class="badge badge-low" id="upload-pct-badge">0%</span>
        </div>
        <div class="progress-track" style="margin: var(--space-2) 0;">
          <div class="progress-fill" id="upload-progress-bar" style="width: 0%;"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); display: flex; justify-content: space-between;">
          <span id="upload-status-msg">Reading file...</span>
          <span>Polars Ingestion Engine</span>
        </div>
      </div>

      <!-- Ingestion Settings Panel -->
      <div class="settings-content-card" style="margin-bottom: var(--space-6);">
        <h4 style="font-size: var(--text-sm); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: var(--space-3);">
          Pre-Scan Profiling Parameters
        </h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
          <div>
            <label class="form-label">Null Value Sentinel Tokens</label>
            <input type="text" class="form-input" id="null-tokens" value="NA, N/A, null, NULL, -, None, \\N" />
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Strings automatically coerced to standard null representation.
            </span>
          </div>
          <div>
            <label class="form-label">Sampling Strategy</label>
            <select class="form-select" id="sample-strategy">
              <option value="full">Exhaustive Full Scan (Recommended)</option>
              <option value="reservoir">Reservoir Sample (100k rows)</option>
              <option value="head">First 50k rows only</option>
            </select>
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Ensures high-accuracy Shannon entropy & statistical distribution estimation.
            </span>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: var(--space-3);">
        <button class="btn btn-outline" id="btn-back-projects">Back to Projects</button>
        <button class="btn btn-primary" id="btn-start-profiling">
          Initiate Profiling & Overview →
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
    dropzone.classList.add("dragover");
  });

  dropzone?.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone?.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
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
    dropzoneSub.innerHTML = `File size: <strong>${(file.size / (1024 * 1024)).toFixed(2)} MB</strong>. Click "Initiate Profiling & Overview" to process.`;
  }

  container.querySelector("#btn-start-profiling")?.addEventListener("click", async () => {
    if (!selectedFile) {
      fileInput?.click();
      return;
    }
    await uploadRealFile(selectedFile);
  });

  container.querySelector("#btn-back-projects")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });

  async function uploadRealFile(file) {
    progressCard.style.display = "block";
    uploadFilename.textContent = `Uploading ${file.name}`;
    progressBar.style.width = "20%";
    pctBadge.textContent = "20%";
    statusMsg.textContent = "Streaming raw data to backend engine...";

    try {
      progressBar.style.width = "50%";
      pctBadge.textContent = "50%";
      statusMsg.textContent = "Parsing schema, null tokens & computing empirical entropy...";

      const result = await ApiService.uploadDataset(file, (p) => {
        progressBar.style.width = `${p}%`;
        pctBadge.textContent = `${p}%`;
      });

      progressBar.style.width = "100%";
      pctBadge.textContent = "100%";
      pctBadge.className = "badge badge-success";
      statusMsg.textContent = `Success! Parsed ${result?.recordsCount || 0} records across ${result?.columnsCount || 0} columns.`;

      setTimeout(() => {
        window.location.hash = "#dataset-overview";
      }, 700);
    } catch (err) {
      progressBar.style.width = "100%";
      pctBadge.className = "badge badge-critical";
      pctBadge.textContent = "Failed";
      statusMsg.textContent = `Upload error: ${err.message}`;
    }
  }
}
