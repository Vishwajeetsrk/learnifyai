
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_inr numeric(12,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('credit','debit','refund')),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending','completed','failed')),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON public.wallet_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own transactions" ON public.wallet_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Super admins view all transactions" ON public.wallet_transactions FOR SELECT TO authenticated USING (has_role(auth.uid(),'super_admin'));
CREATE POLICY "Super admins manage transactions" ON public.wallet_transactions FOR ALL TO authenticated USING (has_role(auth.uid(),'super_admin')) WITH CHECK (has_role(auth.uid(),'super_admin'));
CREATE INDEX IF NOT EXISTS wallet_transactions_created_idx ON public.wallet_transactions (created_at DESC);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Super admins manage notifications" ON public.notifications FOR ALL TO authenticated USING (has_role(auth.uid(),'super_admin')) WITH CHECK (has_role(auth.uid(),'super_admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
