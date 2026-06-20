import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://learnifyaitool.vercel.app";

const PUBLIC_ROUTES = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/features", changefreq: "weekly", priority: "0.9" },
  { path: "/pricing", changefreq: "weekly", priority: "0.9" },
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

        const urls = PUBLIC_ROUTES.map(
          (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
        ).join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
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
