/**
 * Advisor API Client for Ask AnNa (ConsultX AI Advisor)
 * Incorporates resilient Cloud Run networking and backoff patterns from Ascend.
 * Supports Multi-Track Intent Routing:
 *  - Track A: Valuation & Specialist M&A Advisory (scoping questions -> CA(SA) Valuation Brief)
 *  - Track B: Fixed-Fee Statutory & Tax Services (2026 rates schedule -> Service Quote -> Onboarding Portal)
 *  - Track C: Workflow Automation & Systems Architecture (Diagnostic probing -> Solution Blueprint)
 *  - Track D: Products (AnNa Expense SaaS)
 */

import { RATES_SCHEDULE_2026, ServiceItem, calculateQuoteTotal } from "@/lib/rates-schedule";

import { assessWorkflow, type AssessmentState, type Opportunity } from "./advisor-assessment";
import { adaptPublicReply } from "./advisor-response";
import { containsSensitivePublicInput, PUBLIC_CHAT_BLOCK_MESSAGE } from "./public-chat-safety";

export interface ProcessProfile {
  assessment?: AssessmentState;
  visitorObjective: string;
  painPoint: string;
  specificFriction?: string;
  primarySystems: string[];
  volumeOrScale?: string;
  humanReviewPoints?: string[];
  controlsRequired?: string[];
  estimatedHoursSpentMonthly?: number;
  confidenceScore: number;
  track?: "solutions" | "services" | "valuation" | "products";
  diagnosticStage?:
    | "initial"
    | "preliminary_drafted"
    | "probing_pain"
    | "probing_software"
    | "probing_scale"
    | "tailored"
    | "valuation_purpose"
    | "valuation_turnover"
    | "valuation_records"
    | "valuation_ready";
  valuationPurpose?: string;
  valuationTurnover?: string;
  valuationRecords?: string;
  selectedServiceIds?: string[];
  sourceChannel?: string;
  destinationLedger?: string;
}

export interface IndicativeQuote {
  setupTier: "Quick-Start" | "Standard Integration" | "Enterprise Custom";
  estimatedSetupZar: string;
  estimatedMonthlyZar?: string;
  expectedPaybackMonths: string;
  pricingBasis: string;
}

export interface SolutionBlueprint {
  id: string;
  createdAt: string;
  title: string;
  isTailored?: boolean;
  problemRestatement: string;
  sourceChannel?: string;
  destinationLedger?: string;
  currentFlow: string[];
  proposedFlow: string[];
  architecturePattern: string;
  systemsInvolved: string[];
  humanCheckpoints: string[];
  expectedBenefit: string;
  opportunityScore: number | null;
  feasibilityRating: "High" | "Medium" | "Complex" | "Unverified";
  risksAndControls: string[];
  whatToValidate: string[];
  indicativeQuote: IndicativeQuote;
  nextStepTitle: string;
  nextStepDescription: string;
}

export interface ValuationBrief {
  id: string;
  createdAt: string;
  companyTurnoverRange: string;
  valuationPurpose: string;
  financialHistoryQuality: string;
  recommendedMethodologies: string[];
  requiredDocuments: string[];
  indicativeFeeZar: string;
  typicalDeliveryWeeks: string;
  executiveSummary: string;
  leadAdvisor: string;
}

export interface ServiceQuote {
  id: string;
  createdAt: string;
  services: ServiceItem[];
  subtotalZar: number;
  vatZar: number;
  totalZar: number;
  totalFormatted: string;
  onboardingUrl: string;
}

export interface ClarificationOption {
  label: string;
  value: string;
}

export interface ClarificationQuestion {
  multiple?: boolean;
  inputPlaceholder?: string;
  id: string;
  stepNumber?: number;
  totalSteps?: number;
  category?: "routing" | "pain" | "software" | "scale" | "controls";
  question: string;
  subtext?: string;
  options: ClarificationOption[];
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  clarification?: ClarificationQuestion;
  blueprint?: SolutionBlueprint;
  valuationBrief?: ValuationBrief;
  serviceQuote?: ServiceQuote;
  isStreaming?: boolean;
  opportunities?: Opportunity[];
  responseMode?: "live" | "offline";
}

export interface LeadSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  notes?: string;
  serviceTrack?: string;
}

/**
 * Curated Preset Question Bank for Probing Diagnostics (Workflow Automation)
 */
