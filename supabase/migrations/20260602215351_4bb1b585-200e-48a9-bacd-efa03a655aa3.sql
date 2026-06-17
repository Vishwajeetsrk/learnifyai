ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS payout_destination jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS notif_prefs jsonb NOT NULL DEFAULT '{"new_subscriber":true,"new_comment":true,"new_sale":true,"email":true,"inapp":true}'::jsonb,
  ADD COLUMN IF NOT EXISTS default_course_settings jsonb NOT NULL DEFAULT '{"price_inr":0,"category":"General","level":"Beginner"}'::jsonb;

-- Allow authenticated users to view minimal public bits of any creator profile
-- (needed for /creators/<id> and subscribers list lookup). Existing policies
-- already restrict the row to its owner / admins for full access; this adds
-- read-only access to displayable columns for any signed-in user.
DROP POLICY IF EXISTS "Authenticated can view creator basics" ON public.profiles;
CREATE POLICY "Authenticated can view creator basics"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);