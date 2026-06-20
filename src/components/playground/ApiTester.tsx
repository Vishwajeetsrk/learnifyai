// Postman-style HTTP request tester with history + saved requests.
// Persists current request, history (last 30), and saved (named) to localStorage.
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark, BookmarkPlus, Clock, Code2, History, Loader2, Plus, Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { SNIPPET_LANGS, buildSnippet, type SnippetLang } from "@/lib/playground/snippet";

interface Header { key: string; value: string }
interface ApiRequest {
  method: string;
  url: string;
  headers: Header[];
  body: string;
}
interface ApiState extends ApiRequest {
  tab: "headers" | "body" | "history" | "saved";
}

interface ApiResponse {
  status: number;
  statusText: string;
  ms: number;
  size: number;
  contentType: string;
  headers: Record<string, string>;
  body: string;
}

interface HistoryEntry {
  id: string;
  at: number;
  req: ApiRequest;
  status: number;
  ms: number;
}
interface SavedEntry {
  id: string;
  name: string;
  req: ApiRequest;
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const KEY = "playground:api-tester:v2";
const HIST_KEY = "playground:api-tester:history:v1";
const SAVED_KEY = "playground:api-tester:saved:v1";
const MAX_HIST = 30;

function loadState(): ApiState {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch { /* ignore */ }
  return {
    method: "GET",
    url: "https://jsonplaceholder.typicode.com/todos/1",
    headers: [{ key: "Accept", value: "application/json" }],
    body: "",
    tab: "headers",
  };
}
function loadList<T>(key: string): T[] {
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    }
  } catch { /* ignore */ }
  return [];
}

function uid(): string { return Math.random().toString(36).slice(2, 10); }

