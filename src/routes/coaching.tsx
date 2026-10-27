import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  Calendar,
  MessageCircle,
  Compass,
  Users,
  Check,
  Loader2,
  Send,
  Video,
  Clock,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Bot,
  Shield,
  Layers,
  ArrowRight,
  Code2,
  Cpu,
  Award,
  Globe,
  Briefcase,
  DollarSign,
  Terminal,
  Copy,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import OpenSlotBooking, { MeetingIcons } from "@/components/ui/open-slot-booking";
import { ReceiptPricing, type ReceiptPlan } from "@/components/ui/receipt-pricing";
import { careerCoachChat, COACH_ROLE_PROMPTS } from "@/lib/career-coach.functions";
import { Navbar } from "@/components/ui/navbar-menu.demo";

export const Route = (createFileRoute as any)("/coaching")({
  head: () => ({
    meta: [
      { title: "1-on-1 Engineering & Executive Coaching — Learnify AI" },
      {
        name: "description",
        content:
          "Book vetted 1-on-1 mentorship with Staff & Principal Engineers. Real-time calendar booking, Google Meet & Zoom integrations, and 10-role AI coaching studio.",
      },
      { property: "og:title", content: "1-on-1 Coaching — Learnify AI" },
      {
        property: "og:description",
        content:
          "Accelerate your tech career with direct mentorship from industry leaders at Google, Meta, Amazon, and Stripe.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/coaching" }],
  }),
  component: CoachingPage,
});

const COACH_ROLES = [
  {
    id: "system_architect",
    title: "System Design & Distributed Architect",
    icon: Layers,
    badge: "Principal / Staff",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30",
    description: "High-throughput microservices, event-driven streaming, database sharding, and latency optimization.",
    samplePrompts: [
      "Design a real-time collaborative document editor like Google Docs",
      "Explain Kafka partition rebalancing strategies and message ordering",
      "How do I choose between PostgreSQL and ScyllaDB for high-write telemetry?",
    ],
  },
  {
    id: "frontend_architect",
    title: "Frontend & Design Systems Master",
    icon: Code2,
    badge: "UI/UX Architect",
    color: "from-pink-500/20 to-purple-500/20 text-pink-500 border-pink-500/30",
    description: "Component ergonomics, React 19 server transitions, physics micro-interactions, and Core Web Vitals.",
    samplePrompts: [
      "Review my React component tree for unnecessary re-renders",
      "How to implement spring physics gesture drags in Framer Motion?",
      "Design token architecture for a multi-brand white-label frontend",
    ],
  },
  {
    id: "executive_leadership",
    title: "Behavioral & Executive Leadership Coach",
    icon: Award,
    badge: "Director / VP",
    color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30",
    description: "STAR frameworks, managing ambiguous cross-functional conflict, executive presence, and compensation negotiation.",
    samplePrompts: [
      "Help me craft a STAR response for 'Tell me about a time you had a critical project fail'",
      "How to negotiate a competing offer between a Series B startup and Big Tech?",
      "Framework for leading through engineering organizational restructures",
    ],
  },
  {
    id: "ai_ml_researcher",
    title: "AI / ML & GenAI Research Specialist",
    icon: Cpu,
    badge: "Research Scientist",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30",
    description: "LLM fine-tuning, RAG vector retrieval pipelines, agentic tool workflows, and production model serving.",
    samplePrompts: [
      "Compare hybrid dense + BM25 sparse search for RAG accuracy",
      "How to implement streaming structured JSON extraction with Gemini 2.5 Flash?",
      "Quantization trade-offs: GGUF vs AWQ vs ExLlamaV2 in production",
    ],
  },
  {
    id: "dsa_maestro",
    title: "Data Structures & Algorithms Maestro",
    icon: Terminal,
    badge: "Bar Raiser",
    color: "from-violet-500/20 to-purple-500/20 text-violet-500 border-violet-500/30",
    description: "Dynamic programming invariants, graph network flows, time/space trade-offs, and tricky edge-case debugging.",
    samplePrompts: [
      "Explain the topological sort Kahn's algorithm vs DFS cycle detection",
      "Intuitive framework for solving 2D Dynamic Programming grid problems",
      "How to solve Median of Two Sorted Arrays in O(log(min(N,M)))?",
    ],
  },
  {
    id: "product_manager",
    title: "Product Management & Strategy Lead",
    icon: Compass,
    badge: "Group PM",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-500 border-cyan-500/30",
    description: "PRD writing, North Star metric hierarchies, RICE prioritization, and Go-To-Market product rollout.",
    samplePrompts: [
      "Write a structured PRD for adding AI auto-completions to a code editor",
      "How to prioritize conflicting feature requests from sales and engineering?",
      "Design metrics to measure user activation and 30-day retention",
    ],
  },
  {
    id: "devops_sre",
    title: "Cloud & DevOps / Site Reliability Engineer",
    icon: Globe,
    badge: "Staff SRE",
    color: "from-sky-500/20 to-indigo-500/20 text-sky-500 border-sky-500/30",
    description: "Kubernetes orchestration, Terraform IaC, Prometheus observability, zero-downtime blue/green deploys, and FinOps.",
    samplePrompts: [
      "Design a multi-region active-passive failover on AWS with Route 53",
      "Write an incident post-mortem template for a 45-minute database outage",
      "Strategies to cut our AWS RDS and NAT Gateway bill by 35%",
    ],
  },
  {
    id: "fullstack_lead",
    title: "Full-Stack & Microservices Lead",
    icon: BookOpen,
    badge: "Tech Lead",
    color: "from-teal-500/20 to-emerald-500/20 text-teal-500 border-teal-500/30",
    description: "PostgreSQL query tuning, transactional outbox pattern, gRPC contracts, and idempotent API workflows.",
    samplePrompts: [
      "How to implement the transactional outbox pattern with Debezium and Kafka?",
      "Designing JWT refresh token rotation with Redis revocation lists",
      "Database migration strategy with zero downtime on a 50M row table",
    ],
  },
  {
    id: "career_strategist",
    title: "Tech Career Transition & Resume Strategist",
    icon: Briefcase,
    badge: "Senior Recruiter",
    color: "from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/30",
    description: "Google XYZ resume formulas, ATS keyword matching, cold LinkedIn outreach to Engineering Managers, and portfolio audits.",
    samplePrompts: [
      "Rewrite my resume bullet point using Google's XYZ formula",
      "Write a high-converting cold message to an Engineering Manager on LinkedIn",
      "How to pivot from a non-tech background to a Junior Full-Stack role in 6 months?",
    ],
  },
  {
    id: "freelance_agency",
    title: "Freelance & Productized Agency Coach",
    icon: DollarSign,
    badge: "Agency Founder",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-500 border-amber-500/30",
    description: "Value-based pricing, monthly retainer contracts, client discovery objection handling, and productized service models.",
    samplePrompts: [
      "How to transition from $50/hr billing to a $5,000/month retainer?",
      "Draft a 4-question discovery script to filter out low-budget tire-kickers",
      "Contract clauses every freelance developer must include to prevent scope creep",
    ],
  },
];

