import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { lazy, Suspense } from "react";
import { Loader2, Users, Trophy, Code2, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { AchievementsPage } from "@/routes/_authenticated/achievements";
import { ChallengesPage } from "@/routes/_authenticated/challenges";
import { InboxPage } from "@/routes/_authenticated/inbox";

const CommunityFeedView = lazy(() => import("@/views/community-feed.view"));
const LeaderboardView = lazy(() => import("@/views/leaderboard.view"));

export const Route = createFileRoute("/_authenticated/community-hub")({
  head: () => ({ meta: [{ title: "Community Hub — Learnify AI" }] }),
  component: CommunityHubPage,
});

const TABS = [
  { id: "feed", label: "Community Feed", icon: Users },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "challenges", label: "Challenges", icon: Code2 },
  { id: "inbox", label: "Inbox", icon: Inbox },
];

function ViewFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function CommunityHubPage() {
  const search: { tab?: string } = useSearch({ strict: false });
  const navigate = useNavigate();
  const activeTab = search.tab || "feed";

  return (
    <AppShell>
      <div className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-14 z-20 px-4 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="font-semibold text-lg tracking-tight">Community Hub</h1>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() =>
                    navigate({
                      to: "/community-hub" as any,
                      search: { tab: t.id } as any,
                      replace: true,
                    })
                  }
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100vh-8rem)]">
        {activeTab === "feed" && (
          <Suspense fallback={<ViewFallback />}>
            <CommunityFeedView />
          </Suspense>
        )}
        {activeTab === "leaderboard" && (
          <Suspense fallback={<ViewFallback />}>
            <LeaderboardView />
          </Suspense>
        )}
        {activeTab === "challenges" && <ChallengesPage embedded />}
        {activeTab === "inbox" && <InboxPage embedded />}
      </div>
    </AppShell>
  );
}
