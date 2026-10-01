/**
 * Canonical text content for platform policy documents in Learnify AI Legal Center.
 * Stored centrally so both public /legal route and Admin Content Manager can access them.
 */

export const DOC_CONTENTS: Record<string, string> = {
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
<h3>1. General Policy</h3>
<p>Learnify AI provides digital subscriptions, online courses, AI-powered tools, downloadable resources, templates, e-books, prompts, PDFs, designs and other digital products. <strong>All purchases are final and generally non-refundable</strong> once digital access, subscription benefits or downloadable content has been provided, except where a refund, reversal or other remedy is required by applicable law or where Learnify AI approves an exception described below.</p>

<h3>2. Subscriptions</h3>
<p>Current tiers: Free (₹0), Pro (₹199/month) and Career Pro (₹499/month), with student benefits as displayed at checkout and subject to eligibility. Subscriptions renew automatically only where the customer has authorized recurring payments. You can cancel auto-renewal through Account Settings; after cancellation, paid access remains available until the end of the current paid billing period unless otherwise stated at checkout or required by law. Cancellation does not automatically trigger a refund for the current billing period.</p>

<h3>3. Digital Products</h3>
<p>Purchases of downloadable PDFs, e-books, prompts, resume templates, design assets, digital guides, software downloads and other digital products are generally non-refundable once delivered or made available for download. Please review the product description, compatibility, included features and price before purchasing.</p>

<h3>4. Payment Errors and Exceptions</h3>
<p>Learnify AI will investigate and provide an appropriate remedy for:</p>
<ul>
  <li><strong>Duplicate charges</strong> for the same purchase.</li>
  <li><strong>Successful payments where access was not provided.</strong></li>
  <li><strong>Incorrect amounts charged</strong> because of a verified payment-processing error.</li>
  <li><strong>Unauthorized transactions</strong>, subject to verification and applicable payment-provider procedures.</li>
  <li><strong>Refunds, reversals or remedies required by applicable law.</strong></li>
</ul>
<p>Where appropriate, Learnify AI may restore access, correct the account, provide replacement delivery or initiate a payment reversal through the relevant payment provider.</p>

<h3>5. Failed and Pending Payments</h3>
<p>A failed or pending payment does not automatically create an active paid subscription. Access to paid features is granted only after the payment provider confirms a successful transaction, subject to reconciliation and fraud checks. Pending transactions are checked against payment-provider records, and customers are not charged twice for the same order.</p>

<h3>6. Subscription Cancellation</h3>
<p>Customers may cancel future recurring payments through Account Settings or the applicable payment-provider mechanism. Cancellation stops future renewals once the cancellation is successfully processed. Confirmation, the cancellation date and the remaining access period are visible in Account &rarr; Billing &amp; Payments.</p>

<h3>7. Contact and Complaints</h3>
<p>For payment, delivery, cancellation or access issues, contact Learnify AI through <a href="mailto:support.learnifyai@gmail.com">support.learnifyai@gmail.com</a> or the official support and grievance channels displayed on the website. Please provide the order ID, transaction reference, registered email address and relevant payment details. Never share passwords, OTPs or full card details.</p>

<h3>8. Legal Compliance</h3>
<p>This policy does not remove or restrict any non-waivable rights or remedies available to consumers under applicable Indian law. It applies consistently to Razorpay and Cashfree transactions and is reviewed and updated when relevant legal or payment-provider requirements change.</p>
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
