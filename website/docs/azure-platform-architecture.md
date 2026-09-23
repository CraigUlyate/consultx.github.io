# ConsultX client platform — Azure architecture

## Decision

The production client portal will run on Azure. It uses three distinct layers for document-enabled CIPC workflows:

1. **Azure AI Document Intelligence** extracts text, tables, fields and layout from CIPC disclosures, AFS and FAS documents.
2. **Deterministic ConsultX rules** validate required information, calculate fee estimates and decide whether the job is ready for review. This is the authoritative layer.
3. **Microsoft Foundry** interprets extracted content only to map non-standard wording, explain missing information and produce client-friendly guidance. It may not make an unreviewed filing decision or alter authoritative values.

## Target services

| Concern | Azure service | Purpose |
| --- | --- | --- |
| Portal and API | Azure Container Apps | Next.js application, REST endpoints and admin portal |
| Identity | Microsoft Entra External ID | Client login, MFA, organisation membership and roles |
| Business data | Azure Database for PostgreSQL | Organisations, companies, jobs, orders, payments and audit events |
| Files | Azure Blob Storage | Private original documents, extracted artifacts and certificates |
| Document extraction | Azure AI Document Intelligence | OCR, tables, layout and candidate fields |
| AI interpretation | Microsoft Foundry | Bounded JSON mapping, confidence explanation and missing-data questions |
| Work queue | Azure Service Bus | Durable extraction, notification and filing jobs |
| Workers | Azure Container Apps Jobs | Extraction, reminder and filing workers outside web requests |
| Scheduled reminders | Azure Functions timer trigger | Annual reminder and retry scheduling |
| Payments | Paystack | Checkout and server-to-server payment webhook |
| Secrets | Azure Key Vault | Paystack secret, mail credentials and future approved CIPC integration credentials |
| Observability | Application Insights / Azure Monitor | Errors, performance, security events and operational alerts |

## Core data flow

```text
Client uploads document
  -> Blob Storage (private, encrypted)
  -> Service Bus: extract-document
  -> Container Apps Job: Document Intelligence
  -> PostgreSQL: extracted values + source page + confidence
  -> deterministic CIPC rules
  -> Foundry: explanation and missing-information questions
  -> client reviews and confirms each required value
  -> payment and authority captured
  -> Service Bus: filing-ready
  -> ConsultX admin review / approved CIPC connector
```

## Trust boundaries

- The browser sends documents directly to a short-lived, scoped Blob Storage upload URL. It never receives storage account credentials.
- Original files are immutable. Extracted values are stored separately with their source document/page and confidence.
- Foundry receives only the minimum extracted text/fields needed for the specific task. Do not provide credentials, payment data or unrelated client records.
- Deterministic rules, not an LLM, decide mandatory information, workflow status and CIPC fee estimate.
- A client authorisation snapshot is retained before a filing job is created.
- CIPC login credentials are never collected in the portal. Filing remains human-assisted until written permission or an official Filing API is available.

## Data residency and privacy gate

Before production activation, confirm the selected Azure region and the availability of the exact Document Intelligence and Foundry models required. Configure a regional Foundry deployment where available. If a feature requires processing outside South Africa, record that data flow in the privacy notice and obtain legal/privacy approval before sending client documents to it.

## Delivery order

1. Provision isolated Azure development, staging and production environments.
2. Add Entra authentication, PostgreSQL entities and role-based access.
3. Implement private Blob uploads and an auditable document record.
4. Add Document Intelligence extraction and editable review of candidate fields.
5. Implement and test the deterministic CIPC rules engine against approved examples.
6. Add Foundry strictly for structured mapping and user guidance, with logging and output validation.
7. Add Paystack checkout/webhook and immutable payment/authority records.
8. Build the ConsultX review queue and manual filing process.
9. Add annual reminder scheduling and secure expiring action links.
