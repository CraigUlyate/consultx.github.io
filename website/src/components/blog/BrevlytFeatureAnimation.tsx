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

export function BrevlytFeatureAnimation() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % scenes.length);
        setVisible(true);
      }, 320);
    }, 4700);

    return () => window.clearInterval(timer);
  }, []);

  const scene = scenes[index];

  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,#f7f8fb_0%,#edf1fb_100%)]" aria-hidden="true">
      <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#5f7ff0]/15 blur-2xl" />
      <div className="absolute -bottom-28 right-20 h-80 w-80 rounded-full bg-[#8ea5f4]/15 blur-2xl" />

      <div className="absolute right-[2.5%] top-1/2 w-[61%] -translate-y-1/2 sm:w-[58%]">
        <div className="overflow-hidden rounded-[24px] border border-white/70 bg-white/95 shadow-[0_28px_70px_rgba(29,42,72,.18)] backdrop-blur-sm">
          <div className="flex h-10 items-center gap-2 bg-[#eff0f2] px-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d1d4d8]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#d1d4d8]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#d1d4d8]" />
            <div className="ml-3 flex-1 rounded-lg bg-white px-3 py-1 text-[10px] text-[#9ba1aa]">app.brevlyt.com</div>
          </div>

          <div className="grid min-h-[300px] grid-cols-[92px_1fr] bg-white">
            <div className="border-r border-[#eef0f2] bg-[#fafafb] p-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-[#2c3441]">
                <span className="h-5 w-5 rounded-full bg-[#6786f4]" />
                Findings
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-2 rounded bg-[#e3e5e8]" />
                <div className="h-2 rounded bg-[#e3e5e8]" />
                <div className="h-2 w-4/5 rounded bg-[#e3e5e8]" />
              </div>
            </div>

            <div className="relative flex min-w-0 flex-col p-4 pb-14">
              <div className="ml-auto max-w-[72%] rounded-[16px_16px_4px_16px] bg-[#f1f2f4] px-4 py-2 text-[11px] text-[#505762]">
                {scene.question}
              </div>

              <div className={`mt-4 flex gap-2 transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#dff8ff] text-[#3994ba]">
                  <MessageSquareText className="h-3.5 w-3.5" />
                </div>
                <div className="max-w-[82%] rounded-[16px_16px_16px_4px] border border-[#eeeeee] bg-white px-4 py-3 text-[11px] leading-[1.45] text-[#5f6670] shadow-[0_8px_24px_rgba(29,42,72,.05)]">
                  <p><strong className="text-[#3a414b]">Finding:</strong> {scene.finding}</p>
                  <p className="mt-1"><strong className="text-[#3a414b]">Risk:</strong> {scene.risk}</p>
                  <div className="mt-3 text-[#75808f]">📊 Highlights</div>
                  <ul className="mt-1 space-y-0.5 text-[#7a828d]">
                    {scene.highlights.map((item) => <li key={item}>– {item}</li>)}
                  </ul>
                  <div className="mt-3 flex gap-1.5 text-[#65717e]">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#55bb8a]" />
                    <span><strong>Suggestion</strong><br />{scene.suggestion}</span>
                  </div>
                </div>
              </div>

              <div className={`ml-8 mt-3 w-fit rounded-xl bg-[#fff8df] px-3 py-2 text-[10px] italic text-[#7d7763] transition-all delay-150 duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
                → {scene.prompt}
              </div>

              <div className="absolute inset-x-4 bottom-3 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-[11px] text-[#afb4bc]">
                Ask your CFO <span className="float-right">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
