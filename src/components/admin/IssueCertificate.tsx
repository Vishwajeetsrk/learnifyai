import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  History,
  Send,
  Download,
  RefreshCw,
} from "lucide-react";
import { CertificateRender, type CertDesign } from "@/components/CertificateDesign";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { adminEmailCertificate, retryPendingCertificateEmails } from "@/lib/cert.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type TemplateRow = CertDesign & { id: string; name: string; is_default: boolean };

const PLACEHOLDER_FIELDS: Record<
  string,
  { label: string; check: (s: Record<string, any>) => boolean }
> = {
  name: { label: "Recipient name", check: (s) => !!(s.recipientName || s.foundFullName) },
  course: { label: "Course", check: (s) => !!s.courseTitle },
  date: { label: "Date (To)", check: (s) => !!s.dateTo },
  role: { label: "Role title", check: (s) => !!s.roleTitle },
  from: { label: "From date", check: (s) => !!s.dateFrom },
  to: { label: "To date", check: (s) => !!s.dateTo },
};

function extractPlaceholders(...sources: string[]): string[] {
  const found = new Set<string>();
  const re = /\{([a-zA-Z_]+)\}/g;
  for (const src of sources) {
    if (!src) continue;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src)) !== null) found.add(m[1]);
  }
  return Array.from(found);
}

/** Stable idempotency key: same certificate + recipient within a 60s window dedupes. */
function makeIdemKey(certificateId: string, recipient: string, salt = ""): string {
  const bucket = Math.floor(Date.now() / 60_000);
  const safe = recipient.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
  return `cert:${certificateId}:${safe}:${bucket}${salt ? `:${salt}` : ""}`;
}

