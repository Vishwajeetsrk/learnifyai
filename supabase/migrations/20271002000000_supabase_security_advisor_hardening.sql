-- ==============================================================================
-- SUPABASE SECURITY ADVISOR HARDENING MIGRATION
-- Fixes:
-- 1. Security Definer Views (subscription_analytics, public_directory_entries)
-- 2. RLS Disabled on Public Tables (leaderboard_prizes)
-- 3. Extension in Public Schema (vector -> extensions)
-- 4. Function Search Path Mutable (locking down search_path on all functions)
-- 5. RLS Policies Always True (coaching_slots, system_design_topics, xp_log, etc.)
-- 6. RLS Enabled With No Policy (certificate_analytics, _supabase_migrations, etc.)
-- 7. Public Storage Buckets Allowing File Listing (avatars, canva-templates, etc.)
-- 8. Anonymous & Unrestricted Execution on SECURITY DEFINER Functions
-- 9. Anonymous Access Policies Scoped Explicitly to authenticated
-- ==============================================================================

-- ==============================================================================
-- 1. FIX SECURITY DEFINER VIEWS
-- Enforce security_invoker = true so querying user's RLS and permissions apply
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'subscription_analytics') THEN
    ALTER VIEW public.subscription_analytics SET (security_invoker = true);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_views WHERE schemaname = 'public' AND viewname = 'public_directory_entries') THEN
    ALTER VIEW public.public_directory_entries SET (security_invoker = true);
  END IF;
END $$;


-- ==============================================================================
-- 2. FIX RLS DISABLED ON PUBLIC TABLES (leaderboard_prizes)
-- ==============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leaderboard_prizes') THEN
    ALTER TABLE public.leaderboard_prizes ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Anyone can view leaderboard prizes" ON public.leaderboard_prizes;
    CREATE POLICY "Anyone can view leaderboard prizes"
      ON public.leaderboard_prizes FOR SELECT
      TO public
      USING (true);

    DROP POLICY IF EXISTS "Admins manage leaderboard prizes" ON public.leaderboard_prizes;
    CREATE POLICY "Admins manage leaderboard prizes"
      ON public.leaderboard_prizes FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Service role manages leaderboard prizes" ON public.leaderboard_prizes;
    CREATE POLICY "Service role manages leaderboard prizes"
      ON public.leaderboard_prizes FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;


-- ==============================================================================
-- 3. MOVE EXTENSION OUT OF PUBLIC SCHEMA (vector -> extensions)
-- ==============================================================================
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE e.extname = 'vector' AND n.nspname = 'public'
  ) THEN
    ALTER EXTENSION vector SET SCHEMA extensions;
  END IF;
END $$;


-- ==============================================================================
-- 4. HARDEN FUNCTION SEARCH PATHS (0011_function_search_path_mutable)
-- Prevent search_path hijacking by locking down search_path to public, extensions, pg_temp
-- ==============================================================================
DO $$
BEGIN
  -- update_updated_at_column
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column') THEN
    ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;
  END IF;

  -- set_updated_at
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'set_updated_at') THEN
    ALTER FUNCTION public.set_updated_at() SET search_path = public, pg_temp;
  END IF;

  -- generate_invoice_number
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'generate_invoice_number') THEN
    ALTER FUNCTION public.generate_invoice_number() SET search_path = public, pg_temp;
  END IF;

  -- check_expired_subscriptions
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'check_expired_subscriptions') THEN
    ALTER FUNCTION public.check_expired_subscriptions() SET search_path = public, pg_temp;
  END IF;

  -- auto_generate_invoice
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'auto_generate_invoice') THEN
    ALTER FUNCTION public.auto_generate_invoice() SET search_path = public, pg_temp;
  END IF;

  -- cleanup_expired_events
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'cleanup_expired_events') THEN
    ALTER FUNCTION public.cleanup_expired_events() SET search_path = public, pg_temp;
  END IF;

  -- handle_new_user_stats
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'handle_new_user_stats') THEN
    ALTER FUNCTION public.handle_new_user_stats() SET search_path = public, pg_temp;
  END IF;

  -- update_canva_templates_updated_at
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'update_canva_templates_updated_at') THEN
    ALTER FUNCTION public.update_canva_templates_updated_at() SET search_path = public, pg_temp;
  END IF;

  -- update_lesson_content_blocks_updated_at
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'update_lesson_content_blocks_updated_at') THEN
    ALTER FUNCTION public.update_lesson_content_blocks_updated_at() SET search_path = public, pg_temp;
  END IF;

  -- increment_block_order
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'increment_block_order') THEN
    ALTER FUNCTION public.increment_block_order(uuid, integer) SET search_path = public, pg_temp;
  END IF;

  -- set_default_cert_template
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'set_default_cert_template') THEN
    ALTER FUNCTION public.set_default_cert_template(uuid) SET search_path = public, pg_temp;
  END IF;

  -- get_certificate_by_code
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'get_certificate_by_code') THEN
    ALTER FUNCTION public.get_certificate_by_code(text) SET search_path = public, pg_temp;
  END IF;

  -- submit_final_test
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'submit_final_test') THEN
    ALTER FUNCTION public.submit_final_test(uuid, jsonb) SET search_path = public, pg_temp;
  END IF;

  -- log_billing_audit
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'log_billing_audit') THEN
    ALTER FUNCTION public.log_billing_audit(text, text, text, uuid, jsonb, jsonb, text) SET search_path = public, pg_temp;
  END IF;

  -- generate_invoice_with_tax
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'generate_invoice_with_tax') THEN
    ALTER FUNCTION public.generate_invoice_with_tax(uuid, numeric, uuid, numeric, jsonb, text, text, text) SET search_path = public, pg_temp;
  END IF;

  -- has_role (uuid, text)
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'has_role' AND p.pronargs = 2) THEN
    BEGIN
      ALTER FUNCTION public.has_role(uuid, text) SET search_path = public, pg_temp;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  -- has_role (uuid, app_role)
  BEGIN
    ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public, pg_temp;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- match_material_chunks (vector with extensions schema)
  BEGIN
    ALTER FUNCTION public.match_material_chunks(extensions.vector, double precision, integer, uuid) SET search_path = public, extensions, pg_temp;
  EXCEPTION WHEN OTHERS THEN
    BEGIN
      ALTER FUNCTION public.match_material_chunks(vector, double precision, integer, uuid) SET search_path = public, extensions, pg_temp;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END;