export const PRESET_DIAGNOSTIC_BANK = {
  routing: {
    id: "choose_depth",
    question: "How would you like to proceed with this workflow?",
    options: [
      {
        label: "🚀 Draft Initial Solution Now",
        value: "Draft an initial solution based on this information",
      },
      {
        label: "🎯 Ask Me 3 Quick Questions to Refine",
        value: "I'd like a more focused solution, please ask me the diagnostic questions",
      },
    ],
  },
  pain: {
    id: "probe_pain",
    stepNumber: 1,
    totalSteps: 3,
    category: "pain" as const,
    question: "Question 1 of 3: What is the primary friction or pain you are experiencing?",
    subtext: "Identifies the core bottleneck to eliminate",
    options: [
      {
        label: "Hours lost on manual rekeying",
        value: "Too many hours wasted on repetitive copy-pasting and rekeying data",
      },
      {
        label: "Human errors & typos in records",
        value: "Frequent human errors, duplicates, and calculation typos",
      },
      {
        label: "Late customer payments & cash drag",
        value: "Delayed customer invoicing and sluggish accounts receivable follow-up",
      },
      {
        label: "Month-end close takes too long",
        value: "Month-end close is stressful and takes 5+ business days",
      },
      {
        label: "Staff slips & receipts lost before VAT",
        value: "Lost tax invoices and manual credit card slip capture",
      },
    ],
  },
  software: {
    id: "probe_software",
    stepNumber: 2,
    totalSteps: 3,
    category: "software" as const,
    question: "Question 2 of 3: Which software packages, ERPs, or tools does this touch?",
    subtext: "Determines API connectivity and integration architecture",
    options: [
      {
        label: "Sage (Business Cloud / Pastel)",
        value: "Sage Business Cloud / Pastel Accounting",
      },
      {
        label: "Xero Accounting",
        value: "Xero Accounting",
      },
      {
        label: "Microsoft 365 (Excel & Outlook)",
        value: "Microsoft 365, Excel spreadsheets, and Outlook email",
      },
      {
        label: "QuickBooks Online",
        value: "QuickBooks Online",
      },
      {
        label: "Paper Slips / WhatsApp / Inbound PDFs",
        value: "WhatsApp photos, paper slips, and emailed PDF attachments",
      },
      {
        label: "Custom ERP / Industry Database",
        value: "Custom database or legacy ERP system",
      },
    ],
  },
  scale: {
    id: "probe_scale",
    stepNumber: 3,
    totalSteps: 3,
    category: "scale" as const,
    question: "Question 3 of 3: Roughly how much team time is lost, or what is the monthly volume?",
    subtext: "Used to calculate ROI, time savings, and fee tier",
    options: [
      {
        label: "1 to 3 hrs/week (< 50 docs/month)",
        value: "Light scale: 1 to 3 hours per week (under 50 documents/month)",
      },
      {
        label: "4 to 8 hrs/week (50-250 docs/month)",
        value: "Medium scale: 4 to 8 hours per week (50 to 250 documents/month)",
      },
      {
        label: "10 to 20+ hrs/week (250-1,000 docs/month)",
        value: "Heavy scale: 10 to 20+ hours per week (250 to 1,000 documents/month)",
      },
      {
        label: "Full-time person dedicated (1,000+ docs/month)",
        value: "Enterprise scale: 1 or more dedicated full-time staff (1,000+ documents/month)",
      },
    ],
  },
};

/**
 * Adaptive Diagnostic Questions for Context-Aware Probing
 */
export const EXPENSE_CARD_QUESTION: ClarificationQuestion = {
  id: "probe_card_structure",
  stepNumber: 2,
  totalSteps: 3,
  category: "software",
  question: "Question 2 of 3: How are company cards and staff expenses structured?",
  subtext: "Determines whether this is a direct credit card feed match or staff reimbursement flow",
  options: [
    {
      label: "💳 Company cards with central monthly statement",
      value: "Company credit cards where staff submit slips to match the monthly card statement feed",
    },
    {
      label: "👤 Staff personal cards requiring reimbursements",
      value: "Staff pay personally and claim reimbursement back into their bank accounts",
    },
    {
      label: "🔄 Mix of company cards, claims, and petty cash",
      value: "Combination of company credit cards, staff reimbursements, and petty cash slips",
    },
  ],
};

export const DEBTOR_WORKFLOW_QUESTION: ClarificationQuestion = {
  id: "probe_debtor_workflow",
  stepNumber: 2,
  totalSteps: 3,
  category: "software",
  question: "Question 2 of 3: What is the primary cause of debtor delays in your business?",
  subtext: "Shapes dispute handling, payment link integration, and escalation rules",
  options: [
    {
      label: "⏳ Customers simply forget without persistent reminders",
      value: "Inconsistent follow-up cadence; customers pay once reminded politely",
    },
    {
      label: "❓ Invoicing queries or missing delivery docs stall payment",
      value: "Customer queries and missing delivery documents delay invoice approval",
    },
    {
      label: "📉 Cash flow constraints requiring structured payment terms",
      value: "Customers need flexible payment arrangements and installment terms",
    },
  ],
};

/**
 * Question Bank for Specialist Business Valuation Scoping
 */
