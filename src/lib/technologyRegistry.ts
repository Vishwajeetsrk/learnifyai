/**
 * Learnify AI - Centralized Technology & Skills Registry
 * Maps skills and aliases to canonical metadata, authentic SVGs, and categories.
 * Prevents generic icons on known technologies and avoids misleading tech logos on soft skills.
 */

export type SkillCategory =
  | "Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Cloud & DevOps"
  | "AI & ML"
  | "Design & Tools"
  | "Soft Skills"
  | "Other";

export interface TechnologyItem {
  slug: string;
  name: string;
  category: SkillCategory;
  officialUrl?: string;
  brandColor?: string;
  isSoftSkill?: boolean;
  softSkillIcon?: "MessageSquare" | "Users" | "Lightbulb" | "Compass" | "Target" | "Briefcase";
  svg?: string; // Raw inner SVG or full SVG
}

export const TECHNOLOGY_REGISTRY: Record<string, TechnologyItem> = {
  react: {
    slug: "react",
    name: "React",
    category: "Frontend",
    officialUrl: "https://react.dev",
    brandColor: "#61DAFB",
    svg: `<svg viewBox="0 0 115.3 100" fill="none"><path d="M57.65 65.26c8.43 0 15.26-6.83 15.26-15.26 0-8.43-6.83-15.26-15.26-15.26-8.43 0-15.26 6.83-15.26 15.26 0 8.43 6.83 15.26 15.26 15.26z" fill="#61DAFB"/><path d="M57.65 99.5c-20.15 0-36.21-3.66-45.22-10.31-9.98-7.37-12.7-18.06-7.66-30.1 5.37-12.83 17.58-25.04 34.39-34.38 16.8-9.35 36.31-14.7 54.93-15.06 20.15 0 36.21 3.66 45.22 10.31 9.98 7.37 12.7 18.06 7.66 30.1-5.37 12.83-17.58 25.04-34.39 34.38-16.81 9.35-36.32 14.7-54.93 15.06zm0-8.98c17.26 0 35.32-4.99 50.84-14.04 15.15-8.83 26.15-20.21 30.98-32.05 4.04-9.89 1.87-17.52-6.1-23.4-7.5-5.54-21.46-8.54-39.73-8.54-17.26 0-35.32 4.99-50.84 14.04-15.15 8.83-26.15 20.21-30.98 32.05-4.04 9.89-1.87 17.52 6.1 23.4 7.51 5.54 21.46 8.54 39.73 8.54z" fill="#61DAFB"/><path d="M14.78 75.25c-10.08-17.45-13.6-33.87-9.9-46.23 4.1-13.68 14.16-21.2 28.32-21.2 13.9 0 30.64 6.94 47.14 19.55 16.49 12.61 30.16 29.54 38.5 47.69 10.08 17.45 13.6 33.87 9.9 46.23-4.1 13.68-14.16 21.2-28.32 21.2-13.9 0-30.64-6.94-47.14-19.55-16.5-12.61-30.16-29.54-38.5-47.69zm7.78-4.49c7.22 15.7 19.06 30.43 33.34 41.49 13.94 10.79 28.09 16.71 39.84 16.71 10.68 0 17.76-5.06 20.47-14.1 2.97-9.92.15-23.95-7.94-39.38-7.22-15.7-19.06-30.43-33.34-41.49-13.94-10.79-28.09-16.71-39.84-16.71-10.68 0-17.76 5.06-20.47 14.1-2.97 9.92-.15 23.95 7.94 39.38z" fill="#61DAFB"/></svg>`,
  },
  nextjs: {
    slug: "nextjs",
    name: "Next.js",
    category: "Frontend",
    officialUrl: "https://nextjs.org",
    brandColor: "#000000",
    svg: `<svg viewBox="0 0 180 180" fill="none"><circle cx="90" cy="90" r="90" fill="#000"/><path d="M149.508 157.52L69.142 54H54V125.97H66.6236V69.9L139.365 164.845C142.923 162.625 146.315 160.174 149.508 157.52Z" fill="url(#next_grad)"/><rect x="115" y="54" width="12" height="72" fill="#fff"/><defs><linearGradient id="next_grad" x1="109.5" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>`,
  },
  typescript: {
    slug: "typescript",
    name: "TypeScript",
    category: "Languages",
    officialUrl: "https://www.typescriptlang.org",
    brandColor: "#3178C6",
    svg: `<svg viewBox="0 0 128 128"><path fill="#3178C6" d="M0 0h128v128H0z"/><path fill="#fff" d="M68.5 70.2h14.7v6.6c0 6.3 3.6 10.4 10.4 10.4 6 0 9.7-3.3 9.7-8.1 0-5.1-3.6-7.5-10.4-10.4l-5.1-2.2c-9.8-4.2-14.7-10.2-14.7-19.1 0-11.4 8.7-19.7 22.4-19.7 13.9 0 22.4 8.2 22.4 20.3h-14.7c0-5.1-3.3-8.2-8-8.2-4.8 0-7.8 2.9-7.8 6.9 0 4.4 2.8 6.7 8.5 9.1l5.1 2.2c11.6 4.9 16.7 10.9 16.7 20.3 0 12.3-9.1 20.7-24.3 20.7-15.4 0-24.8-8.5-24.8-21.7v-7.3zm-42-1.7V55h40.4v13.5H53.6v33.7H38.9V68.5H26.5z"/></svg>`,
  },
  javascript: {
    slug: "javascript",
    name: "JavaScript",
    category: "Languages",
    officialUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    brandColor: "#F7DF1E",
    svg: `<svg viewBox="0 0 128 128"><path fill="#F7DF1E" d="M0 0h128v128H0z"/><path d="M67.3 100c0 9-5.5 13.5-14.6 13.5-8.2 0-13.1-4.2-15.6-9.1l9.6-5.8c1.6 2.6 3.6 4.4 6.2 4.4 3.3 0 5-1.5 5-5.4V62.4h9.4V100zm31.7-1.1c3.1 5.3 7.8 8.4 13.8 8.4 6.2 0 10.2-3.1 10.2-7.5 0-5.1-4.1-7-11.3-10.1l-3.9-1.7c-11.2-4.8-16.5-10.8-16.5-21.8 0-10.9 8.4-19.3 21.6-19.3 9.4 0 16.3 3.6 20.4 11.2l-8.6 5.5c-2.3-4.1-5.6-6.1-11.7-6.1-4.9 0-8.2 2.6-8.2 6.5 0 4.1 2.7 5.9 8.7 8.5l3.9 1.7c13.1 5.6 19.3 11.4 19.3 22.9 0 13.1-10.3 20.9-23.7 20.9-13.5 0-22-6.9-25.7-15.1l7.1-5.5z"/></svg>`,
  },
  tailwindcss: {
    slug: "tailwindcss",
    name: "Tailwind CSS",
    category: "Frontend",
    officialUrl: "https://tailwindcss.com",
    brandColor: "#38BDF8",
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z" fill="#38BDF8"/></svg>`,
  },
  nodejs: {
    slug: "nodejs",
    name: "Node.js",
    category: "Backend",
    officialUrl: "https://nodejs.org",
    brandColor: "#5FA04E",
    svg: `<svg viewBox="0 0 128 128"><path fill="#5FA04E" d="M64 4.8L8.6 36.8v64L64 132.8l55.4-32v-64L64 4.8zm39.1 77.2c-1.4 9.1-8.6 15.6-18.7 17-15.6 2.2-27.1-7-27.1-22.1 0-14.8 11.2-23.7 26.6-22.1 9.7 1 16.5 7.1 18.4 15.8h-11.4c-1.2-4.1-4.8-7.2-10-7.2-7.5 0-12.7 5.1-12.7 13.5 0 8.5 5.2 13.7 13 13.7 5.5 0 9.1-3.2 10.4-7.5h11.5z"/></svg>`,
  },
  python: {
    slug: "python",
    name: "Python",
    category: "Languages",
    officialUrl: "https://www.python.org",
    brandColor: "#3776AB",
    svg: `<svg viewBox="0 0 128 128"><path fill="#3776AB" d="M63.8 0C32.1 0 34 13.8 34 13.8l.1 14.3h30.4v4.3H23.1S0 30 0 62.4c0 32.5 20.2 31.4 20.2 31.4h12.1V79.6s-.7-17.2 17-17.2h29.3s16.3.3 16.3-15.8V13.8S97.4 0 63.8 0zm-17.2 9.7c3.1 0 5.6 2.5 5.6 5.6s-2.5 5.6-5.6 5.6-5.6-2.5-5.6-5.6 2.5-5.6 5.6-5.6z"/><path fill="#FFD43B" d="M64.2 128c31.7 0 29.8-13.8 29.8-13.8l-.1-14.3H63.5v-4.3h41.4s23.1 2.4 23.1-30c0-32.5-20.2-31.4-20.2-31.4h-12.1v14.2s.7 17.2-17 17.2H49.4s-16.3-.3-16.3 15.8v32.8s-2.5 13.8 31.1 13.8zm17.2-9.7c-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6 5.6 2.5 5.6 5.6-2.5 5.6-5.6 5.6z"/></svg>`,
  },
  postgresql: {
    slug: "postgresql",
    name: "PostgreSQL",
    category: "Databases",
    officialUrl: "https://www.postgresql.org",
    brandColor: "#4169E1",
    svg: `<svg viewBox="0 0 128 128"><path fill="#4169E1" d="M64 5.3c-24.8 0-45 20.2-45 45 0 9.8 3.2 18.9 8.6 26.3L15.3 103c-1.3 2.8.7 6.1 3.8 6.1h25.4c1.7 0 3.3-.8 4.3-2.2l8.8-12.4c2.1.5 4.3.8 6.4.8 24.8 0 45-20.2 45-45s-20.2-45-45-45zm0 18c14.9 0 27 12.1 27 27s-12.1 27-27 27-27-12.1-27-27 12.1-27 27-27z"/></svg>`,
  },
  mongodb: {
    slug: "mongodb",
    name: "MongoDB",
    category: "Databases",
    officialUrl: "https://www.mongodb.com",
    brandColor: "#47A248",
    svg: `<svg viewBox="0 0 128 128"><path fill="#47A248" d="M64 0C54.7 18.7 34.7 54.7 34.7 78.7c0 23.3 13.3 40 29.3 49.3 16-9.3 29.3-26 29.3-49.3C93.3 54.7 73.3 18.7 64 0zm0 118.7c-1.3 0-2.7 0-4-1.3-8-8-14.7-21.3-14.7-38.7 0-17.3 12-44 18.7-58.7 6.7 14.7 18.7 41.3 18.7 58.7 0 17.3-6.7 30.7-14.7 38.7-1.3 1.3-2.7 1.3-4 1.3z"/></svg>`,
  },
  docker: {
    slug: "docker",
    name: "Docker",
    category: "Cloud & DevOps",
    officialUrl: "https://www.docker.com",
    brandColor: "#2496ED",
    svg: `<svg viewBox="0 0 24 24" fill="#2496ED"><path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.12a.186.186 0 00-.185.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185M23.904 10.3c-.347-.565-.91-.94-1.603-1.071-.397-.075-.805-.05-1.2.072-.25.078-.48.2-.676.363-.448.375-.72.905-.75 1.488-.042.846.336 1.637 1.01 2.115-1.077 2.16-3.21 3.52-5.617 3.65-6.04.327-11.455-2.023-14.77-6.012l-.246-.3-.362.13c-1.396.505-2.88.766-4.385.772H.003s.06 1.026.355 2.152c.866 3.298 3.324 5.925 6.643 7.108 5.753 2.052 12.87 1.547 18.06-2.037 2.766-1.91 4.54-4.872 4.887-8.132.062-.578.026-1.16-.104-1.727"/></svg>`,
  },
  git: {
    slug: "git",
    name: "Git",
    category: "Cloud & DevOps",
    officialUrl: "https://git-scm.com",
    brandColor: "#F05032",
    svg: `<svg viewBox="0 0 128 128"><path fill="#F05032" d="M125.4 56.4L71.6 2.6c-3.5-3.5-9.1-3.5-12.6 0L46.2 15.4l16.1 16.1c3.7-1.3 8.1-.4 11 2.5 2.9 2.9 3.8 7.3 2.5 11l15.5 15.5c3.7-1.3 8.1-.4 11 2.5 4.1 4.1 4.1 10.8 0 14.9-4.1 4.1-10.8 4.1-14.9 0-3.1-3.1-3.9-7.7-2.3-11.6L70.7 61.9v35.3c1.1.5 2.1 1.3 2.9 2.1 4.1 4.1 4.1 10.8 0 14.9-4.1 4.1-10.8 4.1-14.9 0-4.1-4.1-4.1-10.8 0-14.9 1.1-1.1 2.4-1.9 3.9-2.4V61.1c-1.5-.5-2.8-1.3-3.9-2.4-3.1-3.1-3.8-7.6-2.2-11.4L40.7 31.5 2.6 69.6c-3.5 3.5-3.5 9.1 0 12.6l53.8 53.8c3.5 3.5 9.1 3.5 12.6 0l56.4-56.4c3.5-3.5 3.5-9.2 0-12.6z"/></svg>`,
  },
  github: {
    slug: "github",
    name: "GitHub",
    category: "Cloud & DevOps",
    officialUrl: "https://github.com",
    brandColor: "#181717",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>`,
  },
  supabase: {
    slug: "supabase",
    name: "Supabase",
    category: "Databases",
    officialUrl: "https://supabase.com",
    brandColor: "#3ECF8E",
    svg: `<svg viewBox="0 0 109 113" fill="none"><path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0632H99.1934C106.637 40.0632 110.743 48.6558 106.012 54.4255L63.7076 110.284Z" fill="url(#supa_a)"/><path d="M45.317 2.70375C48.1765 -0.897484 53.9745 1.07593 54.0433 5.67389L54.3475 72.9248H9.8312C2.38743 72.9248 -1.71887 64.3322 3.01243 58.5625L45.317 2.70375Z" fill="#3ECF8E"/><defs><linearGradient id="supa_a" x1="53.9738" y1="54.9782" x2="94.4633" y2="90.5401" gradientUnits="userSpaceOnUse"><stop stop-color="#249361"/><stop offset="1" stop-color="#3ECF8E"/></linearGradient></defs></svg>`,
  },
  firebase: {
    slug: "firebase",
    name: "Firebase",
    category: "Cloud & DevOps",
    officialUrl: "https://firebase.google.com",
    brandColor: "#FFCA28",
    svg: `<svg viewBox="0 0 128 128"><path fill="#FFA000" d="M19.4 69.4L37 15.8c.8-2.6 4.4-3.1 5.9-.9l15 22.3L19.4 69.4z"/><path fill="#F57C00" d="M72.9 44.5L57.9 37.2 19.4 69.4l41.6 23.6c2.4 1.4 5.3 1.4 7.7 0l42.4-24.1-38.2-24.4z"/><path fill="#FFCA28" d="M108.6 68.9L92.2 24.5c-.9-2.5-4.4-2.8-5.7-.5L19.4 69.4l41.6 23.6c2.4 1.4 5.3 1.4 7.7 0l39.9-24.1z"/></svg>`,
  },
  figma: {
    slug: "figma",
    name: "Figma",
    category: "Design & Tools",
    officialUrl: "https://www.figma.com",
    brandColor: "#F24E1E",
    svg: `<svg viewBox="0 0 38 57" fill="none"><path d="M19 28.5a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" fill="#1ABCFE"/><path d="M0 47.5A9.5 9.5 0 019.5 38H19v9.5a9.5 9.5 0 11-19 0z" fill="#0ACF83"/><path d="M19 0v19h9.5a9.5 9.5 0 100-19H19z" fill="#FF7262"/><path d="M0 9.5A9.5 9.5 0 009.5 19H19V0H9.5A9.5 9.5 0 000 9.5z" fill="#F24E1E"/><path d="M0 28.5A9.5 9.5 0 009.5 38H19V19H9.5A9.5 9.5 0 000 28.5z" fill="#A259FF"/></svg>`,
  },
  openai: {
    slug: "openai",
    name: "OpenAI",
    category: "AI & ML",
    officialUrl: "https://openai.com",
    brandColor: "#10A37F",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zM13.26 22.43a4.476 4.476 0 01-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.494zM3.6 18.304a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.14-1.646zM2.34 8.761a4.485 4.485 0 012.338-1.972V12.3a.761.761 0 00.388.676l5.844 3.37-2.02 1.168a.076.076 0 01-.071 0l-4.83-2.786A4.504 4.504 0 012.34 8.76zM18.7 10.93l-5.844-3.37 2.02-1.168a.076.076 0 01.071 0l4.83 2.79a4.494 4.494 0 01-.685 8.1v-5.676a.795.795 0 00-.392-.676zm2.96-2.613l-.142-.085-4.783-2.759a.771.771 0 00-.78 0L10.112 8.84V6.51a.08.08 0 01.033-.062L14.985 3.7a4.5 4.5 0 016.675 4.617zm-12.48 4.14l-2.02-1.164a.08.08 0 01-.038-.057V5.575a4.5 4.5 0 017.375-3.453l-.142.08-4.779 2.758a.795.795 0 00-.393.681v6.737h-.003z"/></svg>`,
  },
  gemini: {
    slug: "gemini",
    name: "Gemini",
    category: "AI & ML",
    officialUrl: "https://deepmind.google/technologies/gemini/",
    brandColor: "#1BA1E2",
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="url(#gemini_grad)"/><defs><linearGradient id="gemini_grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#1BA1E2"/><stop offset="0.5" stop-color="#9B51E0"/><stop offset="1" stop-color="#FF7262"/></linearGradient></defs></svg>`,
  },
  aws: {
    slug: "aws",
    name: "AWS",
    category: "Cloud & DevOps",
    officialUrl: "https://aws.amazon.com",
    brandColor: "#FF9900",
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M7.74 8.98c0 .35-.2.53-.59.53H6.4c-.42 0-.6-.18-.6-.53V5.5c0-.35.18-.53.6-.53h.75c.39 0 .59.18.59.53v3.48zm5.55 0c0 .35-.19.53-.57.53h-.76c-.4 0-.6-.18-.6-.53l-.9-3.23-.88 3.23c0 .35-.2.53-.6.53h-.76c-.38 0-.57-.18-.57-.53L7.3 4.4c0-.33.17-.5.54-.5h.82c.38 0 .58.17.58.5l.43 2.15.53-2.15c0-.33.2-.5.58-.5h.68c.38 0 .57.17.57.5l.54 2.15.42-2.15c0-.33.2-.5.58-.5h.82c.37 0 .54.17.54.5l-.66 4.58zm4.4 0c0 .35-.21.53-.63.53h-.8c-.37 0-.56-.18-.56-.53V8.1c-.34.61-.91.91-1.7.91-.7 0-1.25-.2-1.63-.6-.39-.41-.58-.94-.58-1.59 0-.64.2-1.18.6-1.6.4-.42.98-.63 1.72-.63.35 0 .66.05.93.15v-.86c0-.42-.14-.73-.41-.93-.27-.2-.68-.3-1.22-.3-.51 0-.96.1-1.34.3-.22.1-.38.07-.48-.1l-.34-.5c-.1-.17-.07-.32.09-.46.52-.35 1.25-.52 2.19-.52.93 0 1.63.2 2.1.6.46.4.7 1.01.7 1.83v4.18zm-2.02-1.35c.4 0 .73-.13.99-.39.26-.26.39-.62.39-1.07s-.13-.81-.39-1.07c-.26-.26-.59-.39-.99-.39-.4 0-.74.13-1 .39-.27.26-.4.62-.4 1.07s.13.81.4 1.07c.26.26.6.39 1 .39zM19.78 18.23c-3.14 2.1-7.23 3.23-11.83 3.23-6.23 0-11.45-2.06-15.54-5.54-.34-.29-.38-.79-.08-1.11.29-.32.78-.36 1.11-.08 3.75 3.2 8.56 5.09 14.32 5.09 4.22 0 7.98-1.04 10.87-2.97.4-.27.95-.14 1.22.26.27.4.13.92-.07 1.12zm1.6-1.57c-.43.54-2.82.78-4.2.35-.4-.13-.48-.54-.15-.79 2.05-1.58 4.26-1.14 4.54-.78.28.36.24.68-.19 1.22z" fill="#FF9900"/></svg>`,
  },
  vite: {
    slug: "vite",
    name: "Vite",
    category: "Design & Tools",
    officialUrl: "https://vite.dev",
    brandColor: "#646CFF",
    svg: `<svg viewBox="0 0 24 24" fill="none"><path d="M21.75 3.25L13.5 18.5l-4.25-7.75-6 1.5L12 23.5l10.5-18.75-.75-1.5z" fill="url(#vite_a)"/><path d="M17.5 1.5L9.5 3.25l1 5.75L17 5l-2 5 4.5-.75-6.75 10.5 1.5-6.75-3.5.75L17.5 1.5z" fill="url(#vite_b)"/><defs><linearGradient id="vite_a" x1="12" y1="3" x2="12" y2="23.5" gradientUnits="userSpaceOnUse"><stop stop-color="#41D1FF"/><stop offset="1" stop-color="#BD34FE"/></linearGradient><linearGradient id="vite_b" x1="13.5" y1="1.5" x2="13.5" y2="18.75" gradientUnits="userSpaceOnUse"><stop stop-color="#FFEA83"/><stop offset="1" stop-color="#FFDD35"/></linearGradient></defs></svg>`,
  },
  html5: {
    slug: "html5",
    name: "HTML5",
    category: "Languages",
    officialUrl: "https://developer.mozilla.org/en-US/docs/Glossary/HTML5",
    brandColor: "#E34F26",
    svg: `<svg viewBox="0 0 128 128"><path fill="#E34F26" d="M19.1 114.7L8.4 0h111.2l-10.7 114.7L64 128l-44.9-13.3z"/><path fill="#EF652A" d="M64 117.8l36.7-10.9 9-97.1H64v108z"/><path fill="#ECECEC" d="M64 51.5h19.8l-1.4 15.3H64v15.2h18.2l-1.7 19.3-16.5 4.5v15.8l31.9-8.8 3.5-39.7.6-6.3h-36V51.5zm0-24.8h38.2l1.3-15.2H64v15.2z"/><path fill="#fff" d="M64 51.5H44.2l-1.3-15.2H64V21.1H27.5l4 45.6H64V51.5zm0 30.5v-15.2H46.9l2.7 30.5L64 91.2V75.4l-16.5-4.5 1.4-15.3H64v26.4z"/></svg>`,
  },
  css3: {
    slug: "css3",
    name: "CSS3",
    category: "Languages",
    officialUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    brandColor: "#1572B6",
    svg: `<svg viewBox="0 0 128 128"><path fill="#1572B6" d="M19.1 114.7L8.4 0h111.2l-10.7 114.7L64 128l-44.9-13.3z"/><path fill="#33A9DC" d="M64 117.8l36.7-10.9 9-97.1H64v108z"/><path fill="#ECECEC" d="M64 51.5h19.8l-1.4 15.3H64v15.2h18.2l-1.7 19.3-16.5 4.5v15.8l31.9-8.8 3.5-39.7.6-6.3h-36V51.5zm0-24.8h38.2l1.3-15.2H64v15.2z"/><path fill="#fff" d="M64 51.5H44.2l-1.3-15.2H64V21.1H27.5l4 45.6H64V51.5zm0 30.5v-15.2H46.9l2.7 30.5L64 91.2V75.4l-16.5-4.5 1.4-15.3H64v26.4z"/></svg>`,
  },
  threejs: {
    slug: "threejs",
    name: "Three.js / WebGL",
    category: "Frontend",
    officialUrl: "https://threejs.org",
    brandColor: "#000000",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5l10 5.8v11.4L12 24.5 2 18.7V7.3L12 1.5zm0 2.3L4.2 8.3 12 12.8l7.8-4.5L12 3.8zm-8 6.2v8.2l7 4.1v-8.2l-7-4.1zm16 0l-7 4.1v8.2l7-4.1v-8.2z"/></svg>`,
  },
};

/**
 * Normalization dictionary mapping diverse casing and synonyms to canonical technology slugs.
 */
const ALIASES: Record<string, string> = {
  // React
  react: "react",
  "react.js": "react",
  reactjs: "react",
  "react js": "react",

  // Next.js
  nextjs: "nextjs",
  "next.js": "nextjs",
  next: "nextjs",
  "next js": "nextjs",

  // TypeScript
  ts: "typescript",
  typescript: "typescript",
  type_script: "typescript",

  // JavaScript
  js: "javascript",
  javascript: "javascript",
  java_script: "javascript",
  ecmascript: "javascript",

  // Tailwind CSS
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  "tailwind css": "tailwindcss",
  "tailwind-css": "tailwindcss",

  // Node.js
  node: "nodejs",
  nodejs: "nodejs",
  "node.js": "nodejs",
  "node js": "nodejs",

  // Python
  python: "python",
  py: "python",
  python3: "python",

  // PostgreSQL
  postgres: "postgresql",
  postgresql: "postgresql",
  psql: "postgresql",
  "postgres sql": "postgresql",

  // MongoDB
  mongo: "mongodb",
  mongodb: "mongodb",
  "mongo db": "mongodb",

  // Docker
  docker: "docker",
  container: "docker",

  // Git / GitHub
  git: "git",
  github: "github",

  // Supabase
  supabase: "supabase",

  // Firebase
  firebase: "firebase",

  // Figma
  figma: "figma",

  // AI & Models
  openai: "openai",
  chatgpt: "openai",
  "gpt-4": "openai",
  gemini: "gemini",
  "google gemini": "gemini",

  // AWS
  aws: "aws",
  "amazon web services": "aws",

  // Vite
  vite: "vite",
  vitejs: "vite",

  // HTML / CSS
  html: "html5",
  html5: "html5",
  css: "css3",
  css3: "css3",

  // Three.js
  threejs: "threejs",
  "three.js": "threejs",
  webgl: "threejs",
};

/**
 * Known soft skills dictionary.
 * Maps soft skills to meaningful non-technical categorizations to avoid misleading tech logos.
 */
const SOFT_SKILLS: Record<string, { icon: TechnologyItem["softSkillIcon"]; label: string }> = {
  communication: { icon: "MessageSquare", label: "Communication" },
  leadership: { icon: "Users", label: "Leadership" },
  teamwork: { icon: "Users", label: "Teamwork" },
  collaboration: { icon: "Users", label: "Collaboration" },
  "problem solving": { icon: "Lightbulb", label: "Problem Solving" },
  "critical thinking": { icon: "Lightbulb", label: "Critical Thinking" },
  creativity: { icon: "Lightbulb", label: "Creativity" },
  mentorship: { icon: "Compass", label: "Mentorship" },
  agile: { icon: "Compass", label: "Agile / Scrum" },
  scrum: { icon: "Compass", label: "Scrum Master" },
  management: { icon: "Briefcase", label: "Project Management" },
  "product management": { icon: "Briefcase", label: "Product Management" },
};

/**
 * Normalize an arbitrary user string into a canonical slug.
 */
export function normalizeTechnologySlug(rawName: string): string {
  if (!rawName) return "";
  const cleaned = rawName
    .trim()
    .toLowerCase()
    .replace(/[#]/g, "sharp")
    .replace(/\+/g, "p");

  return ALIASES[cleaned] || cleaned.replace(/[^a-z0-9]/g, "");
}

/**
 * Look up technology metadata for a given name or slug.
 */
export function getTechnologyInfo(nameOrSlug: string): TechnologyItem | null {
  if (!nameOrSlug) return null;
  const slug = normalizeTechnologySlug(nameOrSlug);

  if (TECHNOLOGY_REGISTRY[slug]) {
    return TECHNOLOGY_REGISTRY[slug];
  }

  // Check if it's a known soft skill
  const lower = nameOrSlug.trim().toLowerCase();
  if (SOFT_SKILLS[lower]) {
    return {
      slug: lower,
      name: SOFT_SKILLS[lower].label,
      category: "Soft Skills",
      isSoftSkill: true,
      softSkillIcon: SOFT_SKILLS[lower].icon,
    };
  }

  return null;
}

/**
 * Returns raw SVG string for inclusion in HTML or dangerouslySetInnerHTML.
 */
export function getTechnologySvg(nameOrSlug: string, size = 16): string {
  const info = getTechnologyInfo(nameOrSlug);
  if (info && info.svg) {
    return `<span style="display:inline-flex;width:${size}px;height:${size}px;align-items:center;justify-content:center;flex-shrink:0;">${info.svg}</span>`;
  }

  // Neutral Code fallback for unknown technologies
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`;
}
