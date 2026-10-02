import { useState, useRef } from "react";
import { Upload, Check, Globe, X, Languages, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SubtitleTrack, type TranscriptEntry, parseVTT, parseSRT, LANGUAGES } from "./types";

const TRANSLATABLE = ["hi", "es", "fr", "de", "ta", "te", "kn", "mr", "bn"];

interface CaptionPanelProps {
  tracks: SubtitleTrack[];
  activeTrackId: string | null;
  onSelectTrack: (track: SubtitleTrack | null) => void;
  onAddTrack: (track: SubtitleTrack) => void;
  onRemoveTrack: (trackId: string) => void;
  onClose: () => void;
  sourceLanguage?: string;
  onTranslate?: (targetLang: string) => Promise<SubtitleTrack | null>;
}

export function CaptionPanel({
  tracks,
  activeTrackId,
  onSelectTrack,
  onAddTrack,
  onRemoveTrack,
  onClose,
  sourceLanguage = "en",
  onTranslate,
}: CaptionPanelProps) {
  const [uploading, setUploading] = useState(false);
  const [targetLang, setTargetLang] = useState("hi");
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const text = await file.text();
      const ext = file.name.split(".").pop()?.toLowerCase();
      let cues: TranscriptEntry[];

      if (ext === "vtt") {
        cues = parseVTT(text);
      } else if (ext === "srt") {
        cues = parseSRT(text);
      } else {
        throw new Error("Unsupported file format. Use VTT or SRT.");
      }

      if (cues.length === 0) {
        throw new Error("No subtitle cues found in file.");
      }

      // Try to detect language from filename or prompt
      const detectedLang = detectLanguageFromFilename(file.name);

      const newTrack: SubtitleTrack = {
        id: `track-${Date.now()}`,
        label: file.name.replace(/\.(vtt|srt)$/, ""),
        language: detectedLang,
        cues,
      };

      onAddTrack(newTrack);
    } catch (err: any) {
      console.error("Subtitle upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const detectLanguageFromFilename = (filename: string): string => {
    const lower = filename.toLowerCase();
    for (const lang of LANGUAGES) {
      if (
        lower.includes(`.${lang.code}.`) ||
        lower.includes(`_${lang.code}_`) ||
        lower.includes(`-${lang.code}-`)
      ) {
        return lang.code;
      }
    }
    return "en";
  };

  return (
    <div
      className="flex flex-col bg-background border-l border-border"
      role="dialog"
      aria-label="Caption settings"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="font-semibold text-sm">Subtitles / CC</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={onClose}
          aria-label="Close subtitles panel"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Upload */}
      <div className="p-3 border-b border-border">
        <input
          ref={fileInputRef}
          type="file"
          accept=".vtt,.srt"
          onChange={handleFileUpload}
          className="hidden"
          aria-label="Upload subtitle file"
        />
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-3.5 w-3.5 mr-2" />
          {uploading ? "Uploading..." : "Upload VTT / SRT"}
        </Button>
      </div>

      {/* Track list */}
      <div
        className="flex-1 overflow-y-auto p-2 space-y-1"
        role="listbox"
        aria-label="Subtitle tracks"
      >
        {/* Off option */}
        <button
          onClick={() => onSelectTrack(null)}
          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center gap-2 ${
            activeTrackId === null
              ? "bg-primary/15 text-primary font-medium"
              : "hover:bg-muted/50 text-muted-foreground"
          }`}
          role="option"
          aria-selected={activeTrackId === null}
        >
          <span className="w-4 text-center">Off</span>
        </button>

        {tracks.map((track) => {
          const lang = LANGUAGES.find((l) => l.code === track.language);
          return (
            <div
              key={track.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition ${
                activeTrackId === track.id
                  ? "bg-primary/15 text-primary font-medium"
                  : "hover:bg-muted/50 text-muted-foreground"
              }`}
              role="option"
              aria-selected={activeTrackId === track.id}
            >
              <button
                className="flex-1 text-left flex items-center gap-2"
                onClick={() => onSelectTrack(track)}
              >
                <Globe className="h-3 w-3 shrink-0 opacity-60" />
                <span className="truncate">
                  {track.label}
                  {lang && ` (${lang.label})`}
                </span>
                <span className="text-[10px] opacity-50 ml-auto">{track.cues.length} cues</span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                onClick={() => onRemoveTrack(track.id)}
                aria-label={`Remove ${track.label} subtitle`}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}

        {tracks.length === 0 && (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No subtitle tracks uploaded yet.
            <br />
            Upload a VTT or SRT file to get started.
          </div>
        )}
      </div>

      {/* Real AI translation (cached server-side per lesson + language) */}
      {onTranslate && tracks.length > 0 && (
        <div className="p-3 border-t border-border space-y-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Languages className="h-3 w-3" /> Translate captions
          </p>
          <div className="flex gap-1.5">
            <select
              value={targetLang}
              onChange={(e) => {
                setTargetLang(e.target.value);
                setTranslateError(null);
              }}
              className="flex-1 h-8 rounded-md border border-input bg-background px-2 text-xs"
              aria-label="Translation language"
            >
              {TRANSLATABLE.filter((c) => c !== sourceLanguage).map((c) => (
                <option key={c} value={c}>
                  {LANGUAGES.find((l) => l.code === c)?.label ?? c}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              className="h-8"
              disabled={translating}
              onClick={async () => {
                setTranslating(true);
                setTranslateError(null);
                try {
                  const track = await onTranslate(targetLang);
                  if (!track) setTranslateError("Translation unavailable for this video.");
                } catch (e: any) {
                  setTranslateError(e?.message ?? "Translation failed.");
                } finally {
                  setTranslating(false);
                }
              }}
            >
              {translating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
          {translateError && <p className="text-[10px] text-destructive">{translateError}</p>}
        </div>
      )}
    </div>
  );
}
