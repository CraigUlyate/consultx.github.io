# Database migrations

The initial production schema is in `database/migrations/001_portal_foundation.sql`.

Use Azure Database for PostgreSQL Flexible Server. Apply migrations from a controlled CI/CD identity, not from the portal browser or a developer laptop. Production migrations must be backed up, reviewed and recorded in the deployment runbook.

The application must scope all reads and writes to the authenticated user's organisation membership. The database schema deliberately records evidence separately from extracted candidate values, client confirmations, authorisations and payment events.
