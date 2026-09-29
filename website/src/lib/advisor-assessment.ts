import type { ClarificationQuestion, ProcessProfile, SolutionBlueprint } from "./advisor-api";

export interface AssessmentState {
  scope: "business" | "process";
  objective: string;
  businessContext?: string;
  areas: string[];
  focus?: string;
  bottleneck?: string;
  systems: string[];
  systemsAnswered?: boolean;
  scale?: string;
  pending?: "business" | "areas" | "focus" | "bottleneck" | "systems" | "scale";
  skipped: string[];
  evidence: string[];
}

export interface Opportunity {
  title: string;
  evidence: string;
  benefit: string;
  effort: string;
  unknowns: string;
}

const areas = ["Month-end close", "Expense capture", "Debtor follow-up", "Sales administration", "Operations", "Customer service", "HR", "Reporting"];
const patterns = [/month.?end|close|reconcil/i, /expense|receipt|slip/i, /debtor|receivable|overdue/i, /sales|order|quoting/i, /operation|inventory|stock/i, /customer service|support ticket/i, /\bhr\b|payroll|onboarding/i, /report|dashboard/i];
const suggestions: Record<string, string> = {
  "Month-end close": "Close-task tracking, information requests and reconciliation exception reporting",
  "Expense capture": "Document intake and extraction with human approval",
  "Debtor follow-up": "Reminder preparation and dispute tracking",
  "Sales administration": "Order validation and quote preparation",
  Operations: "Exception alerts and task coordination",
  "Customer service": "Request triage and draft responses",
  HR: "Onboarding checklists and document requests",
  Reporting: "Repeatable report preparation with source checks",
};

export function extractSystems(text: string): string[] {
  const candidates: [string, RegExp][] = [["Xero", /\bxero\b/i], ["Sage", /\bsage\b/i], ["QuickBooks", /quickbooks/i], ["Microsoft Excel", /\bexcel\b/i], ["Outlook", /outlook/i], ["Microsoft 365", /microsoft 365|office 365/i], ["WhatsApp", /whatsapp/i]];
  return candidates.filter(([, re]) => re.test(text)).filter(([name]) => {
    const escaped = name === "Microsoft Excel" ? "(?:Microsoft )?Excel" : name;
    return !new RegExp(`(?:not|no longer|don't use|do not use)\\s+(?:using\\s+)?${escaped}`, "i").test(text);
  }).map(([name]) => name);
}

function question(id: AssessmentState["pending"], text: string, choices: string[], multiple = false): ClarificationQuestion {
  return { id: `assessment_${id}`, question: text, options: choices.map(value => ({ label: value, value })), multiple, inputPlaceholder: "Describe your situation, ask a question, or correct an earlier answer…" };
}

