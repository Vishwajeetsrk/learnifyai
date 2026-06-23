ALTER TABLE profiles
ADD COLUMN show_banner boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN profiles.show_banner IS 'Whether the cover image/banner should be displayed on the public profile';