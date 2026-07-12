import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck, ShieldAlert, RefreshCw, Download, Calendar } from "lucide-react";
import { Verification } from "./types";

type Props = {
  verifications: Verification[];
  onRefresh: () => void;
};

export function VerificationLog({ verifications, onRefresh }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "invalid">("all");

  const stats = useMemo(
    () => ({
      total: verifications.length,
      verified: verifications.filter((v) => v.status === "verified").length,
      invalid: verifications.filter((v) => v.status === "invalid" || v.status === "expired").length,
      thisMonth: verifications.filter((v) => {
        const d = new Date(v.verifiedAt);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
    }),
    [verifications],
  );

  const filtered = useMemo(() => {
    return verifications.filter((v) => {
      const matchSearch =
        !search ||
        v.recipientName.toLowerCase().includes(search.toLowerCase()) ||
        v.code.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || v.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [verifications, search, statusFilter]);

  const exportLog = () => {
    const csv = [
      "Date,Code,Recipient,Course,Status,IP",
      ...filtered.map(
        (v) =>
          `${new Date(v.verifiedAt).toLocaleString()},${v.code},${v.recipientName},${v.courseTitle},${v.status},${v.ip || "N/A"}`,
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `verification-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-blue-700">Total Verifications</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.verified}</div>
            <div className="text-xs text-emerald-700">Verified</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.invalid}</div>
            <div className="text-xs text-red-700">Invalid / Expired</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{stats.thisMonth}</div>
            <div className="text-xs text-amber-700">This Month</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Verification Log</CardTitle>
              <CardDescription>Track all certificate verification attempts</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportLog}>
                <Download className="h-4 w-4 mr-1" /> Export
              </Button>
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
              </Button>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-1">
              {(["all", "verified", "invalid"] as const).map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className="capitalize"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No verification records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(v.verifiedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                          {v.code}
                        </code>
                      </TableCell>
                      <TableCell className="font-medium text-sm">{v.recipientName}</TableCell>
                      <TableCell className="text-sm">{v.courseTitle}</TableCell>
                      <TableCell>
                        <Badge variant={v.status === "verified" ? "default" : "destructive"}>
                          {v.status === "verified" ? (
                            <ShieldCheck className="h-3 w-3 mr-1" />
                          ) : (
                            <ShieldAlert className="h-3 w-3 mr-1" />
                          )}
                          {v.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {v.ip || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
