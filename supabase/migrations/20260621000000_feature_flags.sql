-- Create Feature Flags table
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  enabled boolean DEFAULT true,
  roles text[] DEFAULT ARRAY['super_admin', 'admin', 'creator', 'student']::text[],
  subscription_tiers text[] DEFAULT ARRAY['free', 'starter', 'pro', 'team']::text[],
  maintenance_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for feature flags"
  ON feature_flags FOR SELECT
  USING (true);

CREATE POLICY "Admin write access for feature flags"
  ON feature_flags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

-- Insert Default Flags
INSERT INTO feature_flags (key, name, description, enabled) VALUES
('community', 'Community Feed', 'Social learning feed and groups', true),
('coaching', 'Coaching Hub', '1-on-1 coaching scheduling and cohorts', true),
('ai_tools', 'AI Tools', 'AI-powered quiz generation and chatbots', true),
('playground', 'Playground', 'Multi-language code execution playground', true),
('wallet', 'Wallet', 'Credits and transactions', true),
('course_builder', 'Course Builder', 'Creator studio for building courses', true),
('certificates', 'Certificates', 'Certificate issuance and verification', true);