export function ApiTester() {
  const [state, setState] = useState<ApiState>(() => loadState());
  const [sending, setSending] = useState(false);
  const [res, setRes] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadList<HistoryEntry>(HIST_KEY));
  const [saved, setSaved] = useState<SavedEntry[]>(() => loadList<SavedEntry>(SAVED_KEY));
  const [snippetLang, setSnippetLang] = useState<SnippetLang>("curl");
  const [snippetOpen, setSnippetOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);
  useEffect(() => {
    try { localStorage.setItem(HIST_KEY, JSON.stringify(history)); } catch { /* ignore */ }
  }, [history]);
  useEffect(() => {
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); } catch { /* ignore */ }
  }, [saved]);

  const prettyBody = useMemo(() => {
    if (!res) return "";
    const ct = res.contentType.toLowerCase();
    if (ct.includes("json")) {
      try { return JSON.stringify(JSON.parse(res.body), null, 2); } catch { return res.body; }
    }
    return res.body;
  }, [res]);

  function reqFromState(): ApiRequest {
    return { method: state.method, url: state.url, headers: state.headers, body: state.body };
  }

  function loadRequest(r: ApiRequest, tab: ApiState["tab"] = "headers") {
    setState({ ...r, tab });
  }

  async function send() {
    if (!state.url.trim()) { setError("Enter a URL"); return; }
    setSending(true); setError(null); setRes(null);
    const headers = Object.fromEntries(state.headers.filter((h) => h.key.trim()).map((h) => [h.key, h.value]));
    const init: RequestInit = { method: state.method, headers };
    if (!["GET", "HEAD"].includes(state.method) && state.body.trim()) init.body = state.body;
    const t0 = performance.now();
    try {
      const r = await fetch(state.url, init);
      const text = await r.text();
      const ms = Math.round(performance.now() - t0);
      const allHeaders: Record<string, string> = {};
      r.headers.forEach((v, k) => { allHeaders[k] = v; });
      setRes({
        status: r.status, statusText: r.statusText, ms,
        size: new Blob([text]).size,
        contentType: r.headers.get("content-type") ?? "",
        headers: allHeaders, body: text,
      });
      setHistory((h) => [
        { id: uid(), at: Date.now(), req: reqFromState(), status: r.status, ms },
        ...h,
      ].slice(0, MAX_HIST));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setHistory((h) => [
        { id: uid(), at: Date.now(), req: reqFromState(), status: 0, ms: Math.round(performance.now() - t0) },
        ...h,
      ].slice(0, MAX_HIST));
    } finally { setSending(false); }
  }

  function saveCurrent() {
    const name = prompt("Save request as", `${state.method} ${shortUrl(state.url)}`);
    if (!name) return;
    setSaved((s) => [{ id: uid(), name, req: reqFromState() }, ...s]);
    toast.success(`Saved "${name}"`);
  }

  return (
    <div className="flex h-full flex-col text-xs bg-card/25 rounded-lg border border-border p-3 gap-2">
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b pb-2">
        <Select value={state.method} onValueChange={(m) => setState((s) => ({ ...s, method: m }))}>
          <SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input
          value={state.url}
          onChange={(e) => setState((s) => ({ ...s, url: e.target.value }))}
          placeholder="https://api.example.com/users"
          className="h-8 flex-1 text-xs"
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        />
        <Button onClick={saveCurrent} variant="ghost" size="sm" className="h-8 px-2" title="Save request">
          <BookmarkPlus size={13} />
        </Button>
        <Button onClick={() => setSnippetOpen((v) => !v)} variant="ghost" size="sm" className="h-8 px-2" title="Generate client snippet">
          <Code2 size={13} />
        </Button>
        <Button onClick={send} disabled={sending} size="sm" className="h-8 px-3">
          {sending ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1 h-3.5 w-3.5" />}
          Send
        </Button>
      </div>

      {snippetOpen && (
        <div className="flex shrink-0 flex-col gap-1 border-b border-border/60 bg-muted/30 p-2 rounded">
          <div className="flex items-center gap-2">
            <Select value={snippetLang} onValueChange={(v) => setSnippetLang(v as SnippetLang)}>
              <SelectTrigger className="h-7 w-40 text-[10px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SNIPPET_LANGS.map((l) => <SelectItem key={l.id} value={l.id}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" variant="ghost" className="h-7 text-[10px]"
              onClick={async () => {
                try { await navigator.clipboard.writeText(buildSnippet(snippetLang, reqFromState())); toast.success("Snippet copied"); }
                catch { toast.error("Clipboard unavailable"); }
              }}>Copy</Button>
            <button className="ml-auto text-[10px] opacity-60 hover:opacity-100 font-medium" onClick={() => setSnippetOpen(false)}>Close</button>
          </div>
          <pre className="max-h-24 overflow-auto rounded border bg-card/60 p-2 font-mono text-[10px] leading-relaxed">
            {buildSnippet(snippetLang, reqFromState())}
          </pre>
        </div>
      )}

      <div className="flex shrink-0 gap-1 overflow-x-auto border-b pb-1">
        <TabBtn active={state.tab === "headers"} onClick={() => setState((s) => ({ ...s, tab: "headers" }))}>
          Headers ({state.headers.length})
        </TabBtn>
        <TabBtn active={state.tab === "body"} onClick={() => setState((s) => ({ ...s, tab: "body" }))}>
          Body
        </TabBtn>
        <TabBtn active={state.tab === "history"} onClick={() => setState((s) => ({ ...s, tab: "history" }))}>
          <History size={11} className="mr-1 inline" /> History ({history.length})
        </TabBtn>
        <TabBtn active={state.tab === "saved"} onClick={() => setState((s) => ({ ...s, tab: "saved" }))}>
          <Bookmark size={11} className="mr-1 inline" /> Saved ({saved.length})
        </TabBtn>
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-2 divide-y border rounded overflow-hidden">
        <div className="overflow-auto p-2 bg-card/10">
          {state.tab === "headers" && (
            <div className="grid gap-1">
              {state.headers.map((h, i) => (
                <div key={i} className="flex gap-1">
                  <Input className="h-7 text-xs flex-1" placeholder="Header" value={h.key}
                    onChange={(e) => setState((s) => ({ ...s, headers: s.headers.map((x, j) => j === i ? { ...x, key: e.target.value } : x) }))} />
                  <Input className="h-7 text-xs flex-1" placeholder="Value" value={h.value}
                    onChange={(e) => setState((s) => ({ ...s, headers: s.headers.map((x, j) => j === i ? { ...x, value: e.target.value } : x) }))} />
                  <Button size="icon" variant="ghost" className="h-7 w-7"
                    onClick={() => setState((s) => ({ ...s, headers: s.headers.filter((_, j) => j !== i) }))}>
                    <Trash2 size={13} />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="ghost" className="mt-1 h-7 justify-start text-[10px]"
                onClick={() => setState((s) => ({ ...s, headers: [...s.headers, { key: "", value: "" }] }))}>
                <Plus size={12} className="mr-1" /> Add header
              </Button>
            </div>
          )}
          {state.tab === "body" && (
            <textarea
              value={state.body}
              onChange={(e) => setState((s) => ({ ...s, body: e.target.value }))}
              placeholder='{"name":"Orbit"}'
              className="h-24 w-full resize-none rounded border bg-card/40 p-2 font-mono text-[11px] outline-none focus:ring-1 focus:ring-ring"
              spellCheck={false}
            />
          )}
          {state.tab === "history" && (
            <HistoryList
              entries={history}
              onLoad={(r) => loadRequest(r)}
              onClear={() => { setHistory([]); toast.success("History cleared"); }}
              onRemove={(id) => setHistory((h) => h.filter((x) => x.id !== id))}
            />
          )}
          {state.tab === "saved" && (
            <SavedList
              entries={saved}
              onLoad={(r) => loadRequest(r)}
              onRemove={(id) => setSaved((s) => s.filter((x) => x.id !== id))}
              onRename={(id, name) => setSaved((s) => s.map((x) => x.id === id ? { ...x, name } : x))}
            />
          )}
        </div>

        <div className="overflow-auto p-2 bg-card/5">
          {error && <div className="rounded bg-destructive/15 p-2 text-xs text-destructive-foreground">{error}</div>}
          {!res && !error && (
            <div className="grid h-full place-items-center text-xs opacity-60 text-center">
              Click Send to execute request.
            </div>
          )}
          {res && (
            <div className="grid gap-2">
              <div className="flex flex-wrap gap-1 text-[10px]">
                <Badge tone={res.status < 300 ? "ok" : res.status < 400 ? "warn" : "err"}>
                  {res.status} {res.statusText}
                </Badge>
                <Badge>{res.ms} ms</Badge>
                <Badge>{(res.size / 1024).toFixed(1)} KB</Badge>
                {res.contentType && <Badge>{res.contentType.split(";")[0]}</Badge>}
              </div>
              <details className="rounded border bg-card/20 p-2">
                <summary className="cursor-pointer text-[10px] font-medium opacity-70">Headers ({Object.keys(res.headers).length})</summary>
                <pre className="mt-2 overflow-auto text-[10px] leading-relaxed max-h-24 whitespace-pre font-mono">{Object.entries(res.headers).map(([k, v]) => `${k}: ${v}`).join("\n")}</pre>
              </details>
              <pre className="m-0 max-h-48 overflow-auto rounded bg-background p-2 font-mono text-[10px] leading-relaxed text-foreground border">
                {prettyBody || "(empty body)"}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`shrink-0 rounded-t-md px-2.5 py-1 text-[11px] font-semibold border-b-2 transition ${active ? "border-primary text-primary bg-primary/5" : "border-transparent opacity-60 hover:opacity-100"}`}>
      {children}
    </button>
  );
}

function HistoryList({ entries, onLoad, onClear, onRemove }: {
  entries: HistoryEntry[]; onLoad: (r: ApiRequest) => void; onClear: () => void; onRemove: (id: string) => void;
}) {
  if (entries.length === 0) return (
    <div className="grid h-full place-items-center text-center text-[10px] opacity-60">
      Sent requests appear here.
    </div>
  );
  return (
    <div className="grid gap-1">
      <div className="mb-1 flex items-center justify-between text-[10px] opacity-70">
        <span><Clock size={10} className="mr-1 inline" /> {entries.length} recent</span>
        <button onClick={onClear} className="rounded px-2 py-0.5 hover:bg-muted text-[10px] font-medium text-destructive">Clear all</button>
      </div>
      {entries.map((h) => (
        <div key={h.id} className="flex items-center gap-1.5 rounded border p-1 text-[10px]">
          <span className={`shrink-0 rounded px-1 py-0.2 font-mono text-[9px] font-bold ${methodTone(h.req.method)}`}>{h.req.method}</span>
          <button onClick={() => onLoad(h.req)} className="min-w-0 flex-1 truncate text-left hover:underline font-mono">
            {h.req.url}
          </button>
          <span className={`shrink-0 font-bold ${h.status >= 400 || h.status === 0 ? "text-destructive" : h.status >= 300 ? "text-amber-500" : "text-green-600"}`}>
            {h.status || "ERR"}
          </span>
          <span className="shrink-0 opacity-60 tabular-nums">{h.ms}ms</span>
          <button onClick={() => onRemove(h.id)} className="opacity-50 hover:opacity-100 text-destructive"><Trash2 size={11} /></button>
        </div>
      ))}
    </div>
  );
}

function SavedList({ entries, onLoad, onRemove, onRename }: {
  entries: SavedEntry[]; onLoad: (r: ApiRequest) => void; onRemove: (id: string) => void; onRename: (id: string, name: string) => void;
}) {
  if (entries.length === 0) return (
    <div className="grid h-full place-items-center text-center text-[10px] opacity-60">
      No saved requests. Tap the bookmark icon to save.
    </div>
  );
  return (
    <div className="grid gap-1">
      {entries.map((s) => (
        <div key={s.id} className="flex items-center gap-1.5 rounded border p-1 text-[10px]">
          <span className={`shrink-0 rounded px-1 py-0.2 font-mono text-[9px] font-bold ${methodTone(s.req.method)}`}>{s.req.method}</span>
          <button onClick={() => onLoad(s.req)} className="min-w-0 flex-1 truncate text-left">
            <b className="block truncate font-semibold">{s.name}</b>
            <span className="block truncate opacity-60 font-mono text-[9px]">{s.req.url}</span>
          </button>
          <button onClick={() => { const n = prompt("Rename", s.name); if (n) onRename(s.id, n); }}
            className="opacity-60 hover:opacity-100" title="Rename">✎</button>
          <button onClick={() => onRemove(s.id)} className="opacity-50 hover:opacity-100 text-destructive"><Trash2 size={11} /></button>
        </div>
      ))}
    </div>
  );
}

function shortUrl(u: string): string {
  try { const x = new URL(u); return x.host + x.pathname; } catch { return u.slice(0, 40); }
}
function methodTone(m: string): string {
  switch (m) {
    case "GET": return "bg-green-500/15 text-green-600";
    case "POST": return "bg-blue-500/15 text-blue-600";
    case "PUT": case "PATCH": return "bg-amber-500/15 text-amber-600";
    case "DELETE": return "bg-red-500/15 text-red-600";
    default: return "bg-muted text-muted-foreground";
  }
}

function Badge({ children, tone }: { children: React.ReactNode; tone?: "ok" | "warn" | "err" }) {
  const c = tone === "ok" ? "bg-green-500/15 text-green-600 border-green-500/30"
        : tone === "warn" ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
        : tone === "err" ? "bg-red-500/15 text-red-600 border-red-500/30"
        : "bg-muted text-muted-foreground border-border";
  return <span className={`rounded border px-1.5 py-0.2 font-mono text-[9px] font-bold ${c}`}>{children}</span>;
}
