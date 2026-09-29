# ConsultX → AnNa offering and workflow handoff map

Prepared 29 September 2026. Status: review proposal based on local source inspection;
not a deployed routing registry or a production-readiness certification.

## Recommended ownership

The assessment prompt identifies the need and explains the recommended offering.
The existing public-advisor orchestrator validates a canonical offering ID against a
server-owned registry and prepares a handoff. The destination app owns authentication,
company selection, detailed intake, authorisation, payment and execution.

An explicit request such as "file my annual return" establishes service intent. An
information request such as "what is an annual return?" stays in chat. Starting intake
does not authorise a filing, payment, subscription, or calendar booking.

App paths below are verified in the local AnNa frontend router. Portal paths are verified
in the local ConsultX website. Hostnames, deployments, account entitlements and end-to-end
behaviour still need staging verification. Proposed registry IDs are not existing API enums.

## Offering-to-destination map

| Proposed offering ID / route | Evidence and destination | Minimum chat information | Proposed action / readiness |
|---|---|---|---|
| `cipc_annual_return` / fixed service | AnNa `/cipc-annual-returns`; app lists, compiles and submits returns through its API. ConsultX also has `/portal/services/cipc-annual-return/` and `/portal/services/cipc/`. | Confirm annual return service and whether this is a new request or an existing job. Collect known entity/period only; allow unknowns. | **Start annual return intake**. Prefer the authenticated AnNa app as canonical candidate; validate authorisation/payment/submission controls before enabling. Do not use the portal preview as a filing-completion path. |
| `beneficial_ownership` / fixed service | Catalogue entry; general `/portal/services/onboard/?services=beneficial_ownership`; CIPC hub exists. A separate end-to-end BO filing app was not established in this review. | Confirm BO update versus annual return; entity and nature of change if known. | **Request beneficial ownership assistance**. Assisted intake until an operational destination is verified. |
| `statutory_service` / fixed service family | `/portal/services/onboard/?services=<approved catalogue ID>` supports service preselection. Covers registration, director changes, searches and other catalogue services. | Exact service; entity type; relevant deadline; unresolved scope. | **Prepare service request**. General onboarding currently contains simulated completion and must be hardened before transactional handoff. |
| `tax_service` / fixed or scoped service family | Tax catalogue IDs include `vat_registration`, `tax_clearance`, `vat201_submission`, `emp201_monthly`, and individual tax services. General onboarding accepts IDs; `/portal/services/tax/` is a separate cockpit. | Specific request, entity/person, tax period and deadline where relevant. | **Prepare tax-service request**. Use staff-led intake until persistence, mandate and service execution are verified. Complex remediation routes to advisory. |
| `provisional_tax_company` / calculator or filing service | AnNa `/provisional-tax` exists under authentication. Catalogue separately contains `provisional_tax_company`. | Distinguish an estimate/calculation from requesting a return submission; period and entity if known. | **Open provisional tax calculator** for calculation intent. Do not imply this route itself proves SARS submission capability; filing intent requires verified service intake. |
| `annual_financial_statements` / scoped service family | Catalogue IDs `afs_company`, `afs_cc`, `afs_sole_prop`, `afs_trust`, `afs_partnership`; general onboarding route. | Entity type, financial year, records readiness and requested deliverable. | **Scope financial statements**. Validate eligibility and any “from” pricing; route catch-up/complexity to a human review. |
| `anna_expense` / product | AnNa `/expense-dashboard`, `/upload`, `/workflow/:stage`, `/batches/:id` and related review/output routes. Expense routes have access wrappers. | Product intent; new setup or existing workspace; actual ledger and receipt/card/claim flow if assessing compatibility. | **Open expense workspace** for an eligible existing account; **Set up expense capture** for a new user after account/product setup. No verified standalone `/signup` route was found in the inspected router. |
| `debtor_chase` / product or engagement | AnNa `/debtor-chase`, including `/setup/activate`; feature gate `debtor_chase_dashboard`, app ID `debtor-chase`. Catalogue also contains `debtors_management` and `debtor_chase_automation`. | Self-service app versus managed collections/automation engagement; existing system; desired outcome. | **Set up debtor follow-up** for the app; **Scope debtor-management support** for the service. Opening the app must not send debtor messages. |
| `erp_connect` / supporting app | AnNa `/erp`, feature gate `erp_connections`, app ID `erp-connect`. | User intends to connect a supported accounting system, rather than only explore feasibility. | **Review accounting connections**. Destination checks entitlement and performs explicit connection/consent steps. Do not request credentials in chat. |
| `business_valuation` / consulting | Catalogue `valuation_express`, `valuation_comprehensive`, `valuation_ma_advisory`; portal `/portal/services/valuation/` exists but contains demonstration/simulation elements. | Purpose, approximate scale, available financial history and timing. | **Prepare valuation brief** → advisor intake. Do not send a new prospect into a demo mandate or treat the cockpit's model as a completed valuation. |
| `workflow_automation` / consulting | Marketing `/products/workflow-automation/`; catalogue `finance_process_diagnostic`; chat blueprint and consultation form exist. No dedicated persisted consulting-intake destination verified. | Objective, chosen process or candidate areas, observed bottleneck, known tools and unresolved questions. | **Review automation brief** → proposed consulting intake. Use contact fallback with clear manual submission until durable intake is connected. |
| `finance_advisory` / consulting | Catalogue `outsourced_cfo_advisory`, `outsourced_cfo_growth`, `financial_modelling_3way`, `tax_advisory`. | Desired decision/outcome, business context, urgency and information available. | **Scope advisory engagement** → proposed consulting intake. Do not turn an uncertain scope into a fixed-fee purchase. |
| `bookkeeping_payroll` / recurring service | Catalogue bookkeeping tiers, `bookkeeping_monthly`, `payroll_monthly`; general onboarding. | Bookkeeping versus payroll, frequency, relevant volume/headcount, current records and start date. | **Scope recurring support**. Reconcile billing units and eligibility before quote or subscription. |
| `xbrl_tagging` / specialist service | Catalogue entry and public product-tool references; no dedicated executable XBRL app route found in the inspected AnNa router. | Required output, entity and reporting period; records readiness. | **Request XBRL assistance** → specialist intake, not an invented app link. |
| `brevlyt` / product enquiry | `/products/brevlyt/` links to `/contact/`; no AnNa Brevlyt app destination established. | Information, demonstration or implementation intent. | **Enquire about Brevlyt** → existing contact route. Do not promise an AnNa workspace. |
| `general_discovery` / assessment | Existing `/advisor/` conversation. | Desired outcome and broad context. | Continue assessment; present candidates before forcing a product selection. |