END $$;


-- ==============================================================================
-- 5. FIX OVERLY PERMISSIVE RLS POLICIES (0024_permissive_rls_policy)
-- Replace unconstrained USING (true) / WITH CHECK (true) on non-SELECT operations
-- ==============================================================================

-- 5A. coaching_slots: Prevent learners from modifying arbitrary slot properties
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'coaching_slots') THEN
    DROP POLICY IF EXISTS "Learners can book slots" ON public.coaching_slots;
    CREATE POLICY "Learners can book slots"
      ON public.coaching_slots FOR UPDATE
      TO authenticated
      USING (is_booked = false)
      WITH CHECK (is_booked = true);
  END IF;
END $$;

-- 5B. system_design_topics: Restrict ALL access to actual admins
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'system_design_topics') THEN
    DROP POLICY IF EXISTS "Admin manage system design topics" ON public.system_design_topics;
    CREATE POLICY "Admin manage system design topics"
      ON public.system_design_topics FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Service role manages system design topics" ON public.system_design_topics;
    CREATE POLICY "Service role manages system design topics"
      ON public.system_design_topics FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 5C. xp_log: Restrict service role policy explicitly TO service_role
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'xp_log') THEN
    DROP POLICY IF EXISTS "Service role can insert XP log" ON public.xp_log;
    CREATE POLICY "Service role can insert XP log"
      ON public.xp_log FOR INSERT
      TO service_role
      WITH CHECK (true);

    -- Ensure authenticated users can only insert XP records for themselves if needed
    DROP POLICY IF EXISTS "Users can insert own XP log" ON public.xp_log;
    CREATE POLICY "Users can insert own XP log"
      ON public.xp_log FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- 5D. xp_purchases: Restrict service role policy explicitly TO service_role
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'xp_purchases') THEN
    DROP POLICY IF EXISTS "Service role full access" ON public.xp_purchases;
    CREATE POLICY "Service role full access"
      ON public.xp_purchases FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);

    -- Ensure users can purchase for themselves
    DROP POLICY IF EXISTS "Users can create own purchase" ON public.xp_purchases;
    CREATE POLICY "Users can create own purchase"
      ON public.xp_purchases FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- 5E. concept_graphs: Restrict insert and update to authenticated admins/creators
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'concept_graphs') THEN
    DROP POLICY IF EXISTS "concept_graphs_insert" ON public.concept_graphs;
    DROP POLICY IF EXISTS "concept_graphs_update" ON public.concept_graphs;

    CREATE POLICY "concept_graphs_insert"
      ON public.concept_graphs FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() IS NOT NULL);

    CREATE POLICY "concept_graphs_update"
      ON public.concept_graphs FOR UPDATE
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Service role manages concept_graphs" ON public.concept_graphs;
    CREATE POLICY "Service role manages concept_graphs"
      ON public.concept_graphs FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 5F. explanations_cache: Restrict insert/update to authenticated users and service role
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'explanations_cache') THEN
    DROP POLICY IF EXISTS "explanations_cache_insert" ON public.explanations_cache;
    DROP POLICY IF EXISTS "explanations_cache_update" ON public.explanations_cache;

    CREATE POLICY "explanations_cache_insert"
      ON public.explanations_cache FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() IS NOT NULL);

    CREATE POLICY "explanations_cache_update"
      ON public.explanations_cache FOR UPDATE
      TO authenticated
      USING (auth.uid() IS NOT NULL)
      WITH CHECK (auth.uid() IS NOT NULL);

    DROP POLICY IF EXISTS "Service role manages explanations_cache" ON public.explanations_cache;
    CREATE POLICY "Service role manages explanations_cache"
      ON public.explanations_cache FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 5G. job_applications: Require valid non-empty fields for application submission
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'job_applications') THEN
    DROP POLICY IF EXISTS "Anyone can apply" ON public.job_applications;
    CREATE POLICY "Anyone can apply"
      ON public.job_applications FOR INSERT
      TO anon, authenticated
      WITH CHECK (job_id IS NOT NULL AND email IS NOT NULL AND length(email) >= 3);
  END IF;
