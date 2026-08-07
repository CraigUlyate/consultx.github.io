# ConsultX Products Carousel – Developer Build Specification

## Purpose

Build the ConsultX **Products** page as a responsive, interactive product showcase using **Tailwind CSS**.

The defining interaction is a **vertical semi-circular product carousel** on the left. Products move up/down along an arc. The currently selected product enlarges and its full details appear in the main content panel.

The visual direction must remain consistent with the existing ConsultX site:

- White background
- Black / charcoal text
- ConsultX lime green accent
- Clean, spacious corporate layout
- Minimal shadows
- Rounded circular product icons
- Johannesburg skyline treatment above the footer
- Dark charcoal footer

---

## Brand Palette

Use these Tailwind-friendly values:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        consultx: {
          green: '#72C600',
          greenDark: '#4FA000',
          greenSoft: '#F1F8E8',
          black: '#111111',
          charcoal: '#343638',
          grey: '#8D8D8D',
          lightGrey: '#F5F6F7',
          border: '#E5E7EB',
          teal: '#00A09A',
          blue: '#11A9E5'
        }
      },
      boxShadow: {
        'soft': '0 8px 28px rgba(0,0,0,0.08)',
        'active': '0 12px 34px rgba(114,198,0,0.18)'
      }
    }
  }
}
```

Recommended fonts:

```css
font-family: "Montserrat", "Inter", Arial, sans-serif;
```

---

## Page Structure

```text
Header
│
├── ConsultX logo
├── Navigation
│   ├── Home
│   ├── About
│   ├── Services
│   ├── Products [active]
│   ├── Blog
│   └── Contact
└── Book a Consultation button

Main Product Showcase
│
├── Left: semi-circular vertical carousel
│   ├── Up control
│   ├── product nodes
│   └── Down control
│
├── Centre: active product detail
│   ├── badge
│   ├── product title
│   ├── subtitle
│   ├── description
│   ├── feature grid
│   └── CTA
│
└── Right: optional contextual panel
    └── workflow / key steps / product illustration

CTA Banner
│
└── "More products. More impact."

Skyline Divider

Footer
```

---

## Product Data

The carousel should be data-driven.

```js
const products = [
  {
    id: 'anna-expense',
    name: 'AnNa Expense',
    shortName: 'AnNa',
    category: 'AI-Powered Expense Processing',
    status: 'Featured Product',
    logo: '/assets/products/anna-expense-logo.png',
    description:
      'Automate expense extraction, coding and validation with AI. Review, validate and export with confidence.',
    features: [
      'AI Extraction',
      'Duplicate Detection',
      'Multi-line Invoices',
      'VAT & Tax Rules',
      'FX Conversion',
      'System Agnostic'
    ],
    cta: 'Learn More'
  },
  {
    id: 'iris-carbon-xbrl',
    name: 'Iris Carbon XBRL',
    category: 'XBRL Reporting Made Simple',
    logo: '/assets/products/iris-carbon-xbrl.png',
    description:
      'Create accurate, compliant XBRL reports quickly using Iris Carbon.',
    features: [
      'XBRL Reporting',
      'Validation Checks',
      'Compliance Ready',
      'CIPC / filing support'
    ],
    cta: 'Learn More'
  },
  {
    id: 'cipc-compliance',
    name: 'CIPC Compliance',
    category: 'Company Compliance Simplified',
    logo: '/assets/products/cipc-compliance.svg',
    description:
      'Streamline company compliance workflows, annual returns and related statutory requirements.',
    features: [
      'Annual Returns',
      'Director Changes',
      'Name Reservations',
      'Status Monitoring'
    ],
    cta: 'Learn More'
  },
  {
    id: 'financial-modelling',
    name: 'Financial Modelling',
    category: 'Built for Better Decisions',
    logo: '/assets/products/financial-modelling.svg',
    description:
      'Dynamic financial models for forecasting, budgeting and scenario planning.',
    features: [
      'Forecasting',
      'Budgeting',
      'Scenario Analysis',
      'DCF Models'
    ],
    cta: 'Learn More'
  },
  {
    id: 'business-valuations',
    name: 'Business Valuations',
    category: 'Know the True Value',
    logo: '/assets/products/business-valuations.svg',
    description:
      'Independent, professionally prepared valuations for transactions, reporting, litigation and strategic decisions.',
    features: [
      'DCF Valuations',
      'Independent Reports',
      'Scenario Analysis',
      'Expert Analysis'
    ],
    cta: 'Learn More'
  },
  {
    id: 'pivot-analysis',
    name: 'Pivot Analysis',
    category: 'Business Performance Diagnostic',
    logo: '/assets/products/pivot-analysis.svg',
    description:
      'Analyse accounting data, management feedback and business performance to identify weaknesses, risks and improvement opportunities.',
    features: [
      '24-month GL Analysis',
      'Management Questionnaire',
      'Performance Diagnostics',
      'Improvement Roadmap'
    ],
    cta: 'Coming Soon'
  },
  {
    id: 'fastleads',
    name: 'FastLeads',
    category: 'AI-Assisted Lead Intelligence',
    logo: '/assets/products/fastleads.svg',
    description:
      'Find target companies and decision-makers, verify data and perform deeper lead research.',
    features: [
      'Company Search',
      'Person Search',
      'Data Verification',
      'Email Discovery'
    ],
    cta: 'Coming Soon'
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    category: 'SME Workflow & EOD Automation',
    logo: '/assets/products/workflow-automation.svg',
    description:
      'A lightweight workflow orchestration platform for finance and operational processes.',
    features: [
      'Workflow Scheduling',
      'Dependencies',
      'Rerun & Recovery',
      'Operational Monitoring'
    ],
    cta: 'Concept'
  },
  {
    id: 'ai-finance-tools',
    name: 'AI Finance Tools',
    category: 'Intelligent Finance. Smarter Business.',
    logo: '/assets/products/ai-finance-tools.svg',
    description:
      'A growing suite of AI-enabled finance tools for analysis, reporting and automation.',
    features: [
      'AI Insights',
      'Automation',
      'Smart Reporting',
      'Natural Language'
    ],
    cta: 'Coming Soon'
  }
]
```

---

## Semi-Circular Carousel Behaviour

### Desktop

The carousel occupies approximately `340px–420px` width.

The centreline of the arc should sit partly offscreen to the left so the product nodes form a visible **right-facing semi-circle**.

Conceptually:

```text
      ○
        ○
          ◉ ACTIVE
        ○
      ○
```

The selected product should:

- grow from approximately `72px` to `112px`
- gain a green border
- receive a soft green shadow
- shift slightly right
- show its product name in green
- animate over `350–500ms`

Products farther from the active index should:

- reduce in scale
- reduce opacity slightly
- shift progressively left
- remain clickable

Suggested state calculations:

```js
const distance = index - activeIndex

const translateY = distance * 105
const translateX = Math.abs(distance) * -22
const scale = distance === 0
  ? 1.28
  : Math.max(0.72, 1 - Math.abs(distance) * 0.10)

const opacity = Math.max(0.45, 1 - Math.abs(distance) * 0.18)
```

For a more pronounced arc:

```js
const x = -Math.pow(distance, 2) * 8
```

Use transform:

```js
transform: translate3d(${x}px, ${translateY}px, 0) scale(${scale});
```

---

## Tailwind Carousel Node

```html
<button
  class="
    absolute left-1/2
    flex items-center gap-5
    transition-all duration-500 ease-out
    focus:outline-none
  "
>
  <span
    class="
      flex h-20 w-20 items-center justify-center
      rounded-full border border-gray-200
      bg-white shadow-soft
    "
  >
    <img
      src="/assets/products/anna-expense-logo.png"
      class="h-14 w-14 object-contain"
      alt="AnNa Expense"
    />
  </span>

  <span class="whitespace-nowrap text-sm font-semibold text-gray-700">
    AnNa Expense
  </span>
</button>
```

Active node:

```text
scale-[1.28]
z-30
translate-x-6
```

Active icon:

```text
border-consultx-green
shadow-active
ring-4
ring-consultx-green/10
```

Active label:

```text
text-consultx-green
font-bold
```

---

## Carousel Rail

Use an SVG for the arc rather than a CSS border so the curve remains smooth and responsive.

```html
<svg
  class="absolute inset-y-0 left-0 h-full w-72"
  viewBox="0 0 280 700"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M20 40 C250 180, 250 520, 20 660"
    stroke="#E5E7EB"
    stroke-width="2"
  />
</svg>
```

Optional small indicator dots may be positioned over the line.

---

## Scroll / Input Behaviour

Support:

- mouse wheel
- trackpad
- touch swipe
- keyboard arrows
- click on a product

Rules:

```js
ArrowUp   -> previous product
ArrowDown -> next product
Wheel up  -> previous product
Wheel down -> next product
Swipe up -> next product
Swipe down -> previous product
```

Throttle wheel input to approximately `450ms`.

The list should wrap:

```text
last -> first
first -> last
```

---

## Central Product Panel

Suggested Tailwind layout:

```html
<section class="max-w-3xl">
  <span
    class="
      inline-flex rounded-lg
      bg-consultx-greenSoft
      px-4 py-2
      text-xs font-semibold uppercase
      tracking-wide text-consultx-greenDark
    "
  >
    Featured Product
  </span>

  <h1
    class="
      mt-8 text-5xl
      font-bold tracking-tight
      text-consultx-black
      lg:text-6xl
    "
  >
    AnNa Expense
  </h1>

  <p
    class="
      mt-4 text-2xl
      font-semibold
      text-consultx-green
    "
  >
    AI-Powered Expense Processing
  </p>

  <p
    class="
      mt-7 max-w-2xl
      text-lg leading-8
      text-gray-700
    "
  >
    Automate expense extraction, coding and validation with AI.
    Review, validate and export with confidence.
  </p>
