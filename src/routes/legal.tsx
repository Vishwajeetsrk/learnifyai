import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CANONICAL_LEGAL_DOCS, CanonicalLegalDoc } from "@/lib/canonical-config";
import {
  FileText,
  Shield,
  HelpCircle,
  Clock,
  ChevronRight,
  Search,
  ExternalLink,
  BookOpen,
  Scale,
  Sparkles,
  Users,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/legal")({
  validateSearch: (s: Record<string, unknown>): { doc?: string; q?: string } => ({
    doc: s.doc as string | undefined,
    q: s.q as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Legal Center — Learnify AI" },
      {
        name: "description",
        content:
          "Official policies, terms of service, privacy practices, refund terms, and acceptable use guidelines for Learnify AI.",
      },
      { property: "og:title", content: "Legal Center — Learnify AI" },
      {
        property: "og:description",
        content: "Transparent governance, terms of service, and privacy standards at Learnify AI.",
      },
    ],
  }),
  component: LegalCenterPage,
});

const DOC_CONTENTS: Record<string, string> = {
  terms: `
<h3>1. Acceptance of Terms & Platform Access</h3>
<p>By accessing or using Learnify AI ("the Platform", "we", "our"), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, you must not access or use the Platform. These terms apply to all learners, educators, contributors, and enterprise partners.</p>

<h3>2. Learnify AI Services & Accounts</h3>
<p>Learnify AI provides online learning resources, interactive coding playgrounds, project blueprinters, career tools (Resume Builder, ATS Checker, Mock Interviews), and AI-assisted educational mentorship. Users must provide accurate, current registration information and maintain password confidentiality.</p>

<h3>3. Subscription Tiers & Billing Rules</h3>
<p>Paid subscriptions (Pro at ₹199/month, Career Pro at ₹499/month) provide access to specified features and monthly AI credit quotas as detailed on our Pricing page. Payments are securely processed via Razorpay (primary) and Cashfree (secondary) in Indian Rupees (INR ₹). Subscriptions auto-renew periodically unless cancelled via Account Settings.</p>

<h3>4. Cancellation & Access Retention</h3>
<p>When you cancel a subscription, your cancellation is scheduled immediately and auto-renewal is terminated. You will retain complete, uninterrupted access to all plan features until the end of your current paid billing period, after which your account seamlessly transitions to the Free tier without loss of progress or certificates.</p>

<h3>5. User Conduct & Acceptable Use</h3>
<p>You agree not to reverse engineer the Platform, scrape automated queries, bypass rate limits or AI quota guardrails, or submit unlawful, defamatory, or infringing content. Violations may result in immediate suspension or termination of access without liability.</p>

<h3>6. Limitation of Liability & Governing Law</h3>
<p>To the maximum extent permitted by applicable law, Learnify AI provides services on an "as is" and "as available" basis without warranties of any kind. These terms are governed by the laws of India, and disputes shall be subject to the exclusive jurisdiction of the competent courts in India.</p>
`,

  privacy: `
<h3>1. Overview & Scope</h3>
<p>Learnify AI respects your personal privacy and complies with applicable data protection principles, including the Indian Digital Personal Data Protection (DPDP) Act 2023 and Information Technology Act 2000 rules.</p>

<h3>2. Information We Collect</h3>
<ul>
  <li><strong>Account Credentials:</strong> Name, verified email address, phone number (where provided), and profile preferences.</li>
  <li><strong>Learning Telemetry:</strong> Course completion rates, playground submissions, quiz scores, and certificate verifications.</li>
  <li><strong>AI Interaction Logs:</strong> Prompt topics, token latency, and operation types necessary for credit accounting and abuse prevention.</li>
  <li><strong>Billing Records:</strong> Transaction IDs, order identifiers, and payment status returned by certified payment processors (Razorpay and Cashfree). <em>We never store card numbers, CVVs, or bank passwords on our servers.</em></li>
</ul>

<h3>3. How We Use Information</h3>
<p>We process personal data solely to administer accounts, deliver educational features, compute AI credit balances, issue verifiable completion credentials, and prevent platform abuse. We do not sell or monetize personal data to third-party ad networks.</p>

<h3>4. Data Retention & Deletion</h3>
<p>You may request data export or complete account deletion at any time by contacting support.learnifyai@gmail.com. Upon verified request, personal identifiable information is securely purged in accordance with statutory retention obligations.</p>

<h3>5. Regional Localization & Zero-GPS Detection</h3>
<p>Learnify AI does not collect or store precise GPS geolocation data, latitude, or longitude to determine your country, language, or currency. Localization relies solely on authenticated profile preferences, browser language settings, and coarse network IP-country headers. Pricing is canonically denominated in Indian Rupees (INR ₹), and multi-currency processing is handled by certified payment gateways (Razorpay and Cashfree) without persisting card credentials.</p>
`,

  "cancellation-refund": `
<h3>1. Commercial Policy</h3>
<p>Learnify AI delivers immediate digital access upon purchase, including digital tools, course materials, certificate credentials, and allocated AI credit quotas. Consequently, Learnify AI does not provide routine refunds for normal change-of-mind purchases or unutilized subscription periods.</p>

<h3>2. Exception Review Workflow</h3>
<p>We recognize that extraordinary situations occur. An administrative refund request may be submitted for formal review under the following exceptional circumstances:</p>
<ul>
  <li><strong>Duplicate Charges:</strong> Technical glitch causing multiple debits for the same transaction.</li>
  <li><strong>Unauthorized Transactions:</strong> Fraudulent card or UPI usage reported within 48 hours of charge.</li>
  <li><strong>Platform Delivery Failure:</strong> Verified inability of Learnify AI to deliver paid features due to major system outage.</li>
  <li><strong>Incorrect Billed Amount:</strong> Discrepancy between published canonical price and charged amount.</li>
</ul>

<h3>3. How to Submit a Refund Request</h3>
<p>Submit your request through Account &rarr; Billing & Payments &rarr; Request Refund, or write to <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a> including your internal payment ID, provider transaction reference, registered email, and detailed reason. All exception requests are investigated within 2 to 3 business days.</p>

<h3>4. Cancellation Mechanism</h3>
<p>You can cancel auto-renewal at any time via Account &rarr; Billing & Payments. Cancellations take effect at the conclusion of your current billing period; no partial-month fees are withheld or prematurely terminated.</p>
`,

  "digital-delivery": `
<h3>1. Immediate Electronic Delivery</h3>
<p>All products and services offered on Learnify AI are 100% digital goods and digital services. Learnify AI does not distribute physical merchandise or require physical shipping.</p>

<h3>2. Delivery Mechanisms</h3>
<ul>
  <li><strong>Subscriptions & AI Credits:</strong> Instantly provisioned to your account upon server-side verification of payment.</li>
  <li><strong>Courses & Interactive Labs:</strong> Immediately unlocked in your learning workspace upon purchase.</li>
  <li><strong>Certificates & Credentials:</strong> Available for instant verification, digital badge display, and PDF download upon course completion.</li>
  <li><strong>Digital Downloads (Templates, PDFs, Code):</strong> Delivered via secure, time-limited download links in your student dashboard.</li>
</ul>

<h3>3. Delivery Confirmation & Invoicing</h3>
<p>Upon verified transaction completion, an electronic payment receipt / invoice is generated and dispatched to your registered email address with transaction reference numbers.</p>
`,

  "cookie-policy": `
<h3>1. Use of Cookies</h3>
<p>Learnify AI uses essential session cookies and local storage tokens strictly necessary to maintain authenticated login sessions, preserve dark/light theme preferences, and track contextual policy acknowledgements.</p>

<h3>2. Essential vs Analytics Cookies</h3>
<ul>
  <li><strong>Essential Cookies:</strong> Required for secure session persistence, CSRF security, and route authorization.</li>
  <li><strong>Analytics Telemetry:</strong> Anonymized performance telemetry used to optimize course loading speeds and UI responsiveness.</li>
</ul>
<p>You can adjust cookie settings via browser preferences, though disabling essential cookies will prevent platform sign-in.</p>
`,

  "acceptable-use": `
<h3>1. Prohibited Activities</h3>
<p>Users must not engage in any activity that harms, compromises, or disrupts Learnify AI systems, including:</p>
<ul>
  <li>Attempting unauthorized access to user accounts, admin panels, or cloud databases.</li>
  <li>Bypassing AI token limits, rate limiters, or subscription guardrails.</li>
  <li>Deploying automated scrapers, crawlers, or harvesting scripts without explicit authorization.</li>
  <li>Uploading malicious code, viruses, or harmful software scripts to coding playgrounds or community threads.</li>
</ul>

<h3>2. Enforcement & Sanctions</h3>
<p>Accounts found violating the Acceptable Use Policy are subject to immediate suspension, termination of credentials, and forfeiture of remaining balances without notice.</p>
`,

  "intellectual-property": `
<h3>1. Learnify AI Platform Rights</h3>
<p>All curriculum architecture, lesson materials, video demonstrations, UI designs, code blueprints, and branding assets are the proprietary intellectual property of Learnify AI.</p>

<h3>2. User-Created Code & Projects</h3>
<p>Learners retain full ownership of software code, project solutions, and personal resumes created independently using Learnify AI tools. By sharing projects publicly in the Showcase or Community, you grant Learnify AI a non-exclusive license to host and display your project.</p>

<h3>3. Copyright Infringement Claims</h3>
<p>If you believe content on Learnify AI infringes your copyright, submit a formal notice to <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a> with evidence of ownership and specific URL references.</p>
`,

  "community-guidelines": `
<h3>1. Core Principles</h3>
<p>The Learnify AI community is a collaborative environment for engineers, students, career switchers, and mentors. We expect all participants to uphold values of mutual respect, inclusivity, constructive feedback, and academic integrity.</p>

<h3>2. Zero Tolerance Violations</h3>
<p>Harassment, discriminatory speech, hate speech, spamming commercial promotions, plagiarism, and sharing pirated course solutions are strictly prohibited.</p>
`,

  "ai-disclaimer": `
<h3>1. Probabilistic Nature of AI</h3>
<p>Learnify AI integrates generative artificial intelligence models to provide conversational tutoring, code analysis, resume tailoring, and interview simulations. Generative AI outputs are probabilistic and may occasionally contain factual errors, outdated library syntax, or logical flaws.</p>

<h3>2. Human Verification Recommended</h3>
<p>AI suggestions are intended as supplementary learning tools and do not substitute for official technical documentation or professional career counsel. Learners should review and verify AI-generated resumes, code snippets, and career roadmaps prior to submission to employers or academic institutions.</p>
`,

  grievance: `
<h3>1. Designated Support & Grievance Contact</h3>
<p>In accordance with Indian Information Technology and E-Commerce consumer guidelines, Learnify AI provides designated channels for grievance escalation and dispute resolution:</p>
<ul>
  <li><strong>Email:</strong> <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a></li>
  <li><strong>Response Window:</strong> Acknowledged with ticket number within 48 business hours.</li>
  <li><strong>Resolution Target:</strong> Maximum of 30 calendar days for consumer grievances.</li>
</ul>

<h3>2. Dispute Escalation Flow</h3>
<p>Please include your account email, order ID, detailed description of the incident, and relevant screenshots to accelerate ticket resolution.</p>
`,

  "student-parent-notice": `
<h3>1. Minor & Educational Protections</h3>
<p>Learnify AI welcomes learners of diverse ages, including secondary school and collegiate students. For learners under the age of 18, parental or legal guardian consent is advised prior to purchasing paid subscription tiers or publishing personal contact details in public discussion boards.</p>

<h3>2. Safe Educational Environment</h3>
<p>We do not serve behavioral commercial ads to minor learners, nor do we sell student academic performance profiles to external third parties.</p>
`,
};

