import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function assertSuperAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("super_admin")) throw new Error("Forbidden: super_admin only");
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
    await assertSuperAdmin(context.userId);

    // Get auth users (paginated) for ban / disabled status + last sign in
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (authErr) throw new Error(authErr.message);

    const [{ data: profiles }, { data: roles }, { data: credits }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, email, full_name, avatar_url, created_at"),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("ai_credits").select("user_id, credits_remaining, credits_used"),
    ]);

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

    const rows = authData.users.map((u) => {
      const p = profileById.get(u.id);
      const bannedUntil = (u as unknown as { banned_until?: string | null }).banned_until ?? null;
      const isBanned = bannedUntil ? new Date(bannedUntil).getTime() > Date.now() : false;
      const c = creditsById.get(u.id);
      return {
        id: u.id,
        email: p?.email ?? u.email ?? "",
        full_name: p?.full_name ?? null,
        avatar_url: p?.avatar_url ?? null,
        created_at: p?.created_at ?? u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        roles: rolesById.get(u.id) ?? [],
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
  .inputValidator((d) =>
    z
      .object({
        userId: z.string().uuid(),
        creditsRemaining: z.number().int().min(0).max(1_000_000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("ai_credits")
      .upsert(
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
  .inputValidator((d) =>
    z
      .object({
        userId: z.string().uuid(),
        fullName: z.string().trim().min(1).max(120).optional(),
        email: z.string().email().max(255).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);

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
  .inputValidator((d) =>
    z.object({ userId: z.string().uuid(), password: z.string().min(8).max(128) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSetDisabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ userId: z.string().uuid(), disabled: z.boolean() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);
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
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);
    if (data.userId === context.userId) throw new Error("You cannot delete your own account");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const APP_ROLES = ["super_admin", "admin", "creator", "student"] as const;
const appRoleSchema = z.enum(APP_ROLES);

export const adminSetUserRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        userId: z.string().uuid(),
        roles: z.array(appRoleSchema).max(4),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.userId);

    if (data.userId === context.userId && !data.roles.includes("super_admin")) {
      throw new Error("You cannot remove super_admin from your own account");
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
  .inputValidator((d) =>
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
    await assertSuperAdmin(context.userId);

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
