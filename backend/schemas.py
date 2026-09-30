"""
Pydantic Schemas for Agentic Data Cleaning Planner API
"""

from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field
from enum import Enum


class DataSourceType(str, Enum):
    CSV = "csv"
    EXCEL = "excel"
    DATABASE = "database"
    API = "api"
    PARQUET = "parquet"


class IssueSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IssueType(str, Enum):
    DUPLICATE = "Possible Duplicate"
    INVALID_FORMAT = "Invalid Emails"
    MISSING_VALUE = "Missing Values"
    PHONE_FORMAT = "Phone Format Inconsistency"
    OUTLIER = "Potential Anomalies"


class OperationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXECUTED = "executed"
    ROLLED_BACK = "rolled_back"


class QualityDimensions(BaseModel):
    completeness: float = Field(..., ge=0, le=100)
    consistency: float = Field(..., ge=0, le=100)
    validity: float = Field(..., ge=0, le=100)
    uniqueness: float = Field(..., ge=0, le=100)
    overall_score: float = Field(..., ge=0, le=100)


class ColumnProfile(BaseModel):
    name: str
    type: str
    semanticRole: str
    uniquePct: float
    missingPct: float
    validityPct: float
    inferredConstraint: str
    potentialAnomalies: int
    sampleValues: List[str] = []
    status: str = "good"  # "good", "warning", "danger"
    statusNote: str = ""


class DatasetOverview(BaseModel):
    id: str
    name: str
    fileSize: str
    recordsCount: int
    columnsCount: int
    uploadedAt: str
    lastAnalyzed: str
    qualityScore: int
    dimensions: Dict[str, float]
    profilingSummary: Dict[str, Any]


class DataIssue(BaseModel):
    id: str
    type: str
    category: str
    severity: str
    affectedRecords: int
    affectedColumns: List[str]
    confidence: float
    explanation: str
    recommendedAction: str
    safeToAutoApprove: bool = True


class CleaningOperation(BaseModel):
    stepId: int
    title: str
    actionType: str
    targetColumns: List[str]
    reason: str
    affectedRecords: int
    confidence: float
    estimatedImpact: str
    informationLossLevel: str  # "None", "Low", "Medium", "High"
    entropyDelta: float
    isReversible: bool = True
    approved: bool = True


class CleaningPlan(BaseModel):
    planId: str
    datasetId: str
    generatedAt: str
    agentModel: str
    totalRecordsAffected: int
    estimatedRuntimeSeconds: float
    overallEntropyLoss: float
    operations: List[CleaningOperation]


class DuplicateCandidatePair(BaseModel):
    id: str
    confidence: float
    matchReason: str
    recordA: Dict[str, Any]
    recordB: Dict[str, Any]
    status: str = "pending"  # "merged", "separated", "ignored", "pending"


class ValidationRuleResult(BaseModel):
    id: str
    name: str
    category: str
    status: str  # "PASS", "WARNING", "FAIL"
    executionTime: str
    recordsEvaluated: int
    description: str
    codeSnippet: str


class ValidationSuite(BaseModel):
    suiteId: str
    totalTests: int
    passedCount: int
    warningCount: int
    failedCount: int
    readinessStatus: str
    rules: List[ValidationRuleResult]


class AuditEntry(BaseModel):
    id: str
    timestamp: str
    operation: str
    recordsAffected: int
    operator: str
    userApproval: str
    status: str
    checksum: str
    rollbackAvailable: bool


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    sourceType: Optional[str] = "csv"
    datasetName: Optional[str] = "dataset.csv"


class Project(BaseModel):
    id: str
    name: str
    datasetName: str
    description: str
    sourceType: str
    recordsCount: int
    columnsCount: int
    qualityScore: int
    issuesCount: int
    status: str
    lastUpdated: str
    dimensions: Dict[str, float]


class DecisionRequest(BaseModel):
    pairId: str
    decision: str  # "merged", "separated", "ignored"


class SettingsPayload(BaseModel):
    primaryModel: str = "claude-3-5-sonnet"
    temperature: float = 0.10
    maxIterations: int = 8
    maxEntropyLoss: float = 0.15
    autoApproveConfidence: int = 95
    engine: str = "polars"
    workerMemory: str = "16 GB"
    timeoutSeconds: int = 300
    dbConnectionString: str = "sqlite:///./backend/data/acudata.db"
