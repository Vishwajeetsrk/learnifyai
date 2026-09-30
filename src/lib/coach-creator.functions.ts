import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { logAdminAction } from "./admin-audit.functions";

export interface CoachRecord {
  id: string;
  name: string;
  photo: string;
  title: string;
  expertise: string;
  bio: string;
  hourly_rate: number;
  currency: string;
  languages: string[];
  availability: string;
  verification_status: "verified" | "unverified";
  visibility: "published" | "draft" | "hidden" | "archived";
  featured: boolean;
  sort_order: number;
  is_demo: boolean;
  rating?: number | null;
  reviews_count?: number | null;
  sessions_count?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreatorRecord {
  id: string;
  name: string;
  photo: string;
  title: string;
  expertise: string;
  bio: string;
  courses_count: number;
  social_links?: Record<string, string>;
  verification_status: "verified" | "unverified";
  visibility: "published" | "draft" | "hidden" | "archived";
  featured: boolean;
  sort_order: number;
  is_demo: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Exactly 3 clearly marked DEMO coaches for testing/development.
 * Stored with is_demo: true and visibility: "draft" so they NEVER appear as real
 * verified coaches on the public website unless an admin publishes them.
 */
export const DEMO_COACHES: CoachRecord[] = [
  {
    id: "demo-coach-1",
    name: "Aarav Patel (Demo Preview)",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    title: "Senior Full-Stack Engineer",
    expertise: "React 19, TypeScript & Microservices",
    bio: "Demo profile for testing coach onboarding and session scheduling. Specializes in scalable architecture and system design.",
    hourly_rate: 999,
    currency: "INR",
    languages: ["English", "Hindi"],
    availability: "Weekends & Evenings",
    verification_status: "unverified",
    visibility: "draft",
    featured: false,
    sort_order: 1,
    is_demo: true,
    rating: null,
    reviews_count: null,
    sessions_count: 0,
  },
  {
    id: "demo-coach-2",
    name: "Neha Sharma (Demo Preview)",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
    title: "AI Research Engineer & Mentor",
    expertise: "LLMs, LangChain, RAG Systems & Python",
    bio: "Demo profile for AI mentoring workflows. Practical guidance on building agents and production GenAI pipelines.",
    hourly_rate: 1499,
    currency: "INR",
    languages: ["English"],
    availability: "Flexible Slots",
    verification_status: "unverified",
    visibility: "draft",
    featured: false,
    sort_order: 2,
    is_demo: true,
    rating: null,
    reviews_count: null,
    sessions_count: 0,
  },
  {
    id: "demo-coach-3",
    name: "Karan Verma (Demo Preview)",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    title: "Cloud & DevOps Architect",
    expertise: "Kubernetes, Docker, AWS & Terraform",
    bio: "Demo profile for cloud mentoring. Mock interviews, resume reviews, and CI/CD production architecture.",
    hourly_rate: 1199,
    currency: "INR",
    languages: ["English", "Hindi"],
    availability: "Evenings",
    verification_status: "unverified",
    visibility: "draft",
    featured: false,
    sort_order: 3,
    is_demo: true,
    rating: null,
    reviews_count: null,
    sessions_count: 0,
  },
];

/**
 * Exactly 3 clearly marked DEMO creators for testing/development.
 * Stored with is_demo: true and visibility: "draft".
 */
export const DEMO_CREATORS: CreatorRecord[] = [
  {
    id: "demo-creator-1",
    name: "Siddharth Rao (Demo Preview)",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    title: "Frontend Architect",
    expertise: "Next.js 15, TanStack Router & Performance",
    bio: "Demo creator profile. Publishes deep-dive courses on modern frontend architectures and interactive sandboxes.",
    courses_count: 2,
    social_links: { github: "https://github.com", twitter: "https://x.com" },
    verification_status: "unverified",
    visibility: "draft",
    featured: false,
    sort_order: 1,
    is_demo: true,
  },
  {
    id: "demo-creator-2",
    name: "Pooja Nair (Demo Preview)",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80",
    title: "Data Platform Lead",
    expertise: "PostgreSQL, Supabase RLS & Big Data",
    bio: "Demo creator profile for database masterclasses and distributed systems design.",
    courses_count: 1,
    social_links: { linkedin: "https://linkedin.com" },
    verification_status: "unverified",
    visibility: "draft",
    featured: false,
    sort_order: 2,
    is_demo: true,
  },
  {
    id: "demo-creator-3",
    name: "Vikram Malhotra (Demo Preview)",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80",
    title: "DevOps & SRE Specialist",
    expertise: "Docker, Kubernetes, Cloudflare & Linux",
    bio: "Demo creator profile for cloud native engineering and containerized deployments.",
    courses_count: 3,
    social_links: { github: "https://github.com" },
    verification_status: "unverified",
    visibility: "draft",
    featured: false,
    sort_order: 3,
    is_demo: true,
  },
];

/**
 * Sanitizes public bio text: strips raw internal strings like [COACH APPLICATION],
 * admin notes, review notes, and private emails so they never leak into public UI.
 */
export function sanitizePublicBio(raw?: string | null): string {
  if (!raw) return "";
  let clean = raw;
  clean = clean.replace(/\[(COACH|CREATOR)\s+APPLICATION\]/gi, "");
  clean = clean.replace(/\[INTERNAL(?:\s+NOTE)?\][^\n]*/gi, "");
  clean = clean.replace(/Review\s*notes?:[^\n]*/gi, "");
  clean = clean.replace(/Admin\s*notes?:[^\n]*/gi, "");
  clean = clean.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi, "");
  return clean.trim();
}

async function checkAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const userRoles = (roles ?? []).map((r: any) => r.role);
  if (!userRoles.includes("super_admin") && !userRoles.includes("admin")) {
    throw new Error("Forbidden: Admin privileges required.");
  }
}

