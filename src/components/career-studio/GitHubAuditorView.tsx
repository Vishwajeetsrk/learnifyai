"use client";

import React, { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { auditGitHubProfile, GitHubAuditReport } from "@/lib/github-auditor.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { toast } from "sonner";
import { CourseBrandLogo } from "@/components/courses/CourseBrandLogo";

export function GitHubAuditorView({ defaultUsername = "" }: { defaultUsername?: string }) {
  const auditFn = useServerFn(auditGitHubProfile);
  const [username, setUsername] = useState(defaultUsername);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<GitHubAuditReport | null>(null);

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    try {
      const data = await auditFn({ data: { username: username.trim() } });
      setReport(data);
      toast.success(`Audited @${data.username} successfully!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to audit GitHub profile");
    } finally {
      setLoading(false);
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
            GitHub Profile & Repository Auditor
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
            placeholder="Enter GitHub handle (e.g. torvalds or Vishwajeetsrk)..."
            className="pl-9 h-11 bg-card text-sm border-border"
          />
        </div>
        <Button type="submit" disabled={loading} className="h-11 px-6 cursor-pointer gap-2">
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

      {/* Empty State */}
      {!report && !loading && (
        <Card className="p-8 text-center bg-card border-dashed">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Github className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-base">Analyze Any Developer Profile</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Get an instant recruiter breakdown covering repository documentation, commit consistency, tech stack diversity, and actionable fixes.
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {["torvalds", "gaearon", "shadcn"].map((u) => (
              <Button
                key={u}
                variant="outline"
                size="sm"
                onClick={() => {
                  setUsername(u);
                }}
                className="text-xs h-7 cursor-pointer"
              >
                Try @{u}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Audit Report View */}
      {report && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Top Score Overview */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Candidate Card */}
            <Card className="p-5 bg-card border-border flex items-center gap-4">
              <img
                src={report.avatarUrl}
                alt={report.username}
                className="w-16 h-16 rounded-full border-2 border-primary/20 object-cover shadow-sm"
              />
              <div className="min-w-0">
                <h3 className="font-bold text-base text-foreground truncate">{report.name}</h3>
                <p className="text-xs text-muted-foreground font-mono truncate">@{report.username}</p>
                {report.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{report.bio}</p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
                  <span><strong>{report.publicRepos}</strong> repos</span>
                  <span><strong>{report.followers}</strong> followers</span>
                </div>
              </div>
            </Card>

            {/* Recruiter Score & Grade */}
            <Card className="p-5 bg-card border-border flex flex-col justify-between">
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
                Based on documentation quality, project showcase, and activity metrics.
              </p>
            </Card>

            {/* Breakdown Bars */}
            <Card className="p-5 bg-card border-border space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Profile Identity:</span>
                  <span className="font-semibold text-foreground">{report.breakdown.profileCompleteness}/20</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
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
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(report.breakdown.repoQuality / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>Activity & Impact:</span>
                  <span className="font-semibold text-foreground">{report.breakdown.activityAndImpact}/30</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
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
                    className="h-full bg-purple-500 rounded-full"
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
                    className="text-xs px-3 py-1 gap-2 bg-muted/70 border border-border"
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
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs"
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
              <h3 className="text-sm font-bold text-foreground flex items-center justify-between">
                <span>Top Public Showcase Repositories</span>
                <span className="text-xs text-muted-foreground">Ranked by stars & activity</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {report.topRepos.map((repo) => (
                  <Card key={repo.name} className="p-4 bg-card border-border flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          {repo.name}
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </a>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {repo.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/60 mt-3">
                      <span className="flex items-center gap-1">
                        {repo.language && <CourseBrandLogo brand={repo.language} size={11} />}
                        <span>{repo.language || "Plain"}</span>
                      </span>
                      <span>Updated {repo.updatedAt}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
