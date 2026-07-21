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
];

export const Route = createFileRoute("/sitemap/xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];

        // Fetch published blog posts dynamically
        let blogUrls = "";
        try {
          const { data: posts } = await supabase
            .from("blog_posts")
            .select("slug, published_at, created_at")
            .eq("published", true);

          if (posts && posts.length > 0) {
            blogUrls = posts
              .map((p) => {
                const date = (p.published_at || p.created_at || "").split("T")[0] || today;
                return `  <url>
    <loc>${BASE_URL}/blog/${p.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
              })
              .join("\n");
          }
        } catch (e) {
          console.error("Failed to fetch blog posts for sitemap", e);
        }

        const staticUrls = PUBLIC_ROUTES.map(
          (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
        ).join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${blogUrls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        });
      },
    },
  },
});