export const VALUATION_DIAGNOSTIC_BANK = {
  purpose: {
    id: "val_purpose",
    stepNumber: 1,
    totalSteps: 3,
    category: "routing" as const,
    question: "Step 1 of 3: What is the primary purpose of the business valuation?",
    subtext: "Different valuation purposes require different statutory & commercial methodologies",
    options: [
      { label: "🤝 Shareholder / Partner Buyout or Exit", value: "Partner buyout or shareholder restructuring" },
      { label: "🏢 Selling the Business to a 3rd Party", value: "Selling the complete business or majority equity to a 3rd party" },
      { label: "📈 Raising Growth Capital / Equity Investment", value: "Raising equity capital or investor due diligence" },
      { label: "⚖️ Dispute, Divorce, or Estate Planning", value: "Legal dispute, shareholder deadlock, or estate planning" },
    ],
  },
  turnover: {
    id: "val_turnover",
    stepNumber: 2,
    totalSteps: 3,
    category: "scale" as const,
    question: "Step 2 of 3: What is the current approximate annual turnover (revenue)?",
    subtext: "Determines business complexity, transaction multiples, and valuation model depth",
    options: [
      { label: "Under R5 Million / year", value: "Turnover under R5 Million" },
      { label: "R5 Million to R20 Million / year", value: "Turnover between R5m and R20m" },
      { label: "R20 Million to R60 Million / year", value: "Turnover between R20m and R60m" },
      { label: "R60 Million+ / year (Mid-Market)", value: "Turnover over R60 Million" },
    ],
  },
  records: {
    id: "val_records",
    stepNumber: 3,
    totalSteps: 3,
    category: "controls" as const,
    question: "Step 3 of 3: What is the current status of your historical financial records?",
    subtext: "Defines the historical baseline for EBITDA adjustments and cash flow modeling",
    options: [
      { label: "✅ 3 Years Signed AFS Available", value: "3 years signed Annual Financial Statements are up to date" },
      { label: "📊 Management Accounts Only", value: "Monthly management accounts and trial balances available, AFS pending" },
      { label: "⏳ Financials Need Catch-Up / Clean Up", value: "Accounting is behind and requires catch-up or reconciliation first" },
    ],
  },
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_ADVISOR_API_URL ||
  "https://annasimple-api-37055003117.europe-west1.run.app";
const DEFAULT_TIMEOUT_MS = 15_000;

function isTransientHttpStatus(status: number): boolean {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: ctrl.signal });
  } catch (e) {
    if ((e as { name?: string })?.name === "AbortError") {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)}s. Please check your connection.`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Send user query to AnNa Advisor backend (or fallback simulation if offline/unconfigured)
 */
export async function sendAdvisorTurn(
  sessionId: string,
  history: Message[],
  userText: string,
  profile?: Partial<ProcessProfile>
): Promise<{
  replyText: string;
  opportunities?: Opportunity[];
  responseMode?: "live" | "offline";
  clarification?: ClarificationQuestion;
  blueprint?: SolutionBlueprint;
  valuationBrief?: ValuationBrief;
  serviceQuote?: ServiceQuote;
  updatedProfile: ProcessProfile;
}> {
  if ([userText, ...history.map(h => h.content)].some(containsSensitivePublicInput)) {
    throw new Error(PUBLIC_CHAT_BLOCK_MESSAGE);
  }
  if (BACKEND_URL) {
    const MAX_ATTEMPTS = 2;
    const BACKOFFS = [800];

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetchWithTimeout(`${BACKEND_URL}/api/v1/ai/public-advisor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            history: history.slice(0, history.at(-1)?.role === "user" && history.at(-1)?.content === userText ? -1 : undefined).filter(h => h.role !== "system").map((h) => ({ role: h.role, content: h.content })),
          }),
        });

        if (!res.ok) {
          if (isTransientHttpStatus(res.status) && attempt < MAX_ATTEMPTS) {
            await sleep(BACKOFFS[attempt - 1] || 800);
            continue;
          }
          throw new Error(`Advisor API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        const local = assessWorkflow(userText, profile);
        return adaptPublicReply(data, local.updatedProfile);
      } catch (err) {
        if (attempt === MAX_ATTEMPTS) {
          console.warn("Backend unavailable, falling back to client simulation:", err);
          break;
        }
        await sleep(BACKOFFS[attempt - 1] || 800);
      }
    }
  }

  // Fallback interactive simulation (enables immediate testing on website before Cloud Run is wired)
  return { ...await simulateAdvisorTurn(userText, history, profile), responseMode: "offline" };
}

/**
 * Book meeting with Craig or save lead
 */
export async function submitAdvisorLead(
  sessionId: string,
  lead: LeadSubmission,
  blueprint?: SolutionBlueprint,
  profile?: ProcessProfile
): Promise<{ success: boolean; confirmationId: string; message: string }> {
  if (containsSensitivePublicInput(JSON.stringify({ lead, blueprint, profile }))) {
    return { success: false, confirmationId: "", message: PUBLIC_CHAT_BLOCK_MESSAGE };
  }
  if (BACKEND_URL) {
    try {
      const res = await fetchWithTimeout(`${BACKEND_URL}/api/v1/advisor/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          lead,
          blueprint,
          profile,
          timezone: "Africa/Johannesburg",
        }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Lead backend submission failed, falling back to offline notification:", e);
    }
  }

  // Honest Fallback: Never invent confirmation IDs or claim Craig received the brief when delivery was not persisted
  return {
    success: false,
    confirmationId: "",
    message: `Thank you ${lead.name}. Our live scheduling backend is currently in offline preview mode. Your brief could not be delivered automatically. Please email Craig directly at craig@consultx.co.za or contact him on WhatsApp at +27 82 818 5760 with your brief details.`,
  };
}

