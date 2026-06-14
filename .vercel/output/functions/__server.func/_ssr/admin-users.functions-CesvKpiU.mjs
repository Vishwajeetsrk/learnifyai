import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { supabaseAdmin } from "./client.server-BbcUHF3e.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, n as numberType, s as stringType, b as booleanType, e as enumType, a as arrayType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
async function assertSuperAdmin(userId) {
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("super_admin")) throw new Error("Forbidden: super_admin only");
}
const SUPER_ADMIN_EMAIL = process.env.SUPABASE_SUPER_ADMIN_EMAIL?.trim().toLowerCase();
const bootstrapSuperAdmin_createServerFn_handler = createServerRpc({
  id: "b2c2671ec0dd0443e3dd92fb41a7adab672c40eb8e471dcf5a2b8f70ad13090c",
  name: "bootstrapSuperAdmin",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => bootstrapSuperAdmin.__executeServer(opts));
const bootstrapSuperAdmin = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(bootstrapSuperAdmin_createServerFn_handler, async ({
  context
}) => {
  if (!SUPER_ADMIN_EMAIL) {
    throw new Error("SUPABASE_SUPER_ADMIN_EMAIL is not configured.");
  }
  const {
    data: authData,
    error: authError
  } = await context.supabase.auth.getUser();
  if (authError || !authData?.user?.email) {
    throw new Error(authError?.message ?? "Unable to resolve authenticated user email");
  }
  const currentEmail = authData.user.email.toLowerCase();
  if (currentEmail !== SUPER_ADMIN_EMAIL) {
    return {
      ok: true,
      assigned: false,
      reason: "not_authorized"
    };
  }
  const {
    data: existing,
    error: existingError
  } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "super_admin").limit(1).maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (existing) {
    return {
      ok: true,
      assigned: false,
      reason: "already_exists"
    };
  }
  const {
    error: insertError
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: context.userId,
    role: "super_admin"
  });
  if (insertError) throw new Error(insertError.message);
  return {
    ok: true,
    assigned: true
  };
});
const adminListUsers_createServerFn_handler = createServerRpc({
  id: "75a41eaad6e8e420ff959bd09f5f09676e4cb6e6827615b69002573eecffdcbe",
  name: "adminListUsers",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminListUsers.__executeServer(opts));
const adminListUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(adminListUsers_createServerFn_handler, async ({
  context
}) => {
  await assertSuperAdmin(context.userId);
  const {
    data: authData,
    error: authErr
  } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 200
  });
  if (authErr) throw new Error(authErr.message);
  const [{
    data: profiles
  }, {
    data: roles
  }, {
    data: credits
  }] = await Promise.all([supabaseAdmin.from("profiles").select("id, email, full_name, avatar_url, created_at"), supabaseAdmin.from("user_roles").select("user_id, role"), supabaseAdmin.from("ai_credits").select("user_id, credits_remaining, credits_used")]);
  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
  const rolesById = /* @__PURE__ */ new Map();
  for (const r of roles ?? []) {
    const arr = rolesById.get(r.user_id) ?? [];
    arr.push(r.role);
    rolesById.set(r.user_id, arr);
  }
  const creditsById = new Map((credits ?? []).map((c) => [c.user_id, {
    remaining: c.credits_remaining,
    used: c.credits_used
  }]));
  const rows = authData.users.map((u) => {
    const p = profileById.get(u.id);
    const bannedUntil = u.banned_until ?? null;
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
      credits_used: c?.used ?? 0
    };
  });
  return {
    rows,
    total: rows.length
  };
});
const adminSetAiCredits_createServerFn_handler = createServerRpc({
  id: "3c02686d94d9737600d5b12d69cb30c7db2128447be23835394818cbbd1c30fa",
  name: "adminSetAiCredits",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminSetAiCredits.__executeServer(opts));
const adminSetAiCredits = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  creditsRemaining: numberType().int().min(0).max(1e6)
}).parse(d)).handler(adminSetAiCredits_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.from("ai_credits").upsert({
    user_id: data.userId,
    credits_remaining: data.creditsRemaining,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }, {
    onConflict: "user_id"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminUpdateUser_createServerFn_handler = createServerRpc({
  id: "7e44cff770ce63c7f54ff4f42a5f1198b6c13b6bb706edd2e84253ce3272ea47",
  name: "adminUpdateUser",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminUpdateUser.__executeServer(opts));
const adminUpdateUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  fullName: stringType().trim().min(1).max(120).optional(),
  email: stringType().email().max(255).optional()
}).parse(d)).handler(adminUpdateUser_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  if (data.email) {
    const {
      error
    } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      email: data.email
    });
    if (error) throw new Error(error.message);
  }
  const patch = {};
  if (data.fullName !== void 0) patch.full_name = data.fullName;
  if (data.email !== void 0) patch.email = data.email;
  if (Object.keys(patch).length) {
    const {
      error
    } = await supabaseAdmin.from("profiles").update(patch).eq("id", data.userId);
    if (error) throw new Error(error.message);
  }
  return {
    ok: true
  };
});
const adminSetPassword_createServerFn_handler = createServerRpc({
  id: "0d0c07a65c0857a08946e2697199515335f20099bc56aa4650be6a1beb0700ce",
  name: "adminSetPassword",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminSetPassword.__executeServer(opts));
const adminSetPassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  password: stringType().min(8).max(128)
}).parse(d)).handler(adminSetPassword_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  const {
    error
  } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
    password: data.password
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminSetDisabled_createServerFn_handler = createServerRpc({
  id: "487fc7f6282ce4b544a9e6bbd96bcce70e405455d873c1697dd8e5d1283872d9",
  name: "adminSetDisabled",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminSetDisabled.__executeServer(opts));
const adminSetDisabled = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  disabled: booleanType()
}).parse(d)).handler(adminSetDisabled_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  if (data.userId === context.userId) throw new Error("You cannot disable your own account");
  const {
    error
  } = await supabaseAdmin.auth.admin.updateUserById(
    data.userId,
    // ban_duration "none" un-bans; "876000h" ~= 100 years
    {
      ban_duration: data.disabled ? "876000h" : "none"
    }
  );
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const adminDeleteUser_createServerFn_handler = createServerRpc({
  id: "31cd0087befaea9f28691dcd70f4a21113aea1822989cc6cf42e905d3993bf14",
  name: "adminDeleteUser",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminDeleteUser.__executeServer(opts));
const adminDeleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid()
}).parse(d)).handler(adminDeleteUser_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  if (data.userId === context.userId) throw new Error("You cannot delete your own account");
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const APP_ROLES = ["super_admin", "admin", "creator", "student"];
const appRoleSchema = enumType(APP_ROLES);
const adminSetUserRoles_createServerFn_handler = createServerRpc({
  id: "16419254d84a19e25f489cee6157c632467f7e6774668931578e88439b949377",
  name: "adminSetUserRoles",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminSetUserRoles.__executeServer(opts));
const adminSetUserRoles = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  roles: arrayType(appRoleSchema).max(4)
}).parse(d)).handler(adminSetUserRoles_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  if (data.userId === context.userId && !data.roles.includes("super_admin")) {
    throw new Error("You cannot remove super_admin from your own account");
  }
  const unique = Array.from(new Set(data.roles));
  const {
    error: delErr
  } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
  if (delErr) throw new Error(delErr.message);
  if (unique.length > 0) {
    const rows = unique.map((role) => ({
      user_id: data.userId,
      role
    }));
    const {
      error: insErr
    } = await supabaseAdmin.from("user_roles").insert(rows);
    if (insErr) throw new Error(insErr.message);
  }
  return {
    ok: true,
    roles: unique
  };
});
const adminCreateUser_createServerFn_handler = createServerRpc({
  id: "7cdf308c08cefa76b5aff91881d47d0a7c38e57c538ac8578cbcc0b0323f57c2",
  name: "adminCreateUser",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => adminCreateUser.__executeServer(opts));
const adminCreateUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  email: stringType().email().max(255),
  password: stringType().min(8).max(128),
  fullName: stringType().trim().min(1).max(120),
  roles: arrayType(appRoleSchema).min(1).max(4)
}).parse(d)).handler(adminCreateUser_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertSuperAdmin(context.userId);
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.fullName
    }
  });
  if (error) throw new Error(error.message);
  const newUserId = created.user?.id;
  if (!newUserId) throw new Error("Failed to create user");
  await supabaseAdmin.from("user_roles").delete().eq("user_id", newUserId);
  const unique = Array.from(new Set(data.roles));
  const {
    error: roleErr
  } = await supabaseAdmin.from("user_roles").insert(unique.map((role) => ({
    user_id: newUserId,
    role
  })));
  if (roleErr) throw new Error(roleErr.message);
  await supabaseAdmin.from("profiles").update({
    full_name: data.fullName,
    email: data.email
  }).eq("id", newUserId);
  return {
    ok: true,
    userId: newUserId
  };
});
export {
  adminCreateUser_createServerFn_handler,
  adminDeleteUser_createServerFn_handler,
  adminListUsers_createServerFn_handler,
  adminSetAiCredits_createServerFn_handler,
  adminSetDisabled_createServerFn_handler,
  adminSetPassword_createServerFn_handler,
  adminSetUserRoles_createServerFn_handler,
  adminUpdateUser_createServerFn_handler,
  bootstrapSuperAdmin_createServerFn_handler
};
