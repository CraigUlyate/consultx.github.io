# ConsultX website — developer instructions

Use this file to update the ConsultX site and publish those updates to https://consultx.co.za/.

**Canonical repository:** https://github.com/CraigUlyate/consultx.github.io

The live site is a **static Next.js export** hosted on **Afrihost** (cPanel). You do not edit files on the server by hand. You change the project locally, preview it, then run the deploy script. That script builds the site and uploads `website/out/` to `/public_html`.

Pushing to GitHub stores the source. It does **not** update the live site. After you push, still run `npm run deploy` from `website/` to publish.

---

## 1. What you need

- **Node.js 20+** and **npm** (comes with Node)
- **Git**
- A clone of https://github.com/CraigUlyate/consultx.github.io
- Afrihost FTP credentials from the site owner (never commit these)

On Windows, use **PowerShell**. Combine commands with `;` not `&&`.

### Clone the repo (new machine)

```powershell
git clone https://github.com/CraigUlyate/consultx.github.io.git
cd consultx.github.io
```

The default branch is `master`. The GitHub remote is `origin`.

---

## 2. Project layout

| Path | What it is |
| --- | --- |
| `website/` | The Next.js app. All day-to-day work happens here. |
| `website/src/app/` | Pages: home, about, contact, blog, services, products |
| `website/src/data/` | Lists and metadata (blog posts, services, products) |
| `website/content/blog/` | Blog article markdown (`{slug}.md`) |
| `website/content/services/` | Service page markdown (`{slug}.md`) |
| `website/public/` | Images, videos, `.htaccess`, contact PHP handler |
| `website/scripts/deploy.mjs` | Build + upload to Afrihost |
| `website/.env.local` | FTP secrets (local only, never commit) |
| `Examples/` | Design references only — not part of the live site |

Live URL: https://consultx.co.za/

---

## 3. First-time setup

```powershell
cd website
npm install
Copy-Item .env.deploy.example .env.local
notepad .env.local
```

Fill in `.env.local` with the values the owner gives you. Typical working values:

```env
AFRIHOST_HOST=major.aserv.co.za
AFRIHOST_USER=consuvuv
AFRIHOST_PASSWORD=the-password-you-were-given
AFRIHOST_PORT=21
AFRIHOST_PROTOCOL=ftp
AFRIHOST_REMOTE_DIR=/public_html
```

Rules:

- `.env.local` is ignored by git. **Never commit passwords.**
- Afrihost FTP is chrooted to the account home. Use `/public_html` — not `/home/consuvuv/...`.
- `/public_html` is the live site. `/consultx.co.za` is a different folder and is **not** the homepage.
- Prefer `ftp` on port `21`. Use `sftp` / port `22` only if that is what you have been given.

---

## 4. Preview locally before you publish

```powershell
cd website
npm run dev
```

Open http://localhost:3000/

Check every page your change touches, not only the one you edited. Typical routes:

- `/` home
- `/about/`
- `/contact/`
- `/services/` and `/services/{slug}/`
- `/products/` and product sub-pages
- `/blog/` and `/blog/{slug}/`

Stop when you are happy with the result, then deploy.

---

## 5. How to make common updates

### Blog article (existing published post)

1. Edit `website/content/blog/{slug}.md`.
2. If the title, excerpt, date, tags or cover image change, also update the matching entry in `website/src/data/blog.ts`.
3. Put new images in `website/public/blog/{slug}/` and reference them as `/blog/{slug}/filename.webp`.

A post is only published if it has a `coverImage` in `blog.ts`. Entries without a cover stay listed as coming soon and are not built as pages.

### New blog article

1. Add a markdown file: `website/content/blog/{slug}.md`.
2. Add a matching object in `website/src/data/blog.ts` (slug, title, excerpt, date, readTime, coverImage, coverAlt, tags).
3. Add a cover image under `website/public/blog/{slug}/`.
4. Preview `/blog/` and `/blog/{slug}/`.

### Service page copy

1. Edit `website/content/services/{slug}.md`.
2. If the card title, short description or SEO text change, also update `website/src/data/services.ts`.

### New service

1. Add an entry to `website/src/data/services.ts` (slug, titles, descriptions, CTA, order).
2. Add `website/content/services/{slug}.md`.
3. Preview `/services/` and `/services/{slug}/`.

### Products carousel / product copy

Edit `website/src/data/products.ts`. Product images live under `website/public/assets/`.

### Home, about, contact, or layout

Those pages are React, not markdown:

