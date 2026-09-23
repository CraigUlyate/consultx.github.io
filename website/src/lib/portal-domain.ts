export const portalRoles = [
  "client_user",
  "client_admin",
  "accountant",
  "consultx_reviewer",
  "consultx_admin",
] as const;

export type PortalRole = (typeof portalRoles)[number];

export const productionJobStatuses = [
  "information_required",
  "under_review",
  "awaiting_authorisation",
  "awaiting_payment",
  "ready_to_file",
  "filing_in_progress",
  "completed",
  "failed",
  "cancelled",
] as const;

export type ProductionJobStatus = (typeof productionJobStatuses)[number];

export type ExtractedField = {
  key: string;
  value: unknown;
  confidence: number | null;
  sourcePage: number | null;
  sourceText: string | null;
  confirmedAt: string | null;
};

export type AnnualReturnReadiness = {
  required: Array<{
    key: "annualTurnover" | "beneficialOwnership" | "authorisation";
    complete: boolean;
    message: string;
  }>;
  isReadyForPayment: boolean;
};

export type FilingControls = {
  hasActiveMandate: boolean;
  hasFinalAuthorisation: boolean;
  paymentVerified: boolean;
  automatedSubmissionEnabled: boolean;
};

export function canQueueFiling(controls: FilingControls) {
  return controls.hasActiveMandate && controls.hasFinalAuthorisation && controls.paymentVerified;
}

export function shouldUseAutomatedConnector(controls: FilingControls) {
  return canQueueFiling(controls) && controls.automatedSubmissionEnabled;
}

export function assessAnnualReturnReadiness(input: {
  annualTurnoverCents: number | null;
  beneficialOwnershipCurrent: boolean | null;
  hasSupportingDocument: boolean;
  hasAuthorisation: boolean;
}): AnnualReturnReadiness {
  const required: AnnualReturnReadiness["required"] = [
    {
      key: "annualTurnover",
      complete: input.annualTurnoverCents !== null && input.annualTurnoverCents >= 0,
      message: "Annual turnover from the latest approved financial statements",
    },
    {
      key: "beneficialOwnership",
      complete: input.beneficialOwnershipCurrent === true,
      message: "Confirmation that Beneficial Ownership information is current",
    },
    {
      key: "authorisation",
      complete: input.hasAuthorisation,
      message: "Client authority to submit the annual return",
    },
  ];

  return { required, isReadyForPayment: required.every((item) => item.complete) };
}
