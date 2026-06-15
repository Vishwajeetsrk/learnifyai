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
  const playerRef = useRef<ReactPlayer>(null);
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
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {/* ReactPlayer Wrapper */}
      <div className="absolute inset-0 pointer-events-none">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
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
          onProgress={handleProgress}
          onDuration={(d) => setDuration(d)}
          onEnded={onEnded}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                disablekb: 1,
              },
            },
          }}
          className="react-player"
        />
      </div>

      {/* Click overlay to play/pause */}
      <div className="absolute inset-0 z-10" onClick={handlePlayPause} />

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-4 transition-opacity duration-300",
          "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
          showControls || !playing ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-4 mb-2">
          <Slider
            value={[played]}
            min={0}
            max={1}
            step={0.001}
            onValueChange={handleSeek}
            className="cursor-pointer flex-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-primary transition"
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handleToggleMute} className="text-white hover:text-primary transition">
                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <div className="w-20 hidden sm:block">
                <Slider
                  value={[muted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
            <div className="text-white text-xs font-medium">
              {formatTime(played * duration)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4">

            <button className="text-white hover:text-primary transition" title="Subtitles / CC">
              <ClosedCaption className="h-5 w-5" />
            </button>
            <button className="text-white hover:text-primary transition" title="Settings">
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={handleToggleFullscreen}
              className="text-white hover:text-primary transition"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
