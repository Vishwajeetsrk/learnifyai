import { Link, useRouterState } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CurrencySelector } from "@/components/CurrencySelector";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { useAuth } from "@/hooks/use-auth";
import { usePublicMenu } from "@/hooks/use-wcms-public";
import { Loader2, Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";

export function SiteHeader() {
  const { isAuthenticated, loading } = useAuth();
  const { data: menuItems = [], isLoading: menuLoading } = usePublicMenu("main");
  const { t, ready } = useTranslation();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hideLang = /^\/(course)(\/|$)/.test(path);
  const tr = (key: string, fallback: string) => {
    if (!ready) return fallback;
    const val = t(key);
    return val === key ? fallback : val;
  };

  const fallbackNav = [
    { label: tr("nav.features", "Features"), url: "/features" },
    { label: tr("nav.aiTools", "AI Tools"), url: "/features#ai-tools" },
    { label: tr("nav.creators", "Creators"), url: "/creators" },
    { label: tr("nav.coaches", "Coaches"), url: "/coaches" },
    { label: tr("nav.projects", "Projects"), url: "/projects" },
    { label: tr("nav.pricing", "Pricing"), url: "/pricing" },
    { label: tr("nav.blog", "Blog"), url: "/blog" },
  ];
  const navItems = (menuItems.length > 0 ? menuItems : fallbackNav).filter(
    (item: any) => item.url !== "/system-design" && !item.label?.includes("System Design")
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Learnify AI">
          <Logo height="h-10" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {menuLoading && menuItems.length === 0 ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            navItems.map((item: any) => {
              return (
                <Link
                  key={item.id || item.label}
                  to={item.url || "/"}
                  preload="intent"
                  className="hover:text-foreground transition inline-flex items-center gap-1.5 font-medium"
                >
                  <span>{item.label}</span>
                </Link>
              );
            })
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <div className="hidden sm:flex items-center gap-1.5">
            <CurrencySelector />
            <LanguageSwitcher />
          </div>
          {isAuthenticated && !loading ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
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
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <SheetTitle className="text-left font-display font-semibold text-lg text-foreground">
                      Navigation Menu
                    </SheetTitle>
                  </div>
                  <nav className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
                    {navItems.map((item: any) => (
                      <SheetClose asChild key={item.id || item.label}>
                        <Link
                          to={item.url || "/"}
                          preload="intent"
                          className="hover:text-foreground hover:bg-accent/50 px-3 py-2.5 rounded-xl transition text-left flex items-center justify-between"
                        >
                          <span>{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>

                <div className="border-t border-border/40 pt-4 flex flex-col gap-3">
                  {/* Mobile Currency & Language Selector */}
                  <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-xl border border-border/50">
                    <span className="text-xs font-medium text-muted-foreground">Currency & Lang</span>
                    <div className="flex items-center gap-1.5">
                      <CurrencySelector />
                      <LanguageSwitcher />
                    </div>
                  </div>

                  {isAuthenticated && !loading ? (
                    <>
                      <div className="flex items-center justify-between px-1 py-1">
                        <span className="text-xs font-semibold text-muted-foreground">Account</span>
                        <UserAvatarMenu showName size="sm" />
                      </div>
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full h-10 font-semibold">
                          <Link to="/dashboard" preload="intent">
                            Dashboard
                          </Link>
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button asChild variant="outline" className="w-full h-10 font-semibold">
                          <Link to="/login" preload="intent">
                            {tr("nav.signIn", "Sign in")}
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          asChild
                          className="w-full h-10 font-semibold bg-foreground text-background hover:bg-foreground/90"
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
