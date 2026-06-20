// Run: node scripts/seed_courses.mjs
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "https://gnvsqwyexjuuwkjibxrr.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const courses = [
  {
    slug: "full-stack-nextjs",
    title: "Full-Stack Development with Next.js 14",
    description:
      "Build production-ready full-stack applications with Next.js 14, React Server Components, App Router, authentication, database integration, and deployment. Covers everything from project setup to advanced patterns.",
    category: "Web Development",
    level: "Intermediate",
    price_inr: 499,
    instructor: "Learnify AI",
    duration_minutes: 480,
    published: true,
  },
  {
    slug: "modern-ui-ux-design-systems",
    title: "Modern UI/UX Design Systems",
    description:
      "Master the art of building scalable design systems with Figma, Tailwind CSS, and React. Learn color theory, typography, component architecture, accessibility, and design tokens.",
    category: "Design",
    level: "Intermediate",
    price_inr: 399,
    instructor: "Learnify AI",
    duration_minutes: 360,
    published: true,
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    description:
      "Learn WordPress from basics to advanced: custom themes, plugin development, REST API, headless WordPress with Next.js, performance optimization, and WooCommerce integration.",
    category: "Web Development",
    level: "Beginner",
    price_inr: 299,
    instructor: "Learnify AI",
    duration_minutes: 420,
    published: true,
  },
  {
    slug: "ai-prompt-engineering",
    title: "AI Prompt Engineering Masterclass",
    description:
      "Unlock the full potential of large language models. Learn prompt patterns, chain-of-thought reasoning, RAG architectures, function calling, and production deployment of AI features.",
    category: "AI & Machine Learning",
    level: "Intermediate",
    price_inr: 599,
    instructor: "Learnify AI",
    duration_minutes: 300,
    published: true,
  },
  {
    slug: "python-data-science",
    title: "Python for Data Science",
    description:
      "A comprehensive introduction to data science with Python. Covers NumPy, Pandas, Matplotlib, Seaborn, data cleaning, exploratory analysis, and building your first ML models.",
    category: "Data Science",
    level: "Beginner",
    price_inr: 349,
    instructor: "Learnify AI",
    duration_minutes: 540,
    published: true,
  },
  {
    slug: "typescript-mastery",
    title: "TypeScript Mastery: From Zero to Hero",
    description:
      "Deep dive into TypeScript: types, generics, utility types, decorators, advanced patterns, and integrating TypeScript with React, Node.js, and real-world projects.",
    category: "Programming",
    level: "Intermediate",
    price_inr: 449,
    instructor: "Learnify AI",
    duration_minutes: 390,
    published: true,
  },
];

async function main() {
  console.log(`Seeding ${courses.length} courses...`);

  for (const c of courses) {
    const { data: existing } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", c.slug)
      .maybeSingle();

    if (existing) {
      console.log(`  Skipping "${c.title}" — already exists`);
      continue;
    }

    const { data: course, error } = await supabase.from("courses").insert(c).select("id").single();

    if (error) {
      console.error(`  Failed to create "${c.title}": ${error.message}`);
      continue;
    }

    console.log(`  Created "${c.title}" (${course.id})`);
  }

  const { count } = await supabase.from("courses").select("id", { count: "exact", head: true });

  console.log(`\nDone! ${count} courses in the database.`);
}

main().catch(console.error);
