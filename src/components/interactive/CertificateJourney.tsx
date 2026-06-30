import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Award,
  CheckCircle2,
  BookOpen,
  Video,
  FileCheck,
  Flag,
  Download,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Globe,
  Zap,
  Share2,
  Linkedin,
  GraduationCap,
  FileText,
  Search,
  ExternalLink,
  BadgeCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePublicSection } from "@/hooks/use-wcms-public";

const FALLBACK_CONTENT = {
  badge: "Verified Certificates",
  headline: "Your Certificate Journey",
  subheadline:
    "Complete a course, pass assessments, and earn a verified certificate that you can download, share on LinkedIn, and showcase in your portfolio.",
  description:
    "Every certificate earned on Learnify AI is securely generated, verifiable, and designed to help you demonstrate your skills to employers, colleges, and clients.",
  steps: [
    {
      icon: "📚",
      title: "Enroll in a Course",
      description: "Choose a course that matches your learning goals and start your journey.",
    },
    {
      icon: "🎥",
      title: "Complete All Lessons",
      description: "Watch videos, read learning materials, and finish every module.",
    },
    {
      icon: "📝",
      title: "Pass Quiz & Assessments",
      description: "Complete quizzes, assignments, and practical exercises with the required score.",
    },
    {
      icon: "✅",
      title: "Course Completed",
      description: "Once all requirements are met, your course will be marked as completed automatically.",
    },
    {
      icon: "🏆",
      title: "Certificate Generated",
      description:
        "Learnify AI instantly generates a personalized certificate with student name, course name, completion date, certificate ID, QR verification, and Learnify AI Seal.",
    },
    {
      icon: "📥",
      title: "Download & Share",
      description:
        "Download your certificate as PDF. Share instantly on LinkedIn, resume, portfolio, or personal website.",
    },
    {
      icon: "🚀",
      title: "Showcase Your Achievement",
      description:
        "Strengthen your resume, improve your LinkedIn profile, demonstrate new skills, and build professional credibility.",
    },
  ],
  benefits: [
    {
      icon: "🎓",
      title: "Industry-Relevant Skills",
      description: "Learn practical skills employers actually need.",
    },
    {
      icon: "🔒",
      title: "Verified & Secure",
      description: "Every certificate includes a unique verification ID and QR code.",
    },
    {
      icon: "📈",
      title: "Career Growth",
      description: "Showcase achievements during internships, placements, and job applications.",
    },
    {
      icon: "🌎",
      title: "Share Anywhere",
      description: "Add certificates to LinkedIn, resumes, portfolios, and professional profiles.",
    },
  ],
  features: [
    "Learnify AI Branding",
    "Unique Certificate ID",
    "QR Verification",
    "Completion Date",
    "Course Details",
    "Instructor / Organization Signature",
    "Download PDF",
    "Share to LinkedIn",
    "Lifetime Verification",
    "Digital Record Storage",
  ],
  cta: {
    headline: "Ready To Earn Your Next Certificate?",
    description: "Complete your course and unlock a verified certificate that showcases your skills.",
    primary_label: "Start Learning",
    primary_url: "/signup",
    secondary_label: "View Sample Certificate",
    secondary_url: "/certificates/demo",
  },
  stats: [
    { value: "10,000+", label: "Certificates Issued" },
    { value: "95%", label: "Verification Rate" },
    { value: "50+", label: "Courses Available" },
    { value: "4.8", label: "Avg. Rating" },
  ],
};

function StepIcon({ icon, index }: { icon: string; index: number }) {
  const icons = [
    <BookOpen key="0" className="w-5 h-5" />,
    <Video key="1" className="w-5 h-5" />,
    <FileCheck key="2" className="w-5 h-5" />,
    <Flag key="3" className="w-5 h-5" />,
    <Award key="4" className="w-5 h-5" />,
    <Download key="5" className="w-5 h-5" />,
    <Rocket key="6" className="w-5 h-5" />,
  ];
  return icons[index] || <Sparkles className="w-5 h-5" />;
}

function BenefitIcon({ icon }: { icon: string }) {
  const map: Record<string, React.ReactNode> = {
    "🎓": <GraduationCap className="w-6 h-6" />,
    "🔒": <ShieldCheck className="w-6 h-6" />,
    "📈": <TrendingUp className="w-6 h-6" />,
    "🌎": <Globe className="w-6 h-6" />,
  };
  return map[icon] || <Sparkles className="w-6 h-6" />;
}

function FeatureIcon({ feature }: { feature: string }) {
  const map: Record<string, React.ReactNode> = {
    "Learnify AI Branding": <Award className="w-4 h-4 text-primary" />,
    "Unique Certificate ID": <Search className="w-4 h-4 text-primary" />,
    "QR Verification": <BadgeCheck className="w-4 h-4 text-primary" />,
    "Completion Date": <CalendarIcon className="w-4 h-4 text-primary" />,
    "Course Details": <FileText className="w-4 h-4 text-primary" />,
    "Instructor / Organization Signature": <PenIcon className="w-4 h-4 text-primary" />,
    "Download PDF": <Download className="w-4 h-4 text-primary" />,
    "Share to LinkedIn": <Linkedin className="w-4 h-4 text-primary" />,
    "Lifetime Verification": <ShieldCheck className="w-4 h-4 text-primary" />,
    "Digital Record Storage": <DatabaseIcon className="w-4 h-4 text-primary" />,
  };
  return map[feature] || <CheckCircle2 className="w-4 h-4 text-primary" />;
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 12a9 3 0 0 0 18 0" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
    </svg>
  );
}

