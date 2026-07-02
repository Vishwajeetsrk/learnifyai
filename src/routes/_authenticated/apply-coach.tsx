import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, Sparkles, Send, CheckCircle2, Loader2 } from "lucide-react";
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

function ApplyCoachPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: user?.email || "",
    expertise: "",
    hourlyRate: "1499",
    bio: "",
    linkedinUrl: "",
    sampleVideoUrl: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("creator_applications").insert({
        user_id: user.id,
        motivation: `[COACH APPLICATION] Rate: ₹${form.hourlyRate}/hr. Expertise: ${form.expertise}. Bio: ${form.bio}`,
        expertise: form.expertise || null,
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expertise">Primary Area of Expertise</Label>
                    <Input
                      id="expertise"
                      required
                      value={form.expertise}
                      onChange={(e) => update("expertise", e.target.value)}
                      placeholder="Full-Stack Dev, System Design, AI/ML"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Expected Rate (₹ / hr)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      required
                      value={form.hourlyRate}
                      onChange={(e) => update("hourlyRate", e.target.value)}
                    />
                  </div>
                </div>

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
                  <Label htmlFor="sampleVideoUrl">Sample Video / Portfolio Link</Label>
                  <Input
                    id="sampleVideoUrl"
                    type="url"
                    value={form.sampleVideoUrl}
                    onChange={(e) => update("sampleVideoUrl", e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Tell us about your coaching background</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    required
                    value={form.bio}
                    onChange={(e) => update("bio", e.target.value)}
                    placeholder="Briefly describe your mentorship experience and what topics you plan to cover..."
                  />
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
