const { Client } = require('pg');
const fs = require('fs');

function readEnv(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const env = {};
    for (const line of content.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, '');
    }
    return env;
  } catch { return {}; }
}

const env = { ...readEnv('.env'), ...readEnv('.env.local') };
const dbUrl = env.DATABASE_URL;

async function main() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  
  // Check RLS policies on pricing_plans
  const policies = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
    FROM pg_policies 
    WHERE tablename = 'pricing_plans';
  `);
  console.log('RLS Policies on pricing_plans:');
  console.log(JSON.stringify(policies.rows, null, 2));
  
  // Check if RLS is enabled
  const rls = await client.query(`
    SELECT relname, relrowsecurity, relforcerowsecurity
    FROM pg_class 
    WHERE relname = 'pricing_plans';
  `);
  console.log('\nRLS status:', JSON.stringify(rls.rows, null, 2));
  
  // Try to read as anon role
  await client.query("SET ROLE anon");
  try {
    const r = await client.query('SELECT id, name, price_label FROM pricing_plans WHERE active = true;');
    console.log('\nAnon role can see', r.rows.length, 'plans');
  } catch (e) {
    console.log('\nAnon role CANNOT read pricing_plans:', e.message);
    // Fix it
    await client.query("RESET ROLE");
    await client.query("ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;");
    await client.query(`
      CREATE POLICY IF NOT EXISTS "pricing_plans_public_read"
      ON pricing_plans FOR SELECT
      TO anon, authenticated
      USING (active = true);
    `);
    console.log('RLS policy added for anon read!');
  }
  
  await client.end();
}

main().catch(e => console.error(e.message));
