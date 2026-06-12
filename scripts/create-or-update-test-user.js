import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  const txt = fs.readFileSync(envPath, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i);
    let value = trimmed.slice(i + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

(async function () {
  loadEnv();
  const SUPABASE_URL =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const email = "testcopilot1@example.com";
  const password = "Password123!";
  console.log("Looking for user", email);
  const { data: list, error: listErr } = await client.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    console.error("listUsers error", listErr.message);
    process.exit(1);
  }
  const found = (list.users || []).find(
    (u) => (u.email || "").toLowerCase() === email.toLowerCase(),
  );
  if (found) {
    console.log("User exists, updating password and confirming");
    const { data, error } = await client.auth.admin.updateUserById(found.id, {
      password,
      email_confirm: true,
      user_metadata: { full_name: "Test User" },
    });
    console.log({ data, error });
    if (error) {
      console.error("updateUserById error", error.message);
      process.exit(1);
    }
    console.log("Updated user", data?.id ?? found.id);
  } else {
    console.log("User not found, creating");
    const { data, error } = await client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Test User" },
    });
    console.log({ data, error });
    if (error) {
      console.error("createUser error", error.message);
      process.exit(1);
    }
    console.log("Created user", data?.id ?? "unknown");
  }
})();