## Destination intake and completion contract

These are proposed handoff requirements, not claims that each destination implements them.
Only request enough in chat to choose a route. Collect sensitive documents and detailed
financial information inside the authenticated destination.

| Destination family | Access and destination-side intake | Context to transfer | Handoff success versus service completion |
|---|---|---|---|
| CIPC annual return | Authenticate; verify authorised company membership; confirm enterprise number, correct filing period, required financial/BO information, mandate and applicable payment/authorisation gates. | Offering, known entity/period, user-reported facts, unanswered questions. | Success: a persisted draft/intake ID for the selected company. Completion: verified filing outcome and reference from the execution workflow, never a simulated UI state. |
| Fixed/scoped service intake | Establish customer and permitted company; validate catalogue version, scope, quantities, billing basis, required documents and mandate. | Service IDs, scope notes, approved quote reference if available. | Success: durable service request. Payment and completed delivery are separate statuses backed by server evidence. |
| Existing AnNa product | Sign in; select an authorised tenant; check product entitlement and configuration. | Product ID, destination action and optional assessment reference. | Success: correct app opens in the correct authorised workspace. No automatic posting, messaging or subscription activation. |
| New AnNa product setup | Account creation/login, explicit company creation or selection, product setup and commercial acceptance where needed. | Product interest, business context and validated setup preferences. | Success: persisted onboarding progress. A tenant must not be created merely by opening or retrying a link. |
| Consulting / valuation | Public brief can be drafted without an account; obtain contact details and intent before durable submission. Secure document intake follows as needed. | Objective, evidence, hypotheses, unknowns, selected offering and requested timing. | Success: request ID and received status. Advisor acceptance, appointment booking and signed engagement are separate later states. |
| Information/contact | No operational account assumed; use existing contact route. | Optional non-sensitive offering label; additional context only through an implemented mechanism. | Success: information displayed or confirmed contact submission. Navigation alone is not a submitted enquiry. |

## Existing handoff gaps that block reuse

1. **Frontend/backend contract mismatch.** `website/src/lib/handoff-client.ts` posts
   `tenant_id` and expects `ok`, `redirect_url` and a token. The backend input instead
   accepts company/contact/blueprint/service data and returns token plus numeric expiry.
   The client types expiry as a string. This is not a verified existing-tenant handoff.
2. **Missing receiving routes.** The helper navigates to `/redeem?token=...` or
   `/workspace?tenant_id=...`. Neither route appears in the inspected AnNa `App.tsx`;
   its catch-all redirects to `/`. Do not register these as valid destinations.
3. **Token integrity and confidentiality.** The backend builds its token with base64
   JSON encoding, not encryption or a signature. The decoded body contains onboarding
   data; expiry is supplied inside that body. Redemption creates a tenant and can create
   learned rules. No one-time redemption protection is visible in this handler.
   Do not expose this as the chat handoff mechanism without redesign.
