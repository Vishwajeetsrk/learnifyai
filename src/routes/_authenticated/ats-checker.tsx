import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BarChart3, Loader2, Upload, Sparkles, Check, X, AlertTriangle, ChevronRight, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { checkAtsScore, extractResumeFields } from "@/lib/resume.functions";
import { ResumeFileUpload } from "@/components/ResumeFileUpload";

export const Route = createFileRoute("/_authenticated/ats-checker")({
  head: () => ({ meta: [{ title: "ATS Checker — Learnify AI" }] }),
  component: AtsCheckerPage,
});

function AtsCheckerPage() {
  const checkFn = useServerFn(checkAtsScore);
  const extractFn = useServerFn(extractResumeFields);
  const [tab, setTab] = useState("input");
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");

  const handleFileExtracted = async (text: string) => {
    setResumeText(text);
    setExtracting(true);
    try {
      const fields = await extractFn({ data: { rawText: text } });
      console.log("[ATSChecker] extractResumeFields response:", fields);
      if (fields.targetRole) setTargetRole(fields.targetRole);
      toast.success("Resume parsed! Fields auto-filled.");
    } catch (err: any) {
      console.error("[ATSChecker] extractResumeFields error:", err);
      toast.warning("Resume text captured. Auto-fill failed — fill in target role manually.");
    } finally {
      setExtracting(false);
    }
  };

  const handleCheck = async () => {
    if (!resumeText.trim()) return toast.error("Paste your resume text");
    if (resumeText.trim().length < 50) return toast.error("Resume must be at least 50 characters");
    if (!targetRole.trim()) return toast.error("Enter your target role");

    setLoading(true);
    try {
      const res = await checkFn({
        data: { resumeText: resumeText.trim(), targetRole: targetRole.trim(), industry: industry.trim() || undefined },
      });
      setResult(res);
      setTab("results");
      toast.success("ATS analysis complete!");
    } catch (err: any) {
      toast.error(err.message || "Failed to check resume");
    } finally {
      setLoading(false);
    }
  };

  const gradeColor = (g: string) => {
    switch (g) {
      case "A": return "text-emerald-500";
      case "B": return "text-blue-500";
      case "C": return "text-amber-500";
      case "D": return "text-orange-500";
      case "F": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  const scoreBar = (score: number, label: string, color: string) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-bold", color)}>{score}/100</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color.replace("text-", "bg-").replace("500", "500/80"))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-7xl">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> Career Tools
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-semibold tracking-tight">
              ATS Checker
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Analyze your resume against ATS systems. Get scores, keyword analysis, and improvement suggestions.
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mt-2">
          <TabsList>
            <TabsTrigger value="input">
              <Upload className="h-3.5 w-3.5 mr-1.5" /> Paste Resume
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>
              <BarChart3 className="h-3.5 w-3.5 mr-1.5" /> Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="pt-4 space-y-4 max-w-2xl">
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                Upload resume file to auto-fill
              </div>
              <ResumeFileUpload onTextExtracted={handleFileExtracted} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Paste Resume Text *</Label>
                {resumeText && (
                  <span className="text-[11px] text-muted-foreground">{resumeText.length.toLocaleString()} chars</span>
                )}
              </div>
              <Textarea
                rows={12}
                placeholder={`John Doe
john@example.com | +1 555-0123
LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer...

SKILLS
JavaScript, React, Node.js...

EXPERIENCE
Senior Engineer at Tech Corp (2020-Present)
- Led team of 5...
...`}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Target Role *</Label>
                <Input
                  placeholder="e.g. Senior Frontend Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Input
                  placeholder="e.g. Fintech, Healthcare, SaaS"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>
            <Button size="lg" onClick={handleCheck} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              {loading ? "Analyzing..." : "Check ATS Score"}
            </Button>
          </TabsContent>

          <TabsContent value="results" className="pt-4">
            {result && (
              <div className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Overall Score", score: result.overall_score, color: "text-emerald-500" },
                    { label: "Format", score: result.format_score, color: "text-blue-500" },
                    { label: "Keywords", score: result.keywords_score, color: "text-amber-500" },
                    { label: "Readability", score: result.readability_score, color: "text-violet-500" },
                    { label: "Impact", score: result.impact_score, color: "text-rose-500" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border bg-card p-4">
                      <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                      <div className={cn("text-2xl font-bold", s.color)}>{s.score}</div>
                    </div>
                  ))}
                  <div className="rounded-xl border bg-card p-4">
                    <div className="text-xs text-muted-foreground mb-1">Grade</div>
                    <div className={cn("text-2xl font-bold", gradeColor(result.grade))}>{result.grade}</div>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-5 space-y-3">
                  <h3 className="font-semibold text-sm">Detailed Scores</h3>
                  <div className="space-y-3">
                    {scoreBar(result.format_score, "Format & Structure", "text-blue-500")}
                    {scoreBar(result.keywords_score, "Keyword Optimization", "text-amber-500")}
                    {scoreBar(result.readability_score, "Readability", "text-violet-500")}
                    {scoreBar(result.impact_score, "Impact & Achievements", "text-rose-500")}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full", result.section_order_ok ? "bg-emerald-500" : "bg-red-500")} />
                      Section Order {result.section_order_ok ? "OK" : "Fix"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full", result.length_ok ? "bg-emerald-500" : "bg-red-500")} />
                      Length {result.length_ok ? "OK" : "Too Long/Short"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full", result.contact_info_present ? "bg-emerald-500" : "bg-red-500")} />
                      Contact Info {result.contact_info_present ? "OK" : "Missing"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border bg-card p-5 space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" /> Strengths
                    </h3>
                    <ul className="space-y-1.5">
                      {(result.strengths ?? []).map((s: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          {s}
                        </li>
                      ))}
                      {(result.strengths ?? []).length === 0 && (
                        <li className="text-sm text-muted-foreground italic">No strengths detected</li>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-xl border bg-card p-5 space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" /> Weaknesses
                    </h3>
                    <ul className="space-y-1.5">
                      {(result.weaknesses ?? []).map((w: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <X className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                          {w}
                        </li>
                      ))}
                      {(result.weaknesses ?? []).length === 0 && (
                        <li className="text-sm text-muted-foreground italic">No weaknesses detected</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-5 space-y-3">
                  <h3 className="font-semibold text-sm">Keyword Analysis</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-emerald-500" /> Present Keywords
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.present_keywords ?? []).map((k: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-emerald-500/5 border-emerald-500/20">
                            {k}
                          </Badge>
                        ))}
                        {(result.present_keywords ?? []).length === 0 && (
                          <span className="text-xs text-muted-foreground italic">None detected</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                        <X className="h-3 w-3 text-red-400" /> Missing Keywords
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.missing_keywords ?? []).map((k: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-[10px] bg-red-500/5 border-red-500/20">
                            {k}
                          </Badge>
                        ))}
                        {(result.missing_keywords ?? []).length === 0 && (
                          <span className="text-xs text-muted-foreground italic">All key terms present!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <Sparkles className="h-4 w-4" /> Improvement Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {(result.improvement_suggestions ?? []).map((s: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2 text-amber-800 dark:text-amber-200">
                        <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button variant="outline" onClick={() => setTab("input")}>
                  <Upload className="h-4 w-4 mr-1.5" /> Check Another Resume
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
