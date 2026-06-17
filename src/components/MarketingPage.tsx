import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface MarketingPageProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function MarketingPage({ eyebrow, title, subtitle, children }: MarketingPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 70%)",
            }}
          />
          <div className="container mx-auto px-6 py-20 md:py-28 max-w-4xl text-center">
            {eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 backdrop-blur px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </div>
            )}
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>
        </section>
        <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">{children}</section>
      </main>
      <SiteFooter />
    </div>
  );
}
