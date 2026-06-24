DO $$
BEGIN
  -- Onboarding Progress
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'onboarding_progress' AND schemaname = 'public') THEN
    CREATE TABLE public.onboarding_progress (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      current_step text NOT NULL DEFAULT 'welcome',
      completed_steps text[] DEFAULT '{}',
      ai_profile jsonb DEFAULT '{}',
      product_tour_completed boolean DEFAULT false,
      first_project_id text,
      coaching_session_count integer DEFAULT 0,
      daily_streak integer DEFAULT 0,
      last_active_date date,
      onboarding_completed boolean DEFAULT false,
      onboarding_completed_at timestamp with time zone,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now(),
      CONSTRAINT onboarding_progress_pkey PRIMARY KEY (id),
      CONSTRAINT onboarding_progress_user_unique UNIQUE (user_id)
    );
    CREATE INDEX idx_onboarding_progress_user ON public.onboarding_progress(user_id);
    CREATE INDEX idx_onboarding_progress_step ON public.onboarding_progress(current_step);
    ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own onboarding" ON public.onboarding_progress
      FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own onboarding" ON public.onboarding_progress
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own onboarding" ON public.onboarding_progress
      FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;

  -- Onboarding Coaching
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'onboarding_coaching' AND schemaname = 'public') THEN
    CREATE TABLE public.onboarding_coaching (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      step text NOT NULL,
      message text NOT NULL,
      response text,
      ai_suggestions jsonb DEFAULT '[]',
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      CONSTRAINT onboarding_coaching_pkey PRIMARY KEY (id)
    );
    CREATE INDEX idx_onboarding_coaching_user ON public.onboarding_coaching(user_id);
    ALTER TABLE public.onboarding_coaching ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own coaching" ON public.onboarding_coaching
      FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own coaching" ON public.onboarding_coaching
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Onboarding Daily Usage
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'onboarding_daily_usage' AND schemaname = 'public') THEN
    CREATE TABLE public.onboarding_daily_usage (
      id uuid NOT NULL DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      usage_date date NOT NULL DEFAULT CURRENT_DATE,
      actions_count integer DEFAULT 0,
      features_used text[] DEFAULT '{}',
      xp_earned integer DEFAULT 0,
      notes text,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      CONSTRAINT onboarding_daily_usage_pkey PRIMARY KEY (id),
      CONSTRAINT onboarding_daily_usage_user_date_unique UNIQUE (user_id, usage_date)
    );
    CREATE INDEX idx_onboarding_daily_user ON public.onboarding_daily_usage(user_id);
    ALTER TABLE public.onboarding_daily_usage ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view their own usage" ON public.onboarding_daily_usage
      FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own usage" ON public.onboarding_daily_usage
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update their own usage" ON public.onboarding_daily_usage
      FOR UPDATE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;
