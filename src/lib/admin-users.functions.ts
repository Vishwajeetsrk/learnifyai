import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("super_admin") && !roles.includes("admin")) {
    throw new Error("Forbidden: admin or super_admin only");
  }
}

const SUPER_ADMIN_EMAIL = process.env.SUPABASE_SUPER_ADMIN_EMAIL?.trim().toLowerCase();

export const bootstrapSuperAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!SUPER_ADMIN_EMAIL) {
      throw new Error("SUPABASE_SUPER_ADMIN_EMAIL is not configured.");
    }

    const { data: authData, error: authError } = await context.supabase.auth.getUser();
    if (authError || !authData?.user?.email) {
      throw new Error(authError?.message ?? "Unable to resolve authenticated user email");
    }
    const currentEmail = authData.user.email.toLowerCase();
    if (currentEmail !== SUPER_ADMIN_EMAIL) {
      return { ok: true, assigned: false, reason: "not_authorized" };
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "super_admin")
      .limit(1)
      .maybeSingle();
    if (existingError) throw new Error(existingError.message);
    if (existing) {
      return { ok: true, assigned: false, reason: "already_exists" };
    }

    const { error: insertError } = await supabaseAdmin.from("user_roles").insert({
      user_id: context.userId,
      role: "super_admin",
    });
    if (insertError) throw new Error(insertError.message);
    return { ok: true, assigned: true };
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);

    // Get auth users (paginated) for ban / disabled status + last sign in
    let authUsers: any[] = [];
    try {
      const res = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (res.data?.users) {
        authUsers = res.data.users;
      }
    } catch (e) {
      console.error("[adminListUsers] auth.admin.listUsers failed:", e);
    }

    const [{ data: profiles }, { data: roles }, { data: credits }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, email, full_name, avatar_url, created_at"),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("ai_credits").select("user_id, credits_remaining, credits_used"),
    ]);

    const authById = new Map(authUsers.map((u) => [u.id, u]));
    const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
    const rolesById = new Map<string, string[]>();
    for (const r of roles ?? []) {
      const arr = rolesById.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesById.set(r.user_id, arr);
    }
    const creditsById = new Map(
      (credits ?? []).map((c) => [
        c.user_id,
        { remaining: c.credits_remaining, used: c.credits_used },
      ]),
    );

    const baseIds = new Set([...(profiles ?? []).map((p) => p.id), ...authUsers.map((u) => u.id)]);

    const rows = Array.from(baseIds).map((id) => {
      const p = profileById.get(id);
      const u = authById.get(id);
      const bannedUntil = (u as unknown as { banned_until?: string | null })?.banned_until ?? null;
      const isBanned = bannedUntil ? new Date(bannedUntil).getTime() > Date.now() : false;
      const c = creditsById.get(id);
      return {
        id,
        email: p?.email ?? u?.email ?? "",
        full_name: p?.full_name ?? null,
        avatar_url: p?.avatar_url ?? null,
        created_at: p?.created_at ?? u?.created_at ?? new Date().toISOString(),
        last_sign_in_at: u?.last_sign_in_at ?? null,
        roles: rolesById.get(id) ?? [],
        banned_until: bannedUntil,
        disabled: isBanned,
        credits_remaining: c?.remaining ?? 0,
        credits_used: c?.used ?? 0,
      };
    });

    return { rows, total: rows.length };
  });

