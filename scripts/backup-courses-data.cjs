const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function backup() {
  const backupDir = path.join(__dirname, 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  console.log(`Starting backup at ${timestamp}...`);

  // 1. Courses
  const { data: courses, error: cErr } = await sb.from('courses').select('*');
  if (cErr) throw cErr;

  // 2. Course Modules
  const { data: modules, error: mErr } = await sb.from('course_modules').select('*');
  if (mErr) throw mErr;

  // 3. Lessons
  const { data: lessons, error: lErr } = await sb.from('lessons').select('*');
  if (lErr) throw lErr;

  // 4. Site Settings
  const { data: settings, error: sErr } = await sb.from('site_settings').select('*');
  if (sErr) throw sErr;

  const backupData = {
    timestamp,
    counts: {
      courses: courses.length,
      modules: modules.length,
      lessons: lessons.length,
      settings: settings.length
    },
    courses,
    modules,
    lessons,
    settings
  };

  const backupFile = path.join(backupDir, `courses-backup-${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');

  console.log(`[✓] Backup successfully saved to ${backupFile}`);
  console.log(`Summary: ${courses.length} courses, ${modules.length} modules, ${lessons.length} lessons, ${settings.length} site_settings.`);
}

backup().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
