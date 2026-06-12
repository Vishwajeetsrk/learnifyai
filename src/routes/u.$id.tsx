import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, BookOpen, Calendar, GraduationCap, Heart, Loader2, Users } from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getPublicProfile } from "@/lib/profile.functions";

export const Route = createFileRoute("/u/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Profile — Learnify AI` },
      { name: "description", content: `Public profile on Learnify AI.` },
    ],
  }),
  component: PublicProfilePage,
});

function PublicProfilePage() {
  const { id } = Route.useParams();
  const fetchProfile = useServerFn(getPublicProfile);
  const q = useQuery({
    queryKey: ["public-profile", id],
    queryFn: () => fetchProfile({ data: { id } }),
  });

  if (q.isLoading)
    return (
      <AppShell>
        <div className="py-20 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  if (!q.data)
    return (
      <AppShell>
        <div className="py-20 text-center text-sm text-muted-foreground">Profile not found.</div>
      </AppShell>
    );

  const { profile, subscribers, likes, certificates, enrolled, created } = q.data;
  const name = profile.full_name ?? "Learner";
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl">
        <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar className="h-24 w-24">
            {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{name}</h1>
            {profile.bio && (
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Joined{" "}
                {format(new Date(profile.created_at), "MMM yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {subscribers} subscribers
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" /> {likes} likes given
              </span>
              <span className="flex items-center gap-1">
                <Award className="h-4 w-4" /> {certificates} certificates
              </span>
            </div>
          </div>
        </div>

        {created.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" /> Courses created
            </h2>
            <CourseGrid courses={created} />
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> Enrolled courses
          </h2>
          {enrolled.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
              No enrolled courses yet.
            </div>
          ) : (
            <CourseGrid courses={enrolled} />
          )}
        </section>
      </div>
    </AppShell>
  );
}

function CourseGrid({
  courses,
}: {
  courses: Array<{
    id: string;
    slug: string;
    title: string;
    cover_url: string | null;
    category?: string | null;
  }>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((c) => (
        <Link
          key={c.id}
          to="/courses/$slug"
          params={{ slug: c.slug }}
          className="group rounded-2xl border bg-card overflow-hidden shadow-card hover:shadow-lg transition"
        >
          <div className="aspect-video bg-muted overflow-hidden">
            {c.cover_url ? (
              <img
                src={c.cover_url}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full grid place-items-center">
                <GraduationCap className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="p-4">
            {c.category && (
              <Badge variant="secondary" className="text-[10px]">
                {c.category}
              </Badge>
            )}
            <h3 className="mt-2 font-display font-semibold leading-snug line-clamp-2 group-hover:text-primary">
              {c.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