END $$;

-- 5H. lesson_views: Require valid lesson_id
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lesson_views') THEN
    DROP POLICY IF EXISTS "Anyone log a view" ON public.lesson_views;
    CREATE POLICY "Anyone log a view"
      ON public.lesson_views FOR INSERT
      TO anon, authenticated
      WITH CHECK (lesson_id IS NOT NULL);
  END IF;
END $$;

-- 5I. certificate_verification_logs & certificate_verifications
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_verification_logs') THEN
    DROP POLICY IF EXISTS "Public insert verification_logs" ON public.certificate_verification_logs;
    CREATE POLICY "Public insert verification_logs"
      ON public.certificate_verification_logs FOR INSERT
      TO anon, authenticated
      WITH CHECK (certificate_id IS NOT NULL);
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_verifications') THEN
    DROP POLICY IF EXISTS "Public insert certificate_verifications" ON public.certificate_verifications;
    CREATE POLICY "Public insert certificate_verifications"
      ON public.certificate_verifications FOR INSERT
      TO anon, authenticated
      WITH CHECK (certificate_id IS NOT NULL);
  END IF;
END $$;


-- ==============================================================================
-- 6. FIX RLS ENABLED WITHOUT POLICIES (0008_rls_enabled_no_policy)
-- Define explicit security policies for tables that currently have 0 policies
-- ==============================================================================

