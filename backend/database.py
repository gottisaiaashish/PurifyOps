"""
PurifyOps - Persistent Database Engine (MongoDB Atlas + Fallback Local Persistence)
Zero Dummy Data - Clean Enterprise State
"""

import os
import sys
import json
from typing import Dict, Any, List, Optional
from datetime import datetime

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)
for p in [CURRENT_DIR, PARENT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from profiler import profile_columns, calculate_quality_dimensions, detect_issues
from agent_planner import generate_dag_cleaning_plan, find_duplicate_candidate_pairs
from validator import run_validation_suite
from entropy_engine import analyze_dataset_impact
from executor import execute_pipeline_transformations

DATA_DIR = os.path.join(CURRENT_DIR, "data")
UPLOADS_DIR = os.path.join(CURRENT_DIR, "uploads")
DB_FILE = os.path.join(DATA_DIR, "app_state.json")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)


def get_mongo_client():
    uri = os.environ.get("MONGODB_URI")
    if not uri:
        # Check .env file
        env_path = os.path.join(PARENT_DIR, ".env")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("MONGODB_URI="):
                        uri = line.strip().split("=", 1)[1]
                        break

    if uri:
        try:
            import pymongo
            client = pymongo.MongoClient(uri, serverSelectionTimeoutMS=4000)
            # Verify connection
            client.admin.command('ping')
            print("[PurifyOps Database] Connected to MongoDB Atlas successfully!")
            return client
        except Exception as e:
            print(f"[PurifyOps Database] MongoDB connection failed ({e}), using local file persistence.")
            return None
    return None


