
-- AI Credits per user
CREATE TABLE public.ai_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_remaining integer NOT NULL DEFAULT 500,
  credits_used integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.ai_credits TO authenticated;
GRANT ALL ON public.ai_credits TO service_role;

ALTER TABLE public.ai_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own credits" ON public.ai_credits
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins view all credits" ON public.ai_credits
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- AI usage log
CREATE TABLE public.ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE SET NULL,
  model text NOT NULL,
  prompt_tokens integer NOT NULL DEFAULT 0,
  completion_tokens integer NOT NULL DEFAULT 0,
  total_tokens integer NOT NULL DEFAULT 0,
  cost_usd numeric(12,6) NOT NULL DEFAULT 0,
  cost_inr numeric(12,4) NOT NULL DEFAULT 0,
  credits_charged integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_usage_user ON public.ai_usage(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_created ON public.ai_usage(created_at DESC);

GRANT SELECT ON public.ai_usage TO authenticated;
GRANT ALL ON public.ai_usage TO service_role;

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own usage" ON public.ai_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins view all usage" ON public.ai_usage
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_usage;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_credits;

-- Backfill existing users with 500 credits
INSERT INTO public.ai_credits (user_id, credits_remaining)
SELECT id, 500 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Update handle_new_user to also create credits row
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.ai_credits (user_id, credits_remaining) values (new.id, 500)
    on conflict (user_id) do nothing;

  if lower(new.email) = 'vishwajeetsrk@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'super_admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'student');
  end if;
  return new;
end;
$function$;
