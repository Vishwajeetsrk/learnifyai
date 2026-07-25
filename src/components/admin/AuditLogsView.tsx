import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldAlert,
  Search,
  Loader2,
  Filter,
  RefreshCw,
  Clock,
  User,
  Activity,
  Calendar,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { queryAuditLogs, getAuditSummary } from "@/lib/admin-audit.functions";

const ACTION_LABELS: Record<string, string> = {
  user_update: "User Updated",
  role_change: "Role Changed",
  payout_approved: "Payout Approved",
  payout_rejected: "Payout Rejected",
  refund_processed: "Refund Processed",
  invoice_created: "Invoice Created",
  coupon_created: "Coupon Created",
  coupon_deleted: "Coupon Deleted",
  content_update: "Content Updated",
  content_delete: "Content Deleted",
  cert_template_save: "Cert Template Saved",
  announcement_sent: "Announcement Sent",
  user_disabled: "User Disabled",
  user_deleted: "User Deleted",
};

const ACTION_COLORS: Record<string, string> = {
  user_update: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  role_change: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  payout_approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  refund_processed: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  content_delete: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export function AuditLogsView() {
  const summaryFn = useServerFn(getAuditSummary);
  const logsFn = useServerFn(queryAuditLogs);

  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [searchActor, setSearchActor] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["admin-audit-summary"],
    queryFn: () => summaryFn({}),
    refetchInterval: 30000,
  });

  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ["admin-audit-logs", filterAction, filterEntity, searchActor, page],
    queryFn: () =>
      logsFn({
        data: {
          limit: pageSize,
          offset: page * pageSize,
          action: filterAction || undefined,
          entityType: filterEntity || undefined,
          actorId: searchActor || undefined,
        },
      }),
  });

  const logs = logsData?.logs ?? [];
  const total = logsData?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Audit Logs</h3>
          <p className="text-xs text-muted-foreground">
            Track all admin actions for compliance & security
          </p>
        </div>
      </div>

      {summaryLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 rounded-xl border animate-pulse">
              <div className="h-4 bg-muted rounded w-12 mb-2" />
              <div className="h-6 bg-muted rounded w-20" />
            </Card>
          ))}
        </div>
      ) : (
        summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Activity className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Total Events
                </span>
              </div>
              <p className="text-2xl font-bold">{summary.totalLogs.toLocaleString()}</p>
            </Card>
            <Card className="p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Today</span>
              </div>
              <p className="text-2xl font-bold">{summary.todayCount}</p>
            </Card>
            <Card className="p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Last Activity
                </span>
              </div>
              <p className="text-sm font-bold">
                {summary.lastActivity ? format(new Date(summary.lastActivity), "h:mm a") : "N/A"}
              </p>
            </Card>
            <Card className="p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <User className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Top Action</span>
              </div>
              <p className="text-sm font-bold">{summary.topActions?.[0]?.action || "N/A"}</p>
            </Card>
          </div>
        )
      )}

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by actor ID..."
            value={searchActor}
            onChange={(e) => {
              setSearchActor(e.target.value);
              setPage(0);
            }}
            className="h-9 text-sm flex-1"
          />
        </div>
        <Select
          value={filterAction}
          onValueChange={(v) => {
            setFilterAction(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="h-9 w-[160px] text-xs">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {Object.entries(ACTION_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterEntity}
          onValueChange={(v) => {
            setFilterEntity(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="h-9 w-[160px] text-xs">
            <SelectValue placeholder="All Entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="payout">Payout</SelectItem>
            <SelectItem value="invoice">Invoice</SelectItem>
            <SelectItem value="certificate">Certificate</SelectItem>
            <SelectItem value="coupon">Coupon</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => {
            setFilterAction("");
            setFilterEntity("");
            setSearchActor("");
            setPage(0);
          }}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reset
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1"
          onClick={() => {
            const header = ["Time", "Actor ID", "Actor Email", "Action", "Entity Type", "Entity ID", "Details"];
            const rows = logs.map((l: any) => [
              format(new Date(l.created_at), "yyyy-MM-dd HH:mm:ss"),
              l.actor_id || "",
              l.actor_email || l.actor?.email || "",
              l.action || "",
              l.entity_type || "",
              l.entity_id || "",
              l.changes ? JSON.stringify(l.changes).replace(/"/g, '""') : ""
            ]);
            const csvContent = [header.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `audit_logs_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      {logsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl text-muted-foreground">
          <ShieldAlert className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">No audit logs found</p>
          <p className="text-xs mt-1">Admin actions will appear here once logged.</p>
        </div>
      ) : (
        <>
          <div className="border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left p-3 font-bold uppercase tracking-widest text-muted-foreground">
                      Time
                    </th>
                    <th className="text-left p-3 font-bold uppercase tracking-widest text-muted-foreground">
                      Actor
                    </th>
                    <th className="text-left p-3 font-bold uppercase tracking-widest text-muted-foreground">
                      Action
                    </th>
                    <th className="text-left p-3 font-bold uppercase tracking-widest text-muted-foreground">
                      Entity
                    </th>
                    <th className="text-left p-3 font-bold uppercase tracking-widest text-muted-foreground">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log: any) => (
                    <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 whitespace-nowrap font-mono text-[10px]">
                        {format(new Date(log.created_at), "MMM d, h:mm a")}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.actor?.full_name || "Unknown"}</span>
                          {log.actor_email && (
                            <span className="text-muted-foreground">({log.actor_email})</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${ACTION_COLORS[log.action] || ""}`}
                        >
                          {ACTION_LABELS[log.action] || log.action}
                        </Badge>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {log.entity_type}
                          {log.entity_id ? `#${log.entity_id.slice(0, 8)}` : ""}
                        </span>
                      </td>
                      <td className="p-3">
                        {log.changes &&
                          typeof log.changes === "object" &&
                          Object.keys(log.changes).length > 0 && (
                            <span className="text-muted-foreground">
                              {Object.keys(log.changes).slice(0, 2).join(", ")}
                              {Object.keys(log.changes).length > 2 ? "..." : ""}
                            </span>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, total)} of {total}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 text-xs"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
