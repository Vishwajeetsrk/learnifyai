import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  Compass,
  MessageCircle,
  TrendingUp,
  Check,
  Loader2,
  Send,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StaggerGroup, StaggerItem } from "@/components/Reveal";
import { getRealHumanAvatar } from "@/lib/real-avatars";
import { AppleCoachBookingModal } from "@/components/coaches/AppleCoachBookingModal";
import OpenSlotBooking, { MeetingIcons } from "@/components/ui/open-slot-booking";
import { ReceiptPricing, type ReceiptPlan } from "@/components/ui/receipt-pricing";

const PUBLIC_COACHING_PLANS: ReceiptPlan[] = [
  {
    id: "strategy-audit",
    name: "Strategy Audit",
    tagline: "Single high-impact 1:1 session",
    monthly: 999,
    cta: "Book Strategy Audit",
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

const sampleVisitorWeek = [
  { weekday: 1, from: "11:00", to: "12:00", title: "Sprint Planning" },
  { weekday: 2, from: "09:00", to: "10:00", title: "Morning Workout" },
  { weekday: 3, from: "14:00", to: "15:00", title: "Team 1:1" },
  { weekday: 4, from: "11:30", to: "12:30", title: "Product Sync" },
  { weekday: 5, from: "16:00", to: "17:00", title: "Sprint Retro" },
];

export const Route = createFileRoute("/coaches")({
  head: () => ({
    meta: [
      { title: "Coaches — Learnify AI" },
      {
        name: "description",
        content: "Offer 1-on-1 coaching with built-in scheduling, messaging, and payments.",
      },
      { property: "og:title", content: "Coaches — Learnify AI" },
      {
        property: "og:description",
        content:
          "All the tools you need to run a coaching practice — without the spreadsheet juggling.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/coaches" }],
  }),
  component: CoachesPage,
});

const perks = [
  {
    id: "scheduling",
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "Bookable slots synced to your calendar.",
  },
  {
    id: "messaging",
    icon: MessageCircle,
    title: "Native Messaging",
    desc: "Async chat + voice notes with every client.",
  },
  {
    id: "roadmaps",
    icon: Compass,
    title: "Client Roadmaps",
    desc: "AI-generated learning paths per client.",
  },
  {
    id: "outcomes",
    icon: TrendingUp,
    title: "Outcome Tracking",
    desc: "Show progress with real data, not vibes.",
  },
  {
    id: "cohorts",
    icon: Users,
    title: "Live Cohort Manager",
    desc: "Easily transition from async courses to high-ticket live cohorts.",
  },
];

function CoachesPage() {
  const [selectedPerk, setSelectedPerk] = useState("scheduling");
  const [bookingCoach, setBookingCoach] = useState<any>(null);

  // State for Smart Scheduling
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "booking" | "booked">("idle");
  const slots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

  const handleBookSlot = () => {
    if (!selectedSlot) return;
    setBookingStatus("booking");
    setTimeout(() => {
      setBookingStatus("booked");
    }, 1000);
  };

  // State for Native Messaging
  const [messages, setMessages] = useState([
    { sender: "client", text: "Hey Coach! Quick question about the system design homework." },
    {
      sender: "coach",
      text: "Sure, go ahead! Are you analyzing the horizontal scaling or caching layer?",
    },
  ]);
  const [typedMessage, setTypedMessage] = useState("");

  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    const clientMsg = { sender: "client", text: typedMessage };
    setMessages((prev) => [...prev, clientMsg]);
    setTypedMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "coach",
          text: "Got it! That looks correct. I'd recommend using Redis for the read-heavy session cache and PostgreSQL for persistent user metadata.",
        },
      ]);
    }, 1500);
  };

  // State for Client Roadmaps
  const [roadmapPhases, setRoadmapPhases] = useState([
    { id: 1, title: "Phase 1: Foundations (JS/TS & Git)", completed: true },
    { id: 2, title: "Phase 2: Database Design & Normalization", completed: false },
    { id: 3, title: "Phase 3: Backend API Integration & Services", completed: false },
  ]);
  const togglePhase = (id: number) => {
    setRoadmapPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p)),
    );
  };
  const completedCount = roadmapPhases.filter((p) => p.completed).length;
  const progressPercent = Math.round((completedCount / roadmapPhases.length) * 100);

  // State for Outcome Tracking
  const [runAudit, setRunAudit] = useState<"idle" | "auditing" | "done">("idle");
  const handleRunAudit = () => {
    setRunAudit("auditing");
    setTimeout(() => {
      setRunAudit("done");
    }, 1200);
  };

  // State for Cohorts
  const [cohortStatus, setCohortStatus] = useState<"idle" | "starting" | "live">("idle");

  const handleStartCohort = () => {
    setCohortStatus("starting");
    setTimeout(() => {
      setCohortStatus("live");
    }, 1000);
  };

  const renderInteractiveDemo = () => {
    switch (selectedPerk) {
      case "scheduling":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Interactive Scheduling Sandbox
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Test booking a session. Select a slot below to schedule with your coach.
              </p>

              {bookingStatus === "idle" && (
                <div className="grid grid-cols-2 gap-2.5">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 text-xs border rounded-lg transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? "bg-primary text-primary-foreground border-transparent font-medium"
                          : "bg-muted/50 border-border hover:bg-muted"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}

              {bookingStatus === "booking" && (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Securing slot {selectedSlot}...</p>
                </div>
              )}

              {bookingStatus === "booked" && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                  <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">
                    Coaching Session Scheduled!
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Confirmed for{" "}
                    <span className="font-semibold text-foreground">{selectedSlot}</span>. Calendar
                    invite sent.
                  </p>
                </div>
              )}
            </div>

            {bookingStatus === "idle" && (
              <Button
                disabled={!selectedSlot}
                onClick={handleBookSlot}
                size="sm"
                className="w-full text-xs"
              >
                Book Session
              </Button>
            )}

            {bookingStatus === "booked" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBookingStatus("idle");
                  setSelectedSlot(null);
                }}
                className="w-full text-xs"
              >
                Schedule Another Slot
              </Button>
            )}
          </div>
        );

      case "messaging":
        return (
          <div className="flex flex-col h-full justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Async Messaging Preview
                </h3>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === "client" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        m.sender === "client"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Input
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                placeholder="Ask coach a question..."
                className="bg-muted/50 h-8 text-xs flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!typedMessage.trim()}
                className="h-8 w-8 shrink-0 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );

      case "roadmaps":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  AI Learning Roadmap Editor
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Toggle the items below to simulate client progress. AI dynamically updates outcomes.
              </p>

              <div className="space-y-2">
                {roadmapPhases.map((phase) => (
                  <motion.div
                    key={phase.id}
                    layout
                    onClick={() => togglePhase(phase.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                      phase.completed
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-muted/20 border-border/60 hover:bg-muted/50",
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                        phase.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-muted-foreground/30 bg-transparent",
                      )}
                    >
                      {phase.completed && <Check className="h-3 w-3" strokeWidth={3} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-xs text-left block",
                          phase.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground font-medium",
                        )}
                      >
                        {phase.title}
                      </span>
                    </div>
                    {phase.completed && (
                      <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full shrink-0">
                        Done
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                <span>CLIENT PROGRESS</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        );

      case "outcomes":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  AI Skills & Outcomes Audit
                </h3>
              </div>

              {runAudit === "idle" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Trigger an automated AI scan on client performance to see data-driven skill
                    gaps.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-[11px] p-2 bg-muted/40 rounded-lg border">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Mock Interviews</span>
                      <span className="font-semibold text-foreground">--</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Code Submissions</span>
                      <span className="font-semibold text-foreground">--</span>
                    </div>
                  </div>
                  <Button onClick={handleRunAudit} size="sm" className="w-full text-xs">
                    Run Skill Audit
                  </Button>
                </div>
              )}

              {runAudit === "auditing" && (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Analyzing 4 weeks of data...</p>
                </div>
              )}

              {runAudit === "done" && (
                <div className="space-y-3.5">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/20 rounded-xl space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">AI Analysis Report</p>
                        <p className="text-[9px] text-muted-foreground">Skills & Outcomes Audit</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs text-foreground leading-relaxed bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-border/30">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                        <Check className="h-3 w-3" />
                        Proficiency: Async Patterns — <strong>Advanced</strong>
                      </div>
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                        Recommendation: Focus on <strong>database indexing</strong> & query
                        profiling
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {runAudit === "done" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRunAudit("idle")}
                className="w-full text-xs"
              >
                Reset Audit
              </Button>
            )}
          </div>
        );

      case "cohorts":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Live Cohort Manager
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Easily transition from async courses to high-ticket live cohorts.
              </p>

              <div className="p-4 border border-border bg-muted/20 rounded-xl space-y-4">
                <div>
                  <h4 className="font-semibold text-xs text-foreground mb-1">
                    System Design Interview Prep
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Upcoming Live Session • 45/50 RSVPed
                  </p>
                </div>

                {cohortStatus === "idle" && (
                  <Button onClick={handleStartCohort} size="sm" className="w-full text-xs gap-2">
                    <Video className="h-3.5 w-3.5" /> Go Live Now
                  </Button>
                )}

                {cohortStatus === "starting" && (
                  <div className="py-2 flex justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}

                {cohortStatus === "live" && (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2.5 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-bold text-xs"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50" />
                    SESSION IS LIVE
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50" />
                  </motion.div>
                )}
              </div>
            </div>

            {cohortStatus === "live" && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setCohortStatus("idle")}
                className="w-full text-xs"
              >
                End Session
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const { data: coachesList = [], isLoading: coachesLoading } = useQuery({
    queryKey: ["public-coaches-directory"],
    queryFn: async () => {
      const { getPublicCoaches } = await import("@/lib/coach-creator.functions");
      return getPublicCoaches();
    },
  });

  return (
    <MarketingPage
      eyebrow="For Coaches"
      title="Run your coaching practice on autopilot."
      subtitle="Scheduling, payments, content, and AI insight — in one place."
    >
      <div
        className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
        style={{ background: "var(--gradient-brand)" }}
      >
        <motion.div
          className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* PERK SELECTOR */}
          <StaggerGroup className="lg:col-span-5 grid grid-cols-1 gap-2.5" stagger={0.05}>
            {perks.map((p) => (
              <StaggerItem key={p.id}>
                <button
                  onClick={() => {
                    setSelectedPerk(p.id);
                    setSelectedSlot(null);
                    setBookingStatus("idle");
                  }}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedPerk === p.id
                      ? "bg-background text-foreground border-transparent shadow-lg scale-[1.01]"
                      : "bg-white/10 border-white/10 text-primary-foreground hover:bg-white/15"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-lg shrink-0 ${
                      selectedPerk === p.id
                        ? "bg-primary/10 text-primary"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm leading-none">{p.title}</h4>
                    <p
                      className={`text-xs mt-1.5 leading-relaxed ${
                        selectedPerk === p.id ? "text-muted-foreground" : "opacity-80"
                      }`}
                    >
                      {p.desc}
                    </p>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* INTERACTIVE PREVIEW */}
          <div className="lg:col-span-7 bg-background/95 border border-border shadow-2xl rounded-2xl p-6 min-h-[340px] flex flex-col justify-between transition-all duration-300">
            {renderInteractiveDemo()}
          </div>
        </div>
      </div>

      {/* APPROVED COACHES DISPLAY SECTION */}
      <div className="mt-16 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> VERIFIED 1-ON-1 COACHES
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Book 1-on-1 Sessions with Top Mentors
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Get personalized code reviews, career guidance, and live mock interview practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachesList.length === 0 ? (
            <div className="col-span-full py-14 px-6 rounded-2xl border border-dashed text-center space-y-3 bg-card/40">
              <Users className="h-10 w-10 text-muted-foreground/60 mx-auto" />
              <h3 className="font-semibold text-base text-foreground">
                Mentor Roster Opening Soon
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                Our inaugural cohort of industry mentors is currently completing credential verification. Are you a senior engineer or tech lead? Apply below to host 1-on-1 sessions.
              </p>
              <div className="pt-2">
                <Button size="sm" asChild>
                  <Link to="/apply-coach">Apply as Coach</Link>
                </Button>
              </div>
            </div>
          ) : (
            coachesList.map((coach: any) => (
              <div
                key={coach.id}
                className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={coach.photo || getRealHumanAvatar(coach.name)}
                        alt={coach.name}
                        className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-base text-foreground leading-tight">
                          {coach.name}
                        </h3>
                        <p className="text-xs text-primary font-medium mt-0.5">{coach.title || coach.expertise}</p>
                      </div>
                    </div>
                    {coach.verification_status === "verified" ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-semibold"
                      >
                        Verified Coach
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] shrink-0 border-muted text-muted-foreground"
                      >
                        Coach
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {coach.bio}
                  </p>

                  {Array.isArray(coach.languages) && coach.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {coach.languages.map((lang: string) => (
                        <span
                          key={lang}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block uppercase font-semibold">
                      Hourly Rate
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ₹{coach.hourly_rate}{" "}
                      <span className="text-xs font-normal text-muted-foreground">/ hr</span>
                    </span>
                  </div>
                    <Button
                      size="sm"
                      onClick={() => setBookingCoach(coach)}
                      className="gap-1 rounded-xl text-xs font-semibold cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
                    >
                      Book Session ➔
                    </Button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Apple-style Coach Booking Modal */}
      <AppleCoachBookingModal
        coach={bookingCoach}
        open={Boolean(bookingCoach)}
        onOpenChange={(open) => !open && setBookingCoach(null)}
      />

      {/* Interactive Open Slot Booking Section */}
      <section className="mt-20 pt-16 border-t border-border/60">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge variant="outline" className="mb-2 text-xs border-primary/20 bg-primary/10 text-primary">
            Instant 1-on-1 Scheduling
          </Badge>
          <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">
            Schedule Directly on Coach's Open Calendar
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Pick an open slot across Google Meet, Zoom, or Microsoft Teams. Auto-synced to your local timezone with calendar overlay.
          </p>
        </div>

        <OpenSlotBooking
          headline="Experience Frictionless Booking"
          headlineAccent="Real Slots, Real Time"
          description="Book a slot with our Staff Architecture lead. Pick a duration, preview calendar conflicts, and get an instant .ics invite."
          meetingTitle="1:1 Technical & Career Advisory"
          agenda="System design review, mock tech interview, or career growth strategy session."
          location="Google Meet / Zoom (Link generated after booking)"
          durations={[15, 30, 45, 60]}
          defaultDuration={30}
          host={{
            name: "Maya Lindqvist",
            role: "Principal Distributed Systems Architect",
            city: "Bangalore",
            stamp: "Learnify · 1-on-1 Mentorship · ",
          }}
          hostBusy={sampleHostWeek}
          visitorEvents={sampleVisitorWeek}
          preset="postmark"
          gridHeight={420}
        />
      </section>

      {/* Transparent Receipt Pricing Section */}
      <section className="mt-20 pt-16 border-t border-border/60">
        <div className="text-center max-w-xl mx-auto mb-8">
          <Badge variant="outline" className="mb-2 text-xs border-primary/20 bg-primary/10 text-primary">
            GST Compliant · SAC 998431
          </Badge>
          <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">
            Mentorship Plans, Printed
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Official thermal receipt breakdown with 18% GST (CGST 9% + SGST 9%) and 2 months free on annual plans.
          </p>
        </div>

        <ReceiptPricing
          plans={PUBLIC_COACHING_PLANS}
          currency="INR"
          locale="en-IN"
          monthsFree={2}
          merchant="LEARNIFY EDTECH PVT LTD"
          merchantNote="SAC 998431 · 18% GST INCLUDED"
          orderPrefix="COACH"
          stampLabel="{months} MONTHS FREE"
          showStamp={true}
          showBarcode={true}
          onSelectPlan={(plan) => {
            window.location.href = `/coaching?plan=${plan.id}`;
          }}
        />
      </section>

      <div className="mt-14 text-center">
        <Button asChild size="lg" variant="outline" className="rounded-2xl">
          <Link to="/apply-coach">Apply to become a verified mentor</Link>
        </Button>
      </div>
    </MarketingPage>
  );
}





















