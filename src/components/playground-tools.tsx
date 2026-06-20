import { useEffect, useMemo, useRef, useState } from "react";
import {
  Braces,
  Calculator,
  Clock,
  Code as CodeIcon,
  Diff,
  Download,
  FileImage,
  FileJson,
  Fingerprint,
  Hash,
  KeyRound,
  Link as LinkIcon,
  Palette,
  Pilcrow,
  QrCode,
  Scan,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Type,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PlaygroundTools() {
  return (
    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1 bg-card/25 rounded-lg border border-border p-3">
      <header className="shrink-0 border-b pb-2">
        <h2 className="text-sm font-semibold tracking-tight">Free Utilities</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Runnable client-side helper tools — no data leaves your browser.
        </p>
      </header>
      <div className="grid gap-3 sm:grid-cols-2">
        <ImageCompressor />
        <JsonCsvConverter />
        <Base64Tool />
        <UrlEncoder />
        <JwtDecoder />
        <UuidGenerator />
        <HashGenerator />
        <PasswordGenerator />
        <ColorConverter />
        <RegexTester />
        <TextExtractor />
        <CaseConverter />
        <SlugifyTool />
        <TimestampConverter />
        <WordCounter />
        <LoremIpsum />
        <TextDiff />
        <NumberBase />
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof FileImage;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-lg border border-border/60 bg-card/30 p-2.5 sm:p-3">
      <div className="flex items-start gap-2.5">
        <div className="shrink-0 rounded-md bg-primary/10 p-1.5 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-semibold leading-tight">{title}</h3>
          <p className="text-[9px] text-muted-foreground leading-tight mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 mt-1">{children}</div>
    </section>
  );
}

function Tabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 text-[10px]">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`rounded border px-1.5 py-0.5 transition ${
            value === o.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border/60 hover:border-border"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function copy(text: string) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(
    () => toast.success("Copied"),
    () => toast.error("Copy failed"),
  );
}

