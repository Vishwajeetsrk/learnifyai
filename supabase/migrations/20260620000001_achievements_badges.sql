-- Add category and course_id to badges for course-specific achievements
alter table public.badges
  add column if not exists category text not null default 'xp'
  check (category in ('xp', 'course', 'streak', 'test', 'challenge'));

alter table public.badges
  add column if not exists course_id uuid references public.courses(id) on delete cascade;

create index if not exists idx_badges_category on public.badges(category);
create index if not exists idx_badges_course on public.badges(course_id);
