"use client";

import React from "react";
import Link from "next/link";
import { ServiceQuote } from "@/lib/advisor-api";
import {
  ArrowRight,
  Calculator,
  FileText,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

interface ServiceQuoteCardProps {
  quote: ServiceQuote;
  onTalkToCraig?: () => void;
}

export function ServiceQuoteCard({ quote, onTalkToCraig }: ServiceQuoteCardProps) {
  const formatZar = (val: number) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-consultx-green/30 bg-white text-gray-800 shadow-md">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-consultx-green-soft via-white to-gray-50 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-consultx-green/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-consultx-green-dark">
            <Calculator className="h-3 w-3 text-consultx-green-dark" />
            2026 Rates Schedule · Fixed-Fee Quote
          </span>
          <span className="text-[10px] text-gray-400 font-mono">Ref: {quote.id}</span>
        </div>
        <h4 className="mt-1.5 text-sm font-bold text-consultx-black">
          Statutory Compliance & Accounting Services
        </h4>
      </div>

      {/* Itemized Services */}
      <div className="divide-y divide-gray-100 px-4 py-2">
        {quote.services.map((svc) => (
          <div key={svc.id} className="py-3">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span className="font-bold text-xs text-gray-900">{svc.name}</span>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-gray-500">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 capitalize">
                    {svc.category.replace("_", " ")}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{svc.billingType.replace("_", " ")}</span>
                </div>
              </div>
              <span className="font-bold text-xs text-consultx-black font-mono">
                {svc.priceFormatted}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-600">{svc.description}</p>

            {svc.requiredDocuments && svc.requiredDocuments.length > 0 && (
              <div className="mt-2 rounded-lg bg-gray-50 p-2 text-[10px] text-gray-600">
                <span className="font-semibold text-gray-700 flex items-center gap-1 mb-1">
                  <FileText className="h-3 w-3 text-consultx-green-dark" /> Required for onboarding:
                </span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {svc.requiredDocuments.slice(0, 2).map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                  {svc.requiredDocuments.length > 2 && (
                    <li>+{svc.requiredDocuments.length - 2} additional verification doc(s)</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Financial Breakdown */}
      <div className="bg-gray-50 p-4 border-t border-gray-100 text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (Exclusive of VAT):</span>
            <span className="font-mono">{formatZar(quote.subtotalZar)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>15% VAT:</span>
            <span className="font-mono">{formatZar(quote.vatZar)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-consultx-black border-t border-gray-200 pt-2">
            <span>Total Payable:</span>
            <span className="text-consultx-green-dark font-mono">{formatZar(quote.totalZar)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500">
          <ShieldCheck className="h-3.5 w-3.5 text-consultx-green-dark shrink-0" />
          <span>Pay online via Paystack (Card / Instant EFT) or manual Investec Bank EFT</span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {onTalkToCraig ? (
          <button
            type="button"
            onClick={onTalkToCraig}
            className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-consultx-black"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Have questions first?
          </button>
        ) : (
          <div />
        )}

        <Link
          href={quote.onboardingUrl}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-consultx-green px-4 py-2.5 text-xs font-bold text-white hover:bg-consultx-green-dark transition-all shadow-soft"
        >
          Proceed to Onboarding & Payment
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
