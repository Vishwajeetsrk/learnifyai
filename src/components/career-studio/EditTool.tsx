"use client";

import * as React from "react";
import { Check, X, Sparkles, ArrowRight, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SHIMMER_STYLE_ID = "learnify-edit-tool-shimmer-styles";
const SHIMMER_STYLES = `
@keyframes an-edit-shimmer {
  from { background-position: 100% center; }
  to { background-position: 0% center; }
}
.an-edit-shimmer {
  display: inline-flex;
  align-items: center;
  height: 1rem;
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #818cf8 0%, #c084fc 40%, #6366f1 50%, #818cf8 60%, #a855f7 100%);
  background-repeat: no-repeat;
  animation: an-edit-shimmer 1.4s linear infinite;
}
@keyframes an-edit-dot {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
.an-edit-dot { animation: an-edit-dot 1.4s ease-in-out infinite; }
.an-edit-dot:nth-child(2) { animation-delay: 0.2s; }
.an-edit-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes an-edit-pulse-border {
  0%, 100% { border-color: rgba(99, 102, 241, 0.2); }
  50% { border-color: rgba(99, 102, 241, 0.5); }
}
.an-edit-pulse-border { animation: an-edit-pulse-border 2s ease-in-out infinite; }
@keyframes an-edit-skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.an-edit-skeleton-line {
  height: 0.65rem;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(99,102,241,0.06) 25%, rgba(99,102,241,0.15) 37%, rgba(99,102,241,0.06) 63%);
  background-size: 400% 100%;
  animation: an-edit-skeleton 1.8s ease infinite;
}
`;

let shimmerStylesInjected = false;
function ensureShimmerStyles() {
  if (typeof document === "undefined") return;
  if (shimmerStylesInjected) return;
  if (document.getElementById(SHIMMER_STYLE_ID)) {
    shimmerStylesInjected = true;
    return;
  }
  const el = document.createElement("style");
  el.id = SHIMMER_STYLE_ID;
  el.textContent = SHIMMER_STYLES;
  document.head.appendChild(el);
  shimmerStylesInjected = true;
}

export type DiffOp = { type: "context" | "remove" | "add"; text: string };

export function lineDiff(oldText: string, newText: string): DiffOp[] {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const m = a.length;
  const n = b.length;

  // For very large files, limit diff computation to prevent blocking
  if (m > 800 || n > 800) {
    const ops: DiffOp[] = [];
    const minLen = Math.min(m, n);
    for (let i = 0; i < minLen; i++) {
      if (a[i] === b[i]) {
        ops.push({ type: "context", text: a[i] });
      } else {
        ops.push({ type: "remove", text: a[i] });
        ops.push({ type: "add", text: b[i] });
      }
    }
    for (let i = minLen; i < m; i++) ops.push({ type: "remove", text: a[i] });
    for (let j = minLen; j < n; j++) ops.push({ type: "add", text: b[j] });
    return ops;
  }

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (a[i] === b[j]) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      ops.push({ type: "context", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "remove", text: a[i] });
      i++;
    } else {
      ops.push({ type: "add", text: b[j] });
      j++;
    }
  }
  while (i < m) {
    ops.push({ type: "remove", text: a[i] });
    i++;
  }
  while (j < n) {
    ops.push({ type: "add", text: b[j] });
    j++;
  }
  return ops;
}

export function countDiffStats(ops: DiffOp[]): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const op of ops) {
    if (op.type === "add") added++;
    else if (op.type === "remove") removed++;
  }
  return { added, removed };
}

/**
 * The decision type that reflects the lifecycle of a code diff:
 * - null: Awaiting user action (buttons visible)
 * - "approved": User approved, code is being applied or was applied
 * - "rejected": User rejected, diff is discarded
 */
export type ApprovalDecision = "approved" | "rejected" | null;

/**
 * ApprovalFooter — now uses CONTROLLED decision prop from parent.
 * This prevents the "Canceled" bug where internal state would desync
 * from the parent's pendingDiff lifecycle.
 */
