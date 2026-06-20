import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Shield,
  GraduationCap,
  Sparkles,
  Menu,
  Settings as SettingsIcon,
  Wallet as WalletIcon,
  Clapperboard,
  Inbox,
  Wand2,
  ShoppingCart,
  FileCheck2,
  Award,
  BarChart3,
  Users,
  Compass,
  Trophy,
  Medal,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { GlobalSupportAgent } from "@/components/GlobalSupportAgent";

interface NavItem {

  to: string;
  label: string;
  icon: typeof Sparkles;
  adminOnly?: boolean;
  creatorOnly?: boolean;
}
const nav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/community-feed", label: "Community", icon: Users },
  { to: "/coaching", label: "Coaching", icon: Compass },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/achievements", label: "Achievements", icon: Medal },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/submissions", label: "Submissions", icon: FileCheck2 },
  // Playground accessible from Courses page
  { to: "/certificates", label: "Certificates", icon: Award },
  { to: "/ai", label: "AI Chat", icon: Sparkles },
  { to: "/ai-tools", label: "AI Tools", icon: Wand2 },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/wallet", label: "Wallet", icon: WalletIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/support", label: "Support", icon: Sparkles },
  { to: "/creator", label: "Creator", icon: BarChart3, creatorOnly: true },
  { to: "/studio", label: "Studio", icon: Clapperboard, creatorOnly: true },
  { to: "/admin", label: "Admin", icon: Shield, adminOnly: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isAdmin, isCreator } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = nav.filter((n) => {
    if (n.adminOnly && !isAdmin) return false;
    if (n.creatorOnly && !isCreator) return false;
    return true;
  });

  const cartCount = useQuery({
    enabled: !!user,
    queryKey: ["cart-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("cart_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
  });

  const NavList = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex-1 p-3 space-y-1">
      {navItems.map((item) => {
        const active = path === item.to || path.startsWith(item.to + "/");
        const Icon = item.icon;
        const showBadge = item.to === "/cart" && (cartCount.data ?? 0) > 0;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" /> <span className="flex-1">{item.label}</span>
            {showBadge && (
              <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold">
                {cartCount.data}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const UserFooter = () => (
    <div className="border-t p-3 flex items-center gap-2">
      <UserAvatarMenu showName />
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-card/40 backdrop-blur">
        <Link to="/" className="flex items-center px-5 h-16 border-b" aria-label="Learnify AI">
          <Logo height="h-10" />
        </Link>

        <NavList />
        <UserFooter />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-2 h-14 px-3 border-b bg-background/90 backdrop-blur">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 flex flex-col">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex items-center px-5 h-16 border-b">
                <Logo height="h-9" />
              </div>

              <NavList onClick={() => setMobileOpen(false)} />
              <UserFooter />
            </SheetContent>
          </Sheet>
          <Link to="/" aria-label="Learnify AI">
            <Logo height="h-8" />
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/cart" className="relative p-2 rounded-md hover:bg-accent" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {(cartCount.data ?? 0) > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[9px] bg-primary text-primary-foreground rounded-full h-4 min-w-4 px-1 grid place-items-center font-semibold">
                  {cartCount.data}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <UserAvatarMenu size="sm" />
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <GlobalSupportAgent />
    </div>
  );
}

