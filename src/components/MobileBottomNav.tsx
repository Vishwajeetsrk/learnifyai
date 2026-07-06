import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, Sparkles, Trophy, Wallet } from "lucide-react";

export function MobileBottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: "Home", to: "/dashboard", icon: Home },
    { label: "Learn", to: "/courses", icon: BookOpen },
    { label: "AI Tools", to: "/ai-tools", icon: Sparkles },
    { label: "Leaderboard", to: "/leaderboard", icon: Trophy },
    { label: "Wallet", to: "/wallet", icon: Wallet },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50 md:hidden">
      <nav className="bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-1 min-w-[4rem] group"
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-xl -z-10 transition-all duration-300 scale-100" />
              )}
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span
                className={`text-[9px] font-medium tracking-tight transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
