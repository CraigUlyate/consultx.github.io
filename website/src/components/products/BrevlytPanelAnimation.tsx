"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquareText } from "lucide-react";

const scenes = [
  {
    question: "How is our cash position?",
    finding: "Receivables are being paid 18 days later than usual.",
    risk: "We may not be able to meet payroll next month.",
    highlights: [
      "Tinza Estate — overdue by 45 days — R100k",
      "The Willows — overdue by 30 days — R50k",
      "Zimbuild — overdue by 15 days — R10k",
    ],
    suggestion: "Negotiate extra 30 days payment terms with Living Green Landscapes for R150k.",
    prompt: "How can we optimise for next month?",
  },
  {
    question: "Why is margin under pressure?",
    finding: "Gross margin has weakened despite stable revenue.",
    risk: "Input costs are rising faster than pricing adjustments.",
    highlights: [
      "Materials up 11% versus last quarter",
      "Discounting increased on key accounts",
      "Supplier costs are above forecast",
    ],
    suggestion: "Review pricing on low-margin accounts and renegotiate two key supplier contracts.",
    prompt: "Show the biggest margin drivers.",
  },
  {
    question: "What needs attention this week?",
    finding: "Collections are slowing across several large customers.",
    risk: "Working capital is tightening faster than forecast.",
    highlights: [
      "Three customers moved beyond agreed terms",
      "Debtor days increased this month",
      "Cash conversion is trending below target",
    ],
    suggestion: "Prioritise the three largest overdue accounts and update the 13-week cash forecast.",
    prompt: "What should finance do first?",
  },
];

export function BrevlytPanelAnimation() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % scenes.length);
        setVisible(true);
      }, 300);
    }, 4700);

    return () => window.clearInterval(timer);
  }, []);

  const scene = scenes[index];

  return (
    <div className="overflow-hidden rounded-[20px] border border-[#eceef2] bg-white">
      <div className="flex h-11 items-center gap-2 bg-[#f0f1f3] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d3d6da]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d3d6da]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d3d6da]" />
        <div className="ml-2 flex-1 rounded-lg bg-white px-3 py-1 text-xs text-[#9aa0a8]">
          app.brevlyt.com
        </div>
      </div>

      <div className="grid min-h-[470px] grid-cols-[92px_1fr] bg-white">
        <aside className="border-r border-[#eef0f3] bg-[#fbfbfc] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#3e4654]">
            <span className="h-5 w-5 rounded-full bg-[#6786f4]" />
            Findings
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-2 rounded bg-[#e2e5e9]" />
            <div className="h-2 rounded bg-[#e2e5e9]" />
            <div className="h-2 w-4/5 rounded bg-[#e2e5e9]" />
          </div>
        </aside>

        <div className="relative flex min-w-0 flex-col p-5 pb-16 md:p-6 md:pb-16">
          <div className="ml-auto max-w-[78%] rounded-[18px_18px_5px_18px] bg-[#f1f2f4] px-4 py-3 text-sm text-[#555d68]">
            {scene.question}
          </div>

          <div className={`mt-5 flex gap-3 transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e0f7ff] text-[#4599ba]">
              <MessageSquareText className="h-4 w-4" />
            </div>

            <div className="max-w-[86%] rounded-[18px_18px_18px_5px] border border-[#ededed] bg-white p-5 text-sm leading-6 text-[#626a78] shadow-[0_10px_30px_rgba(29,42,72,.06)]">
              <p><strong className="text-[#313843]">Finding:</strong> {scene.finding}</p>
              <p className="mt-2"><strong className="text-[#313843]">Risk:</strong> {scene.risk}</p>

              <div className="mt-4 text-[#7b8491]">📊 Highlights</div>
              <ul className="mt-1 space-y-1 text-[#79818d]">
                {scene.highlights.map((item) => (
                  <li key={item}>– {item}</li>
                ))}
              </ul>

              <div className="mt-4 flex gap-2 rounded-xl bg-[#f5f8ff] p-3 text-[#5d6878]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4f79e7]" />
                <span><strong className="text-[#394250]">Suggestion</strong><br />{scene.suggestion}</span>
              </div>
            </div>
          </div>

          <div className={`ml-10 mt-3 w-fit rounded-xl bg-[#fff8df] px-3 py-2 text-xs italic text-[#7c7560] transition-all delay-150 duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
            → {scene.prompt}
          </div>

          <div className="absolute inset-x-5 bottom-4 rounded-xl border border-[#e4e7eb] bg-white px-4 py-3 text-sm text-[#a0a6ae] md:inset-x-6">
            Ask your CFO <span className="float-right">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
