-- Drop the insecure INSERT policy for user_subscriptions
DROP POLICY IF EXISTS "Users manage own subscription" ON public.user_subscriptions;

-- Recreate policy: Only admins can manually insert (and service_role bypasses RLS anyway)
CREATE POLICY "Admins insert subscriptions"
  ON public.user_subscriptions FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));
