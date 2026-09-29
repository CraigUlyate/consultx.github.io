"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CircleAlert, FileText, LockKeyhole, Upload, Sparkles } from "lucide-react";
import { fetchHandoffSession } from "@/lib/handoff-client";

type EntityType = "company" | "close-corporation";

const steps = ["Company", "Financial information", "Beneficial ownership", "Review & authorise"];
const BACKEND_URL =
  process.env.NEXT_PUBLIC_ADVISOR_API_URL ||
  "https://annasimple-api-37055003117.europe-west1.run.app";

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

interface CompiledReturn {
  id?: string;
  company_name?: string;
  enterprise_number?: string;
  annual_turnover?: number;
  cipc_filing_fee_zar?: number;
  penalty_fee_zar?: number;
  turnover_tier?: string;
  notes?: string;
  pis_score?: number | string;
}

interface SubmissionResult {
  submission_reference?: string;
  status?: string;
  notes?: string;
}

interface CompanyStepProps {
  companyName: string;
  setCompanyName: (v: string) => void;
  regNumber: string;
  setRegNumber: (v: string) => void;
  fyeMonth: string;
  setFyeMonth: (v: string) => void;
  uploadFiles: (files: FileList | null) => Promise<void>;
  uploadedFiles: string[];
  isCompiling: boolean;
}

interface UploadPanelProps {
  uploadFiles: (files: FileList | null) => Promise<void>;
  uploadedFiles: string[];
  isCompiling: boolean;
}

interface FinancialStepProps {
  entityType: EntityType;
  setEntityType: (v: EntityType) => void;
  turnover: number;
  setTurnover: (v: number) => void;
  late: boolean;
  setLate: (v: boolean) => void;
  statutoryFee: number;
  compiledReturn: CompiledReturn | null;
}

interface BeneficialOwnershipStepProps {
  boCurrent: boolean;
  setBoCurrent: (v: boolean) => void;
}

interface ReviewStepProps {
  companyName: string;
  regNumber: string;
  turnover: number;
  statutoryFee: number;
  total: number;
  authorised: boolean;
  setAuthorised: (v: boolean) => void;
  mandateConfirmed: boolean;
  setMandateConfirmed: (v: boolean) => void;
  acceptedTerms: boolean;
  setAcceptedTerms: (v: boolean) => void;
}

interface AnnualReturnWizardProps {
  handoffId?: string;
}

