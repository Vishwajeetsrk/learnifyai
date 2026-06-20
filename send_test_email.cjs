const nodemailer = require('nodemailer');

const GMAIL_EMAIL = 'vishwajeetsrk@gmail.com';
const GMAIL_APP_PASSWORD = 'yuydvvbohchnmani';

// ─── SVG Icons (inline, no emoji) ─────────────────────────────────────
const SVG = {
  // Learnify AI Logo as inline SVG (recreated from the brand)
  logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#2563eb"/>
        <stop offset="100%" style="stop-color:#06b6d4"/>
      </linearGradient>
    </defs>
    <!-- Letter L shape -->
    <path d="M18 12 L18 58 L52 58 L52 48 L30 48 L30 12 Z" fill="url(#lg1)" rx="4"/>
    <!-- Graduation cap -->
    <ellipse cx="42" cy="10" rx="16" ry="5" fill="#1e293b"/>
    <polygon points="42,5 58,10 42,15 26,10" fill="#0f172a"/>
    <rect x="55" y="10" width="2" height="8" fill="#1e293b"/>
    <circle cx="56" cy="18" r="2" fill="#6366f1"/>
    <!-- Sparkle star -->
    <path d="M56 25 L57.2 28 L60 28 L57.8 30 L58.6 33 L56 31.5 L53.4 33 L54.2 30 L52 28 L54.8 28 Z" fill="#38bdf8"/>
  </svg>`,

  // Brain/AI icon
  ai: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.16Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.16Z"/>
  </svg>`,

  // Code icon
  code: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>`,

  // Book/Course icon
  book: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>`,

  // Trophy/Achievement icon
  trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>`,

  // Star badge
  star: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>`,

  // Certificate/Scroll icon (large)
  certificate: `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>`,

  // Shield/Security
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>`,

  // Checkmark circle
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>`,

  // Medal (Achievement badge background) - large award icon
  medal: `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="8" fill="url(#medalGrad)" stroke="#d97706" stroke-width="1"/>
    <circle cx="12" cy="12" r="5" fill="none" stroke="#fde68a" stroke-width="0.8"/>
    <polygon points="12 7 13.5 10.5 17 10.8 14.5 13 15.4 16.5 12 14.5 8.6 16.5 9.5 13 7 10.8 10.5 10.5" fill="#fbbf24" stroke="none"/>
    <defs>
      <linearGradient id="medalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f59e0b"/>
        <stop offset="100%" style="stop-color:#d97706"/>
      </linearGradient>
    </defs>
  </svg>`,

  // Sparkle / completion
  sparkle: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#a5b4fc">
    <path d="M12 2L14.4 9.6H22L15.8 14.4L18.2 22L12 17.2L5.8 22L8.2 14.4L2 9.6H9.6L12 2Z"/>
  </svg>`,

  // Lock (password reset)
  lock: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <circle cx="12" cy="16" r="1" fill="#6366f1"/>
  </svg>`,

  // Zap / subscription
  zap: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#6366f1" stroke="#4f46e5" stroke-width="0.5">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>`,

  // Arrow right (CTA)
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-left:6px;">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>`,
};

// ─── Shared Email Parts ────────────────────────────────────────────────────────
const LOGO_URL = 'https://raw.githubusercontent.com/Vishwajeetsrk/learnifyai/main/src/assets/learnify-logo.png';

function emailHeader(accentColor = '#312e81', accentColor2 = '#1e1b4b') {
  return `<tr><td style="background:linear-gradient(135deg,${accentColor2} 0%,${accentColor} 60%,${accentColor2} 100%);border-radius:20px 20px 0 0;padding:40px 40px 36px;text-align:center;">
    <img src="${LOGO_URL}" alt="Learnify AI" width="110" height="auto" style="display:block;margin:0 auto 20px;max-width:110px;" />
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:50px;padding:5px 16px;margin-bottom:20px;">
      <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#10b981;box-shadow:0 0 8px #10b981;"></span>
      <span style="color:#a5b4fc;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">LEARNIFY AI</span>
    </div>`;
}

