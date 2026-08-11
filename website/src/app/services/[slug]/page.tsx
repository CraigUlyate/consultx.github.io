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
    <article>
      <header className="border-b border-consultx-border bg-[linear-gradient(180deg,#f8faf7_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-[1100px] px-5 py-14 md:px-8 md:py-16">
          <Link
            href="/services/"
            className="text-sm font-semibold text-consultx-green transition hover:text-consultx-green-dark"
          >
            ← All services
          </Link>

          <p className="mt-8 text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
            Service
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-consultx-black sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-700">
            {service.shortDescription}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[760px] px-5 py-14 md:px-8">
        <ServiceMarkdown content={content} />

        <div className="mt-16 rounded-xl border border-consultx-green/35 bg-[linear-gradient(135deg,#f1f8e8_0%,#ffffff_60%)] px-6 py-8 md:px-8">
          <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
            Next step
          </p>
          <h2 className="mt-3 text-2xl font-bold text-consultx-black">Ready to talk it through?</h2>
          <p className="mt-3 max-w-2xl leading-7 text-gray-700">
            Tell us where your business needs leverage. We&apos;ll scope a practical next step.
          </p>
          <Link
            href="/contact/"
            className="mt-6 inline-flex rounded-md bg-consultx-green px-7 py-3.5 font-semibold text-white transition hover:bg-consultx-green-dark"
          >
            {service.ctaLabel} →
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-5 pb-16 md:px-8">
        <div className="border-t border-consultx-border pt-10">
          <h2 className="text-xl font-bold text-consultx-black">Related services</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}/`}
                className="block transition hover:text-consultx-green-dark"
              >
                <h3 className="font-semibold text-consultx-black">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{item.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
