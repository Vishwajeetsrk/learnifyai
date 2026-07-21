# 🚀 Complete Master Setup & Google Search Indexing Guide for `learnifyai.in`

This document provides a comprehensive, step-by-step guide to setting up domain management, DNS security, hosting, professional business emails, legal compliance, analytics, and immediate Google Search indexing for **[Learnify AI](https://www.learnifyai.in/)**.

---

## 📑 Table of Contents
1. [Domain Setup (GoDaddy)](#1-domain-setup-godaddy)
2. [DNS & Security Setup (Cloudflare)](#2-dns--security-setup-cloudflare)
3. [Connect to Hosting (Vercel)](#3-connect-to-hosting-vercel)
4. [Professional Business Email (@learnifyai.in)](#4-professional-business-email-learnifyaiin)
5. [Business Essentials & Compliance (India / Cashfree)](#5-business-essentials--compliance-india--cashfree)
6. [Analytics & Fixing Google Search Indexing](#6-analytics--fixing-google-search-indexing)
7. [Local Testing & Performance Commands](#7-local-testing--performance-commands)

---

## 1. Domain Setup (GoDaddy)

Direct Dashboard Link: [GoDaddy Domain Control Center](https://dcc.godaddy.com/)

### 1.1 Enable Auto-Renew
1. Log into your [GoDaddy Domain Control Center](https://dcc.godaddy.com/).
2. Select **`learnifyai.in`** to open **Domain Settings**.
3. Locate **Auto-Renew** and toggle the switch to **ON**.
   > *Why? Prevents unexpected domain expiration, which causes permanent loss of search engine ranking and domain authority.*

### 1.2 WHOIS Domain Privacy Protection
1. In **Domain Settings**, scroll to **Domain Privacy Protection**.
2. Ensure **Full Domain Privacy** is active.
   > *Why? Hides personal contact details (phone number, personal address, email) from public WHOIS databases to block spam and domain hijacking.*

### 1.3 Verify ICANN Registrant Email
1. Open your personal email inbox (`vishwajeetsrk@gmail.com`).
2. Search for a confirmation email from GoDaddy titled: `"Action Required: Verify your email address"`.
3. Click the verification link inside the email.
   > *Warning: ICANN automatically suspends unverified domain names after 15 days of purchase.*

---

## 2. DNS & Security Setup (Cloudflare)

Direct Dashboard Link: [Cloudflare Dashboard](https://dash.cloudflare.com/)

### 2.1 Add Domain to Cloudflare
1. Create or log into your account at [Cloudflare.com](https://dash.cloudflare.com/).
2. Click **Add a Site** (top right) -> Enter `learnifyai.in`.
3. Select the **Free Plan** ($0/mo) and click **Continue**.

### 2.2 Update Nameservers in GoDaddy
1. Cloudflare will scan existing DNS records and display 2 custom nameservers, for example:
   - `aria.ns.cloudflare.com`
   - `todd.ns.cloudflare.com`
2. Open [GoDaddy Domain DNS Settings](https://dcc.godaddy.com/manage/dns).
3. Click **Nameservers** -> **Change Nameservers** -> Choose **I'll use my own nameservers**.
4. Paste the 2 Cloudflare nameservers and click **Save**.

### 2.3 Configure Cloudflare DNS Records
In Cloudflare Dashboard -> Go to **DNS** -> **Records** -> Add the following:

| Type | Name | Target / Value | TTL | Proxy Status |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` (Vercel Anycast IP) | Auto | 🟠 Proxied |
| **CNAME** | `www` | `cname.vercel-dns.com` | Auto | 🟠 Proxied |

### 2.4 SSL/TLS Encryption & DNSSEC
1. In Cloudflare -> Go to **SSL/TLS** -> **Overview** -> Set encryption mode to **Full (strict)**.
2. Go to **SSL/TLS** -> **Edge Certificates** -> Toggle **Always Use HTTPS** to **ON**.
3. Go to **DNS** -> **Settings** -> Scroll to **DNSSEC** -> Click **Enable DNSSEC**.
4. Copy the generated **DS Record** fields and add them into GoDaddy's DNSSEC configuration page.

### 2.5 Speed & Optimization Rules
1. In Cloudflare -> Go to **Speed** -> **Optimization**.
2. Enable **Brotli Compression** (`ON`).
3. Under **Auto Minify**, check **HTML**, **CSS**, and **JS**.

---

## 3. Connect to Hosting (Vercel)

Direct Dashboard Link: [Vercel Project Settings](https://vercel.com/dashboard)

1. Log into your [Vercel Dashboard](https://vercel.com/dashboard) -> Click on the `learnifyai` project.
2. Go to **Settings** -> **Domains**.
3. Add the domains:
   - Primary domain: `https://www.learnifyai.in`
   - Secondary domain: `https://learnifyai.in` -> Set redirect to `www.learnifyai.in` with HTTP Status `301 Moved Permanently`.
4. Confirm both domain entries show a green status badge: `Valid Configuration`.

---

## 4. Professional Business Email (`@learnifyai.in`)

Create professional addresses:
- `support@learnifyai.in`
- `hello@learnifyai.in`
- `admin@learnifyai.in`
- `careers@learnifyai.in`

### Option A: Free Forever Setup via Zoho Mail (Recommended)
Direct Link: [Zoho Mail Forever Free Signup](https://www.zoho.com/mail/zohomail-pricing.html)

1. Register at [Zoho Mail Forever Free Plan](https://www.zoho.com/mail/zohomail-pricing.html) (Free for up to 5 users, 5GB/user).
2. Enter your domain: `learnifyai.in`.
3. Add the required MX & TXT verification records in Cloudflare DNS:

| Record Type | Name | Value / Destination | Priority |
| :--- | :--- | :--- | :--- |
| **MX** | `@` | `mx.zoho.in` | `10` |
| **MX** | `@` | `mx2.zoho.in` | `20` |
| **MX** | `@` | `mx3.zoho.in` | `50` |
| **TXT (SPF)** | `@` | `v=spf1 include:zoho.in ~all` | Auto |
| **TXT (DKIM)** | `zoho._domainkey` | *(Copy unique key generated inside Zoho Admin)* | Auto |

### Option B: Google Workspace (Paid ₹136/user/month)
Direct Link: [Google Workspace Signup](https://workspace.google.com/)
- Register at [Google Workspace](https://workspace.google.com/) to link Gmail directly to `support@learnifyai.in`.

---

## 5. Business Essentials & Compliance (India / Cashfree)

Learnify AI includes full Indian payment gateway (Cashfree) & GST compliance pages built into the frontend:

- 🔒 **Privacy Policy**: [https://www.learnifyai.in/privacy](https://www.learnifyai.in/privacy)
- 📜 **Terms & Conditions**: [https://www.learnifyai.in/terms](https://www.learnifyai.in/terms)
- 💳 **Refund Policy**: [https://www.learnifyai.in/refund-policy](https://www.learnifyai.in/refund-policy)
- 📞 **Contact Us**: [https://www.learnifyai.in/contact](https://www.learnifyai.in/contact)
- 🍪 **Cookie Banner**: Built directly into `src/routes/__root.tsx` (`<CookieConsent />`).

---

## 6. Analytics & Fixing Google Search Indexing

### Why "Learnify AI" Is Not Showing on Google Search Yet:
1. **Google Crawler Lag**: New domains require 3 to 14 days after sitemap submission for initial crawling.
2. **Missing Manual Indexing Request**: Google Search Console needs an explicit indexing request to place the site in the immediate crawl queue.

### 🚀 How to Index `learnifyai.in` on Google IMMEDIATELY:

#### Step 1: Verify Google Search Console Ownership
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** -> Select **URL prefix** -> Enter `https://www.learnifyai.in`.
3. Select **HTML Tag** verification.
4. Your site ALREADY contains the HTML verification tag inside [`src/routes/__root.tsx`](file:///c:/Users/vishw/Music/Learnify%20AI/src/routes/__root.tsx):
   ```html
   <meta name="google-site-verification" content="Db6NEdI6bZznQUQMkJ78jEPpWnrob9JXegQ99O7s3z0" />
   ```
5. Click **Verify** (Google will instantly verify ownership).

#### Step 2: Submit XML Sitemap
1. In Google Search Console left menu -> Click **Sitemaps**.
2. Under "Add a new sitemap", type `sitemap.xml` (Full URL: `https://www.learnifyai.in/sitemap.xml`).
3. Click **Submit**.

#### Step 3: Trigger Immediate Priority Crawling (URL Inspection)
1. At the top search bar in Google Search Console, paste: `https://www.learnifyai.in/`.
2. Click **Test Live URL** (verifies Googlebot can read the page).
3. Click **Request Indexing**.
4. Repeat this URL Inspection step for these key landing pages:
   - `https://www.learnifyai.in/pricing`
   - `https://www.learnifyai.in/courses`
   - `https://www.learnifyai.in/features`
   - `https://www.learnifyai.in/creators`
5. This places your site in Google's high-priority crawl queue (usually indexed within 24–48 hours).

#### Step 4: SEO Metadata & Schema.org Upgrades Applied
The codebase has been updated with:
- `<link rel="canonical" href="https://www.learnifyai.in" />`
- Search engine keywords (`Learnify AI`, `AI Learning OS`, `Career OS`, `Resume Builder`, `ATS Checker`)
- JSON-LD Structured Data for `SoftwareApplication`, `EducationalOrganization`, and `WebSite`.

---

## 7. Local Testing & Performance Commands

Run these terminal commands locally to verify TypeScript types, production builds, and fast performance before deploying updates:

```bash
# 1. Typecheck TypeScript (Zero errors required)
pnpm exec tsc --noEmit --skipLibCheck

# 2. Production Build (Validates Vite & Nitro SSR bundles)
pnpm run build

# 3. Preview Production Build Locally
pnpm run preview
```

---

*Updated & Maintained by [Learnify AI Team](https://www.learnifyai.in/)*
