-- Job applications: persistent storage for /careers applications + admin review

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_postings (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  experience text,
  resume_text text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'shortlisted', 'rejected', 'hired')),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.job_applications enable row level security;

create policy "Anyone can apply"
  on public.job_applications
  for insert
  to anon, authenticated
  with check (true);

create policy "Admins manage applications"
  on public.job_applications
  for all
  to authenticated
  using (
    has_role(auth.uid(), 'super_admin'::app_role)
    or has_role(auth.uid(), 'admin'::app_role)
  );

-- Seed default job postings so /careers is fully DB-driven
insert into public.job_postings (title, team, location, description, apply_url, active)
select 'Developer Relations & Community Advocate', 'Community', 'Bangalore, KA / Hybrid',
       'Build community developer momentum, deliver technical workshops, manage developer feedback loops, and lead hackathons for Learnify AI ecosystem.',
       null, true
where not exists (select 1 from public.job_postings where title = 'Developer Relations & Community Advocate');

insert into public.job_postings (title, team, location, description, apply_url, active)
select 'AI Course Creator & Technical Educator', 'Content & Curriculum', 'Remote · India',
       'Design production-grade AI & Full Stack courses, hands-on coding exercises, and video tutorials for Next.js 15, Python AI, and System Design.',
       null, true
where not exists (select 1 from public.job_postings where title = 'AI Course Creator & Technical Educator');

insert into public.job_postings (title, team, location, description, apply_url, active)
select 'Senior Full-Stack AI Engineer', 'Engineering', 'Remote · India / Global',
       'Architect AI-assisted learning interfaces, LLM prompt pipelines, TanStack Start features, real-time code execution backends, and Supabase RLS policies.',
       null, true
where not exists (select 1 from public.job_postings where title = 'Senior Full-Stack AI Engineer');
