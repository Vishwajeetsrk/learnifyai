import React, { useState, useEffect } from "react";
import { Flag, CheckCircle2, XCircle, Trash2, Maximize2, ExternalLink, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getExplainerReports,
  updateReportStatus,
  deleteExplainerReport,
  ExplainerReport,
} from "@/lib/reportsStore";

export default function UserReportsManager() {
  const [reports, setReports] = useState<ExplainerReport[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const refreshReports = () => {
    setReports(getExplainerReports());
  };

  useEffect(() => {
    refreshReports();
    window.addEventListener("learnify_reports_changed", refreshReports);
    return () => window.removeEventListener("learnify_reports_changed", refreshReports);
  }, []);

  const handleStatusChange = (id: string, status: "pending" | "resolved" | "dismissed") => {
    updateReportStatus(id, status);
    toast.success(`Report marked as ${status}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this report?")) {
      deleteExplainerReport(id);
      toast.success("Report deleted");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Flag className="h-5 w-5 text-rose-400" />
            User Feedback &amp; Video Explainer Reports
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Review user-submitted reports with automatic visual player screenshots for content safety &amp; bug triage.
          </p>
        </div>

        <Badge variant="outline" className="text-xs">
          {reports.length} Total Reports
        </Badge>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-2xl bg-card/30">
          <Flag className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="font-semibold text-base text-foreground">No reports logged</h3>
          <p className="text-xs text-muted-foreground mt-1">
            When users click "Report" on the video player, reports with player screenshots appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl border border-border/80 bg-card/60 hover:border-border transition-all flex flex-col lg:flex-row gap-5 items-start justify-between shadow-sm"
            >
              {/* Report Details */}
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant={
                      report.status === "resolved"
                        ? "default"
                        : report.status === "dismissed"
                        ? "outline"
                        : "destructive"
                    }
                    className="text-[10px] capitalize font-mono"
                  >
                    {report.status}
                  </Badge>

                  <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                    {report.reason}
                  </span>

                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> {report.createdAt}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-foreground">
                    Topic: {report.topicTitle} &middot;{" "}
                    <span className="text-sky-400 font-normal">{report.chapterTitle} ({report.videoTimestamp})</span>
                  </h4>
                  {report.comment && (
                    <p className="text-xs text-muted-foreground mt-1 bg-background/50 p-2.5 rounded-lg border border-border/60">
                      &ldquo;{report.comment}&rdquo;
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {report.status !== "resolved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(report.id, "resolved")}
                      className="h-7 text-xs gap-1 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Resolve</span>
                    </Button>
                  )}
                  {report.status !== "dismissed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(report.id, "dismissed")}
                      className="h-7 text-xs gap-1"
                    >
                      <XCircle className="h-3 w-3" />
                      <span>Dismiss</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(report.id)}
                    className="h-7 text-xs text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Attached Visual Screenshot Thumbnail */}
              {report.screenshotUrl && (
                <div className="shrink-0 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase block">
                    Attached Player Screenshot:
                  </span>
                  <div
                    onClick={() => setSelectedScreenshot(report.screenshotUrl!)}
                    className="relative w-48 h-28 rounded-xl overflow-hidden border border-border bg-black group cursor-pointer shadow-md hover:border-sky-500/50 transition-all"
                    title="Click to view full screenshot"
                  >
                    <img
                      src={report.screenshotUrl}
                      alt="Player screenshot at report time"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                      <div className="p-1.5 rounded-md bg-black/60 text-white">
                        <Maximize2 className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Full Resolution Screenshot Modal */}
      <Dialog open={Boolean(selectedScreenshot)} onOpenChange={() => setSelectedScreenshot(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black border-slate-800">
          <DialogHeader className="p-2">
            <DialogTitle className="text-sm font-mono text-slate-300 flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-sky-400" />
              Captured Frame at Time of Report
            </DialogTitle>
          </DialogHeader>
          {selectedScreenshot && (
            <div className="relative rounded-lg overflow-hidden border border-white/10 max-h-[75vh] flex items-center justify-center">
              <img
                src={selectedScreenshot}
                alt="Full resolution player capture"
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
