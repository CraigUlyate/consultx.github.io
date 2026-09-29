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
  hoursMonthly?: number;
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
    scope: /across|whole business|opportunit|oppoertunit|automa|assess|all areas|consult/i.test(userText) ? "business" : "process",
    objective: userText, areas: [], systems: [], skipped: [], evidence: [],
  };
  const text = userText.trim();
  const skip = /^(skip for now|not sure|skip)$/i.test(text);
  const help = /^(what (do you mean|is|does|are)|can you explain|why|how do i)/i.test(text);
  const isAllAreas = /\b(?:all(?:\s+areas)?|everything|all of them|all process(?:es)?)\b/i.test(text);
  const detected = areas.filter((_, i) => patterns[i].test(text));
  const foundSystems = extractSystems(text);
  const correction = /actually|instead|not .+but|no longer|don't use|do not use/i.test(text);

  if (!help && !skip) {
    if (!state.evidence.includes(text)) {
      state.evidence = [...state.evidence, text].slice(-20);
    }

    if (isAllAreas) {
      const topPriorities = ["Debtor follow-up", "Expense capture", "Month-end close", "Sales administration"];
      state.areas = Array.from(new Set([...state.areas.filter(a => a !== "All areas"), ...topPriorities]));
    } else {
      state.areas = Array.from(new Set([...state.areas, ...detected])).filter(a => a !== "All areas");
      if (state.pending === "areas" && !detected.length && text) {
        state.areas.push(text);
      }
    }

    if (state.pending === "focus") {
      if (state.areas.includes(text)) {
        state.focus = text;
      } else if (detected.length === 1) {
        state.focus = detected[0];
      }
    }

    const removed = state.systems.filter(name => extractSystems(text).includes(name) || !new RegExp(`(?:not|no longer|don't use|do not use)\\s+(?:using\\s+)?${name === "Microsoft Excel" ? "(?:Microsoft )?Excel" : name}`, "i").test(text));
    state.systems = Array.from(new Set([...removed, ...foundSystems]));
    if (state.pending === "business" || /\b(we (run|are)|our business|manufacturer|retail|consultancy)\b/i.test(text)) state.businessContext = text;
    if (state.pending === "systems" && !help) {
      state.systemsAnswered = true;
      if (!foundSystems.length && text) state.systems = Array.from(new Set([...state.systems, text]));
    }
    if (!state.focus && state.scope === "process" && detected.length === 1) state.focus = detected[0];
    if (state.pending === "bottleneck" || /missing|waiting|manual|rekey|approval|reconcil|chasing|copy|lost/i.test(text)) state.bottleneck = text;

    // Parse scale and numeric staff hours
    if (/\d+\s*(?:to\s*\d+\s*)?(?:hours?|hrs?|documents?|invoices?|days?|transactions?)|full.time/i.test(text)) {
      state.scale = text;
      const hoursMatch = text.match(/(\d+)\s*(?:to\s*(\d+)\s*)?(?:hours?|hrs?)/i);
      if (hoursMatch) {
        state.hoursMonthly = hoursMatch[2]
          ? Math.round((parseInt(hoursMatch[1], 10) + parseInt(hoursMatch[2], 10)) / 2)
          : parseInt(hoursMatch[1], 10);
      }
    }
    if (correction && detected.length === 1 && state.focus) state.focus = detected[0];
  }

  if (skip && state.pending) state.skipped = Array.from(new Set([...state.skipped, state.pending]));

  const opportunities: Opportunity[] = state.areas.map(title => {
    const matchingEvidence = Array.from(new Set(
      state.evidence.filter(value => patterns[areas.indexOf(title)]?.test(value) || value.toLowerCase() === title.toLowerCase())
    ));
    return {
      title,
      evidence: matchingEvidence.length > 0 ? matchingEvidence.join("; ") : "Identified for operational review",
      benefit: suggestions[title] || "Map repetitive steps and evaluate a small, measurable pilot",
      effort: "To assess after confirming the process and access",
      unknowns: "Baseline effort, process owner, data quality and integration access",
    };
  });

  let clarification: ClarificationQuestion | undefined;
  const missing = (key: string, value: unknown) => !value && !state.skipped.includes(key);

  if (missing("business", state.businessContext) && state.scope === "business") {
    clarification = question("business", "What does your business do, and where do repetitive work or delays occur?", []);
  } else if (missing("areas", state.areas.length)) {
    clarification = question("areas", "Which areas would you like to assess? Choose several or describe another process.", areas, true);
  } else if (missing("focus", state.focus)) {
    const focusCandidates = state.areas.filter(a => a !== "All areas");
    const options = focusCandidates.length > 0 ? focusCandidates : ["Debtor follow-up", "Expense capture", "Month-end close", "Sales administration"];
    clarification = question("focus", "Automating every workflow at once creates operational risk. For immediate ROI, which core process causes the greatest friction?", options);
  } else if (missing("bottleneck", state.bottleneck)) {
    clarification = question("bottleneck", `What holds up ${state.focus || "this process"} most?`, ["Missing information", "Manual reconciliations", "Waiting for approvals", "Preparing reports"]);
  } else if (missing("systems", state.systemsAnswered || state.systems.some(s => ["Xero", "Sage", "QuickBooks"].includes(s)))) {
    clarification = question("systems", "Which accounting platform and other tools support this process? You can name any system.", ["Xero", "Sage", "QuickBooks", "Microsoft Excel", "Outlook"], true);
  } else if (missing("scale", state.scale)) {
    clarification = question("scale", "What is the staff time spent on this process? Separately, share its frequency or volume if known.", []);
  }

  // Keep a request for explanation on the same question; never consume it as an answer.
  if (help && previous?.pending) {
    state.pending = previous.pending;
  } else state.pending = clarification?.id.replace("assessment_", "") as AssessmentState["pending"];

  const updatedProfile: ProcessProfile = {
    ...profile,
    visitorObjective: state.objective,
    painPoint: state.objective,
    specificFriction: state.bottleneck,
    primarySystems: state.systems,
    confidenceScore: state.hoursMonthly ? 0.85 : 0.5,
    estimatedHoursSpentMonthly: state.hoursMonthly,
    track: "solutions",
    assessment: state,
    volumeOrScale: state.scale,
  };

  const hours = state.hoursMonthly || (state.scale && /(\d+)/.test(state.scale) ? parseInt(state.scale.match(/(\d+)/)![1], 10) : undefined);
  const monthlySavingsZar = hours ? hours * 200 : undefined;
  const annualSavingsZar = monthlySavingsZar ? monthlySavingsZar * 12 : undefined;
  const setupZar = hours && hours >= 60 ? "R22,500 – R29,500 + VAT" : hours ? "R16,500 – R22,500 + VAT" : "R18,500 – R26,500 + VAT";
  const paybackText = hours && hours >= 40 ? "1 to 2 months" : hours ? "2 to 3 months" : "Not yet estimated";
  const benefitText = hours && monthlySavingsZar && annualSavingsZar
    ? `Releases ~${hours} hours/month of recurring staff time (est. R${monthlySavingsZar.toLocaleString()}/month or R${annualSavingsZar.toLocaleString()}/year in recoverable capacity).`
    : "Potential staff capacity released; cash savings and payback to be confirmed during scoping.";

  const isQb = state.systems.some(s => /quickbooks/i.test(s));
  const isXero = state.systems.some(s => /xero/i.test(s));
  const isSage = state.systems.some(s => /sage/i.test(s));
  const targetLedger = isQb ? "QuickBooks" : isXero ? "Xero" : isSage ? "Sage" : state.systems[0] || "core accounting ledger";

  const defaultProposedFlow = [
    `Ingest documents and transaction data via automated intake channels.`,
    `Apply validation checks and route exceptions to human review before posting into ${targetLedger}.`,
    `Reconcile and sync records automatically, eliminating manual copy-paste overhead.`,
  ];

  const cleanFocus = state.focus && state.focus !== "All areas" ? state.focus : "Finance & Operations";

  const blueprint: SolutionBlueprint | undefined = !clarification ? {
    id: `assessment-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `${cleanFocus} Automation Blueprint`,
    isTailored: Boolean(hours && state.systems.length > 0),
    problemRestatement: state.bottleneck || (hours ? `Manual operations in ${cleanFocus} currently consume ~${hours} staff hours/month.` : state.objective),
    currentFlow: state.bottleneck
      ? [state.bottleneck]
      : hours
      ? [`Manual steps consume an estimated ${hours} hours/month of recurring staff time.`, `Risk of delays, backlog, and human error in ${cleanFocus}.`]
      : ["Current process baseline has not yet been quantified."],
    proposedFlow: defaultProposedFlow,
    architecturePattern: `${targetLedger} API & Validation Pipeline`,
    systemsInvolved: state.systems.length > 0 ? state.systems : [targetLedger],
    expectedBenefit: benefitText,
    opportunityScore: hours ? (hours >= 60 ? 9.0 : 8.5) : 7.0,
    feasibilityRating: state.systems.length > 0 ? "High" : "Medium",
    risksAndControls: ["API connection and token security authenticated with zero cleartext credentials", "Human-in-the-loop review for transactions over policy thresholds"],
    humanCheckpoints: ["Process owner reviews proposed changes and approves outputs", "Financial manager retains final approval before ledger reconciliation"],
    whatToValidate: ["Process owner and detailed current workflow", "System version and available API integration access", `Confirmed staff hourly cost against benchmark (est. R200/hr)`],
    indicativeQuote: {
      setupTier: "Standard Integration",
      estimatedSetupZar: setupZar,
      estimatedMonthlyZar: "R1,850/month (SaaS & support)",
      expectedPaybackMonths: paybackText,
      pricingBasis: hours
        ? `Based on ${hours} hours/month recoverable staff time at R200/hr benchmark vs standard deployment.`
        : "Scope, access, baseline effort and costs to be confirmed during scoping.",
    },
    nextStepTitle: "Schedule Scoping Review with Craig Ulyate (CA(SA))",
    nextStepDescription: "Review this preliminary blueprint, validate software API access, and confirm deployment timeline.",
  } : undefined;

  const explanation = state.pending === "scale" ? "Staff time means the combined hours people spend doing the work; elapsed days and document counts are separate."
    : state.pending === "systems" ? "Name the accounting platform that holds the records, plus any tools used alongside it. A custom system is a valid answer."
    : state.pending === "bottleneck" ? "A bottleneck is the step that causes waiting or repeated manual effort, such as chasing information or obtaining approval."
    : "Describe the business or process you want to improve. Suggestions are optional; you can explore several areas before choosing one.";

  return {
    replyText: help ? `${explanation} You can answer in your own words or skip what you do not know. Offline guidance can only explain these assessment questions; other questions need the live advisor.`
      : correction ? "I have updated the facts you corrected. Your overall assessment objective is retained."
      : blueprint ? "Here is a preliminary assessment based on what you shared. Integration feasibility, pricing and savings remain unverified. You can correct or add information below."
      : opportunities.length ? "These opportunities reflect the areas you mentioned. We will establish the bottleneck before recommending a solution."
      : "Let’s identify where automation could help. We can explore several areas before choosing a process.",
    clarification,
    opportunities,
    blueprint,
    updatedProfile,
  };
}
