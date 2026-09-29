import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Heart,
  Sparkles,
  Share2,
  GraduationCap,
  Briefcase,
  Code2,
  FileCheck,
  ShieldCheck,
  Mail,
  Copy,
  Check,
  ExternalLink,
  Users,
  Target,
  ArrowRight,
  Gift,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRealHumanAvatar } from "@/lib/real-avatars";

export const Route = createFileRoute("/support-us")({
  head: () => ({
    meta: [
      { title: "Support Us & Sponsor a Career — Learnify AI" },
      {
        name: "description",
        content:
          "Help us build a free career-learning ecosystem. Sponsor a career and make practical education accessible to people facing financial barriers.",
      },
      { property: "og:title", content: "Support Us — Learnify AI" },
      {
        property: "og:description",
        content:
          "Help Us Build a Free Career-Learning Ecosystem. Sponsor courses, mentorship, and career resources for aspiring professionals.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/support-us" }],
  }),
  component: SupportUsPage,
});

const RAZORPAY_PAYMENT_PAGE_URL = "https://pages.razorpay.com/learnifyaisupport";

const PRESET_AMOUNTS = [
  { value: 500, label: "₹500", desc: "1 month of AI credits & course access" },
  { value: 1000, label: "₹1,000", desc: "Full certification & interview prep support" },
  { value: 2500, label: "₹2,500", desc: "1-on-1 portfolio review & mentor matching" },
  { value: 5000, label: "₹5,000", desc: "Full career transformation sponsorship" },
  { value: 10000, label: "₹10,000", desc: "Sponsor multiple care leavers & job seekers" },
];

const SUPPORT_TYPES = [
  { value: "platform", label: "Support the Platform" },
  { value: "free-courses", label: "Support Free Courses" },
  { value: "career-programs", label: "Support Career Programs" },
  { value: "mentorship", label: "Support Mentorship" },
  { value: "general", label: "General Support" },
];

const POPULAR_COUNTRY_CODES = [
  { code: "+91", country: "IN", name: "India (+91)" },
  { code: "+1", country: "US", name: "United States (+1)" },
  { code: "+44", country: "GB", name: "United Kingdom (+44)" },
  { code: "+971", country: "AE", name: "United Arab Emirates (+971)" },
  { code: "+65", country: "SG", name: "Singapore (+65)" },
  { code: "+61", country: "AU", name: "Australia (+61)" },
  { code: "+1", country: "CA", name: "Canada (+1)" },
  { code: "+49", country: "DE", name: "Germany (+49)" },
  { code: "+33", country: "FR", name: "France (+33)" },
  { code: "+81", country: "JP", name: "Japan (+81)" },
];

