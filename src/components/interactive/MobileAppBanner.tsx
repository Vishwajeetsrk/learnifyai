import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Bell,
  CheckCircle2,
  Sparkles,
  Wifi,
  BarChart3,
  BookOpen,
  Mic,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const FEATURE_HIGHLIGHTS = [
  { icon: Mic, label: "Voice AI Tutor" },
  { icon: BookOpen, label: "Offline Notes" },
  { icon: BarChart3, label: "Career Insights" },
  { icon: Award, label: "Certificates" },
];

export function MobileAppBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("You're on the Early Access VIP list! 500 bonus credits reserved.");
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-[hsl(var(--primary)/0.15)] via-background to-[hsl(var(--primary)/0.08)] shadow-2xl">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid gap-10 px-6 py-10 sm:px-10 sm:py-12 lg:grid-cols-12 lg:items-center">
        {/* LEFT — Text + CTA */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Smartphone className="h-3.5 w-3.5" />
            Mobile Learning Experience
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Learnify AI Mobile App{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              Take AI Tutoring, Offline Smart Notes, Voice-based Interview Coaching, and
              Certificate Verifications wherever you go on Android &amp; iOS.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {FEATURE_HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>

          {/* Store badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm transition hover:border-primary/40 hover:shadow-md">
              {/* Google Play SVG */}
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                <path d="M3.18 1.56a1.5 1.5 0 0 0-.56 1.17v18.54a1.5 1.5 0 0 0 .56 1.17l.07.06 10.38-10.38v-.24L3.25 1.5l-.07.06Z" fill="#EA4335"/>
                <path d="m17.19 15.19-3.46-3.46v-.24l3.46-3.46.08.04 4.1 2.33c1.17.66 1.17 1.75 0 2.42l-4.1 2.33-.08.04Z" fill="#FBBC05"/>
                <path d="M17.27 15.15 13.73 11.6 3.18 22.44a1.36 1.36 0 0 0 1.75.05l12.34-7.34Z" fill="#34A853"/>
                <path d="M17.27 8.85 4.93 1.51a1.36 1.36 0 0 0-1.75.05L13.73 12l3.54-3.15Z" fill="#4285F4"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Get it on
                </div>
                <div className="text-xs font-bold text-foreground">Google Play</div>
              </div>
            </div>

            <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm transition hover:border-primary/40 hover:shadow-md">
              {/* Apple SVG */}
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-foreground">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/>
                <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.701z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Download on the
                </div>
                <div className="text-xs font-bold text-foreground">App Store</div>
              </div>
            </div>
          </div>

          {/* Email signup */}
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="Enter your email for early VIP access..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm h-10"
              />
              <Button type="submit" size="sm" className="h-10 shrink-0 px-4 text-xs">
                <Bell className="mr-1.5 h-3.5 w-3.5" />
                Notify Me
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20 max-w-md">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              You're on the early access list! 500 bonus credits reserved.
            </div>
          )}
        </div>

        {/* RIGHT — Phone mockup */}
        <div className="flex justify-center lg:col-span-5">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-52 sm:w-56"
          >
            {/* Phone shell */}
            <div className="relative mx-auto w-52 sm:w-56 h-[360px] sm:h-[400px] rounded-[2.8rem] border-[4px] border-border bg-card shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-border rounded-b-2xl z-10" />

              {/* Screen content */}
              <div className="flex h-full flex-col bg-gradient-to-b from-primary/5 to-background p-4 pt-8">
                {/* Status bar */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-foreground">Learnify AI</span>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-muted-foreground" />
                    <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                  </div>
                </div>

                {/* AI Chat bubble */}
                <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 mb-3">
                  <div className="text-[10px] text-primary font-semibold mb-1 flex items-center gap-1">
                    <Mic className="h-2.5 w-2.5" />
                    AI Voice Tutor Active...
                  </div>
                  <p className="text-[10px] text-foreground/80 leading-relaxed">
                    "Explain React Server Components in simple terms..."
                  </p>
                </div>

                {/* Response bubble */}
                <div className="rounded-xl bg-card border border-border p-3 mb-3">
                  <div className="text-[10px] text-muted-foreground mb-1">Learnify AI</div>
                  <div className="space-y-1">
                    <div className="h-1.5 rounded bg-muted animate-pulse w-full" />
                    <div className="h-1.5 rounded bg-muted animate-pulse w-3/4" />
                    <div className="h-1.5 rounded bg-muted animate-pulse w-5/6" />
                  </div>
                </div>

                {/* Progress */}
                <div className="rounded-xl bg-card border border-border p-3 mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-foreground">Today's Goal</span>
                    <span className="text-[10px] font-bold text-primary">74%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-3/4 rounded-full bg-primary" />
                  </div>
                </div>

                {/* Launch badge */}
                <div className="mt-3 text-center">
                  <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-primary">
                    Launching Q3 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 top-16 rounded-xl border border-border bg-card px-2.5 py-1.5 shadow-lg text-[10px] font-semibold text-foreground"
            >
              🎓 4.9★ Rated
            </motion.div>
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 bottom-24 rounded-xl border border-border bg-card px-2.5 py-1.5 shadow-lg text-[10px] font-semibold text-foreground"
            >
              📱 Android + iOS
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
