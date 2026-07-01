-- Student verification: add columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS student_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS student_email text,
  ADD COLUMN IF NOT EXISTS student_verification_otp text,
  ADD COLUMN IF NOT EXISTS student_verification_otp_expires timestamptz;

-- Index for quick lookup by student email
CREATE INDEX IF NOT EXISTS idx_profiles_student_email ON public.profiles (student_email);

-- RLS: users can read their own student verification status
-- (existing profile read policies already cover this)
