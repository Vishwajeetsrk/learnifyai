import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useServerFn } from "@tanstack/react-start";
import { executeCode } from "@/lib/playground.functions";
import { toast } from "sonner";
import {
  Code2,
  Play,
  Pause,
  RotateCcw,
  Undo2,
  FileCode,
  FileText,
  FileJson,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Globe,
  Terminal,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  Laptop,
  Smartphone,
  Volume2,
  VolumeX,
  Subtitles,
  HelpCircle,
  Sparkles,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Layers,
  Flame,
  Check,
  X,
  Radio,
  FilePlus,
  FolderPlus,
  ArrowRight,
  Palette,
  Video,
  Globe2,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Embedded High-Fidelity SVG Food Assets ──────────────────────────────────
export const FOOD_ASSETS: Record<string, { label: string; svg: string }> = {
  "images/strawberry.png": {
    label: "strawberry",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="berry-grad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#FF4B68"/>
          <stop offset="50%" stop-color="#E11D48"/>
          <stop offset="100%" stop-color="#9F1239"/>
        </radialGradient>
      </defs>
      <!-- Leaf Crown -->
      <path d="M50 25 C45 10 30 15 25 22 C32 26 42 28 50 25 Z" fill="#22C55E"/>
      <path d="M50 25 C55 10 70 15 75 22 C68 26 58 28 50 25 Z" fill="#16A34A"/>
      <path d="M50 25 C45 8 55 5 50 2 C45 12 48 18 50 25 Z" fill="#15803D"/>
      <!-- Berry Body -->
      <path d="M22 36 C18 60 40 88 50 92 C60 88 82 60 78 36 C76 25 24 25 22 36 Z" fill="url(#berry-grad)"/>
      <!-- Seeds -->
      <circle cx="35" cy="40" r="1.8" fill="#FDE047"/>
      <circle cx="48" cy="38" r="1.8" fill="#FDE047"/>
      <circle cx="62" cy="42" r="1.8" fill="#FDE047"/>
      <circle cx="28" cy="52" r="1.8" fill="#FDE047"/>
      <circle cx="42" cy="50" r="1.8" fill="#FDE047"/>
      <circle cx="56" cy="52" r="1.8" fill="#FDE047"/>
      <circle cx="70" cy="54" r="1.8" fill="#FDE047"/>
      <circle cx="36" cy="65" r="1.8" fill="#FDE047"/>
      <circle cx="50" cy="64" r="1.8" fill="#FDE047"/>
      <circle cx="64" cy="66" r="1.8" fill="#FDE047"/>
      <circle cx="45" cy="78" r="1.8" fill="#FDE047"/>
      <circle cx="55" cy="78" r="1.8" fill="#FDE047"/>
    </svg>`,
  },
  "images/hamburger.png": {
    label: "hamburger",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bun-top" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="#FCD34D"/>
          <stop offset="100%" stop-color="#D97706"/>
        </radialGradient>
        <radialGradient id="bun-bottom" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stop-color="#FCD34D"/>
          <stop offset="100%" stop-color="#B45309"/>
        </radialGradient>
      </defs>
      <!-- Top Bun -->
      <path d="M15 48 C15 22 85 22 85 48 Z" fill="url(#bun-top)"/>
      <!-- Sesame seeds -->
      <ellipse cx="32" cy="34" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(-15 32 34)"/>
      <ellipse cx="50" cy="30" rx="2" ry="1.2" fill="#FEF3C7"/>
      <ellipse cx="68" cy="34" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(15 68 34)"/>
      <ellipse cx="40" cy="40" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(10 40 40)"/>
      <ellipse cx="60" cy="40" rx="2" ry="1.2" fill="#FEF3C7" transform="rotate(-10 60 40)"/>
      <!-- Lettuce -->
      <path d="M12 50 C20 46 25 54 35 48 C45 54 55 46 65 52 C75 46 80 54 88 50 C86 56 14 56 12 50 Z" fill="#22C55E"/>
      <!-- Tomato Slices -->
      <rect x="20" y="53" width="60" height="6" rx="3" fill="#EF4444"/>
      <!-- Patty -->
      <rect x="14" y="59" width="72" height="12" rx="6" fill="#78350F"/>
      <!-- Cheese Wedge -->
      <polygon points="20,62 80,62 50,70" fill="#FACC15"/>
      <!-- Bottom Bun -->
      <rect x="18" y="71" width="64" height="12" rx="6" fill="url(#bun-bottom)"/>
    </svg>`,
  },
  "images/glass_of_milk.png": {
    label: "glass of milk",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="milk-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#F1F5F9"/>
          <stop offset="40%" stop-color="#FFFFFF"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </linearGradient>
        <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.7)"/>
          <stop offset="30%" stop-color="rgba(148,163,184,0.15)"/>
          <stop offset="70%" stop-color="rgba(148,163,184,0.2)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0.8)"/>
        </linearGradient>
      </defs>
      <!-- Glass Outline & Milk -->
      <path d="M25 18 L32 82 C33 86 67 86 68 82 L75 18 Z" fill="url(#glass-grad)" stroke="#94A3B8" stroke-width="2"/>
      <!-- Milk Level -->
      <path d="M27 30 L32 80 C34 84 66 84 68 80 L73 30 Z" fill="url(#milk-grad)"/>
      <ellipse cx="50" cy="30" rx="23" ry="5" fill="#FFFFFF"/>
      <!-- Top Rim of Glass -->
      <ellipse cx="50" cy="18" rx="25" ry="5.5" fill="none" stroke="#CBD5E1" stroke-width="2.5"/>
      <!-- Glass Highlight Reflections -->
      <path d="M30 25 L34 76" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="50" cy="81" rx="17" ry="3" fill="#CBD5E1" opacity="0.4"/>
    </svg>`,
  },
  "images/egg.png": {
    label: "egg",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="egg-grad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="40%" stop-color="#FDF4DC"/>
          <stop offset="100%" stop-color="#E2D4B7"/>
        </radialGradient>
      </defs>
      <!-- Ground Shadow -->
      <ellipse cx="50" cy="85" rx="25" ry="6" fill="#CBD5E1" opacity="0.5"/>
      <!-- Egg Geometry -->
      <path d="M50 14 C30 14 22 48 22 64 C22 80 34 88 50 88 C66 88 78 80 78 64 C78 48 70 14 50 14 Z" fill="url(#egg-grad)" stroke="#D8C8A8" stroke-width="1.5"/>
      <!-- Shiny Spot -->
      <ellipse cx="40" cy="35" rx="7" ry="12" fill="white" opacity="0.6" transform="rotate(-15 40 35)"/>
    </svg>`,
  },
  "images/sushi.png": {
    label: "sushi",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="salmon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FB7185"/>
          <stop offset="50%" stop-color="#F43F5E"/>
          <stop offset="100%" stop-color="#E11D48"/>
        </linearGradient>
      </defs>
      <!-- Rice Bed -->
      <rect x="18" y="52" width="64" height="24" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
      <!-- Rice grain details -->
      <ellipse cx="28" cy="62" rx="2" ry="1.2" fill="#E2E8F0"/>
      <ellipse cx="42" cy="66" rx="2" ry="1.2" fill="#E2E8F0"/>
      <ellipse cx="60" cy="63" rx="2" ry="1.2" fill="#E2E8F0"/>
      <!-- Salmon Slice -->
      <path d="M14 44 C25 36 75 36 86 44 C88 52 82 56 78 56 C68 56 32 56 22 56 C18 56 12 52 14 44 Z" fill="url(#salmon)"/>
      <!-- White Salmon Stripes -->
      <path d="M28 42 L34 54" stroke="#FFE4E6" stroke-width="2" opacity="0.7"/>
      <path d="M44 39 L50 54" stroke="#FFE4E6" stroke-width="2" opacity="0.7"/>
      <path d="M60 40 L66 54" stroke="#FFE4E6" stroke-width="2" opacity="0.7"/>
      <!-- Nori Seaweed Belt -->
      <rect x="44" y="38" width="12" height="38" rx="2" fill="#0F172A"/>
    </svg>`,
  },
  "images/poultry_leg.png": {
    label: "poultry leg",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="chicken-grad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#F59E0B"/>
          <stop offset="60%" stop-color="#D97706"/>
          <stop offset="100%" stop-color="#92400E"/>
        </radialGradient>
      </defs>
      <!-- Bone End -->
      <ellipse cx="78" cy="68" rx="5" ry="5" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
      <ellipse cx="78" cy="77" rx="5" ry="5" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
      <rect x="62" y="66" width="16" height="8" rx="2" fill="#F8FAFC" transform="rotate(30 62 66)"/>
      <!-- Crispy Meat Bulb -->
      <path d="M22 42 C16 28 32 16 50 24 C64 30 68 50 58 64 C48 76 28 72 20 58 C16 52 18 46 22 42 Z" fill="url(#chicken-grad)"/>
      <!-- Crispy Highlights -->
      <circle cx="34" cy="34" r="3" fill="#FDE68A" opacity="0.6"/>
      <circle cx="44" cy="46" r="2.5" fill="#FDE68A" opacity="0.6"/>
    </svg>`,
  },
  "images/hot_pepper.png": {
    label: "hot pepper",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pepper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#EF4444"/>
          <stop offset="60%" stop-color="#DC2626"/>
          <stop offset="100%" stop-color="#991B1B"/>
        </linearGradient>
      </defs>
      <!-- Green Stem -->
      <path d="M72 20 C76 15 82 16 85 18 C83 24 78 26 73 25 Z" fill="#15803D"/>
      <ellipse cx="71" cy="25" rx="5" ry="3" fill="#22C55E"/>
      <!-- Curved Chili Body -->
      <path d="M71 25 C68 40 50 62 38 72 C28 80 18 78 18 72 C18 64 36 50 48 40 C60 30 68 24 71 25 Z" fill="url(#pepper)"/>
      <!-- Glossy Reflection -->
      <path d="M64 30 C58 38 46 52 35 62" stroke="#FCA5A5" stroke-width="2" stroke-linecap="round" fill="none"/>
    </svg>`,
  },
  "images/bowl_with_spoon.png": {
    label: "bowl with spoon",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bowl-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38BDF8"/>
          <stop offset="50%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#0369A1"/>
        </linearGradient>
      </defs>
      <!-- Spoon sticking out -->
      <path d="M68 22 L52 48" stroke="#94A3B8" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="70" cy="20" rx="6" ry="4" fill="#CBD5E1" transform="rotate(30 70 20)"/>
      <!-- Batter inside bowl -->
      <ellipse cx="50" cy="46" rx="30" ry="8" fill="#FEF08A"/>
      <!-- Bowl Exterior -->
      <path d="M20 46 C20 74 34 82 50 82 C66 82 80 74 80 46 Z" fill="url(#bowl-grad)"/>
      <!-- Bowl Rim -->
      <ellipse cx="50" cy="46" rx="31" ry="9" fill="none" stroke="#7DD3FC" stroke-width="3"/>
      <!-- Foot of bowl -->
      <ellipse cx="50" cy="82" rx="16" ry="3" fill="#0284C7"/>
    </svg>`,
  },
};

