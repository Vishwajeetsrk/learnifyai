import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Sparkles, UserCheck, GraduationCap, DollarSign, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2, Search } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Documentation & Platform Guides — Learnify AI" },
      { name: "description", content: "Complete user documentation, student guides, feature walk-throughs, and creator/coach rules." },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("students");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-gradient-to-b from-primary/10 via-background to-background border-b py-16 md:py-20">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <BookOpen className="w-4 h-4" /> Official Knowledge Base
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
              Learnify AI Documentation
            </h1>
            <p className="mt-4 text-muted-foreground text-base md:text-lg">
              Everything you need to master AI tutoring, career tools, course publishing, and coach sessions.
            </p>

            <div className="relative max-w-xl mx-auto mt-8">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search guides, AI credits, creator rules, certificates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-card shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* GUIDES TABS */}
        <section className="container mx-auto px-6 py-12 max-w-5xl">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid grid-cols-3 mb-10 h-12">
              <TabsTrigger value="students" className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-primary" /> Student & User Guide
              </TabsTrigger>
              <TabsTrigger value="creators" className="flex items-center gap-2 text-sm">
                <UserCheck className="w-4 h-4 text-purple-600" /> Creator Guide (Free vs Paid)
              </TabsTrigger>
              <TabsTrigger value="coaches" className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Coach Guide (Free vs Paid)
              </TabsTrigger>
            </TabsList>

            {/* STUDENTS DOCUMENTATION */}
            <TabsContent value="students" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border bg-card shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> AI Tutor & Credits System
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Learnify AI provides context-aware AI tutoring for all courses. Starter tier accounts receive 500 free AI credits every month. Pro tier accounts receive 10,000 AI credits/mo.
                  </p>
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      1 AI Tutor Question = 5 Credits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      1 Resume Generation = 50 Credits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      1 Mock Interview Session = 100 Credits
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl border bg-card shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" /> Certificate Verification
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Upon completing course requirements and scoring &ge; 70% in assessments, a cryptographic QR-coded certificate is issued.
                  </p>
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      Shareable URL with public verification page
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      1-Click "Add to LinkedIn Profile" button
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            {/* CREATORS DOCUMENTATION */}
            <TabsContent value="creators" className="space-y-8">
              <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
                <h3 className="text-xl font-bold font-display">Creator Tiers & 80/20 Revenue Split</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Learnify AI empowers instructors, software developers, and industry experts to host free or paid courses with automated Cashfree payouts.
                </p>
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border bg-muted/30">
                    <div className="font-bold text-sm text-primary mb-1">Free Creator Tier</div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Publish up to 1 free or paid course</li>
                      <li>• 70% Revenue payout share</li>
                      <li>• Standard community listing</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border bg-purple-500/10 border-purple-500/20">
                    <div className="font-bold text-sm text-purple-600 mb-1">Paid / Verified Creator Tier</div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Unlimited paid courses & cohorts</li>
                      <li>• 80% Revenue payout share</li>
                      <li>• Verified Creator Badge & Featured Placement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* COACHES DOCUMENTATION */}
            <TabsContent value="coaches" className="space-y-8">
              <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
                <h3 className="text-xl font-bold font-display">1-on-1 Coaching & Mentorship Program</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Coaches can set their own availability and pricing for 1-on-1 resume feedback, mock interviews, and career roadmaps.
                </p>
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border bg-muted/30">
                    <div className="font-bold text-sm text-primary mb-1">Free Coach Tier</div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Offer free 15-min discovery sessions</li>
                      <li>• Community profile page</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20">
                    <div className="font-bold text-sm text-emerald-600 mb-1">Paid / Verified Coach Tier</div>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Custom session rates (e.g. ₹999/hr)</li>
                      <li>• 80% direct payout split via Cashfree</li>
                      <li>• Priority booking calendar integration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
