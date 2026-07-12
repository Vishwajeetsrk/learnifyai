import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Download, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type TranscriptEntry, formatTimestamp } from "./types";

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
  currentTime: number;
  onSeek: (time: number) => void;
  onClose: () => void;
  videoTitle?: string;
}

export function TranscriptPanel({
  entries,
  currentTime,
  onSeek,
  onClose,
  videoTitle,
}: TranscriptPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter((e) => e.text.toLowerCase().includes(q));
  }, [entries, searchQuery]);

  const activeIndex = useMemo(() => {
    return entries.findIndex(
      (e, i) =>
        currentTime >= e.start && (i === entries.length - 1 || currentTime < entries[i + 1].start),
    );
  }, [entries, currentTime]);

  useEffect(() => {
    if (activeRef.current && listRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  const downloadTranscript = () => {
    const text = entries
      .map((e) => `${formatTimestamp(e.start)} - ${formatTimestamp(e.end)}\n${e.text}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${videoTitle || "transcript"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <div
      className="flex flex-col h-full bg-background border-l border-border"
      role="complementary"
      aria-label="Video transcript"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="font-semibold text-sm">Transcript</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={downloadTranscript}
            title="Download transcript"
            aria-label="Download transcript"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onClose}
            aria-label="Close transcript"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transcript..."
            className="h-8 pl-7 text-xs"
            aria-label="Search transcript"
          />
        </div>
        {searchQuery && (
          <p className="text-[10px] text-muted-foreground mt-1">
            {filteredEntries.length} result{filteredEntries.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Transcript entries */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto overscroll-contain"
        role="list"
        aria-label="Transcript entries"
      >
        {filteredEntries.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            {entries.length === 0 ? "No transcript available" : "No results found"}
          </div>
        ) : (
          <div className="p-2 space-y-0.5">
            {filteredEntries.map((entry, i) => {
              const originalIndex = entries.indexOf(entry);
              const isActive = originalIndex === activeIndex;
              return (
                <button
                  key={`${entry.start}-${i}`}
                  ref={isActive ? activeRef : undefined}
                  onClick={() => onSeek(entry.start)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs leading-relaxed transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary font-medium"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                  role="listitem"
                  aria-current={isActive ? "true" : undefined}
                >
                  <span className="inline-block w-10 text-[10px] font-mono opacity-60 mr-2 shrink-0">
                    {formatTimestamp(entry.start)}
                  </span>
                  <span>{highlightText(entry.text, searchQuery)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