/**
 * Helper: Detect which service items from 2026 rates schedule match the query
 */
function matchServicesFromQuery(query: string): ServiceItem[] {
  const q = query.toLowerCase();
  const matched: ServiceItem[] = [];

  // VAT
  if (q.includes("vat reg") || (q.includes("vat") && q.includes("register"))) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "vat_registration");
    if (s) matched.push(s);
  } else if (q.includes("vat201") || (q.includes("submit") && q.includes("vat"))) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "vat201_submission");
    if (s) matched.push(s);
  }

  // Tax clearance / TCS
  if (q.includes("tax clear") || q.includes("tcs") || q.includes("good standing")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "tax_clearance");
    if (s) matched.push(s);
  }

  // CIPC Annual returns (specific tiers or general)
  if (q.includes("annual return") || q.includes("company return") || q.includes("cipc return")) {
    if (q.includes("under 1m") || q.includes("under r1m") || q.includes("tier 1") || q.includes("< r1m")) {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === "cipc_ar_tier1");
      if (s) matched.push(s);
    } else if (q.includes("1m to 10m") || q.includes("r1m to r10m") || q.includes("tier 2")) {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === "cipc_ar_tier2");
      if (s) matched.push(s);
    } else if (q.includes("10m to 25m") || q.includes("r10m to r25m") || q.includes("tier 3")) {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === "cipc_ar_tier3");
      if (s) matched.push(s);
    } else if (q.includes("25m+") || q.includes("over 25m") || q.includes("tier 4")) {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === "cipc_ar_tier4");
      if (s) matched.push(s);
    } else if (q.includes("cc ") || q.includes("close corporation")) {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === "cipc_ar_cc");
      if (s) matched.push(s);
    } else {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === "cipc_annual_return");
      if (s) matched.push(s);
    }
  }

  // Beneficial ownership
  if (q.includes("beneficial owner") || q.includes("bo register") || q.includes("bo filing") || q.includes("beneficial ownership")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "beneficial_ownership");
    if (s) matched.push(s);
  }

  // Financial statements & tax
  if (q.includes("annual financial statement") || q.includes("afs") || q.includes("pty financial") || q.includes("company financial") || q.includes("it14")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "afs_company");
    if (s) matched.push(s);
  }
  if (q.includes("close corporation") || q.includes(" cc ") || q.includes("cc financial")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "afs_cc");
    if (s) matched.push(s);
  }
  if (q.includes("trust registration") || q.includes("register a trust") || q.includes("new trust")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "trust_registration");
    if (s) matched.push(s);
  } else if (q.includes("trust")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "afs_trust");
    if (s) matched.push(s);
  }
  if (q.includes("partnership")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "afs_partnership");
    if (s) matched.push(s);
  }
  if (q.includes("commission")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "tax_individual_commission");
    if (s) matched.push(s);
  }
  if (q.includes("rental income") || q.includes("investment tax") || q.includes("multi source")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "tax_individual_complex");
    if (s) matched.push(s);
  } else if (q.includes("sole prop") || q.includes("individual tax") || q.includes("personal tax") || q.includes("irp5")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "tax_individual_basic" || x.id === "afs_sole_prop");
    if (s) matched.push(s);
  }
  if (q.includes("capital gain") || q.includes("cgt")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "cgt_addon");
    if (s) matched.push(s);
  }

  // Provisional tax
  if (q.includes("provisional tax") || q.includes("irp6")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "provisional_tax_company");
    if (s) matched.push(s);
  }

  // Tax Registrations & Consultations
  if (q.includes("register for paye") || q.includes("paye reg") || q.includes("register for uif")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "paye_registration");
    if (s) matched.push(s);
  }
  if (q.includes("income tax reg") || q.includes("register for income tax") || q.includes("tax registration")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "income_tax_reg");
    if (s) matched.push(s);
  }
  if (q.includes("tax advice") || q.includes("tax advisory") || q.includes("tax strategy") || q.includes("dispute with sars")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "tax_advisory");
    if (s) matched.push(s);
  }

  // Payroll & EMP201 / EMP501
  if (q.includes("paye") || q.includes("emp201") || q.includes("payroll")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "payroll_monthly" || x.id === "emp201_monthly");
    if (s) matched.push(s);
  }
  if (q.includes("bi-annual") || q.includes("emp501") || q.includes("easyfile")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "emp501_biannual");
    if (s) matched.push(s);
  }
  if (q.includes("irp5 prep") || q.includes("reconcile irp5")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "irp5_prep");
    if (s) matched.push(s);
  }
  if (q.includes("wca") || q.includes("coida") || q.includes("return of earnings")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "wca_return");
    if (s) matched.push(s);
  }
  if (q.includes("ui19") || q.includes("labour") || q.includes("uif claim")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "ui19_submission");
    if (s) matched.push(s);
  }
  if (q.includes("directive") || q.includes("lump sum directive")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "tax_directives");
    if (s) matched.push(s);
  }

  // Company registration & secretarial
  if (q.includes("complex registration") || q.includes("custom moi") || q.includes("share classes")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "company_registration_complex");
    if (s) matched.push(s);
  } else if (q.includes("register company") || q.includes("new company") || q.includes("incorporate") || q.includes("cor14.3")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "company_registration");
    if (s) matched.push(s);
  }
  if (q.includes("name reservation") || q.includes("reserve name") || q.includes("cor9.1")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "name_reservation");
    if (s) matched.push(s);
  }
  if (q.includes("director") || q.includes("cor39") || q.includes("resolution")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "director_amendment");
    if (s) matched.push(s);
  }
  if (q.includes("moi") || q.includes("convert cc") || q.includes("conversion")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "moi_amendment");
    if (s) matched.push(s);
  }
  if (q.includes("ck amendment") || q.includes("ck2") || q.includes("ck document")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "ck_amendment");
    if (s) matched.push(s);
  }
  if (q.includes("year end") || q.includes("financial year end")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "year_end_change");
    if (s) matched.push(s);
  }
  if (q.includes("restore") || q.includes("reinstat")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "company_restoration");
    if (s) matched.push(s);
  }
  if (q.includes("deregister") || q.includes("close company") || q.includes("wind up")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "cipc_deregistration");
    if (s) matched.push(s);
  }
  if (q.includes("secretarial") || q.includes("minute book") || q.includes("statutory register")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "secretarial_maintenance");
    if (s) matched.push(s);
  }

  // Searches & Verifications
  if (q.includes("cipc search") || q.includes("company search") || q.includes("disclosure cert")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "cipc_search");
    if (s) matched.push(s);
  }
  if (q.includes("credit search") || q.includes("credit check") || q.includes("bureau")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "credit_search_company" || x.id === "credit_search_individual");
    if (s) matched.push(s);
  }
  if (q.includes("bee") || q.includes("b-bbee") || q.includes("eme")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "bee_certificate");
    if (s) matched.push(s);
  }
  if (q.includes("confirmation letter") || q.includes("auditor letter") || q.includes("bank letter")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "third_party_confirmation");
    if (s) matched.push(s);
  }

  // Bookkeeping & Admin
  if (q.includes("growth") && (q.includes("bookkeep") || q.includes("accounting"))) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "bookkeeping_growth");
    if (s) matched.push(s);
  } else if (q.includes("scale") && (q.includes("bookkeep") || q.includes("accounting"))) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "bookkeeping_scale");
    if (s) matched.push(s);
  } else if (q.includes("bookkeep") || q.includes("monthly accounts") || q.includes("bank rec")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "bookkeeping_essentials" || x.id === "bookkeeping_monthly");
    if (s) matched.push(s);
  }
  if (q.includes("debtor") || q.includes("invoicing") || q.includes("statement")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "debtors_management");
    if (s) matched.push(s);
  }
  if (q.includes("sorting") || q.includes("unfiled") || q.includes("sort doc")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "doc_sorting");
    if (s) matched.push(s);
  }
  if (q.includes("collection") || q.includes("delivery") || q.includes("courier")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "info_delivery");
    if (s) matched.push(s);
  }

  // Business Valuation & Financial Modelling
  if (q.includes("financial model") || q.includes("3-way") || q.includes("forecast model") || q.includes("cash flow model")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "financial_modelling_3way");
    if (s) matched.push(s);
  } else if (q.includes("express valuation") || q.includes("valuation diagnostic")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "valuation_express");
    if (s) matched.push(s);
  } else if (q.includes("comprehensive valuation") || q.includes("dcf valuation") || q.includes("formal valuation")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "valuation_comprehensive");
    if (s) matched.push(s);
  } else if (q.includes("m&a advisory") || q.includes("information memorandum") || q.includes("pitch deck")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "valuation_ma_advisory");
    if (s) matched.push(s);
  }

  // Fractional CFO & Process Re-engineering Advisory
  if (q.includes("outsourced cfo") || q.includes("fractional cfo") || q.includes("part time cfo") || q.includes("cfo retainer")) {
    if (q.includes("growth") || q.includes("active") || q.includes("20 hr")) {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === "outsourced_cfo_growth");
      if (s) matched.push(s);
    } else {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === "outsourced_cfo_advisory");
      if (s) matched.push(s);
    }
  }
  if (q.includes("process audit") || q.includes("process diagnostic") || q.includes("reengineering") || q.includes("automation roadmap")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "finance_process_diagnostic");
    if (s) matched.push(s);
  }

  // XBRL & Products
  if (q.includes("xbrl") || q.includes("ixbrl") || q.includes("iris carbon")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "xbrl_tagging");
    if (s) matched.push(s);
  }
  if (q.includes("anna expense") || q.includes("whatsapp slip") || q.includes("receipt scan") || q.includes("expense app")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "anna_expense_growth");
    if (s) matched.push(s);
  }
  if (q.includes("debtor chase") || q.includes("chase debtor") || q.includes("automated debtor")) {
    const s = RATES_SCHEDULE_2026.find((x) => x.id === "debtor_chase_automation");
    if (s) matched.push(s);
  }

  return Array.from(new Set(matched));
}

