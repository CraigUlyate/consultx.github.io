Filing a statutory return should not mean moving data through email, spreadsheets and a sequence of disconnected handovers.

That was the starting point for our CIPC annual-return workflow: give customers a clear way to prepare and authorise a filing, while giving the ConsultX team a controlled, auditable process to review, submit and track it.

We built the platform on Microsoft Azure because it gives us a practical foundation for handling sensitive documents, structured workflow data and background processing without putting those concerns in the customer’s browser or a collection of manual inboxes.

The result is not a “black box” that files on a company’s behalf without oversight. It is a secure, human-in-the-loop workflow that automates the repetitive preparation and coordination work, preserves controls and brings people in where judgement or a CIPC security step is required.

## The problem we set out to solve

An annual return is a familiar compliance task, but the work around it is often more difficult than it needs to be. Information may be incomplete, supporting documents may arrive in different formats, authorisation needs to be evidenced, and the person doing the filing must be certain they are working from the approved version.

That creates predictable risks:

- incomplete information reaching the filing stage
- unclear customer approval
- rekeying and avoidable follow-up
- weak visibility over which returns are ready, in progress or exceptional
- difficulty reconstructing what was submitted later

The platform separates the customer’s preparation journey from the operational filing journey. Customers provide and confirm the required information. The system checks readiness. An authorised filing package enters a managed queue. ConsultX can then review the job, perform the approved filing step and return the confirmation to the customer.

## How the workflow works

At a high level, the process is intentionally simple:

1. A customer adds a company and provides or confirms annual-return information.
2. Documents are uploaded securely and relevant information is extracted for review.
3. Deterministic rules identify missing information and assess whether the filing is ready.
4. The customer reviews the filing summary and explicitly authorises submission.
5. The approved filing enters a controlled queue for ConsultX.
6. The filing is processed through the appropriate approved CIPC route, with human intervention for authentication, review and genuine exceptions.
7. The filing reference and confirmation are retained and made available to the customer.

The important design choice is that the workflow does not treat every task as equally automatable. Repetitive capture, validation, routing and status updates are good candidates for automation. Customer confirmations, exceptions and security challenges remain visible to a person who is accountable for the decision.

## The Azure foundation

Azure lets us keep each responsibility in the right place rather than building one large application that tries to do everything.

- **Azure Container Apps** host the portal, API and background worker workloads.
- **Microsoft Entra External ID** manages client identity, roles and multi-factor authentication.
- **Azure Database for PostgreSQL** holds the operational record: companies, filing packages, status history, approvals and audit events.
- **Azure Blob Storage** retains original documents and confirmations privately and separately from extracted values.
- **Azure AI Document Intelligence** extracts candidate fields, tables and layout from supporting documents.
- **Azure Service Bus** provides a durable queue for work such as extraction, reminders and filing preparation.
- **Azure Key Vault** protects application secrets and approved integration credentials.
- **Application Insights and Azure Monitor** provide the operational visibility needed to identify failures, performance issues and unusual activity.

This is not technology for technology’s sake. Each component addresses a real workflow requirement: reliable background work, controlled access, durable records, private files and a traceable operational history.

## AI assists; rules and people remain in control

Document AI is useful when documents are variable and customers should not have to retype information that already exists in a disclosure or financial document. But extraction is not the same thing as authority.

In our platform, extracted values are candidates. They carry source and confidence information, and they can be reviewed and corrected. Deterministic rules—not an AI model—decide what is required, whether a filing can progress and how a fee estimate is calculated. AI can help map non-standard wording and explain what is missing in plain language; it does not silently change authoritative values or make an unreviewed filing decision.

That division is especially important in compliance workflows. It combines the speed of modern document processing with the control expected from a professional filing process.

## Security is built into the flow

Good automation does not mean simply collecting more data. It means minimising exposure and making every important action accountable.

For example, documents are uploaded directly to short-lived, scoped storage locations rather than through an open file store. The customer’s browser does not receive cloud-storage credentials. Original documents remain separate from extracted data. Role-based access restricts who can see and act on a filing, and every meaningful transition—from customer confirmation to operational review—is recorded.

Before a filing job is created, the platform retains an authorisation snapshot: the filing version, confirmation wording, user, time and the information presented for approval. That gives both the customer and ConsultX a clear record of the basis on which a submission was made.

We also deliberately avoid using the customer portal to collect CIPC login credentials. Any production filing integration must follow CIPC’s current rules and approved access methods. The solution is designed so that a human can handle required authentication or other security checkpoints, while the system manages the prepared work, queue and audit trail around that interaction.

## Automation with a human safety net

Where an approved browser-based process is used, the automation worker is designed as a controlled adapter—not as a collection of fragile clicks buried inside the main application.

It validates the expected state before important actions, records checkpoints, captures evidence on exceptions and avoids blind retries when a submission outcome is uncertain. If a session expires, an unexpected validation message appears, or a human security challenge is presented, the job moves into a clear “needs attention” state rather than guessing its way forward.

This protects against one of the biggest risks in statutory workflows: duplicate or ambiguous submissions. A filing that cannot be confidently reconciled is held for review, not automatically submitted again.

## The result

We have turned an admin-intensive and often painful process for accountants and business owners into a structured, guided workflow. Rather than chasing documents, rekeying information and repeatedly checking where a return stands, users can prepare the filing once, confirm it and follow its progress from one place.

For straightforward, qualifying annual returns, the workflow is designed to reduce the administrative time involved by approximately **10x**. The purpose is not to remove accountability from the process. It is to remove the repeated coordination and data-handling work that makes a necessary compliance task take longer than it should.

We plan to price the service at **R195 including VAT**. That puts it at more than three times less than the cost of many comparable filing services, while still providing customers with a clear status view, a secure approval record and support when an exception needs attention.

## A pattern that transfers to customer environments

The CIPC tool is a specific use case, but the underlying architecture is reusable.

Many customer processes have the same shape:

- a document or request arrives from outside the business
- information needs to be extracted and validated
- a rules-based decision determines the next step
- a customer or internal owner must approve a material action
- background work must run reliably, not only while someone has a browser open
- exceptions need a clear route back to a person
- the business needs an audit trail at the end

That could apply to onboarding, finance-document intake, account-opening packs, recurring compliance reviews, supplier setup, tender qualification or reporting workflows. The exact forms and rules change, but the operating pattern does not.

Because the solution is built from modular Azure services, a customer environment can be scoped around the actual process rather than forced into a generic “automation platform.” For some customers that may mean a focused workflow delivered inside their existing Microsoft environment. For others, it may mean an isolated, client-specific deployment with their own identity controls, storage boundaries and approved AI services.

## Start with a useful process, then scale

The most effective automation programmes usually begin with one rules-heavy, repetitive process where the team already understands the exceptions. Build the controlled workflow, measure the result, strengthen the edge cases and then extend the pattern.

That is the approach behind our CIPC filing tool. It reduces the administrative friction around a necessary compliance process while preserving customer authority, operational oversight and security. More importantly, it demonstrates how quickly a well-designed automation can become useful when it is built around a real process—not just an exciting technology.

If you have a document-heavy or compliance workflow that is slowing your team down, [ConsultX workflow automation](/products/workflow-automation/) can help you identify the right first use case and build it securely in your environment.
