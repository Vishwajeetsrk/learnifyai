import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";

interface CustomVideoPlayerProps {
  url: string;
  onReady?: () => void;
  onError?: (e: any) => void;
  onProgress?: (state: { playedSeconds: number; played: number; loaded: number }) => void;
  startSeconds?: number;
  playbackRate?: number;
  onEnded?: () => void;
}

function formatTime(seconds: number) {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function extractYoutubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

let youtubeApiLoaded = false;

export function CustomVideoPlayer({
  url,
  onReady,
  onError,
  onProgress,
  startSeconds = 0,
  onEnded,
}: CustomVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerApiRef = useRef<any>(null);
  const playerReadyRef = useRef(false);
  const progressRef = useRef(0);
  const durationRef = useRef(0);
  const volumeRef = useRef(1);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const youtubeId = useMemo(() => extractYoutubeId(url), [url]);

  // Load YouTube IFrame API and create player
  useEffect(() => {
    if (!youtubeId) return;
    playerReadyRef.current = false;

    const createPlayer = () => {
      if (!(window as any).YT?.Player) return;
      const playerDiv = document.getElementById("youtube-player");
      if (!playerDiv) return;
      playerDiv.innerHTML = "";
      const yt = new (window as any).YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: youtubeId,
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          autoplay: 1,
          start: Math.floor(startSeconds),
        },
        events: {
          onReady: (e: any) => {
            playerApiRef.current = e.target;
            playerReadyRef.current = true;
            e.target.setVolume(volumeRef.current * 100);
            setReady(true);
            setLoading(false);
            setDuration(e.target.getDuration());
            durationRef.current = e.target.getDuration();
            if (onReady) onReady();
          },
          onStateChange: (e: any) => {
            const YT = (window as any).YT;
            if (e.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              setLoading(false);
            } else if (e.data === YT.PlayerState.PAUSED) {
              setPlaying(false);
            } else if (e.data === YT.PlayerState.ENDED) {
              setPlaying(false);
              if (onEnded) onEnded();
            } else if (e.data === YT.PlayerState.BUFFERING) {
              setLoading(true);
            } else if (e.data === YT.PlayerState.CUED) {
              setLoading(false);
            }
          },
          onError: () => {
            setError(true);
            setLoading(false);
            if (onError) onError(null);
          },
        },
      });
    };

    if (!youtubeApiLoaded) {
      youtubeApiLoaded = true;
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onload = () => {
        (window as any).onYouTubeIframeAPIReady = createPlayer;
      };
      document.head.appendChild(tag);
    } else if ((window as any).YT?.Player) {
      createPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = createPlayer;
    }
  }, [youtubeId]);

  // Progress polling
  useEffect(() => {
    if (!ready || !playerApiRef.current) return;
    const interval = setInterval(() => {
      try {
        const api = playerApiRef.current;
        if (!api || !playerReadyRef.current) return;
        const ct = api.getCurrentTime();
        const dur = api.getDuration();
        if (isFinite(ct)) {
          setCurrentTime(ct);
          setBuffered(api.getVideoLoadedFraction() || 0);
        }
        if (isFinite(dur)) setDuration(dur);
        if (onProgress) {
          const played = dur > 0 ? ct / dur : 0;
          onProgress({ playedSeconds: ct, played, loaded: api.getVideoLoadedFraction() || 0 });
        }
      } catch {}
    }, 500);
    return () => clearInterval(interval);
  }, [ready, onProgress]);

  const togglePlay = useCallback(() => {
    const api = playerApiRef.current;
    if (!api) return;
    if (playing) api.pauseVideo();
    else api.playVideo();
  }, [playing]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const api = playerApiRef.current;
    if (!api || !durationRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    api.seekTo(pct * durationRef.current, true);
    setCurrentTime(pct * durationRef.current);
  }, []);

  const toggleMute = useCallback(() => {
    const api = playerApiRef.current;
    if (!api) return;
    if (muted) { api.unMute(); setMuted(false); }
    else { api.mute(); setMuted(true); }
  }, [muted]);

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    volumeRef.current = v;
    setVolume(v);
    const api = playerApiRef.current;
    if (api) api.setVolume(v * 100);
    if (v === 0) setMuted(true);
    else setMuted(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  // Controls auto-hide
  useEffect(() => {
    if (!playing) { setShowControls(true); return; }
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [playing, showControls]);

  const played = duration > 0 ? currentTime / duration : 0;

  // Non-YouTube fallback
  if (!youtubeId) {
    return (
      <div ref={containerRef} className="relative w-full aspect-video bg-black overflow-hidden rounded-xl">
        <video
          src={url}
          className="w-full h-full"
          controls
          playsInline
          autoPlay
          onError={() => { setError(true); if (onError) onError(null); }}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            durationRef.current = e.currentTarget.duration;
            if (startSeconds > 0) e.currentTarget.currentTime = startSeconds;
            setReady(true);
            setLoading(false);
            if (onReady) onReady();
          }}
          onTimeUpdate={(e) => {
            const ct = e.currentTarget.currentTime;
            setCurrentTime(ct);
            if (onProgress) onProgress({ playedSeconds: ct, played: ct / e.currentTarget.duration, loaded: 0 });
          }}
          onEnded={onEnded}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden rounded-xl group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
    >
      {/* YouTube player container */}
      <div className="absolute inset-0" id="youtube-player" />

      {loading && !error && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/90 text-white gap-3 p-6">
          <p className="text-sm text-center text-muted-foreground">Video failed to load.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Click to play/pause */}
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

      {/* Custom controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pt-8 pb-3">
          {/* Progress bar */}
          <div
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress hover:h-2.5 transition-all"
            onClick={handleSeek}
          >
            <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${played * 100}%` }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${played * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-2 text-white">
            <button onClick={togglePlay} className="p-1 hover:text-white/80 cursor-pointer shrink-0">
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <span className="text-[11px] font-mono text-white/80 tabular-nums shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex items-center gap-1.5 ml-2 shrink-0">
              <button onClick={toggleMute} className="p-1 hover:text-white/80 cursor-pointer">
                {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="w-16 h-1 accent-white cursor-pointer"
              />
            </div>

            <div className="flex-1 min-w-0" />

            <button onClick={toggleFullscreen} className="p-1 hover:text-white/80 cursor-pointer shrink-0">
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}