/**
 * Directional System Topology & Role Detection
 */
export interface SystemTopology {
  sources: string[];
  destinations: string[];
  allSystems: string[];
}

export function detectSystemTopology(text: string): SystemTopology {
  const lower = text.toLowerCase();
  const sources: string[] = [];
  const destinations: string[] = [];

  // Sources / Ingress Channels
  if (lower.includes("whatsapp") || lower.includes("slip") || lower.includes("receipt") || lower.includes("photo")) {
    sources.push("WhatsApp / Slips");
  }
  if (lower.includes("email") || lower.includes("outlook") || lower.includes("inbox") || lower.includes("attachment")) {
    sources.push("Outlook / Email");
  }
  if (lower.includes("excel") || lower.includes("spreadsheet") || lower.includes("sheet") || lower.includes("csv")) {
    sources.push("Microsoft Excel");
  }
  if (lower.includes("pdf") || lower.includes("document") || lower.includes("paper")) {
    if (!sources.includes("WhatsApp / Slips")) {
      sources.push("PDF Invoices / Documents");
    }
  }

  // Destinations / Accounting Packages & ERPs
  if (lower.includes("xero")) {
    destinations.push("Xero");
  }
  if (lower.includes("sage") || lower.includes("pastel")) {
    destinations.push("Sage Business Cloud");
  }
  if (lower.includes("quickbooks") || lower.includes("qbo")) {
    destinations.push("QuickBooks Online");
  }
  if (lower.includes("erp") || lower.includes("syspro") || lower.includes("sap") || lower.includes("database")) {
    destinations.push("Custom ERP / Core Ledger");
  }

  const all = [...sources, ...destinations];
  return {
    sources: Array.from(new Set(sources)),
    destinations: Array.from(new Set(destinations)),
    allSystems: all.length > 0 ? Array.from(new Set(all)) : ["WhatsApp / Slips", "Xero"],
  };
}

