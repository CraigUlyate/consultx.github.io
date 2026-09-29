import type { ProcessProfile, SolutionBlueprint } from "./advisor-api";

const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const words = (value: unknown, fallback = "Not established") => typeof value === "string" && value.trim() ? value : fallback;
const list = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

/** Adapt the public backend's ChatReply; never copy model-provided financial estimates. */
export function adaptPublicReply(value: unknown, profile: ProcessProfile) {
  const data = record(value);
  const replyText = words(data.text ?? data.replyText, "");
  if (!replyText) throw new Error("Invalid advisor response");
  const outcomes = Array.isArray(data.tool_outcomes) ? data.tool_outcomes : [];
  let blueprint: SolutionBlueprint | undefined;
  for (const item of outcomes) {
    const outcome = record(item);
    const result = record(outcome.result);
    if (outcome.name !== "generate_solution_blueprint" || result.ok !== true) continue;
    const bp = record(result.blueprint);
    if (!Object.keys(bp).length) continue;
    blueprint = {
      id: words(bp.id, `bp-${Date.now()}`), createdAt: new Date().toISOString(), title: words(bp.title, "Preliminary assessment"),
      isTailored: false, problemRestatement: words(bp.problem_statement), sourceChannel: words(bp.source_channel), destinationLedger: words(bp.destination_ledger),
      currentFlow: list(bp.current_flow), proposedFlow: list(bp.proposed_flow), systemsInvolved: Array.from(new Set(list(bp.systems_involved))),
      architecturePattern: "Proposed approach — access and feasibility require validation", expectedBenefit: "Benefits require a measured baseline.",
      opportunityScore: null, feasibilityRating: "Unverified", risksAndControls: [], humanCheckpoints: ["Process owner approves changes before implementation"],
      whatToValidate: ["Source and destination system access", "Current workflow and process owner", "Baseline effort, implementation scope and costs"],
      indicativeQuote: { setupTier: "Standard Integration", estimatedSetupZar: "Not yet estimated", expectedPaybackMonths: "Not yet estimated", pricingBasis: "Requires validated scope and an approved estimate." },
      nextStepTitle: "Validate the assessment", nextStepDescription: words(bp.next_steps),
    };
  }
  return { replyText, blueprint, updatedProfile: profile, responseMode: "live" as const };
}
