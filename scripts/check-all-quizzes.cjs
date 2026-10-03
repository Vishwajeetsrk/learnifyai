const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const envTxt = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of envTxt.split(/\r?\n/)) {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
}
const supabase = createClient(env.SUPABASE_URL || env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function fixQuiz() {
  const lessonId = 'ba084ce0-4fb8-496e-9eed-03126047227c';
  const { data: lesson } = await supabase.from('lessons').select('id, title, course_id').eq('id', lessonId).single();
  console.log('Affected lesson:', lesson);

  const { data: transcript } = await supabase.from('lesson_transcripts').select('lesson_id, quiz').eq('lesson_id', lessonId).single();
  if (transcript && Array.isArray(transcript.quiz)) {
    const cleanedQuiz = transcript.quiz.map(q => ({
      ...q,
      question: q.question.replace(/!{2,}/g, '').replace(/\?{2,}/g, '?').trim().concat(q.question.endsWith('?') ? '' : '?'),
    }));
    console.log('Cleaned quiz:', cleanedQuiz);
    const { error: updErr } = await supabase.from('lesson_transcripts').update({ quiz: cleanedQuiz }).eq('lesson_id', lessonId);
    if (updErr) {
      console.error('Update error:', updErr);
    } else {
      console.log('SUCCESSFULLY FIXED QUIZ RECORD IN DATABASE!');
    }
  }
}

fixQuiz();
