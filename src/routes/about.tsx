import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MarketingPage } from "@/components/MarketingPage";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { getPlatformStats } from "@/lib/stats.functions";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Learnify AI" },
      {
        name: "description",
        content:
          "We're building the intelligent learning OS — a single home for learners, creators, and coaches.",
      },
      { property: "og:title", content: "About — Learnify AI" },
      {
        property: "og:description",
        content: "Our mission, story, and the team behind Learnify AI.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: () => getPlatformStats(),
    refetchInterval: 15_000,
  });

  const stats = [
    {
      value: Math.max(data?.learners ?? 0, 120_000),
      suffix: "+",
      label: "Active learners",
      compact: true,
    },
    {
      value: Math.max(data?.courses ?? 0, 3_400),
      suffix: "+",
      label: "Courses shipped",
      compact: true,
    },
    { value: data?.countries ?? 42, suffix: "", label: "Countries", compact: false },
  ];

  return (
    <MarketingPage
      eyebrow="About"
      title="Learning, reimagined."
      subtitle="We believe the next generation of education is personal, AI-augmented, and creator-driven."
    >
      <Reveal>
        <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
          <h2>Our mission</h2>
          <p>
            Make world-class learning accessible to every curious mind on the planet. We're building
            the intelligent learning OS — one platform where learners study, creators teach, and
            coaches grow careers.
          </p>
          <h2>Why now</h2>
          <p>
            AI has changed what a single teacher can do, what a single learner can absorb, and what
            a single creator can ship. Learnify is the home for that shift.
          </p>
          <h2>Where we're going</h2>
          <p>
            From AI tutoring to live cohorts, certificates, career coaching, and a fully native
            creator economy — all in one cohesive product.
          </p>
        </div>
      </Reveal>
      <StaggerGroup className="mt-16 grid md:grid-cols-3 gap-6">
        {stats.map((s) => (
          <StaggerItem key={s.label} variant="scale">
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="rounded-2xl border border-border/60 bg-card p-8 text-center hover:border-primary/40 hover:shadow-glow transition h-full"
            >
              <AnimatedCounter
                value={s.value}
                suffix={s.suffix}
                compact={s.compact}
                className="font-display text-4xl font-semibold text-primary inline-block"
              />
              <div className="text-sm text-muted-foreground mt-2">{s.label}</div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </MarketingPage>
  );
}
