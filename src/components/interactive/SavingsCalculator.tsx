import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Plus,
  Minus,
  ChevronRight,
  Sparkles,
  FileText,
  Mic,
  Award,
  BarChart3,
  Target,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FeatureOption {
  id: string;
  name: string;
  icon: React.ElementType;
  cost: number;
  color: string;
  desc: string;
}

const FEATURES: FeatureOption[] = [
  {
    id: "ai-tutor",
    name: "AI Tutor Pro",
    icon: Sparkles,
    cost: 999,
    color: "#2563EB",
    desc: "Advanced AI tutoring",
  },
  {
    id: "resume",
    name: "Resume Builder",
    icon: FileText,
    cost: 599,
    color: "#6366F1",
    desc: "ATS-optimized resumes",
  },
  {
    id: "mock-interview",
    name: "Mock Interview",
    icon: Mic,
    cost: 749,
    color: "#8B5CF6",
    desc: "AI interview practice",
  },
  {
    id: "certificates",
    name: "Certificates",
    icon: Award,
    cost: 499,
    color: "#10B981",
    desc: "Verified certificates",
  },
  {
    id: "ats-checker",
    name: "ATS Checker",
    icon: BarChart3,
    cost: 399,
    color: "#F59E0B",
    desc: "Resume ATS scoring",
  },
  {
    id: "career-coach",
    name: "Career Coach",
    icon: Target,
    cost: 1299,
    color: "#EC4899",
    desc: "Personal career guidance",
  },
  {
    id: "portfolio",
    name: "Portfolio Builder",
    icon: BookOpen,
    cost: 349,
    color: "#0ea5e9",
    desc: "Build your portfolio",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    cost: 599,
    color: "#14b8a6",
    desc: "Advanced analytics",
  },
];

interface SavingsCalculatorProps {
  className?: string;
}

export function SavingsCalculator({ className }: SavingsCalculatorProps) {
  const [selected, setSelected] = useState<string[]>(["ai-tutor", "resume", "certificates"]);
  const [userCount, setUserCount] = useState(1);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectedData = useMemo(() => FEATURES.filter((f) => selected.includes(f.id)), [selected]);

  const individualTotal = useMemo(
    () => selectedData.reduce((acc, f) => acc + f.cost * userCount * 12, 0),
    [selectedData, userCount],
  );

  const learnifyCost = 499 * userCount * 12;
  const savings = individualTotal - learnifyCost;

  return (
    <section className={cn("w-full mx-auto", className)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Build Your Plan</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Pick the features you need and see how much you save with Learnify AI.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-lg">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Feature Selection */}
          <div>
            <h3 className="text-base font-semibold mb-4">Choose features</h3>
            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map((feat) => {
                const isSel = selected.includes(feat.id);
                const Icon = feat.icon;
                return (
                  <motion.button
                    key={feat.id}
                    onClick={() => toggle(feat.id)}
                    className={cn(
                      "relative flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all duration-200",
                      isSel
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-sm"
                        : "border-border hover:border-muted-foreground/30 bg-background",
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSel && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center text-white ring-2 ring-card z-10">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                    <div className="shrink-0" style={{ color: feat.color }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{feat.name}</div>
                      <div className="text-[10px] text-muted-foreground">₹{feat.cost}/mo</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t">
              <label className="text-sm font-medium mb-2 block">Number of users</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUserCount(Math.max(1, userCount - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={userCount}
                  onChange={(e) => setUserCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 h-10 text-center text-base font-bold bg-background border rounded-lg focus:border-purple-500 focus:outline-none transition-all"
                />
                <button
                  onClick={() => setUserCount(userCount + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Savings Display */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-base font-semibold mb-4">Your savings</h3>

              <div className="space-y-3 mb-6">
                {selectedData.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between text-sm text-muted-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <f.icon className="w-4 h-4" style={{ color: f.color }} />
                      <span>{f.name}</span>
                    </div>
                    <span className="font-medium text-foreground">₹{f.cost}/user/mo</span>
                  </div>
                ))}
                {selected.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Select features to see savings...
                  </p>
                )}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Individual tools total</span>
                  <span className="font-semibold text-foreground">
                    ₹{individualTotal.toLocaleString("en-IN")}/yr
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Learnify AI ({userCount} user{userCount > 1 ? "s" : ""})
                  </span>
                  <span className="font-semibold text-foreground">
                    ₹{learnifyCost.toLocaleString("en-IN")}/yr
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
                Save ₹{Math.max(0, savings).toLocaleString("en-IN")}/yr
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Get all features in one platform for a fraction of the cost.
              </p>
              <Button
                asChild
                className="w-full h-11 rounded-xl font-semibold shadow-lg shadow-purple-200 dark:shadow-purple-950/30"
              >
                <a href="/signup">
                  Start saving with Learnify
                  <ChevronRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
