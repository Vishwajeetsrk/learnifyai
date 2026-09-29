import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, key);

const COURSE_SLUG = "designing-user-interfaces-and-experiences";
const COURSE_TITLE = "Designing User Interfaces and Experiences (UI & UX)";
const ADMIN_USER_ID = "aa073db3-bce9-47cd-a490-40a6894a9edf";
const LOCAL_COURSE_ROOT = "C:\\Users\\Vishwajeet\\Music\\Learnify AI Courses\\Designing User Interfaces and Experiences (UI & UX)";

function getLocalDoc(relativePath, fallback) {
  try {
    if (!relativePath || !relativePath.toLowerCase().endsWith(".md")) {
      return fallback;
    }
    const fullPath = path.join(LOCAL_COURSE_ROOT, relativePath);
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, "utf8");
    }
  } catch (err) {
    // fallback
  }
  return fallback;
}

async function run() {
  console.log("==========================================================");
  console.log("  Learnify AI: Seeding UI & UX Course into Supabase");
  console.log("==========================================================");

  // 1. Create or Update Course
  console.log("\n[1/3] Upserting Course record...");
  const coursePayload = {
    slug: COURSE_SLUG,
    title: COURSE_TITLE,
    description:
      "The success of a system, product, or application relies on delivering a seamless and engaging user experience. The User-Centered Design (UCD) framework ensures that the final product aligns with user requirements. Learn visual design principles, responsive web design, progressive web apps, and master Figma from wireframes to high-fidelity interactive prototypes.",
    cover_url: null, // CardVisual renders canonical figma branding
    category: "UI/UX Design",
    level: "Beginner",
    price_inr: 0,
    instructor: "Learnify AI",
    duration_minutes: 360,
    published: true,
    created_by: ADMIN_USER_ID,
    certificate_enabled: true,
    completion_threshold: 100,
    requirements: [
      "Basic computer literacy",
      "No prior design or programming experience required",
      "Free Figma account (browser-based)"
    ],
    outcomes: [
      "Master User-Centered Design (UCD) & Design Thinking methodologies",
      "Apply visual design principles: hierarchy, contrast, balance & typography",
      "Implement Responsive Web Design (RWD) & Progressive Web Apps (PWA)",
      "Design professional web and mobile prototypes using Figma & Auto Layout",
      "Build interactive prototypes and export assets for real-world development"
    ],
    target_audience:
      "Aspiring UI/UX designers, frontend developers, product managers, and entrepreneurs looking to master interface design."
  };

  const { data: existingCourse } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", COURSE_SLUG)
    .maybeSingle();

  let courseId;
  if (existingCourse) {
    courseId = existingCourse.id;
    console.log(`Course exists (ID: ${courseId}), updating metadata...`);
    const { error: updErr } = await supabase
      .from("courses")
      .update(coursePayload)
      .eq("id", courseId);
    if (updErr) throw updErr;
  } else {
    console.log("Creating new course entry...");
    const { data: newCourse, error: insErr } = await supabase
      .from("courses")
      .insert(coursePayload)
      .select("id")
      .single();
    if (insErr) throw insErr;
    courseId = newCourse.id;
    console.log(`Course created with ID: ${courseId}`);
  }

  // 2. Modules
  console.log("\n[2/3] Setting up Course Modules...");
  const modulesData = [
    {
      order_index: 0,
      title: "Designing Intuitive Front Ends and Mockup Design Principles",
      description:
        "User-Centered Design (UCD), design thinking problem-solving process, wireframing, prototyping, and visual design principles."
    },
    {
      order_index: 1,
      title: "Web Design Methodologies",
      description:
        "Responsive Web Design (RWD), mobile-first design, adaptive vs fluid layouts, media queries, PWAs, and Service Workers."
    },
    {
      order_index: 2,
      title: "UI Design with Figma",
      description:
        "Essential concepts of Figma: Frames, Components, Layers, Styles, Libraries, Cards, Layout Grids, and Dev Mode."
    },
    {
      order_index: 3,
      title: "Final Project and Assessment",
      description:
        "Comprehensive capstone project designing an interactive sales app using Figma and visual no-code tools."
    }
  ];

  const moduleIds = {};

  for (const m of modulesData) {
    const { data: existingMod } = await supabase
      .from("course_modules")
      .select("id")
      .eq("course_id", courseId)
      .eq("order_index", m.order_index)
      .maybeSingle();

    if (existingMod) {
      await supabase
        .from("course_modules")
        .update({ title: m.title, description: m.description })
        .eq("id", existingMod.id);
      moduleIds[m.order_index] = existingMod.id;
      console.log(`  [.] Module ${m.order_index + 1} updated: ${m.title}`);
    } else {
      const { data: newMod, error: modErr } = await supabase
        .from("course_modules")
        .insert({
          course_id: courseId,
          title: m.title,
          description: m.description,
          order_index: m.order_index
        })
        .select("id")
        .single();
      if (modErr) throw modErr;
      moduleIds[m.order_index] = newMod.id;
      console.log(`  [+] Module ${m.order_index + 1} created: ${m.title}`);
    }
  }

  // 3. Lessons Definition
  console.log("\n[3/3] Syncing 72 Course Lessons (Videos, Readings, Labs, Quizzes)...");

  const rawLessons = [
    // ── MODULE 1 ──
    {
      modIdx: 0,
      title: "1. Course Introduction",
      type: "video",
      duration: 5,
      preview: true,
      desc: "Welcome to Designing User Interfaces and Experiences (UI & UX). An overview of what you will master.",
      localFile: "Module 1\\1. Welcome\\1. Course Introduction.mp4"
    },
    {
      modIdx: 0,
      title: "2. Course Overview",
      type: "reading",
      duration: 10,
      preview: true,
      desc: "Course prerequisites, high-level objectives, weekly commitment, and curriculum outline.",
      localFile: "Module 1\\1. Welcome\\2. Course Overview.md"
    },
    {
      modIdx: 0,
      title: "3. How to make the most out of this course",
      type: "reading",
      duration: 8,
      preview: true,
      desc: "Strategies and best practices for completing exercises, hands-on labs, and quizzes.",
      localFile: "Module 1\\1. Welcome\\3. How to make the most out of this course.md"
    },
    {
      modIdx: 0,
      title: "4. What is Design and UI/UX?",
      type: "video",
      duration: 8,
      preview: true,
      desc: "The foundations of digital interface and experience design, defining roles and user expectations.",
      localFile: "Module 1\\2. Introduction to Design\\4. What is Design and UI & UX.mp4"
    },
    {
      modIdx: 0,
      title: "5. Importance of UI/UX",
      type: "video",
      duration: 8,
      preview: false,
      desc: "Why user experience drives modern product adoption, conversion rates, and brand loyalty.",
      localFile: "Module 1\\2. Introduction to Design\\5. Importance of UI & UX.mp4"
    },
    {
      modIdx: 0,
      title: "6. Design Thinking",
      type: "video",
      duration: 10,
      preview: false,
      desc: "The five iterative phases of Design Thinking: Empathize, Define, Ideate, Prototype, and Test.",
      localFile: "Module 1\\2. Introduction to Design\\6. Design Thinking.mp4"
    },
    {
      modIdx: 0,
      title: "7. UX Design and Strategies",
      type: "video",
      duration: 12,
      preview: false,
      desc: "Strategic UX methodologies, user research, user journey mapping, and persona creation.",
      localFile: "Module 1\\2. Introduction to Design\\7. UX Design and Strategies.mp4"
    },
    {
      modIdx: 0,
      title: "8. Wireframing and Prototyping",
      type: "video",
      duration: 11,
      preview: false,
      desc: "Low-fidelity wireframe sketches to validate information architecture before high-fidelity visual design.",
      localFile: "Module 1\\2. Introduction to Design\\8. Wireframing and Prototyping.mp4"
    },
    {
      modIdx: 0,
      title: "9. Design Methodologies and Approaches",
      type: "video",
      duration: 9,
      preview: false,
      desc: "Comparing User-Centered Design (UCD), Agile design sprints, and iterative product loops.",
      localFile: "Module 1\\2. Introduction to Design\\9. Design Methodologies and Approaches.mp4"
    },
    {
      modIdx: 0,
      title: "10. Visual Design Principles in UI Design",
      type: "video",
      duration: 12,
      preview: false,
      desc: "Alignment, visual hierarchy, contrast, repetition, proximity, balance, and white space.",
      localFile: "Module 1\\2. Introduction to Design\\10. Visual Design Principles in UI Design.mp4"
    },
    {
      modIdx: 0,
      title: "11. UI Design in Figma",
      type: "video",
      duration: 14,
      preview: false,
      desc: "First walkthrough of Figma interface, artboard canvas, vector shapes, and styling panels.",
      localFile: "Module 1\\2. Introduction to Design\\11. UI Design in Figma.mp4"
    },
    {
      modIdx: 0,
      title: "12. Key qualifications and certifications required",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Industry expectations, portfolio requirements, and career qualifications for UI/UX designers.",
      localFile: "Module 1\\2. Introduction to Design\\12. Key qualifications and certifications required.md"
    },
    {
      modIdx: 0,
      title: "13. Beginner's Guide to Design Thinking",
      type: "reading",
      duration: 15,
      preview: false,
      desc: "A deep dive into empathizing with user pain points and developing actionable problem statements.",
      localFile: "Module 1\\2. Introduction to Design\\13. Ungraded Plugin Reading Beginner s Guide to Design Thinking.md"
    },
    {
      modIdx: 0,
      title: "14. Practice Quiz: Introduction to Design",
      type: "quiz",
      duration: 10,
      preview: false,
      desc: "Check your knowledge on design thinking stages, user personas, and visual design principles.",
      localFile: "Module 1\\2. Introduction to Design\\14. Graded Assignment Practice Quiz Introduction to Design.md"
    },
    {
      modIdx: 0,
      title: "15. Designing a User Interface",
      type: "video",
      duration: 13,
      preview: false,
      desc: "Step-by-step layout construction of navigation bars, hero sections, and card grids.",
      localFile: "Module 1\\3. Mockup Design Concepts\\15. Designing a User Interface.mp4"
    },
    {
      modIdx: 0,
      title: "16. Typography, Readability, and Color Theory in UI Design",
      type: "video",
      duration: 14,
      preview: false,
      desc: "Typographic scale, line-height, kerning, color contrast ratios (WCAG), and 60-30-10 color rule.",
      localFile: "Module 1\\3. Mockup Design Concepts\\16. Typography, Readability, and Color Theory in UI Design.mp4"
    },
    {
      modIdx: 0,
      title: "17. Best Practices in UI Design for Web and Mobile",
      type: "video",
      duration: 12,
      preview: false,
      desc: "Designing touch-friendly mobile tap targets, accessible modal sheets, and desktop layouts.",
      localFile: "Module 1\\3. Mockup Design Concepts\\17. Best Practices in UI Design for Web and Mobile.mp4"
    },
    {
      modIdx: 0,
      title: "18. Do's and Don'ts of Mockup Design",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Critical dos and don'ts in spacing, contrast, font pairings, and responsive container constraints.",
      localFile: "Module 1\\3. Mockup Design Concepts\\18. Do's and Don'ts of Mockup Design.md"
    },
    {
      modIdx: 0,
      title: "19. Hands-on Lab: Create a Mockup Design for a Website using Draw.io",
      type: "lab",
      duration: 25,
      preview: false,
      desc: "Build a structured low-fidelity mockup for an e-commerce website using Draw.io.",
      localFile: "Module 1\\3. Mockup Design Concepts\\19. Hands-on Lab Create a Mockup Design for a Website using Draw.io.md"
    },
    {
      modIdx: 0,
      title: "20. Practice Quiz: Mockup Design Concepts",
      type: "quiz",
      duration: 10,
      preview: false,
      desc: "Evaluate your understanding of UI mockup components, wireframe fidelity, and accessibility.",
      localFile: "Module 1\\3. Mockup Design Concepts\\20. Graded Assignment Practice Quiz Mockup Design Concepts.md"
    },
    {
      modIdx: 0,
      title: "21. Module 1 Summary: Designing Intuitive Front Ends and Mockup Design Principles",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Core takeaways and executive review of Module 1 concepts.",
      localFile: "Module 1\\4. Module 1 Summary, Assessment and Discussion\\21. Module 1 Summary Designing Intuitive Front Ends and Mockup Design Principles.md"
    },
    {
      modIdx: 0,
      title: "22. Module 1 Graded Quiz: Designing Intuitive Front Ends and Mockup Design Principles",
      type: "quiz",
      duration: 15,
      preview: false,
      desc: "Graded assessment testing your grasp of User-Centered Design and visual principles.",
      localFile: "Module 1\\4. Module 1 Summary, Assessment and Discussion\\22. Module 1 Graded Quiz Designing Intuitive Front Ends and Mockup Design Principles.md"
    },

    // ── MODULE 2 ──
    {
      modIdx: 1,
      title: "1. Introduction to Responsive Web Design (RWD)",
      type: "video",
      duration: 10,
      preview: false,
      desc: "The core foundations of RWD: fluid grids, flexible media, and CSS media queries.",
      localFile: "Module 2\\1. Responsive Web Design\\1. Introduction to Responsive Web Design (RWD).mp4"
    },
    {
      modIdx: 1,
      title: "2. Mobile First Design",
      type: "video",
      duration: 9,
      preview: false,
      desc: "Designing for small screens first to prioritize primary content and optimize bandwidth.",
      localFile: "Module 2\\1. Responsive Web Design\\2. Mobile First Design.mp4"
    },
    {
      modIdx: 1,
      title: "3. Adaptive Layouts and Fluid Layouts",
      type: "video",
      duration: 8,
      preview: false,
      desc: "Comparing fluid proportional scaling with discrete adaptive breakpoint architectures.",
      localFile: "Module 2\\1. Responsive Web Design\\3. Adaptive Layouts and Fluid Layouts.mp4"
    },
    {
      modIdx: 1,
      title: "4. Working with Media Queries",
      type: "video",
      duration: 11,
      preview: false,
      desc: "Writing effective CSS media queries using min-width rules for modern responsive viewports.",
      localFile: "Module 2\\1. Responsive Web Design\\4. Working with Media Queries.mp4"
    },
    {
      modIdx: 1,
      title: "5. Responsive Web Design Best Practices",
      type: "video",
      duration: 10,
      preview: false,
      desc: "Touch target sizing, font scaling with rem units, and preventing horizontal layout breakages.",
      localFile: "Module 2\\1. Responsive Web Design\\5. Responsive Web Design Best Practices.mp4"
    },
    {
      modIdx: 1,
      title: "6. Cross Device Validation and Testing",
      type: "video",
      duration: 9,
      preview: false,
      desc: "Testing across multiple browser engines and mobile emulators for visual consistency.",
      localFile: "Module 2\\1. Responsive Web Design\\6. Cross Device Validation and Testing.mp4"
    },
    {
      modIdx: 1,
      title: "7. Reading: Best Practices for Mobile-First Design",
      type: "reading",
      duration: 15,
      preview: false,
      desc: "In-depth reference on tap targets, viewport tags, fluid typography, and bandwidth discipline.",
      localFile: "Module 2\\1. Responsive Web Design\\7. Ungraded Plugin Reading Best Practices for Mobile-First Design.md"
    },
    {
      modIdx: 1,
      title: "8. Hands-on Lab: View in Responsive and Nonresponsive in Emulator",
      type: "lab",
      duration: 20,
      preview: false,
      desc: "Use Chrome DevTools Device Mode to inspect viewport meta tags and network throttling.",
      localFile: "Module 2\\1. Responsive Web Design\\8. Ungraded Plugin Hands-on Lab View in Responsive and Nonresponsive in Emulator.md"
    },
    {
      modIdx: 1,
      title: "9. Practice Quiz: Responsive Design",
      type: "quiz",
      duration: 10,
      preview: false,
      desc: "Assess your knowledge of viewport configurations, relative units, and media query strategies.",
      localFile: "Module 2\\1. Responsive Web Design\\9. Graded Assignment Practice Quiz Responsive Design.md"
    },
    {
      modIdx: 1,
      title: "10. Introduction to Progressive Web Development",
      type: "video",
      duration: 10,
      preview: false,
      desc: "Bridging the gap between open web reach and native mobile application capability.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\10. Introduction to Progressive Web Development.mp4"
    },
    {
      modIdx: 1,
      title: "11. Progressive Web Development Technologies",
      type: "video",
      duration: 12,
      preview: false,
      desc: "Service Workers, Cache Storage API, Web App Manifests, and background synchronization.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\11. Progressive Web Development Technologies.mp4"
    },
    {
      modIdx: 1,
      title: "12. Single Page Applications (SPA)",
      type: "video",
      duration: 9,
      preview: false,
      desc: "Client-side routing and dynamic DOM updates for fluid, app-like page transitions.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\12. Single Page Applications (SPA).mp4"
    },
    {
      modIdx: 1,
      title: "13. Service Worker, Push Notifications and Caching",
      type: "video",
      duration: 11,
      preview: false,
      desc: "Implementing offline caching strategies and re-engaging users through push notifications.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\13. Service Worker, Push Notifications and Caching.mp4"
    },
    {
      modIdx: 1,
      title: "14. Converting Existing App to PWA",
      type: "video",
      duration: 12,
      preview: false,
      desc: "Step-by-step walkthrough to turn a traditional web app into an installable PWA.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\14. Converting Existing App to PWA.mp4"
    },
    {
      modIdx: 1,
      title: "15. Progressive Web Applications in Action",
      type: "video",
      duration: 10,
      preview: false,
      desc: "Case studies of production PWAs delivering faster load times and higher engagement.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\15. Progressive Web Applications in Action.mp4"
    },
    {
      modIdx: 1,
      title: "16. No Code & Low Code Tools",
      type: "video",
      duration: 9,
      preview: false,
      desc: "How modern product teams leverage visual builders to accelerate MVP releases.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\16. No Code & Low Code Tools.mp4"
    },
    {
      modIdx: 1,
      title: "17. Hands-on Lab: Design a Progressive Web App",
      type: "lab",
      duration: 25,
      preview: false,
      desc: "Build a manifest.json file, register a Service Worker, and implement offline fallback caching.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\17. App Item Hands-on Lab Design a Progressive Web App.md"
    },
    {
      modIdx: 1,
      title: "18. Practice Quiz: Progressive Web Development (PWD)",
      type: "quiz",
      duration: 10,
      preview: false,
      desc: "Review Service Worker lifecycles, manifest properties, and SPA principles.",
      localFile: "Module 2\\2. Progressive Web Development & No Code\\18. Graded Assignment Practice Quiz Progressive Web Development (PWD).md"
    },
    {
      modIdx: 1,
      title: "19. Module 2 Summary: Web Design Methodologies",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Executive summary of responsive web design and progressive web app methodologies.",
      localFile: "Module 2\\3. Module 2 Summary and Assessment\\19. Module 2 Summary Web Design Methodologies.md"
    },
    {
      modIdx: 1,
      title: "20. Module 2 Graded Quiz: Web Design Methodologies",
      type: "quiz",
      duration: 15,
      preview: false,
      desc: "Comprehensive graded quiz testing responsive layouts, media queries, and PWAs.",
      localFile: "Module 2\\3. Module 2 Summary and Assessment\\20. Module 2 Graded Quiz Web Design Methodologies.md"
    },

    // ── MODULE 3 ──
    {
      modIdx: 2,
      title: "1. What is Figma?",
      type: "video",
      duration: 8,
      preview: false,
      desc: "Cloud-native collaborative design: why modern product teams choose Figma.",
      localFile: "Module 3\\1. Getting Started with Figma\\1. What is Figma.mp4"
    },
    {
      modIdx: 2,
      title: "2. Essential Concepts of Figma",
      type: "video",
      duration: 11,
      preview: false,
      desc: "Frames, Components, Layers, Prototyping, Auto Layout, and Smart Animate.",
      localFile: "Module 3\\1. Getting Started with Figma\\2. Essential Concepts of Figma.mp4"
    },
    {
      modIdx: 2,
      title: "3. Setup and Configure Figma",
      type: "video",
      duration: 7,
      preview: false,
      desc: "Account creation, configuring workspace settings, and setting up design files.",
      localFile: "Module 3\\1. Getting Started with Figma\\3. Setup and Configure Figma.mp4"
    },
    {
      modIdx: 2,
      title: "4. Images, Shapes, and Tools",
      type: "video",
      duration: 12,
      preview: false,
      desc: "Using the pen tool, vector networks, image fills, masks, and Boolean operators.",
      localFile: "Module 3\\1. Getting Started with Figma\\4. Images, Shapes, and Tools.mp4"
    },
    {
      modIdx: 2,
      title: "5. Getting Started with Figma and its Features",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Comprehensive reference on Figma platform architecture, Frames vs Groups, and Auto Layout.",
      localFile: "Module 3\\1. Getting Started with Figma\\5. Getting Started with Figma and its Features.md"
    },
    {
      modIdx: 2,
      title: "6. Hands-on Lab: Getting started with Figma",
      type: "lab",
      duration: 20,
      preview: false,
      desc: "Create artboard frames, design basic navigation shapes, and link your first prototype hotspot.",
      localFile: "Module 3\\1. Getting Started with Figma\\6. Ungraded Plugin Hands-on Lab Getting started with Figma.md"
    },
    {
      modIdx: 2,
      title: "7. Reading: Figma's Guide to Collaboration and Sharing Prototypes",
      type: "reading",
      duration: 12,
      preview: false,
      desc: "Multiplayer cursors, Observation Mode, contextual commenting, and Dev Mode handoff.",
      localFile: "Module 3\\1. Getting Started with Figma\\7. Ungraded Plugin Reading Figma's Guide to Collaboration and Sharing Prototypes.md"
    },
    {
      modIdx: 2,
      title: "8. Practice Quiz: Figma Introduction",
      type: "quiz",
      duration: 10,
      preview: false,
      desc: "Verify your understanding of Frames, clipping boundaries, and collaboration tools.",
      localFile: "Module 3\\1. Getting Started with Figma\\8. Graded Assignment Practice Quiz Figma Introduction.md"
    },
    {
      modIdx: 2,
      title: "9. Working with Figma",
      type: "video",
      duration: 10,
      preview: false,
      desc: "Deep dive into canvas organization, color swatches, typography styles, and layer hierarchy.",
      localFile: "Module 3\\2. Working with Figma & Design Systems\\9. Working with Figma.mp4"
    },
    {
      modIdx: 2,
      title: "10. Getting Started with Components",
      type: "video",
      duration: 12,
      preview: false,
      desc: "Creating Master Components, instantiating variants, and managing local overrides.",
      localFile: "Module 3\\2. Working with Figma & Design Systems\\10. Getting Started with Components.mp4"
    },
    {
      modIdx: 2,
      title: "11. Styles and Libraries in Figma",
      type: "video",
      duration: 11,
      preview: false,
      desc: "Publishing team design libraries and synchronizing color and typography tokens.",
      localFile: "Module 3\\2. Working with Figma & Design Systems\\11. Styles and Libraries in Figma.mp4"
    },
    {
      modIdx: 2,
      title: "12. Cards and Layout Grids in Figma",
      type: "video",
      duration: 10,
      preview: false,
      desc: "Building extensible card containers and configuring 12-column responsive layout grids.",
      localFile: "Module 3\\2. Working with Figma & Design Systems\\12. Cards and Layout Grids in Figma.mp4"
    },
    {
      modIdx: 2,
      title: "13. Hands-on Lab: Design a landing page for a travel website using Figma",
      type: "lab",
      duration: 30,
      preview: false,
      desc: "Design a responsive hero section and reusable destination cards using Auto Layout.",
      localFile: "Module 3\\2. Working with Figma & Design Systems\\13. Ungraded Plugin Hands-on Lab Design a landing page for a travel website using Figma.md"
    },
    {
      modIdx: 2,
      title: "14. Reading: Leveraging Figma: From Design to Code Features",
      type: "reading",
      duration: 12,
      preview: false,
      desc: "Inspecting CSS box models, design token mapping, and optimal SVG/WebP asset exports.",
      localFile: "Module 3\\2. Working with Figma & Design Systems\\14. Ungraded Plugin Reading Leveraging Figma From Design to Code Features.md"
    },
    {
      modIdx: 2,
      title: "15. Reading: Leveraging AI-Driven Features and Plugins",
      type: "reading",
      duration: 12,
      preview: false,
      desc: "Automating layout drafts, realistic copywriting, icon searches, and contrast checks with plugins.",
      localFile: "Module 3\\2. Working with Figma & Design Systems\\15. Ungraded Plugin Reading Leveraging AI-Driven Features and Plugins.md"
    },
    {
      modIdx: 2,
      title: "16. Practice Quiz: Intermediate Figma",
      type: "quiz",
      duration: 10,
      preview: false,
      desc: "Test your skills on Auto Layout resizing, component variants, and design tokens.",
      localFile: "Module 3\\2. Working with Figma & Design Systems\\16. Graded Assignment Practice Quiz Intermediate Figma.md"
    },
    {
      modIdx: 2,
      title: "17. Module 3 Summary: UI Design with Figma",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Comprehensive review of Figma component systems, layout grids, and prototyping.",
      localFile: "Module 3\\3. Module 3 Summary and Assessment\\17. Module 3 Summary UI Design with Figma.md"
    },
    {
      modIdx: 2,
      title: "18. Module 3 Graded Quiz: UI Design with Figma",
      type: "quiz",
      duration: 15,
      preview: false,
      desc: "Graded quiz evaluating your mastery of Figma features, Auto Layout, and design systems.",
      localFile: "Module 3\\3. Module 3 Summary and Assessment\\18. Module 3 Graded Quiz UI Design with Figma.md"
    },

    // ── MODULE 4 ──
    {
      modIdx: 3,
      title: "1. Final Project Overview",
      type: "reading",
      duration: 15,
      preview: false,
      desc: "Comprehensive project brief for building the Sales Pro interactive mobile application.",
      localFile: "Module 4\\1. Final Project and Assessment\\1. Ungraded Plugin Final Project Overview.md"
    },
    {
      modIdx: 3,
      title: "2. Hands-On Lab: Building a Sales App with Figma's Interactive Design Tools",
      type: "lab",
      duration: 40,
      preview: false,
      desc: "Design the KPI sales dashboard, fixed navigation, and bottom modal sheets with Smart Animate.",
      localFile: "Module 4\\1. Final Project and Assessment\\2. Ungraded Plugin Hands-On Lab Building a Sales App with Figma's Interactive Design Tools.md"
    },
    {
      modIdx: 3,
      title: "3. Getting started with Thunkable and its features",
      type: "reading",
      duration: 15,
      preview: false,
      desc: "Overview of visual block-based programming, Figma asset importing, and native mobile testing.",
      localFile: "Module 4\\1. Final Project and Assessment\\3. Video Getting started with Thunkable and its features.md"
    },
    {
      modIdx: 3,
      title: "4. Hands-on Lab: Thunkable-UI from Hand Drawn Images",
      type: "lab",
      duration: 30,
      preview: false,
      desc: "Translate paper sketches into functional interactive app components with block logic.",
      localFile: "Module 4\\1. Final Project and Assessment\\4. Ungraded Plugin Hands-on Lab Thunkable-UI from Hand Drawn Images.md"
    },
    {
      modIdx: 3,
      title: "5. About the Practice Project",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Real-world project scenario for Apex Retail Solutions logistics field app.",
      localFile: "Module 4\\1. Final Project and Assessment\\5. Ungraded Plugin About the Practice Project.md"
    },
    {
      modIdx: 3,
      title: "6. Final Project Enhancement: Scenario and Self Evaluation Criteria",
      type: "reading",
      duration: 15,
      preview: false,
      desc: "100-point rubric assessing User-Centered Design, visual systems, components, and polish.",
      localFile: "Module 4\\1. Final Project and Assessment\\6. Ungraded Plugin Final Project Enhancement Scenario and Self Evaluation Criteria.md"
    },
    {
      modIdx: 3,
      title: "7. Final Project Enhancement: Sales App using Figma",
      type: "reading",
      duration: 25,
      preview: false,
      desc: "Advanced polish techniques: interactive form validation states, micro-interactions, and dark mode.",
      localFile: "Module 4\\1. Final Project and Assessment\\7. Ungraded Plugin Final Project Enhancement Sales App using Figma.md"
    },
    {
      modIdx: 3,
      title: "8. Final Project Enhancement: Sales App using Thunkable",
      type: "reading",
      duration: 25,
      preview: false,
      desc: "Connecting Google Sheets / Airtable databases and implementing checkout logic blocks.",
      localFile: "Module 4\\1. Final Project and Assessment\\8. Ungraded Plugin Final Project Enhancement Sales App using Thunkable.md"
    },
    {
      modIdx: 3,
      title: "9. Useful UI/UX Resources and References",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Curated bookmarks: design systems, pattern libraries, accessibility guides, and Laws of UX.",
      localFile: "Module 4\\1. Final Project and Assessment\\9. Reading Useful UI UX Resources and References.md"
    },
    {
      modIdx: 3,
      title: "10. Congratulations and Next Steps",
      type: "reading",
      duration: 10,
      preview: false,
      desc: "Celebrate your accomplishments and learn how to build your case study and portfolio.",
      localFile: "Module 4\\1. Final Project and Assessment\\10. Reading Congratulations and Next Steps.md"
    },
    {
      modIdx: 3,
      title: "11. Thanks from the Course Team",
      type: "reading",
      duration: 5,
      preview: false,
      desc: "Final message from the Learnify AI design and curriculum team.",
      localFile: "Module 4\\1. Final Project and Assessment\\11. Reading Thanks from the Course Team.md"
    },
    {
      modIdx: 3,
      title: "12. Module 4 Graded Final Comprehensive Assessment",
      type: "quiz",
      duration: 20,
      preview: false,
      desc: "10-question final comprehensive examination covering the entire UI/UX curriculum.",
      localFile: "Module 4\\1. Final Project and Assessment\\12. Module 4 Final Graded Assessment.md"
    }
  ];

  // Fetch existing lessons
  const { data: existingLessons } = await supabase
    .from("lessons")
    .select("id, title, order_index")
    .eq("course_id", courseId);

  const existingMap = new Map();
  (existingLessons ?? []).forEach((l) => existingMap.set(l.order_index, l.id));

  let syncedLessons = 0;
  for (let i = 0; i < rawLessons.length; i++) {
    const item = rawLessons[i];
    const modId = moduleIds[item.modIdx];

    // Read markdown content if available
    const docContent = getLocalDoc(
      item.localFile,
      `# ${item.title}\n\n${item.desc}\n\n> Complete this lesson as part of **${COURSE_TITLE}**.`
    );

    const lessonPayload = {
      course_id: courseId,
      module_id: modId,
      title: item.title,
      description: item.desc,
      content_md: docContent,
      duration_minutes: item.duration,
      is_preview: item.preview,
      is_free_preview: item.preview,
      order_index: i,
      video_url: item.type === "video" ? null : null, // Admin can set hosted video URLs in Admin Panel
      content_format: "markdown",
      tags: ["ui-ux", "figma", "design-thinking"]
    };

    if (existingMap.has(i)) {
      const lessonId = existingMap.get(i);
      const { error: err } = await supabase.from("lessons").update(lessonPayload).eq("id", lessonId);
      if (err) console.error(`Error updating lesson ${i} (${item.title}):`, err.message);
    } else {
      const { error: err } = await supabase.from("lessons").insert(lessonPayload);
      if (err) console.error(`Error inserting lesson ${i} (${item.title}):`, err.message);
    }
    syncedLessons++;
  }

  console.log(`[✓] Successfully synced ${syncedLessons} lessons!`);
  console.log("\n==========================================================");
  console.log(`  Course Setup Complete!`);
  console.log(`  Course Title: ${COURSE_TITLE}`);
  console.log(`  Slug: ${COURSE_SLUG}`);
  console.log(`  Admin URL: http://localhost:3000/admin/courses`);
  console.log(`  Student URL: http://localhost:3000/courses/${COURSE_SLUG}`);
  console.log("==========================================================");
}

run().catch((err) => {
  console.error("FATAL ERROR during course seed:", err);
  process.exit(1);
});
