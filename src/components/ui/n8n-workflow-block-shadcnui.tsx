"use client";

import { motion, type PanInfo } from "framer-motion";
import type React from "react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Database,
  Mail,
  Plus,
  RotateCcw,
  Settings,
  Webhook,
  Zap,
  Cpu,
  Layers,
  ShieldCheck,
  Bot,
} from "lucide-react";

// Interfaces
export interface WorkflowNode {
  id: string;
  type: "trigger" | "action" | "condition";
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  from: string;
  to: string;
}

// Constants
const NODE_WIDTH = 220;
const NODE_HEIGHT = 110;

export const nodeTemplates: Omit<WorkflowNode, "id" | "position">[] = [
  {
    type: "trigger",
    title: "React 19 + TanStack",
    description: "Streaming SSR & Client Hydration",
    icon: Layers,
    color: "blue",
  },
  {
    type: "action",
    title: "Edge Server Functions",
    description: "Auth Guard, Rate Limits & Invoicing",
    icon: ShieldCheck,
    color: "emerald",
  },
  {
    type: "action",
    title: "Supabase pgvector",
    description: "768-dim RAG embeddings & Realtime",
    icon: Database,
    color: "indigo",
  },
  {
    type: "condition",
    title: "Autonomous Agent Graph",
    description: "Planner, Sandbox & Output Evaluator",
    icon: Bot,
    color: "purple",
  },
  {
    type: "action",
    title: "Payment Gateway",
    description: "Atomic Cashfree & Razorpay Webhooks",
    icon: Zap,
    color: "amber",
  },
];

export const learnifyArchitectureNodes: WorkflowNode[] = [
  {
    id: "node-1",
    type: "trigger",
    title: "React 19 + TanStack Start",
    description: "Streaming SSR, Zero-layout shift UI",
    icon: Layers,
    color: "blue",
    position: { x: 40, y: 120 },
  },
  {
    id: "node-2",
    type: "action",
    title: "Edge Server Functions",
    description: "Zod Schema Validation & Auth Firewall",
    icon: ShieldCheck,
    color: "emerald",
    position: { x: 310, y: 120 },
  },
  {
    id: "node-3",
    type: "action",
    title: "Supabase pgvector Store",
    description: "HNSW cosine vector index & Realtime Sync",
    icon: Database,
    color: "indigo",
    position: { x: 580, y: 50 },
  },
  {
    id: "node-4",
    type: "condition",
    title: "Autonomous Agent Graph",
    description: "Multi-step planner, code exec & evals",
    icon: Bot,
    color: "purple",
    position: { x: 580, y: 200 },
  },
];

export const learnifyArchitectureConnections: WorkflowConnection[] = [
  { from: "node-1", to: "node-2" },
  { from: "node-2", to: "node-3" },
  { from: "node-2", to: "node-4" },
];

const colorClasses: Record<string, string> = {
  emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400",
  blue: "border-blue-400/40 bg-blue-400/10 text-blue-400",
  amber: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  purple: "border-purple-400/40 bg-purple-400/10 text-purple-400",
  indigo: "border-indigo-400/40 bg-indigo-400/10 text-indigo-400",
};

// Connection Line Component
function WorkflowConnectionLine({
  from,
  to,
  nodes,
}: {
  from: string;
  to: string;
  nodes: WorkflowNode[];
}) {
  const fromNode = nodes.find((n) => n.id === from);
  const toNode = nodes.find((n) => n.id === to);
  if (!fromNode || !toNode) return null;

  const startX = fromNode.position.x + NODE_WIDTH;
  const startY = fromNode.position.y + NODE_HEIGHT / 2;
  const endX = toNode.position.x;
  const endY = toNode.position.y + NODE_HEIGHT / 2;

  const cp1X = startX + (endX - startX) * 0.5;
  const cp2X = endX - (endX - startX) * 0.5;

  const path = `M${startX},${startY} C${cp1X},${startY} ${cp2X},${endY} ${endX},${endY}`;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        opacity={0.15}
        className="text-primary"
      />
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="6,6"
        strokeLinecap="round"
        opacity={0.65}
        className="text-primary"
      />
    </g>
  );
}

