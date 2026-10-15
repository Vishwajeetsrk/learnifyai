import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { CommunityFeedSkeleton } from "@/components/Skeletons";

const CommunityPage = lazy(() => import("@/views/community-feed.view"));

function CommunityFallback() {
  return (
    <AppShell>
      <CommunityFeedSkeleton />
    </AppShell>
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
