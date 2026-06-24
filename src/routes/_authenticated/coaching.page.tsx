import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar,
  MessageCircle,
  Compass,
  Users,
  Check,
  Loader2,
  Send,
  Video,
  Clock,
  ChevronRight,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RoadmapBuilder from "@/components/admin/RoadmapBuilder";

export default function CoachingDashboard() {
  const { user, isCreator } = useAuth();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "scheduling" | "messaging" | "roadmaps" | "outcomes" | "cohorts"
  >("scheduling");

  // Scheduling State
  const [newSlotStart, setNewSlotStart] = useState("");
  const [newSlotEnd, setNewSlotEnd] = useState("");
  const [newSlotPrice, setNewSlotPrice] = useState("0");
  const [newSlotMeetingLink, setNewSlotMeetingLink] = useState("");
  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [editSlotStart, setEditSlotStart] = useState("");
  const [editSlotEnd, setEditSlotEnd] = useState("");
  const [editSlotPrice, setEditSlotPrice] = useState("0");
  const [editSlotMeetingLink, setEditSlotMeetingLink] = useState("");

  // Messaging State
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  const [messageText, setMessageText] = useState("");

  const { data: coaches = [] } = useQuery({
    queryKey: ["available-coaches"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "creator");
      if (!roles || roles.length === 0) return [];
      const userIds = roles.map((r: any) => r.user_id);
      const { data } = await supabase
        .from("profiles" as any)
        .select("*")
        .in("id", userIds);
      return data || [];
    },
  });

  const { data: mySlots = [] } = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["my-coaching-slots", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("coaching_slots" as any)
        .select("*")
        .eq("coach_id", user!.id)
        .order("start_time");
      return data || [];
    },
  });

  const { data: coachSlots = [] } = useQuery({
    enabled: !!selectedCoachId,
    queryKey: ["coach-slots", selectedCoachId],
    queryFn: async () => {
      const { data } = await supabase
        .from("coaching_slots" as any)
        .select("*")
        .eq("coach_id", selectedCoachId)
        .eq("is_booked", false)
        .order("start_time");
      return data || [];
    },
  });

  const { data: myBookings = [] } = useQuery({
    enabled: !!user,
    queryKey: ["my-coaching-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("coaching_bookings" as any)
        .select(
          `
          *,
          slot:coaching_slots(*),
          coach:profiles!coaching_bookings_coach_id_fkey(*),
          learner:profiles!coaching_bookings_learner_id_fkey(*)
        `,
        )
        .or(`learner_id.eq.${user!.id},coach_id.eq.${user!.id}`);
      return data || [];
    },
  });

  const contacts = Array.from(
    new Map(
      myBookings.map((b: any) => {
        const contact = isCreator ? b.learner : b.coach;
        return [contact.id, contact];
      }),
    ).values(),
  );

  const { data: messages = [] } = useQuery({
    enabled: !!user && !!activeChatUser,
    queryKey: ["messages", user?.id, activeChatUser?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("messages" as any)
        .select("*")
        .or(
          `and(sender_id.eq.${user!.id},receiver_id.eq.${activeChatUser!.id}),and(sender_id.eq.${activeChatUser!.id},receiver_id.eq.${user!.id})`,
        )
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
        meeting_link: newSlotMeetingLink.trim() || null,
      });
      if (error) throw error;
      toast.success("Slot added");
      setNewSlotStart("");
      setNewSlotEnd("");
      setNewSlotPrice("0");
      setNewSlotMeetingLink("");
      qc.invalidateQueries({ queryKey: ["my-coaching-slots"] });
    } catch (e: any) {
      toast.error("Failed to add slot");
    }
  };

  const deleteSlot = async (slotId: string) => {
    if (!window.confirm("Delete this slot?")) return;
    const { error } = await supabase
      .from("coaching_slots" as any)
      .delete()
      .eq("id", slotId);
    if (error) return toast.error("Failed to delete slot");
    toast.success("Slot deleted");
    qc.invalidateQueries({ queryKey: ["my-coaching-slots"] });
  };

  const openEditSlot = (slot: any) => {
    setEditingSlot(slot);
    setEditSlotStart(new Date(slot.start_time).toISOString().slice(0, 16));
    setEditSlotEnd(new Date(slot.end_time).toISOString().slice(0, 16));
    setEditSlotPrice(String(slot.price_inr || 0));
    setEditSlotMeetingLink(slot.meeting_link || "");
  };

  const saveEditSlot = async () => {
    if (!editingSlot) return;
    const { error } = await supabase
      .from("coaching_slots" as any)
      .update({
        start_time: new Date(editSlotStart).toISOString(),
        end_time: new Date(editSlotEnd).toISOString(),
        price_inr: parseFloat(editSlotPrice),
        meeting_link: editSlotMeetingLink.trim() || null,
      })
      .eq("id", editingSlot.id);
    if (error) return toast.error("Failed to update slot");
    toast.success("Slot updated");
    setEditingSlot(null);
    qc.invalidateQueries({ queryKey: ["my-coaching-slots"] });
  };

  const bookSlot = async (slotId: string) => {
    if (!user || !selectedCoachId) return;
    try {
      const { error: slotError } = await supabase
        .from("coaching_slots" as any)
        .update({ is_booked: true })
        .eq("id", slotId);
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
        content: messageText.trim(),
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

        <div className="flex gap-4 border-b mb-8 overflow-x-auto -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start ${activeTab === "scheduling" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("scheduling")}
          >
            <Calendar className="h-4 w-4 inline-block mr-2" /> Scheduling
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start ${activeTab === "messaging" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("messaging")}
          >
            <MessageCircle className="h-4 w-4 inline-block mr-2" /> Messaging
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start ${activeTab === "roadmaps" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("roadmaps")}
          >
            <Compass className="h-4 w-4 inline-block mr-2" /> Roadmaps
          </button>
          <button
            className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start ${activeTab === "outcomes" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("outcomes")}
          >
            <TrendingUp className="h-4 w-4 inline-block mr-2" /> Outcomes
          </button>
          {isCreator && (
            <button
              className={`pb-3 text-sm font-medium border-b-2 transition-colors shrink-0 snap-start ${activeTab === "cohorts" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
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
                <div className="text-center py-12 px-4 rounded-xl border border-dashed bg-accent/20 text-muted-foreground">
                  <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30 text-primary" />
                  <p className="font-medium text-foreground mb-1">No upcoming sessions</p>
                  <p className="text-sm">Your booked coaching sessions will appear here.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {myBookings.map((b: any) => (
                    <li
                      key={b.id}
                      className="p-4 border border-border/50 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-br from-card to-accent/10 shadow-sm transition-all hover:shadow-md"
                    >
                      <div>
                        <div className="font-medium text-sm text-foreground flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={isCreator ? b.learner?.avatar_url : b.coach?.avatar_url}
                            />
                            <AvatarFallback className="text-[10px]">
                              {isCreator
                                ? b.learner?.full_name?.charAt(0)
                                : b.coach?.full_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {isCreator
                            ? `Client: ${b.learner?.full_name}`
                            : `Coach: ${b.coach?.full_name}`}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2 font-medium">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {b.slot && format(new Date(b.slot.start_time), "MMM d, yyyy · h:mm a")}
                        </div>
                        {b.slot?.meeting_link && (
                          <div className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            <a
                              href={b.slot.meeting_link}
                              target="_blank"
                              rel="noreferrer"
                              className="hover:underline"
                            >
                              {b.slot.meeting_link
                                .replace(/^https?:\/\//, "")
                                .replace(/\/$/, "")
                                .substring(0, 35)}
                              ...
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {b.slot?.meeting_link ? (
                          <a href={b.slot.meeting_link} target="_blank" rel="noreferrer">
                            <Button size="sm" className="w-full sm:w-auto gap-2">
                              <Video className="h-3.5 w-3.5" /> Join Session
                            </Button>
                          </a>
                        ) : (
                          <Button size="sm" className="w-full sm:w-auto gap-2" disabled>
                            <Video className="h-3.5 w-3.5" /> Join Session
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {!isCreator && (
              <div className="bg-card rounded-2xl border p-6 flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-4">
                  {selectedCoachId ? "Select a Slot" : "Book a Coach"}
                </h3>

                {!selectedCoachId ? (
                  <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                    {coaches.map((coach: any) => (
                      <div
                        key={coach.id}
                        className="p-3 border rounded-xl flex items-center gap-4 hover:border-primary/50 hover:bg-accent/30 cursor-pointer transition-all"
                        onClick={() => setSelectedCoachId(coach.id)}
                      >
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={coach.avatar_url} />
                          <AvatarFallback>{coach.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{coach.full_name}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {coach.bio || "Expert Coach"}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-50" />
                      </div>
                    ))}
                    {coaches.length === 0 && (
                      <div className="text-center py-10 text-muted-foreground border rounded-xl border-dashed">
                        No coaches available right now.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mb-4 self-start text-muted-foreground hover:text-foreground -ml-2"
                      onClick={() => setSelectedCoachId(null)}
                    >
                      ← Back to coaches
                    </Button>
                    {coachSlots.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center border border-dashed rounded-xl p-8 text-center text-muted-foreground">
                        No available slots for this coach.
                      </div>
                    ) : (
                      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                        {coachSlots.map((s: any) => (
                          <div
                            key={s.id}
                            className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-primary opacity-70" />
                              <span className="text-sm font-medium">
                                {format(new Date(s.start_time), "MMM d, yyyy · h:mm a")}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 justify-between sm:justify-end w-full sm:w-auto">
                              <span className="text-sm font-semibold px-2 py-1 bg-accent rounded-md">
                                ₹{s.price_inr}
                              </span>
                              <Button size="sm" onClick={() => bookSlot(s.id)}>
                                Book Slot
                              </Button>
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
              <div className="bg-card rounded-2xl border p-6 flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-4">My Availability</h3>

                <div className="bg-accent/30 border border-border/50 rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-medium mb-3">Add New Slot</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Start Time
                      </label>
                      <Input
                        type="datetime-local"
                        className="h-10"
                        value={newSlotStart}
                        onChange={(e) => setNewSlotStart(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        End Time
                      </label>
                      <Input
                        type="datetime-local"
                        className="h-10"
                        value={newSlotEnd}
                        onChange={(e) => setNewSlotEnd(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Meeting Link (Google Meet / Zoom)
                    </label>
                    <Input
                      type="url"
                      className="h-10 mt-1.5"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      value={newSlotMeetingLink}
                      onChange={(e) => setNewSlotMeetingLink(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="space-y-1.5 w-full sm:w-1/4">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Price (₹)
                      </label>
                      <Input
                        type="number"
                        className="h-10"
                        placeholder="e.g. 500"
                        value={newSlotPrice}
                        onChange={(e) => setNewSlotPrice(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={addSlot}
                      disabled={!newSlotStart || !newSlotEnd}
                      className="w-full sm:w-3/4 h-10"
                    >
                      Add Slot to Calendar
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                  <h4 className="text-sm font-medium sticky top-0 bg-card py-2 border-b mb-2 z-10">
                    Manage Slots
                  </h4>
                  {mySlots.map((s: any) => (
                    <div
                      key={s.id}
                      className="p-3.5 border rounded-xl text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{format(new Date(s.start_time), "MMM d, yyyy")}</span>
                        <span className="text-muted-foreground mx-1">·</span>
                        <span>
                          {format(new Date(s.start_time), "h:mm a")} -{" "}
                          {format(new Date(s.end_time), "h:mm a")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {s.meeting_link && (
                          <a
                            href={s.meeting_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-500 hover:underline truncate max-w-[140px] hidden sm:block"
                            title={s.meeting_link}
                          >
                            <Video className="h-3 w-3 inline mr-1" />
                            Meet
                          </a>
                        )}
                        <span className="font-semibold px-2 py-0.5 rounded-md border text-muted-foreground text-xs">
                          ₹{s.price_inr}
                        </span>
                        {s.is_booked ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Booked
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs font-medium px-2.5 py-1 rounded-full bg-accent">
                            Available
                          </span>
                        )}
                        {!s.is_booked && (
                          <>
                            <button
                              onClick={() => openEditSlot(s)}
                              className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-accent transition-colors"
                              title="Edit Slot"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteSlot(s.id)}
                              className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors"
                              title="Delete Slot"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {mySlots.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-xl">
                      <p className="text-sm">No slots added yet.</p>
                      <p className="text-xs mt-1">Add slots above so learners can book you.</p>
                    </div>
                  )}
                </div>

                {/* Edit Slot Dialog */}
                <Dialog
                  open={!!editingSlot}
                  onOpenChange={(open) => {
                    if (!open) setEditingSlot(null);
                  }}
                >
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Slot</DialogTitle>
                      <DialogDescription>Update your availability slot details.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label>Start Time</Label>
                          <Input
                            type="datetime-local"
                            value={editSlotStart}
                            onChange={(e) => setEditSlotStart(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>End Time</Label>
                          <Input
                            type="datetime-local"
                            value={editSlotEnd}
                            onChange={(e) => setEditSlotEnd(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Meeting Link (Google Meet / Zoom)</Label>
                        <Input
                          type="url"
                          placeholder="https://meet.google.com/xxx-xxxx-xxx"
                          value={editSlotMeetingLink}
                          onChange={(e) => setEditSlotMeetingLink(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Price (₹)</Label>
                        <Input
                          type="number"
                          value={editSlotPrice}
                          onChange={(e) => setEditSlotPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingSlot(null)}>
                        Cancel
                      </Button>
                      <Button onClick={saveEditSlot}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        )}

        {activeTab === "messaging" && (
          <div className="bg-card rounded-2xl border h-[400px] sm:h-[600px] flex overflow-hidden">
            {/* Contacts Sidebar */}
            <div className="w-1/3 border-r bg-accent/10 flex flex-col">
              <div className="p-4 border-b font-medium">Conversations</div>
              <div className="flex-1 overflow-y-auto">
                {contacts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center p-4">
                    No contacts yet. Book a session first!
                  </p>
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
                      <p className="text-center text-muted-foreground text-sm py-10">
                        No messages yet. Say hello!
                      </p>
                    ) : (
                      messages.map((m: any) => {
                        const isMine = m.sender_id === user?.id;
                        return (
                          <div
                            key={m.id}
                            className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMine ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-accent rounded-tl-sm"}`}
                            >
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
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
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

        {activeTab === "roadmaps" && <RoadmapBuilder user={user} isCreator={isCreator} />}

        {activeTab === "outcomes" && <RealOutcomes user={user} />}

        {activeTab === "cohorts" && isCreator && <RealCohorts user={user} />}
      </div>
    </AppShell>
  );
}

function RealCohorts({ user }: { user: any }) {
  const qc = useQueryClient();
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    starts_at: "",
    kind: "cohort",
    capacity: 20,
  });
  const [editingCohort, setEditingCohort] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    starts_at: "",
    kind: "cohort",
    capacity: 20,
  });

  const { data: cohorts = [], isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["coaching-cohorts", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("cohorts")
        .select("*, cohort_members(count)")
        .eq("creator_id", user!.id)
        .order("starts_at", { ascending: false });
      return data ?? [];
    },
  });

  const createCohort = async () => {
    if (!form.title.trim() || !form.starts_at) return toast.error("Title and start date required");
    const { error } = await supabase.from("cohorts").insert({
      creator_id: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      starts_at: new Date(form.starts_at).toISOString(),
      kind: form.kind,
      capacity: form.capacity,
    });
    if (error) return toast.error(error.message);
    toast.success("Cohort created");
    setNewOpen(false);
    setForm({ title: "", description: "", starts_at: "", kind: "cohort", capacity: 20 });
    qc.invalidateQueries({ queryKey: ["coaching-cohorts"] });
  };

  const launchCohort = async (id: string) => {
    const { error } = await supabase.from("cohorts").update({ status: "live" }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["coaching-cohorts"] });
    toast.success("Cohort launched");
  };

  const deleteCohort = async (id: string) => {
    if (!window.confirm("Delete this cohort?")) return;
    const { error } = await supabase.from("cohorts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Cohort deleted");
    qc.invalidateQueries({ queryKey: ["coaching-cohorts"] });
  };

  const openEditCohort = (c: any) => {
    setEditingCohort(c);
    setEditForm({
      title: c.title,
      description: c.description || "",
      starts_at: new Date(c.starts_at).toISOString().slice(0, 16),
      kind: c.kind,
      capacity: c.capacity,
    });
  };

  const saveEditCohort = async () => {
    if (!editingCohort) return;
    const { error } = await supabase
      .from("cohorts")
      .update({
        title: editForm.title.trim(),
        description: editForm.description.trim() || null,
        starts_at: new Date(editForm.starts_at).toISOString(),
        kind: editForm.kind,
        capacity: editForm.capacity,
      })
      .eq("id", editingCohort.id);
    if (error) return toast.error(error.message);
    toast.success("Cohort updated");
    setEditingCohort(null);
    qc.invalidateQueries({ queryKey: ["coaching-cohorts"] });
  };

  const shareViaWhatsApp = (c: any) => {
    const text = encodeURIComponent(
      `Join my cohort: ${c.title}\nStarts: ${format(new Date(c.starts_at), "MMM d, yyyy · h:mm a")}\n${c.description || ""}\n\nSign up here: ${window.location.origin}/coaching`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="bg-card rounded-2xl border p-6 min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium text-lg text-foreground">Live Cohort Manager</h3>
            <p className="text-sm text-muted-foreground">
              Manage your cohorts, sessions, and members.
            </p>
          </div>
        </div>
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogTrigger asChild>
            <Button>
              <Users className="h-4 w-4" /> New cohort
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create cohort</DialogTitle>
              <DialogDescription>Set up a new live learning cohort.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Fall 2026 Bootcamp"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Start date</Label>
                  <Input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createCohort}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin mx-auto my-12" />
      ) : cohorts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No cohorts yet</p>
          <p className="text-sm mt-1">Create your first cohort to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {cohorts.map((c: any) => {
            const memberCount = c.cohort_members?.[0]?.count ?? c.cohort_members?.length ?? 0;
            const isLive = c.status === "live";
            const isScheduled = c.status === "scheduled";
            return (
              <div key={c.id} className="rounded-xl border p-4 space-y-3 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold truncate">{c.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {c.kind.replace("_", " ")} · {memberCount} enrolled
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 flex-wrap">
                    {!isLive && (
                      <>
                        <button
                          onClick={() => openEditCohort(c)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          title="Edit Cohort"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteCohort(c.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Cohort"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => shareViaWhatsApp(c)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                      title="Share on WhatsApp"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>
                    <Badge
                      className={`text-[10px] ${isLive ? "bg-rose-500" : "bg-muted text-muted-foreground"}`}
                    >
                      {c.status}
                    </Badge>
                  </div>
                </div>
                {c.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                )}
                <div className="mt-auto text-xs text-muted-foreground">
                  Starts {format(new Date(c.starts_at), "MMM d, yyyy · h:mm a")}
                </div>
                {isScheduled && (
                  <Button size="sm" className="w-full" onClick={() => launchCohort(c.id)}>
                    <Video className="h-4 w-4" /> Launch Now
                  </Button>
                )}
                {isLive && (
                  <Button size="sm" className="w-full gap-2">
                    <Video className="h-4 w-4" /> Enter Studio
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Cohort Dialog */}
      <Dialog
        open={!!editingCohort}
        onOpenChange={(open) => {
          if (!open) setEditingCohort(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Cohort</DialogTitle>
            <DialogDescription>Update your cohort details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Start date</Label>
                <Input
                  type="datetime-local"
                  value={editForm.starts_at}
                  onChange={(e) => setEditForm({ ...editForm, starts_at: e.target.value })}
                />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={editForm.capacity}
                  onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCohort(null)}>
              Cancel
            </Button>
            <Button onClick={saveEditCohort}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RealOutcomes({ user }: { user: any }) {
  const { data: attempts = [] } = useQuery({
    enabled: !!user,
    queryKey: ["coaching-outcomes", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("mcq_attempts")
        .select("course_id, score, total, passed, created_at, courses:course_id(title)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: enroll = [] } = useQuery({
    enabled: !!user,
    queryKey: ["coaching-enroll", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("course_id, progress_pct, completed_at, courses:course_id(title)")
        .eq("user_id", user!.id);
      return data ?? [];
    },
  });

  const totalAttempts = attempts.length;
  const passed = attempts.filter((a: any) => a.passed).length;
  const avgScore =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce(
            (s: number, a: any) => s + (a.total > 0 ? (a.score / a.total) * 100 : 0),
            0,
          ) / totalAttempts,
        )
      : 0;
  const completedCourses = enroll.filter((e: any) => e.completed_at).length;

  return (
    <div className="bg-card rounded-2xl border p-6 min-h-[400px]">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h3 className="font-medium text-lg text-foreground">Outcome Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Real quiz scores, course progress, and milestones.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border bg-accent/10 p-4">
          <div className="text-2xl font-bold">{totalAttempts}</div>
          <div className="text-xs text-muted-foreground">Quiz attempts</div>
        </div>
        <div className="rounded-xl border bg-emerald-500/10 p-4">
          <div className="text-2xl font-bold text-emerald-600">
            {passed}/{totalAttempts}
          </div>
          <div className="text-xs text-muted-foreground">Passed</div>
        </div>
        <div className="rounded-xl border bg-primary/5 p-4">
          <div className="text-2xl font-bold">{avgScore}%</div>
          <div className="text-xs text-muted-foreground">Avg score</div>
        </div>
        <div className="rounded-xl border bg-amber-500/10 p-4">
          <div className="text-2xl font-bold">
            {completedCourses}/{enroll.length}
          </div>
          <div className="text-xs text-muted-foreground">Courses completed</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 space-y-3">
          <h4 className="font-semibold text-sm">Recent Attempts</h4>
          {attempts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No quiz attempts yet.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {attempts.slice(0, 10).map((a: any) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between text-sm border-b pb-1 last:border-0"
                >
                  <span className="truncate mr-2">{a.courses?.title ?? "Quiz"}</span>
                  <span
                    className={`font-semibold tabular-nums ${a.passed ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {a.score}/{a.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-4 space-y-3">
          <h4 className="font-semibold text-sm">Course Progress</h4>
          {enroll.length === 0 ? (
            <p className="text-sm text-muted-foreground">No enrollments yet.</p>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {enroll.map((e: any) => (
                <div key={e.course_id} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="truncate mr-2">{e.courses?.title ?? "Course"}</span>
                    <span className="font-semibold tabular-nums">{e.progress_pct ?? 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${e.progress_pct ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
