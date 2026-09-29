import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { workflowSolutions } from "@/data/workflowSolutions";

export const metadata: Metadata = {
  title: "Workflow Automation Solutions",
  description:
    "Cut corporate finance operating costs by up to 50% with ERP-agnostic task automation, initial assessment, solution roadmap and rigorous controls.",
};

export default function WorkflowAutomationPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <Link
        href="/products/"
        className="text-sm font-semibold text-consultx-green transition hover:text-consultx-green-dark"
      >
        ← Products
      </Link>

      <p className="mt-8 text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
        Concept
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
        Workflow Automation
      </h1>
      <p className="mt-4 text-xl font-semibold text-consultx-green">
        Cut corporate finance operating costs by up to 50%
      </p>
      <p className="mt-5 max-w-3xl border-l-2 border-consultx-green pl-4 text-base font-semibold leading-7 text-consultx-charcoal md:text-lg">
        If you&apos;re not actively implementing AI-supported automation solutions, you&apos;re
        falling behind.{" "}
        <Link
          href="/blog/ai-supported-automation-falling-behind/"
          className="font-semibold text-consultx-green transition hover:text-consultx-green-dark"
        >
          Read more →
        </Link>
      </p>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
        We start with an initial assessment and provide a solution roadmap. Our approach is ERP
        agnostic and focused on task automation — with rigorous controls and checks built in —
        so you reduce cost and risk without rip-and-replace. Below are practical solution areas
        where automation and AI can create immediate business value.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          "Initial assessment & solution roadmap",
          "ERP agnostic — works with your stack",
          "Task automation with rigorous controls",
        ].map((item) => (
          <div key={item} className="border-l-2 border-consultx-green pl-4">
            <p className="font-semibold text-consultx-black">{item}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-consultx-black">Potential solutions</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">
          These concepts can be scoped as standalone initiatives or combined into a broader
          automation roadmap after assessment.
        </p>

        <div className="mt-10 space-y-10">
          {workflowSolutions.map((solution, index) => (
            <article
              key={solution.id}
              id={solution.id}
              className="scroll-mt-28 border-t border-consultx-border pt-10 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
                <span className="text-sm font-semibold tracking-wide text-consultx-green">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-2xl font-bold text-consultx-black">{solution.title}</h3>
              </div>
              <p className="mt-4 max-w-3xl leading-8 text-gray-700">{solution.summary}</p>
              <ul className="mt-6 grid max-w-3xl gap-3 md:grid-cols-2">
                {solution.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-consultx-green text-consultx-green">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-consultx-green/40 bg-consultx-green-soft/40 px-6 py-8 md:px-8">
        <h2 className="text-2xl font-bold text-consultx-black">Want to scope one of these?</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-700">
          Tell us which finance process is costing the most time or risk. We&apos;ll run an
          initial assessment and provide a solution roadmap — ERP agnostic, automation-led, with
          rigorous controls.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:bg-consultx-green-dark"
          >
            Book a Consultation <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/products/"
            className="inline-flex rounded-md border border-consultx-border bg-white px-7 py-4 font-semibold text-consultx-charcoal transition hover:border-consultx-green"
          >
            Back to products
          </Link>
        </div>
      </section>
    </div>
  );
}
