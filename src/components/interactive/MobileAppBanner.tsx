import { useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone, Bell, CheckCircle2, Sparkles, Wifi, BarChart3,
  BookOpen, Mic, Award, ArrowRight, Star, Zap, Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const FEATURE_HIGHLIGHTS = [
  { icon: Mic, label: "Voice AI Tutor", color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { icon: BookOpen, label: "Offline Notes", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: BarChart3, label: "Career Insights", color: "text-amber-500", bg: "bg-amber-500/10" },
  { icon: Award, label: "Certificates", color: "text-violet-500", bg: "bg-violet-500/10" },
];

const PHONE_SCREENS = [
  { label: "AI Voice Tutor", icon: Mic, text: "Explain React Server Components in simple terms..." },
  { label: "Smart Notes", icon: BookOpen, text: "Auto-generated from your video lessons" },
  { label: "Career Insights", icon: BarChart3, text: "Track your learning progress" },
];

export function MobileAppBanner() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeScreen, setActiveScreen] = useState(0);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("You're on the Early Access VIP list! 500 bonus credits reserved.");
  };

  const nextScreen = () => setActiveScreen((p) => (p + 1) % PHONE_SCREENS.length);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-[hsl(var(--primary)/0.15)] via-background to-[hsl(var(--primary)/0.08)] shadow-2xl">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-12 lg:items-center">
        {/* LEFT — Text + CTA */}
        <div className="lg:col-span-7 space-y-5">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary"
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile Learning Experience
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              Learnify AI Mobile App{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Coming Soon
              </span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              Take AI Tutoring, Offline Smart Notes, Voice-based Interview Coaching, and
              Certificate Verifications wherever you go on Android &amp; iOS.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {FEATURE_HIGHLIGHTS.map(({ icon: Icon, label, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm cursor-default transition-shadow hover:shadow-md`}
              >
                <span className={`p-1 rounded-md ${bg}`}>
                  <Icon className={`h-3 w-3 ${color}`} />
                </span>
                {label}
              </motion.div>
            ))}
          </motion.div>

          {/* Store badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center gap-3"
          >
            {/* Google Play */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm transition hover:border-primary/40 hover:shadow-md group"
            >
              <svg viewBox="0 0 16 16" className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path fill="#2196F3" d="M8.32 7.68.58 15.42c-.37-.35-.57-.83-.57-1.35V1.93C.01 1.4.22.92.6.56l7.72 7.12z"/>
                <path fill="#FFC107" d="M15.01 8c0 .7-.38 1.32-1.01 1.67l-2.2 1.22-2.73-2.52-.75-.69 2.89-2.89L14 6.33c.63.35 1.01.97 1.01 1.67z"/>
                <path fill="#4CAF50" d="M8.32 7.68.6.56C.7.46.83.37.96.29 1.59-.09 2.35-.1 3 .26l8.21 4.53-2.89 2.89z"/>
                <path fill="#F44336" d="M11.8 10.89 3 15.74c-.31.18-.66.26-1 .26-.36 0-.72-.09-1.04-.29a1.82 1.82 0 0 1-.38-.29l7.74-7.74.75.69 2.73 2.52z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Get it on</div>
                <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">Google Play</div>
              </div>
            </motion.a>

            {/* App Store */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm transition hover:border-primary/40 hover:shadow-md group"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-foreground shrink-0 group-hover:fill-primary transition-colors">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z"/>
                <path d="M15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.701z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Download on the</div>
                <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">App Store</div>
              </div>
            </motion.a>
          </motion.div>

          {/* Email signup */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20 max-w-md"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                You're on the early access list! 500 bonus credits reserved.
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* RIGHT — Phone mockup */}
        <div className="flex justify-center lg:col-span-5">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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

                {/* AI Chat bubble - cycles through screens */}
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-primary/10 border border-primary/20 p-3 mb-3 cursor-pointer"
                  onClick={nextScreen}
                >
                  <div className="text-[10px] text-primary font-semibold mb-1 flex items-center gap-1">
                    {(() => { const Icon = PHONE_SCREENS[activeScreen].icon; return <Icon className="h-2.5 w-2.5" />; })()}
                    {PHONE_SCREENS[activeScreen].label} Active...
                  </div>
                  <p className="text-[10px] text-foreground/80 leading-relaxed">
                    "{PHONE_SCREENS[activeScreen].text}"
                  </p>
                </motion.div>

                {/* Screen indicator dots */}
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  {PHONE_SCREENS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveScreen(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeScreen ? "w-4 bg-primary" : "w-1.5 bg-muted"
                      }`}
                    />
                  ))}
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
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "74%" }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="h-full rounded-full bg-primary"
                    />
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
              className="absolute -right-4 top-16 rounded-xl border border-border bg-card px-2.5 py-1.5 shadow-lg flex items-center gap-1.5"
            >
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-[10px] font-semibold text-foreground">4.9 Rated</span>
            </motion.div>
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 bottom-24 rounded-xl border border-border bg-card px-2.5 py-1.5 shadow-lg flex items-center gap-1.5"
            >
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-semibold text-foreground">Android + iOS</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
