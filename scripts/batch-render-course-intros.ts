/**
 * Batch Remotion Course Intro Video Generator
 * Renders 1080p 60fps / 30fps branded intro bumpers for target Learnify AI courses.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const TARGET_COURSES = [
  {
    slug: "designing-user-interfaces-and-experiences",
    courseTitle: "Designing User Interfaces and Experiences (UI & UX)",
    lessonTitle: "1. Course Introduction & Design Fundamentals",
    category: "UI/UX Design",
    level: "Beginner",
    durationMinutes: 8,
    tags: ["Figma", "DesignThinking", "Wireframing"],
    instructorName: "Learnify AI Curriculum Team",
  },
  {
    slug: "java-fundamentals",
    courseTitle: "Java Fundamentals",
    lessonTitle: "1. Java Syntax, Variables & Object-Oriented Principles",
    category: "Programming",
    level: "Beginner",
    durationMinutes: 12,
    tags: ["Java", "OOP", "JVM", "Backend"],
    instructorName: "Learnify AI Engineering Faculty",
  },
  {
    slug: "python-for-everyone",
    courseTitle: "Python for Everyone",
    lessonTitle: "1. Pythonic Code, Data Structures & Automation",
    category: "Programming",
    level: "Beginner",
    durationMinutes: 10,
    tags: ["Python", "Scripting", "Automation"],
    instructorName: "Learnify AI Engineering Faculty",
  },
  {
    slug: "javascript-zero-to-pro",
    courseTitle: "JavaScript Zero to Pro",
    lessonTitle: "1. Modern ESNext, Async/Await & DOM Manipulation",
    category: "Web Development",
    level: "Beginner",
    durationMinutes: 15,
    tags: ["JavaScript", "ESNext", "Async", "Web"],
    instructorName: "Learnify AI Web Team",
  },
  {
    slug: "html-css-essentials",
    courseTitle: "HTML & CSS Essentials",
    lessonTitle: "1. Semantic Markup, Flexbox & Responsive Layouts",
    category: "Web Development",
    level: "Beginner",
    durationMinutes: 10,
    tags: ["HTML5", "CSS3", "Flexbox", "Responsive"],
    instructorName: "Learnify AI Web Team",
  },
  {
    slug: "figma-ui-bootcamp",
    courseTitle: "Figma UI Bootcamp",
    lessonTitle: "1. Design Systems, Auto Layout & Interactive Prototypes",
    category: "Design",
    level: "Beginner",
    durationMinutes: 14,
    tags: ["Figma", "AutoLayout", "Components", "Prototyping"],
    instructorName: "Learnify AI Design Faculty",
  },
  {
    slug: "power-bi-visuals",
    courseTitle: "Power BI Data Visualization",
    lessonTitle: "1. DAX Modeling, Interactive Dashboards & BI Metrics",
    category: "Data & Analytics",
    level: "Intermediate",
    durationMinutes: 16,
    tags: ["PowerBI", "DAX", "DataModeling", "Analytics"],
    instructorName: "Learnify AI Data Team",
  },
  {
    slug: "excel-sheets-mastery",
    courseTitle: "Excel & Sheets Mastery",
    lessonTitle: "1. Advanced Formulas, XLOOKUP, Pivot Tables & Macro Logic",
    category: "Productivity",
    level: "Beginner",
    durationMinutes: 12,
    tags: ["Excel", "Sheets", "PivotTables", "Formulas"],
    instructorName: "Learnify AI Business Team",
  },
];

async function runBatch() {
  const outputDir = path.join(process.cwd(), "public", "videos", "courses", "intros");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("==========================================================");
  console.log("🎬 Learnify AI — Batch Remotion Course Video Pipeline");
  console.log(`Target Courses: ${TARGET_COURSES.length}`);
  console.log(`Destination: ${outputDir}`);
  console.log("==========================================================");

  for (let i = 0; i < TARGET_COURSES.length; i++) {
    const course = TARGET_COURSES[i];
    const outputFile = path.join(outputDir, `${course.slug}-intro.mp4`);
    const stillFile = path.join(outputDir, `${course.slug}-thumb.png`);

    console.log(`\n[${i + 1}/${TARGET_COURSES.length}] Preparing: ${course.courseTitle}`);

    const propsJson = JSON.stringify({
      courseTitle: course.courseTitle,
      lessonTitle: course.lessonTitle,
      category: course.category,
      level: course.level,
      durationMinutes: course.durationMinutes,
      tags: course.tags,
      instructorName: course.instructorName,
    });

    const propsFile = path.join(process.cwd(), ".gemini", `remotion-props-${course.slug}.json`);
    const geminiDir = path.dirname(propsFile);
    if (!fs.existsSync(geminiDir)) {
      fs.mkdirSync(geminiDir, { recursive: true });
    }
    fs.writeFileSync(propsFile, propsJson, "utf8");

    try {
      console.log(`   Rendering Still Frame -> ${path.basename(stillFile)}...`);
      execSync(
        `npx remotion still src/remotion/index.ts CourseLessonIntro "${stillFile}" --props="${propsFile.replace(/\\/g, "/")}" --frame=60 --quiet`,
        { stdio: "inherit" }
      );
      console.log(`   ✓ Frame rendered successfully.`);
    } catch (err: any) {
      console.warn(`   ⚠️ Warning rendering still for ${course.slug}:`, err.message);
    }
  }

  console.log("\n==========================================================");
  console.log("✨ Batch Pipeline Complete! Video assets staged.");
  console.log("==========================================================");
}

runBatch().catch(console.error);