export function orderSystemsDirectionally(systems: string[]): string[] {
  const sourcesPriority = ["WhatsApp / Slips", "Outlook / Email", "PDF Invoices / Documents", "Microsoft Excel"];
  const destinationsPriority = ["Xero", "Sage Business Cloud", "QuickBooks Online", "Custom ERP / Core Ledger"];

  const sources = systems.filter((s) => sourcesPriority.some((p) => s.toLowerCase().includes(p.toLowerCase().split(" ")[0])));
  const destinations = systems.filter((s) => destinationsPriority.some((p) => s.toLowerCase().includes(p.toLowerCase().split(" ")[0])));
  const others = systems.filter((s) => !sources.includes(s) && !destinations.includes(s));

  return Array.from(new Set([...sources, ...destinations, ...others]));
}

export function synthesizeProblemDiagnosis(query: string, systems: string[]): string {
  const q = query.toLowerCase();
  const isExpense = q.includes("slip") || q.includes("receipt") || q.includes("expense") || q.includes("whatsapp") || q.includes("card");
  const isDebtor = q.includes("debtor") || q.includes("receivable") || q.includes("chase") || q.includes("payment");
  const isMonthEnd = q.includes("month end") || q.includes("close") || q.includes("reconcil") || q.includes("bank rec");

  const ledger = systems.find((s) => ["Xero", "Sage Business Cloud", "QuickBooks Online", "Custom ERP / Core Ledger"].includes(s)) || "Xero";

  if (isExpense) {
    if (q.includes("card") || q.includes("credit card") || q.includes("statement")) {
      return `Automating decentralized credit card slip capture via WhatsApp and reconciling against ${ledger} credit card feeds for complete SARS VAT compliance`;
    }
    return `Intelligent receipt & slip intake via WhatsApp with automated line-item extraction and posting into ${ledger}`;
  }
  if (isDebtor) {
    return `Automated debtor chasing and cash collection workflows synced with ${ledger} to compress Days Sales Outstanding (DSO)`;
  }
  if (isMonthEnd) {
    return `Automating bank & credit card statement matching, recurring transaction GL allocation, and month-end close in ${ledger}`;
  }
  return `Automating manual data movement and cross-system reconciliation into ${ledger}`;
}

/**
 * High-fidelity client simulation engine implementing Multi-Track Intent Routing
 */
