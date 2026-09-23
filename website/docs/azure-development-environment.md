# Azure development environment

The ConsultX development environment is deployed in `South Africa North` under `rg-consultx-dev`.

## Resources

| Resource | Purpose |
| --- | --- |
| `stconsultxdev0dbaa65b` | Private Blob Storage; `documents` container |
| `kv-consultx-dev-0dbaa65b` | Runtime secrets and generated database credential |
| `log-consultx-dev` | Central logs |
| `appi-consultx-dev` | Portal and worker telemetry |
| `sb-consultx-dev-0dbaa65b` | Extraction, notification, filing and reminder queues |
| `di-consultx-dev-0dbaa65b` | Azure AI Document Intelligence |
| `foundry-consultx-dev-0dbaa65b` | Microsoft Foundry resource |
| `pg-consultx-dev-0dbaa65b` | Private Azure Database for PostgreSQL Flexible Server |

## Security rules

- Use managed identities for Container Apps and Functions.
- Grant each identity only the data-plane roles it needs: Blob contributor, Service Bus sender/receiver, Key Vault secrets user and database access.
- Use short-lived Blob upload/download URLs. Do not serve documents publicly.
- Keep Azure resource keys, Paystack credentials and the database administrator password in Key Vault only.
- Configure Entra External ID before allowing client access to the portal.
- Create an Azure Container Apps environment after the server-side portal implementation is ready; attach it to Application Insights and assign it a managed identity.
