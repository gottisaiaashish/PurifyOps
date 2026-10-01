/**
 * View 4: Upload Dataset
 * Clean 2-Color UI (Obsidian Slate + Violet Accent, Zero Noisy Badges)
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderUploadDataset(container) {
  let selectedFile = null;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 4px;">
          <span style="font-size: var(--text-xs); color: var(--text-muted); font-weight: 500;">Step 1 of 5 •</span>
        </div>
        <h1>Upload Your Data File</h1>
        <p class="page-description">Upload your CSV, TSV, or Excel spreadsheet to find and fix errors automatically.</p>
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
          Supported formats: CSV, Excel (.xlsx), TSV, and JSON files.
        </p>
        <input type="file" id="file-input" style="display: none;" accept=".csv,.tsv,.xlsx,.xls,.parquet,.json" />
        <div style="font-size: var(--text-xs); color: var(--text-muted); font-family: var(--font-mono);">
          CSV • EXCEL (.XLSX) • TSV • JSON
        </div>
      </div>


      <!-- Upload Progress Container (Hidden by default) -->
      <div id="upload-progress-card" class="metric-card" style="display: none; margin: 24px 0;">
        <div class="metric-card-header">
          <span class="metric-label" id="upload-filename">Processing File...</span>
          <span style="font-size: var(--text-xs); color: var(--accent-light); font-weight: 600;" id="upload-pct-badge">0%</span>
        </div>
        <div class="progress-track" style="margin: 8px 0;">
          <div class="progress-fill" id="upload-progress-bar" style="width: 0%;"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); display: flex; justify-content: space-between;">
          <span id="upload-status-msg">Reading file...</span>
          <span>Fast Analysis</span>
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



  async function uploadRealFile(file) {
    progressCard.style.display = "block";
    uploadFilename.textContent = `Uploading ${file.name}...`;
    progressBar.style.width = "15%";
    pctBadge.textContent = "15%";

    try {
      const activeProjId = stateStore.getState().activeProjectId || stateStore.getState().projects[0]?.id || "proj-001";
      await ApiService.uploadDatasetFile(activeProjId, file, pct => {
        progressBar.style.width = `${pct}%`;
        pctBadge.textContent = `${pct}%`;
      });

      progressBar.style.width = "100%";
      pctBadge.textContent = "100%";
      statusMsg.textContent = "File analyzed successfully!";

      setTimeout(() => {
        window.location.hash = "#issues";
      }, 400);
    } catch (e) {
      console.error("File upload error:", e);
      statusMsg.textContent = "Error parsing file. Please check format.";
    }
  }

  container.querySelector("#btn-back-projects")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });
}
