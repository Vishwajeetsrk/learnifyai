import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  SkipForward,
  FileText,
  Search,
  Sparkles,
  Ban,
  Database,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getEnrichmentRun, cancelEnrichmentRun } from "@/lib/youtube.functions";
import { supabase } from "@/integrations/supabase/client";

type ProgressRow = {
  id: string;
  lesson_id: string;
  lesson_title: string;
  state: string;
  from_cache?: boolean;
  message: string | null;
  order_index: number;
  updated_at: string;
};

type Run = {
  id: string;
  status: string;
  youtube_key_status: string;
  total: number;
  updated_videos: number;
  updated_transcripts: number;
  warnings: string[];
  failures: { lessonId: string; reason: string }[];
  started_at: string;
  finished_at: string | null;
  cancel_requested?: boolean;
};

const STATE_ICON: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  searching: <Search className="h-3.5 w-3.5 text-blue-500 animate-pulse" />,
  transcript: <FileText className="h-3.5 w-3.5 text-blue-500 animate-pulse" />,
  summarizing: <Sparkles className="h-3.5 w-3.5 text-violet-500 animate-pulse" />,
  done: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  skipped: <SkipForward className="h-3.5 w-3.5 text-amber-500" />,
  cancelled: <XCircle className="h-3.5 w-3.5 text-muted-foreground" />,
  failed: <XCircle className="h-3.5 w-3.5 text-destructive" />,
};

function formatEta(ms: number): string {
  if (!isFinite(ms) || ms <= 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

export function EnrichmentProgressDialog({
  runId,
  open,
  onOpenChange,
}: {
  runId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const getRun = useServerFn(getEnrichmentRun);
  const [run, setRun] = useState<Run | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const startTime = useRef<number>(Date.now());

  // Initial + polling fetch
  useEffect(() => {
    if (!runId || !open) return;
    startTime.current = Date.now();
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      try {
        const res: any = await getRun({ data: { runId } });
        if (!alive) return;
        setRun(res.run);
        setProgress(res.progress ?? []);
        if (res.run?.status === "running") {
          timer = setTimeout(tick, 3000);
        }
      } catch {
        if (alive) timer = setTimeout(tick, 4000);
      }
    };
    tick();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [runId, open, getRun]);

  // Realtime updates
  useEffect(() => {
    if (!runId || !open) return;
    const ch = supabase
      .channel(`enrichment-${runId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "enrichment_progress",
          filter: `run_id=eq.${runId}`,
        },
        (payload: any) => {
          setProgress((prev) => {
            const next = [...prev];
            const row = payload.new as ProgressRow;
            const i = next.findIndex((p) => p.lesson_id === row.lesson_id);
            if (i >= 0) next[i] = { ...next[i], ...row };
            else next.push(row);
            return next.sort((a, b) => a.order_index - b.order_index);
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [runId, open]);

  const done = useMemo(
    () =>
      progress.filter((p) => ["done", "skipped", "failed", "cancelled"].includes(p.state)).length,
    [progress],
  );
  const total = run?.total ?? progress.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const eta = useMemo(() => {
    if (!run || run.status !== "running" || done < 2) return null;
    const elapsed = Date.now() - new Date(run.started_at).getTime();
    const per = elapsed / done;
    return per * (total - done);
  }, [run, done, total]);

  const keyStatusBadge = (s: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      ok: { label: "Key OK", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
      invalid: {
        label: "Key invalid",
        cls: "bg-destructive/10 text-destructive border-destructive/30",
      },
      quota: { label: "Quota reached", cls: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
      missing: { label: "Key missing", cls: "bg-muted text-muted-foreground" },
      unknown: { label: "Key unknown", cls: "bg-muted text-muted-foreground" },
    };
    const m = map[s] ?? map.unknown;
    return (
      <Badge variant="outline" className={m.cls}>
        {m.label}
      </Badge>
    );
  };

  const cancelFn = useServerFn(cancelEnrichmentRun);
  const [cancelling, setCancelling] = useState(false);
  const handleCancel = async () => {
    if (!runId) return;
    setCancelling(true);
    try {
      await cancelFn({ data: { runId } });
      toast.success("Cancellation requested — wrapping up the current lesson…");
      setRun((r) => (r ? ({ ...r, cancel_requested: true } as Run) : r));
    } catch (e: any) {
      toast.error(e?.message ?? "Could not cancel");
    } finally {
      setCancelling(false);
    }
  };

  const cacheCount = progress.filter((p) => p.from_cache).length;
  const freshCount = progress.filter((p) => p.state === "done" && !p.from_cache).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {run?.status === "running" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            )}
            YouTube enrichment{" "}
            {run?.status === "running"
              ? run?.cancel_requested
                ? "cancelling…"
                : "in progress"
              : (run?.status ?? "starting")}
          </DialogTitle>
          <DialogDescription>
            {done} of {total} lessons processed{eta ? ` · ETA ${formatEta(eta)}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Progress value={pct} />
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {run && keyStatusBadge(run.youtube_key_status)}
            <Badge variant="outline">Videos: {run?.updated_videos ?? 0}</Badge>
            <Badge variant="outline">Summaries: {run?.updated_transcripts ?? 0}</Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
              <Database className="h-3 w-3 mr-1" /> Cached: {cacheCount}
            </Badge>
            <Badge
              variant="outline"
              className="bg-violet-500/10 text-violet-600 border-violet-500/30"
            >
              <Zap className="h-3 w-3 mr-1" /> Fresh: {freshCount}
            </Badge>
            {run?.failures?.length ? (
              <Badge
                variant="outline"
                className="bg-destructive/10 text-destructive border-destructive/30"
              >
                {run.failures.length} failed
              </Badge>
            ) : null}
            {run?.status === "running" && (
              <Button
                size="sm"
                variant="outline"
                className="ml-auto h-7 text-xs"
                onClick={handleCancel}
                disabled={cancelling || run.cancel_requested}
              >
                {cancelling || run.cancel_requested ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Ban className="h-3 w-3 mr-1" />
                )}
                {run.cancel_requested ? "Cancelling…" : "Cancel run"}
              </Button>
            )}
          </div>

          <ScrollArea className="h-72 rounded-md border">
            <ul className="divide-y">
              {progress.map((p) => (
                <li key={p.lesson_id} className="flex items-start gap-2 px-3 py-2 text-sm">
                  <span className="mt-0.5">{STATE_ICON[p.state] ?? STATE_ICON.pending}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{p.lesson_title}</div>
                    {p.message && (
                      <div className="text-xs text-muted-foreground truncate">{p.message}</div>
                    )}
                  </div>
                  {p.state === "done" &&
                    (p.from_cache ? (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-600 border-blue-500/30 text-[9px] h-5"
                      >
                        <Database className="h-2.5 w-2.5 mr-1" /> Cached
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-violet-500/10 text-violet-600 border-violet-500/30 text-[9px] h-5"
                      >
                        <Zap className="h-2.5 w-2.5 mr-1" /> Fresh
                      </Badge>
                    ))}
                  <span className="text-[10px] uppercase text-muted-foreground">{p.state}</span>
                </li>
              ))}
              {!progress.length && (
                <li className="px-3 py-6 text-sm text-muted-foreground text-center">
                  Preparing lessons…
                </li>
              )}
            </ul>
          </ScrollArea>

          {!!run?.warnings?.length && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-xs text-amber-700 dark:text-amber-400">
              {run.warnings.map((w, i) => (
                <div key={i}>⚠ {w}</div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
