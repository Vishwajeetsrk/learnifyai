import { createFileRoute } from "@tanstack/react-router";
import { FaqDrawer, DEFAULT_LEARNIFY_CARDS } from "@/components/ui/faq-drawer";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Learnify AI" },
      {
        name: "description",
        content:
          "Answers to the most common questions about Learnify AI: certificates, courses, billing, and more.",
      },
      { property: "og:title", content: "FAQ — Learnify AI" },
      { property: "og:description", content: "Answers to common questions about Learnify AI." },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: DEFAULT_LEARNIFY_CARDS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 w-full flex items-center justify-center py-6 sm:py-12">
        <FaqDrawer
          label="Knowledge Base"
          title="Frequently asked questions."
          lead="Everything you need to know about Learnify AI courses, tamper-proof credentials, 50+ templates, and creator payouts."
          drawer="Learnify · Q–Z"
          count={7}
          open="1"
          single={true}
          finish="auto"
          askNote="Can't find your answer in the drawer? Our academic council answers within the hour."
          askLabel="Ask Support"
          askHref="mailto:support@learnifyai.in"
        />
      </main>
      <SiteFooter />
    </div>
  );
}

