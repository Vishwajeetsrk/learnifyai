import { Link } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/AppShell";
import type { ReactNode } from "react";

export function CreatorGate({ children }: { children: ReactNode }) {
  const { loading, isCreator } = useAuth();
  if (loading) {
    return (
      <AppShell>
        <div className="py-20 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }
  if (!isCreator) {
    return (
      <AppShell>
        <div className="max-w-xl mx-auto mt-16 rounded-2xl border bg-card p-8 shadow-card text-center">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="font-display text-2xl font-semibold">Creator access required</h1>
          <p className="text-sm text-muted-foreground mt-2">
            This area is for approved creators. Apply to publish courses, earn revenue, and grow an
            audience on Learnify AI.
          </p>
          <Button asChild className="mt-5">
            <Link to="/apply-creator">Apply to become a creator</Link>
          </Button>
        </div>
      </AppShell>
    );
  }
  return <>{children}</>;
}
