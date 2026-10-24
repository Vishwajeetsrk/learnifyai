import { isBinaryGarbage, cleanResumeText } from "../src/lib/file-parser.ts";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function testSuite() {
  console.log("=== RUNNING RESUME PARSER ADVERSARIAL TEST SUITE ===");

  // Test 1: Binary Garbage Detection (User's exact reported error)
  const userGarbageSnippet = `ük{¡/Ãï x Ò9 muo é ^Û\\Ç F§i#ø[ Wé ü ö>ñwÀ ÄÞ2ñÕ è Î¿ V¶ºD§÷Ð[¡.^Qü,ÌGËÔ ç Å ~ ÑE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE WÌ ðQ¿ _ð¦¿dß ÝÛÏäêúÌk¢X Øbó ² þì^k}@õ¯¦ëñûþ Oñ ûsâ? > YÏ }
ô+oø ¢
Gûeê?´GÅ+ß
ÊpO8eÎzÐ ô
#t¯Ë ø$ïÆ/
ä>0x2/ ¿
Ão $Q©'
ÆçI¹ ¢
4{#+ î¬Ù2?Ý çµ~\`è ðO Ú+Ä moð³X·fm¾eóÃj Ü´ £ óÕ ¤Ú Ü ¶Ñ4÷ ºÅ H2ÎÄà ; M Dß°ïìö f¿ÙÛÃ¾ » S_¸S¨êì¿óõ. .{ìP© û3Þ¾qý à ü
ñ
 ¾%ÝZk -µùôý&Ó/m§¾?Ö³ õ Ø W¨ÉÁ ¡t QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE QE W þÒ?ònß ¿ìUÕ ô Zôjó ÚGþMÛâ ý º¯þ K@ ÿ ðCßù	üUÿ ®6?ú µú½_ ?ðCßù	üUÿ ®6?ú µú½@ Q@ Q@ Q@ Q@ Q@ Q@ Q@ Q@ Q@ Q@
57 0 obj`;

  const isGarbage = isBinaryGarbage(userGarbageSnippet);
  console.log("Test 1: isBinaryGarbage detects user garbage snippet:", isGarbage);
  if (!isGarbage) throw new Error("Test 1 Failed: Garbage snippet was not detected!");

  const cleanedGarbage = cleanResumeText(userGarbageSnippet);
  console.log("Test 1b: cleanResumeText rejects garbage (returns empty):", cleanedGarbage === "");
  if (cleanedGarbage !== "") throw new Error("Test 1b Failed: cleanResumeText did not reject garbage!");

  // Test 2: Legitimate Resume is NOT flagged as garbage
  const legitimateResume = `VISHWAJEET SRK
Bengaluru, India | vishwajeetsrk@gmail.com | +91 9876543210 | linkedin.com/in/vishwajeetsrk

PROFESSIONAL SUMMARY
Senior Full Stack AI Engineer with 4+ years of experience architecting high-throughput cloud platforms, interactive learning tools, and production LLM applications.

TECHNICAL SKILLS
Languages: Python, TypeScript, JavaScript, Go, SQL, C++
Frontend & Backend: React 19, Next.js, Node.js, Express, Tailwind CSS, Supabase, PostgreSQL
Cloud & DevOps: Docker, AWS, Cloudflare, CI/CD, Git

EXPERIENCE
Software Engineer @ Rootbridge (Jan 2024 - Present)
• Built scalable enterprise AI platform serving 250K+ monthly active users.
• Reduced backend API latency by 45% using TanStack Start and query optimizations.

EDUCATION
B.Tech in Computer Science & Engineering (2018 - 2022)`;

  const legitGarbageCheck = isBinaryGarbage(legitimateResume);
  console.log("Test 2: Legitimate resume flagged as garbage?:", legitGarbageCheck);
  if (legitGarbageCheck) throw new Error("Test 2 Failed: Legitimate resume was falsely flagged as garbage!");

  const cleanedLegit = cleanResumeText(legitimateResume);
  console.log("Test 2b: Cleaned legit resume contains name:", cleanedLegit.includes("VISHWAJEET SRK"));
  console.log("Test 2c: Cleaned legit resume contains phone:", cleanedLegit.includes("+91 9876543210"));
  console.log("Test 2d: Cleaned legit resume contains email:", cleanedLegit.includes("vishwajeetsrk@gmail.com"));
  if (!cleanedLegit.includes("VISHWAJEET SRK") || !cleanedLegit.includes("vishwajeetsrk@gmail.com")) {
    throw new Error("Test 2 Failed: Cleaned legit resume lost essential content!");
  }

  // Test 3: PDF Generation & Legacy Extraction Test
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText("VISHWAJEET CV TEST", { x: 50, y: 750, size: 16, font: boldFont, color: rgb(0, 0, 0) });
  page.drawText("Software Engineer | Python, React, TypeScript | vishwajeetsrk@gmail.com", {
    x: 50,
    y: 725,
    size: 10,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });
  page.drawText("• Architected high-availability cloud platforms using TanStack.", {
    x: 50,
    y: 700,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(pdfBytes),
    useSystemFonts: true,
    disableFontFace: true,
  });
  const pdf = await loadingTask.promise;
  let extracted = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const p = await pdf.getPage(i);
    const tc = await p.getTextContent();
    for (const item of tc.items) {
      if (item.str) extracted += item.str + " ";
    }
  }

  console.log("Test 3: Server legacy pdfjs extracted text:", extracted.trim());
  if (!extracted.includes("VISHWAJEET CV TEST")) {
    throw new Error("Test 3 Failed: Server pdfjs failed to extract text!");
  }

  console.log("=== ALL ADVERSARIAL PARSER TESTS PASSED! ===");
}

testSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
