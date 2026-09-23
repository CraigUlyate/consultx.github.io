import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Landmark,
  Plus,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { demoCompanies } from "@/lib/platform";
import { RATES_SCHEDULE_2026 } from "@/lib/rates-schedule";

export const metadata = {
  title: "My Services & Mandates | ConsultX Client Portal",
  description: "Track active compliance jobs, statutory submissions, and order new accounting services.",
};

export default function ServicesOverviewPage() {
  const activeJobs = [
    {
      id: "VAL-2026-084",
      serviceName: "Comprehensive CA(SA) Business Valuation",
      companyId: demoCompanies[0].id,
      status: "under_review" as const,
      nextAction: "Stage 3: Executive Scoping & Normalization Interview with Craig CA(SA).",
      route: "/portal/services/valuation/",
    },
    {
      id: "CIPC-2026-128",
      serviceName: "CIPC Annual Return & Beneficial Ownership Filing",
      companyId: demoCompanies[0].id,
      status: "information_required" as const,
      nextAction: "Beneficial ownership confirmation and certified ID upload required.",
      route: "/portal/services/cipc/",
    },
    {
      id: "TAX-2026-042",
      serviceName: "SARS Tax Compliance Status (TCS Good Standing PIN)",
      companyId: demoCompanies[0].id,
      status: "completed" as const,
      nextAction: "Active PIN issued: 98421074CS. Expiry: 28 Jan 2027.",
      route: "/portal/services/tax/",
    },
  ];

  const specializedWorkspaces = [
    {
      title: "Business Valuation Cockpit",
      description: "Interactive DCF modeling, EBITDA normalization add-backs, WACC build-up, and IVS 2025 reporting.",
      route: "/portal/services/valuation/",
      badge: "CA(SA) Advisory",
      icon: TrendingUp,
      cta: "Open Valuation Cockpit",
    },
    {
      title: "CIPC Compliance Hub",
      description: "Annual return lodgements, 2026 turnover statutory fee calculator, and Beneficial Ownership cascade builder.",
      route: "/portal/services/cipc/",
      badge: "Statutory",
      icon: Landmark,
      cta: "Open CIPC Workspace",
    },
    {
      title: "SARS Tax & TCS PIN Center",
      description: "Multi-tax head status tracker (CIT, VAT, PAYE, IRP6), deficiency remediation, and Good Standing PINs.",
      route: "/portal/services/tax/",
      badge: "eFiling Direct",
      icon: Award,
      cta: "Open Tax Workspace",
    },
    {
      title: "Statutory Onboarding & Checkout",
      description: "Configure multi-service bundles from our 63 fixed rates, upload documents, and pay via Paystack or Bank EFT.",
      route: "/portal/services/onboard/",
      badge: "Fast Track",
      icon: ShieldCheck,
      cta: "Order New Mandate",
    },
  ];

  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl pb-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-consultx-green-dark">CLIENT PORTAL · MANDATES</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-consultx-black md:text-4xl">
              Services & Statutory Workspaces
            </h1>
            <p className="mt-2 text-sm text-consultx-charcoal">
              Manage active mandates, collaborate in dedicated service workspaces, and order from the 2026 fixed rates catalog.
            </p>
          </div>
          <Link
            href="/portal/services/onboard/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 text-sm font-bold text-white transition hover:bg-consultx-green-dark shadow-soft"
          >
            <Plus className="h-4 w-4" /> Order New Service
          </Link>
        </div>

        {/* Specialized Interactive Workspaces Grid */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-consultx-black">
              Specialized Service Workspaces
            </h2>
            <span className="text-xs text-consultx-grey">Standard Operating Procedure Cockpits</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {specializedWorkspaces.map((ws) => {
              const Icon = ws.icon;
              return (
                <div
                  key={ws.title}
                  className="rounded-2xl border border-consultx-border bg-white p-5 flex flex-col justify-between shadow-soft hover:border-consultx-green transition group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-consultx-green-soft text-consultx-green-dark">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                        {ws.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 font-bold text-sm text-consultx-black group-hover:text-consultx-green-dark transition">
                      {ws.title}
                    </h3>
                    <p className="mt-1 text-xs text-consultx-grey leading-relaxed">
                      {ws.description}
                    </p>
                  </div>

                  <Link
                    href={ws.route}
                    className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-50 border border-gray-200 py-2 text-xs font-bold text-consultx-black hover:border-consultx-green hover:bg-consultx-green-soft/40 transition"
                  >
                    {ws.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Active Mandates Queue */}
        <section className="mt-10 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-consultx-black border-b border-gray-100 pb-3">
            Active Mandates & Engagement Milestones ({activeJobs.length})
          </h2>

          <div className="mt-4 divide-y divide-gray-100">
            {activeJobs.map((job) => {
              const company = demoCompanies.find((c) => c.id === job.companyId) || demoCompanies[0];
              return (
                <div key={job.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-consultx-black">{job.serviceName}</strong>
                      <span className="text-xs text-gray-400 font-mono">[{job.id}]</span>
                    </div>
                    <p className="text-xs text-consultx-grey mt-0.5">{company.name} ({company.registrationNumber})</p>
                    <p className="text-xs text-consultx-charcoal mt-2 max-w-xl">
                      {job.nextAction}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={job.status} />
                    <Link
                      href={job.route}
                      className="inline-flex items-center gap-1 rounded-lg bg-consultx-black px-3.5 py-2 text-xs font-bold text-white hover:bg-gray-800 transition"
                    >
                      Open Workspace <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Available 2026 Price List Catalog Highlights */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-consultx-black">Popular 2026 Fixed-Fee Services</h2>
              <p className="text-xs text-consultx-grey mt-0.5">
                Instant onboarding with upfront rates. Pay via Paystack or Investec Bank EFT.
              </p>
            </div>
            <Link
              href="/portal/services/onboard/"
              className="text-xs font-bold text-consultx-green-dark hover:underline"
            >
              View Full 63-Service Catalog →
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RATES_SCHEDULE_2026.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="rounded-xl border border-consultx-border bg-white p-5 flex flex-col justify-between hover:border-consultx-green transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-consultx-black">{service.name}</span>
                    <span className="font-mono text-xs font-bold text-consultx-green-dark shrink-0">
                      {service.priceFormatted}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <Link
                  href={`/portal/services/onboard/?services=${service.id}`}
                  className="mt-4 inline-flex items-center justify-center gap-1 rounded-lg bg-gray-50 border border-gray-200 py-2 text-xs font-bold text-consultx-black hover:border-consultx-green hover:bg-consultx-green-soft/40 transition"
                >
                  Order Service <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
