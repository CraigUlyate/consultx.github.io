# Security and compliance decisions

This platform will process company, identity, financial and statutory filing
information. Security and privacy are release criteria, not future enhancements.

## Required controls

- Managed identity, MFA for privileged users, secure password reset and session
  revocation.
- Tenant isolation enforced in server-side access checks and database policies;
  hiding navigation is not access control.
- Least-privilege roles and company-level access for accounting practices.
- Encryption in transit and at rest, managed secrets and regular key rotation.
- Private document storage, malware scanning, file-type/size controls and expiring
  download links.
- Append-only audit events for access, data changes, authorisation, payment,
  submission and privileged administration.
- Versioned client mandates that preserve the exact information authorised.
- Retention and deletion rules by record type, with legal holds where required.
- Tested backups, restore exercises, incident response and breach procedures.
- Supplier review and data-processing agreements for identity, hosting, payments,
  communications, storage and integrations.

## Integration safeguards

Do not store CIPC or payment credentials in browser storage, logs or ordinary
database columns. Payment state changes only after server-side webhook signature
verification and reconciliation. Statutory submission requires explicit states,
idempotency protection and a final reviewer/client control appropriate to risk.

Browser automation is not a default integration strategy. Before implementation,
ConsultX must obtain written CIPC clarification/permission, review the applicable
terms, document credential and OTP handling, and agree on outage and duplicate-
submission controls. The manual connector remains a supported fallback.

## Governance work before production

Complete a POPIA-focused privacy impact assessment with qualified South African
legal/privacy review. Document the lawful purpose for each field, disclosures,
data-subject request process, operator relationships, cross-border transfers,
retention schedule and incident reporting responsibilities.

This document is an engineering baseline, not legal advice.
