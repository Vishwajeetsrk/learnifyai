import React, { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
  GraduationCap,
  TrendingUp,
  Globe,
  BookOpen,
  Video,
  FileCheck,
  Flag,
  Download,
  Rocket,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Linkedin,
  Share2,
  FileText,
  Search,
  QrCode,
  Eye,
  Lock,
  ShieldAlert,
  Copy,
  Check,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EngravedCertificateTemplate } from "@/components/certificate/EngravedCertificateTemplate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/verified-certificates")({
  head: () => ({
    meta: [
      { title: "Verified Certificates — Learnify AI" },
      {
        name: "description",
        content:
          "Earn tamper-proof, QR-verifiable certificates for completed courses and masteries on Learnify AI. Share directly to LinkedIn and resumes.",
      },
      { property: "og:title", content: "Verified Certificates — Learnify AI" },
      { property: "og:description", content: "Earn tamper-proof, QR-verifiable certificates for completed courses and masteries on Learnify AI." },
      { property: "og:url", content: "https://www.learnifyai.in/verified-certificates" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Verified Certificates — Learnify AI" },
      { name: "twitter:description", content: "Earn tamper-proof, QR-verifiable certificates on Learnify AI. Share to LinkedIn and resumes." },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/verified-certificates" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "EducationalOccupationalCredential",
              name: "Learnify AI Verified Certificate",
              credentialCategory: "certificate",
              educationalLevel: "Professional & University Level",
              description:
                "Cryptographically tamper-proof digital certificate with unique QR code verification, issued upon completing rigorous AI engineering masteries.",
              recognizedBy: {
                "@type": "EducationalOrganization",
                name: "Learnify AI",
                url: "https://www.learnifyai.in",
              },
            },
            {
              "@type": "HowTo",
              name: "How to Earn a Verified Certificate on Learnify AI",
              description:
                "Complete four simple steps to earn an accredited, recruiter-ready certificate in Full-Stack AI, Python, or Cloud Engineering.",
              step: [
                {
                  "@type": "HowToStep",
                  position: 1,
                  name: "Enroll in a Course",
                  text: "Choose an AI engineering or development course that matches your learning goals.",
                },
                {
                  "@type": "HowToStep",
                  position: 2,
                  name: "Complete All Lessons",
                  text: "Engage with lessons, solve exercises with your 1-on-1 AI tutor, and build practical projects.",
                },
                {
                  "@type": "HowToStep",
                  position: 3,
                  name: "Pass Assessment",
                  text: "Complete the final assessment to demonstrate concept mastery.",
                },
                {
                  "@type": "HowToStep",
                  position: 4,
                  name: "Verify & Share",
                  text: "Receive your tamper-proof certificate with unique QR code and one-click share to LinkedIn.",
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: VerifiedCertificatesPage,
});

const STEPS = [
  {
    step: 1,
    icon: BookOpen,
    title: "Enroll in a Course",
    desc: "Choose a course that matches your learning goals and start your journey.",
    tag: "Step 1 • Enrollment",
    badgeColor: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    step: 2,
    icon: Video,
    title: "Complete All Lessons",
    desc: "Watch videos, read learning materials, and finish every module.",
    tag: "Step 2 • Active Learning",
    badgeColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    step: 3,
    icon: FileCheck,
    title: "Pass Quiz & Assessments",
    desc: "Complete quizzes, assignments, and practical exercises with the required score.",
    tag: "Step 3 • Concept Mastery",
    badgeColor: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    step: 4,
    icon: Flag,
    title: "Course Completed",
    desc: "Once all requirements are met, your course will be marked as completed automatically.",
    tag: "Step 4 • Auto Milestone",
    badgeColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    step: 5,
    icon: Award,
    title: "Certificate Generated",
    desc: "Learnify AI instantly generates a personalized certificate with student name, course name, completion date, certificate ID, QR verification, and Learnify AI Seal.",
    tag: "Step 5 • Rupee-Grade Seal & QR",
    badgeColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    gradient: "from-amber-500 to-yellow-600",
    featured: true,
  },
  {
    step: 6,
    icon: Download,
    title: "Download & Share",
    desc: "Download your certificate as PDF. Share instantly on LinkedIn, resume, portfolio, or personal website.",
    tag: "Step 6 • PDF & 1-Click LinkedIn",
    badgeColor: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    step: 7,
    icon: Rocket,
    title: "Showcase Your Achievement",
    desc: "Strengthen your resume, improve your LinkedIn profile, demonstrate new skills, and build professional credibility.",
    tag: "Step 7 • Career Launch",
    badgeColor: "bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-600/30",
    gradient: "from-blue-600 to-cyan-500",
  },
];

const BENEFITS = [
  {
    icon: GraduationCap,
    title: "Industry-Relevant Skills",
    desc: "Learn practical skills employers actually need.",
    badge: "Employer Focused",
    highlights: ["Real-world project deliverables", "Hands-on coding assessments", "Production-grade frameworks"],
  },
  {
    icon: ShieldCheck,
    title: "Verified & Secure",
    desc: "Every certificate includes a unique verification ID and QR code.",
    badge: "100% Tamper Proof",
    highlights: ["Rupee-grade intaglio security stamp", "Cryptographic ledger verification", "Instant public QR lookup"],
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Showcase achievements during internships, placements, and job applications.",
    badge: "Placement Accelerator",
    highlights: ["Recruiter verified credentials", "Internship portfolio booster", "Verified proof of expertise"],
  },
  {
    icon: Globe,
    title: "Share Anywhere",
    desc: "Add certificates to LinkedIn, resumes, portfolios, and professional profiles.",
    badge: "1-Click Sync",
    highlights: ["Official LinkedIn Add-to-Profile button", "High-resolution vector PDF export", "Shareable verification URL"],
  },
];

const FEATURES = [
  { icon: Award, label: "Learnify AI Branding" },
  { icon: Search, label: "Unique Certificate ID" },
  { icon: BadgeCheck, label: "QR Verification" },
  { icon: FileText, label: "Completion Date" },
  { icon: FileText, label: "Course Details" },
  { icon: FileText, label: "Instructor / Organization Signature" },
  { icon: Download, label: "Download PDF" },
  { icon: Linkedin, label: "Share to LinkedIn" },
  { icon: ShieldCheck, label: "Lifetime Verification" },
  { icon: ShieldCheck, label: "Digital Record Storage" },
];

/**
 * Banknote-grade Uncopyable Security Stamp inspired by Indian Rupee currency seals.
 * Features 32 scalloped starburst teeth, circular micro-lettering, 16-spoke lathe wheel,
 * 3D metallic foil gradient shading, and the sovereign Rupee (₹) security knotwork with mortarboard crest.
 */
export function IndianRupeeSecurityStamp({
  variant = "gold",
  size = 54,
  className,
}: {
  variant?: "gold" | "platinum" | "emerald" | "purple";
  size?: number;
  className?: string;
}) {
  const stampId = React.useId().replace(/:/g, "");

  const colors = {
    gold: {
      metal1: "#FFFBEB",
      metal2: "#FBBF24",
      metal3: "#D97706",
      metal4: "#92400E",
      rim: "#F59E0B",
      text: "#78350F",
      glyph: "#78350F",
      ribbon: "#D97706",
      ribbonBorder: "#FDE68A",
    },
    platinum: {
      metal1: "#FFFFFF",
      metal2: "#E2E8F0",
      metal3: "#94A3B8",
      metal4: "#475569",
      rim: "#CBD5E1",
      text: "#0F172A",
      glyph: "#0F172A",
      ribbon: "#64748B",
      ribbonBorder: "#F1F5F9",
    },
    emerald: {
      metal1: "#ECFDF5",
      metal2: "#34D399",
      metal3: "#059669",
      metal4: "#064E3B",
      rim: "#10B981",
      text: "#064E3B",
      glyph: "#022C22",
      ribbon: "#059669",
      ribbonBorder: "#A7F3D0",
    },
    purple: {
      metal1: "#FAF5FF",
      metal2: "#C084FC",
      metal3: "#9333EA",
      metal4: "#581C87",
      rim: "#A855F7",
      text: "#581C87",
      glyph: "#3B0764",
      ribbon: "#9333EA",
      ribbonBorder: "#E9D5FF",
    },
  }[variant];

  // 32-point rosette coordinates
  const rosettePoints = Array.from({ length: 32 })
    .map((_, i) => {
      const angle = (i * Math.PI) / 16;
      const r = i % 2 === 0 ? 46 : 41;
      const x = 50 + r * Math.cos(angle);
      const y = 50 + r * Math.sin(angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  // 16 radial spokes
  const spokes = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * Math.PI) / 8;
    const x1 = 50 + 17 * Math.cos(angle);
    const y1 = 50 + 17 * Math.sin(angle);
    const x2 = 50 + 26 * Math.cos(angle);
    const y2 = 50 + 26 * Math.sin(angle);
    return { x1, y1, x2, y2 };
  });

  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none group", className)}
      style={{ width: size, height: size * 1.15 }}
      title="Bank-Grade Tamper-Proof Security Seal with Rupee-Grade Lathe Knotwork"
    >
      <svg
        viewBox="0 0 100 115"
        className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-metal-${stampId}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.metal1} />
            <stop offset="35%" stopColor={colors.metal2} />
            <stop offset="70%" stopColor={colors.metal3} />
            <stop offset="100%" stopColor={colors.metal4} />
          </linearGradient>
          <linearGradient id={`grad-rim-${stampId}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={colors.metal4} />
            <stop offset="50%" stopColor={colors.metal1} />
            <stop offset="100%" stopColor={colors.metal3} />
          </linearGradient>
          <radialGradient id={`grad-inner-${stampId}`} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={colors.metal1} />
            <stop offset="75%" stopColor={colors.metal2} />
            <stop offset="100%" stopColor={colors.metal3} />
          </radialGradient>
          <path
            id={`text-path-${stampId}`}
            d="M 50,50 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
          />
        </defs>

        {/* Notched Ribbon Tails */}
        <g opacity="0.95">
          <polygon
            points="38,82 28,110 38,104 46,110 46,82"
            fill={colors.ribbon}
            stroke={colors.ribbonBorder}
            strokeWidth="0.8"
          />
          <polygon
            points="54,82 54,110 62,104 72,110 62,82"
            fill={colors.ribbon}
            stroke={colors.ribbonBorder}
            strokeWidth="0.8"
          />
        </g>

        {/* Outer 32-point Rosette Serration */}
        <polygon
          points={rosettePoints}
          fill={`url(#grad-metal-${stampId})`}
          stroke={`url(#grad-rim-${stampId})`}
          strokeWidth="1.2"
        />

        {/* Concentric Guilloche Rings */}
        <circle cx="50" cy="50" r="39" fill="none" stroke={colors.metal4} strokeWidth="0.6" strokeDasharray="1,1" />
        <circle cx="50" cy="50" r="37.5" fill="none" stroke={colors.metal1} strokeWidth="0.8" />
        <circle cx="50" cy="50" r="35" fill={`url(#grad-inner-${stampId})`} stroke={colors.rim} strokeWidth="1" />

        {/* Circular Micro-lettering Security Ring */}
        <circle cx="50" cy="50" r="28" fill="none" stroke={colors.metal4} strokeWidth="0.4" strokeDasharray="2,1" />
        <text
          fontSize="4.2"
          fontWeight="bold"
          fill={colors.text}
          letterSpacing="0.8"
        >
          <textPath href={`#text-path-${stampId}`} startOffset="50%" textAnchor="middle">
            ★ LEARNIFY AI • VERIFIED RUPEE SPECIMEN ★
          </textPath>
        </text>

        {/* Center Intaglio Medallion */}
        <circle cx="50" cy="50" r="18" fill={`url(#grad-metal-${stampId})`} stroke={colors.metal4} strokeWidth="0.8" />
        <circle cx="50" cy="50" r="16.5" fill="none" stroke={colors.metal1} strokeWidth="0.5" strokeDasharray="1,0.8" />

        {/* 16 Radial Lathe Spokes */}
        {spokes.map((s, idx) => (
          <line
            key={idx}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={colors.metal4}
            strokeWidth="0.4"
            opacity="0.6"
          />
        ))}

        {/* Sovereign Rupee Symbol (₹) + Mortarboard Crown */}
        <g transform="translate(50, 50) scale(0.95) translate(-50, -50)">
          <path
            d="M 50,40 L 55,42.5 L 50,45 L 45,42.5 Z"
            fill={colors.glyph}
            opacity="0.85"
          />
          <circle cx="50" cy="38" r="0.8" fill={colors.metal1} />

          <text
            x="50"
            y="56"
            textAnchor="middle"
            fontSize="14"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fill={colors.glyph}
            className="select-none"
            style={{ textShadow: "0 1px 1px rgba(255,255,255,0.7)" }}
          >
            ₹
          </text>
        </g>

        {/* Specular 3D highlight */}
        <ellipse
          cx="42"
          cy="38"
          rx="18"
          ry="10"
          fill="white"
          opacity="0.25"
          transform="rotate(-25 42 38)"
          pointerEvents="none"
        />
      </svg>
    </div>
  );
}

interface CertificatePreset {
  id: string;
  title: string;
  desc: string;
  badgeLabel: string;
  theme: "parchment" | "platinum" | "navy" | "purple" | "emerald";
  courseTitle: string;
  recipientName: string;
  issueDate: string;
  credentialId: string;
  borderColor: string;
  accentColor: string;
  bgGradient: string;
  innerBorder: string;
  ribbonColor: string;
  isLight?: boolean;
  sealVariant?: "gold" | "platinum" | "emerald" | "purple";
}

const CERTIFICATES: CertificatePreset[] = [
  {
    id: "CERT-PA-2026",
    title: "Royal Parchment & Gold",
    desc: "Antique warm parchment ivory with burnished 24K gold foil borders and intaglio ink",
    badgeLabel: "Learnify AI Verified Certificate — Royal Parchment & Gold",
    theme: "parchment",
    courseTitle: "Machine Learning Fundamentals",
    recipientName: "Demo Learner",
    issueDate: "June 2026",
    credentialId: "CERT-PA-2026",
    borderColor: "#C5A059",
    accentColor: "#92400E",
    bgGradient: "from-[#FDFBF7] via-[#F8F3E6] to-[#EDE3D0]",
    innerBorder: "rgba(197, 160, 89, 0.55)",
    ribbonColor: "#B4832C",
    isLight: true,
    sealVariant: "gold",
  },
  {
    id: "CERT-PL-2026",
    title: "Executive Platinum & Diamond",
    desc: "Lustrous silvery platinum with cool diamond reflective borders and sapphire sheen",
    badgeLabel: "Learnify AI Verified Certificate — Executive Platinum & Diamond",
    theme: "platinum",
    courseTitle: "Machine Learning Fundamentals",
    recipientName: "Demo Learner",
    issueDate: "June 2026",
    credentialId: "CERT-PL-2026",
    borderColor: "#94A3B8",
    accentColor: "#0284C7",
    bgGradient: "from-[#FFFFFF] via-[#F8FAFC] to-[#E2E8F0]",
    innerBorder: "rgba(148, 163, 184, 0.55)",
    ribbonColor: "#64748B",
    isLight: true,
    sealVariant: "platinum",
  },
  {
    id: "CERT-ML-2026",
    title: "Blue & Gold Classic",
    desc: "Professional navy with elegant gold accents",
    badgeLabel: "Learnify AI Verified Certificate — Blue & Gold Classic",
    theme: "navy",
    courseTitle: "Machine Learning Fundamentals",
    recipientName: "Demo Learner",
    issueDate: "June 2026",
    credentialId: "CERT-ML-2026",
    borderColor: "#D4AF37",
    accentColor: "#F59E0B",
    bgGradient: "from-[#070D1E] via-[#0D1836] to-[#060B18]",
    innerBorder: "rgba(212, 175, 55, 0.45)",
    ribbonColor: "#D4AF37",
    isLight: false,
    sealVariant: "gold",
  },
  {
    id: "CERT-AI-2026",
    title: "Purple & Gold Prestige",
    desc: "Regal purple with luxury gold detailing",
    badgeLabel: "Learnify AI Verified Certificate — Purple & Gold Prestige",
    theme: "purple",
    courseTitle: "Machine Learning Fundamentals",
    recipientName: "Demo Learner",
    issueDate: "June 2026",
    credentialId: "CERT-AI-2026",
    borderColor: "#EAB308",
    accentColor: "#C084FC",
    bgGradient: "from-[#19092B] via-[#260E42] to-[#140624]",
    innerBorder: "rgba(234, 179, 8, 0.45)",
    ribbonColor: "#A855F7",
    isLight: false,
    sealVariant: "purple",
  },
  {
    id: "CERT-EM-2026",
    title: "Emerald & Gold Elite",
    desc: "Premium emerald green with gold trim",
    badgeLabel: "Learnify AI Verified Certificate — Emerald & Gold Elite",
    theme: "emerald",
    courseTitle: "Machine Learning Fundamentals",
    recipientName: "Demo Learner",
    issueDate: "June 2026",
    credentialId: "CERT-EM-2026",
    borderColor: "#10B981",
    accentColor: "#34D399",
    bgGradient: "from-[#031E15] via-[#052E21] to-[#021710]",
    innerBorder: "rgba(16, 185, 129, 0.45)",
    ribbonColor: "#10B981",
    isLight: false,
    sealVariant: "emerald",
  },
];

function RealCertificateCard({
  cert,
  index,
}: {
  cert: CertificatePreset;
  index: number;
}) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.learnifyai.in";
    const targetUrl = `${origin}/verify/${cert.credentialId}`;
    import("qrcode")
      .then((mod) => {
        const QRCode = (mod as any).default || mod;
        QRCode.toDataURL(targetUrl, {
          margin: 1,
          width: 140,
          color: {
            dark: cert.isLight ? "#0F172A" : "#0A1128",
            light: "#ffffff",
          },
        }).then((data: string) => setQrUrl(data));
      })
      .catch(() => {});
  }, [cert.credentialId, cert.isLight]);

  const copyVerifyLink = () => {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://www.learnifyai.in";
    const fullUrl = `${origin}/verify/${cert.credentialId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success(`Verification link copied for ${cert.credentialId}!`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.div
      key={cert.title}
      className={cn(
        "rounded-2xl border-2 bg-card overflow-hidden group transition-all duration-300 flex flex-col shadow-md",
        cert.isLight
          ? "border-amber-200/60 dark:border-amber-800/40 hover:border-amber-400"
          : "border-primary/20 hover:border-primary/50"
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -6, boxShadow: "0 22px 50px rgba(0,0,0,0.18)" }}
    >
      {/* Live rendered Certificate vector view */}
      <div
        className={cn(
          "relative aspect-[1.414] overflow-hidden select-none p-3.5 sm:p-4.5 flex flex-col justify-between",
          cert.isLight ? "bg-[#FAF8F5]" : "bg-slate-950"
        )}
      >
        {/* Certificate canvas background & gradient */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition-opacity",
            cert.bgGradient,
            cert.isLight ? "opacity-100" : "opacity-95"
          )}
        />

        {/* Guilloche / rosette decorative background pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={`guilloche-${cert.id}`}
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={cert.borderColor}
                strokeWidth="0.6"
              />
              <circle
                cx="18"
                cy="18"
                r="8"
                fill="none"
                stroke={cert.borderColor}
                strokeWidth="0.4"
                strokeDasharray="2,2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#guilloche-${cert.id})`} />
        </svg>

        {/* Ornate Frame Border */}
        <div
          className="absolute inset-2.5 sm:inset-3 rounded-lg pointer-events-none border"
          style={{ borderColor: cert.innerBorder }}
        />
        <div
          className="absolute inset-3.5 sm:inset-4 rounded pointer-events-none border border-dashed"
          style={{ borderColor: `${cert.borderColor}40` }}
        />

        {/* Corner rosettes */}
        <div
          className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 pointer-events-none"
          style={{ borderColor: cert.borderColor }}
        />
        <div
          className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 pointer-events-none"
          style={{ borderColor: cert.borderColor }}
        />
        <div
          className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 pointer-events-none"
          style={{ borderColor: cert.borderColor }}
        />
        <div
          className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 pointer-events-none"
          style={{ borderColor: cert.borderColor }}
        />

        {/* Subtle Banknote Micro-Pattern Watermark Background (Zero text obstruction) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 overflow-hidden">
          <div className="rotate-[-25deg] select-none text-center">
            <span
              className={cn(
                "text-2xl font-black tracking-[0.4em] uppercase font-serif",
                cert.isLight ? "text-amber-950" : "text-white"
              )}
            >
              LEARNIFY AI VERIFIED
            </span>
          </div>
        </div>

        {/* Content: Header with 100% visible text */}
        <div className="relative z-10 text-center pt-1">
          <div
            className={cn(
              "inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-bold tracking-wider uppercase",
              cert.isLight
                ? "bg-amber-100/70 border-amber-300 text-amber-950 shadow-xs"
                : "bg-white/10 backdrop-blur-sm border-white/20 text-white"
            )}
          >
            <Award className="w-2.5 h-2.5" style={{ color: cert.borderColor }} />
            <span>LEARNIFY AI ACCREDITATION</span>
          </div>
          <p
            className={cn(
              "text-[9px] sm:text-[10px] font-serif font-black uppercase tracking-[0.18em] mt-1.5",
              cert.isLight ? "text-[#78350F]" : "text-amber-300"
            )}
          >
            Certificate of Completion
          </p>
        </div>

        {/* Content: Recipient & Course (Crystal clear readability) */}
        <div className="relative z-10 text-center my-auto py-1">
          <p
            className={cn(
              "text-[8px] tracking-wider uppercase font-medium",
              cert.isLight ? "text-amber-950/70" : "text-white/75"
            )}
          >
            This certifies that
          </p>
          <h4
            className={cn(
              "text-xs sm:text-sm font-black tracking-wide font-serif mt-0.5",
              cert.isLight ? "text-[#1F1610]" : "text-white drop-shadow-xs"
            )}
          >
            {cert.recipientName}
          </h4>
          <p
            className={cn(
              "text-[7.5px] sm:text-[8.5px] mt-0.5",
              cert.isLight ? "text-amber-950/80 font-medium" : "text-white/80"
            )}
          >
            has successfully fulfilled all curriculum requirements for
          </p>
          <p
            className={cn(
              "text-[9px] sm:text-[10.5px] font-bold mt-0.5 px-2 truncate",
              cert.isLight ? "text-[#92400E]" : "text-amber-300"
            )}
          >
            {cert.courseTitle}
          </p>
        </div>

        {/* Content: Footer with Indian Rupee Security Stamp & Verification QR */}
        <div
          className={cn(
            "relative z-10 flex items-end justify-between pt-1 border-t text-[7px] sm:text-[8px]",
            cert.isLight
              ? "border-amber-900/15 text-stone-800"
              : "border-white/15 text-white/85"
          )}
        >
          {/* Metadata */}
          <div className="space-y-0.5 text-left">
            <div
              className={cn(
                "flex items-center gap-1 text-[7px]",
                cert.isLight ? "text-stone-600 font-medium" : "text-white/70"
              )}
            >
              <span>Date:</span>
              <span className={cn("font-bold", cert.isLight ? "text-stone-900" : "text-white")}>
                {cert.issueDate}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[7px]">
              <span className={cert.isLight ? "text-stone-600" : "text-white/70"}>ID:</span>
              <span
                className={cn(
                  "font-bold",
                  cert.isLight ? "text-amber-900" : "text-amber-300"
                )}
              >
                {cert.credentialId}
              </span>
            </div>
            <div
              className={cn(
                "inline-flex items-center gap-1 text-[6.5px] font-bold px-1.5 py-0.5 rounded border",
                cert.isLight
                  ? "text-emerald-800 bg-emerald-100/80 border-emerald-300"
                  : "text-emerald-300 bg-emerald-950/80 border-emerald-500/40"
              )}
            >
              <CheckCircle2 className="w-2 h-2 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Specimen</span>
            </div>
          </div>

          {/* Bank-Grade Indian Rupee Security Stamp */}
          <div className="flex flex-col items-center justify-end pb-0.5">
            <IndianRupeeSecurityStamp
              variant={cert.sealVariant || "gold"}
              size={44}
            />
          </div>

          {/* Verification QR Code */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-white p-0.5 shadow-md border border-black/10 flex items-center justify-center overflow-hidden">
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt={`Verification QR Code for ${cert.credentialId}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <QrCode className="w-5 h-5 text-slate-900" />
              )}
            </div>
            <span
              className={cn(
                "text-[6.5px] mt-0.5 font-semibold",
                cert.isLight ? "text-stone-600" : "text-white/70"
              )}
            >
              Scan to verify
            </span>
          </div>
        </div>
      </div>

      {/* Card Info & Details */}
      <div className="p-4 text-center border-t border-border/50 flex-1 flex flex-col justify-between bg-card">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-foreground">
            <span>{cert.title}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">{cert.desc}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={copyVerifyLink}
            className="text-[10px] text-muted-foreground font-mono hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition py-1 px-1.5 rounded hover:bg-muted"
            title="Click to copy ID and verify URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{cert.credentialId}</span>
          </button>

          <Button
            asChild
            size="sm"
            variant="default"
            className="h-8 text-xs rounded-lg gap-1.5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Link to="/verify/$id" params={{ id: cert.credentialId }}>
              <ExternalLink className="w-3 h-3" />
              Verify Link
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function VerifiedCertificatesPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredCerts =
    selectedFilter === "all"
      ? CERTIFICATES
      : CERTIFICATES.filter((c) => c.theme === selectedFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════ BACK BUTTON ═══════════ */}
      <div className="container mx-auto px-6 pt-6 max-w-6xl">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* ═══════════ HEADER / HERO ═══════════ */}
      <section className="container mx-auto px-6 pt-8 pb-16 md:pt-12 md:pb-20 max-w-6xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 px-4 py-1.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-0">
            <Award className="w-3.5 h-3.5 mr-1.5 inline" />
            Verified Certificates
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your Certificate Journey
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete a course, pass assessments, and earn a verified certificate that you can
            download, share on LinkedIn, and showcase in your portfolio.
          </p>
          <p className="mt-3 text-sm text-muted-foreground/80 max-w-xl mx-auto">
            Every certificate earned on Learnify AI is securely generated, verifiable, and designed
            to help you demonstrate your skills to employers, colleges, and clients.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { value: "10,000+", label: "Certificates Issued" },
            { value: "95%", label: "Verification Rate" },
            { value: "50+", label: "Courses Available" },
            { value: "4.8", label: "Avg. Rating" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-gradient-to-b from-card to-muted/30 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══════════ 7-STEP TIMELINE ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 text-xs border-primary/30 text-primary bg-primary/5 font-semibold"
          >
            Step-By-Step Journey
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Your path from enrollment to certification in 7 simple steps.
          </p>
        </motion.div>

        {/* 7-Step Grid Layout with Luxury Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isFeatured = (step as any).featured;
            return (
              <motion.div
                key={step.title}
                className={cn(
                  "relative rounded-2xl border p-5 flex flex-col justify-between group transition-all duration-300",
                  isFeatured
                    ? "bg-gradient-to-b from-amber-500/10 via-card to-card border-amber-500/40 shadow-lg shadow-amber-500/5 sm:col-span-2 lg:col-span-2"
                    : "bg-card border-border/60 hover:border-primary/40 shadow-xs"
                )}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4, boxShadow: "0 14px 30px rgba(0,0,0,0.08)" }}
              >
                <div>
                  {/* Top Bar with Number Badge & Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm bg-gradient-to-br",
                        step.gradient
                      )}
                    >
                      {step.step}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        step.badgeColor
                      )}
                    >
                      {step.tag}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mt-1">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs bg-gradient-to-br",
                        step.gradient
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {isFeatured && (
                  <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center gap-2 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Includes Rupee-Grade Lathe Security Seal & Cryptographic QR Verification</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ BENEFITS ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 text-xs border-primary/30 text-primary bg-primary/5 font-semibold"
          >
            Credential Value
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Why Learnify Certificates Matter
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Industry-recognized credentials that open doors.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="rounded-2xl border bg-card p-6 flex flex-col justify-between group hover:border-primary/30 transition-all duration-300 shadow-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mt-2">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{benefit.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 space-y-1.5">
                  {benefit.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-4xl">
        <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-6 py-4 border-b border-border/50">
            <h2 className="text-lg font-bold text-center">Included In Every Certificate</h2>
          </div>
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
            <div className="divide-y divide-border/50">
              {FEATURES.slice(0, 5).map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-3 px-6 py-3.5">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{f.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="divide-y divide-border/50">
              {FEATURES.slice(5).map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-3 px-6 py-3.5">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{f.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ INTERACTIVE ENGRAVED STAGE ═══════════ */}
      <section className="container mx-auto px-6 py-12 md:py-16 max-w-5xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 text-xs border-emerald-500/30 text-emerald-500 bg-emerald-500/10 font-mono tracking-wider uppercase"
          >
            Live Credential Stage
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
            Interactive Certificate Engine
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Experience our ThreeUI harmonic guilloche rosette engraving in real-time. Full tamper-proof cryptographic metadata with instantaneous QR verification.
          </p>
        </motion.div>

        <div className="mb-12 flex justify-center">
          <EngravedCertificateTemplate
            initialRecipientName="Sarah Jenkins"
            initialCourseTitle="Advanced AI Systems & Autonomous Agent Engineering"
            initialIssueDate="October 2026"
            initialCredentialId="LRNAI-2026-8821V"
            logoUrl="/logo.png"
          />
        </div>
      </section>

      {/* ═══════════ REAL CERTIFICATES ═══════════ */}
      <section className="container mx-auto px-6 py-14 md:py-20 max-w-6xl border-t border-border/40">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-3 px-3 py-1 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 font-semibold"
          >
            Tamper-Proof Specimen Gallery
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Certificate of Completion
          </h2>
          <p className="mt-2 text-lg text-muted-foreground font-medium">Machine Learning Fundamentals</p>
          <p className="text-sm text-muted-foreground/80 mt-1">
            Issued to: <span className="font-semibold text-foreground">Demo Learner</span> &bull; ID: <span className="font-mono font-bold text-primary">CERT-ML-2026</span> &bull; June 2026
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full mt-3 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Verified</span>
          </div>
        </motion.div>

        {/* Theme Selection Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: "all", label: "All Editions (5)" },
            { id: "parchment", label: "Royal Parchment" },
            { id: "platinum", label: "Executive Platinum" },
            { id: "navy", label: "Blue & Gold Classic" },
            { id: "purple", label: "Purple & Gold Prestige" },
            { id: "emerald", label: "Emerald & Gold Elite" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border",
                selectedFilter === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                  : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Certificate Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert, i) => (
            <RealCertificateCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {/* Anti-tamper & Completion notice */}
        <motion.div
          className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 text-center max-w-3xl mx-auto backdrop-blur-sm"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Official Credential Issuance Policy
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The certificates displayed above are <span className="font-semibold text-foreground">official specimen credentials</span> equipped with Banknote-Grade Intaglio Security Seals and uncopyable Rupee geometry. Upon completing 100% of your course syllabus and passing the final assessment, you will be awarded an <span className="font-semibold text-emerald-600 dark:text-emerald-400">authentic accredited certificate</span> with lifetime cryptographic registration and active public QR lookup that recruiters can scan instantly.
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 pt-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
            <BadgeCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="text-[11px] text-left text-muted-foreground leading-tight">
            <div className="font-medium text-foreground">Scan to verify</div>
            <div>Unique cryptographic QR code on every authentic certificate</div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-24 max-w-3xl">
        <motion.div
          className="rounded-2xl bg-gradient-to-br from-primary via-primary to-purple-700 p-8 md:p-12 text-center text-white shadow-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Award className="w-8 h-8" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready To Earn Your Next Certificate?
          </h2>
          <p className="mt-3 text-white/80 text-sm max-w-md mx-auto">
            Complete your course and unlock a verified certificate that showcases your skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 font-semibold px-8"
            >
              <Link to="/signup">
                Start Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl bg-white/20 text-white hover:bg-white/30 font-semibold px-8"
            >
              <Link to="/pricing" search={{ subscribe: undefined }}>
                View Pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ BACK TO TOP ═══════════ */}
      <div className="container mx-auto px-6 pb-12 max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mx-auto gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

