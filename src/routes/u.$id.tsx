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
  Instagram,
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
  X,
  Plus,
  Gamepad2,
  Music2,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SkillBadge } from "@/components/SkillBadge";
import { Button } from "@/components/ui/button";
import { getPublicProfile } from "@/lib/profile.functions";
import { getUserAchievements, xpToLevel, levelToRank } from "@/lib/gamification.functions";
import { createProject } from "@/lib/playground/projects";
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
import { FilePreview } from "@/components/FilePreview";
import { getCleanBannerUrl } from "@/lib/utils";

export const Route = createFileRoute("/u/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Profile — Learnify AI` },
      { name: "description", content: `Public profile on Learnify AI.` },
    ],
  }),
  component: PublicProfilePage,
});

function BannerImage({ src }: { src: string }) {
  const [error, setError] = useState(false);
  const cleanSrc = getCleanBannerUrl(src) ?? src;
  if (error) return null;
  return (
    <div className="h-48 md:h-56 lg:h-64 w-full bg-muted relative overflow-hidden">
      <img
        src={cleanSrc}
        alt="Banner"
        className="w-full h-full object-cover"
        loading="lazy"
        decoding="async"
        onError={() => setError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
    </div>
  );
}

function getSocialIcon(url: string) {
  if (url.includes("twitter.com") || url.includes("x.com"))
    return <Twitter className="h-4 w-4 text-sky-500" />;
  if (url.includes("github.com")) return <Github className="h-4 w-4" />;
  if (url.includes("linkedin.com")) return <Linkedin className="h-4 w-4 text-blue-600" />;
  if (url.includes("youtube.com")) return <Youtube className="h-4 w-4 text-red-500" />;
  if (url.includes("instagram.com")) return <Instagram className="h-4 w-4 text-pink-500" />;
  if (url.includes("twitch.tv")) return <Gamepad2 className="h-4 w-4 text-purple-500" />;
  if (url.includes("tiktok.com")) return <Music2 className="h-4 w-4" />;
  return <Globe className="h-4 w-4" />;
}

function ProjectCard({
  project,
  isOwner,
  editingProjectId,
  setEditingProjectId,
  editProjectTitle,
  setEditProjectTitle,
  editProjectDescription,
  setEditProjectDescription,
  qc,
  id,
}: {
  project: any;
  isOwner: boolean;
  editingProjectId: string | null;
  setEditingProjectId: (id: string | null) => void;
  editProjectTitle: string;
  setEditProjectTitle: (v: string) => void;
  editProjectDescription: string;
  setEditProjectDescription: (v: string) => void;
  qc: any;
  id: string;
}) {
  const isEditing = editingProjectId === project.id;
  return (
    <div className="rounded-xl border bg-card hover:shadow-lg hover:border-primary/20 transition-all group flex flex-col justify-between overflow-hidden">
      {project.screenshot_url ? (
        <div className="relative h-40 bg-muted overflow-hidden">
          <img
            src={project.screenshot_url}
            alt={project.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : null}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FileCode className="h-4 w-4 text-primary" />
          </div>
          <Link
            to="/playground/editor"
            search={{ project: project.id } as any}
            className="font-semibold text-sm truncate hover:text-primary transition"
          >
            {project.title}
          </Link>
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem
                  onClick={() => {
                    setEditingProjectId(project.id);
                    setEditProjectTitle(project.title);
                    setEditProjectDescription(project.description || "");
                  }}
                >
                  <FileText className="h-3.5 w-3.5 mr-2" /> Edit
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete project?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{project.title}". This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const { error } = await supabase
                            .from("playground_projects" as any)
                            .delete()
                            .eq("id", project.id);
                          if (error) return toast.error(error.message);
                          toast.success("Project deleted");
                          qc.invalidateQueries({ queryKey: ["public-profile", id] });
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <input
              value={editProjectTitle}
              onChange={(e) => setEditProjectTitle(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border bg-background"
              placeholder="Project title"
            />
            <Textarea
              value={editProjectDescription}
              onChange={(e) => setEditProjectDescription(e.target.value)}
              rows={2}
              className="text-xs resize-none"
              placeholder="Description (optional)"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-6 text-[9px] px-2"
                onClick={async () => {
                  if (!editProjectTitle.trim()) return toast.error("Title required");
                  const { error } = await supabase
                    .from("playground_projects" as any)
                    .update({
                      title: editProjectTitle.trim(),
                      description: editProjectDescription.trim(),
                    })
                    .eq("id", project.id);
                  if (error) return toast.error(error.message);
                  toast.success("Project updated");
                  setEditingProjectId(null);
                  qc.invalidateQueries({ queryKey: ["public-profile", id] });
                }}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-[9px] px-2"
                onClick={() => setEditingProjectId(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {project.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            )}
            {project.github && (
              <div className="mt-2 flex items-center gap-2">
                <Github className="h-3.5 w-3.5 text-muted-foreground" />
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline truncate"
                >
                  {project.github}
                </a>
              </div>
            )}
            {project.image_url && (
              <div className="mt-2">
                <img
                  src={project.image_url}
                  alt="Project image"
                  className="h-16 w-full rounded-lg object-cover"
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-full font-mono font-medium">
          {project.language || "code"}
        </span>
        <div className="flex items-center gap-2 text-muted-foreground">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 text-[10px] cursor-pointer hover:text-pink-500 transition-colors">
                  <Heart className="h-3 w-3" /> {project.project_likes?.length ?? 0}
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-[200px]">
                {project.project_likes?.length > 0 ? (
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold mb-1">Liked by:</p>
                    {project.project_likes.slice(0, 5).map((l: any) => (
                      <p key={l.id} className="text-[10px]">
                        {l.user?.full_name || "User"}
                      </p>
                    ))}
                    {project.project_likes.length > 5 && (
                      <p className="text-[10px] text-muted-foreground">
                        +{project.project_likes.length - 5} more
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px]">No likes yet</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="flex items-center gap-1 text-[10px]">
            <MessageSquare className="h-3 w-3" /> {project.project_comments?.length ?? 0}
          </span>
          <span className="text-[10px] text-muted-foreground/60">
            {project.updated_at
              ? formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

function PublicProfilePage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editProjectTitle, setEditProjectTitle] = useState("");
  const [editProjectDescription, setEditProjectDescription] = useState("");
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectGithub, setNewProjectGithub] = useState("");
  const [newProjectImageUrl, setNewProjectImageUrl] = useState<string | null>(null);
  const [projectImageUploading, setProjectImageUploading] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);
  const [editSkillValue, setEditSkillValue] = useState("");
  const [newSkill, setNewSkill] = useState("");

  const deletePost = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["public-profile", id] });
    }
  };
  const fetchProfile = useServerFn(getPublicProfile);
  const createProjectFn = useServerFn(createProject);
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
        {profile.banner_url && (profile as any).show_banner !== false ? (
          <BannerImage src={profile.banner_url} />
        ) : null}

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

            <div className="flex-1 min-w-0 mt-4 sm:mt-0">
              <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-border/40 p-4 sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:p-0 shadow-sm sm:shadow-none">
                <h1
                  className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                  style={
                    (profile as any).name_color ? { color: (profile as any).name_color } : undefined
                  }
                >
                  {name}
                </h1>

                {/* Gamification Stats — compact card */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <AnimatedRankCrown rankName={rankInfo.name} className="scale-50 -my-4 -mx-2" />
                    <span className={cn("text-xs font-bold", rankInfo.color)}>{rankInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-indigo-50 dark:bg-indigo-950/30 shadow-sm">
                    <span className="text-xs">⚡</span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      Lv. {level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-amber-50 dark:bg-amber-950/30 shadow-sm">
                    <span className="text-xs">⭐</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {xp.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-orange-50 dark:bg-orange-950/30 shadow-sm">
                    <span className="text-xs">🔥</span>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      {streak} {streak === 1 ? "day" : "days"}
                    </span>
                  </div>
                  {roles.includes("creator") && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-purple-50 dark:bg-purple-950/30 shadow-sm">
                      <Sparkles className="h-3 w-3 text-purple-500" />
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                        Creator
                      </span>
                    </div>
                  )}
                  {roles.includes("admin") && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-red-50 dark:bg-red-950/30 shadow-sm">
                      <Shield className="h-3 w-3 text-red-500" />
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">
                        Admin
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{subscribers} subscribers</span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground/60" /> Joined{" "}
                    {format(new Date(profile.created_at), "MMM yyyy")}
                  </span>
                  {socialLinks.length > 0 && (
                    <>
                      <span className="text-muted-foreground/30">·</span>
                      <div className="flex items-center gap-2">
                        {socialLinks.map((url: string, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground/60 hover:text-primary transition-colors"
                          >
                            {getSocialIcon(url)}
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
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
                <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    About
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}

              <Tabs defaultValue="courses" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                  <TabsTrigger
                    value="courses"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground transition-all"
                  >
                    <GraduationCap className="h-4 w-4 mr-1.5" /> Courses
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground transition-all"
                  >
                    <FileCode className="h-4 w-4 mr-1.5" /> Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="posts"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 text-sm font-semibold text-muted-foreground data-[state=active]:text-foreground transition-all"
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
                  {user?.id === id && (
                    <div className="flex justify-end">
                      <Dialog open={showNewProject} onOpenChange={setShowNewProject}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="gap-1.5">
                            <Plus className="h-4 w-4" /> New Project
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Project</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-2">
                            <input
                              value={newProjectTitle}
                              onChange={(e) => setNewProjectTitle(e.target.value)}
                              className="w-full text-sm p-2 rounded-lg border bg-background"
                              placeholder="Project title"
                            />
                            <Textarea
                              value={newProjectDescription}
                              onChange={(e) => setNewProjectDescription(e.target.value)}
                              rows={3}
                              className="text-sm resize-none"
                              placeholder="Description (optional)"
                            />
                            <input
                              type="text"
                              value={newProjectGithub}
                              onChange={(e) => setNewProjectGithub(e.target.value)}
                              className="w-full text-sm p-2 rounded-lg border bg-background"
                              placeholder="GitHub repository URL (optional)"
                            />
                            <div className="space-y-2">
                              <label className="text-xs text-muted-foreground">
                                Project image (optional)
                              </label>
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                  <FileCode className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <input
                                    type="file"
                                    id="project-image-upload"
                                    className="hidden"
                                    accept="image/*,.gif"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      if (file.size > 5 * 1024 * 1024) {
                                        return toast.error("Image must be < 5MB");
                                      }
                                      if (!file.type.startsWith("image/")) {
                                        return toast.error("Pick an image file");
                                      }
                                      setProjectImageUploading(true);
                                      try {
                                        const formData = new FormData();
                                        formData.append("file", file);
                                        const response = await fetch("/api/upload", {
                                          method: "POST",
                                          body: formData,
                                        });
                                        if (!response.ok) throw new Error("Upload failed");
                                        const { url } = await response.json();
                                        setNewProjectImageUrl(url);
                                        toast.success("Image uploaded");
                                      } catch (e: any) {
                                        return toast.error(e?.message || "Failed to upload image");
                                      } finally {
                                        setProjectImageUploading(false);
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor="project-image-upload"
                                    className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-background hover:bg-muted transition-colors text-sm font-medium"
                                  >
                                    <Plus className="h-4 w-4" /> Upload Image
                                  </label>
                                  {newProjectImageUrl && (
                                    <div className="mt-2">
                                      <img
                                        src={newProjectImageUrl}
                                        alt="Project preview"
                                        className="h-16 rounded-lg object-cover"
                                      />
                                    </div>
                                  )}
                                  {projectImageUploading && (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setShowNewProject(false);
                                  setNewProjectTitle("");
                                  setNewProjectDescription("");
                                  setNewProjectGithub("");
                                  setNewProjectImageUrl(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  if (!newProjectTitle.trim()) return toast.error("Title required");
                                  try {
                                    await createProjectFn({
                                      data: {
                                        title: newProjectTitle.trim(),
                                        description: newProjectDescription.trim(),
                                        github: newProjectGithub.trim() || null,
                                        image_url: newProjectImageUrl || null,
                                      },
                                    });
                                  } catch (e: any) {
                                    return toast.error(e?.message || "Failed to create project");
                                  }
                                  toast.success("Project created");
                                  setShowNewProject(false);
                                  setNewProjectTitle("");
                                  setNewProjectDescription("");
                                  setNewProjectGithub("");
                                  setNewProjectImageUrl(null);
                                  qc.invalidateQueries({ queryKey: ["public-profile", id] });
                                }}
                              >
                                Create
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
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
                        <ProjectCard
                          key={p.id}
                          project={p}
                          isOwner={user?.id === p.user_id}
                          editingProjectId={editingProjectId}
                          setEditingProjectId={setEditingProjectId}
                          editProjectTitle={editProjectTitle}
                          setEditProjectTitle={setEditProjectTitle}
                          editProjectDescription={editProjectDescription}
                          setEditProjectDescription={setEditProjectDescription}
                          qc={qc}
                          id={id}
                        />
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
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="flex items-center gap-1 text-[10px] cursor-pointer hover:text-pink-500 transition-colors">
                                        <Heart className="h-3 w-3" /> {post.likes?.length ?? 0}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="max-w-[200px]">
                                      {post.likes?.length > 0 ? (
                                        <div className="space-y-1">
                                          <p className="text-[10px] font-semibold mb-1">
                                            Liked by:
                                          </p>
                                          {post.likes.slice(0, 5).map((l: any) => (
                                            <p key={l.id} className="text-[10px]">
                                              {l.user?.full_name || "User"}
                                            </p>
                                          ))}
                                          {post.likes.length > 5 && (
                                            <p className="text-[10px] text-muted-foreground">
                                              +{post.likes.length - 5} more
                                            </p>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-[10px]">No likes yet</p>
                                      )}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <button
                                  onClick={() =>
                                    setExpandedPostId(expandedPostId === post.id ? null : post.id)
                                  }
                                  className="flex items-center gap-1 text-[10px] hover:text-primary transition-colors"
                                >
                                  <MessageSquare className="h-3 w-3" /> {post.comments?.length ?? 0}
                                </button>
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
                                      if (!editContent.trim())
                                        return toast.error("Content cannot be empty");
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
                                    loading="lazy"
                                    decoding="async"
                                  />
                                )}
                                {post.media_type === "video" && (
                                  <video
                                    src={post.media_url}
                                    controls
                                    className="max-h-[300px] w-full"
                                  />
                                )}
                                {post.media_type === "pdf" && <FilePreview url={post.media_url} />}
                              </div>
                            )}
                            {/* Comments section - expandable */}
                            {expandedPostId === post.id && (
                              <div className="mt-3 pt-3 border-t space-y-3">
                                {post.comments?.length > 0 ? (
                                  post.comments.map((comment: any) => {
                                    const isCommentAuthor = user?.id === comment.author_id;
                                    return (
                                      <div
                                        key={comment.id}
                                        className="flex gap-2 text-[11px] group"
                                      >
                                        <Avatar className="h-5 w-5 mt-0.5 shrink-0">
                                          <AvatarImage src={comment.author?.avatar_url} />
                                          <AvatarFallback className="text-[8px]">
                                            {comment.author?.full_name?.charAt(0) || "U"}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 mb-0.5">
                                            <span className="font-semibold">
                                              {comment.author?.full_name || "User"}
                                            </span>
                                            <span className="text-muted-foreground">
                                              {comment.created_at
                                                ? formatDistanceToNow(
                                                    new Date(comment.created_at),
                                                    { addSuffix: true },
                                                  )
                                                : ""}
                                            </span>
                                            {isCommentAuthor && (
                                              <button
                                                onClick={() => {
                                                  setEditingCommentId(comment.id);
                                                  setEditCommentText(comment.content);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                                              >
                                                <FileText className="h-2.5 w-2.5" />
                                              </button>
                                            )}
                                          </div>
                                          {editingCommentId === comment.id ? (
                                            <div className="space-y-1.5">
                                              <Textarea
                                                value={editCommentText}
                                                onChange={(e) => setEditCommentText(e.target.value)}
                                                rows={2}
                                                className="min-h-[50px] text-[11px] resize-none"
                                              />
                                              <div className="flex gap-1.5">
                                                <Button
                                                  size="sm"
                                                  className="h-6 text-[9px] px-2"
                                                  onClick={async () => {
                                                    if (!editCommentText.trim())
                                                      return toast.error("Comment cannot be empty");
                                                    const { error } = await supabase
                                                      .from("post_comments" as any)
                                                      .update({ content: editCommentText.trim() })
                                                      .eq("id", comment.id);
                                                    if (error) return toast.error(error.message);
                                                    toast.success("Comment updated");
                                                    setEditingCommentId(null);
                                                    qc.invalidateQueries({
                                                      queryKey: ["public-profile", id],
                                                    });
                                                  }}
                                                >
                                                  Save
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  className="h-6 text-[9px] px-2"
                                                  onClick={() => setEditingCommentId(null)}
                                                >
                                                  Cancel
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <p className="text-foreground/80">{comment.content}</p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-[10px] text-muted-foreground text-center py-2">
                                    No comments yet
                                  </p>
                                )}
                                {/* Add comment input */}
                                <div className="flex gap-2 items-end">
                                  <Textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="min-h-[32px] h-[32px] text-[11px] resize-none"
                                    rows={1}
                                  />
                                  <Button
                                    size="sm"
                                    className="h-8 text-[10px] px-3"
                                    onClick={async () => {
                                      if (!user || !commentText.trim()) return;
                                      const { error } = await supabase
                                        .from("post_comments" as any)
                                        .insert({
                                          post_id: post.id,
                                          author_id: user.id,
                                          content: commentText.trim(),
                                        });
                                      if (error) return toast.error("Failed to add comment");
                                      setCommentText("");
                                      qc.invalidateQueries({ queryKey: ["public-profile", id] });
                                    }}
                                    disabled={!commentText.trim()}
                                  >
                                    Post
                                  </Button>
                                </div>
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
              <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
                <h3 className="font-display font-semibold text-base border-b pb-2 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-primary" />
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
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-xs text-muted-foreground font-medium">Skills</div>
                        {user?.id === profile.id && (
                          <button
                            onClick={() => setIsEditingSkills(!isEditingSkills)}
                            className="text-[10px] text-primary hover:underline"
                          >
                            {isEditingSkills ? "Done" : "Edit"}
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.map((skill: string, idx: number) => (
                          <div key={skill} className="relative group/skill">
                            {editingSkillIdx === idx ? (
                              <div className="flex items-center gap-1">
                                <input
                                  value={editSkillValue}
                                  onChange={(e) => setEditSkillValue(e.target.value)}
                                  className="w-20 text-[10px] p-1 rounded border bg-background"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && editSkillValue.trim()) {
                                      const updated = [...(profile.skills || [])];
                                      updated[idx] = editSkillValue.trim();
                                      supabase
                                        .from("profiles")
                                        .update({ skills: updated })
                                        .eq("id", user!.id);
                                      setEditingSkillIdx(null);
                                      qc.invalidateQueries({ queryKey: ["public-profile", id] });
                                    }
                                    if (e.key === "Escape") setEditingSkillIdx(null);
                                  }}
                                />
                                <button
                                  onClick={async () => {
                                    if (!editSkillValue.trim()) return;
                                    const updated = [...(profile.skills || [])];
                                    updated[idx] = editSkillValue.trim();
                                    await supabase
                                      .from("profiles")
                                      .update({ skills: updated })
                                      .eq("id", user!.id);
                                    setEditingSkillIdx(null);
                                    qc.invalidateQueries({ queryKey: ["public-profile", id] });
                                  }}
                                  className="text-[10px] text-green-500 hover:underline"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-0.5">
                                <SkillBadge skill={skill} className="text-[10px]" />
                                {isEditingSkills && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingSkillIdx(idx);
                                        setEditSkillValue(skill);
                                      }}
                                      className="opacity-0 group-hover/skill:opacity-100 text-muted-foreground hover:text-foreground transition-opacity"
                                    >
                                      <FileText className="h-2.5 w-2.5" />
                                    </button>
                                    <button
                                      onClick={async () => {
                                        const updated = (profile.skills || []).filter(
                                          (_: string, i: number) => i !== idx,
                                        );
                                        await supabase
                                          .from("profiles")
                                          .update({ skills: updated })
                                          .eq("id", user!.id);
                                        qc.invalidateQueries({ queryKey: ["public-profile", id] });
                                      }}
                                      className="opacity-0 group-hover/skill:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {isEditingSkills && (
                          <div className="flex items-center gap-1">
                            <input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add skill..."
                              className="w-24 text-[10px] p-1 rounded border bg-background"
                              onKeyDown={async (e) => {
                                if (e.key === "Enter" && newSkill.trim()) {
                                  const updated = [...(profile.skills || []), newSkill.trim()];
                                  await supabase
                                    .from("profiles")
                                    .update({ skills: updated })
                                    .eq("id", user!.id);
                                  setNewSkill("");
                                  qc.invalidateQueries({ queryKey: ["public-profile", id] });
                                }
                              }}
                            />
                            <button
                              onClick={async () => {
                                if (!newSkill.trim()) return;
                                const updated = [...(profile.skills || []), newSkill.trim()];
                                await supabase
                                  .from("profiles")
                                  .update({ skills: updated })
                                  .eq("id", user!.id);
                                setNewSkill("");
                                qc.invalidateQueries({ queryKey: ["public-profile", id] });
                              }}
                              className="text-[10px] text-primary hover:underline"
                            >
                              Add
                            </button>
                          </div>
                        )}
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
                            icon = <Instagram className="h-3.5 w-3.5 text-pink-500" />;
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
              <div className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="font-display font-semibold text-base flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    Achievements
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-semibold">
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
