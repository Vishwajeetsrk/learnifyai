import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { HarkNotificationBell } from "@/components/notice/HarkNotificationBell";
import { useAuth } from "@/hooks/use-auth";
import { usePublicMenu } from "@/hooks/use-wcms-public";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Menu as LucideMenu,
  ChevronDown,
  Compass,
  Sparkles,
  ArrowRight,
  Laptop,
  Layers,
  Eye,
  BookOpen,
  Clock,
} from "lucide-react";
import { MenuItem, ProductItem, HoveredLink } from "@/components/ui/navbar-menu";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { initAutomaticLocale } from "@/lib/locale-detection";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSiteSettings } from "@/hooks/use-site-settings";

const FEATURED_PROJECT_PREVIEWS = [
  {
    id: "macos-portfolio",
    title: "macOS Sonoma & Big Sur",
    category: "Apple OS • Interactive Desktop",
    url: "/preset-sites/macos-portfolio/index.html",
    thumbnail: "/previews/macbook-1.gif",
  },
  {
    id: "macos-desktop-original",
    title: "macOS Desktop Original",
    category: "Full OS Replica • Window Manager",
    url: "/preset-sites/macos-desktop-original/index.html",
    thumbnail: "/previews/macbook-2.gif",
  },
  {
    id: "toonhub",
    title: "TOONHUB 3D Figurines",
    category: "Spline 3D • Procedural Characters",
    url: "/preset-sites/toonhub/index.html",
    thumbnail: "/previews/toonhub.gif",
  },
  {
    id: "acreage-nike",
    title: "Acreage × Nike",
    category: "Next-Gen Footwear • GSAP & Motion",
    url: "/preset-sites/acreage-nike/index.html",
    thumbnail: "/previews/nike.gif",
  },
];

