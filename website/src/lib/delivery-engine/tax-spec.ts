import { ServiceDeliverySpec } from "./types";

/**
 * Statutory Delivery Specification: SARS Tax Compliance Status (TCS PIN) & Tax Health Diagnostic
 * Governing Standards: Tax Administration Act 28 of 2011 & Income Tax Act 58 of 1962
 */
export const TAX_DELIVERY_SPEC: ServiceDeliverySpec = {
  serviceId: "tax_clearance",
  serviceName: "SARS Tax Compliance Status (TCS PIN) & Tax Health Diagnostic",
  category: "taxation",
  leadProfessional: "Craig Ulyate (CA(SA))",
  summary:
    "Comprehensive SARS eFiling compliance audit, historical return reconciliation, resolution of non-compliance flags, and official Tax Compliance Status (TCS) Good Standing PIN issuance. Essential for corporate tenders, bank funding, foreign investment allowances, and CIPC compliance.",
  scopeInclusions: [
    "Full diagnostic audit across all 4 SARS tax heads: Corporate Income Tax (CIT), Value-Added Tax (VAT), PAYE/UIF/SDL, and Provisional Tax (IRP6)",
    "Identification of overdue returns, outstanding debt balances, or non-compliance verification flags",
    "Lodgement of Tax Compliance Status (TCS) Good Standing PIN application on SARS eFiling",
    "Liaison with SARS operations to clear administrative stops or missing historical returns",
    "Provision of active TCS PIN and SARS Tax Clearance Certificate valid for 12 months",
    "Proactive monitoring alert 30 days prior to PIN expiry",
  ],
  scopeExclusions: [
    "Resolution of complex SARS disputes requiring formal Notice of Objection (NOO/NOA) or Tax Court litigation (available as Tax Advisory mandate at R1,500/hr)",
    "Payment of outstanding tax principal, interest, or penalties owed to SARS (client's liability)",
    "Preparation and submission of multiple years of missing Annual Financial Statements / ITR14 returns (quoted separately)",
  ],
  typicalTurnaroundDays: 3,
  knowledgeBase: {
    regulatoryFramework:
      "Tax Administration Act 28 of 2011 (Chapter 16: Tax Compliance Status), Income Tax Act 58 of 1962, Value-Added Tax Act 89 of 1991.",
    primaryMethodologies: [
      "SARS eFiling Registered Representative diagnostic audit",
      "Statement of Account (EMPSA, ITSA, VATSA) ledger reconciliation",
      "Proactive debt suspension or installment compromise application under s167/168 of TAA",
    ],
    statutoryDeadlines:
      "TCS PINs are valid for 12 months from date of issue, provided compliance is continuously maintained. If any return becomes overdue, SARS will automatically revoke the Good Standing status.",
    technicalFormulas: {
      Compliance_Status_Criteria: "All tax head returns must be submitted to date + Zero undisputed tax debt exceeding SARS administrative tolerance threshold (R100).",
      Penalty_Calculation: "Late return penalty under s210 ranges from R250 to R16,000 per month depending on taxable income/turnover.",
    },
    riskCheckpoints: [
      "SARS Third-Party Withholding (s179 AA88): Failure to address overdue tax can result in SARS issuing an instruction directly to the company's bank to freeze and transfer funds",
      "Tender Disqualification: An expired or non-compliant TCS PIN immediately disqualifies public and corporate tender bids",
      "Director Secondary Liability: Directors can be held personally liable for unpaid employee tax (PAYE) or VAT under s180 of TAA",
    ],
    frequentlyAskedQuestions: [
      {
        question: "Why did SARS reject my TCS PIN when I don't owe any tax?",
        answer:
          "SARS requires BOTH zero outstanding debt AND 100% of historical returns submitted. Even a dormant period return (e.g. an unfiled zero VAT201 or EMP201) will cause the entire profile to fail compliance.",
      },
      {
        question: "Can I get a TCS PIN if I have an agreed installment payment arrangement with SARS?",
        answer:
          "Yes! If an active Deferred Payment Arrangement under Section 167 of the Tax Administration Act has been approved and you are up to date with installments, SARS will issue a compliant Good Standing PIN.",
      },
      {
        question: "How does third-party tender verification work?",
        answer:
          "SARS no longer issues paper Tax Clearance Certificates. We provide your company's Tax Reference Number and a unique 10-character alphanumeric PIN, allowing banks, tender boards, and enterprise buyers to verify your real-time tax compliance status online.",
      },
    ],
  },
  documentRequirements: [
    {
      id: "sars_registered_representative",
      name: "SARS Registered Representative Appointment / Power of Attorney",
      category: "legal",
      description: "Signed SARS Power of Attorney authorizing Craig Ulyate CA(SA) (ConsultX) as registered tax practitioner to access your SARS eFiling profile.",
      mandatory: true,
      acceptedFormats: ["application/pdf"],
      validationRules: ["Must be signed by public officer or registered representative"],
    },
    {
      id: "latest_sars_statement_of_account",
      name: "Latest SARS Statement of Account (ITSA / VATSA / EMPSA)",
      category: "financial",
      description: "Recent Statement of Account downloaded from eFiling within the last 30 days.",
      mandatory: false,
      acceptedFormats: ["application/pdf"],
      validationRules: ["If not provided, ConsultX will pull directly upon eFiling transfer"],
    },
    {
      id: "certified_director_id",
      name: "Certified ID of Public Officer / Director",
      category: "identity",
      description: "Certified copy of green ID book, Smart ID card, or foreign passport.",
      mandatory: true,
      acceptedFormats: ["application/pdf", "image/jpeg", "image/png"],
      validationRules: ["Certification stamp must be dated within 90 days"],
    },
  ],
  workflowStages: [
    {
      step: 1,
      title: "Tax Diagnostic & eFiling Profile Linkage",
      description: "Transfer or invite ConsultX tax practitioner profile and run comprehensive diagnostic audit.",
      actor: "craig_ca_sa",
      inputsRequired: ["Company Tax Number", "eFiling Profile Access", "Public Officer Mandate"],
      actionDescription: "Inspect all 4 tax heads, check return compliance dashboard, pull Statement of Account balances.",
      deliverablesGenerated: ["SARS Compliance Diagnostic Report", "Tax Deficiency Checklist"],
      estimatedDurationHours: 2,
    },
    {
      step: 2,
      title: "Deficiency Remediation & Reconciliation",
      description: "Reconcile discrepancies, prepare missing returns or negotiate payment deferral.",
      actor: "craig_ca_sa",
      inputsRequired: ["Outstanding Return Data", "Proof of Payments"],
      actionDescription:
        "Draft and submit any missing zero or historical returns; allocate unallocated payments; dispute unwarranted administrative penalties.",
      deliverablesGenerated: ["Remediation Working Papers", "Proof of Submission Receipts"],
      estimatedDurationHours: 4,
    },
    {
      step: 3,
      title: "TCS PIN Lodgement & Instant Clearance Issuance",
      description: "Lodge formal TCS request with SARS and retrieve live PIN.",
      actor: "system_automation",
      inputsRequired: ["Clean SARS Profile"],
      actionDescription:
        "Submit Good Standing TCS application via SARS eFiling API; capture verification PIN and expiry date; generate client TCS certificate pack.",
      deliverablesGenerated: ["Official SARS Tax Compliance Status PIN Certificate (PDF)"],
      estimatedDurationHours: 1,
    },
    {
      step: 4,
      title: "Continuous Monitoring & Proactive Expiry Alert",
      description: "Store PIN in client vault and monitor standing.",
      actor: "system_automation",
      inputsRequired: ["Issued TCS PIN"],
      actionDescription:
        "Encrypt and archive certificate in ConsultX vault; schedule automated compliance probe for day 330 (35 days before annual expiry).",
      deliverablesGenerated: ["Vault Archival Record", "Automated Renewal Schedule"],
      estimatedDurationHours: 0.5,
    },
  ],
  infrastructureMapping: {
    portalRoute: "/portal/services/tax",
    gcsBucketFolder: "gs://consultx-client-vault/{companyId}/tax/",
    cloudRunService: "tax-compliance-worker",
    gcpSecretsRequired: ["consultx-bank-details", "sars-efiling-credentials"],
  },
};
