const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const targetSlugs = [
  'designing-user-interfaces-and-experiences',
  'java-fundamentals',
  'word-powerpoint-pro',
  'power-bi-visuals',
  'figma-ui-bootcamp',
  'chatgpt-claude-ai',
  'excel-sheets-mastery',
  'vs-code-git-essentials',
  'html-css-essentials',
  'javascript-zero-to-pro',
  'python-for-everyone',
  'google-workspace-pro'
];

(async () => {
  for (const slug of targetSlugs) {
    const { data: course } = await sb.from('courses').select('id, title, slug, price_inr, published').eq('slug', slug).single();
    if (!course) {
      console.log('Course not found:', slug);
      continue;
    }
    const { data: modules } = await sb.from('course_modules').select('id, title, order_index').eq('course_id', course.id).order('order_index');
    const { data: lessons } = await sb.from('lessons').select('id, title, order_index, video_url, duration_minutes, is_preview').eq('course_id', course.id).order('order_index');
    console.log(`=== ${course.title} (${slug}) === Price: ₹${course.price_inr} | Published: ${course.published}`);
    console.log(`  Modules: ${modules ? modules.length : 0} | Lessons: ${lessons ? lessons.length : 0}`);
    const vids = (lessons || []).filter(l => l.video_url);
    console.log(`  Lessons with video: ${vids.length}`);
    (lessons || []).slice(0, 4).forEach(l => console.log('   - Lesson ' + l.order_index + ': ' + l.title + ' (vid: ' + (l.video_url ? l.video_url.slice(0, 35) : 'none') + ')'));
    if ((lessons || []).length > 4) {
      console.log('   ... (' + (lessons.length - 4) + ' more lessons)');
    }
  }
})();