function simulateAdvisorTurn(
  userText: string,
  history: Message[],
  currentProfile?: Partial<ProcessProfile>
): Promise<{
  replyText: string;
  opportunities?: Opportunity[];
  responseMode?: "live" | "offline";
  clarification?: ClarificationQuestion;
  blueprint?: SolutionBlueprint;
  valuationBrief?: ValuationBrief;
  serviceQuote?: ServiceQuote;
  updatedProfile: ProcessProfile;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = userText.toLowerCase();
      const currentStage = currentProfile?.diagnosticStage || "initial";
      const track = currentProfile?.track || "solutions";

      // Detect systems with directional topology
      const topology = detectSystemTopology(userText + " " + (currentProfile?.painPoint || ""));
      const detectedSystems: string[] = currentProfile?.primarySystems ? [...currentProfile.primarySystems] : [];
      topology.allSystems.forEach((s) => {
        if (!detectedSystems.includes(s)) detectedSystems.push(s);
      });

      const orderedSystems = orderSystemsDirectionally(detectedSystems);
      const systemsToReport = orderedSystems.length > 0 ? orderedSystems : ["WhatsApp / Slips", "Xero"];

      const updatedProfile: ProcessProfile = {
        visitorObjective: currentProfile?.visitorObjective || "ConsultX Advisory & Solution Scoping",
        painPoint: currentProfile?.painPoint || userText,
        specificFriction: currentProfile?.specificFriction,
        primarySystems: systemsToReport,
        volumeOrScale: currentProfile?.volumeOrScale,
        estimatedHoursSpentMonthly: currentProfile?.estimatedHoursSpentMonthly || 20,
        confidenceScore: currentProfile?.confidenceScore || 0.5,
        track,
        diagnosticStage: currentStage,
        valuationPurpose: currentProfile?.valuationPurpose,
        valuationTurnover: currentProfile?.valuationTurnover,
        valuationRecords: currentProfile?.valuationRecords,
        selectedServiceIds: currentProfile?.selectedServiceIds,
      };

      // Intent queries
      const isValuationQuery =
        lower.includes("valuation") ||
        lower.includes("value my business") ||
        lower.includes("value a business") ||
        lower.includes("how much is my business worth") ||
        lower.includes("valuing") ||
        lower.includes("selling my business") ||
        lower.includes("sell business") ||
        lower.includes("partner buyout") ||
        lower.includes("buy out") ||
        lower.includes("sell my shares") ||
        lower.includes("shareholder dispute") ||
        lower.includes("equity valuation");

      const matchedServices = matchServicesFromQuery(userText);
      const isServicesQuery =
        matchedServices.length > 0 ||
        lower.includes("price list") ||
        lower.includes("how much does it cost") ||
        lower.includes("fixed fee");

      const isProductQuery =
        lower.includes("anna expense") ||
        lower.includes("expense app") ||
        lower.includes("scan slips") ||
        lower.includes("receipt ocr");

      // TRACK A: VALUATION
      if (isValuationQuery && currentStage === "initial") {
        updatedProfile.track = "valuation";
        updatedProfile.diagnosticStage = "valuation_purpose";

        resolve({
          replyText: `ConsultX provides **Independent Business Valuations & Transaction Advisory** led directly by **Craig Ulyate (CA(SA))**.\n\nWe employ professional CA(SA) valuation frameworks combining **Discounted Cash Flow (DCF)**, **Maintainable EBITDA Multiples**, and **Adjusted Net Asset Value (NAV)**.\n\nTo recommend the appropriate valuation methodology and indicative scope for your business, let's run a quick 3-step scoping diagnostic:\n\n${VALUATION_DIAGNOSTIC_BANK.purpose.question}`,
          clarification: VALUATION_DIAGNOSTIC_BANK.purpose,
          updatedProfile,
        });
        return;
      }

      if (updatedProfile.track === "valuation") {
        if (currentStage === "valuation_purpose") {
          updatedProfile.valuationPurpose = userText;
          updatedProfile.diagnosticStage = "valuation_turnover";

          resolve({
            replyText: `Noted: Valuation purpose is **"${userText}"**. Different transaction contexts require tailored normalization of owner remuneration and add-backs.\n\n${VALUATION_DIAGNOSTIC_BANK.turnover.question}`,
            clarification: VALUATION_DIAGNOSTIC_BANK.turnover,
            updatedProfile,
          });
          return;
        }

        if (currentStage === "valuation_turnover") {
          updatedProfile.valuationTurnover = userText;
          updatedProfile.diagnosticStage = "valuation_records";

          resolve({
            replyText: `Understood: Scale is **"${userText}"**.\n\n${VALUATION_DIAGNOSTIC_BANK.records.question}`,
            clarification: VALUATION_DIAGNOSTIC_BANK.records,
            updatedProfile,
          });
          return;
        }

        if (currentStage === "valuation_records") {
          updatedProfile.valuationRecords = userText;
          updatedProfile.diagnosticStage = "valuation_ready";

          const valuationBrief = buildValuationBrief(updatedProfile);

          resolve({
            replyText: `Thank you. I have structured your **Business Valuation Scoping Brief** below.\n\nAs a Chartered Accountant (SA), Craig conducts an independent review of historical earnings, normalizes working capital and executive perks, models discounted cash flows, and issues a formal signed Valuation Report for your transaction.`,
            valuationBrief,
            updatedProfile,
          });
          return;
        }
      }

      // TRACK B: COMPLIANCE, TAX & AFS (2026 Rates Schedule)
      if (isServicesQuery && (currentStage === "initial" || updatedProfile.track === "services")) {
        updatedProfile.track = "services";
        const servicesToQuote = matchedServices.length > 0 ? matchedServices : [RATES_SCHEDULE_2026[0]];
        updatedProfile.selectedServiceIds = servicesToQuote.map((s) => s.id);

        const quoteCalculation = calculateQuoteTotal(servicesToQuote.map((s) => s.id));
        const quoteIds = servicesToQuote.map((s) => s.id).join(",");

        const serviceQuote: ServiceQuote = {
          id: `SQ-${Date.now()}`,
          createdAt: new Date().toISOString(),
          services: servicesToQuote,
          subtotalZar: quoteCalculation.subtotal,
          vatZar: quoteCalculation.vat,
          totalZar: quoteCalculation.total,
          totalFormatted: quoteCalculation.totalFormatted,
          onboardingUrl: `/portal/services/onboard?services=${encodeURIComponent(quoteIds)}`,
        };

        const serviceNames = servicesToQuote.map((s) => `• **${s.name}**: ${s.priceFormatted} (${s.billingType.replace("_", " ")})`).join("\n");

        resolve({
          replyText: `Here is the official **ConsultX 2026 Rates Schedule** quote for your requested service:\n\n${serviceNames}\n\n**Total Payable:** ${quoteCalculation.totalFormatted} (including 15% VAT).\n\nYou can onboard your company immediately through our secure self-service portal. You can upload your documentation and pay via **Paystack (Card/Instant EFT)** or generate a **Bank EFT Pro-Forma Invoice** with Investec banking details dispatched from craig@consultx.co.za:`,
          serviceQuote,
          updatedProfile,
        });
        return;
      }

      // TRACK D: PRODUCTS (AnNa Expense SaaS)
      if (isProductQuery) {
        updatedProfile.track = "products";
        resolve({
          replyText: `**AnNa Expense** is our AI-powered expense and slip capture product built specifically for South African businesses.\n\n• **WhatsApp Slip Capture**: Team members snap paper slips and invoices directly to WhatsApp.\n• **AI Line-Item Extraction**: AnNa extracts vendor, VAT registration numbers, dates, tax amounts, and categories.\n• **Direct Accounting Sync**: Reconciles and posts straight into Sage Business Cloud, Xero, or QuickBooks.\n• **Pricing**: Starter from **R450/month**, Growth at **R950/month**, Enterprise at **R1,850/month**.\n\nWould you like to schedule a quick 15-minute product demonstration or see how it integrates with your current accounting setup?`,
          clarification: {
            id: "anna_expense_actions",
            question: "Choose your next step with AnNa Expense:",
            options: [
              { label: "📅 Schedule 15-Min Live Demo", value: "Schedule a live demo of AnNa Expense" },
              { label: "🔗 Check Accounting Compatibility", value: "Which accounting platforms does AnNa Expense integrate with?" },
              { label: "⚙️ Custom Automation Architecture", value: "I need custom workflow integration beyond basic expense capture" },
            ],
          },
          updatedProfile,
        });
        return;
      }

      // Evidence-led discovery; options and typed answers use the same interpreter.
      resolve(assessWorkflow(userText, currentProfile));
    }, 600);
  });
}

