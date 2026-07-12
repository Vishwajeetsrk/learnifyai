import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles, CheckCircle2, Clock, XCircle, Camera, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/apply-creator")({
  head: () => ({ meta: [{ title: "Apply to Creator Program — Learnify AI" }] }),
  component: ApplyCreator,
});

function ApplyCreator() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [motivation, setMotivation] = useState("");
  const [expertise, setExpertise] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const appQuery = useQuery({
    enabled: !!user,
    queryKey: ["creator-app", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_applications")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large. Max 5MB.");
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  async function submit() {
    if (!user) return;
    if (motivation.trim().length < 30) return toast.error("Tell us a bit more (min 30 chars)");
    setSubmitting(true);

    let photoUrl = null;
    if (photoPreview) {
      try {
        const blob = await fetch(photoPreview).then((r) => r.blob());
        const ext = blob.type.split("/")[1] || "jpg";
        const path = `creator-photos/${user.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, blob, { contentType: blob.type });
        if (!upErr) {
          const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
          photoUrl = urlData?.publicUrl ?? null;
        }
      } catch {}
    }

    const finalMotivation = photoUrl
      ? `${motivation.trim()}\n\n[Photo: ${photoUrl}]`
      : motivation.trim();

    const { error } = await supabase.from("creator_applications").insert({
      user_id: user.id,
      motivation: finalMotivation,
      expertise: expertise.trim() || null,
      portfolio_url: portfolio.trim() || null,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Application submitted!");
    qc.invalidateQueries({ queryKey: ["creator-app"] });
  }

  const existing = appQuery.data;
  const statusIcon =
    existing?.status === "approved"
      ? CheckCircle2
      : existing?.status === "rejected"
        ? XCircle
        : Clock;
  const statusColor =
    existing?.status === "approved"
      ? "text-emerald-600"
      : existing?.status === "rejected"
        ? "text-destructive"
        : "text-amber-500";

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-10 max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-primary font-medium">
          Creator Program
        </div>
        <h1 className="mt-1 text-3xl font-display font-semibold">Become a Learnify Creator</h1>
        <p className="text-muted-foreground mt-2">
          Publish premium courses, earn from every enrollment, and reach thousands of learners.
        </p>

        {appQuery.isLoading ? (
          <div className="mt-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : existing ? (
          <div className="mt-8 rounded-2xl border bg-card p-6 shadow-card">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = statusIcon;
                return <Icon className={`h-5 w-5 ${statusColor}`} />;
              })()}
              <h2 className="font-display text-xl font-semibold capitalize">{existing.status}</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {existing.status === "approved" &&
                "You're in! You can now publish courses from Creator Studio."}
              {existing.status === "pending" &&
                "Your application is under review. We'll notify you shortly."}
              {existing.status === "rejected" && "Your application wasn't accepted this time."}
            </p>
            {existing.admin_notes && (
              <div className="mt-4 rounded-lg bg-muted p-4 text-sm">
                <div className="text-xs uppercase text-muted-foreground mb-1">Admin notes</div>
                {existing.admin_notes}
              </div>
            )}
            {existing.status === "approved" && (
              <Button className="mt-5" onClick={() => nav({ to: "/studio" })}>
                <Sparkles className="h-4 w-4" /> Open Creator Studio
              </Button>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border bg-card p-6 shadow-card space-y-4">
            {/* Photo Upload */}
            <div className="flex items-center gap-4">
              <div
                className="relative h-16 w-16 rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition overflow-hidden shrink-0"
                onClick={() => photoInputRef.current?.click()}
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotoPreview(null);
                      }}
                      className="absolute top-0 right-0 h-4 w-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </>
                ) : (
                  <Camera className="h-5 w-5 text-muted-foreground/50" />
                )}
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div>
                <p className="text-sm font-medium">Profile Photo</p>
                <p className="text-xs text-muted-foreground">Optional · JPG/PNG up to 5MB</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expertise">Your area of expertise</Label>
              <Input
                id="expertise"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                placeholder="e.g. AI engineering, Design systems, DSA"
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="portfolio">Portfolio / website (optional)</Label>
              <Input
                id="portfolio"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://"
                maxLength={255}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="motivation">Why do you want to teach on Learnify?</Label>
              <Textarea
                id="motivation"
                rows={5}
                maxLength={1000}
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Tell us about your experience and what you'd teach…"
              />
              <div className="text-[10px] text-muted-foreground text-right">
                {motivation.length}/1000
              </div>
            </div>
            <Button onClick={submit} disabled={submitting} className="w-full">
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}{" "}
              Submit application
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
