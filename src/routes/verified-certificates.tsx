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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EngravedCertificateTemplate } from "@/components/certificate/EngravedCertificateTemplate";

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
    icon: BookOpen,
    title: "Enroll in a Course",
    desc: "Choose a course that matches your learning goals and start your journey.",
  },
  {
    icon: Video,
    title: "Complete All Lessons",
    desc: "Watch videos, read learning materials, and finish every module.",
  },
  {
    icon: FileCheck,
    title: "Pass Quiz & Assessments",
    desc: "Complete quizzes, assignments, and practical exercises with the required score.",
  },
  {
    icon: Flag,
    title: "Course Completed",
    desc: "Once all requirements are met, your course will be marked as completed automatically.",
  },
  {
    icon: Award,
    title: "Certificate Generated",
    desc: "Learnify AI instantly generates a personalized certificate with student name, course name, completion date, certificate ID, QR verification, and Learnify AI Seal.",
  },
  {
    icon: Download,
    title: "Download & Share",
    desc: "Download your certificate as PDF. Share instantly on LinkedIn, resume, portfolio, or personal website.",
  },
  {
    icon: Rocket,
    title: "Showcase Your Achievement",
    desc: "Strengthen your resume, improve your LinkedIn profile, demonstrate new skills, and build professional credibility.",
  },
];

