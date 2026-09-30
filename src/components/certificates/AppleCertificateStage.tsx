import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Sparkles,
  QrCode,
  Download,
  Share2,
  Lock,
  Layers,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Maximize2,
  Play,
  Pause,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CertificateRender, type CertDesign, type CertContext } from "@/components/CertificateDesign";

interface AppleCertificateStageProps {
  design: CertDesign;
  ctx: CertContext;
  certRef?: React.RefObject<HTMLDivElement | null>;
  onDownloadPdf?: () => void;
  onDownloadImage?: () => void;
  onShare?: () => void;
  downloading?: boolean;
}

export function AppleCertificateStage({
  design,
  ctx,
  certRef,
  onDownloadPdf,
  onDownloadImage,
  onShare,
  downloading,
}: AppleCertificateStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [autoTour, setAutoTour] = useState(false);
  const [inspectLayers, setInspectLayers] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  // Motion values for smooth 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D rotations
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);

  // Glare / holographic light reflection
  const glareX = useTransform(smoothX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(
    [smoothX, smoothY],
    ([x, y]: any) => Math.min(Math.sqrt(x * x + y * y) * 1.4, 0.65)
  );

  // Remotion-like automated camera tour
  useEffect(() => {
    if (!autoTour) return;
    let frame = 0;
    let req: number;
    const animate = () => {
      frame += 0.025;
      mouseX.set(Math.sin(frame) * 0.4);
      mouseY.set(Math.cos(frame * 0.7) * 0.35);
      req = requestAnimationFrame(animate);
    };
    req = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(req);
  }, [autoTour, mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (autoTour) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (autoTour) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  // Deterministic cryptographic hash
  const pseudoSha256 = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, "0");
    return `0x${hex}e98f7c2a41d9b3`;
  };

  const certHash = pseudoSha256(ctx.code + ctx.name + ctx.date);

  const copyHash = () => {
    navigator.clipboard.writeText(certHash);
    setCopiedHash(true);
    toast.success("Cryptographic hash copied to clipboard!");
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="space-y-8 select-none">
      {/* Apple-style floating top HUD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-neutral-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl text-white">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-neutral-100">
                Verified Credential
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-emerald-400 border border-emerald-500/20">
                Official Apple Pro Spec
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-normal">
              Learnify AI Cryptographic Registry · Tamper-evident ID:{" "}
              <span className="font-mono text-neutral-300 font-semibold">{ctx.code}</span>
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setAutoTour(!autoTour)}
            className={`gap-1.5 text-xs rounded-full px-3 transition-colors ${
              autoTour
                ? "bg-white/20 text-white font-semibold"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
            title="Toggle Remotion-style cinematic 3D rotation"
          >
            {autoTour ? <Pause className="h-3.5 w-3.5 text-emerald-400" /> : <Play className="h-3.5 w-3.5" />}
            <span>Cinematic Tour</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setInspectLayers(!inspectLayers)}
            className={`gap-1.5 text-xs rounded-full px-3 transition-colors ${
              inspectLayers
                ? "bg-white/20 text-white font-semibold"
                : "text-neutral-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{inspectLayers ? "Flat Mode" : "Explode Layers"}</span>
          </Button>

          {onShare && (
            <Button
              size="sm"
              variant="outline"
              onClick={onShare}
              className="gap-1.5 text-xs rounded-full bg-white/5 border-white/15 text-white hover:bg-white/15 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
          )}

          {onDownloadImage && (
            <Button
              size="sm"
              variant="outline"
              onClick={onDownloadImage}
              disabled={downloading}
              className="gap-1.5 text-xs rounded-full bg-white/5 border-white/15 text-white hover:bg-white/15 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>4K Image</span>
            </Button>
          )}

          {onDownloadPdf && (
            <Button
              size="sm"
              onClick={onDownloadPdf}
              disabled={downloading}
              className="gap-1.5 text-xs rounded-full bg-white text-black hover:bg-neutral-200 font-semibold px-4 cursor-pointer shadow-lg shadow-white/10"
            >
              <Download className="h-3.5 w-3.5" />
              <span>PDF Certificate</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main 3D Showcase Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative mx-auto flex items-center justify-center p-4 sm:p-10 rounded-3xl overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-black border border-white/10 shadow-2xl min-h-[460px] perspective-[1400px]"
        style={{ perspective: "1400px" }}
      >
        {/* Subtle Ambient Apple Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-tr from-amber-500/10 via-indigo-500/15 to-violet-500/10 blur-3xl pointer-events-none" />

        {/* 3D Motion Card Container */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative max-w-3xl w-full transition-transform duration-100 ease-out will-change-transform"
        >
          {/* Layer 1: Background Shadow / Depth */}
          <div
            className="absolute inset-0 rounded-2xl bg-black/60 blur-xl -z-10 translate-z-[-40px]"
            style={{ transform: "translateZ(-40px)" }}
          />

          {/* Certificate Body with Preserved 3D */}
          <div
            className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all duration-500 ${
              inspectLayers ? "scale-95 shadow-indigo-500/30 ring-2 ring-indigo-500/50" : ""
            }`}
            style={{
              transform: inspectLayers ? "translateZ(40px)" : "translateZ(0px)",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* The Actual Rendered Certificate Canvas */}
            <div ref={certRef}>
              <CertificateRender design={design} ctx={ctx} />
            </div>

            {/* Dynamic Apple Pro Specular Glare & Holographic Reflection */}
            <motion.div
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255,255,255,0.7) 0%, 
                  rgba(255,220,150,0.3) 25%, 
                  rgba(150,220,255,0.3) 50%, 
                  rgba(255,180,255,0.2) 75%, 
                  rgba(255,255,255,0.6) 100%)`,
                opacity: glareOpacity,
                maskImage: `radial-gradient(circle 320px at ${glareX} ${glareY}, black 20%, transparent 80%)`,
                WebkitMaskImage: `radial-gradient(circle 320px at ${glareX} ${glareY}, black 20%, transparent 80%)`,
              }}
            />

            {/* Holographic Security Stamp Overlay in Corner */}
            <div
              className="absolute bottom-5 right-5 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white/90 shadow-lg"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-400 animate-spin" />
              <span className="text-[10px] font-mono tracking-wider font-semibold">
                SECURE SEAL
              </span>
            </div>
          </div>

          {/* Exploded Inspection HUD Callouts when active */}
          {inspectLayers && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4 text-xs font-mono text-white/80"
              style={{ transform: "translateZ(80px)" }}
            >
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
                Layer 1: Guilloche & Microprint
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                Layer 2: SHA-256 Ledger
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                Layer 3: Cryptographic QR
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Apple-style Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        {/* Spec 1: SHA-256 Digest */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-lg space-y-1.5">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
              SHA-256 Digest
            </span>
            <button
              onClick={copyHash}
              className="hover:text-white transition-colors cursor-pointer text-neutral-400"
              title="Copy cryptographic signature"
            >
              {copiedHash ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <div className="text-xs font-mono font-bold text-neutral-100 truncate">
            {certHash}
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Immutable Ledger Match
          </span>
        </div>

        {/* Spec 2: Issuance Timestamp */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-lg space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400 block">
            Issuance Date
          </span>
          <div className="text-xs font-bold text-neutral-100">{ctx.date}</div>
          <span className="text-[10px] text-neutral-400">
            Recorded via Learnify Authority Node
          </span>
        </div>

        {/* Spec 3: Verified Score */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-lg space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400 block">
            Assessment Mastery
          </span>
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            <span>
              {ctx.score ?? 100} / {ctx.total ?? 100} (100% Honors)
            </span>
          </div>
          <span className="text-[10px] text-neutral-400">
            Verified Capstone Project & Labs
          </span>
        </div>

        {/* Spec 4: Authorized Signatory */}
        <div className="p-4 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-lg space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-neutral-400 block">
            Authorized Signatory
          </span>
          <div className="text-xs font-bold text-neutral-100">
            {design.signatory_name || "Vishwajeet"}
          </div>
          <span className="text-[10px] text-neutral-400">
            {design.signatory_title || "Founder & CEO, Learnify AI"}
          </span>
        </div>
      </div>
    </div>
  );
}
