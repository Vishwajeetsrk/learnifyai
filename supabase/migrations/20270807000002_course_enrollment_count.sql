-- Add enrollment_count to courses with trigger sync from enrollments
alter table public.courses
  add column if not exists enrollment_count integer not null default 0;

update public.courses c
set enrollment_count = (
  select count(*) from public.enrollments e where e.course_id = c.id
);

create or replace function public.sync_course_enrollment_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.courses
    set enrollment_count = enrollment_count + 1
    where id = new.course_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.courses
    set enrollment_count = greatest(enrollment_count - 1, 0)
    where id = old.course_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_sync_course_enrollment_count on public.enrollments;
create trigger trg_sync_course_enrollment_count
after insert or delete on public.enrollments
for each row execute function public.sync_course_enrollment_count();

revoke all on function public.sync_course_enrollment_count() from public, anon, authenticated;
