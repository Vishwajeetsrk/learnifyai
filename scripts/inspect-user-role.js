import fs from "fs";
import path from "path";
import { Client } from "pg";

function loadEnv() {
  const p = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(p)) return;
  const txt = fs.readFileSync(p, "utf8");
  for (const line of txt.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i);
    let value = t.slice(i + 1);
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
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    const email = "testcopilot1@example.com";
    const userResult = await client.query(
      "SELECT id FROM auth.users WHERE lower(email) = $1 LIMIT 1",
      [email],
    );
    console.log("user rows", userResult.rows);
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].id;
      const roles = await client.query("SELECT * FROM public.user_roles WHERE user_id = $1", [
        userId,
      ]);
      console.log("roles", roles.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
})();
