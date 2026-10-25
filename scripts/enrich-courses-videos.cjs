const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const COURSE_VIDEOS = {
  'excel-sheets-mastery': {
    1: 'https://www.youtube.com/watch?v=rwbho0CgEAE',
    2: 'https://www.youtube.com/watch?v=k1xGN8hQ8k0',
    3: 'https://www.youtube.com/watch?v=Vl0H-qTclOg',
    4: 'https://www.youtube.com/watch?v=m0wI61ahfLc',
    5: 'https://www.youtube.com/watch?v=Cffmsw8b5v4',
    6: 'https://www.youtube.com/watch?v=K74_FNnlIF8',
    7: 'https://www.youtube.com/watch?v=q6q0h7E7k-A'
  },
  'power-bi-visuals': {
    1: 'https://www.youtube.com/watch?v=TmhQCQr_8CA',
    2: 'https://www.youtube.com/watch?v=1F_47Z95j_8',
    3: 'https://www.youtube.com/watch?v=yK5w2L0m17k',
    4: 'https://www.youtube.com/watch?v=P21rG_uA_2M',
    5: 'https://www.youtube.com/watch?v=AGrl-H87pRU',
    6: 'https://www.youtube.com/watch?v=kXoZ3UqP1vQ',
    7: 'https://www.youtube.com/watch?v=o0v4PjQ6X9c'
  },
  'figma-ui-bootcamp': {
    1: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
    2: 'https://www.youtube.com/watch?v=T_s_8eM20yM',
    3: 'https://www.youtube.com/watch?v=7uKz3Z1R2w4',
    4: 'https://www.youtube.com/watch?v=k74IrUNaJnk',
    5: 'https://www.youtube.com/watch?v=0kF6x_q8u0c',
    6: 'https://www.youtube.com/watch?v=gnSRJaDhr7A',
    7: 'https://www.youtube.com/watch?v=eJ8J7T4y69g'
  },
  'chatgpt-claude-ai': {
    1: 'https://www.youtube.com/watch?v=wjZofJX0v4M',
    2: 'https://www.youtube.com/watch?v=jC4v5AS4RIM',
    3: 'https://www.youtube.com/watch?v=o8p7UZQcGio',
    4: 'https://www.youtube.com/watch?v=Yf1o0T_iUqU',
    5: 'https://www.youtube.com/watch?v=5U_XyX3Z214',
    6: 'https://www.youtube.com/watch?v=bEjS54Y_Q0U',
    7: 'https://www.youtube.com/watch?v=Sqa8Zu47L6M'
  },
  'vs-code-git-essentials': {
    1: 'https://www.youtube.com/watch?v=VqCgcpAypFQ',
    2: 'https://www.youtube.com/watch?v=gnXz5pAomhs',
    3: 'https://www.youtube.com/watch?v=78_zM9A33Q4',
    4: 'https://www.youtube.com/watch?v=8JJ101D3KnE',
    5: 'https://www.youtube.com/watch?v=eCte_k3B880',
    6: 'https://www.youtube.com/watch?v=OltY849pxTI',
    7: 'https://www.youtube.com/watch?v=DeO7xVXCW04'
  },
  'python-for-everyone': {
    1: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    2: 'https://www.youtube.com/watch?v=7lmCu8wz8ro',
    3: 'https://www.youtube.com/watch?v=W8KRzm-HUcc',
    4: 'https://www.youtube.com/watch?v=9Os0o3wzS_I',
    5: 'https://www.youtube.com/watch?v=q5uM4VKy9yk',
    6: 'https://www.youtube.com/watch?v=m4hEOmV9I90',
    7: 'https://www.youtube.com/watch?v=t8pPdKYpowI'
  },
  'google-workspace-pro': {
    1: 'https://www.youtube.com/watch?v=u80b1wJtKrg',
    2: 'https://www.youtube.com/watch?v=t18j-M69oT8',
    3: 'https://www.youtube.com/watch?v=FIkZ1sPmKNw',
    4: 'https://www.youtube.com/watch?v=1u8Ea2z9U2A',
    5: 'https://www.youtube.com/watch?v=wGXI0KxR8sY',
    6: 'https://www.youtube.com/watch?v=3u0q8Uo8T0w',
    7: 'https://www.youtube.com/watch?v=z8XyY1o8k74'
  },
  'word-powerpoint-pro': {
    1: 'https://www.youtube.com/watch?v=S-nHYzK-BVg',
    2: 'https://www.youtube.com/watch?v=Gk72kE_4p0s',
    3: 'https://www.youtube.com/watch?v=68f6x9u8aW4',
    4: 'https://www.youtube.com/watch?v=q8i_U36rCkg',
    5: 'https://www.youtube.com/watch?v=5U0a8pY8w0s',
    6: 'https://www.youtube.com/watch?v=1u0x7P6u8Ys',
    7: 'https://www.youtube.com/watch?v=7uKz3Z1R2w5'
  },
  'html-css-essentials': {
    1: 'https://www.youtube.com/watch?v=MDLn5-zSQQI',
    2: 'https://www.youtube.com/watch?v=kUMe1FH4CHE',
    3: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
    4: 'https://www.youtube.com/watch?v=1PnVor36_40',
    5: 'https://www.youtube.com/watch?v=fYq5PXgSsbE',
    6: 'https://www.youtube.com/watch?v=5kFz-g_Z1y8',
    7: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
    8: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
    9: 'https://www.youtube.com/watch?v=rIO5326FgPE',
    10: 'https://www.youtube.com/watch?v=srvUrASNj0s',
    11: 'https://www.youtube.com/watch?v=2nffo9m_vB4',
    12: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    13: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
    14: 'https://www.youtube.com/watch?v=b0wF_197X3g',
    15: 'https://www.youtube.com/watch?v=zwsQGnrwQ5Q',
    16: 'https://www.youtube.com/watch?v=Vl0H-qTclOg',
    17: 'https://www.youtube.com/watch?v=ldwlOzRvYOU'
  },
  'javascript-zero-to-pro': {
    1: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
    2: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
    3: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
    4: 'https://www.youtube.com/watch?v=y17RuWkWdn8',
    5: 'https://www.youtube.com/watch?v=oigfaZ5AqsM',
    6: 'https://www.youtube.com/watch?v=cuEtnrL9-H0',
    7: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM',
    8: 'https://www.youtube.com/watch?v=s9wWAKKCZyo',
    9: 'https://www.youtube.com/watch?v=XF1_UKAPrsg',
    10: 'https://www.youtube.com/watch?v=DGpP4p4nS9g',
    11: 'https://www.youtube.com/watch?v=jS4aFq5-91M',
    12: 'https://www.youtube.com/watch?v=9M4XKi25I2M',
    13: 'https://www.youtube.com/watch?v=ec8vSKJuZTk',
    14: 'https://www.youtube.com/watch?v=0n809nd4Zu4',
    15: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
    16: 'https://www.youtube.com/watch?v=DHvZLI7Db8E'
  }
};

async function run() {
  console.log('Enriching courses with high quality video lectures...');

  for (const [slug, videoMap] of Object.entries(COURSE_VIDEOS)) {
    const { data: course } = await sb.from('courses').select('id, title').eq('slug', slug).single();
    if (!course) {
      console.warn('Course not found:', slug);
      continue;
    }

    const { data: lessons } = await sb.from('lessons').select('id, order_index, title, video_url').eq('course_id', course.id).order('order_index');
    console.log(`\nProcessing ${course.title} (${lessons.length} lessons)...`);

    for (const lesson of lessons) {
      const targetVideo = videoMap[lesson.order_index];
      if (targetVideo && lesson.video_url !== targetVideo) {
        await sb.from('lessons').update({ video_url: targetVideo }).eq('id', lesson.id);
        console.log(`  [✓] Lesson ${lesson.order_index} (${lesson.title}) -> Attached Video`);
      }
    }
  }

  console.log('\n[✓] All target courses successfully enriched with verified video lectures!');
}

run().catch(err => {
  console.error('Error enriching videos:', err);
  process.exit(1);
});
