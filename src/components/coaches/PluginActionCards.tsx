import React, { useState } from "react";
import {
  Mail,
  FileText,
  Table,
  Presentation,
  ExternalLink,
  Copy,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  openGmailCompose,
  openGoogleDocsWithContent,
  openGoogleSheetsWithData,
  openGoogleSlidesWithDeck,
  downloadFile,
} from "./mentorCustomization";

// ==========================================
// 1. GMAIL ACTION CARD
// ==========================================
export function GmailActionCard({
  to = "",
  subject,
  body,
}: {
  to?: string;
  subject: string;
  body: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl border border-red-500/20 bg-card shadow-xs overflow-hidden">
      <div className="bg-red-500/10 px-4 py-2.5 border-b border-red-500/15 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
          <Mail className="w-4 h-4" />
          <span>Gmail Plugin · Ready to Send</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-500/20 font-mono">
          Email Draft
        </Badge>
      </div>

      <div className="p-4 space-y-2.5 text-xs">
        {to && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold">To:</span>
            <span className="font-mono text-foreground">{to}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground">Subject:</span>
          <span className="font-bold text-foreground">{subject}</span>
        </div>
        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 font-sans text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
          {body}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Workspace Permitted
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 text-xs gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Draft"}</span>
            </Button>
            <Button
              size="sm"
              onClick={() => openGmailCompose({ to, subject, body })}
              className="h-7 text-xs gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Compose in Gmail</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. GOOGLE DOCS ACTION CARD
// ==========================================
export function GoogleDocsActionCard({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`# ${title}\n\n${content}`);
    setCopied(true);
    toast.success("Document copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`, `# ${title}\n\n${content}`, "text/markdown");
    toast.success("Downloaded document as Markdown!");
  };

  return (
    <div className="my-3 rounded-2xl border border-blue-500/20 bg-card shadow-xs overflow-hidden">
      <div className="bg-blue-500/10 px-4 py-2.5 border-b border-blue-500/15 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
          <FileText className="w-4 h-4" />
          <span>Google Docs Plugin · Technical Spec</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20 font-mono">
          RFC Document
        </Badge>
      </div>

      <div className="p-4 space-y-2.5 text-xs">
        <h4 className="font-bold text-sm text-foreground">{title}</h4>
        <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-mono text-[11px]">
          {content}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Google Drive: Ready
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleDownload} className="h-7 text-xs gap-1">
              <Download className="w-3.5 h-3.5" /> .MD
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopy} className="h-7 text-xs gap-1">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                openGoogleDocsWithContent(title, content);
                toast.info("Copied to clipboard! Simply press Ctrl+V inside your Google Doc.");
              }}
              className="h-7 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview in Google Docs</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. GOOGLE SHEETS ACTION CARD
// ==========================================
export function GoogleSheetsActionCard({
  title,
  csvData,
}: {
  title: string;
  csvData: string;
}) {
  const rows = csvData
    .trim()
    .split("\n")
    .map((r) => r.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
  const headers = rows[0] || [];
  const bodyRows = rows.slice(1);

  const handleDownloadCsv = () => {
    downloadFile(`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`, csvData, "text/csv");
    toast.success("Downloaded CSV spreadsheet!");
  };

  return (
    <div className="my-3 rounded-2xl border border-emerald-500/20 bg-card shadow-xs overflow-hidden">
      <div className="bg-emerald-500/10 px-4 py-2.5 border-b border-emerald-500/15 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <Table className="w-4 h-4" />
          <span>Google Sheets / Excel Plugin</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono">
          {bodyRows.length} Rows
        </Badge>
      </div>

      <div className="p-4 space-y-3 text-xs">
        <h4 className="font-bold text-sm text-foreground">{title}</h4>

        {/* Live Table Render */}
        <div className="overflow-x-auto rounded-xl border border-border/60 max-h-52">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/70 text-[11px] uppercase font-mono text-muted-foreground sticky top-0">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-2 border-b border-border/60 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((r, ri) => (
                <tr key={ri} className="border-b border-border/30 hover:bg-muted/30">
                  {r.map((c, ci) => (
                    <td key={ci} className="p-2 font-mono text-[11px] text-foreground">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Google Drive: Ready
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleDownloadCsv} className="h-7 text-xs gap-1">
              <Download className="w-3.5 h-3.5" /> .CSV
            </Button>
            <Button
              size="sm"
              onClick={() => {
                openGoogleSheetsWithData(title, csvData);
                toast.info("Table copied to clipboard! Paste directly into cell A1 in Google Sheets.");
              }}
              className="h-7 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview in Google Sheets</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. GOOGLE SLIDES ACTION CARD
// ==========================================
export function GoogleSlidesActionCard({
  title,
  slides,
}: {
  title: string;
  slides: { slideNumber: number; title: string; bullets: string[]; notes?: string }[];
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const cur = slides[currentIdx] || slides[0];

  const fullOutline = slides
    .map((s) => `SLIDE ${s.slideNumber}: ${s.title}\n${s.bullets.map((b) => `• ${b}`).join("\n")}\nNOTES: ${s.notes || ""}`)
    .join("\n\n");

  return (
    <div className="my-3 rounded-2xl border border-amber-500/20 bg-card shadow-xs overflow-hidden">
      <div className="bg-amber-500/10 px-4 py-2.5 border-b border-amber-500/15 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
          <Presentation className="w-4 h-4" />
          <span>Google Slides / PPT Plugin</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
          Slide {currentIdx + 1} of {slides.length}
        </span>
      </div>

      <div className="p-4 space-y-3 text-xs">
        <h4 className="font-bold text-sm text-foreground">{title}</h4>

        {/* Slide Frame Simulator */}
        <div className="aspect-video bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-white/10 flex flex-col justify-between shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
              Slide {cur?.slideNumber}
            </span>
            <h3 className="text-base font-extrabold mt-1 text-white">{cur?.title}</h3>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-200">
              {cur?.bullets.map((b, bi) => (
                <li key={bi} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          {cur?.notes && (
            <div className="text-[10px] text-slate-400 font-mono italic pt-2 border-t border-white/10">
              Speaker Notes: {cur.notes}
            </div>
          )}
        </div>

        {/* Carousel controls & Open in Google Slides */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              className="h-7 w-7 p-0 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentIdx === slides.length - 1}
              onClick={() => setCurrentIdx((prev) => Math.min(slides.length - 1, prev + 1))}
              className="h-7 w-7 p-0 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 ml-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Drive Synced
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => {
              openGoogleSlidesWithDeck(title, fullOutline);
              toast.info("Slide deck outline copied to clipboard! Paste into your new Google Slides presentation.");
            }}
            className="h-7 text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview in Google Slides</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. PLUGIN QUICK-TRIGGER TOOLBAR
// ==========================================
export function PluginToolbar({
  onTriggerPlugin,
}: {
  onTriggerPlugin: (action: "gmail" | "docs" | "sheets" | "slides" | "github" | "web") => void;
}) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none text-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1 shrink-0 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-primary" /> Plugins:
      </span>

      <button
        type="button"
        onClick={() => onTriggerPlugin("gmail")}
        className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20 font-semibold shrink-0 transition flex items-center gap-1 text-[11px]"
      >
        <Mail className="w-3 h-3" /> Draft in Gmail
      </button>

      <button
        type="button"
        onClick={() => onTriggerPlugin("docs")}
        className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 font-semibold shrink-0 transition flex items-center gap-1 text-[11px]"
      >
        <FileText className="w-3 h-3" /> Google Doc RFC
      </button>

      <button
        type="button"
        onClick={() => onTriggerPlugin("sheets")}
        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-semibold shrink-0 transition flex items-center gap-1 text-[11px]"
      >
        <Table className="w-3 h-3" /> Sheets Model
      </button>

      <button
        type="button"
        onClick={() => onTriggerPlugin("slides")}
        className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 font-semibold shrink-0 transition flex items-center gap-1 text-[11px]"
      >
        <Presentation className="w-3 h-3" /> Slide Deck
      </button>
    </div>
  );
}
