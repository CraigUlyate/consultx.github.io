# ConsultX Azure client portal

This is the server-hosted application for `app.consultx.co.za`. It is intentionally separate from the static marketing site in the parent `website/` folder.

## Runtime configuration

The Container App receives these values as secrets or environment variables:

- `AUTH_SECRET` — Key Vault reference.
- `ENTRA_TENANT_ID`, `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET` — Entra OIDC configuration; the client secret is a Key Vault reference.
- `DATABASE_URL` — Key Vault reference. The database is accessible only through the Azure private network.

The development Entra registration has only a localhost callback. Add the production callback `https://app.consultx.co.za/api/auth/callback/microsoft-entra-id` before enabling the production app.

## Commands

```powershell
npm install
npm run dev
npm run typecheck
npm run build
```

Run database migrations from a controlled job inside the Azure private network, never from the browser or a public workstation.
