import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { usePublicMenu } from "@/hooks/use-wcms-public";
import { Loader2 } from "lucide-react";

const HARDCODED_NAV = [
  { label: "Features", url: "/features" },
  { label: "AI Tools", url: "/features#ai-tools" },
  { label: "Creators", url: "/creators" },
  { label: "Coaches", url: "/coaches" },
  { label: "Pricing", url: "/pricing" },
  { label: "Blog", url: "/blog" },
];

export function SiteHeader() {
  const { isAuthenticated, loading } = useAuth();
  const { data: menuItems = [], isLoading: menuLoading } = usePublicMenu("main");
  const navItems = menuItems.length > 0 ? menuItems : HARDCODED_NAV;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Learnify AI">
          <Logo height="h-10" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {menuLoading && menuItems.length === 0 ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            navItems.map((item: any) => (
              <Link
                key={item.id || item.label}
                to={item.url || "/"}
                preload="intent"
                className="hover:text-foreground transition"
              >
                {item.label}
              </Link>
            ))
          )}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated && !loading ? (
            <Button
              asChild
              size="sm"
              className="bg-foreground text-background hover:bg-foreground/90"
            >
              <Link to="/dashboard" preload="intent">
                Open app
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login" preload="intent">
                  Sign in
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <Link to="/signup" preload="intent">
                  Get started
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