export function SupportUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number | "" | "custom">(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [supportType, setSupportType] = useState("platform");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalAmount = amount === "custom" ? (Number(customAmount) || 0) : (amount || 0);

  const handlePresetSelect = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (val: string) => {
    const num = val.replace(/\D/g, "");
    setCustomAmount(num);
    setAmount("custom");
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (finalAmount <= 0) {
      toast.error("Please select or enter a contribution amount");
      return;
    }

    setIsSubmitting(true);

    // Build URL to Razorpay hosted payment page with prefill params
    const targetUrl = new URL(RAZORPAY_PAYMENT_PAGE_URL);
    targetUrl.searchParams.set("name", name.trim());
    targetUrl.searchParams.set("email", email.trim());
    targetUrl.searchParams.set("phone", `${countryCode}${phone.trim()}`);
    if (finalAmount > 0) {
      targetUrl.searchParams.set("amount", String(finalAmount));
    }
    if (supportType) {
      targetUrl.searchParams.set("support_type", supportType);
    }

    toast.success("Redirecting to Razorpay Secure Payment...", {
      description: `Contributing ₹${finalAmount.toLocaleString("en-IN")} towards ${supportType.replace("-", " ")}`,
    });

    setTimeout(() => {
      window.open(targetUrl.toString(), "_blank", "noopener,noreferrer");
      setIsSubmitting(false);
    }, 600);
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareToSocial = (platform: "twitter" | "linkedin" | "whatsapp") => {
    const text = encodeURIComponent(
      "Support Learnify AI — Help us make practical career education accessible to people facing financial barriers! #LearnifyAI #SponsorACareer"
    );
    const url = encodeURIComponent(window.location.href);

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
    } else if (platform === "whatsapp") {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground selection:bg-primary/20">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-border/40 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />

        <div className="container max-w-5xl mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 px-3.5 py-1 text-xs uppercase tracking-wider font-semibold border-primary/30 bg-primary/10 text-primary gap-1.5 shadow-sm inline-flex items-center"
          >
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" />
            SPONSOR A CAREER
          </Badge>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
            Help Us Build a Free Career-Learning Ecosystem
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Help us make practical career education accessible to people facing financial or
            access barriers, with a special focus on care leavers and underrepresented learners.
          </p>

          {/* Social Proof Avatars of Real Students */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div className="flex -space-x-2.5 overflow-hidden">
              {["Anjali Verma", "Rishabh Sharma", "Priya Kapoor", "Vikram Singh", "Sarah"].map(
                (name, idx) => (
                  <img
                    key={idx}
                    src={getRealHumanAvatar(name)}
                    alt={name}
                    className="inline-block h-9 w-9 rounded-full ring-2 ring-background object-cover shadow-sm"
                  />
                )
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Empowering real students across India & worldwide
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Info + Donation Form */}
      <section className="py-12 px-4 container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Mission, Pathway, Pillars & Impact */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Campaign Progress Card */}
            <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Milestone
                  </span>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    ₹ 0 <span className="text-sm font-normal text-muted-foreground">of ₹ 1,00,000 collected</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="bg-muted/60 text-xs px-2.5 py-1">
                    <Users className="h-3 w-3 mr-1 text-primary" /> 0 supporters
                  </Badge>
                  <p className="text-[11px] text-muted-foreground mt-1">Be our first supporter!</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 w-full bg-muted/60 rounded-full overflow-hidden p-0.5 border border-border/40">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "3%" }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-primary"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Phase 1: Foundation</span>
                <span>Goal: 100 Students Sponsored</span>
              </div>
            </div>

            {/* The Learning & Career Pipeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold font-display tracking-tight text-foreground">
                  The Career-Ready Journey
                </h2>
              </div>

              <div className="p-4 rounded-xl border border-border/60 bg-muted/30">
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-foreground/90">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    Learn
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-500 border border-violet-500/20">
                    Build Skills
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                    Create Projects
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Build Portfolio
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="px-2.5 py-1 rounded-md bg-pink-500/10 text-pink-500 border border-pink-500/20">
                    Find Opportunities
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/30">
                    Employment 🚀
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">1. Learn</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Courses, practical skills, AI learning & interactive cheat sheets for structured tech literacy.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">2. Build</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Real-world projects, live coding playgrounds, fullstack apps & industry assignments.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-colors shadow-sm">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">3. Present</h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  ATS Resume Builder, LinkedIn profile polish, GitHub portfolio & AI mock interviews.
                </p>
              </div>
            </div>

            {/* Contact & Transparency */}
            <div className="p-5 rounded-xl border border-border/60 bg-muted/20 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact & Support Inquiries
              </h4>
              <div className="flex flex-wrap items-center gap-6 text-xs text-foreground/90">
                <a
                  href="mailto:support.learnifyai@gmail.com?subject=Learnify%20AI%20Support%20%26%20Sponsorship"
                  className="flex items-center gap-2 hover:text-primary transition"
                >
                  <Mail className="h-4 w-4 text-primary" />
                  support.learnifyai@gmail.com
                </a>
                <a
                  href={RAZORPAY_PAYMENT_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline transition font-medium"
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                  Razorpay Support Page (pages.razorpay.com/learnifyaisupport)
                </a>
              </div>
            </div>

            {/* Social Share Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Share2 className="h-3.5 w-3.5" /> Share this campaign:
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs px-2.5"
                  onClick={() => shareToSocial("whatsapp")}
                >
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs px-2.5"
                  onClick={() => shareToSocial("twitter")}
                >
                  X (Twitter)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs px-2.5"
                  onClick={() => shareToSocial("linkedin")}
                >
                  LinkedIn
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs px-2 gap-1"
                  onClick={copyPageLink}
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedLink ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contribution Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-xl space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold text-foreground">Payment Details</h3>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                    <ShieldCheck className="h-3 w-3 mr-1" /> Razorpay Verified
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Help someone learn, build skills, and move toward an independent career. ❤️
                </p>
              </div>

              <form onSubmit={handleContribute} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="contributor-name" className="text-xs font-semibold">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contributor-name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="contributor-email" className="text-xs font-semibold">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contributor-email"
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Phone with Country Code */}
                <div className="space-y-1.5">
                  <Label htmlFor="contributor-phone" className="text-xs font-semibold">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-28 text-xs shrink-0">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {POPULAR_COUNTRY_CODES.map((item, idx) => (
                          <SelectItem key={idx} value={item.code} className="text-xs">
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="contributor-phone"
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-sm flex-1"
                    />
                  </div>
                </div>

                {/* Support Type */}
                <div className="space-y-1.5">
                  <Label htmlFor="support-type" className="text-xs font-semibold">
                    Support Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={supportType} onValueChange={setSupportType}>
                    <SelectTrigger id="support-type" className="text-xs">
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUPPORT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="text-xs">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount Selection */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">
                    Amount <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.slice(0, 3).map((item) => (
                      <button
                        type="button"
                        key={item.value}
                        onClick={() => handlePresetSelect(item.value)}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition ${
                          amount === item.value
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border hover:border-primary/40 bg-muted/30"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_AMOUNTS.slice(3).map((item) => (
                      <button
                        type="button"
                        key={item.value}
                        onClick={() => handlePresetSelect(item.value)}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition ${
                          amount === item.value
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border hover:border-primary/40 bg-muted/30"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="relative pt-1">
                    <span className="absolute left-3 top-3.5 text-sm text-muted-foreground">₹</span>
                    <Input
                      type="text"
                      placeholder="Other custom amount"
                      value={customAmount}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      className="pl-7 text-sm"
                    />
                  </div>
                </div>

                {/* Contribution Action Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-primary hover:from-indigo-500 hover:to-primary/90 text-white font-bold text-sm shadow-md h-12 transition-[color,background-color,border-color,box-shadow,transform] hover:scale-[1.01]"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Contribute Now ₹ {finalAmount.toLocaleString("en-IN")}.00
                </Button>
              </form>

              {/* Direct Hosted Razorpay Link */}
              <div className="text-center pt-2">
                <a
                  href={RAZORPAY_PAYMENT_PAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                >
                  Open Direct Razorpay Payment Page <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Terms & Conditions Notice */}
              <div className="border-t border-border/40 pt-4 text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground/80">Terms &amp; Conditions: </span>
                By contributing, you agree that your support will be used to help build and maintain
                Learnify AI and its free learning and career-support initiatives. Contributions help
                support platform infrastructure, educational content, mentoring, community activities,
                and career resources. Contributions do not guarantee employment, internships,
                mentorship, or any specific outcome. Please ensure the information you provide is
                accurate. For questions about your contribution, contact{" "}
                <a
                  href="mailto:support.learnifyai@gmail.com"
                  className="text-primary hover:underline"
                >
                  support.learnifyai@gmail.com
                </a>
                . You agree to share information entered on this page with Learnifyai (owner of this
                page) and Razorpay, adhering to applicable laws.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
