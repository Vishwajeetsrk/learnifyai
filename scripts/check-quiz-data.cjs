const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envTxt = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of envTxt.split(/\r?\n/)) {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
}

const supabase = createClient(env.SUPABASE_URL || env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('lesson_transcripts').select('lesson_id, quiz');
  if (error) {
    console.error('Error fetching lesson_transcripts:', error);
    return;
  }
  console.log('Total lesson_transcripts found:', data?.length);
  for (const row of data || []) {
    if (row.quiz) {
      const qStr = JSON.stringify(row.quiz);
      if (qStr.includes('!')) {
        console.log('Row with exclamation:', row.id, 'Lesson:', row.lesson_id);
        console.log(qStr);
      }
    }
  }

  // Also check lessons table itself
  const { data: lessons, error: lErr } = await supabase.from('lessons').select('id, title, quiz');
  if (lessons) {
    for (const l of lessons) {
      if (l.quiz && JSON.stringify(l.quiz).includes('!')) {
        console.log('Lesson with exclamation in quiz:', l.id, l.title);
        console.log(JSON.stringify(l.quiz));
      }
    }
  }
}

run();
