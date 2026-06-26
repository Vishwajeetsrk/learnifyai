import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";

export function SiteHeader() {
  const { isAuthenticated, loading } = useAuth();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center" aria-label="Learnify AI">
          <Logo height="h-10" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/features" preload="intent" className="hover:text-foreground transition">
            Features
          </Link>
          <Link
            to="/features"
            hash="ai-tools"
            preload="intent"
            className="hover:text-foreground transition"
          >
            AI Tools
          </Link>
          <Link to="/creators" preload="intent" className="hover:text-foreground transition">
            Creators
          </Link>
          <Link to="/coaches" preload="intent" className="hover:text-foreground transition">
            Coaches
          </Link>
          <Link
            to="/pricing"
            search={{ subscribe: undefined }}
            preload="intent"
            className="hover:text-foreground transition"
          >
            Pricing
          </Link>
          <Link
            to="/blog"
            preload="intent"
            className="hover:text-foreground transition"
          >
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* While loading, show Sign In / Get Started optimistically (not authenticated yet) */}
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
