import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Upload, Trash2, Wallet, KeyRound, User as UserIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

function SettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [avatarSignedUrl, setAvatarSignedUrl] = useState<string | null>(null);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);

  const profileQuery = useQuery({
    enabled: !!user,
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, bio, created_at")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (profileQuery.data?.full_name) setFullName(profileQuery.data.full_name);
    if (profileQuery.data?.bio) setBio(profileQuery.data.bio);
  }, [profileQuery.data?.full_name, profileQuery.data?.bio]);

  // Sign storage path → URL so user can preview their avatar
  useEffect(() => {
    const path = profileQuery.data?.avatar_url;
    if (!path) {
      setAvatarSignedUrl(null);
      return;
    }
    if (path.startsWith("http")) {
      setAvatarSignedUrl(path);
      return;
    }
    let cancelled = false;
    supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60)
      .then(({ data }) => {
        if (!cancelled) setAvatarSignedUrl(data?.signedUrl ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [profileQuery.data?.avatar_url]);

  const walletQuery = useQuery({
    enabled: !!user,
    queryKey: ["wallet", user?.id],
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

  const balance = (walletQuery.data ?? [])
    .filter((t) => t.status === "completed")
    .reduce((s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)), 0);

  async function saveName() {
    if (!user) return;
    const trimmed = fullName.trim();
    if (!trimmed) return toast.error("Name cannot be empty");
    setSavingName(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: trimmed, bio: bio.trim() || null })
      .eq("id", user.id);
    setSavingName(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

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

      // remove old file if any, skipping external URLs
      const old = profileQuery.data?.avatar_url;
      if (old && old !== path && !old.startsWith("http")) {
        await supabase.storage.from("avatars").remove([old]);
      }

      const { error: pErr } = await supabase
        .from("profiles")
        .update({ avatar_url: path })
        .eq("id", user.id);
      if (pErr) throw pErr;

      toast.success("Photo updated");
      qc.invalidateQueries({ queryKey: ["profile"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function removeAvatar() {
    if (!user) return;
    const old = profileQuery.data?.avatar_url;
    if (old && !old.startsWith("http")) {
      await supabase.storage.from("avatars").remove([old]);
    }
    await supabase.from("profiles").update({ avatar_url: null }).eq("id", user.id);
    toast.success("Photo removed");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  async function changePassword() {
    if (!user?.email) return;
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPwd !== confirmPwd) return toast.error("Passwords don't match");
    setPwdSaving(true);
    // Verify current
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

  const initials = (profileQuery.data?.full_name ?? user?.email ?? "U")
    .toString()
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppShell>
      <div className="px-4 md:px-10 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Settings</div>
          <h1 className="mt-1 text-3xl font-display font-semibold">Your account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your profile, password, and wallet.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4 mr-1.5" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="password">
              <KeyRound className="h-4 w-4 mr-1.5" />
              Password
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet className="h-4 w-4 mr-1.5" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <div className="flex items-center gap-5">
                <Avatar className="h-20 w-20">
                  {avatarSignedUrl ? <AvatarImage src={avatarSignedUrl} alt="Avatar" /> : null}
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
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
                  {profileQuery.data?.avatar_url ? (
                    <Button size="sm" variant="outline" onClick={removeAvatar}>
                      <Trash2 className="h-4 w-4" /> Remove
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email ?? ""} disabled />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name / Username</Label>
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    maxLength={120}
                  />
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Tell others about yourself…"
                />
                <p className="text-xs text-muted-foreground">
                  {bio.length}/500 · shown on your public profile
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={saveName} disabled={savingName}>
                  {savingName ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save changes
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <div className="rounded-2xl border bg-card p-6 shadow-card max-w-md">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cur">Current password</Label>
                  <Input
                    id="cur"
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new">New password</Label>
                  <Input
                    id="new"
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="conf">Confirm new password</Label>
                  <Input
                    id="conf"
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={changePassword} disabled={pwdSaving}>
                    {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Update
                    password
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <div className="rounded-2xl border bg-card p-6 shadow-card mb-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Balance</div>
              <div className="mt-2 text-3xl font-display font-semibold">{inr(balance)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Across {walletQuery.data?.length ?? 0} transactions
              </div>
            </div>
            <div className="rounded-2xl border bg-card shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="font-display font-semibold">Recent transactions</h3>
              </div>
              {walletQuery.isLoading ? (
                <div className="p-8 grid place-items-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (walletQuery.data ?? []).length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No transactions yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="text-left px-6 py-3">When</th>
                        <th className="text-left px-6 py-3">Type</th>
                        <th className="text-left px-6 py-3">Description</th>
                        <th className="text-right px-6 py-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(walletQuery.data ?? []).map((t) => (
                        <tr key={t.id} className="border-t">
                          <td className="px-6 py-3 text-xs text-muted-foreground">
                            {format(new Date(t.created_at), "dd-MM-yyyy HH:mm")}
                          </td>
                          <td className="px-6 py-3 capitalize">{t.type}</td>
                          <td className="px-6 py-3 text-muted-foreground">
                            {t.description ?? "—"}
                          </td>
                          <td
                            className={`px-6 py-3 text-right font-medium ${t.type === "credit" ? "text-emerald-600" : "text-destructive"}`}
                          >
                            {t.type === "credit" ? "+" : "−"}
                            {inr(Number(t.amount_inr))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