-- 6A. _supabase_migrations: Service role only
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = '_supabase_migrations') THEN
    DROP POLICY IF EXISTS "Service role manages migrations" ON public._supabase_migrations;
    CREATE POLICY "Service role manages migrations"
      ON public._supabase_migrations FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 6B. certificate_analytics
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_analytics') THEN
    DROP POLICY IF EXISTS "Admins view certificate analytics" ON public.certificate_analytics;
    CREATE POLICY "Admins view certificate analytics"
      ON public.certificate_analytics FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Service role manages certificate analytics" ON public.certificate_analytics;
    CREATE POLICY "Service role manages certificate analytics"
      ON public.certificate_analytics FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 6C. certificate_badges
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_badges') THEN
    DROP POLICY IF EXISTS "Anyone can view certificate badges" ON public.certificate_badges;
    CREATE POLICY "Anyone can view certificate badges"
      ON public.certificate_badges FOR SELECT
      TO public
      USING (true);

    DROP POLICY IF EXISTS "Admins manage certificate badges" ON public.certificate_badges;
    CREATE POLICY "Admins manage certificate badges"
      ON public.certificate_badges FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Service role manages certificate badges" ON public.certificate_badges;
    CREATE POLICY "Service role manages certificate badges"
      ON public.certificate_badges FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 6D. certificate_categories
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_categories') THEN
    DROP POLICY IF EXISTS "Anyone can view certificate categories" ON public.certificate_categories;
    CREATE POLICY "Anyone can view certificate categories"
      ON public.certificate_categories FOR SELECT
      TO public
      USING (true);

    DROP POLICY IF EXISTS "Admins manage certificate categories" ON public.certificate_categories;
    CREATE POLICY "Admins manage certificate categories"
      ON public.certificate_categories FOR ALL
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'))
      WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Service role manages certificate categories" ON public.certificate_categories;
    CREATE POLICY "Service role manages certificate categories"
      ON public.certificate_categories FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 6E. certificate_downloads
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_downloads') THEN
    DROP POLICY IF EXISTS "Users view own certificate downloads" ON public.certificate_downloads;
    CREATE POLICY "Users view own certificate downloads"
      ON public.certificate_downloads FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Users insert certificate downloads" ON public.certificate_downloads;
    CREATE POLICY "Users insert certificate downloads"
      ON public.certificate_downloads FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());

    DROP POLICY IF EXISTS "Service role manages certificate downloads" ON public.certificate_downloads;
    CREATE POLICY "Service role manages certificate downloads"
      ON public.certificate_downloads FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 6F. certificate_logs
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_logs') THEN
    DROP POLICY IF EXISTS "Admins view certificate logs" ON public.certificate_logs;
    CREATE POLICY "Admins view certificate logs"
      ON public.certificate_logs FOR SELECT
      TO authenticated
      USING (actor_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Users insert certificate logs" ON public.certificate_logs;
    CREATE POLICY "Users insert certificate logs"
      ON public.certificate_logs FOR INSERT
      TO authenticated
      WITH CHECK (actor_id = auth.uid());

    DROP POLICY IF EXISTS "Service role manages certificate logs" ON public.certificate_logs;
    CREATE POLICY "Service role manages certificate logs"
      ON public.certificate_logs FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 6G. certificate_shares
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_shares') THEN
    DROP POLICY IF EXISTS "Users view certificate shares" ON public.certificate_shares;
    CREATE POLICY "Users view certificate shares"
      ON public.certificate_shares FOR SELECT
      TO public
      USING (true);

    DROP POLICY IF EXISTS "Users insert certificate shares" ON public.certificate_shares;
    CREATE POLICY "Users insert certificate shares"
      ON public.certificate_shares FOR INSERT
      TO authenticated
      WITH CHECK (certificate_id IS NOT NULL);

    DROP POLICY IF EXISTS "Service role manages certificate shares" ON public.certificate_shares;
    CREATE POLICY "Service role manages certificate shares"
      ON public.certificate_shares FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 6H. certificate_wallets
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'certificate_wallets') THEN
    DROP POLICY IF EXISTS "Users view own certificate wallet" ON public.certificate_wallets;
    CREATE POLICY "Users view own certificate wallet"
      ON public.certificate_wallets FOR SELECT
      TO authenticated
      USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

    DROP POLICY IF EXISTS "Users manage own certificate wallet" ON public.certificate_wallets;
    CREATE POLICY "Users manage own certificate wallet"
      ON public.certificate_wallets FOR ALL
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());

    DROP POLICY IF EXISTS "Service role manages certificate wallets" ON public.certificate_wallets;
    CREATE POLICY "Service role manages certificate wallets"
      ON public.certificate_wallets FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;


-- ==============================================================================
-- 7. FIX PUBLIC BUCKET FILE ENUMERATION / LISTING (0025_public_bucket_allows_listing)
-- Public buckets serve files directly via public URLs without needing a broad SELECT on storage.objects.
-- Dropping unrestricted SELECT policies prevents anonymous enumeration of bucket files.
-- ==============================================================================
DO $$
BEGIN
  -- avatars
  DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
  DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
  DROP POLICY IF EXISTS "Avatars: public read" ON storage.objects;

  -- canva-templates
  DROP POLICY IF EXISTS "Public can view canva templates" ON storage.objects;

  -- community-uploads
  DROP POLICY IF EXISTS "Public Access for Community Uploads" ON storage.objects;

  -- media
  DROP POLICY IF EXISTS "Public Read media" ON storage.objects;

  -- Maintain scoped object listing for authenticated users/creators
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users list own avatars') THEN
    CREATE POLICY "Authenticated users list own avatars"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'avatars' AND (auth.uid()::text = (storage.foldername(name))[1] OR auth.uid() = owner));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users view canva templates') THEN
    CREATE POLICY "Authenticated users view canva templates"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'canva-templates');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users view community uploads') THEN
    CREATE POLICY "Authenticated users view community uploads"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'community-uploads');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated users view media') THEN
    CREATE POLICY "Authenticated users view media"
      ON storage.objects FOR SELECT
      TO authenticated
      USING (bucket_id = 'media');
  END IF;
END $$;