</section>
```

---

## Feature Grid

```html
<div class="mt-10 grid max-w-2xl grid-cols-2 gap-x-12 gap-y-5">
  <div class="flex items-center gap-3">
    <span
      class="
        flex h-6 w-6 items-center justify-center
        rounded-full border border-consultx-green
        text-consultx-green
      "
    >
      ✓
    </span>
    <span class="text-base font-medium text-gray-800">
      AI Extraction
    </span>
  </div>
</div>
```

---

## Product Detail Animation

When the active carousel item changes:

- fade current detail panel out
- translate down `8px`
- replace content
- fade new panel in
- translate to `0`

Recommended:

```text
duration-300
ease-out
opacity-0 -> opacity-100
translate-y-2 -> translate-y-0
```

With React / Next.js, use **Framer Motion**.

---

## Right-side Context Panel

This area is optional and may change per product.

For AnNa Expense:

```text
How It Works

✓ Upload / Shared
↓
✓ Processing
↓
✓ Review
↓
↓ Outputs
```

For other products it can display:

- process workflow
- key outcome
- mini illustration
- screenshot
- relevant metrics
- “coming soon” state

Keep the container subtle:

```text
rounded-3xl
border border-gray-200
bg-white
p-8
shadow-soft
```

---

## Responsive Behaviour

### Desktop ≥ 1280px

```text
Carousel | Product Detail | Context Panel
```

Suggested grid:

```html
<div class="grid grid-cols-[360px_1fr_330px] gap-12">
```

### Tablet

```text
Horizontal / curved carousel
Product Detail
Context Panel
```

or:

```text
Carousel | Product Detail
Context panel below
```

### Mobile

Do **not** preserve the desktop semi-circle.

Use a horizontal snap carousel:

```html
<div
  class="
    flex snap-x snap-mandatory
    gap-5 overflow-x-auto
    px-6 pb-4
  "
>
```

Each circular icon becomes a snap target.

Active item remains enlarged.

---

## CTA Button

```html
<a
  href="/contact"
  class="
    inline-flex items-center gap-3
    rounded-md
    bg-gradient-to-r
    from-consultx-greenDark
    to-consultx-green
    px-7 py-4
    font-semibold text-white
    transition
    hover:-translate-y-0.5
    hover:shadow-lg
  "
>
  Learn More
  <span>→</span>
</a>
```

---

## CTA Banner

```html
<section
  class="
    mx-auto mt-16 flex max-w-6xl
    items-center justify-between
    rounded-xl border
    border-consultx-green/50
    bg-white px-10 py-6
  "
>
  <div>
    <h2 class="text-2xl font-bold">
      More products. More impact.
    </h2>
    <p class="mt-1 text-gray-600">
      We're continuously building tools that help you work smarter and grow stronger.
    </p>
  </div>

  <a
    href="/contact"
    class="
      rounded-md
      bg-consultx-green
      px-7 py-4
      font-semibold text-white
    "
  >
    Book a Consultation →
  </a>
</section>
```

---

## Footer

Use the current ConsultX footer design rather than creating a new visual language.

Core styles:

```text
background: #343638
text: white / light grey
accent: ConsultX green
```

The skyline can be implemented as a transparent SVG / PNG placed immediately above the footer.

```html
<img
  src="/assets/johannesburg-skyline.svg"
  alt=""
  class="w-full opacity-60"
/>
```

---

## Recommended Stack

Preferred implementation:

```text
Next.js / React
Tailwind CSS
Framer Motion
Lucide React
```

If the existing WordPress site is retained:

```text
WordPress
Custom page template / Gutenberg custom block
Tailwind build compiled into theme CSS
Alpine.js for carousel interaction
```

Avoid relying on Tailwind CDN in production.

---

## Suggested React Component Structure

```text
ProductsPage
├── SiteHeader
├── ProductShowcase
│   ├── ProductCarousel
│   │   ├── CarouselRail
│   │   └── ProductNode[]
│   ├── ProductDetails
│   └── ProductContextPanel
├── ConsultationBanner
├── SkylineDivider
└── SiteFooter
```

---

## Critical Interaction Requirement

The page should **not feel like six static service cards**.

The selected product must become the visual focus.

The user should immediately understand:

> Scroll through ConsultX products → select one → see the full product story.

The motion should be refined and controlled, not playful or game-like. This remains a professional Chartered Accountant / business technology brand.
