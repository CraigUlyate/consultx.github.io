"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CircleAlert, FileText, LockKeyhole, Upload } from "lucide-react";

type EntityType = "company" | "close-corporation";

const steps = ["Company", "Financial information", "Beneficial ownership", "Review & authorise"];

function cipcFee(turnover: number, entityType: EntityType, late: boolean) {
  if (entityType === "close-corporation") return turnover >= 50_000_000 ? 4_000 : late ? 250 : 100;
  if (turnover < 1_000_000) return late ? 150 : 100;
  if (turnover < 10_000_000) return late ? 600 : 450;
  if (turnover < 25_000_000) return late ? 2_500 : 2_000;
  return late ? 4_000 : 3_000;
}

function money(value: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(value);
}

export function AnnualReturnWizard() {
  const [step, setStep] = useState(0);
  const [entityType, setEntityType] = useState<EntityType>("company");
  const [turnover, setTurnover] = useState(0);
  const [late, setLate] = useState(false);
  const [boCurrent, setBoCurrent] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [authorised, setAuthorised] = useState(false);
  const [mandateConfirmed, setMandateConfirmed] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const statutoryFee = useMemo(() => cipcFee(turnover, entityType, late), [turnover, entityType, late]);
  const total = statutoryFee + 150;
  const remaining = [
    !turnover && "Annual turnover from the latest approved financial statements",
    !boCurrent && "Confirmation that Beneficial Ownership information is current",
  ].filter(Boolean) as string[];

  function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploadedFiles((current) => [...current, ...Array.from(files).map((file) => file.name)]);
  }

  return <>
    <ol className="mt-8 grid gap-3 sm:grid-cols-4">{steps.map((label, index) => <li key={label} className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-semibold ${index === step ? "border-consultx-green bg-consultx-green-soft text-consultx-green-dark" : index < step ? "border-consultx-green/30 bg-white text-consultx-charcoal" : "border-consultx-border bg-white text-consultx-grey"}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${index <= step ? "bg-consultx-green text-white" : "bg-consultx-light-grey"}`}>{index < step ? <Check className="h-4 w-4" /> : index + 1}</span>{label}</li>)}</ol>
    <section className="mt-6 rounded-2xl border border-consultx-border bg-white p-5 shadow-soft md:p-8">
      {step === 0 ? <CompanyStep uploadFiles={uploadFiles} uploadedFiles={uploadedFiles} /> : null}
      {step === 1 ? <FinancialStep entityType={entityType} setEntityType={setEntityType} turnover={turnover} setTurnover={setTurnover} late={late} setLate={setLate} statutoryFee={statutoryFee} /> : null}
      {step === 2 ? <BeneficialOwnershipStep boCurrent={boCurrent} setBoCurrent={setBoCurrent} /> : null}
      {step === 3 ? <ReviewStep turnover={turnover} statutoryFee={statutoryFee} total={total} remaining={remaining} authorised={authorised} setAuthorised={setAuthorised} mandateConfirmed={mandateConfirmed} setMandateConfirmed={setMandateConfirmed} acceptedTerms={acceptedTerms} setAcceptedTerms={setAcceptedTerms} /> : null}
      <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-consultx-border pt-6 sm:flex-row"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-consultx-charcoal hover:bg-consultx-light-grey"><ArrowLeft className="h-4 w-4" />{step ? "Back" : "Save and exit"}</button>{step < 3 ? <button type="button" onClick={() => setStep((current) => current + 1)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 text-sm font-bold text-white hover:bg-consultx-green-dark">Continue <ArrowRight className="h-4 w-4" /></button> : <button type="button" disabled={!authorised || !mandateConfirmed || !acceptedTerms || remaining.length > 0} className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">Continue to secure payment <ArrowRight className="h-4 w-4" /></button>}</div>
    </section>
    <p className="mt-5 flex items-center gap-2 text-xs text-consultx-grey"><LockKeyhole className="h-3.5 w-3.5" />Your information is securely stored and is only accessible to authorised users.</p>
  </>;
}

function CompanyStep({ uploadFiles, uploadedFiles }: { uploadFiles: (files: FileList | null) => void; uploadedFiles: string[] }) {
  return <><div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0" /><p>We have started this filing for <strong>ABC Trading (Pty) Ltd</strong>. Confirm the company details below before continuing.</p></div><div className="mt-7 grid gap-5 md:grid-cols-2"><label className="block text-sm font-bold">Registered company name<input defaultValue="ABC Trading (Pty) Ltd" className="mt-2 w-full rounded-lg border border-consultx-border px-3 py-3 font-medium outline-none focus:border-consultx-green" /></label><label className="block text-sm font-bold">CIPC registration number<input defaultValue="2022/123456/07" className="mt-2 w-full rounded-lg border border-consultx-border px-3 py-3 font-medium outline-none focus:border-consultx-green" /></label><label className="block text-sm font-bold">Financial year end<select defaultValue="February" className="mt-2 w-full rounded-lg border border-consultx-border bg-white px-3 py-3 font-medium outline-none focus:border-consultx-green"><option>February</option><option>March</option><option>June</option><option>December</option></select></label><label className="block text-sm font-bold">Primary company contact<input placeholder="name@company.co.za" type="email" className="mt-2 w-full rounded-lg border border-consultx-border px-3 py-3 font-medium outline-none focus:border-consultx-green" /></label></div><UploadPanel uploadFiles={uploadFiles} uploadedFiles={uploadedFiles} /></>;
}

function UploadPanel({ uploadFiles, uploadedFiles }: { uploadFiles: (files: FileList | null) => void; uploadedFiles: string[] }) {
  return <div className="mt-7 rounded-xl border border-dashed border-consultx-border bg-consultx-light-grey/50 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-bold">Start from a document instead</p><p className="mt-1 max-w-xl text-sm text-consultx-grey">Upload your CIPC disclosure, AFS or FAS. The production portal will extract available company and financial data, then show only the remaining questions.</p></div><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-consultx-border bg-white px-4 py-2.5 text-sm font-bold hover:border-consultx-green"><Upload className="h-4 w-4" />Upload document<input type="file" accept=".pdf,.xlsx,.xls,.doc,.docx" multiple className="sr-only" onChange={(event) => uploadFiles(event.target.files)} /></label></div>{uploadedFiles.length ? <div className="mt-4 space-y-2 border-t border-consultx-border pt-4">{uploadedFiles.map((file) => <p key={file} className="flex items-center gap-2 text-sm font-semibold text-consultx-charcoal"><FileText className="h-4 w-4 text-consultx-green-dark" />{file}<span className="ml-auto text-xs font-medium text-consultx-green-dark">Ready for extraction</span></p>)}</div> : null}</div>;
}

function FinancialStep({ entityType, setEntityType, turnover, setTurnover, late, setLate, statutoryFee }: { entityType: EntityType; setEntityType: (value: EntityType) => void; turnover: number; setTurnover: (value: number) => void; late: boolean; setLate: (value: boolean) => void; statutoryFee: number }) {
  return <><h2 className="text-2xl font-bold">Financial information</h2><p className="mt-2 leading-6 text-consultx-charcoal">Enter the annual turnover from the latest approved financial statements. CIPC uses this amount to determine the filing fee.</p><div className="mt-7 grid gap-5 md:grid-cols-2"><label className="block text-sm font-bold">Entity type<select value={entityType} onChange={(event) => setEntityType(event.target.value as EntityType)} className="mt-2 w-full rounded-lg border border-consultx-border bg-white px-3 py-3 font-medium outline-none focus:border-consultx-green"><option value="company">Company</option><option value="close-corporation">Close corporation</option></select></label><label className="block text-sm font-bold">Annual turnover (ZAR)<input inputMode="numeric" value={turnover || ""} onChange={(event) => setTurnover(Number(event.target.value.replace(/\D/g, "")))} placeholder="e.g. 850000" className="mt-2 w-full rounded-lg border border-consultx-border px-3 py-3 font-medium outline-none focus:border-consultx-green" /></label></div><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-4 text-sm"><input type="checkbox" checked={late} onChange={(event) => setLate(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" /><span><strong>More than 30 business days after the anniversary date</strong><span className="mt-1 block text-consultx-grey">Select this only if the annual return is late. It changes the statutory estimate.</span></span></label><div className="mt-6 rounded-xl bg-consultx-black p-5 text-white"><p className="text-sm text-white/70">Estimated CIPC statutory fee</p><p className="mt-1 text-3xl font-bold">{money(statutoryFee)}</p><p className="mt-2 text-xs leading-5 text-white/70">Estimate based on CIPC’s published annual-return fee table. We will verify the amount against CIPC’s AR calculator before payment and filing.</p></div></>;
}

function BeneficialOwnershipStep({ boCurrent, setBoCurrent }: { boCurrent: boolean; setBoCurrent: (value: boolean) => void }) {
  return <><h2 className="text-2xl font-bold">Beneficial ownership</h2><p className="mt-2 leading-6 text-consultx-charcoal">CIPC requires Beneficial Ownership filing to be up to date before an annual return can be completed.</p><label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-5 text-sm"><input type="checkbox" checked={boCurrent} onChange={(event) => setBoCurrent(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" /><span><strong>I confirm the Beneficial Ownership information for this company is current.</strong><span className="mt-1 block text-consultx-grey">If it has changed, select no and our team will contact you to complete the update before filing.</span></span></label>{!boCurrent ? <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>Information still needed:</strong> confirm or update Beneficial Ownership details.</div> : null}</>;
}

function ReviewStep({ turnover, statutoryFee, total, remaining, authorised, setAuthorised, mandateConfirmed, setMandateConfirmed, acceptedTerms, setAcceptedTerms }: { turnover: number; statutoryFee: number; total: number; remaining: string[]; authorised: boolean; setAuthorised: (value: boolean) => void; mandateConfirmed: boolean; setMandateConfirmed: (value: boolean) => void; acceptedTerms: boolean; setAcceptedTerms: (value: boolean) => void }) {
  return <><h2 className="text-2xl font-bold">Review and authorise</h2><p className="mt-2 leading-6 text-consultx-charcoal">Check your filing estimate and give ConsultX authority to proceed once the information is complete.</p>{remaining.length ? <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"><p className="font-bold">We still need:</p><ul className="mt-2 list-disc space-y-1 pl-5">{remaining.map((item) => <li key={item}>{item}</li>)}</ul></div> : <div className="mt-6 rounded-xl border border-consultx-green/30 bg-consultx-green-soft p-5 text-sm text-consultx-green-dark"><strong>Ready for payment.</strong> Your information is complete and ready for final review.</div>}<div className="mt-6 divide-y divide-consultx-border rounded-xl border border-consultx-border"><div className="flex justify-between p-4 text-sm"><span>Annual turnover</span><strong>{money(turnover)}</strong></div><div className="flex justify-between p-4 text-sm"><span>CIPC statutory filing fee <span className="text-consultx-grey">(estimated)</span></span><strong>{money(statutoryFee)}</strong></div><div className="flex justify-between p-4 text-sm"><span>ConsultX Annual Return service</span><strong>{money(150)}</strong></div><div className="flex justify-between bg-consultx-light-grey p-4 text-base"><strong>Total payable</strong><strong>{money(total)}</strong></div></div><label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-5 text-sm"><input type="checkbox" checked={mandateConfirmed} onChange={(event) => setMandateConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" /><span>I confirm that I am authorised to give ConsultX a mandate to act for ABC Trading (Pty) Ltd for this annual return.</span></label><label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-5 text-sm"><input type="checkbox" checked={authorised} onChange={(event) => setAuthorised(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" /><span>I confirm that the information is complete and accurate and authorise ConsultX to submit this annual return on behalf of ABC Trading (Pty) Ltd.</span></label><label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-5 text-sm"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" /><span>I have read and accept the <Link href="/portal/cipc-terms/" target="_blank" className="font-bold text-consultx-green-dark underline">ConsultX CIPC Annual Return Service Terms</Link>, including my responsibility for information I provide and my authority to act for this company.</span></label><div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900"><strong>Future returns:</strong> after this filing, you can opt in to annual reminders. We will email a secure link before the next due date so you can confirm turnover, changes and payment.</div></>;
}
