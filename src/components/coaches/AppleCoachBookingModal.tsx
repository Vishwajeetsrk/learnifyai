import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  Check,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Copy,
  Laptop,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import {
  type CoachRecord,
  type ServiceTier,
  DEFAULT_COACH_TIERS,
  DEFAULT_BOOKING_SETTINGS,
  bookCoachSession,
} from "@/lib/coach-creator.functions";

interface AppleCoachBookingModalProps {
  coach: CoachRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AppleCoachBookingModal({
  coach,
  open,
  onOpenChange,
}: AppleCoachBookingModalProps) {
  if (!coach) return null;

  const tiers = coach.service_tiers && coach.service_tiers.length > 0
    ? coach.service_tiers
    : DEFAULT_COACH_TIERS;

  const plugins = coach.booking_settings?.plugins || DEFAULT_BOOKING_SETTINGS.plugins;

  const [selectedTier, setSelectedTier] = useState<ServiceTier>(tiers[0]);
  const [selectedProvider, setSelectedProvider] = useState<
    "google_meet" | "zoom" | "cal_com" | "microsoft" | "gmail"
  >(
    plugins.google_meet?.enabled !== false
      ? "google_meet"
      : plugins.zoom?.enabled
      ? "zoom"
      : "gmail"
  );

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState("04:30 PM");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentNotes, setStudentNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    bookingId: string;
    meetingUrl: string;
    scheduledAt: string;
    tierName: string;
  } | null>(null);

  const timeSlots = [
    "10:00 AM",
    "11:30 AM",
    "02:00 PM",
    "04:30 PM",
    "06:00 PM",
    "08:00 PM",
  ];

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      toast.error("Please enter your name and email");
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduledDateTime = `${date}T${selectedTime.replace(" ", "")}:00Z`;
      const res = await bookCoachSession({
        data: {
          coachId: coach.id,
          studentName,
          studentEmail,
          studentNotes,
          tierId: selectedTier.id,
          tierName: selectedTier.name,
          durationMins: selectedTier.duration_mins,
          priceInr: selectedTier.price_inr,
          meetingProvider: selectedProvider,
          scheduledAt: scheduledDateTime,
        },
      });

