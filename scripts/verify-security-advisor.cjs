const { Client } = require('pg');

const connectionConfig = {
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.gnvsqwyexjuuwkjibxrr',
  password: '#KingKhan15112003',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
};

async function verify() {
  const client = new Client(connectionConfig);
  await client.connect();

  console.log('=== VERIFYING SUPABASE SECURITY ADVISOR RESOLUTIONS ===\n');

  // 1. Errors check
  const errors = await client.query(`
    SELECT c.relname, c.relkind, c.relrowsecurity, c.reloptions
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname IN ('subscription_analytics', 'public_directory_entries', 'leaderboard_prizes');
  `);
  console.log('1. Target Error Entities:');
  console.table(errors.rows);

  // 2. Vector extension check
  const ext = await client.query(`
    SELECT e.extname, n.nspname
    FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE e.extname = 'vector';
  `);
  console.log('2. Vector Extension Schema:');
  console.table(ext.rows);

  // 3. Functions search_path check
  const procs = await client.query(`
    SELECT p.proname, p.prosecdef, p.proconfig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'update_updated_at_column',
        'match_material_chunks',
        'generate_invoice_number',
        'check_expired_subscriptions',
        'log_billing_audit',
        'generate_invoice_with_tax',
        'auto_generate_invoice',
        'update_canva_templates_updated_at',
        'has_role',
        'update_lesson_content_blocks_updated_at',
        'increment_block_order',
        'set_default_cert_template',
        'cleanup_expired_events',
        'handle_new_user_stats',
        'get_certificate_by_code',
        'submit_final_test',
        'set_updated_at'
      );
  `);
  console.log('3. Functions Search Path & Security Definer Status:');
  for (const r of procs.rows) {
    console.log(`- ${r.proname}: secdef=${r.prosecdef}, config=${JSON.stringify(r.proconfig)}`);
  }

  // 4. Overly permissive policies check (checking for non-SELECT with true)
  const permissive = await client.query(`
    SELECT tablename, policyname, cmd, roles, qual, with_check
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'coaching_slots',
        'system_design_topics',
        'xp_log',
        'xp_purchases',
        'concept_graphs',
        'explanations_cache',
        'job_applications',
        'lesson_views',
        'certificate_verification_logs',
        'certificate_verifications'
      )
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    ORDER BY tablename, policyname;
  `);
  console.log('\n4. Hardened RLS Policies on Sensitive Tables:');
  for (const r of permissive.rows) {
    console.log(`- [${r.tablename}] "${r.policyname}" (${r.cmd}) TO ${r.roles}: USING(${r.qual || 'none'}) WITH_CHECK(${r.with_check || 'none'})`);
  }

  // 5. Storage policies on public buckets
  const storagePolicies = await client.query(`
    SELECT policyname, cmd, roles, qual
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects';
  `);
  console.log('5. Storage Objects Policies:');
  console.table(storagePolicies.rows);

  await client.end();
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