export const adminSetAiCredits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d) =>
    z
      .object({
        userId: z.string().uuid(),
        creditsRemaining: z.number().int().min(0).max(1_000_000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.from("ai_credits").upsert(
      {
        user_id: data.userId,
        credits_remaining: data.creditsRemaining,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminUpdateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d) =>
    z
      .object({
        userId: z.string().uuid(),
        fullName: z.string().trim().min(1).max(120).optional(),
        email: z.string().email().max(255).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    if (data.email) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
        email: data.email,
      });
      if (error) throw new Error(error.message);
    }

    const patch: { full_name?: string; email?: string } = {};
    if (data.fullName !== undefined) patch.full_name = data.fullName;
    if (data.email !== undefined) patch.email = data.email;
    if (Object.keys(patch).length) {
      const { error } = await supabaseAdmin.from("profiles").update(patch).eq("id", data.userId);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminSetPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d) =>
    z.object({ userId: z.string().uuid(), password: z.string().min(8).max(128) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSetDisabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d) => z.object({ userId: z.string().uuid(), disabled: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("You cannot disable your own account");
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      data.userId,
      // ban_duration "none" un-bans; "876000h" ~= 100 years
      { ban_duration: data.disabled ? "876000h" : "none" } as unknown as Record<string, string>,
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("You cannot delete your own account");

    const uid = data.userId;

    // Clear FK references from tables whose columns point at auth.users WITHOUT
    // ON DELETE CASCADE/SET NULL — otherwise auth.admin.deleteUser fails with a
    // foreign key constraint violation. All of these columns are nullable.
    const nullOutFks: Array<{ table: string; column: string }> = [
      { table: "canva_templates", column: "created_by" },
      { table: "certificate_templates", column: "created_by" },
      { table: "workspaces", column: "created_by" },
      { table: "projects", column: "created_by" },
      { table: "projects", column: "assigned_to" },
      { table: "crm_leads", column: "created_by" },
      { table: "crm_deals", column: "created_by" },
      { table: "coupons", column: "creator_id" },
      { table: "billing_settings", column: "updated_by" },
      { table: "billing_refunds", column: "initiated_by" },
      { table: "billing_templates", column: "created_by" },
    ];

    for (const fk of nullOutFks) {
      try {
        await supabaseAdmin
          .from(fk.table as any)
          .update({ [fk.column]: null })
          .eq(fk.column, uid);
      } catch (e) {
        console.warn(`[adminDeleteUser] null-out ${fk.table}.${fk.column} skipped:`, e);
      }
    }

    // Delete owned content that should be removed with the account (cascade cleanup).
    try {
      await supabaseAdmin.from("profiles").delete().eq("id", uid);
    } catch (e) {
      console.warn("[adminDeleteUser] profile delete skipped:", e);
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const APP_ROLES = ["super_admin", "admin", "creator", "student", "issuer"] as const;
const appRoleSchema = z.enum(APP_ROLES);
const TEAM_ROLES = ["super_admin", "admin", "issuer"] as const;

export const adminSetUserRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d) =>
    z
      .object({
        userId: z.string().uuid(),
        roles: z.array(appRoleSchema).max(4),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    if (
      data.userId === context.userId &&
      !data.roles.includes("super_admin") &&
      !data.roles.includes("admin")
    ) {
      throw new Error("You cannot remove admin access from your own account");
    }

    const unique = Array.from(new Set(data.roles));

    const { error: delErr } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId);
    if (delErr) throw new Error(delErr.message);

    if (unique.length > 0) {
      const rows = unique.map((role) => ({ user_id: data.userId, role }));
      const { error: insErr } = await supabaseAdmin.from("user_roles").insert(rows);
      if (insErr) throw new Error(insErr.message);
    }
    return { ok: true, roles: unique };
  });

export const adminCreateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d) =>
    z
      .object({
        email: z.string().email().max(255),
        password: z.string().min(8).max(128),
        fullName: z.string().trim().min(1).max(120),
        roles: z.array(appRoleSchema).min(1).max(4),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (error) throw new Error(error.message);
    const newUserId = created.user?.id;
    if (!newUserId) throw new Error("Failed to create user");

    // The handle_new_user trigger seeds a default role; replace with admin selection.
    await supabaseAdmin.from("user_roles").delete().eq("user_id", newUserId);
    const unique = Array.from(new Set(data.roles));
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert(unique.map((role) => ({ user_id: newUserId, role })));
    if (roleErr) throw new Error(roleErr.message);

    await supabaseAdmin
      .from("profiles")
      .update({ full_name: data.fullName, email: data.email })
      .eq("id", newUserId);

    return { ok: true, userId: newUserId };
  });

// silence unused
void createClient;

export const adminTeamMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);

    const { data: roles, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .in("role", TEAM_ROLES);
    if (rolesErr) throw new Error(rolesErr.message);

    const ids = Array.from(new Set((roles ?? []).map((r) => r.user_id)));
    const { data: profiles } = ids.length
      ? await supabaseAdmin
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", ids)
      : { data: [] };

    const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
    const members = (roles ?? []).map((r) => {
      const p = profileById.get(r.user_id);
      return {
        user_id: r.user_id,
        role: r.role,
        full_name: p?.full_name ?? null,
        email: p?.email ?? "",
        avatar_url: p?.avatar_url ?? null,
      };
    });

    const rank = { super_admin: 0, admin: 1, issuer: 2 } as const;
    members.sort(
      (a, b) =>
        (rank[a.role as keyof typeof rank] ?? 9) - (rank[b.role as keyof typeof rank] ?? 9) ||
        (a.full_name || "").localeCompare(b.full_name || ""),
    );

    return { members };
  });

export const adminSetTeamRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(TEAM_ROLES),
        action: z.enum(["add", "remove"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    if (data.action === "remove") {
      if (data.userId === context.userId) {
        throw new Error("You cannot remove your own team access");
      }
      if (data.role === "super_admin") {
        const { data: owners } = await supabaseAdmin
          .from("user_roles")
          .select("user_id")
          .eq("role", "super_admin");
        if ((owners ?? []).length <= 1) {
          throw new Error("Cannot remove the last owner");
        }
      }
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
      return { ok: true, action: "removed" };
    }

    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
    if (insErr) throw new Error(insErr.message);
    return { ok: true, action: "added" };
  });

export const adminSearchUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .validator((d) => z.object({ query: z.string().trim().min(1).max(120) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const q = `%${data.query.toLowerCase()}%`;
    const { data: rows, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email, avatar_url")
      .or(`email.ilike.${q},full_name.ilike.${q}`)
      .limit(8);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });
