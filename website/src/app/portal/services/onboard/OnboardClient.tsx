"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UniversalOnboardingWizard } from "@/components/portal/UniversalOnboardingWizard";

export function OnboardClient() {
  const searchParams = useSearchParams();
  const servicesParam = searchParams.get("services");

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
      <div className="mt-4">
        <span className="text-xs font-bold text-consultx-green-dark uppercase tracking-wider">
          Statutory Services · 2026 Price List
        </span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-consultx-black md:text-4xl">
          Onboard Your Company & Statutory Services
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-consultx-charcoal">
          Seamless onboarding for private companies, close corporations, trusts, and sole proprietors. Upload compliance documents, verify company records, and checkout securely.
        </p>
      </div>

      <UniversalOnboardingWizard initialServiceIds={initialServiceIds} />
    </div>
  );
}
