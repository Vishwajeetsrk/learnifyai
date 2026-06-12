
-- ============ Creator subscriptions ============
CREATE TABLE public.creator_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL,
  creator_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subscriber_id, creator_id)
);

GRANT SELECT, INSERT, DELETE ON public.creator_subscriptions TO authenticated;
GRANT ALL ON public.creator_subscriptions TO service_role;

ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authed can view subscriptions"
  ON public.creator_subscriptions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users subscribe themselves"
  ON public.creator_subscriptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = subscriber_id AND subscriber_id <> creator_id);

CREATE POLICY "Users unsubscribe themselves"
  ON public.creator_subscriptions FOR DELETE TO authenticated
  USING (auth.uid() = subscriber_id);

CREATE INDEX idx_creator_subs_creator ON public.creator_subscriptions(creator_id);
CREATE INDEX idx_creator_subs_subscriber ON public.creator_subscriptions(subscriber_id);

-- ============ Lesson likes ============
CREATE TABLE public.lesson_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, user_id)
);

GRANT SELECT, INSERT, DELETE ON public.lesson_likes TO authenticated;
GRANT ALL ON public.lesson_likes TO service_role;

ALTER TABLE public.lesson_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authed can view likes"
  ON public.lesson_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users like as themselves"
  ON public.lesson_likes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users unlike themselves"
  ON public.lesson_likes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_lesson_likes_lesson ON public.lesson_likes(lesson_id);

-- ============ Lesson comments ============
CREATE TABLE public.lesson_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL,
  user_id uuid NOT NULL,
  body text NOT NULL CHECK (length(body) BETWEEN 1 AND 4000),
  parent_id uuid REFERENCES public.lesson_comments(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_comments TO authenticated;
GRANT ALL ON public.lesson_comments TO service_role;

ALTER TABLE public.lesson_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authed can view comments"
  ON public.lesson_comments FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users comment as themselves"
  ON public.lesson_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users edit own comments"
  ON public.lesson_comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users or admins delete comments"
  ON public.lesson_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'super_admin'::app_role));

CREATE INDEX idx_lesson_comments_lesson ON public.lesson_comments(lesson_id, created_at DESC);

CREATE TRIGGER trg_lesson_comments_updated
BEFORE UPDATE ON public.lesson_comments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Notify subscribers on new lesson ============
CREATE OR REPLACE FUNCTION public.notify_subscribers_new_lesson()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_creator uuid;
  v_course_title text;
BEGIN
  SELECT created_by, title INTO v_creator, v_course_title
    FROM public.courses WHERE id = NEW.course_id;

  IF v_creator IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, title, body, type)
  SELECT cs.subscriber_id,
         'New lesson: ' || NEW.title,
         'A new lesson was published in "' || coalesce(v_course_title, 'a course you follow') || '".',
         'lesson'
  FROM public.creator_subscriptions cs
  WHERE cs.creator_id = v_creator;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_subscribers_new_lesson
AFTER INSERT ON public.lessons
FOR EACH ROW EXECUTE FUNCTION public.notify_subscribers_new_lesson();
