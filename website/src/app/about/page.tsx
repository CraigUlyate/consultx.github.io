import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Craig Ulyate CA(SA) and ConsultX — finance, operations, valuations, governance and practical business technology.",
};

const expertise = [
  {
    title: "Financial governance & control",
    body: "Designing and embedding control environments that hold under pressure — clear ownership, reconciliations, approval paths and reporting frameworks that restore trust in the numbers.",
  },
  {
    title: "Audit management & remediation",
    body: "Hands-on leadership of year-end close, audit preparation and remediation. Proven experience turning qualified audit outcomes into clean opinions through disciplined execution and stakeholder liaison.",
  },
  {
    title: "Finance leadership & transformation",
    body: "Acting and fractional finance leadership during transition or instability. Finance turnaround work spanning reporting, cash, team accountability and sustainable operating rhythms.",
  },
  {
    title: "Operations & process optimisation",
    body: "End-to-end process reviews across finance and operations — reducing debtor days, tightening supplier cycles, improving inventory accuracy and clarifying roles so processes scale with the business.",
  },
  {
    title: "IFRS reporting & technical accounting",
    body: "Group consolidation, year-end clean-ups and IFRS guidance on restructurings, leases, fixed assets and intercompany arrangements — with clarity for executives, boards and auditors.",
  },
  {
    title: "Business valuations & asset assurance",
    body: "Independent valuations for restructurings, shareholder matters and M&A contexts, supported by experience in asset valuations, project stage-of-completion reviews and capital project controls.",
  },
  {
    title: "Budgeting, forecasting & cashflow",
    body: "Practical cash and forecast discipline for boards and operators — budgeting, banking relationships and decision-ready packs that keep leadership ahead of liquidity and performance risk.",
  },
  {
    title: "Systems, automation & AI-enabled tools",
    body: "Bridging finance process with technology — reporting frameworks, automation, Power Platform / Power BI, and the development of practical AI-assisted business tools that reduce manual work.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">About</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
          Business science for ambitious operators
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-700">
          ConsultX is a finance and business advisory practice providing CFO-level finance, governance
          and operational support to corporates, growing businesses and public-sector entities. We
          combine hands-on execution with sound judgement — so insight becomes action.
        </p>
      </section>

      <section className="mt-16 grid gap-8 border-t border-consultx-border pt-12 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
            Leadership
          </p>
          <h2 className="mt-3 text-3xl font-bold text-consultx-black">Craig Ulyate, CA(SA)</h2>
          <p className="mt-2 text-base font-semibold text-consultx-charcoal">
            Managing Director · Finance & Operations Consultant
          </p>
          <p className="mt-5 leading-8 text-gray-700">
            Chartered Accountant and senior finance and operations leader with over 15 years&apos;
            experience across multinationals and large corporates in financial services,
            manufacturing, industrial, information technology, logistics, engineering and property. Proven track record in
            stabilising finance functions, restoring audit integrity, strengthening governance and
            embedding operational discipline.
          </p>
          <p className="mt-4 leading-8 text-gray-700">
            Craig works closely with CEOs, boards, auditors and external stakeholders in lean,
            high-responsibility roles — comfortable operating without layers of management, with a
            strong focus on reliability, clarity and sustainable performance.
          </p>
          <a
            href="https://www.linkedin.com/in/craig-ulyate/"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-consultx-green transition hover:text-consultx-green-dark"
          >
            View Craig on LinkedIn
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <aside className="rounded-2xl border border-consultx-border bg-consultx-light-grey/60 p-6 md:p-8">
          <h3 className="text-lg font-bold text-consultx-black">Credentials</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
            <li>Chartered Accountant CA(SA) — SAICA</li>
            <li>Bachelor of Business Science (Finance Honours) — UCT</li>
            <li>Business Valuation foundations certification</li>
            <li>Business Process Modelling · Six Sigma Foundations · Scrum Basics</li>
          </ul>
          <div className="mt-8 border-t border-consultx-border pt-6">
            <p className="text-sm text-gray-600">Follow ConsultX</p>
            <a
              href="https://www.linkedin.com/company/18122520/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 font-semibold text-consultx-green transition hover:text-consultx-green-dark"
            >
              ConsultX on LinkedIn
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </aside>
      </section>

      <section className="mt-16 border-t border-consultx-border pt-12">
        <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
          Expertise
        </p>
        <h2 className="mt-3 max-w-2xl text-3xl font-bold text-consultx-black">
          Areas of professional focus
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-gray-700">
          Drawn from senior finance, internal audit and consulting work across private and
          public-sector environments.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {expertise.map((item) => (
            <article key={item.title}>
              <h3 className="text-xl font-bold text-consultx-black">{item.title}</h3>
              <p className="mt-3 leading-7 text-gray-700">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-consultx-green/40 bg-consultx-green-soft/40 px-6 py-8 md:px-8">
        <h2 className="text-2xl font-bold text-consultx-black">Work with ConsultX</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-700">
          Whether you need finance stabilisation, process improvement, valuation support or
          practical technology in the finance function — let&apos;s scope a clear next step.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/contact/"
            className="inline-flex rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:bg-consultx-green-dark"
          >
            Book a Consultation →
          </Link>
          <Link
            href="/services/"
            className="inline-flex rounded-md border border-consultx-border bg-white px-7 py-4 font-semibold text-consultx-charcoal transition hover:border-consultx-green"
          >
            View services
          </Link>
        </div>
      </section>
    </div>
  );
}
