import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileText,
  Landmark,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services | ConsultX Advisory & Statutory Accounting",
  description:
    "ConsultX financial management, valuations, outsourced CFO leadership, CIPC compliance, SARS taxation, and monthly bookkeeping.",
};

const statutoryPillars = [
  {
    icon: Landmark,
    title: "CIPC Compliance & Secretarial",
    description:
      "Statutory annual return lodgments, mandatory Beneficial Ownership register filings, fast-track company registrations, and iXBRL reporting.",
    features: [
      "CIPC Annual Returns (From R470)",
      "Beneficial Ownership Filing (R650)",
      "Company Registration (R2,500)",
      "CIPC iXBRL AFS Tagging (From R3,500)",
    ],
    onboardUrl: "/portal/services/onboard?services=cipc_annual_return,beneficial_ownership",
  },
  {
    icon: ShieldCheck,
    title: "Taxation & SARS Submissions",
    description:
      "End-to-end tax compliance, VAT registrations, Good Standing tax clearance PINs, PAYE/UIF registrations, and dispute resolution.",
    features: [
      "SARS VAT Registration (R1,500)",
      "Tax Clearance TCS PIN (R1,250)",
      "PAYE & UIF Registration (R1,250)",
      "Provisional Tax Returns (R950)",
    ],
    onboardUrl: "/portal/services/onboard?services=vat_registration,tax_clearance",
  },
  {
    icon: FileText,
    title: "Annual Financial Statements (AFS)",
    description:
      "Full compilation of Annual Financial Statements under IFRS for SMEs and submission of corporate income tax returns (IT14 / IT12TR).",
    features: [
      "Company (Pty Ltd) AFS & Tax (From R9,900)",
      "Close Corporation AFS & Tax (From R9,500)",
      "Trust Financials & IT12TR (From R9,900)",
      "Sole Proprietor Accounts (From R7,500)",
    ],
    onboardUrl: "/portal/services/onboard?services=afs_company",
  },
  {
    icon: Calculator,
    title: "Monthly Bookkeeping & Payroll",
    description:
      "Xero and Sage monthly accounting, bank reconciliations, management commentary packs, debtor follow-ups, and payroll payslips.",
    features: [
      "Essentials Package (R3,500 / mo)",
      "Growth Package + VAT201 (R6,500 / mo)",
      "Scale CFO Package (R12,000 / mo)",
      "Monthly Payroll & EMP201 (R900 base)",
    ],
    onboardUrl: "/portal/services/onboard?services=bookkeeping_growth,payroll_monthly",
  },
];

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
          ConsultX Services
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
          Expert CA(SA) advisory and statutory accounting
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
          From hands-on statutory compliance and monthly accounting to specialist business valuations
          and fractional CFO leadership, ConsultX helps businesses eliminate risk, optimize cash, and
          scale with confidence.
        </p>
      </div>

      {/* AI Advisor Callout Banner */}
      <div className="mt-10 rounded-2xl border border-consultx-green/30 bg-[linear-gradient(135deg,#f2f9ed_0%,#ffffff_60%)] p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-consultx-green/10 px-3 py-1 text-xs font-bold text-consultx-green">
              <Sparkles className="h-3.5 w-3.5" /> Ask AnNa AI Advisor
            </div>
            <h2 className="mt-3 text-2xl font-bold text-consultx-black">
              Need an instant quote or guidance on your required services?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Tell AnNa what your business needs. She will diagnose your exact requirements, quote the
              official 2026 rates, and guide you directly through online onboarding.
            </p>
          </div>
          <div className="flex shrink-0 flex-col sm:flex-row gap-3">
            <Link
              href="/advisor/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-consultx-green-dark"
            >
              <MessageSquare className="h-4 w-4" /> Ask AnNa AI
            </Link>
            <Link
              href="/portal/services/onboard/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-consultx-border bg-white px-5 py-3 font-semibold text-consultx-black transition hover:bg-gray-50"
            >
              Start Onboarding Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Section 1: Fixed-Fee Statutory & Accounting Services */}
      <div className="mt-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-consultx-green uppercase">
              Fixed-Fee Self-Service
            </p>
            <h2 className="mt-2 text-3xl font-bold text-consultx-black">
              Statutory, Tax & Accounting Packages
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl">
              Transparent, fixed-fee statutory services with upfront pricing, fast turnarounds, and
              instant onboarding through our self-service client portal.
            </p>
          </div>
          <Link
            href="/portal/services/"
            className="inline-flex items-center gap-2 font-semibold text-consultx-green hover:underline text-sm"
          >
            View full 2026 rates schedule →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statutoryPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col justify-between rounded-xl border border-consultx-border bg-white p-6 shadow-sm transition hover:border-consultx-green hover:shadow-md"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-consultx-light-green/40 text-consultx-green">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-consultx-black">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-gray-600">{pillar.description}</p>

                  <ul className="mt-4 space-y-2 border-t border-consultx-border pt-4 text-xs font-medium text-gray-700">
                    {pillar.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-consultx-green shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={pillar.onboardUrl}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-consultx-green/10 py-2.5 text-xs font-bold text-consultx-green transition hover:bg-consultx-green hover:text-white"
                  >
                    Onboard Now <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Enterprise Advisory & CFO Leadership */}
      <div className="mt-24 border-t border-consultx-border pt-16">
        <div>
          <p className="text-xs font-bold tracking-[0.16em] text-consultx-green uppercase">
            Specialist Strategic Practice
          </p>
          <h2 className="mt-2 text-3xl font-bold text-consultx-black">
            Corporate Advisory & Senior Leadership
          </h2>
          <p className="mt-2 max-w-2xl text-gray-600">
            High-impact financial strategy led by Craig Ulyate (CA(SA)) for established companies,
            acquisitions, capital raises, and operational transformations.
          </p>
        </div>

        <div className="mt-10 divide-y divide-consultx-border border-y border-consultx-border">
          {services.map((service) => (
            <article key={service.slug} className="py-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-bold text-consultx-black">{service.title}</h3>
                  <p className="mt-3 leading-7 text-gray-600">{service.shortDescription}</p>
                </div>
                <Link
                  href={`/services/${service.slug}/`}
                  className="inline-flex items-center gap-2 font-semibold text-consultx-green transition hover:text-consultx-green-dark shrink-0"
                >
                  Explore advisory scope <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
