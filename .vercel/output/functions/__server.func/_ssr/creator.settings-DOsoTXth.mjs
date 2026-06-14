import { e as jsxDevRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { C as CreatorGate, a as CreatorTabs } from "./CreatorTabs-BevizuQm.mjs";
import { C as Card } from "./card-1p_vtslP.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { S as Switch } from "./switch-DyY6BxUU.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CxVLEfDB.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LoaderCircle, V as Settings, ai as ExternalLink, aQ as Save } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
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
function CreatorSettingsPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [saving, setSaving] = reactExports.useState(false);
  const profileQ = useQuery({
    enabled: !!user,
    queryKey: ["creator-profile-self", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("profiles").select("id, social_links, payout_destination, notif_prefs, default_course_settings").eq("id", user.id).single();
      if (error) throw error;
      return data;
    }
  });
  const [links, setLinks] = reactExports.useState({});
  const [payout, setPayout] = reactExports.useState({
    method: "bank"
  });
  const [prefs, setPrefs] = reactExports.useState({
    new_subscriber: true,
    new_comment: true,
    new_sale: true,
    email: true,
    inapp: true
  });
  const [defaults, setDefaults] = reactExports.useState({
    price_inr: 0,
    category: "General",
    level: "Beginner"
  });
  reactExports.useEffect(() => {
    const p = profileQ.data;
    if (!p) return;
    setLinks(p.social_links ?? {});
    setPayout(p.payout_destination ?? {
      method: "bank"
    });
    setPrefs({
      new_subscriber: true,
      new_comment: true,
      new_sale: true,
      email: true,
      inapp: true,
      ...p.notif_prefs ?? {}
    });
    setDefaults({
      price_inr: 0,
      category: "General",
      level: "Beginner",
      ...p.default_course_settings ?? {}
    });
  }, [profileQ.data]);
  const save = async () => {
    if (!user) return;
    setSaving(true);
    const {
      error
    } = await supabase.from("profiles").update({
      social_links: links,
      payout_destination: payout,
      notif_prefs: prefs,
      default_course_settings: defaults
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({
      queryKey: ["creator-profile-self", user.id]
    });
  };
  if (profileQ.isLoading) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 120,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 119,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 118,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-3xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorTabs, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 126,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3 mt-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Settings, { className: "h-5 w-5 text-primary" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
        lineNumber: 128,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl font-display font-semibold", children: "Creator settings" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
        lineNumber: 129,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 127,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Manage what learners see, how you get paid, and what we notify you about." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 131,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 space-y-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold", children: "Public profile" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 139,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-1", children: [
            "Your name, avatar, and bio are managed in",
            " ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/settings", className: "text-primary inline-flex items-center gap-0.5 hover:underline", children: [
              "Account Settings ",
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
                lineNumber: 143,
                columnNumber: 38
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 142,
              columnNumber: 19
            }, this),
            "."
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 140,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 138,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 137,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-px bg-border" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 149,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Website", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: links.website ?? "", onChange: (e) => setLinks({
            ...links,
            website: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 152,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 151,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Twitter / X", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: links.twitter ?? "", onChange: (e) => setLinks({
            ...links,
            twitter: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 158,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 157,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "YouTube", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: links.youtube ?? "", onChange: (e) => setLinks({
            ...links,
            youtube: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 164,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 163,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "GitHub", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: links.github ?? "", onChange: (e) => setLinks({
            ...links,
            github: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 170,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 169,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 150,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
        lineNumber: 136,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold", children: "Payouts" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 179,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Method", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Select, { value: payout.method ?? "bank", onValueChange: (v) => setPayout({
          ...payout,
          method: v
        }), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectValue, {}, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 186,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 185,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectContent, { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "upi", children: "UPI" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 189,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "bank", children: "Bank transfer" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 190,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "paypal", children: "PayPal" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 191,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 188,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 181,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 180,
          columnNumber: 13
        }, this),
        payout.method === "upi" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "UPI ID", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: payout.upi_id ?? "", onChange: (e) => setPayout({
          ...payout,
          upi_id: e.target.value
        }), placeholder: "name@bank" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 196,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 195,
          columnNumber: 40
        }, this) : payout.method === "paypal" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "PayPal email", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "email", value: payout.paypal_email ?? "", onChange: (e) => setPayout({
          ...payout,
          paypal_email: e.target.value
        }), placeholder: "you@example.com" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 201,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 200,
          columnNumber: 55
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Account holder", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: payout.account_name ?? "", onChange: (e) => setPayout({
            ...payout,
            account_name: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 207,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 206,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "IFSC", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: payout.ifsc ?? "", onChange: (e) => setPayout({
            ...payout,
            ifsc: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 213,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 212,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Account number", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: payout.account_number ?? "", onChange: (e) => setPayout({
            ...payout,
            account_number: e.target.value
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 219,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 218,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 205,
          columnNumber: 26
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: "Used to autofill when you request a withdrawal from your wallet." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 225,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
        lineNumber: 178,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold", children: "Notifications" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 231,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Toggle, { label: "New subscriber", checked: prefs.new_subscriber, onChange: (v) => setPrefs({
          ...prefs,
          new_subscriber: v
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 232,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Toggle, { label: "New comment on a lesson", checked: prefs.new_comment, onChange: (v) => setPrefs({
          ...prefs,
          new_comment: v
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 236,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Toggle, { label: "New course sale", checked: prefs.new_sale, onChange: (v) => setPrefs({
          ...prefs,
          new_sale: v
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 240,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-px bg-border my-2" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 244,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Toggle, { label: "Email", checked: prefs.email, onChange: (v) => setPrefs({
          ...prefs,
          email: v
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 245,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Toggle, { label: "In-app", checked: prefs.inapp, onChange: (v) => setPrefs({
          ...prefs,
          inapp: v
        }) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 249,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
        lineNumber: 230,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold", children: "New-course defaults" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 256,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Default price (₹)", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", min: 0, value: defaults.price_inr, onChange: (e) => setDefaults({
            ...defaults,
            price_inr: Number(e.target.value) || 0
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 259,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 258,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Category", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Select, { value: defaults.category, onValueChange: (v) => setDefaults({
            ...defaults,
            category: v
          }), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectValue, {}, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 270,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 269,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectContent, { children: ["General", "Development", "Design", "Marketing", "AI & Data", "Business", "Personal Growth"].map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: c, children: c }, c, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 273,
              columnNumber: 125
            }, this)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 272,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 265,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 264,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Level", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Select, { value: defaults.level, onValueChange: (v) => setDefaults({
            ...defaults,
            level: v
          }), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectTrigger, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectValue, {}, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 285,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 284,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectContent, { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "Beginner", children: "Beginner" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
                lineNumber: 288,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "Intermediate", children: "Intermediate" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
                lineNumber: 289,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: "Advanced", children: "Advanced" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
                lineNumber: 290,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
              lineNumber: 287,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 280,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
            lineNumber: 279,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 257,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
        lineNumber: 255,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: save, disabled: saving, children: [
        saving ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 299,
          columnNumber: 25
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Save, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
          lineNumber: 299,
          columnNumber: 72
        }, this),
        " ",
        "Save changes"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
        lineNumber: 298,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
        lineNumber: 297,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 135,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
    lineNumber: 125,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
    lineNumber: 124,
    columnNumber: 10
  }, this);
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs uppercase tracking-wide text-muted-foreground", children: label }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 315,
      columnNumber: 7
    }, this),
    children
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
    lineNumber: 314,
    columnNumber: 10
  }, this);
}
function Toggle({
  label,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-sm", children: label }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 329,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Switch, { checked, onCheckedChange: onChange }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
      lineNumber: 330,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
    lineNumber: 328,
    columnNumber: 10
  }, this);
}
const SplitComponent = () => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorGate, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorSettingsPage, {}, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
  lineNumber: 334,
  columnNumber: 7
}, void 0) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.settings.tsx?tsr-split=component",
  lineNumber: 333,
  columnNumber: 30
}, void 0);
export {
  SplitComponent as component
};
