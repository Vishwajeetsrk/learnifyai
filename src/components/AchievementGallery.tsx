import React from "react";
import { cn } from "@/lib/utils";
import { StreakBadge, XpBadge, CourseBadge, TestBadge, ChallengeBadge } from "./GamificationBadges";

// A reusable gallery component to showcase earned and locked badges
export function AchievementGallery({ badges }: { badges: any[] }) {
  const CATEGORIES = [
    { key: "xp", label: "XP Milestones", Component: XpBadge },
    { key: "course", label: "Course Badges", Component: CourseBadge },
    { key: "streak", label: "Streak Mastery", Component: StreakBadge },
    { key: "test", label: "Test Champion", Component: TestBadge },
    { key: "challenge", label: "Challenge Solver", Component: ChallengeBadge },
  ];

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10 mt-8">
      {CATEGORIES.map((cat) => {
        const catBadges = badges.filter((b) => b.category === cat.key);
        if (catBadges.length === 0) return null;

        return (
          <section key={cat.key}>
            <div className="flex items-center gap-2.5 mb-4">
              <h2 className="font-display font-semibold text-lg">{cat.label}</h2>
              <span className="text-xs text-muted-foreground">
                {catBadges.filter((b) => b.earned).length}/{catBadges.length}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {catBadges.map((badge) => {
                const BadgeSVG = cat.Component;
                return (
                  <div
                    key={badge.id}
                    className={cn(
                      "rounded-2xl border p-5 text-center transition-all duration-300 relative overflow-hidden",
                      badge.earned
                        ? "bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 border-primary/20"
                        : "bg-muted/30 opacity-50 grayscale hover:grayscale-0",
                    )}
                  >
                    {badge.earned && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    )}
                    <div className="flex justify-center mb-3">
                      <BadgeSVG level={Math.floor((badge.xp_required || 0) / 500) + 1} />
                    </div>
                    <p
                      className={cn(
                        "text-xs font-bold leading-tight",
                        badge.earned ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {badge.name}
                    </p>
                    {badge.earned && badge.earned_at && (
                      <p className="text-[10px] text-primary/80 mt-1.5 font-medium">
                        {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                    )}
                    {!badge.earned && badge.xp_required > 0 && (
                      <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
                        {badge.xp_required} XP
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
