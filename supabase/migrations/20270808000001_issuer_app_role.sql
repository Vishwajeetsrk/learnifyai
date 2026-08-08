-- Add the "issuer" app role used for certificate / invoice issuing team members.
-- Value is appended after "student" (last existing value) so it can never be
-- referenced before its creation.

do $$
begin
  if not exists (
    select 1 from pg_enum
    where enumtypid = 'public.app_role'::regtype and enumlabel = 'issuer'
  ) then
    alter type public.app_role add value 'issuer';
  end if;
end $$;
