import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Upload,
  Trash2,
  User as UserIcon,
  Wallet,
  Bell,
  Settings as SettingsIcon,
  Check,
  X,
  Plus,
  IndianRupee,
  CreditCard,
  ArrowDownToLine,
  Globe,
  KeyRound,
  XCircle,
  Building2,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  createCashfreeOrder,
  verifyCashfreePayment,
  processCashfreePayout,
} from "@/lib/payment.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Learnify AI" }] }),
  component: SettingsPage,
});

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const SKILL_OPTIONS = [
  "HTML",
  "CSS",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "SQL",
  "Command Line",
  "React",
  "Git & GitHub",
  "NumPy",
  "TypeScript",
  "Node.js",
  "Next.js",
  "Tailwind CSS",
  "Docker",
  "AWS",
  "MongoDB",
  "PostgreSQL",
  "GraphQL",
  "Figma",
  "UI/UX",
  "API Design",
];

type SocialLinks = {
  github?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
  tiktok?: string;
};
type NotifPrefs = {
  new_subscriber: boolean;
  new_comment: boolean;
  new_sale: boolean;
  email: boolean;
  inapp: boolean;
};
type Payout = {
  method?: "bank" | "upi";
  upi_id?: string;
  account_name?: string;
  account_number?: string;
  ifsc?: string;
};
type Defaults = { price_inr: number; category: string; level: string };

