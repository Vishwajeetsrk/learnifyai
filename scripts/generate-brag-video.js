/**
 * Learnify AI — /brag-slim Video Generator
 * Produces:
 * 1. brag-output/brag-plan.md (storyboard & creative brief)
 * 2. brag-output/share-copy.txt (postable copy for LinkedIn, X, Product Hunt)
 * 3. brag-output/brag.jpg (high-res poster frame)
 * 4. brag-output/brag.mp4 (1920x1080 30fps H.264 video with 120BPM electronic audio track)
 * 5. brag-output/index.html (interactive in-browser launch video player)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const OUTPUT_DIR = path.join(ROOT_DIR, 'brag-output');
const WORK_DIR = path.join(OUTPUT_DIR, 'work');

// Ensure directories
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(WORK_DIR)) fs.mkdirSync(WORK_DIR, { recursive: true });

console.log('🎬 Generating /brag-slim launch deliverables for Learnify AI...');

// 1. Write brag-plan.md
const bragPlan = `# /brag-slim Launch Plan: Learnify AI

## 1. Creative Angle
- **Core Hook**: "Forget traditional video courses. Meet Learnify AI — India's AI-Native Learning & Career OS."
- **Tone**: Fast, confident product launch, punchy, crisp typography, electric indigo & sovereign gold palette.
- **Pacing**: 120 BPM tempo, 5 distinct scenes, 4.0s per scene = 20.0s total duration.
- **Format**: 1920×1080 (Landscape), 30fps, H.264 + AAC audio.

## 2. Storyboard & Scene Breakdown

### Scene 1: The Hook (0.0s – 4.0s)
- **Visual**: Deep obsidian background with pulsing electric violet badge.
- **Header**: INDIA'S AI-NATIVE LEARNING & CAREER OS
- **Main Hero**: LEARNIFY AI
- **Subtitle**: Skip passive video watching. Master code, architecture, and interviews with 24/7 AI.
- **Audio Beat**: Bass drop + 120BPM synth intro.

### Scene 2: The AI Super-Suite (4.0s – 8.0s)
- **Visual**: Deep cyber cobalt backdrop.
- **Header**: THE ALL-IN-ONE AI LEARNING SUITE
- **Highlights**:
  - ✦ 24/7 Socratic AI Tutor with contextual lesson memory
  - ✦ Instant MCQ & Graded Assessment engine
  - ✦ Smart Active-Recall Flashcards & Cheat Sheets
- **Audio Beat**: Driving rhythm with high synth accents.

### Scene 3: Career Studio & Sandboxes (8.0s – 12.0s)
- **Visual**: Deep obsidian purple backdrop.
- **Header**: CAREER ACCELERATION & PRACTICE STUDIO
- **Highlights**:
  - ✦ Full-Stack In-Browser Code Sandboxes & Monaco IDE
  - ✦ Voice & Technical AI Mock Interviews with real-time feedback
  - ✦ Smart ATS Resume Scorer & Skill Gap Heatmap
- **Audio Beat**: Accelerated percussion groove.

### Scene 4: Trust, QR Verification & Creator Economy (12.0s – 16.0s)
- **Visual**: Sovereign forest emerald & 24K gold backdrop.
- **Header**: CRYPTO-GRADE ACCREDITED CREDENTIALS
- **Highlights**:
  - ✦ Harmonic Guilloche Rosette Certificate Templates
  - ✦ Instant SHA-256 Tamper-Proof QR Verification
  - ✦ 80/20 Creator Revenue Split + Live Cohort Studio
- **Audio Beat**: Resonant build-up toward crescendo.

### Scene 5: Outro & Call to Action (16.0s – 20.0s)
- **Visual**: Electric indigo gradient finish with gold accents.
- **Header**: MASTER ANY TECH STACK AT HYPER-SPEED
- **Callout**: Start Learning Free Today
- **Domain**: learnifyai.in
- **Audio Beat**: Final punchy synth hit and smooth reverb fade.
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'brag-plan.md'), bragPlan, 'utf8');
console.log('✓ Wrote brag-output/brag-plan.md');

// 2. Write share-copy.txt
const shareCopy = `=== Learnify AI Launch Share Copy ===

[X / Twitter (280 chars)]
Stop watching 40-hour passive coding tutorials.

Meet @LearnifyAI — India's AI-Native Learning & Career OS:
✦ 24/7 Socratic AI Tutor
✦ Real-time In-Browser IDE
✦ AI Voice Mock Interviews
✦ Cryptographic QR Certificates
✦ 80/20 Creator Split

Start free → https://www.learnifyai.in

---

[LinkedIn / Long Form]
Most online learning platforms are built like static 2012 video libraries. Students get stuck, lose momentum, and never finish.

We built Learnify AI to change that.

Learnify AI is an AI-native operating system designed to take you from your first line of code to verified mastery:
🚀 Socratic AI Tutor — Never get stuck on a bug or syntax error again.
💻 Interactive Code Sandboxes — Real-time Monaco IDE & database consoles inside every lesson.
🎙️ AI Mock Interviews — Real-time speech & technical assessment with principal architect grading.
🛡️ Tamper-Proof Credentials — ISO-grade Guilloche certificates with instantaneous QR verification.
🤝 80/20 Creator Marketplace — Earn real income hosting cohorts and courses.

Check out the live platform today: https://www.learnifyai.in

#EdTech #ArtificialIntelligence #SoftwareEngineering #CareerGrowth #LearnifyAI

---

[Product Hunt / Tagline]
Learnify AI — India's AI-Native Learning & Career OS
Tagline: Master tech skills at 5x speed with 24/7 AI tutoring, live sandboxes & verified QR certificates.
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'share-copy.txt'), shareCopy, 'utf8');
console.log('✓ Wrote brag-output/share-copy.txt');

// 3. Render MP4 and Poster using FFmpeg
const fontBold = 'C\\:/Windows/Fonts/arialbd.ttf';
const fontRegular = 'C\\:/Windows/Fonts/arial.ttf';

console.log('🎞️ Rendering high-resolution scene video segments...');

// Scene 1: Hook (0s - 4s)
const s1Cmd = `ffmpeg -y -f lavfi -i color=c=0x080B14:s=1920x1080:d=4 -vf "` +
  `drawbox=x=0:y=0:w=1920:h=6:color=0x6B5BFB:t=fill,` +
  `drawbox=x=0:y=1074:w=1920:h=6:color=0x6B5BFB:t=fill,` +
  `drawbox=x=610:y=240:w=700:h=42:color=0x6B5BFB@0.15:t=fill,` +
  `drawbox=x=610:y=240:w=700:h=42:color=0x6B5BFB:t=2,` +
  `drawtext=fontfile='${fontBold}':text='INDIA AI-NATIVE LEARNING & CAREER OS':fontsize=16:fontcolor=0xD4AF37:x=(w-text_w)/2:y=253,` +
  `drawtext=fontfile='${fontBold}':text='LEARNIFY AI':fontsize=88:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=340,` +
  `drawtext=fontfile='${fontBold}':text='Forget passive video watching.':fontsize=32:fontcolor=0x00F2FE:x=(w-text_w)/2:y=470,` +
  `drawtext=fontfile='${fontRegular}':text='Master modern tech with 24/7 Socratic AI tutoring and live coding.':fontsize=24:fontcolor=0x94A3B8:x=(w-text_w)/2:y=525,` +
  `drawbox=x=360:y=620:w=1200:h=80:color=0x1E293B@0.8:t=fill,` +
  `drawbox=x=360:y=620:w=1200:h=80:color=0x334155:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='✦ 24/7 Socratic AI Tutor    ✦ Voice Mock Interviews    ✦ QR Certificates':fontsize=22:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=650" ` +
  `-c:v libx264 -pix_fmt yuv420p "${path.join(WORK_DIR, 's1.mp4')}"`;

execSync(s1Cmd, { stdio: 'inherit' });
console.log('✓ Rendered Scene 1');

// Scene 2: AI Suite (0s - 4s)
const s2Cmd = `ffmpeg -y -f lavfi -i color=c=0x0A192F:s=1920x1080:d=4 -vf "` +
  `drawbox=x=0:y=0:w=1920:h=6:color=0x00F2FE:t=fill,` +
  `drawbox=x=0:y=1074:w=1920:h=6:color=0x00F2FE:t=fill,` +
  `drawbox=x=710:y=180:w=500:h=38:color=0x00F2FE@0.15:t=fill,` +
  `drawtext=fontfile='${fontBold}':text='SUPERCHARGED LEARNING ENGINE':fontsize=15:fontcolor=0x00F2FE:x=(w-text_w)/2:y=191,` +
  `drawtext=fontfile='${fontBold}':text='THE AI LEARNING SUITE':fontsize=64:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=250,` +
  `drawbox=x=310:y=370:w=1300:h=90:color=0x112240@0.9:t=fill,` +
  `drawbox=x=310:y=370:w=1300:h=90:color=0x64FFDA@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='1. 24/7 Socratic AI Tutor':fontsize=26:fontcolor=0x64FFDA:x=340:y=395,` +
  `drawtext=fontfile='${fontRegular}':text='Never stay blocked. Context-aware explanations that guide rather than spoon-feed.':fontsize=18:fontcolor=0xCCD6F6:x=340:y=428,` +
  `drawbox=x=310:y=490:w=1300:h=90:color=0x112240@0.9:t=fill,` +
  `drawbox=x=310:y=490:w=1300:h=90:color=0x00F2FE@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='2. Instant MCQ & Assessment Engine':fontsize=26:fontcolor=0x00F2FE:x=340:y=515,` +
  `drawtext=fontfile='${fontRegular}':text='Exam-grade practice with hidden answers and instant key takeaway breakdowns.':fontsize=18:fontcolor=0xCCD6F6:x=340:y=548,` +
  `drawbox=x=310:y=610:w=1300:h=90:color=0x112240@0.9:t=fill,` +
  `drawbox=x=310:y=610:w=1300:h=90:color=0xD4AF37@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='3. Active-Recall Smart Flashcards':fontsize=26:fontcolor=0xD4AF37:x=340:y=635,` +
  `drawtext=fontfile='${fontRegular}':text='Spaced repetition algorithms that cement long-term engineering mastery.':fontsize=18:fontcolor=0xCCD6F6:x=340:y=668" ` +
  `-c:v libx264 -pix_fmt yuv420p "${path.join(WORK_DIR, 's2.mp4')}"`;

execSync(s2Cmd, { stdio: 'inherit' });
console.log('✓ Rendered Scene 2');

// Scene 3: Career Studio (0s - 4s)
const s3Cmd = `ffmpeg -y -f lavfi -i color=c=0x130924:s=1920x1080:d=4 -vf "` +
  `drawbox=x=0:y=0:w=1920:h=6:color=0x8B5CF6:t=fill,` +
  `drawbox=x=0:y=1074:w=1920:h=6:color=0x8B5CF6:t=fill,` +
  `drawbox=x=710:y=180:w=500:h=38:color=0x8B5CF6@0.15:t=fill,` +
  `drawtext=fontfile='${fontBold}':text='FROM CODE TO CAREER':fontsize=15:fontcolor=0xC084FC:x=(w-text_w)/2:y=191,` +
  `drawtext=fontfile='${fontBold}':text='CAREER STUDIO & SANDBOXES':fontsize=64:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=250,` +
  `drawbox=x=310:y=370:w=1300:h=90:color=0x261442@0.9:t=fill,` +
  `drawbox=x=310:y=370:w=1300:h=90:color=0xC084FC@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='✦ In-Browser Sandboxes & Monaco IDE':fontsize=26:fontcolor=0xC084FC:x=340:y=395,` +
  `drawtext=fontfile='${fontRegular}':text='Code Python, React, and SQL directly inside lessons with instant server execution.':fontsize=18:fontcolor=0xE9D5FF:x=340:y=428,` +
  `drawbox=x=310:y=490:w=1300:h=90:color=0x261442@0.9:t=fill,` +
  `drawbox=x=310:y=490:w=1300:h=90:color=0x38BDF8@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='✦ AI Voice & Technical Mock Interviews':fontsize=26:fontcolor=0x38BDF8:x=340:y=515,` +
  `drawtext=fontfile='${fontRegular}':text='Practice spoken and coding interviews with AI persona architects and instant scorecards.':fontsize=18:fontcolor=0xE9D5FF:x=340:y=548,` +
  `drawbox=x=310:y=610:w=1300:h=90:color=0x261442@0.9:t=fill,` +
  `drawbox=x=310:y=610:w=1300:h=90:color=0x34D399@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='✦ Smart ATS Resume & Skill Gap Review':fontsize=26:fontcolor=0x34D399:x=340:y=635,` +
  `drawtext=fontfile='${fontRegular}':text='Target role keyword matching and portfolio project blueprints that get callbacks.':fontsize=18:fontcolor=0xE9D5FF:x=340:y=668" ` +
  `-c:v libx264 -pix_fmt yuv420p "${path.join(WORK_DIR, 's3.mp4')}"`;

execSync(s3Cmd, { stdio: 'inherit' });
console.log('✓ Rendered Scene 3');

// Scene 4: Certificates (0s - 4s)
const s4Cmd = `ffmpeg -y -f lavfi -i color=c=0x042017:s=1920x1080:d=4 -vf "` +
  `drawbox=x=0:y=0:w=1920:h=6:color=0x10B981:t=fill,` +
  `drawbox=x=0:y=1074:w=1920:h=6:color=0x10B981:t=fill,` +
  `drawbox=x=710:y=180:w=500:h=38:color=0x10B981@0.15:t=fill,` +
  `drawtext=fontfile='${fontBold}':text='PROVABLE ACHIEVEMENT':fontsize=15:fontcolor=0x10B981:x=(w-text_w)/2:y=191,` +
  `drawtext=fontfile='${fontBold}':text='TAMPER-PROOF QR CERTIFICATES':fontsize=64:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=250,` +
  `drawbox=x=310:y=370:w=1300:h=90:color=0x064E3B@0.9:t=fill,` +
  `drawbox=x=310:y=370:w=1300:h=90:color=0x34D399@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='✦ Central-Bank Harmonic Guilloche Vectoring':fontsize=26:fontcolor=0x34D399:x=340:y=395,` +
  `drawtext=fontfile='${fontRegular}':text='Banknote-grade micro-lathe engraving that cannot be forged or counterfeited.':fontsize=18:fontcolor=0xD1FAE5:x=340:y=428,` +
  `drawbox=x=310:y=490:w=1300:h=90:color=0x064E3B@0.9:t=fill,` +
  `drawbox=x=310:y=490:w=1300:h=90:color=0xD4AF37@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='✦ Instant Cryptographic SHA-256 QR Verification':fontsize=26:fontcolor=0xD4AF37:x=340:y=515,` +
  `drawtext=fontfile='${fontRegular}':text='Employers verify student authenticity in 1 second via learnifyai.in/verify.':fontsize=18:fontcolor=0xD1FAE5:x=340:y=548,` +
  `drawbox=x=310:y=610:w=1300:h=90:color=0x064E3B@0.9:t=fill,` +
  `drawbox=x=310:y=610:w=1300:h=90:color=0x6EE7B7@0.5:t=1.5,` +
  `drawtext=fontfile='${fontBold}':text='✦ 80/20 Creator Revenue & Cohort Studio':fontsize=26:fontcolor=0x6EE7B7:x=340:y=635,` +
  `drawtext=fontfile='${fontRegular}':text='High creator payouts with instant Cashfree bank transfers.':fontsize=18:fontcolor=0xD1FAE5:x=340:y=668" ` +
  `-c:v libx264 -pix_fmt yuv420p "${path.join(WORK_DIR, 's4.mp4')}"`;

execSync(s4Cmd, { stdio: 'inherit' });
console.log('✓ Rendered Scene 4');

// Scene 5: Outro & Call to Action (0s - 4s)
const s5Cmd = `ffmpeg -y -f lavfi -i color=c=0x0B1120:s=1920x1080:d=4 -vf "` +
  `drawbox=x=0:y=0:w=1920:h=8:color=0x6B5BFB:t=fill,` +
  `drawbox=x=0:y=1072:w=1920:h=8:color=0x6B5BFB:t=fill,` +
  `drawtext=fontfile='${fontBold}':text='READY TO ACCELERATE YOUR CAREER?':fontsize=22:fontcolor=0xD4AF37:x=(w-text_w)/2:y=240,` +
  `drawtext=fontfile='${fontBold}':text='LEARNIFY AI':fontsize=96:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=310,` +
  `drawtext=fontfile='${fontBold}':text='India AI-Native Learning & Career OS':fontsize=30:fontcolor=0x00F2FE:x=(w-text_w)/2:y=440,` +
  `drawbox=x=610:y=540:w=700:h=70:color=0x6B5BFB:t=fill,` +
  `drawtext=fontfile='${fontBold}':text='Start Learning Free  ·  learnifyai.in':fontsize=28:fontcolor=0xFFFFFF:x=(w-text_w)/2:y=562,` +
  `drawtext=fontfile='${fontRegular}':text='Free forever tier available  ·  Pro unlock at just Rs 199/month':fontsize=20:fontcolor=0x94A3B8:x=(w-text_w)/2:y=660,` +
  `drawtext=fontfile='${fontRegular}':text='Join 10,000+ ambitious developers & creators today':fontsize=16:fontcolor=0x64748B:x=(w-text_w)/2:y=720" ` +
  `-c:v libx264 -pix_fmt yuv420p "${path.join(WORK_DIR, 's5.mp4')}"`;

execSync(s5Cmd, { stdio: 'inherit' });
console.log('✓ Rendered Scene 5');

// 4. Generate 20-second 120BPM Electronic Audio Soundtrack
console.log('🎵 Synthesizing 120BPM electronic launch track...');
const audioCmd = `ffmpeg -y -f lavfi -i "` +
  `aevalsrc='` +
  // 120 BPM Kick (every 0.5s)
  `sin(2*PI*(60+80*exp(-20*mod(t,0.5)))) * 0.35 * exp(-6*mod(t,0.5)) + ` +
  // Hi-hat pulse (every 0.25s)
  `sin(2*PI*4500*t) * 0.04 * exp(-25*mod(t,0.25)) + ` +
  // Bass arpeggio (C minor chord: 65Hz, 78Hz, 98Hz)
  `sin(2*PI*(65 + 13*floor(mod(t*4,3)))*t) * 0.25 * (1 + 0.5*sin(2*PI*0.25*t)) + ` +
  // Synth lead chord pad
  `sin(2*PI*523.25*t)*0.08 + sin(2*PI*659.25*t)*0.06 + sin(2*PI*783.99*t)*0.06` +
  `':s=44100:d=20" -af "afade=t=out:st=18.5:d=1.5" -c:a aac -b:a 192k "${path.join(WORK_DIR, 'soundtrack.aac')}"`;

execSync(audioCmd, { stdio: 'ignore' });
console.log('✓ Synthesized launch soundtrack');

// 5. Concat video clips with audio into brag.mp4
console.log('🎬 Assembling final brag.mp4 (1920x1080 30fps)...');
const listFile = path.join(WORK_DIR, 'concat_list.txt');
fs.writeFileSync(listFile, `file 's1.mp4'\nfile 's2.mp4'\nfile 's3.mp4'\nfile 's4.mp4'\nfile 's5.mp4'\n`, 'utf8');

const finalMp4 = path.join(OUTPUT_DIR, 'brag.mp4');
const concatCmd = `ffmpeg -y -f concat -safe 0 -i "${listFile}" -i "${path.join(WORK_DIR, 'soundtrack.aac')}" -c:v copy -c:a copy -shortest "${finalMp4}"`;
execSync(concatCmd, { stdio: 'ignore' });
console.log('✓ Successfully rendered brag-output/brag.mp4');

// 6. Extract frame 0 / hero poster to brag.jpg
const posterJpg = path.join(OUTPUT_DIR, 'brag.jpg');
const posterCmd = `ffmpeg -y -ss 00:00:01 -i "${finalMp4}" -vframes 1 -q:v 2 "${posterJpg}"`;
execSync(posterCmd, { stdio: 'ignore' });
console.log('✓ Saved poster to brag-output/brag.jpg');

// 7. Write an interactive HTML launch player
const htmlPlayer = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Learnify AI — Official Launch Demo</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #080B14;
      color: #F8FAFC;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .container {
      max-width: 1080px;
      width: 100%;
      background: #0F172A;
      border: 1px solid #1E293B;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: rgba(107, 91, 251, 0.2);
      border: 1px solid #6B5BFB;
      color: #C084FC;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .video-wrapper {
      position: relative;
      border-radius: 14px;
      overflow: hidden;
      background: #000;
      border: 1px solid #334155;
      aspect-ratio: 16 / 9;
    }
    video {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    .card {
      background: #1E293B;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 16px;
    }
    .card h4 {
      font-size: 14px;
      color: #38BDF8;
      margin-bottom: 6px;
    }
    .card p {
      font-size: 12px;
      color: #94A3B8;
      line-height: 1.5;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #6B5BFB;
      color: white;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #5b4af7;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand">
        <span class="badge">Official Launch Video</span>
        <h1 style="font-size: 20px; font-weight: 700;">Learnify AI — Product Showcase</h1>
      </div>
      <a href="https://www.learnifyai.in" target="_blank" class="btn">Visit Live Platform ↗</a>
    </div>

    <div class="video-wrapper">
      <video controls autoplay loop poster="brag.jpg">
        <source src="brag.mp4" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>
    </div>

    <div class="grid">
      <div class="card">
        <h4>🤖 Socratic AI Tutor</h4>
        <p>24/7 contextual guidance, smart flashcards & active-recall quiz generators.</p>
      </div>
      <div class="card">
        <h4>💻 Career Studio & Sandboxes</h4>
        <p>In-browser Monaco IDE, full-stack sandboxes, AI voice mock interviews & ATS reviews.</p>
      </div>
      <div class="card">
        <h4>🛡️ Tamper-Proof QR Certificates</h4>
        <p>Harmonic Guilloche rosette engraving with instant SHA-256 verification.</p>
      </div>
      <div class="card">
        <h4>💰 80/20 Creator Economy</h4>
        <p>Build and sell interactive courses with automatic Cashfree rupee payouts.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), htmlPlayer, 'utf8');
console.log('✓ Created brag-output/index.html interactive player');

console.log('\n🎉 Launch video creation complete! Deliverables ready in brag-output/');
