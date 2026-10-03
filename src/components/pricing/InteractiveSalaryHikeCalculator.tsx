import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  Zap,
  Clock,
  Award,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

interface RolePreset {
  id: string;
  title: string;
  fromRole: string;
  toRole: string;
  currentLpa: number;
  targetLpa: number;
  months: number;
}

const PRESETS: RolePreset[] = [
  {
    id: "fs-eng",
    title: "Junior to Mid Full-Stack",
    fromRole: "Junior Developer",
    toRole: "SDE-2 Full Stack Engineer",
    currentLpa: 4.5,
    targetLpa: 12.0,
    months: 6,
  },
  {
    id: "ai-eng",
    title: "Web to AI / LLM Engineer",
    fromRole: "Frontend Developer",
    toRole: "Generative AI Engineer",
    currentLpa: 7.0,
    targetLpa: 18.0,
    months: 6,
  },
  {
    id: "senior-sde",
    title: "Mid to Senior Architect",
    fromRole: "Software Engineer",
    toRole: "Lead / Senior Architect",
    currentLpa: 14.0,
    targetLpa: 28.0,
    months: 9,
  },
  {
    id: "nontech-pivot",
    title: "Service / QA to Product SDE",
    fromRole: "QA / Support Engineer",
    toRole: "Product Software Engineer",
    currentLpa: 3.6,
    targetLpa: 9.5,
    months: 6,
  },
];

export function InteractiveSalaryHikeCalculator() {
  const [selectedPreset, setSelectedPreset] = useState<string>("fs-eng");
  const [currentLpa, setCurrentLpa] = useState<number>(4.5);
  const [targetLpa, setTargetLpa] = useState<number>(12.0);
  const [months, setMonths] = useState<number>(6);

  const applyPreset = (preset: RolePreset) => {
    setSelectedPreset(preset.id);
    setCurrentLpa(preset.currentLpa);
    setTargetLpa(preset.targetLpa);
    setMonths(preset.months);
  };

  const calculations = useMemo(() => {
    const annualHikeInr = Math.max(0, (targetLpa - currentLpa) * 100000);
    const monthlyGrossHike = Math.round(annualHikeInr / 12);
    // Estimated net take-home hike after tax (~82% effective for bracket)
    const monthlyNetHike = Math.round(monthlyGrossHike * 0.85);

    // Learnify AI investment over prep duration (₹499/mo)
    const learnifyCost = months * 499;

    // Days on new salary to recover total Learnify investment
    const dailyNewSalary = Math.round((targetLpa * 100000) / 365);
    const paybackDays = dailyNewSalary > 0 ? (learnifyCost / dailyNewSalary).toFixed(1) : "0";

    // ROI Multiple: annual net gain / total investment
    const roiMultiple = learnifyCost > 0 ? Math.round(annualHikeInr / learnifyCost) : 0;
    const hikePercent = currentLpa > 0 ? Math.round(((targetLpa - currentLpa) / currentLpa) * 100) : 0;

    return {
      annualHikeInr,
      monthlyGrossHike,
      monthlyNetHike,
      learnifyCost,
      paybackDays,
      roiMultiple,
      hikePercent,
    };
  }, [currentLpa, targetLpa, months]);

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-25">
        <div className="w-[500px] h-[300px] bg-primary/20 blur-[120px] rounded-full" />
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <Badge variant="outline" className="mb-3 px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
          <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
          Interactive Career ROI Calculator
        </Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight text-foreground">
          Calculate Your Salary Hike &amp; Learning Return
        </h2>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground">
          See how an investment of ₹499/month turns into transformative compensation growth at top tech companies.
        </p>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-12">
        {PRESETS.map((p) => {
          const isSelected = selectedPreset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card/60 backdrop-blur-sm text-muted-foreground border-border/60 hover:text-foreground hover:bg-card"
              }`}
            >
              {p.title}
            </button>
          );
        })}
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Sliders Card */}
        <div className="lg:col-span-7 bg-card/80 backdrop-blur-md border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-6 sm:space-y-8">
            {/* Current CTC */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  Current Compensation (CTC)
                </label>
                <span className="text-base sm:text-lg font-bold text-foreground font-display">
                  ₹{currentLpa.toFixed(1)} LPA
                </span>
              </div>
              <input
                type="range"
                min={2.0}
                max={35.0}
                step={0.5}
                value={currentLpa}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCurrentLpa(val);
                  if (val >= targetLpa) setTargetLpa(val + 3);
                  setSelectedPreset("custom");
                }}
                className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
                <span>₹2 LPA (Entry)</span>
                <span>₹18 LPA</span>
                <span>₹35 LPA</span>
              </div>
            </div>

            {/* Target CTC */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Target Compensation (Expected)
                </label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-semibold">
                    +{calculations.hikePercent}% Hike
                  </Badge>
                  <span className="text-base sm:text-lg font-bold text-foreground font-display">
                    ₹{targetLpa.toFixed(1)} LPA
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={Math.max(3.0, currentLpa + 0.5)}
                max={50.0}
                step={0.5}
                value={targetLpa}
                onChange={(e) => {
                  setTargetLpa(parseFloat(e.target.value));
                  setSelectedPreset("custom");
                }}
                className="w-full accent-emerald-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
                <span>Min: ₹{(currentLpa + 0.5).toFixed(1)} LPA</span>
                <span>₹25 LPA</span>
                <span>₹50 LPA+</span>
              </div>
            </div>

            {/* Preparation Duration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Target Transition Timeframe
                </label>
                <span className="text-sm font-bold text-foreground">
                  {months} Months
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 9, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMonths(m);
                      setSelectedPreset("custom");
                    }}
                    className={`py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      months === m
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Included Features List */}
          <div className="mt-8 pt-6 border-t border-border/60">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Included In Your ₹499/mo Career OS
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>91 Verified Engineering Roadmaps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Sandpack Live In-Browser Coding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>ATS Resume Scorer &amp; Optimizer</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Voice Mock Interview Simulation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-card via-card/90 to-primary/5 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-border/60">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Net Annual Increase
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-foreground font-display mt-1">
                  ₹{(calculations.annualHikeInr / 100000).toFixed(1)} Lakhs/yr
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-display font-bold text-sm">
                +{calculations.hikePercent}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                <p className="text-[11px] text-muted-foreground font-medium">Est. Monthly Net Gain</p>
                <p className="text-lg font-bold text-foreground font-display mt-0.5">
                  ₹{calculations.monthlyNetHike.toLocaleString("en-IN")}/mo
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                <p className="text-[11px] text-muted-foreground font-medium">Investment Multiplier</p>
                <p className="text-lg font-bold text-primary font-display mt-0.5">
                  {calculations.roiMultiple}x Annual ROI
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                <Zap className="h-4 w-4" />
                <span>Lightning Fast Payback Period</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                Your entire {months}-month Learnify AI investment (₹{calculations.learnifyCost.toLocaleString("en-IN")}) is recovered in just{" "}
                <span className="font-bold text-foreground">{calculations.paybackDays} days</span> of working at your new salary.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/60 space-y-3">
            <Link to="/pricing" className="w-full block">
              <Button size="lg" className="w-full font-semibold gap-2 shadow-md hover:scale-[1.01] transition-transform">
                <span>Start Learning &amp; Upgrade</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-[11px] text-center text-muted-foreground">
              Instant access • No lock-in • Cancel anytime with 1-click
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
