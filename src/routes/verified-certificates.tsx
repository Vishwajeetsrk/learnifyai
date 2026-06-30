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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/verified-certificates")({
  head: () => ({ meta: [{ title: "Verified Certificates — Learnify AI" }] }),
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

const CERTIFICATES = [
  {
    src: "/certificate%200.png",
    title: "Blue & Gold Classic",
    desc: "Professional navy with elegant gold accents",
  },
  {
    src: "/certificate%2001.png",
    title: "Purple & Gold Prestige",
    desc: "Regal purple with luxury gold detailing",
  },
  {
    src: "/certificate%2002.png",
    title: "Emerald & Gold Elite",
    desc: "Premium emerald green with gold trim",
  },
];

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

      {/* ═══════════ REAL CERTIFICATES ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
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
            <motion.div
              key={cert.title}
              className="rounded-xl border-2 border-primary/10 bg-card overflow-hidden group hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.1)" }}
            >
              <div className="aspect-[1.414] bg-gradient-to-br from-muted to-card overflow-hidden p-2">
                <img
                  src={cert.src}
                  alt={cert.title}
                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 text-center border-t border-border/50">
                <h3 className="text-sm font-bold">{cert.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{cert.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 pt-6">
          <div className="w-10 h-10 rounded bg-white dark:bg-gray-800 border flex items-center justify-center">
            <BadgeCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="text-[11px] text-left text-muted-foreground leading-tight">
            <div className="font-medium text-foreground">Scan to verify</div>
            <div>Unique QR code on every certificate</div>
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