4. **Authentication return path.** `ProtectedRoute` sends unauthenticated users to
   `/login` without preserving the selected route in that component. Implement and test
   return-to-target across login and tenant selection; do not assume it already works.
5. **Portal previews.** The CIPC wizard uses sample company/financial values, placeholder
   tenant headers, generated sample document text, and an offline “completed” submission.
   General onboarding has payment-error/offline completion fallbacks. These screens
   must not establish successful filing, payment or saved service intake.
6. **Blueprint transfer is cosmetic in the inspected onboarding entry.**
   `OnboardClient.tsx` reads `blueprint_id`/`bp` and displays an attached/provisioning
   banner, but passes only service IDs into the onboarding wizard. That banner does
   not demonstrate retrieval or provisioning of a saved blueprint.
7. **Consultation receipt needs one contract.** Chat lead submission uses
   `/api/v1/advisor/lead`; the inspected public backend exposes lead submission through
   its tool dispatcher. Verify and unify the persisted lead endpoint before a handoff
   can reliably return a request reference.
8. **Offering and price catalogues differ.** Resolve product IDs, service IDs, fees,
   units and eligibility before enabling quote-to-checkout routing. A route match
   does not make the associated price authoritative.

## Proposed orchestrator registry and handoff contract

For each offering, store a canonical ID, aliases, route family, destination key,
allowed origin/path, availability (`information_only`, `assisted_intake`, or
`self_service_verified`), authentication/entitlement requirements, minimum routing
facts, destination intake requirements, and fallback action. Keep this server-owned.

The model calls `prepare_service_handoff` with an offering ID, requested action,
evidence summary and known/unknown facts. The server checks the registry and returns
either a clarification, an unavailable/assisted response, or a handoff action card.
The model never supplies an arbitrary URL, tenant permission, payable amount or filing state.

Proposed stored handoff fields:

- Opaque reference, creation/expiry time, purpose and lifecycle status.
- Confirmed offering, requested action and registry version.
- Original objective and current focus.
- User-reported facts with source turn references; assumptions and unknowns separately.
- Approved quote/assessment IDs where those records actually exist.
- Session ownership and, after login, verified user/tenant binding.
- Idempotency key and destination request/draft ID after successful consumption.

Use a short-lived random reference pointing to server-side data. Redemption requires
appropriate ownership checks and an atomic, replay-safe state transition. Retrying or
refreshing must resume the same draft, not duplicate tenants, leads or filings. Expired
references should offer a recoverable restart. Cross-tenant or wrong-user redemption
must fail. Never pass raw transcript, contact data, credentials or financial documents
in the URL. Do not install accounting rules from an advisory hypothesis.

Action card wording example:

> **CIPC annual return intake**
> Continue in AnNa to select your company and confirm the filing details.
> We will carry across your selected service and the period you supplied.
> Opening intake will not submit a return or make a payment.
> **Start annual return intake**

## Suggested implementation order

1. Approve canonical destinations and offering IDs in this map. Recommended first
   pilot: CIPC annual return, with AnNa as the candidate operational destination.
2. Replace the existing handoff token design and add the receiving route plus login
   continuation and explicit tenant selection. Keep registry entries disabled until verified.
3. Connect one authenticated app and one durable assisted-consulting intake end to end.
4. Add structured handoff results to the existing advisor API and frontend action cards.
5. Expand to expense, debtor-chase and other offerings after entitlement and intake checks.

Release tests: explicit intent versus information enquiry; ambiguous offering; new and
existing users; expired/replayed reference; wrong tenant; missing entitlement; interrupted
login; unavailable destination; duplicate click; corrected context; no simulated success;
intake completion distinct from filing/payment/booking completion.

## Source evidence

- Website: `website/src/lib/handoff-client.ts`, `website/src/lib/rates-schedule.ts`.
- Website intake: `website/src/app/portal/services/onboard/OnboardClient.tsx`,
  `website/src/components/portal/UniversalOnboardingWizard.tsx`.
- Website CIPC: `website/src/components/portal/AnnualReturnWizard.tsx`,
  `website/src/lib/portal-domain.ts`.
- Portal service overview and tax/CIPC/valuation pages under `website/src/app/portal/services/`.
- Backend checkout: `C:/Users/craig/ai-accountant-mvp`.
- App routes/auth wrappers: `frontend/src/App.tsx`; CIPC app: `frontend/src/pages/CipcAnnualReturnApp.tsx`.
- Token creation/redemption: `app/api/v1/tenants.py`.
- Public advisor and tool execution: `app/api/v1/ai_chat.py`, `app/agents/accountant_tools.py`.

No workflow implementation or deployment was performed as part of preparing this map.
