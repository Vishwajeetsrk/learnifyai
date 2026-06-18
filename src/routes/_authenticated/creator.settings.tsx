import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, Save, Settings as SettingsIcon, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CreatorGate } from "@/components/CreatorGate";
import { CreatorTabs } from "@/components/CreatorTabs";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/creator/settings")({
  head: () => ({ meta: [{ title: "Creator settings — Learnify AI" }] }),
  component: () => (
    <CreatorGate>
      <CreatorSettingsPage />
    </CreatorGate>
  ),
});

type SocialLinks = { website?: string; twitter?: string; youtube?: string; github?: string };
type Payout = {
  method?: "bank" | "upi";
  upi_id?: string;
  account_name?: string;
  account_number?: string;
  ifsc?: string;
};
type NotifPrefs = {
  new_subscriber: boolean;
  new_comment: boolean;
  new_sale: boolean;
  email: boolean;
  inapp: boolean;
};
type Defaults = {
  price_inr: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
};

function CreatorSettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const profileQ = useQuery({
    enabled: !!user,
    queryKey: ["creator-profile-self", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, social_links, payout_destination, notif_prefs, default_course_settings")
        .eq("id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const [links, setLinks] = useState<SocialLinks>({});
  const [payout, setPayout] = useState<Payout>({ method: "bank" });
  const [prefs, setPrefs] = useState<NotifPrefs>({
    new_subscriber: true,
    new_comment: true,
    new_sale: true,
    email: true,
    inapp: true,
  });
  const [defaults, setDefaults] = useState<Defaults>({
    price_inr: 0,
    category: "General",
    level: "Beginner",
  });

  useEffect(() => {
    const p = profileQ.data;
    if (!p) return;
    setLinks((p.social_links ?? {}) as SocialLinks);
    setPayout((p.payout_destination ?? { method: "bank" }) as Payout);
    setPrefs({
      new_subscriber: true,
      new_comment: true,
      new_sale: true,
      email: true,
      inapp: true,
      ...((p.notif_prefs ?? {}) as Partial<NotifPrefs>),
    });
    setDefaults({
      price_inr: 0,
      category: "General",
      level: "Beginner",
      ...((p.default_course_settings ?? {}) as Partial<Defaults>),
    });
  }, [profileQ.data]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        social_links: links,
        payout_destination: payout,
        notif_prefs: prefs,
        default_course_settings: defaults,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["creator-profile-self", user.id] });
  };

  if (profileQ.isLoading) {
    return (
      <AppShell>
        <div className="py-20 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-3xl">
        <CreatorTabs />
        <div className="flex items-center gap-3 mt-6">
          <SettingsIcon className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-display font-semibold">Creator settings</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Manage what learners see, how you get paid, and what we notify you about.
        </p>

        <div className="mt-6 space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="font-display font-semibold">Public profile</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Your name, avatar, and bio are managed in{" "}
                  <Link
                    to="/settings"
                    className="text-primary inline-flex items-center gap-0.5 hover:underline"
                  >
                    Account Settings <ExternalLink className="h-3 w-3" />
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Website">
                <Input
                  value={links.website ?? ""}
                  onChange={(e) => setLinks({ ...links, website: e.target.value })}
                />
              </Field>
              <Field label="Twitter / X">
                <Input
                  value={links.twitter ?? ""}
                  onChange={(e) => setLinks({ ...links, twitter: e.target.value })}
                />
              </Field>
              <Field label="YouTube">
                <Input
                  value={links.youtube ?? ""}
                  onChange={(e) => setLinks({ ...links, youtube: e.target.value })}
                />
              </Field>
              <Field label="GitHub">
                <Input
                  value={links.github ?? ""}
                  onChange={(e) => setLinks({ ...links, github: e.target.value })}
                />
              </Field>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-display font-semibold">Payouts</h2>
            <Field label="Method">
              <Select
                value={payout.method ?? "bank"}
                onValueChange={(v: "bank" | "upi") =>
                  setPayout({ ...payout, method: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank transfer</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {payout.method === "upi" ? (
              <Field label="UPI ID">
                <Input
                  value={payout.upi_id ?? ""}
                  onChange={(e) => setPayout({ ...payout, upi_id: e.target.value })}
                  placeholder="name@bank"
                />
              </Field>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Account holder">
                  <Input
                    value={payout.account_name ?? ""}
                    onChange={(e) => setPayout({ ...payout, account_name: e.target.value })}
                  />
                </Field>
                <Field label="IFSC">
                  <Input
                    value={payout.ifsc ?? ""}
                    onChange={(e) => setPayout({ ...payout, ifsc: e.target.value })}
                  />
                </Field>
                <Field label="Account number">
                  <Input
                    value={payout.account_number ?? ""}
                    onChange={(e) => setPayout({ ...payout, account_number: e.target.value })}
                  />
                </Field>
              </div>
            )}
            <p className="text-[11px] text-muted-foreground">
              Used to autofill when you request a withdrawal via Cashfree Payouts.
            </p>
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-display font-semibold">Notifications</h2>
            <Toggle
              label="New subscriber"
              checked={prefs.new_subscriber}
              onChange={(v) => setPrefs({ ...prefs, new_subscriber: v })}
            />
            <Toggle
              label="New comment on a lesson"
              checked={prefs.new_comment}
              onChange={(v) => setPrefs({ ...prefs, new_comment: v })}
            />
            <Toggle
              label="New course sale"
              checked={prefs.new_sale}
              onChange={(v) => setPrefs({ ...prefs, new_sale: v })}
            />
            <div className="h-px bg-border my-2" />
            <Toggle
              label="Email"
              checked={prefs.email}
              onChange={(v) => setPrefs({ ...prefs, email: v })}
            />
            <Toggle
              label="In-app"
              checked={prefs.inapp}
              onChange={(v) => setPrefs({ ...prefs, inapp: v })}
            />
          </Card>

          <Card className="p-5 space-y-4">
            <h2 className="font-display font-semibold">New-course defaults</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Default price (₹)">
                <Input
                  type="number"
                  min={0}
                  value={defaults.price_inr}
                  onChange={(e) =>
                    setDefaults({ ...defaults, price_inr: Number(e.target.value) || 0 })
                  }
                />
              </Field>
              <Field label="Category">
                <Select
                  value={defaults.category}
                  onValueChange={(v) => setDefaults({ ...defaults, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "General",
                      "Development",
                      "Design",
                      "Marketing",
                      "AI & Data",
                      "Business",
                      "Personal Growth",
                    ].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Level">
                <Select
                  value={defaults.level}
                  onValueChange={(v: Defaults["level"]) => setDefaults({ ...defaults, level: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{" "}
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
