import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";
import { DOC_CONTENTS } from "@/lib/legal-docs-data";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Learnify AI" },
      {
        name: "description",
        content:
          "Learnify AI refund policy for subscriptions, course purchases, and wallet top-ups.",
      },
      { property: "og:title", content: "Refund Policy — Learnify AI" },
      {
        property: "og:description",
        content: "Our refund and cancellation policy for all paid services.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/refund-policy" }],
  }),
  component: () => (
    <CustomPageContent
      pageKey="refund"
      title="Cancellation & Refund Policy"
      subtitle="Last updated: October 1, 2026. Governed by Learnify AI commercial policy and Indian Consumer Protection (E-Commerce) Rules."
      defaultContent={DOC_CONTENTS["cancellation-refund"]}
    />
  ),
});
