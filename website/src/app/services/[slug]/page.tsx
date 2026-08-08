import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllServiceSlugs, getServiceBySlug, services } from "@/data/services";
import { getServiceMarkdown } from "@/lib/serviceContent";
import { ServiceMarkdown } from "@/components/services/ServiceMarkdown";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};

  return {
    title: service.seoTitle,
    description: service.seoDescription,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const content = getServiceMarkdown(service.slug);
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <Link
        href="/services/"
        className="text-sm font-semibold text-consultx-green transition hover:text-consultx-green-dark"
      >
        ← All services
      </Link>

      <p className="mt-8 text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
        Service
      </p>
      <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
        {service.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
        {service.shortDescription}
      </p>

      <div className="mt-12">
        <ServiceMarkdown content={content} />
      </div>

      <div className="mt-14 rounded-2xl border border-consultx-green/40 bg-consultx-green-soft/40 px-6 py-8 md:px-8">
        <h2 className="text-2xl font-bold text-consultx-black">Ready to talk it through?</h2>
        <p className="mt-3 max-w-2xl leading-7 text-gray-700">
          Tell us where your business needs leverage. We&apos;ll scope a practical next step.
        </p>
        <Link
          href="/contact/"
          className="mt-6 inline-flex rounded-md bg-consultx-green px-7 py-4 font-semibold text-white transition hover:bg-consultx-green-dark"
        >
          {service.ctaLabel} →
        </Link>
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold text-consultx-black">Related services</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}/`}
              className="rounded-xl border border-consultx-border px-5 py-5 transition hover:border-consultx-green"
            >
              <h3 className="font-semibold text-consultx-black">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.shortDescription}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
