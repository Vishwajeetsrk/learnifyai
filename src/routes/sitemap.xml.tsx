/**
 * Dynamic Sitemap — /sitemap/xml
 *
 * Generates a valid XML sitemap including:
 * - Public static routes
 * - Published blog posts (Supabase)
 * - Published courses (Supabase)
 * - Canonical roadmap slugs
 * - Certificate verification pages (Supabase)
 *
 * Cache-Control: 1h CDN, 10min revalidation
 */
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://www.learnifyai.in";

const PUBLIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/features", changefreq: "weekly", priority: "0.9" },
  { path: "/pricing", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "daily", priority: "0.9" },
  { path: "/login", changefreq: "monthly", priority: "0.7" },
  { path: "/signup", changefreq: "monthly", priority: "0.7" },
  { path: "/courses", changefreq: "daily", priority: "0.9" },
  { path: "/privacy", changefreq: "monthly", priority: "0.5" },
  { path: "/terms", changefreq: "monthly", priority: "0.5" },
  { path: "/refund-policy", changefreq: "monthly", priority: "0.5" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/creators", changefreq: "weekly", priority: "0.7" },
  { path: "/coaches", changefreq: "weekly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/careers", changefreq: "monthly", priority: "0.5" },
  { path: "/roadmap", changefreq: "weekly", priority: "0.6" },
  { path: "/community", changefreq: "daily", priority: "0.7" },
  { path: "/events", changefreq: "weekly", priority: "0.6" },
  { path: "/verified-certificates", changefreq: "weekly", priority: "0.8" },
  { path: "/support-us", changefreq: "monthly", priority: "0.6" },
];

const ROADMAP_SLUGS = [
  "frontend-developer", "backend-developer", "fullstack-developer",
  "devops-engineer", "data-scientist", "machine-learning-engineer",
  "android-developer", "ios-developer", "react-developer",
  "nodejs-developer", "python-developer", "java-developer",
  "go-developer", "rust-developer", "system-design",
  "blockchain-developer", "cloud-architect", "cybersecurity-engineer",
  "dsa-competitive-programming", "product-manager",
];

const CANONICAL_BLOG_SLUGS = [
  "full-stack-ai-engineer-roadmap-2026",
  "ultimate-guide-free-courses-certificates-2026",
  "cashfree-vs-razorpay-india-saas",
  "autonomous-ai-agents-langgraph-python",
];

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
): string {
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const Route = createFileRoute("/sitemap/xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const entries: string[] = [];

        // ── 1. Static routes ─────────────────────────────────────────────
        for (const r of PUBLIC_ROUTES) {
          entries.push(urlEntry(`${BASE_URL}${r.path}`, today, r.changefreq, r.priority));
        }

        // ── 2. Blog posts ─────────────────────────────────────────────────
        try {
          const { data: posts } = await supabase
            .from("blog_posts")
            .select("slug, published_at, updated_at")
            .eq("published", true)
            .order("published_at", { ascending: false })
            .limit(500);

          const allSlugs = new Map<string, string>();
          CANONICAL_BLOG_SLUGS.forEach((slug) => allSlugs.set(slug, today));
          for (const p of posts ?? []) {
            const date = (p.updated_at || p.published_at || today).split("T")[0];
            allSlugs.set(p.slug, date);
          }
          for (const [slug, date] of allSlugs) {
            entries.push(urlEntry(`${BASE_URL}/blog/${slug}`, date, "weekly", "0.7"));
          }
        } catch (e) {
          console.error("[Sitemap] Blog posts failed:", e);
        }

        // ── 3. Courses ────────────────────────────────────────────────────
        try {
          const { data: courses } = await (supabase as any)
            .from("courses")
            .select("slug, updated_at")
            .eq("is_published", true)
            .order("updated_at", { ascending: false })
            .limit(500);

          for (const c of courses ?? []) {
            const date = (c.updated_at || today).split("T")[0];
            entries.push(urlEntry(`${BASE_URL}/courses/${c.slug}`, date, "weekly", "0.8"));
          }
        } catch (e) {
          console.error("[Sitemap] Courses failed:", e);
        }

        // ── 4. Roadmaps ───────────────────────────────────────────────────
        for (const slug of ROADMAP_SLUGS) {
          entries.push(urlEntry(`${BASE_URL}/roadmap/${slug}`, today, "monthly", "0.7"));
        }

        // ── 5. Certificate verification pages ────────────────────────────
        try {
          const { data: certs } = await (supabase as any)
            .from("certificates")
            .select("verification_code, issued_at")
            .eq("is_revoked", false)
            .order("issued_at", { ascending: false })
            .limit(2000);

          for (const cert of certs ?? []) {
            if (!cert.verification_code) continue;
            const date = (cert.issued_at || today).split("T")[0];
            entries.push(
              urlEntry(`${BASE_URL}/verify/${cert.verification_code}`, date, "yearly", "0.4"),
            );
          }
        } catch (e) {
          console.error("[Sitemap] Certificates failed:", e);
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
    http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.join("\n")}
</urlset>`;

        return new Response(xml, {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=600, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
