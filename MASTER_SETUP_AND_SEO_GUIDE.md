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
   > _Why? Prevents unexpected domain expiration, which causes permanent loss of search engine ranking and domain authority._

### 1.2 WHOIS Domain Privacy Protection

1. In **Domain Settings**, scroll to **Domain Privacy Protection**.
2. Ensure **Full Domain Privacy** is active.
   > _Why? Hides personal contact details (phone number, personal address, email) from public WHOIS databases to block spam and domain hijacking._

### 1.3 Verify ICANN Registrant Email

1. Open your personal email inbox (`vishwajeetsrk@gmail.com`).
2. Search for a confirmation email from GoDaddy titled: `"Action Required: Verify your email address"`.
3. Click the verification link inside the email.
   > _Warning: ICANN automatically suspends unverified domain names after 15 days of purchase._

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

| Type      | Name  | Target / Value                    | TTL  | Proxy Status |
| :-------- | :---- | :-------------------------------- | :--- | :----------- |
| **A**     | `@`   | `76.76.21.21` (Vercel Anycast IP) | Auto | 🟠 Proxied   |
| **CNAME** | `www` | `cname.vercel-dns.com`            | Auto | 🟠 Proxied   |

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

## 4. Professional Business Email (`@learnifyai.in`) — 100% Free Forever

The best, 100% free solution for custom domain email is **Cloudflare Email Routing**. It has **zero cost, zero expiration, and no credit card required**.

Incoming emails to your custom addresses:

- `support@learnifyai.in`
- `hello@learnifyai.in`
- `admin@learnifyai.in`
- `careers@learnifyai.in`

will automatically forward straight to your personal Gmail inbox (`vishwajeetsrk@gmail.com`).

---

### 🚀 100% Free Setup via Cloudflare Email Routing

Direct Link: [Cloudflare Email Routing Dashboard](https://dash.cloudflare.com/?to=/:account/:zone/email/routing/routes)

#### Step 1: Enable Email Routing in Cloudflare

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com/) -> Select `learnifyai.in`.
2. In the left navigation, click **Email** -> **Email Routing**.
3. Click **Get Started** -> Click **Enable Email Routing**.

#### Step 2: Add DNS Records Automatically

1. Cloudflare will prompt you to add 4 DNS records (MX & SPF records).
2. Click **Add records automatically** (Cloudflare adds `isaac.mx.cloudflare.net`, `linda.mx.cloudflare.net`, `amir.mx.cloudflare.net`, and SPF `v=spf1 include:_spf.cloudflare.com ~all`).

#### Step 3: Create Custom Email Routing Aliases

Go to **Email Routing** -> **Routing Rules** -> Click **Create address**:

| Custom Address             | Action  | Destination Address       |
| :------------------------- | :------ | :------------------------ |
| `support` `@learnifyai.in` | Send to | `vishwajeetsrk@gmail.com` |
| `hello` `@learnifyai.in`   | Send to | `vishwajeetsrk@gmail.com` |
| `admin` `@learnifyai.in`   | Send to | `vishwajeetsrk@gmail.com` |
| `careers` `@learnifyai.in` | Send to | `vishwajeetsrk@gmail.com` |

#### Step 4: Verify Destination Email

1. Check your Gmail inbox (`vishwajeetsrk@gmail.com`) for a verification email from Cloudflare.
2. Click **Verify Email Address**.

---

### 📩 How to Reply as `support@learnifyai.in` from Gmail (100% Free):

#### STEP 1: Generate a Google App Password