export function ApprovalFooter({
  isPending,
  decision,
  approveLabel = "Apply Diff",
  rejectLabel = "Discard",
  onApprove,
  onReject,
}: {
  isPending: boolean;
  decision: ApprovalDecision;
  approveLabel?: string;
  rejectLabel?: string;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const handleApprove = () => {
    onApprove?.();
  };
  const handleReject = () => {
    onReject?.();
  };

  let status: string | null = null;
  if (decision === "approved") status = isPending ? "Applying code change" : "Applied to file";
  else if (decision === "rejected") status = "Changes discarded";
  else if (isPending) status = "Synthesizing AI diff";

  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 border-t border-border/80 bg-muted/40 dark:bg-slate-950/60">
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
        {status && decision !== null ? (
          <span className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1.5">
            {decision === "approved" && (
              <Check className="h-3 w-3 text-emerald-500" />
            )}
            {decision === "rejected" && (
              <X className="h-3 w-3 text-rose-400" />
            )}
            {status}
            {decision === "approved" && isPending && (
              <span className="inline-flex gap-0.5 text-primary">
                <span className="an-edit-dot">.</span>
                <span className="an-edit-dot">.</span>
                <span className="an-edit-dot">.</span>
              </span>
            )}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {isPending ? "AI is generating code..." : "Review the proposed code diff before applying"}
          </span>
        )}
      </div>

      {decision === null && !isPending && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReject}
            className="px-2.5 h-7 rounded-lg text-xs font-semibold border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all cursor-pointer flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            {rejectLabel}
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="px-3 h-7 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-500 hover:to-primary text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <Check className="h-3.5 w-3.5" />
            {approveLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export type EditToolApproval = {
  approveLabel?: string;
  rejectLabel?: string;
  decision?: ApprovalDecision;
  onApprove?: () => void;
  onReject?: () => void;
};

export type EditToolProps = {
  /** "completed" → full diff; "pending" → shimmer "Editing X" + skeleton diff; "waiting" → "Generating..." shimmer */
  state?: "completed" | "pending" | "waiting";
  /** "edit" (default) → "Edited"/"Editing"; "write" → "Created"/"Creating" */
  variant?: "edit" | "write";
  /** Path shown in the header */
  filePath?: string;
  /** Old file contents */
  oldContent?: string;
  /** New file contents */
  newContent?: string;
  /** Summary or reason for this edit */
  summary?: string;
  /** Approval footer callbacks */
  approval?: EditToolApproval;
  className?: string;
  maxDiffHeight?: string;
};

export const EditTool = React.memo(function EditTool({
  state = "completed",
  variant = "edit",
  filePath,
  oldContent,
  newContent,
  summary,
  approval,
  className,
  maxDiffHeight = "260px",
}: EditToolProps) {
  React.useEffect(() => {
    ensureShimmerStyles();
  }, []);

  const isPending = state === "pending";
  const isWaiting = state === "waiting";
  const isWrite = variant === "write";
  const fileName = filePath?.split("/").pop() ?? undefined;

  const diffOps = React.useMemo<DiffOp[] | null>(() => {
    if (isWaiting) return null;
    if (isWrite && newContent) {
      return newContent.split("\n").map((text) => ({ type: "add" as const, text }));
    }
    if (oldContent !== undefined && newContent !== undefined) {
      return lineDiff(oldContent, newContent);
    }
    return null;
  }, [isWaiting, isWrite, oldContent, newContent]);

  const stats = React.useMemo(
    () => (diffOps ? countDiffStats(diffOps) : null),
    [diffOps],
  );

  const headerLabel = isWaiting
    ? "AI Generating Code Solution..."
    : isPending
      ? `${isWrite ? "Creating" : "Editing"}${fileName ? ` ${fileName}` : ""}`
      : `${isWrite ? "Created" : "Proposed Changes for"}${fileName ? ` ${fileName}` : ""}`;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/80 bg-card text-card-foreground shadow-sm overflow-hidden w-full transition-all",
        (isPending || isWaiting) && "an-edit-pulse-border",
        className,
      )}
    >
      {/* Header bar */}
      <div
        className={cn(
          "flex items-center justify-between px-3 h-8 bg-muted/60 dark:bg-slate-900/80 border-b border-border/60",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          {isPending || isWaiting ? (
            <Loader2 className="h-3 w-3 text-indigo-500 animate-spin shrink-0" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
          )}
          {isPending || isWaiting ? (
            <span className="an-edit-shimmer text-xs font-semibold">{headerLabel}</span>
          ) : (
            <span className="text-xs font-mono font-medium text-foreground truncate">
              {headerLabel}
            </span>
          )}
        </div>

        {stats && !isPending && !isWaiting && (stats.added > 0 || stats.removed > 0) && (
          <div className="text-[11px] font-mono text-muted-foreground inline-flex items-center gap-2 shrink-0">
            {stats.added > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                +{stats.added}
              </span>
            )}
            {stats.removed > 0 && (
              <span className="px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold">
                -{stats.removed}
              </span>
            )}
          </div>
        )}
      </div>

      {summary && (
        <div className="px-3.5 py-1.5 text-xs bg-indigo-500/5 text-indigo-700 dark:text-indigo-300 border-b border-indigo-500/15 flex items-center gap-1.5">
          <ArrowRight className="h-3 w-3 text-indigo-500 shrink-0" />
          <span className="line-clamp-1">{summary}</span>
        </div>
      )}

      {/* Shimmer skeleton for waiting/pending state */}
      {(isWaiting || (isPending && !diffOps)) && (
        <div className="px-4 py-4 space-y-2.5" style={{ maxHeight: maxDiffHeight }}>
          <div className="an-edit-skeleton-line" style={{ width: "85%" }} />
          <div className="an-edit-skeleton-line" style={{ width: "72%" }} />
          <div className="an-edit-skeleton-line" style={{ width: "90%" }} />
          <div className="an-edit-skeleton-line" style={{ width: "65%" }} />
          <div className="an-edit-skeleton-line" style={{ width: "78%" }} />
          <div className="an-edit-skeleton-line" style={{ width: "50%" }} />
        </div>
      )}

      {/* Diff content scroll viewport */}
      {diffOps && diffOps.length > 0 && (
        <div
          className="text-[11px] font-mono leading-[1.6] bg-background dark:bg-slate-950 overflow-x-auto overflow-y-auto"
          style={{ maxHeight: maxDiffHeight }}
        >
          {diffOps.map((op, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start min-w-0 px-2 py-0.5 transition-colors",
                op.type === "add" &&
                  "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-l-2 border-emerald-500",
                op.type === "remove" &&
                  "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-l-2 border-rose-500",
                op.type === "context" &&
                  "text-muted-foreground/80 hover:bg-muted/30 border-l-2 border-transparent",
              )}
            >
              <span
                className={cn(
                  "select-none w-5 text-center shrink-0 font-bold",
                  op.type === "add" && "text-emerald-600 dark:text-emerald-400",
                  op.type === "remove" && "text-rose-600 dark:text-rose-400",
                  op.type === "context" && "text-muted-foreground/40",
                )}
              >
                {op.type === "add" ? "+" : op.type === "remove" ? "-" : " "}
              </span>
              <span className="whitespace-pre pr-2 flex-1 min-w-0">
                {op.text || " "}
              </span>
            </div>
          ))}
        </div>
      )}

      {approval && (
        <ApprovalFooter
          isPending={isPending}
          decision={approval.decision ?? null}
          approveLabel={approval.approveLabel}
          rejectLabel={approval.rejectLabel}
          onApprove={approval.onApprove}
          onReject={approval.onReject}
        />
      )}
    </div>
  );
});
