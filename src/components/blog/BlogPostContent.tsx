"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { CheckCircle2, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPostContentProps {
  content: string;
  postTitle?: string;
}

export function BlogPostContent({ content, postTitle }: BlogPostContentProps) {
  const processedContent = React.useMemo(() => {
    if (!content) return "";
    let trimmed = content.trim();
    if (postTitle) {
      const escaped = postTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const titlePattern = new RegExp(`^#\\s*${escaped}\\s*\\n*`, "i");
      trimmed = trimmed.replace(titlePattern, "");
    }
    return trimmed;
  }, [content, postTitle]);

  return (
    <div className="blog-post-content max-w-none text-foreground font-sans selection:bg-primary/20">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Semantic SEO: Ensure page has only 1 single H1 (the page's main post title).
          // Markdown top-level headers are rendered as styled H2 tags.
          h1: ({ children, ...props }) => (
            <h2
              className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight text-foreground mt-12 mb-5 pt-6 border-t border-border/40 first:border-0 first:pt-0 first:mt-0 leading-tight"
              {...props}
            >
              {children}
            </h2>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground mt-10 mb-4 leading-snug"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="font-display font-semibold text-lg sm:text-xl tracking-tight text-foreground mt-8 mb-3 text-primary/95"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="font-display font-semibold text-base sm:text-lg tracking-tight text-foreground mt-6 mb-2"
              {...props}
            >
              {children}
            </h4>
          ),

          // Comfortable paragraphs with responsive font & spacing
          p: ({ children, ...props }) => (
            <p className="font-sans text-base sm:text-[17px] leading-relaxed text-foreground/85 my-4 sm:my-5" {...props}>
              {children}
            </p>
          ),

          // Well-arranged bullets & list items
          ul: ({ children, ...props }) => (
            <ul className="my-5 space-y-2.5 pl-0 list-none" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="my-5 space-y-3 pl-0 list-none [counter-reset:blog-counter]" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, node, ...props }: any) => {
            // Check if inside ol or ul
            const isOrdered = node?.parentElement?.tagName === "ol";

            if (isOrdered) {
              return (
                <li
                  className="flex items-start gap-3 text-base sm:text-[16px] leading-relaxed text-foreground/90 [counter-increment:blog-counter]"
                  {...props}
                >
                  <span className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm before:content-[counter(blog-counter)]" />
                  <div className="flex-1 min-w-0">{children}</div>
                </li>
              );
            }

            return (
              <li
                className="flex items-start gap-2.5 text-base sm:text-[16px] leading-relaxed text-foreground/90"
                {...props}
              >
                <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0 shadow-sm" />
                <div className="flex-1 min-w-0">{children}</div>
              </li>
            );
          },

          // Beautiful Responsive Tables with mobile horizontal scroll
          table: ({ children, ...props }) => (
            <div className="my-8 overflow-hidden rounded-2xl border border-border/80 shadow-md bg-card/80 backdrop-blur-sm">
              <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
                <table className="w-full text-left border-collapse text-sm" {...props}>
                  {children}
                </table>
              </div>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted/70 text-foreground font-display font-semibold text-xs tracking-wider uppercase border-b border-border/80" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-border/40" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-muted/20 transition-colors even:bg-muted/10" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="py-3.5 px-4 text-left font-semibold text-foreground/90 whitespace-nowrap" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="py-3.5 px-4 text-foreground/80 leading-relaxed align-top" {...props}>
              {children}
            </td>
          ),

          // Contextual Images with rounded borders & captions
          img: ({ src, alt, ...props }) => (
            <figure className="my-8 overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-md">
              <img
                src={src}
                alt={alt || "Blog visual"}
                loading="lazy"
                className="w-full h-auto object-cover max-h-[480px] rounded-t-2xl transition-transform duration-300 hover:scale-[1.01]"
                {...props}
              />
              {alt && (
                <figcaption className="py-2.5 px-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-card/50">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),

          // Refined Blockquotes
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-primary bg-primary/5 rounded-r-2xl px-5 py-4 my-6 italic text-foreground/90 text-sm sm:text-base leading-relaxed"
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Divider
          hr: ({ ...props }) => (
            <hr className="my-10 border-border/50" {...props} />
          ),

          // Code blocks & inline code
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-muted text-primary font-mono text-xs sm:text-sm font-medium border border-border/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="my-6 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-slate-100 text-xs sm:text-sm font-mono border border-slate-800 shadow-lg">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            );
          },

          // High-performance semantic hyperlinks (zero API screenshot overhead)
          a: ({ href, children, className, ...props }) => {
            const isExternal = Boolean(
              href &&
                /^https?:\/\//i.test(href) &&
                !href.includes("learnifyai.in") &&
                !href.includes("learnifyaitool.vercel.app") &&
                !href.includes("localhost"),
            );

            return (
              <a
                href={href}
                className={cn(
                  "text-primary hover:underline font-medium inline-flex items-center gap-1 transition-colors",
                  className,
                )}
                target={isExternal ? "_blank" : props.target}
                rel={isExternal ? "nofollow noopener noreferrer" : props.rel}
                {...props}
              >
                {children}
                {isExternal && (
                  <ExternalLink className="h-3 w-3 inline ml-0.5 opacity-70 shrink-0" aria-hidden="true" />
                )}
              </a>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

export default BlogPostContent;
