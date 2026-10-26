import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { HarkNotificationBell } from "@/components/notice/HarkNotificationBell";
import { useAuth } from "@/hooks/use-auth";
import { usePublicMenu } from "@/hooks/use-wcms-public";
import { Loader2, Menu, ChevronDown, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { initAutomaticLocale } from "@/lib/locale-detection";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useSiteSettings } from "@/hooks/use-site-settings";

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

  // Secondary items cleanly organized inside the "More" dropdown
  const secondaryNav = [
    { label: tr("nav.features", "Features"), url: "/features" },
    { label: tr("nav.aiTools", "AI Tools"), url: "/features#ai-tools" },
    { label: tr("nav.projects", "Projects"), url: "/projects" },
    { label: tr("nav.creators", "Creators"), url: "/creators" },
    { label: tr("nav.coaches", "Coaches"), url: "/coaches" },
    { label: tr("nav.blog", "Blog"), url: "/blog" },
    ...(isSupportVisible ? [{ label: tr("nav.supportUs", "Support Us"), url: "/support-us" }] : []),
  ];

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

          <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-muted-foreground">
            {menuLoading && menuItems.length === 0 ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              navItems.map((item: any) => {
                return (
                  <Link
                    key={item.id || item.label}
                    to={item.url || "/"}
                    preload="intent"
                    className="hover:text-foreground transition inline-flex items-center gap-1 font-medium"
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })
            )}

            {/* Clean Dropdown for Secondary Links */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hover:text-foreground transition inline-flex items-center gap-1 font-medium focus:outline-none cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <span>More</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 p-1.5 shadow-xl border-border/80 bg-popover/95 backdrop-blur-md">
                {secondaryNav.map((item) => (
                  <DropdownMenuItem asChild key={item.label}>
                    <Link
                      to={item.url}
                      className="w-full cursor-pointer py-2 px-2.5 text-sm font-medium rounded-md hover:bg-muted transition"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
                  <Menu className="h-5 w-5" />
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
