import { useEffect, useRef, useState } from "react";
import type { ArchitectureDiagram } from "./types";
import { cn } from "@/lib/utils";

const NODE_COLORS: Record<string, string> = {
  user: "#8b5cf6",
  service: "#3b82f6",
  database: "#ef4444",
  cache: "#f59e0b",
  queue: "#10b981",
  gateway: "#ec4899",
  cdn: "#06b6d4",
  loadbalancer: "#f97316",
};

const NODE_SHAPES: Record<string, string> = {
  user: "circle",
  database: "cylinder",
  cache: "hexagon",
  queue: "trapezoid",
  cdn: "circle",
};

interface ArchitectureVisualizerProps {
  diagram: ArchitectureDiagram;
  compact?: boolean;
  interactive?: boolean;
}

export function ArchitectureVisualizer({
  diagram,
  compact = false,
  interactive = true,
}: ArchitectureVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [animPhase, setAnimPhase] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const w = compact ? 400 : 600;
  const h = compact ? 250 : 380;
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) * 0.32;

  // Arrange nodes in a circular layout by default
  useEffect(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    const count = diagram.nodes.length;
    diagram.nodes.forEach((node, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      pos[node.id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
    setPositions(pos);
  }, [diagram.nodes]);

  // Animate edges
  useEffect(() => {
    if (!interactive) return;
    const interval = setInterval(() => {
      setAnimPhase((p) => (p + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, [interactive]);

  const getNodeColor = (type: string) => NODE_COLORS[type] || "#6b7280";
  const getNodeShape = (type: string) => NODE_SHAPES[type] || "rect";

  const renderNode = (id: string, label: string, type: string, idx: number) => {
    const p = positions[id];
    if (!p) return null;
    const color = getNodeColor(type);
    const shape = getNodeShape(type);
    const isHovered = hoveredNode === id;
    const r = compact ? 22 : 30;
    const fontSize = compact ? 8 : 10;

    let shapeEl: React.ReactNode;

    if (shape === "circle" || type === "user" || type === "cdn") {
      shapeEl = (
        <circle
          cx={p.x}
          cy={p.y}
          r={r}
          fill={`${color}20`}
          stroke={color}
          strokeWidth={isHovered ? 3 : 1.5}
          className="transition-all duration-300"
        />
      );
    } else if (shape === "cylinder" || type === "database") {
      shapeEl = (
        <>
          <ellipse cx={p.x} cy={p.y - r * 0.6} rx={r} ry={r * 0.35} fill={`${color}20`} stroke={color} strokeWidth={isHovered ? 3 : 1.5} />
          <rect x={p.x - r} y={p.y - r * 0.6} width={r * 2} height={r * 1.2} fill={`${color}10`} stroke={color} strokeWidth={isHovered ? 3 : 1.5} />
          <ellipse cx={p.x} cy={p.y + r * 0.6} rx={r} ry={r * 0.35} fill={`${color}20`} stroke={color} strokeWidth={isHovered ? 3 : 1.5} />
        </>
      );
    } else if (shape === "hexagon" || type === "cache") {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        return `${p.x + r * Math.cos(a)},${p.y + r * Math.sin(a)}`;
      }).join(" ");
      shapeEl = (
        <polygon points={pts} fill={`${color}20`} stroke={color} strokeWidth={isHovered ? 3 : 1.5} className="transition-all duration-300" />
      );
    } else if (shape === "trapezoid" || type === "queue") {
      shapeEl = (
        <polygon
          points={`${p.x - r},${p.y - r * 0.6} ${p.x + r},${p.y - r * 0.6} ${p.x + r * 0.7},${p.y + r * 0.6} ${p.x - r * 0.7},${p.y + r * 0.6}`}
          fill={`${color}20`}
          stroke={color}
          strokeWidth={isHovered ? 3 : 1.5}
          className="transition-all duration-300"
        />
      );
    } else {
      shapeEl = (
        <rect
          x={p.x - r}
          y={p.y - r * 0.5}
          width={r * 2}
          height={r}
          rx={6}
          fill={`${color}20`}
          stroke={color}
          strokeWidth={isHovered ? 3 : 1.5}
          className="transition-all duration-300"
        />
      );
    }

    return (
      <g
        key={id}
        onMouseEnter={() => setHoveredNode(id)}
        onMouseLeave={() => setHoveredNode(null)}
        className="cursor-pointer"
      >
        {shapeEl}
        <text
          x={p.x}
          y={p.y + 3}
          textAnchor="middle"
          fill={isHovered ? color : "#e5e7eb"}
          fontSize={fontSize}
          fontWeight={isHovered ? "bold" : "medium"}
          className="transition-all duration-300 pointer-events-none"
        >
          {label.length > 12 ? label.slice(0, 11) + "…" : label}
        </text>
        {isHovered && (
          <text
            x={p.x}
            y={p.y + r + 14}
            textAnchor="middle"
            fill="#9ca3af"
            fontSize={7}
            className="pointer-events-none"
          >
            {type}
          </text>
        )}
      </g>
    );
  };

  const renderEdge = (from: string, to: string, label?: string, animated?: boolean) => {
    const f = positions[from];
    const t = positions[to];
    if (!f || !t) return null;

    const dx = t.x - f.x;
    const dy = t.y - f.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const r = compact ? 22 : 30;
    const ux = dx / dist;
    const uy = dy / dist;

    const x1 = f.x + ux * r;
    const y1 = f.y + uy * r;
    const x2 = t.x - ux * r;
    const y2 = t.y - uy * r;

    // Calculate midpoint for label
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    return (
      <g key={`${from}-${to}`}>
        {/* Edge line */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={animated ? "#8b5cf6" : "#374151"}
          strokeWidth={animated ? 2 : 1}
          strokeDasharray={animated ? "6 3" : "none"}
          className={animated ? "animate-pulse" : ""}
        />
        {/* Animated dot */}
        {animated && (
          <circle
            cx={x1 + (x2 - x1) * (animPhase / 100)}
            cy={y1 + (y2 - y1) * (animPhase / 100)}
            r={3}
            fill="#a78bfa"
            className="drop-shadow-[0_0_4px_rgba(167,139,250,0.6)]"
          />
        )}
        {/* Arrowhead */}
        <polygon
          points={`${x2},${y2} ${x2 - ux * 8 + uy * 4},${y2 - uy * 8 - ux * 4} ${x2 - ux * 8 - uy * 4},${y2 - uy * 8 + ux * 4}`}
          fill={animated ? "#8b5cf6" : "#374151"}
        />
        {/* Label */}
        {label && (
          <text
            x={mx}
            y={my - 6}
            textAnchor="middle"
            fill="#6b7280"
            fontSize={7}
            className="pointer-events-none"
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black/40 border border-border/50">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        role="img"
        aria-label={diagram.description}
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width={20} height={20} patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2937" strokeWidth={0.5} />
          </pattern>
        </defs>
        <rect width={w} height={h} fill="url(#grid)" />

        {/* Edges */}
        {diagram.edges.map((e) => renderEdge(e.from, e.to, e.label, e.animated))}

        {/* Nodes */}
        {diagram.nodes.map((n, i) => renderNode(n.id, n.label, n.type, i))}

        {/* Description */}
        {!compact && (
          <text
            x={10}
            y={h - 8}
            fill="#6b7280"
            fontSize={8}
            className="pointer-events-none"
          >
            {diagram.description}
          </text>
        )}
      </svg>
    </div>
  );
}
