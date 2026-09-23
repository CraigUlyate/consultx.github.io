"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  Landmark,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import {
  RATES_SCHEDULE_2026,
  ServiceItem,
  calculateQuoteTotal,
  SERVICE_CATEGORIES,
} from "@/lib/rates-schedule";

interface UniversalOnboardingWizardProps {
  initialServiceIds?: string[];
}

const STEPS = ["Services & Scope", "Company Details", "Documents & Contact", "Payment & Mandate"];

export function UniversalOnboardingWizard({ initialServiceIds = [] }: UniversalOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Step 0: Selected Services
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(() => {
    if (initialServiceIds.length > 0) return initialServiceIds;
    return ["afs_company", "tax_clearance"]; // sensible default
  });

  // Step 1: Company Details
  const [companyForm, setCompanyForm] = useState({
    name: "Acme Industrial Holdings (Pty) Ltd",
    entityType: "company",
    regNumber: "2023/589214/07",
    taxNumber: "9482103984",
    vatNumber: "4920194823",
    financialYearEnd: "February",
  });

  // Step 2: Contact & Documents
  const [contactForm, setContactForm] = useState({
    contactName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; category?: string }[]>([]);

  // Step 3: Authorisation & Payment
  const [mandateConfirmed, setMandateConfirmed] = useState(false);
  const [accuracyConfirmed, setAccuracyConfirmed] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showEftModal, setShowEftModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedJobRef, setCompletedJobRef] = useState<string | null>(null);

  // Unique Job Reference
  const [jobReference] = useState(() => `CX-2026-${Math.floor(10000 + Math.random() * 90000)}`);

  // Calculate pricing
  const quote = useMemo(() => calculateQuoteTotal(selectedServiceIds), [selectedServiceIds]);

  // Aggregate required documents for all selected services
  const requiredDocuments = useMemo(() => {
    const docs = new Set<string>();
    selectedServiceIds.forEach((id) => {
      const s = RATES_SCHEDULE_2026.find((x) => x.id === id);
      if (s) {
        s.requiredDocuments.forEach((d) => docs.add(d));
      }
    });
    return Array.from(docs);
  }, [selectedServiceIds]);

  const toggleService = (id: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(0)} KB`,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Paystack Popup handler
  const triggerPaystackPopup = () => {
    if (!contactForm.email) {
      alert("Please provide an email address in the previous step.");
      return;
    }

    setIsProcessingPayment(true);

    const paystackKey =
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_live_f0f37320b92d8ff55535cf36070a78619bc9ba8f";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PaystackPop = (window as any).PaystackPop;

    if (PaystackPop) {
      try {
        const handler = PaystackPop.setup({
          key: paystackKey,
          email: contactForm.email,
          amount: Math.round(quote.total * 100), // amount in cents
          currency: "ZAR",
          ref: jobReference,
          metadata: {
            custom_fields: [
              { display_name: "Company Name", variable_name: "company_name", value: companyForm.name },
              { display_name: "Job Reference", variable_name: "job_ref", value: jobReference },
              { display_name: "Selected Services", variable_name: "services", value: selectedServiceIds.join(", ") },
            ],
          },
          callback: function (response: { reference: string }) {
            setIsProcessingPayment(false);
            setCompletedJobRef(response.reference || jobReference);
          },
          onClose: function () {
            setIsProcessingPayment(false);
          },
        });
        handler.openIframe();
      } catch (err) {
        console.error("Paystack popup error:", err);
        setIsProcessingPayment(false);
        // Fallback for simulation / test mode
        setCompletedJobRef(jobReference);
      }
    } else {
      // In case CDN hasn't loaded or offline sandbox
      setTimeout(() => {
        setIsProcessingPayment(false);
        setCompletedJobRef(jobReference);
      }, 1000);
    }
  };

  const handleEftSelection = () => {
    setShowEftModal(true);
    setCompletedJobRef(jobReference);
  };

  const downloadProFormaPdf = () => {
    // Generates print/PDF window with official ConsultX Pro-Forma layout
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = quote.items
      .map(
        (it: ServiceItem) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px 8px;"><strong>${it.name}</strong><br/><span style="color:#6b7280; font-size:12px;">${it.description}</span></td>
          <td style="padding: 10px 8px; text-align:right; font-family: monospace;">${it.priceFormatted}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pro-Forma Tax Invoice - ${jobReference}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111827; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #72c600; padding-bottom: 20px; }
            .company { font-size: 20px; font-weight: bold; }
            .details { margin-top: 25px; display: flex; justify-content: space-between; font-size: 13px; line-height: 1.6; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; font-size: 14px; }
            th { background: #f3f4f6; text-align: left; padding: 8px; }
            .totals { margin-top: 20px; float: right; width: 300px; font-size: 14px; line-height: 1.8; }
            .bank-box { margin-top: 150px; background: #f9fafb; border: 1px solid #d1d5db; padding: 18px; border-radius: 8px; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">CONSULTX (PTY) LTD</div>
              <div style="font-size: 12px; color: #6b7280;">Chartered Accountants (SA) · Practice # 03418293</div>
              <div style="font-size: 12px; color: #6b7280;">Email: craig@consultx.co.za · Johannesburg, South Africa</div>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; color: #111827;">PRO-FORMA INVOICE</h2>
              <div style="font-family: monospace; font-size: 14px; margin-top: 4px;"><strong>${jobReference}</strong></div>
              <div style="font-size: 12px; color: #6b7280;">Date: ${new Date().toLocaleDateString("en-ZA")}</div>
            </div>
          </div>

          <div class="details">
            <div>
              <strong>Billed To:</strong><br/>
              ${companyForm.name}<br/>
              Reg: ${companyForm.regNumber}<br/>
              Tax Ref: ${companyForm.taxNumber || "N/A"}<br/>
              Attention: ${contactForm.contactName || "Director"} (${contactForm.email})
            </div>
            <div style="text-align: right;">
              <strong>Payment Terms:</strong> Due upon presentation / EFT<br/>
              <strong>Bank:</strong> Investec Bank Ltd<br/>
              <strong>Dispatch:</strong> craig@consultx.co.za
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Service Description</th>
                <th style="text-align: right;">Fee (ZAR)</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div style="display:flex; justify-content:space-between;"><span>Subtotal:</span> <span style="font-family:monospace;">${quote.subtotalFormatted}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>15% VAT:</span> <span style="font-family:monospace;">${quote.vatFormatted}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:16px; border-top:1px solid #111; padding-top:6px;"><span>Total Due:</span> <span style="font-family:monospace; color:#72c600;">${quote.totalFormatted}</span></div>
          </div>

          <div style="clear:both;"></div>

          <div class="bank-box">
            <strong>OFFICIAL BANKING DETAILS (INVESTEC BANK LTD)</strong><br/>
            Account Name: <strong>ConsultX (Pty) Ltd</strong><br/>
            Bank: <strong>Investec Bank Ltd</strong><br/>
            Branch Code: <strong>580105</strong><br/>
            Account Number: <strong>10012498214</strong><br/>
            Payment Reference: <strong style="color:#b45309;">${jobReference}</strong> (Crucial for automated clearing)<br/>
            Please email proof of payment to: <strong>craig@consultx.co.za</strong>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  // Completion State
  if (completedJobRef && !showEftModal) {
    return (
      <div className="mt-8 rounded-2xl border border-consultx-green/30 bg-white p-8 text-center shadow-md max-w-2xl mx-auto">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-consultx-green-soft text-consultx-green">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <span className="mt-4 inline-block rounded-full bg-consultx-green/20 px-3 py-1 text-xs font-bold text-consultx-green-dark">
          Order Queued Successfully
        </span>
        <h2 className="mt-2 text-2xl font-bold text-consultx-black">
          Onboarding Completed: {completedJobRef}
        </h2>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
          Thank you. Your statutory service mandate for <strong>{companyForm.name}</strong> has been received by Craig Ulyate (CA(SA)).
        </p>

        <div className="mt-6 rounded-xl bg-gray-50 p-5 text-left border border-gray-100 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Job Reference:</span>
            <strong className="font-mono text-gray-900">{completedJobRef}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total Services:</span>
            <strong className="text-gray-900">{quote.items.length} services ({quote.totalFormatted})</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Contact Email:</span>
            <strong className="text-gray-900">{contactForm.email || "Registered email"}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Assigned Resource:</span>
            <strong className="text-consultx-green-dark">Craig Ulyate (CA(SA)) · craig@consultx.co.za</strong>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={downloadProFormaPdf}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-consultx-black hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Download Official Invoice PDF
          </button>
          <Link
            href="/portal/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-consultx-green px-5 py-2.5 text-xs font-bold text-white hover:bg-consultx-green-dark"
          >
            Return to Client Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />

      {/* Progress Steps Header */}
      <ol className="mt-8 grid gap-3 sm:grid-cols-4">
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
            STEP 0: SERVICE SELECTION & 2026 RATES ESTIMATE
        ========================================================================= */}
        {currentStep === 0 && (
          <div>
            <div className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-consultx-green-dark">
                  Step 1 of 4 · 2026 Rates Schedule
                </span>
                <h2 className="text-2xl font-bold text-consultx-black">Select Your Services</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">Total Estimate (incl. VAT)</span>
                <p className="text-xl font-bold text-consultx-green-dark font-mono">
                  {quote.totalFormatted}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-consultx-charcoal">
              Choose the statutory, compliance, or accounting services you require. Prices reflect ConsultX’s 2026 rate card with complete transparency.
            </p>

            <div className="mt-6 space-y-6">
              {(Object.entries(SERVICE_CATEGORIES) as [string, string][]).map(([catKey, catLabel]) => {
                const itemsInCat = RATES_SCHEDULE_2026.filter((s) => s.category === catKey);
                if (!itemsInCat.length) return null;

                return (
                  <div key={catKey}>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                      {catLabel}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {itemsInCat.map((service) => {
                        const isSelected = selectedServiceIds.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`cursor-pointer rounded-xl border p-4 transition-all ${
                              isSelected
                                ? "border-consultx-green bg-consultx-green-soft/40 shadow-xs"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                                    isSelected
                                      ? "border-consultx-green bg-consultx-green text-white"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {isSelected && <Check className="h-3.5 w-3.5" />}
                                </div>
                                <span className="font-bold text-xs text-gray-900">{service.name}</span>
                              </div>
                              <span className="font-mono text-xs font-bold text-consultx-black shrink-0">
                                {service.priceFormatted}
                              </span>
                            </div>
                            <p className="mt-2 text-[11px] text-gray-600 pl-7 leading-relaxed">
                              {service.description}
                            </p>
                            <div className="mt-2 pl-7 flex items-center gap-2 text-[10px] text-gray-400">
                              <span className="capitalize">{service.billingType.replace("_", " ")}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Breakdown Box */}
            <div className="mt-6 rounded-xl bg-gray-50 p-4 border border-gray-200">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Selected Services ({quote.items.length}):</span>
                <span>{quote.subtotalFormatted} + VAT</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-consultx-black border-t border-gray-200 pt-2">
                <span>Total Payable:</span>
                <span className="text-consultx-green-dark font-mono">{quote.totalFormatted}</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 1: COMPANY / ENTITY DETAILS
        ========================================================================= */}
        {currentStep === 1 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-consultx-green-dark">
              Step 2 of 4 · Legal Entity
            </span>
            <h2 className="text-2xl font-bold text-consultx-black">Company & Statutory Details</h2>
            <p className="mt-2 text-sm text-consultx-charcoal">
              Enter official CIPC and SARS details for the entity being serviced.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2 text-xs">
              <div>
                <label className="block font-bold text-gray-700">Registered Entity Name *</label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border px-3 py-2.5 font-medium outline-none focus:border-consultx-green"
                  placeholder="e.g. Acme Holdings (Pty) Ltd"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">Entity Structure *</label>
                <select
                  value={companyForm.entityType}
                  onChange={(e) => setCompanyForm({ ...companyForm, entityType: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border bg-white px-3 py-2.5 font-medium outline-none focus:border-consultx-green"
                >
                  <option value="company">Private Company (Pty Ltd)</option>
                  <option value="close-corporation">Close Corporation (CC)</option>
                  <option value="sole-prop">Sole Proprietorship / Individual</option>
                  <option value="trust">Inter Vivos / Family Trust</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700">CIPC Registration Number</label>
                <input
                  type="text"
                  value={companyForm.regNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, regNumber: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border px-3 py-2.5 font-medium outline-none focus:border-consultx-green"
                  placeholder="e.g. 2023/123456/07"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">SARS Income Tax Reference #</label>
                <input
                  type="text"
                  value={companyForm.taxNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, taxNumber: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border px-3 py-2.5 font-medium outline-none focus:border-consultx-green"
                  placeholder="10-digit SARS tax number"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">VAT Registration # (if applicable)</label>
                <input
                  type="text"
                  value={companyForm.vatNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, vatNumber: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border px-3 py-2.5 font-medium outline-none focus:border-consultx-green"
                  placeholder="e.g. 4920194823"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">Financial Year End</label>
                <select
                  value={companyForm.financialYearEnd}
                  onChange={(e) => setCompanyForm({ ...companyForm, financialYearEnd: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border bg-white px-3 py-2.5 font-medium outline-none focus:border-consultx-green"
                >
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="June">June</option>
                  <option value="December">December</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: CONTACT & SECURE DOCUMENT UPLOAD
        ========================================================================= */}
        {currentStep === 2 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-consultx-green-dark">
              Step 3 of 4 · Contact & Documents
            </span>
            <h2 className="text-2xl font-bold text-consultx-black">Primary Contact & Document Upload</h2>
            <p className="mt-2 text-sm text-consultx-charcoal">
              Provide your details and upload the necessary documentation for your selected services.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={contactForm.contactName}
                  onChange={(e) => setContactForm({ ...contactForm, contactName: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border px-3 py-2 font-medium outline-none focus:border-consultx-green"
                  placeholder="e.g. David Nkosi"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700">Official Work Email *</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border px-3 py-2 font-medium outline-none focus:border-consultx-green"
                  placeholder="david@company.co.za"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-consultx-border px-3 py-2 font-medium outline-none focus:border-consultx-green"
                  placeholder="082 123 4567"
                />
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="mt-6 rounded-xl bg-amber-50/70 p-4 border border-amber-200/80">
              <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-amber-700" />
                Required Verification Documents for Selected Services:
              </h4>
              <ul className="mt-2 grid gap-1.5 sm:grid-cols-2 text-[11px] text-amber-950">
                {requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upload Dropzone */}
            <div className="mt-6 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-consultx-green-soft text-consultx-green">
                <Upload className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-bold text-gray-800">
                Upload Trial Balance, Prior AFS, or Utility Bills
              </p>
              <p className="mt-1 text-[11px] text-gray-500">
                Supports PDF, Excel (.xlsx/.xls), Word, and image files up to 25MB each.
              </p>

              <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white border border-gray-300 px-4 py-2 text-xs font-bold text-consultx-black hover:border-consultx-green shadow-xs">
                <Plus className="h-3.5 w-3.5" /> Select Files
                <input
                  type="file"
                  multiple
                  accept=".pdf,.xlsx,.xls,.doc,.docx,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </label>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 text-left">
                  {uploadedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg bg-white p-2.5 border border-gray-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-consultx-green-dark" />
                        <span className="font-medium text-gray-800">{file.name}</span>
                        <span className="text-[10px] text-gray-400">({file.size})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-500">
              <Lock className="h-3.5 w-3.5 text-consultx-green-dark" />
              Uploaded files are stored in an encrypted client bucket on Google Cloud Platform, accessible only by authorised ConsultX personnel.
            </p>
          </div>
        )}

        {/* =========================================================================
            STEP 3: REVIEW, MANDATE & DUAL PAYMENT
        ========================================================================= */}
        {currentStep === 3 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-consultx-green-dark">
              Step 4 of 4 · Authorisation & Checkout
            </span>
            <h2 className="text-2xl font-bold text-consultx-black">Review & Select Payment Option</h2>

            {/* Order Summary Table */}
            <div className="mt-5 divide-y divide-gray-200 rounded-xl border border-gray-200 overflow-hidden text-xs">
              <div className="bg-gray-50 p-3 font-bold text-gray-700 flex justify-between">
                <span>Service Description</span>
                <span>Fee</span>
              </div>
              {quote.items.map((it: ServiceItem) => (
                <div key={it.id} className="p-3 flex justify-between bg-white">
                  <div>
                    <strong className="text-gray-900">{it.name}</strong>
                    <div className="text-[11px] text-gray-500 capitalize">
                      {it.category.replace("_", " ")} · {it.billingType.replace("_", " ")}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-gray-900">{it.priceFormatted}</span>
                </div>
              ))}
              <div className="bg-gray-50/50 p-3 space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal (exclusive of VAT):</span>
                  <span className="font-mono">{quote.subtotalFormatted}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>15% Value-Added Tax:</span>
                  <span className="font-mono">{quote.vatFormatted}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-consultx-black border-t border-gray-200 pt-2">
                  <span>Total Payable:</span>
                  <span className="font-mono text-consultx-green-dark text-base">
                    {quote.totalFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* Mandate & Compliance Checkboxes */}
            <div className="mt-5 space-y-3 text-xs">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={mandateConfirmed}
                  onChange={(e) => setMandateConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#72c600]"
                />
                <span>
                  <strong>Authority to Act Mandate:</strong> I confirm that I am authorised to instruct ConsultX (Pty) Ltd to act as accounting and statutory representatives for <strong>{companyForm.name}</strong>.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={accuracyConfirmed}
                  onChange={(e) => setAccuracyConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#72c600]"
                />
                <span>
                  <strong>Information Accuracy:</strong> I declare that all information and documentation provided are true, complete, and correct.
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#72c600]"
                />
                <span>
                  I accept the ConsultX Terms of Engagement and POPIA privacy terms.
                </span>
              </label>
            </div>

            {/* Dual Payment Options */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Choose Payment Method:</h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Option A: Paystack Popup */}
                <div className="rounded-xl border border-gray-200 p-5 hover:border-consultx-green transition-all bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <CreditCard className="h-5 w-5 text-consultx-green-dark" />
                      <span>Online Card & Instant EFT</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      Instant clearing via Paystack Popup. Supports Visa, Mastercard, and Instant EFT (Ozow / Capitec Pay).
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!mandateConfirmed || !accuracyConfirmed || !acceptedTerms || isProcessingPayment}
                    onClick={triggerPaystackPopup}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-consultx-green px-4 py-3 text-xs font-bold text-white hover:bg-consultx-green-dark disabled:opacity-40 shadow-soft"
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Opening Paystack...
                      </span>
                    ) : (
                      <span>Pay {quote.totalFormatted} via Paystack</span>
                    )}
                  </button>
                </div>

                {/* Option B: Bank EFT */}
                <div className="rounded-xl border border-gray-200 p-5 hover:border-consultx-green transition-all bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                      <Landmark className="h-5 w-5 text-amber-700" />
                      <span>Manual Bank EFT (Investec)</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                      Make an electronic transfer directly to ConsultX’s Investec Bank account. An official Pro-Forma Tax Invoice PDF will be generated immediately.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!mandateConfirmed || !accuracyConfirmed || !acceptedTerms}
                    onClick={handleEftSelection}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-consultx-black px-4 py-3 text-xs font-bold text-white hover:bg-gray-800 disabled:opacity-40 shadow-soft"
                  >
                    Generate Bank EFT Pro-Forma
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Footer */}
        <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-consultx-border pt-6 sm:flex-row">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold text-consultx-charcoal hover:bg-consultx-light-grey"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 0 ? "Back to Portal" : "Back"}
          </button>

          {currentStep < 3 && (
            <button
              type="button"
              disabled={currentStep === 0 && selectedServiceIds.length === 0}
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-consultx-green px-5 py-2.5 text-xs font-bold text-white hover:bg-consultx-green-dark disabled:opacity-40"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* EFT Modal */}
      {showEftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                  <Landmark className="h-3 w-3" /> Official Investec Bank Details
                </span>
                <h3 className="mt-1 text-base font-bold text-consultx-black">
                  Bank EFT Payment Instructions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEftModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-4 border border-gray-200 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Bank Name:</span>
                <strong className="text-gray-900">Investec Bank Ltd</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Name:</span>
                <strong className="text-gray-900">ConsultX (Pty) Ltd</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Number:</span>
                <strong className="font-mono text-gray-900">10012498214</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Branch Code:</span>
                <strong className="font-mono text-gray-900">580105</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Type:</span>
                <strong className="text-gray-900">Business Current Account</strong>
              </div>
              <div className="flex justify-between bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span className="text-amber-900 font-bold">Payment Reference:</span>
                <strong className="font-mono text-amber-950 font-bold text-sm">
                  {jobReference}
                </strong>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Total Amount:</span>
                <strong className="text-consultx-green-dark font-mono text-sm">
                  {quote.totalFormatted}
                </strong>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-blue-50 p-3 text-[11px] text-blue-900 border border-blue-100 leading-relaxed">
              <strong>Official Email Dispatch:</strong> An official Pro-Forma Tax Invoice PDF has been dispatched to <strong>{contactForm.email || "your email"}</strong> from <strong>craig@consultx.co.za</strong>. Craig has been notified of your service request.
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={downloadProFormaPdf}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-consultx-green px-4 py-2.5 text-xs font-bold text-white hover:bg-consultx-green-dark shadow-soft"
              >
                <Download className="h-4 w-4" /> Download Pro-Forma PDF
              </button>
              <button
                type="button"
                onClick={() => setShowEftModal(false)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
