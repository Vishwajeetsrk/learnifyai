import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, ArrowRight, GraduationCap, BookOpen, PlayCircle, Info } from "lucide-react";
import { getRecommendedCourses } from "@/lib/recommendations.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function RecommendedCourses() {
  const fn = useServerFn(getRecommendedCourses);
  const q = useQuery({
    queryKey: ["recommended-courses"],
    queryFn: () => fn(),
    enabled: typeof window !== "undefined",
    staleTime: 5 * 60 * 1000,
  });

  if (q.isLoading || !q.data || q.data.items.length === 0) return null;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-primary" /> Recommended for you
          </h2>
          <Link
            to="/courses"
            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
          >
            Browse all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{q.data.summary}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {q.data.items.slice(0, 6).map((c) => (
            <div
              key={c.id}
              className="group rounded-2xl border bg-card text-card-foreground overflow-hidden shadow-card hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col motion-reduce:transform-none motion-reduce:transition-none"
            >
              <Link
                to="/courses/$slug"
                params={{ slug: c.slug }}
                preload="intent"
                className="aspect-video bg-muted overflow-hidden block"
                aria-label={`Open ${c.title}`}
              >
                {c.cover_url ? (
                  <img
                    src={c.cover_url}
                    alt={c.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition motion-reduce:transform-none"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <GraduationCap className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </Link>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {c.category && (
                    <Badge variant="secondary" className="text-[10px]">
                      {c.category}
                    </Badge>
                  )}
                  {c.level && (
                    <Badge variant="outline" className="text-[10px]">
                      {c.level}
                    </Badge>
                  )}
                </div>
                <Link
                  to="/courses/$slug"
                  params={{ slug: c.slug }}
                  preload="intent"
                  className="font-display font-semibold text-sm line-clamp-2 group-hover:text-primary transition text-foreground"
                >
                  {c.title}
                </Link>

                {/* Why recommended */}
                <div className="rounded-lg bg-muted/60 border border-border/50 px-2 py-1.5 flex items-start gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium flex items-center gap-1">
                      Why this?
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            aria-label="How recommendations are scored"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Info className="h-2.5 w-2.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[220px] text-xs">
                          Based on the categories and levels of courses you've enrolled in, weighted
                          by your progress.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="text-[11px] text-foreground/80 line-clamp-2">{c.reason}</div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1.5 mt-auto pt-1">
                  <Button asChild size="sm" variant="default" className="h-7 px-2 text-xs flex-1">
                    <Link to="/courses/$slug" params={{ slug: c.slug }} preload="intent">
                      <PlayCircle className="h-3 w-3 mr-1" /> Start learning
                    </Link>
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                        <Link
                          to="/courses/$slug"
                          params={{ slug: c.slug }}
                          hash="syllabus"
                          preload="intent"
                          aria-label="View syllabus"
                        >
                          <BookOpen className="h-3 w-3" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">View syllabus</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
