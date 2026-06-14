import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell, a as Avatar, b as AvatarImage, c as AvatarFallback } from "./AppShell-BXcQmjDj.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CCbL2pbx.mjs";
import { a0 as User, aC as KeyRound, W as Wallet, L as LoaderCircle, aq as Upload, ah as Trash2 } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
const inr = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
function SettingsPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const fileInput = reactExports.useRef(null);
  const [fullName, setFullName] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [savingName, setSavingName] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const [avatarSignedUrl, setAvatarSignedUrl] = reactExports.useState(null);
  const [currentPwd, setCurrentPwd] = reactExports.useState("");
  const [newPwd, setNewPwd] = reactExports.useState("");
  const [confirmPwd, setConfirmPwd] = reactExports.useState("");
  const [pwdSaving, setPwdSaving] = reactExports.useState(false);
  const profileQuery = useQuery({
    enabled: !!user,
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("profiles").select("id, email, full_name, avatar_url, bio, created_at").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  reactExports.useEffect(() => {
    if (profileQuery.data?.full_name) setFullName(profileQuery.data.full_name);
    if (profileQuery.data?.bio) setBio(profileQuery.data.bio);
  }, [profileQuery.data?.full_name, profileQuery.data?.bio]);
  reactExports.useEffect(() => {
    const path = profileQuery.data?.avatar_url;
    if (!path) {
      setAvatarSignedUrl(null);
      return;
    }
    let cancelled = false;
    supabase.storage.from("avatars").createSignedUrl(path, 60 * 60).then(({
      data
    }) => {
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
      const {
        data,
        error
      } = await supabase.from("wallet_transactions").select("id, amount_inr, type, status, description, created_at").eq("user_id", user.id).order("created_at", {
        ascending: false
      }).limit(50);
      if (error) throw error;
      return data ?? [];
    }
  });
  const balance = (walletQuery.data ?? []).filter((t) => t.status === "completed").reduce((s, t) => s + (t.type === "credit" ? Number(t.amount_inr) : -Number(t.amount_inr)), 0);
  async function saveName() {
    if (!user) return;
    const trimmed = fullName.trim();
    if (!trimmed) return toast.error("Name cannot be empty");
    setSavingName(true);
    const {
      error
    } = await supabase.from("profiles").update({
      full_name: trimmed,
      bio: bio.trim() || null
    }).eq("id", user.id);
    setSavingName(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    qc.invalidateQueries({
      queryKey: ["profile"]
    });
  }
  async function handleAvatarUpload(file) {
    if (!user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be < 5MB");
    if (!file.type.startsWith("image/")) return toast.error("Pick an image file");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${user.id}/${Date.now()}.${ext}`;
      const {
        error: upErr
      } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true
      });
      if (upErr) throw upErr;
      const old = profileQuery.data?.avatar_url;
      if (old && old !== path) {
        await supabase.storage.from("avatars").remove([old]);
      }
      const {
        error: pErr
      } = await supabase.from("profiles").update({
        avatar_url: path
      }).eq("id", user.id);
      if (pErr) throw pErr;
      toast.success("Photo updated");
      qc.invalidateQueries({
        queryKey: ["profile"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  }
  async function removeAvatar() {
    if (!user) return;
    const old = profileQuery.data?.avatar_url;
    if (old) await supabase.storage.from("avatars").remove([old]);
    await supabase.from("profiles").update({
      avatar_url: null
    }).eq("id", user.id);
    toast.success("Photo removed");
    qc.invalidateQueries({
      queryKey: ["profile"]
    });
  }
  async function changePassword() {
    if (!user?.email) return;
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPwd !== confirmPwd) return toast.error("Passwords don't match");
    setPwdSaving(true);
    const {
      error: signErr
    } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPwd
    });
    if (signErr) {
      setPwdSaving(false);
      return toast.error("Current password is incorrect");
    }
    const {
      error
    } = await supabase.auth.updateUser({
      password: newPwd
    });
    setPwdSaving(false);
    if (error) return toast.error(error.message);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    toast.success("Password updated");
  }
  const initials = (profileQuery.data?.full_name ?? user?.email ?? "U").toString().split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 md:px-10 py-8 max-w-4xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Settings" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 181,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-3xl font-display font-semibold", children: "Your account" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 182,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground mt-1 text-sm", children: "Manage your profile, password, and wallet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 183,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
      lineNumber: 180,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tabs, { defaultValue: "profile", className: "w-full", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsList, { className: "grid grid-cols-3 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "profile", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(User, { className: "h-4 w-4 mr-1.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 191,
            columnNumber: 15
          }, this),
          "Profile"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 190,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "password", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(KeyRound, { className: "h-4 w-4 mr-1.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 195,
            columnNumber: 15
          }, this),
          "Password"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 194,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "wallet", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Wallet, { className: "h-4 w-4 mr-1.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 199,
            columnNumber: 15
          }, this),
          "Wallet"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 198,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 189,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "profile", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: "h-20 w-20", children: [
            avatarSignedUrl ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarImage, { src: avatarSignedUrl, alt: "Avatar" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 208,
              columnNumber: 38
            }, this) : null,
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { className: "text-lg bg-primary/10 text-primary", children: initials }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 209,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 207,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("input", { ref: fileInput, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
              const f = e.target.files?.[0];
              if (f) handleAvatarUpload(f);
              e.target.value = "";
            } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 214,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => fileInput.current?.click(), disabled: uploading, children: [
              uploading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 220,
                columnNumber: 34
              }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Upload, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 220,
                columnNumber: 81
              }, this),
              "Upload photo"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 219,
              columnNumber: 19
            }, this),
            profileQuery.data?.avatar_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: removeAvatar, children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 224,
                columnNumber: 23
              }, this),
              " Remove"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 223,
              columnNumber: 52
            }, this) : null
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 213,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 206,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "email", children: "Email" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 231,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "email", value: user?.email ?? "", disabled: true }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 232,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 230,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "name", children: "Full name / Username" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 235,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "name", value: fullName, onChange: (e) => setFullName(e.target.value), maxLength: 120 }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 236,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 234,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 229,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "bio", children: "Bio" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 240,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("textarea", { id: "bio", value: bio, onChange: (e) => setBio(e.target.value), maxLength: 500, rows: 3, className: "w-full rounded-md border bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", placeholder: "Tell others about yourself…" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 241,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
            bio.length,
            "/500 · shown on your public profile"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 242,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 239,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: saveName, disabled: savingName, children: [
          savingName ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 248,
            columnNumber: 33
          }, this) : null,
          " Save changes"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 247,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 246,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 205,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 204,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "password", className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-6 shadow-card max-w-md", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "cur", children: "Current password" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 258,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "cur", type: "password", value: currentPwd, onChange: (e) => setCurrentPwd(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 259,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 257,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "new", children: "New password" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 262,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "new", type: "password", value: newPwd, onChange: (e) => setNewPwd(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 263,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 261,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { htmlFor: "conf", children: "Confirm new password" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 266,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { id: "conf", type: "password", value: confirmPwd, onChange: (e) => setConfirmPwd(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 267,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 265,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: changePassword, disabled: pwdSaving, children: [
          pwdSaving ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 271,
            columnNumber: 34
          }, this) : null,
          " Update password"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 270,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 269,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 256,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 255,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 254,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "wallet", className: "mt-6", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-6 shadow-card mb-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "Balance" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 281,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 text-3xl font-display font-semibold", children: inr(balance) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 282,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1", children: [
            "Across ",
            walletQuery.data?.length ?? 0,
            " transactions"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 283,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 280,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card shadow-card overflow-hidden", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold", children: "Recent transactions" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 289,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 288,
            columnNumber: 15
          }, this),
          walletQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 292,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 291,
            columnNumber: 40
          }, this) : (walletQuery.data ?? []).length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No transactions yet." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 293,
            columnNumber: 66
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { className: "bg-muted/40 text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-6 py-3", children: "When" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 299,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-6 py-3", children: "Type" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 300,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-6 py-3", children: "Description" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 301,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-6 py-3", children: "Amount" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 302,
                columnNumber: 25
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 298,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 297,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { children: (walletQuery.data ?? []).map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-t", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-xs text-muted-foreground", children: format(new Date(t.created_at), "dd-MM-yyyy HH:mm") }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 307,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 capitalize", children: t.type }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 310,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-muted-foreground", children: t.description ?? "—" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 311,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: `px-6 py-3 text-right font-medium ${t.type === "credit" ? "text-emerald-600" : "text-destructive"}`, children: [
                t.type === "credit" ? "+" : "−",
                inr(Number(t.amount_inr))
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
                lineNumber: 314,
                columnNumber: 27
              }, this)
            ] }, t.id, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 306,
              columnNumber: 58
            }, this)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
              lineNumber: 305,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 296,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
            lineNumber: 295,
            columnNumber: 26
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
          lineNumber: 287,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
        lineNumber: 279,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
      lineNumber: 188,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
    lineNumber: 179,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/settings.tsx?tsr-split=component",
    lineNumber: 178,
    columnNumber: 10
  }, this);
}
export {
  SettingsPage as component
};
