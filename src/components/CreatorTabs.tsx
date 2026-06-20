import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Users, MessageSquare, Settings, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/creator", label: "Hub", icon: BarChart3, exact: true },
  { to: "/creator/earnings", label: "Earnings", icon: IndianRupee, exact: false },
  { to: "/creator/subscribers", label: "Subscribers", icon: Users, exact: false },
  { to: "/creator/comments", label: "Comments", icon: MessageSquare, exact: false },
  { to: "/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function CreatorTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="border-b sticky top-0 z-30 bg-background/85 backdrop-blur -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10">
      <nav className="flex gap-1 overflow-x-auto" aria-label="Creator sections">
        {tabs.map((t) => {
          const active = t.exact ? path === t.to : path === t.to || path.startsWith(t.to + "/");
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              preload="intent"
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative inline-flex items-center gap-1.5 px-3 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-md",
                active
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", active && "text-primary")} /> {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
