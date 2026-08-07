import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights from ConsultX on finance, operations and business technology.",
};

const posts = [
  {
    title: "Why expense automation pays for itself",
    excerpt: "How AI extraction and validation free finance teams from repetitive coding work.",
  },
  {
    title: "XBRL without the headache",
    excerpt: "A practical path to cleaner statutory reporting and fewer filing surprises.",
  },
  {
    title: "Process first, tech second",
    excerpt: "The ConsultX approach to automation that actually sticks in SME finance teams.",
  },
];

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
      <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">Blog</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-consultx-black sm:text-5xl">
        Ideas that sharpen the business
      </h1>
      <div className="mt-12 space-y-8">
        {posts.map((post) => (
          <article key={post.title} className="border-b border-consultx-border pb-8">
            <h2 className="text-2xl font-bold text-consultx-black">{post.title}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-gray-600">{post.excerpt}</p>
            <Link href="/contact/" className="mt-4 inline-flex font-semibold text-consultx-green">
              Talk to us →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
