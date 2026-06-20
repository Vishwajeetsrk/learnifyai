import { useState } from "react";
import { motion } from "framer-motion";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, DollarSign, Megaphone, Users, Check, Loader2, Send, Video } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StaggerGroup, StaggerItem } from "@/components/Reveal";

export const Route = createFileRoute("/creators")({
  head: () => ({
    meta: [
      { title: "Creators — Learnify AI" },
      {
        name: "description",
        content:
          "Build a course, grow an audience, and earn — with AI tooling that does the heavy lifting.",
      },
      { property: "og:title", content: "Creators — Learnify AI" },
      {
        property: "og:description",
        content:
          "Launch a course in days, not months. Built-in audience, payouts, and AI co-pilot.",
      },
    ],
  }),
  component: CreatorsPage,
});

const perks = [
  {
    id: "builder",
    icon: Sparkles,
    title: "AI Course Builder",
    desc: "Generate modules, lessons, and assignments from a prompt.",
  },
  {
    id: "payouts",
    icon: DollarSign,
    title: "Direct Payouts",
    desc: "Get paid to your wallet. Withdraw anytime via Cashfree (UPI or bank).",
  },
  {
    id: "audience",
    icon: Megaphone,
    title: "Built-in Audience",
    desc: "Tap into a global community of learners.",
  },
  {
    id: "cohorts",
    icon: Users,
    title: "Cohort Tools",
    desc: "Run live cohorts, office hours, and study groups.",
  },
];

function CreatorsPage() {
  const [selectedPerk, setSelectedPerk] = useState("builder");

  // State for AI Course Builder
  const [coursePrompt, setCoursePrompt] = useState("");
  const [buildStatus, setBuildStatus] = useState<"idle" | "building" | "done">("idle");

  const handleGenerateCourse = () => {
    if (!coursePrompt) return;
    setBuildStatus("building");
    setTimeout(() => {
      setBuildStatus("done");
    }, 1500);
  };

  // State for Payouts
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutStatus, setPayoutStatus] = useState<"idle" | "processing" | "done">("idle");

  const handlePayout = () => {
    if (!payoutAmount) return;
    setPayoutStatus("processing");
    setTimeout(() => {
      setPayoutStatus("done");
    }, 1200);
  };

  // State for Audience
  const [postContent, setPostContent] = useState("");
  const [postStatus, setPostStatus] = useState<"idle" | "posted">("idle");

  const handlePost = () => {
    if (!postContent) return;
    setPostStatus("posted");
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
      case "builder":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  AI Course Generator Sandbox
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Enter a topic and let our AI generate a complete course curriculum in seconds.
              </p>

              {buildStatus === "idle" && (
                <div className="space-y-3">
                  <Input
                    placeholder="e.g. Next.js 15 for Beginners"
                    value={coursePrompt}
                    onChange={(e) => setCoursePrompt(e.target.value)}
                    className="text-xs"
                    onKeyDown={(e) => e.key === "Enter" && handleGenerateCourse()}
                  />
                  <Button
                    onClick={handleGenerateCourse}
                    disabled={!coursePrompt}
                    size="sm"
                    className="w-full text-xs"
                  >
                    Generate Curriculum
                  </Button>
                </div>
              )}

              {buildStatus === "building" && (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Drafting modules and lessons...</p>
                </div>
              )}

              {buildStatus === "done" && (
                <div className="space-y-3">
                  <div className="p-3 border border-primary/20 bg-primary/5 rounded-xl space-y-3">
                    <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
                      <Check className="h-3.5 w-3.5" /> COURSE GENERATED
                    </div>
                    <div className="space-y-2 text-xs text-foreground">
                      <p className="font-semibold">Module 1: The Fundamentals</p>
                      <p className="text-muted-foreground ml-3">• Lesson 1: Introduction</p>
                      <p className="text-muted-foreground ml-3">• Lesson 2: Getting Started</p>
                      <p className="font-semibold mt-2">Module 2: Advanced Topics</p>
                      <p className="text-muted-foreground ml-3">• Lesson 1: Best Practices</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {buildStatus === "done" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBuildStatus("idle");
                  setCoursePrompt("");
                }}
                className="w-full text-xs"
              >
                Generate Another
              </Button>
            )}
          </div>
        );

      case "payouts":
        return (
          <div className="flex flex-col h-full justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Direct Payouts Preview
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Withdraw your earnings instantly to your linked bank account or UPI.
              </p>

              <div className="p-4 bg-muted/30 border border-border rounded-xl mb-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Current Balance
                </p>
                <p className="text-3xl font-bold text-foreground">₹45,250</p>
              </div>

              {payoutStatus === "idle" && (
                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Amount to withdraw"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="text-xs"
                  />
                  <Button
                    onClick={handlePayout}
                    disabled={!payoutAmount}
                    size="sm"
                    className="w-full text-xs"
                  >
                    Withdraw to Bank
                  </Button>
                </div>
              )}

              {payoutStatus === "processing" && (
                <div className="py-4 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Processing withdrawal...</p>
                </div>
              )}

              {payoutStatus === "done" && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                  <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground">Withdrawal Successful!</h4>
                  <p className="text-xs text-muted-foreground">
                    ₹{payoutAmount} has been sent to your bank account ending in 4921.
                  </p>
                </div>
              )}
            </div>
            {payoutStatus === "done" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPayoutStatus("idle");
                  setPayoutAmount("");
                }}
                className="w-full text-xs"
              >
                Make Another Withdrawal
              </Button>
            )}
          </div>
        );

      case "audience":
        return (
          <div className="flex flex-col h-full justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Megaphone className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  Community Announcement
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Blast an update to your 1,200 active learners with a single click.
              </p>

              {postStatus === "idle" ? (
                <div className="space-y-3">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Share an update, milestone, or tip..."
                    className="w-full h-24 p-3 bg-muted/50 border border-border rounded-xl text-xs resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    onClick={handlePost}
                    disabled={!postContent.trim()}
                    size="sm"
                    className="w-full text-xs gap-2"
                  >
                    <Send className="h-3.5 w-3.5" /> Post Update
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                      YOU
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Creator</p>
                      <p className="text-[10px] text-muted-foreground">Just now</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{postContent}</p>
                  <div className="flex gap-4 pt-2 border-t border-border/50 text-[10px] font-medium text-muted-foreground">
                    <span>12 Likes</span>
                    <span>0 Comments</span>
                  </div>
                </div>
              )}
            </div>
            {postStatus === "posted" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPostStatus("idle");
                  setPostContent("");
                }}
                className="w-full text-xs"
              >
                Post Another
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
                  <div className="flex items-center justify-center gap-2 py-2 text-red-500 font-semibold text-xs animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    SESSION IS LIVE
                  </div>
                )}
              </div>
            </div>

            {cohortStatus === "live" && (
              <Button
                variant="outline"
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

  return (
    <MarketingPage
      eyebrow="For Creators"
      title="Teach what you love. Earn what you're worth."
      subtitle="The creator stack designed for AI-era educators."
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
          <Link to="/signup">Apply to become a creator</Link>
        </Button>
      </div>
    </MarketingPage>
  );
}
