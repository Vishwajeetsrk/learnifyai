import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { TrendingUp, TrendingDown, Sparkles, Loader2 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getDemandForecast } from "@/lib/forecast.functions";

const workloadColor: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Moderate: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  High: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Surging: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export function DemandForecastWidget() {
  const fn = useServerFn(getDemandForecast);
  const q = useQuery({
    queryKey: ["admin", "demand-forecast"],
    queryFn: () => fn(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> AI forecast
          </div>
          <h3 className="font-display font-semibold text-lg mt-1">Course demand · next 7 days</h3>
        </div>
        {q.data && (
          <div className="text-right">
            <div className="font-display text-3xl font-semibold leading-none">
              {q.data.next7Forecast}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              vs last 7d: <span className="font-medium text-foreground">{q.data.totalLast7}</span>{" "}
              {q.data.next7Forecast >= q.data.totalLast7 ? (
                <TrendingUp className="inline h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="inline h-3 w-3 text-rose-500" />
              )}
            </div>
          </div>
        )}
      </div>

      {q.isLoading ? (
        <div className="py-12 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : q.isError ? (
        <p className="text-sm text-destructive mt-4">Couldn't load forecast.</p>
      ) : q.data ? (
        <>
          <p className="text-sm text-muted-foreground mt-3">{q.data.insight}</p>

          <div className="h-32 mt-4 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={q.data.series}>
                <defs>
                  <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  hide
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "var(--muted-foreground)" }}
                />
                <Area
                  type="monotone"
                  dataKey="enrollments"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#demandFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
              By category
            </div>
            <ul className="space-y-1.5">
              {q.data.byCategory.map((c) => (
                <li key={c.category} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 truncate">{c.category}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    7d {c.last7} · ~{c.next7Forecast}
                  </span>
                  <Badge variant="secondary" className={`text-[10px] ${workloadColor[c.workload]}`}>
                    {c.workload}
                  </Badge>
                </li>
              ))}
              {q.data.byCategory.length === 0 && (
                <li className="text-xs text-muted-foreground">No enrollment data yet.</li>
              )}
            </ul>
          </div>
        </>
      ) : null}
    </Card>
  );
}
