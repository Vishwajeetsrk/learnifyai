import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Loader2,
  Settings,
  Subtitles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface CustomVideoPlayerProps {
  url: string;
  onReady?: () => void;
  onError?: (e: any) => void;
  onProgress?: (state: { playedSeconds: number; played: number; loaded: number }) => void;
  startSeconds?: number;
  playbackRate?: number;
  onEnded?: () => void;
  thumbnailUrl?: string;
  restrictDownload?: boolean;
  restrictSpeed?: boolean;
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
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const m = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

const QUALITY_LABELS: Record<string, string> = {
  hd2160: "2160p (4K)",
  hd1440: "1440p (2K)",
  hd1080: "1080p",
  hd720: "720p",
  large: "480p",
  medium: "360p",
  small: "240p",
  tiny: "144p",
  auto: "Auto",
};

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

let youtubeApiLoaded = false;

export function CustomVideoPlayer({
  url,
  onReady,
  onError,
  onProgress,
  startSeconds = 0,
  playbackRate: initialRate,
  onEnded,
  thumbnailUrl,
  restrictDownload = false,
  restrictSpeed = false,
}: CustomVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerApiRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerReadyRef = useRef(false);
  const wantsPlayRef = useRef(false);
  const progressRef = useRef(0);
  const durationRef = useRef(0);
  const volumeRef = useRef(1);

  const [hasStarted, setHasStarted] = useState(false);
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(initialRate || 1);
  const [quality, setQuality] = useState("auto");
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);

  const youtubeId = useMemo(() => extractYoutubeId(url), [url]);

  const setHighQuality = useCallback((player: any) => {
    try {
      if (!player) return;
      const qualities = player.getAvailableQualityLevels();
      if (qualities && qualities.length > 0) {
        // Preference array from best to lowest
        const hdQualities = [
          "highres",
          "hd2160",
          "hd1440",
          "hd1080",
          "hd720",
          "large",
          "medium",
          "small",
          "tiny",
        ];
        const best = qualities.find((q: string) => hdQualities.includes(q)) || qualities[0];
        if (best) {
          player.setPlaybackQuality(best);
          setQuality(best);
        }
        setAvailableQualities(qualities);
      }
    } catch (e) {
      console.error("Error setting high quality:", e);
    }
  }, []);

  const handleStartPlayback = useCallback(() => {
    setHasStarted(true);
    setPlaying(true);
    if (youtubeId) {
      const api = playerApiRef.current;
      if (api && playerReadyRef.current) {
        api.playVideo();
        setHighQuality(api);
      } else {
        wantsPlayRef.current = true;
      }
    } else {
      const video = videoRef.current;
      if (video) {
        video.play();
      }
    }
  }, [youtubeId, setHighQuality]);

  // Reset player when URL changes
  useEffect(() => {
    setHasStarted(false);
    setReady(false);
    setPlaying(false);
    setLoading(true);
    setError(false);
    setCurrentTime(0);
    setBuffered(0);
    wantsPlayRef.current = false;
    playerReadyRef.current = false;

    // For HTML5 video elements, we must call .load() on the video element when src changes
    if (!youtubeId && videoRef.current) {
      try {
        videoRef.current.load();
      } catch (err) {
        console.error("Error loading HTML5 video:", err);
      }
    }
  }, [url, youtubeId]);

  useEffect(() => {
    if (!youtubeId) {
      // For HTML5 video, we don't have to wait for YT API
      setReady(false);
      setLoading(false);
      return;
    }
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
          autoplay: 0, // start cued, do not autoplay automatically under our custom overlay
          iv_load_policy: 3,
          cc_load_policy: 1,
          fs: 0,
          start: Math.floor(startSeconds),
        },
        events: {
          onReady: (e: any) => {
            playerApiRef.current = e.target;
            playerReadyRef.current = true;
            e.target.setVolume(volumeRef.current * 100);
            setHighQuality(e.target);
            setReady(true);
            setLoading(false);
            setDuration(e.target.getDuration());
            durationRef.current = e.target.getDuration();
            if (initialRate && initialRate !== 1) {
              e.target.setPlaybackRate(initialRate);
              setPlaybackRate(initialRate);
            }
            if (onReady) onReady();

            if (wantsPlayRef.current) {
              e.target.playVideo();
            }
          },
          onStateChange: (e: any) => {
            const YT = (window as any).YT;
            if (e.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              setLoading(false);
              setHighQuality(e.target);
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
          onPlaybackQualityChange: (e: any) => {
            try {
              setQuality(e.data);
              const api = playerApiRef.current;
              if (api) {
                const qs = api.getAvailableQualityLevels();
                if (qs?.length) setAvailableQualities(qs);
              }
            } catch {}
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
      (window as any)._ytReadyCallbacks = [createPlayer];
      (window as any).onYouTubeIframeAPIReady = () => {
        const callbacks = (window as any)._ytReadyCallbacks || [];
        for (const cb of callbacks) {
          try {
            cb();
          } catch (err) {
            console.error("Error in YT API callback:", err);
          }
        }
        (window as any)._ytReadyCallbacks = [];
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    } else if ((window as any).YT?.Player) {
      createPlayer();
    } else {
      if (!(window as any)._ytReadyCallbacks) {
        (window as any)._ytReadyCallbacks = [];
      }
      (window as any)._ytReadyCallbacks.push(createPlayer);
    }

    return () => {
      if (playerApiRef.current) {
        try {
          playerApiRef.current.destroy();
        } catch (e) {
          console.error("Error destroying YT player:", e);
        }
        playerApiRef.current = null;
      }
    };
  }, [youtubeId]);

  useEffect(() => {
    if (!youtubeId) return;
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
  }, [ready, onProgress, youtubeId]);

  const togglePlay = useCallback(() => {
    if (youtubeId) {
      const api = playerApiRef.current;
      if (!api) return;
      if (playing) api.pauseVideo();
      else api.playVideo();
    } else {
      const video = videoRef.current;
      if (!video) return;
      if (playing) video.pause();
      else video.play();
    }
  }, [playing, youtubeId]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!durationRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const targetTime = pct * durationRef.current;

      if (youtubeId) {
        const api = playerApiRef.current;
        if (api) api.seekTo(targetTime, true);
      } else {
        const video = videoRef.current;
        if (video) video.currentTime = targetTime;
      }
      setCurrentTime(targetTime);
    },
    [youtubeId],
  );

  const toggleMute = useCallback(() => {
    if (youtubeId) {
      const api = playerApiRef.current;
      if (!api) return;
      if (muted) {
        api.unMute();
        setMuted(false);
      } else {
        api.mute();
        setMuted(true);
      }
    } else {
      const video = videoRef.current;
      if (!video) return;
      video.muted = !muted;
      setMuted(!muted);
    }
  }, [muted, youtubeId]);

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      volumeRef.current = v;
      setVolume(v);

      if (youtubeId) {
        const api = playerApiRef.current;
        if (api) api.setVolume(v * 100);
      } else {
        const video = videoRef.current;
        if (video) video.volume = v;
      }

      if (v === 0) {
        setMuted(true);
        if (!youtubeId && videoRef.current) videoRef.current.muted = true;
      } else {
        setMuted(false);
        if (!youtubeId && videoRef.current) videoRef.current.muted = false;
      }
    },
    [youtubeId],
  );

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const handleSpeedChange = useCallback(
    (rate: number) => {
      if (youtubeId) {
        const api = playerApiRef.current;
        if (api) {
          api.setPlaybackRate(rate);
          setPlaybackRate(rate);
        }
      } else {
        const video = videoRef.current;
        if (video) {
          video.playbackRate = rate;
          setPlaybackRate(rate);
        }
      }
    },
    [youtubeId],
  );

  const handleQualityChange = useCallback(
    (q: string) => {
      const api = playerApiRef.current;
      if (api && youtubeId) {
        if (q === "auto") {
          api.setPlaybackQuality("default");
        } else {
          api.setPlaybackQuality(q);
        }
        setQuality(q);
      }
    },
    [youtubeId],
  );

  const toggleCaptions = useCallback(() => {
    const api = playerApiRef.current;
    if (!api || !youtubeId) return;
    if (captionsOn) {
      try {
        api.unloadModule("captions");
        setCaptionsOn(false);
      } catch {
        try {
          api.setOption("captions", "track", {});
          setCaptionsOn(false);
        } catch {}
      }
    } else {
      try {
        api.loadModule("captions");
        api.setOption("captions", "track", { languageCode: "en" });
        setCaptionsOn(true);
      } catch {
        try {
          api.loadModule("captions");
          setCaptionsOn(true);
        } catch {
          try {
            api.setOption("captions", "reload", true);
            setCaptionsOn(true);
          } catch {}
        }
      }
    }
  }, [captionsOn, youtubeId]);

  const handleHtml5Metadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setDuration(video.duration);
    durationRef.current = video.duration;
    if (startSeconds > 0) {
      video.currentTime = startSeconds;
    }
    if (playbackRate && playbackRate !== 1) {
      video.playbackRate = playbackRate;
    }
    setReady(true);
    setLoading(false);
    if (onReady) onReady();
  };

  useEffect(() => {
    if (!playing) {
      setShowControls(true);
      return;
    }
    if (settingsOpen) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [playing, showControls, settingsOpen]);

  const played = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden rounded-xl group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => {
        if (playing && !settingsOpen) setShowControls(false);
      }}
      onContextMenu={restrictDownload ? (e) => e.preventDefault() : undefined}
    >
      {/* Cover Overlay / Custom Play Button */}
      {!hasStarted && (
        <div className="absolute inset-0 z-30 flex items-center justify-center select-none overflow-hidden bg-slate-950">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="Video Cover"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
            </div>
          )}
          {/* Subtle blur + dark overlay */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-all duration-500 group-hover:backdrop-blur-0 group-hover:bg-black/35" />

          {/* Glowing Animated Play Button */}
          <button
            onClick={handleStartPlayback}
            className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary/95 text-primary-foreground border border-white/20 shadow-[0_0_50px_rgba(var(--primary),0.35)] hover:shadow-[0_0_60px_rgba(var(--primary),0.65)] hover:bg-primary transition-all duration-300 hover:scale-110 active:scale-95 group/btn cursor-pointer z-40"
          >
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-75 group-hover/btn:animate-none" />
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary to-indigo-500 opacity-25 blur-md group-hover/btn:opacity-50 transition duration-300" />

            <Play className="h-8 w-8 fill-current ml-1.5 transition-transform duration-300 group-hover/btn:scale-110" />
          </button>
        </div>
      )}

      {/* Video Content */}
      {youtubeId ? (
        <div className="absolute inset-0 w-full h-full" id="youtube-player" />
      ) : (
        <video
          ref={videoRef}
          src={url}
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          controlsList={restrictDownload ? "nodownload" : undefined}
          disablePictureInPicture={restrictDownload}
          onContextMenu={restrictDownload ? (e) => e.preventDefault() : undefined}
          onError={() => {
            setError(true);
            if (onError) onError(null);
          }}
          onLoadedMetadata={handleHtml5Metadata}
          onTimeUpdate={(e) => {
            const ct = e.currentTarget.currentTime;
            setCurrentTime(ct);
            if (e.currentTarget.buffered.length > 0) {
              const bufEnd = e.currentTarget.buffered.end(e.currentTarget.buffered.length - 1);
              setBuffered(durationRef.current > 0 ? bufEnd / durationRef.current : 0);
            }
            if (onProgress) {
              onProgress({
                playedSeconds: ct,
                played: durationRef.current > 0 ? ct / durationRef.current : 0,
                loaded:
                  e.currentTarget.buffered.length > 0
                    ? e.currentTarget.buffered.end(e.currentTarget.buffered.length - 1) /
                      durationRef.current
                    : 0,
              });
            }
          }}
          onEnded={() => {
            setPlaying(false);
            if (onEnded) onEnded();
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}

      {loading && !error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
          <Loader2 className="h-8 w-8 animate-spin text-white/60" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-25 flex flex-col items-center justify-center bg-black/90 text-white gap-3 p-6">
          <p className="text-sm text-center text-muted-foreground">Video failed to load.</p>
          <button
            onClick={() => {
              setError(false);
              setLoading(true);
              // Trigger reload by slightly updating state or just calling load
              if (!youtubeId && videoRef.current) {
                videoRef.current.load();
                if (hasStarted) videoRef.current.play().catch(() => {});
              } else if (youtubeId && playerApiRef.current) {
                playerApiRef.current.loadVideoById(youtubeId);
              }
            }}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Transparent Click-to-Play/Pause Overlay */}
      {hasStarted && <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />}

      {/* Video Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent px-3 pt-8 pb-3">
          <div
            className="relative h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 group/progress hover:h-2.5 transition-all"
            onClick={handleSeek}
          >
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              style={{ width: `${played * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full shadow opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${played * 100}%` }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-white">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-white/80 cursor-pointer shrink-0"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <span className="text-[11px] font-mono text-white/80 tabular-nums shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex items-center gap-1 ml-1 shrink-0">
              <button onClick={toggleMute} className="p-1 hover:text-white/80 cursor-pointer">
                {muted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="w-14 h-1 accent-white cursor-pointer"
              />
            </div>

            <span className="text-[11px] text-white/50 ml-1">{playbackRate}x</span>

            <div className="flex-1 min-w-0" />

            {youtubeId && (
              <button
                onClick={toggleCaptions}
                className={`p-1 hover:text-white/80 cursor-pointer shrink-0 ${captionsOn ? "text-primary" : "text-white/80"}`}
                title={captionsOn ? "Disable captions" : "Enable captions"}
              >
                <Subtitles className="h-4 w-4" />
              </button>
            )}

            <div className="relative shrink-0">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="p-1 hover:text-white/80 cursor-pointer"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              {settingsOpen && (
                <div
                  className="absolute bottom-full right-0 mb-2 w-52 bg-black/95 rounded-lg border border-white/10 shadow-xl overflow-hidden"
                  onMouseEnter={() => setShowControls(true)}
                >
                  <div className="px-3 py-2 border-b border-white/10">
                    <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                      Speed
                    </span>
                    <div className="grid grid-cols-4 gap-1 mt-1.5">
                      {SPEEDS.map((s) => {
                        const isLocked = restrictSpeed && s > 1.25;
                        return (
                          <button
                            key={s}
                            onClick={() => {
                              if (isLocked) {
                                toast.info("Higher speeds are locked on this course. Upgrade or contact the instructor to unlock.");
                              } else {
                                handleSpeedChange(s);
                              }
                            }}
                            className={`text-xs rounded px-1 py-1 transition flex items-center justify-center gap-0.5 ${
                              playbackRate === s
                                ? "bg-primary text-white"
                                : isLocked
                                  ? "text-white/30 cursor-not-allowed bg-white/5"
                                  : "text-white/70 hover:bg-white/10"
                            }`}
                            title={isLocked ? "Speed locked" : undefined}
                          >
                            {s}x
                            {isLocked && <Lock className="h-2.5 w-2.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {youtubeId && (
                    <div className="px-3 py-2">
                      <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">
                        Quality
                      </span>
                      <div className="space-y-0.5 mt-1.5 max-h-28 overflow-y-auto">
                        {["auto", ...availableQualities].map((q) => (
                          <button
                            key={q}
                            onClick={() => handleQualityChange(q)}
                            className={`block w-full text-left text-xs rounded px-2 py-1 transition ${
                              quality === q
                                ? "bg-primary text-white"
                                : "text-white/70 hover:bg-white/10"
                            }`}
                          >
                            {QUALITY_LABELS[q] || q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1 hover:text-white/80 cursor-pointer shrink-0"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
