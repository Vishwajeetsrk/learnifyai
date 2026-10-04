"use client";

import React, { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getIndianTechJobs, syncJobBoardFeeds, JobListing } from "@/lib/job-board.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Search,
  MapPin,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Building,
  CheckCircle2,
  Filter,
  DollarSign,
  Clock,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { CourseBrandLogo } from "@/components/courses/CourseBrandLogo";

const SOURCES = ["All", "Naukri", "Internshala", "LinkedIn", "Hasjob", "Direct"];
const LOCATIONS = ["All", "Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi NCR", "Remote"];
const TYPES = ["All", "Full-Time", "Internship"];

export function JobBoardView({ userSkills = "" }: { userSkills?: string }) {
  const fetchJobsFn = useServerFn(getIndianTechJobs);
  const syncFeedsFn = useServerFn(syncJobBoardFeeds);

  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [skillsFilter, setSkillsFilter] = useState(userSkills);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await fetchJobsFn({
        data: {
          source: selectedSource,
          location: selectedLocation,
          type: selectedType,
          query: searchQuery,
          candidateSkills: skillsFilter,
        },
      });
      setJobs(res.jobs || []);
    } catch {
      toast.error("Failed to fetch job feeds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [selectedSource, selectedLocation, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncFeedsFn({ data: {} });
      toast.success(`Synced ${res.jobsCount} live Indian tech jobs from Naukri & Internshala!`);
      await loadJobs();
    } catch {
      toast.error("Sync feed error. Using active cached feed.");
    } finally {
      setSyncing(false);
    }
  };

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "Naukri":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900";
      case "Internshala":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900";
      case "LinkedIn":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900";
      case "Hasjob":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900";
      default:
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-border">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-1.5 mb-1">
            <Briefcase className="h-3.5 w-3.5" /> Direct Indian Tech Job Feeds
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-foreground">
            Live Jobs & Internships (Naukri, Internshala, LinkedIn)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time tech openings across Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR & Remote India.
          </p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing}
          variant="outline"
          size="sm"
          className="gap-2 shrink-0 bg-background/80 hover:bg-background border-border shadow-xs cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing Feeds..." : "Sync Live Feeds"}
        </Button>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, or tech stack (e.g. React, Python, SDE)..."
              className="pl-9 h-11 bg-card border-border/80 text-sm"
            />
          </div>
          <Button type="submit" className="h-11 px-5 cursor-pointer">
            Search
          </Button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Source Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Filter className="h-3 w-3" /> Source:
            </span>
            {SOURCES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSource(s)}
                className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer font-medium ${
                  selectedSource === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground border-border/70"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Location Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" /> City:
            </span>
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelectedLocation(loc)}
                className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer font-medium ${
                  selectedLocation === loc
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground border-border/70"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer font-medium ${
                  selectedType === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground border-border/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Resume Skill Matching Bar */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/40 border border-border/70 text-xs">
          <div className="flex items-center gap-2 flex-1">
            <Sparkles className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="font-semibold text-foreground shrink-0">Match With My Skills:</span>
            <Input
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              placeholder="e.g. React, TypeScript, Python, Node.js, Docker..."
              className="h-8 text-xs bg-background max-w-md border-border"
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={loadJobs}
              className="h-8 text-xs cursor-pointer"
            >
              Calculate Match
            </Button>
          </div>
          <span className="text-[11px] text-muted-foreground shrink-0 hidden md:inline">
            Showing {jobs.length} verified listings
          </span>
        </div>
      </div>

      {/* Job Cards Grid */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-44 rounded-2xl bg-muted/30 animate-pulse border border-border/50"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="p-8 text-center bg-card border-dashed">
          <Briefcase className="h-10 w-10 text-muted-foreground/60 mx-auto mb-2" />
          <h3 className="font-semibold text-base">No matching jobs found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Try adjusting your source or city filter, or clear your search term to see all live openings.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSource("All");
              setSelectedLocation("All");
              setSelectedType("All");
              setSearchQuery("");
            }}
            className="mt-4 text-xs cursor-pointer"
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="overflow-hidden bg-card border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <CardContent className="p-5 space-y-3.5">
                {/* Header: Company, Source & Match Score */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5" />
                      {job.company}
                    </span>
                    <h3 className="text-base font-bold text-foreground mt-0.5 line-clamp-1 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {job.matchScore !== undefined && job.matchScore > 0 && (
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold px-2 py-0.5 gap-1 ${
                          job.matchScore >= 70
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                        }`}
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {job.matchScore}% Match
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold border ${getSourceBadgeColor(
                        job.source,
                      )}`}
                    >
                      {job.source}
                    </Badge>
                  </div>
                </div>

                {/* Metadata Pills: Location, Experience, Salary */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {job.experience}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    ₹ {job.salary.replace(/^₹\s*/, "")}
                  </span>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Tech Skills Chips with Devicons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map((skill) => {
                    const isMatched = job.matchingSkills?.some(
                      (ms) => ms.toLowerCase() === skill.toLowerCase(),
                    );
                    return (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className={`text-[10px] px-2 py-0.5 gap-1.5 ${
                          isMatched
                            ? "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 font-semibold"
                            : "bg-muted/70 text-muted-foreground border border-border/50"
                        }`}
                      >
                        <CourseBrandLogo brand={skill} size={11} />
                        <span>{skill}</span>
                        {isMatched && <CheckCircle2 className="h-2.5 w-2.5 text-indigo-500" />}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>

              {/* Action Footer */}
              <div className="px-5 py-3 bg-muted/20 border-t border-border flex items-center justify-between text-xs">
                <span className="text-[11px] text-muted-foreground">Posted {job.postedAt}</span>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                  Apply on {job.source}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
