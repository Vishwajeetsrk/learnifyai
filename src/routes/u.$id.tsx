import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Award, BookOpen, Calendar, GraduationCap, Heart, Loader2, Users, Bell, BellOff, Link as LinkIcon, Twitter, Github, Linkedin, Youtube, Globe, FileCode, ExternalLink, Megaphone, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicProfile } from "@/lib/profile.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/u/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Profile — Learnify AI` },
      { name: "description", content: `Public profile on Learnify AI.` },
    ],
  }),
  component: PublicProfilePage,
});

function getSocialIcon(url: string) {
  if (url.includes("twitter.com") || url.includes("x.com")) return <Twitter className="h-4 w-4" />;
  if (url.includes("github.com")) return <Github className="h-4 w-4" />;
  if (url.includes("linkedin.com")) return <Linkedin className="h-4 w-4" />;
  if (url.includes("youtube.com")) return <Youtube className="h-4 w-4" />;
  return <Globe className="h-4 w-4" />;
}

function PublicProfilePage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const fetchProfile = useServerFn(getPublicProfile);
  const q = useQuery({
    queryKey: ["public-profile", id],
    queryFn: () => fetchProfile({ data: { id } }),
  });

  const mySubQuery = useQuery({
    enabled: !!user && user.id !== id,
    queryKey: ["my-sub-to-creator", id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("creator_subscriptions")
        .select("id")
        .eq("subscriber_id", user!.id)
        .eq("creator_id", id)
        .maybeSingle();
      return !!data;
    },
  });

  const toggleCreatorSub = async () => {
    if (!user) return navigate({ to: "/login" });
    if (user.id === id) return;

    const isSubscribed = !!mySubQuery.data;
    if (isSubscribed) {
      const { error } = await supabase
        .from("creator_subscriptions")
        .delete()
        .eq("subscriber_id", user.id)
        .eq("creator_id", id);
      if (error) return toast.error(error.message);
      toast.success("Unsubscribed");
    } else {
      const { error } = await supabase
        .from("creator_subscriptions")
        .insert({ subscriber_id: user.id, creator_id: id });
      if (error) return toast.error(error.message);
      toast.success("Subscribed — you'll get notified for new lessons");
    }
    qc.invalidateQueries({ queryKey: ["my-sub-to-creator", id, user.id] });
    qc.invalidateQueries({ queryKey: ["public-profile", id] });
  };

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

  const { profile, subscribers, likes, certificates, enrolled, created, projects, posts } = q.data;
  const name = profile.full_name ?? "Learner";
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const socialLinks = (profile.social_links && typeof profile.social_links === "object"
    ? Object.values(profile.social_links).filter((url) => typeof url === "string" && url.trim() !== "")
    : []) as string[];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto pb-10">
        {/* Banner */}
        <div className="h-48 md:h-64 w-full bg-muted relative overflow-hidden">
          {profile.banner_url ? (
            <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-6 lg:px-10 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
              {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
              <AvatarFallback className="text-3xl bg-primary/10 text-primary border-2 border-primary/20">{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0 mt-4 sm:mt-0 mb-1">
              <h1 className="font-display text-3xl font-bold tracking-tight">{name}</h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{subscribers} subscribers</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Joined {format(new Date(profile.created_at), "MMM yyyy")}
                </span>
                {socialLinks.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex items-center gap-2">
                      {socialLinks.map((url: string, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          {getSocialIcon(url)}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {user?.id !== id && (
              <div className="sm:mb-2 w-full sm:w-auto mt-4 sm:mt-0">
                <Button
                  onClick={toggleCreatorSub}
                  variant={mySubQuery.data ? "outline" : "default"}
                  className="w-full sm:w-auto rounded-full px-6 gap-2"
                >
                  {mySubQuery.data ? (
                    <>
                      <BellOff className="h-4 w-4" /> Subscribed
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" /> Subscribe
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          
          {profile.bio && (
            <p className="text-sm mt-6 max-w-3xl whitespace-pre-wrap">{profile.bio}</p>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 text-sm border-b pb-6">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-4 w-4" /> <span className="font-medium text-foreground">{likes}</span> likes given
            </span>
            <span className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4" /> <span className="font-medium text-foreground">{certificates}</span> certificates
            </span>
          </div>

        <Tabs defaultValue="courses" className="mt-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
            <TabsTrigger
              value="courses"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
            >
              <GraduationCap className="h-4 w-4 mr-1.5" /> Courses
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
            >
              <FileCode className="h-4 w-4 mr-1.5" /> Projects
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground"
            >
              <MessageSquare className="h-4 w-4 mr-1.5" /> Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-8 pt-6">
            {created.length > 0 && (
              <section>
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" /> Courses created
                </h2>
                <CourseGrid courses={created} />
              </section>
            )}

            <section>
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Enrolled courses
              </h2>
              {enrolled.length === 0 ? (
                <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
                  No enrolled courses yet.
                </div>
              ) : (
                <CourseGrid courses={enrolled} />
              )}
            </section>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6 pt-6">
            {projects.length === 0 ? (
              <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
                No public projects yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p: any) => (
                  <div key={p.id} className="rounded-xl border bg-card p-4 hover:shadow-md transition group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileCode className="h-4 w-4 text-primary" />
                        <Link to="/playground/editor" search={{ project: p.id } as any} className="font-semibold text-sm truncate hover:text-primary transition">
                          {p.title}
                        </Link>
                      </div>
                      {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[10px] text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full font-mono font-medium">
                        {p.language}
                      </span>
                      <Button asChild size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-primary">
                        <Link to="/playground/editor" search={{ project: p.id } as any}>
                          <ExternalLink className="h-3.5 w-3.5" /> View Code
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="posts" className="space-y-6 pt-6">
            {posts.length === 0 ? (
              <div className="rounded-2xl border bg-card p-10 text-center text-sm text-muted-foreground">
                No community posts yet.
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post: any) => {
                  const isPoll = post.post_type === "poll";
                  const isAnnouncement = post.post_type === "announcement";
                  let pollData: any = null;
                  if (isPoll && post.content) { try { pollData = JSON.parse(post.content); } catch {} }
                  
                  return (
                    <article key={post.id} className={cn("bg-card rounded-2xl border shadow-sm p-5", isAnnouncement ? "border-primary/30 ring-1 ring-primary/10" : "")}>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={post.author?.avatar_url} />
                          <AvatarFallback>{post.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-1.5">
                            {post.author?.full_name || "User"}
                            {isAnnouncement && <Badge className="text-[9px] h-4"><Megaphone className="h-2.5 w-2.5 mr-0.5" /> Announcement</Badge>}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      {isPoll && pollData ? (
                        <div className="mb-2 space-y-1.5">
                          <p className="font-semibold text-xs">{pollData.question}</p>
                          <div className="space-y-1">
                            {pollData.options.map((option: string, optIdx: number) => (
                              <div key={optIdx} className="p-2 border rounded-lg text-xs bg-muted/30">
                                {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs prose prose-sm dark:prose-invert max-w-none mb-3" dangerouslySetInnerHTML={{ __html: post.content }} />
                      )}
                      {post.media_url && (
                        <div className="mb-3 rounded-lg overflow-hidden border">
                          {post.media_type === 'image' && (
                            <img src={post.media_url} alt="" className="max-h-[300px] w-full object-contain" />
                          )}
                          {post.media_type === 'video' && (
                            <video src={post.media_url} controls className="max-h-[300px] w-full" />
                          )}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
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
