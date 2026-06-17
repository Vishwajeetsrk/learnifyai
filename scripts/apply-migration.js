import fs from "fs";
import path from "path";
import { Client } from "pg";

(async function () {
  const envPath = path.resolve(process.cwd(), ".env");
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
    /* ignore */
  }

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const sqlPath = path.resolve(
    process.cwd(),
    "supabase",
    "migrations",
    "20260602095950_3d9d3143-d8f3-41ed-b465-3732b54c7deb.sql",
  );
  if (!fs.existsSync(sqlPath)) {
    console.error("Migration file not found", sqlPath);
    process.exit(1);
  }
  const sql = fs.readFileSync(sqlPath, "utf8");

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    console.log("Applying migration...");
    await client.query(sql);
    console.log("Migration applied");
  } catch (err) {
    console.error("Migration error:", err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
