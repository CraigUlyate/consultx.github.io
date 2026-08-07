# Deploy changes to Afrihost

Deploy the ConsultX static site from this workspace straight to Afrihost (cPanel) over **SFTP** (preferred) or **FTP**.

## One-time setup

1. In Afrihost cPanel, confirm FTP/SFTP access works (same username/password as cPanel, or a dedicated FTP account).
2. Decide the remote folder:
   - Primary domain document root: usually `/public_html/` or `/home/consuvuv/public_html/`
   - Addon / ConsultX domain folder (from your File Manager): often `/consultx.co.za/` or `/home/consuvuv/consultx.co.za/`
3. Copy the env template and fill in secrets:

```powershell
cd website
Copy-Item .env.deploy.example .env.local
notepad .env.local
```

Required values:

```env
AFRIHOST_HOST=major.aserv.co.za
AFRIHOST_USER=consuvuv
AFRIHOST_PASSWORD=your-cpanel-or-ftp-password
AFRIHOST_PORT=22
AFRIHOST_PROTOCOL=sftp
AFRIHOST_REMOTE_DIR=/home/consuvuv/public_html
```

Notes:

- Host from your File Manager URL was `major.aserv.co.za` — that is a good SFTP/FTP host. `ftp.consultx.co.za` can also work.
- Prefer `sftp` on port `22`. Use `ftp` / port `21` only if SFTP is blocked.
- `.env.local` is gitignored. Never commit passwords.
- If WordPress is still in `public_html`, deploy to a staging folder first, or clear WP after backup. Uploading the static export into a live WP root will overwrite overlapping files (`index.html` vs `index.php`).

## Deploy from here

```powershell
cd website
npm run deploy
```

What this does:

1. Builds the Next.js static export into `website/out/`
2. Connects to Afrihost with your `.env.local` credentials
3. Uploads everything from `out/` into `AFRIHOST_REMOTE_DIR`

Optional clean deploy (deletes remote target contents first — use carefully):

```powershell
npm run deploy -- --clean
```

Dry run (build + list what would upload, no transfer):

```powershell
npm run deploy -- --dry-run
```

## After deploy

- Visit https://consultx.co.za/ and hard-refresh (Ctrl+F5)
- Check `/products/` for the carousel page
- If you still see the old WordPress site, the remote dir is wrong or `index.php` is still winning over `index.html` — remove/rename the old WP entry files after backup

## Cursor / agent deploy

When asking the agent to deploy changes, point it at this file. The agent should:

1. Confirm `.env.local` exists (do not print secrets)
2. Run `npm run deploy` from `website/`
3. Report success/failure and the target remote directory only
