
-- 1. Bio on profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- 2. Cohorts
CREATE TABLE public.cohorts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL,
  course_id uuid,
  title text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'cohort', -- cohort | office_hours | study_group
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  capacity int NOT NULL DEFAULT 50,
  meeting_url text,
  status text NOT NULL DEFAULT 'scheduled', -- scheduled | live | ended | cancelled
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cohorts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cohorts TO authenticated;
GRANT ALL ON public.cohorts TO service_role;

ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view cohorts" ON public.cohorts FOR SELECT USING (true);
CREATE POLICY "Creators manage own cohorts" ON public.cohorts FOR ALL TO authenticated
  USING (auth.uid() = creator_id OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = creator_id OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_cohorts_updated_at BEFORE UPDATE ON public.cohorts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Cohort members
CREATE TABLE public.cohort_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id uuid NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member', -- member | host
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cohort_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.cohort_members TO authenticated;
GRANT ALL ON public.cohort_members TO service_role;

ALTER TABLE public.cohort_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authed view members" ON public.cohort_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users join cohorts" ON public.cohort_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave cohorts" ON public.cohort_members FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.cohorts c WHERE c.id = cohort_id AND c.creator_id = auth.uid()));

-- 4. Lesson views
CREATE TABLE public.lesson_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lesson_views_lesson ON public.lesson_views(lesson_id);

GRANT INSERT ON public.lesson_views TO anon, authenticated;
GRANT SELECT ON public.lesson_views TO authenticated;
GRANT ALL ON public.lesson_views TO service_role;

ALTER TABLE public.lesson_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone log a view" ON public.lesson_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authed view counts" ON public.lesson_views FOR SELECT TO authenticated USING (true);

-- 5. Creator withdrawals
CREATE TABLE public.creator_withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_inr numeric NOT NULL CHECK (amount_inr > 0),
  method text NOT NULL DEFAULT 'bank', -- bank | upi | paypal
  destination jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending', -- pending | approved | rejected | paid
  admin_notes text,
  processed_at timestamptz,
  processed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.creator_withdrawals TO authenticated;
GRANT ALL ON public.creator_withdrawals TO service_role;

ALTER TABLE public.creator_withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own withdrawals" ON public.creator_withdrawals FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users request withdrawal" ON public.creator_withdrawals FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update withdrawals" ON public.creator_withdrawals FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'super_admin') OR has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_creator_withdrawals_updated_at BEFORE UPDATE ON public.creator_withdrawals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