function LegalCenterPage() {
  const { doc, q } = useSearch({ from: "/legal" as any });
  const [activeSlug, setActiveSlug] = useState<string>(doc || "terms");
  const [searchQuery, setSearchQuery] = useState<string>(q || "");

  const activeDoc = useMemo(() => {
    return CANONICAL_LEGAL_DOCS.find((d) => d.slug === activeSlug) || CANONICAL_LEGAL_DOCS[0];
  }, [activeSlug]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return CANONICAL_LEGAL_DOCS;
    const query = searchQuery.toLowerCase();
    return CANONICAL_LEGAL_DOCS.filter(
      (d) =>
        d.title.toLowerCase().includes(query) ||
        d.summary.toLowerCase().includes(query) ||
        d.slug.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Header Banner */}
        <section className="border-b bg-muted/20 py-12 md:py-16">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-3">
                  <Shield className="h-3.5 w-3.5" />
                  Governance & Compliance
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Legal Center</h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-xl">
                  Canonical legal documents, commercial policies, data privacy terms, and acceptable use standards for Learnify AI.
                </p>
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Legal Browser Grid */}
        <section className="container mx-auto px-6 py-10 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                Published Policies ({filteredDocs.length})
              </h2>
              <div className="space-y-1">
                {filteredDocs.map((docItem) => {
                  const isActive = activeSlug === docItem.slug;
                  return (
                    <button
                      key={docItem.slug}
                      onClick={() => setActiveSlug(docItem.slug)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 flex items-start justify-between gap-2 ${
                        isActive
                          ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                          : "hover:bg-muted text-foreground/80"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm leading-tight">{docItem.title}</div>
                        <div
                          className={`text-[11px] line-clamp-1 ${
                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          v{docItem.version} &middot; {docItem.lastUpdated}
                        </div>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 mt-0.5 ${
                          isActive ? "text-primary-foreground" : "text-muted-foreground/50"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl border bg-card/50 text-xs text-muted-foreground space-y-2 mt-6">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Questions or Support?
                </div>
                <p>
                  Need clarification regarding any policy or billing term? Our support team is available at{" "}
                  <a href="mailto:support.learnifyai@gmail.com" className="text-primary underline">
                    support.learnifyai@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Document Content View */}
            <div className="lg:col-span-8 bg-card border rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
              <div className="border-b pb-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{activeDoc.title}</h2>
                  <Badge variant="outline" className="text-xs px-2.5 py-0.5">
                    Version {activeDoc.version}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{activeDoc.summary}</p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Effective: {activeDoc.effectiveDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Last Updated: {activeDoc.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Render Document HTML Content */}
              <div
                className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-foreground/90 leading-relaxed [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:text-sm [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:text-sm [&>a]:text-primary [&>a]:underline"
                dangerouslySetInnerHTML={{
                  __html: DOC_CONTENTS[activeDoc.slug] || "<p>Policy content is being refreshed. Please check back shortly.</p>",
                }}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
