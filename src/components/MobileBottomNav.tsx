import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, Sparkles, Users, Wallet } from "lucide-react";

export function MobileBottomNav() {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: "Home", to: "/dashboard", icon: Home },
    { label: "Learn", to: "/courses", icon: BookOpen },
    { label: "AI", to: "/ai-tools", icon: Sparkles },
    { label: "Community", to: "/community", icon: Users },
    { label: "Wallet", to: "/wallet", icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0c101d]/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around z-50 md:hidden px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = path.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? "text-indigo-400 font-bold scale-105"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
