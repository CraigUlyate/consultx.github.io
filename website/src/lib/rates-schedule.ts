/**
 * ConsultX 2026 Rates Schedule
 * Sourced directly from official 2026 Rates Schedule (Examples/2026 Rates.xlsx)
 * All prices exclude 15% VAT unless specified.
 */

export interface ServiceItem {
  id: string;
  name: string;
  category: "taxation" | "compliance" | "financial_statements" | "bookkeeping" | "valuation" | "advisory";
  basePriceZar: number;
  priceFormatted: string;
  billingType: "per_submission" | "once_off" | "per_month" | "per_year" | "per_employee" | "per_hour" | "per_km";
  description: string;
  requiredDocuments: string[];
}

export const RATES_SCHEDULE_2026: ServiceItem[] = [
  // ==========================================
  // Annual Financial Statements & Tax Returns
  // ==========================================
  {
    id: "afs_company",
    name: "Company (Pty Ltd) Annual Financial Statements & Tax Return",
    category: "financial_statements",
    basePriceZar: 9900,
    priceFormatted: "From R9,900",
    billingType: "once_off",
    description: "Compilation of Annual Financial Statements (AFS) for private companies and submission of IT14 corporate tax return.",
    requiredDocuments: [
      "Latest signed Trial Balance or detailed general ledger",
      "Prior year signed Annual Financial Statements",
      "Bank statements for the financial year-end month",
      "Fixed asset additions and loan account schedules",
    ],
  },
  {
    id: "afs_cc",
    name: "Close Corporation (CC) Annual Financial Statements & Tax Return",
    category: "financial_statements",
    basePriceZar: 9500,
    priceFormatted: "From R9,500",
    billingType: "once_off",
    description: "Compilation of annual financial statements and corporate tax return for Close Corporations.",
    requiredDocuments: [
      "Trial balance or full year transaction export",
      "Prior year signed AFS",
      "Year-end bank statements",
      "Members' loan account movements",
    ],
  },
  {
    id: "afs_sole_prop",
    name: "Sole Proprietor Financial Statements & Income Tax",
    category: "financial_statements",
    basePriceZar: 7500,
    priceFormatted: "From R7,500",
    billingType: "once_off",
    description: "Statement of assets & liabilities, annual revenue/expense statements, and individual tax submission for sole proprietors.",
    requiredDocuments: [
      "12-month business bank statements",
      "Summary of revenue and categorized business expenses",
      "Asset purchase slips / vehicle logbook (if claiming travel)",
    ],
  },
  {
    id: "afs_trust",
    name: "Trust Annual Financial Statements & Income Tax (IT12TR)",
    category: "financial_statements",
    basePriceZar: 9900,
    priceFormatted: "From R9,900",
    billingType: "once_off",
    description: "Financial statements compilation for family and trading trusts including IT12TR income tax submission.",
    requiredDocuments: [
      "Trust deed & letters of authority",
      "Bank statements for all trust accounts",
      "Asset schedules, loan agreements, and beneficiary distribution resolutions",
    ],
  },
  {
    id: "afs_partnership",
    name: "Partnership Annual Financial Statements & Income Tax",
    category: "financial_statements",
    basePriceZar: 9000,
    priceFormatted: "From R9,000",
    billingType: "once_off",
    description: "Financial statement compilation and partners' profit/loss distribution schedules.",
    requiredDocuments: [
      "Partnership agreement",
      "Full year transaction ledger / bank statements",
      "Partners' capital account reconciliations",
    ],
  },
  {
    id: "tax_individual_basic",
    name: "Individual Basic Income Tax Return (IRP5 Only)",
    category: "financial_statements",
    basePriceZar: 950,
    priceFormatted: "R950",
    billingType: "per_submission",
    description: "Annual personal income tax preparation and eFiling submission for salaried employees with IRP5 only.",
    requiredDocuments: [
      "IRP5 tax certificate from employer",
      "Medical aid tax certificate (if applicable)",
      "Retirement annuity contribution certificate (RAF)",
    ],
  },
  {
    id: "tax_individual_complex",
    name: "Individual Income Tax (Multi-Source / Rental / Investments)",
    category: "financial_statements",
    basePriceZar: 1850,
    priceFormatted: "R1,850",
    billingType: "per_submission",
    description: "Personal income tax filing with rental income, investment income, capital gains, or multiple income sources.",
    requiredDocuments: [
      "IRP5 certificates",
      "Rental property income & expense schedule with municipal rates & levy statements",
      "IT3b / IT3c investment income certificates",
      "Logbook and travel allowance documentation",
    ],
  },
  {
    id: "tax_individual_commission",
    name: "Individual Income Tax (Commission Earners / Higher Complexity)",
    category: "financial_statements",
    basePriceZar: 2200,
    priceFormatted: "R2,200",
    billingType: "per_submission",
    description: "Individual income tax return for commission earners claiming qualifying s11(a) business deductions.",
    requiredDocuments: [
      "IRP5 showing commission code 3606",
      "Full schedule of business expenses and supporting invoices",
      "Vehicle logbook and home office calculations",
    ],
  },
  {
    id: "cgt_addon",
    name: "Capital Gains Tax (CGT) Calculation Add-on",
    category: "financial_statements",
    basePriceZar: 1500,
    priceFormatted: "From R1,500",
    billingType: "per_submission",
    description: "Base cost valuation, disposal calculation, and capital gains tax scheduling for property or share sales.",
    requiredDocuments: [
      "Deed of sale and original acquisition contracts",
      "Valuation certificates as at 1 October 2001 (if pre-CGT asset)",
      "Schedule of capital improvement costs",
    ],
  },

  // ==========================================
  // Taxation Services & SARS Registrations
  // ==========================================
  {
    id: "vat_registration",
    name: "SARS VAT Registration",
    category: "taxation",
    basePriceZar: 1500,
    priceFormatted: "R1,500 – R1,750",
    billingType: "per_submission",
    description: "Full SARS VAT registration application with biometric appointment booking and document bundle support.",
    requiredDocuments: [
      "Proof of business address (utility bill < 3 months)",
      "3 months certified bank statements showing R50,000+ taxable turnover",
      "Certified ID copy of public officer / representative director",
      "CIPC registration certificate (COR14.3)",
      "Customer invoices / contracts proving trade",
    ],
  },
  {
    id: "tax_clearance",
    name: "SARS Tax Clearance Certificate (TCS PIN)",
    category: "taxation",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Full compliance audit, resolution of outstanding returns, and generation of official SARS Good Standing TCS PIN.",
    requiredDocuments: [
      "Company registration number and Income Tax reference number",
      "Representative director authorization letter",
      "Clearance of any outstanding SARS returns or administrative penalties",
    ],
  },
  {
    id: "paye_registration",
    name: "PAYE / UIF Registration with SARS",
    category: "taxation",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Registration of employer payroll taxes with SARS (PAYE, UIF, and SDL where applicable).",
    requiredDocuments: [
      "CIPC certificate & director ID copy",
      "Proof of business bank account (stamped bank letter)",
      "First employment contracts or payroll schedule",
    ],
  },
  {
    id: "income_tax_reg",
    name: "SARS Income Tax Registration",
    category: "taxation",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Corporate or individual SARS income tax profile activation and public officer appointment.",
    requiredDocuments: [
      "CIPC incorporation pack",
      "Public officer appointment letter and certified ID",
    ],
  },
  {
    id: "vat201_submission",
    name: "Submission of VAT201 via eFiling",
    category: "taxation",
    basePriceZar: 350,
    priceFormatted: "R350 / submission",
    billingType: "per_submission",
    description: "Bi-monthly or monthly VAT return calculation, output/input tax reconciliation, and SARS eFiling lodgment.",
    requiredDocuments: [
      "VAT summary report / general ledger tax report",
      "Input VAT tax invoices for high-value claims",
    ],
  },
  {
    id: "emp201_monthly",
    name: "Submission of EMP201 via eFiling",
    category: "taxation",
    basePriceZar: 350,
    priceFormatted: "R350 / submission",
    billingType: "per_submission",
    description: "Monthly calculation and eFiling lodgment of PAYE, UIF, and SDL payroll liabilities.",
    requiredDocuments: [
      "Monthly payroll summary report or employee earnings schedule",
    ],
  },
  {
    id: "provisional_tax_company",
    name: "Provisional Tax Returns (IRP6 - 1st & 2nd Period)",
    category: "taxation",
    basePriceZar: 950,
    priceFormatted: "R950 / submission",
    billingType: "per_submission",
    description: "Estimation of taxable income, calculation of provisional tax liabilities, and eFiling submission of IRP6 returns.",
    requiredDocuments: [
      "Interim management accounts or 6-month trial balance",
      "Estimated full-year turnover and taxable profit forecast",
    ],
  },
  {
    id: "emp501_biannual",
    name: "Bi-Annual EMP501 Employer Reconciliation & IRP5s",
    category: "taxation",
    basePriceZar: 2500,
    priceFormatted: "From R2,500 + R125/emp",
    billingType: "per_submission",
    description: "Interim (August) and Annual (February) EMP501 payroll reconciliation, e@syFile validation, and tax certificates generation.",
    requiredDocuments: [
      "Monthly EMP201 receipts and proof of SARS payments",
      "Full payroll tax ledger / VIP / SimplePay export",
    ],
  },
  {
    id: "irp5_prep",
    name: "IRP5 Preparation & Reconciliation (Per Employee)",
    category: "taxation",
    basePriceZar: 150,
    priceFormatted: "R150 / employee",
    billingType: "per_employee",
    description: "Preparation of annual employee tax certificate (IRP5/IT3a) and reconciliation with SARS.",
    requiredDocuments: [
      "Employee personal details (ID, tax number, postal address)",
      "Full year payslips or payroll earnings export",
    ],
  },
  {
    id: "tax_advisory",
    name: "Tax Advisory & Strategy Consultation",
    category: "taxation",
    basePriceZar: 1500,
    priceFormatted: "R1,500 / hour",
    billingType: "per_hour",
    description: "Specialist consultation with Craig Ulyate (CA(SA)) on corporate tax optimization, CGT, and SARS dispute resolution.",
    requiredDocuments: [
      "Summary of tax query or SARS correspondence",
    ],
  },
  {
    id: "tax_directives",
    name: "Application for SARS Tax Directives",
    category: "taxation",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Application for severance benefit, retirement lump sum, or fixed-rate tax directive with SARS.",
    requiredDocuments: [
      "Directive application forms & employer letters",
      "Severance or remuneration agreement",
    ],
  },
  {
    id: "wca_return",
    name: "Submission of Annual WCA / COIDA Return",
    category: "taxation",
    basePriceZar: 350,
    priceFormatted: "R350",
    billingType: "per_submission",
    description: "Annual Return of Earnings (ROE) submission with Compensation Commissioner (COIDA).",
    requiredDocuments: [
      "Annual payroll summary confirming total employee earnings",
    ],
  },
  {
    id: "ui19_submission",
    name: "UI19 Submission at Department of Labour",
    category: "taxation",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Filing and resolution of UI19 employee declaration forms at Department of Labour.",
    requiredDocuments: [
      "Signed UI19 forms and employment contracts",
    ],
  },

  // ==========================================
  // CIPC & Statutory Company Secretarial
  // ==========================================
  {
    id: "cipc_annual_return",
    name: "CIPC Annual Return Filing",
    category: "compliance",
    basePriceZar: 850,
    priceFormatted: "R850 admin + CIPC fee",
    billingType: "per_submission",
    description: "Preparation, statutory fee payment, and lodging of annual compliance return with CIPC (tiered by annual turnover).",
    requiredDocuments: [
      "Approved annual turnover figure or latest trial balance",
      "Confirmation of current directorship and registered address",
    ],
  },
  {
    id: "cipc_ar_tier1",
    name: "CIPC Annual Return (Turnover under R1 Million)",
    category: "compliance",
    basePriceZar: 470,
    priceFormatted: "R470 (or R690 late)",
    billingType: "per_submission",
    description: "Preparation, statutory fee payment, and lodging of annual compliance return with CIPC for turnover under R1M.",
    requiredDocuments: [
      "Approved annual turnover figure",
      "Confirmation of current beneficial ownership details",
    ],
  },
  {
    id: "cipc_ar_tier2",
    name: "CIPC Annual Return (Turnover R1M to R10M)",
    category: "compliance",
    basePriceZar: 815,
    priceFormatted: "R815 (or R1,000 late)",
    billingType: "per_submission",
    description: "Annual return lodgment including CIPC statutory fees for medium enterprises.",
    requiredDocuments: [
      "Financial statements or signed turnover declaration",
      "Beneficial ownership register confirmation",
    ],
  },
  {
    id: "cipc_ar_tier3",
    name: "CIPC Annual Return (Turnover R10M to R25M)",
    category: "compliance",
    basePriceZar: 3375,
    priceFormatted: "R3,375 (or R4,375 late)",
    billingType: "per_submission",
    description: "Annual return compliance filing including statutory fees for mid-market entities.",
    requiredDocuments: [
      "Signed AFS or FAS disclosure extract",
      "Beneficial ownership certificate",
    ],
  },
  {
    id: "cipc_ar_tier4",
    name: "CIPC Annual Return (Turnover R25M+)",
    category: "compliance",
    basePriceZar: 5375,
    priceFormatted: "R5,375 (or R6,500 late)",
    billingType: "per_submission",
    description: "Annual return compliance filing including statutory fees for large commercial entities.",
    requiredDocuments: [
      "Audited or independently reviewed AFS",
      "Beneficial ownership compliance pack",
    ],
  },
  {
    id: "cipc_ar_cc",
    name: "CIPC Annual Return (Close Corporation)",
    category: "compliance",
    basePriceZar: 375,
    priceFormatted: "R375 (or R565 late)",
    billingType: "per_submission",
    description: "Preparation, statutory fee payment, and lodging of annual compliance return with CIPC for Close Corporations.",
    requiredDocuments: [
      "Approved annual turnover figure",
      "Confirmation of active members and registered address",
    ],
  },
  {
    id: "beneficial_ownership",
    name: "CIPC Beneficial Ownership (BO) Register Filing",
    category: "compliance",
    basePriceZar: 650,
    priceFormatted: "R650",
    billingType: "per_submission",
    description: "Statutory Beneficial Ownership Register compilation, shareholder cascade verification, and lodgment with CIPC.",
    requiredDocuments: [
      "Latest share register or share certificates",
      "Certified ID / passport copies of all 5%+ ultimate beneficial owners",
      "Mandate / Power of attorney authorising ConsultX",
    ],
  },
  {
    id: "company_registration",
    name: "Private Company (Pty Ltd) Registration - Basic",
    category: "compliance",
    basePriceZar: 2500,
    priceFormatted: "R2,500",
    billingType: "once_off",
    description: "Fast-track company incorporation with CIPC, standard MOI, share certificates, and tax number.",
    requiredDocuments: [
      "Certified ID copies of all proposed directors",
      "Proof of residential address for incorporators",
      "Four preferred company names in order of preference",
    ],
  },
  {
    id: "company_registration_complex",
    name: "Private Company Registration - Complex / Custom MOI",
    category: "compliance",
    basePriceZar: 3500,
    priceFormatted: "R3,500",
    billingType: "once_off",
    description: "Company registration with bespoke Memorandum of Incorporation (multiple share classes, special rights, pre-emption clauses).",
    requiredDocuments: [
      "Certified ID copies of all directors and shareholders",
      "Specific shareholder terms or term sheet",
    ],
  },
  {
    id: "trust_registration",
    name: "Trust Registration (Master of High Court)",
    category: "compliance",
    basePriceZar: 4500,
    priceFormatted: "From R4,500",
    billingType: "once_off",
    description: "Drafting of trust deed, lodgment with Master of High Court, and obtaining Letters of Authority.",
    requiredDocuments: [
      "Certified IDs of founder, trustees, and beneficiaries",
      "Proof of address and initial donation details",
    ],
  },
  {
    id: "name_reservation",
    name: "Company Name Reservation (COR9.1 / COR10.1)",
    category: "compliance",
    basePriceZar: 750,
    priceFormatted: "R750",
    billingType: "per_submission",
    description: "Reservation of proposed company names or defensive name reservations with CIPC.",
    requiredDocuments: [
      "Up to 4 company name choices in order of preference",
    ],
  },
  {
    id: "director_amendment",
    name: "CIPC Director Amendments & Statutory Resolutions",
    category: "compliance",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Appointment or resignation of directors, COR39 lodgment, and board resolutions.",
    requiredDocuments: [
      "Certified ID copy of outgoing/incoming directors",
      "Signed letter of resignation or board resolution",
    ],
  },
  {
    id: "year_end_change",
    name: "Change of Financial Year-End / Special Resolutions",
    category: "compliance",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Application to CIPC to alter financial year end date, registered office, or pass special statutory resolutions.",
    requiredDocuments: [
      "Directors / shareholders resolution approving changes",
      "Latest CIPC disclosure certificate",
    ],
  },
  {
    id: "moi_amendment",
    name: "MOI Amendments / CC to Pty Ltd Conversion",
    category: "compliance",
    basePriceZar: 1500,
    priceFormatted: "R1,500",
    billingType: "per_submission",
    description: "Conversion of Close Corporation to Pty Ltd or amendment of company Memorandum of Incorporation.",
    requiredDocuments: [
      "Current CK founding statement or existing MOI",
      "Members/Shareholders resolution approving amendment",
    ],
  },
  {
    id: "ck_amendment",
    name: "Close Corporation CK Amendments (CK2)",
    category: "compliance",
    basePriceZar: 450,
    priceFormatted: "R450",
    billingType: "per_submission",
    description: "Lodgment of CK2 form for Close Corporation member changes, address changes, or accounting officer amendments.",
    requiredDocuments: [
      "Signed CK2 amendment form",
      "Certified ID copies of incoming and outgoing members",
    ],
  },
  {
    id: "company_restoration",
    name: "CIPC Entity Restoration from Deregistration",
    category: "compliance",
    basePriceZar: 1565,
    priceFormatted: "R1,565",
    billingType: "per_submission",
    description: "Restoration of de-registered company/CC due to annual return non-compliance with CIPC & SARS clearance.",
    requiredDocuments: [
      "Original registration certificate or CK documents",
      "Certified ID copies of all active directors",
      "Deeds office search & bank statement confirming ongoing business",
    ],
  },
  {
    id: "cipc_deregistration",
    name: "CIPC Voluntary Company Deregistration",
    category: "compliance",
    basePriceZar: 1000,
    priceFormatted: "R1,000",
    billingType: "per_submission",
    description: "Voluntary winding up / formal deregistration lodgment with CIPC confirming no active liabilities.",
    requiredDocuments: [
      "Signed directors' resolution for voluntary deregistration",
      "SARS Tax Clearance Certificate confirming zero balance",
    ],
  },
  {
    id: "secretarial_maintenance",
    name: "Annual Company Secretarial Retainer",
    category: "compliance",
    basePriceZar: 3500,
    priceFormatted: "R3,500 / year",
    billingType: "per_year",
    description: "Annual maintenance and safekeeping of statutory registers, minute books, and annual director updates.",
    requiredDocuments: [
      "Current share register and director list",
    ],
  },
  {
    id: "cipc_search",
    name: "CIPC Official Registry Searches & Disclosures",
    category: "compliance",
    basePriceZar: 350,
    priceFormatted: "R350",
    billingType: "per_submission",
    description: "Official CIPC company search, director history report, and full disclosure certificate.",
    requiredDocuments: [
      "Company name or enterprise registration number",
    ],
  },
  {
    id: "credit_search_individual",
    name: "Credit Bureau Searches (Individual)",
    category: "compliance",
    basePriceZar: 350,
    priceFormatted: "R350",
    billingType: "per_submission",
    description: "Official credit bureau verification and judgment report for individuals with consent.",
    requiredDocuments: [
      "Full name, ID number, and signed consent mandate",
    ],
  },
  {
    id: "credit_search_company",
    name: "Credit Bureau Searches (Company)",
    category: "compliance",
    basePriceZar: 950,
    priceFormatted: "R950",
    billingType: "per_submission",
    description: "Commercial credit bureau report, payment profile, and legal risk audit for companies.",
    requiredDocuments: [
      "Company registration number and registered name",
    ],
  },
  {
    id: "bee_certificate",
    name: "BEE Certificate / EME Sworn Affidavit",
    category: "compliance",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Verification of turnover, black ownership percentage, and issuance of commissioner-signed B-BBEE EME Sworn Affidavit.",
    requiredDocuments: [
      "Latest Annual Financial Statements or management accounts",
      "Share register and certified IDs of shareholders",
    ],
  },
  {
    id: "third_party_confirmation",
    name: "Written Confirmation / Auditor Letters to 3rd Parties",
    category: "compliance",
    basePriceZar: 1250,
    priceFormatted: "R1,250",
    billingType: "per_submission",
    description: "Official CA(SA) confirmation letters for banks, visa applications, tenders, or credit facilities.",
    requiredDocuments: [
      "Purpose and specific template requested by third party",
      "Supporting accounting documentation / trial balance",
    ],
  },

  // ==========================================
  // Bookkeeping & Monthly Accounting Packages
  // ==========================================
  {
    id: "bookkeeping_essentials",
    name: "Monthly Bookkeeping - Essentials Package",
    category: "bookkeeping",
    basePriceZar: 3500,
    priceFormatted: "R3,500 / month",
    billingType: "per_month",
    description: "Bank processing + reconciliations (up to 120 lines), sales/supplier processing (up to 25 each), basic monthly P&L and Balance Sheet.",
    requiredDocuments: [
      "Access to Xero, Sage, or QuickBooks",
      "Monthly bank feeds or PDF statements",
    ],
  },
  {
    id: "bookkeeping_growth",
    name: "Monthly Bookkeeping - Growth Package",
    category: "bookkeeping",
    basePriceZar: 6500,
    priceFormatted: "R6,500 / month",
    billingType: "per_month",
    description: "Everything in Essentials + monthly management pack with commentary, VAT review & VAT201 submission, and basic tax hygiene.",
    requiredDocuments: [
      "Access to Xero, Sage, or QuickBooks",
      "Monthly bank feeds and supplier invoices",
    ],
  },
  {
    id: "bookkeeping_scale",
    name: "Monthly Bookkeeping - Scale Package",
    category: "bookkeeping",
    basePriceZar: 12000,
    priceFormatted: "R12,000 / month",
    billingType: "per_month",
    description: "Comprehensive outsourced finance function: monthly close checklist, KPI pack, quarterly review call, and stronger debtor/creditor controls.",
    requiredDocuments: [
      "Full ERP / cloud accounting access",
      "Debtors & Creditors schedules",
    ],
  },
  {
    id: "bookkeeping_monthly",
    name: "Monthly Bookkeeping & Management Reports (Custom)",
    category: "bookkeeping",
    basePriceZar: 3500,
    priceFormatted: "From R3,500 / month",
    billingType: "per_month",
    description: "Monthly reconciliation of bank accounts, customer/vendor ledgers, and monthly management pack.",
    requiredDocuments: [
      "Access to Xero, Sage, or QuickBooks",
      "Monthly bank feeds or PDF statements",
    ],
  },
  {
    id: "debtors_management",
    name: "Monthly Debtors Management & Invoicing Follow-Up",
    category: "bookkeeping",
    basePriceZar: 3500,
    priceFormatted: "From R3,500 / month",
    billingType: "per_month",
    description: "Customer invoice generation, automated statements, payment allocation, and debtor follow-ups.",
    requiredDocuments: [
      "Sales ledger extract and customer master list",
    ],
  },
  {
    id: "payroll_monthly",
    name: "Monthly Payroll & Payslips (Base + Staff)",
    category: "bookkeeping",
    basePriceZar: 900,
    priceFormatted: "R900 base + R150/emp/month",
    billingType: "per_month",
    description: "Monthly salary preparation, electronic payslips, and EMP201 submission for up to 20 employees.",
    requiredDocuments: [
      "Employee master data (ID, tax number, banking details)",
      "Monthly overtime, commission, or deduction schedule",
    ],
  },
  {
    id: "doc_sorting",
    name: "Sorting of Documentation (When Not Filed)",
    category: "bookkeeping",
    basePriceZar: 650,
    priceFormatted: "R650 / hour",
    billingType: "per_hour",
    description: "Physical or electronic sorting, naming, and categorizing of unfiled invoices, receipts, and bank vouchers.",
    requiredDocuments: [
      "Unsorted records bundle / digital scans",
    ],
  },
  {
    id: "info_delivery",
    name: "Collection & Delivery of Accounting Information",
    category: "bookkeeping",
    basePriceZar: 8,
    priceFormatted: "R8.00 / km",
    billingType: "per_km",
    description: "Physical collection and secure return of physical financial documents, books, and vouchers.",
    requiredDocuments: [
      "Physical address and contact person details",
    ],
  },

  // ==========================================
  // Business Valuation & Advisory (Track A)
  // ==========================================
  {
    id: "valuation_express",
    name: "Express Business Valuation Diagnostic & Multiples",
    category: "valuation",
    basePriceZar: 8500,
    priceFormatted: "R8,500",
    billingType: "once_off",
    description: "Preliminary CA(SA) valuation diagnostic analyzing historical earnings, maintainable EBITDA, and industry multiple benchmarks.",
    requiredDocuments: [
      "Latest 2-3 years Annual Financial Statements",
      "Current year management accounts and turnover estimate",
    ],
  },
  {
    id: "valuation_comprehensive",
    name: "Comprehensive CA(SA) Independent Business Valuation Report",
    category: "valuation",
    basePriceZar: 22500,
    priceFormatted: "R22,500",
    billingType: "once_off",
    description: "Formal signed CA(SA) valuation combining Discounted Cash Flow (DCF), Maintainable EBITDA Multiples, and Adjusted Net Asset Value.",
    requiredDocuments: [
      "3-5 years signed Annual Financial Statements",
      "Detailed trial balance and asset register",
      "Budgets and cash flow projections for 1-3 years",
      "Details of owner salaries, perks, and non-operational adjustments",
    ],
  },
  {
    id: "valuation_ma_advisory",
    name: "M&A Transaction Advisory & Information Memorandum",
    category: "valuation",
    basePriceZar: 45000,
    priceFormatted: "From R45,000",
    billingType: "once_off",
    description: "End-to-end deal structuring, pitch deck / Information Memorandum (IM), and negotiation support for business sales or buyouts.",
    requiredDocuments: [
      "Full financial history, commercial agreements, and management presentation",
    ],
  },
  {
    id: "financial_modelling_3way",
    name: "Custom 3-Way Forecasting & Investor Financial Model",
    category: "valuation",
    basePriceZar: 16500,
    priceFormatted: "From R16,500",
    billingType: "once_off",
    description: "Dynamic integrated 3-way financial model (Income Statement, Balance Sheet, Cash Flow) with scenario toggles for capital raising or banking facilities.",
    requiredDocuments: [
      "Historical 3-year financial statements",
      "Current year budget / revenue drivers",
      "Staff & capital expenditure projections",
    ],
  },

  // ==========================================
  // Fractional CFO & Process Advisory
  // ==========================================
  {
    id: "outsourced_cfo_advisory",
    name: "Fractional CFO Advisory Retainer (10 hrs/month)",
    category: "advisory",
    basePriceZar: 15000,
    priceFormatted: "R15,000 / month",
    billingType: "per_month",
    description: "Dedicated senior CA(SA) finance leadership: monthly board pack, cash flow runway forecasting, banking relations, and strategic executive support (10 hours/month).",
    requiredDocuments: [
      "Access to management accounts / ERP",
      "Current board pack or strategic priorities",
    ],
  },
  {
    id: "outsourced_cfo_growth",
    name: "Fractional CFO Active Leadership Retainer (20 hrs/month)",
    category: "advisory",
    basePriceZar: 28000,
    priceFormatted: "R28,000 / month",
    billingType: "per_month",
    description: "Hands-on CA(SA) finance leadership: weekly management cadence, advanced KPI dashboards, working capital optimization, and M&A readiness (20 hours/month).",
    requiredDocuments: [
      "Access to management accounts / ERP",
      "Team structure & strategic roadmap",
    ],
  },
  {
    id: "finance_process_diagnostic",
    name: "Finance Process Audit & Automation Roadmap",
    category: "advisory",
    basePriceZar: 12500,
    priceFormatted: "R12,500 once-off",
    billingType: "once_off",
    description: "Full diagnostic review of finance operations, AP/AR bottlenecks, and ERP workflow mapping — delivering a prioritized automation blueprint to cut operating costs by up to 50%.",
    requiredDocuments: [
      "Current finance process map / team overview",
      "Software stack list & transaction volumes",
    ],
  },

  // Product Additions & Workflow Automations
  {
    id: "xbrl_tagging",
    name: "CIPC iXBRL Financial Statements Tagging & Validation",
    category: "compliance",
    basePriceZar: 3500,
    priceFormatted: "From R3,500",
    billingType: "once_off",
    description: "Preparation, taxonomy tagging (IFRS for SMEs), and validation of AFS in CIPC-mandated iXBRL format via Iris Carbon.",
    requiredDocuments: [
      "Signed Annual Financial Statements (PDF/Word)",
      "Trial balance and detailed disclosure notes",
    ],
  },
  {
    id: "anna_expense_growth",
    name: "AnNa Expense WhatsApp & AI Slip Capture (Growth Tier)",
    category: "bookkeeping",
    basePriceZar: 950,
    priceFormatted: "R950 / month",
    billingType: "per_month",
    description: "AI expense automation: WhatsApp photo slip capture, line-item OCR, VAT extraction, and direct sync into Xero or Sage for up to 15 users.",
    requiredDocuments: [
      "Accounting software tenant ID (Xero/Sage)",
      "List of mobile numbers for employee WhatsApp access",
    ],
  },
  {
    id: "debtor_chase_automation",
    name: "Automated Debtors Chasing & Workflow Setup",
    category: "bookkeeping",
    basePriceZar: 6500,
    priceFormatted: "R6,500 once-off",
    billingType: "once_off",
    description: "Implementation of automated debtor communication sequences, statement dispatch, escalation cadences, and payment link embeds to accelerate cash collections.",
    requiredDocuments: [
      "Sales ledger aging extract",
      "Current debtor terms & email templates",
    ],
  },
];

export const SERVICE_CATEGORIES: Record<string, string> = {
  financial_statements: "Annual Financial Statements & Tax Returns",
  taxation: "Taxation & SARS Registrations",
  compliance: "CIPC & Statutory Company Secretarial",
  bookkeeping: "Monthly Bookkeeping & Accounting",
  valuation: "Business Valuation & Financial Modelling",
  advisory: "Fractional CFO & Process Re-engineering",
};

export interface QuoteCalculation {
  items: ServiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  subtotalFormatted: string;
  vatFormatted: string;
  totalFormatted: string;
}

export function calculateQuoteTotal(serviceIds: string[]): QuoteCalculation {
  const items = serviceIds
    .map((id) => RATES_SCHEDULE_2026.find((s) => s.id === id))
    .filter((s): s is ServiceItem => Boolean(s));

  const subtotal = items.reduce((sum, item) => sum + item.basePriceZar, 0);
  const vat = Math.round(subtotal * 0.15 * 100) / 100;
  const total = subtotal + vat;

  const money = (val: number) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 2,
    }).format(val);

  return {
    items,
    subtotal,
    vat,
    total,
    subtotalFormatted: money(subtotal),
    vatFormatted: money(vat),
    totalFormatted: money(total),
  };
}
