# Ask AnNa routing and workflow implementation checklist

Status: planned work; not a claim that unchecked functionality is complete.
Owner review sequence: complete and verify the implementation, then review pricing first.
Reference: [offering-to-workflow map](offering-workflow-map.md).

## Completion objective

A visitor can describe a need, receive an appropriate assessment, select a confirmed
service/product, and continue into the correct authenticated app or durable consulting
intake without re-entering established information. The system distinguishes information,
intake, quotation, payment, authorisation and completed execution. No simulated success
or invented prices are used in a production path.

## 0. P0 security review and release gate — before workflow rollout

This gate takes priority over handoffs, document intake and operational pilots. Pricing
remains the first commercial review after implementation; security is a prerequisite.

- [ ] Verify deployed HTTPS for website, API and redirects, production authentication
  enforcement and denial of unauthenticated/private API access.
- [ ] Replace the unsigned base64 handoff with expiring, ownership-bound, replay-safe
  server references before transferring any customer context.
- [ ] Test upload AND download isolation with two separate users/companies, wrong-tenant
  identifiers, expired sessions and direct object/file URLs.
- [ ] Verify private storage permissions, encryption configuration, temporary files,
  malware/file validation, retention/deletion, backups and restoration access.
- [ ] Verify Gemini billing/data-processing configuration and retention; inspect logs,
  error reports and analytics for leaked prompts, documents or credentials.
- [ ] Strengthen public API limits, request-size limits and abuse/cost controls beyond
  process-local rate limiting; ensure caller-supplied tenant headers cannot bypass limits.
- [ ] Review public tools and prevent prompt injection from opening private operations.
- [ ] Remove unsupported secure-upload/compliance assurances and disable unverified
  document-upload handoffs. Document a destination-specific approval record before enabling.
- [ ] Deploy and test public-chat scoping guidance and sensitive-input safeguards. Test
  direct API requests as well as the browser; a prompt alone is not an access control.
- [ ] Record evidence and sign-off per destination. Until verified, public chat supports
  business descriptions/scoping only; do not solicit identity documents, bank statements,
  payroll details, passwords or API keys. Do not offer email/WhatsApp as a document workaround.

Acceptance: security findings resolved or explicitly contained, deployed tests recorded,
and sensitive uploads available only in destinations with verified authentication,
company isolation and storage controls. Local source changes alone do not pass this gate.

## 1. Establish the baseline and release boundaries

- [ ] Inventory current website/backend changes and preserve unrelated work.
- [x] Resolve existing build blockers and establish passing baseline checks.
- [ ] Verify the mapped routes against the actual staging deployments and API contracts.
- [ ] Inventory every catalogue entry and assign it to a fixed service, scoped service,
  product, consulting engagement, or information-only route; no silent unmapped entries.
- [ ] Select one canonical destination for each offering; remove conflicting route aliases.
- [ ] Record missing destinations as assisted intake or unavailable, never self-service ready.
- [ ] Keep current approved prices unchanged during implementation; pricing changes occur
  only after the owner review in section 10.
- [x] Owner-approved pricing update: CIPC administration R425; name reservation R425;
  basic company registration R1,025; director amendment/year-end change R625; statutory
  charges at cost where applicable; bookkeeping packages R1,750/R3,250/R6,000; payroll
  R900 for up to 10 employees plus R75 per employee from the 11th.

Acceptance: versioned route inventory with an owner, readiness status, source evidence
and fallback for every offering. A visible page alone does not establish readiness.

## 2. Create the server-owned offering registry

- [x] Define canonical offering IDs, aliases and approved service/product catalogue mappings.
- [x] Record allowed destination origins/paths, action labels and availability status.
- [x] Define minimum chat facts separately from detailed destination intake requirements.
- [x] Record authentication, tenant membership, entitlement and authorisation requirements.
- [x] Record authoritative pricing source/version and whether a price is fixed, variable,
  recurring, "from", or subject to professional scoping.
- [x] Validate the registry at startup/build time and reject unknown IDs.
- [x] Add automated checks for duplicate IDs, unapproved destinations and unmapped services.

Acceptance: the model can select only registered offerings; it cannot invent an app URL,
price, tenant permission or operational status.

## 3. Connect assessment to structured orchestration

- [ ] Add structured route decisions: intent, offering ID, evidence, unresolved facts and
  proposed next action. Keep the user's original objective distinct from the current focus.
