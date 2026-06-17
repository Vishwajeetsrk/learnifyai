import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Trash2,
  Inbox as InboxIcon,
  Clock,
  Loader2,
  CalendarClock,
  Power,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/inbox")({
  head: () => ({ meta: [{ title: "Inbox — Learnify AI" }] }),
  component: InboxPage,
});

function InboxPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const notifs = useQuery({
    enabled: !!user,
    queryKey: ["inbox-notifs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  const reminders = useQuery({
    enabled: !!user,
    queryKey: ["inbox-reminders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduled_reminders")
        .select("*")
        .order("next_run_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["inbox-notifs"] });
  };
  const del = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["inbox-notifs"] });
  };
  const delReminder = async (id: string) => {
    await supabase.from("scheduled_reminders").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["inbox-reminders"] });
    toast.success("Reminder deleted");
  };
  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from("scheduled_reminders").update({ active: !active }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["inbox-reminders"] });
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-4xl">
        <div className="flex items-center gap-2">
          <InboxIcon className="h-5 w-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-display font-semibold">Inbox</h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">Notifications and upcoming reminders.</p>

        <Tabs defaultValue="notifs" className="mt-6">
          <TabsList>
            <TabsTrigger value="notifs">
              <Bell className="h-3.5 w-3.5" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="reminders">
              <CalendarClock className="h-3.5 w-3.5" /> Reminders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notifs" className="space-y-2 pt-4">
            {notifs.isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto my-12" />
            ) : (notifs.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                No notifications yet.
              </p>
            ) : (
              (notifs.data ?? []).map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "border rounded-lg p-3 sm:p-4 flex gap-3",
                    !n.read && "bg-primary/5 border-primary/30",
                  )}
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm sm:text-base">{n.title}</h3>
                      {!n.read && (
                        <Badge variant="secondary" className="text-[10px]">
                          New
                        </Badge>
                      )}
                    </div>
                    {n.body && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                        {n.body}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-2">
                      {format(new Date(n.created_at), "dd MMM yyyy · HH:mm")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {!n.read && (
                      <Button size="sm" variant="ghost" onClick={() => markRead(n.id)}>
                        Mark read
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => del(n.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="reminders" className="space-y-2 pt-4">
            {reminders.isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto my-12" />
            ) : (reminders.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                No scheduled reminders. Create one from{" "}
                <a href="/ai-tools" className="text-primary underline">
                  AI Tools → Smart Reminders
                </a>
                .
              </p>
            ) : (
              (reminders.data ?? []).map((r) => (
                <div key={r.id} className="border rounded-lg p-3 sm:p-4 flex gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 grid place-items-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base">{r.title}</h3>
                    {r.body && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.body}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px]">
                        {r.frequency}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">
                        Next: {format(new Date(r.next_run_at), "dd MMM yyyy · HH:mm")}
                      </span>
                      {!r.active && (
                        <Badge variant="secondary" className="text-[10px]">
                          paused
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleActive(r.id, r.active)}
                    >
                      <Power
                        className={cn(
                          "h-4 w-4",
                          r.active ? "text-emerald-500" : "text-muted-foreground",
                        )}
                      />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => delReminder(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
