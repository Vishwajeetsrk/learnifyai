import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const PortfolioDataSchema = z.object({
  fullName: z.string().max(200).optional().default(""),
  tagline: z.string().max(300).optional().default(""),
  bio: z.string().max(10000).optional().default(""),
  skills: z.string().max(10000).optional().default(""),
  softSkills: z.string().max(5000).optional().default(""),
  tools: z.string().max(5000).optional().default(""),
  projects: z.string().max(20000).optional().default(""),
  socialLinks: z.string().max(5000).optional().default(""),
  experience: z.string().max(10000).optional().default(""),
  education: z.string().max(5000).optional().default(""),
  style: z.string().max(50).optional().default("developer"),
  accentColor: z.string().max(20).optional().default("#6366f1"),
  photoUrl: z.string().max(2000).nullable().optional().default(null),
  projectsList: z
    .array(
      z.object({
        name: z.string().max(300).optional().default(""),
        description: z.string().max(3000).optional().default(""),
        techStack: z.string().max(1000).optional().default(""),
        githubUrl: z.string().max(1000).optional().default(""),
        imageUrl: z.string().max(3000).nullable().optional().default(null),
      }),
    )
    .optional()
    .default([]),
});

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "portfolio"
  );
}

export const savePortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        data: PortfolioDataSchema,
        username: z.string().max(100).optional().default(""),
        photoDataUrl: z.string().max(6_000_000).nullable().optional().default(null),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const name = data.data.fullName || data.username || "Portfolio";
    const slug = slugify(data.username || name);

    let photoUrl: string | null = null;
    if (data.photoDataUrl && data.photoDataUrl.startsWith("data:image/")) {
      const extMatch = data.photoDataUrl.match(/^data:image\/(png|jpe?g|webp|gif)/i);
      const ext = extMatch ? (extMatch[1] === "jpeg" ? "jpg" : extMatch[1].toLowerCase()) : "png";
      const buffer = Buffer.from(data.photoDataUrl.split(",")[1] || "", "base64");
      const path = `portfolio/${userId}/${slug}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabaseAdmin.storage
        .from("avatars")
        .upload(path, buffer, { contentType: `image/${ext}`, upsert: true });
      if (!upErr) {
        const { data: pubUrl } = supabaseAdmin.storage.from("avatars").getPublicUrl(path);
        photoUrl = pubUrl.publicUrl;
      }
    }

    const payload = {
      ...data.data,
      photoUrl: photoUrl || data.data.photoUrl,
      updatedAt: new Date().toISOString(),
    };

    const { data: existing } = await supabaseAdmin
      .from("portfolios")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabaseAdmin
        .from("portfolios")
        .update({ data: payload, username: name, slug, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("portfolios").insert({
        user_id: userId,
        username: name,
        slug,
        data: payload,
      });
      if (error) throw new Error(error.message);
    }

    return { slug, url: `https://www.learnifyai.in/p/${slug}` };
  });

export const getPortfolioBySlug = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ slug: z.string().max(100).optional().default("") }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.slug) return { portfolio: null };
    const { data: row, error } = await supabaseAdmin
      .from("portfolios")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error || !row) return { portfolio: null };

    // Increment view count (fire and forget)
    void supabaseAdmin
      .from("portfolios")
      .update({ views: (row.views ?? 0) + 1 })
      .eq("id", row.id);

    return { portfolio: row };
  });

export const getMyPortfolio = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("portfolios")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return { portfolio: null };
    return { portfolio: data };
  });

export const unpublishPortfolio = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = context.userId;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("portfolios").delete().eq("user_id", userId);
    return { success: !error };
  });