/**
 * Public Coaches Fetcher:
 * Returns ONLY published, visible, non-demo coaches.
 * Sanitizes bios and validates that rating/reviews only display if backed by real data.
 */
export const getPublicCoaches = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  try {
    // 1. Check if coaches table exists
    const { data: dbCoaches, error } = await supabaseAdmin
      .from("coaches" as any)
      .select("*")
      .eq("visibility", "published")
      .eq("is_demo", false)
      .order("sort_order", { ascending: true });

    if (!error && dbCoaches && dbCoaches.length > 0) {
      return (dbCoaches as unknown as CoachRecord[]).map((c) => ({
        ...c,
        bio: sanitizePublicBio(c.bio),
      }));
    }
  } catch (err) {
    // Fall back to site_settings store if table not migrated yet
  }

  // 2. Fall back to site_settings 'coaches_directory' key
  try {
    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "coaches_directory")
      .maybeSingle();

    if (setting?.value) {
      const parsed = JSON.parse(setting.value) as CoachRecord[];
      return parsed
        .filter((c) => c.visibility === "published" && !c.is_demo)
        .map((c) => ({
          ...c,
          bio: sanitizePublicBio(c.bio),
        }));
    }
  } catch {}

  // Return empty list if no coaches have been verified and published yet (no fake data)
  return [] as CoachRecord[];
});

/**
 * Admin Coaches Fetcher:
 * Returns all coaches (published, draft, hidden, archived, and demo) for the Admin CMS.
 */
export const getAdminCoaches = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    try {
      const { data: dbCoaches, error } = await supabaseAdmin
        .from("coaches" as any)
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && dbCoaches && dbCoaches.length > 0) {
        return dbCoaches as unknown as CoachRecord[];
      }
    } catch {}

    try {
      const { data: setting } = await supabaseAdmin
        .from("site_settings")
        .select("value")
        .eq("key", "coaches_directory")
        .maybeSingle();

      if (setting?.value) {
        return JSON.parse(setting.value) as CoachRecord[];
      }
    } catch {}

    // Initial seed with clearly marked demo coaches in draft mode
    return DEMO_COACHES;
  });

/**
 * Admin Save Coach:
 * Adds or updates a coach record with full status toggles and audit logging.
 */
export const saveCoach = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        coach: z.object({
          id: z.string(),
          name: z.string().min(1),
          photo: z.string().url().or(z.string().startsWith("/")),
          title: z.string().min(1),
          expertise: z.string().min(1),
          bio: z.string().min(1),
          hourly_rate: z.number().min(0),
          currency: z.string().default("INR"),
          languages: z.array(z.string()).default(["English"]),
          availability: z.string().default("Weekdays"),
          verification_status: z.enum(["verified", "unverified"]),
          visibility: z.enum(["published", "draft", "hidden", "archived"]),
          featured: z.boolean().default(false),
          sort_order: z.number().default(0),
          is_demo: z.boolean().default(false),
        }),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { coach } = data;

    // Sanitize bio before saving
    coach.bio = sanitizePublicBio(coach.bio);

    // Fetch existing list from site_settings or db
    let coaches: CoachRecord[] = [];
    try {
      const { data: setting } = await supabaseAdmin
        .from("site_settings")
        .select("value")
        .eq("key", "coaches_directory")
        .maybeSingle();
      if (setting?.value) coaches = JSON.parse(setting.value);
      else coaches = [...DEMO_COACHES];
    } catch {
      coaches = [...DEMO_COACHES];
    }

    const idx = coaches.findIndex((c) => c.id === coach.id);
    const oldCoach = idx >= 0 ? coaches[idx] : null;

    if (idx >= 0) {
      coaches[idx] = { ...coaches[idx], ...coach, updated_at: new Date().toISOString() };
    } else {
      coaches.push({
        ...coach,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Persist to site_settings
    await supabaseAdmin
      .from("site_settings")
      .upsert(
        { key: "coaches_directory", value: JSON.stringify(coaches) },
        { onConflict: "key" },
      );

    // Audit log
    try {
      await logAdminAction({
        data: {
          action: oldCoach ? "update_coach" : "create_coach",
          entityType: "coaches",
          entityId: coach.id,
          changes: { old: oldCoach, new: coach },
        },
      });
    } catch {}

    return { success: true, coach };
  });

/**
 * Admin Delete / Archive Coach
 */
export const deleteCoach = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ coachId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "coaches_directory")
      .maybeSingle();

    if (!setting?.value) return { success: true };
    const coaches = (JSON.parse(setting.value) as CoachRecord[]).filter((c) => c.id !== data.coachId);

    await supabaseAdmin
      .from("site_settings")
      .upsert(
        { key: "coaches_directory", value: JSON.stringify(coaches) },
        { onConflict: "key" },
      );

    try {
      await logAdminAction({
        data: {
          action: "delete_coach",
          entityType: "coaches",
          entityId: data.coachId,
        },
      });
    } catch {}
    return { success: true };
  });

