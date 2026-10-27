import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { HarkNotificationBell } from "@/components/notice/HarkNotificationBell";
import { useAuth } from "@/hooks/use-auth";
import { usePublicMenu } from "@/hooks/use-wcms-public";
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
    title: "macOS Ventura & Big Sur",
    category: "OS Replica • 105 Big Sur Icons",
    url: "/projects",
    thumbnail: "/preset-sites/macos-portfolio/assets/icons/finder.png",
  },
  {
    id: "productized-agency",
    title: "Productized Agency",
    category: "Next.js 15 • Tailwind v4",
    url: "/projects",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "gsap-bubble-menu",
    title: "GSAP Bubble Menu & Video",
    category: "Interactive UI • FLIP Morph",
    url: "/course/gsap-bubble-menu",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "nick-ho-carrera-cup",
    title: "Porsche Carrera Cup 3D",
    category: "WebGL • 3D Spatial UI",
    url: "/projects",
    thumbnail: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=300&q=80",
  },
];

export function SiteHeader() {
  const { isAuthenticated, loading } = useAuth();
  const { data: menuItems = [], isLoading: menuLoading } = usePublicMenu("main");
  const { data: siteSettings } = useSiteSettings();
  const { t, ready } = useTranslation();

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
                  return (
                    <Link
                      key={key}
                      to={item.url || "/"}
                      preload="intent"
                      onMouseEnter={() => setHoveredNav(key)}
                      className="relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 z-10"
                    >
                      {isHovered && (
                        <motion.div
                          layoutId="navbar-pill"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                          className="absolute inset-0 rounded-full bg-background/90 dark:bg-white/10 shadow-xs border border-border/70 -z-10"
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
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/15 text-primary">49 Live</span>
                    </div>
                    <Link to="/projects" className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1">
                      All Projects <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {FEATURED_PROJECT_PREVIEWS.map((p) => (
                      <ProductItem
                        key={p.id}
                        title={p.title}
                        description={p.category}
                        href={p.url}
                        src={p.thumbnail}
                        badge="Live"
                      />
                    ))}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center justify-between px-2 text-[11px]">
                    <Link to="/projects" className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 hover:text-primary transition-colors">
                      <Layers className="w-3.5 h-3.5 text-sky-400" />
                      Community Showcase
                    </Link>
                    <Link to="/projects" className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1 hover:text-primary transition-colors">
                      <Laptop className="w-3.5 h-3.5 text-purple-400" />
                      Interactive Templates
                    </Link>
                  </div>
                </div>
              </MenuItem>

              <MenuItem setActive={setActiveDropdown} active={activeDropdown} item="More">
                <div className="w-72 p-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2 pb-2 border-b border-border/60">
                    {secondaryNav.map((item) => (
                      <HoveredLink key={item.label} href={item.url}>
                        {item.label}
                      </HoveredLink>
                    ))}
                  </div>

                  {/* Trending Blog Preview Card */}
                  <div className="pt-1 px-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-sky-400" />
                      Trending Guide
                    </div>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: "ultimate-guide-free-courses-certificates-2026" }}
                      className="block p-2 rounded-lg bg-muted/50 hover:bg-muted transition border border-border/50 group"
                    >
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        The Ultimate Guide to Free Courses &amp; Certificates in 2026
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground font-mono">
                        <Clock className="w-2.5 h-2.5" /> 12 min read
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
