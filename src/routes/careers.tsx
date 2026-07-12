import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Loader2 } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { useState, useEffect } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const careersSearchSchema = z.object({
  apply: z.string().optional(),
});

export const Route = createFileRoute("/careers")({
  validateSearch: (search: Record<string, unknown>) => careersSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Careers — Learnify AI" },
      {
        name: "description",
        content:
          "Help us build the intelligent learning OS. Open roles across engineering, design, and content.",
      },
      { property: "og:title", content: "Careers — Learnify AI" },
      {
        property: "og:description",
        content: "Join Learnify AI — open roles across engineering, design, content, and growth.",
      },
    ],
  }),
  component: CareersPage,
});

type JobRow = {
  id: string;
  title: string;
  team: string;
  location: string;
  description: string | null;
  apply_url: string | null;
};

function JobApplyDialog({
  job,
  isOpen,
  onClose,
}: {
  job: JobRow | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !resumeText.trim()) {
      return toast.error("Please fill in Name, Email and Resume fields.");
    }
    setSubmitting(true);
    try {
      const applications = JSON.parse(localStorage.getItem("job_applications") || "[]");
      applications.push({
        id: Math.random().toString(),
        jobId: job?.id,
        jobTitle: job?.title,
        name,
        email,
        phone,
        experience,
        resumeText,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem("job_applications", JSON.stringify(applications));

      await new Promise((r) => setTimeout(r, 1000));

      toast.success("Application submitted successfully! Our team will contact you soon.");
      onClose();
      setName("");
      setEmail("");
      setPhone("");
      setExperience("");
      setResumeText("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> Apply for {job?.title}
          </DialogTitle>
          <DialogDescription>
            {job?.team} · {job?.location}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="applicant-name">Full Name</Label>
            <Input
              id="applicant-name"
              placeholder="Vishwajeet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="applicant-email">Email Address</Label>
              <Input
                id="applicant-email"
                type="email"
                placeholder="vishwajeetsrk@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="applicant-phone">Phone Number</Label>
              <Input
                id="applicant-phone"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="applicant-exp">Years of Relevant Experience</Label>
            <Input
              id="applicant-exp"
              placeholder="e.g. 3 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="applicant-resume">Resume / CV (Paste Text or Link)</Label>
            <Textarea
              id="applicant-resume"
              rows={4}
              placeholder="Paste your LinkedIn URL, Google Drive Resume link, or plain text CV here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              required
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Submit Application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CareersPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const applyJobId = search.apply;
  const { data: settings } = useSiteSettings();
  const careersEmail = settings?.careers_email || "careers@learnify.ai";
  const { data: roles, isLoading } = useQuery({
    queryKey: ["jobs-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_postings")
        .select("id,title,team,location,description,apply_url")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JobRow[];
    },
  });

  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);

  useEffect(() => {
    if (applyJobId && roles && roles.length > 0) {
      const matched = roles.find((r) => r.id === applyJobId);
      if (matched) {
        setSelectedJob(matched);
      }
    }
  }, [applyJobId, roles]);

  const handleApplyClick = (r: JobRow, e: React.MouseEvent) => {
    if (r.apply_url && r.apply_url.startsWith("http")) {
      return;
    }
    e.preventDefault();
    setSelectedJob(r);
    (navigate as any)({ search: { apply: r.id } });
  };

  const handleDialogClose = () => {
    setSelectedJob(null);
    (navigate as any)({ search: { apply: undefined } });
  };

  return (
    <MarketingPage
      eyebrow="Careers"
      title="Build the future of learning with us."
      subtitle="A small, ambitious team building tools for a billion learners."
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !roles || roles.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No open roles right now. Email us anytime.
        </p>
      ) : (
        <StaggerGroup className="space-y-3" stagger={0.06}>
          {roles.map((r) => (
            <StaggerItem key={r.id}>
              <motion.a
                href={r.apply_url || `mailto:${careersEmail}?subject=Application`}
                target={r.apply_url?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                onClick={(e) => handleApplyClick(r, e)}
                whileHover={{ x: 4, y: -2 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="block rounded-xl border border-border/60 bg-card p-5 hover:shadow-glow hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {r.title}
                    </h3>
                    {r.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {r.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {r.team}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {r.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-primary shrink-0 transition-transform group-hover:translate-x-1">
                    Apply →
                  </span>
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
      <Reveal delay={0.2}>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Don't see your role? Email{" "}
          <a className="text-primary hover:underline" href={`mailto:${careersEmail}`}>
            {careersEmail}
          </a>
          .
        </p>
      </Reveal>

      <JobApplyDialog job={selectedJob} isOpen={!!selectedJob} onClose={handleDialogClose} />
    </MarketingPage>
  );
}
