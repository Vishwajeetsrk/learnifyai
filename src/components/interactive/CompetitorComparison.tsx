import { useState } from "react";
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
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"table" | "card">("table");

  return (
    <section className="container mx-auto px-4 sm:px-6 py-12 md:py-20 max-w-5xl">
      <motion.div
        className="text-center mb-8 md:mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">How We Compare</h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          See why Learnify AI is the complete career platform.
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 md:hidden">
          <button
            onClick={() => setMobileView("table")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              mobileView === "table"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            Table
          </button>
          <button
            onClick={() => setMobileView("card")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              mobileView === "card"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            Cards
          </button>
        </div>
      </motion.div>

      {/* Desktop: scrollable table */}
      <div className="hidden md:block rounded-2xl border bg-card overflow-hidden">
        <div className="grid grid-cols-[160px_repeat(4,1fr)] gap-2 bg-muted/50 px-4 py-3 border-b">
          <div className="text-xs font-semibold text-muted-foreground">Feature</div>
          {COMPETITORS.map((c, i) => (
            <div
              key={c.name}
              className={cn("text-xs font-bold text-center", c.highlight && "text-primary")}
            >
              {c.short}
            </div>
          ))}
        </div>
        {FEATURES.map((feat, fIdx) => (
          <motion.div
            key={feat.name}
            layout
            className={cn(
              "grid grid-cols-[160px_repeat(4,1fr)] gap-2 px-4 py-3 items-center cursor-pointer transition-colors",
              fIdx % 2 === 0 ? "bg-card" : "bg-muted/20",
              fIdx === FEATURES.length - 1 && "border-t border-border/40",
              selectedFeature === feat.name && "bg-primary/5",
            )}
            onClick={() => setSelectedFeature(selectedFeature === feat.name ? null : feat.name)}
            whileHover={{ scale: 1.003 }}
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
          </motion.div>
        ))}
      </div>

      {/* Mobile: card view */}
      <div className="md:hidden space-y-3">
        {mobileView === "table" ? (
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="min-w-[500px] rounded-2xl border bg-card overflow-hidden">
              <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-1 bg-muted/50 px-3 py-2.5 border-b">
                <div className="text-[10px] font-semibold text-muted-foreground">Feature</div>
                {COMPETITORS.map((c, i) => (
                  <div
                    key={c.name}
                    className={cn("text-[10px] font-bold text-center", c.highlight && "text-primary")}
                  >
                    {c.short}
                  </div>
                ))}
              </div>
              {FEATURES.map((feat, fIdx) => (
                <div
                  key={feat.name}
                  className={cn(
                    "grid grid-cols-[120px_repeat(4,1fr)] gap-1 px-3 py-2.5 items-center",
                    fIdx % 2 === 0 ? "bg-card" : "bg-muted/20",
                  )}
                >
                  <div className="text-[10px] font-medium text-foreground/80 truncate">
                    {feat.name}
                  </div>
                  {feat.values.map((v, cIdx) => (
                    <div key={cIdx} className="flex justify-center">
                      {typeof v === "boolean" ? (
                        v ? (
                          <Check className="w-3 h-3 text-emerald-500" strokeWidth={2.5} />
                        ) : (
                          <Minus className="w-3 h-3 text-zinc-300" strokeWidth={2} />
                        )
                      ) : (
                        <span className="text-[9px] font-semibold text-foreground text-center leading-tight">
                          {v}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          COMPETITORS.map((comp, cIdx) => (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: cIdx * 0.08 }}
              className={cn(
                "rounded-xl border p-4",
                comp.highlight
                  ? "bg-primary/5 border-primary/20"
                  : "bg-card border-border",
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <h4
                  className={cn(
                    "text-sm font-bold",
                    comp.highlight ? "text-primary" : "text-foreground",
                  )}
                >
                  {comp.name}
                </h4>
                {comp.highlight && (
                  <span className="text-[9px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Best
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {FEATURES.map((feat) => {
                  const val = feat.values[cIdx];
                  return (
                    <div
                      key={feat.name}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground">{feat.name}</span>
                      {typeof val === "boolean" ? (
                        val ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                        ) : (
                          <X className="w-3.5 h-3.5 text-zinc-300" strokeWidth={1.5} />
                        )
                      ) : (
                        <span className="font-semibold text-foreground text-[10px]">{val}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
