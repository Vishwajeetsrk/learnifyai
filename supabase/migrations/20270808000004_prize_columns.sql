-- Prize delivery columns on profiles: avatar frame for profile display,
-- premium resume expiry, and AI credit balance handled by ai_credits table.

alter table public.profiles add column if not exists prize_avatar_frame text;
alter table public.profiles add column if not exists resume_premium_until timestamptz;
