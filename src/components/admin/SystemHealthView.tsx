import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  Server,
  Database,
  Globe,
  HardDrive,
  Cpu,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSystemHealth, getQueueStatus } from "@/lib/system-health.functions";

function StatusBadge({ status }: { status: string }) {
  if (status === "healthy")
    return (
      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px]">
        <CheckCircle2 className="h-3 w-3 mr-1" /> Healthy
      </Badge>
    );
  if (status === "error" || status === "unreachable")
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800 text-[10px]">
        <XCircle className="h-3 w-3 mr-1" /> Error
      </Badge>
    );
  if (status === "not_configured")
    return (
      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-[10px]">
        <AlertTriangle className="h-3 w-3 mr-1" /> Not Configured
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-[10px]">
      <AlertTriangle className="h-3 w-3 mr-1" /> {status}
    </Badge>
  );
}

const SERVICE_CONFIG = [
  { key: "supabase", label: "Supabase DB", icon: Database, color: "text-emerald-600" },
  { key: "database", label: "DB Connection Pool", icon: Server, color: "text-blue-600" },
  { key: "auth", label: "Auth Provider", icon: Cpu, color: "text-violet-600" },
  { key: "storage", label: "File Storage", icon: HardDrive, color: "text-amber-600" },
  { key: "Groq", label: "Groq AI", icon: Globe, color: "text-orange-600" },
  { key: "Gemini", label: "Gemini AI", icon: Globe, color: "text-blue-600" },
  { key: "OpenRouter", label: "OpenRouter AI", icon: Globe, color: "text-purple-600" },
  { key: "cron", label: "Scheduled Tasks", icon: Clock, color: "text-rose-600" },
];

export function SystemHealthView() {
  const healthFn = useServerFn(getSystemHealth);
  const queueFn = useServerFn(getQueueStatus);

  const {
    data: health,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["system-health"],
    queryFn: () => healthFn({}),
    refetchInterval: 60000,
  });

  const { data: queue } = useQuery({
    queryKey: ["system-queue"],
    queryFn: () => queueFn({}),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const allHealthy =
    health &&
    SERVICE_CONFIG.every(
      (s) =>
        health[s.key]?.status === "healthy" ||
        health[s.key]?.status === "not_configured" ||
        health[s.key]?.status === "unavailable",
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl border ${allHealthy ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"}`}
          >
            <Activity
              className={`h-5 w-5 ${allHealthy ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">System Health</h3>
            <p className="text-xs text-muted-foreground">
              {allHealthy ? "All systems operational" : "Some services need attention"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="h-9">
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {SERVICE_CONFIG.map((svc) => {
          const svcHealth = health?.[svc.key];
          const Icon = svc.icon;
          return (
            <Card key={svc.key} className="p-4 rounded-xl border shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${svc.color}`} />
                  <span className="text-xs font-bold">{svc.label}</span>
                </div>
                <StatusBadge status={svcHealth?.status || "unknown"} />
              </div>
              {svcHealth?.latency !== undefined && svcHealth.latency !== null && (
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{svcHealth.latency}ms latency</span>
                </div>
              )}
              {svcHealth?.note && (
                <p className="text-[10px] text-muted-foreground">{svcHealth.note}</p>
              )}
              {svcHealth?.activeConnections !== undefined && (
                <div className="flex gap-3 text-[10px] text-muted-foreground">
                  <span>Active: {svcHealth.activeConnections}</span>
                  <span>Idle: {svcHealth.idleConnections}</span>
                </div>
              )}
              {svcHealth?.error && (
                <p className="text-[10px] text-red-500 truncate" title={svcHealth.error}>
                  {svcHealth.error}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {queue && (
        <Card className="p-4 rounded-xl border shadow-sm">
          <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-primary" /> Queue Status
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Pending Emails
              </p>
              <p
                className={`text-lg font-bold mt-1 ${queue.pendingEmails > 100 ? "text-amber-600" : "text-foreground"}`}
              >
                {queue.pendingEmails}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Failed (24h)
              </p>
              <p
                className={`text-lg font-bold mt-1 ${queue.failedEmails24h > 0 ? "text-red-600" : "text-emerald-600"}`}
              >
                {queue.failedEmails24h}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
