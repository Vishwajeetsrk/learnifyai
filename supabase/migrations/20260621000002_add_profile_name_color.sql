-- Add name_color column to public.profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name_color text;
