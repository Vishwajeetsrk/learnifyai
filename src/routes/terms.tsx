import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Learnify AI" },
      {
        name: "description",
        content: "Learnify AI Terms of Service — rights, billing rules, GST compliance, and user responsibilities.",
      },
      { property: "og:title", content: "Terms of Service — Learnify AI" },
      {
        property: "og:description",
        content: "The terms governing your use of the Learnify AI learning operating system.",
      },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="terms"
      title="Terms of Service"
      subtitle="Last updated: August 2026. Governed under the laws of India and Consumer Protection (E-Commerce) Rules 2020."
      defaultContent={`<h2>1. Acceptance of Terms & Governing Law</h2>
<p>By accessing or using Learnify AI ("the Platform"), you agree to be bound by these Terms of Service in full compliance with the Consumer Protection (E-Commerce) Rules 2020 and Information Technology Act 2000 of India. Any legal proceedings or disputes shall be subject to the exclusive jurisdiction of the Courts in India.</p>

<h2>2. Cashfree Subscriptions & RBI e-Mandates</h2>
<p>Subscriptions for Pro (₹199/mo), Career Pro (₹499/mo), and Enterprise tiers are billed in Indian Rupees (INR ₹) via Cashfree Payment Gateway in adherence to Reserve Bank of India (RBI) e-mandate directives. Subscriptions auto-renew monthly until cancelled by the user via the Billing Dashboard.</p>

<h2>3. GST & Tax Invoicing Compliance</h2>
<p>All prices listed on the Platform are subject to Goods and Services Tax (GST 18% — CGST 9% + SGST 9% for intra-state transactions, or IGST 18% for inter-state transactions) under SAC Code 998431 (Online Higher Education & Technical Training Services). Tax invoices bearing our digital signature and company GSTIN are automatically issued for every transaction and accessible in your Billing Dashboard.</p>

<h2>4. Grace Period & Subscription Cancellation</h2>
<p>If a recurring subscription mandate fails, a 3-day grace period is granted to update payment methods. If payment is not resolved within 3 days, the account automatically transitions to the Free plan tier without losing saved course progress, code projects, or earned badges.</p>

<h2>5. Intellectual Property & Course Content</h2>
<p>All course materials, visual learning concept graphs, interactive code exercises, and AI tutors on Learnify AI are protected by intellectual property laws. Creators retain ownership of original course content published via the Creator Studio while granting Learnify AI a worldwide license to host and distribute the materials.</p>

<h2>6. Grievance Redressal Mechanism</h2>
<p>In accordance with Indian E-Commerce regulations, consumer complaints or platform grievances can be submitted to our Nodal Officer at <a href="mailto:support@learnifyai.in">support@learnifyai.in</a> or <a href="mailto:vishwajeetsrk@gmail.com">vishwajeetsrk@gmail.com</a>. Complaints receive a ticket reference number within 48 hours and complete resolution within 30 days.</p>`}
    />
  ),
});
