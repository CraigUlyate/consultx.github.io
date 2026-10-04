"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { UniversalOnboardingWizard } from "@/components/portal/UniversalOnboardingWizard";

export function OnboardClient() {
  const searchParams = useSearchParams();
  const servicesParam = searchParams.get("services");
  const blueprintId = searchParams.get("blueprint_id") || searchParams.get("bp") || undefined;
  const handoffId = searchParams.get("handoff_id") || searchParams.get("hnd") || undefined;

  const initialName = searchParams.get("name") || undefined;
  const initialEmail = searchParams.get("email") || undefined;
  const initialPhone = searchParams.get("phone") || undefined;
  const initialCompany = searchParams.get("company") || undefined;
  const initialMonthlyQuote = searchParams.get("monthly") ? parseFloat(searchParams.get("monthly")!) : undefined;
  const initialQuoteOption = searchParams.get("option") || undefined;
  const initialAfsFee = searchParams.get("afs_fee") ? parseFloat(searchParams.get("afs_fee")!) : undefined;
  const leadId = searchParams.get("lead_id") || undefined;

  const initialServiceIds = useMemo(() => {
    if (!servicesParam) return [];
    return servicesParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [servicesParam]);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/portal/"
        className="inline-flex items-center gap-2 text-xs font-bold text-consultx-charcoal hover:text-consultx-green-dark"
      >
        <ArrowLeft className="h-4 w-4" /> Client Portal Overview
      </Link>

      {blueprintId && (
        <div className="mt-4 rounded-xl bg-consultx-black p-4 text-white shadow-soft flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-consultx-green text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-consultx-green font-mono">SOLUTION BLUEPRINT ATTACHED</span>
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-gray-300 font-mono">
                {blueprintId}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-300">
              Your custom workflow rules and software scope will be automatically provisioned into your AnNa workspace upon checkout.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4">
        <span className="text-xs font-bold text-consultx-green-dark uppercase tracking-wider">
          New Client Onboarding &middot; 2026 Accounting Suite
        </span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-consultx-black md:text-4xl">
          Complete Your Client Onboarding
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-consultx-charcoal">
          Sign up your company, review terms and set up your Paystack retainer (or confirm specifics with Craig), then enter your Client Service AI workspace to upload verification records and track progress.
        </p>
      </div>

      <UniversalOnboardingWizard
        initialServiceIds={initialServiceIds}
        handoffId={handoffId}
        initialName={initialName}
        initialEmail={initialEmail}
        initialPhone={initialPhone}
        initialCompany={initialCompany}
        initialMonthlyQuote={initialMonthlyQuote}
        initialQuoteOption={initialQuoteOption}
        initialAfsFee={initialAfsFee}
        leadId={leadId}
      />
    </div>
  );
}
