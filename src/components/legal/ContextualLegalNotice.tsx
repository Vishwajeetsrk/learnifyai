import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Shield, ExternalLink, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type LegalContextType =
  | "checkout"
  | "community"
  | "ai"
  | "creator_upload"
  | "digital_purchase"
  | "student_onboarding"
  | "parental_consent"
  | "privacy_settings"
  | "support";

interface ContextualLegalNoticeProps {
  context: LegalContextType;
  variant?: "compact" | "banner" | "modal" | "inline";
  requireExplicitAcceptance?: boolean;
  onAccepted?: (accepted?: boolean) => void;
  checked?: boolean;
  className?: string;
}

const POLICY_VERSION = "3.0";

export function ContextualLegalNotice({
  context,
  variant = "compact",
  requireExplicitAcceptance = false,
  onAccepted,
  checked: propsChecked,
  className = "",
}: ContextualLegalNoticeProps) {
  const [acknowledged, setAcknowledged] = useState<boolean>(true);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    // Show-once logic per policy version (Requirement 98)
    const storageKey = `learnify_legal_ack_${context}_${POLICY_VERSION}`;
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      setAcknowledged(false);
    }
  }, [context]);

  const handleAcknowledge = () => {
    const storageKey = `learnify_legal_ack_${context}_${POLICY_VERSION}`;
    localStorage.setItem(storageKey, new Date().toISOString());
    setAcknowledged(true);
    if (onAccepted) onAccepted();
  };

  // 1. CHECKOUT CONTEXT (Requirement 44: High-trust, compliant terms & refund disclosure)
  if (context === "checkout" || context === "digital_purchase") {
    const isChecked = typeof propsChecked === "boolean" ? propsChecked : checked;

    return (
      <div
        id="pricing-terms-checkbox"
        className={cn(
          "relative rounded-2xl border transition-all duration-300 p-4 sm:p-5 text-left text-xs backdrop-blur-md shadow-sm",
          isChecked
            ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.08)]"
            : "border-border/90 bg-card/90 hover:border-primary/40",
          className,
        )}
      >
        {/* Compliance Header Badge */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2.5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-6 w-6 rounded-lg flex items-center justify-center transition-colors",
                isChecked
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-primary/10 text-primary",
              )}
            >
              <Shield className="h-3.5 w-3.5" />
            </div>
            <span className="font-semibold text-[11px] text-foreground tracking-tight">
              Consumer Protection &amp; Terms Agreement
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Check className="h-2.5 w-2.5" /> 14-Day Refund Guarantee
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Instant Digital Access
            </span>
          </div>
        </div>

        {requireExplicitAcceptance ? (
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            {/* Custom Styled Checkbox */}
            <div className="relative flex items-center justify-center shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  const val = e.target.checked;
                  setChecked(val);
                  if (onAccepted) onAccepted(val as any);
                }}
                className="sr-only peer"
              />
              <div
                className={cn(
                  "h-5 w-5 rounded-md border transition-all duration-200 flex items-center justify-center shadow-xs",
                  isChecked
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-emerald-500/20 scale-105"
                    : "border-muted-foreground/40 bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-primary group-hover:border-primary group-hover:scale-105",
                )}
              >
                {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <p className="font-semibold text-foreground text-xs leading-snug">
                I agree to the{" "}
                <Link
                  to={"/legal" as any}
                  search={{ doc: "terms" } as any}
                  target="_blank"
                  className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms &amp; Conditions <ExternalLink className="h-2.5 w-2.5" />
                </Link>{" "}
                and acknowledge the{" "}
                <Link
                  to={"/legal" as any}
                  search={{ doc: "cancellation-refund" } as any}
                  target="_blank"
                  className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  Cancellation &amp; Refund Policy <ExternalLink className="h-2.5 w-2.5" />
                </Link>{" "}
                and{" "}
                <Link
                  to={"/legal" as any}
                  search={{ doc: "digital-delivery" } as any}
                  target="_blank"
                  className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  Digital Delivery Policy <ExternalLink className="h-2.5 w-2.5" />
                </Link>
                .
              </p>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Includes GST invoice, immediate digital activation, and self-serve cancellation at any time before next cycle.
              </p>
            </div>
          </label>
        ) : (
          <p className="leading-relaxed text-muted-foreground">
            By proceeding, you agree to Learnify AI&apos;s{" "}
            <Link to={"/legal" as any} search={{ doc: "terms" } as any} target="_blank" className="text-primary underline hover:opacity-80">
              Terms
            </Link>
            ,{" "}
            <Link to={"/legal" as any} search={{ doc: "privacy" } as any} target="_blank" className="text-primary underline hover:opacity-80">
              Privacy Policy
            </Link>
            , and acknowledge the{" "}
            <Link to={"/legal" as any} search={{ doc: "cancellation-refund" } as any} target="_blank" className="text-primary underline hover:opacity-80">
              Refund &amp; Cancellation Policy
            </Link>{" "}
            and{" "}
            <Link to={"/legal" as any} search={{ doc: "digital-delivery" } as any} target="_blank" className="text-primary underline hover:opacity-80">
              Digital Delivery Policy
            </Link>.
          </p>
        )}
      </div>
    );
  }

  // If already acknowledged and not checkout, render minimal persistent link if inline
  if (acknowledged && variant !== "inline") {
    return null;
  }

  // 2. COMMUNITY CONTEXT (Requirement 45: Show once on entry)
  if (context === "community") {
    return (
      <div className={`rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm ${className}`}>
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <h4 className="font-semibold text-foreground">Welcome to Learnify AI Community</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We cultivate a respectful, professional learning environment. Please review our{" "}
              <Link to={"/legal" as any} search={{ doc: "community-guidelines" } as any} target="_blank" className="text-primary underline font-medium">
                Community Guidelines
              </Link>{" "}
              and{" "}
              <Link to={"/legal" as any} search={{ doc: "acceptable-use" } as any} target="_blank" className="text-primary underline font-medium">
                Acceptable Use Policy
              </Link>.
            </p>
          </div>
          {!acknowledged && (
            <Button size="sm" variant="outline" className="h-8 text-xs shrink-0" onClick={handleAcknowledge}>
              <Check className="h-3.5 w-3.5 mr-1" /> Got it
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 3. AI FEATURES CONTEXT (Requirement 46: Concise disclaimer on first meaningful use)
  if (context === "ai") {
    return (
      <div className={`rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs ${className}`}>
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <p className="text-muted-foreground leading-relaxed">
              AI outputs are probabilistic assistance and should be verified before critical reliance. Review our{" "}
              <Link to={"/legal" as any} search={{ doc: "ai-disclaimer" } as any} target="_blank" className="text-primary underline font-medium">
                AI Use & Disclaimer
              </Link>.
            </p>
          </div>
          {!acknowledged && (
            <Button size="sm" variant="ghost" className="h-7 text-[11px] px-2" onClick={handleAcknowledge}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 4. CREATOR UPLOAD / IP CONTEXT (Requirement 47)
  if (context === "creator_upload") {
    return (
      <div className={`rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground ${className}`}>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="flex-1">
            By uploading files, you confirm you possess the intellectual property rights or licensing permissions under our{" "}
            <Link to={"/legal" as any} search={{ doc: "intellectual-property" } as any} target="_blank" className="text-primary underline">
              IP & Copyright Policy
            </Link>.
          </p>
        </div>
      </div>
    );
  }

  // 5. STUDENT / PARENT ONBOARDING (Requirement 50)
  if (context === "student_onboarding" || context === "parental_consent") {
    return (
      <div className={`rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-xs ${className}`}>
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <h4 className="font-semibold text-foreground">Student & Guardian Privacy Notice</h4>
            <p className="text-muted-foreground leading-relaxed">
              Learnify AI provides age-appropriate learning experiences for students. Review our{" "}
              <Link to={"/legal" as any} search={{ doc: "student-parent-notice" } as any} target="_blank" className="text-primary underline font-medium">
                Student & Parent Notice
              </Link>{" "}
              regarding consent, educational data handling, and student privacy rights.
            </p>
          </div>
          {!acknowledged && (
            <Button size="sm" variant="outline" className="h-8 text-xs shrink-0" onClick={handleAcknowledge}>
              Acknowledge
            </Button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
