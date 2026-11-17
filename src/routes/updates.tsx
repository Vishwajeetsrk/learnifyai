import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Sparkles,
  Play,
  Pause,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Zap,
  Layers,
  Video,
  Share2,
  Search,
  Filter,
  Check,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProductUpdates, ProductUpdate } from "@/lib/updatesStore";
import { CuteMentorFace } from "@/components/coaches/CuteMentorFace";
import { MENTORS } from "@/components/coaches/mentorData";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "What's New — Learnify AI Product Updates & Changelog" },
      {
        name: "description",
        content:
          "Explore the latest releases, features, and continuous engineering updates in Learnify AI, Learnify Studio IDE, and AI Mentor Direct Messenger.",
      },
      { property: "og:title", content: "What's New in Learnify AI" },
      {
        property: "og:description",
        content: "Product updates, feature releases, and changelog for Learnify AI.",
      },
    ],
  }),
  component: UpdatesPage,
});

function UpdatesPage() {
  const [updates, setUpdates] = useState<ProductUpdate[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setUpdates(getProductUpdates().filter((u) => u.isPublished));

    const handleUpdateChange = () => {
      setUpdates(getProductUpdates().filter((u) => u.isPublished));
    };

    window.addEventListener("learnify_updates_changed", handleUpdateChange);
    return () => window.removeEventListener("learnify_updates_changed", handleUpdateChange);
  }, []);

  const badgeCategories = useMemo(() => {
    const badges = Array.from(new Set(updates.map((u) => u.badge).filter(Boolean))) as string[];
    return ["All", ...badges];
  }, [updates]);

  const filteredUpdates = useMemo(() => {
    return updates.filter((item) => {
      const matchesBadge =
        selectedBadge === "All" || item.badge?.toLowerCase() === selectedBadge.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesBadge;

      const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        item.releaseDate.toLowerCase().includes(query) ||
        (item.summary && item.summary.toLowerCase().includes(query)) ||
        item.bulletPoints.some((bp) => bp.toLowerCase().includes(query));

      return matchesBadge && matchesSearch;
    });
  }, [updates, selectedBadge, searchQuery]);

  const handleShare = (item: ProductUpdate) => {
    const url = `${window.location.origin}/updates#${item.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    toast.success(`Copied update link for "${item.title}"`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-[100dvh] bg-background text-foreground flex flex-col justify-between selection:bg-sky-500/20 selection:text-sky-300 relative"
    >
      {/* Top Floating Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 z-50 origin-left"
        style={{ scaleX: scaleY }}
      />

      <SiteHeader />

      <main className="flex-1">
        {/* ─── Hero Header ─── */}
        <section className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden border-b border-border/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 max-w-5xl text-center space-y-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Changelog &amp; Continuous Engineering</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-foreground"
            >
              What's new in Learnify AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Follow our engineering releases as we build the premier AI-native learning &amp; career platform in India.
            </motion.p>

            {/* Quick Search & Badge Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search releases (e.g. Studio, Audio, GST, Messenger)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-xl bg-card/60 border-border/80 text-xs sm:text-sm"
                />
              </div>

              {/* Badge Filters */}
              <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 justify-center">
                {badgeCategories.map((badge) => (
                  <button
                    key={badge}
                    type="button"
                    onClick={() => setSelectedBadge(badge)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all shrink-0 ${
                      selectedBadge === badge
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "bg-muted/50 hover:bg-muted text-muted-foreground border border-border/60"
                    }`}
                  >
                    {badge}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Timeline Updates Feed with Connected Vertical Guide Rail ─── */}
        <section className="container mx-auto px-6 max-w-5xl py-12 md:py-20 relative">
          {/* Subtle Vertical Progress Spine (Desktop) */}
          <div className="hidden md:block absolute left-8 top-16 bottom-16 w-0.5 bg-gradient-to-b from-sky-500/40 via-indigo-500/20 to-border/40 pointer-events-none" />

          {filteredUpdates.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-sm text-muted-foreground">No updates matching your query "{searchQuery}".</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBadge("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-16 md:space-y-24">
              {filteredUpdates.map((item, index) => {
                const isVideoPlaying = playingVideoId === item.id;
                const isCopied = copiedId === item.id;

                return (
                  <motion.article
                    id={item.id}
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-16 md:pb-24 border-b border-border/40 last:border-b-0 items-start relative"
                  >
                    {/* Left Column: Date Pill, Title, Summary, and Share Link */}
                    <div className="md:col-span-5 space-y-4 md:sticky md:top-28">
                      {/* Glowing Date Pill */}
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-xs font-medium text-sky-400 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
                        <span>{item.releaseDate}</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground leading-tight">
                        {item.title}
                      </h2>

                      {item.summary && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.summary}
                        </p>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className="text-[11px] font-mono border-sky-500/30 text-sky-400 bg-sky-500/5 font-semibold"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(item)}
                          className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1.5 px-2"
                        >
                          {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Share2 className="h-3 w-3" />}
                          <span>{isCopied ? "Link Copied" : "Share"}</span>
                        </Button>
                      </div>
                    </div>

                    {/* Right Column: Visual Media Preview + "New in this update:" Bullet Points */}
                    <div className="md:col-span-7 space-y-6">
                      {/* Visual Media Card */}
                      <div className="relative rounded-2xl overflow-hidden border border-border/70 bg-card/60 shadow-xl group transition-all duration-300 hover:border-sky-500/40">
                        {item.id === "update-v4-3" ? (
                          <div className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-indigo-500/20 text-center overflow-hidden">
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

                            <div className="relative z-10 flex flex-col items-center space-y-4">
                              <div className="relative group cursor-pointer">
                                <CuteMentorFace
                                  mentor={MENTORS[0]}
                                  size="xl"
                                  isInteractive={true}
                                  showOnlineBadge={true}
                                  className="transform transition-transform hover:scale-110"
                                />
                              </div>

                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Real-Time Mouse Gaze Physics Active
                                </span>
                                <p className="text-xs text-slate-300 max-w-sm pt-1">
                                  Move your cursor anywhere on the screen — eyes follow mouse trajectory and blink spontaneously every 2.5–6s.
                                </p>
                              </div>

                              <div className="flex items-center gap-2 pt-2">
                                <Button size="sm" asChild className="h-8 text-xs bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5">
                                  <Link to="/coaches">
                                    <Sparkles className="w-3.5 h-3.5" /> Launch AI Coach Studio
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPlayingVideoId(isVideoPlaying ? null : item.id)}
                                  className="h-8 text-xs border-white/20 text-slate-200 hover:bg-white/10 gap-1.5"
                                >
                                  <Play className="w-3.5 h-3.5" /> {isVideoPlaying ? "Close Video" : "Watch 1080p Video"}
                                </Button>
                              </div>

                              {isVideoPlaying && (
                                <div className="w-full mt-4 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                  <video
                                    src={item.mediaUrl}
                                    controls
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full aspect-video object-cover"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : item.mediaType === "video" ? (
                          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                            <video
                              src={item.mediaUrl}
                              controls={isVideoPlaying}
                              autoPlay={isVideoPlaying}
                              muted
                              loop
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            {!isVideoPlaying && (
                              <button
                                type="button"
                                onClick={() => setPlayingVideoId(item.id)}
                                className="absolute inset-0 bg-black/40 hover:bg-black/30 backdrop-blur-[2px] flex items-center justify-center transition-all cursor-pointer group-hover:scale-105"
                                title="Play Video Update"
                              >
                                <div className="w-14 h-14 rounded-full bg-white/95 hover:bg-white text-slate-950 flex items-center justify-center shadow-2xl transition">
                                  <Play className="h-6 w-6 fill-slate-950 ml-1" />
                                </div>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>

                      {/* "New in this update:" Bullet Points */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                          <Zap className="h-4 w-4 text-sky-400" />
                          <span>New in this update:</span>
                        </h3>
                        <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
                          {item.bulletPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="text-sky-400 font-bold text-base leading-none select-none mt-0.5">
                                &bull;
                              </span>
                              <span className="text-muted-foreground/90">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}