const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Load DATABASE_URL from .env file
let connectionString = process.env.DATABASE_URL;

try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
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
      if (k === "DATABASE_URL") {
        connectionString = v;
        break;
      }
    }
  }
} catch (err) {
  console.warn("Failed to load database URL from .env file:", err.message);
}

if (!connectionString) {
  console.error("Error: DATABASE_URL not found in environment or .env file.");
  process.exit(1);
}

// PostgreSQL error codes to ignore during sync
const IGNORED_ERRORS = new Set([
  "42710", // duplicate_object (e.g. policy already exists)
  "42P07", // duplicate_table (e.g. table already exists)
  "42701", // duplicate_column (e.g. column already exists)
  "42723", // duplicate_function (e.g. function already exists)
  "23505", // unique_violation (e.g. row already exists during INSERT)
]);

function splitSql(sql) {
  const statements = [];
  let current = [];
  let inSingleQuote = false;
  let inDollarQuote = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    
    // Handle escape quotes if any
    if (char === "'" && !inDollarQuote) {
      if (sql[i + 1] === "'") {
        current.push("'", "'");
        i++;
        continue;
      }
      inSingleQuote = !inSingleQuote;
    }
    
    // Check for dollar quote ($$)
    if (char === "$" && sql[i + 1] === "$" && !inSingleQuote) {
      inDollarQuote = !inDollarQuote;
      current.push("$", "$");
      i++; // skip next char
      continue;
    }
    
    // Check for statement separator
    if (char === ";" && !inSingleQuote && !inDollarQuote) {
      statements.push(current.join(""));
      current = [];
      continue;
    }
    
    current.push(char);
  }
  
  if (current.join("").trim()) {
    statements.push(current.join(""));
  }
  
  return statements.map(s => s.trim()).filter(Boolean);
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to PostgreSQL database...");

  // Ensure supabase_migrations schema and schema_migrations table exist
  await client.query("CREATE SCHEMA IF NOT EXISTS supabase_migrations;");
  await client.query(`
    CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
      version text NOT NULL PRIMARY KEY,
      statements text[],
      name text
    );
  `);

  // Query existing versions
  const { rows } = await client.query("SELECT version FROM supabase_migrations.schema_migrations");
  const applied = new Set(rows.map(r => r.version));
  console.log(`Found ${applied.size} already applied migrations.`);

  // Read migrations directory
  const migrationsDir = path.join(__dirname, "..", "supabase", "migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".sql"))
    .sort();

  console.log(`Found ${files.length} migration files in directory.`);

  for (const file of files) {
    const match = file.match(/^(\d+)_/);
    if (!match) {
      console.warn(`Skipping invalid migration file: ${file}`);
      continue;
    }
    const version = match[1];
    const name = file.replace(/^\d+_(.*)\.sql$/, "$1");

    if (applied.has(version)) {
      continue;
    }

    console.log(`\nApplying migration ${file}...`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf-8");

    // Split SQL into individual statements
    const statements = splitSql(sql);

    let migrationFailed = false;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await client.query(stmt + ";");
      } catch (err) {
        if (IGNORED_ERRORS.has(err.code)) {
          console.log(`  [Ignored] Statement ${i + 1} failed (Code ${err.code}): ${err.message}`);
        } else {
          console.error(`  [FAILED] Statement ${i + 1} failed:`, err.message);
          console.error(`  Statement SQL: ${stmt}`);
          migrationFailed = true;
          break;
        }
      }
    }

    if (migrationFailed) {
      console.error(`Migration ${file} failed and cannot be completed.`);
      throw new Error(`Migration ${file} failed.`);
    } else {
      // Register migration as completed
      try {
        await client.query(
          "INSERT INTO supabase_migrations.schema_migrations (version, statements, name) VALUES ($1, $2, $3) ON CONFLICT (version) DO NOTHING;",
          [version, [], name]
        );
        console.log(`Successfully completed migration ${file}`);
      } catch (err) {
        console.error(`Failed to register migration version ${version}:`, err.message);
        throw err;
      }
    }
  }

  console.log("\nAll missing migrations processed successfully.");
  await client.end();
}

main().catch(err => {
  console.error("Migration runner failed:", err);
  process.exit(1);
});
