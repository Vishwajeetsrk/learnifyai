import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gnvsqwyexjuuwkjibxrr.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*');

  if (error) {
    console.error('Error fetching blog posts:', error);
  } else {
    console.log('Blog posts count:', posts?.length);
    console.log('Posts:', JSON.stringify(posts, null, 2));
  }
}

run();