1. Enable **2-Step Verification** on your Google Account:
   - Open [Google Security Settings](https://myaccount.google.com/security).
   - Ensure **2-Step Verification** is turned **ON**.
2. Create an App Password:
   - Open [Google App Passwords](https://myaccount.google.com/apppasswords).
   - Type `Learnify Support Email` under App Name and click **Create**.
   - Copy the 16-character generated password (e.g. `axek lfjb twih xaqr`).

#### STEP 2: Open Gmail Settings

1. Open [Gmail](https://mail.google.com/).
2. Click the **Gear Icon ⚙️** (top right) -> Select **See all settings**.
3. Click the **Accounts and Import** tab at the top.
4. Scroll down to **Send mail as:** -> Click **Add another email address**.

#### STEP 3: Enter Email & SMTP Details

In the pop-up window:

- **Window 1 (Email Details)**:
  - **Name**: `Learnify AI Support` _(or `Learnify AI`)_
  - **Email Address**: `support@learnifyai.in`
  - Keep **"Treat as an alias"** checked ✅ -> Click **Next Step >>**.
- **Window 2 (Server Credentials)**:
  - **SMTP Server**: `smtp.gmail.com`
  - **Port**: `587`
  - **Username**: `vishwajeetsrk@gmail.com`
  - **Password**: Paste the 16-character App Password generated in Step 1.
  - Select **Secured connection using TLS (recommended)** -> Click **Add Account**.

#### STEP 4: Confirm Verification Link

1. Check your Gmail Inbox (`vishwajeetsrk@gmail.com`) for the email titled: `"Gmail Confirmation - Send Mail as support@learnifyai.in"`.
2. Click the confirmation link inside the email.
3. You will see: **"Confirmation Success! The Gmail user may now send mail as support@learnifyai.in."** 🎉

#### 🌟 How to Use It:

Whenever composing or replying to emails in Gmail, click the **From:** dropdown line and select **`support@learnifyai.in`**! Recipients will see your official business domain email with zero costs.

---

## 5. Business Essentials & Compliance (India / Cashfree)

Learnify AI includes full Indian payment gateway (Cashfree) & GST compliance pages built into the frontend:

- 🔒 **Privacy Policy**: [https://www.learnifyai.in/privacy](https://www.learnifyai.in/privacy)
- 📜 **Terms & Conditions**: [https://www.learnifyai.in/terms](https://www.learnifyai.in/terms)
- 💳 **Refund Policy**: [https://www.learnifyai.in/refund-policy](https://www.learnifyai.in/refund-policy)
- 📞 **Contact Us**: [https://www.learnifyai.in/contact](https://www.learnifyai.in/contact)
- 🍪 **Cookie Banner**: Built directly into `src/routes/__root.tsx` (`<CookieConsent />`).

### 5.3 Cashfree Merchant Domain Whitelisting (Crucial Step)

Direct Dashboard Link: [Cashfree Merchant Whitelisting](https://merchant.cashfree.com/merchants/pg/whitelisting) (or shortcut: [https://bit.ly/3Xkt3RJ](https://bit.ly/3Xkt3RJ))

If Cashfree payment fails with error `"https://www.learnifyai.in/ is not enabled or approved. Please whitelist your domain..."`:

1. Log into your [Cashfree Merchant Dashboard](https://merchant.cashfree.com/).
2. In the left navigation, go to **Developers** -> **Whitelisting** (or open: [https://merchant.cashfree.com/merchants/pg/whitelisting](https://merchant.cashfree.com/merchants/pg/whitelisting)).
3. Click **+ Add Domain / Package** (or Add Web Domain).
4. Enter your production domains:
   - `https://www.learnifyai.in/`
   - `https://learnifyai.in/`
   - `https://learnifyaitool.vercel.app/`
5. Click **Submit**. Cashfree will verify and approve domain whitelisting automatically in 5–15 minutes.

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

## 8. Custom Google OAuth 2.0 Client & Supabase Branding Setup

To display **Learnify AI** and your official logo on the Google Login prompt instead of raw Supabase URLs:

1. Open [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials).
2. Under **OAuth 2.0 Client IDs** -> Create Web Application:
   - Name: `Learnify AI`
   - **Authorized JavaScript origins**:
     - `https://www.learnifyai.in`
     - `https://learnifyai.in`
     - `https://gnvsqwyexjuuwkjibxrr.supabase.co`
     - `https://learnifyaitool.vercel.app`
   - **Authorized redirect URIs**:
     - `https://gnvsqwyexjuuwkjibxrr.supabase.co/auth/v1/callback`
     - `https://www.learnifyai.in`
     - `https://learnifyai.in`
3. In **OAuth Consent Screen -> Scopes**, verify only **Non-sensitive Scopes** are selected:
   - `.../auth/userinfo.email` (Google Account email address)
   - `.../auth/userinfo.profile` (Personal info and profile photo)
   - `openid` (Personal info association)
   - _(No sensitive or restricted scopes required — zero verification fees)_
4. Paste generated credentials into [Supabase Auth Providers](https://supabase.com/dashboard/project/gnvsqwyexjuuwkjibxrr/auth/providers) -> **Google**:
   - Client ID: `<YOUR_GOOGLE_CLIENT_ID>` (from Google Cloud Console)
   - Client Secret: `<YOUR_GOOGLE_CLIENT_SECRET>` (from Google Cloud Console)
5. Click **Save**.

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

_Updated & Maintained by [Learnify AI Team](https://www.learnifyai.in/)_
