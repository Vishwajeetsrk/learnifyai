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
      subtitle="Last updated: July 2026. Auto-approved refunds are processed within 5–7 business days via Cashfree PG."
      defaultContent={`<h2>1. Auto-Approved Refund Eligibility</h2>
<p>In accordance with Indian Consumer Protection (E-Commerce) Rules 2020, refund requests meeting both conditions below are auto-approved:</p>
<ul>
  <li><strong>30-Day Money-Back Guarantee:</strong> Request submitted within 30 days of the purchase date.</li>
  <li><strong>Consumption Threshold:</strong> Less than 30% course completion or fewer than 500 AI credits consumed.</li>
</ul>
<p>Approved refunds are credited to the original payment method (UPI, Bank Account, or Card) via Cashfree within 5–7 business days.</p>

<h2>2. Cashfree Mandate Cancellations</h2>
<p>Users may cancel recurring subscription mandates at any time via the Billing Dashboard. Cancellation prevents future auto-debits; access continues until the end of the current paid billing cycle.</p>

<h2>3. Refund Request Process</h2>
<p>To request a refund, submit a request via your Billing Dashboard or email our support team at <a href="mailto:support@learnifyai.in">support@learnifyai.in</a> with your Order ID, registered email, and reason for refund.</p>

<h2>4. Processing & Confirmation</h2>
<p>Once initiated, Cashfree issues an automated refund reference number (RRN). An instant email notification with tax adjustment details will be dispatched to your registered address.</p>`}
    />
  ),
});
