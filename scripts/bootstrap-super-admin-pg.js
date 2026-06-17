import { Client } from "pg";
import fs from "fs";
import path from "path";

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
  loadDotEnv(path.resolve(process.cwd(), ".env"));
  const DATABASE_URL = process.env.DATABASE_URL;
  const SUPER_EMAIL = (process.env.SUPABASE_SUPER_ADMIN_EMAIL || "").trim().toLowerCase();
  if (!DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }
  if (!SUPER_EMAIL) {
    console.error("Missing SUPABASE_SUPER_ADMIN_EMAIL");
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    // check tables
    const tr = await client.query(
      "SELECT to_regclass('public.user_roles') as ur, to_regclass('auth.users') as au",
    );
    console.log("table check", tr.rows[0]);

    const userRes = await client.query(
      "SELECT id, email FROM auth.users WHERE lower(email) = $1 LIMIT 1",
      [SUPER_EMAIL],
    );
    if (userRes.rowCount === 0) {
      console.error("User not found in auth.users for", SUPER_EMAIL);
      process.exit(1);
    }
    const userId = userRes.rows[0].id;
    console.log("Found user", userId);

    const roleCheck = await client.query(
      "SELECT 1 FROM public.user_roles WHERE user_id = $1 AND role = $2 LIMIT 1",
      [userId, "super_admin"],
    );
    if (roleCheck.rowCount > 0) {
      console.log("User already has super_admin");
      process.exit(0);
    }

    await client.query("INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2)", [
      userId,
      "super_admin",
    ]);
    console.log("Assigned super_admin to", SUPER_EMAIL);
  } catch (err) {
    console.error("Error", err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
