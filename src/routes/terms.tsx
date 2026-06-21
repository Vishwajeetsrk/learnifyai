import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Learnify AI" },
      {
        name: "description",
        content: "Learnify AI Terms of Service — your rights and responsibilities.",
      },
      { property: "og:title", content: "Terms of Service — Learnify AI" },
      {
        property: "og:description",
        content: "The terms governing your use of the Learnify AI platform.",
      },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="terms"
      title="Terms of Service"
      subtitle="Last updated: June 21, 2026. By using Learnify AI, you agree to these terms."
      defaultContent={`<h2>1. Acceptance of Terms</h2>
<p>By accessing or using Learnify AI ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>

<h2>2. Cashfree Subscription Terms</h2>
<p>By subscribing to Pro (₹499/mo) or Team (₹4,999/mo) plans, you authorize Learnify AI and Cashfree to auto-debit the recurring fee on a monthly cycle. Subscriptions remain active until cancelled via the Billing Dashboard.</p>

<h2>3. Grace Period & Overdue Payments</h2>
<p>Failed payment renewals are subject to a 3-day grace period. Access will be downgraded to the Starter (Free) plan if the payment mandate cannot be successfully resolved after the grace period.</p>

<h2>4. AI Credit Allocations</h2>
<p>AI credits are granted monthly based on the active plan: 500 for Starter, 10,000 for Pro, and 50,000 for Team. Credits are non-transferable and reset at the end of each billing cycle.</p>

<h2>5. Prohibited Conduct</h2>
<p>You may not use the Platform to: violate laws, infringe intellectual property, distribute malware, harass others, scrape data, or bypass payment systems.</p>`}
    />
  ),
});