export function SiteHeader() {
  const { isAuthenticated, loading } = useAuth();
  const { data: menuItems = [], isLoading: menuLoading } = usePublicMenu("main");
  const { data: siteSettings } = useSiteSettings();
  const { t, ready } = useTranslation();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    initAutomaticLocale();
  }, []);
  const tr = (key: string, fallback: string) => {
    if (!ready) return fallback;
    const val = t(key);
    return val === key ? fallback : val;
  };

  const isSupportVisible = siteSettings?.support_us_enabled === "true";

  // Streamlined, high-impact primary navigation to avoid navbar clutter
  const fallbackNav = [
    { label: tr("nav.courses", "Courses"), url: "/courses" },
    { label: tr("nav.studio", "Studio IDE"), url: "/studio" },
    { label: tr("nav.certificates", "Certificates"), url: "/verified-certificates" },
    { label: tr("nav.pricing", "Pricing"), url: "/pricing" },
    { label: tr("nav.updates", "Updates"), url: "/updates" },
  ];

  // Secondary items cleanly organized inside the "More" dropdown (distinct routes only)
  const secondaryNav = [
    { label: tr("nav.features", "Features"), url: "/features" },
    { label: tr("nav.projects", "Projects"), url: "/projects" },
    { label: tr("nav.creators", "Creators"), url: "/creators" },
    { label: tr("nav.coaches", "Coaches"), url: "/coaches" },
    { label: tr("nav.blog", "Blog"), url: "/blog" },
    ...(isSupportVisible ? [{ label: tr("nav.supportUs", "Support Us"), url: "/support-us" }] : []),
  ];

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navItems = (menuItems.length > 0 ? menuItems : fallbackNav).filter(
    (item: any) => {
      const url = (item.url || "").toLowerCase().trim();
      const label = (item.label || "").toLowerCase().trim();

      if (url === "/system-design" || label.includes("system design")) {
        return false;
      }

      if (
        !isSupportVisible &&
        (url === "/support-us" ||
          url === "/support-us/" ||
          url === "support-us" ||
          url === "/sponsor" ||
          url === "/sponsor/" ||
          url.endsWith("/support-us") ||
          label === "support us" ||
          label.includes("support us") ||
          label === "sponsor" ||
          label.includes("sponsor"))
      ) {
        return false;
      }

      return true;
    }
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo + Primary Nav with generous breathing room */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link to="/" className="flex items-center shrink-0 pr-2" aria-label="Learnify AI">
            <Logo height="h-9" />
          </Link>

          <nav className="hidden md:flex items-center gap-3 lg:gap-4 text-sm font-medium text-muted-foreground">
            {menuLoading && menuItems.length === 0 ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <div
                className="flex items-center gap-1 p-1 rounded-full bg-muted/40 border border-border/50 backdrop-blur-md"
                onMouseLeave={() => setHoveredNav(null)}
              >
                {navItems.map((item: any) => {
                  const key = item.id || item.label;
                  const isHovered = hoveredNav === key;
                  const isActive =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url));
                  return (
                    <Link
                      key={key}
                      to={item.url || "/"}
                      preload="intent"
                      onMouseEnter={() => setHoveredNav(key)}
                      className={cn(
                        "relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors inline-flex items-center gap-1.5 z-10",
                        isActive
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {isHovered && (
                        <motion.div
                          layoutId="navbar-pill-hover"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                          className="absolute inset-0 rounded-full bg-background/90 dark:bg-white/10 shadow-xs border border-border/70 -z-10"
                        />
                      )}
                      {!isHovered && isActive && (
                        <motion.div
                          layoutId="navbar-pill-active"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                          className="absolute inset-0 rounded-full bg-primary/10 border border-primary/25 -z-10"
                        />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Rich Projects & More Dropdowns with navbar-menu spring morph animation */}
            <div
              className="flex items-center gap-4 text-sm font-medium"
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <MenuItem setActive={setActiveDropdown} active={activeDropdown} item="Projects">
                <div className="w-[420px] sm:w-[480px] p-2">
                  <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="font-display font-bold text-xs uppercase tracking-wider text-foreground">Featured Live Projects</span>
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/15 text-primary">48 Live</span>
                    </div>
                    <Link to="/projects" className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1">
                      All Projects <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* 4 Featured Project Cards: GIF only, opens fullscreen in new tab */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {FEATURED_PROJECT_PREVIEWS.map((p) => (
                      <a
                        key={p.id}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block aspect-video rounded-xl overflow-hidden border border-border/70 hover:border-primary/60 transition-all duration-200 shadow-sm hover:shadow-md bg-muted/30"
                        title={p.title}
                      >
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </MenuItem>

              <MenuItem setActive={setActiveDropdown} active={activeDropdown} item="More">
                <div className="w-80 p-2 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 pb-2.5 border-b border-border/60">
                    {secondaryNav.map((item) => (
                      <HoveredLink key={item.label} href={item.url}>
                        {item.label}
                      </HoveredLink>
                    ))}
                  </div>

                  {/* Guide Cards */}
                  <div className="pt-0.5 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-sky-400" />
                      Featured Guides &amp; Roadmaps
                    </div>
                    
                    <Link
                      to="/blog/$slug"
                      params={{ slug: "ultimate-guide-free-courses-certificates-2026" }}
                      className="block p-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition border border-border/50 group"
                    >
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        The Ultimate Guide to Free Courses &amp; Certificates
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-mono">
                        <Clock className="w-2.5 h-2.5" /> 12 min read · 2026 Edition
                      </div>
                    </Link>

                    <Link
                      to="/career-studio"
                      className="block p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition border border-primary/20 group"
                    >
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                        <span>Career Studio Playbook</span>
                        <ArrowRight className="w-3 h-3 text-primary transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        6 AI Tools · ATS, Interview STAR, Roadmaps &amp; Trackers
                      </div>
                    </Link>
                  </div>
                </div>
              </MenuItem>
            </div>
          </nav>
        </div>

        {/* Right: Actions, Notifications, Theme & Profile */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && !loading ? (
            <div className="flex items-center gap-2">
              <HarkNotificationBell />
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground">
                <Link to="/dashboard" preload="intent">
                  Dashboard
                </Link>
              </Button>
              <UserAvatarMenu size="sm" />
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/login" preload="intent">
                  {tr("nav.signIn", "Sign in")}
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90 hidden sm:inline-flex"
              >
                <Link to="/signup" preload="intent">
                  {tr("nav.getStarted", "Get Started")}
                </Link>
              </Button>
            </>
          )}

          {/* Mobile Hamburger Navigation Sheet */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-foreground"
                  aria-label="Open Menu"
                >
                  <LucideMenu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-background border-l border-border p-6 flex flex-col justify-between overflow-y-auto"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <SheetTitle className="text-left font-display font-semibold text-lg text-foreground flex items-center gap-2">
                      <Logo markOnly height="h-7" />
                      <span>Learnify AI</span>
                    </SheetTitle>
                  </div>
                  <nav className="flex flex-col gap-2 text-base font-medium text-muted-foreground">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 px-1 pt-1">
                      Main Navigation
                    </span>
                    {navItems.map((item: any) => (
                      <SheetClose asChild key={item.id || item.label}>
                        <Link
                          to={item.url || "/"}
                          preload="intent"
                          className="hover:text-foreground py-2 px-2 rounded-lg hover:bg-muted/50 transition text-left font-medium"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}

                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 px-1 pt-3 border-t border-border/30">
                      Explore More
                    </span>
                    {secondaryNav.map((item: any) => (
                      <SheetClose asChild key={item.label}>
                        <Link
                          to={item.url || "/"}
                          preload="intent"
                          className="hover:text-foreground py-2 px-2 rounded-lg hover:bg-muted/50 transition text-left text-sm"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    ))}

                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 px-1 pt-3 border-t border-border/30 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-primary" />
                      Featured Live Projects (4)
                    </span>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {FEATURED_PROJECT_PREVIEWS.map((p) => (
                        <SheetClose key={p.id} asChild>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-video rounded-lg overflow-hidden border border-border/70 hover:border-primary/60 transition block bg-muted/40 shadow-xs"
                            title={p.title}
                          >
                            <img
                              src={p.thumbnail}
                              alt={p.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              loading="lazy"
                            />
                          </a>
                        </SheetClose>
                      ))}
                    </div>

                    <SheetClose asChild>
                      <Link
                        to="/career-studio"
                        className="mt-2 p-2.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/15 transition flex items-center justify-between text-left"
                      >
                        <div>
                          <div className="text-xs font-bold text-foreground">Career Studio</div>
                          <div className="text-[10px] text-muted-foreground">6 AI Tools Suite</div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </Link>
                    </SheetClose>
                  </nav>
                </div>
                <div className="border-t border-border/40 pt-4 flex flex-col gap-3">
                  {isAuthenticated && !loading ? (
                    <>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-muted-foreground">Account</span>
                        <UserAvatarMenu size="sm" />
                      </div>
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/dashboard" preload="intent">
                            Dashboard
                          </Link>
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/login" preload="intent">
                            {tr("nav.signIn", "Sign in")}
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full bg-foreground text-background hover:bg-foreground/90"
                        >
                          <Link to="/signup" preload="intent">
                            {tr("nav.getStarted", "Get Started")}
                          </Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
