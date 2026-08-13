-- Course Resources: downloadable study materials (PDF, cheatsheet, notes, image, video, content)
create table if not exists public.course_resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  type text not null default 'pdf' check (type in ('pdf', 'cheatsheet', 'notes', 'image', 'video', 'content')),
  file_url text not null,
  description text,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.course_resources enable row level security;

-- Anyone can view resources of published courses (mirrors the public course catalog)
drop policy if exists "Anyone can view course resources" on public.course_resources;
create policy "Anyone can view course resources"
  on public.course_resources
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_id and c.published = true
    )
  );

-- Course creators + admins manage their course resources
drop policy if exists "Creators manage course resources" on public.course_resources;
create policy "Creators manage course resources"
  on public.course_resources
  for all
  to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_id
        and (c.created_by = auth.uid() or has_role(auth.uid(), 'super_admin'::app_role) or has_role(auth.uid(), 'admin'::app_role))
    )
  )
  with check (
    exists (
      select 1 from public.courses c
      where c.id = course_id
        and (c.created_by = auth.uid() or has_role(auth.uid(), 'super_admin'::app_role) or has_role(auth.uid(), 'admin'::app_role))
    )
  );