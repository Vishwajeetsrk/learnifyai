const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const fileContent = fs.readFileSync('src/lib/canonical-blog.ts', 'utf8');
  
  const title = "The Ultimate Guide to Free Courses, Free Certificates & High-Value Skills in 2026";
  const slug = "ultimate-guide-free-courses-certificates-2026";
  const excerpt = "Discover thousands of free learning resources and certificate opportunities from Google, Harvard CS50, freeCodeCamp, Kaggle, Analytics Vidhya, OpenAI Academy, and more.";
  const featured_image = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";
  
  const startMarker = "content: `";
  const startIndex = fileContent.indexOf(startMarker) + startMarker.length;
  // find matching backtick at end
  const endIndex = fileContent.lastIndexOf("`,\n};");
  const content = fileContent.substring(startIndex, endIndex);

  console.log('Extracted content length:', content.length);

  const payload = {
    title,
    slug,
    content,
    excerpt,
    featured_image,
    author_id: 'aa073db3-bce9-47cd-a490-40a6894a9edf',
    published: true,
    published_at: new Date().toISOString()
  };

  const { data: existing } = await supabase.from('blog_posts').select('id').eq('slug', slug).maybeSingle();
  if (existing) {
    const { error } = await supabase.from('blog_posts').update(payload).eq('id', existing.id);
    if (error) console.error('Update error:', error);
    else console.log('Successfully updated blog post:', existing.id);
  } else {
    const { data, error } = await supabase.from('blog_posts').insert(payload).select().single();
    if (error) console.error('Insert error:', error);
    else console.log('Successfully inserted blog post:', data.id);
  }
}

run();
