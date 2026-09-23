# Domain and deployment setup

`app.consultx.co.za` is a subdomain of the existing domain, not a second domain
registration. It can point to infrastructure that is independent of the current
WordPress host.

## Proposed routing

| Host | Responsibility | Deployment |
| --- | --- | --- |
| `www.consultx.co.za` | Marketing website | Existing WordPress hosting |
| `app.consultx.co.za` | Client and admin application | Separate application host |

## Setup sequence

1. Select the application host and add `app.consultx.co.za` as a custom domain.
2. Add the CNAME or A/ALIAS record supplied by that host in the authoritative DNS
   zone for `consultx.co.za`.
3. Verify domain ownership and TLS certificate issuance with the application host.
4. Enforce HTTPS and add HSTS only after every required subdomain is HTTPS-ready.
5. Configure `www` calls to action to use the final `https://app.consultx.co.za`
   routes.
6. Keep preview/staging deployments off the production domain and protect them
   with access controls.
7. Configure monitoring for DNS, TLS expiry, application availability and key
   user journeys.

Do not publish speculative DNS values: the exact record target is supplied by the
chosen application host. DNS is normally inexpensive, but hosting, storage,
database, email and integration usage may incur separate costs.

## Environments

Use separate projects and credentials for development, staging and production.
Production data must never be copied to preview deployments. Infrastructure
configuration and database migrations should be version-controlled and reviewed.
