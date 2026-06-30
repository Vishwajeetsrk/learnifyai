import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const COMPETITORS = [
  { name: "Learnify AI", short: "Learnify", highlight: true },
  { name: "Coursera", short: "Coursera", highlight: false },
  { name: "Udemy", short: "Udemy", highlight: false },
  { name: "ChatGPT", short: "ChatGPT+", highlight: false },
];

const FEATURES = [
  { name: "AI Tutor", values: [true, false, false, true] },
  { name: "Certificates", values: [true, true, true, false] },
  { name: "Resume Builder", values: [true, false, false, false] },
  { name: "ATS Checker", values: [true, false, false, false] },
  { name: "Mock Interviews", values: [true, false, false, false] },
  { name: "Career Coach", values: [true, false, false, false] },
  { name: "Portfolio Builder", values: [true, false, false, false] },
  { name: "Internship Tools", values: [true, false, false, false] },
  { name: "LinkedIn Optimization", values: [true, false, false, false] },
  { name: "Career Analytics", values: [true, false, false, false] },
  { name: "Price (Monthly)", values: ["₹199–₹4,999", "₹3,999+", "Free–₹1,599", "$20/mo"] },
];

export function CompetitorComparison() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How We Compare</h2>
        <p className="mt-3 text-muted-foreground">See why Learnify AI is the complete career platform.</p>
      </motion.div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[160px_repeat(4,1fr)] gap-2 bg-muted/50 px-4 py-3 border-b">
          <div className="text-xs font-semibold text-muted-foreground">Feature</div>
          {COMPETITORS.map((c, i) => (
            <div
              key={c.name}
              className={cn(
                "text-xs font-bold text-center",
                c.highlight && "text-primary",
              )}
            >
              {c.short}
            </div>
          ))}
        </div>

        {/* Body */}
        {FEATURES.map((feat, fIdx) => (
          <div
            key={feat.name}
            className={cn(
              "grid grid-cols-[160px_repeat(4,1fr)] gap-2 px-4 py-3 items-center",
              fIdx % 2 === 0 ? "bg-card" : "bg-muted/20",
              fIdx === FEATURES.length - 1 && "border-t border-border/40",
            )}
          >
            <div className="text-xs font-medium text-foreground/80">{feat.name}</div>
            {feat.values.map((v, cIdx) => (
              <div
                key={cIdx}
                className={cn(
                  "flex justify-center",
                  COMPETITORS[cIdx].highlight && "bg-primary/5 rounded-lg py-1",
                )}
              >
                {typeof v === "boolean" ? (
                  v ? (
                    <Check className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
                  ) : (
                    <X className="w-4 h-4 text-zinc-400" strokeWidth={2} />
                  )
                ) : (
                  <span className="text-xs font-semibold text-foreground">{v}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
