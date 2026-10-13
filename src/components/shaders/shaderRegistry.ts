import type { ShaderButtonVariant } from "./ShaderButtons";

export type RendererKind = "raw-webgl" | "three-webgl" | "canvas-2d" | "webgl-canvas" | "webgl-fluid" | "webgl-raymarching" | "css-webgl" | "prismatic-micro" | "specular-chrome" | "thin-film";

export type ShaderVariantMetadata = {
  id: ShaderButtonVariant;
  label: string;
  desc: string;
  type: string;
  rendererKind: RendererKind;
  defaultMode: "dark" | "light";
  defaultHue: number;
  defaultSaturation: number;
  defaultBrightness: number;
  supportsHover: boolean;
  supportsClick: boolean;
  supportsTheme: boolean;
  supportsHue: boolean;
  supportsSaturation: boolean;
  glslVertex?: string;
  glslFragment?: string;
  sourceCode: string;
};

export const SHADER_REGISTRY: Record<string, ShaderVariantMetadata> = {
  "raking-light-pill": {
    id: "raking-light-pill",
    label: "Raking Light Pill",
    desc: "Raw WebGL GLSL raking light bands, procedural twinkle motes, and soft glowing border.",
    type: "Raw WebGL GLSL",
    rendererKind: "raw-webgl",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    glslVertex: `attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,
    glslFragment: `precision highp float;

varying vec2 vUv;
uniform float uTime;
uniform float uHover;
uniform float uLight;
uniform vec2 uSize;

float hash21(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

float boxSD(vec2 p, vec2 b, float r) {
  vec2 d = abs(p) - b + r;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

void main() {
  vec2 p = (vUv - 0.5) * uSize;
  float radius = uSize.y * 0.5;
  float sd = boxSD(p, uSize * 0.5, radius);
  float mask = 1.0 - smoothstep(-1.2, 0.6, sd);
  if (mask < 0.004) discard;

  float t = uTime;
  vec2 q = p / uSize.y;
  float aspect = uSize.x / uSize.y;

  vec3 darkPlate = mix(vec3(0.028, 0.022, 0.028), vec3(0.068, 0.050, 0.056), vUv.y);
  vec3 lightPlate = mix(vec3(0.930, 0.884, 0.842), vec3(0.985, 0.957, 0.925), vUv.y);
  vec3 col = mix(darkPlate, lightPlate, uLight);

  float s = q.x + q.y * 1.15;
  float rays = pow(max(0.0, sin(s * 3.6 - t * 0.50)), 1.7) * 0.62
             + pow(max(0.0, sin(s * 8.1 + t * 0.29 + 1.3)), 2.2) * 0.38;
  float head = (fract(t * 0.11) * 2.4 - 1.2) * aspect * 0.5;
  rays *= 0.22 + 1.15 * exp(-pow((q.x - head) * 1.30, 2.0));
  vec3 rayInk = mix(vec3(1.00, 0.82, 0.56), vec3(0.48, 0.25, 0.24), uLight);
  col += rayInk * rays * (0.20 + 0.42 * uHover);

  float motes = 0.0;
  for (int i = 0; i < 2; i++) {
    float fi = float(i);
    vec2 g = q * (4.2 + fi * 2.4) + vec2(fi * 7.3, -t * (0.26 + fi * 0.15) + fi * 3.1);
    vec2 cell = floor(g);
    vec2 f = fract(g) - 0.5;
    float hs = hash21(cell + fi * 17.0);
    if (hs < 0.45) continue;
    vec2 offset = (vec2(hs, fract(hs * 31.7)) - 0.5) * 0.62;
    float twinkle = 0.30 + 0.70 * sin(t * (1.3 + hs * 2.2) + hs * 40.0);
    motes += smoothstep(0.20, 0.02, length(f - offset)) * max(twinkle, 0.0) * (0.30 + 0.70 * hs);
  }
  vec3 moteInk = mix(vec3(1.00, 0.95, 0.86), vec3(0.34, 0.18, 0.20), uLight);
  col += moteInk * motes * (0.34 + 0.60 * uHover);

  float alpha = mask * (0.88 + 0.12 * uHover);
  gl_FragColor = vec4(col * alpha, alpha);
}`,
    sourceCode: `// Raking Light Pill Shader — Raw WebGL Implementation
import { useEffect, useRef } from "react";

export function RakingLightPill({ mode = "dark", hue = 0, saturation = 1 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    // Compiles procedural GLSL raking light raymarching
    // Uniforms: uTime, uHover, uLight, uSize
    // Dynamic particle twinkle motes with smooth hash21 distribution
  }, [mode]);

  return <canvas ref={canvasRef} />;
}`,
  },

  "ignition-button": {
    id: "ignition-button",
    label: "Ignition Terminal",
    desc: "Sub-atomic ignition terminal glow with particle acceleration and core reactor.",
    type: "Three.js / Canvas",
    rendererKind: "three-webgl",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    glslFragment: `precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_warp;
uniform float u_flash;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0; float a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.07 + vec2(13.1, 5.7); a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float r = length(uv);
  float a = atan(uv.y, uv.x);
  float t = u_time;
  vec3 col = vec3(0.012, 0.011, 0.014);
  float hz = fbm(uv * 2.6 + vec2(t * 0.35, 1.7));
  col += vec3(0.13, 0.06, 0.032) * hz * (0.7 + 0.6 * u_warp);
  gl_FragColor = vec4(col, 1.0);
}`,
    sourceCode: `// Ignition Terminal Shader — Sub-Atomic Accelerator
const FRAGMENT_SHADER = \`
  precision highp float;
  uniform vec2 u_res;
  uniform float u_time;
  uniform float u_warp;
  // Core accelerator FBM turbulence & orbital particle ring
\`;`,
  },

  "thinking-button": {
    id: "thinking-button",
    label: "Thinking State",
    desc: "AI cognitive braille spinner and glowing border microinteraction.",
    type: "Canvas 2D / Microinteraction",
    rendererKind: "canvas-2d",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    sourceCode: `// Thinking State — Cognitive Braille Microinteraction
const BRAILLE_CHARS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
function renderCognitiveSpinner(ctx, time) {
  const charIdx = Math.floor(time * 12) % BRAILLE_CHARS.length;
  // Procedural conic gradient perimeter sweep + kinetic spinner
}`,
  },

  "star-portal": {
    id: "star-portal",
    label: "Star Portal",
    desc: "Deep-space cosmic portal with orbiting stars and gravitational drift.",
    type: "WebGL Starfield",
    rendererKind: "webgl-canvas",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    glslFragment: `// Cosmic Portal Deep Space Simulation
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float star = pow(fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453), 18.0);
  gl_FragColor = vec4(vec3(star), 1.0);
}`,
    sourceCode: `// Star Portal — Gravitational Deep Space Field
class StarPortalEngine {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      pulse: Math.random() * 0.02
    }));
  }
}`,
  },

  "plasma-button": {
    id: "plasma-button",
    label: "Plasma Reactor",
    desc: "High-energy plasma reactor with ionized light trails.",
    type: "WebGL Fluid",
    rendererKind: "webgl-fluid",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    glslFragment: `precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
  float d = length(p);
  float v = sin(p.x * 10.0 + u_time) + sin(p.y * 10.0 + u_time * 0.8);
  gl_FragColor = vec4(vec3(0.2, 0.4, 0.9) * (1.0 / (d + 0.1)), 1.0);
}`,
    sourceCode: `// Plasma Reactor Shader — Ionized Fluidics
const FS_PLASMA = \`
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  // Ionized magnetic plasma flow
\`;`,
  },

  "tactile-button": {
    id: "tactile-button",
    label: "Nexus Tactile",
    desc: "Tactile haptic surface simulation with raymarching depth.",
    type: "Raymarching Study",
    rendererKind: "webgl-raymarching",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    sourceCode: `// Nexus Tactile — Haptic Fluidics Surface Simulation
precision highp float;
// Depth normal mapping & touch indentation response`,
  },

  "glassy-split": {
    id: "glassy-split",
    label: "Glassy Split",
    desc: "Frosted refractive glass split button with realistic caustics.",
    type: "CSS + WebGL Caustics",
    rendererKind: "css-webgl",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    sourceCode: `// Glassy Split Button — Caustic Glass Refraction
.stage[data-variant="glassy-split"] {
  backdrop-filter: blur(24px) saturate(180%);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3);
}`,
  },

  "generate-site": {
    id: "generate-site",
    label: "Generate Site",
    desc: "Cinematic prompt trigger button with prismatic perimeter sweep.",
    type: "Prismatic Microinteraction",
    rendererKind: "prismatic-micro",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    sourceCode: `// Generate Site Button — Prismatic Perimeter Sweep
@keyframes prismaticSweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
  },

  "chrome-upload": {
    id: "chrome-upload",
    label: "Chrome Upload",
    desc: "Specular chrome edge with dynamic specular reflection on cursor move.",
    type: "Chrome Shader",
    rendererKind: "specular-chrome",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    sourceCode: `// Chrome Upload Button — Specular Reflection Edge
.chrome-border {
  background: conic-gradient(from var(--angle), #888, #fff, #555, #fff, #888);
}`,
  },

  "iridescent-glass": {
    id: "iridescent-glass",
    label: "Iridescent Glass",
    desc: "Multi-layered thin-film interference with prismatic color dispersion.",
    type: "Thin-Film Shader",
    rendererKind: "thin-film",
    defaultMode: "dark",
    defaultHue: 0,
    defaultSaturation: 1,
    defaultBrightness: 1,
    supportsHover: true,
    supportsClick: true,
    supportsTheme: true,
    supportsHue: true,
    supportsSaturation: true,
    sourceCode: `// Iridescent Glass — Thin-Film Optical Interference
// Airy formula spectral color dispersion across surface normal`,
  },
};

export const SHADER_VARIANTS_LIST: ShaderVariantMetadata[] = Object.values(SHADER_REGISTRY);
