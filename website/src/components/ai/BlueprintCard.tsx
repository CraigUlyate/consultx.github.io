"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { SolutionBlueprint } from "@/lib/advisor-api";

interface BlueprintCardProps {
  blueprint: SolutionBlueprint;
  onBookReview: () => void;
  onRefine?: () => void;
}

export function BlueprintCard({ blueprint, onBookReview, onRefine }: BlueprintCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-4 rounded-xl border border-consultx-green/30 bg-white p-5 shadow-soft transition-all duration-200 hover:border-consultx-green hover:shadow-active">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                blueprint.isTailored
                  ? "bg-consultx-green-soft text-consultx-green-dark"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              {blueprint.isTailored ? "Tailored Solution Blueprint" : "Preliminary Solution Hypothesis"}
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
              Feasibility: {blueprint.feasibilityRating}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-bold text-consultx-black">{blueprint.title}</h3>
        </div>

        {/* Opportunity Score Gauge */}
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100">
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Opportunity</div>
            <div className="text-base font-extrabold text-consultx-black">
              {blueprint.opportunityScore}<span className="text-xs font-normal text-gray-400">/10</span>
            </div>
          </div>
          <TrendingUp className="h-5 w-5 text-consultx-green" />
        </div>
      </div>

      {/* Preliminary Refine Banner */}
      {!blueprint.isTailored && onRefine && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-amber-50/90 border border-amber-200/80 p-2.5 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Preliminary Estimate.</strong> Want a more focused solution for your exact software and volume?
            </span>
          </div>
          <button
            type="button"
            onClick={onRefine}
            className="rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700 transition-all shadow-xs"
          >
            Refine with 3 Questions →
          </button>
        </div>
      )}

      {/* Problem Restatement */}
      <p className="mt-3 text-xs leading-relaxed text-gray-600">
        <strong className="text-gray-900">Diagnosed Challenge:</strong> {blueprint.problemRestatement}
      </p>

      {/* Process Flow Comparison */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {/* Current State */}
        <div className="rounded-lg bg-gray-50/80 p-3 text-xs border border-gray-100">
          <div className="flex items-center gap-1.5 font-semibold text-gray-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Current Friction
          </div>
          <ul className="mt-2 space-y-1.5 text-gray-600">
            {blueprint.currentFlow.map((step, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-gray-400">·</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Proposed State */}
        <div className="rounded-lg bg-consultx-green-soft/40 p-3 text-xs border border-consultx-green/20">
          <div className="flex items-center gap-1.5 font-semibold text-consultx-green-dark">
            <CheckCircle2 className="h-3.5 w-3.5 text-consultx-green" /> Proposed Automated Flow
          </div>
          <ul className="mt-2 space-y-1.5 text-gray-700">
            {blueprint.proposedFlow.map((step, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <ArrowRight className="h-3 w-3 shrink-0 text-consultx-green mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Systems & Architecture */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
        <span className="text-xs font-medium text-gray-400">Ecosystem:</span>
        {blueprint.systemsInvolved.map((sys) => (
          <span
            key={sys}
            className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700"
          >
            {sys}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1 text-[11px] text-gray-500">
          <Cpu className="h-3 w-3 text-consultx-green" /> {blueprint.architecturePattern}
        </span>
      </div>

      {/* Indicative Investment & ROI */}
      <div className="mt-4 rounded-lg bg-gradient-to-br from-gray-900 to-consultx-charcoal p-3.5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              {blueprint.indicativeQuote.setupTier} Estimate
            </span>
            <div className="text-base font-bold text-consultx-green">
              {blueprint.indicativeQuote.estimatedSetupZar}
              {blueprint.indicativeQuote.estimatedMonthlyZar && (
                <span className="text-xs font-normal text-gray-300">
                  {" "}
                  + {blueprint.indicativeQuote.estimatedMonthlyZar}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Payback</span>
            <div className="text-xs font-semibold text-gray-200">
              {blueprint.indicativeQuote.expectedPaybackMonths}
            </div>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-gray-300 border-t border-gray-700/60 pt-2">
          {blueprint.indicativeQuote.pricingBasis}
        </p>
      </div>

      {/* Expandable Deep Diagnostic: Controls & Validation */}
      {expanded && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-3 text-xs">
          <div>
            <span className="flex items-center gap-1 font-semibold text-gray-800">
              <ShieldCheck className="h-3.5 w-3.5 text-consultx-green" /> Human Checkpoints & Controls
            </span>
            <ul className="mt-1.5 space-y-1 text-gray-600">
              {blueprint.humanCheckpoints.map((cp, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-consultx-green">✓</span> {cp}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="flex items-center gap-1 font-semibold text-gray-800">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Key Assumptions to Validate
            </span>
            <ul className="mt-1.5 space-y-1 text-gray-600">
              {blueprint.whatToValidate.map((val, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-gray-400">?</span> {val}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-800"
        >
          {expanded ? (
            <>
              Less detail <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View controls & assumptions <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBookReview}
          className="inline-flex items-center gap-1.5 rounded-lg bg-consultx-green px-4 py-2 text-xs font-semibold text-white shadow-soft transition-all hover:bg-consultx-green-dark"
        >
          <Calendar className="h-3.5 w-3.5" /> Review with Craig (CA(SA))
        </button>
      </div>
    </div>
  );
}