export function assessWorkflow(userText: string, profile?: Partial<ProcessProfile>) {
  const previous = profile?.assessment;
  const state: AssessmentState = previous ? structuredClone(previous) : {
    scope: /across|whole business|opportunit|business.wide/i.test(userText) ? "business" : "process",
    objective: userText, areas: [], systems: [], skipped: [], evidence: [],
  };
  const text = userText.trim();
  const skip = /^(skip for now|not sure|skip)$/i.test(text);
  const help = /^(what (do you mean|is|does|are)|can you explain|why|how do i)/i.test(text);
  const detected = areas.filter((_, i) => patterns[i].test(text));
  const foundSystems = extractSystems(text);
  const correction = /actually|instead|not .+but|no longer|don't use|do not use/i.test(text);
  if (!help && !skip) {
    state.evidence = [...state.evidence, text].slice(-20);
    state.areas = Array.from(new Set([...state.areas, ...detected]));
    if (state.pending === "areas" && !detected.length) state.areas.push(text);
    if (state.pending === "focus" && state.areas.includes(text)) state.focus = text;
    const removed = state.systems.filter(name => extractSystems(text).includes(name) || !new RegExp(`(?:not|no longer|don't use|do not use)\\s+(?:using\\s+)?${name === "Microsoft Excel" ? "(?:Microsoft )?Excel" : name}`, "i").test(text));
    state.systems = Array.from(new Set([...removed, ...foundSystems]));
    if (state.pending === "business" || /\b(we (run|are)|our business|manufacturer|retail|consultancy)\b/i.test(text)) state.businessContext = text;
    if (state.pending === "systems" && !help) {
      state.systemsAnswered = true;
      if (!foundSystems.length) state.systems = Array.from(new Set([...state.systems, text]));
    }
    if (state.pending === "focus" && detected.length === 1) state.focus = detected[0];
    if (!state.focus && state.scope === "process" && detected.length === 1) state.focus = detected[0];
    if (state.pending === "bottleneck" || /missing|waiting|manual|rekey|approval|reconcil|chasing|copy|lost/i.test(text)) state.bottleneck = text;
    if (/\d+\s*(?:to\s*\d+\s*)?(?:hours?|hrs?|documents?|invoices?|days?|transactions?)|full.time/i.test(text)) state.scale = text;
    if (correction && detected.length === 1 && state.focus) state.focus = detected[0];
  }
  if (skip && state.pending) state.skipped = Array.from(new Set([...state.skipped, state.pending]));
  const opportunities: Opportunity[] = state.areas.map(title => ({ title,
    evidence: state.evidence.filter(value => patterns[areas.indexOf(title)]?.test(value) || value === title).join("; "),
    benefit: suggestions[title] || "Map repetitive steps and evaluate a small, measurable pilot", effort: "To assess after confirming the process and access",
    unknowns: "Baseline effort, process owner, data quality and integration access",
  }));
  let clarification: ClarificationQuestion | undefined;
  const missing = (key: string, value: unknown) => !value && !state.skipped.includes(key);
  if (missing("business", state.businessContext) && state.scope === "business") clarification = question("business", "What does your business do, and where do repetitive work or delays occur?", []);
  else if (missing("areas", state.areas.length)) clarification = question("areas", "Which areas would you like to assess? Choose several or describe another process.", areas, true);
  else if (missing("focus", state.focus)) clarification = question("focus", "These are candidates, not a ranked recommendation yet. Which should we explore first?", state.areas);
  else if (missing("bottleneck", state.bottleneck)) clarification = question("bottleneck", `What holds up ${state.focus || "this process"} most?`, ["Missing information", "Manual reconciliations", "Waiting for approvals", "Preparing reports"]);
  else if (missing("systems", state.systemsAnswered || state.systems.some(s => ["Xero", "Sage", "QuickBooks"].includes(s)))) clarification = question("systems", "Which accounting platform and other tools support this process? You can name any system.", ["Xero", "Sage", "QuickBooks", "Microsoft Excel", "Outlook"], true);
  else if (missing("scale", state.scale)) clarification = question("scale", "What is the staff time spent on this process? Separately, share its frequency or volume if known.", []);
  // Keep a request for explanation on the same question; never consume it as an answer.
  if (help && previous?.pending) {
    state.pending = previous.pending;
  } else state.pending = clarification?.id.replace("assessment_", "") as AssessmentState["pending"];
  const updatedProfile: ProcessProfile = { ...profile, visitorObjective: state.objective, painPoint: state.objective,
    specificFriction: state.bottleneck, primarySystems: state.systems, confidenceScore: 0,
    track: "solutions", assessment: state, volumeOrScale: state.scale };
  const blueprint: SolutionBlueprint | undefined = !clarification ? {
    id: `assessment-${Date.now()}`, createdAt: new Date().toISOString(), title: `Initial assessment: ${state.focus || "automation opportunities"}`,
    isTailored: false, problemRestatement: state.bottleneck || state.objective,
    currentFlow: state.bottleneck ? [state.bottleneck] : ["Current process has not been established."],
    proposedFlow: [suggestions[state.focus || ""] || "Map the process and identify repetitive steps before selecting automation.", "Pilot with representative examples and measure the result before expanding."],
    architecturePattern: "Integration approach pending validation", systemsInvolved: state.systems,
    expectedBenefit: "Potential staff capacity released; cash savings and payback are not established.",
    opportunityScore: null, feasibilityRating: "Unverified",
    risksAndControls: ["Confirm access and data quality before implementation"], humanCheckpoints: ["Process owner reviews proposed changes and approves outputs"],
    whatToValidate: ["Process owner and detailed current workflow", "System version and available integration access", "Measured staff effort, implementation cost and ongoing cost", ...state.skipped.map(s => `${s}: not established`)],
    indicativeQuote: { setupTier: "Standard Integration", estimatedSetupZar: "Not yet estimated", expectedPaybackMonths: "Not yet estimated", pricingBasis: "Scope, access, baseline effort and costs must be validated first." },
    nextStepTitle: "Validate the assessment", nextStepDescription: "Correct any assumptions or review with Craig.",
  } : undefined;
  const explanation = state.pending === "scale" ? "Staff time means the combined hours people spend doing the work; elapsed days and document counts are separate."
    : state.pending === "systems" ? "Name the accounting platform that holds the records, plus any tools used alongside it. A custom system is a valid answer."
    : state.pending === "bottleneck" ? "A bottleneck is the step that causes waiting or repeated manual effort, such as chasing information or obtaining approval."
    : "Describe the business or process you want to improve. Suggestions are optional; you can explore several areas before choosing one.";
  return { replyText: help ? `${explanation} You can answer in your own words or skip what you do not know. Offline guidance can only explain these assessment questions; other questions need the live advisor.`
    : correction ? "I have updated the facts you corrected. Your overall assessment objective is retained."
    : blueprint ? "Here is a preliminary assessment based on what you shared. Integration feasibility, pricing and savings remain unverified. You can correct or add information below."
    : opportunities.length ? "These opportunities reflect the areas you mentioned. We will establish the bottleneck before recommending a solution."
    : "Let’s identify where automation could help. We can explore several areas before choosing a process.",
    clarification, opportunities, blueprint, updatedProfile };
}
