import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  GitCompare,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

export interface FieldDiff {
  fieldName: string;
  label: string;
  currentValue: any;
  draftValue: any;
  hasChanged: boolean;
}

interface DraftDiffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName?: string;
  currentData: Record<string, any>;
  draftData: Record<string, any>;
  draftUpdatedAt?: number | string | null;
  onRestoreAll: () => void;
  onDiscardDraft: () => void;
  onRestoreFields?: (selectedFields: string[]) => void;
}

function formatValue(val: any): string {
  if (val === null || val === undefined) return "— (empty)";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "object") {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

export function DraftDiffDialog({
  open,
  onOpenChange,
  moduleName = "Content",
  currentData = {},
  draftData = {},
  draftUpdatedAt,
  onRestoreAll,
  onDiscardDraft,
}: DraftDiffDialogProps) {
  const [activeTab, setActiveTab] = useState<"changes-only" | "all-fields">("changes-only");

  // Collect all keys
  const allKeys = Array.from(
    new Set([...Object.keys(currentData || {}), ...Object.keys(draftData || {})]),
  );

  const diffs: FieldDiff[] = allKeys.map((key) => {
    const cur = currentData[key];
    const draft = draftData[key];
    const curStr = typeof cur === "object" ? JSON.stringify(cur) : String(cur ?? "");
    const draftStr = typeof draft === "object" ? JSON.stringify(draft) : String(draft ?? "");
    const hasChanged = curStr !== draftStr;

    return {
      fieldName: key,
      label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      currentValue: cur,
      draftValue: draft,
      hasChanged,
    };
  });

  const changedDiffs = diffs.filter((d) => d.hasChanged);
  const displayDiffs = activeTab === "changes-only" ? changedDiffs : diffs;

  const dateStr = draftUpdatedAt
    ? new Date(draftUpdatedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Unknown date";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[88vh] flex flex-col p-6 rounded-2xl bg-card border shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <GitCompare className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl font-bold font-display">
              Revision History &amp; Draft Comparison
            </DialogTitle>
            <Badge variant="outline" className="ml-auto bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
              {changedDiffs.length} {changedDiffs.length === 1 ? "Change" : "Changes"} Detected
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
            <Clock className="h-3.5 w-3.5" />
            Comparing active server content with autosaved draft from{" "}
            <span className="font-semibold text-foreground">{dateStr}</span> ({moduleName})
          </DialogDescription>
        </DialogHeader>

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b pb-3 pt-1">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="w-auto"
          >
            <TabsList className="h-8">
              <TabsTrigger value="changes-only" className="text-xs">
                Modified ({changedDiffs.length})
              </TabsTrigger>
              <TabsTrigger value="all-fields" className="text-xs">
                All Fields ({diffs.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <span className="text-[11px] text-muted-foreground">
            Red = Current / Live • Green = Autosaved Draft
          </span>
        </div>

        {/* Diff Content Viewport */}
        <div className="flex-1 overflow-y-auto space-y-4 py-2 pr-1">
          {displayDiffs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-foreground">Draft is identical to current data</p>
              <p className="text-xs">No conflicting modifications found between versions.</p>
            </div>
          ) : (
            displayDiffs.map((diff) => {
              const curFormatted = formatValue(diff.currentValue);
              const draftFormatted = formatValue(diff.draftValue);
              const isLongText = curFormatted.length > 80 || draftFormatted.length > 80;

              return (
                <div
                  key={diff.fieldName}
                  className={`rounded-xl border p-4 transition-all ${
                    diff.hasChanged
                      ? "border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10"
                      : "border-border/60 bg-muted/20 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-foreground">
                        {diff.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        ({diff.fieldName})
                      </span>
                    </div>
                    {diff.hasChanged ? (
                      <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-500 border-amber-500/20">
                        Modified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-muted-foreground border-border/40">
                        Unchanged
                      </Badge>
                    )}
                  </div>

                  {/* Side-by-side or Stacked Diff */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                    {/* Current / Live */}
                    <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-2.5">
                      <div className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span>Current / Live Version</span>
                      </div>
                      <div className={`overflow-x-auto text-foreground/90 whitespace-pre-wrap ${isLongText ? "max-h-40 overflow-y-auto" : ""}`}>
                        {curFormatted}
                      </div>
                    </div>

                    {/* Draft Version */}
                    <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2.5">
                      <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span>Autosaved Draft</span>
                      </div>
                      <div className={`overflow-x-auto text-foreground/90 whitespace-pre-wrap font-semibold ${isLongText ? "max-h-40 overflow-y-auto" : ""}`}>
                        {draftFormatted}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel &amp; Close
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onDiscardDraft();
                onOpenChange(false);
              }}
              className="text-xs gap-1.5 text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Discard Draft
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => {
                onRestoreAll();
                onOpenChange(false);
              }}
              className="text-xs gap-1.5 font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restore Autosaved Draft
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
