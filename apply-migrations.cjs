const { Client } = require("pg");
require("dotenv").config({ path: ".env" });
const fs = require("fs");

const MIGRATIONS = [
  "supabase/migrations/20270808000002_cert_fk_prizes.sql",
  "supabase/migrations/20270810000001_lesson_exercises.sql",
  "supabase/migrations/20270810000002_exercise_seed.sql",
  "supabase/migrations/20270810000003_course_covers.sql",
  "supabase/migrations/20270810000004_html_css_curriculum.sql",
  "supabase/migrations/20270810000005_js_curriculum.sql",
  "supabase/migrations/20270810000006_industry_lessons.sql",
];

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    for (const file of MIGRATIONS) {
      const name = file.split(/[\\/]/).pop();
      const version = name.split("_")[0];
      const sql = fs.readFileSync(file, "utf8");
      const { rows } = await client.query("select name from public._supabase_migrations where name = $1", [name]);
      if (rows.length) {
        console.log("SKIP (already applied):", name);
        continue;
      }
      await client.query(sql);
      await client.query(
        "insert into public._supabase_migrations (version, name, hash, applied_at, statement_timeout) values ($1, $2, '', now(), '30s')",
        [version, name]
      );
      console.log("APPLIED:", name);
    }
    const prizes = await client.query("select period, rank, name from public.leaderboard_prizes order by period, rank");
    console.log("prizes seeded:", prizes.rows.length);
    const em = await client.query("select id from public.email_templates where id='leaderboard_winner'");
    console.log("email template:", em.rows.length ? em.rows[0].id : "MISSING");
    const fk = await client.query(
      "select confrelid::regclass as ref from pg_constraint where conname='courses_certificate_template_id_fkey'"
    );
    console.log("courses FK now references:", fk.rows[0].ref);
  } finally {
    await client.end();
  }
}

main().catch((e) => { console.error("FAILED:", e.message); process.exit(1); });
