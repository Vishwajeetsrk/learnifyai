import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, Twitter } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Learnify AI" },
      {
        name: "description",
        content:
          "Get in touch with the Learnify AI team. Sales, support, partnerships, or just say hi.",
      },
      { property: "og:title", content: "Contact — Learnify AI" },
      {
        property: "og:description",
        content: "Reach the Learnify AI team by email, chat, or social.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  const { data: s } = useSiteSettings();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent — we'll get back within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <MarketingPage
      eyebrow="Contact"
      title="Say hello."
      subtitle="Sales, support, partnerships, or just a friendly chat — we read everything."
    >
      <div className="grid md:grid-cols-2 gap-10">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-border/60 bg-card p-6"
        >
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input required placeholder="Your name" className="mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input required type="email" placeholder="you@example.com" className="mt-1.5" />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea required rows={5} placeholder="How can we help?" className="mt-1.5" />
          </div>
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
        <div className="space-y-5">
          <a
            href={`mailto:${s?.contact_email ?? "hello@learnify.ai"}`}
            className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 transition"
          >
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Email us</h3>
              <p className="text-sm text-muted-foreground">
                {s?.contact_email ?? "hello@learnify.ai"}
              </p>
            </div>
          </a>
          <a
            href={s?.discord_url || "#"}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 transition"
          >
            <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Join Discord</h3>
              <p className="text-sm text-muted-foreground">
                {s?.discord_label ?? "Chat with the community in real time."}
              </p>
            </div>
          </a>
          <a
            href={s?.twitter_url || "#"}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 transition"
          >
            <Twitter className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Follow on X</h3>
              <p className="text-sm text-muted-foreground">{s?.twitter_handle ?? "@learnifyai"}</p>
            </div>
          </a>
        </div>
      </div>
    </MarketingPage>
  );
}
