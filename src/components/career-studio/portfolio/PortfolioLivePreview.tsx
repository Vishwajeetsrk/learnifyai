import React, { useState, useId } from "react";
import {
  Laptop,
  Tablet,
  Smartphone,
  RotateCcw,
  ExternalLink,
  Lock,
  AlertCircle,
  Play,
  FileCode,
  Check,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearnifyMascot } from "@/components/brand/LearnifyMascot";
import { cn } from "@/lib/utils";

export type PreviewDevice = "desktop" | "tablet" | "mobile";
export type PreviewBuildStatus = "empty" | "building" | "ready" | "outdated" | "failed" | "idle";

export interface PortfolioLivePreviewProps {
  compiledSrcDoc: string;
  portfolioData?: {
    fullName?: string;
    tagline?: string;
    bio?: string;
    skills?: string;
    location?: string;
    socialLinks?: string;
  };
  buildStatus?: PreviewBuildStatus;
  buildError?: { message: string; file?: string; line?: number } | null;
  isOutdated?: boolean;
  onRunRebuild?: () => void;
  onOpenPublished?: () => void;
  onSelectFile?: (file: string) => void;
  className?: string;
  mode?: "builder" | "standalone" | "split";
  initialDevice?: PreviewDevice;
}

/**
 * Learnify AI - Canonical Portfolio Live Preview System
 * Unifies the live portfolio rendering engine across Builder, Code Studio, and Standalone views.
 * Supports Desktop (1440px), Tablet (768px), and Mobile (390px) frames with sandboxed execution.
 */
export function PortfolioLivePreview({
  compiledSrcDoc,
  portfolioData,
  buildStatus = "ready",
  buildError = null,
  isOutdated = false,
  onRunRebuild,
  onSelectFile,
  className = "",
  mode = "builder",
  initialDevice = "desktop",
}: PortfolioLivePreviewProps) {
  const [device, setDevice] = useState<PreviewDevice>(initialDevice);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const cleanSlug = portfolioData?.fullName
    ? portfolioData.fullName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : "preview";

  const handleRefresh = () => {
    setRefreshCounter((k) => k + 1);
  };

  const handleOpenNewWindow = () => {
    if (!compiledSrcDoc) return;
    const blob = new Blob([compiledSrcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className={cn("flex flex-col bg-slate-900/60 min-w-0 flex-1 h-full select-none", className)}>
      {/* ================= CANONICAL TOOLBAR ================= */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-border/70 gap-2 shrink-0 flex-wrap">
        {/* Status indicator & Truthful Address */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={cn(
                "w-2 h-2 rounded-full shrink-0",
                buildStatus === "ready" && !isOutdated && "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
                (buildStatus === "building" || isOutdated) && "bg-amber-400 animate-pulse",
                buildStatus === "failed" && "bg-rose-500",
                buildStatus === "empty" && "bg-slate-500",
              )}
            />
            <span className="text-[11px] font-mono font-medium text-slate-300">
              {buildStatus === "building" && "Building..."}
              {buildStatus === "ready" && !isOutdated && "Preview ready"}
              {isOutdated && "Preview outdated"}
              {buildStatus === "failed" && "Build failed"}
              {buildStatus === "empty" && "No preview yet"}
            </span>
          </div>

          {/* Truthful domain address bar */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-border/60 text-[11px] font-mono text-slate-300 truncate max-w-[260px]">
            <Lock className="h-2.5 w-2.5 text-emerald-400 shrink-0" />
            <span className="truncate">learnifyai.in/p/{cleanSlug}</span>
          </div>

          {/* Outdated Notice Action */}
          {isOutdated && onRunRebuild && (
            <button
              type="button"
              onClick={onRunRebuild}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition flex items-center gap-1 cursor-pointer"
            >
              <Play className="h-2.5 w-2.5 fill-current" />
              Update Preview
            </button>
          )}
        </div>

        {/* Device Switcher (Desktop, Tablet, Mobile) */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-border/60 shrink-0">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={cn(
              "p-1.5 rounded text-xs transition cursor-pointer",
              device === "desktop"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Desktop View (100% / 1440px)"
            aria-label="Desktop preview"
          >
            <Laptop className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={cn(
              "p-1.5 rounded text-xs transition cursor-pointer",
              device === "tablet"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Tablet View (768px)"
            aria-label="Tablet preview"
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={cn(
              "p-1.5 rounded text-xs transition cursor-pointer",
              device === "mobile"
                ? "bg-primary text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
            title="Mobile View (390px)"
            aria-label="Mobile preview"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-slate-800 transition cursor-pointer"
            title="Refresh Preview Viewport"
            aria-label="Refresh preview"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleOpenNewWindow}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-slate-800 transition cursor-pointer"
            title="Open Live Preview in New Window"
            aria-label="Open in new window"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ================= VIEWPORT AREA ================= */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-[480px]">
        {/* State: FAILED */}
        {buildStatus === "failed" && buildError ? (
          <div className="w-full max-w-xl p-6 rounded-2xl bg-slate-900 border border-rose-500/40 text-slate-100 shadow-2xl flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-400">Build Validation Error</h3>
                <p className="text-xs text-slate-400 mt-1">
                  A syntax or structural issue was detected in your codebase. Fix the issue below and rebuild.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/20 font-mono text-xs text-rose-300 whitespace-pre-wrap leading-relaxed">
              <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                <span>{buildError.file || "Codebase"}</span>
              </div>
              {buildError.message}
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {buildError.file && onSelectFile && (
                <Button
                  size="sm"
                  onClick={() => onSelectFile(buildError.file!)}
                  className="h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                >
                  <FileCode className="h-3.5 w-3.5 mr-1.5" /> Jump to {buildError.file}
                </Button>
              )}
              {onRunRebuild && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRunRebuild}
                  className="h-8 text-xs font-semibold bg-slate-800 border-border/70 hover:bg-slate-700 text-slate-200 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Retry Build
                </Button>
              )}
            </div>
          </div>
        ) : buildStatus === "empty" || !compiledSrcDoc ? (
          // State: EMPTY
          <div className="w-full max-w-md p-8 text-center flex flex-col items-center justify-center gap-4 bg-slate-900/60 rounded-2xl border border-border/50">
            <LearnifyMascot variant="thinking" size="lg" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-200">No Preview Generated Yet</h3>
              <p className="text-xs text-muted-foreground">
                Click &quot;Run&quot; or &quot;Generate Portfolio&quot; to compile your projects, skills, and code into a live preview.
              </p>
            </div>
            {onRunRebuild && (
              <Button
                size="sm"
                onClick={onRunRebuild}
                className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-9 px-4 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Compile Preview
              </Button>
            )}
          </div>
        ) : (
          // State: READY or OUTDATED (Active Frame)
          <div
            className={cn(
              "h-full w-full bg-background rounded-xl overflow-hidden shadow-2xl border border-border/80 transition-all duration-300 relative",
              device === "tablet" && "max-w-[768px] border-4 border-slate-700 max-h-[1024px]",
              device === "mobile" && "max-w-[390px] border-8 border-slate-800 rounded-3xl max-h-[844px]",
            )}
          >
            {/* Mobile Device Notch Simulation */}
            {device === "mobile" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-28 bg-slate-800 rounded-b-xl z-20 pointer-events-none flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
                <div className="w-8 h-1 rounded-full bg-slate-900" />
              </div>
            )}

            <iframe
              key={refreshCounter}
              srcDoc={compiledSrcDoc}
              title="Portfolio Live Preview"
              sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
              className="w-full h-full border-0 bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
