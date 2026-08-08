-- Lesson exercises: one curated, runnable exercise per lesson + solve tracking for XP.

create table if not exists public.lesson_exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null unique references public.lessons(id) on delete cascade,
  language text not null default 'python',
  instructions text not null default '',
  starter_code text not null default '',
  solution_code text not null default '',
  hint text,
  passing_grade int not null default 70 check (passing_grade between 1 and 100),
  xp_reward int not null default 10 check (xp_reward >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_lesson_exercises_lesson on public.lesson_exercises (lesson_id);

create table if not exists public.exercise_solves (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.lesson_exercises(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score int check (score between 0 and 100),
  passed boolean not null default false,
  solved_at timestamptz not null default now(),
  unique (exercise_id, user_id)
);

create index if not exists idx_exercise_solves_user on public.exercise_solves (user_id);

alter table public.lesson_exercises enable row level security;
alter table public.exercise_solves enable row level security;

grant select on public.lesson_exercises to authenticated;
grant select, insert, update, delete on public.lesson_exercises to authenticated;
grant select, insert, update, delete on public.exercise_solves to authenticated;

-- Any signed-in learner can read exercises.
create policy "lesson_exercises_read_authenticated"
  on public.lesson_exercises for select
  using (auth.role() = 'authenticated');

-- Admins and the course creator (via lessons -> courses.created_by) manage exercises.
create policy "lesson_exercises_write_admin_or_creator"
  on public.lesson_exercises for all
  using (
    exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role in ('admin', 'super_admin'))
    or exists (
      select 1 from public.lessons l
      join public.courses c on c.id = l.course_id
      where l.id = lesson_exercises.lesson_id and c.created_by = auth.uid()
    )
  )
  with check (
    exists (select 1 from public.user_roles ur where ur.user_id = auth.uid() and ur.role in ('admin', 'super_admin'))
    or exists (
      select 1 from public.lessons l
      join public.courses c on c.id = l.course_id
      where l.id = lesson_exercises.lesson_id and c.created_by = auth.uid()
    )
  );

-- Users only see/insert their own solve records.
create policy "exercise_solves_own"
  on public.exercise_solves for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
