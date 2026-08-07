# ConsultX Website

Next.js + Tailwind CSS + Framer Motion site for ConsultX, featuring the Products semi-circular carousel.

## Develop

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000/products](http://localhost:3000/products).

## Deploy to Afrihost

See [`../deploy_changes.md`](../deploy_changes.md).

```powershell
cd website
Copy-Item .env.deploy.example .env.local
# fill AFRIHOST_* values
npm run deploy
```

## Build only (manual upload)

```bash
cd website
npm run build
```

Static files are written to `website/out/`.

## Notes

- Brand palette and carousel behaviour follow `Examples/consultx_products_carousel_spec.md`.
- Visual target is the Products dashboard mockup in `Examples/`.
- Contact form UI is present; connect to mail/CRM before go-live.
