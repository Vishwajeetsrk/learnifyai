import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Learnify AI" },
      {
        name: "description",
        content: "Learnify AI 30-day refund and cancellation policy for subscriptions, course purchases, and wallet transactions.",
      },
      { property: "og:title", content: "Refund Policy — Learnify AI" },
      {
        property: "og:description",
        content: "Our transparent 30-day refund policy for all paid Learnify AI plans and services.",
      },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="refund"
      title="Refund & Cancellation Policy"
      subtitle="Last updated: August 2026. Auto-approved refunds are processed within 5–7 business days via Cashfree Payment Gateway."
      defaultContent={`<h2>1. 30-Day Money-Back Guarantee</h2>
<p>In accordance with Indian Consumer Protection (E-Commerce) Rules 2020, Learnify AI provides a transparent 30-day money-back guarantee. Refund requests meeting both conditions below are auto-approved:</p>
<ul>
  <li><strong>30-Day Request Window:</strong> Request submitted within 30 days of the original purchase or subscription date.</li>
  <li><strong>Usage Threshold:</strong> Less than 30% course progress completed or fewer than 500 AI credits consumed during the billing period.</li>
</ul>
<p>Approved refunds are credited directly to your original payment method (UPI, NetBanking, Bank Account, or Card) via Cashfree within 5–7 business days.</p>

<h2>2. Cashfree Mandate Cancellations</h2>
<p>You can cancel recurring subscription mandates at any time with 1 click via your Billing Dashboard. Cancellation immediately stops future auto-debits; you maintain full access to paid features until the end of your current paid billing cycle.</p>

<h2>3. Refund Request Process</h2>
<p>To request a refund:
  <ol>
    <li>Navigate to your Billing Dashboard and click <strong>Request Refund</strong>, or</li>
    <li>Email our support team at <a href="mailto:support@learnifyai.in">support@learnifyai.in</a> with your registered email address and Cashfree Order ID.</li>
  </ol>
</p>

<h2>4. Refund Confirmation & Tax Adjustments</h2>
<p>Upon refund approval, Cashfree generates an automated Refund Reference Number (RRN). A revised GST credit note reflecting the tax adjustment (GST 18%) is automatically emailed to your registered address for bookkeeping.</p>`}
    />
  ),
});