/* ---------- Image compressor ---------- */
function ImageCompressor() {
  const [busy, setBusy] = useState(false);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [outSize, setOutSize] = useState(0);
  const [origSize, setOrigSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(f: File) {
    setBusy(true);
    setOrigSize(f.size);
    try {
      const bmp = await createImageBitmap(f);
      const canvas = document.createElement("canvas");
      canvas.width = bmp.width;
      canvas.height = bmp.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(bmp, 0, 0);
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Failed"))), "image/jpeg", quality),
      );
      setOutSize(blob.size);
      setOutUrl(URL.createObjectURL(blob));
      toast.success(`Compressed by ${Math.round((1 - blob.size / f.size) * 100)}%`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card
      icon={FileImage}
      title="Image compressor"
      desc="Re-encode PNG/JPEG with adjustable quality."
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div className="flex items-center gap-1.5 text-[10px]">
        <label className="text-muted-foreground shrink-0">Quality</label>
        <input
          type="range"
          min={10}
          max={100}
          value={quality * 100}
          onChange={(e) => setQuality(Number(e.target.value) / 100)}
          className="flex-1 h-3 cursor-pointer"
        />
        <span className="w-6 text-right tabular-nums">{Math.round(quality * 100)}</span>
      </div>
      <Button
        size="sm"
        className="h-7 text-[10px]"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
      >
        <Upload className="mr-1 h-3 w-3" /> Choose image
      </Button>
      {outUrl && (
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="text-muted-foreground">
            {(origSize / 1024).toFixed(1)}KB → {(outSize / 1024).toFixed(1)}KB
          </span>
          <a
            href={outUrl}
            download="compressed.jpg"
            className="ml-auto inline-flex items-center gap-0.5 text-primary hover:underline"
          >
            <Download className="h-3 w-3" /> Download
          </a>
        </div>
      )}
    </Card>
  );
}

/* ---------- JSON ↔ CSV ---------- */
function JsonCsvConverter() {
  const [input, setInput] = useState('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json2csv" | "csv2json">("json2csv");

  function convert() {
    try {
      if (mode === "json2csv") {
        const arr = JSON.parse(input);
        if (!Array.isArray(arr) || arr.length === 0) throw new Error("Expected non-empty array");
        const keys = Array.from(new Set(arr.flatMap((o) => Object.keys(o))));
        const rows = [keys.join(",")];
        for (const o of arr) rows.push(keys.map((k) => JSON.stringify(o[k] ?? "")).join(","));
        setOutput(rows.join("\n"));
      } else {
        const lines = input.trim().split(/\r?\n/);
        const headers = lines[0].split(",").map((s) => s.trim());
        const out = lines.slice(1).map((line) => {
          const cells = line.split(",");
          return Object.fromEntries(headers.map((h, i) => [h, cells[i]?.trim() ?? ""]));
        });
        setOutput(JSON.stringify(out, null, 2));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <Card icon={FileJson} title="JSON ↔ CSV" desc="Convert between JSON arrays of objects and CSV.">
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { value: "json2csv", label: "JSON → CSV" },
          { value: "csv2json", label: "CSV → JSON" },
        ]}
      />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-16 resize-y rounded border border-input bg-background p-1.5 font-mono text-[10px]"
      />
      <div className="flex gap-1.5">
        <Button size="sm" className="h-7 text-[10px]" onClick={convert}>
          Convert
        </Button>
        {output && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px]"
            onClick={() => copy(output)}
          >
            Copy
          </Button>
        )}
      </div>
      {output && (
        <textarea
          readOnly
          value={output}
          className="h-16 resize-y rounded border bg-muted/40 p-1.5 font-mono text-[10px]"
        />
      )}
    </Card>
  );
}

/* ---------- Base64 ---------- */
function Base64Tool() {
  const [text, setText] = useState("Hello, world!");
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const [out, setOut] = useState("");

  function run() {
    try {
      setOut(
        mode === "enc"
          ? btoa(unescape(encodeURIComponent(text)))
          : decodeURIComponent(escape(atob(text))),
      );
    } catch {
      toast.error("Invalid input");
    }
  }

  return (
    <Card icon={Hash} title="Base64" desc="Encode or decode text using base64.">
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { value: "enc", label: "Encode" },
          { value: "dec", label: "Decode" },
        ]}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-14 resize-y rounded border border-input bg-background p-1.5 font-mono text-[10px]"
      />
      <div className="flex gap-1.5">
        <Button size="sm" className="h-7 text-[10px]" onClick={run}>
          Run
        </Button>
        {out && (
          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => copy(out)}>
            Copy
          </Button>
        )}
      </div>
      {out && (
        <textarea
          readOnly
          value={out}
          className="h-14 resize-y rounded border bg-muted/40 p-1.5 font-mono text-[10px]"
        />
      )}
    </Card>
  );
}

/* ---------- URL encode/decode ---------- */
function UrlEncoder() {
  const [text, setText] = useState("https://example.com/?q=hello world&x=1");
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const [out, setOut] = useState("");
  function run() {
    try {
      setOut(mode === "enc" ? encodeURIComponent(text) : decodeURIComponent(text));
    } catch {
      toast.error("Invalid input");
    }
  }
  return (
    <Card icon={LinkIcon} title="URL encoder" desc="Percent-encode or decode URLs.">
      <Tabs
        value={mode}
        onChange={setMode}
        options={[
          { value: "enc", label: "Encode" },
          { value: "dec", label: "Decode" },
        ]}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-14 resize-y rounded border border-input bg-background p-1.5 font-mono text-[10px]"
      />
      <div className="flex gap-1.5">
        <Button size="sm" className="h-7 text-[10px]" onClick={run}>
          Run
        </Button>
        {out && (
          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => copy(out)}>
            Copy
          </Button>
        )}
      </div>
      {out && (
        <textarea
          readOnly
          value={out}
          className="h-14 resize-y rounded border bg-muted/40 p-1.5 font-mono text-[10px]"
        />
      )}
    </Card>
  );
}

