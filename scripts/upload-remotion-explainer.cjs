const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function uploadExplainer() {
  const filePath = path.join(__dirname, '..', 'public', 'videos', 'lesson-explainer.mp4');
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(filePath);
  console.log(`Uploading ${filePath} (${fileBuffer.length} bytes) to Supabase Storage media/remotion/lesson-explainer.mp4...`);

  const { data, error } = await sb.storage
    .from('media')
    .upload('remotion/lesson-explainer.mp4', fileBuffer, {
      contentType: 'video/mp4',
      upsert: true
    });

  if (error) {
    console.error('Upload failed:', error);
    process.exit(1);
  }

  const { data: publicUrlData } = sb.storage
    .from('media')
    .getPublicUrl('remotion/lesson-explainer.mp4');

  console.log('Upload successful!');
  console.log('Public CDN URL:', publicUrlData.publicUrl);
}

uploadExplainer().catch(console.error);
