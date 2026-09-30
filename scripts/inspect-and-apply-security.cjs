const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionConfig = {
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.gnvsqwyexjuuwkjibxrr',
  password: '#KingKhan15112003',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
};

async function run() {
  const client = new Client(connectionConfig);
  await client.connect();
  console.log('Connected to Supabase PostgreSQL database.');

  try {
    // 1. Check current errors
    console.log('\n--- 1. Current State of Error Entities ---');
    const errCheck = await client.query(`
      SELECT c.relname, c.relkind, c.relrowsecurity, c.reloptions
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname IN ('subscription_analytics', 'public_directory_entries', 'leaderboard_prizes');
    `);
    console.log(errCheck.rows);

    // 1b. Check job_applications columns
    console.log('\n--- 1b. job_applications columns ---');
    const cols = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'job_applications';
    `);
    console.log(cols.rows.map(r => r.column_name));

    // 1c. Check certificate tables columns
    console.log('\n--- 1c. certificate tables columns ---');
    const certTables = [
      'certificate_analytics',
      'certificate_badges',
      'certificate_categories',
      'certificate_downloads',
      'certificate_logs',
      'certificate_shares',
      'certificate_wallets'
    ];
    for (const t of certTables) {
      const c = await client.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1;
      `, [t]);
      console.log(t, '->', c.rows.map(r => r.column_name));
    }

    // 2. Check vector extension schema
    console.log('\n--- 2. Vector Extension Schema ---');
    const extCheck = await client.query(`
      SELECT e.extname, n.nspname
      FROM pg_extension e
      JOIN pg_namespace n ON n.oid = e.extnamespace
      WHERE e.extname = 'vector';
    `);
    console.log(extCheck.rows);

    // 3. Read and execute the security hardening migration
    console.log('\n--- 3. Applying Security Hardening Migration ---');
    const migrationPath = path.join(__dirname, '../supabase/migrations/20271002000000_supabase_security_advisor_hardening.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await client.query(sql);
    console.log('Successfully executed 20271002000000_supabase_security_advisor_hardening.sql!');

    // 4. Verify the updated state
    console.log('\n--- 4. Verified State After Hardening ---');
    const verifyErrors = await client.query(`
      SELECT c.relname, c.relkind, c.relrowsecurity, c.reloptions
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public'
        AND c.relname IN ('subscription_analytics', 'public_directory_entries', 'leaderboard_prizes');
    `);
    console.log('Views & Tables:', verifyErrors.rows);

    const verifyExt = await client.query(`
      SELECT e.extname, n.nspname
      FROM pg_extension e
      JOIN pg_namespace n ON n.oid = e.extnamespace
      WHERE e.extname = 'vector';
    `);
    console.log('Vector Extension Schema:', verifyExt.rows);

    // Record migration in _supabase_migrations if present
    const checkMigTable = await client.query(`
      SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_supabase_migrations'
    `);
    if (checkMigTable.rows.length > 0) {
      await client.query(`
        INSERT INTO public._supabase_migrations (version, name, hash, applied_at, statement_timeout)
        VALUES ('20271002000000', '20271002000000_supabase_security_advisor_hardening.sql', '', now(), '30s')
        ON CONFLICT (version) DO NOTHING;
      `);
      console.log('Recorded migration in public._supabase_migrations.');
    }

  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
