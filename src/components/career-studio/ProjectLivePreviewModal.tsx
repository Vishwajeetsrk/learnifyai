import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  X,
  RotateCcw,
  ShieldAlert,
  Loader2,
  Code2,
} from "lucide-react";
import { TechnologyIcon } from "@/components/icons/TechnologyIcon";
import { SocialIcon } from "@/components/icons/SocialIcon";

export interface ProjectPreviewData {
  name: string;
  description?: string;
  techStack?: string;
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
}

export interface ProjectLivePreviewModalProps {
  project?: ProjectPreviewData | null;
  isOpen?: boolean;
  open?: boolean;
  projectName?: string;
  liveUrl?: string;
  githubUrl?: string;
  description?: string;
  techStack?: string;
  imageUrl?: string;
  onClose: () => void;
}

export function ProjectLivePreviewModal(props: ProjectLivePreviewModalProps) {
  const {
    project: propProject,
    isOpen,
    open,
    projectName,
    liveUrl: propLiveUrl,
    githubUrl,
    description,
    techStack,
    imageUrl,
    onClose,
  } = props;

  const project: ProjectPreviewData | null =
    propProject ??
    (projectName || propLiveUrl
      ? {
          name: projectName || "Live Project Preview",
          liveUrl: propLiveUrl,
          githubUrl,
          description,
          techStack,
          imageUrl,
        }
      : null);

  const isVisible = (isOpen !== false && open !== false) && Boolean(project);

  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const liveUrl = project?.liveUrl?.trim() || "";
  const hasLiveUrl = Boolean(liveUrl && /^https?:\/\//i.test(liveUrl));

  useEffect(() => {
    if (!isVisible || !project || !hasLiveUrl) {
      setIsLoading(false);
      setIsBlocked(false);
      return;
    }

    setIsLoading(true);
    setIsBlocked(false);

    // If iframe doesn't finish loading within 8 seconds or is blocked by CSP / X-Frame-Options
    timerRef.current = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) {
          setIsBlocked(true);
          return false;
        }
        return false;
      });
    }, 7000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [project, iframeKey, hasLiveUrl]);

  if (!isVisible || !project) return null;

  const techList = (project.techStack || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const getViewportWidth = () => {
    switch (viewport) {
      case "mobile":
        return "390px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 shrink-0 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <Code2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold truncate text-white">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 truncate hidden sm:block">
                  {project.description || "Interactive Live Preview"}
                </p>
              </div>
            </div>

            {/* Viewport Toggles (Desktop / Tablet / Mobile) */}
            {hasLiveUrl && !isBlocked && (
              <div className="hidden md:flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  className={`p-1.5 rounded-lg text-xs font-medium transition ${
                    viewport === "desktop"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Desktop View (100%)"
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  className={`p-1.5 rounded-lg text-xs font-medium transition ${
                    viewport === "tablet"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  className={`p-1.5 rounded-lg text-xs font-medium transition ${
                    viewport === "mobile"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Mobile View (390px)"
                >
                  <Smartphone className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIframeKey((k) => k + 1);
                    setIsLoading(true);
                    setIsBlocked(false);
                  }}
                  className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Reload Live Preview"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                >
                  <SocialIcon platform="github" size={14} />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {hasLiveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-xs transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Live</span>
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Content Area */}
          <div className="flex-1 min-h-0 bg-slate-950/70 flex flex-col items-center justify-center overflow-auto p-2 sm:p-4 relative">
            {hasLiveUrl ? (
              isBlocked ? (
                /* Friendly Fallback when X-Frame-Options or CSP blocks embedding */
                <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-white">
                      External Embedding Restricted
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This website&apos;s security policy prevents in-app iframe embedding. You can view it directly in full resolution.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Live Website
                    </a>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                      >
                        <SocialIcon platform="github" size={14} />
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                /* Live Sandboxed Iframe Container */
                <div
                  className="h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative transition-all duration-300 flex flex-col"
                  style={{ width: getViewportWidth(), maxWidth: "100%" }}
                >
                  {isLoading && (
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-2 z-10">
                      <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                      <span className="text-xs font-medium text-slate-400 font-mono">
                        Connecting to live deployment...
                      </span>
                    </div>
                  )}
                  <iframe
                    key={iframeKey}
                    src={liveUrl}
                    title={project.name}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    onLoad={() => {
                      if (timerRef.current) clearTimeout(timerRef.current);
                      setIsLoading(false);
                      setIsBlocked(false);
                    }}
                    onError={() => {
                      setIsLoading(false);
                      setIsBlocked(true);
                    }}
                    className="w-full h-full border-none bg-white"
                  />
                </div>
              )
            ) : (
              /* No Live URL Provided */
              <div className="max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                  <Code2 className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-white">{project.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {project.description || "Production-grade project."}
                  </p>
                </div>
                {project.githubUrl && (
                  <div className="pt-2">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                    >
                      <SocialIcon platform="github" size={14} />
                      View on GitHub
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer (Tech Stack & Meta) */}
          {techList.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Technologies:
              </span>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {techList.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 shrink-0"
                  >
                    <TechnologyIcon name={tech} size={14} />
                    <span>{tech}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
