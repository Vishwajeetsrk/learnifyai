import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Calendar, MessageCircle, Compass, Users, Check, Loader2, Send, Video, Clock, ChevronRight, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_authenticated/coaching")({
  component: CoachingDashboard,
  head: () => ({ meta: [{ title: "Coaching — Learnify AI" }] }),
});

function CoachingDashboard() {
  const { user, isCreator } = useAuth();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<"scheduling" | "messaging" | "roadmaps" | "outcomes" | "cohorts">("scheduling");

  const [runAudit, setRunAudit] = useState<"idle" | "auditing" | "done">("idle");
  const [cohortStatus, setCohortStatus] = useState<"idle" | "starting" | "live">("idle");

  // Scheduling State
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");
  const [newSlotPrice, setNewSlotPrice] = useState("0");
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);

  // Messaging State
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

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
      const { data } = await supabase.from("coaching_slots" as any).select("*").eq("coach_id", user!.id).order("start_time");
      return data || [];
    },
  });

  const { data: coachSlots = [] } = useQuery({
    enabled: !!selectedCoachId,
    queryKey: ["coach-slots", selectedCoachId],
    queryFn: async () => {
      const { data } = await supabase.from("coaching_slots" as any).select("*").eq("coach_id", selectedCoachId).eq("is_booked", false).order("start_time");
      return data || [];
    },
  });

  const { data: myBookings = [] } = useQuery({
    enabled: !!user,
    queryKey: ["my-coaching-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("coaching_bookings" as any)
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

  const contacts = Array.from(new Map(myBookings.map((b: any) => {
    const contact = isCreator ? b.learner : b.coach;
    return [contact.id, contact];
  })).values());

  const { data: messages = [] } = useQuery({
    enabled: !!user && !!activeChatUser,
    queryKey: ["messages", user?.id, activeChatUser?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("messages" as any)
        .select("*")
        .or(`and(sender_id.eq.${user!.id},receiver_id.eq.${activeChatUser!.id}),and(sender_id.eq.${activeChatUser!.id},receiver_id.eq.${user!.id})`)
        .order("created_at", { ascending: true });
      return data || [];
    },
  });

  const addSlot = async () => {
    if (!user || !newSlotStart || !newSlotEnd) return;
    try {
      const { error } = await supabase.from("coaching_slots" as any).insert({
        coach_id: user.id,
        start_time: new Date(newSlotStart).toISOString(),
        end_time: new Date(newSlotEnd).toISOString(),
        price_inr: parseFloat(newSlotPrice),
      });
      if (error) throw error;
      toast.success("Slot added");
      qc.invalidateQueries({ queryKey: ["my-coaching-slots"] });
    } catch (e: any) {
      toast.error("Failed to add slot");
    }
  };

  const bookSlot = async (slotId: string) => {
    if (!user || !selectedCoachId) return;
    try {
      const { error: slotError } = await supabase.from("coaching_slots" as any).update({ is_booked: true }).eq("id", slotId);
      if (slotError) throw slotError;

      const { error: bookingError } = await supabase.from("coaching_bookings" as any).insert({
        slot_id: slotId,
        learner_id: user.id,
        coach_id: selectedCoachId,
      });
      if (bookingError) throw bookingError;

      toast.success("Session booked successfully!");
      setSelectedCoachId(null);
      qc.invalidateQueries({ queryKey: ["my-coaching-bookings"] });
    } catch (e: any) {
      toast.error(e.message || "Failed to book slot");
    }
  };

  const sendMessage = async () => {
    if (!user || !activeChatUser || !messageText.trim()) return;
    try {
      const { error } = await supabase.from("messages" as any).insert({
        sender_id: user.id,
        receiver_id: activeChatUser.id,
        content: messageText.trim()
      });
      if (error) throw error;
      setMessageText("");
      qc.invalidateQueries({ queryKey: ["messages", user.id, activeChatUser.id] });
    } catch (e) {
      toast.error("Failed to send message");
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
          <button 
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "outcomes" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("outcomes")}
          >
            <TrendingUp className="h-4 w-4 inline-block mr-2" /> Outcomes
          </button>
          {isCreator && (
            <button 
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "cohorts" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveTab("cohorts")}
            >
              <Users className="h-4 w-4 inline-block mr-2" /> Cohorts
            </button>
          )}
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
                <h3 className="font-semibold text-lg mb-4">
                  {selectedCoachId ? "Select a Slot" : "Book a Coach"}
                </h3>
                
                {!selectedCoachId ? (
                  <div className="space-y-4">
                    {coaches.map((coach: any) => (
                      <div key={coach.id} className="p-4 border rounded-xl flex items-center gap-4 hover:border-primary/50 cursor-pointer transition-colors" onClick={() => setSelectedCoachId(coach.id)}>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={coach.avatar_url} />
                          <AvatarFallback>{coach.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{coach.full_name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-1">{coach.bio || "Expert Coach"}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <Button variant="ghost" size="sm" className="mb-4" onClick={() => setSelectedCoachId(null)}>← Back to coaches</Button>
                    {coachSlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No available slots for this coach.</p>
                    ) : (
                      <div className="space-y-3">
                        {coachSlots.map((s: any) => (
                          <div key={s.id} className="p-4 border rounded-xl flex justify-between items-center">
                            <span className="text-sm font-medium">{format(new Date(s.start_time), "MMM d, yyyy · h:mm a")}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-primary">₹{s.price_inr}</span>
                              <Button size="sm" onClick={() => bookSlot(s.id)}>Book</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {isCreator && (
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-semibold text-lg mb-4">My Availability</h3>
                
                <div className="flex gap-2 mb-6 items-end">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Start Time</label>
                    <Input type="datetime-local" value={newSlotStart} onChange={e => setNewSlotStart(e.target.value)} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">End Time</label>
                    <Input type="datetime-local" value={newSlotEnd} onChange={e => setNewSlotEnd(e.target.value)} />
                  </div>
                  <div className="w-24">
                    <label className="text-xs text-muted-foreground">Price (₹)</label>
                    <Input type="number" value={newSlotPrice} onChange={e => setNewSlotPrice(e.target.value)} />
                  </div>
                  <Button onClick={addSlot} disabled={!newSlotStart || !newSlotEnd}>Add</Button>
                </div>

                <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                  {mySlots.map((s: any) => (
                    <li key={s.id} className="p-3 border rounded-lg text-sm flex justify-between items-center">
                      <span>{format(new Date(s.start_time), "MMM d · h:mm a")} - {format(new Date(s.end_time), "h:mm a")}</span>
                      {s.is_booked ? (
                        <span className="text-emerald-500 font-semibold text-xs bg-emerald-500/10 px-2 py-1 rounded">Booked</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Available (₹{s.price_inr})</span>
                      )}
                    </li>
                  ))}
                  {mySlots.length === 0 && <p className="text-sm text-muted-foreground py-4">No slots added yet.</p>}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "messaging" && (
          <div className="bg-card rounded-2xl border h-[600px] flex overflow-hidden">
            {/* Contacts Sidebar */}
            <div className="w-1/3 border-r bg-accent/10 flex flex-col">
              <div className="p-4 border-b font-medium">Conversations</div>
              <div className="flex-1 overflow-y-auto">
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center p-4">No contacts yet. Book a session first!</p>
                ) : (
                  contacts.map((c: any) => (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveChatUser(c)}
                      className={`p-4 border-b cursor-pointer flex gap-3 items-center transition-colors ${activeChatUser?.id === c.id ? "bg-accent" : "hover:bg-accent/50"}`}
                    >
                      <Avatar>
                        <AvatarImage src={c.avatar_url} />
                        <AvatarFallback>{c.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-sm">{c.full_name}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-background">
              {activeChatUser ? (
                <>
                  <div className="p-4 border-b font-medium flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activeChatUser.avatar_url} />
                      <AvatarFallback>{activeChatUser.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {activeChatUser.full_name}
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-10">No messages yet. Say hello!</p>
                    ) : (
                      messages.map((m: any) => {
                        const isMine = m.sender_id === user?.id;
                        return (
                          <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMine ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-accent rounded-tl-sm"}`}>
                              {m.content}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="p-4 border-t flex gap-2">
                    <Textarea 
                      placeholder="Type a message..." 
                      className="min-h-[40px] h-[40px] resize-none"
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={sendMessage} disabled={!messageText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
                  <p>Select a conversation to start messaging.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "roadmaps" && (
          <div className="bg-card rounded-2xl border p-6 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <Compass className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium text-lg text-foreground">Client Roadmaps</h3>
                <p className="text-sm text-muted-foreground">AI-generated and coach-curated learning paths.</p>
              </div>
            </div>

            {isCreator ? (
              <div className="space-y-4">
                {contacts.map((c: any) => (
                  <div key={c.id} className="p-4 border rounded-xl flex justify-between items-center bg-accent/10 hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={c.avatar_url} />
                        <AvatarFallback>{c.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{c.full_name}</div>
                        <div className="text-xs text-muted-foreground">No active roadmap</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toast.info("Roadmap generator AI feature coming soon")}>
                      Generate Roadmap
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Compass className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>No active roadmap assigned by your coach yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "outcomes" && (
          <div className="bg-card rounded-2xl border p-6 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium text-lg text-foreground">Outcome Tracking</h3>
                <p className="text-sm text-muted-foreground">Track learning progress, skill acquisition, and ROI.</p>
              </div>
            </div>

            <div className="max-w-xl border rounded-2xl p-6 bg-accent/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-2xl font-bold">Skill Audit</div>
                  <div className="text-sm text-muted-foreground">Latest assessment: Never</div>
                </div>
              </div>
              
              {runAudit === "idle" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Run an AI-powered skill audit on recent coursework and quiz scores to generate a quantitative progress report.
                  </p>
                  <Button onClick={() => {
                    setRunAudit("auditing");
                    setTimeout(() => setRunAudit("done"), 1200);
                  }}>
                    Run Skill Audit
                  </Button>
                </div>
              )}

              {runAudit === "auditing" && (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Analyzing recent data...</p>
                </div>
              )}

              {runAudit === "done" && (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">System Design</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">+15% improvement</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-emerald-700 dark:text-emerald-400">React Foundations</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">+5% improvement</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setRunAudit("idle")}>Reset Audit</Button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "cohorts" && isCreator && (
          <div className="bg-card rounded-2xl border p-6 min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium text-lg text-foreground">Live Cohort Manager</h3>
                <p className="text-sm text-muted-foreground">Manage your high-ticket live cohorts.</p>
              </div>
            </div>

            <div className="max-w-xl border rounded-2xl p-6 bg-accent/10">
              <div className="mb-6">
                <div className="text-xl font-bold">Fall 2026 Developer Bootcamp</div>
                <div className="text-sm text-muted-foreground mt-1 flex gap-4">
                  <span>24 Enrolled</span>
                  <span>Starts in 2 weeks</span>
                </div>
              </div>

              {cohortStatus === "idle" && (
                <Button className="w-full" onClick={() => {
                  setCohortStatus("starting");
                  setTimeout(() => setCohortStatus("live"), 1500);
                }}>
                  Launch Opening Ceremony Room
                </Button>
              )}

              {cohortStatus === "starting" && (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Spinning up live room infrastructure...</p>
                </div>
              )}

              {cohortStatus === "live" && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" /> Live Now
                  </div>
                  <h4 className="font-semibold text-foreground">Room is active</h4>
                  <p className="text-xs text-muted-foreground">12 students currently waiting in the lobby.</p>
                  <Button className="w-full mt-2 gap-2">
                    <Video className="h-4 w-4" /> Enter Studio
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
