/**
 * Agentic Data Cleaning Planner (PNG6)
 * Enterprise Mock Datasets & State Seed
 */

export const INITIAL_DATA = {
  // Global Platform Telemetry
  platformMetrics: {
    totalProjects: 14,
    datasetsProcessed: 38,
    issuesDetected: 9840,
    transformationsExecuted: 28450,
    averageQualityScore: 68.4,
    dimensions: {
      completeness: 71.2,
      consistency: 58.4,
      validity: 74.0,
      uniqueness: 61.5
    }
  },

  // Projects Directory
  projects: [
    {
      id: "proj-001",
      name: "Customer Data Cleanup",
      datasetName: "Customer_Master.csv",
      description: "CRM customer entity resolution, phone/email standardization and missing field imputation.",
      sourceType: "csv",
      recordsCount: 12450,
      columnsCount: 18,
      qualityScore: 61,
      issuesCount: 2512,
      status: "Needs Review",
      lastUpdated: "12m ago",
      dimensions: {
        completeness: 71,
        consistency: 58,
        validity: 74,
        uniqueness: 61
      }
    },
    {
      id: "proj-002",
      name: "E-commerce Orders",
      datasetName: "Orders_2024_Q3.csv",
      description: "Omnichannel order ledger reconciliation and SKU referential integrity validation.",
      sourceType: "database",
      recordsCount: 84200,
      columnsCount: 24,
      qualityScore: 74,
      issuesCount: 1890,
      status: "Completed",
      lastUpdated: "2h ago",
      dimensions: {
        completeness: 82,
        consistency: 69,
        validity: 78,
        uniqueness: 67
      }
    },
    {
      id: "proj-003",
      name: "Employee Master Data",
      datasetName: "HR_Roster_Global.parquet",
      description: "Global enterprise HR directory tax identification validation and title normalization.",
      sourceType: "parquet",
      recordsCount: 3410,
      columnsCount: 14,
      qualityScore: 89,
      issuesCount: 142,
      status: "Completed",
      lastUpdated: "1d ago",
      dimensions: {
        completeness: 94,
        consistency: 88,
        validity: 91,
        uniqueness: 83
      }
    }
  ],

  // Active Dataset Overview (Customer_Master.csv)
  activeDataset: {
    id: "ds-cust-001",
    name: "Customer_Master.csv",
    fileSize: "4.8 MB",
    recordsCount: 12450,
    columnsCount: 18,
    uploadedAt: "Today at 09:14 AM",
    lastAnalyzed: "12 mins ago",
    qualityScore: 61,
    dimensions: {
      completeness: 71,
      consistency: 58,
      validity: 74,
      uniqueness: 61
    },
    profilingSummary: {
      totalCells: 224100,
      missingCells: 14340,
      duplicateRows: 842,
      inferredPrimaryKeys: ["Customer_ID"],
      entropyLossIndex: "Low (0.04)"
    }
  },

  // Column-Level Profiling Data
  columnsProfile: [
    {
      name: "Customer_ID",
      type: "Integer",
      semanticRole: "Primary Key / ID",
      uniquePct: 98.7,
      missingPct: 0.0,
      validityPct: 100.0,
      inferredConstraint: "Unique, Non-null, Positive Sequential",
      potentialAnomalies: 16,
      sampleValues: ["10021", "10022", "10023", "10024"],
      status: "warning",
      statusNote: "16 collision/duplicate keys detected"
    },
    {
      name: "First_Name",
      type: "String",
      semanticRole: "Demographic",
      uniquePct: 34.2,
      missingPct: 2.1,
      validityPct: 97.4,
      inferredConstraint: "Alphanumeric, Case-Insensitive Name",
      potentialAnomalies: 42,
      sampleValues: ["Rahul", "Sarah", "David", "Priya"],
      status: "good",
      statusNote: "Minor casing inconsistency"
    },
    {
      name: "Last_Name",
      type: "String",
      semanticRole: "Demographic",
      uniquePct: 48.6,
      missingPct: 2.4,
      validityPct: 98.1,
      inferredConstraint: "Alphanumeric Name",
      potentialAnomalies: 18,
      sampleValues: ["Kumar", "Jenkins", "Chen", "Sharma"],
      status: "good",
      statusNote: "Standard distribution"
    },
    {
      name: "Email",
      type: "String",
      semanticRole: "Contact / Identifier",
      uniquePct: 93.4,
      missingPct: 2.5,
      validityPct: 91.0,
      inferredConstraint: "RFC-5322 Standard Email Syntax",
      potentialAnomalies: 316,
      sampleValues: ["rahul@gmail.com", "s.jenkins@corp.io", "dchen@tech.co"],
      status: "danger",
      statusNote: "316 malformed or invalid MX domains"
    },
    {
      name: "Phone",
      type: "String",
      semanticRole: "Contact Identifier",
      uniquePct: 88.2,
      missingPct: 4.1,
      validityPct: 78.0,
      inferredConstraint: "ITU-T E.164 Global Telephone Standard",
      potentialAnomalies: 97,
      sampleValues: ["+91 98765 43210", "(555) 234-8901", "9876543210"],
      status: "warning",
      statusNote: "Mixed formatting, missing country codes"
    },
    {
      name: "Age",
      type: "Integer",
      semanticRole: "Metric / Demographic",
      uniquePct: 12.1,
      missingPct: 1.2,
      validityPct: 98.9,
      inferredConstraint: "Range: 18 <= Age <= 110",
      potentialAnomalies: 12,
      sampleValues: ["28", "34", "45", "-2", "142"],
      status: "warning",
      statusNote: "12 out-of-range bounds (e.g. -2, 142)"
    },
    {
      name: "Annual_Revenue",
      type: "Float",
      semanticRole: "Financial Metric",
      uniquePct: 76.5,
      missingPct: 5.8,
      validityPct: 96.2,
      inferredConstraint: "Monetary >= 0, Log-normal distribution",
      potentialAnomalies: 25,
      sampleValues: ["$45,000.00", "$120,500.00", "0.00"],
      status: "warning",
      statusNote: "25 extreme statistical outliers (> 5 IQR)"
    },
    {
      name: "Country_Code",
      type: "String",
      semanticRole: "Geographic",
      uniquePct: 0.8,
      missingPct: 0.6,
      validityPct: 94.2,
      inferredConstraint: "ISO 3166-1 Alpha-2 Standard",
      potentialAnomalies: 38,
      sampleValues: ["US", "IN", "GB", "DE", "UNKNOWN"],
      status: "good",
      statusNote: "38 legacy non-standard codes"
    }
  ],

  // Issues Detected (2,512 Total)
  issues: [
    {
      id: "iss-001",
      type: "Possible Duplicate",
      category: "Entity Resolution",
      severity: "High",
      affectedRecords: 842,
      affectedColumns: ["Email", "Phone", "First_Name", "Last_Name"],
      confidence: 94.5,
      explanation: "Matching email and normalized phone number with phonetic / typo name variations (e.g. 'Rahul Kumar' vs 'RAHUL').",
      recommendedAction: "Execute probabilistic entity resolution and deduplication merge.",
      safeToAutoApprove: false
    },
    {
      id: "iss-002",
      type: "Missing Values",
      category: "Completeness",
      severity: "Medium",
      affectedRecords: 1204,
      affectedColumns: ["Annual_Revenue", "Phone", "First_Name"],
      confidence: 98.0,
      explanation: "Nullable cells without enterprise default values or imputation masks.",
      recommendedAction: "Impute missing demographic entries via statistical cohort medians.",
      safeToAutoApprove: true
    },
    {
      id: "iss-003",
      type: "Invalid Emails",
      category: "Format Validity",
      severity: "High",
      affectedRecords: 316,
      affectedColumns: ["Email"],
      confidence: 96.2,
      explanation: "RFC-5322 syntax violations (missing @, trailing periods, unsupported Unicode characters).",
      recommendedAction: "Sanitize syntax, trim whitespace, and flag unrecoverable addresses.",
      safeToAutoApprove: true
    },
    {
      id: "iss-004",
      type: "Phone Format Inconsistency",
      category: "Standardization",
      severity: "Medium",
      affectedRecords: 97,
      affectedColumns: ["Phone"],
      confidence: 92.4,
      explanation: "Mixed telephone formats lacking standard international dialing prefix (+E.164).",
      recommendedAction: "Standardize into E.164 canonical phone string based on Country_Code context.",
      safeToAutoApprove: true
    },
    {
      id: "iss-005",
      type: "Potential Anomalies",
      category: "Outliers & Bounds",
      severity: "Critical",
      affectedRecords: 53,
      affectedColumns: ["Age", "Annual_Revenue"],
      confidence: 89.8,
      explanation: "Extreme mathematical bounds violations: negative age values (-2, -5) and negative revenue numbers.",
      recommendedAction: "Clamp negative metrics to absolute zero or replace with domain bounds.",
      safeToAutoApprove: false
    }
  ],

  // AI-Generated Cleaning Plan
  cleaningPlan: {
    planId: "plan-agent-4029",
    datasetId: "ds-cust-001",
    generatedAt: "Today at 09:22 AM",
    agentModel: "Claude 3.5 Sonnet / Polars DAG Planner",
    totalRecordsAffected: 2512,
    estimatedRuntimeSeconds: 3.4,
    overallEntropyLoss: 0.04,
    operations: [
      {
        stepId: 1,
        title: "Identify & Deduplicate Customer Entities",
        actionType: "Entity Resolution Merge",
        targetColumns: ["First_Name", "Last_Name", "Email", "Phone"],
        reason: "Resolves 842 redundant customer records using Jaro-Winkler string similarity (threshold 0.88) + exact email matching.",
        affectedRecords: 842,
        confidence: 94,
        estimatedImpact: "Moderate",
        informationLossLevel: "Low",
        entropyDelta: 0.032,
        isReversible: true,
        approved: true
      },
      {
        stepId: 2,
        title: "Normalize Phone Numbers to ITU E.164",
        actionType: "Regex Canonicalization",
        targetColumns: ["Phone", "Country_Code"],
        reason: "Standardizes 97 phone records into clean international format +[prefix][number] using country context.",
        affectedRecords: 97,
        confidence: 98,
        estimatedImpact: "Minimal",
        informationLossLevel: "None",
        entropyDelta: 0.000,
        isReversible: true,
        approved: true
      },
      {
        stepId: 3,
        title: "Validate & Sanitize Email Addresses",
        actionType: "RFC-5322 Cleansing",
        targetColumns: ["Email"],
        reason: "Trims malformed email delimiters, lowercase normalization, and flags 316 invalid domain strings.",
        affectedRecords: 316,
        confidence: 96,
        estimatedImpact: "Low",
        informationLossLevel: "Low",
        entropyDelta: 0.005,
        isReversible: true,
        approved: true
      },
      {
        stepId: 4,
        title: "Context-Aware Missing Value Imputation",
        actionType: "Iterative Imputer (MICE)",
        targetColumns: ["Annual_Revenue", "Age"],
        reason: "Imputes 1,204 missing values using demographic cohort regression without distorting variance.",
        affectedRecords: 1204,
        confidence: 91,
        estimatedImpact: "Moderate",
        informationLossLevel: "Low",
        entropyDelta: 0.003,
        isReversible: true,
        approved: true
      },
      {
        stepId: 5,
        title: "Outlier Clamping & Semantic Boundary Shield",
        actionType: "Domain Boundary Filtering",
        targetColumns: ["Age", "Annual_Revenue"],
        reason: "Sanitizes 53 non-physical data points (negative age -2 converted to NaN, extreme revenue capped at 99.9th percentile).",
        affectedRecords: 53,
        confidence: 95,
        estimatedImpact: "Low",
        informationLossLevel: "Low",
        entropyDelta: 0.002,
        isReversible: true,
        approved: false // Requires explicit review
      }
    ]
  },

  // Impact & Information Loss Engine Metrics
  impactAnalysis: {
    totalRecords: 12450,
    recordsAffected: 2512,
    percentAffected: 20.18,
    fieldsChanged: 5,
    entropyDelta: 0.042,
    informationLossCategory: "Low Risk",
    reversibility: "100% Guaranteed via delta snapshots",
    columnImpacts: [
      { column: "Customer_ID", changeCount: 842, entropyLoss: "0.018", reversibility: "Available" },
      { column: "Email", changeCount: 316, entropyLoss: "0.005", reversibility: "Available" },
      { column: "Phone", changeCount: 97, entropyLoss: "0.000", reversibility: "Available" },
      { column: "Annual_Revenue", changeCount: 1204, entropyLoss: "0.012", reversibility: "Available" },
      { column: "Age", changeCount: 53, entropyLoss: "0.007", reversibility: "Available" }
    ]
  },

  // Human-in-the-Loop Review Pairs (Probabilistic Entity Resolution)
  reviewPairs: [
    {
      id: "pair-101",
      confidence: 96,
      matchReason: "Matching email and normalized phone with case/whitespace variations.",
      recordA: {
        id: "CUST-10492",
        name: "Rahul Kumar",
        email: "rahul@gmail.com",
        phone: "+91 98765 43210",
        country: "IN",
        revenue: "$48,500"
      },
      recordB: {
        id: "CUST-11883",
        name: "RAHUL",
        email: "rahul@gmail.com",
        phone: "9876543210",
        country: "IN",
        revenue: "MISSING"
      },
      status: "pending" // "merged", "separated", "ignored"
    },
    {
      id: "pair-102",
      confidence: 92,
      matchReason: "Same physical postal code & last name, minor typo in corporate domain.",
      recordA: {
        id: "CUST-08421",
        name: "Sarah Jenkins",
        email: "s.jenkins@acmecorp.com",
        phone: "+1 (555) 234-8901",
        country: "US",
        revenue: "$110,000"
      },
      recordB: {
        id: "CUST-09144",
        name: "Sara M. Jenkins",
        email: "s.jenkins@acme-corp.com",
        phone: "555-234-8901",
        country: "US",
        revenue: "$110,000"
      },
      status: "pending"
    },
    {
      id: "pair-103",
      confidence: 88,
      matchReason: "Shared telephone and identical billing address with abbreviated initial.",
      recordA: {
        id: "CUST-03319",
        name: "David Chen",
        email: "dchen@innovate.org",
        phone: "+44 20 7946 0991",
        country: "GB",
        revenue: "$85,000"
      },
      recordB: {
        id: "CUST-05510",
        name: "D. Chen",
        email: "d.chen99@gmail.com",
        phone: "+44 20 7946 0991",
        country: "GB",
        revenue: "$85,000"
      },
      status: "pending"
    }
  ],

  // Automated Test-Driven Validation Suite
  validationSuite: {
    suiteId: "suite-polars-99",
    totalTests: 6,
    passedCount: 5,
    warningCount: 1,
    failedCount: 0,
    readinessStatus: "READY_FOR_EXECUTION",
    rules: [
      {
        id: "val-01",
        name: "Primary Key Uniqueness",
        category: "Entity Integrity",
        status: "PASS",
        executionTime: "12ms",
        recordsEvaluated: 12450,
        description: "Zero duplicate values permitted on Customer_ID after entity resolution merge.",
        codeSnippet: "assert df['Customer_ID'].is_unique().all()"
      },
      {
        id: "val-02",
        name: "Schema Integrity & Dtype Safety",
        category: "Schema Verification",
        status: "PASS",
        executionTime: "8ms",
        recordsEvaluated: 12450,
        description: "Columns conform strictly to PyArrow ArrowSchema without type downcasting.",
        codeSnippet: "assert df.schema == TARGET_DATASET_SCHEMA"
      },
      {
        id: "val-03",
        name: "Required Fields Nullability Check",
        category: "Completeness",
        status: "PASS",
        executionTime: "15ms",
        recordsEvaluated: 12450,
        description: "Zero null cells in non-nullable attributes (Customer_ID, Signup_Date).",
        codeSnippet: "assert df['Signup_Date'].null_count() == 0"
      },
      {
        id: "val-04",
        name: "Referential Integrity",
        category: "Relational Consistency",
        status: "WARNING",
        executionTime: "34ms",
        recordsEvaluated: 12450,
        description: "14 customer foreign keys refer to archived branch codes in region dimension.",
        codeSnippet: "orphan_keys = df.join(branches, on='Branch_ID', how='anti')"
      },
      {
        id: "val-05",
        name: "Record Count Consistency",
        category: "Mass Balance",
        status: "PASS",
        executionTime: "5ms",
        recordsEvaluated: 12450,
        description: "Net records delta precisely equals raw_count - deduplicated_count.",
        codeSnippet: "assert len(df) == RAW_COUNT - DEDUPLICATED_COUNT"
      },
      {
        id: "val-06",
        name: "Semantic Boundary Bounds Check",
        category: "Domain Safety",
        status: "PASS",
        executionTime: "11ms",
        recordsEvaluated: 12450,
        description: "Age values bounded between 18 and 110; Revenue non-negative.",
        codeSnippet: "assert df['Age'].is_between(18, 110).all()"
      }
    ]
  },

  // Execution Worker Simulation Logs
  executionLogs: [
    { ts: "09:42:01.104", tag: "[WORKER-01]", type: "info", msg: "Initializing Sandboxed Polars Worker v1.8.2 on Node-04." },
    { ts: "09:42:01.218", tag: "[MEMORY-INIT]", type: "info", msg: "Dataset loaded into shared memory buffer: 12,450 rows x 18 cols." },
    { ts: "09:42:01.390", tag: "[STEP-1]", type: "info", msg: "Running Entity Resolution... Partitioning Jaro-Winkler buckets." },
    { ts: "09:42:02.114", tag: "[STEP-1]", type: "success", msg: "Merged 842 redundant customer records. Assigned canonical UUIDs." },
    { ts: "09:42:02.245", tag: "[STEP-2]", type: "info", msg: "Applying E.164 phone canonicalization with ISO country lookup." },
    { ts: "09:42:02.401", tag: "[STEP-2]", type: "success", msg: "Normalized 97 telephone strings. 0 unparseable remain." },
    { ts: "09:42:02.610", tag: "[STEP-3]", type: "info", msg: "Sanitizing RFC-5322 email addresses..." },
    { ts: "09:42:02.833", tag: "[STEP-3]", type: "success", msg: "316 email addresses formatted. Domain MX sanity check completed." },
    { ts: "09:42:03.012", tag: "[STEP-4]", type: "info", msg: "Executing Iterative Imputation on numerical cohorts..." },
    { ts: "09:42:03.489", tag: "[STEP-4]", type: "success", msg: "Imputed 1,204 missing values. Variance shift: +0.002% (acceptable)." },
    { ts: "09:42:03.602", tag: "[STEP-5]", type: "warning", msg: "Clamping 53 non-physical age/revenue anomalies to valid domain bounds." },
    { ts: "09:42:03.880", tag: "[AUDIT-DELTA]", type: "success", msg: "Immutable delta snapshot committed. SHA-256: 8f3c7e42b... Rollback enabled." },
    { ts: "09:42:04.002", tag: "[SUCCESS]", type: "success", msg: "Pipeline execution completed in 2.898s. Throughput: 4,296 records/sec." }
  ],

  // Before vs After Results
  resultsComparison: {
    beforeQualityScore: 61,
    afterQualityScore: 93,
    scoreDelta: "+32",
    beforeIssuesCount: 2512,
    afterIssuesCount: 184,
    issuesResolvedPercent: 92.7,
    recordsProcessed: 12450,
    transformationsApplied: 2328,
    criticalTestsPassed: "6 / 6",
    dimensionsDelta: {
      completeness: { before: 71, after: 96, delta: "+25%" },
      consistency: { before: 58, after: 94, delta: "+36%" },
      validity: { before: 74, after: 98, delta: "+24%" },
      uniqueness: { before: 61, after: 99, delta: "+38%" }
    },
    sampleCleanedRows: [
      {
        id: "CUST-10492",
        name: "Rahul Kumar",
        email: "rahul@gmail.com",
        phone: "+91 98765 43210",
        age: 28,
        revenue: "$48,500.00",
        status: "Cleaned & Merged"
      },
      {
        id: "CUST-08421",
        name: "Sarah Jenkins",
        email: "s.jenkins@acmecorp.com",
        phone: "+1 555 234 8901",
        age: 34,
        revenue: "$110,000.00",
        status: "Standardized"
      },
      {
        id: "CUST-03319",
        name: "David Chen",
        email: "dchen@innovate.org",
        phone: "+44 20 7946 0991",
        age: 45,
        revenue: "$85,000.00",
        status: "Imputed & Verified"
      }
    ]
  },

  // Audit History Ledger (with 1-click rollback)
  auditHistory: [
    {
      id: "aud-001",
      timestamp: "Today at 09:42:02",
      operation: "Entity Resolution Deduplication",
      recordsAffected: 842,
      operator: "Agent (Human-Approved)",
      userApproval: "Approved by Admin",
      status: "Completed",
      checksum: "sha256:7b91c...4a",
      rollbackAvailable: true
    },
    {
      id: "aud-002",
      timestamp: "Today at 09:42:02",
      operation: "E.164 Phone Normalization",
      recordsAffected: 97,
      operator: "Agent (Rule-based)",
      userApproval: "Auto-Approved",
      status: "Completed",
      checksum: "sha256:3e29f...9c",
      rollbackAvailable: true
    },
    {
      id: "aud-003",
      timestamp: "Today at 09:42:03",
      operation: "RFC-5322 Email Validation",
      recordsAffected: 316,
      operator: "Agent (Rule-based)",
      userApproval: "Auto-Approved",
      status: "Completed",
      checksum: "sha256:1a82d...1b",
      rollbackAvailable: true
    },
    {
      id: "aud-004",
      timestamp: "Today at 09:42:03",
      operation: "Cohort Missing Value Imputation",
      recordsAffected: 1204,
      operator: "Agent (MICE Model)",
      userApproval: "Approved by Admin",
      status: "Completed",
      checksum: "sha256:4f99a...6e",
      rollbackAvailable: true
    },
    {
      id: "aud-005",
      timestamp: "Today at 09:42:03",
      operation: "Outlier Boundary Clamping",
      recordsAffected: 53,
      operator: "Agent (Domain Bound)",
      userApproval: "Approved by Admin",
      status: "Completed",
      checksum: "sha256:9c01f...82",
      rollbackAvailable: true
    }
  ]
};
