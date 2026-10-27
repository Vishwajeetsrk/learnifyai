"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Check,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sliders,
  Palette,
  CheckCircle2,
  Lock,
  Layers,
  FileCheck2,
  Star,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { downloadElementAsPdf, downloadElementAsImage } from "@/lib/certificate-pdf";
import logoMarkUrl from "@/assets/learnify-mark.png?url";
import logoLightUrl from "@/assets/learnify-logo-light.png?url";
import logoDarkUrl from "@/assets/learnify-logo-dark.png?url";
import { IndianRupeeSecurityStamp } from "@/components/certificate/IndianRupeeSecurityStamp";
import confetti from "canvas-confetti";

export type CertificateThemeKey =
  | "parchment"
  | "learnify"
  | "obsidian"
  | "emerald"
  | "sapphire"
  | "platinum";

export type CertificateSealType =
  | "indian_rupee"
  | "gold_foil"
  | "crypto_attested"
  | "crimson_ribbon"
  | "star_excellence";

export type CertificateBorderType = "banknote" | "modern_minimal" | "geometric";

export interface EngravedCertificateTemplateProps {
  initialRecipientName?: string;
  initialCourseTitle?: string;
  initialIssueDate?: string;
  initialCredentialId?: string;
  initialSignatoryName?: string;
  initialSignatoryTitle?: string;
  initialHonorsDistinction?: string;
  initialSecondSignatoryName?: string;
  initialSecondSignatoryTitle?: string;
  initialTheme?: CertificateThemeKey;
  initialSealType?: CertificateSealType;
  initialBorderType?: CertificateBorderType;
  logoUrl?: string;
  qrDataUrl?: string;
  isDemo?: boolean;
  watermarkText?: string;
  className?: string;
  onDownloadPdf?: () => void;
  onDownloadImage?: () => void;
  downloading?: boolean;
}

interface ThemeConfig {
  name: string;
  bgGradient: string;
  plateColor: string;
  inkColor: string;
  inkColorMuted: string;
  accentGold: string;
  borderColor: string;
  rosetteRgba: string;
  guillocheHue: number;
}

const THEMES: Record<CertificateThemeKey, ThemeConfig> = {
  parchment: {
    name: "Imperial Parchment",
    bgGradient: "linear-gradient(135deg, #fdfbf7 0%, #f6efe2 50%, #ede3d0 100%)",
    plateColor: "#f9f4ea",
    inkColor: "#292116",
    inkColorMuted: "rgba(41, 33, 22, 0.7)",
    accentGold: "#b4832c",
    borderColor: "rgba(180, 131, 44, 0.55)",
    rosetteRgba: "rgba(180, 131, 44, 0.35)",
    guillocheHue: 42,
  },
  learnify: {
    name: "Learnify Brand",
    bgGradient: "linear-gradient(135deg, #0b1329 0%, #0d1b3e 50%, #080f24 100%)",
    plateColor: "#0b1533",
    inkColor: "#f8fafc",
    inkColorMuted: "rgba(248, 250, 252, 0.72)",
    accentGold: "#38bdf8",
    borderColor: "rgba(56, 189, 248, 0.45)",
    rosetteRgba: "rgba(99, 102, 241, 0.45)",
    guillocheHue: 215,
  },
  obsidian: {
    name: "Obsidian 24K Gold",
    bgGradient: "linear-gradient(135deg, #0b0c10 0%, #151821 50%, #0a0b0e 100%)",
    plateColor: "#12141c",
    inkColor: "#ffffff",
    inkColorMuted: "rgba(255, 255, 255, 0.7)",
    accentGold: "#f59e0b",
    borderColor: "rgba(245, 158, 11, 0.55)",
    rosetteRgba: "rgba(245, 158, 11, 0.38)",
    guillocheHue: 38,
  },
  emerald: {
    name: "Royal Emerald",
    bgGradient: "linear-gradient(135deg, #04241d 0%, #093b2f 50%, #021a15 100%)",
    plateColor: "#072e25",
    inkColor: "#ffffff",
    inkColorMuted: "rgba(255, 255, 255, 0.75)",
    accentGold: "#34d399",
    borderColor: "rgba(52, 211, 153, 0.45)",
    rosetteRgba: "rgba(52, 211, 153, 0.35)",
    guillocheHue: 155,
  },
  sapphire: {
    name: "Sapphire Prestige",
    bgGradient: "linear-gradient(135deg, #071739 0%, #0b2559 50%, #041029 100%)",
    plateColor: "#091f4a",
    inkColor: "#ffffff",
    inkColorMuted: "rgba(255, 255, 255, 0.72)",
    accentGold: "#60a5fa",
    borderColor: "rgba(96, 165, 250, 0.45)",
    rosetteRgba: "rgba(96, 165, 250, 0.35)",
    guillocheHue: 210,
  },
  platinum: {
    name: "Platinum Executive",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)",
    plateColor: "#f8fafc",
    inkColor: "#0f172a",
    inkColorMuted: "rgba(15, 23, 42, 0.68)",
    accentGold: "#475569",
    borderColor: "rgba(71, 85, 105, 0.4)",
    rosetteRgba: "rgba(71, 85, 105, 0.25)",
    guillocheHue: 220,
  },
};

