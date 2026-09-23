"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Landmark,
  TrendingUp,
  Upload,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";

interface CipcJobData {
  id: string;
  companyName: string;
  regNumber: string;
  turnover: number;
  tierFee: number;
  consultxFee: number;
  lateFee: boolean;
  status: "READY_TO_FILE" | "COMPLETED" | "HOLD";
  clientAuthorizedAt: string;
  paidVia: string;
  beneficialOwners: {
    fullName: string;
    idNumber: string;
    percentage: number;
    isPep: boolean;
  }[];
  certificateUploaded?: string;
}

interface TaxJobData {
  id: string;
  companyName: string;
  taxNumber: string;
  purpose: string;
  status: "READY_FOR_SARS" | "COMPLETED";
  clientAuthorizedAt: string;
  paidVia: string;
  issuedPin?: string;
  pinExpiry?: string;
  certificateUploaded?: string;
}

interface ValuationJobData {
  id: string;
  companyName: string;
  turnover: string;
  purpose: string;
  stage: number;
  stageTitle: string;
  reportedEbitda: number;
  normalizationAddbacks: number;
  normalizedEbitda: number;
  uploadedAfs: string;
  uploadedTb: string;
  notes: string;
}

export default function OperatorAdminQueuePage() {
  const [activeTab, setActiveTab] = useState<"all" | "cipc" | "tax" | "valuation">("all");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // CIPC Active Job State
  const [cipcJob, setCipcJob] = useState<CipcJobData>({
    id: "CIPC-2026-000128",
    companyName: "ABC Trading (Pty) Ltd",
    regNumber: "2022/123456/07",
    turnover: 6500000,
    tierFee: 450,
    consultxFee: 850,
    lateFee: false,
    status: "READY_TO_FILE",
    clientAuthorizedAt: "Today, 08:42",
    paidVia: "Paystack Card (ref_pst_98421)",
    beneficialOwners: [
      { fullName: "Craig Ulyate", idNumber: "7809155024083", percentage: 75, isPep: false },
      { fullName: "Sarah Ulyate", idNumber: "8204120194087", percentage: 25, isPep: false },
    ],
  });

  // SARS Active Job State
  const [taxJob, setTaxJob] = useState<TaxJobData>({
    id: "TAX-2026-000042",
    companyName: "ABC Trading (Pty) Ltd",
    taxNumber: "9482710384",
    purpose: "Good Standing & Commercial Tenders",
    status: "READY_FOR_SARS",
    clientAuthorizedAt: "Yesterday, 16:15",
    paidVia: "Investec Bank EFT (ref_CX-INV-042)",
    issuedPin: "98421074CS",
    pinExpiry: "2027-01-28",
  });

  // Valuation Active Job State
  const [valJob] = useState<ValuationJobData>({
    id: "VAL-2026-000084",
    companyName: "Apex Precision Engineering (Pty) Ltd",
    turnover: "R 28,500,000",
    purpose: "Shareholder Buyout / Equity Restructuring",
    stage: 3,
    stageTitle: "Executive Scoping & Normalization Review",
    reportedEbitda: 2450000,
    normalizationAddbacks: 950000,
    normalizedEbitda: 3400000,
    uploadedAfs: "Apex_Signed_AFS_FY2023_FY2025.pdf",
    uploadedTb: "Apex_YTD_Trial_Balance_Jan2026.xlsx",
    notes:
      "Client confirmed director market replacement salary at R1.2M (actual drawn R1.8M -> R600k add-back). Personal motor lease R180k added back. Plant moving cost R170k added back.",
  });

  const [simulatedCipcUpload, setSimulatedCipcUpload] = useState<string | null>(null);
  const [simulatedTaxUpload, setSimulatedTaxUpload] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const formatZar = (val: number) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(val);

  const handleCompleteCipc = () => {
    if (!simulatedCipcUpload) {
      alert("Please select or drop the official CIPC COR30.1 Confirmation Letter PDF first.");
      return;
    }
    setCipcJob((prev) => ({
      ...prev,
      status: "COMPLETED",
      certificateUploaded: simulatedCipcUpload,
    }));
  };

  const handleCompleteTax = () => {
    setTaxJob((prev) => ({
      ...prev,
      status: "COMPLETED",
      certificateUploaded: simulatedTaxUpload || "SARS_TCS_PIN_Certificate_2026.pdf",
    }));
  };

  return (
    <PortalShell>
      <div className="mx-auto max-w-7xl pb-16">
        {/* Header with Operator Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-consultx-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-consultx-black px-2.5 py-0.5 text-xs font-bold text-consultx-green font-mono">
                OPERATOR DISPATCH CENTER
              </span>
              <span className="rounded-md bg-consultx-green/20 px-2 py-0.5 text-xs font-bold text-consultx-green-dark">
                CA(SA) Filing Queue
              </span>
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-consultx-black">
              Statutory Filing & Mandate Queue
            </h1>
            <p className="mt-1 text-xs md:text-sm text-consultx-charcoal">
              Review authorized client mandates, copy formatted statutory packages for CIPC/SARS, and upload completed certificates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://bizportal.gov.za/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-consultx-border bg-white px-3.5 py-2.5 text-xs font-bold text-consultx-black hover:border-consultx-green transition shadow-xs"
            >
              <Landmark className="h-4 w-4 text-consultx-green-dark" />
              Open CIPC Portal <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>
            <a
              href="https://secure.sarsefiling.co.za/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-consultx-black px-3.5 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition shadow-xs"
            >
              <Award className="h-4 w-4 text-consultx-green" />
              Open SARS eFiling <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Operational Metrics Bar */}
        <section className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-consultx-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between text-xs text-consultx-grey">
              <span>Ready for CIPC</span>
              <Landmark className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-consultx-black">
              {cipcJob.status === "READY_TO_FILE" ? "1" : "0"}
            </div>
            <div className="mt-1 text-[11px] text-gray-500">Awaiting CIPC debit & lodgement</div>
          </div>

          <div className="rounded-xl border border-consultx-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between text-xs text-consultx-grey">
              <span>Ready for SARS</span>
              <Award className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-consultx-black">
              {taxJob.status === "READY_FOR_SARS" ? "1" : "0"}
            </div>
            <div className="mt-1 text-[11px] text-gray-500">TCS Good Standing request</div>
          </div>

          <div className="rounded-xl border border-consultx-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between text-xs text-consultx-grey">
              <span>Valuation / AFS Review</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-consultx-black">1</div>
            <div className="mt-1 text-[11px] text-gray-500">Stage 3 Normalization audit</div>
          </div>

          <div className="rounded-xl border border-consultx-border bg-white p-4 shadow-soft">
            <div className="flex items-center justify-between text-xs text-consultx-grey">
              <span>Completed Today</span>
              <CheckCircle2 className="h-4 w-4 text-consultx-green" />
            </div>
            <div className="mt-2 text-2xl font-bold text-consultx-green-dark">
              {(cipcJob.status === "COMPLETED" ? 1 : 0) + (taxJob.status === "COMPLETED" ? 1 : 0)}
            </div>
            <div className="mt-1 text-[11px] text-gray-500">Certificates vaulted & emailed</div>
          </div>
        </section>

        {/* Filter Navigation Tabs */}
        <div className="mt-8 flex items-center gap-2 border-b border-gray-200 text-xs font-bold">
          {[
            { id: "all", label: "All Active Mandates (3)" },
            { id: "cipc", label: "CIPC Annual Returns & BO (1)" },
            { id: "tax", label: "SARS Tax Clearance & TCS (1)" },
            { id: "valuation", label: "Valuations & Advisory (1)" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as "all" | "cipc" | "tax" | "valuation")}
              className={`pb-3 px-3 transition cursor-pointer ${
                activeTab === t.id
                  ? "border-b-2 border-consultx-green text-consultx-green-dark"
                  : "text-gray-500 hover:text-consultx-black"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Job Queue Items */}
        <div className="mt-6 space-y-6">
          {/* 1. CIPC Annual Return Card */}
          {(activeTab === "all" || activeTab === "cipc") && (
            <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-consultx-green-dark bg-consultx-green-soft px-2 py-0.5 rounded">
                      {cipcJob.id}
                    </span>
                    <h2 className="text-base font-bold text-consultx-black">
                      CIPC Annual Return & Beneficial Ownership Filing
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        cipcJob.status === "READY_TO_FILE"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-emerald-100 text-emerald-900"
                      }`}
                    >
                      {cipcJob.status === "READY_TO_FILE" ? "READY FOR CIPC SUBMISSION" : "COMPLETED & VAULTED"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-consultx-grey">
                    Entity: <strong className="text-consultx-black">{cipcJob.companyName}</strong> · Authorized: {cipcJob.clientAuthorizedAt} · Payment: <span className="text-consultx-green-dark font-semibold">{cipcJob.paidVia}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://bizportal.gov.za/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-consultx-black px-3.5 py-2 text-xs font-bold text-white hover:bg-gray-800 transition"
                  >
                    Launch CIPC e-Services <ExternalLink className="h-3 w-3 text-gray-400" />
                  </a>
                </div>
              </div>

              {/* Side-by-Side 1-Click Copy Data Pack */}
              <div className="mt-5 grid lg:grid-cols-12 gap-6 text-xs">
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                      <strong className="text-consultx-black uppercase tracking-wider text-[11px]">
                        1-Click Statutory Copy Pack (CIPC)
                      </strong>
                      <span className="text-[10px] text-gray-500">Click button to copy into CIPC form</span>
                    </div>

                    <div className="space-y-2.5 font-mono">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-sans">Company Registration No:</span>
                          <strong className="text-consultx-black text-xs">{cipcJob.regNumber}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(cipcJob.regNumber, "cipc_reg")}
                          className="inline-flex items-center gap-1 rounded bg-gray-100 hover:bg-consultx-green-soft px-2.5 py-1 text-[11px] font-bold text-consultx-black transition"
                        >
                          <Copy className="h-3 w-3 text-consultx-green-dark" />
                          {copiedField === "cipc_reg" ? "Copied!" : "Copy"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-sans">Declared Gross Turnover:</span>
                          <strong className="text-consultx-green-dark text-xs">{formatZar(cipcJob.turnover)}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(String(cipcJob.turnover), "cipc_turnover")}
                          className="inline-flex items-center gap-1 rounded bg-gray-100 hover:bg-consultx-green-soft px-2.5 py-1 text-[11px] font-bold text-consultx-black transition"
                        >
                          <Copy className="h-3 w-3 text-consultx-green-dark" />
                          {copiedField === "cipc_turnover" ? "Copied!" : "Copy"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-sans">CIPC Fee to Debit:</span>
                          <strong className="text-consultx-black text-xs">{formatZar(cipcJob.tierFee)}</strong>
                          <span className="text-[10px] text-gray-400 block font-sans font-normal">(ConsultX collected: {formatZar(cipcJob.consultxFee + cipcJob.tierFee)})</span>
                        </div>
                        <span className="text-[10px] text-consultx-green-dark font-bold font-sans bg-consultx-green-soft px-2 py-0.5 rounded">
                          Account Funded
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Beneficial Ownership Schedule */}
                  <div className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-consultx-black text-xs">
                        Beneficial Ownership Schedule ({cipcJob.beneficialOwners.length} Natural Persons)
                      </strong>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            cipcJob.beneficialOwners
                              .map((b) => `${b.fullName} | ID: ${b.idNumber} | ${b.percentage}%`)
                              .join("\n"),
                            "cipc_bo_all"
                          )
                        }
                        className="text-[11px] text-consultx-green-dark font-bold hover:underline flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        {copiedField === "cipc_bo_all" ? "Copied Summary!" : "Copy BO Schedule"}
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100 font-mono text-[11px]">
                      {cipcJob.beneficialOwners.map((bo, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-consultx-black font-sans">{bo.fullName}</span>
                            <span className="text-gray-500 block">ID: {bo.idNumber}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-consultx-black">{bo.percentage}%</span>
                            <span className="text-[10px] text-consultx-green-dark font-sans block">Certified ID Verified</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Execution & Deliverable Ingestion */}
                <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-consultx-light-grey/40 border border-consultx-border p-5">
                  <div>
                    <div className="text-xs font-bold text-consultx-black mb-1">
                      Filing Verification & Ingestion Dropzone
                    </div>
                    <p className="text-[11px] text-consultx-grey mb-4 leading-relaxed">
                      After completing the filing on CIPC, drop the official <code className="text-consultx-black font-bold">COR30.1</code> confirmation PDF here. The system will automatically vault it and email the client.
                    </p>

                    {cipcJob.status === "COMPLETED" ? (
                      <div className="rounded-xl border border-consultx-green/30 bg-consultx-green-soft p-4 text-consultx-green-dark">
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <CheckCircle2 className="h-4 w-4" /> Mandate Completed
                        </div>
                        <p className="mt-1 text-[11px] text-consultx-charcoal">
                          Archived in vault as <span className="font-mono font-semibold">{cipcJob.certificateUploaded}</span>.
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-[11px]">
                          <span className="rounded bg-white px-2 py-0.5 font-semibold text-consultx-black border border-consultx-green/20">
                            Client Emailed ✓
                          </span>
                          <span className="rounded bg-white px-2 py-0.5 font-semibold text-consultx-black border border-consultx-green/20">
                            Next Reminder Set: Feb 2027
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-5 text-center">
                          <FileCheck2 className="mx-auto h-8 w-8 text-consultx-green-dark" />
                          <div className="mt-2 text-xs font-bold text-consultx-black">
                            {simulatedCipcUpload ? simulatedCipcUpload : "Drop CIPC COR30.1 PDF here"}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">Confirmation of Annual Return Lodgement</p>
                          <label className="mt-3 inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-bold text-consultx-black transition">
                            <Upload className="h-3.5 w-3.5 text-consultx-green-dark" /> Select Certificate File
                            <input
                              type="file"
                              accept=".pdf"
                              className="sr-only"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setSimulatedCipcUpload(e.target.files[0].name);
                                }
                              }}
                            />
                          </label>
                        </div>

                        <button
                          type="button"
                          onClick={handleCompleteCipc}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-consultx-green py-3 text-xs font-bold text-white hover:bg-consultx-green-dark transition shadow-soft"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Complete Mandate & Dispatch Certificate
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 text-[10px] text-gray-500">
                    Audit Log: Job authorized by client under POPIA declaration at 08:42:19 SAST.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SARS Tax Clearance Card */}
          {(activeTab === "all" || activeTab === "tax") && (
            <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-consultx-green-dark bg-consultx-green-soft px-2 py-0.5 rounded">
                      {taxJob.id}
                    </span>
                    <h2 className="text-base font-bold text-consultx-black">
                      SARS Tax Compliance Status (TCS Good Standing PIN)
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        taxJob.status === "READY_FOR_SARS"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-emerald-100 text-emerald-900"
                      }`}
                    >
                      {taxJob.status === "READY_FOR_SARS" ? "READY FOR eFILING" : "ACTIVE PIN ISSUED"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-consultx-grey">
                    Entity: <strong className="text-consultx-black">{taxJob.companyName}</strong> · Purpose: {taxJob.purpose} · Payment: <span className="text-consultx-green-dark font-semibold">{taxJob.paidVia}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="https://secure.sarsefiling.co.za/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-consultx-black px-3.5 py-2 text-xs font-bold text-white hover:bg-gray-800 transition"
                  >
                    Launch SARS eFiling <ExternalLink className="h-3 w-3 text-gray-400" />
                  </a>
                </div>
              </div>

              {/* Side-by-Side Tax Pack */}
              <div className="mt-5 grid lg:grid-cols-12 gap-6 text-xs">
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-sans">SARS Tax Reference Number:</span>
                        <strong className="text-consultx-black text-xs">{taxJob.taxNumber}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(taxJob.taxNumber, "sars_tax_num")}
                        className="inline-flex items-center gap-1 rounded bg-gray-100 hover:bg-consultx-green-soft px-2.5 py-1 text-[11px] font-bold text-consultx-black transition"
                      >
                        <Copy className="h-3 w-3 text-consultx-green-dark" />
                        {copiedField === "sars_tax_num" ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-white border border-gray-200 font-sans text-xs space-y-1 text-consultx-charcoal">
                      <strong className="text-consultx-black block text-[11px] uppercase tracking-wider">
                        Practitioner Checklist for this Mandate:
                      </strong>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-consultx-green-dark" /> Verify CIT, VAT & PAYE return dashboards on eFiling
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-consultx-green-dark" /> Pull Statement of Account & verify zero undisputed debt
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-consultx-green-dark" /> Lodge Good Standing TCS Application under Registered Tax Practitioner
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between rounded-xl bg-consultx-light-grey/40 border border-consultx-border p-5">
                  <div>
                    <div className="text-xs font-bold text-consultx-black mb-1">
                      Record Issued TCS PIN & Expiry
                    </div>
                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="text-[11px] text-gray-500 block">10-Character SARS PIN:</label>
                        <input
                          type="text"
                          defaultValue={taxJob.issuedPin}
                          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono font-bold text-xs outline-none focus:border-consultx-green"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-500 block">PIN Expiry Date:</label>
                        <input
                          type="date"
                          defaultValue={taxJob.pinExpiry}
                          className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-xs outline-none focus:border-consultx-green"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-gray-500 block">Attach Official SARS Certificate PDF:</label>
                        <label className="mt-1 flex cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-[11px] font-bold text-consultx-black hover:border-consultx-green transition">
                          <Upload className="h-3.5 w-3.5 text-consultx-green-dark" />
                          {simulatedTaxUpload || "Select TCS Certificate PDF"}
                          <input
                            type="file"
                            accept=".pdf"
                            className="sr-only"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setSimulatedTaxUpload(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <button
                        type="button"
                        onClick={handleCompleteTax}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-consultx-green py-2.5 text-xs font-bold text-white hover:bg-consultx-green-dark transition shadow-soft"
                      >
                        <Award className="h-4 w-4" /> Save PIN & Notify Client
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Business Valuation & AFS Working Paper Card */}
          {(activeTab === "all" || activeTab === "valuation") && (
            <div className="rounded-2xl border border-consultx-border bg-white p-6 shadow-soft transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-consultx-green-dark bg-consultx-green-soft px-2 py-0.5 rounded">
                      {valJob.id}
                    </span>
                    <h2 className="text-base font-bold text-consultx-black">
                      Independent CA(SA) Business Valuation Mandate
                    </h2>
                    <span className="rounded-full bg-emerald-100 text-emerald-900 px-2.5 py-0.5 text-[10px] font-bold">
                      STAGE {valJob.stage} OF 6: {valJob.stageTitle.toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-consultx-grey">
                    Client: <strong className="text-consultx-black">{valJob.companyName}</strong> · Turnover: {valJob.turnover} · Purpose: <span className="text-consultx-green-dark font-semibold">{valJob.purpose}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/portal/services/valuation/"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-consultx-border bg-white px-3.5 py-2 text-xs font-bold text-consultx-black hover:border-consultx-green transition"
                  >
                    Open Client Cockpit View <ArrowRight className="h-3 w-3 text-consultx-green-dark" />
                  </Link>
                </div>
              </div>

              {/* Working Papers & Financial Data Extraction */}
              <div className="mt-5 grid lg:grid-cols-12 gap-6 text-xs">
                <div className="lg:col-span-7 space-y-4">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2">
                    <strong className="text-consultx-black text-[11px] uppercase tracking-wider block">
                      Client-Uploaded Financial Ingestion Pack
                    </strong>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-consultx-green-dark" />
                        <span className="font-semibold text-consultx-black">{valJob.uploadedAfs}</span>
                      </div>
                      <a href="#view" className="text-consultx-green-dark font-bold hover:underline flex items-center gap-1">
                        <Download className="h-3 w-3" /> Inspect AFS
                      </a>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-gray-200">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-consultx-green-dark" />
                        <span className="font-semibold text-consultx-black">{valJob.uploadedTb}</span>
                      </div>
                      <a href="#view" className="text-consultx-green-dark font-bold hover:underline flex items-center gap-1">
                        <Download className="h-3 w-3" /> Inspect TB
                      </a>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-consultx-black block mb-1">
                      Craig CA(SA) Working Paper Notes & Normalization Rationale:
                    </label>
                    <textarea
                      rows={4}
                      defaultValue={valJob.notes}
                      className="w-full rounded-xl border border-gray-200 p-3 text-xs leading-relaxed outline-none focus:border-consultx-green"
                    />
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-xl bg-consultx-black p-5 text-white flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Normalized Financial Summary
                    </div>
                    <div className="mt-3 space-y-2 font-mono text-xs">
                      <div className="flex justify-between border-b border-white/10 pb-1.5">
                        <span className="text-gray-400 font-sans">Reported Book EBITDA:</span>
                        <span className="text-white font-bold">{formatZar(valJob.reportedEbitda)}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-1.5">
                        <span className="text-gray-400 font-sans">Agreed Normalization Add-backs:</span>
                        <span className="text-consultx-green font-bold">+{formatZar(valJob.normalizationAddbacks)}</span>
                      </div>
                      <div className="flex justify-between pt-1 text-sm">
                        <span className="font-sans font-bold text-white">Normalized Maintainable EBITDA:</span>
                        <span className="text-consultx-green font-extrabold">{formatZar(valJob.normalizedEbitda)}</span>
                      </div>
                    </div>

                    <div className="mt-5 text-[11px] text-gray-300 bg-white/5 border border-white/10 p-3 rounded-lg">
                      Next Step: Build discrete 5-year DCF model using SA 10-year bond yield (10.5%) + 6% ERP for Craig&apos;s executive valuation report drafting.
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-gray-400">Scoping call scheduled:</span>
                    <strong className="text-white font-sans">Tomorrow, 10:00 SAST</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