// Convert SVG to data URI for use in <img> tags
const svgToDataUri = (svgString: string) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

// ─── Default Web Files (Cake Recipe App - Frames 001, 007, 008) ──────────────
const DEFAULT_CAKE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Let's Make a Cake!</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Let's Make a Cake!</h1>
  <p class="tagline">It's going to be a <em>piece of cake!</em></p>

  <h2>Ingredients</h2>
  <!--
    1. Look at the grid of ingredients below.
    2. Try adding or removing an ingredient.
    3. See that it works by hovering over the egg.
    4. Resume the lesson by clicking the Play button.
  -->
  <ul class="grid">
    <li>
      <img src="images/strawberry.png" alt="strawberry">
    </li>
    <li>
      <img src="images/hamburger.png" alt="hamburger">
    </li>
    <li>
      <img src="images/glass_of_milk.png" alt="glass of milk">
    </li>
    <li class="scared">
      <img src="images/egg.png" alt="egg">
    </li>
    <li>
      <img src="images/sushi.png" alt="sushi">
    </li>
    <li>
      <img src="images/poultry_leg.png" alt="poultry leg">
    </li>
    <li>
      <img src="images/hot_pepper.png" alt="hot pepper">
    </li>
    <li>
      <img src="images/bowl_with_spoon.png" alt="bowl with spoon">
    </li>
  </ul>

  <h2>Directions</h2>
  <ol class="directions">
    <li>Preheat oven to 350 degrees F (175 degrees C).</li>
    <li>In a medium bowl, combine all ingredients.</li>
    <li>Pour batter into baking pan.</li>
    <li>Bake for 30 to 40 minutes in the preheated oven.</li>
    <li>Enjoy!</li>
  </ol>

  <script src="index.js"></script>
</body>
</html>`;

const DEFAULT_CAKE_CSS = `@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Open+Sans:wght@400;600&display=swap');

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 24px;
  background-color: #FFFFFF;
  font-family: 'Open Sans', -apple-system, sans-serif;
  color: #1E293B;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

h1 {
  font-family: 'Fredoka One', cursive, sans-serif;
  color: #38BDF8;
  font-size: 30px;
  margin: 8px 0 2px 0;
  text-align: center;
  letter-spacing: 0.5px;
}

p.tagline {
  font-size: 13px;
  color: #64748B;
  margin-bottom: 20px;
  text-align: center;
}

p.tagline em {
  color: #38BDF8;
  font-style: italic;
  font-weight: 600;
}

h2 {
  font-family: 'Fredoka One', cursive, sans-serif;
  font-size: 18px;
  margin: 16px 0 10px 0;
  color: #0F172A;
  align-self: flex-start;
  width: 100%;
  max-width: 320px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  width: 100%;
  max-width: 320px;
}

.grid li {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  aspect-ratio: 1;
}

