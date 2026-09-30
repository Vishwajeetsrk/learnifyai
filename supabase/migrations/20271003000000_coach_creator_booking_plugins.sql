-- =============================================================================
-- Migration: 20271003000000_coach_creator_booking_plugins.sql
-- Description: Adds booking_settings, service_tiers, and coach_bookings table with RLS
-- Integrates plugins: Gmail, Google Meet, Zoom, Cal.com, Microsoft Teams
-- =============================================================================

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
  service_tiers jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS public.coach_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
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

ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_bookings ENABLE ROW LEVEL SECURITY;
