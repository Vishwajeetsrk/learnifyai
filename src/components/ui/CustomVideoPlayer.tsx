import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, AlertCircle } from "lucide-react";

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

export function CustomVideoPlayer({ src, poster, autoPlay = false }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setHasError(false);
    setErrorMsg("");
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);

    const onTimeUpdate = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
    };
    const onLoadedMetadata = () => setDuration(video.duration);
    const onProgress = () => {
      if (video.buffered.length > 0 && video.duration) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
      }
    };
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setHasError(true);
      const err = video.error;
      if (err?.code === MediaError.MEDIA_ERR_ABORTED) setErrorMsg("Video loading aborted");
      else if (err?.code === MediaError.MEDIA_ERR_NETWORK) setErrorMsg("Network error while loading video");
      else if (err?.code === MediaError.MEDIA_ERR_DECODE) setErrorMsg("Video decoding error");
      else setErrorMsg("This video format is not supported");
    };
    const onCanPlay = () => {
      if (autoPlay && isMuted) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("progress", onProgress);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);
    video.addEventListener("canplay", onCanPlay);

    video.load();

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
      video.removeEventListener("canplay", onCanPlay);
    };
  }, [src, autoPlay]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video || hasError) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [hasError]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const toggleFullscreen = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pct * video.duration;
  }, [duration]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    } else {
      setShowControls(true);
    }
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [isPlaying]);

  const formatTime = (t: number) => {
    if (!t || isNaN(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black overflow-hidden"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => { if (isPlaying) hideTimerRef.current = setTimeout(() => setShowControls(false), 1500); }}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        playsInline
        preload="metadata"
        muted={isMuted}
      />

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30" onClick={(e) => e.stopPropagation()}>
          <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
          <p className="text-white text-sm font-medium mb-1">Unable to play video</p>
          <p className="text-white/60 text-xs">{errorMsg}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHasError(false);
              setErrorMsg("");
              const video = videoRef.current;
              if (video) { video.load(); video.play().catch(() => {}); }
            }}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Center Play Button */}
      {!hasError && (
        <div
          className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-300 ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-black/30" />
          <button
            className="relative z-10 h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-white/95 text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-2xl"
            onClick={(e) => { e.stopPropagation(); togglePlay(e); }}
            aria-label="Play video"
          >
            <Play className="h-6 w-6 sm:h-7 sm:w-7 md:h-9 md:w-9 ml-0.5" fill="currentColor" />
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      {!hasError && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${
            showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-gradient-to-t from-black/95 via-black/60 to-transparent px-3 pb-2 pt-8 sm:px-5 sm:pb-3 md:pb-4">
            {/* Progress */}
            <div
              ref={progressRef}
              className="h-1.5 sm:h-2 w-full bg-white/20 rounded-full cursor-pointer relative group/prog"
              onClick={handleSeek}
            >
              <div className="absolute inset-0 bg-white/10 rounded-full" />
              <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full transition-[width] duration-150" style={{ width: `${buffered}%` }} />
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover/prog:opacity-100 transition-opacity"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between text-white mt-1.5 sm:mt-2">
              <div className="flex items-center gap-2.5 sm:gap-4">
                <button onClick={togglePlay} className="hover:text-primary transition-colors" aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />}
                </button>
                <button onClick={toggleMute} className="hover:text-primary transition-colors" aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted ? <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" /> : <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
                <span className="text-[10px] sm:text-xs font-mono opacity-80 tabular-nums">
                  {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                </span>
              </div>
              <button onClick={toggleFullscreen} className="hover:text-primary transition-colors" aria-label="Fullscreen">
                {isFullscreen ? <Minimize className="h-4 w-4 sm:h-5 sm:w-5" /> : <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
