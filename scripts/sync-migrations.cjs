const { Client } = require("pg");
const client = new Client({
  connectionString:
    "postgresql://postgres:%23KingKhan15112003@db.gnvsqwyexjuuwkjibxrr.supabase.co:5432/postgres",
});
async function main() {
  await client.connect();
  const { rows } = await client.query("select version from supabase_migrations.schema_migrations");
  const existing = new Set(rows.map((r) => r.version));
  const migrations = [
    ["20260602095950", "initial"],
    ["20260602100042", "buckets"],
    ["20260602103135", "wallet"],
    ["20260602105112", "ai_chunks"],
    ["20260602105433", "cursors"],
    ["20260602110127", "posts"],
    ["20260602110800", "triggers"],
    ["20260602115805", "coaching"],
    ["20260602121255", "notifications"],
    ["20260602121332", "flashcards"],
    ["20260602131718", "creator_subs"],
    ["20260602131825", "cart_coupons"],
    ["20260602132424", "challenges"],
    ["20260602133326", "tests"],
    ["20260602134050", "pricing"],
    ["20260602141248", "enroll_rls"],
    ["20260602141352", "roadmap"],
    ["20260602142258", "cohorts"],
    ["20260602143009", "courses"],
    ["20260602144837", "certificates"],
    ["20260602145024", "more_rls"],
    ["20260602150221", "progress"],
    ["20260602152009", "storage"],
    ["20260602155910", "assignments"],
    ["20260602162042", "enroll_trig"],
    ["20260602173212", "ai_credits"],
    ["20260602183206", "bio"],
    ["20260602202026", "materials"],
    ["20260602203255", "groups"],
    ["20260602214657", "group_members"],
    ["20260602215351", "extra_fields"],
    ["20260602215841", "flash_tags"],
    ["20260602224050", "prefs"],
    ["20260603035058", "cert_rls"],
    ["20260603035603", "cohort_rls"],
    ["20260615000000", "community"],
    ["20260615000001", "coaching"],
    ["20260616000000", "rag"],
    ["20260616000001", "indexes"],
    ["20260616000002", "certs_v2"],
    ["20260616000003", "workspace"],
    ["20260617000001", "polls"],
    ["20260618000001", "group_link"],
    ["20260618000002", "subscriptions"],
    ["20260619000000", "playground"],
    ["20260620000000", "leaderboard"],
    ["20260620000001", "badges"],
    ["20260620000002", "settings_fields"],
    ["20260620000003", "wd_policy"],
    ["20260620000004", "badges_seed"],
    ["20260620000005", "org_brand"],
  ];
  for (const [v, n] of migrations) {
    if (!existing.has(v)) {
      const vs = client.escapeLiteral(v);
      const ns = client.escapeLiteral(n);
      await client.query(
        "insert into supabase_migrations.schema_migrations (version, statements, name) values (" +
          vs +
          ", '{}'::text[], " +
          ns +
          ")",
      );
      console.log("Inserted:", v);
    }
  }
  const x = await client.query("select count(*) from supabase_migrations.schema_migrations");
  console.log("Total:", x.rows[0].count);
  await client.end();
}
main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
