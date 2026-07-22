import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Volume2, VolumeX, Play, Pause, RotateCcw, Languages, Sparkles } from "lucide-react";
import { toast } from "sonner";

export interface VoiceOption {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: VoiceOption[] = [
  { code: "en-US", name: "English (US)", flag: "EN" },
  { code: "en-IN", name: "English (India)", flag: "EN-IN" },
  { code: "hi-IN", name: "Hindi (हिंदी)", flag: "HI" },
  { code: "es-ES", name: "Spanish (Español)", flag: "ES" },
  { code: "fr-FR", name: "French (Français)", flag: "FR" },
  { code: "de-DE", name: "German (Deutsch)", flag: "DE" },
  { code: "ja-JP", name: "Japanese (日本語)", flag: "JA" },
];

interface VoiceNarrationPlayerProps {
  text: string;
  title?: string;
  className?: string;
}

export function VoiceNarrationPlayer({ text, title, className }: VoiceNarrationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLang, setSelectedLang] = useState<VoiceOption>(SUPPORTED_LANGUAGES[0]);
  const [rate, setRate] = useState<number>(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const cleanTextForSpeech = (raw: string) => {
    return raw
      .replace(/```[\s\S]*?```/g, " [Code Block] ") // Skip long raw code blocks in speech
      .replace(/[#*`_~]/g, "")
      .replace(/\n+/g, " ")
      .trim();
  };

  const handlePlay = () => {
    if (!synthRef.current) {
      toast.error("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    synthRef.current.cancel(); // Stop any ongoing speech

    const spokenText = cleanTextForSpeech(text);
    if (!spokenText) {
      toast.error("No text available to speak.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = selectedLang.code;
    utterance.rate = rate;

    // Pick matching voice if available
    const voice = availableVoices.find(
      (v) => v.lang.toLowerCase() === selectedLang.code.toLowerCase(),
    );
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (err) => {
      console.error("TTS Error:", err);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    toast.success(`Playing voice narration (${selectedLang.name})`);
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const toggleRate = () => {
    const rates = [0.75, 1.0, 1.25, 1.5];
    const nextIndex = (rates.indexOf(rate) + 1) % rates.length;
    const newRate = rates[nextIndex];
    setRate(newRate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-background/80 backdrop-blur-md shadow-sm ${className || ""}`}
    >
      <div className="flex items-center gap-1 text-primary">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span className="text-xs font-medium">Voice AI</span>
      </div>

      <div className="h-4 w-px bg-border/60" />

      {/* Language Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1 hover:bg-muted font-mono"
          >
            <Languages className="w-3 h-3 text-muted-foreground" />
            <span>{selectedLang.flag}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang);
                if (isPlaying) {
                  handleStop();
                }
              }}
              className="text-xs flex items-center justify-between cursor-pointer"
            >
              <span>{lang.name}</span>
              <Badge variant="outline" className="text-[10px]">
                {lang.flag}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Speed Rate Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleRate}
        className="h-7 px-2 text-xs font-mono hover:bg-muted"
        title="Adjust speech speed"
      >
        {rate}x
      </Button>

      {/* Play/Pause Button */}
      {isPlaying ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePause}
          className="h-7 w-7 p-0 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Pause className="w-3.5 h-3.5" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={handlePlay}
          className="h-7 w-7 p-0 rounded-full shadow-sm"
        >
          <Play className="w-3.5 h-3.5 ml-0.5" />
        </Button>
      )}

      {/* Stop / Reset Button */}
      {(isPlaying || isPaused) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleStop}
          className="h-7 w-7 p-0 rounded-full hover:bg-muted"
        >
          <RotateCcw className="w-3 h-3 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
