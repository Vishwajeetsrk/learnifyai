import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

const CommunityPage = lazy(() => import("./community-feed.page"));

function CommunityFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/community-feed")({
  head: () => ({ meta: [{ title: "Community — Learnify AI" }] }),
  component: () => (
    <Suspense fallback={<CommunityFallback />}>
      <CommunityPage />
    </Suspense>
  ),
});
