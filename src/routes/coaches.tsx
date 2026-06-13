import { useState } from "react";
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
} from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StaggerGroup, StaggerItem } from "@/components/Reveal";

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
];

function CoachesPage() {
  const [selectedPerk, setSelectedPerk] = useState("scheduling");

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
                  <div
                    key={phase.id}
                    onClick={() => togglePhase(phase.id)}
                    className="flex items-center gap-3 p-2.5 rounded-lg border bg-muted/20 border-border/60 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div
                      className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                        phase.completed
                          ? "bg-primary border-transparent text-primary-foreground"
                          : "border-muted-foreground/30 bg-transparent"
                      }`}
                    >
                      {phase.completed && <Check className="h-3 w-3" />}
                    </div>
                    <span
                      className={`text-xs text-left ${
                        phase.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground font-medium"
                      }`}
                    >
                      {phase.title}
                    </span>
                  </div>
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
                      <span className="font-semibold text-foreground">8.2 / 10</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Code Submissions</span>
                      <span className="font-semibold text-foreground">94% score</span>
                    </div>
                  </div>
                  <Button onClick={handleRunAudit} size="sm" className="w-full text-xs">
                    Run Skill Audit
                  </Button>
                </div>
              )}

              {runAudit === "auditing" && (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Scanning client codebase and logs...
                  </p>
                </div>
              )}

              {runAudit === "done" && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                      <Sparkles className="h-3.5 w-3.5" /> AI ANALYSIS REPORT
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      Client is extremely proficient with asynchronous patterns. Highlighted
                      recommendation: Focus on **database indexing** and query profiling
                      optimizations.
                    </p>
                  </div>
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

      default:
        return null;
    }
  };

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

      <div className="mt-14 text-center">
        <Button asChild size="lg">
          <Link to="/contact">Talk to our coach team</Link>
        </Button>
      </div>
    </MarketingPage>
  );
}