      setConfirmedBooking(res);
      toast.success("1-on-1 session confirmed! Invite dispatched.");
    } catch (err: any) {
      toast.error(err?.message || "Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (confirmedBooking?.meetingUrl) {
      navigator.clipboard.writeText(confirmedBooking.meetingUrl);
      toast.success("Meeting link copied to clipboard");
    }
  };

  const resetModal = () => {
    setConfirmedBooking(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetModal}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 border border-border/80 bg-background/95 backdrop-blur-2xl rounded-3xl shadow-2xl">
        {/* Apple-style gradient header */}
        <div className="relative p-6 pb-4 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
          <div className="flex items-center gap-3.5">
            <img
              src={coach.photo}
              alt={coach.name}
              className="h-14 w-14 rounded-2xl object-cover border border-white/20 shadow-md shrink-0 bg-muted"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold font-display tracking-tight text-foreground truncate">
                  {coach.name}
                </h3>
                {coach.verification_status === "verified" && (
                  <Badge variant="outline" className="text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-600 gap-1 py-0">
                    <ShieldCheck className="h-3 w-3" /> Verified Mentor
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{coach.title}</p>
              <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                {coach.expertise} • {coach.availability || "Weekdays & Evenings"}
              </p>
            </div>
          </div>
        </div>

        {confirmedBooking ? (
          /* Confirmation Screen (Apple Wallet / Pass Style) */
          <div className="p-6 md:p-8 space-y-6 text-center animate-in zoom-in-95 duration-300">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-bold font-display text-foreground">
                Session Confirmed!
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Your 1-on-1 session with <strong className="text-foreground">{coach.name}</strong> is scheduled. A confirmation has been logged to your account.
              </p>
            </div>

            {/* Apple Ticket Pass */}
            <div className="rounded-2xl border border-border/60 bg-gradient-to-b from-card to-card/60 p-5 text-left space-y-3.5 shadow-sm max-w-md mx-auto">
              <div className="flex justify-between items-start pb-3 border-b border-border/50">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    SERVICE TIER
                  </span>
                  <p className="text-sm font-bold text-foreground">{confirmedBooking.tierName}</p>
                </div>
                <Badge variant="secondary" className="text-xs font-bold text-foreground">
                  ₹{selectedTier.price_inr}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    DATE &amp; TIME
                  </span>
                  <p className="font-semibold text-foreground">{date}</p>
                  <p className="text-muted-foreground text-[11px]">{selectedTime} (IST)</p>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    PLATFORM
                  </span>
                  <p className="font-semibold text-foreground capitalize flex items-center gap-1.5 pt-0.5">
                    <Video className="h-3.5 w-3.5 text-primary" /> {selectedProvider.replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 space-y-2">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                  MEETING ACCESS LINK
                </span>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={confirmedBooking.meetingUrl}
                    className="h-8 text-xs bg-background/60 font-mono text-muted-foreground"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2.5 shrink-0"
                    onClick={handleCopyLink}
                    title="Copy Meeting URL"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                asChild
                className="w-full sm:w-auto rounded-xl gap-2 font-medium"
              >
                <a
                  href={confirmedBooking.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-4 w-4" /> Open Meeting Room
                </a>
              </Button>

              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-xl"
                onClick={resetModal}
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          /* Booking Form (Apple Keynote Style) */
          <form onSubmit={handleConfirm} className="p-6 space-y-6">
            {/* 1. Service Tier Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-display">
                  1. Select Service Package
                </Label>
                <span className="text-[11px] text-primary font-medium">100% Satisfaction Guarantee</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {tiers.map((t) => {
                  const isSelected = selectedTier.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTier(t)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 text-left relative overflow-hidden ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20"
                          : "border-border/60 bg-card/60 hover:border-border hover:bg-card/80"
                      }`}
                    >
                      {t.is_popular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
                          Popular
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-semibold text-foreground block leading-snug">
                          {t.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" /> {t.duration_mins} mins
                        </span>
                      </div>
                      <div className="pt-2 border-t border-border/40 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-foreground">₹{t.price_inr}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Meeting Plugin Selector (Google Meet, Zoom, Cal.com, Teams) */}
            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-display">
                2. Select Video / Conferencing App
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Google Meet */}
                <button
                  type="button"
                  onClick={() => setSelectedProvider("google_meet")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                    selectedProvider === "google_meet"
                      ? "border-emerald-500 bg-emerald-500/10 text-foreground font-semibold ring-1 ring-emerald-500/30"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:bg-card"
                  }`}
                >
                  <Video className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="truncate">Google Meet</span>
                </button>

                {/* Zoom */}
                <button
                  type="button"
                  onClick={() => setSelectedProvider("zoom")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                    selectedProvider === "zoom"
                      ? "border-blue-500 bg-blue-500/10 text-foreground font-semibold ring-1 ring-blue-500/30"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:bg-card"
                  }`}
                >
                  <Laptop className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="truncate">Zoom</span>
                </button>

                {/* Cal.com */}
                <button
                  type="button"
                  onClick={() => setSelectedProvider("cal_com")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                    selectedProvider === "cal_com"
                      ? "border-amber-500 bg-amber-500/10 text-foreground font-semibold ring-1 ring-amber-500/30"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:bg-card"
                  }`}
                >
                  <Calendar className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="truncate">Cal.com</span>
                </button>

                {/* Microsoft Teams */}
                <button
                  type="button"
                  onClick={() => setSelectedProvider("microsoft")}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                    selectedProvider === "microsoft"
                      ? "border-purple-500 bg-purple-500/10 text-foreground font-semibold ring-1 ring-purple-500/30"
                      : "border-border/60 bg-card/60 text-muted-foreground hover:bg-card"
                  }`}
                >
                  <Layers className="h-4 w-4 text-purple-500 shrink-0" />
                  <span className="truncate">MS Teams</span>
                </button>
              </div>
            </div>

            {/* 3. Schedule Date & Time Slot */}
            <div className="space-y-2.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-display">
                3. Choose Date &amp; Time Slot
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] text-muted-foreground block mb-1">Session Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="text-xs bg-card/60 h-9"
                    required
                  />
                </div>

                <div>
                  <Label className="text-[11px] text-muted-foreground block mb-1">Preferred Slot</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`h-9 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          selectedTime === slot
                            ? "bg-primary text-primary-foreground border-transparent shadow-sm"
                            : "bg-card/60 border-border/60 text-muted-foreground hover:bg-card hover:text-foreground"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Student Information */}
            <div className="space-y-3 pt-2 border-t border-border/40">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-display">
                4. Your Details &amp; Questions
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Your Name *</Label>
                  <Input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="text-xs bg-card/60 h-9"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Your Email Address *</Label>
                  <Input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="text-xs bg-card/60 h-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] text-muted-foreground">Topics / Questions for Coach (Optional)</Label>
                <Textarea
                  rows={2}
                  value={studentNotes}
                  onChange={(e) => setStudentNotes(e.target.value)}
                  placeholder="e.g. Reviewing my system design for an e-commerce checkout flow..."
                  className="text-xs bg-card/60 leading-relaxed"
                />
              </div>
            </div>

            {/* Footer Summary & Book Button */}
            <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Total Fee</span>
                <span className="text-lg font-bold text-foreground">
                  ₹{selectedTier.price_inr}
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    ({selectedTier.duration_mins} mins via {selectedProvider.replace("_", " ")})
                  </span>
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl px-6 h-10 font-semibold gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Scheduling...
                  </>
                ) : (
                  <>
                    Confirm &amp; Generate Meeting Link ➔
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