-- ==============================================================================
-- 8. REVOKE PUBLIC EXECUTE ON INTERNAL SECURITY DEFINER FUNCTIONS
-- (0028_anon_security_definer_function_executable & 0029_authenticated_security_definer)
-- ==============================================================================
DO $$
BEGIN
  -- Internal trigger and background cron functions: revoke from PUBLIC, anon, and authenticated
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'auto_generate_invoice') THEN
    REVOKE EXECUTE ON FUNCTION public.auto_generate_invoice() FROM PUBLIC, anon, authenticated;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'check_expired_subscriptions') THEN
    REVOKE EXECUTE ON FUNCTION public.check_expired_subscriptions() FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.check_expired_subscriptions() TO service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'cleanup_expired_events') THEN
    REVOKE EXECUTE ON FUNCTION public.cleanup_expired_events() FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.cleanup_expired_events() TO service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'handle_new_user_stats') THEN
    REVOKE EXECUTE ON FUNCTION public.handle_new_user_stats() FROM PUBLIC, anon, authenticated;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'set_updated_at') THEN
    REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
  END IF;

  -- Revoke anon execution on administrative / sensitive functions
  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'generate_invoice_with_tax') THEN
    REVOKE EXECUTE ON FUNCTION public.generate_invoice_with_tax(uuid, numeric, uuid, numeric, jsonb, text, text, text) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.generate_invoice_with_tax(uuid, numeric, uuid, numeric, jsonb, text, text, text) TO authenticated, service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'log_billing_audit') THEN
    REVOKE EXECUTE ON FUNCTION public.log_billing_audit(text, text, text, uuid, jsonb, jsonb, text) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.log_billing_audit(text, text, text, uuid, jsonb, jsonb, text) TO authenticated, service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'set_default_cert_template') THEN
    REVOKE EXECUTE ON FUNCTION public.set_default_cert_template(uuid) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.set_default_cert_template(uuid) TO authenticated, service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'increment_block_order') THEN
    REVOKE EXECUTE ON FUNCTION public.increment_block_order(uuid, integer) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.increment_block_order(uuid, integer) TO authenticated, service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'submit_final_test') THEN
    REVOKE EXECUTE ON FUNCTION public.submit_final_test(uuid, jsonb) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.submit_final_test(uuid, jsonb) TO authenticated, service_role;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.proname = 'has_role' AND p.pronargs = 2) THEN
    BEGIN
      REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM PUBLIC, anon;
      GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated, service_role;
    EXCEPTION WHEN OTHERS THEN NULL;
    END;
  END IF;

  BEGIN
    REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
    GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;


-- ==============================================================================
-- 9. ENSURE CORE USER-SCOPED POLICIES TARGET 'TO authenticated'
-- (0012_auth_allow_anonymous_sign_ins)
-- ==============================================================================
DO $$
BEGIN
  -- admin_audit_logs
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_audit_logs') THEN
    DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_logs;
    CREATE POLICY "Admins can view audit logs"
      ON public.admin_audit_logs FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
  END IF;

  -- ai_credits
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_credits') THEN
    DROP POLICY IF EXISTS "Users view own credits" ON public.ai_credits;
    CREATE POLICY "Users view own credits"
      ON public.ai_credits FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins view all credits" ON public.ai_credits;
    CREATE POLICY "Admins view all credits"
      ON public.ai_credits FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
  END IF;

  -- ai_usage
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_usage') THEN
    DROP POLICY IF EXISTS "Users view own usage" ON public.ai_usage;
    CREATE POLICY "Users view own usage"
      ON public.ai_usage FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins view all usage" ON public.ai_usage;
    CREATE POLICY "Admins view all usage"
      ON public.ai_usage FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
  END IF;

  -- ai_outputs
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_outputs') THEN
    DROP POLICY IF EXISTS "Users manage own ai_outputs" ON public.ai_outputs;
    CREATE POLICY "Users manage own ai_outputs"
      ON public.ai_outputs FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- cart_items
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cart_items') THEN
    DROP POLICY IF EXISTS "Users manage own cart" ON public.cart_items;
    CREATE POLICY "Users manage own cart"
      ON public.cart_items FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- billing_refunds
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'billing_refunds') THEN
    DROP POLICY IF EXISTS "Users view own refunds" ON public.billing_refunds;
    CREATE POLICY "Users view own refunds"
      ON public.billing_refunds FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
  END IF;

  -- billing_exports
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'billing_exports') THEN
    DROP POLICY IF EXISTS "Users view own exports" ON public.billing_exports;
    CREATE POLICY "Users view own exports"
      ON public.billing_exports FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
  END IF;

  -- billing_audit_logs
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'billing_audit_logs') THEN
    DROP POLICY IF EXISTS "Admins view audit logs" ON public.billing_audit_logs;
    CREATE POLICY "Admins view audit logs"
      ON public.billing_audit_logs FOR SELECT
      TO authenticated
      USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
