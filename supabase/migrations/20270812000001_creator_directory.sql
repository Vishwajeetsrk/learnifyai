-- Public Creators & Coaches directory
-- 1) Structured profile fields on creator_applications (both apply forms use this table)
alter table public.creator_applications
  add column if not exists role text not null default 'creator',
  add column if not exists bio text,
  add column if not exists hourly_rate numeric,
  add column if not exists featured boolean not null default false,
  add column if not exists avatar_url text;

alter table public.creator_applications
  drop constraint if exists creator_applications_role_check;
alter table public.creator_applications
  add constraint creator_applications_role_check check (role in ('coach', 'creator'));

-- 2) Backfill legacy coach applications (they were tagged via a motivation prefix hack)
update public.creator_applications
set role = 'coach',
    hourly_rate = coalesce(nullif((regexp_match(motivation, 'Rate: ₹(\d+)'))[1], '')::numeric, 0),
    bio = nullif(trim(split_part(regexp_replace(motivation, '^\[COACH APPLICATION\][^.]*\.', ''), ' Photo: ', 1)), '')
where role = 'creator'
  and motivation like '[COACH APPLICATION]%';

-- 3) Public directory: anyone can read approved entries (so /creators and /coaches
--    show real data and update live when an admin approves/edits). The table
--    policy also powers realtime streaming to anonymous visitors. A safe view
--    (owned by the migration role, bypassing RLS on base tables) exposes only
--    directory-grade fields — profiles stays locked down.
drop policy if exists "Anyone can view approved directory entries" on public.creator_applications;
create policy "Anyone can view approved directory entries"
  on public.creator_applications
  for select
  to anon, authenticated
  using (status = 'approved' and role in ('coach', 'creator'));

drop view if exists public.public_directory_entries;
create view public.public_directory_entries as
  select
    a.id,
    a.user_id,
    a.role,
    a.status,
    a.expertise,
    a.bio,
    a.hourly_rate,
    a.featured,
    a.avatar_url,
    a.portfolio_url,
    p.full_name,
    p.avatar_url as profile_avatar_url
  from public.creator_applications a
  left join public.profiles p on p.id = a.user_id
  where a.status = 'approved' and a.role in ('coach', 'creator');

grant select on public.public_directory_entries to anon, authenticated;

-- 4) Realtime: broadcast changes so public pages + admin auto-refresh
alter publication supabase_realtime add table public.creator_applications;

-- 5) Public course catalog: approved creators show their real published-course
--    count on the public /creators directory (courses rows are metadata only)
drop policy if exists "Anyone can view published courses" on public.courses;
create policy "Anyone can view published courses"
  on public.courses
  for select
  to anon
  using (published = true);