- Home: `website/src/app/page.tsx` and `website/src/components/home/`
- About: `website/src/app/about/page.tsx`
- Contact: `website/src/app/contact/page.tsx` and `website/src/components/contact/`
- Header / footer: `website/src/components/SiteHeader.tsx` and `website/src/components/SiteFooter.tsx`

### Images and other static files

Put files in `website/public/` and reference them from the site root, for example `/assets/consultx-mark.png`.

The contact form posts to `website/public/contact-form.php`. That file is uploaded with the static export and must stay in `public/` so it reaches the server.

---

## 6. Save source to GitHub

After you have previewed locally and are ready to keep the change:

```powershell
git status
git add website DEVELOPER_INSTRUCTIONS.md README.md deploy_changes.md
git commit -m "Describe why this change was made."
git push origin master
```

Do not add:

- `website/.env.local` or any password file
- `Examples/CVs/` or other personal documents
- large local-only videos under `Examples/`
- leftover WordPress files at the workspace root

A root `.gitignore` already excludes those.

---

## 7. Publish (push updates live)

From the `website` folder:

```powershell
cd website
npm run deploy
```

What this does:

1. Builds the static export into `website/out/`
2. Connects to Afrihost using `.env.local`
3. Uploads everything in `out/` to `AFRIHOST_REMOTE_DIR` (normally `/public_html`)

Useful variants:

```powershell
# Build and show what would upload — no files transferred
npm run deploy -- --dry-run

# Upload an existing build without rebuilding
npm run deploy -- --skip-build

# Delete remote target contents first, then upload
# Use only when you have been asked to wipe the live folder
npm run deploy -- --clean
```

Do **not** use `--clean` for a normal update. A normal `npm run deploy` overwrites the files that changed and leaves the rest.

Build only (if you need to inspect `out/` or upload manually):

```powershell
cd website
npm run build
```

Static files land in `website/out/`. Manual upload is a fallback only — prefer `npm run deploy`.

---

## 8. After you deploy

1. Open https://consultx.co.za/ and hard-refresh (`Ctrl+F5`).
2. Recheck the pages you changed, including:
   - `/products/`
   - `/blog/`
   - `/services/`
   - `/contact/` (form still present; do not send a test enquiry unless asked)
3. If the homepage still looks like the old WordPress site, the remote folder is wrong or an old `index.php` is winning over `index.html`. Stop and confirm `AFRIHOST_REMOTE_DIR=/public_html` before uploading again.

---

## 9. Do not do these things

- Do not edit files directly in Afrihost File Manager except in an emergency.
- Do not commit `.env.local`, passwords, or other secrets.
- Do not deploy to `/consultx.co.za` or any `/home/username/...` path.
- Do not run `--clean` unless you intend to empty the live document root first.
- Do not delete leftover WordPress files on the server unless the owner has asked you to.
- Do not add files larger than needed under `public/` — the whole `out/` folder is uploaded each deploy.
- Keep any single source file under **800 lines**.

---

## 10. Troubleshooting

| Problem | What to check |
| --- | --- |
| `Missing AFRIHOST_* in website/.env.local` | `.env.local` is missing or a required value is blank. Copy from `.env.deploy.example` again. |
| FTP login fails | Host, user, password, protocol and port. Confirm South Africa (or your location) is allowed in Afrihost FTP access control. |
| Deploy succeeds but the old site is still live | `AFRIHOST_REMOTE_DIR` must be `/public_html`. Hard-refresh. Check that `index.html` exists in that folder. |
| Build fails | Run `npm run build` in `website/` and fix the reported error before deploying. A missing `content/{type}/{slug}.md` for a listed slug will fail the build. |
| New blog post does not appear | The post needs a `coverImage` in `website/src/data/blog.ts` **and** a matching markdown file. |
| Contact form fails on the live site | Confirm `contact-form.php` is in `website/public/` and present on the server after deploy. |
| Local preview looks fine, live does not | You previewed but did not run `npm run deploy`, or the browser is serving a cached page. Hard-refresh. |
| Change is on GitHub but not on consultx.co.za | `git push` only stores source. Run `npm run deploy` from `website/`. |

---

## 11. Quick checklist

- [ ] Change made in `website/` (content, data, or source)
- [ ] `npm run dev` — previewed the affected pages
- [ ] `.env.local` exists and is not committed
- [ ] Committed and `git push origin master`
- [ ] `npm run deploy` from `website/`
- [ ] https://consultx.co.za/ hard-refreshed and the change is live
