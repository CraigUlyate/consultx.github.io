"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileSpreadsheet,
  HelpCircle,
  Info,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Upload,
  UserCheck,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { VALUATION_DELIVERY_SPEC } from "@/lib/delivery-engine/valuation-spec";

export default function BusinessValuationWorkspacePage() {
  const spec = VALUATION_DELIVERY_SPEC;

  // Active workflow stage state
  const [activeStageStep, setActiveStageStep] = useState(3);
  const [expandedStage, setExpandedStage] = useState<number | null>(3);

  // Earnings Normalization Calculator State
  const [reportedEbitda, setReportedEbitda] = useState<number>(2450000);
  const [ownerSalaryAddback, setOwnerSalaryAddback] = useState<number>(550000);
  const [discretionaryExpenses, setDiscretionaryExpenses] = useState<number>(220000);
  const [nonRecurringItems, setNonRecurringItems] = useState<number>(180000);
  const [nonOperatingDeductions, setNonOperatingDeductions] = useState<number>(50000);

  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { fileName: string; date: string }>>({
    afs_3_years: { fileName: "Signed_AFS_FY2023_FY2025.pdf", date: "Yesterday, 14:22" },
    interim_management_accounts: { fileName: "YTD_Trial_Balance_Jan2026.xlsx", date: "Today, 09:15" },
    shareholder_structure: { fileName: "Share_Register_CapTable.pdf", date: "Today, 09:18" },
  });

  // Calculate Normalized EBITDA
  const normalizedEbitda =
    reportedEbitda + ownerSalaryAddback + discretionaryExpenses + nonRecurringItems - nonOperatingDeductions;
  const ebitdaUplift = normalizedEbitda - reportedEbitda;
  const upliftPercentage = ((ebitdaUplift / reportedEbitda) * 100).toFixed(1);

  // Indicative Valuation Multiples
  const multipleLow = 4.2;
  const multipleHigh = 5.8;
  const indicativeValLow = normalizedEbitda * multipleLow;
  const indicativeValHigh = normalizedEbitda * multipleHigh;

  const formatZar = (val: number) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(val);

  const handleSimulatedUpload = (docId: string, name: string) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docId]: { fileName: name, date: "Just now" },
    }));
  };

  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-consultx-grey">
          <Link href="/portal/services/" className="hover:text-consultx-green-dark flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> My Services
          </Link>
          <span>/</span>
          <span className="text-consultx-black">Valuation Workspace</span>
        </div>

        {/* Header Banner */}
        <div className="mt-4 rounded-2xl bg-consultx-black p-6 md:p-8 text-white shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-consultx-green/20 px-2.5 py-0.5 text-xs font-bold text-consultx-green font-mono">
                  MANDATE #VAL-2026-084
                </span>
                <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                  IVS 2025 Compliant
                </span>
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                  Stage 3 of 6 In Progress
                </span>
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
                Independent Business Valuation Cockpit
              </h1>
              <p className="mt-2 text-sm text-gray-300 max-w-2xl leading-relaxed">
                {spec.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-xs">
                <div className="text-gray-400">Lead Valuer:</div>
                <div className="font-bold text-white mt-0.5 flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4 text-consultx-green" /> {spec.leadProfessional}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">SAICA Registered CA(SA)</div>
              </div>
              <a
                href="mailto:craig@consultx.co.za?subject=Valuation%20Mandate%20VAL-2026-084"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-4 py-2.5 text-xs font-bold text-white hover:bg-consultx-green-dark transition"
              >
                <MessageSquare className="h-3.5 w-3.5" /> Contact Craig CA(SA)
              </a>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block">Typical Turnaround</span>
              <strong className="text-sm font-bold text-white">{spec.typicalTurnaroundDays} Business Days</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Documents Verified</span>
              <strong className="text-sm font-bold text-consultx-green">3 of 4 Uploaded</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Next Milestone</span>
              <strong className="text-sm font-bold text-white">Scoping Interview</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Estimated Delivery</span>
              <strong className="text-sm font-bold text-white">Within 8 Days</strong>
            </div>
          </div>
        </div>

        {/* Section 1: Interactive 6-Stage SOP Delivery Pipeline */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-consultx-green-dark" />
                Standard Operating Procedure (SOP) Delivery Pipeline
              </h2>
              <p className="text-xs text-consultx-grey mt-0.5">
                Every milestone adheres to International Valuation Standards (IVS) and SAICA code of ethics.
              </p>
            </div>
            <span className="text-xs font-semibold text-consultx-charcoal bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
              Click any step to inspect deliverables
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {spec.workflowStages.map((stage) => {
              const isCurrent = stage.step === activeStageStep;
              const isPast = stage.step < activeStageStep;
              const isExpanded = expandedStage === stage.step;

              return (
                <div
                  key={stage.step}
                  className={`rounded-xl border transition-all ${
                    isCurrent
                      ? "border-consultx-green bg-consultx-green-soft/20 shadow-xs"
                      : isPast
                      ? "border-gray-200 bg-white"
                      : "border-gray-200 bg-gray-50/50 opacity-80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedStage(isExpanded ? null : stage.step);
                      setActiveStageStep(stage.step);
                    }}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                          isPast
                            ? "bg-consultx-green text-white"
                            : isCurrent
                            ? "bg-consultx-black text-white ring-4 ring-consultx-green/30"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isPast ? <CheckCircle2 className="h-5 w-5" /> : stage.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-consultx-black">{stage.title}</h3>
                          {isCurrent && (
                            <span className="rounded bg-consultx-green px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                              Active Stage
                            </span>
                          )}
                          <span className="text-[11px] text-gray-500 font-mono">
                            [{stage.actor === "client" ? "Client Action" : stage.actor === "craig_ca_sa" ? "Craig CA(SA)" : "Automated Engine"}]
                          </span>
                        </div>
                        <p className="text-xs text-consultx-grey mt-0.5 line-clamp-1">{stage.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500 hidden sm:inline flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-gray-400" /> ~{stage.estimatedDurationHours}h
                      </span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 p-5 bg-white rounded-b-xl text-xs space-y-4">
                      <p className="text-consultx-charcoal leading-relaxed">{stage.actionDescription}</p>

                      <div className="grid sm:grid-cols-2 gap-4 pt-2">
                        <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                          <strong className="text-consultx-black block font-semibold mb-1 text-[11px] uppercase tracking-wider">
                            Inputs Required:
                          </strong>
                          <ul className="list-disc pl-4 space-y-1 text-gray-600">
                            {stage.inputsRequired.map((input) => (
                              <li key={input}>{input}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-lg bg-consultx-green-soft/40 p-3 border border-consultx-green/20">
                          <strong className="text-consultx-green-dark block font-semibold mb-1 text-[11px] uppercase tracking-wider">
                            Deliverables Generated:
                          </strong>
                          <ul className="list-disc pl-4 space-y-1 text-consultx-charcoal">
                            {stage.deliverablesGenerated.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {stage.craigChecklistItems && (
                        <div className="rounded-lg bg-amber-50/70 p-3 border border-amber-200/60">
                          <strong className="text-amber-900 block font-semibold mb-1 text-[11px] uppercase tracking-wider">
                            CA(SA) Independent Quality Audit Checklist:
                          </strong>
                          <div className="grid sm:grid-cols-2 gap-2 mt-1">
                            {stage.craigChecklistItems.map((chk) => (
                              <div key={chk} className="flex items-center gap-2 text-amber-900">
                                <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                                <span>{chk}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Interactive Earnings Normalization Calculator */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-consultx-green-dark" />
                <h2 className="text-lg font-bold text-consultx-black">
                  Interactive Earnings Normalization Tool
                </h2>
                <span className="rounded bg-consultx-green-soft px-2 py-0.5 text-[11px] font-bold text-consultx-green-dark">
                  IVS Income Approach
                </span>
              </div>
              <p className="text-xs text-consultx-grey mt-0.5">
                Adjust historical accounting profits to true sustainable commercial cash flows. Add-backs directly increase your company’s enterprise value.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-500 block">Value Multiple Range</span>
              <span className="font-mono text-xs font-bold text-consultx-black">{multipleLow}x – {multipleHigh}x EBITDA</span>
            </div>
          </div>

          <div className="mt-6 grid lg:grid-cols-12 gap-6">
            {/* Input Sliders & Fields */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-consultx-black">1. Reported Historical Operating EBITDA</label>
                  <span className="font-mono font-bold text-consultx-black text-sm">{formatZar(reportedEbitda)}</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="15000000"
                  step="50000"
                  value={reportedEbitda}
                  onChange={(e) => setReportedEbitda(Number(e.target.value))}
                  className="w-full accent-[#72c600] cursor-pointer"
                />
                <span className="text-[11px] text-gray-500">Unadjusted EBITDA from the latest signed AFS or management accounts.</span>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="font-semibold text-consultx-charcoal text-[11px] uppercase tracking-wider">
                  Owner Normalization Add-Backs (+)
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-consultx-black">
                      Director Salary Above Commercial Rate
                      <span className="block text-[10px] text-gray-500">Excess paid above market replacement GM salary</span>
                    </label>
                    <span className="font-mono font-bold text-consultx-green-dark">+{formatZar(ownerSalaryAddback)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000000"
                    step="25000"
                    value={ownerSalaryAddback}
                    onChange={(e) => setOwnerSalaryAddback(Number(e.target.value))}
                    className="w-full accent-[#72c600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-consultx-black">
                      Discretionary & Personal Perks
                      <span className="block text-[10px] text-gray-500">Personal vehicles, family mobile plans, travel, entertainment</span>
                    </label>
                    <span className="font-mono font-bold text-consultx-green-dark">+{formatZar(discretionaryExpenses)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={discretionaryExpenses}
                    onChange={(e) => setDiscretionaryExpenses(Number(e.target.value))}
                    className="w-full accent-[#72c600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-consultx-black">
                      One-Off & Non-Recurring Extraordinary Costs
                      <span className="block text-[10px] text-gray-500">One-off legal disputes, relocation costs, insurance event repair</span>
                    </label>
                    <span className="font-mono font-bold text-consultx-green-dark">+{formatZar(nonRecurringItems)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={nonRecurringItems}
                    onChange={(e) => setNonRecurringItems(Number(e.target.value))}
                    className="w-full accent-[#72c600] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-consultx-black">
                      Non-Operating Revenue Deductions (-)
                      <span className="block text-[10px] text-gray-500">Interest income, one-off asset sale gains</span>
                    </label>
                    <span className="font-mono font-bold text-rose-600">-{formatZar(nonOperatingDeductions)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="10000"
                    value={nonOperatingDeductions}
                    onChange={(e) => setNonOperatingDeductions(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculated Results Card */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-consultx-black p-5 text-white">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Normalised Maintainable Earnings
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-consultx-green font-mono">
                    {formatZar(normalizedEbitda)}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-300">
                  <span className="rounded bg-consultx-green/20 px-2 py-0.5 font-bold text-consultx-green">
                    +{upliftPercentage}%
                  </span>
                  <span>vs historical book profits (+{formatZar(ebitdaUplift)})</span>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
                  <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Indicative Valuation Range:
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-[11px] text-gray-400">Conservative Baseline ({multipleLow}x):</div>
                    <div className="text-lg font-bold text-white font-mono">{formatZar(indicativeValLow)}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-consultx-green/10 border border-consultx-green/30">
                    <div className="text-[11px] text-consultx-green font-semibold">Strategic Premium Target ({multipleHigh}x):</div>
                    <div className="text-xl font-extrabold text-white font-mono">{formatZar(indicativeValHigh)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4 text-[11px] text-gray-400 leading-normal flex items-start gap-2">
                <Info className="h-4 w-4 text-consultx-green shrink-0 mt-0.5" />
                <span>
                  This simulation reflects maintainable EBITDA multiples. The final formal report synthesizes discrete 5-year Discounted Cash Flows (DCF) with company-specific risk premiums.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: WACC Discount Rate Methodology & Regulatory Standards */}
        <section className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
            <h3 className="text-base font-bold text-consultx-black flex items-center gap-2">
              <Award className="h-5 w-5 text-consultx-green-dark" />
              WACC & Cost of Capital Architecture
            </h3>
            <p className="mt-1 text-xs text-consultx-grey">
              How Craig CA(SA) builds a defensible discount rate for South African SME private businesses:
            </p>

            <div className="mt-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-700">SA 10-Year Bond (Rf):</span>
                <span className="font-bold text-consultx-black">10.50%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-700">SA Equity Risk Premium (ERP):</span>
                <span className="font-bold text-consultx-black">+6.00%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-700">SME Size & Illiquidity Alpha:</span>
                <span className="font-bold text-consultx-black">+3.50%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                <span className="text-gray-700">Specific Company Risk Premium:</span>
                <span className="font-bold text-consultx-black">+1.50%</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-consultx-black text-white">
                <span className="font-sans font-bold">Blended SME WACC:</span>
                <span className="font-bold text-consultx-green font-mono">16.85%</span>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
              Calculated using the Capital Asset Pricing Model (CAPM) with mid-year convention discounting for Free Cash Flows to Firm (FCFF).
            </p>
          </div>

          <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
            <h3 className="text-base font-bold text-consultx-black flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-consultx-green-dark" />
              Statutory & Transaction Safeguards
            </h3>
            <p className="mt-1 text-xs text-consultx-grey">
              Key risk checkpoints evaluated during the CA(SA) valuation review:
            </p>

            <ul className="mt-4 space-y-2.5 text-xs text-consultx-charcoal">
              {spec.knowledgeBase.riskCheckpoints.map((risk) => (
                <li key={risk} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-consultx-green-dark shrink-0 mt-0.5" />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 p-3 rounded-lg bg-consultx-green-soft border border-consultx-green/30 text-xs text-consultx-green-dark">
              <strong>Defensibility Guarantee:</strong> Accepted by SARS, major South African commercial banks (Investec, RMB, Standard Bank, Nedbank, FNB), and High Court proceedings.
            </div>
          </div>
        </section>

        {/* Section 4: Secure Financial Document Dropzone */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-consultx-green-dark" />
                Financial Document Vault & Intake Pack
              </h2>
              <p className="text-xs text-consultx-grey mt-0.5">
                All documents are encrypted with AES-256 in private Google Cloud Storage buckets.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-consultx-green-dark">
              Encrypted Vault · gs://consultx-client-vault/comp-001/valuations/
            </span>
          </div>

          <div className="mt-6 divide-y divide-gray-100">
            {spec.documentRequirements.map((doc) => {
              const uploaded = uploadedDocs[doc.id];
              return (
                <div key={doc.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-consultx-black">{doc.name}</strong>
                      {doc.mandatory ? (
                        <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[10px] font-bold text-rose-700">
                          Mandatory
                        </span>
                      ) : (
                        <span className="rounded bg-gray-100 px-1.5 py-0.2 text-[10px] font-medium text-gray-600">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-consultx-grey mt-1">{doc.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                      <span>Accepted: {doc.acceptedFormats.map((f) => f.split("/")[1] || f).join(", ")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {uploaded ? (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-xs font-bold text-consultx-black block">{uploaded.fileName}</span>
                          <span className="text-[10px] text-gray-400 block">{uploaded.date}</span>
                        </div>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-consultx-green-soft text-consultx-green-dark">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                      </div>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-consultx-border bg-white px-3.5 py-2 text-xs font-bold text-consultx-black hover:border-consultx-green hover:bg-consultx-green-soft/30 transition">
                        <Upload className="h-3.5 w-3.5 text-consultx-green-dark" />
                        Upload File
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleSimulatedUpload(doc.id, e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 5: Frequently Asked Valuation Questions */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2 border-b border-gray-100 pb-3">
            <HelpCircle className="h-5 w-5 text-consultx-green-dark" />
            Valuation Advisory & Methodological FAQs
          </h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {spec.knowledgeBase.frequentlyAskedQuestions.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 text-xs">
                <strong className="text-consultx-black block font-semibold mb-2">{faq.question}</strong>
                <p className="text-consultx-charcoal leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
