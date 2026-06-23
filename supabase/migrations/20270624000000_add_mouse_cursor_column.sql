ALTER TABLE profiles
ADD COLUMN mouse_cursor boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN profiles.mouse_cursor IS 'Whether the animated custom cursor is enabled';
