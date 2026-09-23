import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  Landmark,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { demoCompanies, demoJobs } from "@/lib/platform";

export default function PortalPage() {
  const company = demoCompanies[0];
  const job = demoJobs[0];

  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl pb-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-consultx-green-dark">CLIENT PORTAL</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl text-consultx-black">
              Good morning, Craig
            </h1>
            <p className="mt-2 text-consultx-charcoal text-sm">
              Your registered companies, compliance cockpits and statutory deliverables in one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/portal/services/onboard/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-4 py-3 text-sm font-bold text-white transition hover:bg-consultx-green-dark shadow-soft"
            >
              <Plus className="h-4 w-4" /> Order Service
            </Link>
            <Link
              href="/portal/companies/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-black px-4 py-3 text-sm font-bold text-white transition hover:bg-consultx-charcoal"
            >
              <Building2 className="h-4 w-4" /> View Companies
            </Link>
          </div>
        </div>

        {/* AnNa AI Assistant Quick Intake Widget */}
        <section className="mt-8 rounded-2xl bg-consultx-black p-6 text-white shadow-soft">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-consultx-green text-white">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">Ask AnNa AI Solution Advisor</h2>
                  <span className="rounded bg-consultx-green/20 px-2 py-0.5 text-[10px] font-bold text-consultx-green font-mono">
                    CA(SA) POWERED
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-300 max-w-xl leading-relaxed">
                  Need a quick fee calculation, statutory diagnostic, or custom advisory scope? Ask AnNa for instant fixed quotes across all 63 services.
                </p>
              </div>
            </div>

            <Link
              href="/advisor/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-consultx-green px-5 py-3 text-xs font-bold text-white hover:bg-consultx-green-dark transition shrink-0"
            >
              <Sparkles className="h-4 w-4" /> Open Full AI Chat <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Action Prompt Chips */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-gray-400 font-semibold mr-1">Quick Inquiries:</span>
            <Link
              href="/advisor/?prompt=I%20need%20an%20independent%20business%20valuation%20for%20a%20shareholder%20buyout"
              className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 text-gray-200 transition flex items-center gap-1.5"
            >
              <TrendingUp className="h-3.5 w-3.5 text-consultx-green" />
              Independent Business Valuation
            </Link>
            <Link
              href="/advisor/?prompt=I%20need%20to%20file%20my%20company%20CIPC%20annual%20return%20and%20beneficial%20ownership"
              className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 text-gray-200 transition flex items-center gap-1.5"
            >
              <Landmark className="h-3.5 w-3.5 text-consultx-green" />
              CIPC Annual Return & Beneficial Ownership
            </Link>
            <Link
              href="/advisor/?prompt=I%20need%20a%20SARS%20Tax%20Compliance%20Status%20TCS%20PIN"
              className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 text-gray-200 transition flex items-center gap-1.5"
            >
              <Award className="h-3.5 w-3.5 text-consultx-green" />
              SARS Tax Clearance PIN
            </Link>
            <Link
              href="/advisor/?prompt=I%20need%20monthly%20accounting%20and%20payroll%20for%20my%20business"
              className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 px-3 py-1.5 text-gray-200 transition flex items-center gap-1.5"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-consultx-green" />
              Monthly Accounting & Payroll
            </Link>
          </div>
        </section>

        {/* Key Health Metrics */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-consultx-black p-6 text-white shadow-soft">
            <ShieldCheck className="h-6 w-6 text-consultx-green" />
            <p className="mt-7 text-sm text-white/70">Compliance Health</p>
            <p className="mt-1 text-4xl font-bold">{company.complianceScore}%</p>
            <p className="mt-2 text-xs text-white/75">for {company.name}</p>
          </div>

          <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
            <CircleAlert className="h-6 w-6 text-amber-500" />
            <p className="mt-7 text-sm font-semibold text-consultx-grey">Action Required</p>
            <p className="mt-1 text-3xl font-bold text-consultx-black">1</p>
            <p className="mt-2 text-xs text-consultx-charcoal">
              Annual return & BO information needed for {company.name}.
            </p>
          </div>

          <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
            <FileCheck2 className="h-6 w-6 text-consultx-teal" />
            <p className="mt-7 text-sm font-semibold text-consultx-grey">Secure Documents</p>
            <p className="mt-1 text-3xl font-bold text-consultx-black">3</p>
            <p className="mt-2 text-xs text-consultx-charcoal">
              Signed AFS, TCS PIN, and COR14.3 certificates archived.
            </p>
          </div>
        </section>

        {/* Priority Action Card */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-5 shadow-soft md:p-7">
          <div className="flex flex-col justify-between gap-4 border-b border-consultx-border pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold text-consultx-green-dark">NEXT PRIORITY ACTION</p>
              <h2 className="mt-1 text-xl font-bold text-consultx-black">
                File CIPC Annual Return & Beneficial Ownership Register
              </h2>
            </div>
            <StatusBadge status={job.status} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="font-semibold text-consultx-black">{company.name}</p>
              <p className="mt-1 text-sm text-consultx-grey">
                Registration: {company.registrationNumber} · Due: {company.annualReturnDue}
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-consultx-charcoal">
                {job.nextAction} Complete the interactive turnover tier assessment and beneficial ownership cascade builder before statutory filing.
              </p>
            </div>
            <Link
              href="/portal/services/cipc/"
              className="inline-flex h-fit items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 text-sm font-bold text-white transition hover:bg-consultx-green-dark shadow-soft"
            >
              Open CIPC Workspace <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Specialized Workspaces Quick Navigation */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-consultx-black">Specialized Statutory Workspaces</h2>
          <p className="text-xs text-consultx-grey mt-0.5">
            Dedicated end-to-end cockpits with standardized SOP workflows and document vaults.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Link
              href="/portal/services/valuation/"
              className="group rounded-xl border border-consultx-border bg-white p-5 hover:border-consultx-green transition shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-consultx-green-soft text-consultx-green-dark group-hover:scale-105 transition">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-sm text-consultx-black group-hover:text-consultx-green-dark">
                  Business Valuation Cockpit
                </h3>
                <p className="mt-1 text-xs text-consultx-grey leading-relaxed">
                  Interactive earnings normalization tool, WACC simulator, and 6-stage IVS delivery tracker.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-consultx-green-dark">
                Open Cockpit <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href="/portal/services/cipc/"
              className="group rounded-xl border border-consultx-border bg-white p-5 hover:border-consultx-green transition shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-consultx-green-soft text-consultx-green-dark group-hover:scale-105 transition">
                  <Landmark className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-sm text-consultx-black group-hover:text-consultx-green-dark">
                  CIPC Statutory Hub
                </h3>
                <p className="mt-1 text-xs text-consultx-grey leading-relaxed">
                  Turnover tier calculator, Beneficial Ownership cascade builder, and automated lodgements.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-consultx-green-dark">
                Open Workspace <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>

            <Link
              href="/portal/services/tax/"
              className="group rounded-xl border border-consultx-border bg-white p-5 hover:border-consultx-green transition shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-consultx-green-soft text-consultx-green-dark group-hover:scale-105 transition">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-sm text-consultx-black group-hover:text-consultx-green-dark">
                  SARS Tax & TCS PIN Center
                </h3>
                <p className="mt-1 text-xs text-consultx-grey leading-relaxed">
                  Multi-tax head status monitor, deficiency remediation, and official Good Standing PIN generation.
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-consultx-green-dark">
                Open Tax Hub <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </section>

        {/* My Companies Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-consultx-black">My Registered Companies</h2>
            <Link href="/portal/companies/" className="text-sm font-bold text-consultx-green-dark hover:underline">
              View all ({demoCompanies.length})
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {demoCompanies.map((item) => (
              <article key={item.id} className="rounded-xl border border-consultx-border bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <Building2 className="h-5 w-5 text-consultx-green-dark" />
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      item.complianceScore === 100
                        ? "bg-consultx-green-soft text-consultx-green-dark"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.complianceScore}% compliant
                  </span>
                </div>
                <h3 className="mt-4 font-bold text-consultx-black text-base">{item.name}</h3>
                <p className="mt-1 text-xs text-consultx-grey font-mono">{item.registrationNumber}</p>
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      item.beneficialOwnership === "current" ? "text-consultx-green-dark" : "text-amber-500"
                    }`}
                  />
                  <span className="text-consultx-charcoal">
                    Beneficial ownership:{" "}
                    <strong>{item.beneficialOwnership === "current" ? "Current" : "Needs attention"}</strong>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