function csvEscape(v: unknown): string {
  if (v == null) return "";
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(filename: string, rows: Array<Record<string, unknown>>, columns: string[]) {
  const header = columns.join(",");
  const body = rows.map((r) => columns.map((c) => csvEscape(r[c])).join(",")).join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function IssueCertificate() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const sendEmail = useServerFn(adminEmailCertificate);
  const retryPending = useServerFn(retryPendingCertificateEmails);

  // form state
  const [email, setEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [courseId, setCourseId] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [score, setScore] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [autoEmail, setAutoEmail] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const inFlightRef = useRef<Set<string>>(new Set());

  // CSV filters
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterIssuer, setFilterIssuer] = useState("");
  const [filterLearner, setFilterLearner] = useState("");

  const userQuery = useQuery({
    enabled: !!searchedEmail,
    queryKey: ["admin-find-user", searchedEmail],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .ilike("email", searchedEmail)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["admin-cert-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificate_templates")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return (data ?? []) as TemplateRow[];
    },
    staleTime: 5 * 60_000,
  });

  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses-min"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, instructor, category")
        .order("title");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60_000,
  });

  const auditLog = useQuery({
    queryKey: ["admin-cert-audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificate_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30_000,
  });

  const certIds = useMemo(
    () => (auditLog.data ?? []).map((r: any) => r.certificate_id),
    [auditLog.data],
  );

  // Poll the email log faster while any row is still pending.
  const emailLog = useQuery({
    enabled: certIds.length > 0,
    queryKey: ["admin-cert-email-log", certIds.join(",")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificate_email_log")
        .select("*")
        .in("certificate_id", certIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: (q) => {
      const rows = (q.state.data ?? []) as any[];
      const hasPending = rows.some((r) => r.status === "pending");
      return hasPending ? 5_000 : false;
    },
  });

  const emailStatusByCert = useMemo(() => {
    const m = new Map<string, any>();
    for (const r of (emailLog.data ?? []) as any[]) {
      if (!m.has(r.certificate_id)) m.set(r.certificate_id, r);
    }
    return m;
  }, [emailLog.data]);

  // Background retry loop: every 30s, ask server to retry any due rows.
  useEffect(() => {
    const tick = async () => {
      try {
        const res = await retryPending();
        if (res.retried > 0) {
          qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
        }
      } catch {
        /* silent */
      }
    };
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [retryPending, qc]);

  useEffect(() => {
    if (templates.length && !templateId) {
      const def = templates.find((t) => t.is_default) ?? templates[0];
      setTemplateId(def.id);
    }
  }, [templates, templateId]);

  useEffect(() => {
    if (userQuery.data?.full_name && !recipientName) setRecipientName(userQuery.data.full_name);
  }, [userQuery.data, recipientName]);

  const template = templates.find((t) => t.id === templateId);
  const selectedCourse = courses.find((c: any) => c.id === courseId);

  const usedPlaceholders = useMemo(
    () =>
      template
        ? extractPlaceholders(template.body_template, template.title_text, template.subtitle)
        : [],
    [template],
  );
  const validationState = {
    recipientName,
    foundFullName: userQuery.data?.full_name,
    courseTitle: selectedCourse?.title,
    roleTitle,
    dateFrom,
    dateTo,
  };
  const placeholderStatus = usedPlaceholders.map((token) => {
    const def = PLACEHOLDER_FIELDS[token];
    const filled = def ? def.check(validationState) : true;
    return { token, label: def?.label ?? token, filled };
  });
  const missingFields = placeholderStatus.filter((p) => !p.filled);

  const previewCtx = useMemo(
    () => ({
      name: recipientName || userQuery.data?.full_name || "Recipient name",
      course: selectedCourse?.title ?? "Custom Achievement",
      date:
        dateTo ||
        new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      role: roleTitle,
      from: dateFrom,
      to: dateTo,
      instructor: (selectedCourse as any)?.instructor,
      code: "LRN-PREVIEW",
      score: score ? Number(score) : null,
      total: total ? Number(total) : null,
      qrDataUrl: "",
    }),
    [
      recipientName,
      userQuery.data?.full_name,
      selectedCourse,
      dateTo,
      roleTitle,
      dateFrom,
      score,
      total,
    ],
  );

  const issue = async () => {
    if (!userQuery.data?.id) return toast.error("Find a user by email first");
    if (!template) return toast.error("Pick a template");
    if (missingFields.length > 0) {
      const ok = window.confirm(
        `Some placeholders won't render — missing: ${missingFields.map((f) => f.label).join(", ")}.\n\nIssue anyway?`,
      );
      if (!ok) return;
    }
    setIssuing(true);
    const code = `LRN-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const snapshot: CertDesign = {
      title_text: template.title_text,
      subtitle: template.subtitle,
      body_template: template.body_template,
      signatory_name: template.signatory_name,
      signatory_title: template.signatory_title,
      accent_color: template.accent_color,
      bg_color: template.bg_color,
      text_color: template.text_color,
      font_family: template.font_family,
      logo_url: template.logo_url,
      signature_url: template.signature_url,
      stamp_url: template.stamp_url,
    };
    const resolvedCourseId = courseId || courses[0]?.id;
    const resolvedCourse = courses.find((c: any) => c.id === resolvedCourseId);

    const { data: existing } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", userQuery.data.id)
      .eq("course_id", resolvedCourseId)
      .maybeSingle();

    let certId: string;

    if (existing) {
      const { error: updErr } = await supabase
        .from("certificates")
        .update({
          code,
          template_id: template.id,
          design_snapshot: snapshot,
          recipient_name: recipientName || userQuery.data.full_name || userQuery.data.email,
          role_title: roleTitle || null,
          date_from: dateFrom || null,
          date_to: dateTo || null,
          notes: notes || null,
          score: score ? Number(score) : 0,
          total: total ? Number(total) : 0,
          issued_by: user?.id ?? null,
          issued_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (updErr) {
        setIssuing(false);
        return toast.error(updErr.message);
      }
      certId = existing.id;
      toast.success(`Certificate re-issued · ${code}`);
    } else {
      const payload: any = {
        code,
        user_id: userQuery.data.id,
        course_id: resolvedCourseId,
        template_id: template.id,
        design_snapshot: snapshot,
        recipient_name: recipientName || userQuery.data.full_name || userQuery.data.email,
        role_title: roleTitle || null,
        date_from: dateFrom || null,
        date_to: dateTo || null,
        notes: notes || null,
        score: score ? Number(score) : 0,
        total: total ? Number(total) : 0,
        issued_by: user?.id ?? null,
      };
      const { data: inserted, error } = await supabase
        .from("certificates")
        .insert(payload)
        .select("id")
        .single();
      if (error) {
        setIssuing(false);
        return toast.error(error.message);
      }
      certId = inserted.id;
      toast.success(`Certificate issued · ${code}`);
    }

    await supabase.from("certificate_audit_log").insert({
      certificate_id: certId,
      action: existing ? "re-issued" : "issued",
      issued_by: user?.id ?? null,
      recipient_user_id: userQuery.data.id,
      recipient_email: userQuery.data.email,
      recipient_name: recipientName || userQuery.data.full_name || userQuery.data.email,
      template_id: template.id,
      template_name: template.name,
      course_id: resolvedCourseId ?? null,
      course_title: resolvedCourse?.title ?? null,
      score: score ? Number(score) : 0,
      total: total ? Number(total) : 0,
      code,
      metadata: { role_title: roleTitle || null, notes: notes || null },
    });

    if (autoEmail && userQuery.data.email) {
      const idem = `cert:${certId}:auto`;
      try {
        await sendEmail({
          data: { certificateId: certId, to: userQuery.data.email, idempotencyKey: idem },
        });
        toast.success("Email sent to learner");
      } catch (e: any) {
        toast.error(`Email failed: ${e?.message ?? "unknown"} — will retry automatically.`);
      }
    }

    setIssuing(false);
    qc.invalidateQueries({ queryKey: ["certificates-list"] });
    qc.invalidateQueries({ queryKey: ["admin-cert-audit"] });
    qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
    setEmail("");
    setSearchedEmail("");
    setRecipientName("");
    setRoleTitle("");
    setDateFrom("");
    setDateTo("");
    setScore("");
    setTotal("");
    setNotes("");
  };

  const resend = useCallback(
    async (certificateId: string, to?: string) => {
      if (!to) return toast.error("No recipient email on file");
      const idem = makeIdemKey(certificateId, to);
      // In-flight guard against rapid double clicks on the same button.
      if (inFlightRef.current.has(idem)) return;
      inFlightRef.current.add(idem);
      setResendingId(certificateId);
      try {
        const res = await sendEmail({ data: { certificateId, to, idempotencyKey: idem } });
        toast.success((res as any)?.deduped ? "Already sent (deduped)" : "Email resent");
        qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
      } catch (e: any) {
        toast.error(`Resend failed: ${e?.message ?? "unknown"}`);
        qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
      } finally {
        inFlightRef.current.delete(idem);
        setResendingId(null);
      }
    },
    [sendEmail, qc],
  );

  const manualRetry = async () => {
    try {
      const res = await retryPending();
      toast.success(
        `Retry sweep: ${res.succeeded} sent, ${res.failed} failed (${res.retried} attempted)`,
      );
      qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
    } catch (e: any) {
      toast.error(`Retry failed: ${e?.message ?? "unknown"}`);
    }
  };

  // Filtered audit rows for the table + CSV export
  const filteredAudit = useMemo(() => {
    const rows = (auditLog.data ?? []) as any[];
    const fromTs = filterFrom ? new Date(filterFrom).getTime() : null;
    const toTs = filterTo ? new Date(filterTo).getTime() + 86_400_000 : null;
    const issuer = filterIssuer.trim().toLowerCase();
    const learner = filterLearner.trim().toLowerCase();
    return rows.filter((r) => {
      const t = new Date(r.created_at).getTime();
      if (fromTs && t < fromTs) return false;
      if (toTs && t > toTs) return false;
      if (issuer && !(r.issued_by ?? "").toLowerCase().includes(issuer)) return false;
      if (learner) {
        const blob = `${r.recipient_email ?? ""} ${r.recipient_name ?? ""}`.toLowerCase();
        if (!blob.includes(learner)) return false;
      }
      return true;
    });
  }, [auditLog.data, filterFrom, filterTo, filterIssuer, filterLearner]);

  const exportCsv = () => {
    const rows = filteredAudit.map((r: any) => {
      const email = emailStatusByCert.get(r.certificate_id);
      return {
        issued_at: r.created_at,
        code: r.code,
        recipient_name: r.recipient_name,
        recipient_email: r.recipient_email,
        template: r.template_name,
        course: r.course_title,
        score: r.score,
        total: r.total,
        issued_by: r.issued_by,
        email_status: email?.status ?? "not sent",
        email_attempts: email?.attempt ?? 0,
        email_error: email?.error ?? "",
        provider_message_id: email?.provider_message_id ?? "",
      };
    });
    downloadCsv(`certificate-audit-${new Date().toISOString().slice(0, 10)}.csv`, rows, [
      "issued_at",
      "code",
      "recipient_name",
      "recipient_email",
      "template",
      "course",
      "score",
      "total",
      "issued_by",
      "email_status",
      "email_attempts",
      "email_error",
      "provider_message_id",
    ]);
  };

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <div className="space-y-3">
          <div>
            <Label>Find user by email</Label>
            <div className="flex gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="learner@email.com"
                type="email"
              />
              <Button type="button" onClick={() => setSearchedEmail(email.trim())}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {userQuery.data && (
              <p className="text-xs text-emerald-600 mt-1">
                Found: {userQuery.data.full_name ?? userQuery.data.email}
              </p>
            )}
            {searchedEmail && !userQuery.isLoading && !userQuery.data && (
              <p className="text-xs text-destructive mt-1">No user with that email.</p>
            )}
          </div>

          <div>
            <Label>Template</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Course (optional)</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">— Choose a course —</option>
              {courses.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Recipient name (override)</Label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ada Lovelace"
              />
            </div>
            <div>
              <Label>Role title</Label>
              <Input
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Lead Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div>
              <Label>To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Score</Label>
              <Input type="number" value={score} onChange={(e) => setScore(e.target.value)} />
            </div>
            <div>
              <Label>Total</Label>
              <Input type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Notes (internal)</Label>
            <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Switch checked={autoEmail} onCheckedChange={setAutoEmail} id="autoEmail" />
            <Label htmlFor="autoEmail" className="cursor-pointer">
              Email certificate to learner immediately
            </Label>
          </div>

          <Button onClick={issue} disabled={issuing || !userQuery.data?.id}>
            {issuing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Send className="h-4 w-4 mr-2" />
            Issue certificate
          </Button>
        </div>

        <div className="space-y-3">
          <div className="rounded-md border border-border/60 overflow-hidden h-fit sticky top-4">
            <div className="bg-muted/40 px-3 py-2 text-xs text-muted-foreground">Live preview</div>
            <div className="p-2 bg-muted/20">
              {template ? (
                <CertificateRender design={template} ctx={previewCtx} />
              ) : (
                <p className="text-sm text-muted-foreground p-8 text-center">
                  Select a template to preview.
                </p>
              )}
            </div>
          </div>

          {/* Interactive placeholder map */}
          {template && usedPlaceholders.length > 0 && (
            <div className="rounded-md border border-border/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Placeholders in this template
              </div>
              <div className="flex flex-wrap gap-1.5">
                {placeholderStatus.map(({ token, label, filled }) => (
                  <span
                    key={token}
                    title={label}
                    className={`inline-flex items-center gap-1 text-xs rounded-full px-2 py-1 font-mono ${
                      filled
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {filled ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {`{${token}}`}
                  </span>
                ))}
              </div>
              {missingFields.length > 0 && (
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                  Missing data for: <strong>{missingFields.map((m) => m.label).join(", ")}</strong>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Audit log + filters + export */}
      <div className="rounded-xl border border-border/60 bg-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-4 py-3 border-b border-border/60">
          <div className="flex items-center gap-2 flex-wrap">
            <History className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="font-semibold text-sm">Issuance audit log</h3>
            <span className="text-xs text-muted-foreground">
              {filteredAudit.length} of {(auditLog.data ?? []).length}
            </span>
          </div>
          <div className="sm:ml-auto flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={manualRetry}
              title="Retry pending/failed emails now"
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Retry pending</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={exportCsv}
              disabled={filteredAudit.length === 0}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-3.5 w-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 p-3 border-b border-border/60 bg-muted/20">
          <div>
            <Label className="text-[10px] uppercase">From</Label>
            <Input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase">To</Label>
            <Input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase">Issuer (user id)</Label>
            <Input
              value={filterIssuer}
              onChange={(e) => setFilterIssuer(e.target.value)}
              placeholder="uuid…"
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-[10px] uppercase">Learner (email / name)</Label>
            <Input
              value={filterLearner}
              onChange={(e) => setFilterLearner(e.target.value)}
              placeholder="ada@…"
              className="h-8"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground bg-muted/30">
              <tr>
                <th className="text-left px-4 py-2 font-medium">When</th>
                <th className="text-left px-4 py-2 font-medium">Recipient</th>
                <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Template</th>
                <th className="text-left px-4 py-2 font-medium hidden md:table-cell">Course</th>
                <th className="text-left px-4 py-2 font-medium hidden md:table-cell">Score</th>
                <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Code</th>
                <th className="text-left px-4 py-2 font-medium">Email status</th>
                <th className="text-right px-4 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted-foreground py-6">
                    <Loader2 className="h-4 w-4 animate-spin inline" />
                  </td>
                </tr>
              ) : filteredAudit.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted-foreground py-6">
                    No certificates match the filters.
                  </td>
                </tr>
              ) : (
                filteredAudit.map((r: any) => {
                  const eRow = emailStatusByCert.get(r.certificate_id);
                  const status: string = eRow?.status ?? "not sent";
                  const attempt = eRow?.attempt ?? 0;
                  const statusBadge =
                    status === "sent" ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Sent
                      </span>
                    ) : status === "failed" ? (
                      <span className="inline-flex items-center gap-1 text-destructive">
                        <XCircle className="h-3 w-3" />
                        Failed
                      </span>
                    ) : status === "pending" ? (
                      <span className="inline-flex items-center gap-1 text-amber-600">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Pending
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not sent</span>
                    );
                  return (
                    <tr key={r.id} className="border-t border-border/60">
                      <td className="px-4 py-2 whitespace-nowrap text-xs text-muted-foreground">
                        {format(new Date(r.created_at), "PP p")}
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-medium">{r.recipient_name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.recipient_email ?? ""}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-xs hidden sm:table-cell">
                        {r.template_name ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-xs hidden md:table-cell">
                        {r.course_title ?? "—"}
                      </td>
                      <td className="px-4 py-2 text-xs hidden md:table-cell">
                        {r.total > 0 ? `${r.score}/${r.total}` : "—"}
                      </td>
                      <td className="px-4 py-2 text-xs font-mono hidden sm:table-cell">
                        <Link
                          to="/certificates/$code"
                          params={{ code: r.code }}
                          className="hover:text-primary"
                        >
                          {r.code}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-xs">
                        <div>
                          {statusBadge}
                          {attempt > 0 && (
                            <span className="text-[10px] text-muted-foreground ml-1">
                              ·{attempt}×
                            </span>
                          )}
                        </div>
                        {eRow?.error && (
                          <div
                            className="text-[10px] text-destructive truncate max-w-[120px] sm:max-w-[180px]"
                            title={eRow.error}
                          >
                            {eRow.error}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={resendingId === r.certificate_id || !r.recipient_email}
                          onClick={() => resend(r.certificate_id, r.recipient_email ?? undefined)}
                        >
                          {resendingId === r.certificate_id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Mail className="h-3 w-3 sm:mr-1" />
                              <span className="hidden sm:inline">
                                {status === "sent" ? "Resend" : "Send"}
                              </span>
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
