import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about ConsultX — business science for finance, operations and growth.",
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16 md:px-8">
      <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">About</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
        Business science for ambitious operators
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-700">
        ConsultX specialises in financial management, business process re-engineering and strategic
        consulting. We help start-ups and established corporates uncover untapped potential and
        unlock latent opportunity.
      </p>
      <p className="mt-5 text-lg leading-8 text-gray-700">
        Alongside advisory work, we build practical product tools — from AI-assisted expense
        processing to compliance, modelling and valuation support — so insight becomes action.
      </p>
      <Link
        href="/contact/"
        className="mt-10 inline-flex rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:bg-consultx-green-dark"
      >
        Book a Consultation →
      </Link>
    </section>
  );
}
