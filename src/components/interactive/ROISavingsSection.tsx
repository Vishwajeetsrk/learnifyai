import { motion } from "framer-motion";
import { Check, IndianRupee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const TOOLS = [
  { name: "Resume Builder", cost: 599, color: "#6366F1" },
  { name: "ATS Checker", cost: 399, color: "#F59E0B" },
  { name: "Career Coach", cost: 1299, color: "#EC4899" },
  { name: "Mock Interview", cost: 749, color: "#8B5CF6" },
  { name: "Certificates", cost: 499, color: "#10B981" },
  { name: "AI Tutor", cost: 999, color: "#2563EB" },
];

const totalCost = TOOLS.reduce((s, t) => s + t.cost, 0);
const learnifyCost = 399;
const savings = totalCost - learnifyCost;

export function ROISavingsSection() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Pay For Multiple Tools?</h2>
        <p className="mt-3 text-muted-foreground">One platform replaces six expensive subscriptions.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <motion.div
          className="rounded-2xl border bg-card p-6 space-y-4"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-base font-semibold mb-2">Individual Tools</h3>
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              className="flex items-center justify-between py-2 border-b border-border/40 last:border-0"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: tool.color }} />
                <span className="text-sm">{tool.name}</span>
              </div>
              <span className="text-sm font-semibold">₹{tool.cost}/mo</span>
            </motion.div>
          ))}
          <div className="flex items-center justify-between pt-3 border-t-2 border-destructive">
            <span className="text-sm font-bold text-destructive">Total</span>
            <span className="text-lg font-extrabold text-destructive">₹{totalCost.toLocaleString("en-IN")}/mo</span>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-emerald-950/20 dark:to-emerald-950/10 p-6 flex flex-col justify-between"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
              <Check className="w-3 h-3" />
              Learnify AI
            </div>
            <h3 className="text-2xl font-bold mb-2">Career Pro</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-extrabold">₹{learnifyCost}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <div className="space-y-2.5 mb-6">
              {[
                "AI Tutor Pro",
                "Resume Builder",
                "ATS Checker",
                "Mock Interviews",
                "Career Coach",
                "Portfolio Builder",
                "Certificates",
                "25,000 AI credits",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-emerald-500/10 p-4 text-center mb-4">
            <p className="text-xs text-muted-foreground mb-1">You save</p>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ₹{savings.toLocaleString("en-IN")}
              <span className="text-sm font-medium text-muted-foreground">/mo</span>
            </p>
          </div>

          <Button
            asChild
            className="w-full h-12 rounded-xl font-semibold text-base bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25"
          >
            <Link to="/signup">
              Get Everything In One Platform
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
