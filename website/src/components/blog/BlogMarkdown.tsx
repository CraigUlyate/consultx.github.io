import Image from "next/image";
import Link from "next/link";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

type BlogMarkdownProps = {
  content: string;
};

const components: Components = {
  h2: ({ children }) => (
    <h2 className="group mt-16 scroll-mt-28 border-l-[3px] border-consultx-green pl-4 text-2xl font-bold tracking-tight text-consultx-black first:mt-0 sm:text-[1.75rem]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-lg font-bold tracking-tight text-consultx-black">
      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-consultx-green align-middle" />
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 max-w-3xl text-base leading-8 text-gray-700">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 max-w-3xl space-y-2.5 text-base leading-7 text-gray-700 [&_li]:relative [&_li]:pl-6 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em] [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-consultx-green">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 max-w-3xl list-decimal space-y-3 pl-5 text-base leading-7 text-gray-700">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-consultx-black">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    if (!href) return <span>{children}</span>;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-consultx-teal underline decoration-consultx-teal/30 underline-offset-4 transition hover:text-consultx-green-dark hover:decoration-consultx-green"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="font-semibold text-consultx-teal underline decoration-consultx-teal/30 underline-offset-4 transition hover:text-consultx-green-dark hover:decoration-consultx-green"
      >
        {children}
      </Link>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="relative my-10 max-w-3xl overflow-hidden rounded-r-xl border-l-4 border-consultx-green bg-[linear-gradient(135deg,#f1f8e8_0%,#ffffff_70%)] px-6 py-6 sm:px-8">
      <div className="text-xl font-semibold leading-9 tracking-tight text-consultx-black sm:text-2xl [&>p]:mt-0 [&>p]:max-w-none [&>p]:text-xl [&>p]:leading-9 [&>p]:text-consultx-black sm:[&>p]:text-2xl">
        {children}
      </div>
    </blockquote>
  ),
  hr: () => (
    <hr className="my-14 max-w-3xl border-0 border-t border-consultx-border" />
  ),
  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;
    return (
      <figure className="my-12 -mx-1 overflow-hidden sm:mx-0">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-consultx-light-grey shadow-soft">
          <Image
            src={src}
            alt={alt || ""}
            fill
            className="object-cover transition duration-700 hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
        {alt ? (
          <figcaption className="mt-3 max-w-3xl text-sm leading-6 text-consultx-grey">
            {alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },
};

export function BlogMarkdown({ content }: BlogMarkdownProps) {
  return (
    <div className="blog-prose">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
