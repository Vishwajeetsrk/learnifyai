import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2, RefreshCcw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

const StudioPage = lazy(() => import("./studio.page"));

function StudioFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/studio")({
  head: () => ({ meta: [{ title: "Creator Studio — Learnify AI" }] }),
  component: () => (
    <Suspense fallback={<StudioFallback />}>
      <StudioPage />
    </Suspense>
  ),
  errorComponent: ({ error, reset }) => (
    <AppShell>
      <div className="max-w-lg mx-auto p-10 text-center space-y-3">
        <h2 className="text-lg font-display font-semibold">Studio hit a snag</h2>
        <p className="text-sm text-muted-foreground break-words">
          {error.message || "Something went wrong loading Studio."}
        </p>
        <div className="flex justify-center gap-2 pt-2">
          <Button onClick={() => reset()}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Go to dashboard
          </Button>
        </div>
      </div>
    </AppShell>
  ),
});
