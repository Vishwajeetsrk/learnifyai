import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Shield,
  GraduationCap,
  Menu,
  Settings as SettingsIcon,
  Wallet as WalletIcon,
  Clapperboard,
  Wand2,
  ShoppingCart,
  Award,
  BarChart3,
  Users,
  Compass,
  Trophy,
  Sparkles,
  CreditCard,
  PieChart,
  FolderOpen,
  Briefcase,
  X,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import type { ReactNode } from "react";
const loadSupportAgent = () =>
  import("@/components/GlobalSupportAgent").then((m) => ({ default: m.GlobalSupportAgent }));
const GlobalSupportAgent = lazy(() =>
  loadSupportAgent().catch((err) => {
    console.warn("[app] Support agent chunk failed to load, retrying once…", err);
    return loadSupportAgent().catch(() => ({ default: () => null }));
  }),
);

interface NavItem {
  to: string;
  label: string;
  icon: typeof Sparkles;
  adminOnly?: boolean;
  creatorOnly?: boolean;
  careerProOnly?: boolean;
  featureKey?: string;
  section?: "main" | "creator" | "admin";
}

const nav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, section: "main" },
  {
    to: "/courses",
    label: "Courses",
    icon: GraduationCap,
    featureKey: "course_builder",
    section: "main",
  },
  { to: "/ai", label: "AI Tutor", icon: Sparkles, featureKey: "ai_tools", section: "main" },
  {
    to: "/career-studio",
    label: "Career Studio",
    icon: Briefcase,
    featureKey: "ai_tools",
    section: "main",
  },
  {
    to: "/community-hub",
    label: "Community",
    icon: Users,
    featureKey: "community",
    section: "main",
  },
  { to: "/coaching", label: "Coaching", icon: Compass, featureKey: "coaching", section: "main" },
  { to: "/ai-tools", label: "AI Tools", icon: Wand2, featureKey: "ai_tools", section: "main" },
  {
    to: "/certificates",
    label: "Certificates",
    icon: Award,
    featureKey: "certificates",
    section: "main",
  },
  { to: "/projects", label: "Template Mastery", icon: FolderOpen, section: "main" },
  { to: "/store", label: "XP Store", icon: ShoppingCart, section: "main" },
  { to: "/cart", label: "Cart", icon: ShoppingCart, section: "main" },
  { to: "/wallet", label: "Wallet", icon: WalletIcon, featureKey: "wallet", section: "main" },
  { to: "/settings", label: "Account", icon: SettingsIcon, section: "main" },
  { to: "/creator", label: "Creator", icon: BarChart3, creatorOnly: true, section: "creator" },
  { to: "/studio", label: "Studio", icon: Clapperboard, creatorOnly: true, section: "creator" },
  { to: "/admin", label: "Admin", icon: Shield, adminOnly: true, section: "admin" },
  {
    to: "/admin/subscriptions",
    label: "Subscriptions",
    icon: PieChart,
    adminOnly: true,
    section: "admin",
  },
  { to: "/admin/billing", label: "Billing OS", icon: BarChart3, adminOnly: true, section: "admin" },
];

const MOBILE_BOTTOM_NAV = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/system-design", label: "System", icon: Cpu },
  { to: "/career-studio", label: "Career", icon: Briefcase },
  { to: "/settings", label: "More", icon: Menu },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isAdmin, isCreator } = useAuth();
  const { data: flags } = useFeatureFlags();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentSub = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      return data || null;
    },
  });
  const activePlanName = currentSub.data?.plan?.name?.toLowerCase() || "free";
  const hasCareerPro = activePlanName === "career pro" || activePlanName === "enterprise";

  const navItems = nav.filter((n) => {
    if (n.adminOnly && !isAdmin) return false;
    if (n.creatorOnly && !isCreator) return false;
    if (n.careerProOnly && !hasCareerPro) return false;
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

  const mainNav = navItems.filter((n) => n.section === "main");
  const creatorNav = navItems.filter((n) => n.section === "creator");
  const adminNav = navItems.filter((n) => n.section === "admin");

  const NavItem = ({ item, onClick }: { item: NavItem; onClick?: () => void }) => {
    const active = path === item.to || path.startsWith(item.to + "/");
    const Icon = item.icon;
    const showBadge = item.to === "/cart" && (cartCount.data ?? 0) > 0;
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
        {showBadge && (
          <span className="text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold">
            {cartCount.data}
          </span>
        )}
        {!showBadge && active && <ChevronRight className="h-3.5 w-3.5 text-primary/50" />}
      </Link>
    );
  };

  const NavSection = ({
    title,
    items,
    onClick,
  }: {
    title?: string;
    items: NavItem[];
    onClick?: () => void;
  }) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-1">
        {title && (
          <div className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
            {title}
          </div>
        )}
        {items.map((item) => (
          <NavItem key={item.to} item={item} onClick={onClick} />
        ))}
      </div>
    );
  };

  const LearnerSurface = /^\/(courses|course|playground|studio|course-builder)(\/|$)/.test(path);

  const UserFooter = () => (
    <div className="border-t p-3 flex items-center gap-2">
      <UserAvatarMenu showName />
      <div className="ml-auto flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-card/40 backdrop-blur">
        <Link to="/" className="flex items-center px-5 h-16 border-b" aria-label="Learnify AI">
          <Logo height="h-10" />
        </Link>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavSection items={mainNav} />
          <NavSection title="Creator" items={creatorNav} />
          <NavSection title="Admin" items={adminNav} />
        </nav>
        <UserFooter />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 max-h-dvh" aria-describedby={undefined}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex items-center justify-between px-5 h-16 border-b">
            <Link to="/" aria-label="Learnify AI" onClick={() => setMobileOpen(false)}>
              <Logo height="h-8" />
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100dvh-8rem)]">
            <NavSection items={mainNav} onClick={() => setMobileOpen(false)} />
            <NavSection title="Creator" items={creatorNav} onClick={() => setMobileOpen(false)} />
            <NavSection title="Admin" items={adminNav} onClick={() => setMobileOpen(false)} />
          </nav>
          <UserFooter />
        </SheetContent>
      </Sheet>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-12 bg-card/80 backdrop-blur-lg border-b flex items-center px-3 gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link to="/" className="flex items-center" aria-label="Learnify AI">
          <Logo height="h-7" />
        </Link>
        <div className="flex-1" />
        {(cartCount.data ?? 0 > 0) ? (
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-primary text-primary-foreground rounded-full min-w-[16px] h-4 flex items-center justify-center font-semibold">
              {cartCount.data}
            </span>
          </Link>
        ) : null}
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-12 pb-20 md:pt-0 md:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t safe-area-bottom">
        <div className="flex items-center justify-around h-14 px-1">
          {MOBILE_BOTTOM_NAV.map((item) => {
            const active = path === item.to || path.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-xl transition-all",
                  active ? "text-primary" : "text-muted-foreground active:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Suspense fallback={null}>
        <GlobalSupportAgent />
      </Suspense>
    </div>
  );
}
