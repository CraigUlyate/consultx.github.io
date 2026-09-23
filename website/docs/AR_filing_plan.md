# CIPC Annual Return filing plan

## Objective

Create a secure ConsultX workflow that collects and validates annual-return information, accepts payment and authority, then submits an authorised filing through a controlled CIPC connector. The connector must be replaceable with the official CIPC Filing API when available.

## Principles

- ConsultX is an authorised filing agent, not CIPC. Each filing needs company-specific client authority and final approval.
- Client-provided data remains the client’s responsibility unless a separately agreed ConsultX review/completion service applies.
- Do not store client CIPC passwords. The ConsultX CIPC customer credential is held only in Azure Key Vault.
- Extracted values are suggestions. Deterministic rules and client confirmation decide readiness, fees and submission data.
- The connector only enters approved, client-provided data. It does not search, scrape, bypass CAPTCHA/MFA, or re-submit an uncertain filing.

## Architecture

```text
Client portal (Entra External ID)
  -> PostgreSQL: company, job, mandate, authority, payment and audit data
  -> Blob Storage: private originals and certificates
  -> Service Bus: extract-document / filing-ready / reminders
  -> workers: Document Intelligence + deterministic rules + Foundry mapping
  -> Paystack: verified payment webhook
  -> filing adapter: private browser VM -> CIPC -> receipt/certificate
```

The filing adapter runs on a dedicated private Azure VM, rather than a short-lived container job, so an authenticated headed Chromium session can persist while an operator uses Azure Bastion to complete login and CAPTCHA. The worker has a feature flag and begins in supervised mode. A changed CIPC screen, MFA/CAPTCHA, missing mandate, payment mismatch, or ambiguous result creates an operations task instead of continuing.

## Delivery phases

### 0. CIPC browser proof of concept — required gate

Before building the production browser adapter, demonstrate the following in a controlled cloud browser with an authorised account and only an appropriate real/test filing:

1. An operator opens the remote Chromium session and personally completes CIPC login, CAPTCHA and any required terms acceptance.
2. Playwright detects the authenticated state and can continue navigation without handling CAPTCHA.
3. The operator can close the remote viewer while the cloud browser process remains alive and authenticated.
4. Two enterprise annual-return journeys can be navigated sequentially in the same authenticated session.
5. Session expiry, an unexpected page, connection loss and an ambiguous result safely pause the queue without duplicate submission.

Record a workflow map for every CIPC screen: expected page, input/action, source of data, whether it is automatable, whether a human is required and safe recovery behaviour. Proceed to browser automation only when these tests, CIPC process confirmation and a review of unit economics have passed.

### 1. Authority, audit and client terms

1. Client sign-in and organisation/company membership.
2. Company-specific mandate declaration and final filing approval.
3. Versioned terms acceptance, immutable input snapshot and workflow event log.
4. Clear separation of client self-service and separately instructed ConsultX-assisted work.

### 2. Intake and readiness

1. Manual company, turnover, financial year-end and beneficial-ownership fields.
2. Private document uploads for CIPC disclosures, AFS and FAS.
3. Document Intelligence extraction with field confidence and page evidence.
4. Client correction/confirmation of candidate values.
5. Deterministic readiness and fee calculation.

### 3. Payment and operations

1. Paystack checkout for the ConsultX charge and stated CIPC amount.
2. Webhook-only payment confirmation and reconciliation.
3. Staff queue for review, exceptions, manual completion and filing evidence.

### 4. Controlled CIPC connector

1. A queue-driven, idempotent filing job with a single job/attempt identifier.
2. Retrieve the ConsultX credential only at run time through managed identity and Key Vault.
3. Record non-secret submission evidence, receipt/certificate and result state.
4. Do not automate through CIPC MFA/CAPTCHA or retry after an unclear CIPC result.
5. Enable only approved filing scenarios; use the staff process for all exceptions.

The client portal hands this adapter a versioned, immutable **Filing Package** containing company details, return period, approved turnover/financial information, BO status, client authority snapshot, payment status and expected CIPC fee. The adapter must expose a provider-neutral `submitAnnualReturn(filingPackage)` interface so an official CIPC Filing API can replace the browser adapter later.

