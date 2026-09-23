"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Copy,
  CreditCard,
  HelpCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { TAX_DELIVERY_SPEC } from "@/lib/delivery-engine/tax-spec";
import { demoCompanies } from "@/lib/platform";

export default function TaxComplianceWorkspacePage() {
  const spec = TAX_DELIVERY_SPEC;
  const [selectedCompanyId, setSelectedCompanyId] = useState(demoCompanies[0].id);
  const company = demoCompanies.find((c) => c.id === selectedCompanyId) || demoCompanies[0];

  const [pinCopied, setPinCopied] = useState(false);
  const [pinType, setPinType] = useState<string>("good_standing");

  const activeTcsPin = "98421074CS";
  const activeTaxNumber = "9482710384";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeTcsPin);
    setPinCopied(true);
    setTimeout(() => setPinCopied(false), 2000);
  };

  const taxHeads = [
    {
      name: "Corporate Income Tax (CIT)",
      head: "ITR14",
      status: "Compliant",
      lastFiling: "FY2025 Assessed",
      balanceDue: "R 0.00",
      isClean: true,
    },
    {
      name: "Value-Added Tax (VAT)",
      head: "VAT201",
      status: "Compliant",
      lastFiling: "Period 2026/01 Submitted",
      balanceDue: "R 0.00",
      isClean: true,
    },
    {
      name: "Payroll Taxes (PAYE / UIF / SDL)",
      head: "EMP201 / EMP501",
      status: "Compliant",
      lastFiling: "EMP201 Jan 2026 Paid",
      balanceDue: "R 0.00",
      isClean: true,
    },
    {
      name: "Provisional Tax (IRP6)",
      head: "IRP6 (1st & 2nd)",
      status: "Upcoming",
      lastFiling: "2nd Period Due 28 Feb 2026",
      balanceDue: "Estimated R 14,200",
      isClean: true,
    },
  ];

  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-consultx-grey">
          <Link href="/portal/services/" className="hover:text-consultx-green-dark flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> My Services
          </Link>
          <span>/</span>
          <span className="text-consultx-black">SARS Tax Workspace</span>
        </div>

        {/* Header Banner */}
        <div className="mt-4 rounded-2xl bg-consultx-black p-6 md:p-8 text-white shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-consultx-green/20 px-2.5 py-0.5 text-xs font-bold text-consultx-green font-mono">
                  SARS eFILING INTEGRATION
                </span>
                <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                  Tax Administration Act 2011
                </span>
                <span className="rounded-md bg-consultx-green/20 px-2.5 py-0.5 text-xs font-bold text-consultx-green">
                  Active TCS Good Standing
                </span>
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
                SARS Tax Health Check & TCS PIN Hub
              </h1>
              <p className="mt-2 text-sm text-gray-300 max-w-2xl leading-relaxed">
                Live compliance status monitoring across all SARS tax heads. Generate, renew, and verify your 10-character Tax Compliance Status PIN for commercial tenders, enterprise contracts, and banking facilities.
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              <label className="text-xs text-gray-400">Select Active Company:</label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-consultx-green"
              >
                {demoCompanies.map((c) => (
                  <option key={c.id} value={c.id} className="text-consultx-black">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active TCS PIN Box */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-consultx-green/20 text-consultx-green">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Active SARS Verification PIN</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl md:text-2xl font-mono font-extrabold text-white tracking-wider">
                    {activeTcsPin}
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1 rounded bg-white/10 hover:bg-white/20 px-2 py-1 text-[11px] font-bold text-consultx-green transition"
                  >
                    <Copy className="h-3 w-3" />
                    {pinCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-xs">
              <span className="text-gray-400">Tax Reference No: <span className="font-mono text-white font-bold">{activeTaxNumber}</span></span>
              <span className="text-gray-400 mt-1">Expiry Date: <span className="text-consultx-green font-bold">28 Jan 2027 (Compliant)</span></span>
            </div>
          </div>
        </div>

        {/* Section 1: 4 Tax Heads Compliance Matrix */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2">
                <Award className="h-5 w-5 text-consultx-green-dark" />
                SARS Multi-Tax Head Compliance Scorecard
              </h2>
              <p className="text-xs text-consultx-grey mt-0.5">
                Every SARS tax head must be 100% up to date for Good Standing status to remain valid.
              </p>
            </div>
            <span className="text-xs font-bold text-consultx-green-dark bg-consultx-green-soft px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> 100% Return Compliance
            </span>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {taxHeads.map((head) => (
              <div
                key={head.head}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-gray-500 font-bold bg-gray-100 px-1.5 py-0.5 rounded">
                      {head.head}
                    </span>
                    <span className="text-xs font-bold text-consultx-green-dark flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {head.status}
                    </span>
                  </div>
                  <strong className="mt-3 block text-sm font-bold text-consultx-black">{head.name}</strong>
                  <p className="mt-1 text-xs text-gray-600">{head.lastFiling}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400">Balance:</span>
                  <span className="font-mono font-bold text-consultx-black">{head.balanceDue}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Request New PIN or Renewal */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-consultx-green-dark" />
                Issue or Renew Tax Compliance Status (TCS PIN)
              </h2>
              <p className="text-xs text-consultx-grey mt-0.5">
                Apply for a new PIN or resolve SARS non-compliance stops before tender submission deadlines.
              </p>
            </div>
            <span className="text-xs font-bold font-mono text-consultx-black">
              Standard Rate: R 1,250
            </span>
          </div>

          <div className="mt-6 grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-4 text-xs">
              <label className="font-bold text-consultx-black block">Select TCS PIN Purpose:</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { id: "good_standing", title: "Good Standing", desc: "General commercial and banking verification" },
                  { id: "tender", title: "Tender Application", desc: "Government and enterprise public procurement" },
                  { id: "fia", title: "Foreign Investment (FIA)", desc: "Offshore capital transfers / SARB clearance" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPinType(item.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      pinType === item.id
                        ? "border-consultx-green bg-consultx-green-soft/30 ring-1 ring-consultx-green"
                        : "border-gray-200 bg-white hover:border-consultx-green/40"
                    }`}
                  >
                    <div className="font-bold text-consultx-black">{item.title}</div>
                    <div className="text-[11px] text-gray-500 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="font-bold text-consultx-black">What Craig CA(SA) does for this mandate:</div>
                <ul className="space-y-1.5 text-consultx-charcoal list-disc pl-4 text-[11px]">
                  <li>Comprehensive diagnostic review of all Statement of Accounts on SARS eFiling</li>
                  <li>Identification of unallocated payments or erroneous administrative penalties</li>
                  <li>Lodgement of formal TCS request on SARS eFiling with registered tax practitioner authority</li>
                  <li>Delivery of official SARS Tax Compliance Status PIN Certificate (PDF)</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between rounded-xl bg-consultx-black p-5 text-white">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Fixed Professional Mandate
                </span>
                <div className="mt-2 text-2xl font-bold font-mono text-consultx-green">
                  R 1,250
                </div>
                <p className="mt-1 text-xs text-gray-300">
                  Turnaround: 1–3 business days. Includes 12-month compliance guarantee.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link
                  href={`/portal/services/onboard/?services=tax_clearance&company=${encodeURIComponent(company.name)}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green py-3 text-xs font-bold text-white hover:bg-consultx-green-dark transition"
                >
                  <CreditCard className="h-4 w-4" /> Order TCS PIN Service <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Frequently Asked Tax Questions */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2 border-b border-gray-100 pb-3">
            <HelpCircle className="h-5 w-5 text-consultx-green-dark" />
            SARS Tax Compliance FAQs
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
