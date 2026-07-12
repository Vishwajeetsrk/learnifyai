import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChallengesPage } from "@/routes/_authenticated/challenges";
import { InboxPage } from "@/routes/_authenticated/inbox";

const CommunityFeedView = lazy(() => import("@/views/community-feed.view"));
const LeaderboardView = lazy(() => import("@/views/leaderboard.view"));

export const Route = createFileRoute("/_authenticated/community-hub")({
  head: () => ({ meta: [{ title: "Community Hub — Learnify AI" }] }),
  component: CommunityHubPage,
});

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const FeedIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TrophyIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="18" width="12" height="4" rx="1" />
    <path d="M6 9c0 3.3 2.7 6 6 6s6-2.7 6-6" />
  </svg>
);

const CodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const BellIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

// ─── Hub cards shown on overview ─────────────────────────────────────────────
const HUB_CARDS = [
  {
    id: "feed",
    label: "Community Feed",
    description: "Connect, share, and learn with other builders",
    color: "from-indigo-500/10 to-blue-500/10",
    border: "border-indigo-500/20",
    accent: "text-indigo-500",
    icon: <FeedIcon />,
    iconBg: "bg-indigo-500/10",
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    description: "Compete and rise to the top",
    color: "from-amber-500/10 to-yellow-500/10",
    border: "border-amber-500/20",
    accent: "text-amber-500",
    icon: <TrophyIcon />,
    iconBg: "bg-amber-500/10",
  },
  {
    id: "challenges",
    label: "Coding Challenges",
    description: "Daily coding challenges to sharpen your skills",
    color: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-500/20",
    accent: "text-violet-500",
    icon: <CodeIcon />,
    iconBg: "bg-violet-500/10",
  },
  {
    id: "inbox",
    label: "Inbox",
    description: "Notifications and upcoming reminders",
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
    accent: "text-emerald-500",
    icon: <BellIcon />,
    iconBg: "bg-emerald-500/10",
  },
];

const TABS = [
  { id: "feed", label: "Community Feed", icon: <FeedIcon /> },
  { id: "leaderboard", label: "Leaderboard", icon: <TrophyIcon /> },
  { id: "challenges", label: "Challenges", icon: <CodeIcon /> },
  { id: "inbox", label: "Inbox", icon: <BellIcon /> },
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
  const activeTab = search.tab || "";

  function goToTab(id: string) {
    navigate({ to: "/community-hub" as any, search: { tab: id } as any, replace: true });
  }

  // No tab selected → show hub overview
  if (!activeTab) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary">
              <FeedIcon />
              <span className="text-xs font-semibold uppercase tracking-wide">Community</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Community Hub</h1>
            <p className="text-muted-foreground text-base">
              Connect, share, and learn with other builders
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HUB_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => goToTab(card.id)}
                className={cn(
                  "group relative flex items-start gap-4 p-5 md:p-6 rounded-2xl border bg-gradient-to-br text-left transition-all duration-200",
                  "hover:shadow-lg hover:scale-[1.015] hover:border-opacity-60",
                  card.color,
                  card.border,
                )}
              >
                <div className={cn("p-3 rounded-xl shrink-0", card.iconBg, card.accent)}>
                  <span className="block w-6 h-6 [&>svg]:w-6 [&>svg]:h-6">{card.icon}</span>
                </div>
                <div className="min-w-0">
                  <h2 className={cn("font-semibold text-base mb-1", card.accent)}>{card.label}</h2>
                  <p className="text-sm text-muted-foreground leading-snug">{card.description}</p>
                </div>
                <div
                  className={cn(
                    "absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity",
                    card.accent,
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // Tab view
  return (
    <AppShell>
      {/* Sticky tab bar */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-20 px-3 sm:px-6 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
          <button
            onClick={() =>
              navigate({ to: "/community-hub" as any, search: {} as any, replace: true })
            }
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-3 h-3.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Hub</span>
          </button>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1">
            {TABS.map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => goToTab(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <span className="[&>svg]:h-3.5 [&>svg]:w-3.5 shrink-0">{t.icon}</span>
                  <span className="hidden xs:inline">{t.label}</span>
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
