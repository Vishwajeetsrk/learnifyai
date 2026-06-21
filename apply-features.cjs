const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const client = new Client({
  connectionString: "postgresql://postgres:%23KingKhan15112003@db.gnvsqwyexjuuwkjibxrr.supabase.co:5432/postgres",
});

async function main() {
  await client.connect();
  const sql = fs.readFileSync(path.join(__dirname, "supabase/migrations/20260621000000_feature_flags.sql"), "utf8");
  
  try {
    await client.query(sql);
    console.log("Migration applied successfully.");
  } catch (err) {
    console.error("Migration error:", err.message);
  }
  
  await client.end();
}

main().catch(console.error);
