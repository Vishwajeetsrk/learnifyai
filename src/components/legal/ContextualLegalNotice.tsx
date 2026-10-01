import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Shield, ExternalLink, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onAccepted?: () => void;
  className?: string;
}

const POLICY_VERSION = "3.0";

export function ContextualLegalNotice({
  context,
  variant = "compact",
  requireExplicitAcceptance = false,
  onAccepted,
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

  // 1. CHECKOUT CONTEXT (Requirement 44: Minimal, non-intrusive compact links)
  if (context === "checkout" || context === "digital_purchase") {
    return (
      <div className={`text-xs text-muted-foreground space-y-2 ${className}`}>
        {requireExplicitAcceptance && (
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                if (e.target.checked && onAccepted) onAccepted();
              }}
              className="mt-0.5 rounded border-muted-foreground/30 text-primary focus:ring-primary h-4 w-4"
            />
            <span className="leading-tight text-foreground/80">
              I agree to the{" "}
              <Link to={"/legal" as any} search={{ doc: "terms" } as any} target="_blank" className="text-primary hover:underline font-medium inline-flex items-center gap-0.5">
                Terms & Conditions <ExternalLink className="h-2.5 w-2.5" />
              </Link>{" "}
              and acknowledge the{" "}
              <Link to={"/legal" as any} search={{ doc: "cancellation-refund" } as any} target="_blank" className="text-primary hover:underline font-medium inline-flex items-center gap-0.5">
                Cancellation & Refund Policy <ExternalLink className="h-2.5 w-2.5" />
              </Link>{" "}
              and{" "}
              <Link to={"/legal" as any} search={{ doc: "digital-delivery" } as any} target="_blank" className="text-primary hover:underline font-medium inline-flex items-center gap-0.5">
                Digital Delivery Policy <ExternalLink className="h-2.5 w-2.5" />
              </Link>.
            </span>
          </label>
        )}
        {!requireExplicitAcceptance && (
          <p className="leading-relaxed">
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
              Refund & Cancellation Policy
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
