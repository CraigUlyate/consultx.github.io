import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogDeployDays } from "@/components/blog/BlogDeployDays";
import { BlogKeyMetrics } from "@/components/blog/BlogKeyMetrics";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { BlogReadingProgress } from "@/components/blog/BlogReadingProgress";
import { BlogWorkflowStrip } from "@/components/blog/BlogWorkflowStrip";
import { getAllBlogSlugs, getBlogPostBySlug, getPublishedPosts } from "@/data/blog";
import { getBlogMarkdown } from "@/lib/blogContent";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

type ContentBlock =
  | { type: "markdown"; content: string }
  | { type: "metrics" }
  | { type: "workflow" }
  | { type: "deployDays" };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function buildContentBlocks(content: string, includeMetrics = false): ContentBlock[] {
  const firstHeading = content.indexOf("\n## ");
  const intro = firstHeading === -1 ? content : content.slice(0, firstHeading).trim();
  const rest = firstHeading === -1 ? "" : content.slice(firstHeading + 1).trim();

  const blocks: ContentBlock[] = [{ type: "markdown", content: intro }];
  if (includeMetrics) {
    blocks.push({ type: "metrics" });
  }

  const segments = rest.split(/%%(WORKFLOW|DEPLOY_DAYS)%%/);
  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i]?.trim();
    if (!segment) continue;

    if (segment === "WORKFLOW") {
      blocks.push({ type: "workflow" });
      continue;
    }
    if (segment === "DEPLOY_DAYS") {
      blocks.push({ type: "deployDays" });
      continue;
    }

    blocks.push({ type: "markdown", content: segment });
  }

  return blocks;
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || !post.coverImage) return {};

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || !post.coverImage) notFound();

  const content = getBlogMarkdown(post.slug);
  const isExpensePost = post.slug === "why-expense-automation-pays-for-itself";
  const blocks = buildContentBlocks(content, isExpensePost);
  const related = getPublishedPosts().filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <>
      <BlogReadingProgress />
      <article id="blog-article">
        <header className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.55)_0%,rgba(17,17,17,0.72)_45%,rgba(17,17,17,0.92)_100%)]" />
          </div>

          <div className="relative mx-auto flex min-h-[58vh] max-w-[1100px] flex-col justify-end px-5 py-16 md:px-8 md:py-20">
            <Link
              href="/blog/"
              className="mb-8 w-fit text-sm font-semibold text-white/80 transition hover:text-consultx-green"
            >
              ← Back to blog
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>•</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[760px] px-5 py-14 md:px-8">
          {blocks.map((block, index) => {
            if (block.type === "metrics") return <BlogKeyMetrics key={`metrics-${index}`} />;
            if (block.type === "workflow") return <BlogWorkflowStrip key={`workflow-${index}`} />;
            if (block.type === "deployDays") return <BlogDeployDays key={`deploy-${index}`} />;
            return <BlogMarkdown key={`md-${index}`} content={block.content} />;
          })}

          <div className="mt-16 rounded-xl border border-consultx-green/35 bg-[linear-gradient(135deg,#f1f8e8_0%,#ffffff_60%)] px-6 py-8 md:px-8">
            <p className="text-sm font-semibold tracking-[0.18em] text-consultx-green uppercase">
              Next step
            </p>
            {isExpensePost ? (
              <>
                <h2 className="mt-3 text-2xl font-bold text-consultx-black">
                  See what AnNa Expense does with your documents
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-gray-700">
                  Start with one batch. Measure processing time, exceptions and cost per document —
                  then decide whether to scale.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/try-anna.php"
                    className="inline-flex rounded-md bg-consultx-green px-7 py-3.5 font-semibold text-white transition hover:bg-consultx-green-dark"
                  >
                    Try AnNa Expense →
                  </Link>
                  <Link
                    href="/contact/"
                    className="inline-flex rounded-md border border-consultx-border px-7 py-3.5 font-semibold text-consultx-charcoal transition hover:border-consultx-green hover:text-consultx-green-dark"
                  >
                    Talk to ConsultX
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-3 text-2xl font-bold text-consultx-black">
                  Explore AI-supported automation with ConsultX
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-gray-700">
                  Start with an assessment of one high-volume finance or operations process — then
                  build a controlled roadmap from there.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/products/workflow-automation/"
                    className="inline-flex rounded-md bg-consultx-green px-7 py-3.5 font-semibold text-white transition hover:bg-consultx-green-dark"
                  >
                    Workflow automation →
                  </Link>
                  <Link
                    href="/contact/"
                    className="inline-flex rounded-md border border-consultx-border px-7 py-3.5 font-semibold text-consultx-charcoal transition hover:border-consultx-green hover:text-consultx-green-dark"
                  >
                    Talk to ConsultX
                  </Link>
                </div>
              </>
            )}
          </div>

          {related.length > 0 ? (
            <div className="mt-16 border-t border-consultx-border pt-10">
              <h2 className="text-xl font-bold text-consultx-black">More from the blog</h2>
              <div className="mt-5 space-y-5">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}/`}
                    className="block transition hover:text-consultx-green-dark"
                  >
                    <h3 className="font-semibold text-consultx-black">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{item.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </>
  );
}
