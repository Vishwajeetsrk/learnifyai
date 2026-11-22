import React, { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Upload, X, Loader2, Sparkles, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitUserFeedback } from "@/lib/feedback.functions";
import { useAuth } from "@/hooks/use-auth";

const CATEGORIES = [
  { id: "suggestion", label: "💡 Suggestion" },
  { id: "bug", label: "🐛 Bug Report" },
  { id: "feature_request", label: "⚡ Feature Request" },
  { id: "feedback", label: "💬 General Feedback" },
] as const;

export function UserFeedbackModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const submitFn = useServerFn(submitUserFeedback);

  const [category, setCategory] = useState<"suggestion" | "bug" | "feature_request" | "feedback" | "other">("suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Screenshot must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotDataUrl(reader.result as string);
      toast.success("Screenshot attached!");
    };
    reader.readAsDataURL(file);
  };

  // Clipboard Paste Handler for Quick Screenshots (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setScreenshotDataUrl(reader.result as string);
            toast.success("Pasted screenshot from clipboard!");
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please provide both a subject and message");
      return;
    }

    setSubmitting(true);
    try {
      await submitFn({
        data: {
          category,
          subject: subject.trim(),
          message: message.trim(),
          screenshotDataUrl,
          currentUrl: typeof window !== "undefined" ? window.location.href : null,
          userEmail: user?.email || null,
          userName: user?.user_metadata?.full_name || null,
        },
      });

      setSubmitted(true);
      toast.success("Thank you! Your feedback & screenshot have been sent to our team.");
      setTimeout(() => {
        setSubmitted(false);
        setSubject("");
        setMessage("");
        setScreenshotDataUrl(null);
        onOpenChange(false);
      }, 1800);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl" onPaste={handlePaste}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-[#347A3D] dark:text-emerald-400 flex items-center justify-center">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-display text-base">Feedback &amp; Suggestions</DialogTitle>
              <DialogDescription className="text-xs">
                Help us improve Learnify AI. Screenshots can be attached or pasted directly.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-[#347A3D] flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-base text-foreground">Message Dispatched!</h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              Our engineering team has received your suggestion and screenshot. We review all feedback daily!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {/* Category selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      category === cat.id
                        ? "bg-[#347A3D] text-white font-semibold shadow-xs"
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Subject / Title</Label>
              <Input
                placeholder="e.g. Add dark mode syntax highlighting to Sandpack"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-xs h-9 rounded-xl"
                disabled={submitting}
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Details &amp; Suggestions</Label>
              <Textarea
                placeholder="Explain what happened or what you'd like to see... (Paste image with Ctrl+V anytime)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[110px] text-xs rounded-xl resize-none"
                disabled={submitting}
                required
              />
            </div>

            {/* Screenshot Uploader & Preview */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>Attach Screenshot (Optional)</span>
                <span className="text-[10px] text-muted-foreground">PNG, JPG, WebP up to 5MB</span>
              </Label>

              {screenshotDataUrl ? (
                <div className="relative rounded-xl border overflow-hidden bg-slate-950 p-2 group">
                  <img
                    src={screenshotDataUrl}
                    alt="Feedback screenshot preview"
                    className="max-h-36 w-full object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setScreenshotDataUrl(null)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition"
                    title="Remove screenshot"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border/80 hover:border-[#347A3D] rounded-2xl p-4 cursor-pointer transition bg-muted/20 hover:bg-muted/40">
                  <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium text-foreground">Click to upload or drag &amp; drop</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">or paste screenshot directly with Ctrl+V</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={submitting}
                  />
                </label>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
                className="text-xs h-9 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting || !subject.trim() || !message.trim()}
                className="bg-[#347A3D] hover:bg-[#245F30] text-white font-semibold text-xs h-9 rounded-xl gap-1.5 shadow-sm"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                {submitting ? "Sending..." : "Submit to Team"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
