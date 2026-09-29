# ConsultX SEO integration

## Implementation

The public marketing pages use the `(marketing)` root layout. Its shared RootDocument includes the supplied GTM-P3HWX62P script in the head and noscript iframe at the start of the body. Portal and advisor pages have separate root layouts without GTM. Next.js performs a document navigation across these root layouts, so a previously loaded marketing container does not persist into the portal or advisor page. Public URLs are unchanged. The advisor drawer is excluded from our delegated click events.

The FAQs are at `/faqs/`, with crawlable answers, native keyboard-accessible disclosure controls, service links, metadata and a canonical URL. Footer navigation includes FAQs. `/sitemap.xml` lists public marketing pages and published posts; `/robots.txt` advertises it. FAQ rich-result markup has not been added.

The owner-confirmed address and map URL are in `src/data/business.ts`, rendered through BusinessAddress in the public footer and Contact page. Appointment wording is omitted because visiting arrangements were not supplied. The owner confirmed international clients and both ongoing and project-based engagements. Industry experience is attributed to Craig.

## GTM / GA4 configuration for the SEO consultant

Installing the container does not configure or publish GA4. Configure the Google tag with the property's G- measurement ID and publish the container after testing. Give ConsultX owner/admin access to both accounts.

Our dataLayer custom events are:

| Custom event trigger | GA4 event name | Parameters |
| --- | --- | --- |
| consultx_page_view | page_view | page_path, page_location |
| consultx_contact_click | contact_click | contact_method, page_path, page_location |
| consultx_consultation_click | consultation_click | page_path, page_location |
| consultx_onboarding_click | onboarding_click | page_path, page_location |
| consultx_enquiry_success | generate_lead | page_path, page_location |

Create matching GTM Custom Event triggers and Data Layer Variables for the parameters. Configure the Google tag to initialise before event tags, with `send_page_view: false`. Disable enhanced-measurement history page views and automatic form interaction tracking to avoid duplicate page views or false lead counts. Use only `consultx_page_view` for initial and client-side route page views. Mark `generate_lead` as a key event; contact clicks indicate intent, not completed enquiries. Consultation clicks include all internal links to Contact. Onboarding clicks are measured on the marketing page before navigation.

Custom event payloads omit form values, query strings, hashes, link destinations and chat text. Use the supplied clean page_location in event tags. Review automatic Google tag parameters, referrers, consent settings and any existing container tags before publishing: loading a third-party container does not constrain what its independently configured tags can collect. Do not configure DOM scraping, automatic form capture or chat tracking. The marketing drawer contains an advisor conversation even though the standalone advisor route has no GTM.

## Validation and handoff

1. Build the static export and inspect the FAQ, Contact and footer at desktop and mobile sizes.
2. In Tag Assistant, test a direct page load, internal navigation, back/forward and a reload: each should yield one page_view.
3. Verify portal and advisor HTML contain no GTM snippet and navigation into those routes loads a new document without GTM.
4. Test phone, email, WhatsApp, Contact and onboarding links. Check that no contact details or query values appear in custom payloads.
5. Test contact success and failure: only the server-confirmed success emits generate_lead. Use a controlled test submission during live validation.
6. Check GA4 DebugView/Realtime, then publish the GTM container. Verify the sitemap URLs and submit the sitemap in Search Console.
7. Add business schema using the same confirmed address; avoid duplicate business entities if another system already supplies schema.

The public-site changes were deployed to Afrihost `/public_html` on 29 September 2026 using `node scripts/deploy.mjs --skip-build --marketing`. This uploaded the verified public page export and its hashed assets without uploading portal pages, advisor pages or backend PHP files. GTM/GA4 account access and container configuration remain with the SEO consultant.

## Local validation results

- Focused ESLint checks passed for all changed SEO components, layouts, data and metadata routes.
- Type checking and all 41 static pages passed with `npx next build --turbopack --no-lint` (network access was needed for the existing Google Fonts dependency).
- `node scripts/verify-seo.mjs` checks GTM placement and exclusions, the address, 12 FAQs, 20 sitemap destinations, safe event payloads, and successful/rejected/offline enquiry outcomes without sending mail.
- Browser preview checked FAQ expansion, navigation, and the FAQ/Contact layout at desktop and 390px mobile width.
- The regular `npm run build` remains blocked by pre-existing `no-explicit-any` lint errors in `src/components/portal/AnnualReturnWizard.tsx`. Those unrelated working changes were preserved. Resolve that existing blocker before the normal deployment workflow.
- Post-deployment HTTPS checks matched the live homepage, FAQs, Contact, About, Services, Products, Blog, sitemap and robots file byte-for-byte to the verified export. All 13 FAQ JavaScript, stylesheet and font dependencies responded successfully.
- Live Tag Assistant and GA4 validation remain for the consultant; no analytics account access was available in this task.
