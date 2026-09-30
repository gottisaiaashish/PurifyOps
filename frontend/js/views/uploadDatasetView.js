/**
 * View 4: Upload Dataset
 */
import { stateStore } from "../services/stateManager.js";
import { ApiService } from "../services/apiService.js";

export function renderUploadDataset(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title-group">
        <h1>Upload Enterprise Dataset</h1>
        <p class="page-description">Ingest raw telemetry, tabular schemas, or relational snapshots for automated agentic profiling.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-outline" id="btn-demo-load">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          Load Enterprise Demo (Customer_Master.csv)
        </button>
      </div>
    </div>

    <div style="max-width: 860px; margin: 0 auto;">
      <div class="dropzone-container" id="dataset-dropzone">
        <div class="dropzone-icon">☁️</div>
        <h3 style="font-size: var(--text-lg); font-weight: 600; margin-bottom: var(--space-2);">
          Drag & Drop your dataset here, or <span style="color: var(--accent-light); text-decoration: underline;">browse files</span>
        </h3>
        <p style="font-size: var(--text-sm); color: var(--text-muted); max-width: 480px; margin: 0 auto var(--space-4);">
          Supports CSV, TSV, Parquet, JSONL, and Excel files up to 2.5 GB. Automatically infer schema, null tokens, and column distributions.
        </p>
        <input type="file" id="file-input" style="display: none;" accept=".csv,.xlsx,.xls,.parquet,.json" />
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
          <span class="metric-label" id="upload-filename">Processing Customer_Master.csv</span>
          <span class="badge badge-low" id="upload-pct-badge">45%</span>
        </div>
        <div class="progress-track" style="margin: var(--space-2) 0;">
          <div class="progress-fill" id="upload-progress-bar" style="width: 45%;"></div>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-muted); display: flex; justify-content: space-between;">
          <span id="upload-status-msg">Scanning schema headers and sampling first 1,000 rows...</span>
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
            <input type="text" class="form-input" value="NA, N/A, null, NULL, -, None, \\N" />
            <span style="font-size: 11px; color: var(--text-muted); margin-top: 4px; display: block;">
              Strings automatically coerced to standard null representation.
            </span>
          </div>
          <div>
            <label class="form-label">Sampling Strategy</label>
            <select class="form-select">
              <option value="full">Exhaustive Full Scan (Recommended for < 1M rows)</option>
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
  const progressCard = container.querySelector("#upload-progress-card");
  const progressBar = container.querySelector("#upload-progress-bar");
  const pctBadge = container.querySelector("#upload-pct-badge");
  const statusMsg = container.querySelector("#upload-status-msg");

  dropzone?.addEventListener("click", () => fileInput?.click());

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
      handleFile(e.dataTransfer.files[0]);
    }
  });

  fileInput?.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  function handleFile(file) {
    simulateUpload(file.name, `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
  }

  container.querySelector("#btn-demo-load")?.addEventListener("click", () => {
    simulateUpload("Customer_Master.csv", "4.8 MB");
  });

  container.querySelector("#btn-start-profiling")?.addEventListener("click", () => {
    simulateUpload("Customer_Master.csv", "4.8 MB");
  });

  container.querySelector("#btn-back-projects")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });

  function simulateUpload(name, size) {
    progressCard.style.display = "block";
    let progress = 10;
    progressBar.style.width = "10%";
    pctBadge.textContent = "10%";
    statusMsg.textContent = `Uploading ${name} (${size}) to sandboxed storage...`;

    const interval = setInterval(() => {
      progress += 20;
      if (progress >= 100) {
        clearInterval(interval);
        progressBar.style.width = "100%";
        pctBadge.textContent = "100%";
        pctBadge.className = "badge badge-success";
        statusMsg.textContent = "Schema registered. Statistical profiling completed in 0.42s.";

        ApiService.uploadDataset({ name, size }, () => {});

        setTimeout(() => {
          window.location.hash = "#dataset-overview";
        }, 600);
      } else {
        progressBar.style.width = `${progress}%`;
        pctBadge.textContent = `${progress}%`;
        if (progress > 50) {
          statusMsg.textContent = "Inferring column types & calculating Shannon entropy...";
        }
      }
    }, 150);
  }
}
