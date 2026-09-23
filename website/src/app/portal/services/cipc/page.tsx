"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Landmark,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { CIPC_DELIVERY_SPEC } from "@/lib/delivery-engine/cipc-spec";
import { demoCompanies } from "@/lib/platform";

interface BeneficialOwner {
  id: string;
  fullName: string;
  idNumber: string;
  percentage: number;
  isPep: boolean;
  docUploaded: boolean;
}

export default function CipcComplianceWorkspacePage() {
  const spec = CIPC_DELIVERY_SPEC;
  const [selectedCompanyId, setSelectedCompanyId] = useState(demoCompanies[0].id);
  const company = demoCompanies.find((c) => c.id === selectedCompanyId) || demoCompanies[0];

  // Turnover & Tier Calculator
  const [turnoverBand, setTurnoverBand] = useState<string>("under_1m");
  const [isLate, setIsLate] = useState<boolean>(false);

  // Beneficial Owners Cascade
  const [owners, setOwners] = useState<BeneficialOwner[]>([
    {
      id: "bo-1",
      fullName: "Craig Ulyate",
      idNumber: "7809155024083",
      percentage: 75,
      isPep: false,
      docUploaded: true,
    },
    {
      id: "bo-2",
      fullName: "Sarah Ulyate",
      idNumber: "8204120194087",
      percentage: 25,
      isPep: false,
      docUploaded: false,
    },
  ]);

  const [newOwnerName, setNewOwnerName] = useState("");
  const [newOwnerId, setNewOwnerId] = useState("");
  const [newOwnerPct, setNewOwnerPct] = useState(0);

  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({
    certified_ids_shareholders: "Certified_IDs_Directors_Jan2026.pdf",
    securities_share_register: "Signed_Securities_Register.pdf",
  });

  // Calculate CIPC Statutory Fees based on turnover
  const getCipcStatutoryFee = (band: string, late: boolean) => {
    switch (band) {
      case "under_1m":
        return late ? 150 : 100;
      case "1m_to_10m":
        return late ? 600 : 450;
      case "10m_to_25m":
        return late ? 2500 : 2000;
      case "over_25m":
        return late ? 4000 : 3000;
      default:
        return late ? 150 : 100;
    }
  };

  const consultxFee = 850; // Fixed professional filing fee
  const cipcStatutoryFee = getCipcStatutoryFee(turnoverBand, isLate);
  const totalDue = consultxFee + cipcStatutoryFee;

  const totalShareholding = owners.reduce((sum, o) => sum + o.percentage, 0);
  const isCapTableValid = totalShareholding === 100;

  const addOwner = () => {
    if (!newOwnerName || !newOwnerId || newOwnerPct <= 0) return;
    const newOwner: BeneficialOwner = {
      id: `bo-${Date.now()}`,
      fullName: newOwnerName,
      idNumber: newOwnerId,
      percentage: Number(newOwnerPct),
      isPep: false,
      docUploaded: false,
    };
    setOwners([...owners, newOwner]);
    setNewOwnerName("");
    setNewOwnerId("");
    setNewOwnerPct(0);
  };

  const removeOwner = (id: string) => {
    setOwners(owners.filter((o) => o.id !== id));
  };

  const formatZar = (val: number) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(val);

  return (
    <PortalShell>
      <div className="mx-auto max-w-6xl pb-16">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-consultx-grey">
          <Link href="/portal/services/" className="hover:text-consultx-green-dark flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> My Services
          </Link>
          <span>/</span>
          <span className="text-consultx-black">CIPC & Statutory Hub</span>
        </div>

        {/* Header Banner */}
        <div className="mt-4 rounded-2xl bg-consultx-black p-6 md:p-8 text-white shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-consultx-green/20 px-2.5 py-0.5 text-xs font-bold text-consultx-green font-mono">
                  CIPC STATUTORY HUB
                </span>
                <span className="rounded-md bg-white/10 px-2.5 py-0.5 text-xs font-medium text-gray-300">
                  Companies Act 71 of 2008 s33
                </span>
                <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-400">
                  Filing Window Open
                </span>
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
                CIPC Annual Return & Beneficial Ownership Workspace
              </h1>
              <p className="mt-2 text-sm text-gray-300 max-w-2xl leading-relaxed">
                Maintain good standing with the Companies and Intellectual Property Commission. Prevent administrative deregistration, asset forfeiture, and bank account freezes.
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
                    {c.name} ({c.registrationNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block">Registration Number</span>
              <strong className="text-sm font-bold text-white font-mono">{company.registrationNumber}</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Statutory Anniversary</span>
              <strong className="text-sm font-bold text-white">{company.annualReturnDue}</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Beneficial Ownership Status</span>
              <strong className="text-sm font-bold text-amber-400">Update Required (2026)</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Filing Fee Estimate</span>
              <strong className="text-sm font-bold text-consultx-green font-mono">{formatZar(totalDue)}</strong>
            </div>
          </div>
        </div>

        {/* Section 1: 4-Stage Filing Progression */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShieldCheck className="h-5 w-5 text-consultx-green-dark" />
            Statutory Lodgement Pipeline
          </h2>

          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {spec.workflowStages.map((stg) => (
              <div
                key={stg.step}
                className={`rounded-xl border p-4 flex flex-col justify-between text-xs ${
                  stg.step === 2
                    ? "border-consultx-green bg-consultx-green-soft/20 shadow-xs"
                    : stg.step === 1
                    ? "border-gray-200 bg-gray-50/60"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-consultx-black text-white text-[11px] font-bold">
                      {stg.step}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      ~{stg.estimatedDurationHours}h
                    </span>
                  </div>
                  <strong className="mt-2 block font-bold text-consultx-black">{stg.title}</strong>
                  <p className="mt-1 text-consultx-grey text-[11px] leading-relaxed">{stg.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 text-[10px] text-consultx-charcoal font-semibold">
                  Actor: {stg.actor === "client" ? "You" : stg.actor === "craig_ca_sa" ? "Craig CA(SA)" : "Automated Engine"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Turnover Tier & Statutory Fee Calculator */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2">
                <Landmark className="h-5 w-5 text-consultx-green-dark" />
                Turnover Bracket & Statutory Fee Assessment
              </h2>
              <p className="text-xs text-consultx-grey mt-0.5">
                CIPC statutory fees are strictly determined by turnover reported in your latest approved financial statements.
              </p>
            </div>
            <span className="text-xs font-bold text-consultx-green-dark font-mono bg-consultx-green-soft px-3 py-1 rounded-full">
              Official 2026 CIPC Fee Table
            </span>
          </div>

          <div className="mt-6 grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-4 text-xs">
              <label className="font-bold text-consultx-black block">
                Select Gross Annual Turnover Bracket:
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { id: "under_1m", label: "Under R1,000,000", desc: "SME / Micro business / Dormant", stat: "R100 statutory" },
                  { id: "1m_to_10m", label: "R1,000,000 to R10,000,000", desc: "Small to Medium Enterprise", stat: "R450 statutory" },
                  { id: "10m_to_25m", label: "R10,000,000 to R25,000,000", desc: "Mid-Market Commercial", stat: "R2,000 statutory" },
                  { id: "over_25m", label: "Over R25,000,000", desc: "Large Corporate Entity", stat: "R3,000 statutory" },
                ].map((band) => (
                  <button
                    key={band.id}
                    type="button"
                    onClick={() => setTurnoverBand(band.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      turnoverBand === band.id
                        ? "border-consultx-green bg-consultx-green-soft/30 ring-1 ring-consultx-green"
                        : "border-gray-200 bg-white hover:border-consultx-green/40"
                    }`}
                  >
                    <div className="font-bold text-consultx-black">{band.label}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{band.desc}</div>
                    <div className="text-[11px] font-mono font-semibold text-consultx-green-dark mt-1">
                      {band.stat}
                    </div>
                  </button>
                ))}
              </div>

              {/* Late Penalty Toggle */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl border border-consultx-border bg-gray-50 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isLate}
                  onChange={(e) => setIsLate(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#72c600]"
                />
                <div>
                  <strong className="text-consultx-black block">Filing is more than 30 business days overdue</strong>
                  <span className="text-gray-500 block mt-0.5">
                    CIPC levies a statutory penalty surcharge (+R50 to +R1,000 depending on turnover bracket).
                  </span>
                </div>
              </label>
            </div>

            {/* Fee Breakdown Box */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-consultx-black p-5 text-white">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Itemised Statutory Invoice Breakdown
                </span>

                <div className="mt-4 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">ConsultX Professional Mandate:</span>
                    <span className="font-bold text-white">{formatZar(consultxFee)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">
                      CIPC Official Statutory Fee {isLate && "(Late) "}:
                    </span>
                    <span className="font-bold text-white">{formatZar(cipcStatutoryFee)}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-gray-300">Beneficial Ownership (BO) Filing:</span>
                    <span className="font-bold text-consultx-green">INCLUDED FREE</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base">
                    <span className="font-sans font-bold text-white">Total Statutory Payable:</span>
                    <span className="font-extrabold text-consultx-green">{formatZar(totalDue)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-[11px] text-gray-400 leading-tight">
                  Fee includes full CIPC credit account processing, certificate lodgement, BO XML validation, and 12-month compliance guarantee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Beneficial Ownership (BO) Cascade Builder */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-consultx-green-dark" />
                <h2 className="text-lg font-bold text-consultx-black">
                  Beneficial Ownership (BO) Cascade Builder
                </h2>
                <span className="rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                  Mandatory under General Laws Act 2022
                </span>
              </div>
              <p className="text-xs text-consultx-grey mt-0.5">
                Declare all natural persons holding 5% or more direct or indirect beneficial interest or effective control.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold font-mono px-3 py-1 rounded-full ${
                isCapTableValid ? "bg-consultx-green-soft text-consultx-green-dark" : "bg-amber-100 text-amber-800"
              }`}>
                Total Declared: {totalShareholding}% {isCapTableValid ? "✓ Balanced" : "⚠ Must Equal 100%"}
              </span>
            </div>
          </div>

          {/* Active Owners Table */}
          <div className="mt-6 overflow-hidden rounded-xl border border-consultx-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Beneficial Owner Name</th>
                  <th className="py-3 px-4">SA ID / Passport</th>
                  <th className="py-3 px-4 text-center">Holding %</th>
                  <th className="py-3 px-4">Certified ID Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {owners.map((owner) => (
                  <tr key={owner.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-bold text-consultx-black flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-consultx-green-dark" />
                      {owner.fullName}
                      {owner.isPep && (
                        <span className="rounded bg-amber-100 text-amber-800 px-1.5 py-0.2 text-[9px] font-bold">
                          PEP
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">{owner.idNumber}</td>
                    <td className="py-3 px-4 font-mono font-bold text-consultx-black text-center">
                      {owner.percentage}%
                    </td>
                    <td className="py-3 px-4">
                      {owner.docUploaded ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-consultx-green-dark">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Certified & Verified
                        </span>
                      ) : (
                        <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 cursor-pointer hover:underline">
                          <Upload className="h-3 w-3" /> Upload Certified Copy
                          <input
                            type="file"
                            className="sr-only"
                            onChange={() => {
                              setOwners(owners.map((o) => (o.id === owner.id ? { ...o, docUploaded: true } : o)));
                            }}
                          />
                        </label>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {owners.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOwner(owner.id)}
                          className="text-gray-400 hover:text-rose-600 transition"
                          title="Remove Owner"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Beneficial Owner Form */}
          <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div className="text-xs font-bold text-consultx-black mb-3">Add Another Beneficial Owner (Natural Person)</div>
            <div className="grid sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                placeholder="Full Legal Name"
                value={newOwnerName}
                onChange={(e) => setNewOwnerName(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none focus:border-consultx-green"
              />
              <input
                type="text"
                placeholder="SA ID or Foreign Passport"
                value={newOwnerId}
                onChange={(e) => setNewOwnerId(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none focus:border-consultx-green font-mono"
              />
              <input
                type="number"
                placeholder="Shareholding % (e.g. 20)"
                value={newOwnerPct || ""}
                onChange={(e) => setNewOwnerPct(Number(e.target.value))}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 outline-none focus:border-consultx-green font-mono"
              />
              <button
                type="button"
                onClick={addOwner}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-consultx-black px-4 py-2 font-bold text-white hover:bg-gray-800 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add to Register
              </button>
            </div>
          </div>
        </section>

        {/* Section 4: Document Upload & Statutory Mandate Resolution */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-consultx-black flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileCheck2 className="h-5 w-5 text-consultx-green-dark" />
            Statutory Document Verification Checklist
          </h2>

          <div className="mt-4 divide-y divide-gray-100 text-xs">
            {spec.documentRequirements.map((doc) => {
              const uploaded = uploadedDocs[doc.id];
              return (
                <div key={doc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-consultx-black font-semibold">{doc.name}</strong>
                      {doc.mandatory && (
                        <span className="rounded bg-rose-100 px-1.5 py-0.2 text-[9px] font-bold text-rose-700">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 mt-0.5 text-[11px]">{doc.description}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {uploaded ? (
                      <span className="inline-flex items-center gap-1 text-consultx-green-dark font-semibold">
                        <CheckCircle2 className="h-4 w-4" /> {uploaded}
                      </span>
                    ) : (
                      <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-consultx-border bg-white px-3 py-1.5 font-bold text-consultx-black hover:border-consultx-green">
                        <Upload className="h-3 w-3 text-consultx-green-dark" /> Upload
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setUploadedDocs((prev) => ({ ...prev, [doc.id]: e.target.files![0].name }));
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

        {/* Section 5: Authorisation & Checkout Rail */}
        <section className="mt-8 rounded-2xl border border-consultx-border bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-consultx-black">
                Ready to Authorise & Lodge Filing?
              </h3>
              <p className="text-xs text-consultx-grey mt-0.5">
                Total statutory lodgement fee: <strong className="text-consultx-black font-mono">{formatZar(totalDue)}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/portal/services/onboard/?services=cipc_annual_return&company=${encodeURIComponent(company.name)}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 text-xs font-bold text-white hover:bg-consultx-green-dark transition shadow-soft"
              >
                <CreditCard className="h-4 w-4" /> Continue to Secure Payment & Mandate <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
