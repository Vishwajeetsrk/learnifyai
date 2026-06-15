import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, MessageCircle, Compass, Users, Check, Loader2, Send, Video, Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/coaching")({
  component: CoachingDashboard,
  head: () => ({ meta: [{ title: "Coaching — Learnify AI" }] }),
});

function CoachingDashboard() {
  const { user, isCreator } = useAuth();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"scheduling" | "messaging" | "roadmaps">("scheduling");

  const { data: coaches = [] } = useQuery({
    queryKey: ["available-coaches"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("role", "creator");
      return data || [];
    },
  });

  const { data: mySlots = [] } = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["my-coaching-slots", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("coaching_slots").select("*").eq("coach_id", user!.id).order("start_time");
      return data || [];
    },
  });

  const { data: myBookings = [] } = useQuery({
    enabled: !!user,
    queryKey: ["my-coaching-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("coaching_bookings")
        .select(`
          *,
          slot:coaching_slots(*),
          coach:profiles!coaching_bookings_coach_id_fkey(*),
          learner:profiles!coaching_bookings_learner_id_fkey(*)
        `)
        .or(`learner_id.eq.${user!.id},coach_id.eq.${user!.id}`);
      return data || [];
    },
  });

  const bookSlot = async (slotId: string, coachId: string) => {
    if (!user) return;
    try {
      const { error: slotError } = await supabase.from("coaching_slots").update({ is_booked: true }).eq("id", slotId);
      if (slotError) throw slotError;

      const { error: bookingError } = await supabase.from("coaching_bookings").insert({
        slot_id: slotId,
        learner_id: user.id,
        coach_id: coachId,
      });
      if (bookingError) throw bookingError;

      toast.success("Session booked successfully!");
      qc.invalidateQueries({ queryKey: ["available-slots"] });
      qc.invalidateQueries({ queryKey: ["my-coaching-bookings"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to book slot");
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-semibold mb-6">Coaching Hub</h1>
        
        <div className="flex gap-4 border-b mb-8">
          <button 
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "scheduling" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("scheduling")}
          >
            <Calendar className="h-4 w-4 inline-block mr-2" /> Scheduling
          </button>
          <button 
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "messaging" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("messaging")}
          >
            <MessageCircle className="h-4 w-4 inline-block mr-2" /> Messaging
          </button>
          <button 
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "roadmaps" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("roadmaps")}
          >
            <Compass className="h-4 w-4 inline-block mr-2" /> Client Roadmaps
          </button>
        </div>

        {activeTab === "scheduling" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl border p-6">
              <h3 className="font-semibold text-lg mb-4">Upcoming Sessions</h3>
              {myBookings.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Calendar className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>No upcoming sessions.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {myBookings.map((b: any) => (
                    <li key={b.id} className="p-4 border rounded-xl flex justify-between items-center bg-accent/30">
                      <div>
                        <div className="font-medium text-sm">
                          {isCreator ? `Client: ${b.learner?.full_name}` : `Coach: ${b.coach?.full_name}`}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Clock className="h-3 w-3" />
                          {b.slot && format(new Date(b.slot.start_time), "MMM d, yyyy · h:mm a")}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Video className="h-3 w-3" /> Join
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!isCreator && (
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-semibold text-lg mb-4">Book a Coach</h3>
                <div className="space-y-4">
                  {coaches.map((coach: any) => (
                    <div key={coach.id} className="p-4 border rounded-xl flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={coach.avatar_url} />
                        <AvatarFallback>{coach.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{coach.full_name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{coach.bio || "Expert Coach"}</p>
                      </div>
                      <Button size="sm" onClick={() => toast("Slot selection UI coming soon.")}>
                        View Slots
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isCreator && (
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-semibold text-lg mb-4">My Availability</h3>
                <Button size="sm" className="mb-4" onClick={() => toast("Calendar editor coming soon.")}>
                  + Add Time Slot
                </Button>
                <ul className="space-y-2">
                  {mySlots.map((s: any) => (
                    <li key={s.id} className="p-3 border rounded-lg text-sm flex justify-between items-center">
                      <span>{format(new Date(s.start_time), "MMM d · h:mm a")}</span>
                      {s.is_booked ? (
                        <span className="text-emerald-500 font-semibold text-xs bg-emerald-500/10 px-2 py-1 rounded">Booked</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Available</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "messaging" && (
          <div className="bg-card rounded-2xl border min-h-[500px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Select a contact to start messaging.</p>
            </div>
          </div>
        )}

        {activeTab === "roadmaps" && (
          <div className="bg-card rounded-2xl border p-6 text-center text-muted-foreground py-20">
            <Compass className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <h3 className="font-medium text-foreground mb-2">Client Roadmaps</h3>
            <p className="text-sm">AI-generated learning paths based on client goals.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
