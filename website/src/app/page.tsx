import Link from "next/link";
import { ArrowRight } from "lucide-react";

const highlights = [
  {
    title: "Financial Management",
    text: "Strengthen controls, reporting and decision-ready finance operations.",
  },
  {
    title: "Process Re-engineering",
    text: "Remove friction from finance and operational workflows.",
  },
  {
    title: "Business Technology",
    text: "Deploy practical tools that automate work and surface insight.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f5f6f7_48%,#f1f8e8_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(114,198,0,0.16),transparent_42%)]" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-[1500px] flex-col justify-center px-5 py-20 md:px-8">
          <p className="text-sm font-semibold tracking-[0.2em] text-consultx-green uppercase">
            ConsultX
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold tracking-tight text-consultx-black sm:text-5xl lg:text-6xl">
            It&apos;s not rocket science,
            <span className="block text-consultx-green">it&apos;s business science.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
            Unlock efficiency across finance and operations with consulting expertise and
            intelligent product tools built for South African businesses.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products/"
              className="inline-flex items-center gap-2 rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-consultx-green-dark"
            >
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact/"
              className="inline-flex items-center gap-2 rounded-md border border-consultx-border px-7 py-4 font-semibold text-consultx-charcoal transition hover:border-consultx-green hover:text-consultx-green-dark"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-8 px-5 py-16 md:grid-cols-3 md:px-8">
        {highlights.map((item) => (
          <div key={item.title}>
            <h2 className="text-xl font-bold text-consultx-black">{item.title}</h2>
            <p className="mt-3 leading-7 text-gray-600">{item.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
