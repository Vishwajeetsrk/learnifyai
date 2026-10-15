"use client";

import React, { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { auditGitHubProfile, GitHubAuditReport } from "@/lib/github-auditor.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Github,
  Search,
  Star,
  GitFork,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  BookOpen,
  MapPin,
  Building,
  Globe,
  Loader2,
  ArrowRight,
  Copy,
  Check,
  GitPullRequest,
  Briefcase,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { CourseBrandLogo } from "@/components/courses/CourseBrandLogo";

export function GitHubAuditorView({ defaultUsername = "" }: { defaultUsername?: string }) {
  const auditFn = useServerFn(auditGitHubProfile);
  const [username, setUsername] = useState(defaultUsername);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GitHubAuditReport | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAudit = async (e?: React.FormEvent, customUser?: string) => {
    if (e) e.preventDefault();
    const query = (customUser || username).trim();
    if (!query) {
      toast.error("Please enter a GitHub username or repository link");
      return;
    }

    setLoading(true);
    try {
      const data = await auditFn({ data: { username: query } });
      setReport(data);
      toast.success(
        data.targetRepo
          ? `Audited repository ${data.username}/${data.targetRepo} successfully!`
          : `Audited @${data.username} successfully!`,
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to audit GitHub profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!report) return;
    const summary = [
      `# GitHub Recruiter Technical Audit: @${report.username}`,
      `**Candidate:** ${report.name || report.username} | **Grade:** ${report.grade} (${report.overallScore}/100 pts)`,
      report.targetRepo ? `**Audited Repository:** ${report.username}/${report.targetRepo}` : "",
      "",
      "## Score Breakdown",
      `- Profile Identity: ${report.breakdown.profileCompleteness}/20`,
      `- Repo Documentation: ${report.breakdown.repoQuality}/30`,
      `- Activity & Impact: ${report.breakdown.activityAndImpact}/30`,
      `- Recruiter Readiness: ${report.breakdown.recruiterReadiness}/20`,
      "",
      "## Primary Tech Stack",
      report.languages.map((l) => `- ${l.name}: ${l.percentage}% (${l.count} repos)`).join("\n"),
      "",
      "## Recruiter Green Flags",
      report.strengths.map((s) => `- ${s}`).join("\n"),
      "",
      "## Recommended Improvements",
      report.actionItems.map((a, i) => `${i + 1}. ${a}`).join("\n"),
      "",
      `Audited via Learnify AI Career Studio on ${new Date().toLocaleDateString("en-IN")}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
    toast.success("Recruiter audit summary copied to clipboard!");
  };

  const handleImportToPortfolio = () => {
    if (!report) return;
    const skillsString = report.languages.map((l) => l.name).join(", ");
    const projectsList = report.topRepos.map((r) => ({
      name: r.name,
      description: r.description || "Production repository with comprehensive architecture.",
      techStack: r.language || "TypeScript",
      liveUrl: "",
      githubUrl: r.url,
      featured: true,
    }));
    const formData = {
      fullName: report.name || report.username,
      tagline: report.bio || `${report.languages[0]?.name || "Software"} Engineer`,
      bio: report.bio || `Developer with ${report.publicRepos} public repositories specializing in modern full-stack engineering.`,
      skills: skillsString,
      softSkills: "Problem Solving, System Architecture, Code Review",
      tools: "Git, GitHub, CI/CD, VS Code",
      projects: "",
      socialLinks: report.blog ? `portfolio: ${report.blog}` : "",
      experience: `Maintains ${report.publicRepos} public repositories across ${report.languages.length} programming environments.`,
      education: "",
      style: "developer",
    };

    try {
      localStorage.setItem("portfolio_builder_projects", JSON.stringify(projectsList));
      localStorage.setItem("portfolio_builder_form", JSON.stringify(formData));
      window.dispatchEvent(new Event("portfolio_data_updated"));
      toast.success(`Imported @${report.username}'s profile & ${projectsList.length} repositories into Portfolio Builder!`);

      const currentUrl = new URL(window.location.href);
      if (currentUrl.pathname.includes("career-studio")) {
        currentUrl.searchParams.set("tab", "portfolio");
        window.history.pushState({}, "", currentUrl.toString());
        window.dispatchEvent(new PopStateEvent("popstate"));
      } else {
        window.location.href = "/career-studio?tab=portfolio";
      }
    } catch {
      toast.error("Failed to export data to Portfolio Builder.");
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
      case "B":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30";
      case "C":
        return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      default:
        return "text-rose-500 bg-rose-500/10 border-rose-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700/60 shadow-lg">
        <div>
          <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1.5 mb-1">
            <Github className="h-3.5 w-3.5" /> Recruiter Technical Audit
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white">
            GitHub Profile &amp; Repository Auditor
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Audit your public repositories, README clarity, contribution impact, and recruiter impression score.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAudit} className="flex gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub handle or repo (e.g. Vishwajeetsrk or Vishwajeetsrk/learnifyai)..."
            className="pl-9 h-11 bg-card text-sm border-border focus-visible:ring-indigo-500"
            aria-label="GitHub handle or repository path"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 px-6 cursor-pointer gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Auditing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Run Audit
            </>
          )}
        </Button>
      </form>

      {/* SKELETAL SHIMMER LOADING STATE */}
      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5 bg-card border-border flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full shrink-0" />
              <div className="space-y-2 flex-1 min-w-0">
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-3.5 w-1/2 rounded" />
                <Skeleton className="h-3 w-full rounded mt-1" />
              </div>
            </Card>

            <Card className="p-5 bg-card border-border flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-40 rounded" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-10 w-24 rounded" />
              <Skeleton className="h-3 w-5/6 rounded" />
            </Card>

            <Card className="p-5 bg-card border-border space-y-3">
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-2 w-full rounded-full" />
            </Card>
          </div>

          <Card className="p-5 bg-card border-border space-y-3">
            <Skeleton className="h-4 w-48 rounded" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-36 rounded-full" />
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5 space-y-3">
              <Skeleton className="h-4 w-44 rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-5/6 rounded" />
              <Skeleton className="h-3.5 w-4/5 rounded" />
            </Card>
            <Card className="p-5 space-y-3">
              <Skeleton className="h-4 w-44 rounded" />
              <Skeleton className="h-3.5 w-full rounded" />
              <Skeleton className="h-3.5 w-5/6 rounded" />
            </Card>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="p-4 space-y-3">
              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </Card>
            <Card className="p-4 space-y-3">
              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </Card>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!report && !loading && (
        <Card className="p-8 text-center bg-card border-dashed">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Github className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-base">Analyze Any Developer Profile or Repository</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Get an instant recruiter breakdown covering repository documentation, commit consistency, tech stack diversity, and actionable fixes.
          </p>
          <div className="flex justify-center flex-wrap gap-2 mt-4">
            {[
              { label: "Vishwajeetsrk/learnifyai", val: "Vishwajeetsrk/learnifyai" },
              { label: "@torvalds", val: "torvalds" },
              { label: "@gaearon", val: "gaearon" },
              { label: "@shadcn", val: "shadcn" },
            ].map((item) => (
              <Button
                key={item.val}
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername(item.val);
                  handleAudit(undefined, item.val);
                }}
                className="text-xs h-7 cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-colors"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Audit Report View */}
      {report && !loading && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Target Repo Highlight Banner if applicable */}
          {report.targetRepo && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <div className="flex items-center gap-2.5">
                <GitPullRequest className="h-4 w-4 shrink-0 text-indigo-400" />
                <div className="text-xs">
                  <span className="font-semibold text-foreground">Targeted Repository Audited: </span>
                  <span className="font-mono text-indigo-400 font-medium">
                    {report.username}/{report.targetRepo}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-[11px] border-indigo-500/40 text-indigo-400 bg-indigo-500/5">
                Prioritized in Report
              </Badge>
            </div>
          )}

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-card border border-border shadow-2xs">
            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" /> Recruiter Evaluation Summary
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyReport}
                className="h-8 text-xs gap-1.5 cursor-pointer hover:border-primary/40"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Audit Summary"}
              </Button>

              <Button
                size="sm"
                onClick={handleImportToPortfolio}
                className="h-8 text-xs gap-1.5 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-white font-medium cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" /> Build Portfolio from GitHub
              </Button>
            </div>
          </div>

          {/* Top Score Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Candidate Card */}
            <Card className="p-5 bg-card border-border flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <img
                src={report.avatarUrl}
                alt={report.username}
                className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base text-foreground truncate">{report.name}</h3>
                <p className="text-xs text-muted-foreground font-mono truncate">@{report.username}</p>
                {report.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{report.bio}</p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                  <span><strong>{report.publicRepos}</strong> repos</span>
                  <span><strong>{report.followers}</strong> followers</span>
                  <span>Joined <strong>{report.createdAt}</strong></span>
                </div>
              </div>
            </Card>

            {/* Recruiter Score & Grade */}
            <Card className="p-5 bg-card border-border flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Recruiter Readiness Score
                </span>
                <span
                  className={`text-sm font-extrabold px-2.5 py-0.5 rounded-full border ${getGradeColor(
                    report.grade,
                  )}`}
                >
                  Grade {report.grade}
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-display text-foreground">
                  {report.overallScore}
                </span>
                <span className="text-xs text-muted-foreground font-medium">/ 100 points</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Synthesized across repository documentation, active commits, and tech showcase impact.
              </p>
            </Card>

            {/* Breakdown Bars */}
            <Card className="p-5 bg-card border-border space-y-2.5 text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Profile Identity:</span>
                  <span className="font-semibold text-foreground">{report.breakdown.profileCompleteness}/20</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${(report.breakdown.profileCompleteness / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Repo Documentation:</span>
                  <span className="font-semibold text-foreground">{report.breakdown.repoQuality}/30</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(report.breakdown.repoQuality / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Activity &amp; Impact:</span>
                  <span className="font-semibold text-foreground">{report.breakdown.activityAndImpact}/30</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${(report.breakdown.activityAndImpact / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Recruiter Readiness:</span>
                  <span className="font-semibold text-foreground">{report.breakdown.recruiterReadiness}/20</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(report.breakdown.recruiterReadiness / 20) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Tech Stack Distribution */}
          {report.languages.length > 0 && (
            <Card className="p-5 bg-card border-border">
              <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-500" /> Primary Tech Stack Distribution
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.languages.map((lang) => (
                  <Badge
                    key={lang.name}
                    variant="secondary"
                    className="text-xs px-3 py-1 gap-2 bg-muted/70 border border-border transition-all duration-150 hover:bg-muted"
                  >
                    <CourseBrandLogo brand={lang.name} size={13} />
                    <span>{lang.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {lang.percentage}% ({lang.count} repos)
                    </span>
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Red Flags & Strengths */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Strengths */}
            <Card className="p-5 bg-emerald-500/5 border-emerald-500/20">
              <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Recruiter Green Flags ({report.strengths.length})
              </h3>
              <ul className="space-y-2 text-xs text-foreground">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Red Flags */}
            <Card className="p-5 bg-rose-500/5 border-rose-500/20">
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> Areas for Improvement ({report.redFlags.length})
              </h3>
              {report.redFlags.length === 0 ? (
                <p className="text-xs text-muted-foreground">No critical red flags found! Great job maintaining your repositories.</p>
              ) : (
                <ul className="space-y-2 text-xs text-foreground">
                  {report.redFlags.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold mt-0.5">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          {/* Action Items */}
          <Card className="p-5 bg-card border-border">
            <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Top Recommended Profile Fixes
            </h3>
            <div className="space-y-2.5">
              {report.actionItems.map((act, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs transition-all duration-150 hover:bg-muted/70"
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-foreground">{act}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Repositories */}
          {report.topRepos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Github className="h-4 w-4 text-primary" /> Top Public Showcase Repositories
                </h3>
                <span className="text-xs text-muted-foreground">Ranked by stars &amp; relevance</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {report.topRepos.map((repo) => {
                  const isTargeted = Boolean(repo.isTargeted);
                  return (
                    <Card
                      key={repo.name}
                      className={`p-4 bg-card border flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                        isTargeted
                          ? "border-indigo-500/50 bg-indigo-500/[0.03] ring-1 ring-indigo-500/20"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5 truncate"
                          >
                            <span className="truncate">{repo.name}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                          </a>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                            {isTargeted && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0 border-indigo-500/40 text-indigo-400 bg-indigo-500/10 font-mono"
                              >
                                Target Repo
                              </Badge>
                            )}
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-amber-500" />
                              {repo.stars}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <GitFork className="h-3 w-3" />
                              {repo.forks}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed">
                          {repo.description || "No description provided."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/60 mt-3">
                        <span className="flex items-center gap-1.5">
                          {repo.language && <CourseBrandLogo brand={repo.language} size={11} />}
                          <span className="font-medium">{repo.language || "Plain"}</span>
                        </span>
                        <span>Updated {repo.updatedAt}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
