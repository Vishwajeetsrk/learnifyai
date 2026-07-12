import { useState, useCallback, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceNarrationProps {
  text: string;
  title: string;
  language?: string;
  autoPlay?: boolean;
}

const VOICE_STYLES = [
  { id: "teacher", label: "Teacher", pitch: 1, rate: 0.9 },
  { id: "mentor", label: "Mentor", pitch: 0.9, rate: 0.85 },
  { id: "coach", label: "Interview Coach", pitch: 1.1, rate: 1 },
  { id: "architect", label: "Architect", pitch: 0.8, rate: 0.8 },
];

export function VoiceNarration({
  text,
  title,
  language = "en-US",
  autoPlay = false,
}: VoiceNarrationProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voiceStyle, setVoiceStyle] = useState(VOICE_STYLES[0]);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported("speechSynthesis" in window);
    const loadVoices = () => {
      const v = speechSynthesis.getVoices();
      setVoices(v);
      // Prefer a voice matching the language
      const langVoice = v.find((v) => v.lang.startsWith(language.split("-")[0]));
      if (langVoice) setSelectedVoice(langVoice);
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, [language]);

  const speak = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = voiceStyle.rate;
    utterance.pitch = voiceStyle.pitch;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = () => setIsPlaying(false);
    utterance.onpause = () => setIsPlaying(false);
    utterance.onresume = () => setIsPlaying(true);
    utterance.onstart = () => setIsPlaying(true);
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [text, language, voiceStyle, selectedVoice, isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    if (speechSynthesis.speaking) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        speechSynthesis.pause();
        setIsPlaying(false);
      }
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsPlaying(false);
  }, [isSupported]);

  const skipForward = useCallback(() => {
    if (!isSupported || !utteranceRef.current) return;
    speechSynthesis.cancel();
    setIsPlaying(false);
  }, [isSupported]);

  if (!isSupported) {
    return (
      <div className="text-xs text-muted-foreground p-2 rounded-lg bg-muted/30">
        Voice narration requires a modern browser. Try Chrome or Edge.
      </div>
    );
  }

  return (
    <div className="border border-border/50 rounded-xl bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 p-3">
        {/* Play/Pause */}
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
          onClick={() => (isPlaying ? pause() : speak())}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </Button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium truncate">{voiceStyle.label}</span>
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isPlaying ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30",
              )}
            />
            <span className="text-[10px] text-muted-foreground">
              {isPlaying ? "Speaking" : "Ready"}
            </span>
          </div>
        </div>

        {/* Voice style selector */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] gap-1"
            onClick={() => setShowStylePicker(!showStylePicker)}
          >
            <Volume2 className="h-3 w-3" />
            Style
            <ChevronDown className="h-2.5 w-2.5" />
          </Button>
          {showStylePicker && (
            <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-10 p-1 min-w-[140px]">
              {VOICE_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    setVoiceStyle(style);
                    setShowStylePicker(false);
                  }}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded text-xs transition",
                    voiceStyle.id === style.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-muted-foreground",
                  )}
                >
                  <span className="block font-medium">{style.label}</span>
                  <span className="block text-[10px] opacity-60">Rate: {style.rate}x</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Voice language selector */}
        {voices.length > 1 && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] gap-1"
              onClick={() => setShowVoicePicker(!showVoicePicker)}
              aria-label="Select voice"
            >
              {selectedVoice?.name.split("-")[0] || "Voice"}
              <ChevronDown className="h-2.5 w-2.5" />
            </Button>
            {showVoicePicker && (
              <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-10 p-1 min-w-[180px] max-h-48 overflow-y-auto">
                {voices.map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => {
                      setSelectedVoice(voice);
                      setShowVoicePicker(false);
                    }}
                    className={cn(
                      "w-full text-left px-2 py-1.5 rounded text-[10px] transition",
                      selectedVoice?.name === voice.name
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/50 text-muted-foreground",
                    )}
                  >
                    <span className="block">{voice.name}</span>
                    <span className="block text-[8px] opacity-60">{voice.lang}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
