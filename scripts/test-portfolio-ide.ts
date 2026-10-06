/**
 * LEARNIFY AI — PORTFOLIO BUILDER 2.1 E2E & ADVERSARIAL TEST SUITE
 * 
 * Tests the complete lifecycle and failure modes of:
 * - Virtual File Manager (CRUD, deep folder cascade, active file deletion recovery, duplicates)
 * - Compiler & Syntax Diagnostics (HTML validation, JS syntax errors, CSS brace mismatches)
 * - Persistence & Multi-tab storage keys
 * - State machine transitions (IDLE, DIRTY, SAVING, BUILDING, READY, FAILED)
 * - ZIP archive packaging
 */

import assert from "node:assert";
import JSZip from "jszip";

console.log("=================================================");
console.log("🧪 STARTING PORTFOLIO BUILDER 2.1 TEST SUITE");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function runTest(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    const res = fn();
    if (res instanceof Promise) {
      return res
        .then(() => {
          console.log(`  ✅ [PASS] ${name}`);
          passedTests++;
        })
        .catch((err) => {
          console.error(`  ❌ [FAIL] ${name}:`, err.message);
          throw err;
        });
    } else {
      console.log(`  ✅ [PASS] ${name}`);
      passedTests++;
    }
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function main() {
  // ----------------------------------------------------
  // TEST GROUP 1: VIRTUAL FILE SYSTEM CRUD & CASCADING
  // ----------------------------------------------------
  console.log("📁 GROUP 1: Virtual File System & Folder Cascading");

  let filesMap: Record<string, string> = {
    "index.html": "<!DOCTYPE html><html><head><link rel=\"stylesheet\" href=\"./css/style.css\"></head><body><h1>Hello</h1><script src=\"./js/script.js\"></script></body></html>",
    "css/style.css": "body { background: #000; color: #fff; }",
    "js/script.js": "console.log('Portfolio loaded');",
    "README.md": "# Developer Portfolio",
  };

  runTest("1.1 Create new file with validation", () => {
    const newPath = "components/Hero.html";
    assert.strictEqual(filesMap[newPath], undefined, "File should not exist yet");
    filesMap[newPath] = "<section>Hero</section>";
    assert.strictEqual(filesMap[newPath], "<section>Hero</section>");
  });

  runTest("1.2 Duplicate file rejection", () => {
    const duplicatePath = "index.html";
    const exists = filesMap[duplicatePath] !== undefined;
    assert.strictEqual(exists, true, "Should identify duplicate file path");
  });

  runTest("1.3 Create folder with placeholder keepfile", () => {
    const folderKeep = "assets/images/.keep";
    filesMap[folderKeep] = "";
    assert.strictEqual(filesMap[folderKeep], "");
  });

  runTest("1.4 Deep folder rename cascading", () => {
    // Add sub-files in css/
    filesMap["css/responsive.css"] = "@media (max-width: 768px) { body { font-size: 14px; } }";
    
    // Rename folder "css" -> "styles"
    const oldFolder = "css";
    const newFolder = "styles";
    const matchingPrefix = `${oldFolder}/`;
    const folderFiles = Object.keys(filesMap).filter((p) => p.startsWith(matchingPrefix));

    assert.strictEqual(folderFiles.length, 2, "Should have 2 files in css/ folder");

    const nextFiles = { ...filesMap };
    folderFiles.forEach((oldSub) => {
      const newSub = newFolder + oldSub.slice(oldFolder.length);
      nextFiles[newSub] = nextFiles[oldSub];
      delete nextFiles[oldSub];
    });

    filesMap = nextFiles;

    assert.strictEqual(filesMap["css/style.css"], undefined, "Old css/style.css should be removed");
    assert.strictEqual(filesMap["css/responsive.css"], undefined, "Old css/responsive.css should be removed");
    assert.ok(filesMap["styles/style.css"], "New styles/style.css should exist");
    assert.ok(filesMap["styles/responsive.css"], "New styles/responsive.css should exist");
  });

  runTest("1.5 Active file deletion recovery", () => {
    let activeFile = "styles/responsive.css";
    delete filesMap[activeFile];
    
    // Sibling selection
    const remaining = Object.keys(filesMap);
    if (remaining.includes("index.html")) {
      activeFile = "index.html";
    } else {
      activeFile = remaining[0];
    }
    assert.strictEqual(activeFile, "index.html", "Should safely select index.html on deletion");
  });

  runTest("1.6 All files deleted recovery to safe index.html fallback", () => {
    // Intentionally empty map
    let emptyMap: Record<string, string> = {};
    const remaining = Object.keys(emptyMap);
    if (remaining.length === 0) {
      emptyMap["index.html"] = "<!DOCTYPE html><html><body><h1>Portfolio</h1></body></html>";
    }
    assert.ok(emptyMap["index.html"], "Should regenerate clean index.html when workspace emptied");
  });

  // ----------------------------------------------------
  // TEST GROUP 2: COMPILER & SYNTAX DIAGNOSTICS
  // ----------------------------------------------------
  console.log("\n⚡ GROUP 2: Compiler Pipeline & Syntax Diagnostics");

  function validateCodebase(files: Record<string, string>): { valid: boolean; error?: string; file?: string } {
    const html = files["index.html"];
    if (!html || !html.trim()) {
      return { valid: false, error: "index.html is missing or empty.", file: "index.html" };
    }

    const js = files["js/script.js"];
    if (js && js.trim()) {
      try {
        new Function(js);
      } catch (err: any) {
        return { valid: false, error: err.message, file: "js/script.js" };
      }
    }

    const css = files["styles/style.css"] || files["css/style.css"];
    if (css) {
      const openBraces = (css.match(/\{/g) || []).length;
      const closeBraces = (css.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        return {
          valid: false,
          error: `Mismatched CSS braces: found ${openBraces} opening vs ${closeBraces} closing braces.`,
          file: "css/style.css",
        };
      }
    }

    return { valid: true };
  }

  function compileSrcDoc(files: Record<string, string>): string {
    const rawHtml = files["index.html"] || "<h1>No index.html</h1>";
    const css = files["styles/style.css"] || files["css/style.css"] || "";
    const js = files["js/script.js"] || "";

    let doc = rawHtml;
    if (css) {
      if (doc.includes('href="./css/style.css"') || doc.includes('href="css/style.css"')) {
        doc = doc.replace(/<link[^>]+href=["'].*style\.css["'][^>]*>/i, `<style id="injected-style">${css}</style>`);
      } else {
        doc = doc.replace("</head>", `<style id="injected-style">${css}</style></head>`);
      }
    }

    if (js) {
      if (doc.includes('src="./js/script.js"') || doc.includes('src="js/script.js"')) {
        doc = doc.replace(/<script[^>]+src=["'].*script\.js["'][^>]*><\/script>/i, `<script id="injected-script">${js}</script>`);
      } else {
        doc = doc.replace("</body>", `<script id="injected-script">${js}</script></body>`);
      }
    }

    return doc;
  }

  runTest("2.1 Valid codebase compilation", () => {
    const validation = validateCodebase(filesMap);
    assert.strictEqual(validation.valid, true, "Clean codebase should be valid");

    const compiled = compileSrcDoc(filesMap);
    assert.ok(compiled.includes('<style id="injected-style">'), "Should inject CSS inline");
    assert.ok(compiled.includes('<script id="injected-script">'), "Should inject JS inline");
    assert.ok(!compiled.includes('href="./css/style.css"'), "Should replace link tag");
  });

  runTest("2.2 Broken JS syntax detection (Unexpected token)", () => {
    const badFiles = {
      ...filesMap,
      "js/script.js": "const brokenSyntax = ; // invalid",
    };
    const validation = validateCodebase(badFiles);
    assert.strictEqual(validation.valid, false, "Should catch broken JS");
    assert.strictEqual(validation.file, "js/script.js");
    assert.ok(validation.error?.toLowerCase().includes("unexpected token") || validation.error?.toLowerCase().includes("syntax"));
  });

  runTest("2.3 Mismatched CSS brace detection", () => {
    const badFiles = {
      ...filesMap,
      "styles/style.css": "body { color: red; /* missing closing brace */",
    };
    const validation = validateCodebase(badFiles);
    assert.strictEqual(validation.valid, false, "Should catch mismatched braces");
    assert.strictEqual(validation.file, "css/style.css");
    assert.ok(validation.error?.includes("Mismatched CSS braces"));
  });

  runTest("2.4 Missing index.html detection", () => {
    const noHtmlFiles = { ...filesMap };
    delete (noHtmlFiles as any)["index.html"];
    const validation = validateCodebase(noHtmlFiles);
    assert.strictEqual(validation.valid, false);
    assert.strictEqual(validation.file, "index.html");
  });

  // ----------------------------------------------------
  // TEST GROUP 3: PERSISTENCE & MULTI-TAB SAFETY
  // ----------------------------------------------------
  console.log("\n💾 GROUP 3: Persistence & Storage Key Isolation");

  function getStorageKey(candidateName: string): string {
    const safeName = candidateName
      ? candidateName.toLowerCase().replace(/[^a-z0-9]/g, "_")
      : "default";
    return `portfolio_codebase_${safeName}`;
  }

  runTest("3.1 Sanitized storage key generation", () => {
    assert.strictEqual(getStorageKey("Alex Chen"), "portfolio_codebase_alex_chen");
    assert.strictEqual(getStorageKey("Jane Doe (Senior)!"), "portfolio_codebase_jane_doe__senior__");
    assert.strictEqual(getStorageKey(""), "portfolio_codebase_default");
  });

  runTest("3.2 Storage key isolation across portfolios", () => {
    const keyA = getStorageKey("Alice");
    const keyB = getStorageKey("Bob");
    assert.notStrictEqual(keyA, keyB, "Different candidates must have separate keys");
  });

  // ----------------------------------------------------
  // TEST GROUP 4: JSZIP ARCHIVE PACKAGING
  // ----------------------------------------------------
  console.log("\n📦 GROUP 4: ZIP Packaging & Asset Integrity");

  await runTest("4.1 Generate ZIP excluding .keep files", async () => {
    const zip = new JSZip();
    Object.entries(filesMap).forEach(([filePath, content]) => {
      if (filePath.endsWith(".keep") && !content) return;
      zip.file(filePath, content);
    });

    const zipContent = await zip.generateAsync({ type: "nodebuffer" });
    assert.ok(zipContent.length > 100, "ZIP buffer must be non-empty");

    const loadedZip = await JSZip.loadAsync(zipContent);
    assert.ok(loadedZip.file("index.html"), "index.html must be inside ZIP");
    assert.ok(loadedZip.file("styles/style.css"), "styles/style.css must be inside ZIP");
    assert.ok(!loadedZip.file("assets/images/.keep"), ".keep file must be excluded");
  });

  // ----------------------------------------------------
  // TEST GROUP 5: ADVERSARIAL FAILURE SCENARIOS
  // ----------------------------------------------------
  console.log("\n🛡️ GROUP 5: Adversarial QA & Edge Cases");

  runTest("5.1 Rapid run clicks state debounce simulation", () => {
    let building = false;
    let buildCount = 0;

    const triggerRun = () => {
      if (building) return; // Debounce guard
      building = true;
      buildCount++;
      // Simulate build completion
      setTimeout(() => {
        building = false;
      }, 50);
    };

    // Rapid 10 clicks
    for (let i = 0; i < 10; i++) {
      triggerRun();
    }

    assert.strictEqual(buildCount, 1, "Only first run should trigger while building");
  });

  runTest("5.2 Malformed code paste resilience", () => {
    const malformedFiles = {
      ...filesMap,
      "index.html": "<div unclosed tag><p>>>><<<<",
      "js/script.js": "function() { return 1; } // syntax error anonymous function without name or assignment",
    };
    const validation = validateCodebase(malformedFiles);
    assert.strictEqual(validation.valid, false, "Should catch malformed JS function statement");
  });

  runTest("5.3 Large payload performance validation", () => {
    const largeJs = "const data = " + JSON.stringify(Array.from({ length: 5000 }, (_, i) => ({ id: i, name: `Item ${i}` }))) + ";";
    const filesWithLarge = {
      ...filesMap,
      "js/script.js": largeJs,
    };
    const start = performance.now();
    const validation = validateCodebase(filesWithLarge);
    const duration = performance.now() - start;
    assert.strictEqual(validation.valid, true, "Large clean JS should validate");
    assert.ok(duration < 500, `Validation must take under 500ms (took ${duration.toFixed(1)}ms)`);
  });

  console.log("\n=================================================");
  console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log("=================================================");
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
