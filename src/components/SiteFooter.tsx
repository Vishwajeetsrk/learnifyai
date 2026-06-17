import { Link } from "@tanstack/react-router";
import { Twitter, Github, MessageSquare } from "lucide-react";
<<<<<<< HEAD
import logoUrl from "@/assets/learnify-logo.png?url";
=======
import { Logo } from "@/components/Logo";
>>>>>>> fc4522b843573bc1c1f5dd8e35d41f7bbd28de87
import { useSiteSettings } from "@/hooks/use-site-settings";

export function SiteFooter() {
  const { data: s } = useSiteSettings();
  return (
    <footer className="border-t border-border/60 mt-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center" aria-label="Learnify AI">
<<<<<<< HEAD
            <img src={logoUrl} alt="Learnify AI" className="h-10 w-auto" />
=======
            <Logo height="h-10" />
>>>>>>> fc4522b843573bc1c1f5dd8e35d41f7bbd28de87
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Learn smarter. Grow faster. The intelligent learning OS.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {s?.twitter_url && (
              <a
                href={s.twitter_url}
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {s?.github_url && s.github_url !== "#" && (
              <a
                href={s.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {s?.discord_url && (
              <a
                href={s.discord_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm mb-4">Product</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/features" className="hover:text-foreground transition">
                Features
              </Link>
            </li>
            <li>
              <a href="/features#ai-tools" className="hover:text-foreground transition">
                AI Tools
              </a>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground transition">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/roadmap" className="hover:text-foreground transition">
                Roadmap
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm mb-4">Community</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/creators" className="hover:text-foreground transition">
                Creators
              </Link>
            </li>
            <li>
              <Link to="/coaches" className="hover:text-foreground transition">
                Coaches
              </Link>
            </li>
            {s?.discord_url && (
              <li>
                <a
                  href={s.discord_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition"
                >
                  Discord
                </a>
              </li>
            )}
            <li>
              <Link to="/events" className="hover:text-foreground transition">
                Events
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-foreground transition">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-foreground transition">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-foreground transition">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © 2026 Learnify AI · Learn Smarter. Grow Faster.
      </div>
    </footer>
  );
}
