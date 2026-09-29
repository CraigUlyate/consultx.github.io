import type { Metadata } from "next";
import Link from "next/link";
import { faqSections } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about ConsultX’s financial, CFO and business advisory services and how we can support your business needs.",
  alternates: { canonical: "https://consultx.co.za/faqs/" },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">FAQs</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-6 text-lg leading-8 text-gray-700">Get answers to some of the most common questions about ConsultX, our financial and advisory services and the businesses and industries we support.</p>
      </header>
      <div className="mt-12 space-y-12">
        {faqSections.map((section) => (
          <section key={section.title}>
            <h2 className="mb-5 text-2xl font-bold text-consultx-black">{section.title}</h2>
            <div className="divide-y divide-consultx-border rounded-2xl border border-consultx-border bg-white px-5 md:px-7">
              {section.questions.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="cursor-pointer rounded-sm text-base font-semibold leading-7 text-consultx-charcoal marker:text-consultx-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-consultx-green">{faq.question}</summary>
                  <p className="mt-4 max-w-3xl leading-7 text-gray-700">{faq.answer}</p>
                  <Link href={faq.href} className="mt-3 inline-block text-sm font-semibold text-consultx-green hover:underline">{faq.link} →</Link>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
      <section className="mt-16 rounded-2xl border border-consultx-green/40 bg-consultx-green-soft/40 px-6 py-8 md:px-8">
        <h2 className="text-2xl font-bold text-consultx-black">Have a question about your business?</h2>
        <p className="mt-3 leading-7 text-gray-700">Tell us what you need help with and we will discuss a practical next step.</p>
        <Link href="/contact/" className="mt-6 inline-flex rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:bg-consultx-green-dark">Book a consultation →</Link>
      </section>
    </div>
  );
}