### CAPTCHA-controlled cloud filing sessions

1. Paid, authorised jobs enter `ready_to_file`; they do not log in to CIPC automatically.
2. A scheduled cloud worker batches ready jobs and sends the designated ConsultX operator an email/app notification (for example, once daily).
3. The operator opens a protected cloud browser session and personally completes the CIPC login and CAPTCHA. ConsultX never stores CAPTCHA answers or tries to solve/bypass them.
4. The session is marked active only after the operator confirms successful CIPC login. The worker may then enter the selected, previously approved job data while the session is open.
5. A session expires after a short idle period, is fully audited, and never exposes the CIPC password to clients. Any CIPC screen change, MFA, ambiguous result or payment issue pauses the job for operator review.
6. This remains feature-flagged until ConsultX has completed the CIPC approval/process confirmation.

### On-demand browser-worker provisioning and cost controls

1. The headed Playwright/Chromium VM is **not** an always-on service. It is deallocated by default, so Azure compute charges stop between filing batches.
2. A daily scheduled serverless task checks for paid, authorised `ready_to_file` jobs. If there are no jobs, it exits without starting the VM.
3. If jobs exist, the task starts the browser VM, records a provisioning event, and notifies the designated ConsultX operator that CAPTCHA login is required.
4. The operator connects through the approved protected access path, completes CIPC login/CAPTCHA personally, and explicitly activates the filing session.
5. The worker processes the selected batch only while that session heartbeat is active. It stops on an unclear result, CIPC screen change, session expiry, or idle timeout.
6. When the batch is complete, empty, stopped, or idle for the configured period, the worker writes its audit state and deallocates the VM. A scheduled end-of-day deallocation is the fallback safety control.
7. Use a 4 GiB burstable VM for the headed browser; 1 GiB sizes are not accepted for production/P0C browser sessions. The monthly VM price shown by Azure is a 24/7 estimate, not the intended operating model.
8. Use free Azure Bastion Developer for development/testing where it is available. It is available and provisioned in South Africa North for the ConsultX development environment. Do not retain a continuously billed Bastion SKU merely for occasional filing sessions; production remote-access cost must be explicitly approved before activation.

### Filing-centre operating model

- The internal Filing Centre shows queue size, active CIPC session, processed/remaining jobs and intervention tasks.
- Default queue order is FIFO, with explicit priority, manual hold and batch-selection controls.
- Filing and session state machines are distinct. A filing may be `ready_for_cipc`, `queued`, `processing`, `filed`, `needs_human`, `reconciliation_required` or `failed`; a session may be `authentication_required`, `authenticated`, `processing`, `session_expired` or `stopped`.
- Before each submission, lock the filing, check that it is not already filed/processing and never resubmit automatically after an uncertain CIPC response.
- Capture an error screenshot and minimal page metadata where permitted; avoid retaining CAPTCHA images unnecessarily.

### 5. Future returns

1. Consent-based annual reminders using signed, expiring links.
2. Pre-fill prior confirmed details; ask the client to confirm turnover, changes, payment and authority.
3. Send the renewed filing through the same validation, payment and filing controls.

## Azure responsibilities

| Component | Azure service |
| --- | --- |
| Portal/API and workers | Azure Container Apps |
| Supervised CIPC browser | Private Azure Linux VM, Playwright/Chromium and Azure Bastion |
| Daily queue check / VM lifecycle | Scheduled Azure Function or Container Apps Job with a managed identity scoped to start/deallocate only the browser VM |
| Identity | Entra External ID |
| Data | Azure Database for PostgreSQL |
| Original documents/certificates | Private Blob Storage |
| Extraction | Azure AI Document Intelligence |
| Limited mapping/explanations | Microsoft Foundry |
| Durable work | Service Bus |
| Secrets | Key Vault + managed identities |
| Monitoring | Application Insights + Log Analytics |

## Activation gate

The client portal, validation, payment and staff-operated filing flow can be activated independently. Automated CIPC submission remains feature-flagged until ConsultX has completed its direct CIPC process confirmation and operating procedure. Activation also requires a tested on-demand VM lifecycle: no queued jobs must leave the VM deallocated; a queued batch must start it and notify the operator; completed, idle, and failed batches must deallocate it safely.
