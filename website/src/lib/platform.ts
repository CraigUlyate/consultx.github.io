export type JobStatus =
  | "information_required"
  | "under_review"
  | "awaiting_authorisation"
  | "awaiting_payment"
  | "ready_to_file"
  | "completed";

export type Company = {
  id: string;
  name: string;
  registrationNumber: string;
  complianceScore: number;
  annualReturnDue: string;
  beneficialOwnership: "current" | "attention";
};

export type ServiceJob = {
  id: string;
  companyId: string;
  serviceName: string;
  status: JobStatus;
  updatedAt: string;
  nextAction: string;
};

export const jobStatusLabel: Record<JobStatus, string> = {
  information_required: "Information required",
  under_review: "Under review",
  awaiting_authorisation: "Awaiting authorisation",
  awaiting_payment: "Awaiting payment",
  ready_to_file: "Ready to file",
  completed: "Completed",
};

export const demoCompanies: Company[] = [
  {
    id: "abc-trading",
    name: "ABC Trading (Pty) Ltd",
    registrationNumber: "2022/123456/07",
    complianceScore: 82,
    annualReturnDue: "Due 30 September 2026",
    beneficialOwnership: "attention",
  },
  {
    id: "sable-studio",
    name: "Sable Studio (Pty) Ltd",
    registrationNumber: "2021/776204/07",
    complianceScore: 100,
    annualReturnDue: "Due 15 January 2027",
    beneficialOwnership: "current",
  },
];

export const demoJobs: ServiceJob[] = [
  {
    id: "AR-000128",
    companyId: "abc-trading",
    serviceName: "CIPC Annual Return",
    status: "information_required",
    updatedAt: "Today",
    nextAction: "Add annual turnover and confirm beneficial ownership details.",
  },
];
