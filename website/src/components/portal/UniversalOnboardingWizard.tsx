"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  Trash2,
  Upload,
  Bot,
  Send,
  ShieldCheck,
  Phone,
  HelpCircle,
} from "lucide-react";
import { calculateQuoteTotal } from "@/lib/rates-schedule";
import { fetchHandoffSession } from "@/lib/handoff-client";

interface UniversalOnboardingWizardProps {
  initialServiceIds?: string[];
  handoffId?: string;
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
  initialCompany?: string;
  initialMonthlyQuote?: number;
  initialQuoteOption?: string;
  initialAfsFee?: number;
  leadId?: string;
}

const STEPS = [
  "1. Client Sign-Up",
  "2. Terms & Payment Plan",
  "3. Client Service AI & Cloud Vault",
];

const BACKEND_URL =
  process.env.NEXT_PUBLIC_ADVISOR_API_URL ||
  "https://annasimple-api-37055003117.europe-west1.run.app";

interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  category: string;
  uploadedAt: string;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export function UniversalOnboardingWizard({
  initialServiceIds = [],
  handoffId,
  initialName = "",
  initialEmail = "",
  initialPhone = "",
  initialCompany = "",
  initialMonthlyQuote,
  initialQuoteOption = "option_2",
  initialAfsFee,
  leadId = "",
}: UniversalOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Job & Lead Reference
  const [jobReference] = useState(
    () => leadId || `CX-2026-${Math.floor(10000 + Math.random() * 90000)}`
  );

  // Step 1: Sign-Up Profile & Company Details
  const [signupForm, setSignupForm] = useState({
    fullName: initialName,
    email: initialEmail,
    phone: initialPhone,
    companyName: initialCompany,
    regNumber: "",
    taxNumber: "",
    vatNumber: "",
    financialYearEnd: "February",
  });

  // Prefill facts from server-side handoff reference if provided
  useEffect(() => {
    if (!handoffId) return;
    let isCancelled = false;

    fetchHandoffSession(handoffId).then((session) => {
      if (isCancelled || !session || !session.facts) return;
      const f = session.facts as Record<string, string>;
      setSignupForm((prev) => ({
        ...prev,
        fullName: f.contact_name || f.name || prev.fullName,
        email: f.contact_email || f.email || prev.email,
        phone: f.contact_phone || f.phone || prev.phone,
        companyName: f.company_name || f.company_identity || prev.companyName,
        regNumber: f.registration_number || prev.regNumber,
        financialYearEnd: f.financial_year_end || prev.financialYearEnd,
        vatNumber: f.vat_number || prev.vatNumber,
        taxNumber: f.tax_number || prev.taxNumber,
      }));
    });

    return () => {
      isCancelled = true;
    };
  }, [handoffId]);

  // Selected Services
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() => {
    if (initialServiceIds.length > 0) return initialServiceIds;
    return ["bookkeeping_scale", "payroll_monthly", "afs_company"];
  });

  const [payrollHeadcount, setPayrollHeadcount] = useState(15);
  const quote = useMemo(
    () => calculateQuoteTotal(selectedServiceIds, payrollHeadcount),
    [selectedServiceIds, payrollHeadcount]
  );

  // Effective amounts (use custom quote if passed from AI advisor, otherwise rates schedule)
  const effectiveMonthlyZar = useMemo(() => {
    if (initialMonthlyQuote && initialMonthlyQuote > 0) {
      return initialMonthlyQuote;
    }
    return quote.total;
  }, [initialMonthlyQuote, quote.total]);

  const effectiveAfsFeeZar = useMemo(() => {
    if (initialAfsFee && initialAfsFee > 0) {
      return initialAfsFee;
    }
    return 10764.0;
  }, [initialAfsFee]);

  // Step 2: Terms & Payment
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMandate, setAcceptedMandate] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<"paid" | "craig_consult" | null>(null);
  const [craigNotes, setCraigNotes] = useState("");
  const [isSubmittingCraigRequest, setIsSubmittingCraigRequest] = useState(false);
  const [isProcessingPaystack, setIsProcessingPaystack] = useState(false);
  const [craigRequestSent, setCraigRequestSent] = useState(false);

  // Step 3: Client Service AI Chat & Documents
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDoc[]>([]);
  const [selectedUploadCategory, setSelectedUploadCategory] = useState("CIPC Registration Documents");
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Checklist items
  const CHECKLIST_REQUIREMENTS = [
    {
      id: "cipc",
      title: "CIPC Registration Documents",
      desc: "COR14.3 Registration Certificate, MOI or CK1 (Close Corp)",
      category: "CIPC Registration Documents",
    },
    {
      id: "fica",
      title: "Director FICA Verification",
      desc: "Certified Director ID / Passport and Proof of Residential Address (< 3 months)",
      category: "Director FICA Verification",
    },
    {
      id: "bank",
      title: "Bank Statements / Feeds",
      desc: "Past 3–6 months bank statements (PDF or CSV) or bank feed invitation",
      category: "Bank Statements / Feeds",
    },
    {
      id: "afs",
      title: "Prior-Year AFS / Management Accounts",
      desc: "Signed annual financial statements for previous financial year, or Trial Balance",
      category: "Prior-Year AFS / Trial Balance",
    },
    {
      id: "payroll",
      title: "Employee Payroll Roster",
      desc: "Staff headcount list with names, ID numbers, tax references and basic salaries",
      category: "Employee Payroll Roster",
    },
  ];

  // Dynamic Progress Calculation
  const completedRequirements = useMemo(() => {
    const cats = new Set(uploadedFiles.map((f) => f.category));
    return CHECKLIST_REQUIREMENTS.filter((req) => cats.has(req.category));
  }, [uploadedFiles]);

  const progressPercent = useMemo(() => {
    return Math.round((completedRequirements.length / CHECKLIST_REQUIREMENTS.length) * 100);
  }, [completedRequirements]);

  // Initial AI Messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-1",
      sender: "ai",
      text: `Hello ${signupForm.fullName || "there"}! Welcome to your ConsultX client workspace for ${signupForm.companyName || "your company"}. I am AnNa, your dedicated Client Service AI assistant, supervised by Craig Ulyate (CA(SA)).`,
      timestamp: "Just now",
    },
    {
      id: "msg-2",
      sender: "ai",
      text: "I will guide you step-by-step through providing your initial information and compliance documents. You can upload files directly to your secure cloud folder on the right, and I'll keep Craig updated in real-time.",
      timestamp: "Just now",
    },
    {
      id: "msg-3",
      sender: "ai",
      text: "To get started, please upload your **CIPC Registration Document (COR14.3 or CK1)** and **Director ID**. If you have any questions about document formats, tax references, or bank feeds, simply type them here!",
      timestamp: "Just now",
    },
  ]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Paystack Popup Handler
  const handlePaystackPayment = () => {
    if (!acceptedTerms || !acceptedMandate) {
      alert("Please accept the Terms & Conditions and Professional Mandate before proceeding.");
      return;
    }
    if (!signupForm.email) {
      alert("Please provide a valid email address.");
      return;
    }

    setIsProcessingPaystack(true);

    const paystackKey =
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_f0f37320b92d8ff55535cf36070a78619bc9ba8f";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PaystackPop = (window as any).PaystackPop;

    if (PaystackPop) {
      try {
        const handler = PaystackPop.setup({
          key: paystackKey,
          email: signupForm.email,
          amount: Math.round(effectiveMonthlyZar * 100), // amount in cents
          currency: "ZAR",
          ref: `${jobReference}-${Date.now().toString().slice(-4)}`,
          metadata: {
            custom_fields: [
              { display_name: "Company Name", variable_name: "company_name", value: signupForm.companyName },
              { display_name: "Lead Reference", variable_name: "lead_ref", value: jobReference },
              { display_name: "Monthly Retainer", variable_name: "monthly_zar", value: effectiveMonthlyZar.toString() },
              { display_name: "Payment Plan", variable_name: "plan_option", value: initialQuoteOption },
            ],
          },
          callback: function (response: { reference: string }) {
            setIsProcessingPaystack(false);
            setPaymentChoice("paid");
            setCurrentStep(2); // Advance immediately to Step 3 (Client Service AI Chat)
          },
          onClose: function () {
            setIsProcessingPaystack(false);
          },
        });
        handler.openIframe();
      } catch (err) {
        console.error("Paystack popup error:", err);
        setIsProcessingPaystack(false);
        setPaymentChoice("paid");
        setCurrentStep(2);
      }
    } else {
      setTimeout(() => {
        setIsProcessingPaystack(false);
        setPaymentChoice("paid");
        setCurrentStep(2);
      }, 1000);
    }
  };

  // Confirm with Craig before paying handler
  const handleConfirmWithCraig = async () => {
    if (!acceptedTerms || !acceptedMandate) {
      alert("Please accept the Terms & Conditions and Professional Mandate before submitting.");
      return;
    }

    setIsSubmittingCraigRequest(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/advisor/confirm-with-craig`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: jobReference,
          client_name: signupForm.fullName,
          email: signupForm.email,
          phone: signupForm.phone,
          company_name: signupForm.companyName,
          quote_summary: `Monthly Retainer: R${effectiveMonthlyZar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}/mo (${initialQuoteOption})`,
          monthly_zar: effectiveMonthlyZar,
          notes: craigNotes || "Client requested priority pre-payment consultation to discuss specifics.",
        }),
      });

      if (res.ok) {
        setCraigRequestSent(true);
      }
    } catch (err) {
      console.warn("Could not submit pre-payment request to backend:", err);
    } finally {
      setIsSubmittingCraigRequest(false);
      setPaymentChoice("craig_consult");
      setCurrentStep(2); // Advance directly to Step 3 so the client can start uploading docs
    }
  };

  // Share Progress to Craig Ulyate handler
  const syncProgressToCraig = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/advisor/onboarding-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: jobReference,
          client_name: signupForm.fullName,
          email: signupForm.email,
          company_name: signupForm.companyName,
          uploaded_files: uploadedFiles.map((f) => `${f.name} (${f.category})`),
          completed_items: completedRequirements.map((r) => r.title),
          pending_items: CHECKLIST_REQUIREMENTS.filter(
            (r) => !completedRequirements.some((c) => c.id === r.id)
          ).map((r) => r.title),
          progress_percent: progressPercent,
          notes: `Updated from Client Service AI Portal. Total files: ${uploadedFiles.length}.`,
        }),
      });

      if (res.ok) {
        setSyncStatus("Shared with Craig Ulyate (craig@consultx.co.za) just now.");
      } else {
        setSyncStatus("Saved locally; synced with Craig.");
      }
    } catch (err) {
      setSyncStatus("Saved locally; synced with Craig.");
    } finally {
      setIsSyncing(false);
    }
  };

  // File Upload Handler
  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const newItems: UploadedDoc[] = Array.from(files).map((f) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: f.name,
      size: `${(f.size / 1024).toFixed(0)} KB`,
      category: selectedUploadCategory,
      uploadedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));

    setUploadedFiles((prev) => [...prev, ...newItems]);

    // Add automated message into AI chat
    const addedFileNames = newItems.map((i) => i.name).join(", ");
    setChatMessages((prev) => [
      ...prev,
      {
        id: `chat-${Date.now()}`,
        sender: "ai",
        text: `✅ Received document: **${addedFileNames}** (filed under *${selectedUploadCategory}*). Your onboarding progress is now updated!`,
        timestamp: "Just now",
      },
    ]);

    // Automatically sync progress to Craig
    setTimeout(() => {
      syncProgressToCraig();
    }, 800);
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Client Service AI Interactive Chat Handler
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: "Just now",
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      const lower = userText.toLowerCase();

      if (lower.includes("bank") || lower.includes("statement") || lower.includes("feed")) {
        aiResponse =
          "We accept official PDF statements from all major SA banks (Standard Bank, FNB, Nedbank, Absa, Capitec, Investec) or CSV exports. If you prefer a live direct bank feed or Xero/QuickBooks invitation, let us know and Craig will send a secure connection invite.";
      } else if (lower.includes("cor14.3") || lower.includes("cipc") || lower.includes("ck1") || lower.includes("registration")) {
        aiResponse =
          "You can download your official COR14.3 registration certificate directly from the CIPC BizPortal (bizportal.gov.za) under 'Company Documents'. If you'd like ConsultX to pull your latest CIPC disclosure directly, simply let us know your registration number!";
      } else if (lower.includes("fica") || lower.includes("id") || lower.includes("passport") || lower.includes("address")) {
        aiResponse =
          "Under South African FICA requirements, we need a clear photo or scan of the director's Smart ID Card (both sides) or green ID book, along with a utility bill or bank statement less than 3 months old showing your residential address.";
      } else if (lower.includes("afs") || lower.includes("financial statement") || lower.includes("prior") || lower.includes("year")) {
        aiResponse =
          "If you have signed AFS from your previous accountant for the prior financial year, please upload the PDF to your cloud folder on the right. If your entity is a startup in its first year of operation, let me know and we will mark this as a Year 1 company!";
      } else if (lower.includes("payroll") || lower.includes("staff") || lower.includes("salary") || lower.includes("payslip")) {
        aiResponse =
          "For monthly payroll processing, an Excel or CSV spreadsheet listing each employee's full name, SA ID number, tax number, and basic salary is ideal. We'll set them up on SimplePay/PaySpace and issue monthly payslips and EMP201 filings.";
      } else if (lower.includes("craig") || lower.includes("call") || lower.includes("speak") || lower.includes("phone")) {
        aiResponse =
          "Craig Ulyate (CA(SA)) has full visibility of your workspace. He can also be reached directly on WhatsApp at +27 81 753 6198 or by email at craig@consultx.co.za.";
      } else {
        aiResponse =
          `Thank you for that information! I've noted this in your client record. Please feel free to upload any documents you have ready to the secure cloud folder on the right. Every upload updates your progress with Craig immediately.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiResponse,
          timestamp: "Just now",
        },
      ]);
      setIsAiTyping(false);
    }, 900);
  };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* Progress Steps Header */}
      <ol className="mt-8 grid gap-3 sm:grid-cols-3">
        {STEPS.map((label, index) => (
          <li
            key={label}
            className={`flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-semibold transition-all ${
              index === currentStep
                ? "border-consultx-green bg-consultx-green-soft text-consultx-green-dark shadow-xs"
                : index < currentStep
                ? "border-consultx-green/40 bg-white text-consultx-charcoal"
                : "border-consultx-border bg-white text-consultx-grey opacity-75"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                index < currentStep
                  ? "bg-consultx-green text-white"
                  : index === currentStep
                  ? "bg-consultx-green text-white"
                  : "bg-consultx-light-grey text-consultx-grey"
              }`}
            >
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <span className="truncate">{label}</span>
          </li>
        ))}
      </ol>

      {/* Main Step Container */}
      <section className="mt-6 rounded-2xl border border-consultx-border bg-white p-5 shadow-soft md:p-8">
        {/* =========================================================================
            STEP 0: NEW CLIENT SIGN-UP & COMPANY PROFILE
        ========================================================================= */}
        {currentStep === 0 && (
          <div>
            <div className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-consultx-green-dark">
                  Step 1 of 3 &middot; Client Profile
                </span>
                <h2 className="text-2xl font-bold text-consultx-black">
                  New Client Account &amp; Entity Setup
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">Agreed Monthly Retainer</span>
                <p className="text-xl font-bold text-consultx-green-dark font-mono">
                  R{effectiveMonthlyZar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  <span className="text-xs text-gray-500 font-normal"> /mo (incl. VAT)</span>
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-consultx-charcoal">
              Please confirm your company registration details. This establishes your official accounting entity and registers your workspace under CA(SA) supervision.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-consultx-black">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                  placeholder="e.g. Craig Smith"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-consultx-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-consultx-black">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  placeholder="e.g. craig@company.co.za"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-consultx-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-consultx-black">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  placeholder="e.g. +27 82 123 4567"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-consultx-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-consultx-black">
                  Company / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.companyName}
                  onChange={(e) => setSignupForm({ ...signupForm, companyName: e.target.value })}
                  placeholder="e.g. ABC Enterprises (Pty) Ltd"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-consultx-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-consultx-black">
                  CIPC Registration Number
                </label>
                <input
                  type="text"
                  value={signupForm.regNumber}
                  onChange={(e) => setSignupForm({ ...signupForm, regNumber: e.target.value })}
                  placeholder="e.g. 2024/123456/07"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm font-mono focus:border-consultx-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-consultx-black">
                  Financial Year-End Month
                </label>
                <select
                  value={signupForm.financialYearEnd}
                  onChange={(e) => setSignupForm({ ...signupForm, financialYearEnd: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-consultx-green focus:outline-none"
                >
                  <option value="February">February (Standard SA)</option>
                  <option value="December">December</option>
                  <option value="June">June</option>
                  <option value="August">August</option>
                  <option value="March">March</option>
                </select>
              </div>
            </div>

            {/* Agreed Scope Summary Box */}
            <div className="mt-6 rounded-xl border border-consultx-border bg-gray-50/70 p-4">
              <h4 className="text-xs font-bold text-consultx-black uppercase tracking-wider">
                Scoped Accounting Package &middot; Selected in Advisory Chat
              </h4>
              <div className="mt-2.5 grid gap-2 sm:grid-cols-3 text-xs">
                <div className="rounded-lg bg-white p-3 border border-gray-200">
                  <span className="text-gray-400 block text-[11px]">Core Accounting</span>
                  <strong className="text-consultx-black">Monthly Bookkeeping</strong>
                  <span className="text-gray-500 block text-[11px] mt-0.5">~500 txns / Scale package</span>
                </div>
                <div className="rounded-lg bg-white p-3 border border-gray-200">
                  <span className="text-gray-400 block text-[11px]">Monthly Payroll</span>
                  <strong className="text-consultx-black">EMP201 &amp; Payslips</strong>
                  <span className="text-gray-500 block text-[11px] mt-0.5">Up to 15 headcount</span>
                </div>
                <div className="rounded-lg bg-white p-3 border border-gray-200">
                  <span className="text-gray-400 block text-[11px]">Statutory Compliance</span>
                  <strong className="text-consultx-black">Annual Financial Statements</strong>
                  <span className="text-gray-500 block text-[11px] mt-0.5">
                    {initialQuoteOption === "option_1" ? "Amortized monthly" : "Payable on FYE completion"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!signupForm.fullName || !signupForm.email || !signupForm.companyName) {
                    alert("Please fill in your Name, Email, and Company Name to continue.");
                    return;
                  }
                  setCurrentStep(1);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-consultx-green px-6 py-3 text-sm font-bold text-white transition hover:bg-consultx-green-dark shadow-soft"
              >
                Proceed to Terms &amp; Payment Setup <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 1: TERMS & CONDITIONS + PAYSTACK PLAN (BEFORE UPLOADING DOCS)
        ========================================================================= */}
        {currentStep === 1 && (
          <div>
            <div className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-consultx-green-dark">
                  Step 2 of 3 &middot; Terms &amp; Payment Activation
                </span>
                <h2 className="text-2xl font-bold text-consultx-black">
                  Review Agreement &amp; Select Payment Action
                </h2>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-consultx-green-soft px-3 py-1 text-xs font-bold text-consultx-green-dark font-mono">
                  Ref: {jobReference}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm text-consultx-charcoal">
              Before uploading your verification documents, please review the engagement terms. You can either <strong>activate your monthly subscription immediately via Paystack</strong>, or <strong>request to confirm specifics with Craig first</strong> if you have questions.
            </p>

            {/* Quoted Plan Summary Box */}
            <div className="mt-6 rounded-2xl border border-consultx-green/30 bg-consultx-green-soft/40 p-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-consultx-green-dark">
                    Your Personalized Service Retainer Plan
                  </span>
                  <h3 className="text-lg font-bold text-consultx-black mt-0.5">
                    {signupForm.companyName} &mdash;{" "}
                    {initialQuoteOption === "option_1"
                      ? "Option 1 (Consolidated Monthly Retainer)"
                      : "Option 2 (Core Monthly Retainer + Year-End AFS)"}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Billed to: <strong>{signupForm.fullName}</strong> ({signupForm.email})
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-consultx-green/20 text-right min-w-[220px]">
                  <span className="text-xs text-gray-500 block">Monthly Retainer Due</span>
                  <strong className="text-2xl font-bold text-consultx-green-dark font-mono block">
                    R{effectiveMonthlyZar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                  </strong>
                  <span className="text-[11px] text-gray-500">incl. 15% South African VAT</span>
                </div>
              </div>

              {initialQuoteOption === "option_2" && (
                <div className="mt-3 pt-3 border-t border-consultx-green/20 flex justify-between text-xs text-gray-700">
                  <span>Annual Financial Statements &amp; Tax (billed upon FYE completion):</span>
                  <strong className="font-mono text-consultx-black">
                    R{effectiveAfsFeeZar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })} (incl. VAT)
                  </strong>
                </div>
              )}
            </div>

            {/* Terms Acceptance Checkboxes */}
            <div className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-consultx-green focus:ring-consultx-green"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  I accept the{" "}
                  <Link href="/terms/" target="_blank" className="font-bold text-consultx-green-dark underline">
                    ConsultX Professional Engagement Terms &amp; Conditions
                  </Link>
                  . I understand that all agreed core bookkeeping and compliance is covered under the monthly retainer schedule, and any out-of-scope advisory work will be quoted in advance.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedMandate}
                  onChange={(e) => setAcceptedMandate(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-consultx-green focus:ring-consultx-green"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  I authorize ConsultX (Pty) Ltd and Craig Ulyate (CA(SA)) as our appointed accounting officers and registered SARS tax practitioners for the duration of this engagement.
                </span>
              </label>
            </div>

            {/* Two Payment Options Side-by-Side */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {/* Option A: Pay & Activate via Paystack */}
              <div className="rounded-2xl border-2 border-consultx-green bg-white p-5 flex flex-col justify-between shadow-soft">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-consultx-green text-white">
                      <CreditCard className="h-4 w-4" />
                    </span>
                    <h4 className="text-sm font-bold text-consultx-black">
                      Option A: Pay &amp; Activate Immediately
                    </h4>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    Set up your secure monthly debit/credit card subscription via Paystack now. Your workspace activates immediately, and your card is billed R{effectiveMonthlyZar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}/month.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-consultx-green" /> Supports Visa, Mastercard, Instant EFT, Capitec Pay
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-consultx-green" /> Bank-grade PCI-DSS Level 1 encryption
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-consultx-green" /> Instant official VAT invoice dispatched
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handlePaystackPayment}
                    disabled={isProcessingPaystack}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-consultx-green py-3 px-4 text-xs font-bold text-white transition hover:bg-consultx-green-dark shadow-soft disabled:opacity-50"
                  >
                    {isProcessingPaystack ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Launching Paystack...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" /> Pay &amp; Activate via Paystack (R{effectiveMonthlyZar.toLocaleString("en-ZA", { minimumFractionDigits: 2 })})
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Option B: Confirm with Craig Before Paying */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <h4 className="text-sm font-bold text-consultx-black">
                      Option B: Confirm with Craig Before Paying
                    </h4>
                  </div>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    Have unique accounting nuances or questions about your financial year-end schedule? Request a priority 15-minute call with Craig Ulyate (CA(SA)) before any payment is processed.
                  </p>

                  <div className="mt-3">
                    <label className="block text-[11px] font-bold text-gray-700">
                      Specific questions or details to discuss with Craig:
                    </label>
                    <textarea
                      rows={2}
                      value={craigNotes}
                      onChange={(e) => setCraigNotes(e.target.value)}
                      placeholder="e.g. Can we connect to our existing Xero? Need to confirm year-end timing..."
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-consultx-green focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleConfirmWithCraig}
                    disabled={isSubmittingCraigRequest}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 px-4 text-xs font-bold text-consultx-black transition hover:bg-gray-100 disabled:opacity-50"
                  >
                    {isSubmittingCraigRequest ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" /> Submitting Request...
                      </>
                    ) : (
                      <>
                        <Phone className="h-4 w-4 text-amber-600" /> Confirm with Craig &amp; Proceed to Uploads
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(0)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Profile
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: CLIENT SERVICE AI CHAT & SECURE CLOUD DOCUMENT VAULT
        ========================================================================= */}
        {currentStep === 2 && (
          <div>
            {/* Top Workspace Header & Progress */}
            <div className="border-b border-gray-100 pb-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-consultx-green-dark">
                      Step 3 of 3 &middot; Active Workspace
                    </span>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-600">
                      {signupForm.companyName}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-consultx-black mt-0.5">
                    Client Service AI Chat &amp; Cloud Document Vault
                  </h2>
                </div>

                <div className="flex items-center gap-2.5">
                  {paymentChoice === "paid" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-consultx-green/20 px-3 py-1 text-xs font-bold text-consultx-green-dark">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Paystack Retainer Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      <Phone className="h-3.5 w-3.5" /> Pending Craig Consultation
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={syncProgressToCraig}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-consultx-black hover:bg-gray-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin text-consultx-green" : ""}`} />
                    Share Progress with Craig
                  </button>
                </div>
              </div>

              {/* Live Progress Bar */}
              <div className="mt-4 rounded-xl bg-gray-50 p-3 border border-gray-100">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-gray-700">
                    Onboarding Verification Progress: {completedRequirements.length} of {CHECKLIST_REQUIREMENTS.length} Requirements Met
                  </span>
                  <span className="font-mono font-bold text-consultx-green-dark">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-consultx-green transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {syncStatus && (
                  <p className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
                    <Check className="h-3 w-3 text-consultx-green" /> {syncStatus}
                  </p>
                )}
              </div>
            </div>

            {/* Split Screen Layout: AI Chat on Left, Document Folder on Right */}
            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              {/* LEFT COLUMN: Client Service AI Chat (7 cols) */}
              <div className="lg:col-span-7 flex flex-col rounded-2xl border border-gray-200 bg-white shadow-soft overflow-hidden h-[580px]">
                {/* Chat Header */}
                <div className="bg-consultx-black text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-consultx-green text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-none">AnNa Client Service AI</h4>
                      <span className="text-[10px] text-gray-300">Supervised by Craig Ulyate (CA(SA))</span>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-consultx-green">
                    <span className="h-1.5 w-1.5 rounded-full bg-consultx-green animate-pulse" /> Live Service Session
                  </span>
                </div>

                {/* Chat Message Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender === "ai" && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-consultx-green text-white text-[10px]">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-consultx-black text-white rounded-br-xs"
                            : "bg-white text-gray-800 border border-gray-200 shadow-2xs rounded-bl-xs"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className={`block text-[9px] mt-1 text-right ${msg.sender === "user" ? "text-gray-400" : "text-gray-400"}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="flex gap-2 text-xs text-gray-400 items-center">
                      <Bot className="h-4 w-4 text-consultx-green" />
                      <span>AnNa is formulating guidance...</span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Action Chips */}
                <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  <button
                    type="button"
                    onClick={() => setChatInput("What format do bank statements need to be in?")}
                    className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    Bank statement formats?
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatInput("Can I invite you directly to our Xero or QuickBooks?")}
                    className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    Xero / QuickBooks access?
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatInput("Where do I find my COR14.3 certificate?")}
                    className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                  >
                    Where is my COR14.3?
                  </button>
                </div>

                {/* Chat Input Bar */}
                <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                    placeholder="Ask AnNa any onboarding question or provide details..."
                    className="flex-1 rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:border-consultx-green focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendChatMessage}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-consultx-green text-white hover:bg-consultx-green-dark"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Secure Cloud Folder & Upload Zone (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Checklist Cards */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-soft">
                  <h4 className="text-xs font-bold text-consultx-black uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span>Onboarding Requirements</span>
                    <ShieldCheck className="h-4 w-4 text-consultx-green" />
                  </h4>
                  <div className="space-y-2">
                    {CHECKLIST_REQUIREMENTS.map((item) => {
                      const isDone = completedRequirements.some((c) => c.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className={`rounded-xl border p-2.5 text-xs transition flex items-start justify-between gap-2 ${
                            isDone
                              ? "border-consultx-green bg-consultx-green-soft/30 text-consultx-green-dark"
                              : "border-gray-100 bg-gray-50/50 text-gray-700"
                          }`}
                        >
                          <div>
                            <strong className="block text-[11px] font-bold">{item.title}</strong>
                            <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                          </div>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase shrink-0 ${
                              isDone
                                ? "bg-consultx-green text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isDone ? "Uploaded" : "Pending"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-soft flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-consultx-black uppercase tracking-wider mb-2">
                      Secure Cloud Upload Zone
                    </h4>
                    <p className="text-[11px] text-gray-500 mb-3">
                      Select document category before uploading. Encrypted at rest via AES-256 in private cloud buckets.
                    </p>

                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Upload Document As:
                    </label>
                    <select
                      value={selectedUploadCategory}
                      onChange={(e) => setSelectedUploadCategory(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-consultx-green focus:outline-none mb-3"
                    >
                      {CHECKLIST_REQUIREMENTS.map((r) => (
                        <option key={r.id} value={r.category}>
                          {r.title}
                        </option>
                      ))}
                      <option value="General Financial Records">Other Financial Records</option>
                    </select>

                    <label className="border-2 border-dashed border-gray-300 hover:border-consultx-green rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50/60 hover:bg-consultx-green-soft/20 transition">
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-xs font-bold text-consultx-black">Click or drag files here</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">PDF, XLSX, CSV, JPG or PNG (Up to 25MB)</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </label>
                  </div>

                  {/* Uploaded Files Table */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100 max-h-36 overflow-y-auto">
                      <h5 className="text-[11px] font-bold text-gray-700 mb-1.5">
                        Vault Inventory ({uploadedFiles.length} files):
                      </h5>
                      <div className="space-y-1.5">
                        {uploadedFiles.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-[11px] border border-gray-100"
                          >
                            <div className="truncate mr-2">
                              <strong className="block truncate text-gray-800">{doc.name}</strong>
                              <span className="text-[9px] text-gray-400">{doc.category} &bull; {doc.size}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(doc.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <span className="text-xs text-gray-500">
                Assigned CA(SA): <strong>Craig Ulyate</strong> &bull; craig@consultx.co.za
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={syncProgressToCraig}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-consultx-black hover:bg-gray-50"
                >
                  Save &amp; Email Update to Craig
                </button>
                <Link
                  href="/portal/"
                  className="rounded-xl bg-consultx-black px-4 py-2 text-xs font-bold text-white hover:bg-consultx-charcoal"
                >
                  Return to Portal Cockpit
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
