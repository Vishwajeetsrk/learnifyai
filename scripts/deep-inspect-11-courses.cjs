const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const targetSlugs = [
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
    const { data: course } = await sb.from('courses').select('id, title, slug, description, category, level, requirements, outcomes').eq('slug', slug).single();
    if (!course) continue;
    const { data: lessons } = await sb.from('lessons').select('id, title, order_index, description, content_format').eq('course_id', course.id).order('order_index');
    console.log(`\n======================================================`);
    console.log(`COURSE: ${course.title} (${course.category} · ${course.level})`);
    console.log(`Description: ${course.description?.slice(0, 120)}...`);
    console.log(`Total Lessons: ${lessons ? lessons.length : 0}`);
    (lessons || []).forEach(l => {
      console.log(`  - [${l.order_index}] ${l.title} (${l.description ? l.description.slice(0, 60) + '...' : 'No desc'})`);
    });
  }
})();