- [x] Implement `prepare_service_handoff` in the existing public tool dispatcher.
- [ ] Distinguish explicit service intent from information requests and ambiguous requests.
- [ ] Apply the convergent assessment prompt; avoid diagnosing straightforward service orders.
- [ ] Route corrections and mixed intentions without losing prior relevant context.
- [x] Validate tool inputs and available actions server-side; enforce public tool boundaries.
- [x] Handle unsupported offerings, unavailable apps and missing facts explicitly.
- [ ] Add bounded execution, selective retries, overall deadlines and idempotency for writes.
- [ ] Align public chat, quote, lead and handoff response schemas with the website adapter.
- [ ] Add privacy-conscious route/action telemetry and distinguish live versus fallback responses.

Acceptance: representative requests reliably choose the expected route and action; no
public chat action accesses a private workspace or performs an unauthorised transaction.

## 4. Replace the existing handoff mechanism

- [x] Replace base64 onboarding payloads with opaque, short-lived server-side references.
- [x] Bind context to the originating session and enforce ownership after authentication.
- [x] Add atomic, replay-safe redemption and idempotent draft/request creation.
- [x] Implement an actual receiving route in AnNa and remove unsupported `/redeem` and
  `/workspace` assumptions from the current helper, or implement approved replacements.
- [x] Preserve the intended destination through login, company selection and product setup.
- [x] Verify tenant membership and product entitlement before opening private app data.
- [x] Separate existing-company continuation from explicit new-company creation.
- [x] Transfer confirmed facts, source references, assumptions and unknowns separately.
- [x] Resolve saved quote/assessment references server-side; do not trust URL parameters as proof.
- [x] Add expiry recovery and safe unavailable-destination behaviour.
- [x] Prevent transcripts, financial data and contact details from entering redirect URLs/logs.
- [x] Prohibit automatic accounting-rule installation from an unapproved advisory blueprint.

Acceptance: duplicate clicks, refreshes and interrupted login resume the same permitted
draft. Wrong-user, wrong-tenant, tampered, expired and replayed references are handled safely.

## 5. Implement the first operational pilot: CIPC annual return

- [ ] Verify AnNa `/cipc-annual-returns` as the canonical operational destination.
- [ ] Confirm server-enforced company access, period validation and readiness checks.
- [ ] Prefill only supplied facts; remove sample companies, fabricated document extraction
  and placeholder tenant identifiers from the production intake path.
- [ ] Collect and validate remaining company, financial and beneficial-ownership information.
- [ ] Separate ConsultX's service fee from statutory charges and other applicable components.
- [ ] Require and record applicable mandate, final authorisation and payment verification
  before the execution workflow permits filing.
- [ ] Persist draft, review, payment, authorisation, submission, failure and completion states.
- [ ] Ensure retries do not duplicate filings; surface recoverable failures to the user/operator.
- [ ] Display a filing reference only after a verified execution result.
- [ ] Remove or isolate all preview/offline "completed" outcomes from production.
- [ ] Add a chat action card: selected service, transferred context, next steps and
  **Start annual return intake**. Opening intake must not submit the return.

Acceptance: an authorised staging user can move from chat to a saved filing draft,
complete the prescribed checks, and observe truthful execution status. Validate external
submission with an approved test method; do not lodge a real return merely for testing.

## 6. Implement the consulting and valuation intake pilot

- [ ] Create one durable consulting-intake contract and resolve the existing lead endpoint mismatch.
- [ ] Support automation/process review, finance advisory and valuation scoping as separate offerings.
- [ ] Carry across the objective, evidence, candidate opportunities, assumptions and open questions.
- [ ] Let users review/edit the brief before submitting contact details and intent.
- [ ] Persist one request per idempotent submission and return a real request reference.
- [ ] Provide an operational queue with ownership and a defined follow-up responsibility.
- [ ] Track request received, notification delivered, advisor accepted and appointment booked separately.
- [ ] Connect calendar booking only if availability and confirmed booking IDs are implemented;
  otherwise describe the action as a consultation request.
- [ ] Replace demo valuation mandates with real intake/context or clearly separate demonstrations.

Acceptance: the user and ConsultX can retrieve the same submitted brief; no UI claims
that a notification or booking occurred merely because a request was saved.

## 7. Connect the remaining service and product routes

- [ ] Connect AnNa Expense for existing users and explicit new-user onboarding.
- [ ] Connect debtor-chase setup with entitlement checks; opening it must not send messages.
- [ ] Connect ERP configuration with explicit destination-side consent and supported-platform checks.
- [ ] Distinguish provisional-tax calculation from a filing-service request.
- [ ] Harden general service onboarding: durable orders, validated catalogue selection,
  document storage, authorisation and server-verified payment outcomes.
