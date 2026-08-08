import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "ConsultX services spanning financial management, process re-engineering, business consulting, valuations and outsourced CFO support.",
};

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
        Services
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
        Advisory that turns complexity into clarity
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
        From finance operations to valuations and fractional CFO support, ConsultX helps teams work
        smarter and grow with confidence.
      </p>

      <div className="mt-12 divide-y divide-consultx-border border-y border-consultx-border">
        {services.map((service) => (
          <article key={service.slug} className="py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-consultx-black">{service.title}</h2>
                <p className="mt-3 leading-7 text-gray-600">{service.shortDescription}</p>
              </div>
              <Link
                href={`/services/${service.slug}/`}
                className="inline-flex items-center gap-2 font-semibold text-consultx-green transition hover:text-consultx-green-dark"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
