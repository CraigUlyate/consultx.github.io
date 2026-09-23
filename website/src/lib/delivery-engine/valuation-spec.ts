import { ServiceDeliverySpec } from "./types";

/**
 * Flagship Delivery Specification: Independent Business Valuations & Transaction Advisory
 * Governing Standards: International Valuation Standards (IVS 2025) & SAICA CA(SA) Practice
 */
export const VALUATION_DELIVERY_SPEC: ServiceDeliverySpec = {
  serviceId: "valuation_comprehensive",
  serviceName: "Comprehensive CA(SA) Independent Business Valuation Report",
  category: "valuation",
  leadProfessional: "Craig Ulyate (CA(SA))",
  summary:
    "Rigorous, defensible independent business valuation report applying Discounted Cash Flow (DCF), Maintainable EBITDA Multiples, and Adjusted Net Asset Value (NAV). Prepared for shareholder buyouts, business sales, capital raises, and commercial litigation.",
  scopeInclusions: [
    "Normalization of historical earnings (reversing excess owner perks, non-market market rent, one-off litigation/insurance events)",
    "3-5 year Discounted Cash Flow (DCF) model with explicit forecast period and Gordon Growth terminal value",
    "Weighted Average Cost of Capital (WACC) build-up via Capital Asset Pricing Model (CAPM) adapted for South African risk premiums and size premiums",
    "South African SME industry peer EBITDA multiple benchmarking and transaction precedent comparisons",
    "Sensitivity tables testing terminal growth rates vs. discount rates",
    "Formal, signed Valuation Certificate and 25-40 page Valuation Report authored by Craig Ulyate (CA(SA))",
    "60-minute executive presentation meeting with directors/shareholders",
  ],
  scopeExclusions: [
    "Full forensic accounting investigation of fraudulent accounting records (available as separate forensic mandate)",
    "Legal drafting of Share Purchase Agreements (SPA) or shareholder buyout contracts (requires commercial legal counsel)",
    "Statutory audit opinion under International Standards on Auditing",
  ],
  typicalTurnaroundDays: 14,
  knowledgeBase: {
    regulatoryFramework:
      "International Valuation Standards (IVS), SAICA Code of Professional Conduct, Companies Act 71 of 2008 s164 (fair value determinations).",
    primaryMethodologies: [
      "Income Approach: Discounted Cash Flow (DCF) with mid-year convention",
      "Market Approach: Comparable Company EBITDA Multiples (EV/EBITDA, P/E) adjusted for illiquidity and private company discount (typically 20-30%)",
      "Asset Approach: Adjusted Net Asset Value (NAV) evaluating tangible and intangible assets at net realizable value",
    ],
    technicalFormulas: {
      Cost_of_Equity: "Ke = Rf + Beta_levered * (ERP) + Size_Premium + Specific_Company_Risk",
      WACC: "WACC = (E/V * Ke) + (D/V * Kd * (1 - Corporate_Tax_Rate))",
      Terminal_Value: "TV = [FCF_final * (1 + g)] / (WACC - g)",
      Enterprise_Value: "EV = PV(FCF_forecast) + PV(TV)",
      Equity_Value: "Equity Value = Enterprise Value + Surplus Cash / Non-operating Assets - Interest Bearing Debt",
    },
    riskCheckpoints: [
      "Customer concentration risk: check if > 30% of revenue is derived from a single customer",
      "Owner dependency: check if key commercial relationships reside solely with the founder",
      "Working capital normalization: evaluate whether historical working capital matches ongoing operational needs",
      "Tax liabilities: verify that deferred tax and SARS dispute reserves are factored into the net debt bridge",
    ],
    frequentlyAskedQuestions: [
      {
        question: "Why can't I just use a simple rule-of-thumb EBITDA multiple?",
        answer:
          "Rules of thumb ignore working capital debt, owner salary normalization, capital expenditure reinvestment, and company-specific risk. Banks, SARS, and institutional buyers will only accept a defensible valuation combining DCF and normalized multiples prepared by a CA(SA).",
      },
      {
        question: "How do you handle owner expenses and personal perks in the accounts?",
        answer:
          "We perform an earnings normalization audit. We add back non-commercial expenses (personal travel, family cellphones, above-market owner salaries) to arrive at true Maintainable Operating EBITDA.",
      },
      {
        question: "What discount rate do you apply for South African private businesses?",
        answer:
          "We build up WACC using SA 10-year sovereign bond yields (R2032/R2035) as the risk-free rate, plus equity risk premiums, a private company illiquidity discount (DLOM), and small-stock size premiums.",
      },
    ],
  },
  documentRequirements: [
    {
      id: "afs_3_years",
      name: "Signed Annual Financial Statements (3-5 Years)",
      category: "financial",
      description: "Full signed historical AFS including balance sheet, income statement, cash flows, and notes.",
      mandatory: true,
      acceptedFormats: ["application/pdf"],
      validationRules: ["Must be signed by directors / accounting officer", "Must cover at least 3 consecutive financial years"],
    },
    {
      id: "interim_management_accounts",
      name: "Current Year Management Accounts & Trial Balance",
      category: "financial",
      description: "YTD monthly P&L and Balance Sheet from Xero, Sage, or QuickBooks covering up to the latest closed month.",
      mandatory: true,
      acceptedFormats: ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      validationRules: ["Trial balance must balance", "Must be within 60 days of current date"],
    },
    {
      id: "financial_projections",
      name: "Financial Budgets & Cash Flow Forecasts (1-3 Years)",
      category: "financial",
      description: "Management's projected revenue, gross margins, overheads, and capital expenditure.",
      mandatory: false,
      acceptedFormats: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/pdf"],
      validationRules: ["If omitted, ConsultX will construct a baseline forecast with management during scoping"],
    },
    {
      id: "owner_addback_schedule",
      name: "Owner Remuneration & Discretionary Expense Schedule",
      category: "operational",
      description: "Itemized list of director salaries, bonuses, personal motor vehicles, and one-off extraordinary costs.",
      mandatory: true,
      acceptedFormats: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/plain"],
      validationRules: ["Must identify market-related replacement cost for executive duties"],
    },
    {
      id: "shareholder_structure",
      name: "Cap Table / Share Register & MOI",
      category: "statutory",
      description: "Official share register confirming issued shares, share classes, and any loan account agreements.",
      mandatory: true,
      acceptedFormats: ["application/pdf"],
      validationRules: ["Must account for 100% of issued share capital"],
    },
  ],
  workflowStages: [
    {
      step: 1,
      title: "Intake Diagnostic & Valuation Mandate",
      description: "Visitor completes AnNa AI valuation diagnostic and defines transaction context.",
      actor: "client",
      inputsRequired: ["Valuation purpose (sale, buyout, funding)", "Approximate turnover", "Lead contact details"],
      actionDescription: "Client signs digital engagement letter and pays 50% commencement retainer via Paystack or Investec EFT.",
      deliverablesGenerated: ["Valuation Brief Card", "Signed Engagement Mandate", "Pro-Forma Invoice"],
      estimatedDurationHours: 2,
    },
    {
      step: 2,
      title: "Document Vault Upload & Data Extraction",
      description: "Client uploads financial history to secure GCS cloud folder.",
      actor: "system_automation",
      inputsRequired: ["Historical AFS", "YTD Management Accounts", "Trial Balance"],
      actionDescription:
        "Platform validates documents, extracts historical income statement and balance sheet lines into unified computational schema, and flags missing periods.",
      deliverablesGenerated: ["Structured Financial Data Pack (JSON)", "Data Completeness Score"],
      estimatedDurationHours: 4,
      automatedTriggers: ["Dispatch magic return link if upload stalled", "Notify Craig when minimum 3-year AFS received"],
    },
    {
      step: 3,
      title: "Executive Scoping & Normalization Interview",
      description: "Craig CA(SA) meets with founder/CFO for deep-dive operational interview.",
      actor: "craig_ca_sa",
      inputsRequired: ["Structured Financial Data Pack", "Owner Add-back Schedule"],
      actionDescription:
        "Craig probes operational reality: customer contracts, recurring vs one-off revenue, replacement management cost, working capital cycle, and growth drivers.",
      deliverablesGenerated: ["Normalized Earnings Working Paper", "Agreed Add-back Schedule"],
      estimatedDurationHours: 3,
      craigChecklistItems: [
        "Audit executive remuneration vs market rates",
        "Strip non-operating assets (excess cash, investment properties)",
        "Identify historical extraordinary revenue spikes",
        "Confirm debt obligations and lease liabilities",
      ],
    },
    {
      step: 4,
      title: "Financial Modelling & Multi-Methodology Valuation",
      description: "Execution of DCF model, WACC build-up, and peer multiple benchmarking.",
      actor: "craig_ca_sa",
      inputsRequired: ["Normalized EBITDA", "Working capital history", "WACC parameters"],
      actionDescription:
        "Build 5-year discrete cash flow forecast; calculate free cash flow to firm (FCFF); establish enterprise value; apply debt/cash bridge to derive equity value; cross-check against industry EBITDA multiples and adjusted NAV.",
      deliverablesGenerated: ["Valuation Financial Model (Excel/Python)", "Sensitivity Matrix"],
      estimatedDurationHours: 8,
    },
    {
      step: 5,
      title: "Report Drafting & CA(SA) Quality Review",
      description: "Drafting of formal comprehensive 25-40 page independent valuation report.",
      actor: "craig_ca_sa",
      inputsRequired: ["Valuation Model", "Industry benchmarks", "Company background"],
      actionDescription:
        "Synthesize macro context, company competitive moat, historical financial performance, detailed methodology descriptions, valuation conclusion, and signed certificate of value.",
      deliverablesGenerated: ["Draft Valuation Report (PDF)"],
      estimatedDurationHours: 6,
      craigChecklistItems: [
        "Verify IVS compliance disclosures",
        "Sign independent CA(SA) declaration",
        "Check mathematical consistency between model and text",
      ],
    },
    {
      step: 6,
      title: "Executive Presentation, Final Delivery & Archival",
      description: "Formal delivery to client and statutory archival.",
      actor: "craig_ca_sa",
      inputsRequired: ["Final Report", "Client sign-off"],
      actionDescription:
        "Conduct 60-minute presentation with shareholders/board; release signed Valuation Certificate in portal; settle final balance; archive working papers in GCS vault with 7-year immutable retention policy.",
      deliverablesGenerated: ["Signed Valuation Certificate (PDF)", "Full Valuation Report", "7-Year Statutory Audit Pack"],
      estimatedDurationHours: 2,
    },
  ],
  infrastructureMapping: {
    portalRoute: "/portal/services/valuation",
    gcsBucketFolder: "gs://consultx-client-vault/{companyId}/valuations/",
    cloudRunService: "valuation-worker",
    gcpSecretsRequired: ["consultx-bank-details", "cloud-storage-sa-key"],
  },
};