class Database:
    def __init__(self):
        self.mongo_client = get_mongo_client()
        self.mongo_db = self.mongo_client["purifyops"] if self.mongo_client else None
        
        # Clean production state (Zero dummy data)
        self.state: Dict[str, Any] = {
            "projects": [],
            "datasets": {},
            "plans": {},
            "review_pairs": {},
            "validations": {},
            "audit_history": {},
            "execution_logs": {},
            "results": {},
            "settings": {
                "primaryModel": "claude-3-5-sonnet",
                "temperature": 0.10,
                "maxIterations": 8,
                "maxEntropyLoss": 0.15,
                "autoApproveConfidence": 95,
                "engine": "polars",
                "workerMemory": "16 GB",
                "timeoutSeconds": 300,
                "dbConnectionString": "MongoDB Atlas" if self.mongo_db is not None else "Local Storage"
            }
        }
        self.load()

    def save(self):
        # Save to MongoDB if available
        if self.mongo_db is not None:
            try:
                for proj in self.state["projects"]:
                    self.mongo_db.projects.update_one({"id": proj["id"]}, {"$set": proj}, upsert=True)
                for proj_id, ds in self.state["datasets"].items():
                    self.mongo_db.datasets.update_one({"id": proj_id}, {"$set": ds}, upsert=True)
                for proj_id, plan in self.state["plans"].items():
                    self.mongo_db.plans.update_one({"id": proj_id}, {"$set": plan}, upsert=True)
            except Exception as e:
                print(f"[PurifyOps Database] MongoDB save error: {e}")

        # Always persist to disk as backup
        try:
            with open(DB_FILE, "w", encoding="utf-8") as f:
                json.dump(self.state, f, indent=2, default=str)
        except Exception as e:
            print(f"[PurifyOps Database] Local save error: {e}")

    def load(self):
        # Load from MongoDB if available
        if self.mongo_db is not None:
            try:
                projects = list(self.mongo_db.projects.find({}, {"_id": 0}))
                if projects:
                    self.state["projects"] = projects
                datasets = list(self.mongo_db.datasets.find({}, {"_id": 0}))
                for d in datasets:
                    self.state["datasets"][d["id"]] = d
                return
            except Exception as e:
                print(f"[PurifyOps Database] MongoDB load error: {e}")

        # Otherwise load from local DB_FILE if exists
        if os.path.exists(DB_FILE):
            try:
                with open(DB_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        self.state = data
            except Exception as e:
                print(f"[PurifyOps Database] Local load error: {e}")

    def clear_all_data(self):
        """Wipes all dummy or test data for a completely clean start."""
        self.state["projects"] = []
        self.state["datasets"] = {}
        self.state["plans"] = {}
        self.state["review_pairs"] = {}
        self.state["validations"] = {}
        self.state["audit_history"] = {}
        self.state["execution_logs"] = {}
        self.state["results"] = {}
        
        if self.mongo_db is not None:
            try:
                self.mongo_db.projects.delete_many({})
                self.mongo_db.datasets.delete_many({})
                self.mongo_db.plans.delete_many({})
            except Exception:
                pass
        self.save()

    def get_projects(self) -> List[Dict[str, Any]]:
        return self.state["projects"]

    def delete_project(self, project_id: str) -> bool:
        """Deletes a project and all associated datasets, plans, and logs from DB."""
        initial_len = len(self.state["projects"])
        self.state["projects"] = [p for p in self.state["projects"] if str(p.get("id")) != str(project_id)]
        
        self.state["datasets"].pop(project_id, None)
        self.state["plans"].pop(project_id, None)
        self.state["review_pairs"].pop(project_id, None)
        self.state["validations"].pop(project_id, None)
        self.state["audit_history"].pop(project_id, None)
        self.state["execution_logs"].pop(project_id, None)
        self.state["results"].pop(project_id, None)
        
        if self.mongo_db is not None:
            try:
                self.mongo_db.projects.delete_one({"id": project_id})
                self.mongo_db.datasets.delete_one({"id": project_id})
                self.mongo_db.plans.delete_one({"id": project_id})
            except Exception as e:
                print(f"[PurifyOps Database] MongoDB delete error: {e}")
                
        self.save()
        return len(self.state["projects"]) < initial_len

    def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        proj_id = f"proj-{datetime.now().strftime('%M%S')}"
        project = {
            "id": proj_id,
            "name": project_data.get("name", "Untitled Project"),
            "datasetName": project_data.get("datasetName", "Pending Upload"),
            "description": project_data.get("description", "Enterprise data cleaning initiative"),
            "sourceType": project_data.get("sourceType", "csv"),
            "recordsCount": 0,
            "columnsCount": 0,
            "qualityScore": 0,
            "issuesCount": 0,
            "status": "In Progress",
            "lastUpdated": "Just now",
            "dimensions": {"completeness": 0, "consistency": 0, "validity": 0, "uniqueness": 0}
        }
        self.state["projects"].insert(0, project)
        self.save()
        return project

    def register_uploaded_dataset(self, proj_id: str, filename: str, filepath: str, filesize: str) -> Dict[str, Any]:
        import csv
        records = []
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            reader = csv.DictReader(f)
            records = list(reader)

        profiles = profile_columns(records)
        dims = calculate_quality_dimensions(records, profiles)
        issues = detect_issues(records, profiles)
        plan = generate_dag_cleaning_plan(issues, proj_id)
        review_pairs = find_duplicate_candidate_pairs(records)
        validation = run_validation_suite(records)
        impact = analyze_dataset_impact(records, records)

        ds_info = {
            "id": f"ds-{proj_id}",
            "name": filename,
            "fileSize": filesize,
            "recordsCount": len(records),
            "columnsCount": len(profiles),
            "uploadedAt": "Just now",
            "lastAnalyzed": "Just now",
            "qualityScore": dims["overall_score"],
            "dimensions": dims,
            "profilingSummary": {
                "totalCells": len(records) * len(profiles),
                "missingCells": sum(int(p["missingPct"] * len(records) / 100) for p in profiles),
                "duplicateRows": sum(1 for iss in issues if iss["type"] == "Possible Duplicate"),
                "inferredPrimaryKeys": [p["name"] for p in profiles if "ID" in p["semanticRole"]],
                "entropyLossIndex": "Low (< 0.05)"
            },
            "rawRecords": records,
            "cleanedRecords": records,
            "profiles": profiles,
            "issues": issues,
            "impact": impact
        }

        self.state["datasets"][proj_id] = ds_info
        self.state["plans"][proj_id] = plan
        self.state["review_pairs"][proj_id] = review_pairs
        self.state["validations"][proj_id] = validation
        self.state["audit_history"][proj_id] = []

        # Update project record
        for p in self.state["projects"]:
            if p["id"] == proj_id:
                p["datasetName"] = filename
                p["recordsCount"] = len(records)
                p["columnsCount"] = len(profiles)
                p["qualityScore"] = dims["overall_score"]
                p["issuesCount"] = sum(iss["affectedRecords"] for iss in issues)
                p["dimensions"] = dims
                p["status"] = "Needs Review"
                p["lastUpdated"] = "Just now"

        self.save()
        return ds_info


db = Database()

# Ensure Customer_Master.csv is registered as default benchmark dataset if empty
if not db.state.get("projects") or "proj-001" not in db.state.get("datasets", {}):
    master_csv = os.path.join(DATA_DIR, "Customer_Master.csv")
    if os.path.exists(master_csv):
        if not db.state.get("projects"):
            db.state["projects"] = [{
                "id": "proj-001",
                "name": "Customer Master Data Quality Audit",
                "datasetName": "Customer_Master.csv",
                "description": "Enterprise customer dataset quality audit and autonomous cleaning pipeline",
                "sourceType": "csv",
                "recordsCount": 1045,
                "columnsCount": 13,
                "qualityScore": 58,
                "issuesCount": 1321,
                "status": "Needs Review",
                "lastUpdated": "Just now",
                "dimensions": {"completeness": 72, "consistency": 65, "validity": 60, "uniqueness": 75}
            }]
        size_mb = f"{round(os.path.getsize(master_csv) / (1024 * 1024), 2)} MB"
        db.register_uploaded_dataset("proj-001", "Customer_Master.csv", master_csv, size_mb)

