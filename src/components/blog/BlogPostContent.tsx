"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { LinkPreview } from "@/components/ui/link-preview";

interface BlogPostContentProps {
  content: string;
}

export function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-primary hover:prose-a:underline prose-table:border prose-th:bg-muted/50 prose-th:p-2 prose-td:p-2 prose-td:border-t">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ href, children, className, ...props }) => {
            const isExternal =
              Boolean(
                href &&
                  /^https?:\/\//i.test(href) &&
                  !href.includes("learnifyai.in") &&
                  !href.includes("learnifyaitool.vercel.app") &&
                  !href.includes("localhost")
              );

            if (isExternal && href) {
              return (
                <LinkPreview
                  url={href}
                  className={className}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </LinkPreview>
              );
            }

            return (
              <a href={href} className={className} {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default BlogPostContent;
