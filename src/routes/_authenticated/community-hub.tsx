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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-primary">
                <FeedIcon />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Community Hub 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-display">
                Community Hub
              </h1>
              <p className="text-muted-foreground text-sm font-semibold max-w-xl">
                Connect, share projects, compete on leaderboards, solve daily coding challenges & track notifications.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => goToTab("feed")}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:opacity-90 transition cursor-pointer flex items-center gap-2"
              >
                <FeedIcon /> Open Feed
              </button>
              <button
                onClick={() => goToTab("leaderboard")}
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold hover:bg-amber-500/20 transition cursor-pointer flex items-center gap-2"
              >
                <TrophyIcon /> Leaderboard
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Active Builders", value: "12.4K+", sub: "Engaging daily", color: "text-blue-600 dark:text-blue-400" },
              { label: "Weekly Prize Pool", value: "₹50,000", sub: "Top 3 learners", color: "text-amber-600 dark:text-amber-400" },
              { label: "Daily Challenges", value: "50+ Active", sub: "Python, JS, SQL", color: "text-violet-600 dark:text-violet-400" },
              { label: "Real-Time Posts", value: "99.8%", sub: "Response rate", color: "text-emerald-600 dark:text-emerald-400" },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl border bg-card/60 backdrop-blur shadow-xs text-center space-y-1">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className={cn("text-xl sm:text-2xl font-black", stat.color)}>{stat.value}</p>
                <p className="text-[11px] font-semibold text-muted-foreground/80">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Hub Cards 4-Column Grid */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FeedIcon /> Explore Community Hub Modules
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HUB_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => goToTab(card.id)}
                  className={cn(
                    "group relative flex flex-col justify-between p-6 rounded-2xl border bg-gradient-to-br text-left transition-all duration-200 cursor-pointer h-full",
                    "hover:shadow-xl hover:-translate-y-1 hover:border-opacity-80",
                    card.color,
                    card.border,
                  )}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={cn("p-3 rounded-xl shrink-0 shadow-xs", card.iconBg, card.accent)}>
                        <span className="block w-6 h-6 [&>svg]:w-6 [&>svg]:h-6">{card.icon}</span>
                      </div>
                      <span className={cn("text-xs font-black uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity", card.accent)}>
                        Launch →
                      </span>
                    </div>

                    <div>
                      <h3 className={cn("font-black text-lg mb-1.5", card.accent)}>{card.label}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-semibold">{card.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    <span>Open Module</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // Tab view
  return (
    <AppShell>
      {/* Sticky Tab Navigation Bar */}
      <div className="border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() =>
                navigate({ to: "/community-hub" as any, search: {} as any, replace: true })
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-input bg-card text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Hub Home</span>
            </button>

            <div className="h-4 w-px bg-border shrink-0 hidden xs:block" />

            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1 max-w-full">
              {TABS.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => goToTab(t.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    )}
                  >
                    <span className="[&>svg]:h-4 [&>svg]:w-4 shrink-0">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[calc(100dvh-8rem)] pb-10">
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
