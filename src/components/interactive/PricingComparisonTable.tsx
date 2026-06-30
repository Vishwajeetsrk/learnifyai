import { motion } from "framer-motion";
import { Check, X, HelpCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureStatus =
  | { type: "text"; value: string; subValue?: string }
  | { type: "check" }
  | { type: "cross" }
  | { type: "addon" }
  | { type: "limited"; text?: string };

interface FeatureRow {
  name: string;
  hasInfo?: boolean;
  infoText?: string;
  columns: FeatureStatus[];
}

interface Section {
  title: string;
  features: FeatureRow[];
}

interface PricingComparisonTableProps {
  sections?: Section[];
  planNames?: string[];
  className?: string;
}

function StatusCell({ status }: { status: FeatureStatus }) {
  switch (status.type) {
    case "check":
      return (
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="rounded-full bg-emerald-500/10 p-1.5 inline-flex"
        >
          <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
        </motion.div>
      );
    case "cross":
      return (
        <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 p-1.5 inline-flex">
          <X className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2.5} />
        </div>
      );
    case "text":
      return (
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold text-foreground/80">{status.value}</span>
          {status.subValue && (
            <span className="text-muted-foreground/60 text-[10px] mt-0.5">{status.subValue}</span>
          )}
        </div>
      );
    case "addon":
      return (
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground font-medium">
          <span>Add-on</span>
          <HelpCircle className="w-3 h-3 text-muted-foreground/50" />
        </div>
      );
    case "limited":
      return (
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground font-medium">
          <span>{status.text || "Limited"}</span>
          <HelpCircle className="w-3 h-3 text-muted-foreground/50" />
        </div>
      );
    default:
      return null;
  }
}

const DEFAULT_SECTIONS: Section[] = [
  {
    title: "Usage",
    features: [
      {
        name: "AI Credits / month",
        columns: [
          { type: "text", value: "500" },
          { type: "text", value: "10,000" },
          { type: "text", value: "25,000" },
          { type: "text", value: "50,000" },
        ],
      },
      {
        name: "Courses",
        columns: [
          { type: "text", value: "3 free" },
          { type: "text", value: "Unlimited" },
          { type: "text", value: "Unlimited" },
          { type: "text", value: "Unlimited" },
        ],
      },
    ],
  },
  {
    title: "Analytics & AI",
    features: [
      {
        name: "AI Tutor",
        hasInfo: true,
        infoText: "Basic: Q&A only. Advanced: voice, code, image understanding.",
        columns: [
          { type: "text", value: "Basic" },
          { type: "text", value: "Advanced" },
          { type: "text", value: "Advanced" },
          { type: "text", value: "Advanced" },
        ],
      },
      {
        name: "Resume Builder",
        columns: [{ type: "cross" }, { type: "check" }, { type: "check" }, { type: "check" }],
      },
      {
        name: "ATS Checker",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "check" }, { type: "check" }],
      },
      {
        name: "Mock Interviews",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "check" }, { type: "check" }],
      },
      {
        name: "Career Coach",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "check" }, { type: "check" }],
      },
      {
        name: "Portfolio Builder",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "check" }, { type: "check" }],
      },
      {
        name: "LinkedIn Optimizer",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "check" }, { type: "check" }],
      },
      {
        name: "Internship Tracker",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "check" }, { type: "check" }],
      },
      {
        name: "Certificates",
        columns: [
          { type: "text", value: "1" },
          { type: "check" },
          { type: "check" },
          { type: "check" },
        ],
      },
      {
        name: "Community Access",
        columns: [{ type: "check" }, { type: "check" }, { type: "check" }, { type: "check" }],
      },
      {
        name: "Advanced Analytics",
        columns: [
          { type: "cross" },
          { type: "text", value: "Basic" },
          { type: "text", value: "Advanced" },
          { type: "text", value: "Full" },
        ],
      },
    ],
  },
  {
    title: "Team & Enterprise",
    features: [
      {
        name: "Admin Dashboard",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "cross" }, { type: "check" }],
      },
      {
        name: "Team Management",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "cross" }, { type: "check" }],
      },
      {
        name: "SSO + RBAC",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "cross" }, { type: "check" }],
      },
      {
        name: "White Label",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "cross" }, { type: "check" }],
      },
      {
        name: "Bulk Certificates",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "cross" }, { type: "check" }],
      },
      {
        name: "Dedicated Support",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "cross" }, { type: "check" }],
      },
      {
        name: "API Access",
        columns: [{ type: "cross" }, { type: "cross" }, { type: "cross" }, { type: "check" }],
      },
    ],
  },
];

const DEFAULT_PLAN_NAMES = ["Starter", "Pro", "Career Pro", "Team"];

export function PricingComparisonTable({
  sections = DEFAULT_SECTIONS,
  planNames = DEFAULT_PLAN_NAMES,
  className,
}: PricingComparisonTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Mobile hint */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-4 md:hidden">
        <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
        <span>Swipe to see all plans</span>
        <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
      </div>

      {/* Scrollable wrapper */}
      <div className="overflow-x-auto rounded-2xl border">
        <div className="min-w-[640px] lg:min-w-0">
          {/* Header row */}
          <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border/50">
            <div className="grid grid-cols-[120px_sm:140px_repeat(4,minmax(100px,1fr))] lg:grid-cols-[180px_repeat(4,1fr)]">
              <div className="p-3 lg:p-4 flex items-center">
                <span className="text-[11px] lg:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Feature
                </span>
              </div>
              {planNames.map((name, i) => (
                <div
                  key={name}
                  className={cn(
                    "p-3 lg:p-4 flex items-center justify-center text-center",
                    i === 1 && "bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs lg:text-sm font-bold",
                      i === 1 && "text-primary",
                      i === 2 && "text-purple-600 dark:text-purple-400",
                    )}
                  >
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          {sections.map((section, sIdx) => (
            <div key={section.title}>
              {/* Section title */}
              <div className="bg-muted/50 px-3 lg:px-4 py-2.5 border-b border-border/30">
                <h3 className="text-xs lg:text-sm font-bold text-foreground/80">
                  {section.title}
                </h3>
              </div>

              {/* Feature rows */}
              {section.features.map((feature, fIdx) => (
                <div
                  key={feature.name}
                  className={cn(
                    "grid grid-cols-[120px_sm:140px_repeat(4,minmax(100px,1fr))] lg:grid-cols-[180px_repeat(4,1fr)] transition-colors",
                    fIdx % 2 === 0 ? "bg-card" : "bg-muted/20",
                  )}
                >
                  {/* Feature name */}
                  <div className="p-3 lg:p-4 flex items-center gap-1.5 border-r border-border/20">
                    <span className="text-[11px] lg:text-xs text-foreground/80 font-medium leading-tight">
                      {feature.name}
                    </span>
                    {feature.hasInfo && (
                      <div className="group relative shrink-0">
                        <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help" />
                        {feature.infoText && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 p-2 bg-foreground text-background text-[10px] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 pointer-events-none text-center">
                            {feature.infoText}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Values */}
                  {feature.columns.map((status, cIdx) => (
                    <div
                      key={cIdx}
                      className={cn(
                        "p-3 lg:p-4 flex items-center justify-center",
                        cIdx === 1 && "bg-primary/[0.03]",
                      )}
                    >
                      <StatusCell status={status} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
