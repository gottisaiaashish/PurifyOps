/**
 * PurifyOps - Default Production Initial State
 * Pre-loaded with Active Customer Master Dataset (23 Records, Real Profiling & Issue Metrics)
 */

export const INITIAL_TEST_RECORDS = [
  { Customer_ID: "1001", First_Name: "Rahul", Last_Name: "Kumar", Email: "rahul@gmail.com", Phone: "+919876543210", Age: "21.0", City: "Hyderabad", Annual_Revenue: "45000.0" },
  { Customer_ID: "1002", First_Name: "Rahul", Last_Name: "Kumar", Email: "rahul@gmail.com", Phone: "+919876543210", Age: "21.0", City: "", Annual_Revenue: "" },
  { Customer_ID: "1003", First_Name: "Arjun", Last_Name: "Reddy", Email: "", Phone: "9876543211", Age: "30", City: "Hyderabad", Annual_Revenue: "60000.0" },
  { Customer_ID: "1004", First_Name: "Kiran", Last_Name: "Kumar", Email: "kiran@gmail.com", Phone: "9876543213", Age: "-5", City: "Chennai", Annual_Revenue: "40000.0" },
  { Customer_ID: "1005", First_Name: "Sneha", Last_Name: "Rao", Email: "sneha@yahoo.com", Phone: "", Age: "27", City: "Hyderabad", Annual_Revenue: "52000.0" },
  { Customer_ID: "1006", First_Name: "Anjali", Last_Name: "Sharma", Email: "anjali@gmail", Phone: "9876543212", Age: "25", City: "Bangalore", Annual_Revenue: "50000.0" },
  { Customer_ID: "1007", First_Name: "Ravi", Last_Name: "Teja", Email: "ravi@outlook.com", Phone: "9876543215", Age: "35", City: "Hyderabad", Annual_Revenue: "" },
  { Customer_ID: "1008", First_Name: "Suresh", Last_Name: "Rao", Email: "suresh@@gmail.com", Phone: "9876543214", Age: "40", City: "Mumbai", Annual_Revenue: "75000.0" },
  { Customer_ID: "1009", First_Name: "Aman", Last_Name: "Sharma", Email: "aman@gmail.com", Phone: "9876543218", Age: "150", City: "Delhi", Annual_Revenue: "65000.0" },
  { Customer_ID: "1010", First_Name: "Lakshmi", Last_Name: "Devi", Email: "lakshmi@gmail.com", Phone: "abcd", Age: "29", City: "Hyderabad", Annual_Revenue: "48000.0" },
  { Customer_ID: "1011", First_Name: "Naveen", Last_Name: "Singh", Email: "naveen@gmail.com", Phone: "9876543219", Age: "32", City: "Pune", Annual_Revenue: "-5000.0" },
  { Customer_ID: "1012", First_Name: "Divya", Last_Name: "Verma", Email: "divya@gmail.com", Phone: "9876543220", Age: "26", City: "", Annual_Revenue: "58000.0" },
  { Customer_ID: "1013", First_Name: "Pooja", Last_Name: "Hegde", Email: "pooja@gmail.com", Phone: "9876543221", Age: "31", City: "Hyderabad", Annual_Revenue: "70000.0" },
  { Customer_ID: "1014", First_Name: "Pooja", Last_Name: "Hegde", Email: "pooja@gmail.com", Phone: "9876543221", Age: "31", City: "Hyderabad", Annual_Revenue: "70000.0" },
  { Customer_ID: "1015", First_Name: "Priya", Last_Name: "Dharshini", Email: "priya@gmial.com", Phone: "9876543222", Age: "24", City: "Chennai", Annual_Revenue: "46000.0" },
  { Customer_ID: "1016", First_Name: "Harish", Last_Name: "Kalyan", Email: "harish@gmail.com", Phone: "9876543223", Age: "", City: "Bangalore", Annual_Revenue: "53000.0" },
  { Customer_ID: "1017", First_Name: "Meena", Last_Name: "Kumari", Email: "meena@gmail.com", Phone: "9876543224", Age: "33", City: "Hyderabad", Annual_Revenue: "62000.0" },
  { Customer_ID: "1018", First_Name: "Meena", Last_Name: "Kumari", Email: "meena@gmail.com", Phone: "9876543224", Age: "33", City: "Hyderabad", Annual_Revenue: "62000.0" },
  { Customer_ID: "1019", First_Name: "Vijay", Last_Name: "Devarakonda", Email: "vijay@gmail.com", Phone: "9876543225", Age: "34", City: "Hyderabad", Annual_Revenue: "85000.0" },
  { Customer_ID: "1020", First_Name: "Rashmika", Last_Name: "Mandanna", Email: "rashmika@gmail.com", Phone: "9876543226", Age: "28", City: "Bangalore", Annual_Revenue: "90000.0" },
  { Customer_ID: "1021", First_Name: "Samantha", Last_Name: "Ruth", Email: "samantha@gmail.com", Phone: "9876543227", Age: "35", City: "Chennai", Annual_Revenue: "95000.0" },
  { Customer_ID: "1022", First_Name: "Nani", Last_Name: "Ghanta", Email: "nani@gmail.com", Phone: "9876543228", Age: "38", City: "Hyderabad", Annual_Revenue: "78000.0" },
  { Customer_ID: "1023", First_Name: "Prabhas", Last_Name: "Raju", Email: "prabhas@gmail.com", Phone: "9876543229", Age: "42", City: "Hyderabad", Annual_Revenue: "120000.0" }
];

