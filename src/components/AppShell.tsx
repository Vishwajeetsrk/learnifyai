import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Shield,
  GraduationCap,
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
  Sparkles,
  CreditCard,
  PieChart,
  FileText,
  Map,
  FolderOpen,
} from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import type { ReactNode } from "react";
const GlobalSupportAgent = lazy(() =>
  import("@/components/GlobalSupportAgent").then((m) => ({ default: m.GlobalSupportAgent })),
);

interface NavItem {
  to: string;
  label: string;
  icon: typeof Sparkles;
  adminOnly?: boolean;
  creatorOnly?: boolean;
  featureKey?: string;
}
const nav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/community-feed", label: "Community", icon: Users, featureKey: "community" },
  { to: "/coaching", label: "Coaching", icon: Compass, featureKey: "coaching" },
  { to: "/courses", label: "Courses", icon: GraduationCap, featureKey: "course_builder" },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/achievements", label: "Achievements", icon: Medal },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/submissions", label: "Submissions", icon: FileCheck2 },
  { to: "/certificates", label: "Certificates", icon: Award, featureKey: "certificates" },
  { to: "/ai", label: "AI Chat", icon: Sparkles, featureKey: "ai_tools" },
  { to: "/ai-tools", label: "AI Tools", icon: Wand2, featureKey: "ai_tools" },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/wallet", label: "Wallet", icon: WalletIcon, featureKey: "wallet" },
  { to: "/resume-builder", label: "Resume Builder", icon: FileText, featureKey: "ai_tools" },
  { to: "/ats-checker", label: "ATS Checker", icon: BarChart3, featureKey: "ai_tools" },
  { to: "/career-roadmap", label: "Career Roadmap", icon: Map, featureKey: "ai_tools" },
  { to: "/portfolio-builder", label: "Portfolio Builder", icon: FolderOpen, featureKey: "ai_tools" },
  { to: "/billing", label: "Billing", icon: CreditCard },
  { to: "/settings", label: "Settings", icon: SettingsIcon },

  { to: "/creator", label: "Creator", icon: BarChart3, creatorOnly: true },
  { to: "/studio", label: "Studio", icon: Clapperboard, creatorOnly: true },
  { to: "/admin", label: "Admin", icon: Shield, adminOnly: true },
  { to: "/admin/subscriptions", label: "Subscriptions", icon: PieChart, adminOnly: true },
  { to: "/admin/billing", label: "Billing OS", icon: BarChart3, adminOnly: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isAdmin, isCreator } = useAuth();
  const { data: flags } = useFeatureFlags();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = nav.filter((n) => {
    if (n.adminOnly && !isAdmin) return false;
    if (n.creatorOnly && !isCreator) return false;
    if (n.featureKey) {
      const flag = flags?.find((f: any) => f.key === n.featureKey);
      if (flag && (!flag.enabled || flag.maintenance_mode)) return false;
    }
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
        const tourKey =
          item.to === "/dashboard"
            ? "nav-dashboard"
            : item.to === "/courses"
              ? "nav-courses"
              : item.to === "/ai"
                ? "nav-ai"
                : item.to === "/ai-tools"
                  ? "nav-ai-tools"
                  : item.to === "/leaderboard"
                    ? "nav-leaderboard"
                    : item.to === "/community-feed"
                      ? "nav-community"
                      : item.to === "/coaching"
                        ? "nav-coaching"
                        : item.to === "/certificates"
                          ? "nav-certificates"
                          : item.to === "/achievements"
                            ? "nav-achievements"
                            : item.to === "/admin"
                              ? "nav-admin"
                              : item.to === "/wallet"
                                ? "nav-wallet"
              : item.to === "/playground"
                ? "nav-playground"
                : item.to === "/inbox"
                  ? "nav-inbox"
                : item.to === "/resume-builder"
                  ? "nav-resume-builder"
                  : item.to === "/ats-checker"
                    ? "nav-ats-checker"
                    : item.to === "/career-roadmap"
                      ? "nav-career-roadmap"
                      : item.to === "/portfolio-builder"
                        ? "nav-portfolio-builder"
                        : undefined;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            data-tour={tourKey}
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

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50 h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Link
            to="/"
            className="flex items-center px-5 h-16 border-b"
            aria-label="Learnify AI"
            onClick={() => setMobileOpen(false)}
          >
            <Logo height="h-10" />
          </Link>
          <NavList onClick={() => setMobileOpen(false)} />
          <UserFooter />
        </SheetContent>
      </Sheet>

      <main className="flex-1 min-w-0">{children}</main>

      <Suspense fallback={null}>
        <GlobalSupportAgent />
      </Suspense>
    </div>
  );
}
