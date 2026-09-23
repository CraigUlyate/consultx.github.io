import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { BlogReadingProgress } from "@/components/blog/BlogReadingProgress";
import { getBlogPostBySlug } from "@/data/blog";
import { getBlogMarkdown } from "@/lib/blogContent";

const slug = "act-early-build-ai-capability";
const post = getBlogPostBySlug(slug)!;
const articleImages: Record<string, { file: string; alt: string; caption: string }> = {
  EARLY_ACTION_IMAGE: {
    file: "measured-first-step.webp",
    alt: "A green guiding line follows a modern office walkway from morning mist towards the light",
    caption: "Progress begins with a measured first step, even when the whole path is not yet clear.",
  },
  WORKFLOW_REVIEW_IMAGE: {
    file: "controlled-workflow-pilot.webp",
    alt: "Three business professionals review reports and process cards together beside a laptop",
    caption: "Why are we all staring deeply into this coffee mug?.. Because AI doesn't get it right without professional oversight.",
  },
};
export const metadata: Metadata = {
  title: post.title,
  description: post.excerpt,
  alternates: { canonical: `https://consultx.co.za/blog/${slug}/` },
  openGraph: {
    title: post.title, description: post.excerpt, type: "article",
    publishedTime: post.date,
    images: [{ url: `https://consultx.co.za/blog/${slug}/cover.png`, width: 1600, height: 700, alt: post.coverAlt }],
  },
};

export default function ArticlePage() {
  return <>
    <BlogReadingProgress />
    <article id="blog-article">
      <header className="border-b border-consultx-border bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-8 md:py-20">
          <Link href="/blog/" className="text-sm font-semibold text-gray-600 hover:text-consultx-green-dark">← Back to blog</Link>
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-consultx-green-dark">Business strategy · AI &amp; automation</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-extrabold leading-tight tracking-tight text-consultx-charcoal sm:text-5xl lg:text-6xl">Do You Wait Until the Market Understands the Opportunity — <span className="text-consultx-green-dark">or Act First?</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">{post.excerpt}</p>
          <p className="mt-6 text-sm text-gray-500"><time dateTime={post.date}>11 September 2026</time> · {post.readTime}</p>
        </div>
      </header>
      <div className="mx-auto max-w-[760px] px-5 py-14 md:px-8 [&_ol]:list-none [&_ol]:pl-0 [&_ol]:[counter-reset:step] [&_ol>li]:relative [&_ol>li]:border-b [&_ol>li]:border-consultx-border [&_ol>li]:py-6 [&_ol>li]:pl-16 [&_ol>li]:[counter-increment:step] [&_ol>li]:before:absolute [&_ol>li]:before:left-0 [&_ol>li]:before:top-6 [&_ol>li]:before:flex [&_ol>li]:before:h-10 [&_ol>li]:before:w-10 [&_ol>li]:before:items-center [&_ol>li]:before:justify-center [&_ol>li]:before:rounded-full [&_ol>li]:before:bg-[#f1f8e8] [&_ol>li]:before:font-bold [&_ol>li]:before:text-consultx-green-dark [&_ol>li]:before:content-[counter(step)]">
        {getBlogMarkdown(slug).split(/%%(EARLY_ACTION_IMAGE|WORKFLOW_REVIEW_IMAGE)%%/).map((block, index) => {
          const image = articleImages[block];
          if (!image) return <BlogMarkdown key={index} content={block} />;
          return <figure key={block} className="my-12">
            <Image src={`/blog/${slug}/${image.file}`} alt={image.alt} width={1600} height={900}
              sizes="(max-width: 760px) 100vw, 720px" className="h-auto w-full rounded-xl shadow-soft" />
            <figcaption className="mt-3 text-sm leading-6 text-consultx-grey">{image.caption}</figcaption>
          </figure>;
        })}
      </div>
      <aside className="mx-auto mb-16 max-w-[1100px] px-5 md:px-8">
        <div className="rounded-xl border border-consultx-green/35 bg-[linear-gradient(135deg,#f1f8e8_0%,#ffffff_80%)] p-8 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-consultx-green-dark">Start with one business problem</p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-consultx-charcoal">Ready to explore an opportunity in your business?</h2>
          <p className="mt-5 max-w-3xl font-semibold leading-8 text-consultx-charcoal">Tell us about a process that is taking too long, requires too much manual work, or isn’t giving you the information you need.</p>
          <p className="mt-4 max-w-3xl leading-8 text-gray-600">ConsultX can help assess the current workflow, identify practical automation and AI opportunities, and determine an appropriate path from idea to implementation.</p>
          <Link href="/contact/" className="mt-7 inline-flex rounded-md bg-consultx-green-dark px-7 py-3.5 font-semibold text-white transition hover:bg-consultx-charcoal">Book a Consultation →</Link>
        </div>
      </aside>
    </article>
  </>;
}