export const EngravedCertificateTemplate = React.forwardRef<
  HTMLDivElement,
  EngravedCertificateTemplateProps
>(function EngravedCertificateTemplate(
  {
    initialRecipientName = "Sarah Jenkins",
    initialCourseTitle = "Advanced AI Systems & Autonomous Agent Engineering",
    initialIssueDate = "October 2026",
    initialCredentialId = "LRNAI-2026-8821V",
    initialSignatoryName = "Vishwajeet",
    initialSignatoryTitle = "Founder & Chief AI Architect, Learnify AI",
    initialHonorsDistinction = "Honors with Distinction • Top 1% Percentile",
    initialSecondSignatoryName = "Dr. Michael Chen",
    initialSecondSignatoryTitle = "Academic Dean, Learnify Council",
    initialTheme = "parchment",
    initialSealType = "indian_rupee",
    initialBorderType = "banknote",
    logoUrl = "/assets/learnify-logo.png",
    qrDataUrl,
    isDemo = true,
    watermarkText = "DEMO SPECIMEN • NOT A VALID CREDENTIAL • COMPLETE COURSE TO UNLOCK",
    className = "",
    onDownloadPdf,
    onDownloadImage,
    downloading = false,
  },
  forwardedRef
) {
  // Local ref if none forwarded
  const localRef = useRef<HTMLDivElement>(null);
  const certStageRef = (forwardedRef as React.RefObject<HTMLDivElement>) || localRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Editable Form State
  const [recipientName, setRecipientName] = useState(initialRecipientName);
  const [courseTitle, setCourseTitle] = useState(initialCourseTitle);
  const [issueDate, setIssueDate] = useState(initialIssueDate);
  const [credentialId, setCredentialId] = useState(initialCredentialId);
  const [signatoryName, setSignatoryName] = useState(initialSignatoryName);
  const [signatoryTitle, setSignatoryTitle] = useState(initialSignatoryTitle);
  const [honorsDistinction, setHonorsDistinction] = useState(initialHonorsDistinction);
  const [secondSignatoryName, setSecondSignatoryName] = useState(initialSecondSignatoryName);
  const [secondSignatoryTitle, setSecondSignatoryTitle] = useState(initialSecondSignatoryTitle);
  const [hasSecondSignatory, setHasSecondSignatory] = useState(true);

  // Watermark & QR Code State
  const [showWatermark, setShowWatermark] = useState(isDemo);
  const [watermark, setWatermark] = useState(watermarkText);
  const [qrCodeImg, setQrCodeImg] = useState<string | null>(qrDataUrl || null);

  // Auto-generate live QR Code for the credential ID
  useEffect(() => {
    if (qrDataUrl) {
      setQrCodeImg(qrDataUrl);
      return;
    }
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.learnifyai.in";
    const verifyUrl = `${origin}/verify/${credentialId || "CERT-ML-2026"}`;
    import("qrcode")
      .then((mod) => {
        const QRCode = (mod as any).default || mod;
        QRCode.toDataURL(verifyUrl, {
          margin: 1,
          width: 200,
          color: { dark: "#0A1128", light: "#ffffff" },
        }).then((dataUrl: string) => {
          setQrCodeImg(dataUrl);
        });
      })
      .catch(() => {});
  }, [qrDataUrl, credentialId]);

  // Styling & Theme State
  const [activeTheme, setActiveTheme] = useState<CertificateThemeKey>(initialTheme);
  const [sealType, setSealType] = useState<CertificateSealType>(initialSealType);
  const [borderType, setBorderType] = useState<CertificateBorderType>(initialBorderType);
  const [rosetteIntensity, setRosetteIntensity] = useState<number>(0.55);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const stampVariant = useMemo(() => {
    if (activeTheme === "emerald") return "emerald";
    if (activeTheme === "platinum") return "platinum";
    if (activeTheme === "sapphire") return "platinum";
    if (activeTheme === "learnify") return "purple";
    return "gold";
  }, [activeTheme]);

  // Sync state if props change externally
  useEffect(() => {
    if (initialRecipientName) setRecipientName(initialRecipientName);
    if (initialCourseTitle) setCourseTitle(initialCourseTitle);
    if (initialIssueDate) setIssueDate(initialIssueDate);
    if (initialCredentialId) setCredentialId(initialCredentialId);
    if (initialSignatoryName) setSignatoryName(initialSignatoryName);
    if (initialSignatoryTitle) setSignatoryTitle(initialSignatoryTitle);
    if (initialHonorsDistinction) setHonorsDistinction(initialHonorsDistinction);
    if (initialTheme) setActiveTheme(initialTheme);
    if (initialSealType) setSealType(initialSealType);
    if (initialBorderType) setBorderType(initialBorderType);
  }, [
    initialRecipientName,
    initialCourseTitle,
    initialIssueDate,
    initialCredentialId,
    initialSignatoryName,
    initialSignatoryTitle,
    initialHonorsDistinction,
    initialTheme,
    initialSealType,
    initialBorderType,
  ]);

  const currentTheme = THEMES[activeTheme] || THEMES.parchment;

  // ═══════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL NATIVE GUILLOCHE ROSETTE CANVAS GENERATOR
  // Renders vector-sharp security lathe lines natively into the HTML5 canvas
  // ═══════════════════════════════════════════════════════════════════════════
  const drawGuillochePatterns = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use high DPI canvas backing
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const width = canvas.clientWidth || 980;
    const height = canvas.clientHeight || 710;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const isLight = activeTheme === "parchment" || activeTheme === "platinum";
    const primaryRgba = currentTheme.rosetteRgba;
    const accentColor = currentTheme.accentGold;
    const opacityMult = rosetteIntensity;

    // 1. Outer & Inner Border Guilloche Ribbon
    if (borderType === "banknote") {
      const margin = 18;
      const innerMargin = 30;

      // Draw multi-layered decorative frame
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = primaryRgba;
      ctx.strokeRect(margin + 4, margin + 4, width - (margin + 4) * 2, height - (margin + 4) * 2);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.strokeRect(innerMargin, innerMargin, width - innerMargin * 2, height - innerMargin * 2);

      // Guilloche weave along perimeter borders
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = primaryRgba;
      const step = 8;

      // Top & Bottom ribbon waves
      for (let x = innerMargin; x <= width - innerMargin; x += step) {
        const wave1 = Math.sin((x / width) * Math.PI * 40) * 4;
        const wave2 = Math.cos((x / width) * Math.PI * 40) * 4;
        ctx.beginPath();
        ctx.moveTo(x, margin + 8 + wave1);
        ctx.lineTo(x + 4, margin + 14 + wave2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, height - margin - 14 + wave1);
        ctx.lineTo(x + 4, height - margin - 8 + wave2);
        ctx.stroke();
      }

      // Left & Right ribbon waves
      for (let y = innerMargin; y <= height - innerMargin; y += step) {
        const wave1 = Math.sin((y / height) * Math.PI * 30) * 4;
        const wave2 = Math.cos((y / height) * Math.PI * 30) * 4;
        ctx.beginPath();
        ctx.moveTo(margin + 8 + wave1, y);
        ctx.lineTo(margin + 14 + wave2, y + 4);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width - margin - 14 + wave1, y);
        ctx.lineTo(width - margin - 8 + wave2, y + 4);
        ctx.stroke();
      }
    } else if (borderType === "geometric") {
      const margin = 22;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = primaryRgba;
      ctx.strokeRect(margin + 8, margin + 8, width - (margin + 8) * 2, height - (margin + 8) * 2);
    } else {
      // Modern Minimal
      const margin = 26;
      ctx.lineWidth = 1;
      ctx.strokeStyle = currentTheme.borderColor;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);
    }

    // 2. Corner Harmonic Rosettes (Epicycloid curves)
    const drawCornerRosette = (cx: number, cy: number, radius: number) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = primaryRgba;

      const petals = 12;
      const steps = 360;
      for (let i = 0; i < 4; i++) {
        const rFactor = radius * (0.5 + i * 0.16);
        ctx.beginPath();
        for (let theta = 0; theta <= Math.PI * 2; theta += (Math.PI * 2) / steps) {
          const r = rFactor * (1 + 0.35 * Math.sin(petals * theta + (i * Math.PI) / 6));
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);
          if (theta === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    };

    const cornerRadius = 36;
    drawCornerRosette(55, 55, cornerRadius);
    drawCornerRosette(width - 55, 55, cornerRadius);
    drawCornerRosette(55, height - 55, cornerRadius);
    drawCornerRosette(width - 55, height - 55, cornerRadius);

    // 3. Central Watermark Security Rosette (Delicate, never obscuring text)
    if (opacityMult > 0.05) {
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const maxRadius = Math.min(width, height) * 0.38;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Low alpha hypotrochoid curves
      const loops = 14;
      const numWaves = 6;
      for (let w = 0; w < numWaves; w++) {
        ctx.lineWidth = 0.65;
        ctx.strokeStyle = isLight
          ? `rgba(180, 131, 44, ${0.08 * opacityMult + w * 0.015})`
          : `rgba(99, 102, 241, ${0.12 * opacityMult + w * 0.02})`;

        const R = maxRadius * (0.45 + w * 0.09);
        const r = R * 0.28;
        const d = r * 0.85;

        ctx.beginPath();
        const maxT = Math.PI * 2 * loops;
        for (let t = 0; t <= maxT; t += 0.04) {
          const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) * t) / r);
          const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) * t) / r);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }, [activeTheme, borderType, currentTheme, rosetteIntensity]);

  useEffect(() => {
    drawGuillochePatterns();
    const handleResize = () => drawGuillochePatterns();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawGuillochePatterns]);

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPORT HANDLERS (PDF / PNG with high DPI & toast notifications)
  // ═══════════════════════════════════════════════════════════════════════════
  const handleExportPdf = async () => {
    if (onDownloadPdf) {
      onDownloadPdf();
      return;
    }
    if (!certStageRef.current) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating ultra high-DPI certificate PDF (300 DPI)...");
    try {
      await downloadElementAsPdf(
        certStageRef.current,
        `Learnify-Certificate-${credentialId || "credential"}.pdf`
      );
      toast.success("Certificate PDF downloaded successfully!", { id: toastId });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (e: any) {
      toast.error(e?.message || "Failed to export PDF", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPng = async () => {
    if (onDownloadImage) {
      onDownloadImage();
      return;
    }
    if (!certStageRef.current) return;
    setIsExporting(true);
    const toastId = toast.loading("Rendering master certificate PNG (3x Scale)...");
    try {
      await downloadElementAsImage(
        certStageRef.current,
        `Learnify-Certificate-${credentialId || "credential"}.png`
      );
      toast.success("Certificate PNG downloaded successfully!", { id: toastId });
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch (e: any) {
      toast.error(e?.message || "Failed to export PNG", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://www.learnifyai.in/verify/${encodeURIComponent(credentialId)}`
    );
    setCopied(true);
    toast.success("Credential verification link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetDefaults = () => {
    setRecipientName(initialRecipientName);
    setCourseTitle(initialCourseTitle);
    setIssueDate(initialIssueDate);
    setCredentialId(initialCredentialId);
    setSignatoryName(initialSignatoryName);
    setSignatoryTitle(initialSignatoryTitle);
    setHonorsDistinction(initialHonorsDistinction);
    setActiveTheme("parchment");
    setSealType("gold_foil");
    setBorderType("banknote");
    setRosetteIntensity(0.55);
    setHasSecondSignatory(true);
    toast.info("Certificate reset to default honors configuration");
  };

  return (
    <div className={`w-full flex flex-col items-center space-y-6 ${className}`}>
      {/* ═══════════════════════════════════════════════════════════════════════
          INTERACTIVE CONTROLS BAR & CUSTOMIZATION DOCK
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="w-full max-w-4xl p-3 sm:p-4 rounded-2xl border border-border/70 bg-card/90 backdrop-blur-md shadow-lg flex flex-wrap items-center justify-between gap-3 print:hidden">
        {/* Left Badge & Status */}
        <div className="flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="border-primary/40 bg-primary/10 text-primary font-mono text-[11px] px-2.5 py-0.5 uppercase tracking-wider flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guilloche Rosette Engine</span>
          </Badge>
          <span className="text-xs font-semibold text-muted-foreground hidden md:inline">
            Tamper-Proof Micro-Lathe Vector
          </span>
        </div>

        {/* Center / Right Theme Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Quick Switcher */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50">
            {(
              [
                ["parchment", "Parchment"],
                ["learnify", "Learnify"],
                ["obsidian", "Obsidian"],
                ["emerald", "Emerald"],
                ["sapphire", "Sapphire"],
                ["platinum", "Platinum"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTheme(key)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTheme === key
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Edit Customizer Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={`h-8 gap-1.5 text-xs font-semibold cursor-pointer ${
              isEditing ? "border-primary bg-primary/10 text-primary" : "border-border"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditing ? "Done Editing" : "Customize Certificate"}</span>
          </Button>

          {/* High-DPI PDF Download */}
          <Button
            variant="outline"
            size="sm"
            disabled={downloading || isExporting}
            onClick={handleExportPdf}
            className="h-8 gap-1.5 text-xs font-semibold bg-primary/5 hover:bg-primary/15 border-primary/30 text-primary cursor-pointer"
            title="Download landscape A4 PDF (300 DPI Print Quality)"
          >
            <Download className="h-3.5 w-3.5" />
            <span>PDF (300 DPI)</span>
          </Button>

          {/* Master PNG Download */}
          <Button
            variant="outline"
            size="sm"
            disabled={downloading || isExporting}
            onClick={handleExportPng}
            className="h-8 gap-1.5 text-xs font-medium border-border hover:bg-muted cursor-pointer"
            title="Download high-resolution 3x PNG"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">PNG</span>
          </Button>

          {/* Copy Verification Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            title="Copy Public Verification URL"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Verify URL</span>
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          IN-PLACE EDITABLE PROPERTIES & ASSET CUSTOMIZER DRAWER
          ═══════════════════════════════════════════════════════════════════════ */}
      {isEditing && (
        <div className="w-full max-w-4xl p-5 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Recipient Full Name</Label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="text-xs h-9 font-medium"
              placeholder="e.g. Sarah Jenkins"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Course / Certification Title</Label>
            <Input
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="text-xs h-9 font-medium"
              placeholder="e.g. Advanced AI Systems & Autonomous Agent Engineering"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Credential ID</Label>
            <Input
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className="text-xs h-9 font-mono"
              placeholder="e.g. LRNAI-2026-8821V"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Issue Date</Label>
            <Input
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="text-xs h-9"
              placeholder="e.g. October 2026"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Honors / Distinction Badge</Label>
            <Input
              value={honorsDistinction}
              onChange={(e) => setHonorsDistinction(e.target.value)}
              className="text-xs h-9 font-medium"
              placeholder="e.g. Honors with Distinction"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Signatory Authority 1 (Primary)</Label>
            <Input
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              className="text-xs h-9 font-medium"
              placeholder="e.g. Vishwajeet"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Signatory Title 1</Label>
            <Input
              value={signatoryTitle}
              onChange={(e) => setSignatoryTitle(e.target.value)}
              className="text-xs h-9"
              placeholder="e.g. Founder & Chief AI Architect"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Signatory Authority 2</Label>
              <button
                type="button"
                onClick={() => setHasSecondSignatory(!hasSecondSignatory)}
                className="text-[10px] text-primary hover:underline cursor-pointer"
              >
                {hasSecondSignatory ? "Remove" : "+ Add Signatory"}
              </button>
            </div>
            <Input
              value={secondSignatoryName}
              disabled={!hasSecondSignatory}
              onChange={(e) => setSecondSignatoryName(e.target.value)}
              className="text-xs h-9 font-medium disabled:opacity-50"
              placeholder="e.g. Dr. Michael Chen"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Signatory Title 2</Label>
            <Input
              value={secondSignatoryTitle}
              disabled={!hasSecondSignatory}
              onChange={(e) => setSecondSignatoryTitle(e.target.value)}
              className="text-xs h-9 disabled:opacity-50"
              placeholder="e.g. Academic Dean"
            />
          </div>

          {/* Asset & Seal Switchers */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Embossed Medallion / Seal</Label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                ["indian_rupee", "Rupee Security Stamp"],
                ["gold_foil", "Gold Foil Seal"],
                ["crypto_attested", "Crypto Shield"],
                ["crimson_ribbon", "Honor Ribbon"],
                ["star_excellence", "Star Medal"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSealType(key as CertificateSealType)}
                  className={`text-[10px] py-1.5 px-2 rounded-lg border text-left truncate transition cursor-pointer ${
                    sealType === key
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Border Arch Style</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                ["banknote", "Banknote"],
                ["geometric", "Geometric"],
                ["modern_minimal", "Minimal"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setBorderType(key as CertificateBorderType)}
                  className={`text-[10px] py-1.5 px-2 rounded-lg border text-center transition cursor-pointer ${
                    borderType === key
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <Label className="text-xs font-semibold">Guilloche Watermark Density</Label>
              <span className="font-mono text-muted-foreground text-[10px]">
                {Math.round(rosetteIntensity * 100)}%
              </span>
            </div>
            <Slider
              value={[rosetteIntensity]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([val]) => setRosetteIntensity(val)}
              className="py-2"
            />
          </div>

          {/* Specimen Security Watermark Control */}
          <div className="space-y-1.5 sm:col-span-2 md:col-span-3 p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-rose-500" />
                <Label className="text-xs font-bold text-foreground">Specimen Security Watermark</Label>
                <Badge variant="outline" className={cn(
                  "text-[9px] font-bold font-mono",
                  showWatermark ? "border-rose-500/40 text-rose-500 bg-rose-500/10" : "border-emerald-500/40 text-emerald-500 bg-emerald-500/10"
                )}>
                  {showWatermark ? "Demo Watermark Active" : "Clean Issued Preview"}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Protects public previews against counterfeiting. Real certificates are issued unwatermarked upon course completion.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                size="sm"
                variant={showWatermark ? "destructive" : "outline"}
                onClick={() => setShowWatermark(!showWatermark)}
                className="h-8 text-xs font-bold rounded-xl cursor-pointer"
              >
                {showWatermark ? "Watermark: ON" : "Watermark: OFF"}
              </Button>
            </div>
          </div>

          {/* Bottom Bar: Reset */}
          <div className="sm:col-span-2 md:col-span-3 flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-[11px] text-muted-foreground">
              Direct live preview &bull; Instant 300 DPI vector re-render
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetDefaults}
              className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" /> Reset Defaults
            </Button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MASTER CERTIFICATE CANVAS STAGE (Full Landscape A4 Proportions)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={certStageRef}
        id="certificate-print-stage"
        style={{
          background: currentTheme.bgGradient,
          color: currentTheme.inkColor,
        }}
        className="relative w-full max-w-4xl aspect-[1.414/1] min-h-[380px] sm:min-h-[500px] md:min-h-[620px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-black/10 select-none flex flex-col justify-between p-4 sm:p-8 md:p-12 print:p-8"
      >
        {/* Layer 0: High-DPI Native Mathematical Guilloche Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Layer 0.5: Tamper-Proof Specimen Watermark Overlay */}
        {showWatermark && (
          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
            <div
              className="w-[150%] text-center font-display font-black tracking-[0.22em] uppercase text-rose-500/20 dark:text-rose-400/25 select-none -rotate-24 border-y-2 border-dashed border-rose-500/30 py-5 px-8 bg-rose-500/[0.03] backdrop-blur-[0.5px]"
              style={{
                fontSize: "clamp(0.95rem, 2.7vw, 2.1rem)",
                letterSpacing: "0.22em",
              }}
            >
              <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-rose-600/50 dark:text-rose-400/50 mb-1">
                ★ OFFICIAL LEARNIFY AI DEMO SPECIMEN ★
              </div>
              {watermark}
              <div className="text-[9px] sm:text-[11px] font-mono font-semibold tracking-wider text-rose-600/50 dark:text-rose-400/50 mt-1">
                AUTHENTIC UNWATERMARKED CREDENTIAL ISSUED UPON 100% COURSE COMPLETION
              </div>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            LAYER 1: CERTIFICATE TYPOGRAPHIC & SECURITY OVERLAY
            ═════════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-auto">
          {/* HEADER: Institution Identity & Authenticity Stamp */}
          <div className="flex items-start justify-between gap-4">
            {/* Learnify Emblem & Title (Always Visible Logo) */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <div
                className="h-11 w-11 sm:h-14 sm:w-14 rounded-2xl p-1.5 sm:p-2 shadow-lg flex items-center justify-center border backdrop-blur-md shrink-0"
                style={{
                  borderColor: currentTheme.borderColor,
                  backgroundColor:
                    activeTheme === "parchment" || activeTheme === "platinum"
                      ? "rgba(255, 255, 255, 0.85)"
                      : "rgba(15, 23, 42, 0.65)",
                }}
              >
                <img
                  src={logoMarkUrl}
                  alt="Learnify AI"
                  className="h-full w-full object-contain drop-shadow-sm"
                />
              </div>

              <div>
                <div
                  className="font-display tracking-[0.22em] text-xs sm:text-base font-extrabold uppercase flex items-center gap-1.5"
                  style={{ color: currentTheme.inkColor }}
                >
                  <span>Learnify AI</span>
                </div>
                <div
                  className="text-[9px] sm:text-[11px] tracking-[0.18em] uppercase font-mono font-medium"
                  style={{ color: currentTheme.inkColorMuted }}
                >
                  Autonomous Learning OS &bull; Verifiable Registry
                </div>
              </div>
            </div>

            {/* Cryptographic Attestation Chip */}
            <div className="flex flex-col items-end">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider border shadow-xs"
                style={{
                  backgroundColor:
                    activeTheme === "parchment" || activeTheme === "platinum"
                      ? "rgba(255, 255, 255, 0.85)"
                      : "rgba(255, 255, 255, 0.08)",
                  borderColor: currentTheme.borderColor,
                  color: currentTheme.inkColor,
                }}
              >
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: currentTheme.accentGold }} />
                <span>CRYPTOGRAPHICALLY ATTESTED</span>
              </div>
              <span
                className="text-[9px] font-mono tracking-widest mt-1"
                style={{ color: currentTheme.inkColorMuted }}
              >
                ID: {credentialId}
              </span>
            </div>
          </div>

          {/* BODY: Recipient Award & Course Details */}
          <div className="my-auto text-center space-y-3 sm:space-y-4 py-2 sm:py-6">
            <div className="inline-block">
              <span
                className="font-serif italic text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold block"
                style={{ color: currentTheme.accentGold }}
              >
                Certificate of Technical Mastery
              </span>
              <p
                className="text-[11px] sm:text-xs tracking-widest uppercase font-mono mt-0.5"
                style={{ color: currentTheme.inkColorMuted }}
              >
                This is to certify that
              </p>
            </div>

            {/* Recipient Full Name */}
            <h2
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight drop-shadow-xs px-4"
              style={{ color: currentTheme.inkColor }}
            >
              {recipientName}
            </h2>

            {/* Separator Ornament */}
            <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
              <div className="h-[1px] flex-1" style={{ backgroundColor: currentTheme.borderColor }} />
              <Star className="h-3 w-3" style={{ color: currentTheme.accentGold }} />
              <div className="h-[1px] flex-1" style={{ backgroundColor: currentTheme.borderColor }} />
            </div>

            <p
              className="text-xs sm:text-sm max-w-xl mx-auto leading-relaxed"
              style={{ color: currentTheme.inkColorMuted }}
            >
              has successfully satisfied all rigorous curriculum benchmarks, verified practical
              engineering evaluations, and demonstrated autonomous production execution in
            </p>

            {/* Course / Certification Title */}
            <h3
              className="font-serif font-bold text-lg sm:text-2xl md:text-3xl tracking-tight max-w-2xl mx-auto px-4"
              style={{ color: currentTheme.inkColor }}
            >
              {courseTitle}
            </h3>

            {/* Distinction Badge */}
            {honorsDistinction && (
              <div className="pt-1">
                <span
                  className="inline-block px-3.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase font-semibold border shadow-xs"
                  style={{
                    backgroundColor:
                      activeTheme === "parchment" || activeTheme === "platinum"
                        ? "rgba(180, 131, 44, 0.12)"
                        : "rgba(56, 189, 248, 0.12)",
                    borderColor: currentTheme.borderColor,
                    color: currentTheme.accentGold,
                  }}
                >
                  ★ {honorsDistinction}
                </span>
              </div>
            )}
          </div>

          {/* FOOTER: Signatures, Medallion Seal, & Verification QR */}
          <div
            className="flex items-end justify-between pt-4 border-t"
            style={{ borderColor: currentTheme.borderColor }}
          >
            {/* Primary Signatory Authority */}
            <div className="text-left space-y-1">
              {/* Authentic Cursive Script Signature */}
              <div
                className="font-serif italic text-lg sm:text-2xl font-bold tracking-tight h-8 flex items-center"
                style={{ color: currentTheme.inkColor }}
              >
                {signatoryName}
              </div>
              <div
                className="w-28 sm:w-36 h-[1.5px]"
                style={{ backgroundColor: currentTheme.borderColor }}
              />
              <span
                className="text-[10px] sm:text-[11px] font-serif block font-medium max-w-[180px] sm:max-w-none"
                style={{ color: currentTheme.inkColorMuted }}
              >
                {signatoryTitle}
              </span>
              <div
                className="text-[8px] font-mono tracking-wider"
                style={{ color: currentTheme.inkColorMuted }}
              >
                Conferred: {issueDate}
              </div>
            </div>

            {/* Center Embossed Medallion / Official Rupee Security Stamp */}
            <div className="flex flex-col items-center justify-center shrink-0">
              {sealType === "indian_rupee" ? (
                <IndianRupeeSecurityStamp
                  variant={stampVariant}
                  size={58}
                  className="transform transition-transform duration-300 hover:scale-105"
                />
              ) : sealType === "gold_foil" ? (
                <div
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 flex items-center justify-center shadow-lg relative p-1"
                  style={{
                    borderColor: currentTheme.accentGold,
                    background:
                      "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, rgba(180, 131, 44, 0.1) 70%, transparent 100%)",
                  }}
                >
                  <div
                    className="w-full h-full rounded-full border border-dashed flex flex-col items-center justify-center text-center"
                    style={{ borderColor: currentTheme.accentGold }}
                  >
                    <Award className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: currentTheme.accentGold }} />
                    <span
                      className="text-[7px] sm:text-[8px] font-mono uppercase tracking-tighter font-extrabold mt-0.5"
                      style={{ color: currentTheme.inkColor }}
                    >
                      OFFICIAL SEAL
                    </span>
                  </div>
                </div>
              ) : sealType === "crypto_attested" ? (
                <div
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg p-1 backdrop-blur-md"
                  style={{
                    borderColor: currentTheme.accentGold,
                    background: "rgba(56, 189, 248, 0.1)",
                  }}
                >
                  <ShieldCheck className="h-6 w-6" style={{ color: currentTheme.accentGold }} />
                  <span
                    className="text-[7px] font-mono uppercase tracking-widest font-bold mt-1"
                    style={{ color: currentTheme.inkColor }}
                  >
                    ON-CHAIN
                  </span>
                </div>
              ) : sealType === "crimson_ribbon" ? (
                <div className="relative flex flex-col items-center">
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-rose-700 text-white flex items-center justify-center shadow-md border-2 border-amber-300">
                    <Award className="h-6 w-6 text-amber-200" />
                  </div>
                  <div className="w-5 h-3.5 bg-rose-800 -mt-1 rounded-b-xs shadow-xs" />
                </div>
              ) : (
                <div
                  className="h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 border-double flex flex-col items-center justify-center shadow-lg p-1"
                  style={{
                    borderColor: currentTheme.accentGold,
                    background: "rgba(245, 158, 11, 0.12)",
                  }}
                >
                  <Star className="h-6 w-6 fill-current" style={{ color: currentTheme.accentGold }} />
                  <span
                    className="text-[7px] font-mono uppercase tracking-wider font-bold mt-0.5"
                    style={{ color: currentTheme.inkColor }}
                  >
                    EXCELLENCE
                  </span>
                </div>
              )}

              <span
                className="text-[7.5px] sm:text-[8.5px] font-mono tracking-widest uppercase mt-0.5 font-bold"
                style={{ color: currentTheme.inkColorMuted }}
              >
                ★ Verifiable Stamp ★
              </span>
            </div>

            {/* Secondary Signatory & Live QR Code */}
            <div className="flex items-end gap-3.5 text-right">
              {hasSecondSignatory && (
                <div className="space-y-1">
                  <div
                    className="font-serif italic text-lg sm:text-2xl font-bold tracking-tight h-8 flex items-center justify-end"
                    style={{ color: currentTheme.inkColor }}
                  >
                    {secondSignatoryName}
                  </div>
                  <div
                    className="w-28 sm:w-36 h-[1.5px] ml-auto"
                    style={{ backgroundColor: currentTheme.borderColor }}
                  />
                  <span
                    className="text-[10px] sm:text-[11px] font-serif block font-medium max-w-[180px] sm:max-w-none"
                    style={{ color: currentTheme.inkColorMuted }}
                  >
                    {secondSignatoryTitle}
                  </span>
                  <div
                    className="text-[8px] font-mono tracking-wider"
                    style={{ color: currentTheme.inkColorMuted }}
                  >
                    Supabase SHA-256 Verified
                  </div>
                </div>
              )}

              {/* Cryptographic Verification QR Code (Always Visible) */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="h-14 w-14 sm:h-16 sm:w-16 p-1 rounded-xl border bg-white shadow-md flex items-center justify-center overflow-hidden"
                  style={{ borderColor: currentTheme.borderColor }}
                  title="Scan with phone camera to verify credential authenticity on learnifyai.in"
                >
                  {qrCodeImg ? (
                    <img src={qrCodeImg} alt="Verification QR Code" className="h-full w-full object-contain" />
                  ) : (
                    <QrCode className="h-10 w-10 text-slate-900" />
                  )}
                </div>
                <span
                  className="text-[7.5px] font-mono uppercase tracking-wider font-bold mt-0.5 text-center"
                  style={{ color: currentTheme.inkColorMuted }}
                >
                  Scan to Verify
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EngravedCertificateTemplate;
