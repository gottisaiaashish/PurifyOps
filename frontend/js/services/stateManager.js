/**
 * Agentic Data Cleaning Planner (PNG6)
 * Reactive State Store with LocalStorage Persistence & Event Dispatcher
 */

import { INITIAL_DATA } from "../data/mockData.js";

class StateManager {
  constructor() {
    this.storageKey = "purifyops_clean_v2";
    this.listeners = new Map();
    // Clear legacy mock caches
    try {
      localStorage.removeItem("purifyops_clean_v1");
      localStorage.removeItem("agentic_cleaner_state");
    } catch (_) {}
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load local storage state, using mock default.", e);
    }
    // Deep clone initial data
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(INITIAL_DATA));
    this.saveState();
    this.emit("state:changed", this.state);
  }

  getState() {
    return this.state;
  }

  // Event Subscription
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const filtered = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, filtered);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in state listener for ${event}:`, err);
        }
      });
    }
  }

  // --- Actions ---

  createProject(newProject) {
    const id = `proj-${Date.now().toString().slice(-4)}`;
    const project = {
      id,
      name: newProject.name || "Untitled Data Project",
      datasetName: newProject.datasetName || "No Dataset Uploaded",
      description: newProject.description || "Enterprise data cleaning initiative",
      sourceType: newProject.sourceType || "csv",
      recordsCount: newProject.recordsCount || 0,
      columnsCount: newProject.columnsCount || 0,
      qualityScore: 0,
      issuesCount: 0,
      status: "New",
      lastUpdated: "Just now",
      dimensions: {
        completeness: 0,
        consistency: 0,
        validity: 0,
        uniqueness: 0
      }
    };
    this.state.projects.unshift(project);
    this.state.platformMetrics.totalProjects += 1;
    this.saveState();
    this.emit("state:changed", this.state);
    return project;
  }

  uploadDatasetSimulation(fileMeta) {
    this.state.activeDataset.name = fileMeta.name || "Uploaded_Dataset.csv";
    this.state.activeDataset.fileSize = fileMeta.size || "6.2 MB";
    this.state.activeDataset.uploadedAt = "Just now";
    this.state.activeDataset.lastAnalyzed = "In progress...";
    this.state.platformMetrics.datasetsProcessed += 1;
    this.saveState();
    this.emit("state:changed", this.state);
  }

  toggleOperationApproval(stepId) {
    const op = this.state.cleaningPlan.operations.find(o => o.stepId === stepId);
    if (op) {
      op.approved = !op.approved;
      this.saveState();
      this.emit("state:changed", this.state);
    }
  }

  approveAllSafeOperations() {
    this.state.cleaningPlan.operations.forEach(op => {
      if (op.informationLossLevel === "None" || op.informationLossLevel === "Low") {
        op.approved = true;
      }
    });
    this.saveState();
    this.emit("state:changed", this.state);
  }

  decideReviewPair(pairId, decision) {
    const pair = this.state.reviewPairs.find(p => p.id === pairId);
    if (pair) {
      pair.status = decision;
      this.saveState();
      this.emit("state:changed", this.state);
    }
  }

  runValidationSuite() {
    // Simulates test-driven run
    this.state.validationSuite.rules.forEach(r => {
      if (r.id !== "val-04") {
        r.status = "PASS";
      }
    });
    this.state.validationSuite.readinessStatus = "READY_FOR_EXECUTION";
    this.saveState();
    this.emit("state:changed", this.state);
  }

  addExecutionLog(logItem) {
    this.state.executionLogs.push(logItem);
    this.saveState();
    this.emit("state:changed", this.state);
  }

  completeExecution() {
    const dataset = this.state.activeDataset || {};
    const rawRows = dataset.rawRecords || [];
    const issuesCount = (this.state.issues || []).length;
    const initialScore = dataset.qualityScore || 54;
    const finalScore = Math.min(99, Math.max(initialScore + 32, 95));

    dataset.qualityScore = finalScore;
    dataset.dimensions = {
      completeness: 98,
      consistency: 96,
      validity: 97,
      uniqueness: 99
    };

    const opsCount = (this.state.cleaningPlan?.operations || []).length || 5;

    this.state.resultsComparison = {
      beforeQualityScore: initialScore,
      afterQualityScore: finalScore,
      scoreDelta: `+${finalScore - initialScore}`,
      beforeIssuesCount: issuesCount,
      afterIssuesCount: 0,
      issuesResolvedPercent: 100,
      recordsProcessed: dataset.recordsCount || rawRows.length || 1045,
      transformationsApplied: opsCount,
      criticalTestsPassed: "4 / 4",
      sampleCleanedRows: rawRows.slice(0, 15).map((r, idx) => ({
        id: r.Customer_ID || `Row-${idx + 1}`,
        name: `${r.First_Name || ''} ${r.Last_Name || ''}`.trim() || 'Customer',
        email: (r.Email || '').replace('_at_', '@'),
        phone: r.Phone || '',
        status: 'Cleaned'
      }))
    };

    const activeProj = this.state.projects.find(p => p.id === "proj-001");
    if (activeProj) {
      activeProj.qualityScore = finalScore;
      activeProj.issuesCount = 0;
      activeProj.status = "Completed";
      activeProj.lastUpdated = "Just now";
    }
    this.state.platformMetrics.transformationsExecuted += opsCount * (dataset.recordsCount || 1000);
    this.saveState();
    this.emit("state:changed", this.state);
  }

  rollbackAuditEntry(auditId) {
    const entry = this.state.auditHistory.find(a => a.id === auditId);
    if (entry) {
      entry.status = "Rolled Back";
      entry.rollbackAvailable = false;
      this.saveState();
      this.emit("state:changed", this.state);
    }
  }
}

export const stateStore = new StateManager();
