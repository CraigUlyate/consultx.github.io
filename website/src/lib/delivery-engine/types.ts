/**
 * ConsultX Service Delivery Knowledge Engine & Workflow Types
 * Defines the unified standard for managing end-to-end service delivery across
 * knowledge bases, SOP workflows, document validation, and infrastructure handlers.
 */

export type ServiceDeliveryRole = "client" | "system_automation" | "craig_ca_sa" | "external_authority";

export interface DocumentRequirementSpec {
  id: string;
  name: string;
  category: "financial" | "statutory" | "identity" | "legal" | "operational";
  description: string;
  mandatory: boolean;
  acceptedFormats: string[]; // e.g. ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
  maxSizeBytes?: number;
  validationRules: string[]; // e.g. ["Must be certified < 3 months", "Must contain electronic bank stamp"]
}

export interface WorkflowStageSpec {
  step: number;
  title: string;
  description: string;
  actor: ServiceDeliveryRole;
  inputsRequired: string[];
  actionDescription: string;
  deliverablesGenerated: string[];
  estimatedDurationHours: number;
  automatedTriggers?: string[];
  craigChecklistItems?: string[];
}

export interface ServiceKnowledgeBase {
  regulatoryFramework: string; // e.g. "International Valuation Standards (IVS)", "Companies Act 71 of 2008"
  primaryMethodologies: string[];
  statutoryDeadlines?: string;
  frequentlyAskedQuestions: { question: string; answer: string }[];
  technicalFormulas?: Record<string, string>; // e.g. { "WACC": "Ke*(E/V) + Kd*(1-t)*(D/V)", "PI_Score": "..." }
  riskCheckpoints: string[];
}

export interface ServiceDeliverySpec {
  serviceId: string;
  serviceName: string;
  category: "compliance" | "taxation" | "financial_statements" | "bookkeeping" | "valuation" | "advisory";
  leadProfessional: string; // "Craig Ulyate (CA(SA))"
  summary: string;
  scopeInclusions: string[];
  scopeExclusions: string[];
  typicalTurnaroundDays: number;
  knowledgeBase: ServiceKnowledgeBase;
  documentRequirements: DocumentRequirementSpec[];
  workflowStages: WorkflowStageSpec[];
  infrastructureMapping: {
    portalRoute: string; // e.g. "/portal/services/valuation"
    gcsBucketFolder: string; // e.g. "gs://consultx-client-vault/{companyId}/valuations/"
    cloudRunService: string; // e.g. "valuation-calculation-worker"
    gcpSecretsRequired: string[]; // e.g. ["consultx-bank-details"]
  };
}
