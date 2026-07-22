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

<h2>2. Cashfree Subscriptions & RBI e-Mandates</h2>
<p>Recurring payments for Pro (₹199/mo), Career Pro (₹499/mo), and Enterprise plans are processed via Cashfree Payment Gateway in accordance with Reserve Bank of India (RBI) e-mandate framework directives. Subscriptions auto-renew monthly until cancelled via your Billing Dashboard.</p>

<h2>3. GST & Tax Invoicing Compliance</h2>
<p>All prices listed on the Platform are in Indian Rupees (INR ₹). Transactions are subject to Goods and Services Tax (GST 18% - CGST 9% + SGST 9% or IGST 18%) under SAC Code 998431 (Online Higher Education & Training Services). Tax invoices with digital signatures are issued for all paid orders.</p>

<h2>4. Grace Period & Overdue Payments</h2>
<p>Failed mandate renewals are subject to a 3-day grace period. Accounts with unresolved payments after 3 days will automatically transition to the Free plan tier without loss of saved progress.</p>

<h2>5. Grievance Redressal Mechanism</h2>
<p>In accordance with Indian E-Commerce regulations, consumer complaints or platform grievances can be submitted to <a href="mailto:support@learnifyai.in">support@learnifyai.in</a>. All complaints will receive a ticket reference number within 48 hours and resolution within 1 month.</p>`}
    />
  ),
});
