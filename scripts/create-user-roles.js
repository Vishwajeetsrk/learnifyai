import { Client } from "pg";
import fs from "fs";
import path from "path";

function loadEnv() {
  try {
    const txt = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf8");
    for (const line of txt.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const k = t.slice(0, eq);
      let v = t.slice(eq + 1);
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
        v = v.slice(1, -1);
      if (!process.env[k]) process.env[k] = v;
    }
  } catch (e) {}
}

(async function () {
  loadEnv();
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    const check = await client.query("SELECT to_regclass('public.user_roles') as ur");
    if (check.rows[0].ur) {
      console.log("public.user_roles already exists");
      process.exit(0);
    }
    console.log("Creating public.app_role type if needed");
    await client.query(
      "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN CREATE TYPE public.app_role AS ENUM ('super_admin','admin','creator','student'); END IF; END$$;",
    );
    console.log("Creating public.user_roles table");
    await client.query(`create table public.user_roles (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references auth.users(id) on delete cascade,
      role public.app_role not null,
      created_at timestamptz not null default now(),
      unique (user_id, role)
    );`);
    await client.query(
      "grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;",
    );
    await client.query("alter table public.user_roles enable row level security;");
    console.log("Created user_roles");
  } catch (err) {
    console.error("Error creating user_roles", err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
