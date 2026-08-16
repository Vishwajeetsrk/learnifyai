import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, Twitter, MapPin, Phone } from "lucide-react";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us — Learnify AI" },
      {
        name: "description",
        content: "Get in touch with Learnify AI support, sales, or customer service.",
      },
    ],
  }),
  component: ContactUsPage,
});

function ContactUsPage() {
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
      eyebrow="Contact Us"
      title="Get in touch with Learnify AI."
      subtitle="For support, billing inquiries, enterprise sales, or general questions, reach out to our team."
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
            href={`mailto:${s?.contact_email ?? "support@learnifyai.in"}`}
            className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 hover:border-primary/40 transition"
          >
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Email Customer Support</h3>
              <p className="text-sm text-muted-foreground">
                {s?.contact_email ?? "support@learnifyai.in"} / vishwajeetsrk@gmail.com
              </p>
            </div>
          </a>
          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Operating Address</h3>
              <p className="text-sm text-muted-foreground">
                Learnify AI EdTech Platform, India
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold">Support Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday – Saturday, 9:00 AM – 7:00 PM IST
              </p>
            </div>
          </div>
        </div>
      </div>
    </MarketingPage>
  );
}
