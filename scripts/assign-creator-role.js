import fs from "fs";
import path from "path";
import { Client } from "pg";

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
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    const email = "testcopilot1@example.com";
    const userRes = await client.query(
      "SELECT id FROM auth.users WHERE lower(email) = $1 LIMIT 1",
      [email],
    );
    if (userRes.rowCount === 0) {
      console.error("User not found", email);
      process.exit(1);
    }
    const userId = userRes.rows[0].id;
    console.log("Found user", userId);
    const roleRes = await client.query(
      "SELECT 1 FROM public.user_roles WHERE user_id = $1 AND role = $2 LIMIT 1",
      [userId, "creator"],
    );
    if (roleRes.rowCount > 0) {
      console.log("User already has creator role.");
    } else {
      await client.query("INSERT INTO public.user_roles (user_id, role) VALUES ($1, $2)", [
        userId,
        "creator",
      ]);
      console.log("Inserted creator role for user");
    }
  } catch (err) {
    console.error("Error", err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
