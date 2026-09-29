import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Lock, Server, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Finance Tools",
  description:
    "ConsultX designs and implements secure AI-enabled finance tools that automate processes and workflows — hosted on private servers with corporate APIs when required.",
};

const deliverySteps = [
  {
    title: "Initial review",
    description:
      "We walk your current finance processes, systems and pain points to identify where automation and AI can create real leverage.",
  },
  {
    title: "Proposal",
    description:
      "You receive a clear recommendation: what to build, expected outcomes, indicative effort and how success will be measured.",
  },
  {
    title: "Scoping",
    description:
      "We define inputs, outputs, controls, integrations and ownership so the tool fits your operating model — not the other way around.",
  },
  {
    title: "Planning",
    description:
      "Delivery milestones, access requirements and stakeholders are agreed so execution stays predictable and auditable.",
  },
  {
    title: "Execution",
    description:
      "We design and build the workflow or AI-assisted tool iteratively, with finance-literate judgement at every decision point.",
  },
  {
    title: "Implementation",
    description:
      "The solution is embedded into day-to-day finance operations, with handovers, documentation and user enablement.",
  },
  {
    title: "Testing & go-live",
    description:
      "Controls, edge cases and security checks are validated before launch — then we support stabilisation into business-as-usual.",
  },
];

const securityPoints = [
  {
    icon: Shield,
    title: "Corporate security standards",
    description:
      "Tools are designed to meet corporate security expectations — access control, auditability and responsible handling of financial data.",
  },
  {
    icon: Server,
    title: "Private server deployment",
    description:
      "Where required, solutions can run on your private infrastructure so sensitive finance data stays within your environment.",
  },
  {
    icon: Lock,
    title: "Corporate APIs & integrations",
    description:
      "We connect to your approved corporate APIs and systems so automation fits your stack without unnecessary data exposure.",
  },
];

export default function AiFinanceToolsPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <Link
        href="/products/"
        className="text-sm font-semibold text-consultx-green transition hover:text-consultx-green-dark"
      >
        ← Products
      </Link>

      <p className="mt-8 text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
        Custom Build
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
        AI Finance Tools
      </h1>
      <p className="mt-4 text-xl font-semibold text-consultx-green">
        Intelligent automation for finance processes and workflows
      </p>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">
        ConsultX has helped corporates design and implement tools inside their finance processes —
        automating workflows that once relied on manual effort and fragmented handovers. Today that
        work goes further: we use AI as digital workers to add judgement, pattern recognition and
        decision support to the process — so finance teams move faster without giving up control. We
        bring niche expertise in developing AI-supported finance tools, grounded in how corporate
        finance actually operates. We project-manage delivery from start to finish, and can contract
        as a managed service to support ongoing business needs after go-live.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          "Niche expertise in AI-supported finance tools",
          "Project-managed delivery, start to finish",
          "Managed service support after go-live",
        ].map((item) => (
          <div key={item} className="border-l-2 border-consultx-green pl-4">
            <p className="font-semibold text-consultx-black">{item}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-consultx-black">How we deliver</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">
          We project-manage every engagement end to end — from first review to a live, controlled
          tool in your finance environment — and can stay on as a managed service where ongoing
          support is needed.
        </p>

        <ol className="mt-10 space-y-8">
          {deliverySteps.map((step, index) => (
            <li key={step.title} className="flex gap-5 border-t border-consultx-border pt-8 first:border-t-0 first:pt-0">
              <span className="text-sm font-semibold tracking-wide text-consultx-green">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold text-consultx-black">{step.title}</h3>
                <p className="mt-2 leading-7 text-gray-700">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-consultx-black">Built for corporate security</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-600">
          Finance tools only create value when they can be trusted. Security and deployment choices
          are part of the design — not an afterthought.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {securityPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-consultx-green text-consultx-green">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-consultx-black">{point.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-700">{point.description}</p>
              </div>
            );
          })}
        </div>

        <ul className="mt-10 grid max-w-3xl gap-3 md:grid-cols-2">
          {[
            "Aligned to corporate security standards",
            "Deployable on private / on-premise servers",
            "Integrates with approved corporate APIs",
            "Designed for auditability and control",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-consultx-green text-consultx-green">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 rounded-2xl border border-consultx-green/40 bg-consultx-green-soft/40 px-6 py-8 md:px-8">
        <h2 className="text-2xl font-bold text-consultx-black">
          Ready to launch your finance processes?
        </h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-700">
          Contact Craig to discuss how ConsultX can design, build and launch AI-enabled tools for
          your finance business processes — project-managed from first review through secure
          go-live, with managed service support where you need it.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:bg-consultx-green-dark"
          >
            Contact Craig <ArrowRight className="h-4 w-4" />
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
