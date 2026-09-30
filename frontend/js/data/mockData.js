/**
 * PurifyOps - Clean Production Initial State
 * Zero Dummy Data
 */

export const INITIAL_DATA = {
  platformMetrics: {
    totalProjects: 0,
    datasetsProcessed: 0,
    issuesDetected: 0,
    transformationsExecuted: 0,
    averageQualityScore: 0,
    dimensions: {
      completeness: 0,
      consistency: 0,
      validity: 0,
      uniqueness: 0
    }
  },

  projects: [],

  activeDataset: {
    id: "",
    name: "No Dataset Loaded",
    fileSize: "0 KB",
    recordsCount: 0,
    columnsCount: 0,
    uploadedAt: "-",
    lastAnalyzed: "-",
    qualityScore: 0,
    dimensions: {
      completeness: 0,
      consistency: 0,
      validity: 0,
      uniqueness: 0
    },
    profilingSummary: {
      totalCells: 0,
      missingCells: 0,
      duplicateRows: 0,
      inferredPrimaryKeys: [],
      entropyLossIndex: "None"
    }
  },

  columnsProfile: [],
  issues: [],

  cleaningPlan: {
    planId: "",
    datasetId: "",
    generatedAt: "-",
    agentModel: "OpenAI GPT-4o / PurifyOps DAG Planner",
    totalRecordsAffected: 0,
    estimatedRuntimeSeconds: 0,
    overallEntropyLoss: 0,
    operations: []
  },

  impactAnalysis: {
    totalRecords: 0,
    recordsAffected: 0,
    percentAffected: 0,
    fieldsChanged: 0,
    entropyDelta: 0,
    informationLossCategory: "None",
    reversibility: "Available",
    columnImpacts: []
  },

  reviewPairs: [],

  validationSuite: {
    suiteId: "",
    totalTests: 0,
    passedCount: 0,
    warningCount: 0,
    failedCount: 0,
    readinessStatus: "AWAITING_DATASET",
    rules: []
  },

  executionLogs: [],

  resultsComparison: {
    beforeQualityScore: 0,
    afterQualityScore: 0,
    scoreDelta: "0",
    beforeIssuesCount: 0,
    afterIssuesCount: 0,
    issuesResolvedPercent: 0,
    recordsProcessed: 0,
    transformationsApplied: 0,
    criticalTestsPassed: "0 / 0",
    dimensionsDelta: {
      completeness: { before: 0, after: 0, delta: "0%" },
      consistency: { before: 0, after: 0, delta: "0%" },
      validity: { before: 0, after: 0, delta: "0%" },
      uniqueness: { before: 0, after: 0, delta: "0%" }
    },
    sampleCleanedRows: []
  },

  auditHistory: []
};
