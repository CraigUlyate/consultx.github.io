import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BrevlytFeatureAnimation } from "@/components/blog/BrevlytFeatureAnimation";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights from ConsultX on finance, operations and business technology.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  const isBrevlytFeature = featured?.slug === "brevlyt-ai-cfo-south-africa";

  return (
    <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">Blog</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
        Ideas that sharpen the business
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
        Practical thinking on finance automation, reporting and the systems that make teams faster.
      </p>

      {featured?.coverImage ? (
        <Link
          href={`/blog/${featured.slug}/`}
          className="group mt-12 block overflow-hidden rounded-xl border border-consultx-border transition hover:border-consultx-green/50 hover:shadow-soft"
        >
          <div className="relative aspect-[21/9] overflow-hidden bg-consultx-light-grey sm:aspect-[2.4/1]">
            {isBrevlytFeature ? (
              <BrevlytFeatureAnimation />
            ) : (
              <Image
                src={featured.coverImage}
                alt={featured.coverAlt}
                fill
                priority
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1100px) 100vw, 1100px"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.88)_38%,rgba(5,5,5,0.60)_68%,rgba(5,5,5,0.18)_100%)]" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <p className="text-sm font-semibold tracking-[0.16em] text-consultx-green uppercase">
                Featured
              </p>
              <h2 className="mt-3 max-w-2xl text-2xl font-bold text-white sm:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
                {featured.excerpt}
              </p>
              <p className="mt-5 text-sm font-semibold text-consultx-green">
                Read article →
              </p>
            </div>
          </div>
        </Link>
      ) : null}

      <div className="mt-12 space-y-8">
        {rest.map((post) => {
          const published = Boolean(post.coverImage);
          const inner = (
            <>
              <div className="flex flex-wrap items-center gap-3 text-sm text-consultx-grey">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden>•</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold text-consultx-black transition group-hover:text-consultx-green-dark">
                {post.title}
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-gray-600">{post.excerpt}</p>
              <span className="mt-4 inline-flex font-semibold text-consultx-green">
                {published ? "Read article →" : "Coming soon"}
              </span>
            </>
          );

          return published ? (
            <article key={post.slug} className="border-b border-consultx-border pb-8">
              <Link href={`/blog/${post.slug}/`} className="group block">
                {inner}
              </Link>
            </article>
          ) : (
            <article key={post.slug} className="border-b border-consultx-border pb-8 opacity-80">
              {inner}
            </article>
          );
        })}
      </div>
    </section>
  );
}