/* ---------- JWT decoder ---------- */
function JwtDecoder() {
  const [token, setToken] = useState("");
  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "Not a JWT" };
    try {
      const dec = (s: string) => {
        const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
        const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(decodeURIComponent(escape(atob(b64))));
      };
      return { header: dec(parts[0]), payload: dec(parts[1]) };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Decode failed" };
    }
  }, [token]);

  return (
    <Card
      icon={ShieldCheck}
      title="JWT decoder"
      desc="Inspect header/payload (no signature check)."
    >
      <textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste a JWT…"
        className="h-14 resize-y rounded border border-input bg-background p-1.5 font-mono text-[10px]"
      />
      {decoded && "error" in decoded && (
        <p className="text-[10px] text-destructive">{decoded.error}</p>
      )}
      {decoded && "payload" in decoded && (
        <div className="grid gap-1.5 text-[10px]">
          <div>
            <div className="mb-0.5 font-medium text-muted-foreground">Header</div>
            <pre className="overflow-auto rounded border bg-card/65 p-1 font-mono text-[9px]">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>
          <div>
            <div className="mb-0.5 font-medium text-muted-foreground">Payload</div>
            <pre className="overflow-auto rounded border bg-card/65 p-1 font-mono text-[9px]">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ---------- UUID generator ---------- */
function UuidGenerator() {
  const [count, setCount] = useState(3);
  const [ids, setIds] = useState<string[]>([]);
  function gen() {
    const out: string[] = [];
    for (let i = 0; i < count; i++) out.push(crypto.randomUUID());
    setIds(out);
  }
  useEffect(gen, []); // initial
  return (
    <Card
      icon={Fingerprint}
      title="UUID generator"
      desc="Generate cryptographically secure v4 UUIDs."
    >
      <div className="flex items-center gap-1.5 text-[10px]">
        <label className="text-muted-foreground shrink-0">Count</label>
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
          className="h-7 w-12 rounded border bg-background px-1 text-center"
        />
        <Button size="sm" onClick={gen} className="ml-auto h-7 text-[10px]">
          Generate
        </Button>
      </div>
      {ids.length > 0 && (
        <>
          <pre className="max-h-20 overflow-auto rounded border bg-card/40 p-1 font-mono text-[9px]">
            {ids.join("\n")}
          </pre>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px]"
            onClick={() => copy(ids.join("\n"))}
          >
            Copy all
          </Button>
        </>
      )}
    </Card>
  );
}

/* ---------- SHA hash ---------- */
function HashGenerator() {
  const [text, setText] = useState("hello world");
  const [algo, setAlgo] = useState<"SHA-1" | "SHA-256" | "SHA-384" | "SHA-512">("SHA-256");
  const [out, setOut] = useState("");
  async function run() {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest(algo, enc);
    setOut(
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    );
  }
  return (
    <Card
      icon={KeyRound}
      title="Hash generator"
      desc="Compute SHA hashes directly using Web Crypto API."
    >
      <Tabs
        value={algo}
        onChange={setAlgo}
        options={[
          { value: "SHA-1", label: "SHA-1" },
          { value: "SHA-256", label: "SHA-2" },
          { value: "SHA-384", label: "SHA-3" },
          { value: "SHA-512", label: "SHA-5" },
        ]}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-12 resize-y rounded border border-input bg-background p-1.5 font-mono text-[10px]"
      />
      <div className="flex gap-1.5">
        <Button size="sm" className="h-7 text-[10px]" onClick={run}>
          Hash
        </Button>
        {out && (
          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => copy(out)}>
            Copy
          </Button>
        )}
      </div>
      {out && (
        <pre className="overflow-auto break-all rounded border bg-muted/40 p-1 font-mono text-[9px]">
          {out}
        </pre>
      )}
    </Card>
  );
}

/* ---------- Password generator ---------- */
function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, digits: true, symbols: true });
  const [out, setOut] = useState("");
  function gen() {
    const sets: string[] = [];
    if (opts.lower) sets.push("abcdefghijklmnopqrstuvwxyz");
    if (opts.upper) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (opts.digits) sets.push("0123456789");
    if (opts.symbols) sets.push("!@#$%^&*()-_=+[]{}<>?/");
    if (sets.length === 0) {
      toast.error("Pick at least one");
      return;
    }
    const all = sets.join("");
    const buf = new Uint32Array(len);
    crypto.getRandomValues(buf);
    let s = "";
    for (let i = 0; i < len; i++) s += all[buf[i] % all.length];
    setOut(s);
  }
  useEffect(gen, []); // initial
  return (
    <Card
      icon={Sparkles}
      title="Password generator"
      desc="Cryptographically random and custom length."
    >
      <div className="flex items-center gap-1.5 text-[10px]">
        <label className="text-muted-foreground shrink-0">Len</label>
        <input
          type="range"
          min={6}
          max={64}
          value={len}
          onChange={(e) => setLen(Number(e.target.value))}
          className="flex-1 h-3 cursor-pointer"
        />
        <span className="w-5 text-right tabular-nums">{len}</span>
      </div>
      <div className="flex flex-wrap gap-2 text-[9px]">
        {(["upper", "lower", "digits", "symbols"] as const).map((k) => (
          <label key={k} className="flex items-center gap-0.5 capitalize">
            <input
              type="checkbox"
              checked={opts[k]}
              onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })}
              className="h-3 w-3"
            />
            {k}
          </label>
        ))}
      </div>
      <div className="flex gap-1.5">
        <Button size="sm" className="h-7 text-[10px]" onClick={gen}>
          Generate
        </Button>
        {out && (
          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => copy(out)}>
            Copy
          </Button>
        )}
      </div>
      {out && (
        <pre className="overflow-auto break-all rounded border bg-muted/40 p-1.5 font-mono text-[9px]">
          {out}
        </pre>
      )}
    </Card>
  );
}

