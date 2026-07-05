import fs from 'fs';
import path from 'path';

const PROJECTS_SRC_DIR = 'C:/Users/vishw/Music/Learnify AI/Projects';
const JSON_PATH = 'C:/Users/vishw/Music/Learnify AI/src/data/projects.json';

// Tech lookup by project id — gathered from package.json analysis
const TECH_MAP = {
  'acreage-nike':     { tech: ['React 18','TypeScript','GSAP 3','Tailwind CSS v4'], ai: 'Claude' },
  'asme':             { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3'], ai: 'Lovable' },
  'aurora-signup':    { tech: ['React 18','TypeScript','Motion 12','Tailwind CSS v4'], ai: 'Claude' },
  'auto-machines':    { tech: ['React 19','TypeScript','Spline 3D','Motion 12','Tailwind CSS v4'], ai: 'Lovable' },
  'axion-studio':     { tech: ['React 18','TypeScript','WebGPU Shaders','Tailwind CSS 3'], ai: 'Antigravity' },
  'baby-track-automation': { tech: ['React 19','TypeScript','Motion 12','Tailwind CSS v4'], ai: 'Claude' },
  'bionova':          { tech: ['React 18','TypeScript','hls.js','Tailwind CSS 3'], ai: 'Lovable' },
  'brandly':          { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Antigravity' },
  'brandly-agency':   { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Claude' },
  'cinematic-cloud':  { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Lovable' },
  'cinematic-stream': { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Antigravity' },
  'cognitra':         { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3'], ai: 'Claude' },
  'datacore':         { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3'], ai: 'Lovable' },
  'designpro':        { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3'], ai: 'Antigravity' },
  'ecovolta':         { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3'], ai: 'Claude' },
  'equilibrium':      { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3','Geist Font'], ai: 'Lovable' },
  'foundation-epoch': { tech: ['React 18','TypeScript','Motion 12','Tailwind CSS v4','clsx'], ai: 'Antigravity' },
  'gsap-pill-nav':    { tech: ['React 18','TypeScript','GSAP 3','Tailwind CSS v4'], ai: 'Claude' },
  'guardnet':         { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Lovable' },
  'halo-usd':         { tech: ['React 18','TypeScript','Tailwind CSS v4'], ai: 'Antigravity' },
  'jack-3d-creator':  { tech: ['React 18','TypeScript','Framer Motion 12','Tailwind CSS 3'], ai: 'Claude' },
  'linkflow':         { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Lovable' },
  'lumina':           { tech: ['React 18','TypeScript','Motion 12','Tailwind CSS 3'], ai: 'Antigravity' },
  'max-reed':         { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Claude' },
  'metricx-studio':   { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Lovable' },
  'micro-organized':  { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Antigravity' },
  'mindloop':         { tech: ['React 18','TypeScript','Framer Motion 11','hls.js','Tailwind CSS 3','Instrument Serif'], ai: 'Claude' },
  'power-ai':         { tech: ['React 18','TypeScript','Tailwind CSS 3','Geist Sans'], ai: 'Lovable' },
  'pureflow-one':     { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Antigravity' },
  'reposit-solar':    { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Claude' },
  'rivr-defi':        { tech: ['React 18','TypeScript','Motion 12','Tailwind CSS v4'], ai: 'Lovable' },
  'securify':         { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3'], ai: 'Antigravity' },
  'stellar-ai':       { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Claude' },
  'stretch-beauty':   { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Lovable' },
  'targo-logistics':  { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Antigravity' },
  'terra-geo':        { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Claude' },
  'toonhub':          { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Lovable' },
  'transform-data':   { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Antigravity' },
  'ui-rocket':        { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3'], ai: 'Claude' },
  'unleash-scroll-hero': { tech: ['React 19','TypeScript','GSAP 3','Motion 12','hls.js','Tailwind CSS v4'], ai: 'Lovable' },
  'vaultshield':      { tech: ['React 18','TypeScript','Framer Motion 11','Tailwind CSS 3'], ai: 'Antigravity' },
  'velorah':          { tech: ['React 18','TypeScript','hls.js','Tailwind CSS 3'], ai: 'Claude' },
  'velorix':          { tech: ['React 18','TypeScript','Tailwind CSS v4'], ai: 'Lovable' },
  'viralmedia-ai':    { tech: ['React 18','TypeScript','Motion 12','hls.js','Tailwind CSS v4'], ai: 'Antigravity' },
  'wanderful':        { tech: ['React 18','TypeScript','Framer Motion 12','GSAP 3','Tailwind CSS 3'], ai: 'Claude' },
  'web3-eos':         { tech: ['React 18','TypeScript','Tailwind CSS 3'], ai: 'Lovable' },
  'zenith-realty':    { tech: ['React 18','TypeScript','Motion 12','Recharts 3','Tailwind CSS 3'], ai: 'Antigravity' },
};

const projects = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));

for (const p of projects) {
  const info = TECH_MAP[p.id];
  if (info) {
    p.tech_stack = info.tech;
    p.ai_tool = info.ai;
  } else {
    p.tech_stack = ['React','TypeScript','Tailwind CSS'];
    p.ai_tool = 'AI';
  }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(projects, null, 2) + '\n', 'utf-8');
console.log(`Enriched ${projects.length} projects with tech stack + AI tool data.`);
