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
