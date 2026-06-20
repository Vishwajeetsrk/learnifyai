-- Email templates table for admin-editable email content
CREATE TABLE IF NOT EXISTS public.email_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  description TEXT,
  variables TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write email templates
CREATE POLICY "email_templates_select" ON public.email_templates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "email_templates_insert" ON public.email_templates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "email_templates_update" ON public.email_templates
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('admin', 'super_admin')
    )
  );

-- Insert default email templates
INSERT INTO public.email_templates (id, name, subject, description, variables, html_body) VALUES

('welcome', 'Welcome Email', 'Welcome to Learnify AI, {{name}}! 🎉',
 'Sent when a new user signs up',
 ARRAY['name', 'email'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <img src="https://learnifyaitool.vercel.app/logo.png" alt="Learnify AI" width="120" style="display:block;margin:0 auto 16px;" />
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Welcome to Learnify AI</h1>
          <p style="margin:8px 0 0;color:#a5b4fc;font-size:16px;">Your AI-Powered Learning Journey Starts Now</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 24px;color:#e2e8f0;font-size:18px;font-weight:600;">Hello, {{name}}! 👋</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.7;">We''re thrilled to have you join <strong style="color:#6366f1;">Learnify AI</strong> — the AI-native learning platform built for the next generation of learners, creators, and developers.</p>
          <p style="margin:0 0 28px;color:#94a3b8;font-size:15px;line-height:1.7;">Here''s what you can explore right now:</p>
          <!-- Features Grid -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="48%" style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;vertical-align:top;">
                <div style="font-size:24px;margin-bottom:8px;">🤖</div>
                <div style="color:#e2e8f0;font-size:14px;font-weight:600;margin-bottom:4px;">AI Tutor</div>
                <div style="color:#64748b;font-size:13px;">Personalized 1-on-1 AI tutoring with Gemini & GPT models</div>
              </td>
              <td width="4%"></td>
              <td width="48%" style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;vertical-align:top;">
                <div style="font-size:24px;margin-bottom:8px;">💻</div>
                <div style="color:#e2e8f0;font-size:14px;font-weight:600;margin-bottom:4px;">Code Playground</div>
                <div style="color:#64748b;font-size:13px;">Run code in 25+ languages with AI-powered debugging</div>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
            <tr>
              <td width="48%" style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;vertical-align:top;">
                <div style="font-size:24px;margin-bottom:8px;">📚</div>
                <div style="color:#e2e8f0;font-size:14px;font-weight:600;margin-bottom:4px;">Expert Courses</div>
                <div style="color:#64748b;font-size:13px;">Video lessons, AI summaries, quizzes & certificates</div>
              </td>
              <td width="4%"></td>
              <td width="48%" style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;vertical-align:top;">
                <div style="font-size:24px;margin-bottom:8px;">🏆</div>
                <div style="color:#e2e8f0;font-size:14px;font-weight:600;margin-bottom:4px;">Gamification</div>
                <div style="color:#64748b;font-size:13px;">XP, streaks, badges & leaderboards to keep you motivated</div>
              </td>
            </tr>
          </table>
          <!-- CTA -->
          <div style="text-align:center;margin-top:36px;">
            <a href="https://learnifyaitool.vercel.app/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;letter-spacing:0.3px;">Start Learning Now →</a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0 0 8px;color:#475569;font-size:13px;">© 2025 Learnify AI · All rights reserved</p>
          <p style="margin:0;color:#334155;font-size:12px;">You''re receiving this because you signed up at <a href="https://learnifyaitool.vercel.app" style="color:#6366f1;text-decoration:none;">learnifyaitool.vercel.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>'),

('password_reset', 'Password Reset', 'Reset your Learnify AI password 🔐',
 'Sent when a user requests a password reset',
 ARRAY['name', 'reset_link'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Password - Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <img src="https://learnifyaitool.vercel.app/logo.png" alt="Learnify AI" width="120" style="display:block;margin:0 auto 16px;" />
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Password Reset Request</h1>
          <p style="margin:8px 0 0;color:#a5b4fc;font-size:15px;">Secure your account</p>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;">Hi {{name}},</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.7;">We received a request to reset the password for your Learnify AI account. Click the button below to create a new password.</p>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center;">
            <p style="margin:0 0 8px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1px;">RESET LINK</p>
            <a href="{{reset_link}}" style="color:#6366f1;font-size:14px;word-break:break-all;text-decoration:none;">{{reset_link}}</a>
          </div>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="{{reset_link}}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Reset My Password</a>
          </div>
          <div style="background:#172033;border:1px solid #1e3a5f;border-radius:10px;padding:16px;">
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">⚠️ This link expires in <strong style="color:#f59e0b;">1 hour</strong>. If you didn''t request a reset, you can safely ignore this email.</p>
          </div>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© 2025 Learnify AI · <a href="https://learnifyaitool.vercel.app" style="color:#6366f1;text-decoration:none;">learnifyaitool.vercel.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>'),

('course_enrolled', 'Course Enrollment Confirmation', 'You''re enrolled in {{course_title}}! 🎓',
 'Sent when a user purchases or enrolls in a course',
 ARRAY['name', 'course_title', 'course_url'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Course Enrollment - Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#064e3b 0%,#065f46 50%,#064e3b 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <img src="https://learnifyaitool.vercel.app/logo.png" alt="Learnify AI" width="120" style="display:block;margin:0 auto 16px;" />
          <p style="margin:0 0 8px;color:#6ee7b7;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">ENROLLMENT CONFIRMED</p>
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">You''re all set! 🎉</h1>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;">Hi {{name}},</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.7;">You''re officially enrolled in:</p>
          <div style="background:#0f172a;border:1px solid #334155;border-left:4px solid #10b981;border-radius:8px;padding:20px;margin:0 0 28px;">
            <p style="margin:0;color:#10b981;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">COURSE</p>
            <p style="margin:0;color:#e2e8f0;font-size:18px;font-weight:600;">{{course_title}}</p>
          </div>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="{{course_url}}" style="display:inline-block;background:linear-gradient(135deg,#059669,#10b981);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Start Learning →</a>
          </div>
          <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">Happy learning! If you have any questions, reply to this email or visit our <a href="https://learnifyaitool.vercel.app/support" style="color:#6366f1;text-decoration:none;">support page</a>.</p>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© 2025 Learnify AI · <a href="https://learnifyaitool.vercel.app" style="color:#6366f1;text-decoration:none;">learnifyaitool.vercel.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>'),

('certificate_issued', 'Certificate Issued', 'Your certificate is ready! 🏆 {{course_title}}',
 'Sent when a course completion certificate is generated',
 ARRAY['name', 'course_title', 'certificate_url'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Certificate Issued - Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#451a03 0%,#78350f 50%,#451a03 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <img src="https://learnifyaitool.vercel.app/logo.png" alt="Learnify AI" width="120" style="display:block;margin:0 auto 16px;" />
          <p style="margin:0 0 8px;color:#fcd34d;font-size:14px;font-weight:600;letter-spacing:1px;">🏆 CONGRATULATIONS</p>
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">Your Certificate is Ready!</h1>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;">Hi {{name}},</p>
          <p style="margin:0 0 20px;color:#94a3b8;font-size:15px;line-height:1.7;">You''ve successfully completed <strong style="color:#fbbf24;">{{course_title}}</strong>. Your verified certificate of completion is now ready!</p>
          <div style="background:linear-gradient(135deg,#451a03,#78350f);border:1px solid #92400e;border-radius:12px;padding:24px;text-align:center;margin:0 0 28px;">
            <p style="margin:0 0 4px;color:#fcd34d;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">VERIFIED CERTIFICATE</p>
            <p style="margin:0;color:#fff;font-size:16px;font-weight:600;">{{course_title}}</p>
          </div>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="{{certificate_url}}" style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Download Certificate</a>
          </div>
          <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">Share your achievement on LinkedIn or other social media to showcase your skills!</p>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© 2025 Learnify AI · <a href="https://learnifyaitool.vercel.app" style="color:#6366f1;text-decoration:none;">learnifyaitool.vercel.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>'),

('subscription_activated', 'Subscription Activated', 'Your {{plan_name}} plan is now active! ⚡',
 'Sent when a user successfully subscribes to a plan',
 ARRAY['name', 'plan_name', 'plan_price', 'next_billing_date'],
 '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Subscription Active - Learnify AI</title>
</head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;min-height:100vh;">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
          <img src="https://learnifyaitool.vercel.app/logo.png" alt="Learnify AI" width="120" style="display:block;margin:0 auto 16px;" />
          <p style="margin:0 0 8px;color:#a5b4fc;font-size:13px;font-weight:600;letter-spacing:1px;">⚡ SUBSCRIPTION ACTIVE</p>
          <h1 style="margin:0;color:#fff;font-size:26px;font-weight:700;">{{plan_name}} Plan Activated</h1>
        </td></tr>
        <tr><td style="background:#1e293b;padding:40px;">
          <p style="margin:0 0 20px;color:#e2e8f0;font-size:16px;">Hi {{name}},</p>
          <p style="margin:0 0 24px;color:#94a3b8;font-size:15px;line-height:1.7;">Your <strong style="color:#6366f1;">{{plan_name}}</strong> subscription is now active. Enjoy unlimited access to all platform features!</p>
          <div style="background:#0f172a;border:1px solid #334155;border-radius:12px;padding:20px;margin:0 0 28px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="color:#64748b;font-size:13px;padding:6px 0;">Plan</td>
                <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;padding:6px 0;">{{plan_name}}</td>
              </tr>
              <tr>
                <td style="color:#64748b;font-size:13px;padding:6px 0;border-top:1px solid #1e293b;">Amount</td>
                <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;padding:6px 0;border-top:1px solid #1e293b;">{{plan_price}}</td>
              </tr>
              <tr>
                <td style="color:#64748b;font-size:13px;padding:6px 0;border-top:1px solid #1e293b;">Next Billing</td>
                <td style="color:#e2e8f0;font-size:13px;font-weight:600;text-align:right;padding:6px 0;border-top:1px solid #1e293b;">{{next_billing_date}}</td>
              </tr>
            </table>
          </div>
          <div style="text-align:center;">
            <a href="https://learnifyaitool.vercel.app/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 40px;border-radius:50px;">Go to Dashboard →</a>
          </div>
        </td></tr>
        <tr><td style="background:#0f172a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;border-top:1px solid #1e293b;">
          <p style="margin:0;color:#475569;font-size:12px;">© 2025 Learnify AI · <a href="https://learnifyaitool.vercel.app" style="color:#6366f1;text-decoration:none;">learnifyaitool.vercel.app</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  html_body = EXCLUDED.html_body,
  description = EXCLUDED.description,
  variables = EXCLUDED.variables,
  updated_at = now();
