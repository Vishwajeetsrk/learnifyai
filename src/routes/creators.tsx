import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
                      <Sparkles className="h-3.5 w-3.5" /> COURSE GENERATED
                    </div>
                    <div className="space-y-2 text-xs text-foreground">
                      <p className="font-semibold text-primary/80 uppercase tracking-wider text-[10px]">
                        Module 1: The Fundamentals
                      </p>
                      <div className="space-y-1 ml-3 border-l-2 border-primary/20 pl-3">
                        <p className="text-muted-foreground">Lesson 1: Introduction</p>
                        <p className="text-muted-foreground">Lesson 2: Getting Started</p>
                      </div>
                      <p className="font-semibold text-primary/80 uppercase tracking-wider text-[10px] mt-3">
                        Module 2: Advanced Topics
                      </p>
                      <div className="space-y-1 ml-3 border-l-2 border-primary/20 pl-3">
                        <p className="text-muted-foreground">Lesson 1: Best Practices</p>
                      </div>
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
                <p className="text-3xl font-bold text-foreground">₹0</p>
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
                Blast an update to your learners with a single click.
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
                <div className="p-4 bg-white dark:bg-zinc-900 border border-border/60 rounded-xl shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      Y
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground flex items-center gap-2">
                        You
                        <span className="text-[9px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                          Creator
                        </span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">Just now</p>
                    </div>
                    <span className="ml-auto text-[9px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Public
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-relaxed">{postContent}</p>
                  <div className="flex items-center gap-4 pt-2.5 border-t border-border/40 text-[10px] font-medium text-muted-foreground">
                    <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      12 Likes
                    </span>
                    <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      0 Comments
                    </span>
                    <span className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                      Share
                    </span>
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

  const { data: approvedCreators } = useQuery({
    queryKey: ["approved-creators-public"],
    queryFn: async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await (supabase as any)
          .from("creator_applications")
          .select("*")
          .eq("status", "approved");
        return data ?? [];
      } catch {
        return [];
      }
    },
  });

  const fallbackCreator = {
    id: "creator-demo-1",
    full_name: "Vishwajeet S.",
    expertise: "Full-Stack & AI Systems",
    bio: "Creator of Full-Stack AI Engineering & Autonomous Agents masterclasses on Learnify AI.",
    coursesCount: 5,
  };

  const creatorsList =
    approvedCreators && approvedCreators.length > 0
      ? approvedCreators.map((c: any) => ({
          id: c.id,
          full_name: c.full_name || c.applicant_name || "Verified Creator",
          expertise: c.expertise || c.category || "AI Educator",
          bio: c.motivation || c.bio || "Building interactive courses and code playgrounds.",
          coursesCount: 3,
        }))
      : [fallbackCreator];

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

      {/* APPROVED CREATORS DISPLAY SECTION */}
      <div className="mt-16 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> FEATURED COURSE CREATORS
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            Learn from Verified Tech Creators
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Top educators publishing cutting-edge AI and software development courses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatorsList.map((creator: any) => (
            <div
              key={creator.id}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(creator.full_name)}`}
                      alt={creator.full_name}
                      className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-tight">
                        {creator.full_name}
                      </h3>
                      <p className="text-xs text-primary font-medium mt-0.5">{creator.expertise}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {creator.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  {creator.coursesCount} Courses Published
                </span>
                <Button size="sm" asChild variant="outline">
                  <Link to="/courses">View Courses ➔</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 text-center">
        <Button asChild size="lg">
          <Link to="/apply-creator">Apply to become a creator</Link>
        </Button>
      </div>
    </MarketingPage>
  );
}
