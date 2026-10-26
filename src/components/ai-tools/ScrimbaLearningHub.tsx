import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tv,
  Code2,
  Maximize2,
  Compass,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Layers,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExplainerVideoPlayer, ExplainerTopicData } from "./ExplainerVideoPlayer";
import { EXPLAINER_TOPIC_PRESETS } from "./explainerTopics";
import { ScrimbaWorkspace } from "@/components/courses/ScrimbaWorkspace";

export type LearningHubMode = "watch" | "scrimba_split" | "ide_only";

interface ScrimbaLearningHubProps {
  initialTopicId?: string;
  defaultMode?: LearningHubMode;
}

export function ScrimbaLearningHub({
  initialTopicId = "magnetism",
  defaultMode = "watch",
}: ScrimbaLearningHubProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId);
  const [hubMode, setHubMode] = useState<LearningHubMode>(defaultMode);

  const topic: ExplainerTopicData =
    EXPLAINER_TOPIC_PRESETS[selectedTopicId] || EXPLAINER_TOPIC_PRESETS.magnetism;

  // Topic-specific starter code for the Scrimba IDE
  const getTopicCode = (topicId: string) => {
    switch (topicId) {
      case "deeplearning":
        return {
          lang: "python",
          code: `# ==============================================================================
# DEEP LEARNING: MULTI-LAYER PERCEPTRON (MLP) & BACKPROPAGATION
# Forward activation: a = GELU(W·x + b) | Loss: Binary Cross-Entropy
# ==============================================================================
import math

class Neuron:
    def __init__(self, weights, bias):
        self.weights = weights
        self.bias = bias

    @staticmethod
    def gelu(x):
        # Gaussian Error Linear Unit approximation
        return 0.5 * x * (1.0 + math.tanh(math.sqrt(2.0 / math.pi) * (x + 0.044715 * math.pow(x, 3))))

    def forward(self, inputs):
        z = sum(w * x for w, x in zip(self.weights, inputs)) + self.bias
        return self.gelu(z)

# Test 3 input features with dense hidden layer
inputs = [0.85, -0.42, 1.20]
hidden_neurons = [
    Neuron([0.2, 0.4, -0.1], 0.05),
    Neuron([-0.5, 0.3, 0.8], -0.1),
    Neuron([0.1, -0.9, 0.4], 0.2),
    Neuron([0.6, 0.2, 0.5], 0.0)
]

hidden_activations = [n.forward(inputs) for n in hidden_neurons]
print("=== DEEP LEARNING FORWARD PASS ===")
print("Input Features:", inputs)
print("Hidden Layer Activations (GELU):", [round(a, 4) for a in hidden_activations])

# Output layer projection
output_weights = [0.45, -0.32, 0.88, 0.12]
raw_logit = sum(w * a for w, a in zip(output_weights, hidden_activations))
probability = 1.0 / (1.0 + math.exp(-raw_logit)) # Sigmoid

print(f"Output Prediction: {probability:.4f} (Class A probability)")
print("Backward Gradient: Computed via Chain Rule (dLoss/dW)")
`,
        };

      case "earth":
        return {
          lang: "python",
          code: `# ==============================================================================
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
        # Ocean absorbs ~25% of annual carbon emissions
        ocean_uptake = anthropogenic_emissions_gt * 0.25
        self.ocean_carbon_sink_gt += ocean_uptake

        # Biosphere photosynthesis absorbs ~30%
        biosphere_uptake = anthropogenic_emissions_gt * 0.30
        self.biosphere_biomass_gt += biosphere_uptake * 0.01

        # Remaining stays in atmospheric gaseous envelope
        atmospheric_addition_gt = anthropogenic_emissions_gt - ocean_uptake - biosphere_uptake
        ppm_increase = atmospheric_addition_gt / 7.82 # 1 ppm CO2 ≈ 7.82 Gt CO2
        self.atmosphere_co2_ppm += ppm_increase

        # Radiative forcing feedback
        self.temperature_anomaly_c += ppm_increase * 0.012

    def report(self):
        print("=== EARTH SYSTEM BALANCE SIMULATION ===")
        print(f"Atmospheric CO2:      {self.atmosphere_co2_ppm:.2f} ppm")
        print(f"Ocean Carbon Sink:    {self.ocean_carbon_sink_gt:.1f} Gt")
        print(f"Global Temp Anomaly:  +{self.temperature_anomaly_c:.3f} °C")

earth = EarthSystem()
for year in range(5):
    earth.simulate_year()
earth.report()
`,
        };

      case "magnetism":
      default:
        return {
          lang: "python",
          code: `# ==============================================================================
# MAGNETISM & MAGNETIC FORCE SIMULATION (Biot-Savart & Dipole Law)
# Demonstrating: Opposites Attract, Likes Repel, Always Two Poles
# ==============================================================================
import math

class MagneticPole:
    def __init__(self, pole_type, strength=1.0, position=(0.0, 0.0)):
        assert pole_type in ("N", "S"), "Pole must be North or South"
        self.pole_type = pole_type
        # Sign: North = +1, South = -1
        self.sign = 1.0 if pole_type == "N" else -1.0
        self.strength = strength
        self.position = position

def calculate_magnetic_force(pole1, pole2):
    dx = pole2.position[0] - pole1.position[0]
    dy = pole2.position[1] - pole1.position[1]
    distance = math.sqrt(dx*dx + dy*dy)
    if distance < 0.001:
        return 0.0, "Contact"

    # Inverse-square law: F = (mu_0 / 4pi) * (m1 * m2) / r^2
    mu_0_over_4pi = 1e-7
    magnitude = mu_0_over_4pi * (pole1.strength * pole2.strength) / (distance ** 2)

    # If same sign (N-N or S-S), force is repulsive (+); if opposite, attractive (-)
    interaction = "Attract (Opposites)" if (pole1.sign * pole2.sign < 0) else "Repel (Likes)"
    return magnitude, interaction

# Example: North pole at origin, South pole at (0, 0.05) meters
pole_A = MagneticPole("N", strength=10.0, position=(0.0, 0.0))
pole_B = MagneticPole("S", strength=10.0, position=(0.0, 0.05))

force, interaction = calculate_magnetic_force(pole_A, pole_B)
print("=== MAGNETISM FORCE TEST ===")
print(f"Pole A: {pole_A.pole_type} at {pole_A.position}")
print(f"Pole B: {pole_B.pole_type} at {pole_B.position}")
print(f"Interaction: {interaction}")
print(f"Force Magnitude: {force * 1e6:.4f} micro-Newtons")
`,
        };
    }
  };

  const codeData = getTopicCode(selectedTopicId);

  return (
    <div className="space-y-6">
      {/* ─── Top Studio Controller Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
        {/* Topic Selector Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1 font-mono">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Topic:
          </span>
          {Object.values(EXPLAINER_TOPIC_PRESETS).map((t) => {
            const isSelected = selectedTopicId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTopicId(t.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/40 hover:bg-muted border-border/60 text-muted-foreground hover:text-foreground"
                )}
              >
                <span>{t.emoji}</span>
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* 3 Workstation Learning Modes */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => {
              setHubMode("watch");
              toast.info("Watch Mode: Immersive Explainer Theater");
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
              hubMode === "watch"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Tv className="h-3.5 w-3.5 text-sky-400" />
            <span>Watch (Explainer)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setHubMode("scrimba_split");
              toast.success("Learnify AI: Live Watch & Code dual workspace active!");
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
              hubMode === "scrimba_split"
                ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
            <span>Watch &amp; Code (Learnify AI Split)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setHubMode("ide_only");
              toast.info("Full IDE Mode: Maximized code sandbox");
            }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer",
              hubMode === "ide_only"
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Full IDE</span>
          </button>
        </div>
      </div>

      {/* ─── Mode 1: Watch (Explainer Theater) ─── */}
      {hubMode === "watch" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-sky-500/30 text-sky-400 bg-sky-500/10 text-xs font-mono">
                Explainer Theater Mode
              </Badge>
              <span className="text-xs text-muted-foreground">
                Hover over the progress bar to see chapter previews. Click &quot;GO DEEPER&quot; to code.
              </span>
            </div>

            <Button
              size="sm"
              onClick={() => setHubMode("scrimba_split")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 cursor-pointer shadow-md"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Switch to Watch &amp; Code</span>
            </Button>
          </div>

          <ExplainerVideoPlayer
            topic={topic}
            onGoDeeper={() => {
              setHubMode("scrimba_split");
              toast.success("Diving deeper! Learnify AI Watch & Code workspace activated.");
            }}
            onSwitchToWatchAndCode={() => setHubMode("scrimba_split")}
            isSplitMode={false}
          />
        </motion.div>
      )}

      {/* ─── Mode 2: Watch & Code (Scrimba Split Dual Workspace) ─── */}
      {hubMode === "scrimba_split" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-display font-bold text-base text-foreground">
                Live Dual-Pane Workspace · Watch on Left &amp; Code on Right
              </h3>
              <Badge variant="outline" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-mono">
                Hot-Reload Active
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setHubMode("watch")}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Tv className="h-3.5 w-3.5 text-sky-400" />
              <span>Back to Theater Mode</span>
            </Button>
          </div>

          {/* Side-by-side Dual Split Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Left Pane: Explainer Video Player */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
                <span>[Pane 1] Video Explainer &amp; Diagrams</span>
                <span className="text-sky-400">Audio Synth Ready</span>
              </div>
              <ExplainerVideoPlayer
                topic={topic}
                onGoDeeper={() => {
                  toast.info("Already in deep learning code mode! Edit the code on the right.");
                }}
                onSwitchToWatchAndCode={() => setHubMode("watch")}
                isSplitMode={true}
              />
            </div>

            {/* Right Pane: Interactive Scrimba IDE & Live Sandbox Runner */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
                <span>[Pane 2] Monaco Code Editor &amp; Cloud Sandbox</span>
                <span className="text-emerald-400">Interactive Runtime</span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-[#0e111a] overflow-hidden shadow-2xl">
                <ScrimbaWorkspace
                  courseTitle={topic.category}
                  lessonTitle={`${topic.title} Lab`}
                  instructorName={topic.author.name}
                  injectedCode={codeData.code}
                  injectedLang={codeData.lang}
                  isStandAlonePlayer={true}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Mode 3: Full IDE Mode ─── */}
      {hubMode === "ide_only" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs font-mono">
                Full IDE Workstation
              </Badge>
              <span className="text-xs text-muted-foreground">
                Maximized multi-file editor with terminal runner and dynamic file tree.
              </span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setHubMode("scrimba_split")}
              className="text-xs gap-1.5 cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Back to Watch &amp; Code</span>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0e111a] overflow-hidden shadow-2xl">
            <ScrimbaWorkspace
              courseTitle={topic.category}
              lessonTitle={`${topic.title} Full IDE`}
              instructorName={topic.author.name}
              injectedCode={codeData.code}
              injectedLang={codeData.lang}
              isStandAlonePlayer={true}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
