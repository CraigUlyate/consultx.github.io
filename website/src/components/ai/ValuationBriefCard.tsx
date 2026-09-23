"use client";

import React from "react";
import { ValuationBrief } from "@/lib/advisor-api";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  FileText,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from "lucide-react";

interface ValuationBriefCardProps {
  brief: ValuationBrief;
  onBookMeeting: () => void;
}

export function ValuationBriefCard({ brief, onBookMeeting }: ValuationBriefCardProps) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-amber-200/80 bg-white text-gray-800 shadow-md">
      {/* Card Header */}
      <div className="border-b border-amber-100 bg-gradient-to-r from-amber-500/10 via-amber-50 to-emerald-50/40 px-4 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
            <Briefcase className="h-3 w-3 text-amber-700" />
            CA(SA) Specialist Advisory Brief
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-600">
            <UserCheck className="h-3.5 w-3.5 text-consultx-green-dark" />
            Lead: {brief.leadAdvisor}
          </span>
        </div>
        <h4 className="mt-2 text-sm font-bold text-consultx-black">
          Business Valuation: {brief.valuationPurpose}
        </h4>
        <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">
          {brief.executiveSummary}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 divide-y divide-gray-100 border-b border-gray-100 bg-gray-50/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0 text-xs">
        <div className="p-3">
          <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Turnover Tier
          </span>
          <p className="mt-1 font-bold text-gray-900">{brief.companyTurnoverRange}</p>
        </div>
        <div className="p-3">
          <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Turnaround
          </span>
          <p className="mt-1 font-bold text-gray-900">{brief.typicalDeliveryWeeks}</p>
        </div>
        <div className="p-3 bg-amber-50/40">
          <span className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
            <Coins className="h-3 w-3" /> Indicative Fixed Fee
          </span>
          <p className="mt-1 font-bold text-amber-900">{brief.indicativeFeeZar}</p>
        </div>
      </div>

      {/* Recommended Methodologies */}
      <div className="p-4 border-b border-gray-100">
        <h5 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <ShieldCheck className="h-3.5 w-3.5 text-consultx-green-dark" />
          Recommended Valuation Methodologies
        </h5>
        <div className="space-y-1.5">
          {brief.recommendedMethodologies.map((method, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-700 border border-gray-100"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-consultx-green-dark shrink-0 mt-0.5" />
              <span>{method}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documentation */}
      <div className="p-4 bg-gray-50/40">
        <h5 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <FileText className="h-3.5 w-3.5 text-amber-700" />
          Required Documentation Checklist
        </h5>
        <ul className="space-y-1 text-xs text-gray-600 pl-1">
          {brief.requiredDocuments.map((doc, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
          <FileCheck2 className="h-4 w-4 text-consultx-green-dark" />
          <span>Includes formal signed CA(SA) Valuation Opinion</span>
        </div>
        <button
          type="button"
          onClick={onBookMeeting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-consultx-black px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition-all shadow-soft"
        >
          <Calendar className="h-3.5 w-3.5 text-consultx-green" />
          Schedule Scoping Call with Craig
        </button>
      </div>
    </div>
  );
}
