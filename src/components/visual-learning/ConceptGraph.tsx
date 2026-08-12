import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  MarkerType,
  type Node,
  type Edge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Loader2,
  Brain,
  RotateCcw,
  Crosshair,
  ClipboardList,
  Lightbulb,
  BookOpen,
  Rocket,
  Pin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConceptGraphProps {
  nodes: any[];
  edges: any[];
  loading?: boolean;
  regenerating?: boolean;
  error?: string | null;
  onRegenerate?: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  core: "#8b5cf6",
  prerequisite: "#3b82f6",
  example: "#10b981",
  definition: "#f59e0b",
  application: "#ec4899",
};

const ICON_SIZE = "h-4 w-4";
const TYPE_ICONS: Record<string, React.ReactNode> = {
  core: <Crosshair className={ICON_SIZE} />,
  prerequisite: <ClipboardList className={ICON_SIZE} />,
  example: <Lightbulb className={ICON_SIZE} />,
  definition: <BookOpen className={ICON_SIZE} />,
  application: <Rocket className={ICON_SIZE} />,
};

function ConceptNode({ data }: { data: any }) {
  const color = TYPE_COLORS[data.type] || "#6b7280";
  return (
    <div
      className="px-4 py-3 rounded-xl border-2 shadow-lg backdrop-blur-sm"
      style={{
        borderColor: color,
        background: `${color}15`,
        minWidth: 140,
        maxWidth: 220,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-primary">
          {TYPE_ICONS[data.type] || <Pin className={ICON_SIZE} />}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
          {data.type}
        </span>
      </div>
      <div className="text-sm font-bold text-foreground">{data.label}</div>
      {data.description && (
        <div className="text-[10px] text-muted-foreground mt-1 leading-tight">
          {data.description}
        </div>
      )}
      <div className="flex gap-0.5 mt-1.5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: i < (data.difficulty || 1) ? color : "#374151" }}
          />
        ))}
      </div>
    </div>
  );
}

const nodeTypes: NodeTypes = { conceptNode: ConceptNode };

export function ConceptGraph({
  nodes: rawNodes,
  edges: rawEdges,
  loading,
  regenerating,
  error,
  onRegenerate,
}: ConceptGraphProps) {
  const initialNodes: Node[] = useMemo(
    () =>
      rawNodes.map((n: any, i: number) => ({
        id: n.id,
        type: "conceptNode",
        position: {
          x: 150 + (i % 3) * 220,
          y: 80 + Math.floor(i / 3) * 180,
        },
        data: {
          label: n.label,
          type: n.type,
          description: n.description,
          difficulty: n.difficulty,
        },
      })),
    [rawNodes],
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      rawEdges.map((e: any, i: number) => ({
        id: `e-${i}`,
        source: e.from,
        target: e.to,
        label: e.label,
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 1.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#6366f1" },
        labelStyle: { fontSize: 10, fontWeight: 600 },
      })),
    [rawEdges],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Generating concept map...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
        <Brain className="h-10 w-10 opacity-30" />
        <span className="text-sm max-w-md text-center">{error}</span>
        {onRegenerate && (
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={regenerating}>
            {regenerating && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (!rawNodes.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
        <Brain className="h-10 w-10 opacity-30" />
        <span className="text-sm">No concept map generated yet</span>
        {onRegenerate && (
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={regenerating}>
            {regenerating && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
            Generate Concept Map
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-border overflow-hidden bg-card/30">
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm">
          {rawNodes.length} concepts &middot; {rawEdges.length} relationships
        </span>
      </div>
      {onRegenerate && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={onRegenerate}
            disabled={regenerating}
            title={regenerating ? "Regenerating..." : "Regenerate"}
          >
            <RotateCcw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>
      )}
      <div style={{ height: 400 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls className="!bg-card !border-border !rounded-lg" />
          <Background color="#374151" gap={20} size={1} />
          <MiniMap
            className="!border-border !rounded-lg"
            nodeColor="#6366f1"
            maskColor="rgba(0,0,0,0.3)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
