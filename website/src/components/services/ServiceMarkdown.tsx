import type { ReactNode } from "react";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";

type ServiceMarkdownProps = {
  content: string;
};

/** Service write-ups share the blog article typography and markdown patterns. */
export function ServiceMarkdown({ content }: ServiceMarkdownProps) {
  return <BlogMarkdown content={content} />;
}

export function ServiceCtaNote({ children }: { children: ReactNode }) {
  return <div className="mt-12">{children}</div>;
}
