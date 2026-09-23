<<<<<<< ours
# ConsultX website

Canonical source for the ConsultX website and web apps: https://consultx.co.za/

**Repository:** https://github.com/CraigUlyate/consultx.github.io

The live site is a static Next.js export hosted on Afrihost. Pushing to GitHub stores the source; it does **not** publish the site. Publish with the deploy script in `website/`.

| Path | Purpose |
| --- | --- |
| `website/` | Next.js app — day-to-day work happens here |
| `DEVELOPER_INSTRUCTIONS.md` | How to clone, update, preview, and publish |
| `deploy_changes.md` | Afrihost SFTP/FTP deploy details |
| `Examples/` | Design references only |

```powershell
git clone https://github.com/CraigUlyate/consultx.github.io.git
cd consultx.github.io/website
npm install
npm run dev
```

Full setup, content-update, and publish steps: [DEVELOPER_INSTRUCTIONS.md](./DEVELOPER_INSTRUCTIONS.md).
=======
# ConsultX client platform

This repository contains the first, static workspace prototype for the proposed
ConsultX client-services platform at `app.consultx.co.za`.

## What is included

- A responsive client dashboard shell with company, service, document, payment,
  and activity areas.
- A first-product call to action for CIPC annual returns.
- Architecture and delivery documentation for evolving the prototype into a
  secure, multi-tenant application.

## Run locally

No build step is required for the prototype:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Project documentation

- [Platform architecture](docs/architecture.md)
- [Delivery roadmap](docs/roadmap.md)
- [Domain and deployment setup](docs/domain-and-deployment.md)
- [Security and compliance decisions](docs/security-and-compliance.md)

The browser prototype uses sample data only. It does not provide authentication,
payments, document storage, or a CIPC integration.
>>>>>>> theirs
