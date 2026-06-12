import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function loadDotEnv(envPath) {
  try {
    const txt = fs.readFileSync(envPath, "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const k = trimmed.slice(0, eq);
      let v = trimmed.slice(eq + 1);
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      if (!process.env[k]) process.env[k] = v;
    }
  } catch (err) {
    // ignore
  }
}

(async function main() {
  const envPath = path.resolve(process.cwd(), ".env");
  loadDotEnv(envPath);

  const SUPABASE_URL =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const SUPER_EMAIL = (process.env.SUPABASE_SUPER_ADMIN_EMAIL || "").trim().toLowerCase();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment or .env");
    process.exit(1);
  }
  if (!SUPER_EMAIL) {
    console.error("Missing SUPABASE_SUPER_ADMIN_EMAIL in environment or .env");
    process.exit(1);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  console.log(`Looking up user for email: ${SUPER_EMAIL}`);
  // Use admin.listUsers to find a matching auth user (avoid depending on profiles table)
  const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000,
  });
  if (listErr) {
    console.error("Auth listUsers failed", listErr.message);
    process.exit(1);
  }
  const found = (list.users || []).find((u) => (u.email || "").toLowerCase() === SUPER_EMAIL);
  const userId = found?.id;

  if (!userId) {
    console.error("User not found for email", SUPER_EMAIL);
    process.exit(1);
  }

  // Check existing role
  const { data: existing, error: exErr } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "super_admin")
    .limit(1)
    .maybeSingle();
  if (exErr) {
    console.error("Role lookup failed", exErr.message);
    process.exit(1);
  }
  if (existing) {
    console.log("User already has super_admin role");
    process.exit(0);
  }

  const { error: insErr } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userId, role: "super_admin" });
  if (insErr) {
    console.error("Insert failed", insErr.message);
    process.exit(1);
  }
  console.log(`Assigned super_admin to user id ${userId} (${SUPER_EMAIL})`);
})();
