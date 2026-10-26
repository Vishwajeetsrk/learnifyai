import { ExplainerTopicData } from "./ExplainerVideoPlayer";

export interface GeneratedTopicBundle {
  title: string;
  category: string;
  emoji: string;
  lang: string;
  files: Record<string, string>;
  defaultFile: string;
  openTabs: string[];
  explainerData: ExplainerTopicData;
  practiceChallenges: {
    id: string;
    timeSec: number;
    cuteIcon: string;
    title: string;
    prompt: string;
    hints: string[];
    suggestedDurationSec: number;
    solutionCode: string;
    explanation: string;
    targetFileName: string;
  }[];
}

/**
 * Intelligent topic analyzer and generator for Learnify AI Studio.
 * Detects topic keywords and returns comprehensive files, interactive sandboxes,
 * quadrant diagrams, narration chapters, and practice checkpoints.
 */
export function generateTopicBundle(userQuery: string): GeneratedTopicBundle {
  const query = userQuery.toLowerCase().trim();

  // ─── 1. HTML BASICS & WEB DEVELOPMENT ───────────────────────────────────────
  if (
    query.includes("html") ||
    query.includes("html basic") ||
    query.includes("web development") ||
    query.includes("website") ||
    query.includes("frontend basics")
  ) {
    const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Learnify AI — HTML5 Basics</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="card">
    <header class="card-header">
      <span class="badge">🌐 HTML5 Foundations</span>
      <h1>Structure, Not Just Text!</h1>
      <p class="subtitle">Learn how browsers parse HTML elements into a live DOM tree.</p>
    </header>

    <main class="content-section">
      <!-- Semantic Article Section -->
      <article class="article-box">
        <h2>1. Semantic Heading</h2>
        <p>
          HTML gives <strong>meaning</strong> to content. An <code>&lt;h1&gt;</code> tells search engines
          and screen readers what the page is about.
        </p>
      </article>

      <!-- Interactive Playground Section -->
      <section class="interactive-box">
        <h3>2. Interactive Elements</h3>
        <p>Type your name below to see live DOM two-way binding:</p>
        
        <div class="input-group">
          <input type="text" id="nameInput" placeholder="Type your name here..." />
          <button id="greetBtn" class="btn primary-btn">Say Hello 👋</button>
        </div>

        <div id="greetingOutput" class="output-pill hidden">
          Hello, <strong id="displayName">Student</strong>! Welcome to Learnify AI.
        </div>
      </section>

      <!-- List of HTML Essentials -->
      <section class="list-section">
        <h3>3. Essential Tags Checklist</h3>
        <ul class="tag-list">
          <li><code>&lt;header&gt;</code> — Top branding & navigation</li>
          <li><code>&lt;main&gt;</code> — The central body content</li>
          <li><code>&lt;button&gt;</code> — User click interaction</li>
          <li><code>&lt;footer&gt;</code> — Copyright & metadata</li>
        </ul>
      </section>
    </main>

    <footer class="card-footer">
      <p>Built with ❤️ inside Learnify AI Studio · Editable in real-time</p>
    </footer>
  </div>

  <script src="script.js"></script>
</body>
</html>`;

    const cssCode = `/* Modern CSS Reset & Design Tokens */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  color: #f8fafc;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.card {
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  width: 100%;
  max-width: 580px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.card-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: #38bdf8;
  margin-top: 8px;
}

.badge {
  display: inline-block;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #94a3b8;
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 20px;
}

.article-box, .interactive-box, .list-section {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

h2, h3 {
  font-size: 16px;
  color: #e2e8f0;
  margin-bottom: 6px;
}

p {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.5;
}

code {
  background: rgba(0, 0, 0, 0.4);
  color: #f43f5e;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

input[type="text"] {
  flex: 1;
  background: #0f172a;
  border: 1px solid #334155;
  color: #fff;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

input[type="text"]:focus {
  border-color: #38bdf8;
}

.btn {
  background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.btn:hover {
  opacity: 0.95;
  transform: translateY(-1px);
}

.output-pill {
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  border-radius: 10px;
  font-size: 13px;
  animation: fadeIn 0.3s ease-out;
}

.hidden {
  display: none;
}

.tag-list {
  list-style: none;
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.card-footer {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
  margin-top: 16px;
}

.card-footer p {
  font-size: 11px;
  color: #64748b;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}`;

    const jsCode = `// Learnify AI Interactive DOM Engine
document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("nameInput");
  const greetBtn = document.getElementById("greetBtn");
  const greetingOutput = document.getElementById("greetingOutput");
  const displayName = document.getElementById("displayName");

  function updateGreeting() {
    const val = nameInput.value.trim();
    if (!val) {
      alert("Please enter a name first!");
      nameInput.focus();
      return;
    }
    displayName.textContent = val;
    greetingOutput.classList.remove("hidden");
    console.log("[Learnify AI Runner] Greeting updated for:", val);
  }

  greetBtn.addEventListener("click", updateGreeting);

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      updateGreeting();
    }
  });

  console.log("🚀 HTML5 DOM tree initialized and ready for interactive learning!");
});`;

    return {
      title: "HTML5 Basics: Document Structure & Semantics",
      category: "Web Development",
      emoji: "🌐",
      lang: "html",
      files: {
        "index.html": htmlCode,
        "styles.css": cssCode,
        "script.js": jsCode,
      },
      defaultFile: "index.html",
      openTabs: ["index.html", "styles.css", "script.js"],
      explainerData: {
        id: "html-basics",
        title: "HTML Basics & Semantic Web Structure",
        emoji: "🌐",
        category: "Web Development",
        tagline: "Understand how the browser turns semantic tags into an interactive document object model.",
        author: {
          name: "Vishwajeet",
          handle: "vishwajeet",
          avatar: "V",
          isFollowed: true,
        },
        durationFormatted: "2:05",
        totalDurationSec: 125,
        views: 2940,
        timeAgo: "Just now",
        quadrants: {
          q1: {
            title: "Document Skeleton",
            subtitle: "DOCTYPE, html, head, and body tags create the root tree.",
            desc: "The browser parses the doctype to avoid quirks mode and loads stylesheets inside the head.",
          },
          q2: {
            title: "Semantic Elements",
            subtitle: "Header, main, article, and section convey actual meaning.",
            desc: "Search engines and screen readers rely on semantic structure rather than generic divs.",
          },
          q3: {
            title: "Interactive Controls",
            subtitle: "Inputs, buttons, and links capture student events.",
            desc: "Event listeners in JavaScript bind to these elements to trigger mutations and UI state changes.",
          },
          q4: {
            title: "Live DOM Tree",
            subtitle: "The browser compiles HTML markup into live C++ nodes.",
            desc: "Any keystroke or CSS class change instantly reflows and repaints in the live execution runner.",
          },
        },
        chapters: [
          {
            id: "html-intro",
            title: "The HTML Foundation",
            timestamp: "0:00",
            timeSec: 0,
            durationSec: 20,
            subtitle: "HTML is the skeleton of every modern web application.",
            spokenWords:
              "Welcome to HTML basics. HTML is not just text on a screen — it is a structured tree of semantic elements that gives purpose to the web.",
            zoomTarget: "all",
          },
          {
            id: "skeleton",
            title: "The Root Skeleton",
            timestamp: "0:20",
            timeSec: 20,
            durationSec: 25,
            subtitle: "DOCTYPE, html, head, and body.",
            spokenWords:
              "Every HTML document begins with DOCTYPE html, followed by the head for metadata and the body for visible elements.",
            zoomTarget: "q1",
          },
          {
            id: "semantics",
            title: "Semantic Tags",
            timestamp: "0:45",
            timeSec: 45,
            durationSec: 25,
            subtitle: "Give your content clear meaning.",
            spokenWords:
              "Using tags like header, article, and section makes your webpage accessible to assistive devices and prioritized by search engines.",
            zoomTarget: "q2",
          },
          {
            id: "interactivity",
            title: "Interactive Elements",
            timestamp: "1:10",
            timeSec: 70,
            durationSec: 25,
            subtitle: "Buttons and inputs allow user action.",
            spokenWords:
              "Notice the input box and button. When you type and click, JavaScript catches the event and immediately updates the DOM.",
            zoomTarget: "q3",
          },
          {
            id: "dom-tree",
            title: "The Live DOM",
            timestamp: "1:35",
            timeSec: 95,
            durationSec: 30,
            subtitle: "Real-time updates in your runner.",
            spokenWords:
              "Because this is Learnify AI Studio, you can pause at any time, edit the code, and see the browser hot-reload in real-time.",
            zoomTarget: "q4",
          },
        ],
      },
      practiceChallenges: [
        {
          id: "chal-1",
          timeSec: 35,
          cuteIcon: "⭐",
          title: "Add a New Subheading",
          prompt: "In `index.html`, add an `<h3>` element under the article box with the text: 'Mastering Tags'.",
          hints: ["Open index.html", "Find line 25 inside .article-box", "Type <h3>Mastering Tags</h3>"],
          suggestedDurationSec: 45,
          solutionCode: `      <article class="article-box">
        <h2>1. Semantic Heading</h2>
        <h3>Mastering Tags</h3>
        <p>HTML gives meaning to content.</p>
      </article>`,
          explanation: "Adding an <h3> element creates a tertiary heading under the main article, enhancing the hierarchy.",
          targetFileName: "index.html",
        },
        {
          id: "chal-2",
          timeSec: 85,
          cuteIcon: "🎯",
          title: "Style the Greeting Button",
          prompt: "In `styles.css`, change the button background gradient to emerald green: `linear-gradient(135deg, #059669 0%, #10b981 100%)`.",
          hints: ["Open styles.css", "Find the .btn selector around line 130", "Change the background property"],
          suggestedDurationSec: 60,
          solutionCode: `.btn {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}`,
          explanation: "Updating the background gradient transforms the button into a vibrant green action element.",
          targetFileName: "styles.css",
        },
      ],
    };
  }

  // ─── 2. EARTH'S SPHERES AND SYSTEMS ─────────────────────────────────────────
  if (
    query.includes("earth") ||
    query.includes("sphere") ||
    query.includes("atmosphere") ||
    query.includes("geosphere") ||
    query.includes("hydrosphere") ||
    query.includes("biosphere")
  ) {
    const pythonCode = `# ==============================================================================
# EARTH'S SPHERES AND SYSTEMS: BIOGEOCHEMICAL EQUILIBRIUM MODEL
# Simulating Atmosphere, Hydrosphere, Geosphere, and Biosphere feedbacks
# ==============================================================================

class EarthSystem:
    def __init__(self):
        self.atmosphere_co2_ppm = 421.0
        self.ocean_carbon_sink_gt = 38000.0
        self.biosphere_biomass_gt = 550.0
        self.temperature_anomaly_c = 1.15

    def simulate_year(self, anthropogenic_emissions_gt=37.0):
        # 1. Hydrosphere: Ocean absorbs ~25% of annual carbon emissions
        ocean_uptake = anthropogenic_emissions_gt * 0.25
        self.ocean_carbon_sink_gt += ocean_uptake

        # 2. Biosphere: Photosynthetic absorption ~30%
        biosphere_uptake = anthropogenic_emissions_gt * 0.30
        self.biosphere_biomass_gt += biosphere_uptake * 0.01

        # 3. Atmosphere: Remaining greenhouse gases trap heat
        atmospheric_addition_gt = anthropogenic_emissions_gt - ocean_uptake - biosphere_uptake
        ppm_increase = atmospheric_addition_gt / 7.82 # 1 ppm CO2 ≈ 7.82 Gt CO2
        self.atmosphere_co2_ppm += ppm_increase

        # 4. Geosphere Feedback: Radiative forcing feedback
        self.temperature_anomaly_c += ppm_increase * 0.012

    def report(self, years=10):
        print("=== 🌍 EARTH SYSTEM EQUILIBRIUM SIMULATION ===")
        print(f"Starting Baseline: CO2 = {self.atmosphere_co2_ppm:.1f} ppm | Temp = +{self.temperature_anomaly_c:.2f}°C")
        print("-" * 50)
        for y in range(1, years + 1):
            self.simulate_year()
            if y % 2 == 0 or y == years:
                print(f"Year {y:02d} | CO2: {self.atmosphere_co2_ppm:.2f} ppm | Ocean Sink: {self.ocean_carbon_sink_gt:.1f} Gt | Temp: +{self.temperature_anomaly_c:.3f}°C")
        print("-" * 50)
        print("Biosphere Homeostasis: Carbon cycles dynamically through all 4 planetary spheres.")

earth = EarthSystem()
earth.report(years=10)
`;

    const webSimHtml = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #0b1120; color: #e2e8f0; font-family: sans-serif; padding: 20px; text-align: center; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; max-width: 500px; margin: 20px auto; }
    .sphere { padding: 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); }
    .atmo { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .hydro { background: rgba(14, 165, 233, 0.15); color: #0ea5e9; }
    .geo { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .bio { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    h4 { margin: 0 0 6px 0; font-size: 15px; }
    p { margin: 0; font-size: 11px; opacity: 0.9; }
  </style>
</head>
<body>
  <h2>🌍 Earth's 4 Interconnected Spheres</h2>
  <div class="grid">
    <div class="sphere atmo"><h4>☁️ Atmosphere</h4><p>Gaseous Envelope (78% N2, 21% O2)</p></div>
    <div class="sphere hydro"><h4>🌊 Hydrosphere</h4><p>71% Oceanic & Fresh Water Cycle</p></div>
    <div class="sphere geo"><h4>🌋 Geosphere</h4><p>Crust, Mantle & Core Dynamics</p></div>
    <div class="sphere bio"><h4>🌿 Biosphere</h4><p>All Living Plants, Animals & Microbes</p></div>
  </div>
</body>
</html>`;

    return {
      title: "Earth's Spheres and Systems: Biogeochemical Balance",
      category: "Earth & Planetary Science",
      emoji: "🌍",
      lang: "python",
      files: {
        "earth_systems.py": pythonCode,
        "visualization.html": webSimHtml,
      },
      defaultFile: "earth_systems.py",
      openTabs: ["earth_systems.py", "visualization.html"],
      explainerData: {
        id: "earth",
        title: "Earth's Spheres and Systems",
        emoji: "🌍",
        category: "Earth & Planetary Science",
        tagline: "The interconnected dynamics of the Atmosphere, Hydrosphere, Geosphere, and Biosphere.",
        author: {
          name: "Nova Planetary Labs",
          handle: "novascience",
          avatar: "N",
          isFollowed: true,
        },
        durationFormatted: "1:52",
        totalDurationSec: 112,
        views: 3209,
        timeAgo: "4 hours ago",
        quadrants: {
          q1: {
            title: "The Atmosphere",
            subtitle: "The gaseous envelope protecting planetary life.",
            desc: "78% Nitrogen, 21% Oxygen, and trace greenhouse gases maintaining thermal equilibrium.",
          },
          q2: {
            title: "The Hydrosphere",
            subtitle: "All liquid, frozen, and gaseous water covering 71% of Earth.",
            desc: "Drives oceanic thermal conveyor belts and the global hydrological cycle.",
          },
          q3: {
            title: "The Geosphere",
            subtitle: "Crust, mantle, and metallic core driving plate tectonics.",
            desc: "Generates the geomagnetic shield protecting Earth from ionizing solar wind.",
          },
          q4: {
            title: "The Biosphere",
            subtitle: "The living zone linking all terrestrial and marine ecosystems.",
            desc: "Photosynthetic organisms modulating planetary carbon and oxygen cycles.",
          },
        },
        chapters: [
          {
            id: "earth-intro",
            title: "The Big Picture",
            timestamp: "0:00",
            timeSec: 0,
            durationSec: 20,
            subtitle: "Earth functions as an interconnected biogeochemical super-system.",
            spokenWords:
              "From space, Earth appears as an integrated spaceship where four primary spheres continually exchange matter and energy.",
            zoomTarget: "all",
          },
          {
            id: "atmosphere",
            title: "Atmosphere Dynamics",
            timestamp: "0:20",
            timeSec: 20,
            durationSec: 25,
            subtitle: "The protective thermal shield of air and weather.",
            spokenWords:
              "The atmosphere absorbs harsh ultraviolet solar radiation and retains planetary warmth via the greenhouse effect.",
            zoomTarget: "q1",
          },
          {
            id: "hydrosphere",
            title: "Hydrosphere & Water Cycle",
            timestamp: "0:45",
            timeSec: 45,
            durationSec: 25,
            subtitle: "Thermal regulation across oceans, ice caps, and atmospheric vapor.",
            spokenWords:
              "Oceans store immense heat, circulating warm equatorial currents toward the poles to moderate global climates.",
            zoomTarget: "q2",
          },
          {
            id: "geosphere",
            title: "Geosphere & Tectonics",
            timestamp: "1:10",
            timeSec: 70,
            durationSec: 22,
            subtitle: "Continental drift and magma convection replenishing mineral nutrients.",
            spokenWords:
              "The solid geosphere recycles rocks and minerals through subduction zones and volcanic outgassing.",
            zoomTarget: "q3",
          },
          {
            id: "biosphere",
            title: "Biosphere Harmony",
            timestamp: "1:32",
            timeSec: 92,
            durationSec: 20,
            subtitle: "Life sustaining ecological homeostasis across millions of species.",
            spokenWords:
              "The biosphere synthesizes sunlight into chemical energy, binding all four spheres into a living balance.",
            zoomTarget: "q4",
          },
        ],
      },
      practiceChallenges: [
        {
          id: "chal-earth-1",
          timeSec: 30,
          cuteIcon: "🌍",
          title: "Adjust Anthropogenic Emissions",
          prompt: "In `earth_systems.py`, change `anthropogenic_emissions_gt` from 37.0 to 18.5 (50% reduction) and run the script.",
          hints: ["Find simulate_year method signature", "Change default param to 18.5", "Click 'Run Script' button"],
          suggestedDurationSec: 45,
          solutionCode: `    def simulate_year(self, anthropogenic_emissions_gt=18.5):`,
          explanation: "Cutting emissions in half immediately slows atmospheric CO2 accumulation by 50% in the simulation.",
          targetFileName: "earth_systems.py",
        },
      ],
    };
  }

  // ─── 3. REACT 19 USEEFFECT & STATE ──────────────────────────────────────────
  if (
    query.includes("react") ||
    query.includes("useeffect") ||
    query.includes("usestate") ||
    query.includes("hooks")
  ) {
    const reactAppJsx = `import React, { useState, useEffect } from "react";

export default function CounterStudio() {
  const [count, setCount] = useState(0);
  const [autoIncrement, setAutoIncrement] = useState(false);
  const [history, setHistory] = useState([0]);

  // useEffect demonstrates lifecycle and interval synchronization
  useEffect(() => {
    if (!autoIncrement) return;
    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + 1;
        setHistory((h) => [...h.slice(-4), next]);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [autoIncrement]);

  return (
    <div className="card">
      <span className="badge">⚛️ React 19 State Engine</span>
      <h2>State & Effect Synchronization</h2>
      <div className="display">{count}</div>

      <div className="btn-row">
        <button onClick={() => setCount(c => c - 1)} className="btn sec">-1</button>
        <button onClick={() => setCount(c => c + 1)} className="btn prim">+1</button>
        <button 
          onClick={() => setAutoIncrement(!autoIncrement)} 
          className={\`btn \${autoIncrement ? "active" : ""}\`}
        >
          {autoIncrement ? "⏸️ Pause Auto" : "▶️ Auto Increment"}
        </button>
      </div>

      <div className="history">
        Recent Values: {history.join(" → ")}
      </div>
    </div>
  );
}`;

    return {
      title: "React 19 useEffect & State Architecture",
      category: "Frontend Engineering",
      emoji: "⚛️",
      lang: "jsx",
      files: {
        "App.jsx": reactAppJsx,
        "styles.css": `body { background: #090d16; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.card { background: #131b2e; padding: 24px; border-radius: 16px; border: 1px solid #1e293b; text-align: center; width: 340px; }
.badge { font-size: 11px; color: #38bdf8; text-transform: uppercase; font-weight: bold; }
.display { font-size: 48px; font-weight: 800; color: #38bdf8; margin: 16px 0; font-family: monospace; }
.btn-row { display: flex; gap: 8px; justify-content: center; }
.btn { padding: 8px 14px; border-radius: 8px; border: 1px solid #334155; background: #1e293b; color: #fff; font-weight: 600; cursor: pointer; }
.btn.prim { background: #0284c7; border: none; }
.btn.active { background: #10b981; border: none; }
.history { margin-top: 16px; font-size: 11px; color: #94a3b8; font-family: monospace; }`,
      },
      defaultFile: "App.jsx",
      openTabs: ["App.jsx", "styles.css"],
      explainerData: {
        id: "react-state",
        title: "React 19 useEffect & State Architecture",
        emoji: "⚛️",
        category: "Frontend Engineering",
        tagline: "Learn how React hooks synchronize reactive component state with external lifecycles.",
        author: {
          name: "Dan Abramov Style",
          handle: "reactexpert",
          avatar: "R",
          isFollowed: true,
        },
        durationFormatted: "2:10",
        totalDurationSec: 130,
        views: 4120,
        timeAgo: "2 hours ago",
        quadrants: {
          q1: {
            title: "useState Dispatch",
            subtitle: "State mutations queue fiber re-renders.",
            desc: "Calling setCount triggers reconciliation and computes virtual DOM differences.",
          },
          q2: {
            title: "useEffect Lifecycle",
            subtitle: "Side effects run after browser paint.",
            desc: "Timers, network requests, and DOM mutations safely synchronize via dependency arrays.",
          },
          q3: {
            title: "Cleanup Functions",
            subtitle: "Prevents memory leaks on component unmount.",
            desc: "Returning clearInterval cleans up active browser resources when dependencies change.",
          },
          q4: {
            title: "Virtual DOM Diff",
            subtitle: "Batched updates ensure 60fps UI performance.",
            desc: "React 19 compiler automatically optimizes memoization across nested trees.",
          },
        },
        chapters: [
          {
            id: "r-1",
            title: "Component State",
            timestamp: "0:00",
            timeSec: 0,
            durationSec: 25,
            subtitle: "Every dynamic UI starts with reactive state.",
            spokenWords: "In React, component state represents memory across renders. When state changes, React efficiently updates the screen.",
            zoomTarget: "all",
          },
          {
            id: "r-2",
            title: "State Mutators",
            timestamp: "0:25",
            timeSec: 25,
            durationSec: 30,
            subtitle: "Always update state immutably.",
            spokenWords: "Never mutate state directly. Always use the setter function so the fiber tree detects mutations.",
            zoomTarget: "q1",
          },
          {
            id: "r-3",
            title: "Effects & Intervals",
            timestamp: "0:55",
            timeSec: 55,
            durationSec: 35,
            subtitle: "Synchronizing with the outside world.",
            spokenWords: "useEffect lets you bind intervals and API fetches with automatic cleanup return functions.",
            zoomTarget: "q2",
          },
          {
            id: "r-4",
            title: "Cleanup Phase",
            timestamp: "1:30",
            timeSec: 90,
            durationSec: 40,
            subtitle: "Zero memory leaks.",
            spokenWords: "Notice the return clearInterval statement. This guarantees no lingering memory leaks when the component unmounts.",
            zoomTarget: "q3",
          },
        ],
      },
      practiceChallenges: [
        {
          id: "chal-r-1",
          timeSec: 40,
          cuteIcon: "⚛️",
          title: "Add a +5 Step Button",
          prompt: "In `App.jsx`, add a new button that increments count by 5: `onClick={() => setCount(c => c + 5)}`.",
          hints: ["Find the .btn-row in App.jsx", "Add <button onClick={() => setCount(c => c + 5)} className='btn prim'>+5</button>"],
          suggestedDurationSec: 45,
          solutionCode: `<button onClick={() => setCount(c => c + 5)} className="btn prim">+5</button>`,
          explanation: "Adding a +5 step button demonstrates flexible state updater function composition.",
          targetFileName: "App.jsx",
        },
      ],
    };
  }

  // ─── 4. DEFAULT: DYNAMIC FALLBACK FOR ANY TOPIC ─────────────────────────────
  const cleanTitle = userQuery.trim()
    ? userQuery.trim().charAt(0).toUpperCase() + userQuery.trim().slice(1)
    : "Interactive Exploration";

  const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Learnify AI — ${cleanTitle}</title>
  <style>
    body {
      background: #0b0f19;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .container {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      padding: 32px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
    }
    .badge {
      display: inline-block;
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    h1 {
      font-size: 24px;
      color: #f8fafc;
      margin: 12px 0 6px 0;
    }
    p {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.6;
    }
    .interactive-card {
      background: #1f2937;
      border-radius: 10px;
      padding: 16px;
      margin-top: 16px;
    }
    button {
      background: #4f46e5;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover { background: #4338ca; }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge">Learnify AI Studio</span>
    <h1>${cleanTitle}</h1>
    <p>You are inside an interactive workspace generated specifically for <strong>${cleanTitle}</strong>.</p>
    
    <div class="interactive-card">
      <p>💡 Click into the editor on the left to customize code and inspect live output here in real-time.</p>
      <button onclick="alert('Exploration verified for ${cleanTitle}!')">Run Checkpoint</button>
    </div>
  </div>
</body>
</html>`;

  return {
    title: cleanTitle,
    category: "General Learning",
    emoji: "💡",
    lang: "html",
    files: {
      "index.html": defaultHtml,
    },
    defaultFile: "index.html",
    openTabs: ["index.html"],
    explainerData: {
      id: "custom-explainer",
      title: cleanTitle,
      emoji: "💡",
      category: "Interactive Studio",
      tagline: `An interactive, visual breakdown of ${cleanTitle}.`,
      author: {
        name: "Learnify AI",
        handle: "learnifyai",
        avatar: "L",
        isFollowed: true,
      },
      durationFormatted: "2:00",
      totalDurationSec: 120,
      views: 1250,
      timeAgo: "Just now",
      quadrants: {
        q1: {
          title: "Core Foundations",
          subtitle: "Essential concepts behind " + cleanTitle,
          desc: "Key definitions, axioms, and architectural principles.",
        },
        q2: {
          title: "Inner Mechanics",
          subtitle: "How the underlying engine operates.",
          desc: "Step-by-step logic, transformations, and rules of engagement.",
        },
        q3: {
          title: "Real-World Practice",
          subtitle: "Hands-on implementation and exercises.",
          desc: "Live code-along challenges in the interactive editor.",
        },
        q4: {
          title: "Mastery & Next Steps",
          subtitle: "Synthesizing deep understanding.",
          desc: "Testing edge cases and deploying to production.",
        },
      },
      chapters: [
        {
          id: "c-1",
          title: "Introduction",
          timestamp: "0:00",
          timeSec: 0,
          durationSec: 30,
          subtitle: `Starting with ${cleanTitle}.`,
          spokenWords: `Welcome to this Learnify AI explainer on ${cleanTitle}. Let's break this down into clear, memorable steps.`,
          zoomTarget: "all",
        },
        {
          id: "c-2",
          title: "Foundations",
          timestamp: "0:30",
          timeSec: 30,
          durationSec: 30,
          subtitle: "Understanding the essentials.",
          spokenWords: `First, let's explore the fundamental principles of ${cleanTitle}.`,
          zoomTarget: "q1",
        },
        {
          id: "c-3",
          title: "Deep Dive",
          timestamp: "1:00",
          timeSec: 60,
          durationSec: 30,
          subtitle: "Examining how it works in detail.",
          spokenWords: `Now let's examine the mechanics in depth and see how it behaves under test.`,
          zoomTarget: "q2",
        },
        {
          id: "c-4",
          title: "Interactive Code",
          timestamp: "1:30",
          timeSec: 90,
          durationSec: 30,
          subtitle: "Code along in the live studio.",
          spokenWords: `You are in a live IDE. Click into any line of code to experiment and build mastery.`,
          zoomTarget: "q3",
        },
      ],
    },
    practiceChallenges: [
      {
        id: "chal-gen-1",
        timeSec: 35,
        cuteIcon: "⭐",
        title: "Test Your First Edit",
        prompt: `In the editor, modify the title text for "${cleanTitle}" and click Run Checkpoint.`,
        hints: ["Look for the <h1> tag in the code", "Change the text inside", "Observe live updates"],
        suggestedDurationSec: 45,
        solutionCode: `<h1>${cleanTitle} — Mastered!</h1>`,
        explanation: "Modifying the code reinforces direct tactile feedback in the live runner.",
        targetFileName: "index.html",
      },
    ],
  };
}
