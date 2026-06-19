-- XP Log for weekly leaderboard tracking
create table if not exists public.xp_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount int not null,
  source text not null default 'lesson',
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table public.xp_log enable row level security;

create policy "Users can read own XP log"
  on public.xp_log for select
  using (user_id = auth.uid());

create policy "Service role can insert XP log"
  on public.xp_log for insert
  with check (true);

create index idx_xp_log_user on public.xp_log(user_id);
create index idx_xp_log_created on public.xp_log(created_at desc);
create index idx_xp_log_weekly on public.xp_log(user_id, created_at desc);