const BENEFITS = [
  {
    icon: GraduationCap,
    title: "Industry-Relevant Skills",
    desc: "Learn practical skills employers actually need.",
  },
  {
    icon: ShieldCheck,
    title: "Verified & Secure",
    desc: "Every certificate includes a unique verification ID and QR code.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Showcase achievements during internships, placements, and job applications.",
  },
  {
    icon: Globe,
    title: "Share Anywhere",
    desc: "Add certificates to LinkedIn, resumes, portfolios, and professional profiles.",
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

interface CertificatePreset {
  id: string;
  title: string;
  desc: string;
  badgeLabel: string;
  theme: "navy" | "purple" | "emerald";
  courseTitle: string;
  recipientName: string;
  issueDate: string;
  credentialId: string;
  borderColor: string;
  accentColor: string;
  bgGradient: string;
  innerBorder: string;
  ribbonColor: string;
}

const CERTIFICATES: CertificatePreset[] = [
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
          color: { dark: "#0A1128", light: "#ffffff" },
        }).then((data: string) => setQrUrl(data));
      })
      .catch(() => {});
  }, [cert.credentialId]);

  return (
    <motion.div
      key={cert.title}
      className="rounded-2xl border-2 border-primary/20 bg-card overflow-hidden group hover:border-primary/50 transition-all duration-300 flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6, boxShadow: "0 20px 45px rgba(0,0,0,0.18)" }}
    >
      {/* Live rendered Certificate vector view */}
      <div className="relative aspect-[1.414] overflow-hidden select-none p-3.5 sm:p-4 bg-slate-950 flex flex-col justify-between">
        {/* Certificate canvas background & gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${cert.bgGradient} opacity-95`}
        />

        {/* Guilloche / rosette decorative background pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
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
          className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 pointer-events-none"
          style={{ borderColor: cert.borderColor }}
        />
        <div
          className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 pointer-events-none"
          style={{ borderColor: cert.borderColor }}
        />
        <div
          className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 pointer-events-none"
          style={{ borderColor: cert.borderColor }}
        />
        <div
          className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 pointer-events-none"
          style={{ borderColor: cert.borderColor }}
        />

        {/* Watermark Overlay across the certificate */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="rotate-[-24deg] select-none text-center px-2 py-1 transform scale-90 sm:scale-100">
            <div className="text-[10px] sm:text-[11px] font-black tracking-[0.22em] text-red-400/50 uppercase border-y border-dashed border-red-400/50 py-1 px-3 bg-red-950/30 backdrop-blur-[0.5px]">
              DEMO SPECIMEN • NOT VALID UNTIL COMPLETION
            </div>
            <div className="text-[8px] font-bold tracking-[0.14em] text-amber-300/40 uppercase mt-0.5">
              COPYRIGHT © LEARNIFY AI • ALL RIGHTS RESERVED
            </div>
          </div>
        </div>

        {/* Content: Header */}
        <div className="relative z-10 text-center pt-1">
          <div className="inline-flex items-center justify-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[8px] sm:text-[9px] font-semibold text-white/90">
            <Award className="w-2.5 h-2.5" style={{ color: cert.borderColor }} />
            <span>LEARNIFY AI ACCREDITATION</span>
          </div>
          <p
            className="text-[9px] sm:text-[10px] font-serif font-bold uppercase tracking-[0.18em] mt-1.5"
            style={{ color: cert.borderColor }}
          >
            Certificate of Completion
          </p>
        </div>

        {/* Content: Recipient & Course */}
        <div className="relative z-10 text-center my-auto py-1">
          <p className="text-[8px] text-white/60 tracking-wider uppercase">
            This certifies that
          </p>
          <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide font-serif mt-0.5">
            {cert.recipientName}
          </h4>
          <p className="text-[7.5px] sm:text-[8.5px] text-white/70 mt-0.5">
            has successfully fulfilled all curriculum requirements for
          </p>
          <p
            className="text-[9px] sm:text-[10px] font-bold mt-0.5 px-2 truncate"
            style={{ color: cert.accentColor }}
          >
            {cert.courseTitle}
          </p>
        </div>

        {/* Content: Footer & Verification QR */}
        <div className="relative z-10 flex items-end justify-between pt-1 border-t border-white/10 text-[7px] sm:text-[8px] text-white/75">
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-1 text-[7px] text-white/60">
              <span>Date:</span>
              <span className="font-semibold text-white">{cert.issueDate}</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[7px] text-white/80">
              <span>ID:</span>
              <span className="font-bold text-amber-300">{cert.credentialId}</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[6.5px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
              <CheckCircle2 className="w-2 h-2" />
              <span>Attested Specimen</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-white p-0.5 shadow-sm border border-white/30 flex items-center justify-center overflow-hidden">
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
            <span className="text-[6.5px] text-white/60 mt-0.5 font-medium">Scan to verify</span>
          </div>
        </div>
      </div>

      {/* Card Info & Details */}
      <div className="p-4 text-center border-t border-border/50 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-foreground">
            <span>{cert.title}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-snug">{cert.desc}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between gap-2">
          <span className="text-[10px] text-muted-foreground font-mono">
            {cert.credentialId}
          </span>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-7 text-xs rounded-lg gap-1.5 font-medium"
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
  return (
    <div className="min-h-screen bg-background">
      {/* ═══════════ BACK BUTTON ═══════════ */}
      <div className="container mx-auto px-6 pt-6 max-w-5xl">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* ═══════════ HEADER / HERO ═══════════ */}
      <section className="container mx-auto px-6 pt-8 pb-16 md:pt-12 md:pb-20 max-w-5xl">
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
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-2 text-muted-foreground">
            Your path from enrollment to certification in 7 simple steps.
          </p>
        </motion.div>

        <div className="hidden lg:block relative">
          <div className="absolute left-0 right-0 top-12 h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
          <div className="grid grid-cols-7 gap-4 relative">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="flex flex-col items-center text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <motion.div
                    className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-shadow"
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">{i + 1}</span>
                    </div>
                  </motion.div>
                  <h3 className="text-sm font-bold mt-3">{step.title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="lg:hidden relative">
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />
          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="flex gap-5 relative"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <motion.div
                    className="relative z-10 shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/20"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">{i + 1}</span>
                    </div>
                  </motion.div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-sm font-bold">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ BENEFITS ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Why Learnify Certificates Matter
          </h2>
          <p className="mt-2 text-muted-foreground">
            Industry-recognized credentials that open doors.
          </p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="rounded-xl border bg-card p-5 text-center group hover:border-primary/20 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold mt-3">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5">{benefit.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-4xl">
        <div className="rounded-2xl border bg-card overflow-hidden">
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
                    <span className="text-sm">{f.label}</span>
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
                    <span className="text-sm">{f.label}</span>
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
      <section className="container mx-auto px-6 py-12 md:py-16 max-w-5xl border-t border-border/40">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Certificate of Completion
          </h2>
          <p className="mt-2 text-lg text-muted-foreground">Machine Learning Fundamentals</p>
          <p className="text-sm text-muted-foreground/80 mt-1">
            Issued to: Demo Learner &bull; ID: CERT-ML-2026 &bull; June 2026
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full mt-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified
          </div>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert, i) => (
            <RealCertificateCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>

        {/* Anti-tamper & Completion notice */}
        <motion.div
          className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 text-center max-w-3xl mx-auto backdrop-blur-sm"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Official Credential Issuance Policy
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The certificates displayed above are <span className="font-semibold text-foreground">watermarked demonstration specimens</span>. Upon completing 100% of your course syllabus and passing the final assessment, you will be awarded an <span className="font-semibold text-emerald-600 dark:text-emerald-400">official, authentic certificate</span> with all watermarks removed, lifetime cryptographic registration, and an active verifiable QR code that recruiters can scan instantly.
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-4 pt-6">
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
