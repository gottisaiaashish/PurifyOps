/**
 * Agentic Data Cleaning Planner (PNG6)
 * Data Models & Contract Definitions (JSDoc & Enums)
 */

export const DataSourceType = {
  CSV: "csv",
  EXCEL: "excel",
  DATABASE: "database",
  API: "api",
  PARQUET: "parquet"
};

export const IssueSeverity = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
};

export const IssueType = {
  DUPLICATE: "duplicate",
  INVALID_FORMAT: "invalid_format",
  MISSING_VALUE: "missing_value",
  OUTLIER: "outlier",
  REFERENTIAL_INTEGRITY: "referential_integrity"
};

export const OperationStatus = {
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  REJECTED: "rejected",
  EXECUTING: "executing",
  COMPLETED: "completed",
  ROLLED_BACK: "rolled_back"
};

export const ValidationStatus = {
  PASSED: "PASS",
  WARNING: "WARNING",
  FAILED: "FAIL"
};
