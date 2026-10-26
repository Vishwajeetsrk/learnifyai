/**
 * Learnify AI — Explainer Knowledge Cache & Asset Memory Engine
 * Provides verified historical facts, architectural diagrams, syntax specifications,
 * and high-accuracy topic references to prevent AI hallucinations and accelerate video generation.
 */

export interface TopicKnowledge {
  id: string;
  topicName: string;
  category: "programming" | "science" | "system-design" | "ai-ml";
  inventorOrOrigin: string;
  yearIntroduced: string;
  officialSpec: string;
  corePrinciples: string[];
  diagramArchitecture: {
    title: string;
    description: string;
    nodes: Array<{ id: string; label: string; role: string; color: string }>;
    connections: Array<{ from: string; to: string; label: string }>;
  };
  codeSyntaxSummary: string;
  commonPitfalls: string[];
  keyTerms: Array<{ term: string; definition: string }>;
}

// ─── Pre-vetted, High-Accuracy Knowledge Base ───────────────────────────────
export const VERIFIED_KNOWLEDGE_BASE: Record<string, TopicKnowledge> = {
  html: {
    id: "html",
    topicName: "HTML (HyperText Markup Language)",
    category: "programming",
    inventorOrOrigin: "Tim Berners-Lee at CERN",
    yearIntroduced: "1991 (HTML 1.0) · 2014 (HTML5 W3C/WHATWG Living Standard)",
    officialSpec: "WHATWG HTML Living Standard (html.spec.whatwg.org)",
    corePrinciples: [
      "Semantic Structure: Tags define meaning, accessibility, and hierarchy, not visual styles.",
      "Document Object Model (DOM): Browsers parse HTML tokens into a hierarchical node tree.",
      "Living Standard: Continuously maintained by WHATWG with cross-browser interoperability.",
      "Progressive Enhancement: Content is readable even if styles and scripts fail to load.",
    ],
    diagramArchitecture: {
      title: "Browser Parsing & The DOM Tree Pipeline",
      description: "How raw HTML bytes transform into pixels on screen.",
      nodes: [
        { id: "n1", label: "Raw Bytes (0110...)", role: "Network transport via HTTP/2 or HTTP/3", color: "#38bdf8" },
        { id: "n2", label: "Characters (UTF-8)", role: "Decoded text stream from wire", color: "#818cf8" },
        { id: "n3", label: "Tokens (<tag>...)", role: "HTML tokenizer state machine", color: "#c084fc" },
        { id: "n4", label: "DOM Tree (Nodes)", role: "Memory representation of hierarchy", color: "#34d399" },
        { id: "n5", label: "Render Tree & Paint", role: "Combined DOM + CSSOM computed pixels", color: "#f59e0b" },
      ],
      connections: [
        { from: "n1", to: "n2", label: "Decode" },
        { from: "n2", to: "n3", label: "Tokenize" },
        { from: "n3", to: "n4", label: "Tree Construction" },
        { from: "n4", to: "n5", label: "Layout & Paint" },
      ],
    },
    codeSyntaxSummary: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Semantic Page</title>
  </head>
  <body>
    <header><nav><!-- Navigation --></nav></header>
    <main><article><h1>Primary Heading</h1></article></main>
    <footer><p>&copy; 2026 Learnify AI</p></footer>
  </body>
</html>`,
    commonPitfalls: [
      "Using multiple <h1> elements instead of a single document root heading.",
      "Using <div> for clickable actions instead of native <button> (ruins keyboard accessibility).",
      "Omitting alt attributes on <img> tags (breaks screen readers).",
      "Missing <meta name='viewport'> tag causing broken mobile scaling.",
    ],
    keyTerms: [
      { term: "Semantic HTML", definition: "Using tags that convey content meaning (<header>, <article>, <main>) rather than generic <div> containers." },
      { term: "DOM", definition: "Document Object Model: an in-memory tree representation of the HTML document accessible via JavaScript." },
      { term: "DOCTYPE", definition: "<!DOCTYPE html> instructs modern browsers to render in standards-compliant mode rather than legacy quirks mode." },
    ],
  },

  java: {
    id: "java",
    topicName: "Java (Object-Oriented Programming & JVM)",
    category: "programming",
    inventorOrOrigin: "James Gosling at Sun Microsystems (now Oracle)",
    yearIntroduced: "1995 (Java 1.0) · Java 21 LTS (2023) · Java 25 (2025)",
    officialSpec: "Java SE Platform Specification (JSR / Oracle OpenJDK)",
    corePrinciples: [
      "Write Once, Run Anywhere (WORA): Java source compiles to bytecode (.class) executed on any JVM.",
      "Object-Oriented: Everything belongs to classes; supports encapsulation, inheritance, and polymorphism.",
      "Automatic Memory Management: Generational Garbage Collector (G1, ZGC) reclaims unreferenced heap memory.",
      "Strong Static Typing: Type safety checked at compile-time with robust exception handling.",
    ],
    diagramArchitecture: {
      title: "Java Compilation & JVM Runtime Architecture",
      description: "From .java source code to native hardware machine instructions.",
      nodes: [
        { id: "j1", label: "Source Code (.java)", role: "Human-readable Java class definition", color: "#f87171" },
        { id: "j2", label: "Bytecode (.class)", role: "Target-independent intermediate bytecode via javac", color: "#fb923c" },
        { id: "j3", label: "Class Loader", role: "Loads bytecode into JVM memory areas", color: "#fbbf24" },
        { id: "j4", label: "JVM Execution Engine", role: "Interpreter + HotSpot JIT (C1/C2) Compiler", color: "#34d399" },
        { id: "j5", label: "Host CPU / Hardware", role: "Native CPU instructions execution (x86/ARM64)", color: "#38bdf8" },
      ],
      connections: [
        { from: "j1", to: "j2", label: "javac" },
        { from: "j2", to: "j3", label: "Load" },
        { from: "j3", to: "j4", label: "JIT Compile" },
        { from: "j4", to: "j5", label: "Execute" },
      ],
    },
    codeSyntaxSummary: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, Learnify AI!");
    var student = new Student("Vishwajeet", 100);
    student.displayGrade();
  }
}

record Student(String name, int score) {
  public void displayGrade() {
    System.out.println(name + " has mastery: " + score + "%");
  }
}`,
    commonPitfalls: [
      "NullPointerException: Attempting to access methods or fields on a null object reference.",
      "Comparing Strings using == instead of .equals() (checks reference identity rather than content).",
      "Memory leaks from unclosed JDBC connections or static collections holding references.",
      "Ignoring concurrency synchronization in multi-threaded environments.",
    ],
    keyTerms: [
      { term: "JVM", definition: "Java Virtual Machine: an abstract computing machine that executes compiled Java bytecode." },
      { term: "JIT Compiler", definition: "Just-In-Time compiler compiles hot bytecode into native machine code at runtime for high performance." },
      { term: "Garbage Collector", definition: "Automatic memory manager that cleans up unreachable heap objects." },
    ],
  },

  python: {
    id: "python",
    topicName: "Python (High-Level Scripting & AI Language)",
    category: "programming",
    inventorOrOrigin: "Guido van Rossum at CWI in the Netherlands",
    yearIntroduced: "1991 (Python 0.9.0) · Python 3.0 (2008) · Python 3.12+ (2024)",
    officialSpec: "Python Enhancement Proposals (PEPs) / Python Software Foundation",
    corePrinciples: [
      "The Zen of Python: Beautiful is better than ugly; readability counts; simple is better than complex.",
      "Dynamic Typing & Duck Typing: Types are bound to values at runtime rather than variable names.",
      "First-Class Functions: Functions can be passed as arguments, returned, and stored in data structures.",
      "Vast AI/Data Ecosystem: Core language of modern AI (PyTorch, TensorFlow, NumPy, Pandas, Scikit-learn).",
    ],
    diagramArchitecture: {
      title: "Python Interpretation & Memory Lifecycle",
      description: "How Python bytecode executes inside CPython virtual machine.",
      nodes: [
        { id: "p1", label: "Script (.py)", role: "Human-readable Python source", color: "#38bdf8" },
        { id: "p2", label: "Bytecode (.pyc)", role: "Compiled __pycache__ bytecode", color: "#818cf8" },
        { id: "p3", label: "CPython VM Loop", role: "Evaluation loop executing opcode stream", color: "#34d399" },
        { id: "p4", label: "GIL (Global Lock)", role: "Thread synchronization in CPython", color: "#f43f5e" },
      ],
      connections: [
        { from: "p1", to: "p2", label: "Compile" },
        { from: "p2", to: "p3", label: "Eval Loop" },
        { from: "p3", to: "p4", label: "Thread Safety" },
      ],
    },
    codeSyntaxSummary: `from dataclasses import dataclass

@dataclass
class TopicExplainer:
    title: str
    difficulty: str = "Beginner"

    def summarize(self) -> str:
        return f"Learning {self.title} with Learnify AI ({self.difficulty})"

explainer = TopicExplainer("Python Data Science")
print(explainer.summarize())`,
    commonPitfalls: [
      "Mutable default arguments in functions (e.g. def append_to(item, target=[])).",
      "Assuming multi-threading accelerates CPU-bound tasks in standard CPython due to the GIL.",
      "Confusing 'is' (identity) with '==' (equality).",
    ],
    keyTerms: [
      { term: "GIL", definition: "Global Interpreter Lock: a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once." },
      { term: "List Comprehension", definition: "Concise syntax for creating lists based on existing iterables: [x*2 for x in nums if x > 0]." },
    ],
  },

  magnetism: {
    id: "magnetism",
    topicName: "Magnetism (Fundamental Force of Electromagnetism)",
    category: "science",
    inventorOrOrigin: "Discovered in antiquity (Lodestone); formalized by James Clerk Maxwell & Michael Faraday",
    yearIntroduced: "1865 (Maxwell's Equations) · 1831 (Faraday's Law of Induction)",
    officialSpec: "Classical Electrodynamics & Quantum Magnetism (Spin/Pauli)",
    corePrinciples: [
      "Dual Poles: Every magnet has North and South poles; monopoles have never been observed in nature.",
      "Attraction and Repulsion: Opposite poles attract; identical poles repel.",
      "Magnetic Field Lines: Continuous closed loops emerging from North and entering South.",
      "Atomic Spin: Ferromagnetism arises from aligned electron spin magnetic dipole moments.",
    ],
    diagramArchitecture: {
      title: "Magnetic Dipole & Field Interaction",
      description: "Closed loops of magnetic flux vector B through space.",
      nodes: [
        { id: "m1", label: "North Pole (+)", role: "Field lines diverge outward", color: "#ef4444" },
        { id: "m2", label: "Magnetic Flux (B)", role: "Closed concentric vector loops", color: "#38bdf8" },
        { id: "m3", label: "South Pole (-)", role: "Field lines converge inward", color: "#3b82f6" },
        { id: "m4", label: "Dipole Moment", role: "Atomic electron spin alignment", color: "#8b5cf6" },
      ],
      connections: [
        { from: "m1", to: "m2", label: "Emanates" },
        { from: "m2", to: "m3", label: "Enters" },
        { from: "m4", to: "m1", label: "Polarizes" },
      ],
    },
    codeSyntaxSummary: `// Classical Lorentz Force Law
// F = q * (E + v x B)
const calculateLorentzForce = (charge: number, velocity: number[], fieldB: number[]) => {
  // Cross product v x B
  const crossX = velocity[1] * fieldB[2] - velocity[2] * fieldB[1];
  const crossY = velocity[2] * fieldB[0] - velocity[0] * fieldB[2];
  const crossZ = velocity[0] * fieldB[1] - velocity[1] * fieldB[0];
  return [charge * crossX, charge * crossY, charge * crossZ];
};`,
    commonPitfalls: [
      "Assuming cutting a magnet in half separates North from South (it creates two smaller magnets, each with N and S).",
      "Confusing magnetic field lines with electrical field lines (magnetic lines never end; they form closed loops).",
    ],
    keyTerms: [
      { term: "Lorentz Force", definition: "The total electromagnetic force exerted on a charged particle moving through an electric and magnetic field." },
      { term: "Ferromagnetism", definition: "The basic mechanism by which certain materials (such as iron) form permanent magnets." },
    ],
  },
};

const LOCAL_STORAGE_KEY = "learnify_ai_knowledge_memory";

/**
 * Retrieve verified topic knowledge from memory cache.
 */
export function getVerifiedTopicKnowledge(topicQuery: string): TopicKnowledge | null {
  const q = topicQuery.toLowerCase().trim();
  for (const [key, val] of Object.entries(VERIFIED_KNOWLEDGE_BASE)) {
    if (q.includes(key) || val.topicName.toLowerCase().includes(q)) {
      return val;
    }
  }

  // Check persistent user/admin cache
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, TopicKnowledge>;
        for (const [key, val] of Object.entries(parsed)) {
          if (q.includes(key) || val.topicName.toLowerCase().includes(q)) {
            return val;
          }
        }
      }
    } catch {
      // Fallback
    }
  }

  return null;
}

/**
 * Save new verified topic knowledge to persistent asset memory for next-time instant use.
 */
export function saveTopicKnowledge(topicKey: string, knowledge: TopicKnowledge): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const existing = stored ? JSON.parse(stored) : {};
    existing[topicKey.toLowerCase()] = knowledge;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error("Failed to save knowledge to cache", e);
  }
}
