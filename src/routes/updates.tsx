import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Play, CheckCircle2, ArrowRight, Calendar, Zap, Layers, Video } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProductUpdates, ProductUpdate } from "@/lib/updatesStore";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "What's New — Learnify AI Product Updates & Changelog" },
      {
        name: "description",
        content:
          "Explore the latest releases, features, and continuous improvements in Learnify AI and the Learnify Studio IDE.",
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

  useEffect(() => {
    setUpdates(getProductUpdates().filter((u) => u.isPublished));

    const handleUpdateChange = () => {
      setUpdates(getProductUpdates().filter((u) => u.isPublished));
    };

    window.addEventListener("learnify_updates_changed", handleUpdateChange);
    return () => window.removeEventListener("learnify_updates_changed", handleUpdateChange);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col justify-between selection:bg-sky-500/20 selection:text-sky-300">
      <SiteHeader />

      <main className="flex-1">
        {/* ─── Hero Header (Matches Reference Video) ─── */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-border/40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 max-w-5xl text-center space-y-5 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-400" />
              <span>Changelog &amp; Product Updates</span>
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
          </div>
        </section>

        {/* ─── Timeline Updates Feed (Matches Layout in Reference Video) ─── */}
        <section className="container mx-auto px-6 max-w-5xl py-12 md:py-20">
          <div className="space-y-16 md:space-y-24">
            {updates.map((item, index) => {
              const isVideoPlaying = playingVideoId === item.id;

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-16 md:pb-24 border-b border-border/40 last:border-b-0 items-start"
                >
                  {/* Left Column: Date Pill & Large Title */}
                  <div className="md:col-span-5 space-y-4 md:sticky md:top-28">
                    {/* Glowing Blue Date Pill matching video */}
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

                    {item.badge && (
                      <div>
                        <Badge variant="outline" className="text-[11px] font-mono border-border text-muted-foreground">
                          {item.badge}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Media Preview + "New in this update" Bullet Points */}
                  <div className="md:col-span-7 space-y-6">
                    {/* Visual Media Card (Video Player or High-Res Image) */}
                    <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-card/60 shadow-xl group">
                      {item.mediaType === "video" ? (
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
                              <div className="w-14 h-14 rounded-full bg-white/90 hover:bg-white text-slate-950 flex items-center justify-center shadow-2xl transition">
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

                    {/* "New in this update:" Bullet Points (Exact match to video) */}
                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm sm:text-base font-semibold text-foreground">
                        New in this update:
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                        {item.bulletPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-sky-400 font-bold text-base leading-none select-none mt-1">
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
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
