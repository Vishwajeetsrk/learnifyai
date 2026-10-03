import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Lock,
  ArrowRight,
  Zap,
  Server,
  Layers,
  Captions,
  Trash2,
  BarChart3,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAdminAiInfrastructure,
  testAiProvider,
  getAiUsageStats,
  type AdminProviderStatus,
} from "@/lib/ai-gateway-admin.functions";
import {
  adminListLessonTranscripts,
  adminDeleteLessonTranscript,
} from "@/lib/lesson-transcript.functions";

export default function AiInfrastructureManager() {
  const queryClient = useQueryClient();
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<
    Record<string, { ok: boolean; status?: number; latencyMs?: number; message: string }>
  >({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-ai-infrastructure"],
    queryFn: () => getAdminAiInfrastructure(),
  });

  // Lesson transcript cache (transcripts + summaries + quiz + translations)
  const [transcriptSearch, setTranscriptSearch] = useState("");
  const {
    data: transcriptRows,
    isLoading: transcriptsLoading,
    refetch: refetchTranscripts,
  } = useQuery({
    queryKey: ["admin-lesson-transcripts", transcriptSearch],
    queryFn: () => adminListLessonTranscripts({ data: { search: transcriptSearch, limit: 50 } }),
  });

  const deleteTranscriptMutation = useMutation({
    mutationFn: (lessonId: string) => adminDeleteLessonTranscript({ data: { lessonId } }),
    onSuccess: () => {
      toast.success("AI cache cleared — transcript, summary, quiz & translations will regenerate on demand.");
      refetchTranscripts();
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to clear cache."),
  });

  // Token/request metering
  const { data: usageStats, refetch: refetchUsage } = useQuery({
    queryKey: ["admin-ai-usage"],
    queryFn: () => getAiUsageStats(),
  });

  const testMutation = useMutation({
    mutationFn: (provider: "groq" | "gemini" | "openrouter") =>
      testAiProvider({ data: { provider } }),
    onMutate: (provider) => {
      setTestingProvider(provider);
    },
    onSuccess: (res, provider) => {
      setTestingProvider(null);
      setTestResults((prev) => ({
        ...prev,
        [provider]: {
          ok: res.ok,
          status: res.status,
          latencyMs: res.latencyMs,
          message: res.message,
        },
      }));
      if (res.ok) {
        toast.success(`${provider.toUpperCase()} connection healthy (${res.latencyMs}ms)`);
      } else {
        toast.error(`${provider.toUpperCase()} check failed: ${res.message}`);
      }
    },
    onError: (err: any, provider) => {
      setTestingProvider(null);
      toast.error(`Failed to test ${provider}: ${err?.message || "Unknown error"}`);
    },
  });

  const providers = data?.providers || [];
  const modelRegistry = data?.modelRegistry || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display tracking-tight text-foreground">
              AI Gateway &amp; Model Infrastructure
            </h2>
            <Badge variant="outline" className="text-xs font-semibold bg-primary/10 text-primary border-primary/20">
              Multi-Provider Active
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor model gateways, test live connectivity, review task token budgets, and inspect fallback cascade behavior.
          </p>
        </div>

        <Button
          onClick={() => refetch()}
          size="sm"
          variant="outline"
          className="gap-1.5 text-xs shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Status
        </Button>
      </div>

      {/* Resilience Architecture Banner */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2.5">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs">
          <Zap className="h-4 w-4" />
          <span>PRODUCTION-GRADE MULTI-MODEL FALLBACK CASCADE</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The Learnify AI Gateway implements automated zero-friction failover: If the primary Groq LPU engine encounters a 404/429/500, requests seamlessly route to Google Gemini Flash. If Gemini is degraded, requests fall back to OpenRouter. Raw provider stack traces, internal endpoints, and API keys are strictly stripped before reaching the client UI.
        </p>
        <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-foreground flex-wrap">
          <span className="px-2 py-0.5 rounded bg-background border font-semibold">1. Groq (llama-3.3-70b)</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="px-2 py-0.5 rounded bg-background border font-semibold">2. Gemini (gemini-2.0-flash)</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <span className="px-2 py-0.5 rounded bg-background border font-semibold">3. OpenRouter (gemini-2.0-flash-001)</span>
        </div>
      </div>

      {/* Provider Connectivity Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold font-display tracking-tight text-foreground flex items-center gap-2">
          <Server className="h-4 w-4 text-primary" />
          Provider Health &amp; Endpoint Diagnostics
        </h3>

        {isLoading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {providers.map((provider) => {
              const test = testResults[provider.id];
              const isTesting = testingProvider === provider.id;

              return (
                <div
                  key={provider.id}
                  className="p-5 rounded-2xl border bg-card flex flex-col justify-between space-y-4 shadow-xs hover:border-primary/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{provider.displayName}</h4>
                        <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                          Env: {provider.keyEnv}
                        </p>
                      </div>

                      {provider.hasKeyConfigured ? (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 gap-1 shrink-0">
                          <CheckCircle2 className="h-3 w-3" /> Configured
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-600 border-rose-500/30 gap-1 shrink-0">
                          <AlertTriangle className="h-3 w-3" /> Missing Key
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Masked Key:</span>
                        <span className="font-mono text-[11px] flex items-center gap-1 text-foreground">
                          <Lock className="h-3 w-3 text-muted-foreground" />
                          {provider.maskedKey}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>Primary Model:</span>
                        <span className="font-mono text-[11px] font-semibold text-foreground">
                          {provider.primaryModel}
                        </span>
                      </div>
                    </div>

                    {/* Live Test Diagnostic Output */}
                    {test && (
                      <div
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          test.ok
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-[11px]">
                          <span>Status: HTTP {test.status}</span>
                          <span>{test.latencyMs} ms</span>
                        </div>
                        <p className="text-[11px] leading-tight line-clamp-2">{test.message}</p>
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isTesting || !provider.hasKeyConfigured}
                    onClick={() => testMutation.mutate(provider.id)}
                    className="w-full text-xs gap-1.5 shadow-xs"
                  >
                    {isTesting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Testing Latency...
                      </>
                    ) : (
                      <>
                        <Activity className="h-3.5 w-3.5 text-primary" /> Test Connection
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Strict Token Budget Policy */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold font-display tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Task Token Budgets &amp; Anti-Exhaustion Clamping
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            OpenRouter and third-party models reserve credit based on requested token capacity. Leaving tokens unbounded causes 402 balance reservation errors. All tasks are bounded between 100 and 4,000 tokens.
          </p>
        </div>

        <div className="rounded-xl border overflow-hidden bg-card">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 border-b">
              <tr className="text-left text-muted-foreground font-semibold">
                <th className="py-2.5 px-4">Task Name</th>
                <th className="py-2.5 px-4">Default Budget</th>
                <th className="py-2.5 px-4">Clamping Limit</th>
                <th className="py-2.5 px-4">Protection Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-foreground">Course Lesson Summary</td>
                <td className="py-2.5 px-4 font-mono">1,500 tokens</td>
                <td className="py-2.5 px-4 font-mono text-muted-foreground">Hard cap 4,000</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">Guaranteed within tier balance</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-foreground">Interactive AI Exercise</td>
                <td className="py-2.5 px-4 font-mono">2,000 tokens</td>
                <td className="py-2.5 px-4 font-mono text-muted-foreground">Hard cap 4,000</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">Prevents runaway code outputs</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-foreground">Concept Comprehension Quiz</td>
                <td className="py-2.5 px-4 font-mono">1,500 tokens</td>
                <td className="py-2.5 px-4 font-mono text-muted-foreground">Hard cap 4,000</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">Structured JSON schema enforcement</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-foreground">Ask AI / Code Doubt Clarifier</td>
                <td className="py-2.5 px-4 font-mono">2,000 tokens</td>
                <td className="py-2.5 px-4 font-mono text-muted-foreground">Hard cap 4,000</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">Real-time student Q&amp;A response</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-foreground">General AI Copilot Chat</td>
                <td className="py-2.5 px-4 font-mono">2,500 tokens</td>
                <td className="py-2.5 px-4 font-mono text-muted-foreground">Hard cap 4,000</td>
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400">Deep reasoning &amp; multi-turn context</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Registry Table */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold font-display tracking-tight text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-500" />
            Configured Model Registry
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified production models actively registered in the gateway catalog.
          </p>
        </div>

        <div className="rounded-xl border overflow-hidden bg-card">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 border-b">
              <tr className="text-left text-muted-foreground font-semibold">
                <th className="py-2.5 px-4">Provider</th>
                <th className="py-2.5 px-4">Model Identifier</th>
                <th className="py-2.5 px-4">Context Window</th>
                <th className="py-2.5 px-4">Max Output</th>
                <th className="py-2.5 px-4">Cascade Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {modelRegistry.map((model) => (
                <tr key={`${model.provider}-${model.id}`}>
                  <td className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider text-muted-foreground">
                    {model.provider}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-medium text-foreground">
                    {model.id}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-muted-foreground">
                    {model.contextWindow.toLocaleString()} tokens
                  </td>
                  <td className="py-2.5 px-4 font-mono text-muted-foreground">
                    {model.maxOutputTokens.toLocaleString()} tokens
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="font-mono text-muted-foreground mr-2">{model.recommendedTask}</span>
                    {model.enabled ? (
                      <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] text-muted-foreground">
                        Disabled
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Usage Metering */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold font-display tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              AI Usage Metering (30 days)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Requests &amp; estimated tokens across lesson AI and copilot chat.
              {usageStats && (
                <span className="font-mono text-foreground">
                  {" "}{usageStats.totals.requests.toLocaleString()} requests ·{" "}
                  {usageStats.totals.tokens.toLocaleString()} tokens
                </span>
              )}
            </p>
          </div>
          <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => refetchUsage()}>
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>

        <div className="rounded-xl border overflow-hidden bg-card">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 border-b">
              <tr className="text-left text-muted-foreground font-semibold">
                <th className="py-2.5 px-4">Model / Task</th>
                <th className="py-2.5 px-4">Requests</th>
                <th className="py-2.5 px-4">Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {(usageStats?.models ?? []).map((m) => (
                <tr key={m.model}>
                  <td className="py-2.5 px-4 font-mono font-medium text-foreground">{m.model}</td>
                  <td className="py-2.5 px-4 font-mono">{m.requests.toLocaleString()}</td>
                  <td className="py-2.5 px-4 font-mono text-muted-foreground">{m.tokens.toLocaleString()}</td>
                </tr>
              ))}
              {(usageStats?.models ?? []).length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-muted-foreground">
                    No AI usage recorded in the last 30 days.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lesson Transcript Cache Manager */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold font-display tracking-tight text-foreground flex items-center gap-2">
              <Captions className="h-4 w-4 text-sky-500" />
              Lesson Transcripts &amp; AI Cache
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Every cached transcript, summary, quiz &amp; translation. Reset clears a lesson&apos;s cache — it regenerates on next demand.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                placeholder="Search lesson or course…"
                className="h-8 pl-7 pr-2 rounded-md border border-input bg-background text-xs outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
            <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => refetchTranscripts()}>
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>

        <div className="rounded-xl border overflow-hidden bg-card">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 border-b">
              <tr className="text-left text-muted-foreground font-semibold">
                <th className="py-2.5 px-4">Lesson</th>
                <th className="py-2.5 px-4">Source</th>
                <th className="py-2.5 px-4">Cache</th>
                <th className="py-2.5 px-4">Updated</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {(transcriptRows ?? []).map((r: any) => (
                <tr key={r.lesson_id}>
                  <td className="py-2.5 px-4">
                    <p className="font-semibold text-foreground">{r.lesson || r.lesson_id}</p>
                    <p className="text-[11px] text-muted-foreground">{r.course}</p>
                  </td>
                  <td className="py-2.5 px-4">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {r.source}
                      {r.lang ? ` · ${r.lang}` : ""}
                    </Badge>
                    <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                      {(r.chars ?? 0).toLocaleString()} chars
                    </p>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {r.has_summary && (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30">summary</Badge>
                      )}
                      {(r.quiz_count ?? 0) > 0 && (
                        <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-600 border-sky-500/30">
                          quiz ×{r.quiz_count}
                        </Badge>
                      )}
                      {(r.translation_langs ?? []).map((l: string) => (
                        <Badge key={l} variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-500 border-indigo-500/30">
                          {l}
                        </Badge>
                      ))}
                      {!r.has_summary && (r.quiz_count ?? 0) === 0 && (r.translation_langs ?? []).length === 0 && (
                        <span className="text-[11px] text-muted-foreground">transcript only</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-muted-foreground">
                    {r.updated_at ? new Date(r.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] gap-1 text-destructive hover:text-destructive"
                      disabled={deleteTranscriptMutation.isPending}
                      onClick={() => {
                        if (window.confirm(`Reset AI cache for "${r.lesson || r.lesson_id}"? Transcript, summary, quiz & translations will regenerate on demand.`)) {
                          deleteTranscriptMutation.mutate(r.lesson_id);
                        }
                      }}
                    >
                      <Trash2 className="h-3 w-3" /> Reset
                    </Button>
                  </td>
                </tr>
              ))}
              {!transcriptsLoading && (transcriptRows ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-center text-muted-foreground">
                    No cached transcripts yet. Publish or watch a lesson to generate one.
                  </td>
                </tr>
              )}
              {transcriptsLoading && (
                <tr>
                  <td colSpan={5} className="py-6 text-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