function SettingsPage() {
  const { user, hasRole, isAdmin } = useAuth();
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const isCreator = hasRole("creator") || hasRole("super_admin") || hasRole("admin");

  /* ── State ── */
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [work, setWork] = useState("");
  const [education, setEducation] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [links, setLinks] = useState<SocialLinks>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | null>(null);

  /* ── Cartoon Character customization ── */
  const [cartoonOpen, setCartoonOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("avataaars"); // Default to avataaars since it is highly customizable
  const [seed, setSeed] = useState("Learnify");
  const [savingCartoon, setSavingCartoon] = useState(false);

  // Granular customization states
  const [skinColor, setSkinColor] = useState("ffdbb4"); // Default skin
  const [hairGender, setHairGender] = useState<"male" | "female">("male"); // Short vs Long hair filter
  const [hairStyle, setHairStyle] = useState("shortHairShortFlat"); // Default hair style
  const [hairColor, setHairColor] = useState("4a3728"); // Default hair color
  const [mouthStyle, setMouthStyle] = useState("default"); // Default mouth
  const [eyesStyle, setEyesStyle] = useState("default"); // Default eyes
  const [clothingStyle, setClothingStyle] = useState("shirtCrewNeck"); // Default clothes
  const [clothingColor, setClothingColor] = useState("3c4f76"); // Default clothes color
  const [accessoriesStyle, setAccessoriesStyle] = useState("none"); // Default accessories

  const CARTOON_STYLES = [
    { id: "avataaars", label: "Casual Character" },
    { id: "adventurer", label: "Adventurer" },
    { id: "bottts", label: "Robot" },
    { id: "pixel-art", label: "Pixel Art" },
    { id: "fun-emoji", label: "Fun Emoji" },
    { id: "lorelei", label: "Lorelei" },
  ];

  function buildCartoonUrl() {
    const baseUrl = `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${encodeURIComponent(seed)}`;
    let params = "";

    if (selectedStyle === "avataaars") {
      params += `&skinColor=${skinColor}`;
      params += `&top=${hairStyle}`;
      params += `&hairColor=${hairColor}`;
      params += `&mouth=${mouthStyle}`;
      params += `&eyes=${eyesStyle}`;
      params += `&clothing=${clothingStyle}`;
      params += `&clothingColor=${clothingColor}`;
      if (accessoriesStyle && accessoriesStyle !== "none") {
        params += `&accessories=${accessoriesStyle}`;
      } else {
        params += `&accessoriesProbability=0`;
      }
    } else if (selectedStyle === "adventurer") {
      params += `&skinColor=${skinColor}`;
      // Map hair style
      let advHair = "short01";
      if (hairStyle.startsWith("long")) {
        advHair = hairStyle.includes("Curly") ? "long02" : "long01";
      } else if (hairStyle.includes("Bob")) {
        advHair = "bob";
      } else if (hairStyle.includes("Curly")) {
        advHair = "curl";
      } else if (hairStyle.includes("Dreads")) {
        advHair = "braids";
      } else if (hairStyle === "noHair") {
        advHair = "bald";
      } else {
        advHair = "short02";
      }
      params += `&hair=${advHair}`;
      params += `&hairColor=${hairColor}`;
      params += `&mouth=${mouthStyle === "default" ? "smile" : mouthStyle === "sad" ? "sad" : "default"}`;
      params += `&eyes=${eyesStyle === "default" ? "default" : eyesStyle === "happy" ? "happy" : eyesStyle === "wink" ? "wink" : "default"}`;
      if (accessoriesStyle && accessoriesStyle !== "none") {
        params += `&features=${accessoriesStyle === "prescription01" || accessoriesStyle === "prescription02" ? "spectacles" : "sunglasses"}`;
      }
    } else if (selectedStyle === "lorelei") {
      params += `&hairColor=${hairColor}`;
      params += `&skinColor=${skinColor}`;
    }

    return baseUrl + params;
  }

  const currentCartoonUrl = buildCartoonUrl();

  async function saveCartoonAvatar() {
    if (!user) return;
    setSavingCartoon(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: currentCartoonUrl })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Character avatar updated!");
      qc.invalidateQueries({ queryKey: ["profile-full"] });
      setCartoonOpen(false);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save avatar");
    } finally {
      setSavingCartoon(false);
    }
  }

  function randomizeSeed() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let res = "";
    for (let i = 0; i < 8; i++) res += chars[Math.floor(Math.random() * chars.length)];
    setSeed(res);
  }


  const [prefs, setPrefs] = useState<NotifPrefs>({
    new_subscriber: true,
    new_comment: true,
    new_sale: true,
    email: true,
    inapp: true,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  const [payout, setPayout] = useState<Payout>({ method: "bank" });
  const [defaults, setDefaults] = useState<Defaults>({
    price_inr: 0,
    category: "General",
    level: "Beginner",
  });
  const [savingExtra, setSavingExtra] = useState(false);

  // Branding (Team / admin)
  const [orgName, setOrgName] = useState("");
  const [orgLogoUrl, setOrgLogoUrl] = useState("");
  const [brandColor, setBrandColor] = useState("#7c3aed");
  const [invCompanyName, setInvCompanyName] = useState("");
  const [invLegalName, setInvLegalName] = useState("");
  const [invGstin, setInvGstin] = useState("");
  const [invPrefix, setInvPrefix] = useState("INV");
  const [invFooter, setInvFooter] = useState("");
  const [invLogoUrl, setInvLogoUrl] = useState("");
  const [invContact, setInvContact] = useState("");
  const [savingBranding, setSavingBranding] = useState(false);

  // Wallet
  const [topupOpen, setTopupOpen] = useState(false);
  const [topupAmt, setTopupAmt] = useState("500");
  const [topupSubmitting, setTopupSubmitting] = useState(false);
  const createOrder = useServerFn(createCashfreeOrder);
  const verifyTopup = useServerFn(verifyCashfreePayment);
  const processPayout = useServerFn(processCashfreePayout);
  const [wdOpen, setWdOpen] = useState(false);
  const [wdAmt, setWdAmt] = useState("500");
  const [wdMethod, setWdMethod] = useState<"bank" | "upi">("upi");
  const [wdDest, setWdDest] = useState("");
  const [wdSubmitting, setWdSubmitting] = useState(false);

  const topupPresets = [200, 500, 1000, 2500, 5000, 10000];

  /* ── Queries ── */
  const profileQ = useQuery({
    enabled: !!user,
    queryKey: ["profile-full", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const walletQ = useQuery({
    enabled: !!user,
    queryKey: ["wallet-tx", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("id, amount_inr, type, status, description, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const subQ = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_subscriptions")
        .select(
          "id, plan_id, status, current_period_start, current_period_end, pricing_plans(name, interval, price_inr)",
        )
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const payoutDestQ = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["payout-dest", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("payout_destination")
        .eq("id", user!.id)
        .maybeSingle();
      return (data?.payout_destination ?? null) as Payout | null;
    },
  });

  const wdHistoryQ = useQuery({
    enabled: !!user && isCreator,
    queryKey: ["withdrawals", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("creator_withdrawals")
        .select("id, amount_inr, method, status, created_at, admin_notes, destination")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  /* ── Hydrate state from profile ── */
  useEffect(() => {
    const p = profileQ.data;
    if (!p) return;
    setFullName(p.full_name ?? "");
    setUsername(p.username ?? "");
    setBio(p.bio ?? "");
    setLocation(p.location ?? "");
    setWork(p.work ?? "");
    setEducation(p.education ?? "");
    setWebsite(p.website ?? "");
    setSkills(p.skills ?? []);
    setLinks((p.social_links ?? {}) as SocialLinks);
    setPrefs((prev) => ({ ...prev, ...((p.notif_prefs ?? {}) as Partial<NotifPrefs>) }));
    setPayout((p.payout_destination ?? { method: "bank" }) as Payout);
    setDefaults(
      (p.default_course_settings ?? {
        price_inr: 0,
        category: "General",
        level: "Beginner",
      }) as Defaults,
    );
    setOrgName(p.org_name ?? "");
    setOrgLogoUrl(p.org_logo_url ?? "");
    setBrandColor(p.brand_color ?? "#7c3aed");
    setInvCompanyName(p.invoice_company_name ?? "");
    setInvLegalName(p.invoice_legal_name ?? "");
    setInvGstin(p.invoice_gstin ?? "");
    setInvPrefix(p.invoice_prefix ?? "INV");
    setInvFooter(p.invoice_footer ?? "");
    setInvLogoUrl(p.invoice_logo_url ?? "");
    setInvContact(p.invoice_contact ?? "");
  }, [profileQ.data]);

  useEffect(() => {
    const path = profileQ.data?.avatar_url;
    if (!path) {
      setAvatarSignedUrl(null);
      return;
    }
    if (path.startsWith("http")) {
      setAvatarSignedUrl(path);
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarSignedUrl(data.publicUrl);
  }, [profileQ.data?.avatar_url]);

  /* ── Username availability ── */
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setUsernameChecking(true);
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user!.id)
        .maybeSingle();
      setUsernameAvailable(!data);
      setUsernameChecking(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [username, user?.id]);

  /* ── Profile save ── */
  async function saveProfile() {
    if (!user) return;
    if (!fullName.trim()) return toast.error("Name cannot be empty");
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        username: username.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        work: work.trim() || null,
        education: education.trim() || null,
        website: website.trim() || null,
        skills: skills.length ? skills : [],
        social_links: links,
      })
      .eq("id", user.id);
    setSavingProfile(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile-full"] });
  }

  /* ── Avatar ── */
  async function handleAvatarUpload(file: File) {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be < 5MB");
    if (!file.type.startsWith("image/")) return toast.error("Pick an image file");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const publicUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
      const old = profileQ.data?.avatar_url;
      if (old) {
        const bucketBase = supabase.storage.from("avatars").getPublicUrl("").data.publicUrl;
        if (old.startsWith(bucketBase)) {
          const oldPath = old.replace(bucketBase + (bucketBase.endsWith("/") ? "" : "/"), "");
          if (oldPath && oldPath !== path) await supabase.storage.from("avatars").remove([oldPath]);
        } else if (!old.startsWith("http") && old !== path) {
          await supabase.storage.from("avatars").remove([old]);
        }
      }
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
      toast.success("Photo updated");
      qc.invalidateQueries({ queryKey: ["profile-full"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function removeAvatar() {
    if (!user) return;
    const old = profileQ.data?.avatar_url;
    if (old) {
      const bucketBase = supabase.storage.from("avatars").getPublicUrl("").data.publicUrl;
      if (old.startsWith(bucketBase)) {
        const oldPath = old.replace(bucketBase + (bucketBase.endsWith("/") ? "" : "/"), "");
        if (oldPath) await supabase.storage.from("avatars").remove([oldPath]);
      } else if (!old.startsWith("http")) {
        await supabase.storage.from("avatars").remove([old]);
      }
    }
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
    toast.success("Photo removed");
    qc.invalidateQueries({ queryKey: ["profile-full"] });
  }

  /* ── Password ── */
  async function changePassword() {
    if (!user?.email) return;
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPwd !== confirmPwd) return toast.error("Passwords don't match");
    setPwdSaving(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPwd,
    });
    if (signErr) {
      setPwdSaving(false);
      return toast.error("Current password is incorrect");
    }
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setPwdSaving(false);
    if (error) return toast.error(error.message);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    toast.success("Password updated");
  }

  /* ── Notifications save ── */
  async function saveNotifs() {
    if (!user) return;
    setSavingNotifs(true);
    await supabase.from("profiles").update({ notif_prefs: prefs }).eq("id", user.id);
    setSavingNotifs(false);
    toast.success("Notification preferences saved");
  }

  /* ── Extra settings save (payout + defaults) ── */
  async function saveExtra() {
    if (!user) return;
    setSavingExtra(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        payout_destination: payout,
        default_course_settings: defaults,
      })
      .eq("id", user.id);
    setSavingExtra(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  }

  /* ── Wallet topup ── */
  async function submitTopup() {
    const n = Number(topupAmt);
    if (!n || n < 50 || n > 100000) return toast.error("Amount between ₹50 and ₹100,000");
    setTopupSubmitting(true);
    try {
      const order = await createOrder({ data: { amountInr: n } });
      await loadCashfree();
      const cf = new (window as any).Cashfree({ mode: "production" });
      cf.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_modal",
      }).then(async (result: any) => {
        if (result.error) {
          toast.error(result.error.message);
          setTopupSubmitting(false);
          return;
        }
        if (result.payment?.payment_status === "PAID") {
          await verifyTopup({ data: { orderId: order.order_id } });
          toast.success(`₹${n.toLocaleString("en-IN")} added to wallet`);
          qc.invalidateQueries({ queryKey: ["wallet-tx"] });
          setTopupOpen(false);
        }
        setTopupSubmitting(false);
      });
    } catch (err: any) {
      toast.error(err.message || "Top-up failed");
      setTopupSubmitting(false);
    }
  }

  /* ── Withdraw ── */
  function autofillWd(m: "bank" | "upi") {
    const p = payoutDestQ.data;
    if (!p) return "";
    if (m === "upi") return p.upi_id ?? "";
    return [p.account_name, p.account_number, p.ifsc].filter(Boolean).join(" · ");
  }
  useEffect(() => {
    if (!wdOpen) return;
    setWdMethod(payoutDestQ.data?.method ?? "upi");
    setWdDest(autofillWd(payoutDestQ.data?.method ?? "upi"));
  }, [wdOpen, payoutDestQ.data]);

  async function submitWd() {
    if (!user) return;
    const n = Number(wdAmt);
    if (!n || n < 100) return toast.error("Minimum withdrawal is ₹100");
    if (n > balance) return toast.error("Insufficient balance");
    if (!wdDest.trim()) return toast.error("Destination required");
    setWdSubmitting(true);
    try {
      await processPayout({ data: { amountInr: n, method: wdMethod, destination: wdDest.trim() } });
      toast.success("Withdrawal processed");
      setWdOpen(false);
      qc.invalidateQueries({ queryKey: ["withdrawals"] });
      qc.invalidateQueries({ queryKey: ["wallet-tx"] });
    } catch (err: any) {
      toast.error(err.message || "Withdrawal failed");
    } finally {
      setWdSubmitting(false);
    }
  }

  /* ── Computed ── */
  const balance = (walletQ.data ?? [])
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)), 0);

  const initials = (profileQ.data?.full_name ?? user?.email ?? "U")
    .toString()
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isPhone = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Settings</div>
          <h1 className="mt-1 text-3xl font-display font-semibold tracking-tight">Your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Profile, billing, notifications, and security.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList
            className={`${isPhone ? "grid grid-cols-2" : isAdmin ? "grid grid-cols-5" : "grid grid-cols-4"} w-full md:w-auto`}
          >
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4" />
              <span className="ml-1.5">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="billing">
              <Wallet className="h-4 w-4" />
              <span className="ml-1.5">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4" />
              <span className="ml-1.5">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="settings">
              <SettingsIcon className="h-4 w-4" />
              <span className="ml-1.5">Settings</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="branding">
                <Building2 className="h-4 w-4" />
                <span className="ml-1.5">Branding</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* ═══ PROFILE ═══ */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-primary" /> Profile
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <Avatar className="h-24 w-24 border-4 border-card shadow-md shrink-0">
                  {avatarSignedUrl ? <AvatarImage src={avatarSignedUrl} /> : null}
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap gap-2">
                  <input
                    ref={fileInput}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAvatarUpload(f);
                      e.target.value = "";
                    }}
                  />
                  <Button size="sm" onClick={() => fileInput.current?.click()} disabled={uploading}>
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload photo
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setCartoonOpen(true)}>
                    <Sparkles className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Customize Character
                  </Button>
                  {profileQ.data?.avatar_url ? (
                    <Button size="sm" variant="outline" onClick={removeAvatar}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  ) : null}
                  <p className="w-full text-[10px] text-muted-foreground text-center sm:text-left">
                    Recommended 1:1 ratio &lt; 5 MB
                  </p>
                </div>
              </div>

              {/* Cartoon Character Customization Dialog */}
              <Dialog open={cartoonOpen} onOpenChange={setCartoonOpen}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-yellow-500 fill-yellow-500" /> Customize Your Character
                    </DialogTitle>
                    <DialogDescription>
                      Design your own custom cartoon avatar. Change styles, colors, gender, expressions, and clothing!
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
                    {/* Left Column: Live Preview & Style Selector */}
                    <div className="md:col-span-5 flex flex-col items-center gap-4 bg-muted/30 p-4 rounded-xl border">
                      {/* Live Preview */}
                      <div className="relative h-40 w-40 rounded-full border-4 border-background bg-card shadow-lg overflow-hidden flex items-center justify-center">
                        <img src={currentCartoonUrl} className="h-full w-full object-cover" alt="Avatar Preview" />
                      </div>

                      <div className="w-full space-y-3">
                        {/* Character Style Selection */}
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Art Style</Label>
                          <div className="grid grid-cols-2 gap-1 text-xs">
                            {CARTOON_STYLES.map((style) => (
                              <button
                                key={style.id}
                                type="button"
                                onClick={() => {
                                  setSelectedStyle(style.id);
                                  // Update defaults based on style to prevent glitchy params
                                  if (style.id === "avataaars") {
                                    setHairStyle("shortHairShortFlat");
                                  } else if (style.id === "adventurer") {
                                    setHairStyle("short01");
                                  }
                                }}
                                className={`rounded-lg border p-2 text-center text-xs font-medium transition ${
                                  selectedStyle === style.id
                                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                                    : "border-border hover:bg-muted"
                                }`}
                              >
                                {style.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Seed Input */}
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base Seed</Label>
                          <div className="flex gap-2">
                            <Input
                              value={seed}
                              onChange={(e) => setSeed(e.target.value)}
                              placeholder="Type anything to randomize base features..."
                              className="flex-1 text-xs h-9 bg-card"
                            />
                            <Button size="sm" variant="outline" className="h-9 text-xs shrink-0" onClick={randomizeSeed}>
                              Randomize
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Customization Controls */}
                    <div className="md:col-span-7 flex flex-col">
                      {selectedStyle === "avataaars" || selectedStyle === "adventurer" || selectedStyle === "lorelei" ? (
                        <Tabs defaultValue="face" className="w-full">
                          <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="face" className="text-xs">Face & Hair</TabsTrigger>
                            <TabsTrigger value="expressions" className="text-xs" disabled={selectedStyle === "lorelei"}>Expression</TabsTrigger>
                            <TabsTrigger value="clothing" className="text-xs" disabled={selectedStyle === "lorelei"}>Clothing</TabsTrigger>
                          </TabsList>

                          {/* Face & Hair Tab */}
                          <TabsContent value="face" className="space-y-4 pt-3">
                            {/* Skin Color Picker */}
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">Skin Color</Label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { val: "ffdbb4", color: "#ffdbb4", label: "Very Light" },
                                  { val: "edb98a", color: "#edb98a", label: "Light" },
                                  { val: "fd9841", color: "#fd9841", label: "Tan" },
                                  { val: "d08b5b", color: "#d08b5b", label: "Olive" },
                                  { val: "ae5d29", color: "#ae5d29", label: "Brown" },
                                  { val: "614335", color: "#614335", label: "Dark" },
                                ].map((skin) => (
                                  <button
                                    key={skin.val}
                                    type="button"
                                    onClick={() => setSkinColor(skin.val)}
                                    className={`w-7 h-7 rounded-full border-2 transition relative flex items-center justify-center hover:scale-110 ${
                                      skinColor === skin.val ? "border-primary scale-110 shadow-sm" : "border-border"
                                    }`}
                                    style={{ backgroundColor: skin.color }}
                                    title={skin.label}
                                  >
                                    {skinColor === skin.val && (
                                      <Check className={`h-3 w-3 ${skin.val === "ffdbb4" || skin.val === "f8d25c" ? "text-slate-800" : "text-white"}`} />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Hair Style selection */}
                            {selectedStyle !== "lorelei" && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label className="text-xs font-semibold text-muted-foreground">Hair Style</Label>
                                  <div className="flex bg-muted rounded-lg p-0.5 text-[10px] font-medium border">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHairGender("male");
                                        setHairStyle("shortHairShortFlat");
                                      }}
                                      className={`px-2 py-0.5 rounded transition ${
                                        hairGender === "male" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                                      }`}
                                    >
                                      Male / Short
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setHairGender("female");
                                        setHairStyle("longHairStraight");
                                      }}
                                      className={`px-2 py-0.5 rounded transition ${
                                        hairGender === "female" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                                      }`}
                                    >
                                      Female / Long
                                    </button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                                  {(hairGender === "male"
                                    ? [
                                        { id: "shortHairTheCaesar", label: "Caesar Cut" },
                                        { id: "shortHairShortFlat", label: "Short Flat" },
                                        { id: "shortHairShortRound", label: "Short Round" },
                                        { id: "shortHairShortWaved", label: "Short Wavy" },
                                        { id: "shortHairShortCurly", label: "Short Curly" },
                                        { id: "shortHairShaggyMullet", label: "Mullet" },
                                        { id: "noHair", label: "Bald" },
                                      ]
                                    : [
                                        { id: "longHairStraight", label: "Long Straight" },
                                        { id: "longHairStraight2", label: "Straight Parted" },
                                        { id: "longHairCurly", label: "Long Curly" },
                                        { id: "longHairCurvy", label: "Long Curvy" },
                                        { id: "longHairBob", label: "Bob Cut" },
                                        { id: "longHairMiaWallace", label: "Mia Cut" },
                                        { id: "longHairBun", label: "Hair Bun" },
                                        { id: "longHairDreads", label: "Dreads" },
                                        { id: "longHairBigHair", label: "Big Hair" },
                                      ]
                                  ).map((hair) => (
                                    <button
                                      key={hair.id}
                                      type="button"
                                      onClick={() => setHairStyle(hair.id)}
                                      className={`rounded-md border p-1 text-center text-[10px] font-medium transition leading-snug truncate ${
                                        hairStyle === hair.id
                                          ? "border-primary bg-primary/5 text-primary"
                                          : "border-border hover:bg-muted"
                                      }`}
                                    >
                                      {hair.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Hair Color Picker */}
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">Hair Color</Label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { val: "2c1b18", color: "#2c1b18", label: "Black" },
                                  { val: "4a3728", color: "#4a3728", label: "Dark Brown" },
                                  { val: "724124", color: "#724124", label: "Light Brown" },
                                  { val: "b58143", color: "#b58143", label: "Blonde" },
                                  { val: "c93305", color: "#c93305", label: "Auburn" },
                                  { val: "ecdcbf", color: "#ecdcbf", label: "Platinum" },
                                  { val: "f59797", color: "#f59797", label: "Pink" },
                                ].map((hair) => (
                                  <button
                                    key={hair.val}
                                    type="button"
                                    onClick={() => setHairColor(hair.val)}
                                    className={`w-7 h-7 rounded-full border-2 transition relative flex items-center justify-center hover:scale-110 ${
                                      hairColor === hair.val ? "border-primary scale-110 shadow-sm" : "border-border"
                                    }`}
                                    style={{ backgroundColor: hair.color }}
                                    title={hair.label}
                                  >
                                    {hairColor === hair.val && (
                                      <Check className={`h-3 w-3 ${hair.val === "ecdcbf" || hair.val === "f59797" ? "text-slate-800" : "text-white"}`} />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </TabsContent>

                          {/* Expressions Tab */}
                          <TabsContent value="expressions" className="space-y-4 pt-3">
                            {/* Eyes Selector */}
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">Eyes Expression</Label>
                              <Select value={eyesStyle} onValueChange={setEyesStyle}>
                                <SelectTrigger className="w-full text-xs">
                                  <SelectValue placeholder="Select eyes style" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    { id: "default", label: "Default" },
                                    { id: "happy", label: "Happy" },
                                    { id: "wink", label: "Wink / Playful" },
                                    { id: "surprised", label: "Surprised" },
                                    { id: "squint", label: "Squint" },
                                    { id: "side", label: "Side Eye" },
                                    { id: "hearts", label: "Loving / Hearts" },
                                    { id: "close", label: "Closed / Sleepy" },
                                  ].map((eye) => (
                                    <SelectItem key={eye.id} value={eye.id} className="text-xs">
                                      {eye.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Mouth Selector */}
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">Mouth Expression</Label>
                              <Select value={mouthStyle} onValueChange={setMouthStyle}>
                                <SelectTrigger className="w-full text-xs">
                                  <SelectValue placeholder="Select mouth style" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    { id: "default", label: "Default" },
                                    { id: "smile", label: "Smile" },
                                    { id: "sad", label: "Sad / Frown" },
                                    { id: "concerned", label: "Concerned" },
                                    { id: "disbelief", label: "Disbelief" },
                                    { id: "grimace", label: "Grimace" },
                                    { id: "scream", label: "Scream" },
                                    { id: "tongue", label: "Tongue Out" },
                                  ].map((m) => (
                                    <SelectItem key={m.id} value={m.id} className="text-xs">
                                      {m.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Accessories Selector */}
                            {selectedStyle !== "lorelei" && (
                              <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground">Accessories</Label>
                                <Select value={accessoriesStyle} onValueChange={setAccessoriesStyle}>
                                  <SelectTrigger className="w-full text-xs">
                                    <SelectValue placeholder="Select accessories" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {[
                                      { id: "none", label: "None" },
                                      { id: "prescription01", label: "Regular Glasses" },
                                      { id: "round", label: "Round Glasses" },
                                      { id: "sunglasses", label: "Sunglasses" },
                                      { id: "wayfarer", label: "Wayfarer Shades" },
                                      { id: "kurt", label: "Round Sunnies" },
                                    ].map((acc) => (
                                      <SelectItem key={acc.id} value={acc.id} className="text-xs">
                                        {acc.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </TabsContent>

                          {/* Clothing Tab */}
                          <TabsContent value="clothing" className="space-y-4 pt-3">
                            {/* Clothing Style */}
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">Clothing Style</Label>
                              <Select value={clothingStyle} onValueChange={setClothingStyle}>
                                <SelectTrigger className="w-full text-xs">
                                  <SelectValue placeholder="Select clothing style" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[
                                    { id: "shirtCrewNeck", label: "Crew Neck T-Shirt" },
                                    { id: "shirtVNeck", label: "V-Neck T-Shirt" },
                                    { id: "hoodie", label: "Hoodie" },
                                    { id: "collarAndSweater", label: "Collar & Sweater" },
                                    { id: "blazerAndShirt", label: "Blazer & Shirt" },
                                    { id: "overall", label: "Overalls" },
                                    { id: "graphicShirt", label: "Graphic Tee" },
                                  ].map((c) => (
                                    <SelectItem key={c.id} value={c.id} className="text-xs">
                                      {c.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Clothing Color Picker */}
                            <div className="space-y-1.5">
                              <Label className="text-xs font-semibold text-muted-foreground">Clothing Color</Label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { val: "262e3d", color: "#262e3d", label: "Navy" },
                                  { val: "3c4f76", color: "#3c4f76", label: "Blue" },
                                  { val: "a7e0e2", color: "#a7e0e2", label: "Teal" },
                                  { val: "92b558", color: "#92b558", label: "Green" },
                                  { val: "e53935", color: "#e53935", label: "Red" },
                                  { val: "ffb300", color: "#ffb300", label: "Orange" },
                                  { val: "6f2da8", color: "#6f2da8", label: "Purple" },
                                  { val: "e2b4bd", color: "#e2b4bd", label: "Pink" },
                                  { val: "5c6f68", color: "#5c6f68", label: "Gray" },
                                ].map((c) => (
                                  <button
                                    key={c.val}
                                    type="button"
                                    onClick={() => setClothingColor(c.val)}
                                    className={`w-7 h-7 rounded-full border-2 transition relative flex items-center justify-center hover:scale-110 ${
                                      clothingColor === c.val ? "border-primary scale-110 shadow-sm" : "border-border"
                                    }`}
                                    style={{ backgroundColor: c.color }}
                                    title={c.label}
                                  >
                                    {clothingColor === c.val && (
                                      <Check className={`h-3 w-3 ${c.val === "a7e0e2" || c.val === "ffb300" || c.val === "e2b4bd" ? "text-slate-800" : "text-white"}`} />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      ) : (
                        <div className="flex flex-col items-center justify-center flex-1 py-10 text-center text-muted-foreground border border-dashed rounded-xl p-4 bg-muted/15">
                          <Sparkles className="h-8 w-8 text-yellow-500 mb-2 animate-bounce" />
                          <p className="text-xs font-semibold">Artistic Preset Style Selected</p>
                          <p className="text-[11px] max-w-xs mt-1">
                            This style (like Robot, Pixel Art, or Fun Emoji) is automatically generated. Change the Base Seed or click Randomize to design features!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={() => setCartoonOpen(false)} className="text-xs h-9">
                      Cancel
                    </Button>
                    <Button onClick={saveCartoonAvatar} disabled={savingCartoon} className="text-xs h-9">
                      {savingCartoon ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                      Use Character Avatar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name">
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    maxLength={120}
                  />
                </Field>
                <Field label="Username *">
                  <div className="relative">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                      maxLength={30}
                    />
                    {username.length >= 3 && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameChecking ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : usernameAvailable === true ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : usernameAvailable === false ? (
                          <X className="h-4 w-4 text-destructive" />
                        ) : null}
                      </span>
                    )}
                  </div>
                  {usernameAvailable === true && (
                    <p className="text-[10px] text-emerald-600 mt-0.5">Username is available</p>
                  )}
                  {usernameAvailable === false && (
                    <p className="text-[10px] text-destructive mt-0.5">Username taken</p>
                  )}
                </Field>
                <Field label="Email">
                  <Input value={user?.email ?? ""} disabled />
                </Field>
                <Field label="Website">
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                  />
                </Field>
                <Field label="Location">
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="India"
                    autoComplete="off"
                  />
                </Field>
                <Field label="Work">
                  <Input
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    placeholder="DreamSync"
                  />
                </Field>
                <Field label="Education">
                  <Input
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="BCA"
                  />
                </Field>
              </div>

              <Field label="Bio">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Frontend Developer | UI Enthusiast…"
                />
                <p className="text-[10px] text-muted-foreground">{bio.length}/500</p>
              </Field>

              <Field label="Skills">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SKILL_OPTIONS.map((s) => {
                    const active = skills.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() =>
                          setSkills(active ? skills.filter((x) => x !== s) : [...skills, s])
                        }
                        className={`px-2.5 py-1 rounded-full text-xs border transition ${active ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom skill..."
                    className="h-8 text-xs flex-1"
                    maxLength={30}
                    id="custom-skill-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val && !skills.includes(val)) {
                          setSkills([...skills, val]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs shrink-0"
                    onClick={() => {
                      const input = document.getElementById('custom-skill-input') as HTMLInputElement;
                      const val = input?.value?.trim();
                      if (val && !skills.includes(val)) {
                        setSkills([...skills, val]);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </Field>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold mb-3">Social media</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ["github", "GitHub", "github.com/"],
                    ["twitter", "X (Twitter)", "x.com/"],
                    ["linkedin", "LinkedIn", "linkedin.com/u/"],
                    ["instagram", "Instagram", "instagram.com/"],
                    ["youtube", "YouTube", "youtube.com/@"],
                    ["twitch", "Twitch", "twitch.tv/"],
                    ["tiktok", "TikTok", "tiktok.com/@"],
                  ].map(([key, label, prefix]) => (
                    <Field key={key} label={label}>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">
                          {prefix}
                        </span>
                        <Input
                          className="pl-[calc(10ch+0.75rem)]"
                          value={(links as any)[key] ?? ""}
                          onChange={(e) => setLinks({ ...links, [key]: e.target.value })}
                        />
                      </div>
                    </Field>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save changes
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ═══ BILLING ═══ */}
          <TabsContent value="billing" className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-5">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" /> Subscription
              </h2>
              {subQ.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : subQ.data ? (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-xl border p-4 bg-muted/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Plan
                    </div>
                    <div className="mt-1 font-semibold">
                      {(subQ.data as any).pricing_plans?.name ?? "Free"}
                    </div>
                  </div>
                  <div className="rounded-xl border p-4 bg-muted/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Start
                    </div>
                    <div className="mt-1 text-sm">
                      {subQ.data.current_period_start
                        ? format(new Date(subQ.data.current_period_start), "dd MMM yyyy")
                        : "—"}
                    </div>
                  </div>
                  <div className="rounded-xl border p-4 bg-muted/20">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      End
                    </div>
                    <div className="mt-1 text-sm">
                      {subQ.data.current_period_end
                        ? format(new Date(subQ.data.current_period_end), "dd MMM yyyy")
                        : "—"}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No active subscription.{" "}
                  <a href="/pricing" className="text-primary hover:underline">
                    View plans
                  </a>
                </p>
              )}
            </div>

            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-5">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-primary" /> Wallet
              </h2>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Available balance
                  </div>
                  <div className="text-3xl font-display font-bold mt-1">{inr(balance)}</div>
                </div>
                <Dialog open={topupOpen} onOpenChange={setTopupOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4" /> Top up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add money to wallet</DialogTitle>
                      <DialogDescription>
                        Top up via Cashfree (card/UPI/netbanking).
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5">
                      <Field label="Amount (INR)">
                        <div className="relative">
                          <IndianRupee className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="number"
                            min={50}
                            max={100000}
                            className="pl-9 text-lg font-semibold h-12"
                            value={topupAmt}
                            onChange={(e) => setTopupAmt(e.target.value)}
                          />
                        </div>
                      </Field>
                      <div className="flex flex-wrap gap-1.5">
                        {topupPresets.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setTopupAmt(String(p))}
                            className={`px-3 py-1.5 rounded-full text-xs border transition ${topupAmt === String(p) ? "border-primary bg-primary/10 text-primary font-semibold" : "hover:bg-accent"}`}
                          >
                            ₹{p.toLocaleString("en-IN")}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-emerald-800 rounded-lg bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 p-3 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 shrink-0" />
                        Secure payment via Cashfree
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setTopupOpen(false)}
                        disabled={topupSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button onClick={submitTopup} disabled={topupSubmitting}>
                        {topupSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}{" "}
                        Proceed to pay
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-3">When</th>
                      <th className="text-left px-4 py-3">Type</th>
                      <th className="text-left px-4 py-3">Description</th>
                      <th className="text-right px-4 py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(walletQ.data ?? []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-6 text-center text-sm text-muted-foreground"
                        >
                          No transactions yet.
                        </td>
                      </tr>
                    ) : (
                      (walletQ.data ?? []).map((t) => (
                        <tr key={t.id} className="border-t hover:bg-accent/30 transition-colors">
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {format(new Date(t.created_at), "dd-MM-yyyy HH:mm")}
                          </td>
                          <td className="px-4 py-3 capitalize">{t.type}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {t.description ?? "—"}
                          </td>
                          <td
                            className={`px-4 py-3 text-right font-medium ${t.type === "credit" ? "text-emerald-600" : "text-destructive"}`}
                          >
                            {t.type === "credit" ? "+" : "−"}
                            {inr(Number(t.amount_inr))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {isCreator && (
              <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <ArrowDownToLine className="h-4 w-4 text-primary" /> Creator withdrawals
                </h2>
                <p className="text-xs text-muted-foreground">
                  Withdraw earnings via Cashfree. Available: <b>{inr(balance)}</b>
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>
                    {(wdHistoryQ.data ?? []).filter((w) => w.status === "pending").length} pending
                  </span>
                  <span>·</span>
                  <span>{(wdHistoryQ.data ?? []).length} total</span>
                  <span>·</span>
                  <span>Wallet debited upfront via Cashfree Payouts</span>
                </div>
                <Dialog open={wdOpen} onOpenChange={setWdOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" disabled={balance < 100}>
                      <ArrowDownToLine className="h-4 w-4" /> Request withdrawal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Withdraw funds</DialogTitle>
                      <DialogDescription>Available: {inr(balance)}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Field label="Amount (INR)">
                        <Input
                          type="number"
                          min={100}
                          max={balance}
                          value={wdAmt}
                          onChange={(e) => setWdAmt(e.target.value)}
                        />
                      </Field>
                      <Field label="Method">
                        <div className="grid grid-cols-2 gap-2">
                          {(["upi", "bank"] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => {
                                setWdMethod(m);
                                setWdDest(autofillWd(m));
                              }}
                              className={`rounded-xl border p-2 text-xs capitalize ${wdMethod === m ? "border-primary bg-primary/5 text-primary" : "hover:bg-accent"}`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </Field>
                      <Field
                        label={
                          wdMethod === "upi" ? "UPI ID" : "Account details (name, number, IFSC)"
                        }
                      >
                        <Input
                          value={wdDest}
                          onChange={(e) => setWdDest(e.target.value)}
                          maxLength={200}
                          placeholder={autofillWd(wdMethod) || "Enter details"}
                        />
                      </Field>
                    </div>
                    <DialogFooter>
                      <Button onClick={submitWd} disabled={wdSubmitting}>
                        {wdSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{" "}
                        Withdraw
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {(wdHistoryQ.data ?? []).length > 0 && (
                  <ul className="mt-2 divide-y border-t">
                    {(wdHistoryQ.data ?? []).map((w) => (
                      <li
                        key={w.id}
                        className="py-2.5 flex items-center justify-between text-sm group"
                      >
                        <div>
                          <div className="font-medium">
                            {inr(Number(w.amount_inr))} ·{" "}
                            <span className="text-muted-foreground">{w.admin_notes ?? "—"}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {w.method} ·{" "}
                            {(w.destination as any)?.upi_id ??
                              (w.destination as any)?.account_number ??
                              JSON.stringify(w.destination)}{" "}
                            · {format(new Date(w.created_at), "dd-MM-yyyy HH:mm")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              w.status === "paid"
                                ? "default"
                                : w.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="capitalize text-[10px]"
                          >
                            {w.status}
                          </Badge>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirm("Delete this withdrawal record?")) return;
                              await supabase.from("creator_withdrawals").delete().eq("id", w.id);
                              toast.success("Deleted");
                              qc.invalidateQueries({ queryKey: ["withdrawals"] });
                            }}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Delete withdrawal"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {(wdHistoryQ.data ?? []).length === 0 && (
                  <p className="text-xs text-muted-foreground">No withdrawals yet.</p>
                )}
              </div>
            )}
          </TabsContent>

          {/* ═══ NOTIFICATIONS ═══ */}
          <TabsContent value="notifications" className="mt-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" /> Notification preferences
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose what notifications you receive and how.
              </p>
              <div className="space-y-3 pt-2">
                <Toggle
                  label="New subscriber"
                  checked={prefs.new_subscriber}
                  onChange={(v) => setPrefs({ ...prefs, new_subscriber: v })}
                />
                <Toggle
                  label="New comment on a lesson"
                  checked={prefs.new_comment}
                  onChange={(v) => setPrefs({ ...prefs, new_comment: v })}
                />
                <Toggle
                  label="New course sale"
                  checked={prefs.new_sale}
                  onChange={(v) => setPrefs({ ...prefs, new_sale: v })}
                />
                <div className="h-px bg-border" />
                <Toggle
                  label="Email notifications"
                  checked={prefs.email}
                  onChange={(v) => setPrefs({ ...prefs, email: v })}
                />
                <Toggle
                  label="In-app notifications"
                  checked={prefs.inapp}
                  onChange={(v) => setPrefs({ ...prefs, inapp: v })}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={saveNotifs} disabled={savingNotifs}>
                  {savingNotifs ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
                  preferences
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ═══ SETTINGS ═══ */}
          <TabsContent value="settings" className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4 max-w-md">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" /> Change password
              </h2>
              <Field label="Current password">
                <Input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                />
              </Field>
              <Field label="New password">
                <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
              </Field>
              <Field label="Confirm new password">
                <Input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
              </Field>
              <div className="flex justify-end pt-2">
                <Button onClick={changePassword} disabled={pwdSaving}>
                  {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Update password
                </Button>
              </div>
            </div>

            {isCreator && (
              <>
                <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                  <h2 className="font-display font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" /> Payout method
                  </h2>
                  <Field label="Method">
                    <Select
                      value={payout.method ?? "bank"}
                      onValueChange={(v: "bank" | "upi") => setPayout({ ...payout, method: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">Bank transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  {payout.method === "upi" ? (
                    <Field label="UPI ID">
                      <Input
                        value={payout.upi_id ?? ""}
                        onChange={(e) => setPayout({ ...payout, upi_id: e.target.value })}
                        placeholder="name@bank"
                      />
                    </Field>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Account holder">
                        <Input
                          value={payout.account_name ?? ""}
                          onChange={(e) => setPayout({ ...payout, account_name: e.target.value })}
                        />
                      </Field>
                      <Field label="IFSC">
                        <Input
                          value={payout.ifsc ?? ""}
                          onChange={(e) => setPayout({ ...payout, ifsc: e.target.value })}
                        />
                      </Field>
                      <Field label="Account number" className="sm:col-span-2">
                        <Input
                          value={payout.account_number ?? ""}
                          onChange={(e) => setPayout({ ...payout, account_number: e.target.value })}
                        />
                      </Field>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-4">
                  <h2 className="font-display font-semibold">New-course defaults</h2>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Default price (₹)">
                      <Input
                        type="number"
                        min={0}
                        value={defaults.price_inr}
                        onChange={(e) =>
                          setDefaults({ ...defaults, price_inr: Number(e.target.value) || 0 })
                        }
                      />
                    </Field>
                    <Field label="Category">
                      <Select
                        value={defaults.category}
                        onValueChange={(v) => setDefaults({ ...defaults, category: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "General",
                            "Development",
                            "Design",
                            "Marketing",
                            "AI & Data",
                            "Business",
                            "Personal Growth",
                          ].map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Level">
                      <Select
                        value={defaults.level}
                        onValueChange={(v) => setDefaults({ ...defaults, level: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Beginner", "Intermediate", "Advanced"].map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveExtra} disabled={savingExtra}>
                    {savingExtra ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
                    settings
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          {/* ═══ BRANDING (Team / Admin) ═══ */}
          {isAdmin && (
          <TabsContent value="branding" className="mt-6 space-y-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6">
              <h2 className="font-display font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Organization Branding
              </h2>
              <p className="text-sm text-muted-foreground">
                Customize how your certificates and invoices appear. Changes apply to all certificates you issue.
              </p>

              <div className="space-y-4">
                <Field label="Organization Name">
                  <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Your Company" />
                </Field>

                <Field label="Organization Logo URL">
                  <Input value={orgLogoUrl} onChange={e => setOrgLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
                </Field>

                <Field label="Brand Color">
                  <div className="relative mt-1">
                    <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                    <div className="w-full h-9 rounded-lg border flex items-center gap-2 px-2" style={{ background: brandColor + '22', borderColor: brandColor }}>
                      <div className="h-5 w-5 rounded border" style={{ background: brandColor }} />
                      <span className="text-xs font-mono">{brandColor}</span>
                    </div>
                  </div>
                </Field>
              </div>
            </div>

            {(subQ.data as any)?.pricing_plans?.name === "Team" && (
              <div className="rounded-2xl border bg-card p-5 sm:p-6 shadow-sm space-y-6">
                <h2 className="font-display font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Invoice Customization
                </h2>
                <p className="text-sm text-muted-foreground">
                  Custom invoice branding for your organization. These override the global invoice defaults.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Invoice company name"><Input value={invCompanyName} onChange={e => setInvCompanyName(e.target.value)} placeholder="Your Company" /></Field>
                  <Field label="Invoice legal name"><Input value={invLegalName} onChange={e => setInvLegalName(e.target.value)} placeholder="Your Company Pvt. Ltd." /></Field>
                  <Field label="GSTIN"><Input value={invGstin} onChange={e => setInvGstin(e.target.value)} placeholder="29XXXXX1234X1Z5" /></Field>
                  <Field label="Invoice prefix"><Input value={invPrefix} onChange={e => setInvPrefix(e.target.value)} placeholder="INV" /></Field>
                  <Field label="Invoice logo URL"><Input value={invLogoUrl} onChange={e => setInvLogoUrl(e.target.value)} placeholder="https://example.com/invoice-logo.png" /></Field>
                  <Field label="Contact (email/phone)"><Input value={invContact} onChange={e => setInvContact(e.target.value)} placeholder="hello@company.com" /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Invoice footer"><Input value={invFooter} onChange={e => setInvFooter(e.target.value)} placeholder="Thank you for your business!" /></Field>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={async () => {
                setSavingBranding(true);
                try {
                  const { error } = await supabase.from("profiles").update({
                    org_name: orgName || null,
                    org_logo_url: orgLogoUrl || null,
                    brand_color: brandColor,
                    invoice_company_name: invCompanyName || null,
                    invoice_legal_name: invLegalName || null,
                    invoice_gstin: invGstin || null,
                    invoice_prefix: invPrefix || null,
                    invoice_footer: invFooter || null,
                    invoice_logo_url: invLogoUrl || null,
                    invoice_contact: invContact || null,
                  }).eq("id", user!.id);
                  if (error) throw error;
                  toast.success("Branding saved");
                  qc.invalidateQueries({ queryKey: ["profile-full"] });
                } catch (e: any) {
                  toast.error(e.message);
                } finally {
                  setSavingBranding(false);
                }
              }} disabled={savingBranding}>
                {savingBranding ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Branding
              </Button>
            </div>
          </TabsContent>
          )}
        </Tabs>
      </div>
    </AppShell>
  );
}

/* ── Helpers ── */
const loadCashfree = () =>
  new Promise((resolve) => {
    if ((window as any).Cashfree) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
