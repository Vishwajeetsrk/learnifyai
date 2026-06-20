const { Client } = require('pg');
const fs = require('fs');

// Read from .env
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
const dbUrl = env.DATABASE_URL || env.POSTGRES_URL || env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

async function main() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  
  // Check if pricing_plans table exists
  const tableCheck = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'pricing_plans'
    );
  `);
  
  if (!tableCheck.rows[0].exists) {
    console.log('pricing_plans table does not exist. Creating it...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        name text NOT NULL,
        price_label text NOT NULL,
        description text,
        features jsonb DEFAULT '[]'::jsonb,
        cta_label text DEFAULT 'Get started',
        cta_to text DEFAULT '/signup',
        highlighted boolean DEFAULT false,
        price_inr numeric DEFAULT 0,
        interval text,
        badge text,
        color text,
        ai_credits_monthly integer DEFAULT 0,
        max_courses integer DEFAULT -1,
        cashfree_plan_id text,
        active boolean DEFAULT true,
        order_index integer DEFAULT 0,
        created_at timestamptz DEFAULT now()
      );
    `);
    console.log('Table created.');
  }

  // Check current count
  const count = await client.query('SELECT COUNT(*) FROM pricing_plans WHERE active = true;');
  console.log('Current active pricing plans:', count.rows[0].count);

  if (parseInt(count.rows[0].count) === 0) {
    console.log('Inserting 3 pricing plans...');
    await client.query(`
      INSERT INTO pricing_plans (name, price_label, description, features, cta_label, cta_to, highlighted, price_inr, interval, badge, color, ai_credits_monthly, max_courses, active, order_index)
      VALUES
        (
          'Free', '₹0 / forever', 'Everything you need to start your learning journey.',
          '["5 AI tutor sessions/month","Access to free courses","Code playground (5 languages)","Community access","Basic profile & achievements","Verified certificates"]',
          'Get started free', '/signup', false, 0, NULL, NULL, '#6366f1', 50, 3, true, 1
        ),
        (
          'Pro', '₹499 / month', 'Unlimited AI, all courses, and priority support.',
          '["Unlimited AI tutor sessions","All courses & new releases","Code playground (25+ languages)","AI Quiz & Smart Notes generator","Career coach & skill graph","Priority support","PDF certificates with QR verify","Creator studio (1 course)","50,000 AI credits/month"]',
          'Start Pro', '/signup', true, 499, 'month', 'Most Popular', '#7c3aed', 50000, -1, true, 2
        ),
        (
          'Team', '₹1,999 / month', 'For power learners, creators, and growing teams.',
          '["Everything in Pro","Unlimited courses & cohorts","Full creator studio (unlimited courses)","Team analytics dashboard","Custom branding on certificates","Dedicated account manager","API access","500,000 AI credits/month","White-label certificates"]',
          'Start Team', '/signup', false, 1999, 'month', 'Best Value', '#0891b2', 500000, -1, true, 3
        );
    `);
    console.log('3 pricing plans inserted successfully!');
  } else {
    console.log('Pricing plans already exist — skipping insert.');
  }

  const plans = await client.query('SELECT id, name, price_label, highlighted FROM pricing_plans WHERE active = true ORDER BY order_index;');
  console.log('\nCurrent plans:');
  plans.rows.forEach(p => console.log(' -', p.name, '|', p.price_label, '| highlighted:', p.highlighted));

  await client.end();
}

main().catch(err => { console.error('Error:', err.message); process.exit(1); });
