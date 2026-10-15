import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { LeaderboardSkeleton } from "@/components/Skeletons";

const LeaderboardPage = lazy(() => import("@/views/leaderboard.view"));

function LeaderboardFallback() {
  return (
    <AppShell>
      <LeaderboardSkeleton />
    </AppShell>
  );
}

export const Route = createFileRoute("/_authenticated/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard — Learnify AI" }] }),
  component: () => (
    <Suspense fallback={<LeaderboardFallback />}>
      <LeaderboardPage />
    </Suspense>
  ),
});
