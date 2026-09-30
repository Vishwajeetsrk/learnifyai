-- ================================================================
-- Coaches & Creators & AI Providers Tables with RLS
-- ================================================================

-- Table: public.coaches
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
    verification_status text NOT NULL DEFAULT 'unverified', -- 'verified', 'unverified'
    visibility text NOT NULL DEFAULT 'draft', -- 'published', 'draft', 'hidden', 'archived'
    featured boolean NOT NULL DEFAULT false,
    sort_order integer NOT NULL DEFAULT 0,
    is_demo boolean NOT NULL DEFAULT false,
    rating numeric(3,2) DEFAULT NULL,
    reviews_count integer DEFAULT 0,
    sessions_count integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table: public.creators
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
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;

-- RLS: Public can view only published, non-demo coaches and creators
CREATE POLICY "Public can view published real coaches"
    ON public.coaches FOR SELECT
    USING (visibility = 'published' AND is_demo = false);

CREATE POLICY "Public can view published real creators"
    ON public.creators FOR SELECT
    USING (visibility = 'published' AND is_demo = false);

-- RLS: Admins have full access
CREATE POLICY "Admins full access coaches"
    ON public.coaches FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins full access creators"
    ON public.creators FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