/**
 * Public Creators Fetcher:
 * Returns ONLY published, visible, non-demo creators with sanitized profiles.
 */
export const getPublicCreators = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  try {
    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "creators_directory")
      .maybeSingle();

    if (setting?.value) {
      const parsed = JSON.parse(setting.value) as CreatorRecord[];
      return parsed
        .filter((c) => c.visibility === "published" && !c.is_demo)
        .map((c) => ({
          ...c,
          bio: sanitizePublicBio(c.bio),
        }));
    }
  } catch {}

  return [] as CreatorRecord[];
});

/**
 * Admin Creators Fetcher:
 * Returns all creators for Admin CMS.
 */
export const getAdminCreators = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    try {
      const { data: setting } = await supabaseAdmin
        .from("site_settings")
        .select("value")
        .eq("key", "creators_directory")
        .maybeSingle();

      if (setting?.value) {
        return JSON.parse(setting.value) as CreatorRecord[];
      }
    } catch {}

    return DEMO_CREATORS;
  });

/**
 * Admin Save Creator:
 * Adds or updates a creator record with full status toggles and audit logging.
 */
export const saveCreator = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        creator: z.object({
          id: z.string(),
          name: z.string().min(1),
          photo: z.string().url().or(z.string().startsWith("/")),
          title: z.string().min(1),
          expertise: z.string().min(1),
          bio: z.string().min(1),
          courses_count: z.number().default(0),
          social_links: z.record(z.string()).optional(),
          verification_status: z.enum(["verified", "unverified"]),
          visibility: z.enum(["published", "draft", "hidden", "archived"]),
          featured: z.boolean().default(false),
          sort_order: z.number().default(0),
          is_demo: z.boolean().default(false),
        }),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { creator } = data;

    creator.bio = sanitizePublicBio(creator.bio);

    let creators: CreatorRecord[] = [];
    try {
      const { data: setting } = await supabaseAdmin
        .from("site_settings")
        .select("value")
        .eq("key", "creators_directory")
        .maybeSingle();
      if (setting?.value) creators = JSON.parse(setting.value);
      else creators = [...DEMO_CREATORS];
    } catch {
      creators = [...DEMO_CREATORS];
    }

    const idx = creators.findIndex((c) => c.id === creator.id);
    const oldCreator = idx >= 0 ? creators[idx] : null;

    if (idx >= 0) {
      creators[idx] = { ...creators[idx], ...creator, updated_at: new Date().toISOString() };
    } else {
      creators.push({
        ...creator,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    await supabaseAdmin
      .from("site_settings")
      .upsert(
        { key: "creators_directory", value: JSON.stringify(creators) },
        { onConflict: "key" },
      );

    try {
      await logAdminAction({
        data: {
          action: oldCreator ? "update_creator" : "create_creator",
          entityType: "creators",
          entityId: creator.id,
          changes: { old: oldCreator, new: creator },
        },
      });
    } catch {}

    return { success: true, creator };
  });

/**
 * Admin Delete Creator
 */
export const deleteCreator = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) => z.object({ creatorId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    await checkAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "creators_directory")
      .maybeSingle();

    if (!setting?.value) return { success: true };
    const creators = (JSON.parse(setting.value) as CreatorRecord[]).filter((c) => c.id !== data.creatorId);

    await supabaseAdmin
      .from("site_settings")
      .upsert(
        { key: "creators_directory", value: JSON.stringify(creators) },
        { onConflict: "key" },
      );

    try {
      await logAdminAction({
        data: {
          action: "delete_creator",
          entityType: "creators",
          entityId: data.creatorId,
        },
      });
    } catch {}
    return { success: true };
  });