export function CertificateJourney() {
  const { data: cms, isLoading } = usePublicSection("certificate-journey");
  const content = useMemo(() => {
    if (isLoading || !cms?.content) return FALLBACK_CONTENT;
    return { ...FALLBACK_CONTENT, ...cms.content };
  }, [cms, isLoading]);

  return (
    <>
      {/* ═══════════ HERO / HEADER ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-24 max-w-5xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 px-4 py-1.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-0">
            <Award className="w-3.5 h-3.5 mr-1.5 inline" />
            {content.badge}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{content.headline}</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{content.subheadline}</p>
          <p className="mt-3 text-sm text-muted-foreground/80 max-w-xl mx-auto">{content.description}</p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {(content.stats as any[]).map((stat: any, i: number) => (
            <motion.div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-gradient-to-b from-card to-muted/30 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
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
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">How It Works</h3>
          <p className="mt-2 text-muted-foreground">Your path from enrollment to certification in 7 simple steps.</p>
        </motion.div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute left-0 right-0 top-12 h-0.5 bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10" />
          <div className="grid grid-cols-7 gap-4 relative">
            {(content.steps as any[]).map((step: any, i: number) => (
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
                  <StepIcon icon={step.icon} index={i} />
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{i + 1}</span>
                  </div>
                </motion.div>
                <h4 className="text-sm font-bold mt-3">{step.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet: vertical timeline */}
        <div className="lg:hidden relative">
          <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />
          <div className="space-y-8">
            {(content.steps as any[]).map((step: any, i: number) => (
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
                  <StepIcon icon={step.icon} index={i} />
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-white">{i + 1}</span>
                  </div>
                </motion.div>
                <div className="flex-1 pt-1">
                  <h4 className="text-sm font-bold">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
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
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Why Learnify Certificates Matter</h3>
          <p className="mt-2 text-muted-foreground">Industry-recognized credentials that open doors.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {(content.benefits as any[]).map((benefit: any, i: number) => (
            <motion.div
              key={benefit.title}
              className="rounded-xl border bg-card p-5 text-center group hover:border-primary/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.06)" }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto text-primary group-hover:bg-primary/20 transition-colors">
                <BenefitIcon icon={benefit.icon} />
              </div>
              <h4 className="text-sm font-bold mt-3">{benefit.title}</h4>
              <p className="text-xs text-muted-foreground mt-1.5">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="container mx-auto px-6 py-16 md:py-20 max-w-4xl">
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-6 py-4 border-b border-border/50">
            <h3 className="text-lg font-bold text-center">Included In Every Certificate</h3>
          </div>
          <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
            <div className="divide-y divide-border/50">
              {(content.features as string[]).slice(0, 5).map((f: string) => (
                <div key={f} className="flex items-center gap-3 px-6 py-3.5">
                  <FeatureIcon feature={f} />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
            <div className="divide-y divide-border/50">
              {(content.features as string[]).slice(5).map((f: string) => (
                <div key={f} className="flex items-center gap-3 px-6 py-3.5">
                  <FeatureIcon feature={f} />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CERTIFICATE MOCKUP ═══════════ */}
      <section className="container mx-auto px-6 py-8 max-w-3xl">
        <motion.div
          className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card via-primary/[0.02] to-card p-8 md:p-10 shadow-lg text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          whileHover={{ boxShadow: "0 20px 48px rgba(0,0,0,0.08)" }}
        >
          <div className="max-w-sm mx-auto space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7 text-amber-600" />
            </div>
            <h4 className="font-semibold text-sm tracking-wide text-muted-foreground">Certificate of Completion</h4>
            <h3 className="text-xl md:text-2xl font-bold">Machine Learning Fundamentals</h3>
            <div className="h-px bg-border w-3/4 mx-auto" />
            <p className="text-sm text-muted-foreground">Issued to: Demo Learner</p>
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span>ID: CERT-ML-2026</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>June 2026</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </div>
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="w-10 h-10 rounded bg-white dark:bg-gray-800 border flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="text-[10px] text-left text-muted-foreground leading-tight">
                <div className="font-medium text-foreground">Scan to verify</div>
                <div>Unique QR code</div>
              </div>
            </div>
          </div>
        </motion.div>
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
          <h3 className="text-2xl md:text-3xl font-bold">{content.cta.headline}</h3>
          <p className="mt-3 text-white/80 text-sm max-w-md mx-auto">{content.cta.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Button asChild size="lg" className="rounded-xl bg-white text-primary hover:bg-white/90 shadow-lg shadow-black/20 font-semibold px-8">
              <Link to={content.cta.primary_url as any}>
                {content.cta.primary_label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10 hover:text-white px-8">
              <Link to={content.cta.secondary_url as any}>
                <ExternalLink className="w-4 h-4 mr-2" />
                {content.cta.secondary_label}
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ DECORATIVE FLOATING ELEMENTS ═══════════ */}
      <div className="fixed pointer-events-none inset-0 overflow-hidden z-0" aria-hidden>
        <motion.div
          className="absolute top-1/4 left-[10%] w-3 h-3 rounded-full bg-primary/10"
          animate={{ y: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-[15%] w-2 h-2 rounded-full bg-amber-400/20"
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-[20%] w-4 h-4 rounded-full bg-purple-500/10"
          animate={{ y: [10, -20, 10], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </>
  );
}
