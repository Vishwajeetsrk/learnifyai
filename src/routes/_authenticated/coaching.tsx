import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { CoachingSkeleton } from "@/components/Skeletons";

const CoachingDashboard = lazy(() => import("@/views/coaching.view"));

function CoachingFallback() {
  return (
    <AppShell>
      <CoachingSkeleton />
    </AppShell>
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
