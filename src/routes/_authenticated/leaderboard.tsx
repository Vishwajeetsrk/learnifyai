import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const LeaderboardPage = lazy(() => import("./leaderboard.page"));

function LeaderboardFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
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
