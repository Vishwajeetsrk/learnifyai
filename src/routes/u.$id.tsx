import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  Heart,
  Loader2,
  Users,
  Bell,
  BellOff,
  Link as LinkIcon,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Globe,
  FileCode,
  ExternalLink,
  Megaphone,
  MessageSquare,
  Flame,
  Code2,
  Sparkles,
  Brain,
  MoreHorizontal,
  Trash2,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SkillBadge } from "@/components/SkillBadge";
import { Button } from "@/components/ui/button";
import { getPublicProfile } from "@/lib/profile.functions";
import { getUserAchievements, xpToLevel, levelToRank } from "@/lib/gamification.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { getProfileBorderClass } from "@/components/ui/avatar";
import { ProfileSkeleton } from "@/components/Skeletons";
import { AnimatedRankCrown } from "@/components/RankSystem";
import {
  StreakBadge,
  XpBadge,
  CourseBadge,
  TestBadge,
  ChallengeBadge,
} from "@/components/GamificationBadges";

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
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const deletePost = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);
    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["public-profile", id] });
    }
  };
  const fetchProfile = useServerFn(getPublicProfile);
  const q = useQuery({
    queryKey: ["public-profile", id],
    queryFn: () => fetchProfile({ data: { id } }),
  });

  const fetchAchievements = useServerFn(getUserAchievements);
  const achievementsQ = useQuery({
    enabled: !!id,
    queryKey: ["public-profile-achievements", id],
    queryFn: () => fetchAchievements({ data: { userId: id } }),
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
        <div className="px-4 md:px-10 py-8">
          <ProfileSkeleton />
        </div>
      </AppShell>
    );
  if (!q.data)
    return (
      <AppShell>
        <div className="py-20 text-center text-sm text-muted-foreground">Profile not found.</div>
      </AppShell>
    );

  const {
    profile,
    subscribers,
    likes,
    certificates,
    enrolled,
    created,
    projects,
    posts,
    roles = [],
  } = q.data;
  const name = profile.full_name ?? "Learner";
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const xp = (profile as any).xp ?? 0;
  const streak = (profile as any).current_streak ?? 0;
  const level = xpToLevel(xp);
  const rankInfo = levelToRank(level);

  const socialLinks = (
    profile.social_links && typeof profile.social_links === "object"
      ? Object.values(profile.social_links).filter(
          (url) => typeof url === "string" && url.trim() !== "",
        )
      : []
  ) as string[];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto pb-10">
        {/* Banner */}
        <div className="h-48 md:h-56 lg:h-64 w-full bg-muted relative overflow-hidden">
          {profile.banner_url ? (
            <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
          )}
          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-6 lg:px-10 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Avatar with background shield */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-background shadow-lg" />
              <Avatar
                className={cn(
                  "relative h-28 w-28 border-4 border-background shadow-lg",
                  getProfileBorderClass(profile.avatar_url),
                )}
              >
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
                <AvatarFallback className="text-3xl bg-primary/10 text-primary border-2 border-primary/20">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0 mt-4 sm:mt-0 mb-1 bg-background/80 backdrop-blur-sm rounded-2xl p-3 sm:p-0 sm:bg-transparent sm:backdrop-blur-none">
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: (profile as any).name_color || undefined }}>
                {name}
              </h1>

              {/* Gamification Stats */}
              <div className="flex flex-wrap items-center gap-3 mt-1.5 mb-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border bg-card shadow-sm">
                  <AnimatedRankCrown rankName={rankInfo.name} className="scale-50 -my-4 -mx-2" />
                  <span className={cn("text-xs font-bold", rankInfo.color)}>{rankInfo.name}</span>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs font-bold px-2.5 py-1 rounded-xl border bg-background/50 text-indigo-500 border-indigo-200 dark:border-indigo-900/50 shadow-sm"
                >
                  ⚡ Lv. {level}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs font-bold px-2.5 py-1 rounded-xl border bg-background/50 text-amber-500 border-amber-200 dark:border-amber-900/50 shadow-sm"
                >
                  ⭐ {xp.toLocaleString()} XP
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs font-bold px-2.5 py-1 rounded-xl border bg-background/50 text-orange-500 border-orange-200 dark:border-orange-900/50 shadow-sm"
                >
                  🔥 {streak} {streak === 1 ? "day streak" : "days streak"}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{subscribers} subscribers</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Joined{" "}
                  {format(new Date(profile.created_at), "MMM yyyy")}
                </span>
                {socialLinks.length > 0 && (
                  <>
                    <span>·</span>
                    <div className="flex items-center gap-2">
                      {socialLinks.map((url: string, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 border-t pt-8">
            {/* Left Column: Bio, Tabs */}
            <div className="lg:col-span-8 space-y-6">
              {profile.bio && (
                <div className="bg-card rounded-2xl border p-6 shadow-sm">
                  <h3 className="font-display font-semibold text-base mb-3">About</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}

              <Tabs defaultValue="courses" className="w-full">
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
                    <div className="rounded-2xl border bg-card p-12 text-center flex flex-col items-center gap-3">
                      <FileCode className="h-10 w-10 text-muted-foreground/40" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          No public projects yet
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Projects saved in the Playground will appear here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map((p: any) => (
                        <div
                          key={p.id}
                          className="rounded-xl border bg-card p-4 hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <FileCode className="h-4 w-4 text-primary" />
                              </div>
                              <Link
                                to="/playground/editor"
                                search={{ project: p.id } as any}
                                className="font-semibold text-sm truncate hover:text-primary transition"
                              >
                                {p.title}
                              </Link>
                            </div>
                            {p.description && (
                              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                                {p.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                            <span className="text-[10px] text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full font-mono font-medium">
                              {p.language || "code"}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60">
                              {p.updated_at
                                ? formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })
                                : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="posts" className="space-y-6 pt-6">
                  {posts.length === 0 ? (
                    <div className="rounded-2xl border bg-card p-12 text-center flex flex-col items-center gap-3">
                      <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          No community posts yet
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          Posts in the Community Feed will appear here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.map((post: any) => {
                        const isPoll = post.post_type === "poll";
                        const isAnnouncement = post.post_type === "announcement";
                        let pollData: any = null;
                        if (isPoll && post.content) {
                          try {
                            pollData = JSON.parse(post.content);
                          } catch {}
                        }

                        return (
                          <article
                            key={post.id}
                            className={cn(
                              "bg-card rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all",
                              isAnnouncement ? "border-primary/30 ring-1 ring-primary/10" : "",
                            )}
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                                <AvatarImage src={post.author?.avatar_url} />
                                <AvatarFallback className="text-xs">
                                  {post.author?.full_name?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold text-xs flex items-center gap-1.5">
                                  {post.author?.full_name || "User"}
                                  {isAnnouncement && (
                                    <Badge className="text-[9px] h-4">
                                      <Megaphone className="h-2.5 w-2.5 mr-0.5" /> Announcement
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-[10px] text-muted-foreground">
                                  {formatDistanceToNow(new Date(post.created_at), {
                                    addSuffix: true,
                                  })}
                                </div>
                              </div>
                              <div className="ml-auto flex items-center gap-3 text-muted-foreground">
                                <span className="flex items-center gap-1 text-[10px]">
                                  <Heart className="h-3 w-3" /> {post.likes?.length ?? 0}
                                </span>
                                <span className="flex items-center gap-1 text-[10px]">
                                  <MessageSquare className="h-3 w-3" /> {post.comments?.length ?? 0}
                                </span>
                                {(user?.id === post.author_id ||
                                  roles.includes("admin") ||
                                  roles.includes("super_admin") ||
                                  user?.email === "vishwajeetsrk@gmail.com") && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:text-foreground rounded-full"
                                      >
                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      {user?.id === post.author_id && post.post_type !== "poll" && (
                                        <DropdownMenuItem
                                          onClick={() => {
                                            setEditingPostId(post.id);
                                            setEditContent(post.content);
                                          }}
                                        >
                                          <FileText className="h-3.5 w-3.5 mr-2" /> Edit Post
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuItem
                                        className="text-destructive focus:bg-destructive/10"
                                        onClick={() => deletePost(post.id)}
                                      >
                                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Post
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </div>
                            {isPoll && pollData ? (
                              <div className="mb-3 space-y-1.5">
                                <p className="font-semibold text-xs">{pollData.question}</p>
                                <div className="space-y-1">
                                  {pollData.options.map((option: string, optIdx: number) => (
                                    <div
                                      key={optIdx}
                                      className="p-2 border rounded-lg text-xs bg-muted/30 flex items-center gap-2"
                                    >
                                      <span className="h-2 w-2 rounded-full border border-muted-foreground/40" />
                                      {option}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : editingPostId === post.id ? (
                              <div className="mb-3 space-y-2">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  rows={4}
                                  className="w-full text-xs p-2.5 rounded-xl border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="h-7 text-[10px]"
                                    onClick={async () => {
                                      if (!editContent.trim()) return toast.error("Content cannot be empty");
                                      const { error } = await supabase
                                        .from("posts")
                                        .update({ content: editContent.trim() })
                                        .eq("id", post.id);
                                      if (error) return toast.error(error.message);
                                      toast.success("Post updated");
                                      setEditingPostId(null);
                                      qc.invalidateQueries({ queryKey: ["public-profile", id] });
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-[10px]"
                                    onClick={() => setEditingPostId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="text-xs prose prose-sm dark:prose-invert max-w-none mb-3"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                              />
                            )}
                            {post.media_url && (
                              <div className="mb-3 rounded-lg overflow-hidden border bg-muted/20">
                                {post.media_type === "image" && (
                                  <img
                                    src={post.media_url}
                                    alt=""
                                    className="max-h-[300px] w-full object-contain"
                                  />
                                )}
                                {post.media_type === "video" && (
                                  <video
                                    src={post.media_url}
                                    controls
                                    className="max-h-[300px] w-full"
                                  />
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

            {/* Right Column: Profile Details & Achievements Box */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Details Box */}
              <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-4">
                <h3 className="font-display font-semibold text-base border-b pb-2">
                  Profile Details
                </h3>

                <div className="space-y-4 text-sm">
                  {/* Name */}
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Name</div>
                    <div className="text-foreground mt-0.5 font-semibold">
                      {profile.full_name || "Learner"}
                    </div>
                  </div>

                  {/* Roles */}
                  {roles && roles.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-1">Role</div>
                      <div className="flex flex-wrap gap-1">
                        {roles.map((r: string) => {
                          const isSuper = r === "super_admin";
                          const isAdminRole = r === "admin";
                          const isCreatorRole = r === "creator";
                          return (
                            <Badge
                              key={r}
                              className={cn(
                                "text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider",
                                isSuper
                                  ? "bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-md"
                                  : isAdminRole
                                    ? "bg-gradient-to-r from-violet-500 to-indigo-600 text-white border-0 shadow-sm"
                                    : isCreatorRole
                                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-sm"
                                      : "bg-secondary text-secondary-foreground",
                              )}
                            >
                              {r === "super_admin"
                                ? "Super Admin"
                                : r === "admin"
                                  ? "Admin"
                                  : r === "creator"
                                    ? "Creator"
                                    : r}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Username */}
                  {profile.username && (
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Username</div>
                      <div className="font-mono text-foreground mt-0.5">@{profile.username}</div>
                    </div>
                  )}

                  {/* Email */}
                  {profile.email && (
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Email</div>
                      <div className="text-foreground mt-0.5 break-all">{profile.email}</div>
                    </div>
                  )}

                  {/* Website */}
                  {profile.website && (
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Website</div>
                      <a
                        href={
                          profile.website.startsWith("http")
                            ? profile.website
                            : `https://${profile.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        {profile.website.replace(/^https?:\/\/(www\.)?/, "")}
                      </a>
                    </div>
                  )}

                  {/* Location */}
                  {profile.location && (
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Location</div>
                      <div className="text-foreground mt-0.5">{profile.location}</div>
                    </div>
                  )}

                  {/* Work */}
                  {profile.work && (
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Work</div>
                      <div className="text-foreground mt-0.5">{profile.work}</div>
                    </div>
                  )}

                  {/* Education */}
                  {profile.education && (
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Education</div>
                      <div className="text-foreground mt-0.5">{profile.education}</div>
                    </div>
                  )}

                  {/* Bio */}
                  {profile.bio && (
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Bio</div>
                      <div className="text-foreground text-xs mt-0.5 whitespace-pre-wrap leading-relaxed">
                        {profile.bio}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="text-xs text-muted-foreground font-medium mb-1.5">Skills</div>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.map((skill: string) => (
                          <SkillBadge key={skill} skill={skill} className="text-[10px]" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social links */}
                  {profile.social_links && typeof profile.social_links === "object" && (
                    <div className="pt-3 border-t space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">Social media</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(profile.social_links).map(([platform, url]) => {
                          if (!url || typeof url !== "string" || url.trim() === "") return null;
                          let displayName = platform.charAt(0).toUpperCase() + platform.slice(1);
                          let icon = <Globe className="h-3.5 w-3.5" />;

                          if (platform === "github") {
                            icon = (
                              <Github className="h-3.5 w-3.5 text-slate-800 dark:text-slate-100" />
                            );
                            displayName = "GitHub";
                          } else if (platform === "twitter" || platform === "x") {
                            icon = <Twitter className="h-3.5 w-3.5 text-sky-500" />;
                            displayName = "X (Twitter)";
                          } else if (platform === "linkedin") {
                            icon = <Linkedin className="h-3.5 w-3.5 text-blue-600" />;
                            displayName = "LinkedIn";
                          } else if (platform === "youtube") {
                            icon = <Youtube className="h-3.5 w-3.5 text-red-600" />;
                            displayName = "YouTube";
                          } else if (platform === "instagram") {
                            displayName = "Instagram";
                          } else if (platform === "twitch") {
                            displayName = "Twitch";
                          } else if (platform === "tiktok") {
                            displayName = "TikTok";
                          }

                          return (
                            <a
                              key={platform}
                              href={url.startsWith("http") ? url : `https://${url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors truncate p-1.5 rounded-lg hover:bg-secondary/40 border border-transparent hover:border-border"
                            >
                              {icon}
                              <div className="truncate leading-tight">
                                <div className="font-semibold text-foreground text-[11px]">
                                  {displayName}
                                </div>
                                <div className="text-[9px] text-muted-foreground truncate">
                                  {url.replace(/^https?:\/\/(www\.)?/, "")}
                                </div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements Box */}
              <div className="bg-card rounded-2xl border p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-display font-semibold text-base">Achievements</h3>
                  <Badge variant="outline" className="text-[10px]">
                    {achievementsQ.data?.filter((b: any) => b.earned).length ?? 0} Earned
                  </Badge>
                </div>

                {achievementsQ.isLoading ? (
                  <div className="py-6 flex justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : !achievementsQ.data ||
                  achievementsQ.data.filter((b: any) => b.earned).length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No badges earned yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {achievementsQ.data
                      .filter((b: any) => b.earned)
                      .map((badge: any) => {
                        let BadgeSVG = CourseBadge;
                        if (badge.category === "xp") BadgeSVG = XpBadge;
                        else if (badge.category === "streak") BadgeSVG = StreakBadge;
                        else if (badge.category === "test") BadgeSVG = TestBadge;
                        else if (badge.category === "challenge") BadgeSVG = ChallengeBadge;

                        return (
                          <div
                            key={badge.id}
                            className="group relative flex flex-col items-center justify-center p-3 rounded-2xl border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
                            title={`${badge.name}: ${badge.description || "Earned badge"}`}
                          >
                            <BadgeSVG className="w-10 h-10 mb-2" />
                            <span className="text-[10px] font-bold truncate w-full leading-tight text-foreground">
                              {badge.name}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>
          </div>
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
