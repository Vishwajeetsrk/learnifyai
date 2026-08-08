-- Certificate template unification: courses now link to canva_templates (JSON
-- designer templates) instead of the legacy flat certificate_templates table.

alter table public.courses drop constraint if exists courses_certificate_template_id_fkey;
alter table public.courses
  add constraint courses_certificate_template_id_fkey
  foreign key (certificate_template_id) references public.canva_templates(id)
  on delete set null;

-- Leaderboard prize system: admin-defined prizes per period + rank, and user claims.

create table if not exists public.leaderboard_prizes (
  id uuid primary key default gen_random_uuid(),
  period text not null check (period in ('weekly', 'all')),
  rank int not null check (rank between 1 and 3),
  name text not null,
  description text default '',
  icon text default '🎖️',
  item_type text not null check (item_type in ('xp', 'badge', 'avatar_frame', 'premium_resume', 'ai_credits', 'discount', 'store_item', 'custom')),
  item_value text default '',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (period, rank)
);

create table if not exists public.prize_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  period text not null check (period in ('weekly', 'all')),
  period_key text not null,
  rank int not null check (rank between 1 and 3),
  prize_id uuid references public.leaderboard_prizes(id) on delete set null,
  prize_name text not null,
  prize_icon text default '🎖️',
  item_type text not null,
  item_value text default '',
  status text not null default 'pending' check (status in ('pending', 'claimed', 'expired', 'revoked')),
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, period, period_key)
);

alter table public.prize_claims enable row level security;

create policy "Users read own prize claims"
  on public.prize_claims for select
  to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'super_admin'::app_role) or public.has_role(auth.uid(), 'admin'::app_role));

create policy "Service role manages prize claims"
  on public.prize_claims for all
  to service_role
  using (true)
  with check (true);

grant select on public.leaderboard_prizes to authenticated;
grant all on public.leaderboard_prizes to service_role;

create index if not exists idx_prize_claims_user on public.prize_claims(user_id, created_at desc);
create index if not exists idx_prize_claims_period on public.prize_claims(period, period_key);

-- Seed free digital prizes: weekly + all-time, ranks 1-3. Everything editable in admin.
insert into public.leaderboard_prizes (period, rank, name, description, icon, item_type, item_value) values
  ('weekly', 1, 'Weekly Champion Pack', '+150 XP · Gold Avatar Frame · Champion Badge · Premium Resume', '👑', 'xp', '150'),
  ('weekly', 2, 'Weekly Runner-Up Pack', '+100 XP · Silver Avatar Frame · Runner-Up Badge', '🥈', 'xp', '100'),
  ('weekly', 3, 'Weekly Bronze Pack', '+75 XP · Bronze Avatar Frame · Bronze Badge', '🥉', 'xp', '75'),
  ('all', 1, 'Hall of Fame — Legend', '+300 XP · Legend Avatar Frame · Hall of Fame Badge · Premium Resume · 500 AI Credits', '🏆', 'xp', '300'),
  ('all', 2, 'Hall of Fame — Elite', '+200 XP · Elite Avatar Frame · Hall of Fame Badge · 300 AI Credits', '🏅', 'xp', '200'),
  ('all', 3, 'Hall of Fame — Rising Star', '+100 XP · Rising Star Avatar Frame · Hall of Fame Badge', '⭐', 'xp', '100')
on conflict (period, rank) do nothing;

-- Leaderboard winner email template.
insert into public.email_templates (id, name, subject, html_body, description, variables, updated_by)
values (
  'leaderboard_winner',
  'Leaderboard Winner',
  'You made the Top 3 on the {{period}} leaderboard, {{first_name}}! 🏆',
  '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f8f9fb;color:#1e293b"><div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e2e8f0;text-align:center"><div style="font-size:48px">{{icon}}</div><h1 style="margin:12px 0 4px;font-size:22px;color:#0f172a">You ranked #{{rank}} {{period_label}}!</h1><p style="color:#64748b;margin:8px 0 24px">Your hard work paid off. Claim your prize before it expires.</p><div style="background:#f1f5f9;border-radius:12px;padding:16px;margin-bottom:24px"><p style="margin:0;font-weight:700;color:#6B5BFB">{{prize_name}}</p><p style="margin:4px 0 0;font-size:13px;color:#64748b">{{description}}</p></div><a href="{{claim_url}}" style="display:inline-block;background:#6B5BFB;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:999px;font-weight:700">Claim My Prize</a><p style="margin-top:20px;font-size:12px;color:#94a3b8">Learnify AI · Learn, earn XP, rise to the top</p></div></div>',
  'Sent to weekly/all-time leaderboard top-3 winners with claim link.',
  array['first_name', 'period', 'period_label', 'rank', 'icon', 'prize_name', 'description', 'claim_url'],
  null
)
on conflict (id) do update set html_body = excluded.html_body;
