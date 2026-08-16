import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/shipping-and-exchange")({
  head: () => ({
    meta: [
      { title: "Shipping & Exchange Policy — Learnify AI" },
      {
        name: "description",
        content:
          "Digital delivery and fulfillment policy for Learnify AI courses, subscriptions, AI credits, and digital certificates.",
      },
      { property: "og:title", content: "Shipping & Exchange Policy — Learnify AI" },
      {
        property: "og:description",
        content:
          "Instant digital fulfillment policy for Learnify AI online learning products and services.",
      },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="shipping"
      title="Shipping & Exchange Policy"
      subtitle="Last updated: August 2026. Learnify AI provides online digital education software, courses, and AI services."
      defaultContent={`<h2>1. Digital Fulfillment & Immediate Access</h2>
<p>Learnify AI operates exclusively as an online educational software platform (SaaS). We do not ship physical products, hardware, books, or material goods. All offerings—including course enrollments, AI tutoring credits, resume builder tools, and verified digital certificates—are delivered electronically.</p>

<h2>2. Delivery Timeline</h2>
<ul>
  <li><strong>Instant Access:</strong> Upon successful completion of payment via Razorpay or Cashfree, your account is upgraded immediately and digital access to purchased courses, features, or AI credits is enabled without delay.</li>
  <li><strong>Confirmation Email:</strong> A payment receipt and subscription confirmation email containing account access instructions and invoice details will be dispatched to your registered email address within 5 minutes of transaction completion.</li>
</ul>

<h2>3. Digital Product Exchanges</h2>
<p>Because all services are provisioned digitally upon purchase, traditional physical product exchanges do not apply. However, if you accidentally purchased the wrong plan or tier (e.g., selected Monthly Pro instead of Yearly Career Pro), you may request a plan adjustment within 7 days of purchase by contacting <a href="mailto:support@learnifyai.in">support@learnifyai.in</a>. Our support team will gladly upgrade or migrate your account tier accordingly.</p>

<h2>4. Service Disruptions & Non-Delivery Resolution</h2>
<p>If you experience any delay in digital feature activation or credit provisioning after a successful payment:
  <ol>
    <li>Check your dashboard at <a href="/dashboard">https://www.learnifyai.in/dashboard</a> after logging out and back in.</li>
    <li>If features remain locked, email your Razorpay/Cashfree Payment ID to <a href="mailto:support@learnifyai.in">support@learnifyai.in</a> or submit a ticket via our <a href="/contact">Contact Page</a>. Our technical team resolves all access issues within 24 hours.</li>
  </ol>
</p>

<h2>5. Contact Information</h2>
<p>For any queries regarding digital delivery, account provisioning, or plan exchange requests, please reach out to us:
  <ul>
    <li><strong>Email:</strong> <a href="mailto:support@learnifyai.in">support@learnifyai.in</a> / <a href="mailto:vishwajeetsrk@gmail.com">vishwajeetsrk@gmail.com</a></li>
    <li><strong>Address:</strong> Learnify AI EdTech, India</li>
    <li><strong>Support Hours:</strong> Monday – Saturday, 9:00 AM – 7:00 PM IST</li>
  </ul>
</p>`}
    />
  ),
});
