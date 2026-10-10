const { Client } = require("pg");
const fs = require("fs");
require("dotenv").config({ path: ".env" });

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL.replace(":5432", ":6543"),
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log("Connected to database");
    const sql = fs.readFileSync("supabase/migrations/20261008000000_certificate_studio_2.sql", "utf8");
    await client.query(sql);
    console.log("Migration applied successfully!");
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await client.end();
  }
}
run();
