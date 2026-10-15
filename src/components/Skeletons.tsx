import { Skeleton } from "@/components/ui/skeleton";

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-card">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="mt-3 h-8 w-16 rounded" />
      <Skeleton className="mt-1 h-3 w-20 rounded" />
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-card">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4 space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-32 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}


export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="flex items-end gap-4 -mt-12 px-4">
        <Skeleton className="h-24 w-24 rounded-full border-4 border-card shrink-0" />
        <div className="space-y-2 pb-2">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      </div>
      <div className="px-4 space-y-4">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AchievementsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col items-center text-center">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="mt-2 h-5 w-20 rounded" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border p-4 shadow-sm flex flex-col justify-center"
          >
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="mt-2 h-8 w-20 rounded" />
          </div>
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col items-center gap-2"
          >
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-4 w-16 rounded" />
            <Skeleton className="h-3 w-12 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 space-y-4">
        <Skeleton className="h-5 w-32 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-16 rounded ml-auto" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
      <div className="space-y-4">
        <Skeleton className="h-7 w-32 rounded" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-xl border bg-card">
            <Skeleton className="h-20 w-28 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border bg-card p-6 space-y-4 h-fit">
        <Skeleton className="h-5 w-28 rounded" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          ))}
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-5 w-20 rounded" />
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ChallengesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 space-y-3">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-6 w-2/3 rounded" />
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-16 rounded-lg" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-14 rounded-full" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CertificatesListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card overflow-hidden">
            <div className="aspect-[1.414] bg-muted" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreatorProfileSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="flex items-end gap-4 -mt-12 px-4">
        <Skeleton className="h-24 w-24 rounded-full border-4 border-card shrink-0" />
        <div className="space-y-2 pb-2">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      </div>
      <div className="px-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CohortsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-7 w-32 rounded" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-5 w-2/3 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppShellSkeleton() {
  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Sidebar shimmer */}
      <div className="hidden md:flex w-64 flex-col border-r border-border/80 bg-card/60 p-4 space-y-6 shrink-0">
        <div className="flex items-center gap-3 px-2">
          <Skeleton className="h-8 w-8 rounded-xl" />
          <Skeleton className="h-5 w-28 rounded" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* Main content shimmer */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-border/80 flex items-center justify-between px-6 bg-card/40">
          <Skeleton className="h-4 w-36 rounded" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="p-6 sm:p-8 space-y-6 max-w-6xl w-full">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-4 w-80 rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudioSkeleton() {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto">
      {/* Banner Skeleton */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-3">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-8 w-72 rounded-lg" />
        <Skeleton className="h-4 w-96 max-w-full rounded" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
      {/* Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Studio Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-9 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded" />
      </div>
      <div className="flex gap-2 border-b pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>
      <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-52 mx-auto rounded-lg" />
        <Skeleton className="h-4 w-80 mx-auto rounded" />
      </div>
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8">
        <div className="rounded-2xl border border-border/80 bg-card p-4 flex flex-col items-center gap-2 h-44 justify-center">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
        <div className="rounded-2xl border-2 border-amber-500/30 bg-card p-4 flex flex-col items-center gap-2 h-52 justify-center shadow-lg">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
        <div className="rounded-2xl border border-border/80 bg-card p-4 flex flex-col items-center gap-2 h-40 justify-center">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-18 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
      </div>
      {/* Ranks list */}
      <div className="rounded-2xl border border-border/80 bg-card divide-y overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-5 w-6 rounded" />
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
            <Skeleton className="h-5 w-16 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommunityFeedSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Create post box */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
        <div className="flex gap-3 items-center">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
      {/* Post cards */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </div>
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubmissionsSkeleton() {
  return (
    <div className="space-y-3 mt-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/80 bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32 rounded" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TransactionRowsSkeleton() {
  return (
    <div className="divide-y divide-border/60">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-36 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-4 w-16 ml-auto rounded" />
            <Skeleton className="h-3 w-12 ml-auto rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StoreProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs space-y-3 p-4">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded" />
            </div>
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-3 w-full rounded" />
          </div>
          <Skeleton className="h-9 w-full rounded-xl mt-2" />
        </div>
      ))}
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div className="space-y-2 pt-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border border-border/80 rounded-xl p-3.5 flex gap-3 bg-card/60">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-2.5 w-20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PlaygroundProjectsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded shrink-0" />
              <Skeleton className="h-5 w-36 rounded" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-full rounded" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-3 w-24 rounded" />
            <div className="flex gap-1.5">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function IDESkeleton() {
  return (
    <div className="h-full w-full flex bg-background overflow-hidden border border-border/60 rounded-xl">
      {/* File Tree Sidebar */}
      <div className="w-56 border-r border-border/60 bg-muted/20 p-3 space-y-3 hidden sm:block shrink-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="space-y-2 pt-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded shrink-0" />
              <Skeleton className={`h-3 rounded ${i % 2 === 0 ? "w-28" : "w-20"}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Editor Tabs Bar */}
        <div className="h-10 border-b border-border/60 bg-muted/30 px-3 flex items-center gap-2 shrink-0">
          <Skeleton className="h-7 w-28 rounded-md" />
          <Skeleton className="h-7 w-24 rounded-md" />
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>

        {/* Code Content Shimmer */}
        <div className="flex-1 p-4 space-y-2.5 overflow-hidden">
          <Skeleton className="h-3.5 w-48 rounded" />
          <Skeleton className="h-3.5 w-72 rounded" />
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-3.5 w-96 rounded" />
          <Skeleton className="h-3.5 w-64 rounded" />
          <Skeleton className="h-3.5 w-40 rounded" />
          <Skeleton className="h-3.5 w-80 rounded" />
          <Skeleton className="h-3.5 w-52 rounded" />
          <Skeleton className="h-3.5 w-60 rounded" />
        </div>

        {/* Status / Terminal Bar */}
        <div className="h-7 border-t border-border/60 bg-muted/40 px-3 flex items-center justify-between text-xs shrink-0">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export function CourseDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <Skeleton className="h-4 w-28 rounded" />

      {/* Badges + Meta */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-20 ml-auto rounded" />
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-2xl rounded" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>

      {/* 2-Column Course Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Player / Lesson content & Curriculum */}
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="flex gap-3 border-b pb-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/70 bg-card space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
                <Skeleton className="h-3 w-3/4 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Enrollment Sticky Card */}
        <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-card p-6 space-y-5 shadow-xs">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-44 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="p-6 space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32 rounded" />
        <Skeleton className="h-6 w-3/4 rounded" />
      </div>
      <div className="space-y-2.5 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-3.5 rounded-xl border border-border/70 bg-muted/10 flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded-full shrink-0" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-3">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function CareerStudioModuleSkeleton() {
  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/70 bg-card/60">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-48 rounded" />
          <Skeleton className="h-3.5 w-72 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 rounded-2xl border border-border/70 bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-4 rounded-2xl border border-border/70 bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-28 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl border border-border/50 bg-muted/20 space-y-1.5">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CohortDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-32 rounded-full" />
        </div>
        <Skeleton className="h-8 w-2/3 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-xl rounded" />
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-3">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-3">
            <Skeleton className="h-5 w-28 rounded" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CoachingSkeleton() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-7 w-44 rounded-lg" />
          <Skeleton className="h-3.5 w-64 rounded" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-lg" />
        ))}
      </div>

      {/* 2-Column Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-card rounded-2xl border border-border/70 p-6 space-y-4">
          <Skeleton className="h-6 w-40 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/70 p-6 space-y-4">
          <Skeleton className="h-6 w-36 rounded" />
          <div className="grid grid-cols-2 gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-xl mt-4" />
        </div>
      </div>
    </div>
  );
}

export function OnboardingSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="max-w-4xl mx-auto mt-3">
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      </div>

      {/* Main Form Center */}
      <div className="flex-1 max-w-xl w-full mx-auto p-6 flex flex-col justify-center space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-12 w-12 rounded-2xl mx-auto" />
          <Skeleton className="h-7 w-60 rounded-lg mx-auto" />
          <Skeleton className="h-4 w-72 rounded mx-auto" />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function WorkspaceBoardSkeleton() {
  return (
    <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
      {Array.from({ length: 4 }).map((_, col) => (
        <div key={col} className="w-[320px] shrink-0 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-5 w-6 rounded-full" />
            </div>
            <Skeleton className="h-6 w-6 rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: col === 1 ? 3 : 2 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/70 bg-card space-y-2.5">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-full rounded" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-3 w-14 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CertificateStudioSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-background space-y-6">
      {/* Studio Header Bar */}
      <div className="border-b bg-card/60 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-52 rounded" />
            <Skeleton className="h-3.5 w-72 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* Tabs Row */}
      <div className="border-b px-6 flex items-center gap-6 overflow-x-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded my-2 shrink-0" />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-20 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
          ))}
        </div>

        {/* Templates / Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/70 bg-card overflow-hidden space-y-3 p-4">
              <Skeleton className="aspect-[1.414] w-full rounded-xl" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


