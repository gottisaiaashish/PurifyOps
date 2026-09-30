# PurifyOps — Agentic Data Cleaning & Quality Operations Platform (PNG6)

> **Theme:** Generative AI and LLM Applications  
> **Statement ID:** PNG6  
> **Product Architecture:** PurifyOps Enterprise Autonomous Reversible Cleaning Pipeline Platform

---

## 🌟 Executive Overview

**PurifyOps** is an enterprise AI data-quality platform engineered to autonomously profile messy, unstructured, or relational datasets, infer hidden semantic constraints, formulate reversible cleaning plans, and calculate mathematical information loss (Shannon Entropy) prior to execution.

The platform is structured into production-grade **Frontend** and **Backend** architectures:
- **`frontend/`**: Enterprise UI with Zero Build Dependencies (HTML5, Vanilla CSS3, Modern ES Modules).
- **`backend/`**: FastAPI production application with deterministic profilers, Shannon entropy calculus, test assertions, and reversible delta tracking.

---

## 📂 Project Directory Structure

```text
agentic-data-cleaning-planner/
├── frontend/                     # Complete Enterprise Frontend UI
│   ├── index.html                # App shell, responsive sidebar & 13-stage journey stepper
│   ├── css/
│   │   ├── tokens.css            # Dark slate design system tokens, cyan accents
│   │   ├── layout.css            # Layout shell, responsive viewport & drawer styles
│   │   ├── components.css        # Data tables, radial progress gauges, metric cards, badges
│   │   └── views.css             # Dedicated styling: diff viewer, streaming terminal, test matrix
│   └── js/
│       ├── app.js                # Client-side router, stepper controller, state subscriptions
│       ├── data/
│       │   └── mockData.js       # Base data definitions & seed structures
│       ├── models/
│       │   └── types.js          # Client-side enum constants and schemas
│       ├── services/
│       │   ├── apiService.js     # Live HTTP fetch client connecting to FastAPI backend
│       │   └── stateManager.js   # Reactive state store with LocalStorage persistence
│       └── views/                # 15 Complete Page View Renderers
│           ├── dashboardView.js
│           ├── projectsView.js
│           ├── createProjectView.js
│           ├── uploadDatasetView.js
│           ├── datasetOverviewView.js
│           ├── dataProfileView.js
│           ├── issuesView.js
│           ├── cleaningPlanView.js
│           ├── impactAnalysisView.js
│           ├── reviewApprovalView.js
│           ├── validationView.js
│           ├── executionView.js
│           ├── resultsView.js
│           ├── auditHistoryView.js
│           └── settingsView.js
│
├── backend/                      # Production Python / FastAPI Backend
│   ├── main.py                   # FastAPI server, REST routes, CORS & static frontend mount
│   ├── schemas.py                # Pydantic v2 data models for API contracts
│   ├── database.py               # Persistent datastore for projects, datasets, plans & audit logs
│   ├── profiler.py               # Autonomous dataset profiler, anomaly detection & quality scores
│   ├── agent_planner.py          # AI Cleaning DAG generator & human-in-the-loop candidate pairing
│   ├── entropy_engine.py         # Shannon Entropy (ΔH) calculus & information loss estimation
│   ├── executor.py               # Transformation execution engine with SHA-256 delta snapshots
│   ├── validator.py              # Automated test-driven assertion suite
│   ├── data/
│   │   ├── Customer_Master.csv   # Real enterprise sample dataset with duplicates and anomalies
│   │   └── app_state.json        # Persistent application database
│   ├── uploads/                  # Ingested datasets directory
│   └── ARCHITECTURE.md           # System architecture, information loss formulas & pipeline specs
```

---

## ⚡ Running the Production Application

### 1. Launch FastAPI Backend (Unified Server)
Run the backend with Uvicorn:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

### 2. Access the Platform
- **Enterprise Web App:** Open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) in your browser.
- **Interactive API Documentation (Swagger UI):** Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).
- **Alternative ReDoc:** Open [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc).

---

## 🛡️ Production Capabilities

1. **Deterministic Dataset Profiling**:
   - Computes empirical missing %, uniqueness %, format validity %, and inferred semantic constraints (`RFC-5322 Email`, `ITU-T E.164 Phone`, `Domain Bounds`).
   - Calculates 4-dimensional data quality scores: Completeness, Consistency, Validity, and Uniqueness.
2. **Shannon Entropy Loss ($\Delta H$) Calculus**:
   - Calculates empirical probability distribution delta $H(X) = - \sum P(x) \log_2 P(x)$ to prevent irreversible destructive modifications.
3. **Agentic Directed Acyclic Graph (DAG) Formulation**:
   - Formulates ordered transformation steps (Entity Deduplication → Standardization → Syntax Cleansing → Imputation → Boundary Clamping).
4. **Human-in-the-Loop Review**:
   - Side-by-side golden record vs candidate diff resolution (Merge, Separate, Ignore).
5. **Cryptographic Lineage & 1-Click Rollback**:
   - Every transformation commits a cryptographic SHA-256 delta hash enabling bit-for-bit state reversion.
