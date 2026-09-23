import { ServiceDeliverySpec } from "./types";

/**
 * Statutory Delivery Specification: Annual Financial Statements (AFS) Compilation & iXBRL Tagging
 * Governing Standards: Companies Act 71 of 2008 (s29, s30), IFRS for SMEs, CIPC iXBRL Taxonomy
 */
export const AFS_DELIVERY_SPEC: ServiceDeliverySpec = {
  serviceId: "afs_company",
  serviceName: "Annual Financial Statements (AFS) Compilation & CIPC iXBRL Tagging",
  category: "financial_statements",
  leadProfessional: "Craig Ulyate (CA(SA))",
  summary:
    "End-to-end statutory compilation of Annual Financial Statements (Pty Ltd, CC, or Trust) in accordance with IFRS for SMEs and the Companies Act 71 of 2008. Includes Public Interest Score (PIS) determination, accounting officer review, director approval pack, and CIPC-mandated iXBRL instance document tagging.",
  scopeInclusions: [
    "Full trial balance extraction, mapping, and general ledger reconciliation from Xero, Sage, QuickBooks, or Excel",
    "Calculation of Public Interest Score (PIS) to determine statutory reporting framework (Independent Review vs Compilation)",
    "Compilation of Statement of Financial Position, Statement of Comprehensive Income, Statement of Changes in Equity, and Statement of Cash Flows",
    "Preparation of full accounting policies and explanatory disclosure notes adhering to IFRS for SMEs",
    "Year-end adjusting journal entries (depreciation, deferred tax, accruals, prepayments, owner loan reconciliations)",
    "CIPC iXBRL taxonomy tagging (2025/2026 taxonomy) and CIPC validation pre-check",
    "Independent Accounting Officer / Compiler Report signed by Craig Ulyate (CA(SA))",
    "Director signature pack and permanent archival in ConsultX vault",
  ],
  scopeExclusions: [
    "Statutory Audit opinion required for public companies or high-PIS entities requiring external audit under s30(2) of Companies Act",
    "Prior year forensic reconstruction of books if no general ledger or trial balance exists (quoted under bookkeeping / document sorting)",
    "Drafting of complex group consolidated financial statements across multiple international subsidiaries (quoted separately)",
  ],
  typicalTurnaroundDays: 10,
  knowledgeBase: {
    regulatoryFramework:
      "Companies Act 71 of 2008 (Section 29, 30), Companies Regulations 2011 (Regulation 26-29), IFRS for SMEs, SAICA Financial Reporting Guides, CIPC iXBRL Mandate (Notice 43 of 2018).",
    primaryMethodologies: [
      "Compilation Engagement under ISRS 4410 (Revised) - Engagements to Compile Financial Statements",
      "IFRS for SMEs accounting standard application",
      "Public Interest Score calculation: 1 pt per employee (avg) + 1 pt per R1m turnover + 1 pt per R1m third-party liability + 1 pt per direct/indirect individual shareholder",
      "iXBRL inline XBRL tagging matching official CIPC taxonomy rules",
    ],
    statutoryDeadlines:
      "Must be compiled within 6 months of the company's financial year end. Companies with PIS >= 100 or audited entities must lodge AFS in iXBRL format alongside their annual return.",
    technicalFormulas: {
      PIS_Score: "PIS = Average_Employees + (Turnover / 1,000,000) + (Third_Party_Liabilities / 1,000,000) + Number_of_Shareholders",
      Review_Threshold: "PIS >= 100 (if internally compiled) or PIS >= 350 (if externally compiled) triggers Independent Review under ISRE 2400",
      Audit_Threshold: "PIS >= 350 (internally compiled) or PIS >= 500 triggers statutory audit under ISA",
    },
    riskCheckpoints: [
      "Director Loan Overdrafts: s45 of Companies Act requires special shareholder resolution and solvency/liquidity test if company provides financial assistance to directors",
      "Reckless Trading: Balance sheet insolvency (liabilities exceed assets) requires formal director subordination agreements or risk s22 reckless trading sanctions",
      "iXBRL Validation Errors: Mismatched mandatory CIPC tags (e.g. Director appointment dates or PIS score) cause immediate CIPC submission rejection",
    ],
    frequentlyAskedQuestions: [
      {
        question: "Does our SME company need an Audit or a Compilation?",
        answer:
          "Over 90% of private (Pty) Ltd companies with owner-managers do not require an expensive audit. Under the Companies Act, if your Public Interest Score is under 100, an independent compilation report signed by a CA(SA) fulfills all statutory, banking, and SARS requirements.",
      },
      {
        question: "What is iXBRL and why is it needed for our AFS?",
        answer:
          "iXBRL (Inline eXtensible Business Reporting Language) is CIPC's digital standard that embeds machine-readable tags into financial statements. When filing your Annual Return, CIPC requires qualifying entities to upload their AFS as an iXBRL file rather than a standard PDF.",
      },
      {
        question: "Can ConsultX compile AFS if we haven't reconciled our bank accounts yet?",
        answer:
          "We can assist! We can perform the catch-up bookkeeping and bank reconciliation before compiling the AFS, ensuring your general ledger balances to the cent.",
      },
    ],
  },
  documentRequirements: [
    {
      id: "signed_prior_year_afs",
      name: "Prior Year Signed Financial Statements",
      category: "financial",
      description: "Signed AFS from previous financial year establishing opening balances and comparative figures.",
      mandatory: true,
      acceptedFormats: ["application/pdf"],
      validationRules: ["Must include prior year comparative figures"],
    },
    {
      id: "trial_balance_full_year",
      name: "Full Year-End Trial Balance & General Ledger",
      category: "financial",
      description: "Detailed 12-month trial balance exported from Xero, Sage, QuickBooks, or Excel.",
      mandatory: true,
      acceptedFormats: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/pdf"],
      validationRules: ["Total debits must equal total credits exactly"],
    },
    {
      id: "year_end_bank_statements",
      name: "12th Month Bank Statement (Closing Balances)",
      category: "financial",
      description: "Bank statement reflecting closing balances on the exact last day of the financial year for all accounts.",
      mandatory: true,
      acceptedFormats: ["application/pdf"],
      validationRules: ["Must match trial balance closing bank ledger"],
    },
    {
      id: "fixed_asset_register",
      name: "Fixed Asset Register & Capital Additions Invoices",
      category: "operational",
      description: "Schedule of property, plant, vehicles, and equipment detailing purchases and disposals during the year.",
      mandatory: false,
      acceptedFormats: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/pdf"],
      validationRules: ["Required if new assets > R50,000 acquired during the year"],
    },
    {
      id: "loan_agreements_confirmations",
      name: "Loan Agreements & Shareholder Loan Confirmations",
      category: "legal",
      description: "Loan schedules or confirmations for director loans, bank overdrafts, or vehicle asset finance.",
      mandatory: false,
      acceptedFormats: ["application/pdf"],
      validationRules: ["Required if interest-bearing debt exists"],
    },
  ],
  workflowStages: [
    {
      step: 1,
      title: "Data Extraction & Public Interest Score Calculation",
      description: "Ingest trial balance, calculate statutory PIS score, and determine reporting framework.",
      actor: "system_automation",
      inputsRequired: ["Trial Balance", "Employee Count", "Shareholder Structure"],
      actionDescription: "Run automated PIS algorithm, map ledger accounts to IFRS for SMEs chart of accounts, flag unmapped codes.",
      deliverablesGenerated: ["Public Interest Score Certificate", "Chart of Accounts Mapping Matrix"],
      estimatedDurationHours: 2,
    },
    {
      step: 2,
      title: "Accounting Officer Review & Year-End Adjustments",
      description: "Craig CA(SA) reviews adjustments, tax computations, and owner reconciliations.",
      actor: "craig_ca_sa",
      inputsRequired: ["Bank Statements", "Asset Schedules", "Mapping Matrix"],
      actionDescription:
        "Perform depreciation calculations, compute current and deferred income tax, post accruals and prepayments, and reconcile shareholder loan accounts.",
      deliverablesGenerated: ["Adjusting Journal Entries Schedule", "Working Paper File"],
      estimatedDurationHours: 4,
      craigChecklistItems: [
        "Audit Section 45 director loan compliance",
        "Verify bank reconciliation to verified third-party bank statements",
        "Calculate corporate tax provision and compare to SARS eFiling Statement of Account",
      ],
    },
    {
      step: 3,
      title: "Draft AFS Compilation under IFRS for SMEs",
      description: "Generation of complete financial statements with full disclosure notes.",
      actor: "craig_ca_sa",
      inputsRequired: ["Working Paper File"],
      actionDescription:
        "Draft complete 15-25 page financial statement pack including Accounting Officer Report, Directors' Report, and statutory disclosure notes.",
      deliverablesGenerated: ["Draft Annual Financial Statements (PDF)"],
      estimatedDurationHours: 4,
    },
    {
      step: 4,
      title: "CIPC iXBRL Tagging & Pre-Submission Validation",
      description: "Automated tagging of financial items to CIPC 2025/2026 taxonomy.",
      actor: "system_automation",
      inputsRequired: ["Approved Draft AFS"],
      actionDescription:
        "Tag mandatory CIPC disclosures, run taxonomy validation algorithms to ensure 0 critical validation errors, and generate CIPC iXBRL package.",
      deliverablesGenerated: ["Validated iXBRL Instance Document (.xhtml)"],
      estimatedDurationHours: 2,
    },
    {
      step: 5,
      title: "Director Signing & Statutory Vault Archival",
      description: "Digital signature by directors and final delivery.",
      actor: "client",
      inputsRequired: ["Draft AFS"],
      actionDescription:
        "Directors approve and sign AFS via portal; Craig CA(SA) signs Accounting Officer declaration; final certified AFS archived in vault.",
      deliverablesGenerated: ["Fully Signed Certified AFS Pack", "iXBRL Filing File", "7-Year Statutory Record"],
      estimatedDurationHours: 1,
    },
  ],
  infrastructureMapping: {
    portalRoute: "/portal/services/onboard?services=afs_company",
    gcsBucketFolder: "gs://consultx-client-vault/{companyId}/afs/",
    cloudRunService: "ixbrl-engine-worker",
    gcpSecretsRequired: ["consultx-bank-details"],
  },
};
