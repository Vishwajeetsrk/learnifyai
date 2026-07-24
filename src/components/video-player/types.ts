export interface TranscriptEntry {
  start: number;
  end: number;
  text: string;
}

export interface SubtitleTrack {
  id: string;
  label: string;
  language: string;
  src?: string;
  cues: TranscriptEntry[];
  isDefault?: boolean;
}

export interface LessonSlide {
  id: string;
  title: string;
  body?: string;
  start: number;
  end?: number;
  imageUrl?: string;
}

export interface CaptionStyle {
  fontSize: "small" | "medium" | "large" | "xlarge";
  fontFamily: string;
  fontWeight: "regular" | "medium" | "bold";
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  position: "bottom" | "center" | "top";
  blur: boolean;
  rounded: boolean;
}

export interface VideoSettings {
  quality: string;
  playbackRate: number;
  captionsEnabled: boolean;
  captionStyle: CaptionStyle;
  autoNextLesson: boolean;
  resumePlayback: boolean;
  focusMode: boolean;
  theaterMode: boolean;
}

export interface KeyboardShortcut {
  key: string;
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  action: string;
  description: string;
}

export const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  fontSize: "medium",
  fontFamily: "Inter, sans-serif",
  fontWeight: "medium",
  color: "#ffffff",
  backgroundColor: "#000000",
  backgroundOpacity: 75,
  position: "bottom",
  blur: false,
  rounded: false,
};

export const CAPTION_FONT_SIZES: { label: string; value: CaptionStyle["fontSize"]; px: number }[] =
  [
    { label: "Small", value: "small", px: 14 },
    { label: "Medium", value: "medium", px: 18 },
    { label: "Large", value: "large", px: 24 },
    { label: "X-Large", value: "xlarge", px: 32 },
  ];

export const CAPTION_FONTS = [
  "Inter, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Arial, sans-serif",
  "Sans Serif",
];

export const CAPTION_COLORS = [
  { label: "White", value: "#ffffff" },
  { label: "Yellow", value: "#ffff00" },
  { label: "Green", value: "#00ff00" },
  { label: "Blue", value: "#00bfff" },
];

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "kn", label: "Kannada" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "mr", label: "Marathi" },
  { code: "bn", label: "Bengali" },
  { code: "gu", label: "Gujarati" },
  { code: "ml", label: "Malayalam" },
  { code: "pa", label: "Punjabi" },
  { code: "ur", label: "Urdu" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
];

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: "ArrowUp", action: "volumeUp", description: "Volume Up" },
  { key: "ArrowDown", action: "volumeDown", description: "Volume Down" },
  { key: "ArrowRight", action: "seekForward", description: "Scrub Forward 5s" },
  { key: "ArrowLeft", action: "seekBackward", description: "Scrub Backward 5s" },
  { key: "j", action: "skipBack10", description: "Skip Back 10s" },
  { key: "k", action: "togglePlay", description: "Play/Pause" },
  { key: "l", action: "skipForward10", description: "Skip Forward 10s" },
  { key: "m", action: "toggleMute", description: "Toggle Mute" },
  { key: "c", action: "toggleCaptions", description: "Toggle Captions" },
  { key: "f", action: "toggleFullscreen", description: "Toggle Fullscreen" },
  { key: "t", shift: true, action: "toggleTranscript", description: "Toggle Transcript" },
  { key: "p", action: "screenshot", description: "Screenshot Frame" },
  { key: "0", action: "restart", description: "Restart Video" },
  { key: "1", action: "jump10", description: "Jump to 10%" },
  { key: "2", action: "jump20", description: "Jump to 20%" },
  { key: "3", action: "jump30", description: "Jump to 30%" },
  { key: "4", action: "jump40", description: "Jump to 40%" },
  { key: "5", action: "jump50", description: "Jump to 50%" },
  { key: "6", action: "jump60", description: "Jump to 60%" },
  { key: "7", action: "jump70", description: "Jump to 70%" },
  { key: "8", action: "jump80", description: "Jump to 80%" },
  { key: "9", action: "jump90", description: "Jump to 90%" },
  { key: "n", action: "nextLesson", description: "Next Lesson" },
  { key: "b", action: "prevLesson", description: "Previous Lesson" },
  { key: "s", action: "openSettings", description: "Open Settings" },
  { key: "Escape", action: "closeModal", description: "Close Modal" },
];

export function parseVTT(text: string): TranscriptEntry[] {
  const cues: TranscriptEntry[] = [];
  const lines = text.trim().split("\n");
  let i = 0;

  // Skip WEBVTT header
  while (i < lines.length && !lines[i].includes("-->")) i++;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line.includes("-->")) {
      const [startStr, endStr] = line.split("-->").map((s) => s.trim());
      const start = parseTimestamp(startStr);
      const end = parseTimestamp(endStr);
      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "") {
        textLines.push(lines[i].trim());
        i++;
      }
      if (textLines.length > 0) {
        cues.push({ start, end, text: textLines.join(" ") });
      }
    } else {
      i++;
    }
  }
  return cues;
}

export function parseSRT(text: string): TranscriptEntry[] {
  const cues: TranscriptEntry[] = [];
  const blocks = text.trim().split(/\n\n+/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 2) continue;

    let timeLine = -1;
    for (let j = 0; j < lines.length; j++) {
      if (lines[j].includes("-->")) {
        timeLine = j;
        break;
      }
    }
    if (timeLine === -1) continue;

    const [startStr, endStr] = lines[timeLine].split("-->").map((s) => s.trim());
    const start = parseTimestamp(startStr);
    const end = parseTimestamp(endStr);
    const textLines = lines.slice(timeLine + 1);
    if (textLines.length > 0) {
      cues.push({ start, end, text: textLines.join(" ").trim() });
    }
  }
  return cues;
}

function parseTimestamp(ts: string): number {
  const parts = ts.split(":");
  if (parts.length === 3) {
    const [h, m, rest] = parts;
    const [s, ms] = rest.split(".");
    return (
      parseInt(h) * 3600 +
      parseInt(m) * 60 +
      parseInt(s) +
      parseInt((ms || "0").padEnd(3, "0").slice(0, 3)) / 1000
    );
  } else if (parts.length === 2) {
    const [m, rest] = parts;
    const [s, ms] = rest.split(".");
    return parseInt(m) * 60 + parseInt(s) + parseInt((ms || "0").padEnd(3, "0").slice(0, 3)) / 1000;
  }
  return 0;
}

export function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
