import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription } from "./dialog-CV-3vits.mjs";
import { P as Progress } from "./progress-BdEZ1sO8.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { S as ScrollArea } from "./scroll-area-ejh7i3q4.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { s as supabase } from "./router-BGh9Ntsg.mjs";
import { L as LoaderCircle, b as CircleCheck, ay as Database, Z as Zap, az as Ban, aA as CircleX, aB as SkipForward, k as Sparkles, H as FileText, n as Search, r as Clock } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, b as booleanType, n as numberType } from "../_libs/zod.mjs";
const verifyYoutubeKey = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  url: stringType().min(1).max(500)
}).parse(d)).handler(createSsrRpc("32ec0226b9128c668db59a78babcb2a98cdb0b8255ee9827fa188387332d3644"));
const startCourseEnrichment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid(),
  withTranscript: booleanType().default(true)
}).parse(d)).handler(createSsrRpc("cfadcb0866ebd11d60c0cbe50fdbdd66a2c9c01a93f53dd16537edcbce7e43d5"));
const cancelEnrichmentRun = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  runId: stringType().uuid()
}).parse(d)).handler(createSsrRpc("fd120808553ec5488e5806f56b6cb30ddc43813e37d2d7cd37a430973322651d"));
const listAllEnrichmentRuns = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  keyStatus: stringType().optional(),
  onlyFailures: booleanType().optional(),
  onlyWarnings: booleanType().optional(),
  limit: numberType().min(1).max(500).default(100)
}).parse(d ?? {})).handler(createSsrRpc("4a4ba4e480cefba40d5cab46088e1cac2cf971cbf632e1bcd416c7e075b78ba4"));
const getEnrichmentRun = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  runId: stringType().uuid()
}).parse(d)).handler(createSsrRpc("f94c89c281f45fa617f0f11172b851f88434619b7f363ccd01a3e03cd9236f76"));
const listCourseEnrichmentRuns = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid()
}).parse(d)).handler(createSsrRpc("b522cde227308a9e042aa0dc147f5ef57ab07c8dd0d53ccbb56a686df9863038"));
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  courseId: stringType().uuid(),
  withTranscript: booleanType().default(true)
}).parse(d)).handler(createSsrRpc("7d6a1b7ca248c0cff671e1203e94e4fa6ad30148eb1e00a15952d0f47c461126"));
const STATE_ICON = {
  pending: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { className: "h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 58,
    columnNumber: 12
  }, void 0),
  searching: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "h-3.5 w-3.5 text-blue-500 animate-pulse" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 59,
    columnNumber: 14
  }, void 0),
  transcript: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileText, { className: "h-3.5 w-3.5 text-blue-500 animate-pulse" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 60,
    columnNumber: 15
  }, void 0),
  summarizing: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-3.5 w-3.5 text-violet-500 animate-pulse" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 61,
    columnNumber: 16
  }, void 0),
  done: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 62,
    columnNumber: 9
  }, void 0),
  skipped: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SkipForward, { className: "h-3.5 w-3.5 text-amber-500" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 63,
    columnNumber: 12
  }, void 0),
  cancelled: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleX, { className: "h-3.5 w-3.5 text-muted-foreground" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 64,
    columnNumber: 14
  }, void 0),
  failed: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleX, { className: "h-3.5 w-3.5 text-destructive" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 65,
    columnNumber: 11
  }, void 0)
};
function formatEta(ms) {
  if (!isFinite(ms) || ms <= 0) return "—";
  const s = Math.round(ms / 1e3);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}
