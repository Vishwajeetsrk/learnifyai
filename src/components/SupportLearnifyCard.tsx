import { Link } from "@tanstack/react-router";
import { Heart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SupportLearnifyCard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "flex items-center gap-2 text-[11px] text-muted-foreground"
          : "rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      }
    >
      <div
        className={
          compact
            ? "h-5 w-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0"
            : "h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0"
        }
      >
        <Heart className={compact ? "h-3 w-3" : "h-5 w-5"} />
      </div>
      {compact ? (
        <>
          <span>
            Enjoying Learnify?{" "}
            <Link to="/support" className="text-primary underline">
              Support us
            </Link>{" "}
            — it keeps learning free.
          </span>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Support Learnify AI</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              A small contribution keeps courses, AI tools and certificates free for learners.
            </p>
          </div>
          <Button asChild size="sm" className="rounded-xl shrink-0">
            <Link to="/support">
              <Heart className="h-3.5 w-3.5 mr-1.5" /> Support
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

export function SupportCtaLink() {
  return (
    <a
      href="/support"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <Heart className="h-3 w-3" /> Support Learnify <ArrowUpRight className="h-3 w-3" />
    </a>
  );
}
