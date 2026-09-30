const { Client } = require('pg');

const connectionConfig = {
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 5432,
  user: 'postgres.gnvsqwyexjuuwkjibxrr',
  password: '#KingKhan15112003',
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
};

async function main() {
  const client = new Client(connectionConfig);
  await client.connect();

  console.log('Connected to PostgreSQL database...');

  // 1. Create table public.coaches
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.coaches (
      id text NOT NULL PRIMARY KEY,
      name text NOT NULL,
      photo text NOT NULL,
      title text NOT NULL,
      expertise text NOT NULL,
      bio text NOT NULL,
      hourly_rate numeric(10,2) NOT NULL DEFAULT 999,
      currency text NOT NULL DEFAULT 'INR',
      languages text[] NOT NULL DEFAULT ARRAY['English'],
      availability text NOT NULL DEFAULT 'Weekdays & Evenings',
      verification_status text NOT NULL DEFAULT 'unverified',
      visibility text NOT NULL DEFAULT 'draft',
      featured boolean NOT NULL DEFAULT false,
      sort_order integer NOT NULL DEFAULT 0,
      is_demo boolean NOT NULL DEFAULT false,
      rating numeric(3,2) DEFAULT NULL,
      reviews_count integer DEFAULT 0,
      sessions_count integer DEFAULT 0,
      booking_settings jsonb DEFAULT '{
        "enabled": true,
        "plugins": {
          "gmail": { "enabled": true, "email": "support.learnifyai@gmail.com", "sync_calendar": true },
          "google_meet": { "enabled": true, "auto_generate_link": true, "default_duration_mins": 45, "meeting_url": "" },
          "zoom": { "enabled": false, "personal_meeting_id": "", "meeting_url": "", "passcode": "" },
          "cal_com": { "enabled": false, "username": "", "event_slug": "30min", "embed_url": "" },
          "microsoft": { "enabled": false, "teams_meeting_url": "", "outlook_email": "" }
        },
        "lead_time_hours": 24,
        "buffer_mins": 15
      }'::jsonb,
      service_tiers jsonb DEFAULT '[
        {
          "id": "tier-quick-audit",
          "name": "30-Min Rapid Code & Career Audit",
          "duration_mins": 30,
          "price_inr": 499,
          "description": "High-impact review of your portfolio, resume, or current architecture challenge.",
          "delivery_mode": "google_meet",
          "features": ["30 min live Google Meet/Zoom", "Actionable bulleted feedback", "Session recording link"],
          "is_popular": false
        },
        {
          "id": "tier-deep-coaching",
          "name": "60-Min 1:1 System Design & Deep Coaching",
          "duration_mins": 60,
          "price_inr": 999,
          "description": "In-depth technical mentoring, whiteboarding, and customized learning roadmap.",
          "delivery_mode": "google_meet",
          "features": ["60 min deep dive session", "Architecture diagram review", "Personalized 90-day learning path", "Direct follow-up chat"],
          "is_popular": true
        },
        {
          "id": "tier-mock-interview",
          "name": "90-Min Full Mock Tech Interview & Report",
          "duration_mins": 90,
          "price_inr": 1499,
          "description": "Simulated live tech interview with realistic behavioral & coding rounds and score report.",
          "delivery_mode": "google_meet",
          "features": ["90 min live interview simulation", "Detailed scorecard on 5 competencies", "Salary negotiation tips", "Written strengths & gaps breakdown"],
          "is_popular": false
        }
      ]'::jsonb,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    );

    ALTER TABLE public.coaches
      ADD COLUMN IF NOT EXISTS booking_settings jsonb DEFAULT '{
        "enabled": true,
        "plugins": {
          "gmail": { "enabled": true, "email": "support.learnifyai@gmail.com", "sync_calendar": true },
          "google_meet": { "enabled": true, "auto_generate_link": true, "default_duration_mins": 45, "meeting_url": "" },
          "zoom": { "enabled": false, "personal_meeting_id": "", "meeting_url": "", "passcode": "" },
          "cal_com": { "enabled": false, "username": "", "event_slug": "30min", "embed_url": "" },
          "microsoft": { "enabled": false, "teams_meeting_url": "", "outlook_email": "" }
        },
        "lead_time_hours": 24,
        "buffer_mins": 15
      }'::jsonb,
      ADD COLUMN IF NOT EXISTS service_tiers jsonb DEFAULT '[]'::jsonb;

    ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
  `);

  // 2. Create table public.creators
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.creators (
      id text NOT NULL PRIMARY KEY,
      name text NOT NULL,
      photo text NOT NULL,
      title text NOT NULL,
      expertise text NOT NULL,
      bio text NOT NULL,
      courses_count integer NOT NULL DEFAULT 0,
      social_links jsonb DEFAULT '{}'::jsonb,
      verification_status text NOT NULL DEFAULT 'unverified',
      visibility text NOT NULL DEFAULT 'draft',
      featured boolean NOT NULL DEFAULT false,
      sort_order integer NOT NULL DEFAULT 0,
      is_demo boolean NOT NULL DEFAULT false,
      booking_settings jsonb DEFAULT '{
        "enabled": true,
        "plugins": {
          "gmail": { "enabled": true, "email": "support.learnifyai@gmail.com", "sync_calendar": true },
          "google_meet": { "enabled": true, "auto_generate_link": true, "default_duration_mins": 45, "meeting_url": "" },
          "zoom": { "enabled": false, "personal_meeting_id": "", "meeting_url": "", "passcode": "" },
          "cal_com": { "enabled": false, "username": "", "event_slug": "30min", "embed_url": "" },
          "microsoft": { "enabled": false, "teams_meeting_url": "", "outlook_email": "" }
        },
        "lead_time_hours": 24,
        "buffer_mins": 15
      }'::jsonb,
      service_tiers jsonb DEFAULT '[]'::jsonb,
      created_at timestamp with time zone NOT NULL DEFAULT now(),
      updated_at timestamp with time zone NOT NULL DEFAULT now()
    );

    ALTER TABLE public.creators
      ADD COLUMN IF NOT EXISTS booking_settings jsonb DEFAULT '{
        "enabled": true,
        "plugins": {
          "gmail": { "enabled": true, "email": "support.learnifyai@gmail.com", "sync_calendar": true },
          "google_meet": { "enabled": true, "auto_generate_link": true, "default_duration_mins": 45, "meeting_url": "" },
          "zoom": { "enabled": false, "personal_meeting_id": "", "meeting_url": "", "passcode": "" },
          "cal_com": { "enabled": false, "username": "", "event_slug": "30min", "embed_url": "" },
          "microsoft": { "enabled": false, "teams_meeting_url": "", "outlook_email": "" }
        },
        "lead_time_hours": 24,
        "buffer_mins": 15
      }'::jsonb,
      ADD COLUMN IF NOT EXISTS service_tiers jsonb DEFAULT '[]'::jsonb;

    ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
  `);

  // 3. Create table public.coach_bookings
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.coach_bookings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      coach_id TEXT NOT NULL,
      user_id UUID,
      student_name TEXT NOT NULL,
      student_email TEXT NOT NULL,
      student_notes TEXT DEFAULT '',
      tier_id TEXT NOT NULL,
      tier_name TEXT NOT NULL,
      duration_mins INT NOT NULL DEFAULT 45,
      price_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
      meeting_provider TEXT NOT NULL DEFAULT 'google_meet',
      meeting_url TEXT DEFAULT '',
      scheduled_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    ALTER TABLE public.coach_bookings ENABLE ROW LEVEL SECURITY;
  `);

  // 4. Policies
  await client.query(`
    DO $$
    BEGIN
      -- public.coaches policies
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coaches' AND policyname = 'Public can view published real coaches') THEN
        CREATE POLICY "Public can view published real coaches" ON public.coaches FOR SELECT USING (visibility = 'published' AND is_demo = false);
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coaches' AND policyname = 'Admins full access coaches') THEN
        CREATE POLICY "Admins full access coaches" ON public.coaches FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
      END IF;

      -- public.creators policies
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creators' AND policyname = 'Public can view published real creators') THEN
        CREATE POLICY "Public can view published real creators" ON public.creators FOR SELECT USING (visibility = 'published' AND is_demo = false);
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'creators' AND policyname = 'Admins full access creators') THEN
        CREATE POLICY "Admins full access creators" ON public.creators FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
      END IF;

      -- public.coach_bookings policies
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_bookings' AND policyname = 'Users can view their own bookings') THEN
        CREATE POLICY "Users can view their own bookings" ON public.coach_bookings FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_bookings' AND policyname = 'Public can insert bookings') THEN
        CREATE POLICY "Public can insert bookings" ON public.coach_bookings FOR INSERT TO public WITH CHECK (true);
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_bookings' AND policyname = 'Admin can update bookings') THEN
        CREATE POLICY "Admin can update bookings" ON public.coach_bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
      END IF;
    END $$;
  `);

  console.log('Tables, columns, and RLS policies created successfully in PostgreSQL!');
  await client.end();
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
