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
      subtitle="Last updated: June 2, 2026. All refunds are processed within 5–7 business days."
      defaultContent={`<h2>1. Course Refunds</h2>
<p>You may request a full refund within 7 days of purchase, provided you have completed less than 30% of the course content. Refund requests exceeding these limits will be evaluated on a case-by-case basis.</p>

<h2>2. Wallet Top-ups</h2>
<p>Wallet credits are non-refundable except where required by applicable law. Unused credits remain in your wallet indefinitely and can be applied to future purchases.</p>

<h2>3. How to Request</h2>
<p>Submit a refund request via the <a href="/contact">Contact page</a> or email <a href="mailto:hello@learnify.ai">hello@learnify.ai</a> with your registered email, course name, and reason for the request.</p>

<h2>4. Processing Time</h2>
<p>Approved refunds are processed within 5–7 business days and credited to your original payment method. You will receive a confirmation email once processed.</p>

<h2>5. Subscription & Cohort Payments</h2>
<p>Subscription fees and cohort enrollment payments follow the same 7-day window. Cohort cancellations before the start date are fully refundable.</p>

<h2>6. Exceptions</h2>
<p>No refunds are offered for: completed courses, digital certificate issuance fees, or promotional/discounted purchases where explicitly stated as non-refundable at checkout.</p>

<h2>7. Disputes</h2>
<p>If your refund request is denied, you may escalate by replying to the denial email. We review escalated cases within 3 business days.</p>

<h2>8. Contact</h2>
<p>For any refund-related questions, reach out to <a href="mailto:hello@learnify.ai">hello@learnify.ai</a>.</p>`}
    />
  ),
});
