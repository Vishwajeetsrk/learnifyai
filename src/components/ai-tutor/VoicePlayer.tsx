import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getNarrationText } from "./artifactParser";

interface VoicePlayerProps {
  content: string;
}

export function VoicePlayer({ content }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cleanText = getNarrationText(content);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    if (isPlaying) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cycleRate = () => {
    const nextRate = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 0.75 : 1;
    setRate(nextRate);
    if (isPlaying) {
      handleStop();
    }
  };

  if (!cleanText || typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground shadow-xs">
      <button
        onClick={handleToggle}
        className="flex items-center gap-1 text-xs font-medium hover:text-foreground cursor-pointer transition-colors"
        aria-label={isPlaying ? (isPaused ? "Resume voice" : "Pause voice") : "Listen to explanation"}
      >
        {isPlaying && !isPaused ? (
          <Pause className="h-3.5 w-3.5 text-primary" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
        <span>{isPlaying ? (isPaused ? "Paused" : "Listening") : "Listen"}</span>
      </button>

      {isPlaying && (
        <div className="flex items-center gap-0.5 px-1">
          <span className="h-2.5 w-0.5 rounded-full bg-primary animate-pulse" />
          <span className="h-3.5 w-0.5 rounded-full bg-primary animate-pulse delay-75" />
          <span className="h-2 w-0.5 rounded-full bg-primary animate-pulse delay-150" />
        </div>
      )}

      {isPlaying && (
        <button
          onClick={handleStop}
          className="hover:text-destructive cursor-pointer text-muted-foreground"
          title="Stop narration"
        >
          <VolumeX className="h-3 w-3" />
        </button>
      )}

      <button
        onClick={cycleRate}
        className="text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer px-1 rounded bg-background/50 border border-border/30"
        title="Playback speed"
      >
        {rate}×
      </button>
    </div>
  );
}