function EnrichmentProgressDialog({
  runId,
  open,
  onOpenChange
}) {
  const getRun = useServerFn(getEnrichmentRun);
  const [run, setRun] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState([]);
  const startTime = reactExports.useRef(Date.now());
  reactExports.useEffect(() => {
    if (!runId || !open) return;
    startTime.current = Date.now();
    let alive = true;
    let timer = null;
    const tick = async () => {
      try {
        const res = await getRun({ data: { runId } });
        if (!alive) return;
        setRun(res.run);
        setProgress(res.progress ?? []);
        if (res.run?.status === "running") {
          timer = setTimeout(tick, 3e3);
        }
      } catch {
        if (alive) timer = setTimeout(tick, 4e3);
      }
    };
    tick();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [runId, open, getRun]);
  reactExports.useEffect(() => {
    if (!runId || !open) return;
    const ch = supabase.channel(`enrichment-${runId}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "enrichment_progress",
        filter: `run_id=eq.${runId}`
      },
      (payload) => {
        setProgress((prev) => {
          const next = [...prev];
          const row = payload.new;
          const i = next.findIndex((p) => p.lesson_id === row.lesson_id);
          if (i >= 0) next[i] = { ...next[i], ...row };
          else next.push(row);
          return next.sort((a, b) => a.order_index - b.order_index);
        });
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [runId, open]);
  const done = reactExports.useMemo(
    () => progress.filter((p) => ["done", "skipped", "failed", "cancelled"].includes(p.state)).length,
    [progress]
  );
  const total = run?.total ?? progress.length;
  const pct = total ? Math.round(done / total * 100) : 0;
  const eta = reactExports.useMemo(() => {
    if (!run || run.status !== "running" || done < 2) return null;
    const elapsed = Date.now() - new Date(run.started_at).getTime();
    const per = elapsed / done;
    return per * (total - done);
  }, [run, done, total]);
  const keyStatusBadge = (s) => {
    const map = {
      ok: { label: "Key OK", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
      invalid: {
        label: "Key invalid",
        cls: "bg-destructive/10 text-destructive border-destructive/30"
      },
      quota: { label: "Quota reached", cls: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
      missing: { label: "Key missing", cls: "bg-muted text-muted-foreground" },
      unknown: { label: "Key unknown", cls: "bg-muted text-muted-foreground" }
    };
    const m = map[s] ?? map.unknown;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: m.cls, children: m.label }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
      lineNumber: 175,
      columnNumber: 7
    }, this);
  };
  const cancelFn = useServerFn(cancelEnrichmentRun);
  const [cancelling, setCancelling] = reactExports.useState(false);
  const handleCancel = async () => {
    if (!runId) return;
    setCancelling(true);
    try {
      await cancelFn({ data: { runId } });
      toast.success("Cancellation requested — wrapping up the current lesson…");
      setRun((r) => r ? { ...r, cancel_requested: true } : r);
    } catch (e) {
      toast.error(e?.message ?? "Could not cancel");
    } finally {
      setCancelling(false);
    }
  };
  const cacheCount = progress.filter((p) => p.from_cache).length;
  const freshCount = progress.filter((p) => p.state === "done" && !p.from_cache).length;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-2xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
        run?.status === "running" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
          lineNumber: 206,
          columnNumber: 15
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-4 w-4 text-emerald-500" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
          lineNumber: 208,
          columnNumber: 15
        }, this),
        "YouTube enrichment",
        " ",
        run?.status === "running" ? run?.cancel_requested ? "cancelling…" : "in progress" : run?.status ?? "starting"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
        lineNumber: 204,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: [
        done,
        " of ",
        total,
        " lessons processed",
        eta ? ` · ETA ${formatEta(eta)}` : ""
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
        lineNumber: 217,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
      lineNumber: 203,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Progress, { value: pct }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
        lineNumber: 223,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 flex-wrap text-xs", children: [
        run && keyStatusBadge(run.youtube_key_status),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", children: [
          "Videos: ",
          run?.updated_videos ?? 0
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
          lineNumber: 226,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", children: [
          "Summaries: ",
          run?.updated_transcripts ?? 0
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
          lineNumber: 227,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "bg-blue-500/10 text-blue-600 border-blue-500/30", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Database, { className: "h-3 w-3 mr-1" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
            lineNumber: 229,
            columnNumber: 15
          }, this),
          " Cached: ",
          cacheCount
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
          lineNumber: 228,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Badge,
          {
            variant: "outline",
            className: "bg-violet-500/10 text-violet-600 border-violet-500/30",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Zap, { className: "h-3 w-3 mr-1" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
                lineNumber: 235,
                columnNumber: 15
              }, this),
              " Fresh: ",
              freshCount
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
            lineNumber: 231,
            columnNumber: 13
          },
          this
        ),
        run?.failures?.length ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Badge,
          {
            variant: "outline",
            className: "bg-destructive/10 text-destructive border-destructive/30",
            children: [
              run.failures.length,
              " failed"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
            lineNumber: 238,
            columnNumber: 15
          },
          this
        ) : null,
        run?.status === "running" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "ml-auto h-7 text-xs",
            onClick: handleCancel,
            disabled: cancelling || run.cancel_requested,
            children: [
              cancelling || run.cancel_requested ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-3 w-3 mr-1 animate-spin" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
                lineNumber: 254,
                columnNumber: 19
              }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Ban, { className: "h-3 w-3 mr-1" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
                lineNumber: 256,
                columnNumber: 19
              }, this),
              run.cancel_requested ? "Cancelling…" : "Cancel run"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
            lineNumber: 246,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
        lineNumber: 224,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ScrollArea, { className: "h-72 rounded-md border", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y", children: [
        progress.map((p) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-start gap-2 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mt-0.5", children: STATE_ICON[p.state] ?? STATE_ICON.pending }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
            lineNumber: 267,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "truncate", children: p.lesson_title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
              lineNumber: 269,
              columnNumber: 21
            }, this),
            p.message && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground truncate", children: p.message }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
              lineNumber: 271,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
            lineNumber: 268,
            columnNumber: 19
          }, this),
          p.state === "done" && (p.from_cache ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Badge,
            {
              variant: "outline",
              className: "bg-blue-500/10 text-blue-600 border-blue-500/30 text-[9px] h-5",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Database, { className: "h-2.5 w-2.5 mr-1" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
                  lineNumber: 280,
                  columnNumber: 25
                }, this),
                " Cached"
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
              lineNumber: 276,
              columnNumber: 23
            },
            this
          ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Badge,
            {
              variant: "outline",
              className: "bg-violet-500/10 text-violet-600 border-violet-500/30 text-[9px] h-5",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Zap, { className: "h-2.5 w-2.5 mr-1" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
                  lineNumber: 287,
                  columnNumber: 25
                }, this),
                " Fresh"
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
              lineNumber: 283,
              columnNumber: 23
            },
            this
          )),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] uppercase text-muted-foreground", children: p.state }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
            lineNumber: 290,
            columnNumber: 19
          }, this)
        ] }, p.lesson_id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
          lineNumber: 266,
          columnNumber: 17
        }, this)),
        !progress.length && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "px-3 py-6 text-sm text-muted-foreground text-center", children: "Preparing lessons…" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
          lineNumber: 294,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
        lineNumber: 264,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
        lineNumber: 263,
        columnNumber: 11
      }, this),
      !!run?.warnings?.length && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-md border border-amber-500/30 bg-amber-500/5 p-2 text-xs text-amber-700 dark:text-amber-400", children: run.warnings.map((w, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        "⚠ ",
        w
      ] }, i, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
        lineNumber: 304,
        columnNumber: 17
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
        lineNumber: 302,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
      lineNumber: 222,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 202,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/EnrichmentProgressDialog.tsx",
    lineNumber: 201,
    columnNumber: 5
  }, this);
}
export {
  EnrichmentProgressDialog as E,
  listAllEnrichmentRuns as a,
  listCourseEnrichmentRuns as l,
  startCourseEnrichment as s,
  verifyYoutubeKey as v
};
