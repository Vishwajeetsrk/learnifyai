-- Extended profile fields for settings page
alter table public.profiles
  add column if not exists username text unique,
  add column if not exists location text,
  add column if not exists work text,
  add column if not exists education text,
  add column if not exists website text,
  add column if not exists skills text[] default '{}';

create index if not exists idx_profiles_username on public.profiles(username);
