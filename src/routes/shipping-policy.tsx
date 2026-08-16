import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — Learnify AI" },
      {
        name: "description",
        content: "Digital delivery policy for Learnify AI courses, subscriptions, and AI tools.",
      },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="shipping"
      title="Shipping & Delivery Policy"
      subtitle="Last updated: August 2026. Learnify AI provides 100% digital software & course delivery."
      defaultContent={`<h2>1. Digital Fulfillment & Immediate Access</h2>
<p>Learnify AI operates exclusively as an online educational software platform (SaaS). All course access, AI credits, and digital certificates are provisioned electronically immediately upon successful payment.</p>
<h2>2. No Physical Delivery</h2>
<p>There are no physical goods shipped. Access details and official tax invoices are delivered instantly to your registered email and Learnify AI account dashboard.</p>
<h2>3. Contact Support</h2>
<p>For support or delivery assistance, email <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a>.</p>`}
    />
  ),
});
