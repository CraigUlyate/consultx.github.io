# ConsultX Website

Next.js + Tailwind CSS + Framer Motion site for ConsultX, featuring the Products semi-circular carousel.

## Develop

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000/products](http://localhost:3000/products).

## Build for Afrihost / cPanel

```bash
cd website
npm run build
```

Static files are written to `website/out/`.

Upload the contents of `out/` into the domain document root on Afrihost (for example `public_html` or `consultx.co.za`).

## Notes

- Brand palette and carousel behaviour follow `Examples/consultx_products_carousel_spec.md`.
- Visual target is the Products dashboard mockup in `Examples/`.
- Contact form UI is present; connect to mail/CRM before go-live.
