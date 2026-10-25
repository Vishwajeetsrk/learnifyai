import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { 
  Bell, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Award, 
  Briefcase, 
  Info, 
  AlertTriangle,
  Megaphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface NotificationRecord {
  id: string;
  title: string;
  body: string;
  type?: string;
  read: boolean;
  created_at: string;
  url?: string;
}

export function HarkNotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["hark-notifications", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.warn("Could not fetch notifications:", error.message);
        return [];
      }
      return (data || []) as NotificationRecord[];
    },
    refetchInterval: 30_000, // Polling every 30 seconds
  });

  // Mark all as read mutation
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hark-notifications", user?.id] });
    },
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "success":
      case "achievement":
        return <Award className="h-4 w-4 text-emerald-400" />;
      case "warning":
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "promo":
        return <Sparkles className="h-4 w-4 text-purple-400" />;
      case "career":
      case "interview":
        return <Briefcase className="h-4 w-4 text-indigo-400" />;
      default:
        return <Megaphone className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="h-4 w-4" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 rounded-2xl shadow-2xl border-border/80">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {isLoading ? (
            <div className="p-6 text-center text-xs text-muted-foreground">Loading alerts...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                <Bell className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <p className="text-xs font-medium text-foreground">You're all caught up!</p>
              <p className="text-[11px] text-muted-foreground">
                Course alerts, interview feedback, and certificates will appear here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 transition-colors hover:bg-muted/40 flex items-start gap-3 ${
                  !n.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="p-2 rounded-xl bg-background border border-border/60 shrink-0 mt-0.5">
                  {getTypeIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-semibold text-foreground truncate">{n.title}</h5>
                    <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                      {new Date(n.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {n.body}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 border-t border-border/60 text-center bg-muted/20">
          <Button asChild variant="ghost" size="sm" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground">
            <Link to="/inbox" onClick={() => setIsOpen(false)}>
              Open Full Inbox
              <ExternalLink className="h-3 w-3 ml-1.5" />
            </Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
