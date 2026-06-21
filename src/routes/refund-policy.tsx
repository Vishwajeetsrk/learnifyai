import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Learnify AI" },
      {
        name: "description",
        content: "Learnify AI refund policy for course purchases and wallet top-ups.",
      },
      { property: "og:title", content: "Refund Policy — Learnify AI" },
      {
        property: "og:description",
        content: "Our refund and cancellation policy for paid courses and credits.",
      },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="refund"
      title="Refund Policy"
      subtitle="Last updated: June 21, 2026. All refunds are processed within 5–7 business days."
      defaultContent={`<h2>1. Subscription Refund Rules</h2>
<p>A full refund is available within 7 days of the initial subscription purchase, provided the account has consumed less than 500 AI credits of the monthly allotment. Subsequent monthly subscription renewals are non-refundable.</p>

<h2>2. Course Refunds</h2>
<p>Paid courses are eligible for a refund within 7 days of purchase if less than 30% of the lessons have been marked completed. Promotional purchases or custom enterprise courses are non-refundable.</p>

<h2>3. How to Request</h2>
<p>Submit a refund request via the Contact page or email <a href="mailto:hello@learnify.ai">hello@learnify.ai</a> with your registered email, course name, and reason for the request.</p>

<h2>4. Processing Time</h2>
<p>Approved refunds are processed within 5–7 business days and credited to your original payment method. You will receive a confirmation email once processed.</p>`}
    />
  ),
});
