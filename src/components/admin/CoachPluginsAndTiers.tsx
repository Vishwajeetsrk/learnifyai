import { useState } from "react";
import {
  Video,
  Mail,
  Calendar,
  Sparkles,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Clock,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type BookingSettings,
  type ServiceTier,
  DEFAULT_BOOKING_SETTINGS,
  DEFAULT_COACH_TIERS,
} from "@/lib/coach-creator.functions";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Apple-Style Meeting & Calendar Plugins Editor
// ─────────────────────────────────────────────────────────────────────────────

interface CoachPluginsEditorProps {
  bookingSettings?: BookingSettings;
  onChange: (settings: BookingSettings) => void;
}

export function CoachPluginsEditor({
  bookingSettings = DEFAULT_BOOKING_SETTINGS,
  onChange,
}: CoachPluginsEditorProps) {
  const current = bookingSettings.plugins || DEFAULT_BOOKING_SETTINGS.plugins;

  const updatePlugin = <K extends keyof typeof current>(
    pluginKey: K,
    patch: Partial<(typeof current)[K]>,
  ) => {
    onChange({
      ...bookingSettings,
      plugins: {
        ...current,
        [pluginKey]: {
          ...current[pluginKey],
          ...patch,
        },
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-border/60 bg-gradient-to-r from-card/80 via-card/50 to-muted/20 backdrop-blur-md">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="text-sm font-semibold tracking-tight text-foreground font-display">
              Live Meeting &amp; Calendar Integrations
            </h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Connect your preferred conferencing and scheduling tools for 1-on-1 sessions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Label htmlFor="master_booking_toggle" className="text-xs font-medium cursor-pointer">
            Accept Bookings
          </Label>
          <Switch
            id="master_booking_toggle"
            checked={Boolean(bookingSettings.enabled)}
            onCheckedChange={(val) =>
              onChange({ ...bookingSettings, enabled: val })
            }
          />
        </div>
      </div>

      {/* 5 Integrated Plugin Cards (Apple System Settings Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Gmail Integration */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3 transition-all hover:border-border hover:shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  Gmail &amp; Google Calendar
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-red-500/30 text-red-600 bg-red-500/5">
                    Google Workspace
                  </Badge>
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Send meeting confirmations and calendar .ics invites.
                </p>
              </div>
            </div>
            <Switch
              checked={Boolean(current.gmail?.enabled)}
              onCheckedChange={(val) => updatePlugin("gmail", { enabled: val })}
            />
          </div>

          {current.gmail?.enabled && (
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
              <Label className="text-[11px] text-muted-foreground font-medium">
                Notification Email Address
              </Label>
              <Input
                value={current.gmail?.email || ""}
                onChange={(e) => updatePlugin("gmail", { email: e.target.value })}
                placeholder="support.learnifyai@gmail.com"
                className="h-8 text-xs bg-background/50"
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-muted-foreground">Auto-send Calendar Invite</span>
                <Switch
                  checked={Boolean(current.gmail?.sync_calendar)}
                  onCheckedChange={(val) => updatePlugin("gmail", { sync_calendar: val })}
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. Google Meet Integration */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3 transition-all hover:border-border hover:shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Video className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  Google Meet
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-emerald-500/30 text-emerald-600 bg-emerald-500/5">
                    Recommended
                  </Badge>
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Instant browser-based high definition video calls.
                </p>
              </div>
            </div>
            <Switch
              checked={Boolean(current.google_meet?.enabled)}
              onCheckedChange={(val) => updatePlugin("google_meet", { enabled: val })}
            />
          </div>

          {current.google_meet?.enabled && (
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
              <Label className="text-[11px] text-muted-foreground font-medium">
                Permanent Room Link (Optional — or auto-generated per session)
              </Label>
              <div className="flex gap-2">
                <Input
                  value={current.google_meet?.meeting_url || ""}
                  onChange={(e) => updatePlugin("google_meet", { meeting_url: e.target.value })}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="h-8 text-xs bg-background/50"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs shrink-0 gap-1"
                  onClick={() => {
                    const testUrl = current.google_meet?.meeting_url || "https://meet.google.com/new";
                    window.open(testUrl, "_blank");
                    toast.success("Opening Google Meet test room");
                  }}
                >
                  <ExternalLink className="h-3 w-3" /> Test
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Zoom Meeting Integration */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3 transition-all hover:border-border hover:shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Laptop className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  Zoom Video Communications
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-blue-500/30 text-blue-600 bg-blue-500/5">
                    Pro Audio
                  </Badge>
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Connect personal meeting room with recording and screen share.
                </p>
              </div>
            </div>
            <Switch
              checked={Boolean(current.zoom?.enabled)}
              onCheckedChange={(val) => updatePlugin("zoom", { enabled: val })}
            />
          </div>

          {current.zoom?.enabled && (
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
              <Label className="text-[11px] text-muted-foreground font-medium">
                Zoom Meeting URL or PMI
              </Label>
              <div className="flex gap-2">
                <Input
                  value={current.zoom?.meeting_url || ""}
                  onChange={(e) => updatePlugin("zoom", { meeting_url: e.target.value })}
                  placeholder="https://zoom.us/j/1234567890"
                  className="h-8 text-xs bg-background/50"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs shrink-0 gap-1"
                  onClick={() => {
                    if (!current.zoom?.meeting_url) {
                      toast.error("Enter a Zoom meeting link first");
                      return;
                    }
                    window.open(current.zoom.meeting_url, "_blank");
                  }}
                >
                  <ExternalLink className="h-3 w-3" /> Test
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Cal.com Integration */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3 transition-all hover:border-border hover:shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  Cal.com Embed
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-amber-500/30 text-amber-600 bg-amber-500/5">
                    Open Scheduling
                  </Badge>
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Direct live calendar embed with automatic time zone sync.
                </p>
              </div>
            </div>
            <Switch
              checked={Boolean(current.cal_com?.enabled)}
              onCheckedChange={(val) => updatePlugin("cal_com", { enabled: val })}
            />
          </div>

          {current.cal_com?.enabled && (
            <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
              <Label className="text-[11px] text-muted-foreground font-medium">
                Cal.com Username / Event Link
              </Label>
              <div className="flex gap-2">
                <Input
                  value={current.cal_com?.username || ""}
                  onChange={(e) => updatePlugin("cal_com", { username: e.target.value })}
                  placeholder="e.g. yourname or cal.com/yourname/30min"
                  className="h-8 text-xs bg-background/50"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs shrink-0 gap-1"
                  onClick={() => {
                    const u = current.cal_com?.username;
                    if (!u) {
                      toast.error("Please enter your Cal.com username");
                      return;
                    }
                    const url = u.startsWith("http") ? u : `https://cal.com/${u}`;
                    window.open(url, "_blank");
                  }}
                >
                  <ExternalLink className="h-3 w-3" /> Preview
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Microsoft Teams Integration */}
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3 transition-all hover:border-border hover:shadow-sm md:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  Microsoft Teams &amp; Outlook 365
                  <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-purple-500/30 text-purple-600 bg-purple-500/5">
                    Enterprise
                  </Badge>
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Synchronize with Microsoft 365 enterprise calendars and host on Microsoft Teams.
                </p>
              </div>
            </div>
            <Switch
              checked={Boolean(current.microsoft?.enabled)}
              onCheckedChange={(val) => updatePlugin("microsoft", { enabled: val })}
            />
          </div>

          {current.microsoft?.enabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/40 text-xs">
              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground font-medium">
                  Teams Meeting Join Link
                </Label>
                <Input
                  value={current.microsoft?.teams_meeting_url || ""}
                  onChange={(e) => updatePlugin("microsoft", { teams_meeting_url: e.target.value })}
                  placeholder="https://teams.microsoft.com/l/meetup-join/..."
                  className="h-8 text-xs bg-background/50"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground font-medium">
                  Outlook 365 Email
                </Label>
                <Input
                  value={current.microsoft?.outlook_email || ""}
                  onChange={(e) => updatePlugin("microsoft", { outlook_email: e.target.value })}
                  placeholder="mentor@learnifyai.com"
                  className="h-8 text-xs bg-background/50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Apple-Style Service Tiers Manager
// ─────────────────────────────────────────────────────────────────────────────

interface CoachTiersEditorProps {
  tiers?: ServiceTier[];
  onChange: (tiers: ServiceTier[]) => void;
}

export function CoachTiersEditor({
  tiers = DEFAULT_COACH_TIERS,
  onChange,
}: CoachTiersEditorProps) {
  const [editingTier, setEditingTier] = useState<ServiceTier | null>(null);

  const handleAddTier = () => {
    const newTier: ServiceTier = {
      id: `tier-${Date.now()}`,
      name: "45-Min Mentoring Session",
      duration_mins: 45,
      price_inr: 799,
      description: "Personalized coaching tailored to your technical career goals.",
      delivery_mode: "google_meet",
      features: ["45 min live video call", "Actionable recommendations", "Session notes"],
      is_popular: false,
    };
    onChange([...tiers, newTier]);
    toast.success("New service tier added");
  };

  const handleUpdateTier = (id: string, patch: Partial<ServiceTier>) => {
    onChange(tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const handleRemoveTier = (id: string) => {
    onChange(tiers.filter((t) => t.id !== id));
    toast.success("Tier removed");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div>
          <h4 className="text-sm font-semibold tracking-tight text-foreground font-display">
            Bookable Service Tiers
          </h4>
          <p className="text-xs text-muted-foreground">
            Define pricing packages, duration, deliverables, and preferred meeting software.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAddTier}
          className="text-xs h-8 gap-1.5 rounded-xl border-border/80"
        >
          <Plus className="h-3.5 w-3.5" /> Add Tier
        </Button>
      </div>

      <div className="space-y-3">
        {tiers.map((tier, idx) => (
          <div
            key={tier.id || idx}
            className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3 transition-all hover:border-border hover:shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
              {/* Name & Deliverables */}
              <div className="sm:col-span-6 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Input
                    value={tier.name}
                    onChange={(e) => handleUpdateTier(tier.id, { name: e.target.value })}
                    className="h-8 text-xs font-semibold text-foreground bg-background/50"
                    placeholder="Tier Name (e.g. 60-Min System Design)"
                  />
                  {tier.is_popular && (
                    <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20 shrink-0">
                      Popular
                    </Badge>
                  )}
                </div>

                <Textarea
                  rows={2}
                  value={tier.description}
                  onChange={(e) => handleUpdateTier(tier.id, { description: e.target.value })}
                  className="text-[11px] leading-relaxed bg-background/50"
                  placeholder="Short description of what the client gets..."
                />
              </div>

              {/* Duration & Price */}
              <div className="sm:col-span-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="space-y-1 flex-1">
                    <Label className="text-[10px] text-muted-foreground">Duration</Label>
                    <Select
                      value={String(tier.duration_mins)}
                      onValueChange={(val) => handleUpdateTier(tier.id, { duration_mins: Number(val) })}
                    >
                      <SelectTrigger className="h-8 text-xs bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 Mins</SelectItem>
                        <SelectItem value="45">45 Mins</SelectItem>
                        <SelectItem value="60">60 Mins</SelectItem>
                        <SelectItem value="90">90 Mins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 flex-1">
                    <Label className="text-[10px] text-muted-foreground">Price (₹ INR)</Label>
                    <Input
                      type="number"
                      value={tier.price_inr}
                      onChange={(e) => handleUpdateTier(tier.id, { price_inr: Number(e.target.value) || 0 })}
                      className="h-8 text-xs font-semibold bg-background/50"
                      placeholder="999"
                    />
                  </div>
                </div>

                {/* Delivery Mode */}
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Default Tool</Label>
                  <Select
                    value={tier.delivery_mode}
                    onValueChange={(val: any) => handleUpdateTier(tier.id, { delivery_mode: val })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google_meet">Google Meet</SelectItem>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="cal_com">Cal.com</SelectItem>
                      <SelectItem value="microsoft_teams">Microsoft Teams</SelectItem>
                      <SelectItem value="gmail">Gmail Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions & Popular Toggle */}
              <div className="sm:col-span-3 flex sm:flex-col items-center sm:items-end justify-between gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTier(tier.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  title="Delete Tier"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">Highlight</span>
                  <Switch
                    checked={Boolean(tier.is_popular)}
                    onCheckedChange={(val) => handleUpdateTier(tier.id, { is_popular: val })}
                  />
                </div>
              </div>
            </div>

            {/* Features (Bulleted deliverables) */}
            <div className="pt-2 border-t border-border/40">
              <Label className="text-[10px] text-muted-foreground">Deliverables (comma-separated)</Label>
              <Input
                value={(tier.features || []).join(", ")}
                onChange={(e) =>
                  handleUpdateTier(tier.id, {
                    features: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="Live video call, Session recording link, Written action items"
                className="h-7 text-[11px] bg-background/50 mt-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
