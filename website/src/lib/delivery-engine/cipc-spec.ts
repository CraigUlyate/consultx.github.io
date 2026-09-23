import { ServiceDeliverySpec } from "./types";

/**
 * Statutory Delivery Specification: CIPC Annual Return & Beneficial Ownership Compliance
 * Governing Standards: Companies Act 71 of 2008 (s33, s56) & General Laws Amendment Act 22 of 2022
 */
export const CIPC_DELIVERY_SPEC: ServiceDeliverySpec = {
  serviceId: "cipc_annual_return",
  serviceName: "CIPC Annual Return & Beneficial Ownership Register Filing",
  category: "compliance",
  leadProfessional: "Craig Ulyate (CA(SA))",
  summary:
    "Statutory annual return filing and Beneficial Ownership (BO) register lodgement with the Companies and Intellectual Property Commission (CIPC). Prevents administrative deregistration, maintains legal capacity to contract, and guarantees compliance with South Africa's anti-money laundering legal framework.",
  scopeInclusions: [
    "Calculation of exact statutory CIPC turnover fee based on latest approved annual financial statements or FAS",
    "Lodgement of CIPC Annual Return within statutory 30-business-day window following company anniversary",
    "Preparation and submission of the mandatory Beneficial Ownership (BO) register with CIPC",
    "Cascading ownership breakdown identifying all natural persons holding 5% or more beneficial interest or voting rights",
    "Verification of certified ID copies / passports and proof of residential address for all declared beneficial owners",
    "Drafting of director authorizing resolution / Power of Attorney mandate",
    "Issuance of official CIPC Filing Certificate (COR30.1 / Confirmation of Lodgement)",
    "Archival in ConsultX secure client vault with automated 11-month renewal reminders",
  ],
  scopeExclusions: [
    "Retrospective restoration of already-deregistered companies (requires separate CIPC Reinstatement service R1,565)",
    "Drafting of new bespoke Memorandum of Incorporation (MOI amendments available as separate mandate R1,500)",
    "Payment of historic CIPC penalty fees accrued across multiple overdue financial years (billed at actual CIPC cost)",
  ],
  typicalTurnaroundDays: 2,
  knowledgeBase: {
    regulatoryFramework:
      "Companies Act 71 of 2008 (Section 33, Section 56(12)), General Laws (Anti-Money Laundering and Combating Terrorism Financing) Amendment Act 22 of 2022, CIPC Notice 23 of 2023.",
    primaryMethodologies: [
      "Turnover-Tiered Statutory Filing: CIPC statutory fee table lookup against latest approved AFS turnover",
      "Look-Through Beneficial Ownership Tree: Tracing shareholdings through holding companies, trusts, and partnerships to ultimate natural persons",
      "CIPC e-Services Automated API Lodgement with verified credit account debit",
    ],
    statutoryDeadlines:
      "Must be filed within 30 business days after the company's incorporation anniversary date each calendar year. Late filing incurs a statutory penalty fee and triggers deregistration warnings after 60 business days.",
    technicalFormulas: {
      Turnover_Tier_Lookup: "Pty Ltd: <R1M = R100 (Late: R150); R1M-R10M = R450 (Late: R600); R10M-R25M = R2,000 (Late: R2,500); >R25M = R3,000 (Late: R4,000). CC: <R50M = R100 (Late: R250); >R50M = R4,000.",
      BO_Threshold: "Direct or indirect holding of >= 5% of issued shares, voting rights, or right to appoint/remove majority of board.",
      PI_Score_FAS_Rule: "If Public Interest Score (PIS) >= 100 or turnover >= R10m, Financial Accountability Supplement (FAS) or audited/reviewed AFS in iXBRL is required.",
    },
    riskCheckpoints: [
      "Deregistration Risk: Failure to file for 2 consecutive years causes CIPC to initiate final deregistration, freezing bank accounts and forfeiting company assets to the State (Bona Vacantia)",
      "BO Non-Compliance Sanction: Up to R1,000,000 administrative fine or 10% of turnover under s171 of Companies Act for failure to establish and maintain BO register",
      "Trustee Look-Through: Where shares are held by a Family Trust, all trustees, named beneficiaries, and the founder must be disclosed on the BO register",
    ],
    frequentlyAskedQuestions: [
      {
        question: "Why do I need to file Beneficial Ownership if my shareholding hasn't changed?",
        answer:
          "Under the General Laws Amendment Act 2022, every South African company must update or confirm its Beneficial Ownership register with CIPC at least once every 12 months, or within 10 days of any shareholding or director change.",
      },
      {
        question: "What happens if our company turnover was zero or we were dormant?",
        answer:
          "Dormant companies must still file an annual return and declare zero turnover. The minimum CIPC statutory fee of R100 applies. Failure to file dormant returns still triggers administrative deregistration.",
      },
      {
        question: "What documents must beneficial owners provide?",
        answer:
          "Each beneficial owner holding 5% or more must provide a clear certified copy of their South African ID or Foreign Passport (certified within 3 months) and a signed mandate authorizing the filing.",
      },
    ],
  },
  documentRequirements: [
    {
      id: "certified_ids_shareholders",
      name: "Certified ID / Passport of Beneficial Owners & Directors",
      category: "identity",
      description: "Clear copy of South African green barcoded ID book, smart ID card (both sides), or valid foreign passport. Certified by SAPS or Commissioner of Oaths within the last 3 months.",
      mandatory: true,
      acceptedFormats: ["application/pdf", "image/jpeg", "image/png"],
      validationRules: [
        "Certification stamp must be dated within 90 days",
        "SA ID number must pass Luhn checksum validation",
        "Both front and back required for smart ID cards",
      ],
    },
    {
      id: "securities_share_register",
      name: "Current Securities / Share Register & Cap Table",
      category: "statutory",
      description: "Official share register or share certificate copies demonstrating 100% of issued share capital and beneficial ownership percentages.",
      mandatory: true,
      acceptedFormats: ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      validationRules: [
        "Total declared shareholdings must sum exactly to 100%",
        "Must specify share classes and voting rights",
      ],
    },
    {
      id: "latest_financial_turnover",
      name: "Latest Approved Financial Statements or Turnover Declaration",
      category: "financial",
      description: "Signed AFS or management accounts showing gross turnover for the financial year being reported.",
      mandatory: true,
      acceptedFormats: ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      validationRules: [
        "Turnover must reflect annual gross revenue before deductions",
      ],
    },
    {
      id: "mandate_resolution",
      name: "Signed Director Authorization Mandate (Power of Attorney)",
      category: "legal",
      description: "Signed resolution by board of directors authorizing Craig Ulyate CA(SA) / ConsultX to lodge returns and BO records on behalf of the entity.",
      mandatory: true,
      acceptedFormats: ["application/pdf"],
      validationRules: [
        "Must be signed by at least one active CIPC-registered director",
      ],
    },
  ],
  workflowStages: [
    {
      step: 1,
      title: "Company Intake & Turnover Verification",
      description: "Client verifies company details, anniversary date, and declares gross annual turnover.",
      actor: "client",
      inputsRequired: ["CIPC Registration Number", "Financial Year-End Turnover", "Late Filing Status"],
      actionDescription: "Platform matches company records, calculates exact CIPC fee tier, and adds ConsultX fixed professional fee (R850).",
      deliverablesGenerated: ["Statutory Fee Assessment Card", "Pro-Forma Invoice"],
      estimatedDurationHours: 1,
    },
    {
      step: 2,
      title: "Beneficial Ownership (BO) Cascade Builder",
      description: "Client declares all natural persons holding 5% or more shares or voting control.",
      actor: "client",
      inputsRequired: ["Shareholder Names", "SA ID / Passport Numbers", "% Shareholding", "PEP Status"],
      actionDescription:
        "Platform validates ownership cascade to ensure 100% cap table reconciliation and checks for politically exposed person (PEP) status.",
      deliverablesGenerated: ["Beneficial Ownership Register Schedule", "Look-Through Ownership Diagram"],
      estimatedDurationHours: 2,
      automatedTriggers: ["Notify client if certified ID copies are missing or older than 3 months"],
    },
    {
      step: 3,
      title: "Document Verification & CA(SA) Pre-Flight Check",
      description: "ConsultX compliance team reviews ID certifications, share registers, and mandate authorization.",
      actor: "craig_ca_sa",
      inputsRequired: ["Certified IDs", "Share Register", "Signed Mandate Resolution"],
      actionDescription:
        "Verify identity documents against DHA validation standards, confirm share register consistency with CIPC COR14.3 records, and prepare XML/JSON lodgement payloads.",
      deliverablesGenerated: ["Verified CIPC Lodgement Package"],
      estimatedDurationHours: 1,
      craigChecklistItems: [
        "Confirm ID certification date is within 90 days",
        "Reconcile share register against active directors on CIPC database",
        "Ensure no pending deregistration or court notices",
      ],
    },
    {
      step: 4,
      title: "Statutory Lodgement, Fee Debit & Confirmation Archival",
      description: "Execution of filing on CIPC system and delivery of official certificates.",
      actor: "system_automation",
      inputsRequired: ["Verified Lodgement Package", "CIPC Portal Balance"],
      actionDescription:
        "Automated filing of annual return, debiting of CIPC credit balance, submission of BO register XML, retrieval of COR30.1 confirmation letter, and archival in client vault.",
      deliverablesGenerated: ["Official CIPC COR30.1 Confirmation Letter", "Beneficial Ownership Filing Receipt", "ConsultX Tax Invoice"],
      estimatedDurationHours: 1,
      automatedTriggers: ["Email client with download link to CIPC certificate", "Schedule next year's filing reminder for T-30 days"],
    },
  ],
  infrastructureMapping: {
    portalRoute: "/portal/services/cipc",
    gcsBucketFolder: "gs://consultx-client-vault/{companyId}/cipc/",
    cloudRunService: "cipc-filing-worker",
    gcpSecretsRequired: ["consultx-bank-details", "cipc-api-credentials"],
  },
};
