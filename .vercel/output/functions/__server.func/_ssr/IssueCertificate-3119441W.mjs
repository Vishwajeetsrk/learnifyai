import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as CertificateRender } from "./CertificateFullPreviewDialog-Bqwk9fl-.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { a as adminEmailCertificate, r as retryPendingCertificateEmails } from "./cert.functions-Q4OaKeG8.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { T as Textarea } from "./textarea-7FPcqnpF.mjs";
import { S as Switch } from "./switch-DyY6BxUU.mjs";
import "../_libs/seroval.mjs";
import { n as Search, L as LoaderCircle, y as Send, b as CircleCheck, as as TriangleAlert, at as History, aV as RefreshCw, a5 as Download, u as Mail, aA as CircleX } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./dialog-CV-3vits.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
import "./createSsrRpc-BR3wbl1z.mjs";
import "./server-BLOOEPZP.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-BVm8xUae.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
const PLACEHOLDER_FIELDS = {
  name: { label: "Recipient name", check: (s) => !!(s.recipientName || s.foundFullName) },
  course: { label: "Course", check: (s) => !!s.courseTitle },
  date: { label: "Date (To)", check: (s) => !!s.dateTo },
  role: { label: "Role title", check: (s) => !!s.roleTitle },
  from: { label: "From date", check: (s) => !!s.dateFrom },
  to: { label: "To date", check: (s) => !!s.dateTo }
};
function extractPlaceholders(...sources) {
  const found = /* @__PURE__ */ new Set();
  const re = /\{([a-zA-Z_]+)\}/g;
  for (const src of sources) {
    if (!src) continue;
    let m;
    while ((m = re.exec(src)) !== null) found.add(m[1]);
  }
  return Array.from(found);
}
function makeIdemKey(certificateId, recipient, salt = "") {
  const bucket = Math.floor(Date.now() / 6e4);
  const safe = recipient.replace(/[^a-zA-Z0-9]/g, "").slice(0, 32);
  return `cert:${certificateId}:${safe}:${bucket}${salt ? `:${salt}` : ""}`;
}
function csvEscape(v) {
  if (v == null) return "";
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function downloadCsv(filename, rows, columns) {
  const header = columns.join(",");
  const body = rows.map((r) => columns.map((c) => csvEscape(r[c])).join(",")).join("\n");
  const blob = new Blob([`${header}
${body}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function IssueCertificate() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const sendEmail = useServerFn(adminEmailCertificate);
  const retryPending = useServerFn(retryPendingCertificateEmails);
  const [email, setEmail] = reactExports.useState("");
  const [searchedEmail, setSearchedEmail] = reactExports.useState("");
  const [recipientName, setRecipientName] = reactExports.useState("");
  const [roleTitle, setRoleTitle] = reactExports.useState("");
  const [courseId, setCourseId] = reactExports.useState("");
  const [templateId, setTemplateId] = reactExports.useState("");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [score, setScore] = reactExports.useState("");
  const [total, setTotal] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const [issuing, setIssuing] = reactExports.useState(false);
  const [autoEmail, setAutoEmail] = reactExports.useState(true);
  const [resendingId, setResendingId] = reactExports.useState(null);
  const inFlightRef = reactExports.useRef(/* @__PURE__ */ new Set());
  const [filterFrom, setFilterFrom] = reactExports.useState("");
  const [filterTo, setFilterTo] = reactExports.useState("");
  const [filterIssuer, setFilterIssuer] = reactExports.useState("");
  const [filterLearner, setFilterLearner] = reactExports.useState("");
  const userQuery = useQuery({
    enabled: !!searchedEmail,
    queryKey: ["admin-find-user", searchedEmail],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, email, full_name").ilike("email", searchedEmail).maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 6e4
  });
  const { data: templates = [] } = useQuery({
    queryKey: ["admin-cert-templates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificate_templates").select("*").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 6e4
  });
  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses-min"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("id, title, instructor, category").order("title");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 6e4
  });
  const auditLog = useQuery({
    queryKey: ["admin-cert-audit"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificate_audit_log").select("*").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 3e4
  });
  const certIds = reactExports.useMemo(
    () => (auditLog.data ?? []).map((r) => r.certificate_id),
    [auditLog.data]
  );
  const emailLog = useQuery({
    enabled: certIds.length > 0,
    queryKey: ["admin-cert-email-log", certIds.join(",")],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificate_email_log").select("*").in("certificate_id", certIds).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: (q) => {
      const rows = q.state.data ?? [];
      const hasPending = rows.some((r) => r.status === "pending");
      return hasPending ? 5e3 : false;
    }
  });
  const emailStatusByCert = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const r of emailLog.data ?? []) {
      if (!m.has(r.certificate_id)) m.set(r.certificate_id, r);
    }
    return m;
  }, [emailLog.data]);
  reactExports.useEffect(() => {
    const tick = async () => {
      try {
        const res = await retryPending();
        if (res.retried > 0) {
          qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
        }
      } catch {
      }
    };
    const id = window.setInterval(tick, 3e4);
    return () => window.clearInterval(id);
  }, [retryPending, qc]);
  reactExports.useEffect(() => {
    if (templates.length && !templateId) {
      const def = templates.find((t) => t.is_default) ?? templates[0];
      setTemplateId(def.id);
    }
  }, [templates, templateId]);
  reactExports.useEffect(() => {
    if (userQuery.data?.full_name && !recipientName) setRecipientName(userQuery.data.full_name);
  }, [userQuery.data, recipientName]);
  const template = templates.find((t) => t.id === templateId);
  const selectedCourse = courses.find((c) => c.id === courseId);
  const usedPlaceholders = reactExports.useMemo(
    () => template ? extractPlaceholders(template.body_template, template.title_text, template.subtitle) : [],
    [template]
  );
  const validationState = {
    recipientName,
    foundFullName: userQuery.data?.full_name,
    courseTitle: selectedCourse?.title,
    roleTitle,
    dateFrom,
    dateTo
  };
  const placeholderStatus = usedPlaceholders.map((token) => {
    const def = PLACEHOLDER_FIELDS[token];
    const filled = def ? def.check(validationState) : true;
    return { token, label: def?.label ?? token, filled };
  });
  const missingFields = placeholderStatus.filter((p) => !p.filled);
  const previewCtx = reactExports.useMemo(
    () => ({
      name: recipientName || userQuery.data?.full_name || "Recipient name",
      course: selectedCourse?.title ?? "Custom Achievement",
      date: dateTo || (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      role: roleTitle,
      from: dateFrom,
      to: dateTo,
      instructor: selectedCourse?.instructor,
      code: "LRN-PREVIEW",
      score: score ? Number(score) : null,
      total: total ? Number(total) : null,
      qrDataUrl: ""
    }),
    [
      recipientName,
      userQuery.data?.full_name,
      selectedCourse,
      dateTo,
      roleTitle,
      dateFrom,
      score,
      total
    ]
  );
  const issue = async () => {
    if (!userQuery.data?.id) return toast.error("Find a user by email first");
    if (!template) return toast.error("Pick a template");
    if (missingFields.length > 0) {
      const ok = window.confirm(
        `Some placeholders won't render — missing: ${missingFields.map((f) => f.label).join(", ")}.

Issue anyway?`
      );
      if (!ok) return;
    }
    setIssuing(true);
    const code = `LRN-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const snapshot = {
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
      stamp_url: template.stamp_url
    };
    const resolvedCourseId = courseId || courses[0]?.id;
    const resolvedCourse = courses.find((c) => c.id === resolvedCourseId);
    const payload = {
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
      total: total ? Number(total) : 0
    };
    const { data: inserted, error } = await supabase.from("certificates").insert(payload).select("id").single();
    if (error) {
      setIssuing(false);
      return toast.error(error.message);
    }
    await supabase.from("certificate_audit_log").insert({
      certificate_id: inserted.id,
      action: "issued",
      issued_by: user?.id ?? null,
      recipient_user_id: userQuery.data.id,
      recipient_email: userQuery.data.email,
      recipient_name: payload.recipient_name,
      template_id: template.id,
      template_name: template.name,
      course_id: resolvedCourseId ?? null,
      course_title: resolvedCourse?.title ?? null,
      score: payload.score,
      total: payload.total,
      code,
      metadata: { role_title: roleTitle || null, notes: notes || null }
    });
    toast.success(`Certificate issued · ${code}`);
    if (autoEmail && userQuery.data.email) {
      const idem = `cert:${inserted.id}:auto`;
      try {
        await sendEmail({
          data: { certificateId: inserted.id, to: userQuery.data.email, idempotencyKey: idem }
        });
        toast.success("Email sent to learner");
      } catch (e) {
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
  const resend = reactExports.useCallback(
    async (certificateId, to) => {
      if (!to) return toast.error("No recipient email on file");
      const idem = makeIdemKey(certificateId, to);
      if (inFlightRef.current.has(idem)) return;
      inFlightRef.current.add(idem);
      setResendingId(certificateId);
      try {
        const res = await sendEmail({ data: { certificateId, to, idempotencyKey: idem } });
        toast.success(res?.deduped ? "Already sent (deduped)" : "Email resent");
        qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
      } catch (e) {
        toast.error(`Resend failed: ${e?.message ?? "unknown"}`);
        qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
      } finally {
        inFlightRef.current.delete(idem);
        setResendingId(null);
      }
    },
    [sendEmail, qc]
  );
  const manualRetry = async () => {
    try {
      const res = await retryPending();
      toast.success(
        `Retry sweep: ${res.succeeded} sent, ${res.failed} failed (${res.retried} attempted)`
      );
      qc.invalidateQueries({ queryKey: ["admin-cert-email-log"] });
    } catch (e) {
      toast.error(`Retry failed: ${e?.message ?? "unknown"}`);
    }
  };
  const filteredAudit = reactExports.useMemo(() => {
    const rows = auditLog.data ?? [];
    const fromTs = filterFrom ? new Date(filterFrom).getTime() : null;
    const toTs = filterTo ? new Date(filterTo).getTime() + 864e5 : null;
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
    const rows = filteredAudit.map((r) => {
      const email2 = emailStatusByCert.get(r.certificate_id);
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
        email_status: email2?.status ?? "not sent",
        email_attempts: email2?.attempt ?? 0,
        email_error: email2?.error ?? "",
        provider_message_id: email2?.provider_message_id ?? ""
      };
    });
    downloadCsv(`certificate-audit-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`, rows, [
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
      "provider_message_id"
    ]);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid lg:grid-cols-[1fr_1fr] gap-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Find user by email" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 469,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Input,
              {
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "learner@email.com",
                type: "email"
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 471,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { type: "button", onClick: () => setSearchedEmail(email.trim()), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 478,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 477,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 470,
            columnNumber: 13
          }, this),
          userQuery.data && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-emerald-600 mt-1", children: [
            "Found: ",
            userQuery.data.full_name ?? userQuery.data.email
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 482,
            columnNumber: 15
          }, this),
          searchedEmail && !userQuery.isLoading && !userQuery.data && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-destructive mt-1", children: "No user with that email." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 487,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 468,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Template" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 492,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "select",
            {
              className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              value: templateId,
              onChange: (e) => setTemplateId(e.target.value),
              children: templates.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: t.id, children: t.name }, t.id, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 499,
                columnNumber: 17
              }, this))
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 493,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 491,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Course (optional)" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 507,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "select",
            {
              className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              value: courseId,
              onChange: (e) => setCourseId(e.target.value),
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: "", children: "— Choose a course —" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 513,
                  columnNumber: 15
                }, this),
                courses.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("option", { value: c.id, children: c.title }, c.id, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 515,
                  columnNumber: 17
                }, this))
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 508,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 506,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Recipient name (override)" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 524,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Input,
              {
                value: recipientName,
                onChange: (e) => setRecipientName(e.target.value),
                placeholder: "Ada Lovelace"
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 525,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 523,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Role title" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 532,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Input,
              {
                value: roleTitle,
                onChange: (e) => setRoleTitle(e.target.value),
                placeholder: "Lead Engineer"
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 533,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 531,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 522,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "From" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 543,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "date", value: dateFrom, onChange: (e) => setDateFrom(e.target.value) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 544,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 542,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "To" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 547,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "date", value: dateTo, onChange: (e) => setDateTo(e.target.value) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 548,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 546,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 541,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Score" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 554,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", value: score, onChange: (e) => setScore(e.target.value) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 555,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 553,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Total" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 558,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", value: total, onChange: (e) => setTotal(e.target.value) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 559,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 557,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 552,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Notes (internal)" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 564,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 2, value: notes, onChange: (e) => setNotes(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 565,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 563,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 pt-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked: autoEmail, onCheckedChange: setAutoEmail, id: "autoEmail" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 569,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "autoEmail", className: "cursor-pointer", children: "Email certificate to learner immediately" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 570,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 568,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: issue, disabled: issuing || !userQuery.data?.id, children: [
          issuing && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 576,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { className: "h-4 w-4 mr-2" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 577,
            columnNumber: 13
          }, this),
          "Issue certificate"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 575,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
        lineNumber: 467,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-md border border-border/60 overflow-hidden h-fit sticky top-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-muted/40 px-3 py-2 text-xs text-muted-foreground", children: "Live preview" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 584,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-2 bg-muted/20", children: template ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CertificateRender, { design: template, ctx: previewCtx }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 587,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground p-8 text-center", children: "Select a template to preview." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 589,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 585,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 583,
          columnNumber: 11
        }, this),
        template && usedPlaceholders.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-md border border-border/60 p-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2", children: "Placeholders in this template" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 599,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-1.5", children: placeholderStatus.map(({ token, label, filled }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "span",
            {
              title: label,
              className: `inline-flex items-center gap-1 text-xs rounded-full px-2 py-1 font-mono ${filled ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40"}`,
              children: [
                filled ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-3 w-3" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 614,
                  columnNumber: 23
                }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TriangleAlert, { className: "h-3 w-3" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 616,
                  columnNumber: 23
                }, this),
                `{${token}}`
              ]
            },
            token,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 604,
              columnNumber: 19
            },
            this
          )) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 602,
            columnNumber: 15
          }, this),
          missingFields.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-amber-700 dark:text-amber-300 mt-2", children: [
            "Missing data for: ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { children: missingFields.map((m) => m.label).join(", ") }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 624,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 623,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 598,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
        lineNumber: 582,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
      lineNumber: 466,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-border/60 bg-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-border/60 flex-wrap", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(History, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 635,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-semibold text-sm", children: "Issuance audit log" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 636,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-muted-foreground", children: [
          filteredAudit.length,
          " of ",
          (auditLog.data ?? []).length
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 637,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "ml-auto flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: manualRetry,
              title: "Retry pending/failed emails now",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefreshCw, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 647,
                  columnNumber: 15
                }, this),
                "Retry pending"
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 641,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: exportCsv,
              disabled: filteredAudit.length === 0,
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Download, { className: "h-3.5 w-3.5 mr-1" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 656,
                  columnNumber: 15
                }, this),
                "Export CSV"
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 650,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 640,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
        lineNumber: 634,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2 p-3 border-b border-border/60 bg-muted/20", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-[10px] uppercase", children: "From" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 664,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Input,
            {
              type: "date",
              value: filterFrom,
              onChange: (e) => setFilterFrom(e.target.value),
              className: "h-8"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 665,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 663,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-[10px] uppercase", children: "To" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 673,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Input,
            {
              type: "date",
              value: filterTo,
              onChange: (e) => setFilterTo(e.target.value),
              className: "h-8"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 674,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 672,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-[10px] uppercase", children: "Issuer (user id)" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 682,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Input,
            {
              value: filterIssuer,
              onChange: (e) => setFilterIssuer(e.target.value),
              placeholder: "uuid…",
              className: "h-8"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 683,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 681,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-[10px] uppercase", children: "Learner (email / name)" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 691,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Input,
            {
              value: filterLearner,
              onChange: (e) => setFilterLearner(e.target.value),
              placeholder: "ada@…",
              className: "h-8"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 692,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 690,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
        lineNumber: 662,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { className: "text-xs text-muted-foreground bg-muted/30", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 py-2 font-medium", children: "When" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 705,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 py-2 font-medium", children: "Recipient" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 706,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 py-2 font-medium", children: "Template" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 707,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 py-2 font-medium", children: "Course" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 708,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 py-2 font-medium", children: "Score" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 709,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 py-2 font-medium", children: "Code" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 710,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 py-2 font-medium", children: "Email status" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 711,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-4 py-2 font-medium", children: "Actions" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 712,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 704,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 703,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { children: auditLog.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { colSpan: 8, className: "text-center text-muted-foreground py-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin inline" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 719,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 718,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 717,
          columnNumber: 17
        }, this) : filteredAudit.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { colSpan: 8, className: "text-center text-muted-foreground py-6", children: "No certificates match the filters." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 724,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 723,
          columnNumber: 17
        }, this) : filteredAudit.map((r) => {
          const eRow = emailStatusByCert.get(r.certificate_id);
          const status = eRow?.status ?? "not sent";
          const attempt = eRow?.attempt ?? 0;
          const statusBadge = status === "sent" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center gap-1 text-emerald-600", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 736,
              columnNumber: 25
            }, this),
            "Sent"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 735,
            columnNumber: 23
          }, this) : status === "failed" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center gap-1 text-destructive", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleX, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 741,
              columnNumber: 25
            }, this),
            "Failed"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 740,
            columnNumber: 23
          }, this) : status === "pending" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center gap-1 text-amber-600", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-3 w-3 animate-spin" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 746,
              columnNumber: 25
            }, this),
            "Pending"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 745,
            columnNumber: 23
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground", children: "Not sent" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 750,
            columnNumber: 23
          }, this);
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-t border-border/60", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 whitespace-nowrap text-xs text-muted-foreground", children: format(new Date(r.created_at), "PP p") }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 754,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium", children: r.recipient_name ?? "—" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 758,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground", children: r.recipient_email ?? "" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 759,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 757,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-xs", children: r.template_name ?? "—" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 763,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-xs", children: r.course_title ?? "—" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 764,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-xs", children: r.total > 0 ? `${r.score}/${r.total}` : "—" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 765,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-xs font-mono", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Link,
              {
                to: "/certificates/$code",
                params: { code: r.code },
                className: "hover:text-primary",
                children: r.code
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 769,
                columnNumber: 25
              },
              this
            ) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 768,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-xs", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                statusBadge,
                attempt > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] text-muted-foreground ml-1", children: [
                  "·",
                  attempt,
                  "×"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 781,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 778,
                columnNumber: 25
              }, this),
              eRow?.error && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "text-[10px] text-destructive truncate max-w-[180px]",
                  title: eRow.error,
                  children: eRow.error
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 787,
                  columnNumber: 27
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 777,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 py-2 text-right", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Button,
              {
                size: "sm",
                variant: "outline",
                disabled: resendingId === r.certificate_id || !r.recipient_email,
                onClick: () => resend(r.certificate_id, r.recipient_email ?? void 0),
                children: resendingId === r.certificate_id ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-3 w-3 animate-spin" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 803,
                  columnNumber: 29
                }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mail, { className: "h-3 w-3 mr-1" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                    lineNumber: 806,
                    columnNumber: 31
                  }, this),
                  status === "sent" ? "Resend" : "Send"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                  lineNumber: 805,
                  columnNumber: 29
                }, this)
              },
              void 0,
              false,
              {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
                lineNumber: 796,
                columnNumber: 25
              },
              this
            ) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
              lineNumber: 795,
              columnNumber: 23
            }, this)
          ] }, r.id, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
            lineNumber: 753,
            columnNumber: 21
          }, this);
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
          lineNumber: 715,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
        lineNumber: 702,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
        lineNumber: 701,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
      lineNumber: 633,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/admin/IssueCertificate.tsx",
    lineNumber: 465,
    columnNumber: 5
  }, this);
}
export {
  IssueCertificate as default
};