- [ ] Remove payment-error/offline completion fallbacks and cosmetic blueprint-provisioning claims.
- [ ] Connect tax, AFS, bookkeeping/payroll and statutory service families to verified intake.
- [ ] Provide assisted intake for BO, XBRL and other services lacking an operational app.
- [ ] Keep Brevlyt on a verified enquiry destination until a product onboarding route is established.
- [ ] Reconcile duplicated catalogues and route all pricing through one deterministic source.
- [ ] Separate once-off, recurring, per-unit and variable charges in quotations.

Acceptance: every catalogue offering has a truthful usable next action. Assisted intake
may complete the routing implementation, but must not be described as an automated service.

## 8. Validate end-to-end behaviour and business controls

- [ ] Run contract and integration tests across chat, dispatcher, handoff and receiving apps.
- [ ] Run live-model evaluations for direct orders, information enquiries, ambiguous/mixed needs,
  corrections, rich first messages and consulting discovery.
- [ ] Test new/existing users, multiple companies, missing entitlement and interrupted login.
- [ ] Test invalid offerings, hostile instructions, cross-tenant access and unapproved destinations.
- [ ] Test duplicate submissions, replay, expiry, provider outage and unavailable destinations.
- [ ] Verify text entry, multi-selection, mobile layout and accessibility through complete flows.
- [ ] Confirm that unknown facts and preliminary estimates never become verified application data.
- [ ] Record operational evidence for automated services: human minutes, exception frequency,
  successful completion, rework, processing/API cost and support burden.
- [ ] Verify audit trails without unnecessarily retaining sensitive conversation content.

Acceptance: documented results against each route's completion contract, with no false
success states and no unresolved critical access, payment or submission defects.

## 9. Release and handover

- [ ] Deploy versioned registry, receiving workflows and backend prompt/orchestration together.
- [ ] Build and publish the website with the correct public API configuration.
- [ ] Start with gated CIPC and consulting pilots, then enable other verified registry entries.
- [ ] Verify production configuration and smoke-test non-consequential actions.
- [ ] Provide monitoring, failure ownership, recovery procedures and rollback controls.
- [ ] Record which offerings are automated, assisted, information-only or temporarily unavailable.
- [ ] Present the implementation completion report and the pricing evidence pack next.

Done means routing and handoff are operational for enabled offerings, assisted routes are
honest and durable, and the complete registry has no unexplained gaps. It does not mean
every professional service is now automated.

## 10. First post-implementation owner review: pricing

**Owner's proposed policy: reduce ConsultX's fees for qualifying automated standard
services by 50%.** Prepare the review immediately after implementation; do not silently
apply a blanket discount during development. Where sufficient operating evidence is not
yet available, mark the decision pending rather than inventing a saving.

- [ ] Identify the approved current price and exact scope for every standard service.
- [ ] Classify each service as automated standard, assisted standard, or consulting/exception work.
- [ ] Define eligibility for the standard automated price and the point at which exceptions
  require additional scoping or a separately accepted fee.
- [ ] Calculate the candidate fee as **current ConsultX professional/service fee × 50%**.
- [ ] Show statutory charges, third-party disbursements, subscriptions and other pass-through
  costs separately; do not halve those automatically.
- [ ] Preserve tax treatment as a separate calculation and validate it in the pricing review.
- [ ] Compare old and proposed fees against measured human review, exception/rework,
  infrastructure/API, payment, support and maintenance costs using a consistent cost basis.
- [ ] Distinguish implementation cost recovery from ongoing service delivery costs.
- [ ] Present expected contribution/margin and capacity effects with assumptions visible;
  automation alone is not evidence that total delivery cost fell by 50%.
- [ ] Decide each fee: approve the proposed 50% reduction, revise the scope/fee, or defer
  pending evidence. Record the decision and rationale.
- [ ] Set effective date, applicable customers, treatment of existing quotes/mandates and
  recurring contracts, and quote validity rules before publishing new prices.
- [ ] Publish the approved version consistently to the website, chat tools, quotations,
  onboarding, payment records and customer communications.
- [ ] Re-test calculations and retain old price versions for existing records and rollback.

### Pricing review worksheet

Populate from the reconciled catalogue and operating evidence; no prices are asserted here.

| Service / exact standard scope | Automation status and evidence | Current ConsultX fee | Proposed fee (50%) | Unchanged pass-through costs | Expected delivery cost | Contribution / margin | Exception treatment | Owner decision |
|---|---|---|---|---|---|---|---|---|
| CIPC annual return | To establish after pilot | To verify | Current fee × 0.50 | Separately verified statutory/third-party charges | To measure | To calculate | To define | Pending |
| Other qualifying standard services | Inventory each separately | To verify | Current fee × 0.50 | Separately identified | To measure | To calculate | To define | Pending |

The price review is the first owner review after implementation completion. Operational
checks and necessary release decisions occur beforehand; no reduced prices are approved
or published by this task list itself.