.grid li:hover {
  transform: translateY(-4px) scale(1.06);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.grid li.scared:hover {
  animation: shake 0.5s infinite;
  border-color: #FBBF24;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.grid img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

ol.directions {
  font-size: 11.5px;
  line-height: 1.6;
  color: #475569;
  padding-left: 20px;
  margin: 0;
  align-self: flex-start;
  width: 100%;
  max-width: 320px;
}

ol.directions li {
  margin-bottom: 4px;
}`;

const DEFAULT_CAKE_JS = `console.log("Cake making interactive workspace initialized!");

const ingredients = document.querySelectorAll('.grid li');
ingredients.forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const name = img ? img.alt : 'ingredient';
    console.log(\`[User Interaction] Selected ingredient: \${name}\`);
  });
});`;

const DEFAULT_PACKAGE_JSON = `{
  "name": "s0koa72bc2",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {}
}`;

// ─── Lesson Narration Milestones ─────────────────────────────────────────────
interface NarrationClip {
  time: number;
  text: string;
  caption: string;
  autoPause?: boolean;
}

const LESSON_NARRATIONS: NarrationClip[] = [
  {
    time: 0,
    text: "My name is Tom Chant, and you'll be hearing challenges in order to learn the ropes.",
    caption: "My name is Tom Chant, and you'll be hearing challenges in order to learn the ropes.",
  },
  {
    time: 5,
    text: "Hey there! In this Learnify AI video lesson, you're not just watching — you're inside a real live IDE.",
    caption: "Hey there.",
  },
  {
    time: 14,
    text: "On the left are your files. In the center is your Monaco code editor. And on the right is your live web app running at port 8080.",
    caption: "On the left are your files. In the center, your editor. On the right, your live runner.",
  },
  {
    time: 24,
    text: "Look at the ingredients list in HTML and hover over the egg to see the CSS shake animation.",
    caption: "Look at the ingredients list in HTML and hover over the egg.",
  },
  {
    time: 31,
    text: "Here is your practice checkpoint! You know how to do it. Click any code or open an image in the sidebar to pause and experiment.",
    caption: "you know how to do it.",
    autoPause: true,
  },
  {
    time: 60,
    text: "Whenever you edit code, your live preview updates instantly. When done, click Back to Teacher to resume.",
    caption: "Whenever you edit code, test it directly in the live preview.",
  },
  {
    time: 120,
    text: "Next, try inspecting the CSS file styles.css to customize the grid layout or colors.",
    caption: "Try inspecting styles.css to customize grid layout or colors.",
  },
];

// ─── Dynamic Topic Workspace Generator ─────────────────────────────────────
export function getDefaultFilesForTopic(
  topic = "",
  lang = "html",
  injectedCode?: string
): {
  files: Record<string, string>;
  defaultFile: string;
  openTabs: string[];
  isWebRunner: boolean;
} {
  const t = topic.toLowerCase();
  const l = (lang || "").toLowerCase();

  // 1. Python / Algorithms / Data Structures
  if (
    l === "python" ||
    l === "py" ||
    t.includes("python") ||
    t.includes("binary search") ||
    t.includes("algorithm") ||
    t.includes("dsa") ||
    t.includes("tree") ||
    t.includes("graph") ||
    t.includes("sort")
  ) {
    const pythonCode =
      injectedCode ||
      `# ==============================================================================
# Interactive Python & Algorithms Workstation
# Topic: ${topic || "Binary Search Algorithm"}
# ==============================================================================

def binary_search(arr, target):
    """
    Search for target in sorted array arr.
    Returns the index if found, or -1 if not found.
    Time Complexity: O(log N) | Space Complexity: O(1)
    """
    low = 0
    high = len(arr) - 1
    steps = 0

    print(f"[*] Starting search for target: {target}")
    print(f"[*] Sorted dataset: {arr}\\n")

    while low <= high:
        steps += 1
        mid = (low + high) // 2
        guess = arr[mid]
        print(f"Step {steps}: low={low} (val={arr[low]}), mid={mid} (val={guess}), high={high} (val={arr[high]})")

        if guess == target:
            print(f"[✓] SUCCESS: Target {target} found at index {mid} in {steps} steps!")
            return mid
        elif guess < target:
            low = mid + 1
            print(f"    -> guess {guess} < {target}, shifting low pointer to {low}")
        else:
            high = mid - 1
            print(f"    -> guess {guess} > {target}, shifting high pointer to {high}")

    print(f"[✗] NOT FOUND: Target {target} does not exist in dataset.")
    return -1

# Interactive demonstration
if __name__ == "__main__":
    dataset = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    result = binary_search(dataset, 23)
    print(f"\\nFinal Result: Index {result}")
`;

    const solutionCode = `"""
Solution Reference: Leftmost Boundary Search
Optimized for duplicate keys with exact boundary convergence.
"""

def search_leftmost(nums, target):
    l, r = 0, len(nums)
    while l < r:
        mid = (l + r) // 2
        if nums[mid] < target:
            l = mid + 1
        else:
            r = mid
    return l if (l < len(nums) and nums[l] == target) else -1
`;

    const testsCode = `import unittest
from main import binary_search

class TestBinarySearch(unittest.TestCase):
    def test_found_middle(self):
        arr = [1, 3, 5, 7, 9, 11]
        self.assertEqual(binary_search(arr, 7), 3)

    def test_found_first(self):
        arr = [2, 4, 6, 8]
        self.assertEqual(binary_search(arr, 2), 0)

    def test_not_found(self):
        arr = [10, 20, 30]
        self.assertEqual(binary_search(arr, 15), -1)

if __name__ == '__main__':
    unittest.main()
`;

    const readmeCode = `# ${topic || "Python & Algorithms Masterclass"}

## Workspace Architecture
- \`main.py\`: Primary interactive walkthrough script with step-by-step logs.
- \`solution.py\`: Production solution reference for comparison.
- \`tests.py\`: Unit test suite verifying edge cases.

## Complexity
- **Time Complexity**: \`O(log N)\` logarithmic time
- **Space Complexity**: \`O(1)\` auxiliary memory
`;

    return {
      files: {
        "main.py": pythonCode,
        "solution.py": solutionCode,
        "tests.py": testsCode,
        "README.md": readmeCode,
      },
      defaultFile: "main.py",
      openTabs: ["main.py", "solution.py", "README.md"],
      isWebRunner: false,
    };
  }

  // 2. React / JSX / Hooks
  if (
    l === "react" ||
    l === "jsx" ||
    l === "tsx" ||
    t.includes("react") ||
    t.includes("hook") ||
    t.includes("component") ||
    t.includes("state")
  ) {
    const appJsx =
      injectedCode ||
      `import React, { useState } from "react";

export default function CounterApp() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([0]);

  const increment = () => {
    setCount((prev) => {
      const next = prev + 1;
      setHistory((h) => [...h, next]);
      return next;
    });
  };

  const decrement = () => {
    setCount((prev) => {
      const next = prev - 1;
      setHistory((h) => [...h, next]);
      return next;
    });
  };

  const reset = () => {
    setCount(0);
    setHistory([0]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>⚛️ React 19 State &amp; Hooks</h1>
        <p className="subtitle">${topic || "Interactive Learnify AI State Management"}</p>
      </header>

      <main className="counter-card">
        <span className="count-label">Current Count</span>
        <div className="count-display">{count}</div>

        <div className="button-group">
          <button onClick={decrement} className="btn btn-secondary">-1</button>
          <button onClick={reset} className="btn btn-danger">Reset</button>
          <button onClick={increment} className="btn btn-primary">+1</button>
        </div>

        <div className="history-section">
          <h4>State History ({history.length} updates)</h4>
          <div className="history-chips">
            {history.slice(-8).map((val, i) => (
              <span key={i} className="chip">{val}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
`;

    const reactHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>React 19 Interactive Workspace</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    ${appJsx.replace(/export default function CounterApp/, "function CounterApp")}
    ReactDOM.createRoot(document.getElementById('root')).render(<CounterApp />);
  </script>
</body>
</html>`;

    const reactCss = `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
}
.app-container {
  width: 100%;
  max-width: 360px;
  background: #1e293b;
  border-radius: 20px;
  border: 1px solid #334155;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}
.app-header h1 {
  font-size: 20px;
  font-weight: 800;
  color: #38bdf8;
  margin: 0 0 4px 0;
  text-align: center;
}
.subtitle {
  font-size: 12px;
  color: #94a3b8;
  margin: 0 0 20px 0;
  text-align: center;
}
.counter-card {
  text-align: center;
}
.count-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #64748b;
  font-weight: 700;
}
.count-display {
  font-size: 54px;
  font-weight: 900;
  color: #f8fafc;
  margin: 8px 0 16px 0;
  font-feature-settings: "tnum";
}
.button-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.15s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn-primary { background: #38bdf8; color: #0f172a; }
.btn-secondary { background: #475569; color: #f8fafc; }
.btn-danger { background: #e11d48; color: #fff; }
.history-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #334155;
  text-align: left;
}
.history-section h4 {
  font-size: 11px;
  color: #94a3b8;
  margin: 0 0 8px 0;
  text-transform: uppercase;
}
.history-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.chip {
  background: #334155;
  color: #38bdf8;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}`;

    const reactPackage = `{
  "name": "react-scrimba-workspace",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`;

    return {
      files: {
        "App.jsx": appJsx,
        "index.html": reactHtml,
        "styles.css": reactCss,
        "package.json": reactPackage,
      },
      defaultFile: "App.jsx",
      openTabs: ["App.jsx", "styles.css", "index.html"],
      isWebRunner: true,
    };
  }

  // 3. Default: Cake Recipe App (Frames 001, 007, 008)
  return {
    files: {
      "index.html": injectedCode || DEFAULT_CAKE_HTML,
      "styles.css": DEFAULT_CAKE_CSS,
      "index.js": DEFAULT_CAKE_JS,
      "package-lock.json": DEFAULT_PACKAGE_JSON,
    },
    defaultFile: "index.html",
    openTabs: ["index.js", "index.html"],
    isWebRunner: true,
  };
}

export function generateTopicNarrations(topic: string, instructor: string): NarrationClip[] {
  const isCake = topic.toLowerCase().includes("cake");
  if (isCake) return LESSON_NARRATIONS;

  return [
    {
      time: 0,
      text: `Hello! I'm ${instructor}, and welcome to this Learnify AI session on ${topic}.`,
      caption: `Welcome to ${topic} with ${instructor}.`,
    },
    {
      time: 5,
      text: "You are inside a real live IDE. On the left are your project files, in the center is the editor, and on the right is your live execution runner.",
      caption: "Interactive Learnify AI: Files on left, code in center, live runner on right.",
    },
    {
      time: 14,
      text: "Look through the code structure. You can click into any line to pause and test your own variations.",
      caption: "Click anywhere in the code to pause and experiment.",
    },
    {
      time: 25,
      text: "Practice checkpoint! Try modifying a variable or adding a function, and see the runner update.",
      caption: "Practice checkpoint: Try your own code modifications.",
      autoPause: true,
    },
    {
      time: 50,
      text: "Whenever you edit code, your personal fork stays active. When you want to return to the lecture, just click Back to Teacher.",
      caption: "Click 'Back to Teacher' when you're ready to resume.",
    },
    {
      time: 100,
      text: "Great progress! Continue exploring the code files to master this topic.",
      caption: "Great progress! Master the concept by experimenting.",
    },
  ];
}

export interface ScrimbaWorkspaceProps {
  courseTitle?: string;
  lessonTitle?: string;
  instructorName?: string;
  injectedCode?: string;
  injectedLang?: string;
  activeVideoTime?: number;
  totalDuration?: number;
  isStandAlonePlayer?: boolean;
  onCodeChange?: (code: string) => void;
  onForkChange?: (isForked: boolean) => void;
}

export type CaptionStyle = "karaoke" | "glass" | "cinema" | "cyberpunk";

export interface SupportedLanguage {
  code: string;
  label: string;
  flag: string;
  speechLocale: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", label: "English", flag: "🇬🇧", speechLocale: "en-US" },
  { code: "hi", label: "हिंदी / Hinglish", flag: "🇮🇳", speechLocale: "hi-IN" },
  { code: "es", label: "Español", flag: "🇪🇸", speechLocale: "es-ES" },
  { code: "fr", label: "Français", flag: "🇫🇷", speechLocale: "fr-FR" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", speechLocale: "de-DE" },
  { code: "ja", label: "日本語", flag: "🇯🇵", speechLocale: "ja-JP" },
];

const INTRO_TRANSLATIONS: Record<string, string> = {
  en: "My name is {instructor}, and you'll be hearing challenges in order to learn the ropes.",
  hi: "मेरा नाम {instructor} है, और आप व्यावहारिक कोड चुनौतियों के साथ सीखेंगे।",
  es: "Mi nombre es {instructor}, y escucharás desafíos para aprender en la práctica.",
  fr: "Je m'appelle {instructor}, et vous découvrirez des défis interactifs pour coder.",
  de: "Mein Name ist {instructor}, und Sie werden praktische Aufgaben lösen, um zu lernen.",
  ja: "講師の{instructor}です。インタラクティブな課題で実践的に学びましょう。",
};

export function ScrimbaWorkspace({
  courseTitle = "Fullstack Path",
  lessonTitle = "Let's Make a Cake!",
  instructorName = "Tom Chant",
  injectedCode,
  injectedLang = "html",
  activeVideoTime = 0,
  totalDuration = 437, // 7:17
  isStandAlonePlayer = false,
  onCodeChange,
  onForkChange,
}: ScrimbaWorkspaceProps) {
  const executeCodeFn = useServerFn(executeCode);

  // ─── Initial Dynamic Workspace Setup ───────────────────────────────────────
  const initialTopicConfig = useMemo(
    () => getDefaultFilesForTopic(lessonTitle, injectedLang, injectedCode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ─── Playback Engine State ─────────────────────────────────────────────────
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(activeVideoTime);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);
  const [captionsEnabled, setCaptionsEnabled] = useState<boolean>(true);
  const [activeCaption, setActiveCaption] = useState<string>("Hey there.");
  const [showIntroBumper, setShowIntroBumper] = useState<boolean>(currentTime < 4);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showExplainModal, setShowExplainModal] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>("glass");
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  // ─── Responsive Tabs (Mobile & Tablet) ────────────────────────────────────
  const [mobileTab, setMobileTab] = useState<"code" | "preview" | "files">("code");

  // ─── Files and Editor State ────────────────────────────────────────────────
  const [files, setFiles] = useState<Record<string, string>>(initialTopicConfig.files);
  const [activeFileName, setActiveFileName] = useState<string>(initialTopicConfig.defaultFile);
  const [isImagesFolderOpen, setIsImagesFolderOpen] = useState<boolean>(true);
  const [openTabs, setOpenTabs] = useState<string[]>(initialTopicConfig.openTabs);
  const [isForked, setIsForked] = useState<boolean>(false);
  const [forkTimestamp, setForkTimestamp] = useState<number>(0);
  const [teacherSnapshot, setTeacherSnapshot] = useState<Record<string, string>>(initialTopicConfig.files);

  // ─── Runner & Console State ────────────────────────────────────────────────
  const [bottomTab, setBottomTab] = useState<"runner" | "console">("runner");
  const [consoleLogs, setConsoleLogs] = useState<{ id: string; type: "log" | "warn" | "error"; text: string; time: string }[]>([]);
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRunningScript, setIsRunningScript] = useState<boolean>(false);
  const [scriptOutput, setScriptOutput] = useState<string>("");
  const [scriptExitCode, setScriptExitCode] = useState<number | null>(null);
  const [scriptDurationMs, setScriptDurationMs] = useState<number | null>(null);

  // Active topic narrations
  const narrations = useMemo(
    () => generateTopicNarrations(lessonTitle, instructorName),
    [lessonTitle, instructorName]
  );

  const isWebRunner = useMemo(() => {
    const l = (injectedLang || "").toLowerCase();
    const t = lessonTitle.toLowerCase();
    if (l === "python" || l === "py" || t.includes("python") || t.includes("binary search") || t.includes("dsa")) {
      return false;
    }
    return true;
  }, [injectedLang, lessonTitle]);

  // Synchronize when topic, lesson, or injected code changes
  useEffect(() => {
    const config = getDefaultFilesForTopic(lessonTitle, injectedLang, injectedCode);
    setFiles(config.files);
    setTeacherSnapshot(config.files);
    setActiveFileName(config.defaultFile);
    setOpenTabs(config.openTabs);
    setIsForked(false);
    setCurrentTime(0);
    setIsPlaying(false);
    setShowIntroBumper(true);
    setScriptOutput("");
    setScriptExitCode(null);
  }, [lessonTitle, injectedCode, injectedLang]);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMaximized) {
        setIsMaximized(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMaximized]);

  // Cloud script execution runner
  const handleRunScript = useCallback(async () => {
    setIsRunningScript(true);
    const start = Date.now();
    try {
      const code = files[activeFileName] || Object.values(files)[0] || "";
      const lang = activeFileName.endsWith(".py") ? "python" : activeFileName.endsWith(".js") ? "javascript" : "html";
      const res = await executeCodeFn({ data: { language: lang, code } });
      const duration = Date.now() - start;
      setScriptDurationMs(duration);
      if (res) {
        const rawRes = res as any;
        const out = rawRes.stdout || rawRes.output || rawRes.stderr || rawRes.error || "[Execution finished with no stdout]";
        setScriptOutput(out);
        setScriptExitCode(typeof rawRes.code === "number" ? rawRes.code : rawRes.error ? 1 : 0);
        setConsoleLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            type: rawRes.error || rawRes.stderr ? "error" : "log",
            text: out,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        if (rawRes.error || rawRes.stderr) {
          toast.error("Execution finished with errors");
        } else {
          toast.success(`Executed in ${duration}ms`);
        }
      }
    } catch (err: any) {
      const msg = err.message || String(err);
      toast.error(`Execution failed: ${msg}`);
      setScriptOutput(`Error: ${msg}`);
      setScriptExitCode(1);
    } finally {
      setIsRunningScript(false);
    }
  }, [activeFileName, executeCodeFn, files]);

  // ─── Speech Synthesis Narration (Multi-Language Locale Matching) ─────────
  const speakText = useCallback(
    (text: string) => {
      if (!speechEnabled || isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = playbackSpeed;
        utterance.pitch = 1.0;

        const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];
        utterance.lang = langConfig.speechLocale;

        const voices = window.speechSynthesis.getVoices();
        const matchedVoice =
          voices.find((v) => v.lang.toLowerCase().startsWith(langConfig.code.toLowerCase())) ||
          voices.find((v) => v.lang.toLowerCase().includes(langConfig.speechLocale.toLowerCase())) ||
          voices.find((v) => v.lang.startsWith("en") && !v.name.includes("Zira")) ||
          voices[0];

        if (matchedVoice) utterance.voice = matchedVoice;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech API unsupported or blocked by browser
      }
    },
    [speechEnabled, isMuted, playbackSpeed, selectedLanguage]
  );

  // ─── Export Lesson as MP4 Video ───────────────────────────────────────────
  const handleDownloadMp4 = useCallback(async () => {
    setIsExportingVideo(true);
    setExportProgress(10);
    toast.info("Generating MP4 Explainer video with code, slides & captions...");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const cleanTitle = lessonTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");
        a.download = `learnify-${cleanTitle}-${selectedLanguage}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsExportingVideo(false);
        setExportProgress(100);
        toast.success("MP4 Explainer video generated & downloaded successfully!");
      };

      mediaRecorder.start();

      let frame = 0;
      const totalFrames = 50;
      const renderInterval = setInterval(() => {
        frame++;
        setExportProgress(Math.min(95, Math.round((frame / totalFrames) * 90) + 10));

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 1920, 1080);
        grad.addColorStop(0, "#0b0f19");
        grad.addColorStop(0.5, "#0e1424");
        grad.addColorStop(1, "#080c14");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1920, 1080);

        // Header with Learnify AI Branding
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 32px 'Space Grotesk', sans-serif";
        ctx.fillText("LEARNIFY AI · INTERACTIVE MASTERCLASS", 100, 100);

        // Title & Track
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 60px 'Space Grotesk', sans-serif";
        ctx.fillText(lessonTitle, 100, 190);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "26px 'DM Sans', sans-serif";
        ctx.fillText(
          `Teacher: ${instructorName} · Track: ${courseTitle} · Language: ${selectedLanguage.toUpperCase()} · Style: ${captionStyle.toUpperCase()}`,
          100,
          250
        );

        // Left Pane: Code Snapshot Card
        ctx.fillStyle = "#141a2e";
        ctx.strokeStyle = "#1e293b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(100, 310, 820, 610, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 22px 'Fira Code', monospace";
        ctx.fillText(`// File: ${activeFileName}`, 140, 370);

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "17px 'Fira Code', monospace";
        const codeLines = (files[activeFileName] || "").split("\n").slice(0, 17);
        codeLines.forEach((line, i) => {
          ctx.fillText(line.substring(0, 52), 140, 420 + i * 28);
        });

        // Right Pane: Live Execution Preview Card
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.roundRect(980, 310, 840, 610, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#10b981";
        ctx.font = "bold 26px 'Space Grotesk', sans-serif";
        ctx.fillText("● Live Interactive Execution Sandbox", 1020, 370);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "20px 'DM Sans', sans-serif";
        ctx.fillText("Virtual Cloud Runtime Active · Zero-Latency Hot Reload", 1020, 420);
        ctx.fillText("Student can fork code directly alongside this lecture.", 1020, 460);

        // Subtitle Bar (Styled according to captionStyle)
        ctx.fillStyle = captionStyle === "cyberpunk" ? "#022c22" : "rgba(2, 6, 23, 0.95)";
        ctx.strokeStyle = captionStyle === "cyberpunk" ? "#22c55e" : captionStyle === "karaoke" ? "#facc15" : "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(260, 955, 1400, 85, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = captionStyle === "karaoke" ? "#facc15" : captionStyle === "cyberpunk" ? "#4ade80" : "#ffffff";
        ctx.font = captionStyle === "cyberpunk" ? "bold 24px 'Fira Code', monospace" : "bold 26px 'DM Sans', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`LEARNIFY AI [${selectedLanguage.toUpperCase()}]: ${activeCaption}`, 960, 1010);
        ctx.textAlign = "left";

        if (frame >= totalFrames) {
          clearInterval(renderInterval);
          mediaRecorder.stop();
        }
      }, 40);
    } catch (err: any) {
      setIsExportingVideo(false);
      toast.error(`Export failed: ${err.message || String(err)}`);
    }
  }, [lessonTitle, selectedLanguage, instructorName, courseTitle, captionStyle, activeFileName, files, activeCaption]);

  // Stop speech when unmounted or paused
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ─── Timer & Auto-Play Engine ──────────────────────────────────────────────
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }

          // Check if milestone narration fires at this second
          const clip = narrations.find((c) => c.time === next);
          if (clip) {
            setActiveCaption(clip.caption);
            speakText(clip.text);
            if (clip.autoPause) {
              setIsPlaying(false);
              setIsForked(true);
              setForkTimestamp(next);
              onForkChange?.(true);
              toast.info("🎯 Practice Checkpoint: Code is paused for hands-on experiment. Click 'Back to Teacher' when done!");
            }
          }

          // Fade out intro bumper after 4 seconds
          if (next >= 4) {
            setShowIntroBumper(false);
          }

          return next;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalDuration, playbackSpeed, speakText, onForkChange]);

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ─── User Interaction -> Fork Code & Auto-Pause ───────────────────────────
  const triggerFork = useCallback(() => {
    if (!isForked) {
      setIsForked(true);
      setForkTimestamp(currentTime);
      setIsPlaying(false);
      onForkChange?.(true);
      window.dispatchEvent(
        new CustomEvent("learnify:pause-video", {
          detail: { forked: true, time: currentTime },
        })
      );
      toast.info("Lecture paused for hands-on practice. Click 'Back to Teacher' when done!");
    }
  }, [isForked, currentTime, onForkChange]);

  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const nextVal = value ?? "";
      setFiles((prev) => ({ ...prev, [activeFileName]: nextVal }));
      onCodeChange?.(nextVal);
      triggerFork();
    },
    [activeFileName, onCodeChange, triggerFork]
  );

  // ─── "Back to Teacher" Restore Action ─────────────────────────────────────
  const handleBackToTeacher = useCallback(() => {
    setFiles(teacherSnapshot);
    setIsForked(false);
    onForkChange?.(false);
    setActiveFileName("index.html");
    if (!openTabs.includes("index.html")) {
      setOpenTabs((prev) => [...prev, "index.html"]);
    }
    window.dispatchEvent(new CustomEvent("learnify:resume-video"));
    toast.success("Restored to teacher's checkpoint! Lecture resumed.");
    setIsPlaying(true);
    speakText("Great job! Resuming the lesson from the checkpoint.");
    setActiveCaption("Resuming teacher walkthrough...");
  }, [teacherSnapshot, openTabs, onForkChange, speakText]);

  // ─── Open File in Editor Tab ──────────────────────────────────────────────
  const handleSelectFile = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs((prev) => [...prev, fileName]);
    }
    setActiveFileName(fileName);
    // Opening a different file or exploring files also triggers fork so student can explore
    triggerFork();
  };

  const handleCloseTab = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = openTabs.filter((t) => t !== fileName);
    setOpenTabs(filtered);
    if (activeFileName === fileName) {
      setActiveFileName(filtered[filtered.length - 1] || "index.html");
    }
  };

  // ─── Toggle Play / Pause ──────────────────────────────────────────────────
  const togglePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setShowIntroBumper(currentTime < 4);
      // Play initial clip if starting from zero
      if (currentTime === 0 && narrations[0]) {
        speakText(narrations[0].text);
        setActiveCaption(narrations[0].caption);
      }
    } else {
      setIsPlaying(false);
    }
  };

  // ─── Live Bundled srcDoc with Embedded Food Assets ────────────────────────
  const bundledSrcDoc = useMemo(() => {
    let html = files["index.html"] || "";
    const css = files["styles.css"] || "";
    const js = files["index.js"] || "";

    // Replace image paths with embedded SVG data URIs so they load instantly without 404s
    Object.entries(FOOD_ASSETS).forEach(([imgPath, asset]) => {
      const dataUri = svgToDataUri(asset.svg);
      html = html.split(`src="${imgPath}"`).join(`src="${dataUri}"`);
      html = html.split(`src='${imgPath}'`).join(`src='${dataUri}'`);
    });

    const consoleInterceptor = `
      <script>
        (function() {
          const sendLog = (type, args) => {
            try {
              window.parent.postMessage({
                source: "learnify-scrimba-sandbox",
                type: type,
                text: Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(" "),
                time: new Date().toLocaleTimeString()
              }, "*");
            } catch(e) {}
          };
          const origLog = console.log;
          const origWarn = console.warn;
          const origError = console.error;
          console.log = function() { origLog.apply(console, arguments); sendLog("log", arguments); };
          console.warn = function() { origWarn.apply(console, arguments); sendLog("warn", arguments); };
          console.error = function() { origError.apply(console, arguments); sendLog("error", arguments); };
          window.onerror = function(msg, url, line) {
            sendLog("error", ["Uncaught Error at line " + line + ": " + msg]);
          };
        })();
      <\/script>
    `;

    let rendered = html;
    if (css) {
      if (rendered.includes("</head>")) {
        rendered = rendered.replace("</head>", `<style>${css}</style></head>`);
      } else {
        rendered = `<style>${css}</style>` + rendered;
      }
    }
    if (js) {
      if (rendered.includes("</body>")) {
        rendered = rendered.replace("</body>", `${consoleInterceptor}<script>${js}<\/script></body>`);
      } else {
        rendered = rendered + `${consoleInterceptor}<script>${js}<\/script>`;
      }
    }

    return rendered;
  }, [files]);

  // Listen to sandbox messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.source === "learnify-scrimba-sandbox") {
        setConsoleLogs((prev) => [
          ...prev.slice(-49),
          {
            id: Math.random().toString(36).substring(7),
            type: e.data.type,
            text: e.data.text,
            time: e.data.time,
          },
        ]);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const isImageFile = activeFileName.startsWith("images/");
  const activeImageAsset = isImageFile ? FOOD_ASSETS[activeFileName] : null;

  return (
    <div
      className={cn(
        "flex flex-col bg-[#0e111a] text-slate-100 shadow-2xl font-sans select-none transition-all",
        isMaximized
          ? "fixed inset-0 z-50 rounded-none w-screen h-screen overflow-hidden"
          : "rounded-2xl border border-slate-800 overflow-hidden min-h-[640px]"
      )}
    >
      {/* ─── 1. TOP NAV BAR (Frame 001, 007, 008) ──────────────────────────── */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#141824] border-b border-slate-800/80 text-xs gap-2">
        {/* Left: Brand Icon + Breadcrumbs + Timer + "BACK TO TEACHER" */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0 select-none">
            <Logo markOnly height="h-5" />
            <span className="font-bold text-[11px] tracking-wider text-white hidden md:inline font-display">
              LEARNIFY AI
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] truncate">
            <span>/</span>
            <span className="hover:text-slate-200 transition truncate">{courseTitle}</span>
            <span>/</span>
            <span className="hover:text-slate-200 transition truncate hidden sm:inline">Introduction</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-slate-100 font-semibold truncate">{lessonTitle}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60">
            <span>{formatTime(currentTime)}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{formatTime(totalDuration)}</span>
          </div>

          {/* ↺ BACK TO TEACHER Button (Frames 007, 008) */}
          {isForked && (
            <Button
              onClick={handleBackToTeacher}
              size="sm"
              className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs h-7 px-3 gap-1.5 shadow-md shadow-sky-500/20 rounded-full transition-transform hover:scale-105 active:scale-95 animate-in fade-in"
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>BACK TO TEACHER</span>
            </Button>
          )}
        </div>

        {/* Right: Offer Badge, EXPLAIN Button, Viewport Selectors, Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="outline"
            className="hidden md:inline-flex bg-amber-500/10 text-amber-300 border-amber-500/40 text-[10px] font-mono px-2 py-0.5 font-bold"
          >
            <Flame className="h-3 w-3 mr-1 text-amber-400" />
            35% SALE <span className="ml-1 text-white">00:42:29</span>
          </Badge>

          {/* (⊙) EXPLAIN Button (Frames 001, 007, 008) */}
          <Button
            onClick={() => setShowExplainModal(true)}
            size="sm"
            variant="outline"
            className="h-7 px-2.5 text-[11px] font-bold gap-1 text-sky-400 border-sky-400/30 hover:bg-sky-500/10 hover:text-sky-300 cursor-pointer"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>EXPLAIN</span>
          </Button>

          {/* Fullscreen Expand / Minimize */}
          <Button
            onClick={() => setIsMaximized((m) => !m)}
            size="sm"
            variant="outline"
            className="h-7 px-2 text-[11px] font-bold text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800 cursor-pointer"
            title={isMaximized ? "Exit Fullscreen (Esc)" : "Fullscreen Workstation"}
          >
            {isMaximized ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">MINIMIZE</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">EXPAND</span>
              </>
            )}
          </Button>

          {/* Mobile responsive tab toggle (< 1024px) */}
          <div className="flex lg:hidden items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-[11px]">
            <button
              onClick={() => setMobileTab("code")}
              className={cn("px-2 py-1 rounded font-medium", mobileTab === "code" && "bg-indigo-600 text-white font-bold")}
            >
              Code
            </button>
            <button
              onClick={() => setMobileTab("preview")}
              className={cn("px-2 py-1 rounded font-medium", mobileTab === "preview" && "bg-indigo-600 text-white font-bold")}
            >
              Preview
            </button>
            <button
              onClick={() => setMobileTab("files")}
              className={cn("px-2 py-1 rounded font-medium", mobileTab === "files" && "bg-indigo-600 text-white font-bold")}
            >
              Files
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN WORKSPACE (Files + Editor + Live Runner) ─────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 bg-[#090D16] relative overflow-hidden">
        {/* ─── Left Pane: Files Sidebar (Frames 001, 007, 008) ────────────── */}
        <div
          className={cn(
            "lg:col-span-2 p-3 bg-[#0d111c] text-xs font-mono flex flex-col justify-between overflow-y-auto",
            mobileTab !== "files" && "hidden lg:flex"
          )}
        >
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-bold text-slate-400 tracking-wider">
              <span>FILES</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const name = window.prompt("Enter new file name (e.g. utils.js, helpers.py):");
                    if (name && name.trim()) {
                      const trimmed = name.trim();
                      setFiles((prev) => ({ ...prev, [trimmed]: "" }));
                      setOpenTabs((prev) => [...prev, trimmed]);
                      setActiveFileName(trimmed);
                      triggerFork();
                      toast.success(`Created ${trimmed} in sandbox!`);
                    }
                  }}
                  className="hover:text-slate-100 p-0.5 rounded cursor-pointer"
                  title="New File"
                >
                  <FilePlus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsImagesFolderOpen((o) => !o)}
                  className="hover:text-slate-100 p-0.5 rounded cursor-pointer"
                  title="Toggle Folders"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Folder: images/ (Frames 007, 008) */}
            <div className="space-y-0.5">
              <button
                onClick={() => setIsImagesFolderOpen((o) => !o)}
                className="w-full flex items-center gap-1.5 px-1.5 py-1 text-slate-300 hover:text-white rounded hover:bg-slate-800/50 text-[11px] font-semibold text-left"
              >
                {isImagesFolderOpen ? (
                  <FolderOpen className="h-3.5 w-3.5 text-sky-400" />
                ) : (
                  <Folder className="h-3.5 w-3.5 text-sky-400" />
                )}
                <span>images</span>
              </button>

              {isImagesFolderOpen && (
                <div className="pl-4 space-y-0.5 border-l border-slate-800 ml-2">
                  {Object.keys(FOOD_ASSETS).map((imgPath) => {
                    const shortName = imgPath.replace("images/", "");
                    const isSelected = activeFileName === imgPath;
                    return (
                      <button
                        key={imgPath}
                        onClick={() => handleSelectFile(imgPath)}
                        className={cn(
                          "w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition text-[11px] truncate",
                          isSelected
                            ? "bg-sky-500/20 text-sky-300 font-bold"
                            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                        )}
                      >
                        <ImageIcon className="h-3 w-3 text-sky-400 shrink-0" />
                        <span className="truncate">{shortName}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Dynamic Code Files */}
              {Object.keys(files)
                .filter((f) => !f.includes("package") && !f.startsWith("images/"))
                .map((fName) => {
                  const isSelected = activeFileName === fName;
                  const isPy = fName.endsWith(".py");
                  const isHtml = fName.endsWith(".html");
                  const isCss = fName.endsWith(".css");
                  const isJs = fName.endsWith(".js") || fName.endsWith(".jsx");
                  const isJson = fName.endsWith(".json");
                  const isMd = fName.endsWith(".md");

                  return (
                    <button
                      key={fName}
                      onClick={() => handleSelectFile(fName)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition text-[11px] font-mono truncate cursor-pointer",
                        isSelected
                          ? "bg-slate-800 text-sky-400 font-bold"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/40"
                      )}
                    >
                      {isPy && <span className="text-yellow-400 font-bold text-[10px]">Py</span>}
                      {isHtml && <span className="text-orange-400 font-bold text-[10px]">&lt;&gt;</span>}
                      {isCss && <span className="text-sky-400 font-bold text-[10px]">#</span>}
                      {isJs && <span className="text-yellow-400 font-bold text-[10px]">JS</span>}
                      {isJson && <span className="text-red-400 font-bold text-[10px]">&#123;&#125;</span>}
                      {isMd && <span className="text-purple-400 font-bold text-[10px]">MD</span>}
                      {!isPy && !isHtml && !isCss && !isJs && !isJson && !isMd && (
                        <FileCode className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{fName}</span>
                    </button>
                  );
                })}
            </div>

            {/* Configuration Header */}
            {Object.keys(files).some((f) => f.includes("package")) && (
              <div className="pt-4 mt-4 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">
                  Configuration
                </span>
                {Object.keys(files)
                  .filter((f) => f.includes("package"))
                  .map((pkgFile) => (
                    <button
                      key={pkgFile}
                      onClick={() => handleSelectFile(pkgFile)}
                      className={cn(
                        "w-full flex items-center gap-1.5 px-2 py-1 rounded text-left transition text-[11px] cursor-pointer",
                        activeFileName === pkgFile
                          ? "bg-slate-800 text-red-400 font-bold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                      )}
                    >
                      <span className="text-[9px] bg-red-950 text-red-400 px-1 rounded font-bold">npm</span>
                      <span className="truncate">{pkgFile}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-1">
            <p>💡 Click any line of code to fork & start practicing.</p>
          </div>
        </div>

        {/* ─── Center Pane: Editor / Image Showcase (Frames 001, 007, 008) ─── */}
        <div
          className={cn(
            "lg:col-span-5 flex flex-col bg-[#0b0e17] relative",
            mobileTab !== "code" && "hidden lg:flex"
          )}
        >
          {/* File Tabs Bar */}
          <div className="flex items-center justify-between px-2 bg-[#121622] border-b border-slate-800 text-xs overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1">
              {openTabs.map((tab) => {
                const isActive = activeFileName === tab;
                const isTabImage = tab.startsWith("images/");
                return (
                  <div
                    key={tab}
                    onClick={() => setActiveFileName(tab)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 border-t-2 text-[11px] font-mono cursor-pointer transition",
                      isActive
                        ? "bg-[#0b0e17] border-sky-400 text-white font-semibold"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                    )}
                  >
                    {isTabImage ? (
                      <ImageIcon className="h-3 w-3 text-sky-400" />
                    ) : tab.endsWith(".html") ? (
                      <span className="text-orange-400 font-bold">&lt;&gt;</span>
                    ) : tab.endsWith(".js") ? (
                      <span className="text-yellow-400 font-bold">JS</span>
                    ) : tab.endsWith(".css") ? (
                      <span className="text-sky-400 font-bold">#</span>
                    ) : (
                      <FileJson className="h-3 w-3 text-red-400" />
                    )}
                    <span className="truncate max-w-[120px]">{tab.replace("images/", "")}</span>
                    {openTabs.length > 1 && (
                      <button
                        onClick={(e) => handleCloseTab(tab, e)}
                        className="hover:text-red-400 text-slate-500 rounded p-0.5 ml-1"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pr-2 text-[10px] text-slate-400 font-mono">
              <span>UTF-8</span>
            </div>
          </div>

          {/* Editor Body or Image Showcase */}
          <div className="flex-1 min-h-[380px] relative overflow-hidden flex flex-col">
            {isImageFile && activeImageAsset ? (
              /* Image Showcase (Frame 008) */
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#090C15] space-y-4">
                <div
                  className="w-48 h-48 sm:w-56 sm:h-56 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
                  dangerouslySetInnerHTML={{ __html: activeImageAsset.svg }}
                />
                <div className="text-center space-y-1">
                  <Badge variant="outline" className="text-sky-400 border-sky-500/30 bg-sky-500/10">
                    {activeFileName}
                  </Badge>
                  <p className="text-xs text-slate-400 font-mono">Asset Dimensions: 512 × 512 PNG/SVG</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectFile("index.html")}
                  className="text-xs text-slate-300 border-slate-700 hover:text-white"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-1" />
                  Back to index.html
                </Button>
              </div>
            ) : (
              /* Monaco Code Editor (Frames 001, 007) */
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={
                    activeFileName.endsWith(".html")
                      ? "html"
                      : activeFileName.endsWith(".css")
                        ? "css"
                        : activeFileName.endsWith(".py")
                          ? "python"
                          : activeFileName.endsWith(".json")
                            ? "json"
                            : activeFileName.endsWith(".md")
                              ? "markdown"
                              : activeFileName.endsWith(".tsx") || activeFileName.endsWith(".ts")
                                ? "typescript"
                                : "javascript"
                  }
                  theme="vs-dark"
                  value={files[activeFileName] || ""}
                  onChange={handleEditorChange}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    tabSize: 2,
                    automaticLayout: true,
                    padding: { top: 12 },
                    scrollBeyondLastLine: false,
                    fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                  }}
                />

                {/* Translucent Center Play Button Overlay When Paused (Frame 001) */}
                {!isPlaying && (
                  <div
                    onClick={togglePlayPause}
                    className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center cursor-pointer group transition-all"
                  >
                    <div className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-400/40 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:bg-sky-500/30 group-hover:border-sky-400 shadow-2xl transition-transform">
                      <Play className="h-8 w-8 fill-sky-400 ml-1" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Frame 002: Warm Sunset Intro Bumper Card */}
            {showIntroBumper && (
              <div
                onClick={() => setShowIntroBumper(false)}
                className="absolute inset-4 z-20 rounded-2xl bg-gradient-to-br from-indigo-700/90 via-sky-700/90 to-purple-800/90 p-8 text-white flex flex-col justify-between shadow-2xl backdrop-blur-md cursor-pointer animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="flex justify-between items-center text-xs tracking-widest uppercase font-mono font-bold text-sky-200">
                  <div className="flex items-center gap-2">
                    <Logo markOnly height="h-5" />
                    <span className="font-bold text-white tracking-wider font-display">LEARNIFY AI</span>
                  </div>
                  <span className="text-[10px] text-white/70">Click anywhere to start coding</span>
                </div>

                <div className="my-auto text-center space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white drop-shadow-md">
                    {lessonTitle}
                  </h2>
                  <p className="text-sm sm:text-base font-semibold text-sky-100">
                    Teacher: {instructorName} · Language: {selectedLanguage.toUpperCase()}
                  </p>
                </div>

                <div className="bg-slate-950/75 border border-white/20 rounded-xl px-4 py-2.5 text-center text-xs sm:text-sm font-medium text-slate-100 backdrop-blur-sm mx-auto max-w-lg shadow-xl">
                  <span className="font-bold text-sky-400 mr-2">LEARNIFY AI:</span>
                  {(INTRO_TRANSLATIONS[selectedLanguage] || INTRO_TRANSLATIONS.en).replace("{instructor}", instructorName)}
                </div>
              </div>
            )}

            {/* Dynamic Live Captions Bar (Styles: Glass, Karaoke, Cinema, Cyberpunk) */}
            {captionsEnabled && activeCaption && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 max-w-lg w-[90%] text-center">
                {captionStyle === "karaoke" ? (
                  <div className="inline-block bg-black/90 text-yellow-300 font-extrabold text-sm sm:text-base border-2 border-yellow-400/80 px-6 py-2 rounded-2xl shadow-[0_0_20px_rgba(250,204,21,0.5)] tracking-wide animate-pulse">
                    <span className="text-amber-400 mr-1.5">🔥</span>
                    {activeCaption}
                  </div>
                ) : captionStyle === "cinema" ? (
                  <div className="inline-block bg-black/95 text-white border-y border-white/20 px-8 py-2 text-xs sm:text-sm font-serif tracking-widest shadow-2xl">
                    {activeCaption}
                  </div>
                ) : captionStyle === "cyberpunk" ? (
                  <div className="inline-block bg-[#051c14] text-emerald-400 border border-emerald-500/80 px-5 py-1.5 rounded-lg text-xs font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)] tracking-wider">
                    <span className="text-emerald-500 font-bold mr-1">&gt;</span> {activeCaption}
                  </div>
                ) : (
                  <div className="inline-block bg-slate-950/90 text-slate-100 border border-slate-700/80 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-md tracking-wide">
                    <span className="text-sky-400 font-bold mr-1.5">LEARNIFY AI [{selectedLanguage.toUpperCase()}]:</span>
                    {activeCaption}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Pane: Live Virtual Browser / Runner (Frames 001, 007) ─── */}
        <div
          className={cn(
            "lg:col-span-5 flex flex-col bg-[#0d101a] min-h-[380px]",
            mobileTab !== "preview" && "hidden lg:flex"
          )}
        >
          {/* Virtual Browser Top Bar (:8080/) */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#141824] border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            </div>

            {/* Browser URL Input */}
            <div className="flex-1 max-w-[240px] bg-slate-900 border border-slate-700/80 rounded-md px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center justify-between truncate">
              <div className="flex items-center gap-1.5 truncate">
                <Globe className="h-3 w-3 text-emerald-400 shrink-0" />
                <span className="truncate">:8080 /</span>
              </div>
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="hover:text-white text-slate-400"
                title="Refresh preview"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>

            {/* Viewport Width (Desktop / Mobile) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDeviceViewport("desktop")}
                className={cn(
                  "p-1 rounded text-slate-400 hover:text-white",
                  deviceViewport === "desktop" && "text-sky-400 bg-sky-500/10"
                )}
                title="Desktop View"
              >
                <Laptop className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setDeviceViewport("mobile")}
                className={cn(
                  "p-1 rounded text-slate-400 hover:text-white",
                  deviceViewport === "mobile" && "text-sky-400 bg-sky-500/10"
                )}
                title="Mobile 375px View"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Iframe Preview Container or Python Interactive Runtime */}
          {isWebRunner ? (
            <div className="flex-1 bg-white relative flex justify-center items-center overflow-auto min-h-[340px]">
              <iframe
                key={previewKey}
                title="Live Learnify AI Sandbox Preview"
                sandbox="allow-scripts allow-modals"
                srcDoc={bundledSrcDoc}
                className={cn(
                  "h-full border-0 transition-all duration-300",
                  deviceViewport === "desktop" ? "w-full" : "w-[375px] shadow-2xl border-x border-slate-300"
                )}
              />
            </div>
          ) : (
            <div className="flex-1 bg-[#090D16] text-slate-200 flex flex-col min-h-[340px] font-mono">
              <div className="p-3 bg-[#111625] border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-slate-200">Python 3.12 Cloud Runtime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleRunScript}
                    disabled={isRunningScript}
                    className="h-7 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>{isRunningScript ? "Running..." : "Run Script"}</span>
                  </Button>
                  {scriptOutput && (
                    <button
                      onClick={() => {
                        setScriptOutput("");
                        setScriptExitCode(null);
                        setScriptDurationMs(null);
                      }}
                      className="text-[11px] text-slate-400 hover:text-slate-200 p-1 rounded"
                      title="Clear Terminal"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs leading-relaxed bg-[#07090F]">
                <div className="text-slate-500 text-[11px]">
                  Learnify AI Sandbox Terminal [Version 4.2.0-cloud]<br />
                  Ready to execute {activeFileName}. Press &quot;Run Script&quot; to test your code.
                </div>

                {isRunningScript && (
                  <div className="flex items-center gap-2 text-sky-400 py-3">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Executing {activeFileName} in sandbox container...</span>
                  </div>
                )}

                {scriptOutput ? (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                      <span className="text-emerald-400 font-bold">● Exit Code: {scriptExitCode ?? 0}</span>
                      {scriptDurationMs && <span>● Duration: {scriptDurationMs}ms</span>}
                      <span>● Memory: 18.4MB</span>
                    </div>
                    <pre className="text-slate-100 whitespace-pre-wrap font-mono text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                      {scriptOutput}
                    </pre>
                  </div>
                ) : (
                  !isRunningScript && (
                    <div className="mt-8 text-center text-slate-500 space-y-2">
                      <Terminal className="h-8 w-8 mx-auto text-slate-600 stroke-[1.5]" />
                      <p className="text-xs">Click <strong className="text-emerald-400">&quot;Run Script&quot;</strong> above to execute <code className="text-sky-300">{activeFileName}</code></p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* ─── Runner / Console Tray ─────────────────────────────────────── */}
          <div className="border-t border-slate-800 bg-[#121622]">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 text-[11px]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBottomTab("runner")}
                  className={cn(
                    "font-semibold transition flex items-center gap-1 cursor-pointer",
                    bottomTab === "runner" ? "text-sky-400" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Layers className="h-3 w-3" /> ◇ Runner
                </button>
                <button
                  onClick={() => setBottomTab("console")}
                  className={cn(
                    "font-semibold transition flex items-center gap-1 cursor-pointer",
                    bottomTab === "console" ? "text-sky-400" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  <Terminal className="h-3 w-3" /> := Console {consoleLogs.length > 0 && `(${consoleLogs.length})`}
                </button>
              </div>
              {consoleLogs.length > 0 && (
                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-[10px] text-slate-400 hover:text-slate-200"
                >
                  Clear logs
                </button>
              )}
            </div>

            <div className="p-2.5 max-h-24 overflow-y-auto font-mono text-[11px] bg-[#090c14]">
              {bottomTab === "runner" ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Virtual dev server active at :8080. Hot reload active on keystrokes.</span>
                </div>
              ) : consoleLogs.length === 0 ? (
                <div className="text-slate-500 italic">No console logs yet. Click ingredients in the preview to test!</div>
              ) : (
                <div className="space-y-1">
                  {consoleLogs.map((log) => (
                    <div
                      key={log.id}
                      className={cn(
                        "flex items-start gap-2",
                        log.type === "error"
                          ? "text-rose-400"
                          : log.type === "warn"
                            ? "text-amber-400"
                            : "text-slate-200"
                      )}
                    >
                      <span className="text-[10px] text-slate-500 shrink-0">{log.time}</span>
                      <span className="break-all">{log.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. BOTTOM TRANSPORT BAR (Frames 001, 007, 008) ───────────────── */}
      <div className="px-3 sm:px-4 py-2.5 bg-[#121622] border-t border-slate-800 flex flex-col gap-1.5">
        {/* Timeline Scrubber with Ghost Markers */}
        <div className="relative flex items-center group cursor-pointer pt-1">
          <input
            type="range"
            min={0}
            max={totalDuration}
            value={currentTime}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              // Find matching caption
              const match = [...LESSON_NARRATIONS].reverse().find((c) => c.time <= val);
              if (match) setActiveCaption(match.caption);
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />

          {/* Ghost Markers for Interactive Practice Points (Frames 001, 007) */}
          <div
            style={{ left: `${(31 / totalDuration) * 100}%` }}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 border border-slate-900 pointer-events-none shadow"
            title="Ghost Marker: Challenge Point (0:31)"
          />
          <div
            style={{ left: `${(135 / totalDuration) * 100}%` }}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 border border-slate-900 pointer-events-none shadow"
            title="Ghost Marker: Challenge Point (2:15)"
          />
          <div
            style={{ left: `${(285 / totalDuration) * 100}%` }}
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 border border-slate-900 pointer-events-none shadow"
            title="Ghost Marker: Challenge Point (4:45)"
          />
        </div>

        {/* Transport Controls Row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-3">
            {/* Play / Pause Toggle */}
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center font-bold transition shadow-sm cursor-pointer"
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-slate-950" /> : <Play className="h-4 w-4 fill-slate-950 ml-0.5" />}
            </button>

            {/* Time Indicator */}
            <span className="font-mono text-[11px] text-slate-300">
              {formatTime(currentTime)} <span className="text-slate-500">/</span> {formatTime(totalDuration)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Volume / Mute Toggle */}
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="text-slate-400 hover:text-white p-1 rounded transition"
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Closed Captions CC Toggle (Frames 001, 007) */}
            <button
              onClick={() => setCaptionsEnabled((c) => !c)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold font-mono transition",
                captionsEnabled
                  ? "bg-sky-500/20 text-sky-400 border border-sky-400/40"
                  : "text-slate-500 hover:text-slate-300"
              )}
              title="Toggle Subtitles"
            >
              CC
            </button>

            {/* Playback Speed */}
            <button
              onClick={() => {
                const speeds = [1, 1.25, 1.5, 2];
                const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIdx]);
              }}
              className="font-mono text-[11px] font-bold text-slate-400 hover:text-white px-1.5 py-0.5 rounded"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>

            <span className="text-slate-600 hidden sm:inline">|</span>

            {/* Multi-Language Selector Dropdown */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-md px-1.5 py-0.5">
              <Globe2 className="h-3 w-3 text-sky-400 shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  const l = SUPPORTED_LANGUAGES.find((lang) => lang.code === e.target.value);
                  toast.success(`Voice & subtitles set to ${l?.label || e.target.value}`);
                }}
                className="bg-transparent text-[10px] font-mono font-bold text-slate-300 focus:outline-none cursor-pointer"
                title="Select Lesson Language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                    {l.flag} {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Caption Style Picker */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-md px-1.5 py-0.5">
              <Palette className="h-3 w-3 text-amber-400 shrink-0" />
              <select
                value={captionStyle}
                onChange={(e) => {
                  setCaptionStyle(e.target.value as CaptionStyle);
                  toast.info(`Caption style: ${e.target.value.toUpperCase()}`);
                }}
                className="bg-transparent text-[10px] font-mono font-bold text-slate-300 focus:outline-none cursor-pointer"
                title="Caption Visual Style"
              >
                <option value="glass" className="bg-slate-900 text-slate-100">Glass Pill</option>
                <option value="karaoke" className="bg-slate-900 text-slate-100">🔥 Viral Karaoke</option>
                <option value="cinema" className="bg-slate-900 text-slate-100">Cinema Bar</option>
                <option value="cyberpunk" className="bg-slate-900 text-slate-100">Cyber Terminal</option>
              </select>
            </div>

            {/* Download as MP4 Video Button */}
            <Button
              size="sm"
              onClick={handleDownloadMp4}
              disabled={isExportingVideo}
              className="h-6 px-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-[10px] gap-1 shadow-sm transition-all hover:scale-105 cursor-pointer ml-1"
              title="Download interactive lesson as MP4 video"
            >
              {isExportingVideo ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>{exportProgress}%</span>
                </>
              ) : (
                <>
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">Download MP4</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 4. AI CODE EXPLAIN MODAL ──────────────────────────────────────── */}
      {showExplainModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121624] border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-400" />
                <h3 className="font-bold font-display text-base text-white">
                  AI Code Explanation: {activeFileName}
                </h3>
              </div>
              <button
                onClick={() => setShowExplainModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-sky-300 block">Architecture &amp; Purpose:</span>
                <p>
                  This file <code className="text-amber-300">{activeFileName}</code> provides the core logic for <strong>{lessonTitle}</strong>.
                  {activeFileName.endsWith(".html") && " It structures the DOM elements, asset hierarchy, and viewport layout."}
                  {activeFileName.endsWith(".css") && " It configures visual rules, responsive layouts, micro-animations, and typography tokens."}
                  {activeFileName.endsWith(".js") && " It hooks up event listeners, interactive DOM manipulation, and console logging."}
                  {activeFileName.endsWith(".jsx") && " It manages React component state, lifecycle hooks, and virtual DOM rendering."}
                  {activeFileName.endsWith(".py") && " It contains clean, idiomatic Python code with step-by-step algorithms and complexity analysis."}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-indigo-300 block">How Learnify AI Watch & Code Works:</span>
                <p>
                  You are inside an interactive recording. Whenever you click or modify the code in the editor, your lecture auto-pauses and creates a personal fork. Test your changes in the live runner on the right, and click <strong className="text-sky-300">↺ BACK TO TEACHER</strong> at any time to resume the teacher walkthrough.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-300 block">Suggested Experiment:</span>
                <p>
                  {activeFileName.endsWith(".py")
                    ? "Try changing the target value in binary_search or adding negative numbers to test edge cases."
                    : activeFileName.endsWith(".jsx")
                    ? "Try adding a step size multiplier or storing max and min count values in React state."
                    : "Try editing colors or modifying values in styles.css to customize the live layout."}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-[11px] text-slate-500">
                Instructor: {instructorName} · Learnify AI Studio 4.2
              </span>
              <Button
                onClick={() => setShowExplainModal(false)}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