/* ---------- Color converter ---------- */
function ColorConverter() {
  const [hex, setHex] = useState("#6366f1");
  const parsed = useMemo(() => {
    const m = /^#?([a-fA-F0-9]{6})$/.exec(hex.trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    // HSL
    const rn = r / 255,
      gn = g / 255,
      bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    let h = 0;
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (d !== 0) {
      switch (max) {
        case rn:
          h = ((gn - bn) / d) % 6;
          break;
        case gn:
          h = (bn - rn) / d + 2;
          break;
        case bn:
          h = (rn - gn) / d + 4;
          break;
      }
      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }
    return {
      hex: `#${m[1].toLowerCase()}`,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      preview: `#${m[1]}`,
    };
  }, [hex]);
  return (
    <Card icon={Palette} title="Color converter" desc="Convert between HEX, RGB, and HSL.">
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          value={parsed?.hex ?? "#6366f1"}
          onChange={(e) => setHex(e.target.value)}
          className="h-7 w-10 cursor-pointer rounded border bg-background"
        />
        <input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="h-7 flex-1 rounded border bg-background px-1.5 font-mono text-[10px]"
        />
      </div>
      {parsed ? (
        <div className="grid gap-0.5 text-[10px]">
          {(["hex", "rgb", "hsl"] as const).map((k) => (
            <button
              key={k}
              onClick={() => copy(parsed[k] ?? "")}
              className="flex items-center justify-between rounded border bg-background px-1.5 py-0.5 font-mono hover:border-primary text-left"
            >
              <span className="uppercase text-muted-foreground text-[8px]">{k}</span>
              <span>{parsed[k] ?? ""}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-destructive">Use 6-digit hex like #6366f1</p>
      )}
    </Card>
  );
}

/* ---------- Regex tester ---------- */
function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [input, setInput] = useState("Contact alice@example.com or bob@test.io.");
  const result = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; index: number }[] = [];
      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        while ((m = re.exec(input)) !== null) {
          matches.push({ match: m[0], index: m.index });
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        const m = re.exec(input);
        if (m) matches.push({ match: m[0], index: m.index });
      }
      return { matches };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Bad pattern" };
    }
  }, [pattern, flags, input]);

  return (
    <Card
      icon={CodeIcon}
      title="Regex tester"
      desc="Test JS RegExp patterns with match highlights."
    >
      <div className="flex gap-1.5">
        <input
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          className="h-7 flex-1 rounded border bg-background px-1.5 font-mono text-[10px]"
        />
        <input
          value={flags}
          onChange={(e) => setFlags(e.target.value)}
          placeholder="flags"
          className="h-7 w-12 rounded border bg-background px-1.5 font-mono text-[10px]"
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-14 resize-y rounded border bg-background p-1.5 font-mono text-[10px]"
      />
      {"error" in result ? (
        <p className="text-[10px] text-destructive">{result.error}</p>
      ) : (
        <div className="text-[10px]">
          <div className="mb-0.5 text-muted-foreground">{result.matches.length} matches</div>
          {result.matches.length > 0 && (
            <pre className="max-h-16 overflow-auto rounded border bg-card/45 p-1 font-mono text-[9px] leading-tight">
              {result.matches.map((m) => `[${m.index}] ${m.match}`).join("\n")}
            </pre>
          )}
        </div>
      )}
    </Card>
  );
}

