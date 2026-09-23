# ConsultX platform architecture

## Decision

Keep the public WordPress site and the application separate:

```text
www.consultx.co.za             app.consultx.co.za
Marketing and lead generation Client services application
            \                 /
             ConsultX brand and product catalogue
```

The marketing site explains and sells services. Calls to action such as **Client
login** and **Start filing** lead to the application. This preserves the current
site while the platform is built independently.

## Platform boundaries

```text
Client portal / ConsultX admin
  ├── Identity, MFA, sessions and roles
  ├── Organisations and organisation members
  ├── Companies
  ├── Product catalogue
  ├── Orders, payments and receipts
  ├── Jobs and workflow events
  ├── Documents
  ├── Authorisations and audit events
  └── Notifications
             │
             ├── CIPC filing connector
             ├── AnNa Expense connector
             ├── XBRL connector
             └── Future service connectors
```

Connectors must be replaceable adapters. The core application asks a connector
to perform an operation; it must not depend on whether that operation is manual,
API-driven, or completed by approved browser automation.

## Workspace information architecture

The initial workspace is organised around tasks a client understands:

| Area | Purpose |
| --- | --- |
| Overview | Deadlines, compliance summary, active work and next actions |
| Companies | Entity profiles, registrations and compliance position |
| Services | Available ConsultX products and existing engagements |
| Documents | Secure files grouped by company and service job |
| Orders & payments | Quotes, statutory fees, service fees and receipts |
| Activity | User-visible status history and audit-friendly events |
| Organisation | Members, roles, company access and preferences |

An accounting practice is an organisation with many client companies. A direct
business customer may be an organisation with one company. This avoids creating
separate account models for the two customer types.

## Generic service and job model

Every product uses the same commercial and workflow foundation:

```text
Service definition → Order → Payment → Job → Workflow events → Result documents
```

A job records the organisation, company, service type, current workflow state,
responsible users, input snapshot, authorisation, timestamps, integration
references, result documents, and errors. Product-specific data can extend this
model without bypassing it.

The initial annual-return workflow is:

```text
Information required
  → Ready for review
  → Client authorisation
  → Payment confirmed
  → Ready to file
  → Filing in progress
  → Completed | Needs attention
```

Transitions are explicit, permission-checked and written to an append-only audit
history. Submission must use an idempotency key so retries cannot silently create
duplicate statutory transactions.

## Target technical shape

- **Web:** Next.js with TypeScript, server-rendered where useful.
- **Data:** managed PostgreSQL with row-level tenant controls.
- **Identity:** managed authentication with MFA and short-lived sessions.
- **Files:** private object storage accessed through expiring signed links.
- **Payments:** Paystack payment intents and verified webhooks; a redirect is not
  proof of payment.
- **Workers:** a queue-backed service for long-running integrations and document
  processing.
- **Observability:** structured logs, job metrics, alerts and immutable audit
  events with secrets and personal information redacted.

The static files in this repository are an interaction prototype, not the target
production stack.
