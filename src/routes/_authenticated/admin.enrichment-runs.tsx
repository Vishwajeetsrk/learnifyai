import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Download,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  Filter,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnrichmentProgressDialog } from "@/components/EnrichmentProgressDialog";
import { listAllEnrichmentRuns } from "@/lib/youtube.functions";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/admin/enrichment-runs")({
  head: () => ({ meta: [{ title: "Enrichment Runs — Admin" }] }),
  component: EnrichmentRunsPage,
});

type Run = {
  id: string;
  course_id: string;
  course_title: string | null;
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
  with_transcript?: boolean;
};

const KEY_STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  ok: { label: "OK", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  invalid: { label: "Invalid", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  quota: { label: "Quota", cls: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  missing: { label: "Missing", cls: "bg-muted text-muted-foreground" },
  unknown: { label: "Unknown", cls: "bg-muted text-muted-foreground" },
};

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toCsv(runs: Run[]): string {
  const headers = [
    "id",
    "course_id",
    "course_title",
    "status",
    "youtube_key_status",
    "total",
    "updated_videos",
    "updated_transcripts",
    "warnings_count",
    "failures_count",
    "warnings",
    "failures",
    "started_at",
    "finished_at",
  ];
  const esc = (v: any) => {
    const s = v == null ? "" : typeof v === "string" ? v : JSON.stringify(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const rows = runs.map((r) =>
    [
      r.id,
      r.course_id,
      r.course_title ?? "",
      r.status,
      r.youtube_key_status,
      r.total,
      r.updated_videos,
      r.updated_transcripts,
      r.warnings?.length ?? 0,
      r.failures?.length ?? 0,
      (r.warnings ?? []).join(" | "),
      (r.failures ?? []).map((f) => `${f.lessonId}:${f.reason}`).join(" | "),
      r.started_at,
      r.finished_at ?? "",
    ]
      .map(esc)
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

function EnrichmentRunsPage() {
  const { isAdmin, loading } = useAuth();
  const [keyStatus, setKeyStatus] = useState<string>("all");
  const [onlyFailures, setOnlyFailures] = useState(false);
  const [onlyWarnings, setOnlyWarnings] = useState(false);
  const [openRunId, setOpenRunId] = useState<string | null>(null);

  const listFn = useServerFn(listAllEnrichmentRuns);
  const q = useQuery({
    enabled: !loading && isAdmin,
    queryKey: ["admin-enrichment-runs", keyStatus, onlyFailures, onlyWarnings],
    queryFn: () =>
      listFn({ data: { keyStatus, onlyFailures, onlyWarnings, limit: 200 } }) as Promise<{
        runs: Run[];
      }>,
    refetchInterval: 10_000,
  });

  const runs = q.data?.runs ?? [];

  const stats = useMemo(() => {
    const failed = runs.filter((r) => r.failures?.length).length;
    const warned = runs.filter((r) => r.warnings?.length).length;
    const running = runs.filter((r) => r.status === "running").length;
    return { failed, warned, running, total: runs.length };
  }, [runs]);

  if (!loading && !isAdmin) {
    return (
      <AppShell>
        <div className="px-6 py-16 max-w-xl mx-auto text-center">
          <ShieldAlert className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-3 font-medium">Admins only.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold">
              YouTube Enrichment Runs
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Recent enrichment activity across all courses — audit, filter, and export.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => q.refetch()}>
              <RefreshCw className={`h-4 w-4 ${q.isFetching ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    downloadFile(
                      `enrichment-runs-${Date.now()}.json`,
                      JSON.stringify(runs, null, 2),
                      "application/json",
                    )
                  }
                >
                  Download JSON
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    downloadFile(`enrichment-runs-${Date.now()}.csv`, toCsv(runs), "text/csv")
                  }
                >
                  Download CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat label="Total runs" value={stats.total} />
          <Stat label="Running" value={stats.running} tone="info" />
          <Stat label="With warnings" value={stats.warned} tone="warn" />
          <Stat label="With failures" value={stats.failed} tone="danger" />
        </div>

        <div className="rounded-2xl border bg-card p-4 mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label className="text-xs text-muted-foreground">Filters</Label>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Key status</Label>
            <Select value={keyStatus} onValueChange={setKeyStatus}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ok">OK</SelectItem>
                <SelectItem value="invalid">Invalid</SelectItem>
                <SelectItem value="quota">Quota</SelectItem>
                <SelectItem value="missing">Missing</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <Checkbox checked={onlyFailures} onCheckedChange={(v) => setOnlyFailures(!!v)} /> Only
            failures
          </label>
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <Checkbox checked={onlyWarnings} onCheckedChange={(v) => setOnlyWarnings(!!v)} /> Only
            warnings
          </label>
        </div>

        <div className="rounded-2xl border bg-card overflow-hidden">
          {q.isLoading ? (
            <div className="p-12 grid place-items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : runs.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No enrichment runs match these filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Started</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead className="text-right">Lessons</TableHead>
                  <TableHead className="text-right">Videos</TableHead>
                  <TableHead className="text-right">Summaries</TableHead>
                  <TableHead className="text-right">Warn/Fail</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((r) => {
                  const ks = KEY_STATUS_LABEL[r.youtube_key_status] ?? KEY_STATUS_LABEL.unknown;
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {format(new Date(r.started_at), "dd MMM, HH:mm")}
                      </TableCell>
                      <TableCell className="max-w-[240px] truncate text-sm">
                        {r.course_title ?? (
                          <span className="text-muted-foreground font-mono text-xs">
                            {r.course_id.slice(0, 8)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            r.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : r.status === "failed"
                                ? "bg-destructive/10 text-destructive border-destructive/30"
                                : r.status === "cancelled"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-blue-500/10 text-blue-600 border-blue-500/30"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={ks.cls}>
                          {ks.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs">{r.total}</TableCell>
                      <TableCell className="text-right text-xs">{r.updated_videos}</TableCell>
                      <TableCell className="text-right text-xs">{r.updated_transcripts}</TableCell>
                      <TableCell className="text-right text-xs">
                        {(r.warnings?.length ?? 0) > 0 && (
                          <span className="inline-flex items-center gap-1 text-amber-600 mr-2">
                            <AlertTriangle className="h-3 w-3" />
                            {r.warnings.length}
                          </span>
                        )}
                        {(r.failures?.length ?? 0) > 0 && (
                          <span className="text-destructive">{r.failures.length} fail</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => setOpenRunId(r.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <EnrichmentProgressDialog
        runId={openRunId}
        open={!!openRunId}
        onOpenChange={(v) => !v && setOpenRunId(null)}
      />
    </AppShell>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "info" | "warn" | "danger";
}) {
  const cls =
    tone === "danger"
      ? "border-destructive/30 bg-destructive/5"
      : tone === "warn"
        ? "border-amber-500/30 bg-amber-500/5"
        : tone === "info"
          ? "border-blue-500/30 bg-blue-500/5"
          : "border-border bg-card";
  return (
    <div className={`rounded-2xl border p-4 ${cls}`}>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
