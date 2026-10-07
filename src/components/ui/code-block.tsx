"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

export type CodeBlockProps = {
  children?: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <div
      className={cn(
        "not-prose flex w-full flex-col overflow-clip border",
        "border-border/70 bg-card/90 text-card-foreground rounded-2xl shadow-xl backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type CodeBlockCodeProps = {
  code: string;
  language?: string;
  theme?: string;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

export function CodeBlockCode({
  code,
  language = "tsx",
  theme = "github-dark",
  className,
  ...props
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function highlight() {
      if (!code) {
        setHighlightedHtml("<pre><code></code></pre>");
        return;
      }

      try {
        const langToUse = ["diagram", "ascii", "txt"].includes(language.toLowerCase())
          ? "text"
          : language;
        const html = await codeToHtml(code, {
          lang: langToUse,
          theme: theme || "github-dark",
        });
        if (!cancelled) {
          setHighlightedHtml(html);
        }
      } catch (err) {
        // Fallback gracefully if language not supported in shiki
        if (!cancelled) {
          setHighlightedHtml(null);
        }
      }
    }
    highlight();
    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  const classNames = cn(
    "w-full overflow-x-auto text-[13px] font-mono leading-relaxed [&>pre]:px-4 [&>pre]:py-4 [&>pre]:m-0 [&>pre]:bg-transparent",
    className
  );

  // SSR fallback: render plain code if not hydrated yet
  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...props}
    />
  ) : (
    <div className={classNames} {...props}>
      <pre className="p-4 bg-slate-950 text-slate-200 overflow-x-auto m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>;

export function CodeBlockGroup({
  children,
  className,
  ...props
}: CodeBlockGroupProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export type CodeBlockThemedProps = {
  code: string;
  language?: string;
  theme?: string;
  title?: string;
  className?: string;
};

export function CodeBlockThemed({
  code,
  language = "tsx",
  theme = "github-dark",
  title,
  className,
}: CodeBlockThemedProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const displayLang = language.toUpperCase();

  return (
    <div className={cn("w-full my-6", className)}>
      <CodeBlock>
        <CodeBlockGroup className="border-border/60 border-b px-4 py-2 bg-muted/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="bg-primary/15 text-primary border border-primary/25 rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase font-mono">
              {displayLang}
            </div>
            {title ? (
              <span className="text-muted-foreground text-xs font-medium truncate max-w-[240px] sm:max-w-md">
                {title}
              </span>
            ) : (
              <span className="text-muted-foreground/70 text-xs font-mono">
                Learnify Verified Code
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60"
            onClick={handleCopy}
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </Button>
        </CodeBlockGroup>
        <CodeBlockCode code={code} language={language} theme={theme} />
      </CodeBlock>
    </div>
  );
}

export default CodeBlock;
