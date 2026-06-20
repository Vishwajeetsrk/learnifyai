import { useCallback, useEffect, useRef, useState } from "react";
import type { Database, SqlJsStatic } from "sql.js";
import { Database as DbIcon, Loader2, Play, RefreshCw, Table as TableIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlaygroundAiDebugPanel } from "@/components/playground-ai-debug-panel";

interface ExecResult {
  ms: number;
  blocks: { columns: string[]; rows: unknown[][] }[];
  rowsChanged: number;
}

let sqlJsPromise: Promise<SqlJsStatic> | null = null;

function loadSqlJs(): Promise<SqlJsStatic> {
  if (sqlJsPromise) return sqlJsPromise;
  sqlJsPromise = (async () => {
    const initSqlJs = (await import("sql.js")).default;
    return initSqlJs({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/sql.js@1.14.1/dist/${file}`,
    });
  })();
  return sqlJsPromise;
}

function runSql(db: Database, sql: string): ExecResult {
  const start = performance.now();
  const blocks = db.exec(sql).map((r) => ({ columns: r.columns, rows: r.values }));
  const ms = Math.round(performance.now() - start);
  let rowsChanged = 0;
  try {
    rowsChanged = db.getRowsModified();
  } catch {
    /* ignore */
  }
  return { ms, blocks, rowsChanged };
}

export function PlaygroundDatabase() {
  const storageKey = "learnify:playground-db:v1";
  const [tab, setTab] = useState<"sql" | "schema">("schema");
  const [source, setSource] = useState(() => {
    try {
      return (
        localStorage.getItem(storageKey + ":sql") ??
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
    } catch {
      return "";
    }
  });
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dbRef = useRef<Database | null>(null);
  const [, force] = useState(0);

  const persistDb = useCallback(() => {
    try {
      if (!dbRef.current) return;
      const bytes = dbRef.current.export();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
      localStorage.setItem(storageKey + ":db", b64);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const SQL = await loadSqlJs();
        if (!alive) return;
        let db: Database;
        try {
          const saved = localStorage.getItem(storageKey + ":db");
          if (saved) {
            const bin = Uint8Array.from(atob(saved), (c) => c.charCodeAt(0));
            db = new SQL.Database(bin);
          } else {
            db = new SQL.Database();
          }
        } catch {
          db = new SQL.Database();
        }
        dbRef.current = db;
        setLoading(false);
        force((n) => n + 1);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
      dbRef.current?.close();
    };
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey + ":sql", source);
    } catch {
      /* ignore */
    }
  }, [source, storageKey]);

  function run() {
    if (!dbRef.current) return;
    setRunning(true);
    setError(null);
    try {
      setResult(runSql(dbRef.current, source));
      persistDb();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    loadSqlJs().then((SQL) => {
      dbRef.current?.close();
      dbRef.current = new SQL.Database();
      try {
        localStorage.removeItem(storageKey + ":db");
      } catch {
        /* ignore */
      }
      setResult(null);
      setError(null);
      toast.success("Fresh database");
      force((n) => n + 1);
    });
  }

  if (loading)
    return (
      <div className="grid h-full min-h-[200px] place-items-center text-xs opacity-60">
        <span className="inline-flex items-center gap-2">
          <Loader2 className="animate-spin" size={14} /> Loading SQLite…
        </span>
      </div>
    );

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border">
      <div className="flex shrink-0 items-center gap-1 border-b px-2 py-1.5">
        <button
          onClick={() => setTab("schema")}
          className={`inline-flex h-7 items-center rounded-md px-2 text-[11px] ${tab === "schema" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <TableIcon size={11} className="mr-1" /> Schema
        </button>
        <button
          onClick={() => setTab("sql")}
          className={`inline-flex h-7 items-center rounded-md px-2 text-[11px] ${tab === "sql" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <DbIcon size={11} className="mr-1" /> SQL
        </button>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={reset}>
            <RefreshCw size={11} className="mr-1" /> Reset
          </Button>
          {tab === "sql" && (
            <Button size="sm" className="h-7 px-2 text-[11px]" onClick={run} disabled={running}>
              {running ? (
                <Loader2 className="mr-1 animate-spin" size={11} />
              ) : (
                <Play size={11} className="mr-1" />
              )}
              Run
            </Button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === "schema" && (
          <SchemaView
            db={dbRef.current}
            onChange={() => {
              persistDb();
              force((n) => n + 1);
            }}
          />
        )}
        {tab === "sql" && (
          <div className="flex h-full flex-col divide-y overflow-y-auto">
            <div className="grid grid-rows-2 divide-y min-h-[300px] shrink-0">
              <textarea
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="h-full w-full resize-none bg-muted/30 p-2 font-mono text-xs outline-none"
                spellCheck={false}
                placeholder="SELECT * FROM ..."
              />
              <div className="overflow-auto p-2 text-xs bg-card/10">
                {error && (
                  <div className="rounded bg-destructive/15 p-2 text-destructive-foreground">
                    {error}
                  </div>
                )}
                {!error && !result && (
                  <div className="text-muted-foreground">Run a query to see results.</div>
                )}
                {result?.blocks.map((b, i) => (
                  <div key={i} className="mb-2 overflow-auto rounded border">
                    <table className="w-full text-[11px]">
                      <thead className="bg-muted/50">
                        <tr>
                          {b.columns.map((c) => (
                            <th key={c} className="px-2 py-1 text-left font-medium">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {b.rows.map((r, ri) => (
                          <tr key={ri} className="border-t">
                            {r.map((cell, ci) => (
                              <td key={ci} className="px-2 py-1 font-mono">
                                {cell === null ? (
                                  <span className="opacity-50">NULL</span>
                                ) : (
                                  String(cell)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
                {result && result.blocks.length === 0 && (
                  <div className="text-muted-foreground">
                    OK · {result.rowsChanged} row(s) modified in {result.ms} ms.
                  </div>
                )}
              </div>
            </div>
            <PlaygroundAiDebugPanel
              language="sql"
              code={source}
              stdout={
                result?.blocks.length === 0
                  ? "OK. Rows modified: " + result.rowsChanged
                  : (result?.blocks
                      .map(
                        (b) =>
                          b.columns.join(",") + "\n" + b.rows.map((r) => r.join(",")).join("\n"),
                      )
                      .join("\n\n") ?? "")
              }
              stderr={error ?? ""}
              exitCode={error ? 1 : result ? 0 : null}
              stdin=""
              onApplyFix={(next) => setSource(next)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SchemaView({ db, onChange }: { db: Database | null; onChange: () => void }) {
  const [tables, setTables] = useState<{ name: string; columns: string[] }[]>([]);
  const [newName, setNewName] = useState("");
  const [newCol, setNewCol] = useState({ name: "", type: "TEXT" });

  useEffect(() => {
    if (!db) return;
    const stmt = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
    const names: string[] = [];
    if (stmt[0]) {
      for (const row of stmt[0].values) {
        if (typeof row[0] === "string") names.push(row[0]);
      }
    }
    const info = names.map((name) => {
      const cols = db.exec(`PRAGMA table_info(${JSON.stringify(name)});`);
      const columnNames = cols[0]?.values.map((v) => `${v[1]} ${v[2]}`) ?? [];
      return { name, columns: columnNames as string[] };
    });
    setTables(info);
  }, [db]);

  function createTable() {
    if (!db || !newName.trim()) return;
    db.exec(
      `CREATE TABLE IF NOT EXISTS ${JSON.stringify(newName.trim())} (id INTEGER PRIMARY KEY AUTOINCREMENT);`,
    );
    onChange();
    setNewName("");
  }

  function addColumn(tableName: string) {
    if (!db || !newCol.name.trim()) return;
    try {
      db.exec(
        `ALTER TABLE ${JSON.stringify(tableName)} ADD COLUMN ${JSON.stringify(newCol.name.trim())} ${newCol.type};`,
      );
      onChange();
      setNewCol({ name: "", type: "TEXT" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to add column");
    }
  }

  function dropTable(name: string) {
    if (!db) return;
    db.exec(`DROP TABLE IF EXISTS ${JSON.stringify(name)};`);
    onChange();
  }

  return (
    <div className="h-full overflow-auto p-3 space-y-3 text-xs">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New table name…"
          className="h-7 flex-1 rounded border bg-background px-2 text-xs outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") createTable();
          }}
        />
        <Button
          size="sm"
          className="h-7 px-2 text-[11px]"
          onClick={createTable}
          disabled={!newName.trim()}
        >
          <Plus size={11} className="mr-1" /> Create
        </Button>
      </div>
      {tables.length === 0 && (
        <div className="text-muted-foreground">No tables yet. Create one above.</div>
      )}
      {tables.map((t) => (
        <div key={t.name} className="rounded border p-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t.name}</span>
            <button
              onClick={() => dropTable(t.name)}
              className="text-destructive hover:text-destructive/80"
            >
              <Trash2 size={12} />
            </button>
          </div>
          <div className="pl-2 space-y-0.5 text-muted-foreground">
            {t.columns.map((c, i) => (
              <div key={i}>{c}</div>
            ))}
          </div>
          <div className="flex gap-1.5 pt-1">
            <input
              value={newCol.name}
              onChange={(e) => setNewCol((p) => ({ ...p, name: e.target.value }))}
              placeholder="col name…"
              className="h-6 flex-1 rounded border bg-background px-1.5 text-[10px] outline-none"
            />
            <select
              value={newCol.type}
              onChange={(e) => setNewCol((p) => ({ ...p, type: e.target.value }))}
              className="h-6 rounded border bg-background px-1 text-[10px] outline-none"
            >
              {["TEXT", "INTEGER", "REAL", "BOOLEAN", "DATE"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <button
              onClick={() => addColumn(t.name)}
              className="h-6 rounded bg-primary/10 px-1.5 text-[10px] text-primary hover:bg-primary/20 disabled:opacity-50"
              disabled={!newCol.name.trim()}
            >
              + Col
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Plus({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function Trash2({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size ?? 16}
      height={size ?? 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
