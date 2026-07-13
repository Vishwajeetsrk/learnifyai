import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

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
  }),
  component: () => (
    <CustomPageContent
      pageKey="refund"
      title="Refund Policy"
      subtitle="Last updated: July 3, 2026. Auto-approved refunds are processed within 5–7 business days."
      defaultContent={`<h2>1. Auto-Approved Refunds</h2>
<p>Refunds meeting both criteria below are automatically approved without manual review:</p>
<ul>
  <li><strong>30-day window:</strong> Request submitted within 30 days of the original purchase or subscription start date.</li>
  <li><strong>Less than 30% course completion:</strong> Fewer than 30% of lessons marked completed for course purchases, or fewer than 500 AI credits consumed for subscription plans.</li>
</ul>
<p>Auto-approved refunds are processed within 5–7 business days and credited to the original payment method.</p>

<h2>2. Subscription Refund Rules</h2>
<p>A full refund is available within 30 days of the initial subscription purchase, provided the account has consumed less than 500 AI credits of the monthly allotment. Subsequent monthly subscription renewals are non-refundable.</p>

<h2>3. Course Refunds</h2>
<p>Paid courses are eligible for a refund within 30 days of purchase if less than 30% of the lessons have been marked completed. Promotional purchases or custom enterprise courses are non-refundable.</p>

<h2>4. Wallet Top-Up Refunds</h2>
<p>Wallet top-ups for creator/coach earnings are non-refundable once credited. Student wallet top-ups are not available on the platform.</p>

<h2>5. How to Request</h2>
<p>Submit a refund request via the Billing Dashboard or email <a href="mailto:hello@learnify.ai">hello@learnify.ai</a> with your registered email, plan/course name, and reason for the request.</p>

<h2>6. Processing Time</h2>
<p>Approved refunds are processed within 5–7 business days and credited to your original payment method. You will receive a confirmation email once processed.</p>`}
    />
  ),
});