/* ---------- Text extractor ---------- */
function TextExtractor() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    emails: string[];
    urls: string[];
    numbers: string[];
  } | null>(null);
  function run() {
    const emails = Array.from(new Set(text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? []));
    const urls = Array.from(new Set(text.match(/https?:\/\/[^\s)]+/g) ?? []));
    const numbers = Array.from(new Set(text.match(/-?\d+(?:\.\d+)?/g) ?? []));
    setResult({ emails, urls, numbers });
  }
  return (
    <Card
      icon={Scan}
      title="Text extractor"
      desc="Pull emails, URLs, and numbers out of text blocks."
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste text…"
        className="h-14 resize-y rounded border bg-background p-1.5 font-mono text-[10px]"
      />
      <Button size="sm" className="h-7 text-[10px]" onClick={run}>
        Extract
      </Button>
      {result && (
        <div className="grid gap-1 text-[10px] mt-1">
          {(["emails", "urls", "numbers"] as const).map((k) => (
            <details key={k} className="rounded border bg-background p-1.5">
              <summary className="cursor-pointer font-semibold capitalize text-[10px]">
                {k} ({result[k].length})
              </summary>
              <pre className="mt-1 max-h-16 overflow-auto text-muted-foreground text-[9px] leading-normal">
                {result[k].join("\n") || "—"}
              </pre>
            </details>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ---------- Case converter ---------- */
function CaseConverter() {
  const [text, setText] = useState("Hello world from playground");
  const conversions = useMemo(() => {
    const words = text.split(/[\s_\-]+/).filter(Boolean);
    return {
      UPPER: text.toUpperCase(),
      lower: text.toLowerCase(),
      Title: text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
      camelCase: words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
        .join(""),
      PascalCase: words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(""),
      snake_case: words.map((w) => w.toLowerCase()).join("_"),
      "kebab-case": words.map((w) => w.toLowerCase()).join("-"),
    };
  }, [text]);
  return (
    <Card icon={Type} title="Case converter" desc="Convert text naming cases.">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-12 resize-y rounded border border-input bg-background p-1.5 font-mono text-[10px]"
      />
      <div className="grid gap-0.5 text-[10px]">
        {Object.entries(conversions).map(([k, v]) => (
          <button
            key={k}
            onClick={() => copy(v)}
            className="flex items-center justify-between gap-1.5 rounded border bg-background px-1.5 py-0.5 hover:border-primary text-left"
          >
            <span className="shrink-0 text-muted-foreground text-[8px]">{k}</span>
            <span className="truncate font-mono">{v}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Slugify ---------- */
function SlugifyTool() {
  const [text, setText] = useState("Hello World! This is My Post #1");
  const slug = useMemo(
    () =>
      text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80),
    [text],
  );
  return (
    <Card icon={ScrollText} title="Slugify" desc="Turn any title into a URL-safe slug.">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="h-7 rounded border bg-background px-1.5 text-[10px]"
      />
      <button
        onClick={() => copy(slug)}
        className="rounded border bg-background px-1.5 py-1 text-left font-mono text-[10px] hover:border-primary font-semibold"
      >
        {slug || "—"}
      </button>
    </Card>
  );
}

/* ---------- Timestamp converter ---------- */
function TimestampConverter() {
  const [input, setInput] = useState("");
  useEffect(() => {
    if (!input) setInput(String(Math.floor(Date.now() / 1000)));
  }, []);
  const parsed = useMemo(() => {
    const s = input.trim();
    if (!s) return null;
    let d: Date;
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      d = new Date(s.length > 10 ? n : n * 1000);
    } else {
      d = new Date(s);
    }
    if (isNaN(d.getTime())) return { error: "Unrecognized date format" };
    return {
      iso: d.toISOString(),
      local: d.toLocaleString(),
      unix: String(Math.floor(d.getTime() / 1000)),
      ms: String(d.getTime()),
    };
  }, [input]);

  return (
    <Card
      icon={Clock}
      title="Timestamp converter"
      desc="Convert between Unix timestamps and ISO/local dates."
    >
      <div className="flex gap-1.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Unix or ISO date"
          className="h-7 flex-1 rounded border bg-background px-1.5 font-mono text-[10px]"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[10px]"
          onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}
        >
          Now
        </Button>
      </div>
      {parsed && "error" in parsed && (
        <p className="text-[10px] text-destructive">{parsed.error}</p>
      )}
      {parsed && "iso" in parsed && (
        <div className="grid gap-0.5 text-[10px]">
          {(["iso", "local", "unix", "ms"] as const).map((k) => (
            <button
              key={k}
              onClick={() => copy(parsed[k] ?? "")}
              className="flex items-center justify-between gap-1.5 rounded border bg-background px-1.5 py-0.5 hover:border-primary text-left"
            >
              <span className="shrink-0 uppercase text-muted-foreground text-[8px]">{k}</span>
              <span className="truncate font-mono">{parsed[k] ?? ""}</span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

/* ---------- Word counter ---------- */
function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = (text.trim().match(/\S+/g) ?? []).length;
    const lines = text === "" ? 0 : text.split(/\r?\n/).length;
    const sentences = (text.match(/[.!?]+(\s|$)/g) ?? []).length;
    return { chars, charsNoSpace, words, lines, sentences };
  }, [text]);
  return (
    <Card
      icon={Calculator}
      title="Word counter"
      desc="Live count of characters, words, lines, and sentences."
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste or type text…"
        className="h-16 resize-y rounded border bg-background p-1.5 text-[10px]"
      />
      <div className="grid grid-cols-2 gap-1 text-[9px] sm:grid-cols-3">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="rounded border bg-background px-1.5 py-0.5">
            <div className="text-muted-foreground capitalize">{k}</div>
            <div className="font-mono text-[10px] font-bold">{v}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ---------- Lorem ipsum ---------- */
const LOREM_WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );

function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const text = useMemo(() => {
    function word() {
      return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
    }
    function sentence() {
      const n = 6 + Math.floor(Math.random() * 12);
      const words = Array.from({ length: n }, word);
      words[0] = words[0][0].toUpperCase() + words[0].slice(1);
      return words.join(" ") + ".";
    }
    function paragraph() {
      const n = 3 + Math.floor(Math.random() * 5);
      return Array.from({ length: n }, sentence).join(" ");
    }
    const n = Math.max(1, Math.min(50, count));
    if (unit === "words") return Array.from({ length: n }, word).join(" ");
    if (unit === "sentences") return Array.from({ length: n }, sentence).join(" ");
    return Array.from({ length: n }, paragraph).join("\n\n");
  }, [count, unit]);
  return (
    <Card
      icon={Pilcrow}
      title="Lorem ipsum"
      desc="Generate placeholder text in paragraphs, sentences, or words."
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value) || 1)}
          className="h-7 w-12 rounded border bg-background px-1 text-center text-[10px]"
        />
        <Tabs
          value={unit}
          options={[
            { value: "paragraphs", label: "Para" },
            { value: "sentences", label: "Sent" },
            { value: "words", label: "Words" },
          ]}
          onChange={setUnit}
        />
        <Button
          size="sm"
          variant="outline"
          className="ml-auto h-7 text-[10px]"
          onClick={() => copy(text)}
        >
          Copy
        </Button>
      </div>
      <textarea
        readOnly
        value={text}
        className="h-16 resize-y rounded border bg-background p-1.5 font-mono text-[10px]"
      />
    </Card>
  );
}

/* ---------- Text diff ---------- */
function TextDiff() {
  const [a, setA] = useState("hello world\nfoo\nbar\n");
  const [b, setB] = useState("hello WORLD\nfoo\nbaz\n");
  const diff = useMemo(() => {
    const la = a.split(/\r?\n/);
    const lb = b.split(/\r?\n/);
    // Simple LCS line diff
    const m = la.length,
      n = lb.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--)
      for (let j = n - 1; j >= 0; j--) {
        dp[i][j] = la[i] === lb[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    const out: { t: "=" | "-" | "+"; v: string }[] = [];
    let i = 0,
      j = 0;
    while (i < m && j < n) {
      if (la[i] === lb[j]) {
        out.push({ t: "=", v: la[i] });
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        out.push({ t: "-", v: la[i++] });
      } else {
        out.push({ t: "+", v: lb[j++] });
      }
    }
    while (i < m) out.push({ t: "-", v: la[i++] });
    while (j < n) out.push({ t: "+", v: lb[j++] });
    return out;
  }, [a, b]);
  return (
    <Card icon={Diff} title="Text diff" desc="Line-by-line diff comparison of two text blocks.">
      <div className="grid gap-1.5 sm:grid-cols-2">
        <textarea
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="h-16 resize-y rounded border bg-background p-1.5 font-mono text-[10px]"
          placeholder="Original"
        />
        <textarea
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="h-16 resize-y rounded border bg-background p-1.5 font-mono text-[10px]"
          placeholder="Changed"
        />
      </div>
      <pre className="max-h-24 overflow-auto rounded border bg-background p-1.5 font-mono text-[9px] leading-relaxed">
        {diff.map((d, idx) => (
          <div
            key={idx}
            className={
              d.t === "+"
                ? "bg-green-500/10 text-green-600 font-bold"
                : d.t === "-"
                  ? "bg-red-500/10 text-red-600 font-bold"
                  : "text-muted-foreground"
            }
          >
            <span className="select-none pr-1 opacity-60">{d.t === "=" ? " " : d.t}</span>
            {d.v || "\u00a0"}
          </div>
        ))}
      </pre>
    </Card>
  );
}

/* ---------- Number base converter ---------- */
function NumberBase() {
  const [value, setValue] = useState("255");
  const [base, setBase] = useState<2 | 8 | 10 | 16>(10);
  const num = useMemo(() => {
    try {
      const n = parseInt(value.replace(/^0[xob]/i, ""), base);
      if (!Number.isFinite(n)) return null;
      return n;
    } catch {
      return null;
    }
  }, [value, base]);
  return (
    <Card
      icon={Calculator}
      title="Number base converter"
      desc="Convert between Bin, Oct, Dec, and Hex."
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-7 flex-1 rounded border bg-background px-1.5 font-mono text-[10px]"
        />
        <Tabs<string>
          value={String(base)}
          options={[
            { value: "2", label: "Bin" },
            { value: "8", label: "Oct" },
            { value: "10", label: "Dec" },
            { value: "16", label: "Hex" },
          ]}
          onChange={(v) => setBase(Number(v) as 2 | 8 | 10 | 16)}
        />
      </div>
      {num === null ? (
        <p className="text-[10px] text-destructive">Invalid for base {base}</p>
      ) : (
        <div className="grid gap-0.5 text-[10px]">
          {(
            [
              ["BIN", 2],
              ["OCT", 8],
              ["DEC", 10],
              ["HEX", 16],
            ] as const
          ).map(([label, b]) => (
            <button
              key={label}
              onClick={() => copy(num.toString(b))}
              className="flex items-center justify-between gap-1.5 rounded border bg-background px-1.5 py-0.5 hover:border-primary text-left"
            >
              <span className="shrink-0 text-muted-foreground text-[8px]">{label}</span>
              <span className="truncate font-mono">
                {b === 16 ? num.toString(16).toUpperCase() : num.toString(b)}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

// Suppress unused import warnings
void Braces;
void QrCode;
