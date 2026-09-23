# Delivery roadmap

## Product principle

Launch value before automating the last filing step. The portal should make
intake, validation, authorisation, payment, status, and document delivery better
even while a ConsultX reviewer completes the statutory submission manually.

## Phase 0 — Decisions and service design

- Confirm the first annual-return service, pricing, statutory-fee treatment, and
  service-level expectations.
- Map the precise information, declarations, evidence and exception paths used by
  ConsultX reviewers.
- Obtain legal/privacy review and written CIPC guidance before any browser
  automation is developed or commercialised.
- Define success measures: completion rate, turnaround time, review effort,
  payment conversion, filing errors and support volume.

**Exit:** approved service blueprint, data inventory and risk register.

## Phase 1 — Platform foundation

- Set up `app.consultx.co.za` separately from WordPress.
- Implement managed sign-in, MFA, organisations, members, roles and companies.
- Build the shared service, order, job, workflow-event and audit-event models.
- Add an admin workspace and least-privilege access controls.

**Exit:** invited pilot users can securely access the correct organisation and
company records.

## Phase 2 — Annual-return assisted workflow

- Add company selection, structured intake and conditional questions.
- Provide evidence upload, completeness validation and reviewer feedback.
- Capture a versioned client mandate and immutable input snapshot.
- Add a manual filing queue, dual-check submission step, status history and result
  certificate delivery.

**Exit:** ConsultX can deliver the complete service through the portal without a
browser robot.

## Phase 3 — Commerce and communications

- Separate ConsultX service fees from CIPC statutory fees on quotes and receipts.
- Add Paystack intents and signature-verified, idempotent webhooks.
- Add email notifications for required information, approval, payment, filing,
  completion and exceptions.

**Exit:** payment and communication events reliably drive the workflow.

## Phase 4 — Official data and connector layer

- Integrate approved CIPC company lookup/retrieval behind a versioned adapter.
- Reconcile external data rather than silently overwriting client assertions.
- Implement connector monitoring, retry policies, idempotency and a manual
  fallback.
- Prefer the official Filing API when it becomes available. Only create an
  interim browser connector after written permission and a security review.

**Exit:** company verification and filing are production-supported integrations,
not assumptions embedded in UI code.

## Phase 5 — Portfolio expansion

Add Beneficial Ownership, XBRL, AnNa Expense, company changes and other services
as new service definitions and connectors on the same platform foundation.

## Immediate backlog

1. Validate the workspace prototype with direct companies and accounting firms.
2. Produce the annual-return question tree and reviewer checklist.
3. Decide hosting region, identity provider, database and object storage.
4. Complete the privacy impact assessment and retention schedule.
5. Request CIPC integration guidance and API access information.
6. Convert the agreed prototype into the authenticated application.

## Explicitly out of scope for the prototype

Authentication, personal data, file uploads, live payments, CIPC calls and filing
automation are intentionally absent. Their presence in a visual mock-up must not
be mistaken for a production control.
