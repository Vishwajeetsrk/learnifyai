import { useEffect, useRef, useState, useCallback } from "react";
import { X, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KNOWLEDGE_GRAPH, getTopic } from "./content";

interface KnowledgeGraphProps {
  onTopicClick: (topicId: string) => void;
  onClose?: () => void;
  compact?: boolean;
}

interface SimNode {
  id: string;
  label: string;
  group: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface SimLink {
  source: number;
  target: number;
  label: string;
}

export function KnowledgeGraph({ onTopicClick, onClose, compact = false }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [links, setLinks] = useState<SimLink[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const animRef = useRef<number>();

  const w = compact ? 500 : 700;
  const h = compact ? 350 : 500;

  useEffect(() => {
    const initialNodes: SimNode[] = KNOWLEDGE_GRAPH.nodes.map((n, i) => ({
      ...n,
      x: w / 2 + (Math.random() - 0.5) * w * 0.5,
      y: h / 2 + (Math.random() - 0.5) * h * 0.5,
      vx: 0,
      vy: 0,
    }));

    const idMap = new Map(KNOWLEDGE_GRAPH.nodes.map((n, i) => [n.id, i]));
    const initialLinks: SimLink[] = KNOWLEDGE_GRAPH.links
      .filter((l) => idMap.has(l.source) && idMap.has(l.target))
      .map((l) => ({
        source: idMap.get(l.source)!,
        target: idMap.get(l.target)!,
        label: l.label,
      }));

    setNodes(initialNodes);
    setLinks(initialLinks);
  }, []);

  // Force simulation
  useEffect(() => {
    if (nodes.length === 0) return;
    let running = true;

    const simulate = () => {
      if (!running) return;
      setNodes((prev) => {
        const next = prev.map((n) => ({ ...n }));

        // Repulsion between all nodes
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const dx = next[j].x - next[i].x;
            const dy = next[j].y - next[i].y;
            const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
            const force = 5000 / (dist * dist);
            next[i].vx -= (dx / dist) * force;
            next[i].vy -= (dy / dist) * force;
            next[j].vx += (dx / dist) * force;
            next[j].vy += (dy / dist) * force;
          }
        }

        // Attraction along links
        for (const link of links) {
          const s = next[link.source];
          const t = next[link.target];
          if (!s || !t) continue;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = (dist - 120) * 0.01;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
          t.vx -= (dx / dist) * force;
          t.vy -= (dy / dist) * force;
        }

        // Center gravity
        for (const n of next) {
          n.vx += (w / 2 - n.x) * 0.001;
          n.vy += (h / 2 - n.y) * 0.001;
        }

        // Apply velocity with damping
        for (const n of next) {
          n.vx *= 0.85;
          n.vy *= 0.85;
          n.x += n.vx;
          n.y += n.vy;
          n.x = Math.max(30, Math.min(w - 30, n.x));
          n.y = Math.max(30, Math.min(h - 30, n.y));
        }

        return next;
      });

      animRef.current = requestAnimationFrame(simulate);
    };

    animRef.current = requestAnimationFrame(simulate);
    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [nodes.length, links.length]);

  const handleNodeClick = (topicId: string) => {
    setSelectedNode(topicId === selectedNode ? null : topicId);
    onTopicClick(topicId);
  };

  const groupColors: Record<string, string> = {
    infrastructure: "#3b82f6",
    performance: "#10b981",
    data: "#ef4444",
    architecture: "#ec4899",
    algorithms: "#f59e0b",
    security: "#8b5cf6",
    theory: "#06b6d4",
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black/60 border border-border/50">
      {/* Controls */}
      {!compact && (
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom((z) => Math.min(2, z + 0.2))} aria-label="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} aria-label="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose} aria-label="Close graph">
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto"
        style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
        role="img"
        aria-label="System Design Knowledge Graph — interactive concept map showing relationships between topics"
      >
        {/* Links */}
        {links.map((link, i) => {
          const s = nodes[link.source];
          const t = nodes[link.target];
          if (!s || !t) return null;
          const mx = (s.x + t.x) / 2;
          const my = (s.y + t.y) / 2;
          return (
            <g key={`link-${i}`}>
              <line
                x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={selectedNode === nodes[link.source]?.id || selectedNode === nodes[link.target]?.id ? "#6366f1" : "#374151"}
                strokeWidth={selectedNode ? 1 : 0.5}
                className="transition-colors duration-300"
              />
              <text x={mx} y={my - 4} textAnchor="middle" fill="#6b7280" fontSize={6} className="pointer-events-none">
                {link.label}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const color = groupColors[node.group] || "#6b7280";
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode === node.id;
          const r = isSelected ? 28 : isHovered ? 24 : 20;

          return (
            <g
              key={`node-${node.id}`}
              onClick={() => handleNodeClick(node.id)}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill={`${color}${isSelected ? "40" : "20"}`}
                stroke={isSelected ? color : isHovered ? `${color}80` : "#374151"}
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                className="transition-all duration-300"
              />
              <text
                x={node.x}
                y={node.y + 3}
                textAnchor="middle"
                fill={isSelected ? color : "#e5e7eb"}
                fontSize={isSelected ? 8 : 7}
                fontWeight={isSelected ? "bold" : "normal"}
                className="pointer-events-none transition-all duration-300"
              >
                {node.label.length > 10 ? node.label.slice(0, 9) + "…" : node.label}
              </text>
              {isHovered && !compact && (
                <text
                  x={node.x}
                  y={node.y + r + 12}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize={6}
                  className="pointer-events-none"
                >
                  Click to learn
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
