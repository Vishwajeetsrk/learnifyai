/**
 * PaymentGatewayManager
 *
 * Admin UI to:
 *  1. Set the active payment gateway (Razorpay default, Cashfree optional).
 *  2. When Cashfree is enabled, enter App ID + Secret Key into site_settings.
 *  3. Cashfree is NEVER surfaced publicly unless an admin activates it here.
 *  4. Razorpay is always the fallback if no override is saved.
 */

import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  CreditCard,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { adminContentQuery, adminContentUpsert } from "@/lib/admin-content.functions";

/* ─── helpers ───────────────────────────────────────────────────────────────── */

type Gateway = "razorpay" | "cashfree";

const RAZORPAY_DOCS = "https://razorpay.com/docs/payment-gateway/dashboard-guide/settings/api-keys/";
const CASHFREE_DOCS = "https://docs.cashfree.com/docs/api-keys";

/* ─── Component ─────────────────────────────────────────────────────────────── */

export function PaymentGatewayManager() {
  const qc = useQueryClient();
  const doQuery = useServerFn(adminContentQuery);
  const doUpsert = useServerFn(adminContentUpsert);

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [gateway, setGateway] = useState<Gateway>("razorpay");

  // Cashfree fields (never committed to client bundle)
  const [cfAppId, setCfAppId] = useState("");
  const [cfSecret, setCfSecret] = useState("");
  const [showCfSecret, setShowCfSecret] = useState(false);

  // Razorpay fields
  const [rzpKeyId, setRzpKeyId] = useState("");

  // ── Fetch site_settings ──────────────────────────────────────────────────
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-payment-gateway-settings"],
    queryFn: async () => {
      const res = await doQuery({
        data: { table: "site_settings", columns: "key,value" },
      });
      const rows = Array.isArray(res) ? (res as unknown as Array<{ key: string; value?: string }>) : [];
      const map: Record<string, string> = {};
      for (const r of rows) map[r.key] = r.value ?? "";
      return map;
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!settings) return;
    setGateway((settings.payment_gateway as Gateway) || "razorpay");
    setRzpKeyId(settings.razorpay_key_id_display || "");
    setCfAppId(settings.cashfree_app_id_display || "");
    // never pre-fill secrets from server to UI
  }, [settings]);

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const rows: { key: string; value: string }[] = [
        { key: "payment_gateway", value: gateway },
      ];

      // Only save non-secret display hints (actual secrets go into env vars)
      if (gateway === "razorpay" && rzpKeyId) {
        rows.push({ key: "razorpay_key_id_display", value: rzpKeyId });
      }
      if (gateway === "cashfree") {
        if (!cfAppId) {
          toast.error("Cashfree App ID is required to enable Cashfree gateway.");
          setSaving(false);
          return;
        }
        rows.push({ key: "cashfree_app_id_display", value: cfAppId });
        // Secret is written as a masked hint only — real secret must be in Vercel env
        if (cfSecret) {
          rows.push({
            key: "cashfree_secret_configured",
            value: "true",
          });
        }
      }

      await doUpsert({ data: { table: "site_settings", data: rows, onConflict: "key" } });
      await qc.invalidateQueries({ queryKey: ["admin-payment-gateway-settings"] });
      toast.success(
        `✅ Payment gateway switched to ${gateway === "razorpay" ? "Razorpay" : "Cashfree"} and saved.`,
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to save gateway settings.");
    } finally {
      setSaving(false);
    }
  }, [gateway, rzpKeyId, cfAppId, cfSecret, doUpsert, qc]);

  // ── Test connection stub ──────────────────────────────────────────────────
  const handleTestConnection = useCallback(async () => {
    setTesting(true);
    try {
      // Lightweight webhook endpoint ping
      const endpoint =
        gateway === "razorpay"
          ? "/api/webhooks/razorpay"
          : "/api/webhooks/cashfree";
      const res = await fetch(endpoint, { method: "GET" });
      if (res.ok) {
        toast.success(`${gateway === "razorpay" ? "Razorpay" : "Cashfree"} webhook endpoint is reachable ✓`);
      } else {
        toast.warning(`Endpoint responded with HTTP ${res.status}. Check server logs.`);
      }
    } catch {
      toast.error("Could not reach webhook endpoint. Ensure the server is running.");
    } finally {
      setTesting(false);
    }
  }, [gateway]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-8">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading gateway settings…</span>
      </div>
    );
  }

  const currentGatewayIsRazorpay = gateway === "razorpay";

  return (
    <div className="space-y-6">
      {/* ── Header Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={<CreditCard className="h-4 w-4 text-indigo-400" />}
          label="Active Gateway"
          value={currentGatewayIsRazorpay ? "Razorpay" : "Cashfree"}
          badge={
            <Badge
              className={cn(
                "text-[10px] font-semibold",
                currentGatewayIsRazorpay
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
              )}
            >
              LIVE
            </Badge>
          }
        />
        <StatCard
          icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
          label="Webhook Security"
          value="HMAC-SHA256"
          badge={
            <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
              VERIFIED
            </Badge>
          }
        />
        <StatCard
          icon={<Zap className="h-4 w-4 text-amber-400" />}
          label="Cashfree Status"
          value={settings?.cashfree_secret_configured === "true" ? "Configured" : "Not Configured"}
          badge={
            <Badge
              className={cn(
                "text-[10px]",
                settings?.cashfree_secret_configured === "true"
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
              )}
            >
              {settings?.cashfree_secret_configured === "true" ? "READY" : "INACTIVE"}
            </Badge>
          }
        />
      </div>

      {/* ── Gateway Selector ──────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <CreditCard className="h-3.5 w-3.5" />
          Active Payment Gateway
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Razorpay Option */}
          <GatewayCard
            selected={gateway === "razorpay"}
            onClick={() => setGateway("razorpay")}
            name="Razorpay"
            tagline="Primary · Default Gateway"
            description="UPI, Cards, Net Banking, EMI. Seamless Indian payment experience."
            badge="PRIMARY"
            badgeClass="bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
            icon="🔵"
          />
          {/* Cashfree Option */}
          <GatewayCard
            selected={gateway === "cashfree"}
            onClick={() => setGateway("cashfree")}
            name="Cashfree"
            tagline="Optional · Admin-Configurable"
            description="UPI, Cards, eNACH, EMI. Enable only when App ID & Secret are set."
            badge="OPTIONAL"
            badgeClass="bg-amber-500/15 text-amber-400 border-amber-500/30"
            icon="🟡"
          />
        </div>

        {/* Warning when switching to Cashfree */}
        {gateway === "cashfree" && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-300">Cashfree requires server env vars</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The actual <code className="text-amber-300">CASHFREE_APP_ID</code> and{" "}
                <code className="text-amber-300">CASHFREE_SECRET_KEY</code> must be set as{" "}
                <strong>Vercel environment variables</strong> (server-only, no VITE_ prefix).
                The fields below save display hints for the admin panel only.
              </p>
              <a
                href={CASHFREE_DOCS}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-amber-400 hover:underline"
              >
                Get Cashfree API keys →
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Razorpay Settings ─────────────────────────────────────────────── */}
      {gateway === "razorpay" && (
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <KeyRound className="h-3.5 w-3.5" />
            Razorpay Configuration
          </h4>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="rzp-key-id" className="text-xs font-semibold">
                Key ID (Public — display only)
              </Label>
              <Input
                id="rzp-key-id"
                value={rzpKeyId}
                onChange={(e) => setRzpKeyId(e.target.value)}
                placeholder="rzp_live_XXXXXXXXXXXX"
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                This is your public Razorpay Key ID shown in admin analytics. The{" "}
                <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> must be
                set as Vercel env vars.{" "}
                <a href={RAZORPAY_DOCS} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  View docs →
                </a>
              </p>
            </div>
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-300">Webhook verified</p>
                <p className="text-[11px] text-muted-foreground">
                  <code>/api/webhooks/razorpay</code> uses timing-safe HMAC-SHA256 via{" "}
                  <code>RAZORPAY_WEBHOOK_SECRET</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cashfree Settings ─────────────────────────────────────────────── */}
      {gateway === "cashfree" && (
        <div className="rounded-xl border bg-card p-5 space-y-4 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <KeyRound className="h-3.5 w-3.5" />
            Cashfree Configuration
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cf-app-id" className="text-xs font-semibold">
                App ID <span className="text-red-400">*</span>
              </Label>
              <Input
                id="cf-app-id"
                value={cfAppId}
                onChange={(e) => setCfAppId(e.target.value)}
                placeholder="e.g. 12345678abcd"
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                Also set <code>CASHFREE_APP_ID</code> in Vercel env.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cf-secret" className="text-xs font-semibold">
                Secret Key (stored as env — input to confirm)
              </Label>
              <div className="relative">
                <Input
                  id="cf-secret"
                  type={showCfSecret ? "text" : "password"}
                  value={cfSecret}
                  onChange={(e) => setCfSecret(e.target.value)}
                  placeholder="Enter secret to mark as configured"
                  className="text-xs font-mono pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowCfSecret((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showCfSecret ? "Hide secret" : "Show secret"}
                >
                  {showCfSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Only marks the secret as "configured" in site_settings. Real secret → Vercel env{" "}
                <code>CASHFREE_SECRET_KEY</code>.
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3 flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground">
              <code>/api/webhooks/cashfree</code> uses timing-safe HMAC-SHA256 via{" "}
              <code>CASHFREE_SECRET_KEY</code>. Webhook URL:{" "}
              <code>https://www.learnifyai.in/api/webhooks/cashfree</code>
            </p>
          </div>
        </div>
      )}

      {/* ── Actions ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={handleTestConnection}
          disabled={testing}
          className="text-xs gap-2"
        >
          {testing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Test Webhook Endpoint
        </Button>

        <Button onClick={handleSave} disabled={saving} className="px-6 gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : `Activate ${gateway === "razorpay" ? "Razorpay" : "Cashfree"}`}
        </Button>
      </div>

      {/* ── Info callout ──────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground/70">How gateway switching works</p>
        <ul className="text-[11px] text-muted-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>The active gateway is stored in <code>site_settings.payment_gateway</code>.</li>
          <li><strong>Razorpay</strong> is always the default if no setting exists.</li>
          <li>All checkout flows call <code>getActivePaymentGateway()</code> and auto-switch in real time.</li>
          <li>Webhook routes for both gateways stay active regardless of selection.</li>
          <li>Cashfree UI elements (checkout button, branding) appear on site only when gateway is set to "cashfree".</li>
        </ul>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-2 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
        </div>
        {badge}
      </div>
      <p className="text-base font-bold text-foreground">{value}</p>
    </div>
  );
}

function GatewayCard({
  selected,
  onClick,
  name,
  tagline,
  description,
  badge,
  badgeClass,
  icon,
}: {
  selected: boolean;
  onClick: () => void;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  badgeClass: string;
  icon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative text-left w-full rounded-xl border p-4 space-y-2 transition-all duration-200",
        "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
          : "border-border bg-card hover:bg-muted/30",
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-bold text-foreground">{name}</span>
        <Badge className={cn("text-[10px] font-semibold ml-auto", badgeClass)}>{badge}</Badge>
      </div>
      <p className="text-[11px] font-medium text-muted-foreground">{tagline}</p>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
    </button>
  );
}
