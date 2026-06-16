import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  ClosedCaption,
  Loader2,
  Youtube
} from "lucide-react";

interface CustomVideoPlayerProps {
  url: string;
  playing?: boolean;
  onReady?: () => void;
  onError?: (e: any) => void;
  onProgress?: (state: { playedSeconds: number; played: number; loaded: number }) => void;
  startSeconds?: number;
  playbackRate?: number;
  channelId?: string | null;
  onEnded?: () => void;
}

export function CustomVideoPlayer({
  url,
  playing: initialPlaying = false,
  onReady,
  onError,
  onProgress,
  startSeconds = 0,
  playbackRate = 1,
  channelId,
  onEnded,
}: CustomVideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(initialPlaying);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [fetchedChannelUrl, setFetchedChannelUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId && url) {
      fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.author_url) setFetchedChannelUrl(data.author_url);
        })
        .catch(() => {});
    }
  }, [channelId, url]);

  // Removed initialPlaying sync effect to prevent parent updates from pausing active playback

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(screenfull.isFullscreen);
    };
    if (screenfull.isEnabled) {
      screenfull.on("change", handleFullscreenChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", handleFullscreenChange);
      }
    };
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    setControlsTimeout(setTimeout(() => setShowControls(false), 2500));
  };

  const handleMouseLeave = () => {
    if (playing) {
      setShowControls(false);
    }
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (value: number[]) => {
    const v = value[0];
    setVolume(v);
    setMuted(v === 0);
  };

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  const handleSeek = (value: number[]) => {
    const p = value[0];
    setPlayed(p);
    if (playerRef.current) {
      const player: any = playerRef.current;
      if (typeof player.seekTo === "function") {
        player.seekTo(p, "fraction");
      } else {
        player.currentTime = p * duration;
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (screenfull.isEnabled && containerRef.current) {
      screenfull.toggle(containerRef.current);
    }
  };

  const handleProgress = (state: { playedSeconds: number; played: number; loaded: number }) => {
    if (onProgress) onProgress(state);
    setPlayed(state.played);
  };

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        {/* @ts-ignore - ReactPlayer typings can be overly strict about refs/components */}
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          light={true}
          controls={true}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          onReady={() => {
            setReady(true);
            if (startSeconds > 0 && playerRef.current) {
              const player: any = playerRef.current;
              if (typeof player.seekTo === "function") {
                player.seekTo(startSeconds, "seconds");
              } else {
                player.currentTime = startSeconds;
              }
            }
            if (onReady) onReady();
          }}
          onError={onError}
          onProgress={handleProgress as any}
          onDuration={(d: number) => setDuration(d)}
          onEnded={onEnded}
          config={{
            youtube: {
              playerVars: {
                modestbranding: 1,
                rel: 0,
              },
            },
          } as any}
          className="react-player"
        />
      </div>

      {/* Controls Overlay - hidden for native player compatibility */}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-4 transition-opacity duration-300 pointer-events-none",
          "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
          showControls && !playing ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Native controls are used instead */}
      </div>
    </div>
  );
}
