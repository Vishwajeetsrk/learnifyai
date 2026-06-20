import { Link } from "@tanstack/react-router";
import { Twitter, Github, MessageSquare, Linkedin, Youtube } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useSiteSettings } from "@/hooks/use-site-settings";

export function SiteFooter() {
  const { data: s } = useSiteSettings();
  return (
    <footer className="border-t border-border/60 mt-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6 py-16 grid gap-10 md:grid-cols-6">
        <div className="space-y-4 md:col-span-2">
          <Link to="/" className="inline-flex items-center" aria-label="Learnify AI">
            <Logo height="h-10" />
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Learn smarter. Grow faster. The intelligent learning OS.
          </p>
          <div className="flex items-center gap-3 pt-2">
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
            {s?.linkedin_url && s.linkedin_url !== "#" && (
              <a
                href={s.linkedin_url}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {s?.twitter_url && (
              <a
                href={s.twitter_url}
                target="_blank"
                rel="noreferrer"
                aria-label="X (Twitter)"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {s?.youtube_url && s.youtube_url !== "#" && (
              <a
                href={s.youtube_url}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition"
              >
                <Youtube className="h-4 w-4" />
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
              <Link to="/ai-tools" className="hover:text-foreground transition">
                AI Tools
              </Link>
            </li>
            <li>
              <Link
                to="/pricing"
                search={{ subscribe: undefined }}
                className="hover:text-foreground transition"
              >
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
          <h4 className="font-display font-semibold text-sm mb-4">Resources</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/community" className="hover:text-foreground transition">
                Community
              </Link>
            </li>
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
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-sm mb-4">Legal</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/privacy" className="hover:text-foreground transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-foreground transition">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Learnify AI · Learn Smarter. Grow Faster.
      </div>
    </footer>
  );
}
