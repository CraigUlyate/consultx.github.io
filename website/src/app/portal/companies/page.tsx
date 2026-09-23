import React from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  CircleAlert,
  Plus,
  ArrowRight,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { demoCompanies } from "@/lib/platform";

export const metadata = {
  title: "My Companies | ConsultX Client Portal",
  description: "Manage registered companies, compliance scores, CIPC filings, and beneficial ownership records.",
};

export default function CompaniesPage() {
  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-consultx-green-dark">CLIENT PORTAL · ENTITIES</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-consultx-black md:text-4xl">
              My Registered Companies
            </h1>
            <p className="mt-2 text-sm text-consultx-charcoal">
              Review company compliance status, statutory deadlines, and beneficial ownership records.
            </p>
          </div>
          <Link
            href="/portal/services/onboard/?services=afs_company"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-black px-4 py-3 text-sm font-bold text-white transition hover:bg-consultx-charcoal"
          >
            <Plus className="h-4 w-4 text-consultx-green" /> Add Company
          </Link>
        </div>

        {/* Company Cards Grid */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {demoCompanies.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft transition hover:border-consultx-green/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-consultx-green-soft text-consultx-green-dark">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-consultx-black">{comp.name}</h2>
                    <p className="text-xs text-consultx-grey font-mono">
                      CIPC Reg: {comp.registrationNumber}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    comp.complianceScore === 100
                      ? "bg-consultx-green-soft text-consultx-green-dark"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {comp.complianceScore}% compliant
                </span>
              </div>

              <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-xs">
                <div className="flex items-center justify-between text-consultx-charcoal">
                  <span className="text-consultx-grey">Annual Return Deadline:</span>
                  <span className="font-semibold">{comp.annualReturnDue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-consultx-grey">Beneficial Ownership:</span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
                      comp.beneficialOwnership === "current"
                        ? "text-consultx-green-dark"
                        : "text-amber-600"
                    }`}
                  >
                    {comp.beneficialOwnership === "current" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <CircleAlert className="h-3.5 w-3.5" />
                    )}
                    {comp.beneficialOwnership === "current" ? "Up to date" : "Filing required"}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
                <Link
                  href="/portal/services/cipc/"
                  className="inline-flex items-center gap-1 text-xs font-bold text-consultx-green-dark hover:underline"
                >
                  File Annual Return & BO <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/portal/services/onboard/?services=afs_company&company=${encodeURIComponent(comp.name)}`}
                  className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-semibold text-consultx-black hover:border-consultx-green"
                >
                  Order Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
}
