/**
 * PurifyOps - Main Application Router & Controller
 * Streamlined 5-step workflow & OpenAI Data Assistant Integration
 */

import { stateStore } from "./services/stateManager.js";
import { ApiService } from "./services/apiService.js";
import { renderDashboard } from "./views/dashboardView.js";
import { renderProjects } from "./views/projectsView.js";
import { renderCreateProject } from "./views/createProjectView.js";
import { renderUploadDataset } from "./views/uploadDatasetView.js";
import { renderDatasetOverview } from "./views/datasetOverviewView.js";
import { renderDataProfile } from "./views/dataProfileView.js";
import { renderIssues } from "./views/issuesView.js";
import { renderCleaningPlan } from "./views/cleaningPlanView.js";
import { renderImpactAnalysis } from "./views/impactAnalysisView.js";
import { renderReviewApproval } from "./views/reviewApprovalView.js";
import { renderValidation } from "./views/validationView.js";
import { renderExecution } from "./views/executionView.js";
import { renderResults } from "./views/resultsView.js";
import { renderAuditHistory } from "./views/auditHistoryView.js";
import { renderSettings } from "./views/settingsView.js";

// Streamlined 5 Core Steps for progress tracking
const PIPELINE_ORDER = [
  "upload-dataset",
  "issues",
  "cleaning-plan",
  "execution",
  "results"
];

// Map of route hash to view render functions
const ROUTES = {
  "dashboard": { id: "view-dashboard", render: renderDashboard },
  "projects": { id: "view-projects", render: renderProjects },
  "create-project": { id: "view-create-project", render: renderCreateProject },
  "upload-dataset": { id: "view-upload-dataset", render: renderUploadDataset },
  "dataset-overview": { id: "view-dataset-overview", render: renderDatasetOverview },
  "data-profile": { id: "view-data-profile", render: renderDataProfile },
  "issues": { id: "view-issues", render: renderIssues },
  "cleaning-plan": { id: "view-cleaning-plan", render: renderCleaningPlan },
  "impact-analysis": { id: "view-impact-analysis", render: renderImpactAnalysis },
  "review-approval": { id: "view-review-approval", render: renderReviewApproval },
  "validation": { id: "view-validation", render: renderValidation },
  "execution": { id: "view-execution", render: renderExecution },
  "results": { id: "view-results", render: renderResults },
  "audit-history": { id: "view-audit-history", render: renderAuditHistory },
  "settings": { id: "view-settings", render: renderSettings }
};

let currentRoute = "dashboard";

function navigateTo(route) {
  if (!ROUTES[route]) {
    route = "dashboard";
  }
  currentRoute = route;

  // Hide all view containers
  document.querySelectorAll(".view-container").forEach(c => {
    c.classList.remove("active");
  });

  // Activate target container and render
  const targetConfig = ROUTES[route];
  const targetElem = document.getElementById(targetConfig.id);
  if (targetElem) {
    targetElem.classList.add("active");
    targetConfig.render(targetElem);
  }

  // Update Sidebar active state
  document.querySelectorAll(".sidebar-nav .nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.route === route);
  });

  // Update Pipeline Stepper track
  const currentStepIndex = PIPELINE_ORDER.indexOf(route);
  document.querySelectorAll(".pipeline-stepper .stepper-stage").forEach(stage => {
    const stageRoute = stage.dataset.step;
    const stageIndex = PIPELINE_ORDER.indexOf(stageRoute);

    stage.classList.remove("active", "completed");
    if (stageRoute === route) {
      stage.classList.add("active");
    } else if (currentStepIndex !== -1 && stageIndex !== -1 && stageIndex < currentStepIndex) {
      stage.classList.add("completed");
    }
  });

  // Update topbar project name dynamically
  const projElem = document.getElementById("current-project-name");
  const state = stateStore.getState();
  if (projElem) {
    const activeDs = state.activeDataset;
    if (activeDs && activeDs.name && activeDs.name !== "No Dataset Loaded") {
      projElem.textContent = activeDs.name;
    } else if (state.projects && state.projects.length > 0) {
      projElem.textContent = state.projects[0].name;
    } else {
      projElem.textContent = "No Active Project";
    }
  }

  // Update sidebar issues count badge
  const issuesBadge = document.getElementById("sidebar-issues-badge");
  if (issuesBadge) {
    const count = (state.issues || []).length;
    if (count > 0) {
      issuesBadge.textContent = count.toLocaleString();
      issuesBadge.style.display = "inline-flex";
    } else {
      issuesBadge.style.display = "none";
    }
  }

  // Scroll viewport to top
  const viewport = document.querySelector(".page-viewport");
  if (viewport) viewport.scrollTop = 0;
}

// Global Toast System
export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// AI Assistant Drawer Controller
function initAiDrawer() {
  const btnOpen = document.getElementById("btn-open-ai-helper");
  const drawer = document.getElementById("ai-drawer");
  const backdrop = document.getElementById("ai-drawer-backdrop");
  const btnClose = document.getElementById("ai-drawer-close");
  const input = document.getElementById("ai-drawer-input");
  const btnSend = document.getElementById("ai-drawer-send");
  const messages = document.getElementById("ai-drawer-messages");

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add("active");
    backdrop.classList.add("active");
    input.focus();
  };

  const closeDrawer = () => {
    drawer.classList.remove("active");
    backdrop.classList.remove("active");
  };

  btnOpen?.addEventListener("click", openDrawer);
  btnClose?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);

  const sendQuestion = async (queryText) => {
    const text = queryText || input.value.trim();
    if (!text) return;
    if (!queryText) input.value = "";

    // User message bubble
    const userMsg = document.createElement("div");
    userMsg.className = "ai-message user";
    userMsg.textContent = text;
    messages.appendChild(userMsg);

    // Typing bubble
    const botMsg = document.createElement("div");
    botMsg.className = "ai-message bot";
    botMsg.innerHTML = "Thinking...";
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;

    // Gather context
    const state = stateStore.getState();
    const ds = state.activeDataset || {};
    const issues = state.issues || [];
    const context = {
      datasetName: ds.name || "Untitled Dataset",
      issuesSummary: issues.map(i => `${i.type} (${i.affectedRecords} records)`).join(", "),
      columnsSummary: (state.columnsProfile || []).map(c => c.name).join(", ")
    };

    try {
      const reply = await ApiService.askAiHelper(text, context);
      botMsg.textContent = reply;
    } catch (e) {
      botMsg.textContent = "Sorry, unable to connect to AI assistant right now. Please try again.";
    }
    messages.scrollTop = messages.scrollHeight;
  };

  btnSend?.addEventListener("click", () => sendQuestion());
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendQuestion();
  });

  // Quick Chips
  document.querySelectorAll(".ai-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const p = chip.dataset.prompt;
      if (p) sendQuestion(p);
    });
  });
}

// Setup Event Listeners
function initApp() {
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "") || "dashboard";
    navigateTo(hash);
  });

  document.querySelectorAll(".pipeline-stepper .stepper-stage").forEach(stage => {
    stage.addEventListener("click", () => {
      const step = stage.dataset.step;
      if (step) {
        window.location.hash = `#${step}`;
      }
    });
  });

  document.getElementById("topbar-project-btn")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });

  stateStore.on("state:changed", () => {
    const activeRouteConfig = ROUTES[currentRoute];
    const activeElem = document.getElementById(activeRouteConfig.id);
    if (activeElem && activeRouteConfig) {
      activeRouteConfig.render(activeElem);
    }
  });

  initAiDrawer();

  const initialHash = window.location.hash.replace("#", "") || "dashboard";
  navigateTo(initialHash);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
