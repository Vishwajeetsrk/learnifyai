import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, Share2, Bookmark, Image as ImageIcon, Video, FileText, Send, MoreHorizontal, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/_authenticated/community-feed")({
  component: CommunityPage,
  head: () => ({ meta: [{ title: "Community — Learnify AI" }] }),
});

function CommunityPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Profile data for current user
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
        .from("posts")
        .select(`
          *,
          author:profiles!posts_author_id_fkey (id, full_name, avatar_url, role),
          likes:post_likes(id, user_id),
          comments:post_comments(id),
          saves:post_saves(id, user_id)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Posts fetch error:", error);
        return [];
      }
      return data as any[];
    },
  });

  const createPost = async () => {
    if (!user || (!content.trim() && !mediaFile)) return;
    
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

      const { error } = await supabase.from("posts").insert({
        author_id: user.id,
        content: content.trim(),
        media_url: mediaUrl,
        media_type: mediaType,
      });

      if (error) throw error;
      
      setContent("");
      setMediaFile(null);
      toast.success("Post created successfully");
      qc.invalidateQueries({ queryKey: ["community-posts"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to create post");
    } finally {
      setIsUploading(false);
    }
  };

  const deletePost = async (postId: string) => {
    if (!window.confirm("Delete this post?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
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
      await supabase.from("post_likes").delete().match({ post_id: postId, user_id: user.id });
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    }
    qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  const toggleSave = async (postId: string, isSaved: boolean) => {
    if (!user) return;
    if (isSaved) {
      await supabase.from("post_saves").delete().match({ post_id: postId, user_id: user.id });
    } else {
      await supabase.from("post_saves").insert({ post_id: postId, user_id: user.id });
    }
    qc.invalidateQueries({ queryKey: ["community-posts"] });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-semibold mb-6">Community Hub</h1>
        
        {/* Create Post Box */}
        <div className="bg-card rounded-2xl border p-4 mb-8 shadow-sm">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your progress, ask a question, or post a resource..."
                className="resize-none min-h-[100px] border-none bg-accent/50 focus-visible:ring-1 text-base"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              {mediaFile && (
                <div className="relative rounded-lg overflow-hidden bg-accent inline-block">
                  <div className="p-2 flex items-center gap-2 text-sm font-medium">
                    <span className="truncate max-w-[200px]">{mediaFile.name}</span>
                    <button onClick={() => setMediaFile(null)} className="text-muted-foreground hover:text-destructive">
                      &times;
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex gap-1 text-muted-foreground">
                  <label className="p-2 hover:bg-accent rounded-full cursor-pointer transition-colors">
                    <ImageIcon className="h-5 w-5 text-indigo-500" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} />
                  </label>
                  <label className="p-2 hover:bg-accent rounded-full cursor-pointer transition-colors">
                    <Video className="h-5 w-5 text-rose-500" />
                    <input type="file" accept="video/*" className="hidden" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} />
                  </label>
                  <label className="p-2 hover:bg-accent rounded-full cursor-pointer transition-colors">
                    <FileText className="h-5 w-5 text-amber-500" />
                    <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <Button 
                  onClick={createPost} 
                  disabled={isUploading || (!content.trim() && !mediaFile)}
                  className="rounded-full px-6"
                >
                  {isUploading ? "Posting..." : <><Send className="h-4 w-4 mr-2" /> Post</>}
                </Button>
              </div>
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
              
              return (
                <article key={post.id} className="bg-card rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={post.author?.avatar_url} />
                        <AvatarFallback>{post.author?.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {post.author?.full_name || "Anonymous User"}
                          {post.author?.role === "creator" && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Coach</span>
                          )}
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
                  
                  <div className="text-sm whitespace-pre-wrap mb-4">{post.content}</div>
                  
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

                  <div className="flex items-center gap-6 pt-4 border-t text-muted-foreground">
                    <button 
                      onClick={() => toggleLike(post.id, isLiked)}
                      className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${isLiked ? "text-rose-500 font-medium" : ""}`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                      <span className="text-sm">{post.likes?.length || 0}</span>
                    </button>
                    
                    <button className="flex items-center gap-1.5 hover:text-indigo-500 transition-colors">
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm">{post.comments?.length || 0}</span>
                    </button>

                    <button 
                      onClick={() => toggleSave(post.id, isSaved)}
                      className={`flex items-center gap-1.5 ml-auto hover:text-amber-500 transition-colors ${isSaved ? "text-amber-500 font-medium" : ""}`}
                    >
                      <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