function emailFooter() {
  return `<tr><td style="background:#0a0f1e;border-radius:0 0 20px 20px;padding:28px 40px;text-align:center;border-top:1px solid #1e293b;">
    <div style="margin-bottom:16px;">
      <a href="https://learnifyaitool.vercel.app" style="color:#6366f1;text-decoration:none;font-size:13px;font-weight:500;">learnifyaitool.vercel.app</a>
    </div>
    <div style="margin-bottom:12px;">
      <a href="https://learnifyaitool.vercel.app/privacy" style="color:#475569;text-decoration:none;font-size:12px;margin:0 12px;">Privacy</a>
      <a href="https://learnifyaitool.vercel.app/terms" style="color:#475569;text-decoration:none;font-size:12px;margin:0 12px;">Terms</a>
      <a href="https://learnifyaitool.vercel.app/contact" style="color:#475569;text-decoration:none;font-size:12px;margin:0 12px;">Contact</a>
    </div>
    <p style="margin:0;color:#334155;font-size:11px;line-height:1.6;">
      © ${new Date().getFullYear()} Learnify AI · Made with care for lifelong learners<br/>
      <span style="color:#1e293b;">You're receiving this because you have an account at Learnify AI</span>
    </p>
  </td></tr>`;
}

function emailWrapper(content) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="color-scheme" content="dark"/>
  <title>Learnify AI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; }
    body { margin:0;padding:0;background:#050d1a;font-family:'Inter',system-ui,sans-serif; }
    a { color:#6366f1; }
  </style>
</head>
<body style="margin:0;padding:0;background:#050d1a;font-family:'Inter',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#050d1a;min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;border:1px solid #1e293b;border-radius:20px;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.6);">
        ${content}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── WELCOME EMAIL ─────────────────────────────────────────────────────────────
function makeWelcomeEmail(name) {
  const features = [
    { icon: SVG.ai, title: 'AI Tutor', desc: 'Personalized tutoring with Gemini, GPT & Groq multi-model AI', color: '#6366f1' },
    { icon: SVG.code, title: 'Code Playground', desc: 'Run 25+ languages with AI debug assist & web preview', color: '#06b6d4' },
    { icon: SVG.book, title: 'Expert Courses', desc: 'Video lessons, AI summaries, quizzes & certificates', color: '#8b5cf6' },
    { icon: SVG.trophy, title: 'Achievements', desc: 'XP, streaks, badges & ranked leaderboards', color: '#f59e0b' },
  ];

  const featureRows = features.map(f => `
    <td width="47%" style="background:#0d1424;border:1px solid #1e2d45;border-left:3px solid ${f.color};border-radius:12px;padding:18px;vertical-align:top;">
      <div style="margin-bottom:10px;">${f.icon}</div>
      <div style="color:#e2e8f0;font-size:14px;font-weight:700;margin-bottom:4px;">${f.title}</div>
      <div style="color:#64748b;font-size:12px;line-height:1.6;">${f.desc}</div>
    </td>`
  );

  const content = `
    ${emailHeader('#312e81', '#1e1b4b')}
      <h1 style="margin:0 0 8px;color:#fff;font-size:30px;font-weight:800;letter-spacing:-0.5px;">Welcome aboard!</h1>
      <p style="margin:0;color:#a5b4fc;font-size:16px;">Your AI learning journey starts today.</p>
    </td></tr>

    <tr><td style="background:#0d1424;padding:40px;">
      <p style="margin:0 0 8px;color:#e2e8f0;font-size:20px;font-weight:700;">Hello, ${name}</p>
      <p style="margin:0 0 28px;color:#94a3b8;font-size:15px;line-height:1.7;">
        We're excited to have you join <strong style="color:#6366f1;">Learnify AI</strong> — the AI-native platform designed for modern learners who want to learn smarter and grow faster.
      </p>

      <!-- Features Grid -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
        <tr>
          ${featureRows[0]}
          <td width="6%"></td>
          ${featureRows[1]}
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          ${featureRows[2]}
          <td width="6%"></td>
          ${featureRows[3]}
        </tr>
      </table>

      <!-- CTA Button -->
      <div style="text-align:center;margin-bottom:32px;">
        <a href="https://learnifyaitool.vercel.app/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 44px;border-radius:50px;letter-spacing:0.3px;box-shadow:0 8px 32px rgba(99,102,241,0.4);">
          Explore Your Dashboard ${SVG.arrowRight}
        </a>
      </div>

      <!-- Quick start steps -->
      <div style="background:#0a0f1e;border:1px solid #1e293b;border-radius:14px;padding:24px;">
        <p style="margin:0 0 16px;color:#6366f1;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">QUICK START GUIDE</p>
        ${['Complete your profile', 'Explore the AI Tutor', 'Pick your first course', 'Run code in the Playground'].map((step, i) => `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:${i < 3 ? '12px' : '0'};">
          <div style="flex-shrink:0;width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;text-align:center;line-height:26px;">${i+1}</div>
          <span style="color:#cbd5e1;font-size:14px;">${step}</span>
        </div>`).join('')}
      </div>
    </td></tr>
    ${emailFooter()}`;

  return emailWrapper(content);
}

// ─── CERTIFICATE EMAIL ────────────────────────────────────────────────────────
function makeCertificateEmail(name, courseName, certificateUrl) {
  const content = `
    ${emailHeader('#451a03', '#1c0a00')}
      <!-- Achievement Badge SVG -->
      <div style="margin-bottom:20px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#92400e"/>
              <stop offset="50%" style="stop-color:#b45309"/>
              <stop offset="100%" style="stop-color:#78350f"/>
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#fde68a"/>
              <stop offset="50%" style="stop-color:#f59e0b"/>
              <stop offset="100%" style="stop-color:#d97706"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <!-- Outer ring -->
          <circle cx="50" cy="50" r="46" fill="url(#bgGrad)" stroke="#f59e0b" stroke-width="2.5"/>
          <!-- Inner ring -->
          <circle cx="50" cy="50" r="38" fill="none" stroke="#fde68a" stroke-width="1.2" stroke-dasharray="4 3"/>
          <!-- Star shape -->
          <polygon points="50,18 55.9,36.8 75.6,36.8 60.4,47.7 66.1,66.5 50,55.6 33.9,66.5 39.6,47.7 24.4,36.8 44.1,36.8"
            fill="url(#goldGrad)" filter="url(#glow)"/>
          <!-- Center check or ribbon -->
          <circle cx="50" cy="78" r="10" fill="url(#goldGrad)" stroke="#92400e" stroke-width="1.5"/>
          <polyline points="44,78 48,83 57,73" stroke="#451a03" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </div>
      <div style="display:inline-block;background:rgba(251,191,36,0.15);border:1px solid rgba(251,191,36,0.3);border-radius:50px;padding:6px 18px;margin-bottom:20px;">
        <span style="color:#fbbf24;font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;">ACHIEVEMENT UNLOCKED</span>
      </div>
      <h1 style="margin:0 0 8px;color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Congratulations!</h1>
      <p style="margin:0;color:#fde68a;font-size:15px;">You've completed your course with excellence.</p>
    </td></tr>

    <tr><td style="background:#0d1424;padding:40px;">
      <p style="margin:0 0 6px;color:#e2e8f0;font-size:19px;font-weight:700;">Well done, ${name}!</p>
      <p style="margin:0 0 28px;color:#94a3b8;font-size:15px;line-height:1.7;">
        You have successfully completed <strong style="color:#fbbf24;">${courseName}</strong>. Your verified certificate of completion is now ready to download and share.
      </p>

      <!-- Certificate Preview Card -->
      <div style="background:linear-gradient(135deg,#1c0a00,#451a03);border:1px solid #92400e;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;position:relative;">
        <!-- Decorative corners -->
        <div style="position:absolute;top:12px;left:12px;width:20px;height:20px;border-top:2px solid #f59e0b;border-left:2px solid #f59e0b;border-radius:2px;"></div>
        <div style="position:absolute;top:12px;right:12px;width:20px;height:20px;border-top:2px solid #f59e0b;border-right:2px solid #f59e0b;border-radius:2px;"></div>
        <div style="position:absolute;bottom:12px;left:12px;width:20px;height:20px;border-bottom:2px solid #f59e0b;border-left:2px solid #f59e0b;border-radius:2px;"></div>
        <div style="position:absolute;bottom:12px;right:12px;width:20px;height:20px;border-bottom:2px solid #f59e0b;border-right:2px solid #f59e0b;border-radius:2px;"></div>

        <p style="margin:0 0 4px;color:#fde68a;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">CERTIFICATE OF COMPLETION</p>
        <div style="width:50px;height:1px;background:linear-gradient(90deg,transparent,#f59e0b,transparent);margin:10px auto;"></div>
        <p style="margin:4px 0 6px;color:#fff;font-size:22px;font-weight:800;">${name}</p>
        <p style="margin:0 0 10px;color:#94a3b8;font-size:13px;">has successfully completed</p>
        <p style="margin:0 0 16px;color:#fbbf24;font-size:16px;font-weight:700;">${courseName}</p>
        <div style="width:50px;height:1px;background:linear-gradient(90deg,transparent,#f59e0b,transparent);margin:0 auto 14px;"></div>
        <p style="margin:0;color:#78350f;font-size:11px;">Learnify AI · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <!-- Achievement Stats Row -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td style="background:#0a0f1e;border:1px solid #1e293b;border-radius:12px;padding:16px;text-align:center;">
            <div style="margin-bottom:6px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div style="color:#fbbf24;font-size:18px;font-weight:800;">100%</div>
            <div style="color:#64748b;font-size:11px;">Completion</div>
          </td>
          <td width="12px"></td>
          <td style="background:#0a0f1e;border:1px solid #1e293b;border-radius:12px;padding:16px;text-align:center;">
            <div style="margin-bottom:6px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div style="color:#10b981;font-size:18px;font-weight:800;">Verified</div>
            <div style="color:#64748b;font-size:11px;">Certificate</div>
          </td>
          <td width="12px"></td>
          <td style="background:#0a0f1e;border:1px solid #1e293b;border-radius:12px;padding:16px;text-align:center;">
            <div style="margin-bottom:6px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            </div>
            <div style="color:#6366f1;font-size:18px;font-weight:800;">Top 5%</div>
            <div style="color:#64748b;font-size:11px;">Percentile</div>
          </td>
        </tr>
      </table>

      <!-- CTA Buttons -->
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${certificateUrl}" style="display:inline-block;background:linear-gradient(135deg,#d97706,#f59e0b);color:#fff;font-size:15px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:50px;margin-right:12px;box-shadow:0 8px 28px rgba(245,158,11,0.4);">
          Download Certificate
        </a>
      </div>

      <div style="background:#0a0f1e;border:1px solid #1e293b;border-radius:12px;padding:20px;text-align:center;">
        <p style="margin:0 0 8px;color:#94a3b8;font-size:14px;">Share your achievement</p>
        <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
          Add this certificate to your LinkedIn profile, resume, or portfolio to showcase your verified skills.
        </p>
      </div>
    </td></tr>
    ${emailFooter()}`;

  return emailWrapper(content);
}

// ─── SEND TEST CERTIFICATE ─────────────────────────────────────────────────────
async function main() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD }
  });

  // Send Certificate Email
  console.log('Sending certificate email...');
  const certHtml = makeCertificateEmail(
    'Vishwajeet',
    'Introduction to Artificial Intelligence & Machine Learning',
    'https://learnifyaitool.vercel.app/certificates/demo-vishwajeet'
  );

  const certInfo = await transporter.sendMail({
    from: '"Learnify AI" <vishwajeetsrk@gmail.com>',
    to: GMAIL_EMAIL,
    subject: 'Your Certificate is Ready — Introduction to Artificial Intelligence & Machine Learning',
    html: certHtml
  });
  console.log('Certificate email sent! ID:', certInfo.messageId);

  // Also send Welcome Email
  console.log('Sending welcome email...');
  const welcomeHtml = makeWelcomeEmail('Vishwajeet');
  const welcomeInfo = await transporter.sendMail({
    from: '"Learnify AI" <vishwajeetsrk@gmail.com>',
    to: GMAIL_EMAIL,
    subject: 'Welcome to Learnify AI — Your journey starts now',
    html: welcomeHtml
  });
  console.log('Welcome email sent! ID:', welcomeInfo.messageId);
  console.log('\nBoth emails delivered to', GMAIL_EMAIL);
}

main().catch(console.error);
