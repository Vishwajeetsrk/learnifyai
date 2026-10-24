import { useState } from "react";
import { BarChart3, TrendingUp, Maximize2, Minimize2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartArtifact {
  title: string;
  type?: "bar" | "line" | "comparison";
  data: Array<Record<string, any>>;
  xKey?: string;
  yKeys?: string[];
  colors?: string[];
}

const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

export function InteractiveChartCard({ chart }: { chart: ChartArtifact }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const data = chart.data || [];
  if (data.length === 0) return null;

  const firstItem = data[0];
  const keys = Object.keys(firstItem);
  const xKey = chart.xKey || keys.find((k) => typeof firstItem[k] === "string") || keys[0];
  const yKeys =
    chart.yKeys ||
    keys.filter((k) => k !== xKey && typeof firstItem[k] === "number");

  const colors = chart.colors || DEFAULT_COLORS;

  return (
    <div
      className={cn(
        "my-4 rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card/80 to-card/50 p-4 sm:p-5 shadow-sm transition-all",
        isExpanded &&
          "fixed inset-4 z-50 overflow-y-auto bg-background/95 backdrop-blur-md p-6 max-w-4xl mx-auto shadow-2xl border-primary/40",
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Visual Data & Performance Analysis
            </span>
            <h4 className="text-sm font-semibold text-foreground">{chart.title}</h4>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          aria-label={isExpanded ? "Minimize chart" : "Expand chart"}
        >
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === "line" ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              {yKeys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[idx % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              {yKeys.map((key, idx) => (
                <Bar key={key} dataKey={key} radius={[4, 4, 0, 0]} fill={colors[idx % colors.length]}>
                  {data.map((_, entryIdx) => (
                    <Cell
                      key={`cell-${entryIdx}`}
                      fill={colors[(idx + entryIdx) % colors.length]}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
