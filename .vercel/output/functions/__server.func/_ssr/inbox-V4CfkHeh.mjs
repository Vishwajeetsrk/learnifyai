import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { B as Button, c as cn } from "./button-s-7T9USx.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CCbL2pbx.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { R as Inbox, m as Bell, aD as CalendarClock, L as LoaderCircle, ah as Trash2, r as Clock, aE as Power } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
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
function InboxPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const notifs = useQuery({
    enabled: !!user,
    queryKey: ["inbox-notifs", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("notifications").select("*").order("created_at", {
        ascending: false
      }).limit(200);
      if (error) throw error;
      return data ?? [];
    }
  });
  const reminders = useQuery({
    enabled: !!user,
    queryKey: ["inbox-reminders", user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("scheduled_reminders").select("*").order("next_run_at", {
        ascending: true
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const markRead = async (id) => {
    await supabase.from("notifications").update({
      read: true
    }).eq("id", id);
    qc.invalidateQueries({
      queryKey: ["inbox-notifs"]
    });
  };
  const del = async (id) => {
    await supabase.from("notifications").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["inbox-notifs"]
    });
  };
  const delReminder = async (id) => {
    await supabase.from("scheduled_reminders").delete().eq("id", id);
    qc.invalidateQueries({
      queryKey: ["inbox-reminders"]
    });
    toast.success("Reminder deleted");
  };
  const toggleActive = async (id, active) => {
    await supabase.from("scheduled_reminders").update({
      active: !active
    }).eq("id", id);
    qc.invalidateQueries({
      queryKey: ["inbox-reminders"]
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-6 sm:py-10 max-w-4xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Inbox, { className: "h-5 w-5 text-primary" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 77,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl sm:text-3xl font-display font-semibold", children: "Inbox" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 78,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
      lineNumber: 76,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground text-sm mt-1", children: "Notifications and upcoming reminders." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
      lineNumber: 80,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tabs, { defaultValue: "notifs", className: "mt-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsList, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "notifs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bell, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 85,
            columnNumber: 15
          }, this),
          " Notifications"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 84,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "reminders", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CalendarClock, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 88,
            columnNumber: 15
          }, this),
          " Reminders"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 87,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 83,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "notifs", className: "space-y-2 pt-4", children: notifs.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground mx-auto my-12" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 93,
        columnNumber: 33
      }, this) : (notifs.data ?? []).length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-12", children: "No notifications yet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 93,
        columnNumber: 151
      }, this) : (notifs.data ?? []).map((n) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: cn("border rounded-lg p-3 sm:p-4 flex gap-3", !n.read && "bg-primary/5 border-primary/30"), children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-9 w-9 rounded-lg bg-primary/10 grid place-items-center shrink-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bell, { className: "h-4 w-4 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 97,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 96,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-medium text-sm sm:text-base", children: n.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
              lineNumber: 101,
              columnNumber: 23
            }, this),
            !n.read && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: "New" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
              lineNumber: 102,
              columnNumber: 35
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 100,
            columnNumber: 21
          }, this),
          n.body && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground whitespace-pre-wrap mt-1", children: n.body }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 106,
            columnNumber: 32
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground mt-2", children: format(new Date(n.created_at), "dd MMM yyyy · HH:mm") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 109,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 99,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col gap-1", children: [
          !n.read && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", onClick: () => markRead(n.id), children: "Mark read" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 114,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: () => del(n.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 118,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 117,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 113,
          columnNumber: 19
        }, this)
      ] }, n.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 95,
        columnNumber: 51
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 92,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "reminders", className: "space-y-2 pt-4", children: reminders.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground mx-auto my-12" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 125,
        columnNumber: 36
      }, this) : (reminders.data ?? []).length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center py-12", children: [
        "No scheduled reminders. Create one from",
        " ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: "/ai-tools", className: "text-primary underline", children: "AI Tools → Smart Reminders" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 127,
          columnNumber: 17
        }, this),
        "."
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 125,
        columnNumber: 157
      }, this) : (reminders.data ?? []).map((r) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border rounded-lg p-3 sm:p-4 flex gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-9 w-9 rounded-lg bg-primary/10 grid place-items-center shrink-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { className: "h-4 w-4 text-primary" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 133,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 132,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-medium text-sm sm:text-base", children: r.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 136,
            columnNumber: 21
          }, this),
          r.body && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground line-clamp-2 mt-1", children: r.body }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 137,
            columnNumber: 32
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-center gap-2 mt-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: r.frequency }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
              lineNumber: 139,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[11px] text-muted-foreground", children: [
              "Next: ",
              format(new Date(r.next_run_at), "dd MMM yyyy · HH:mm")
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
              lineNumber: 142,
              columnNumber: 23
            }, this),
            !r.active && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px]", children: "paused" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
              lineNumber: 145,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 138,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 135,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: () => toggleActive(r.id, r.active), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Power, { className: cn("h-4 w-4", r.active ? "text-emerald-500" : "text-muted-foreground") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 152,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 151,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: () => delReminder(r.id), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 155,
            columnNumber: 23
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
            lineNumber: 154,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
          lineNumber: 150,
          columnNumber: 19
        }, this)
      ] }, r.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 131,
        columnNumber: 54
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
        lineNumber: 124,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
      lineNumber: 82,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
    lineNumber: 75,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/inbox.tsx?tsr-split=component",
    lineNumber: 74,
    columnNumber: 10
  }, this);
}
export {
  InboxPage as component
};
