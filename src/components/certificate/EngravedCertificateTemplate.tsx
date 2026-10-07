"use client";

import React, { useState } from "react";
import { EngravedCertificate } from "@/shaders/neuform-isolated/NeuformCraftEffects";
import "@/shaders/threeui.css";
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
} from "lucide-react";
import { toast } from "sonner";
import { SafeImage } from "@/components/ui/SafeImage";

export interface EngravedCertificateTemplateProps {
  initialRecipientName?: string;
  initialCourseTitle?: string;
  initialIssueDate?: string;
  initialCredentialId?: string;
  initialSignatoryName?: string;
  initialSignatoryTitle?: string;
  logoUrl?: string;
  className?: string;
}

export function EngravedCertificateTemplate({
  initialRecipientName = "Alex Vance",
  initialCourseTitle = "Full-Stack AI Engineering & Agent Architecture",
  initialIssueDate = "October 2026",
  initialCredentialId = "LRNAI-2026-9842X",
  initialSignatoryName = "Vishwajeet",
  initialSignatoryTitle = "Founder & Chief AI Architect, Learnify AI",
  logoUrl = "/logo.png",
  className = "",
}: EngravedCertificateTemplateProps) {
  // State for editable fields
  const [recipientName, setRecipientName] = useState(initialRecipientName);
  const [courseTitle, setCourseTitle] = useState(initialCourseTitle);
  const [issueDate, setIssueDate] = useState(initialIssueDate);
  const [credentialId, setCredentialId] = useState(initialCredentialId);
  const [signatoryName, setSignatoryName] = useState(initialSignatoryName);
  const [signatoryTitle, setSignatoryTitle] = useState(initialSignatoryTitle);

  // Shader color calibration
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Preset themes
  const handlePreset = (name: "emerald" | "sapphire" | "obsidian" | "gold") => {
    switch (name) {
      case "emerald":
        setHue(0);
        setSaturation(1);
        setBrightness(1);
        break;
      case "sapphire":
        setHue(140);
        setSaturation(1.2);
        setBrightness(1.05);
        break;
      case "obsidian":
        setHue(0);
        setSaturation(0);
        setBrightness(0.85);
        break;
      case "gold":
        setHue(45);
        setSaturation(1.3);
        setBrightness(1.1);
        break;
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

  const handleReset = () => {
    setRecipientName(initialRecipientName);
    setCourseTitle(initialCourseTitle);
    setIssueDate(initialIssueDate);
    setCredentialId(initialCredentialId);
    setSignatoryName(initialSignatoryName);
    setSignatoryTitle(initialSignatoryTitle);
    setHue(0);
    setSaturation(1);
    setBrightness(1);
    toast.info("Certificate reset to defaults");
  };

  return (
    <div className={`w-full flex flex-col items-center space-y-6 ${className}`}>
      {/* Interactive Controls Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/60 bg-card/85 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-2.5">
          <Badge
            variant="outline"
            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-[11px] px-2.5 py-0.5 uppercase tracking-wider"
          >
            Engraved 2D Canvas
          </Badge>
          <span className="text-xs font-semibold text-foreground/80 hidden sm:inline">
            Guilloche Rosette Engine
          </span>
        </div>

        {/* Quick Style Presets & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/40">
            <button
              onClick={() => handlePreset("emerald")}
              className="text-[10px] px-2 py-0.5 rounded font-medium text-emerald-400 hover:bg-background/80 transition-colors"
            >
              Emerald
            </button>
            <button
              onClick={() => handlePreset("sapphire")}
              className="text-[10px] px-2 py-0.5 rounded font-medium text-sky-400 hover:bg-background/80 transition-colors"
            >
              Sapphire
            </button>
            <button
              onClick={() => handlePreset("gold")}
              className="text-[10px] px-2 py-0.5 rounded font-medium text-amber-400 hover:bg-background/80 transition-colors"
            >
              Gold
            </button>
            <button
              onClick={() => handlePreset("obsidian")}
              className="text-[10px] px-2 py-0.5 rounded font-medium text-slate-300 hover:bg-background/80 transition-colors"
            >
              Obsidian
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={`h-8 gap-1.5 text-xs font-medium ${isEditing ? "border-primary bg-primary/10 text-primary" : ""}`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditing ? "Done Editing" : "Edit Certificate"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Verify URL</span>
          </Button>
        </div>
      </div>

      {/* In-Place Editing Panel (collapsible) */}
      {isEditing && (
        <div className="w-full max-w-4xl p-5 rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-md shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Recipient Full Name</Label>
            <Input
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="text-xs h-9 font-medium"
              placeholder="e.g. Alex Vance"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Course / Certification Title</Label>
            <Input
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="text-xs h-9 font-medium"
              placeholder="e.g. Full-Stack AI Engineering"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Credential ID / Token</Label>
            <Input
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className="text-xs h-9 font-mono"
              placeholder="e.g. LRNAI-2026-9842X"
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
            <Label className="text-xs font-semibold">Signatory Authority</Label>
            <Input
              value={signatoryName}
              onChange={(e) => setSignatoryName(e.target.value)}
              className="text-xs h-9"
              placeholder="e.g. Vishwajeet"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Signatory Title</Label>
            <Input
              value={signatoryTitle}
              onChange={(e) => setSignatoryTitle(e.target.value)}
              className="text-xs h-9"
              placeholder="e.g. Founder & Chief AI Architect"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3 flex items-center justify-between pt-2 border-t border-border/40">
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>Hue: {hue}°</span>
              <span>Sat: {saturation.toFixed(2)}</span>
              <span>Bright: {brightness.toFixed(2)}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3 w-3" /> Reset Defaults
            </Button>
          </div>
        </div>
      )}

      {/* Main Certificate Stage */}
      <div className="relative w-full max-w-4xl aspect-[1.38/1] min-h-[460px] sm:min-h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-[#c9b48c]/40 bg-[#ded6c2]">
        {/* Background Harmonic Guilloche Rosette Canvas */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <EngravedCertificate
            hue={hue}
            saturation={saturation}
            brightness={brightness}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Certificate Foreground Typographic Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 text-[#1f3a30] select-none pointer-events-auto">
          {/* Header with Learnify AI Logo */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/80 p-1.5 shadow-md border border-[#1f3a30]/20 flex items-center justify-center backdrop-blur-sm">
                <img
                  src={logoUrl}
                  alt="Learnify AI"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/logo.png";
                  }}
                />
              </div>
              <div>
                <div className="font-serif tracking-[0.25em] text-xs font-bold uppercase text-[#1f3a30]">
                  Learnify AI
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-[#1f3a30]/70 font-mono">
                  Autonomous Learning OS
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <Badge
                variant="outline"
                className="border-[#1f3a30]/30 bg-white/60 text-[#1f3a30] text-[10px] font-mono tracking-wider backdrop-blur-sm"
              >
                <ShieldCheck className="h-3 w-3 mr-1 text-[#1f3a30]" />
                VERIFIED CREDENTIAL
              </Badge>
              <span className="text-[9px] font-mono text-[#1f3a30]/60 mt-1">
                ID: {credentialId}
              </span>
            </div>
          </div>

          {/* Certificate Body & Recipient Name */}
          <div className="my-auto text-center space-y-3 sm:space-y-4 py-4">
            <p className="font-serif italic text-xs sm:text-sm tracking-widest uppercase text-[#1f3a30]/70">
              This is to formally certify that
            </p>

            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-[#1f3a30] drop-shadow-xs">
              {recipientName}
            </h2>

            <div className="w-24 h-[1px] bg-[#1f3a30]/30 mx-auto" />

            <p className="font-serif text-xs sm:text-sm tracking-wide text-[#1f3a30]/80 max-w-lg mx-auto">
              has demonstrated technical mastery, evaluated practical execution, and successfully satisfied all rigorous curriculum requirements in
            </p>

            <h3 className="font-serif font-bold text-base sm:text-xl md:text-2xl text-[#1f3a30] tracking-wide">
              {courseTitle}
            </h3>
          </div>

          {/* Footer Signatures, QR and Ledger Stamp */}
          <div className="flex items-end justify-between pt-4 border-t border-[#1f3a30]/20">
            {/* Date & Registry */}
            <div className="text-left space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1f3a30]/60 block">
                Conferred On
              </span>
              <span className="font-serif text-xs sm:text-sm font-semibold text-[#1f3a30]">
                {issueDate}
              </span>
              <div className="text-[9px] font-mono text-[#1f3a30]/50">
                Ledger verified on Supabase PG
              </div>
            </div>

            {/* Center Seal Stamp */}
            <div className="hidden sm:flex flex-col items-center">
              <div className="h-16 w-16 rounded-full border-2 border-dashed border-[#1f3a30]/40 flex items-center justify-center bg-white/30 backdrop-blur-xs shadow-inner">
                <div className="text-center">
                  <Award className="h-5 w-5 mx-auto text-[#1f3a30]" />
                  <span className="text-[8px] font-mono uppercase tracking-tighter block text-[#1f3a30] font-bold">
                    Official
                  </span>
                </div>
              </div>
            </div>

            {/* Signatory Authority */}
            <div className="text-right space-y-0.5">
              <div className="font-serif italic text-base sm:text-lg text-[#1f3a30] font-bold">
                {signatoryName}
              </div>
              <div className="w-28 h-[1px] bg-[#1f3a30]/40 ml-auto" />
              <span className="text-[10px] font-serif text-[#1f3a30]/80 block">
                {signatoryTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EngravedCertificateTemplate;
