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
      subtitle="Last updated: July 2026. Governed under the laws of India and Consumer Protection (E-Commerce) Rules 2020."
      defaultContent={`<h2>1. Acceptance of Terms & Governing Law</h2>
<p>By accessing Learnify AI ("the Platform"), you agree to be bound by these Terms of Service in compliance with the Consumer Protection (E-Commerce) Rules 2020 and Information Technology Act 2000 of India. Disputes shall be subject to the exclusive jurisdiction of the Courts in India.</p>

<h2>2. Subscriptions & Payment Processing</h2>
<p>Recurring and one-time payments for Pro (₹199/mo), Career Pro (₹499/mo), and Enterprise plans are securely processed via Razorpay (primary payment gateway) and Cashfree (secondary payment gateway) in accordance with applicable Reserve Bank of India (RBI) directives. Subscriptions auto-renew periodically until cancelled via your Billing & Payments Dashboard.</p>

<h2>3. Pricing & Currency</h2>
<p>All prices listed on the Platform are in Indian Rupees (INR ₹). In accordance with Learnify AI commercial policy, invoices and payment receipts are issued electronically immediately upon successful transaction completion.</p>

<h2>4. Grace Period & Overdue Payments</h2>
<p>Failed renewal attempts are subject to a 3-day grace period. Accounts with unresolved payments after the grace period transition to the Free tier without loss of saved progress or earned certificates.</p>

<h2>5. Grievance Redressal & Support</h2>
<p>In accordance with Indian consumer protection and e-commerce rules, questions, dispute notices, or platform grievances can be submitted to <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a>. Detailed policy disclosures are maintained in our <a href="/legal">Legal Center</a>.</p>`}
    />
  ),
});
