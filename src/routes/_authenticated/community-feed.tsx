import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, Bookmark, Image as ImageIcon, Video, FileText, Send, MoreHorizontal, Trash2, Bold, Italic, List, Heading1, Loader2, BarChart3, Megaphone, Check, Underline, Palette, AlignLeft, AlignCenter, AlignRight, ListOrdered, Type } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExt from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import FontFamily from '@tiptap/extension-font-family';

export const Route = createFileRoute("/_authenticated/community-feed")({
  component: CommunityPage,
  head: () => ({ meta: [{ title: "Community — Learnify AI" }] }),
});

type PollData = { question: string; options: string[] };

function CommunityPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [postType, setPostType] = useState<"post" | "poll" | "announcement">("post");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  const [colorOpen, setColorOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: true,
        bulletList: true,
      }),
      UnderlineExt,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Share your progress, ask a question, or post a resource...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[100px] w-full resize-none bg-transparent px-2 py-2 text-base outline-none prose prose-sm dark:prose-invert max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  const { data: profile } = useQuery({
    enabled: !!user,
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts" as any)
        .select(`
          *,
          author:profiles!posts_author_id_fkey (id, full_name, avatar_url),
          likes:post_likes(id, user_id),
          comments:post_comments(id, content, author_id, created_at, author:author_id(id, full_name, avatar_url)),
          saves:post_saves(id, user_id),
          poll_votes:post_poll_votes(id, user_id, option_index)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        if (error.message?.includes("is_pinned") || error.code === "PGRST204") {
          const { data: fallback } = await supabase
            .from("posts" as any)
            .select(`
              *,
              author:profiles!posts_author_id_fkey (id, full_name, avatar_url),
              likes:post_likes(id, user_id),
              comments:post_comments(id, content, author_id, created_at, author:author_id(id, full_name, avatar_url)),
              saves:post_saves(id, user_id),
              poll_votes:post_poll_votes(id, user_id, option_index)
            `)
            .order("created_at", { ascending: false });
          return (fallback || []) as any[];
        }
        console.error("Posts fetch error:", error);
        return [];
      }
      return data as any[];
    },
  });

  const createPost = async () => {
    const textContent = editor?.getText() || "";
    if (!user) return;
    if (postType === "post" && !textContent.trim() && !mediaFile) return;
    if (postType === "poll" && (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2)) return toast.error("Poll needs a question and at least 2 options");
    
    setIsUploading(true);
    try {
      let mediaUrl = null;
      let mediaType = null;

      if (mediaFile) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('community-uploads')
          .upload(filePath, mediaFile);
          
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('community-uploads').getPublicUrl(filePath);
        mediaUrl = publicUrl;
        
        if (mediaFile.type.startsWith('image/')) mediaType = 'image';
        else if (mediaFile.type.startsWith('video/')) mediaType = 'video';
        else mediaType = 'pdf';
      }

      const payload: any = {
        author_id: user.id,
        post_type: postType,
        is_pinned: postType === "announcement",
      };

      if (postType === "poll") {
        payload.content = JSON.stringify({ question: pollQuestion.trim(), options: pollOptions.filter(o => o.trim()) } as PollData);
      } else {
        payload.content = content.trim();
        payload.media_url = mediaUrl;
        payload.media_type = mediaType;
      }

      const { error } = await supabase.from("posts" as any).insert(payload);
      if (error) throw error;
      
      setContent("");
      editor?.commands.setContent("");
      setMediaFile(null);
      setPostType("post");
      setPollQuestion("");
      setPollOptions(["", ""]);
      toast.success(postType === "announcement" ? "Announcement posted" : "Post created");
      qc.invalidateQueries({ queryKey: ["community-posts"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts" as any).delete().eq("id", postId);
    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted");
      qc.invalidateQueries({ queryKey: ["community-posts"] });
    }
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;
    if (isLiked) {
      await supabase.from("post_likes" as any).delete().match({ post_id: postId, user_id: user.id });
    } else {
      await supabase.from("post_likes" as any).insert({ post_id: postId, user_id: user.id });
    }
    qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  const toggleSave = async (postId: string, isSaved: boolean) => {
    if (!user) return;
    if (isSaved) {
      await supabase.from("post_saves" as any).delete().match({ post_id: postId, user_id: user.id });
    } else {
      await supabase.from("post_saves" as any).insert({ post_id: postId, user_id: user.id });
    }
    qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  const addComment = async (postId: string) => {
    if (!user || !commentText.trim()) return;
    const { error } = await supabase.from("post_comments" as any).insert({
      post_id: postId,
      author_id: user.id,
      content: commentText.trim()
    });
    if (error) {
      toast.error("Failed to add comment");
    } else {
      setCommentText("");
      qc.invalidateQueries({ queryKey: ["community-posts"] });
    }
  };

  const deleteComment = async (commentId: string) => {
    const { error } = await supabase.from("post_comments" as any).delete().eq("id", commentId);
    if (!error) qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-semibold mb-6">Community Hub</h1>
        
        {/* Create Post Box */}
        <div className="bg-card rounded-2xl border p-5 mb-8 shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-shadow">
          <div className="flex gap-3 mb-4">
            <button onClick={() => setPostType("post")} className={cn("text-xs px-3 py-1.5 rounded-full border transition", postType === "post" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent")}><MessageSquare className="h-3 w-3 inline mr-1" /> Post</button>
            <button onClick={() => setPostType("poll")} className={cn("text-xs px-3 py-1.5 rounded-full border transition", postType === "poll" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent")}><BarChart3 className="h-3 w-3 inline mr-1" /> Poll</button>
            <button onClick={() => setPostType("announcement")} className={cn("text-xs px-3 py-1.5 rounded-full border transition", postType === "announcement" ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent")}><Megaphone className="h-3 w-3 inline mr-1" /> Announce</button>
          </div>
          <div className="flex gap-4">
            <Avatar className="h-11 w-11 mt-1 border">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {postType === "poll" ? (
                <div className="space-y-3 mb-3">
                  <Input value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} placeholder="Ask a question..." className="font-medium" />
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input value={opt} onChange={e => { const next = [...pollOptions]; next[i] = e.target.value; setPollOptions(next); }} placeholder={`Option ${i + 1}`} />
                      {pollOptions.length > 2 && <button onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setPollOptions([...pollOptions, ""])}>+ Add option</Button>
                </div>
              ) : (
                <div className="bg-transparent mb-2">
                  <EditorContent editor={editor} className="cursor-text" onClick={() => editor?.commands.focus()} />
                </div>
              )}
              
              {mediaFile && postType !== "poll" && (
                <div className="relative rounded-lg overflow-hidden bg-accent/40 border inline-flex max-w-[250px] mb-4">
                  <div className="p-2.5 flex items-center gap-3 text-sm font-medium w-full">
                    <div className="truncate flex-1 text-foreground">{mediaFile.name}</div>
                    <button onClick={() => setMediaFile(null)} className="text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-1 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {postType !== "poll" && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t pt-3 gap-4">
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                  <div className="flex items-center border-r pr-2 mr-1 gap-0.5">
                    <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Bold"><Bold className="h-4 w-4" /></button>
                    <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Italic"><Italic className="h-4 w-4" /></button>
                    <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('underline') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Underline"><Underline className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center border-r pr-2 mr-1 gap-0.5">
                    <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('heading') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Heading"><Heading1 className="h-4 w-4" /></button>
                    <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Bullet List"><List className="h-4 w-4" /></button>
                    <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Ordered List"><ListOrdered className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center border-r pr-2 mr-1 gap-0.5">
                    <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'left' }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Align Left"><AlignLeft className="h-4 w-4" /></button>
                    <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'center' }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Align Center"><AlignCenter className="h-4 w-4" /></button>
                    <button onClick={() => editor?.chain().focus().setTextAlign('right').run()} className={`p-1.5 rounded-lg transition-colors ${editor?.isActive({ textAlign: 'right' }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Align Right"><AlignRight className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div className="relative">
                      <button onClick={() => setColorOpen(!colorOpen)} className={`p-1.5 rounded-lg transition-colors ${colorOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`} title="Text Color"><Palette className="h-4 w-4" /></button>
                      {colorOpen && (
                        <div className="absolute top-full left-0 mt-1 z-50 p-2 rounded-lg border bg-popover shadow-lg flex gap-1">
                          {['#000000','#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899'].map(c => (
                            <button key={c} onClick={() => { editor?.chain().focus().setColor(c).run(); setColorOpen(false); }} className="h-6 w-6 rounded-full border" style={{ backgroundColor: c }} title={c} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5">
                      <select onChange={e => editor?.chain().focus().setMark('textStyle', { fontSize: e.target.value + 'px' }).run()} className="p-1 rounded text-[10px] bg-transparent border text-muted-foreground cursor-pointer hover:text-foreground" title="Font Size">
                        <option value="14">14</option>
                        <option value="16">16</option>
                        <option value="18">18</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                        <option value="30">30</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <select onChange={e => editor?.chain().focus().setFontFamily(e.target.value).run()} className="p-1 rounded text-[10px] bg-transparent border text-muted-foreground cursor-pointer hover:text-foreground" title="Font Family">
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                        <option value="monospace">Monospace</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-1 pl-2 border-l">
                    <label className="p-1.5 text-indigo-500 hover:bg-indigo-500/10 rounded-lg cursor-pointer transition-colors" title="Add Image">
                      <ImageIcon className="h-4 w-4" />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} />
                    </label>
                    <label className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors" title="Add Video">
                      <Video className="h-4 w-4" />
                      <input type="file" accept="video/*" className="hidden" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} />
                    </label>
                    <label className="p-1.5 text-amber-500 hover:bg-amber-500/10 rounded-lg cursor-pointer transition-colors" title="Add Document">
                      <FileText className="h-4 w-4" />
                      <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>

                <Button onClick={createPost} disabled={isUploading || (postType === "post" && !editor?.getText().trim() && !mediaFile)} className="rounded-full px-8 shrink-0 shadow-sm">
                  {isUploading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Posting...</>) : (<><Send className="h-4 w-4 mr-2" /> {postType === "announcement" ? "Announce" : "Post"}</>)}
                </Button>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card h-48 rounded-2xl border animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => {
              const isLiked = post.likes?.some((l: any) => l.user_id === user?.id);
              const isSaved = post.saves?.some((s: any) => s.user_id === user?.id);
              const isPoll = post.post_type === "poll";
              const isAnnouncement = post.post_type === "announcement";
              const isPinned = post.is_pinned === true;
              let pollData: PollData | null = null;
              if (isPoll && post.content) { try { pollData = JSON.parse(post.content); } catch {} }
              
              return (
                <article key={post.id} className={cn("bg-card rounded-2xl border shadow-sm p-5 transition-shadow", isAnnouncement ? "border-primary/30 ring-1 ring-primary/10" : "hover:shadow-md")}>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={post.author?.avatar_url} />
                        <AvatarFallback>{post.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {post.author?.full_name || "Anonymous User"}
                          {isAnnouncement && <Badge className="text-[10px] h-5"><Megaphone className="h-3 w-3 mr-1" /> Announcement</Badge>}
                          {isPinned && !isAnnouncement && <Badge variant="secondary" className="text-[10px] h-5"><Bookmark className="h-3 w-3 mr-1" /> Pinned</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    {user?.id === post.author_id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => deletePost(post.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  
                  {isPoll && pollData ? (
                    <PollRenderer postId={post.id} pollData={pollData} votes={post.poll_votes ?? []} userId={user?.id} />
                  ) : (
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
                  )}
                  
                  {post.media_url && (
                    <div className="mb-4 rounded-xl overflow-hidden bg-accent/30 border">
                      {post.media_type === 'image' && (
                        <img src={post.media_url} alt="Post media" className="max-h-[500px] w-full object-contain" />
                      )}
                      {post.media_type === 'video' && (
                        <video src={post.media_url} controls className="max-h-[500px] w-full" />
                      )}
                      {post.media_type === 'pdf' && (
                        <div className="p-4 flex items-center gap-3">
                          <FileText className="h-8 w-8 text-rose-500" />
                          <a href={post.media_url} target="_blank" rel="noreferrer" className="font-medium hover:underline flex-1 truncate">
                            Attached Document (PDF)
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {!isPoll && (
                  <div className="flex items-center gap-6 pt-4 border-t text-muted-foreground">
                    <button onClick={() => toggleLike(post.id, isLiked)} className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${isLiked ? "text-rose-500 font-medium" : ""}`}>
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                      <span className="text-sm">{post.likes?.length || 0}</span>
                    </button>
                    <button onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)} className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>
                    <button onClick={() => toggleSave(post.id, isSaved)} className={`flex items-center gap-1.5 ml-auto hover:text-amber-500 transition-colors ${isSaved ? "text-amber-500 font-medium" : ""}`}>
                      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                  )}

                  {expandedPostId === post.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {post.comments?.length > 0 ? (
                        <div className="space-y-3">
                          {post.comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-2 text-sm">
                              <Avatar className="h-6 w-6 mt-0.5">
                                <AvatarImage src={comment.author?.avatar_url} />
                                <AvatarFallback>{comment.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-xs font-semibold">{comment.author?.full_name || "User"}</span>
                                  <span className="text-[10px] text-muted-foreground">{comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ""}</span>
                                </div>
                                <div className="bg-accent/30 rounded-lg p-2.5">
                                  <p className="text-muted-foreground whitespace-pre-wrap">{comment.content || "..."}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground text-center py-2">No comments yet. Start the conversation!</p>
                      )}
                      <div className="flex gap-2 items-end">
                        <Textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="min-h-[40px] h-[40px] resize-none" />
                        <Button size="sm" onClick={() => addComment(post.id)} disabled={!commentText.trim()}>Post</Button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}

function PollRenderer({ postId, pollData, votes, userId }: { postId: string; pollData: PollData; votes: any[]; userId?: string }) {
  const qc = useQueryClient();
  const userVote = userId ? votes.find((v: any) => v.user_id === userId) : null;
  const totalVotes = votes.length;
  const maxCount = Math.max(...pollData.options.map((_, i) => votes.filter((v: any) => v.option_index === i).length), 1);

  const castVote = async (optionIndex: number) => {
    if (!userId || userVote) return;
    const { error } = await supabase.from("post_poll_votes" as any).insert({ post_id: postId, user_id: userId, option_index: optionIndex });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  const removeVote = async () => {
    if (!userId || !userVote) return;
    const { error } = await supabase.from("post_poll_votes" as any).delete().match({ post_id: postId, user_id: userId });
    if (!error) qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  return (
    <div className="mb-4 space-y-2">
      <p className="font-semibold text-sm">{pollData.question}</p>
      <div className="space-y-1.5">
        {pollData.options.map((option, i) => {
          const count = votes.filter((v: any) => v.option_index === i).length;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isMyVote = userVote?.option_index === i;
          return (
            <button
              key={i}
              onClick={() => castVote(i)}
              disabled={!!userVote}
              className={cn(
                "relative w-full text-left p-3 rounded-xl border transition-all overflow-hidden",
                isMyVote ? "border-primary bg-primary/5 font-medium" : "hover:bg-accent/50 border-border/60",
                !!userVote ? "cursor-default" : "cursor-pointer",
              )}
            >
              <div className="absolute inset-0 transition-all" style={{ width: `${pct}%`, background: isMyVote ? "var(--primary-50, #eef2ff)" : "var(--accent-50, #f5f5f5)" }} />
              <div className="relative flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  {isMyVote && <Check className="h-4 w-4 text-primary" />}
                  {option}
                </span>
                {!!userVote && <span className="text-xs font-semibold tabular-nums">{pct}% ({count})</span>}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{totalVotes} vote{totalVotes !== 1 ? "s" : ""}</span>
        {userVote && <button onClick={removeVote} className="text-primary hover:underline">Remove vote</button>}
      </div>
    </div>
  );
}