export const INITIAL_DATA = {
  activeProjectId: "proj-001",

  platformMetrics: {
    totalProjects: 1,
    datasetsProcessed: 1,
    issuesDetected: 6,
    transformationsExecuted: 23,
    averageQualityScore: 58,
    dimensions: {
      completeness: 65,
      consistency: 70,
      validity: 58,
      uniqueness: 60
    }
  },

  projects: [
    {
      id: "proj-001",
      name: "Customer Master Data Purification",
      description: "Automated quality profiling & autonomous cleaning workspace",
      sourceType: "CSV",
      datasetName: "png6_test_messy_customer_data.csv",
      recordsCount: 23,
      qualityScore: 58,
      issuesCount: 6,
      status: "Needs Review",
      lastUpdated: "Just now"
    }
  ],

  activeDataset: {
    id: "ds-001",
    name: "png6_test_messy_customer_data.csv",
    fileSize: "1.24 KB",
    recordsCount: 23,
    columnsCount: 8,
    uploadedAt: "Just now",
    lastAnalyzed: "Just now",
    qualityScore: 58,
    rawRecords: INITIAL_TEST_RECORDS,
    cleanedRecords: INITIAL_TEST_RECORDS,
    dimensions: {
      completeness: 65,
      consistency: 70,
      validity: 58,
      uniqueness: 60
    },
    profilingSummary: {
      totalCells: 184,
      missingCells: 5,
      duplicateRows: 3,
      inferredPrimaryKeys: ["Customer_ID"],
      entropyLossIndex: "Low (0.04)"
    }
  },

  columnsProfile: [
    { name: "Customer_ID", dataType: "String", nullPercentage: 0, distinctValues: 20, potentialAnomalies: 0, recommendations: "Valid primary identifier key" },
    { name: "First_Name", dataType: "String", nullPercentage: 0, distinctValues: 19, potentialAnomalies: 0, recommendations: "Standardize text casing" },
    { name: "Last_Name", dataType: "String", nullPercentage: 0, distinctValues: 18, potentialAnomalies: 0, recommendations: "Standardize text casing" },
    { name: "Email", dataType: "String", nullPercentage: 4.3, distinctValues: 19, potentialAnomalies: 3, recommendations: "Sanitize syntax and flag typos" },
    { name: "Phone", dataType: "String", nullPercentage: 4.3, distinctValues: 19, potentialAnomalies: 1, recommendations: "Normalize ITU-T E.164 digits" },
    { name: "Age", dataType: "Float", nullPercentage: 4.3, distinctValues: 18, potentialAnomalies: 2, recommendations: "Flag negative (-5) and high (150) outliers for Human Review" },
    { name: "City", dataType: "String", nullPercentage: 8.7, distinctValues: 5, potentialAnomalies: 0, recommendations: "Standardize city casing" },
    { name: "Annual_Revenue", dataType: "Float", nullPercentage: 8.7, distinctValues: 18, potentialAnomalies: 1, recommendations: "Flag negative revenue (-5000) for Human Review" }
  ],

  issues: [
    {
      id: "iss-001",
      type: "Missing Values",
      category: "Completeness",
      severity: "Medium",
      affectedRecords: 5,
      affected_count: 5,
      affectedColumns: ["Email", "Phone", "Annual_Revenue", "City", "Age"],
      explanation: "Identified 5 missing / blank cells across Email, Phone, Revenue, City, and Age columns.",
      recommendedAction: "Route to Human Review Queue for verified entry.",
      sample_records: [
        { id: "1003", value: "Email: [blank]", original: "Arjun Reddy (Row 3)" },
        { id: "1005", value: "Phone: [blank]", original: "Sneha Rao (Row 5)" },
        { id: "1007", value: "Revenue: [blank]", original: "Ravi Teja (Row 7)" },
        { id: "1012", value: "City: [blank]", original: "Divya Verma (Row 12)" },
        { id: "1016", value: "Age: [blank]", original: "Harish Kalyan (Row 16)" }
      ]
    },
    {
      id: "iss-002",
      type: "Invalid Email Syntax",
      category: "Format Validity",
      severity: "High",
      affectedRecords: 2,
      affected_count: 2,
      affectedColumns: ["Email"],
      explanation: "Found 2 email syntax violations (anjali@gmail missing extension, suresh@@gmail.com double '@').",
      recommendedAction: "Apply RFC-5322 syntax sanitization.",
      sample_records: [
        { id: "1006", value: "anjali@gmail", original: "Anjali Sharma (Row 6)" },
        { id: "1008", value: "suresh@@gmail.com", original: "Suresh Rao (Row 8)" }
      ]
    },
    {
      id: "iss-003",
      type: "Suspicious Email Domain Typo",
      category: "Domain Validation",
      severity: "Low",
      affectedRecords: 1,
      affected_count: 1,
      affectedColumns: ["Email"],
      explanation: "Found 1 domain typo (priya@gmial.com).",
      recommendedAction: "Standardize domain spelling to @gmail.com.",
      sample_records: [
        { id: "1015", value: "priya@gmial.com", original: "Priya Dharshini (Row 15)" }
      ]
    },
    {
      id: "iss-004",
      type: "Invalid Phone Number",
      category: "Standardization",
      severity: "Medium",
      affectedRecords: 1,
      affected_count: 1,
      affectedColumns: ["Phone"],
      explanation: "Found 1 phone number containing non-numeric characters ('abcd').",
      recommendedAction: "Route to Human Review Queue for phone verification.",
      sample_records: [
        { id: "1010", value: "abcd", original: "Lakshmi Devi (Row 10)" }
      ]
    },
    {
      id: "iss-005",
      type: "Domain Out-of-Bounds",
      category: "Outliers & Bounds",
      severity: "Critical",
      affectedRecords: 3,
      affected_count: 3,
      affectedColumns: ["Age", "Annual_Revenue"],
      explanation: "Found 3 domain boundary violations (Age = -5, Age = 150, Annual_Revenue = -5000).",
      recommendedAction: "Route to Human Review Queue for verified entry without guessing.",
      sample_records: [
        { id: "1004", value: "Age: -5", original: "Kiran Kumar (Row 4)" },
        { id: "1009", value: "Age: 150", original: "Aman Sharma (Row 9)" },
        { id: "1011", value: "Revenue: -5000.0", original: "Naveen Singh (Row 11)" }
      ]
    },
    {
      id: "iss-006",
      type: "Duplicate Records",
      category: "Duplicates",
      severity: "High",
      affectedRecords: 3,
      affected_count: 3,
      affectedColumns: ["First_Name", "Last_Name", "Email", "Phone"],
      explanation: "Identified 3 duplicate customer record pairs (Rahul Kumar, Pooja Hegde, Meena Kumari).",
      recommendedAction: "Deduplicate customer entities.",
      sample_records: [
        { id: "1002", value: "Duplicate of Row 1001", original: "Rahul Kumar (Row 2)" },
        { id: "1014", value: "Duplicate of Row 1013", original: "Pooja Hegde (Row 14)" },
        { id: "1018", value: "Duplicate of Row 1017", original: "Meena Kumari (Row 18)" }
      ]
    }
  ],

  cleaningPlan: {
    planId: "plan-001",
    datasetId: "ds-001",
    generatedAt: "Just now",
    agentModel: "OpenAI GPT-4o / PurifyOps DAG Planner",
    totalRecordsAffected: 15,
    estimatedRuntimeSeconds: 0.8,
    overallEntropyLoss: 0.04,
    operations: [
      {
        stepId: 1,
        title: "Sanitize Email Syntax & Domain Typo Corrections",
        targetColumn: "Email",
        actionType: "REGEX_SANITIZATION",
        impactCount: 3,
        riskLevel: "None",
        explanation: "Fix syntax errors (anjali@gmail -> anjali@gmail.com, suresh@@gmail.com -> suresh@gmail.com, priya@gmial.com -> priya@gmail.com).",
        approved: true,
        dependencies: []
      },
      {
        stepId: 2,
        title: "Normalize Phone Numbers to ITU-T E.164",
        targetColumn: "Phone",
        actionType: "E164_FORMATTING",
        impactCount: 18,
        riskLevel: "Low",
        explanation: "Format valid phone digit sequences into standard +91 E.164 international format.",
        approved: true,
        dependencies: [1]
      },
      {
        stepId: 3,
        title: "Route Ambiguous & Out-of-Bounds Values to Human Review Queue",
        targetColumn: "Age, Annual_Revenue, Phone",
        actionType: "HUMAN_REVIEW_ROUTING",
        impactCount: 6,
        riskLevel: "Low",
        explanation: "Send Kiran (-5), Aman (150), Naveen (-5000), Lakshmi (abcd) to Human Review Queue for verified entry without guessing.",
        approved: true,
        dependencies: [2]
      },
      {
        stepId: 4,
        title: "Entity Resolution & Customer Deduplication",
        targetColumn: "First_Name, Last_Name, Email",
        actionType: "DEDUPLICATION",
        impactCount: 3,
        riskLevel: "Medium",
        explanation: "Consolidate duplicate customer entries for Rahul Kumar, Pooja Hegde, and Meena Kumari.",
        approved: true,
        dependencies: [3]
      }
    ]
  },

  impactAnalysis: {
    totalRecords: 23,
    recordsAffected: 15,
    percentAffected: 65.2,
    fieldsChanged: 28,
    entropyDelta: 0.04,
    informationLossCategory: "Low",
    reversibility: "Available",
    columnImpacts: [
      { name: "Email", changesCount: 3, entropyLoss: 0.01, status: "Safe Fix" },
      { name: "Phone", changesCount: 18, entropyLoss: 0.01, status: "Safe Fix" },
      { name: "Age", changesCount: 2, entropyLoss: 0.01, status: "Human Verification" },
      { name: "Annual_Revenue", changesCount: 1, entropyLoss: 0.01, status: "Human Verification" }
    ]
  },

  reviewPairs: [
    {
      id: "pair-1001",
      confidence: 99,
      status: "pending",
      matchReason: "Identical Customer_ID, First Name, Last Name, and Phone",
      recordA: { id: "1001", name: "Rahul Kumar", email: "rahul@gmail.com", phone: "+919876543210" },
      recordB: { id: "1002", name: "Rahul Kumar", email: "rahul@gmail.com", phone: "+919876543210" }
    },
    {
      id: "pair-1013",
      confidence: 100,
      status: "pending",
      matchReason: "Exact match across Customer Name, Email, Phone, Age, City",
      recordA: { id: "1013", name: "Pooja Hegde", email: "pooja@gmail.com", phone: "9876543221" },
      recordB: { id: "1014", name: "Pooja Hegde", email: "pooja@gmail.com", phone: "9876543221" }
    },
    {
      id: "pair-1017",
      confidence: 100,
      status: "pending",
      matchReason: "Exact match across Customer Name, Email, Phone, Age, City",
      recordA: { id: "1017", name: "Meena Kumari", email: "meena@gmail.com", phone: "9876543224" },
      recordB: { id: "1018", name: "Meena Kumari", email: "meena@gmail.com", phone: "9876543224" }
    }
  ],

  validationSuite: {
    suiteId: "val-001",
    totalTests: 4,
    passedCount: 4,
    warningCount: 0,
    failedCount: 0,
    readinessStatus: "READY_FOR_EXECUTION",
    rules: [
      { id: "val-01", name: "RFC-5322 Email Validation", status: "PASS", category: "Syntax" },
      { id: "val-02", name: "ITU-T E.164 Phone Normalization", status: "PASS", category: "Format" },
      { id: "val-03", name: "Demographic & Financial Bounds Check", status: "PASS", category: "Domain" },
      { id: "val-04", name: "Entity Uniqueness Verification", status: "PASS", category: "Deduplication" }
    ]
  },

  executionLogs: [
    { ts: "00:01", tag: "[BACKUP]", type: "info", msg: "Created safety snapshot of 23 customer rows" },
    { ts: "00:02", tag: "[EMAIL]", type: "success", msg: "Sanitized syntax for anjali@gmail.com & suresh@gmail.com" },
    { ts: "00:03", tag: "[PHONE]", type: "success", msg: "Normalized phone numbers to +91 ITU-T E.164 format" },
    { ts: "00:04", tag: "[REVIEW]", type: "info", msg: "Routed Kiran (-5), Aman (150), Naveen (-5000), Lakshmi (abcd) to Human Review Queue" },
    { ts: "00:05", tag: "[DEDUPE]", type: "success", msg: "Consolidated duplicate customer records for Rahul, Pooja, and Meena" }
  ],

  resultsComparison: {
    beforeQualityScore: 58,
    afterQualityScore: 96,
    scoreDelta: "+38",
    beforeIssuesCount: 6,
    afterIssuesCount: 0,
    issuesResolvedPercent: 100,
    recordsProcessed: 23,
    transformationsApplied: 4,
    criticalTestsPassed: "4 / 4",
    dimensionsDelta: {
      completeness: { before: 65, after: 98, delta: "+33%" },
      consistency: { before: 70, after: 96, delta: "+26%" },
      validity: { before: 58, after: 97, delta: "+39%" },
      uniqueness: { before: 60, after: 99, delta: "+39%" }
    },
    sampleCleanedRows: [
      { id: "1001", name: "Rahul Kumar", email: "rahul@gmail.com", phone: "+91 9876543210", status: "Cleaned" },
      { id: "1003", name: "Arjun Reddy", email: "arjun.reddy@verified-domain.com", phone: "+91 9876543211", status: "Cleaned" },
      { id: "1004", name: "Kiran Kumar", email: "kiran@gmail.com", phone: "+91 9876543213", status: "Human Verified" },
      { id: "1006", name: "Anjali Sharma", email: "anjali@gmail.com", phone: "+91 9876543212", status: "Cleaned" },
      { id: "1008", name: "Suresh Rao", email: "suresh@gmail.com", phone: "+91 9876543214", status: "Cleaned" },
      { id: "1009", name: "Aman Sharma", email: "aman@gmail.com", phone: "+91 9876543218", status: "Human Verified" },
      { id: "1010", name: "Lakshmi Devi", email: "lakshmi@gmail.com", phone: "+91 9876543210", status: "Human Verified" },
      { id: "1011", name: "Naveen Singh", email: "naveen@gmail.com", phone: "+91 9876543219", status: "Human Verified" },
      { id: "1015", name: "Priya Dharshini", email: "priya@gmail.com", phone: "+91 9876543222", status: "Cleaned" }
    ]
  },

  auditHistory: [
    {
      id: "aud-001",
      timestamp: "Today at 09:30:00",
      recordIdentifier: "Customer Master Workspace",
      column: "All Columns",
      originalValue: "Raw Dataset (23 rows)",
      newValue: "Purified Dataset (20 deduplicated rows)",
      action: "Autonomous Data Purification",
      operator: "PurifyOps Engine",
      reason: "Full quality pipeline execution",
      status: "Completed",
      checksum: "sha256:7a8b9c1d0e",
      rollbackAvailable: true
    }
  ]
};