/**
 * Generator for Specialist Business Valuation Brief
 */
function buildValuationBrief(profile: ProcessProfile): ValuationBrief {
  const purpose = profile.valuationPurpose || "Shareholder Buyout / Transaction";
  const turnover = profile.valuationTurnover || "Turnover between R5m and R20m";
  const records = profile.valuationRecords || "3 years signed AFS available";

  let indicativeFee = "R18,500 – R26,500 + VAT";
  let delivery = "10 to 14 business days";

  if (turnover.includes("R20 Million to R60 Million")) {
    indicativeFee = "R28,000 – R38,500 + VAT";
    delivery = "14 to 20 business days";
  } else if (turnover.includes("R60 Million+")) {
    indicativeFee = "R42,000 – R65,000 + VAT (Mid-Market Mandate)";
    delivery = "3 to 4 weeks";
  } else if (turnover.includes("Under R5 Million")) {
    indicativeFee = "R14,500 – R19,500 + VAT";
    delivery = "7 to 10 business days";
  }

  const methodologies = [
    "Discounted Cash Flow (DCF) — 5-Year Free Cash Flow to Firm with WACC analysis",
    "Maintainable EBITDA Multiples — Peer and transaction benchmarking for private SA entities",
    "Adjusted Net Asset Value (NAV) — Tangible and intangible balance sheet normalization",
  ];

  const requiredDocs = [
    "Last 3 financial years of signed Annual Financial Statements (AFS)",
    "Latest 12-month year-to-date Management Accounts and detailed Trial Balance",
    "3-year forecast budget or revenue projections (if available)",
    "Fixed Asset Register and depreciation schedules",
    "List of normalisation add-backs (owner perks, discretionary expenses, abnormal items)",
  ];

  const executiveSummary = `Independent valuation scoping for ${purpose}. Turnkey mandate including financial normalization, earnings quality audit, three-methodology weighting, and formal signed CA(SA) Valuation Opinion.`;

  return {
    id: `VAL-${Date.now()}`,
    createdAt: new Date().toISOString(),
    companyTurnoverRange: turnover,
    valuationPurpose: purpose,
    financialHistoryQuality: records,
    recommendedMethodologies: methodologies,
    requiredDocuments: requiredDocs,
    indicativeFeeZar: indicativeFee,
    typicalDeliveryWeeks: delivery,
    executiveSummary,
    leadAdvisor: "Craig Ulyate (CA(SA))",
  };
}
