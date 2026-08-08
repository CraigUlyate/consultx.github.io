import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

type ServiceMarkdownProps = {
  content: string;
};

export function ServiceMarkdown({ content }: ServiceMarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="mt-12 text-2xl font-bold tracking-tight text-consultx-black first:mt-0">
            {children}
          </h2>
        ),
        p: ({ children }) => (
          <p className="mt-4 max-w-3xl text-base leading-8 text-gray-700">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mt-5 max-w-3xl list-disc space-y-2 pl-5 text-base leading-7 text-gray-700">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mt-5 max-w-3xl list-decimal space-y-3 pl-5 text-base leading-7 text-gray-700">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="pl-1">{children}</li>,
        strong: ({ children }) => (
          <strong className="font-semibold text-consultx-black">{children}</strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export function ServiceCtaNote({ children }: { children: ReactNode }) {
  return <div className="mt-12">{children}</div>;
}
