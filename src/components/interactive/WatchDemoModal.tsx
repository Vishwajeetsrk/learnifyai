import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Sparkles, Brain, DollarSign, BookOpen, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface WatchDemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WatchDemoModal({ open, onOpenChange }: WatchDemoModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl bg-card border shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 text-white relative">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Learnify AI Interactive Tour
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display">
            Watch & Experience Learnify AI
          </h2>
          <p className="text-sm text-indigo-200/90 mt-1 max-w-xl">
            Discover how intelligent tutoring, 100+ career courses, and the creator economy work together.
          </p>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2 text-xs md:text-sm">
                <Brain className="w-4 h-4 text-primary" /> What Is There?
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex items-center gap-2 text-xs md:text-sm">
                <BookOpen className="w-4 h-4 text-indigo-500" /> How To Use It?
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex items-center gap-2 text-xs md:text-sm">
                <DollarSign className="w-4 h-4 text-emerald-500" /> How To Earn?
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: WHAT IS THERE */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-muted/30 hover:border-primary/40 transition">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-3 font-bold">
                    01
                  </div>
                  <h4 className="font-semibold text-base mb-1">AI Tutor & Smart Notes</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    24/7 AI tutor that explains complex concepts, generates instant quizzes, and creates structured study notes.
                  </p>
                </div>
                <div className="p-4 rounded-xl border bg-muted/30 hover:border-primary/40 transition">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center mb-3 font-bold">
                    02
                  </div>
                  <h4 className="font-semibold text-base mb-1">Career Studio 5-in-1</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Resume Builder, ATS Checker, Mock Interview Coach, Skill Gap Analyzer, and Portfolio Builder all integrated.
                  </p>
                </div>
                <div className="p-4 rounded-xl border bg-muted/30 hover:border-primary/40 transition">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3 font-bold">
                    03
                  </div>
                  <h4 className="font-semibold text-base mb-1">Verified QR Certificates</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Earn tamper-proof certificates with QR code verification and 1-click LinkedIn Profile integration.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: HOW TO USE IT */}
            <TabsContent value="usage" className="space-y-4">
              <div className="space-y-3">
                {[
                  { step: "Step 1", title: "Create Your Free Account", desc: "Sign up in 10 seconds. Free plan includes 500 free AI credits every month." },
                  { step: "Step 2", title: "Enroll in Courses & AI Labs", desc: "Choose from 12 Launch Categories spanning Full Stack, Python, Data Science, Cyber Security, UI/UX, and Marketing." },
                  { step: "Step 3", title: "Interact with AI Tutor", desc: "Ask questions anytime during video lessons. Get instant code explanations, quiz practice, and career roadmap guidance." },
                  { step: "Step 4", title: "Complete Assessment & Claim Certificate", desc: "Pass the course assessment to generate a shareable certificate for your resume and LinkedIn." }
                ].map((s) => (
                  <div key={s.step} className="p-3.5 rounded-xl border bg-card flex items-center gap-4">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md shrink-0">
                      {s.step}
                    </span>
                    <div>
                      <h5 className="text-sm font-semibold">{s.title}</h5>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: HOW TO EARN */}
            <TabsContent value="earnings" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-2">
                    <DollarSign className="w-4 h-4" /> Course Creators (80/20 Revenue Split)
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    Publish paid courses or cohort programs. Keep 80% of all sales with automated Cashfree payouts directly to your bank account.
                  </p>
                  <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free or Paid Creator Plans
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Automated GST Invoicing & Tax handling
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border-purple-500/20">
                  <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-2">
                    <GraduationCap className="w-4 h-4" /> 1-on-1 Coaches & Mentors
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    Set your own hourly session rates for resume reviews, mock interviews, and career guidance. Instant wallet top-ups and payouts.
                  </p>
                  <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Free & Paid Coach Tiers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" /> Verified Mentor Badge & Student Ratings
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Ready to elevate your tech & career journey?
            </span>
            <Button size="sm" onClick={() => onOpenChange(false)}>
              Close Tour <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