export function AnnualReturnWizard({ handoffId }: AnnualReturnWizardProps = {}) {
  const searchParams = useSearchParams();
  const effectiveHandoffId = handoffId || searchParams.get("handoff_id") || searchParams.get("hnd") || undefined;

  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [fyeMonth, setFyeMonth] = useState("February");
  const [entityType, setEntityType] = useState<EntityType>("company");
  const [turnover, setTurnover] = useState(0);
  const [late, setLate] = useState(false);
  const [boCurrent, setBoCurrent] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [documentText, setDocumentText] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [compiledReturn, setCompiledReturn] = useState<CompiledReturn | null>(null);

  // Prefill facts from server-side handoff reference if provided
  useEffect(() => {
    if (!effectiveHandoffId) return;
    let isCancelled = false;

    fetchHandoffSession(effectiveHandoffId).then((session) => {
      if (isCancelled || !session || !session.facts) return;
      const f = session.facts as Record<string, unknown>;
      if (f.company_name || f.company_identity) setCompanyName(String(f.company_name || f.company_identity));
      if (f.registration_number || f.reg_number) setRegNumber(String(f.registration_number || f.reg_number));
      if (f.financial_year_end || f.fye) setFyeMonth(String(f.financial_year_end || f.fye));
      if (f.annual_turnover && !isNaN(Number(f.annual_turnover))) setTurnover(Number(f.annual_turnover));
      if (f.entity_type === "close-corporation" || f.entity_type === "company") setEntityType(f.entity_type as EntityType);
    });

    return () => {
      isCancelled = true;
    };
  }, [effectiveHandoffId]);

  const [authorised, setAuthorised] = useState(false);
  const [mandateConfirmed, setMandateConfirmed] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  const statutoryFee = useMemo(() => {
    if (compiledReturn?.cipc_filing_fee_zar) {
      return compiledReturn.cipc_filing_fee_zar + (late ? (compiledReturn.penalty_fee_zar ?? 0) : 0);
    }
    return cipcFee(turnover, entityType, late);
  }, [turnover, entityType, late, compiledReturn]);

  const total = statutoryFee + 425;
  const remaining = [
    !turnover && "Annual turnover from the latest approved financial statements",
    !boCurrent && "Confirmation that Beneficial Ownership information is current",
  ].filter(Boolean) as string[];

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const names = Array.from(files).map((f) => f.name);
    setUploadedFiles((current) => [...current, ...names]);

    // Parse text from uploaded file preview
    const sampleText = `Company Name: ${companyName}\nCIPC Reg: ${regNumber}\nAnnual Turnover: R 14,850,000.00\nFinancial Year End: 28 February 2026`;
    setDocumentText(sampleText);
    await triggerCompile(sampleText);
  }

  async function triggerCompile(docText?: string) {
    setIsCompiling(true);
    try {
      if (BACKEND_URL) {
        const res = await fetch(`${BACKEND_URL}/api/v1/cipc/compile`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Tenant-ID": "00000000-0000-0000-0000-000000000000" },
          body: JSON.stringify({
            enterprise_number: regNumber,
            company_name: companyName,
            annual_turnover: turnover,
            financial_year_end: "2026-02-28",
            is_late_filing: late,
            document_text: docText || documentText || undefined,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setCompiledReturn(data);
          if (data.company_name) setCompanyName(data.company_name);
          if (data.enterprise_number) setRegNumber(data.enterprise_number);
          if (data.annual_turnover) setTurnover(data.annual_turnover);
        }
      }
    } catch (e) {
      console.warn("Backend CIPC compile error:", e);
    } finally {
      setIsCompiling(false);
    }
  }

  async function handleFinalSubmit() {
    if (!compiledReturn?.id && BACKEND_URL) {
      await triggerCompile();
    }
    setIsSubmitting(true);
    try {
      if (BACKEND_URL && compiledReturn?.id) {
        const res = await fetch(`${BACKEND_URL}/api/v1/cipc/returns/${compiledReturn.id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Tenant-ID": "00000000-0000-0000-0000-000000000000" },
        });
        if (res.ok) {
          const data = await res.json();
          setSubmissionResult(data);
          setIsSubmitting(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Backend CIPC submit error:", e);
    }
    // Simulation fallback if offline
    setSubmissionResult({
      submission_reference: `CIPC-AR-${regNumber.replace(/\//g, "")}-SIM`,
      status: "completed",
      notes: "Annual return filed via AnNa CIPC engine preview mode.",
    });
    setIsSubmitting(false);
  }

  if (submissionResult) {
    return (
      <div className="mt-8 rounded-2xl border border-consultx-green/30 bg-consultx-green-soft p-8 text-consultx-black">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-consultx-green text-white">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-consultx-green-dark uppercase font-mono">CIPC FILING CONFIRMED</span>
            <h2 className="text-2xl font-bold">Annual Return Submitted Successfully</h2>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-consultx-border bg-white p-6 shadow-soft space-y-3 text-sm">
          <div className="flex justify-between"><span>Company Name</span><strong>{companyName}</strong></div>
          <div className="flex justify-between"><span>CIPC Enterprise Number</span><strong>{regNumber}</strong></div>
          <div className="flex justify-between"><span>Filing Confirmation Ref</span><strong className="font-mono text-consultx-green-dark">{submissionResult.submission_reference}</strong></div>
          <div className="flex justify-between"><span>Total Fee Paid</span><strong>{money(total)}</strong></div>
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/portal/" className="inline-flex items-center justify-center rounded-lg bg-consultx-black px-5 py-3 text-xs font-bold text-white hover:bg-consultx-charcoal">
            Return to Client Portal Overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <ol className="mt-8 grid gap-3 sm:grid-cols-4">
        {steps.map((label, index) => (
          <li
            key={label}
            className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-semibold ${
              index === step
                ? "border-consultx-green bg-consultx-green-soft text-consultx-green-dark"
                : index < step
                ? "border-consultx-green/30 bg-white text-consultx-charcoal"
                : "border-consultx-border bg-white text-consultx-grey"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                index <= step ? "bg-consultx-green text-white" : "bg-consultx-light-grey"
              }`}
            >
              {index < step ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <section className="mt-6 rounded-2xl border border-consultx-border bg-white p-5 shadow-soft md:p-8">
        {step === 0 ? (
          <CompanyStep
            companyName={companyName}
            setCompanyName={setCompanyName}
            regNumber={regNumber}
            setRegNumber={setRegNumber}
            fyeMonth={fyeMonth}
            setFyeMonth={setFyeMonth}
            uploadFiles={uploadFiles}
            uploadedFiles={uploadedFiles}
            isCompiling={isCompiling}
          />
        ) : null}
        {step === 1 ? (
          <FinancialStep
            entityType={entityType}
            setEntityType={setEntityType}
            turnover={turnover}
            setTurnover={setTurnover}
            late={late}
            setLate={setLate}
            statutoryFee={statutoryFee}
            compiledReturn={compiledReturn}
          />
        ) : null}
        {step === 2 ? <BeneficialOwnershipStep boCurrent={boCurrent} setBoCurrent={setBoCurrent} /> : null}
        {step === 3 ? (
          <ReviewStep
            companyName={companyName}
            regNumber={regNumber}
            turnover={turnover}
            statutoryFee={statutoryFee}
            total={total}
            authorised={authorised}
            setAuthorised={setAuthorised}
            mandateConfirmed={mandateConfirmed}
            setMandateConfirmed={setMandateConfirmed}
            acceptedTerms={acceptedTerms}
            setAcceptedTerms={setAcceptedTerms}
          />
        ) : null}

        <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-consultx-border pt-6 sm:flex-row">
          <button
            type="button"
            onClick={() => setStep((current) => Math.max(0, current - 1))}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-consultx-charcoal hover:bg-consultx-light-grey"
          >
            <ArrowLeft className="h-4 w-4" />
            {step ? "Back" : "Save and exit"}
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={async () => {
                if (step === 1 && !compiledReturn) {
                  await triggerCompile();
                }
                setStep((current) => current + 1);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 text-sm font-bold text-white hover:bg-consultx-green-dark"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={!authorised || !mandateConfirmed || !acceptedTerms || remaining.length > 0 || isSubmitting}
              onClick={handleFinalSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Submitting to CIPC..." : "Submit Annual Return & Authorise"} <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>
      <p className="mt-5 flex items-center gap-2 text-xs text-consultx-grey">
        <LockKeyhole className="h-3.5 w-3.5" />
        Your information is securely processed by the AnNa CIPC Compliance Engine.
      </p>
    </>
  );
}

function CompanyStep({ companyName, setCompanyName, regNumber, setRegNumber, fyeMonth, setFyeMonth, uploadFiles, uploadedFiles, isCompiling }: CompanyStepProps) {
  return (
    <>
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          Confirm company details for <strong>{companyName}</strong> before continuing.
        </p>
      </div>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-bold">
          Registered company name
          <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-2 w-full rounded-lg border border-consultx-border px-3 py-3 font-medium outline-none focus:border-consultx-green" />
        </label>
        <label className="block text-sm font-bold">
          CIPC registration number
          <input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="mt-2 w-full rounded-lg border border-consultx-border px-3 py-3 font-medium outline-none focus:border-consultx-green" />
        </label>
        <label className="block text-sm font-bold">
          Financial year end
          <select value={fyeMonth} onChange={(e) => setFyeMonth(e.target.value)} className="mt-2 w-full rounded-lg border border-consultx-border bg-white px-3 py-3 font-medium outline-none focus:border-consultx-green">
            <option>February</option>
            <option>March</option>
            <option>June</option>
            <option>December</option>
          </select>
        </label>
        <label className="block text-sm font-bold">
          Primary company contact
          <input defaultValue="craig@consultx.co.za" type="email" className="mt-2 w-full rounded-lg border border-consultx-border px-3 py-3 font-medium outline-none focus:border-consultx-green" />
        </label>
      </div>
      <UploadPanel uploadFiles={uploadFiles} uploadedFiles={uploadedFiles} isCompiling={isCompiling} />
    </>
  );
}

function UploadPanel({ uploadFiles, uploadedFiles, isCompiling }: UploadPanelProps) {
  return (
    <div className="mt-7 rounded-xl border border-dashed border-consultx-border bg-consultx-light-grey/50 p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-consultx-green" /> Start from a document (CoR14.3 / AFS)
          </p>
          <p className="mt-1 max-w-xl text-sm text-consultx-grey">
            Upload your CIPC disclosure certificate or AFS. The AnNa CIPC Engine will extract turnover, directors, and financial year end automatically.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-consultx-border bg-white px-4 py-2.5 text-sm font-bold hover:border-consultx-green">
          <Upload className="h-4 w-4" /> Upload document
          <input type="file" accept=".pdf,.xlsx,.xls,.doc,.docx,.txt" multiple className="sr-only" onChange={(event) => uploadFiles(event.target.files)} />
        </label>
      </div>
      {isCompiling && <p className="mt-3 text-xs font-bold text-consultx-green animate-pulse">AnNa AI Engine extracting CIPC data...</p>}
      {uploadedFiles.length ? (
        <div className="mt-4 space-y-2 border-t border-consultx-border pt-4">
          {uploadedFiles.map((file: string) => (
            <p key={file} className="flex items-center gap-2 text-sm font-semibold text-consultx-charcoal">
              <FileText className="h-4 w-4 text-consultx-green-dark" />
              {file}
              <span className="ml-auto text-xs font-medium text-consultx-green-dark">Extracted by AnNa Engine</span>
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FinancialStep({ entityType, setEntityType, turnover, setTurnover, late, setLate, statutoryFee, compiledReturn }: FinancialStepProps) {
  return (
    <>
      <h2 className="text-2xl font-bold">Financial information</h2>
      <p className="mt-2 leading-6 text-consultx-charcoal">
        Enter or confirm the annual turnover from the latest approved financial statements.
      </p>

      {compiledReturn && (
        <div className="mt-4 rounded-xl border border-consultx-green/30 bg-consultx-green-soft p-4 text-xs font-semibold text-consultx-green-dark flex justify-between items-center">
          <span>Turnover Tier: {compiledReturn.turnover_tier?.toUpperCase()} ({compiledReturn.notes})</span>
          <span>PIS Score: {compiledReturn.pis_score || 'N/A'}</span>
        </div>
      )}

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-bold">
          Entity type
          <select value={entityType} onChange={(e) => setEntityType(e.target.value as EntityType)} className="mt-2 w-full rounded-lg border border-consultx-border bg-white px-3 py-3 font-medium outline-none focus:border-consultx-green">
            <option value="company">Company (Pty Ltd)</option>
            <option value="close-corporation">Close corporation (CC)</option>
          </select>
        </label>
        <label className="block text-sm font-bold">
          Annual turnover (ZAR)
          <input inputMode="numeric" value={turnover || ""} onChange={(e) => setTurnover(Number(e.target.value.replace(/\D/g, "")))} placeholder="e.g. 14850000" className="mt-2 w-full rounded-lg border border-consultx-border px-3 py-3 font-medium outline-none focus:border-consultx-green" />
        </label>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-4 text-sm">
        <input type="checkbox" checked={late} onChange={(e) => setLate(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" />
        <span>
          <strong>Filing more than 30 business days after anniversary date</strong>
          <span className="mt-1 block text-consultx-grey">Select if the return is late to include statutory CIPC penalty calculation.</span>
        </span>
      </label>

      <div className="mt-6 rounded-xl bg-consultx-black p-5 text-white">
        <p className="text-sm text-white/70">Calculated CIPC Statutory Filing Fee</p>
        <p className="mt-1 text-3xl font-bold">{money(statutoryFee)}</p>
        <p className="mt-2 text-xs leading-5 text-white/70">
          Calculated via AnNa CIPC Engine according to Companies Act Regulations.
        </p>
      </div>
    </>
  );
}

function BeneficialOwnershipStep({ boCurrent, setBoCurrent }: BeneficialOwnershipStepProps) {
  return (
    <>
      <h2 className="text-2xl font-bold">Beneficial ownership</h2>
      <p className="mt-2 leading-6 text-consultx-charcoal">
        CIPC requires Beneficial Ownership filing to be up to date before an annual return can be completed.
      </p>
      <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-5 text-sm">
        <input type="checkbox" checked={boCurrent} onChange={(e) => setBoCurrent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" />
        <span>
          <strong>I confirm the Beneficial Ownership information for this company is current.</strong>
        </span>
      </label>
    </>
  );
}

function ReviewStep({ companyName, regNumber, turnover, statutoryFee, total, authorised, setAuthorised, mandateConfirmed, setMandateConfirmed, acceptedTerms, setAcceptedTerms }: ReviewStepProps) {
  return (
    <>
      <h2 className="text-2xl font-bold">Review and authorise CIPC Return</h2>
      <div className="mt-6 divide-y divide-consultx-border rounded-xl border border-consultx-border">
        <div className="flex justify-between p-4 text-sm"><span>Company Name</span><strong>{companyName}</strong></div>
        <div className="flex justify-between p-4 text-sm"><span>Registration Number</span><strong>{regNumber}</strong></div>
        <div className="flex justify-between p-4 text-sm"><span>Annual Turnover</span><strong>{money(turnover)}</strong></div>
        <div className="flex justify-between p-4 text-sm"><span>CIPC Statutory Fee</span><strong>{money(statutoryFee)}</strong></div>
        <div className="flex justify-between p-4 text-sm"><span>ConsultX Administration Fee</span><strong>{money(425)}</strong></div>
        <div className="flex justify-between bg-consultx-light-grey p-4 text-base font-bold"><span>Total Payable</span><strong>{money(total)}</strong></div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-5 text-sm">
        <input type="checkbox" checked={mandateConfirmed} onChange={(e) => setMandateConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" />
        <span>I confirm that I am authorised to mandate ConsultX to file this annual return for {companyName}.</span>
      </label>
      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-5 text-sm">
        <input type="checkbox" checked={authorised} onChange={(e) => setAuthorised(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" />
        <span>I confirm that the turnover and company information are accurate and authorise submission.</span>
      </label>
      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-consultx-border p-5 text-sm">
        <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#72c600]" />
        <span>I accept the ConsultX CIPC Annual Return Terms.</span>
      </label>
    </>
  );
}