const COACHING_PLANS: ReceiptPlan[] = [
  {
    id: "single-deep-dive",
    name: "Strategy Audit",
    tagline: "Single high-impact 1:1 session",
    monthly: 999,
    cta: "Book 1:1 Strategy Audit",
    items: [
      { label: "Duration", value: "45 Mins" },
      { label: "Platform", value: "Meet / Zoom" },
      { label: "Recording", value: "Included" },
      { label: "Written Plan", value: "Detailed" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
  {
    id: "monthly-mentorship",
    name: "Monthly Accelerator",
    tagline: "Continuous engineering coaching",
    monthly: 2999,
    featured: true,
    cta: "Join Monthly Mentorship",
    items: [
      { label: "1:1 Sessions", value: "4 / Month" },
      { label: "Async Chat", value: "Direct Slack" },
      { label: "Code Reviews", value: "2 / Week" },
      { label: "Mock Interviews", value: "2 Included" },
      { label: "Dedicated Coach", value: "Staff Level" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
  {
    id: "executive-placement",
    name: "Executive Career Track",
    tagline: "Guaranteed promotion / offer prep",
    monthly: 6999,
    cta: "Apply For Executive Track",
    items: [
      { label: "Sessions", value: "Weekly 60m" },
      { label: "Resume Rewrite", value: "FAANG Bar" },
      { label: "Negotiation", value: "Live Prep" },
      { label: "Referrals", value: "Top Tier" },
      { label: "24/7 Access", value: "Direct WhatsApp" },
      { label: "GST (18%)", value: "Included" },
    ],
  },
];

const sampleHostWeek = [
  { weekday: 1, from: "09:30", to: "11:00", title: "Meta Architecture Review" },
  { weekday: 1, from: "15:00", to: "16:30", title: "Staff Sync" },
  { weekday: 2, from: "10:00", to: "11:30", title: "Distributed Consensus Crit" },
  { weekday: 2, from: "14:00", to: "15:00", title: "Mentorship Office Hours" },
  { weekday: 3, from: "11:00", to: "12:30", title: "Google Cloud Tech Talk" },
  { weekday: 4, from: "09:00", to: "10:30", title: "System Design Keynote" },
  { weekday: 4, from: "16:00", to: "17:30", title: "Director Alignment" },
  { weekday: 5, from: "13:30", to: "15:00", title: "Open Advisory Block" },
];

const sampleMyWeek = [
  { weekday: 1, from: "11:00", to: "12:00", title: "Sprint Planning" },
  { weekday: 2, from: "09:00", to: "10:00", title: "Morning Workout" },
  { weekday: 3, from: "14:00", to: "15:00", title: "Team 1:1" },
  { weekday: 4, from: "11:30", to: "12:30", title: "Product Sync" },
  { weekday: 5, from: "16:00", to: "17:00", title: "Sprint Retro" },
];

export function CoachingPage() {
  const [selectedRole, setSelectedRole] = useState(COACH_ROLES[0]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: `Hello! I am your **System Design & Distributed Architect Coach**. 

I specialize in high-concurrency architectures, microservices decomposition, message queues, and planetary-scale scalability. 

Ask me to design a system, critique your current architecture, or solve a distributed bottleneck!`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<"google-meet" | "zoom" | "teams" | "in-person">("google-meet");

  const runCareerCoach = useServerFn(careerCoachChat);

  const handleRoleChange = (role: (typeof COACH_ROLES)[0]) => {
    setSelectedRole(role);
    setMessages([
      {
        role: "assistant",
        content: `Switched coach role to **${role.title}** (${role.badge}). 

${role.description}

How can I help you excel in this domain today? Select a sample topic below or type your specific question!`,
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || isTyping) return;

    const userMsg = { role: "user" as const, content: text.trim() };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await runCareerCoach({
        data: {
          content: userMsg.content,
          history: messages,
          coachRole: selectedRole.id,
          userProfile: `Role focus: ${selectedRole.title}. Target: Tech excellence.`,
        },
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.content || "I have analyzed your query and prepared your structured response.",
        },
      ]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate AI Coach response. Retrying...");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a temporary connection glitch. Please ensure you have configured your AI API keys, or try asking your question again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyResponse = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Coach response copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <SiteHeader />

      {/* Aceternity Animated Menu Demo Bar */}
      <div className="hidden lg:block relative z-40 py-2">
        <Navbar className="top-24" />
      </div>

      <main className="flex-1 pb-24">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 rounded-full blur-[120px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Learnify Executive Coaching Studio 4.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.08]">
            Direct Mentorship from{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Principal & Staff Engineers
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Skip the generic advice. Book 1-on-1 video sessions with vetted leaders, or consult our specialized 10-Role AI Coaching Agent available 24/7.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full px-8 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all gap-2"
              onClick={() => {
                document.getElementById("open-slot-calendar")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Calendar className="w-4 h-4" />
              <span>Book Open Slot Session</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 font-semibold border-border/80 hover:bg-muted transition-all gap-2"
              onClick={() => {
                document.getElementById("ai-coach-studio")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Bot className="w-4 h-4 text-emerald-500" />
              <span>Launch 10-Role AI Coach</span>
            </Button>
          </div>

          {/* Supported Meeting Platforms Bar */}
          <div className="mt-14 pt-8 border-t border-border/60 max-w-4xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Native Video Rooms & Automated Calendar Invites
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-sm font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                {MeetingIcons.googleMeet}
                <span className="text-foreground">Google Meet HD</span>
              </div>
              <div className="flex items-center gap-2">
                {MeetingIcons.zoom}
                <span className="text-foreground">Zoom Video</span>
              </div>
              <div className="flex items-center gap-2">
                {MeetingIcons.teams}
                <span className="text-foreground">Microsoft Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground">.ICS & Google Calendar Sync</span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. OPEN SLOT BOOKING SECTION */}
        <section id="open-slot-calendar" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Real-Time Open Slot Booking</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Pick a convenient time across timezones. Includes automated Google Meet link generation and instant .ICS calendar invitation.
            </p>
          </div>

          <div className="bg-card/40 border border-border/70 rounded-3xl p-2 sm:p-6 shadow-2xl backdrop-blur-sm">
            <OpenSlotBooking
              hostBusy={sampleHostWeek}
              visitorEvents={sampleMyWeek}
              host={{
                name: "Dr. Vikram Aditya",
                role: "Principal Systems Architect, Ex-Google / Meta",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                stamp: "Verified Coach · Learnify AI · ",
                city: "Bengaluru",
                platform: selectedPlatform,
              }}
              meetingTitle="1-on-1 Engineering & Career Strategy"
              bookingUrl="learnifyai.in/coach/vikram-aditya"
              platform={selectedPlatform}
              onBook={(booking) => {
                toast.success(`Reserved 1:1 session for ${booking.name}! Check your inbox for Google Meet link.`);
              }}
            />
          </div>
        </section>

        {/* 2. 10-ROLE AI COACHING AGENT STUDIO */}
        <section id="ai-coach-studio" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Bot className="w-3.5 h-3.5" />
              <span>Multi-Agent System with 10 Specialized Roles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              10-Role AI Coaching Agent Studio
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Consult with domain-specific AI coaches tailored to every phase of your tech journey. From Staff-level System Design to ATS Resumes and Executive Offers.
            </p>
          </div>

          {/* Role selector carousel / grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {COACH_ROLES.map((role) => {
              const IconComp = role.icon;
              const isActive = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isActive
                      ? "bg-primary/10 border-primary shadow-md scale-[1.02]"
                      : "bg-card/70 border-border/70 hover:border-primary/50 hover:bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${role.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {role.badge}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold line-clamp-2 text-foreground">{role.title}</h4>
                </button>
              );
            })}
          </div>

          {/* Active Coach Banner */}
          <div className="bg-gradient-to-r from-card via-muted/40 to-card border border-border/80 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${selectedRole.color}`}>
                <selectedRole.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg">{selectedRole.title}</h3>
                  <Badge variant="secondary" className="text-xs">{selectedRole.badge}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedRole.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                Live Agent Active
              </Badge>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold text-muted-foreground mr-1">Suggested Prompts:</span>
            {selectedRole.samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-muted/60 hover:bg-muted text-foreground/80 hover:text-foreground px-3 py-1.5 rounded-full border border-border/70 transition-colors flex items-center gap-1.5"
              >
                <span>{prompt}</span>
                <ChevronRight className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>

          {/* Chat Interface Box */}
          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl flex flex-col h-[520px]">
            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    {msg.role === "user" ? "You" : <Bot className="w-4 h-4 text-emerald-500" />}
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed relative group ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                        : "bg-muted/50 border border-border/60 text-foreground rounded-tl-none font-sans"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {msg.role === "assistant" && (
                      <button
                        type="button"
                        onClick={() => copyResponse(msg.content)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md bg-background/80 hover:bg-background border border-border text-muted-foreground hover:text-foreground transition-all"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                  <div className="bg-muted/50 border border-border/60 rounded-2xl rounded-tl-none p-3.5 text-xs text-muted-foreground font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Synthesizing technical response from {selectedRole.title}...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-muted/20 border-t border-border flex items-center gap-2"
            >
              <Input
                placeholder={`Ask ${selectedRole.title} anything... (e.g. system design, mock question, resume critique)`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTyping}
                className="rounded-full bg-background border-border/80 text-sm px-5 h-11"
              />
              <Button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="rounded-full w-11 h-11 p-0 shrink-0 shadow-md"
              >
                {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </section>

        {/* 3. THERMAL RECEIPT PRICING SECTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ReceiptPricing
            plans={COACHING_PLANS}
            defaultPeriod="yearly"
            merchant="LEARNIFY AI COACHING"
            merchantNote="1-on-1 Mentorship Plans · SAC 998431 · 18% GST"
            orderPrefix="COACH"
            monthsFree={2}
            currency="INR"
            locale="en-IN"
            onSelectPlan={(plan, period) => {
              toast.success(`Selected ${plan.name} (${period} billing). Launching Razorpay gateway...`);
            }}
          >
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Transparent Coaching Plans</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Thermal ledger pricing with serrated tear edges. Pick single audits or monthly intensive coaching with 18% GST and Razorpay instant activation.
              </p>
            </div>
          </ReceiptPricing>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default CoachingPage;
