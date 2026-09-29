# ConsultX Ask AnNa — Step 2 Implementation Plan Review

Reviewed: 23 September 2026

**The architecture is sensible, but the plan should be revised before deployment.** FastAPI, typed tool calls, deterministic pricing, and structured UI cards are good foundations. The main weaknesses are misleading fallback behaviour, pricing inconsistencies, and missing controls around state and tool execution.

The current website code was checked. The proposed backend directory was not present at the stated path, so this evaluates the plan and frontend—not an existing backend implementation.

## Priority improvements

### 1. Replace the retired model and remove the legacy SDK fallback

`gemini-2.0-flash` shut down on 1 June 2026. Choose a currently supported model, configure it through `GEMINI_MODEL`, and validate its tool-calling behaviour before deployment. Use `google-genai` only; falling back to the deprecated `google-generativeai` package adds compatibility risk without solving provider outages.

Sources: [Google model lifecycle](https://ai.google.dev/gemini-api/docs/deprecations), [deprecated SDK repository](https://github.com/google-gemini/deprecated-generative-ai-python).

### 2. Fix the fallback before connecting the backend

The current lead submission fallback in `website/src/lib/advisor-api.ts` returns `success: true`, invents a confirmation ID, and says Craig received the brief—even when delivery failed.

This is a release blocker. Only acknowledge receipt after durable backend storage. Distinguish:

- Request received.
- Notification delivered.
- Appointment booked.

Chat simulation can remain available, but visibly label it “Offline guidance.” It must never imply that a lead was saved, a booking completed, or an integration executed.

### 3. Reconcile the rates before building the Python mirror

The plan mentions R2,950 for AFS, while the current catalogue in `website/src/lib/rates-schedule.ts` lists company AFS **from R9,900** and CC AFS **from R9,500**. Resolve this discrepancy against the approved source.

Maintain one versioned catalogue consumed by both languages. Include effective dates, VAT treatment, billing units, quantities, minimum fees, and whether a price is fixed or “from.”

The existing calculator simply adds base prices. That cannot safely combine monthly subscriptions, hourly work, per-employee charges, and once-off services into one payable total. Use `Decimal` or integer cents and separate recurring from once-off amounts.

### 4. Make the pricing boundary explicit

“Calculations and VAT 100% out of prompts” conflicts with injecting the complete rates schedule into the system instruction.

Give the model service IDs, descriptions, and eligibility criteria. Let it request a quote using validated IDs and quantities. The server should calculate and persist the quote, then render its financial fields directly. Any model-written explanation must agree with that result.

“Official fixed-fee quote” should only apply when scope and eligibility are established; otherwise return an estimate requiring review.

### 5. Specify a bounded orchestration loop

“Executes tool calls emitted by Gemini” is insufficient. Define:

- An allowlist and strict argument validation.
- Maximum tool rounds, token budget, and overall deadline.
- Tool-result feedback to the model.
- Handling for unknown tools, malformed arguments, refusals, and partial failures.
- Idempotency for every operation that creates something.

Prompt mandates do not prevent hallucinations. Server-side rules must decide which actions are permitted and which results are authoritative.

### 6. Add session ownership and abuse controls

CORS restricts browser behaviour; it does not authenticate callers or prevent direct API abuse.

Support anonymous visitors with server-issued session tokens, request-size limits, rate limits, and spending limits. Require appropriate authentication before accessing customer records.

Treat browser-supplied history and profiles as untrusted. In particular, never accept a client-supplied `system` message as an instruction. Persist authoritative conversation state and use turn IDs to handle retries and concurrent requests.

There is also a contract ambiguity: the frontend currently sends the latest user message both inside `history` and separately as `message`. Define one canonical representation.

### 7. Separate advisory outputs from operational integrations

The listed tools generate briefs and cards. They do not implement WhatsApp ingestion, Xero posting, or calendar booking.

For Step 2, explicitly scope the service to **diagnosis, estimates, valuation scoping, and durable consultation requests**. Actual booking requires availability checks, a calendar integration, and confirmed booking identifiers. Accounting execution requires its own permissions and approval workflow.

Describe AnNa as ConsultX’s AI assistant supported by Craig Ulyate, CA(SA). Avoid implying the AI itself holds that qualification.

### 8. Complete the deployment and data design

Add dependency locking, configuration validation, `.dockerignore`, database migrations, a restricted service account, Secret Manager integration, connection pooling, structured redacted logs, and rollback instructions. Bound Cloud Run scaling so database connections remain within capacity. See [Cloud Run–Postgres guidance](https://docs.cloud.google.com/sql/docs/postgres/connect-run).

Clarify whether Gemini uses the Developer API or Vertex AI; an API key and a GCP project name do not fully define that choice.

Assess hosting and model processing locations together. Choosing `europe-west1` requires considering POPIA’s cross-border transfer requirements; document retention, deletion, and provider handling as well. See [POPIA, section 72](https://www.justice.gov.za/legislation/acts/2013-004.pdf).

## Improved verification plan

The WhatsApp-to-Xero prompt is a useful smoke test, but it cannot establish production readiness. Add tests covering:

| Area | Required outcome |
|---|---|
| Pricing | Correct quantities, billing periods, rounding, catalogue version, and unknown-ID rejection |
| Conversation | Corrections, track switching, missing information, and non-repeated questions |
| Tool safety | Invalid arguments, injected instructions, tool failures, and loop limits |
| Reliability | Timeouts, provider throttling, database failure, and duplicate requests |
| Leads | No false confirmation; retries create one durable request |
| Contracts | Every response validates and renders correctly in the website |

`sourceChannel` and `destinationLedger` are not currently explicit fields in the public blueprint/profile interfaces. Add them if they are intended as structured assertions.

The current chat retry loop can take roughly **122 seconds** before falling back, and its catch block also retries non-transient errors. Introduce an overall deadline and selective retries.

The website uses static export, so changing `NEXT_PUBLIC_ADVISOR_API_URL` requires **rebuilding and uploading the exported website**, not just editing `.env.local`. See [Next.js environment-variable documentation](https://nextjs.org/docs/app/guides/environment-variables).

## Recommended implementation sequence

1. Fix frontend truthfulness and contracts.
2. Approve the shared catalogue.
3. Build deterministic tools and persistence.
4. Add bounded Gemini orchestration.
5. Validate in staging.
6. Deploy and rebuild the website.
