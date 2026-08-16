-- Support / Contributions
-- Records donations received via the Razorpay Payment Page (pages.razorpay.com/learnifyaisupport)
-- or added manually by admins. Frontend success is never trusted: rows are created by the
-- admin UI or the HMAC-verified webhook route only.

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  amount_inr int not null check (amount_inr > 0),
  donor_name text,
  donor_email text,
  anonymous boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  reference text,
  source text not null default 'razorpay_payment_page',
  message text,
  created_at timestamptz not null default now()
);

alter table public.contributions enable row level security;

-- No public / anon INSERT or UPDATE — frontend success is never trusted.
-- Only the service role (server functions + webhook) can read/write.
create policy "service role full access" on public.contributions
  for all to service_role using (true) with check (true);

alter table public.contributions replica identity full;

-- No public SELECT either — /support Impact metrics come from a server function
-- that returns aggregates only (count + total + anonymized recents).
