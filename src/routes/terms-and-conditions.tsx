import { createFileRoute } from "@tanstack/react-router";
import { CustomPageContent } from "@/components/CustomPageContent";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Learnify AI" },
      {
        name: "description",
        content: "Terms and conditions of service for Learnify AI users, learners, creators, and enterprise clients.",
      },
    ],
  }),
  component: () => (
    <CustomPageContent
      pageKey="terms"
      title="Terms & Conditions"
      subtitle="Last updated: August 2026. Please read these terms carefully before using Learnify AI."
      defaultContent={`<h2>1. Acceptance of Terms</h2>
<p>By accessing or using Learnify AI ("Platform"), operated under Indian jurisdiction, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Platform.</p>

<h2>2. Platform Services</h2>
<p>Learnify AI provides AI-assisted online learning, digital courses, interactive labs, resume builders, ATS checkers, mock interview simulations, and verified certificates.</p>

<h2>3. Subscriptions & Payments</h2>
<p>All subscription payments are billed in Indian Rupees (INR ₹) inclusive of applicable 18% GST (SAC Code 998431 for online education services). Payments are processed through PCI-DSS compliant payment gateways (Razorpay & Cashfree).</p>

<h2>4. User Responsibilities</h2>
<p>Users must provide accurate account information and maintain password security. Prohibited activities include account sharing, scraping content, abusing AI prompt systems, or distributing unauthorized materials.</p>

<h2>5. Governing Law & Contact</h2>
<p>These terms are governed by the laws of India. For disputes or legal inquiries, email <a href="mailto:support@learnifyai.in">support@learnifyai.in</a>.</p>`}
    />
  ),
});
