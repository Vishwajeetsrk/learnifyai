import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { Compass, Send, CheckCircle2, Loader2, Camera, X, Upload } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/apply-coach")({
  head: () => ({ meta: [{ title: "Apply as Coach — Learnify AI" }] }),
  component: ApplyCoachPage,
});

const RATE_PRESETS = [0, 49, 99, 199, 299, 399, 499];

function ApplyCoachPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: user?.email || "",
    expertise: "",
    hourlyRate: "49",
    bio: "",
    linkedinUrl: "",
    sampleVideoUrl: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large. Max 5MB.");
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      let photoUrl = null;
      if (photoPreview) {
        const blob = await fetch(photoPreview).then((r) => r.blob());
        const ext = blob.type.split("/")[1] || "jpg";
        const path = `coach-photos/${user.id}-${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, blob, { contentType: blob.type });
        if (!upErr) {
          const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
          photoUrl = urlData?.publicUrl ?? null;
        }
      }

      const { error } = await supabase.from("creator_applications").insert({
        user_id: user.id,
        role: "coach",
        motivation: `[COACH APPLICATION] Rate: ₹${form.hourlyRate}/hr. Expertise: ${form.expertise}. Bio: ${form.bio}${photoUrl ? `. Photo: ${photoUrl}` : ""}`,
        expertise: form.expertise || null,
        bio: form.bio,
        hourly_rate: Number(form.hourlyRate) || 0,
        avatar_url: photoUrl,
        portfolio_url: form.sampleVideoUrl || form.linkedinUrl || null,
        status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Coach application submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-12">
        {submitted ? (
          <Card className="text-center p-8">
            <CardContent className="space-y-4 pt-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">Application Received!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for applying to join Learnify AI as an expert Coach. Our team will review
                your application within 24–48 hours.
              </p>
              <Button onClick={() => navigate({ to: "/dashboard" })} className="mt-4">
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Compass className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Coach Program
                </span>
              </div>
              <CardTitle className="text-2xl">Apply to Become a Coach</CardTitle>
              <CardDescription>
                Share your expertise, host 1-on-1 mentorship sessions, and earn directly on Learnify
                AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Photo Upload */}
                <div className="flex items-center gap-4">
                  <div
                    className="relative h-20 w-20 rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition overflow-hidden"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {photoPreview ? (
                      <>
                        <img
                          src={photoPreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotoPreview(null);
                          }}
                          className="absolute top-0 right-0 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <Camera className="h-6 w-6 text-muted-foreground/50" />
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
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="text-xs text-primary hover:underline mt-0.5"
                    >
                      {photoPreview ? "Change photo" : "Upload photo"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Primary Area of Expertise *</Label>
                  <Input
                    id="expertise"
                    required
                    value={form.expertise}
                    onChange={(e) => update("expertise", e.target.value)}
                    placeholder="Full-Stack Dev, System Design, AI/ML"
                  />
                </div>

                {/* Hourly Rate with presets */}
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (₹/hr) *</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {RATE_PRESETS.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => update("hourlyRate", String(r))}
                        className={`px-3 py-1.5 rounded-full text-xs border transition ${
                          form.hourlyRate === String(r)
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border hover:border-primary/40 hover:bg-muted"
                        }`}
                      >
                        {r === 0 ? "Free" : `₹${r}/hr`}
                      </button>
                    ))}
                  </div>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min={0}
                    max={499}
                    required
                    value={form.hourlyRate}
                    onChange={(e) => update("hourlyRate", e.target.value)}
                    placeholder="49"
                  />
                  <p className="text-[10px] text-muted-foreground">Range: Free – ₹499/hr</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      value={form.linkedinUrl}
                      onChange={(e) => update("linkedinUrl", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sampleVideoUrl">Sample Video / Portfolio</Label>
                    <Input
                      id="sampleVideoUrl"
                      type="url"
                      value={form.sampleVideoUrl}
                      onChange={(e) => update("sampleVideoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Tell us about your coaching background *</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    required
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    placeholder="Briefly describe your mentorship experience and what topics you plan to cover..."
                  />
                </div>

                <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground space-y-1">
                  <p>
                    By applying, you agree to our{" "}
                    <a href="/terms" target="_blank" className="text-primary underline">
                      Terms of Service
                    </a>
                    ,{" "}
                    <a href="/privacy" target="_blank" className="text-primary underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/refund-policy" target="_blank" className="text-primary underline">
                      Refund Policy
                    </a>
                    .
                  </p>
                  <p>
                    If approved, you may offer 1:1 coaching sessions at the hourly rate you set below.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Submit Coach Application
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
