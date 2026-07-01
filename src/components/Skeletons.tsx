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

export function CourseDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-48 rounded" />
        <div className="aspect-video rounded-2xl bg-muted" />
        <div className="rounded-2xl border bg-card p-5 space-y-4">
          <Skeleton className="h-4 w-24 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-2xl border bg-card p-5 space-y-3">
          <Skeleton className="h-5 w-28 rounded" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-muted/40 p-2.5 space-y-1">
                <Skeleton className="h-3 w-14 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b">
            <Skeleton className="h-5 w-28 rounded" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
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
