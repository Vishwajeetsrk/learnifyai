const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const COURSE_ID = '26d71b36-1e14-4d30-b300-bf20122be60e';
const LOCAL_RAW_DIR = 'C:\\Users\\Vishwajeet\\Music\\Learnify AI Courses\\Designing User Interfaces and Experiences (UI & UX)\\UX\\Designing User Interfaces and User Experiences (UI-UX)';
const PUBLIC_VIDEO_DIR = path.join(__dirname, '..', 'public', 'videos', 'courses', 'ui-ux');

// Map of lesson order_index to video filename
const VIDEO_MAP = {
  // Module 1
  0: '1. Course Introduction.mp4',
  3: '4. What is Design and UI_UX_.mp4',
  4: '5. Importance of UI_UX_.mp4',
  5: '6. Design Thinking.mp4',
  6: '7. UX Design and Strategies.mp4',
  7: '8. Wireframing and Prototyping.mp4',
  8: '9. Design Methodologies and Approaches.mp4',
  9: '10. Visual Design Principles in UI Design.mp4',
  10: '10. UI Design in Figma.mp4',
  14: '15. Designing a User Interface.mp4',
  15: '16. Typography, Readability, and Color Theory in UI Design.mp4',
  16: '17. Best Practices in UI Design for Web and Mobile.mp4',

  // Module 2
  22: 'Introduction to Responsive Web Design (RWD) .mp4',
  23: 'Mobile First Design.mp4',
  24: 'Adaptive Layouts and Fluid Layouts.mp4',
  25: 'Working with Media Queries.mp4',
  26: 'Responsive Web Design Best Practices.mp4',
  27: 'Cross Device Validation and Testing.mp4',
  31: 'Introduction to Progressive Web Development .mp4',
  32: 'Progressive Web Development Technologies.mp4',
  33: 'Single Page Applications (SPA).mp4',
  34: 'Service Worker, Push Notifications and Caching .mp4',
  35: 'Converting Existing App to PWA.mp4',
  36: 'Progressive Web Applications in Action.mp4',
  37: 'No Code & Low Code Tools.mp4',

  // Module 3
  42: 'What is Figma_.mp4',
  43: 'Essential Concepts of Figma.mp4',
  44: 'Setup and Configure Figma.mp4',
  45: 'Images, Shapes, and Tools.mp4',
  50: 'Working with Figma.mp4',
  51: 'Getting Started with Components.mp4',
  52: 'Styles and Libraries in Figma.mp4',
  53: 'Cards and Layout Grids in Figma .mp4'
};

function sanitizeFileName(name) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function run() {
  console.log('====================================================');
  console.log('  Learnify AI: Resorting UI & UX Videos & Content   ');
  console.log('====================================================');

  if (!fs.existsSync(PUBLIC_VIDEO_DIR)) {
    fs.mkdirSync(PUBLIC_VIDEO_DIR, { recursive: true });
  }

  // 1. Fetch current lessons from DB
  const { data: lessons, error: lErr } = await sb
    .from('lessons')
    .select('id, title, order_index, video_url')
    .eq('course_id', COURSE_ID)
    .order('order_index');

  if (lErr) throw lErr;
  console.log(`Fetched ${lessons.length} lessons from Supabase.`);

  // 2. Upload videos to Supabase Storage & copy to public
  const cdnUrlMap = {};

  for (const [orderIndexStr, rawFileName] of Object.entries(VIDEO_MAP)) {
    const orderIndex = parseInt(orderIndexStr, 10);
    const sourceFilePath = path.join(LOCAL_RAW_DIR, rawFileName);

    if (!fs.existsSync(sourceFilePath)) {
      console.warn(`[!] File not found locally: ${rawFileName}`);
      continue;
    }

    const cleanName = sanitizeFileName(rawFileName);
    const storagePath = `courses/ui-ux/${cleanName}`;
    const publicLocalPath = path.join(PUBLIC_VIDEO_DIR, cleanName);

    // Copy to public if not present
    if (!fs.existsSync(publicLocalPath)) {
      fs.copyFileSync(sourceFilePath, publicLocalPath);
      console.log(`  [+] Copied to public: ${cleanName}`);
    }

    // Check if exists in Supabase Storage
    const { data: pubData } = sb.storage.from('media').getPublicUrl(storagePath);
    let publicUrl = pubData.publicUrl;

    // Check if already uploaded
    const { data: fileList } = await sb.storage.from('media').list('courses/ui-ux', {
      search: cleanName
    });

    const alreadyUploaded = fileList && fileList.some(f => f.name === cleanName);

    if (!alreadyUploaded) {
      console.log(`  [^] Uploading to Supabase Storage: ${storagePath}...`);
      const fileBuffer = fs.readFileSync(sourceFilePath);
      const { error: upErr } = await sb.storage.from('media').upload(storagePath, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true
      });
      if (upErr) {
        console.error(`  [X] Upload error for ${cleanName}:`, upErr.message);
      } else {
        console.log(`  [✓] Uploaded: ${storagePath}`);
      }
    } else {
      console.log(`  [.] Already in Supabase Storage: ${cleanName}`);
    }

    cdnUrlMap[orderIndex] = publicUrl;
  }

  // 3. Update database lessons
  console.log('\nUpdating database lessons...');
  let updatedVideos = 0;
  let clearedPlaceholders = 0;

  for (const lesson of lessons) {
    const targetVideoUrl = cdnUrlMap[lesson.order_index] || null;

    if (targetVideoUrl) {
      // It is a real video lesson
      if (lesson.video_url !== targetVideoUrl) {
        await sb.from('lessons').update({ video_url: targetVideoUrl }).eq('id', lesson.id);
        console.log(`  [✓] Lesson #${lesson.order_index} (${lesson.title}) -> Attached Video CDN URL`);
        updatedVideos++;
      }
    } else {
      // It is a reading, lab, or quiz lesson: clear any stale video URL
      if (lesson.video_url !== null) {
        await sb.from('lessons').update({ video_url: null }).eq('id', lesson.id);
        console.log(`  [x] Lesson #${lesson.order_index} (${lesson.title}) -> Cleared stale placeholder video`);
        clearedPlaceholders++;
      }
    }
  }

  console.log('\n====================================================');
  console.log(`[✓] Completed: ${updatedVideos} real video URLs assigned, ${clearedPlaceholders} stale video URLs cleared.`);
  console.log('====================================================');
}

run().catch(err => {
  console.error('Fatal error in resort script:', err);
  process.exit(1);
});
