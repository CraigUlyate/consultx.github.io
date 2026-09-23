"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { AdvisorChat } from "@/components/ai/AdvisorChat";
import { Sparkles, Shield, Award, Clock } from "lucide-react";

export function AdvisorPageClient() {
  const searchParams = useSearchParams();
  const queryPrompt = searchParams.get("q") || searchParams.get("prompt") || undefined;

  return (
    <div className="bg-gray-50/50 min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Intro Banner */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-consultx-green-soft px-3 py-1 text-xs font-semibold text-consultx-green-dark">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Business Science Advisor</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-consultx-black sm:text-4xl">
            Ask AnNa: Diagnose Your Workflow
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
            Tell AnNa where you spend manual time across finance and operations. Receive an indicative
            Solution Blueprint, system feasibility score, and review it directly with Craig Ulyate (CA(SA)).
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4 text-consultx-green" /> Chartered Accountant Led
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-consultx-green" /> Instant 3-Minute Diagnosis
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-consultx-green" /> POPIA Compliant & Secure
            </span>
          </div>
        </div>

        {/* Full-width Chat Application Window */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
          <AdvisorChat initialPrompt={queryPrompt} fullPage={true} />
        </div>
      </div>
    </div>
  );
}
