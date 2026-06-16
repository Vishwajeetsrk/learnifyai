import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const url = "postgresql://postgres:%23KingKhan15112003@db.gnvsqwyexjuuwkjibxrr.supabase.co:5432/postgres";

async function main() {
  const client = new Client({ connectionString: url });
  await client.connect();
  console.log("Connected to PostgreSQL");

  const files = [
    "20260615000000_community_features.sql",
    "20260615000001_coaching_features.sql",
    "20260616000000_rag_core.sql"
  ];

  for (const file of files) {
    const filePath = path.join(process.cwd(), "supabase", "migrations", file);
    const sql = fs.readFileSync(filePath, "utf-8");
    console.log(`Applying ${file}...`);
    try {
      await client.query(sql);
      console.log(`Successfully applied ${file}`);
    } catch (e) {
      console.error(`Failed to apply ${file}:`, e.message);
    }
  }

  await client.end();
}

main().catch(console.error);
