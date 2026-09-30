/**
 * Agentic Data Cleaning Planner (PNG6)
 * Main Application Router & Controller
 */

import { stateStore } from "./services/stateManager.js";
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

// Ordered pipeline stages for progression tracking
const PIPELINE_ORDER = [
  "dashboard",
  "create-project",
  "upload-dataset",
  "dataset-overview",
  "data-profile",
  "issues",
  "cleaning-plan",
  "impact-analysis",
  "review-approval",
  "validation",
  "execution",
  "results",
  "audit-history"
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
  toast.innerHTML = `
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Setup Event Listeners
function initApp() {
  // Listen for hash changes
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "") || "dashboard";
    navigateTo(hash);
  });

  // Stepper clicks
  document.querySelectorAll(".pipeline-stepper .stepper-stage").forEach(stage => {
    stage.addEventListener("click", () => {
      const step = stage.dataset.step;
      if (step) {
        window.location.hash = `#${step}`;
      }
    });
  });

  // Topbar project selector
  document.getElementById("topbar-project-btn")?.addEventListener("click", () => {
    window.location.hash = "#projects";
  });

  // Re-render when state changes if on certain views
  stateStore.on("state:changed", () => {
    const activeRouteConfig = ROUTES[currentRoute];
    const activeElem = document.getElementById(activeRouteConfig.id);
    if (activeElem && activeRouteConfig) {
      activeRouteConfig.render(activeElem);
    }
  });

  // Initial navigation
  const initialHash = window.location.hash.replace("#", "") || "dashboard";
  navigateTo(initialHash);
}

// Run on DOM Ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