// Main Component
export function N8nWorkflowBlock({
  initialDataNodes = learnifyArchitectureNodes,
  initialDataConnections = learnifyArchitectureConnections,
  title = "2026 Production Architecture Graph",
}: {
  initialDataNodes?: WorkflowNode[];
  initialDataConnections?: WorkflowConnection[];
  title?: string;
}) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialDataNodes);
  const [connections, setConnections] = useState<WorkflowConnection[]>(initialDataConnections);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPosition = useRef<{ x: number; y: number } | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [contentSize, setContentSize] = useState(() => {
    const maxX = Math.max(...initialDataNodes.map((n) => n.position.x + NODE_WIDTH), 850);
    const maxY = Math.max(...initialDataNodes.map((n) => n.position.y + NODE_HEIGHT), 400);
    return { width: maxX + 100, height: maxY + 100 };
  });

  // Drag Handlers
  const handleDragStart = (nodeId: string) => {
    setDraggingNodeId(nodeId);
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      dragStartPosition.current = { x: node.position.x, y: node.position.y };
    }
  };

  const handleDrag = (nodeId: string, { offset }: PanInfo) => {
    if (draggingNodeId !== nodeId || !dragStartPosition.current) return;

    const newX = dragStartPosition.current.x + offset.x;
    const newY = dragStartPosition.current.y + offset.y;

    const constrainedX = Math.max(10, newX);
    const constrainedY = Math.max(10, newY);

    flushSync(() => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, position: { x: constrainedX, y: constrainedY } }
            : node
        )
      );
    });

    setContentSize((prev) => ({
      width: Math.max(prev.width, constrainedX + NODE_WIDTH + 80),
      height: Math.max(prev.height, constrainedY + NODE_HEIGHT + 80),
    }));
  };

  const handleDragEnd = () => {
    setDraggingNodeId(null);
    dragStartPosition.current = null;
  };

  // Add Node Handler
  const addNode = () => {
    const template = nodeTemplates[Math.floor(Math.random() * nodeTemplates.length)];
    const lastNode = nodes[nodes.length - 1];
    const newPosition = lastNode
      ? { x: lastNode.position.x + 240, y: lastNode.position.y + (Math.random() > 0.5 ? 40 : -40) }
      : { x: 50, y: 100 };

    const newNode: WorkflowNode = {
      id: `node-${Date.now()}`,
      ...template,
      position: newPosition,
    };

    flushSync(() => {
      setNodes((prev) => [...prev, newNode]);
      if (lastNode) {
        setConnections((prev) => [...prev, { from: lastNode.id, to: newNode.id }]);
      }
    });

    setContentSize((prev) => ({
      width: Math.max(prev.width, newPosition.x + NODE_WIDTH + 80),
      height: Math.max(prev.height, newPosition.y + NODE_HEIGHT + 80),
    }));

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.scrollTo({
        left: newPosition.x + NODE_WIDTH - canvas.clientWidth + 100,
        behavior: "smooth",
      });
    }
  };

  const resetGraph = () => {
    setNodes(initialDataNodes);
    setConnections(initialDataConnections);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md p-4 sm:p-6 shadow-xl my-8 not-prose">
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="rounded-full border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
          >
            Live Blueprint
          </Badge>
          <span className="text-xs sm:text-sm font-display font-bold uppercase tracking-[0.15em] text-foreground/80">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetGraph}
            className="h-8 gap-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground"
            title="Reset to default architecture"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={addNode}
            className="h-8 gap-2 rounded-lg text-xs border-primary/30 text-primary hover:bg-primary/10 font-medium"
            aria-label="Add new node"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Add Node</span>
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative h-[360px] w-full overflow-auto rounded-xl border border-border/40 bg-slate-950/60 sm:h-[420px] md:h-[460px] cursor-grab active:cursor-grabbing"
        role="region"
        aria-label="Interactive architecture workflow canvas"
        tabIndex={0}
      >
        {/* Subtle grid background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Content Wrapper */}
        <div
          className="relative min-w-full"
          style={{
            minWidth: contentSize.width,
            minHeight: contentSize.height,
          }}
        >
          {/* SVG Connections */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={contentSize.width}
            height={contentSize.height}
            style={{ overflow: "visible" }}
            aria-hidden="true"
          >
            {connections.map((c) => (
              <WorkflowConnectionLine
                key={`${c.from}-${c.to}`}
                from={c.from}
                to={c.to}
                nodes={nodes}
              />
            ))}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const Icon = node.icon;
            const isDragging = draggingNodeId === node.id;

            return (
              <motion.div
                key={node.id}
                drag
                dragMomentum={false}
                dragConstraints={{
                  left: 0,
                  top: 0,
                  right: 100000,
                  bottom: 100000,
                }}
                onDragStart={() => handleDragStart(node.id)}
                onDrag={(_, info) => handleDrag(node.id, info)}
                onDragEnd={handleDragEnd}
                style={{
                  x: node.position.x,
                  y: node.position.y,
                  width: NODE_WIDTH,
                  transformOrigin: "0 0",
                }}
                className="absolute cursor-grab select-none"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
                whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
                aria-grabbed={isDragging}
              >
                <Card
                  className={`group/node relative w-full overflow-hidden rounded-xl border ${colorClasses[node.color]} bg-card/90 p-3.5 backdrop-blur-md transition-all hover:shadow-xl ${isDragging ? "shadow-2xl ring-2 ring-primary/60" : ""}`}
                  role="article"
                  aria-label={`${node.type} node: ${node.title}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/node:opacity-100" />

                  <div className="relative space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${colorClasses[node.color]} bg-background/80 shadow-sm`}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Badge
                          variant="outline"
                          className="mb-0.5 rounded-full border-border/40 bg-background/80 px-1.5 py-0 text-[8px] uppercase tracking-[0.15em] text-foreground/70"
                        >
                          {node.type}
                        </Badge>
                        <h4 className="truncate text-xs font-bold tracking-tight text-foreground">
                          {node.title}
                        </h4>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-foreground/80">
                      {node.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] text-foreground/50 pt-1 border-t border-border/30">
                      <ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                      <span className="uppercase tracking-[0.15em] font-medium">
                        Active Channel
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div
        className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/40 px-4 py-2 backdrop-blur-sm"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/70 font-mono">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>{nodes.length} Nodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{connections.length} Pipelines</span>
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Interactive: Drag nodes to explore architecture
        </p>
      </div>
    </div>
  );
}

export default N8nWorkflowBlock;
