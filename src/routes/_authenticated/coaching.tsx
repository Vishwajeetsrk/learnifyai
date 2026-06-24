import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const CoachingDashboard = lazy(() => import("./coaching.page"));

function CoachingFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/coaching")({
  head: () => ({ meta: [{ title: "Coaching — Learnify AI" }] }),
  component: () => (
    <Suspense fallback={<CoachingFallback />}>
      <CoachingDashboard />
    </Suspense>
  ),
});
