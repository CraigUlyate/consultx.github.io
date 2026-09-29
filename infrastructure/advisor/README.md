# Public advisor assessment structure

## What existed before this change

The website called `/api/v1/ai/public-advisor` but expected `replyText` and
`updatedProfile`. The backend returned `text` and `tool_outcomes` instead.
The local fallback used a fixed pain → software → scale sequence, then a template.
There was no dedicated business-wide assessment document in this workspace.

The backend checkout is `C:/Users/craig/ai-accountant-mvp`:

- `app/api/v1/ai_chat.py`: public endpoint and public system instruction.
- `app/agents/accountant_tools.py`: public declarations, execution and output defaults.
- `app/agents/system_prompt.py`: separate authenticated accounting-workspace prompt.
  This is not the public website's assessment prompt.

## Review the assessment policy

Implementation work is tracked in the [implementation task list](implementation-task-list.md).
It schedules pricing as the first post-implementation owner review, including the proposed
50% reduction to qualifying automated standard-service fees.

For app destinations and intake requirements, see the
[offering-to-workflow handoff map](offering-workflow-map.md). It separates verified
source routes from proposed destinations and identifies blockers before routing is enabled.

Read [assessment-system-prompt.md](assessment-system-prompt.md). It specifies turn
interpretation, routing, evidence, question selection, blueprint readiness and tool boundaries.
The backend loads a local copy at `app/agents/public_assessment_prompt.md`.
Keep both copies aligned when revising policy. Deployment is needed for server changes
to take effect; changing this workspace document alone does not change a running service.

## Runtime map

1. `website/src/components/ai/AdvisorChat.tsx` accepts text and optional selections.
2. `website/src/lib/advisor-api.ts` sends prior conversation plus the new message,
   adapts the backend response, and labels live versus offline responses.
3. The live backend uses the public assessment prompt and bounded tool loop.
4. When unavailable, `website/src/lib/advisor-assessment.ts` provides limited,
   deterministic workflow discovery. It is not an LLM and cannot interpret arbitrary
   prose as reliably as the live advisor. Explicit unknowns and skipping prevent invented facts.
5. `BlueprintCard.tsx` displays preliminary assessments without fabricated scores.

## Review questions for the owner

The assessment policy now includes a convergent investigation method: gap, onset/change,
boundary, and pattern/trigger. These guide the AI's choice of the next question rather
than impose four fixed turns. The model should combine user evidence with verified
ConsultX offerings and select the question most likely to change the next action.
The policy explicitly avoids treating a recent change as proven causation, insists on
tracing the actual workflow, and permits a provisional assessment or professional review
when further chat questions would not improve the decision.

This is a live-model instruction change, not a new reasoning API setting. The offline
fallback remains limited rule-based discovery and does not implement this full protocol.

- Which business areas should ConsultX cover, and when should it refer elsewhere?
- Which facts are mandatory before an indicative architecture is useful?
- What evidence should justify ranking two opportunities?
- Which approved rates and scope criteria may support estimates?
- When should AnNa offer a human review versus continue discovery?

## Acceptance scenarios

- Broad business request remains broad and produces candidates before a blueprint.
- A paragraph naming several issues and systems populates multiple facts.
- Selecting Excel does not establish a ledger or invent a source-to-destination flow.
- "Actually we use Sage, not Xero" removes Xero rather than retaining both.
- Asking what volume means does not become a volume answer.
- Unknowns and skipped answers stay unknown; no fixed ROI, hours or feasibility score.
- A system outside the predefined options is accepted in free text.
- Old question buttons cannot submit answers to a newer question.
- Offline guidance is identified and never claims an external action occurred.
- Live text is displayed from the actual backend response contract.
- A rich first message covering gap, onset, boundary and trigger produces a focused
  next step without asking those four questions again.
- "Nothing changed" results in at most one relevant follow-up, not an interrogation loop.
- A long-standing process or new opportunity is not forced to invent an incident onset.
- A working comparison narrows the scope without dismissing shared dependencies.
- A recent configuration change is treated as a hypothesis requiring verification.
- Direct pricing and product questions are answered through their routes without the
  failure-investigation questionnaire.
- A month-end bottleneck can lead to process/accounting advisory rather than default OCR.
- A recommendation explains its fit to a verified ConsultX offering; no unsupported
  integration capability, price, root cause or completed action is claimed.

## Validation and release status

Public-chat security boundary: visible scoping-only guidance, heuristic sensitive-input
screening before browser transmission and before backend AI processing, disabled chat
document/payment handoffs, and no clickable model-generated links or remote images.
The public prompt prohibits requesting sensitive records or credentials and does not
declare any upload destination verified. Contact intake permits ordinary callback
details and high-level notes only. Pattern screening is not comprehensive DLP and can
miss sensitive content; it does not prove that unsolicited information cannot reach
the server. Deployment and adversarial/live-model testing remain required.

The implementation checklist now contains a P0 security gate before workflow rollout.
No sensitive-upload destination has been approved by these local changes.

Run `node scripts/test-advisor.cjs` from `website` for the deterministic assessment
and response-adapter regression checks. TypeScript and targeted ESLint checks passed.
The edited backend Python files passed syntax parsing. The production build compiled
the application but stopped on pre-existing `no-explicit-any` lint errors in
`website/src/components/portal/AnnualReturnWizard.tsx` (outside this change).

No deployment or live model evaluation was performed. The browser preview verified
that the multiline composer and rendered Markdown are present. Backend prompt
adherence still needs staging evaluation with the acceptance scenarios above.

The existing quote and product tools retain separate catalogues; their commercial
data needs reconciliation before relying on them for official pricing. This change
removes unsupported workflow blueprint estimates, not a full pricing-engine rewrite.
