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
    links: [{ rel: "canonical", href: "https://www.learnifyai.in/refund-policy" }],
  }),
  component: () => (
    <CustomPageContent
      pageKey="refund"
      title="Cancellation & Refund Policy"
      subtitle="Last updated: September 2026. Governed by Learnify AI commercial policy and Indian Consumer Protection (E-Commerce) Rules."
      defaultContent={`<h2>1. Digital Products Commercial Policy</h2>
<p>Learnify AI provides immediate digital delivery upon purchase, including digital tools, coding environments, certificate issuance, and allocated AI credit pools. As digital content is immediately consumable upon account activation, Learnify AI does not provide routine refunds for normal change-of-mind purchases, unutilized subscription time, or downloaded digital assets.</p>

<h2>2. Exception Review Workflow</h2>
<p>We review refund requests for extraordinary exceptions under our administrative review process:</p>
<ul>
  <li><strong>Duplicate Charges:</strong> Technical glitch resulting in multiple debits for the same subscription or order.</li>
  <li><strong>Unauthorized Transactions:</strong> Verified fraudulent payment activity reported within 48 hours.</li>
  <li><strong>Service Non-Delivery:</strong> Major persistent technical platform failure attributable to Learnify AI preventing service delivery.</li>
  <li><strong>Incorrect Charges:</strong> Erroneous billing amount differing from the published canonical price.</li>
</ul>

<h2>3. Subscription Cancellation & Access Retention</h2>
<p>You may cancel subscription auto-renewal at any time from Account &rarr; Billing & Payments. Upon cancellation, your auto-renewal is terminated, and you retain complete, uninterrupted access to your paid features and credits until the end of your current billing period.</p>

<h2>4. Submitting a Request</h2>
<p>To request an exception review, navigate to your Billing Dashboard and submit a request under 'Request Refund', or email <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a> with your internal payment ID, provider reference (Razorpay/Cashfree), and reason. Validated exceptions are processed to the original payment source within 5–7 business days.</p>`}
    />
  ),
});
