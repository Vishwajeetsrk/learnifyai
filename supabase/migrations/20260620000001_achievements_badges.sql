CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon_url text NOT NULL,
  xp_required integer,
  course_required integer,
  streak_required integer,
  test_required integer,
  challenge_required integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Add category and course_id to badges for course-specific achievements
alter table public.badges
  add column if not exists category text not null default 'xp'
  check (category in ('xp', 'course', 'streak', 'test', 'challenge'));

alter table public.badges
  add column if not exists course_id uuid references public.courses(id) on delete cascade;

create index if not exists idx_badges_category on public.badges(category);
create index if not exists idx_badges_course on public.badges(course_id);
