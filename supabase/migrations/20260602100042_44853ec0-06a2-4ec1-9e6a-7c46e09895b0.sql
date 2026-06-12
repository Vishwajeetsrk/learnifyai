
-- Fix search_path on set_updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Restrict execution to required roles
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_user() to service_role, supabase_auth_admin;

revoke execute on function public.set_updated_at() from public, anon;
grant execute on function public.set_updated_at() to authenticated, service_role;
