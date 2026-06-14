import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell, a as Avatar, c as AvatarFallback } from "./AppShell-BXcQmjDj.mjs";
import { f as Route$4, u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { L as LoaderCircle, av as ArrowLeft, q as Calendar, U as Users, al as Video, ai as ExternalLink } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
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
import "../_libs/tanstack__query-core.mjs";
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
function CohortDetail() {
  const {
    id
  } = Route$4.useParams();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const cohortQuery = useQuery({
    queryKey: ["cohort", id],
    queryFn: async () => {
      const {
        data: c2,
        error
      } = await supabase.from("cohorts").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!c2) return null;
      const [{
        data: members
      }, {
        data: creator
      }] = await Promise.all([supabase.from("cohort_members").select("user_id, role, joined_at").eq("cohort_id", id), supabase.from("profiles").select("id, full_name, avatar_url").eq("id", c2.creator_id).maybeSingle()]);
      const memberIds = (members ?? []).map((m) => m.user_id);
      let memberProfiles = [];
      if (memberIds.length) {
        const {
          data: data2
        } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", memberIds);
        memberProfiles = data2 ?? [];
      }
      return {
        cohort: c2,
        members: members ?? [],
        memberProfiles,
        creator
      };
    }
  });
  const data = cohortQuery.data;
  const isMember = !!data?.members.find((m) => m.user_id === user?.id);
  const isHost = data?.cohort.creator_id === user?.id;
  async function join() {
    if (!user) return navigate({
      to: "/login"
    });
    const {
      error
    } = await supabase.from("cohort_members").insert({
      cohort_id: id,
      user_id: user.id
    });
    if (error) return toast.error(error.message);
    toast.success("Joined cohort");
    qc.invalidateQueries({
      queryKey: ["cohort", id]
    });
  }
  async function leave() {
    if (!user) return;
    const {
      error
    } = await supabase.from("cohort_members").delete().eq("cohort_id", id).eq("user_id", user.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({
      queryKey: ["cohort", id]
    });
  }
  if (cohortQuery.isLoading) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
    lineNumber: 83,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
    lineNumber: 82,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
    lineNumber: 81,
    columnNumber: 37
  }, this);
  if (!data) return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 text-center text-sm text-muted-foreground", children: "Cohort not found." }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
    lineNumber: 87,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
    lineNumber: 86,
    columnNumber: 21
  }, this);
  const c = data.cohort;
  const memberCount = data.members.length;
  const isFull = memberCount >= c.capacity;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-6 max-w-4xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/cohorts", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
        lineNumber: 95,
        columnNumber: 11
      }, this),
      " All cohorts"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
      lineNumber: 94,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-3xl border bg-card p-6 sm:p-8 shadow-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "text-[10px] mb-2 capitalize", children: c.kind.replace("_", " ") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 101,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "font-display text-2xl sm:text-3xl font-semibold tracking-tight", children: c.title }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 104,
            columnNumber: 15
          }, this),
          data.creator && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/u/$id", params: {
            id: data.creator.id
          }, className: "inline-flex items-center gap-2 mt-2 text-sm text-muted-foreground hover:text-foreground", children: [
            "Hosted by ",
            data.creator.full_name ?? "Creator"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 107,
            columnNumber: 32
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 100,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: c.status === "live" ? "default" : "outline", className: "capitalize", children: c.status }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 113,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
        lineNumber: 99,
        columnNumber: 11
      }, this),
      c.description && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-4 text-sm text-muted-foreground leading-relaxed", children: c.description }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
        lineNumber: 118,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border p-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
              lineNumber: 123,
              columnNumber: 17
            }, this),
            " Starts"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 122,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium mt-1", children: format(new Date(c.starts_at), "dd MMM, HH:mm") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 125,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 121,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border p-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Users, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
              lineNumber: 131,
              columnNumber: 17
            }, this),
            " Members"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 130,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium mt-1", children: [
            memberCount,
            "/",
            c.capacity
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 133,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 129,
          columnNumber: 13
        }, this),
        c.meeting_url && (isMember || isHost) && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: c.meeting_url, target: "_blank", rel: "noreferrer", className: "rounded-xl border p-3 hover:bg-accent flex flex-col", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Video, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
              lineNumber: 139,
              columnNumber: 19
            }, this),
            " Meeting"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 138,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-medium mt-1 flex items-center gap-1 truncate", children: [
            "Join call ",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
              lineNumber: 142,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 141,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 137,
          columnNumber: 55
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
        lineNumber: 120,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 flex gap-2", children: [
        !isHost && (isMember ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: leave, children: "Leave cohort" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 148,
          columnNumber: 37
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: join, disabled: isFull, children: isFull ? "Full" : "Join cohort" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 150,
          columnNumber: 29
        }, this)),
        isHost && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "default", children: "You're the host" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 153,
          columnNumber: 24
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
        lineNumber: 147,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
      lineNumber: 98,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display font-semibold mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Users, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 159,
          columnNumber: 13
        }, this),
        " Members (",
        memberCount,
        ")"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
        lineNumber: 158,
        columnNumber: 11
      }, this),
      memberCount === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: "No members yet. Be the first to join!" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
        lineNumber: 161,
        columnNumber: 32
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: data.memberProfiles.map((p) => {
        const initials = (p.full_name ?? "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/u/$id", params: {
          id: p.id
        }, className: "flex items-center gap-3 p-2 rounded-lg hover:bg-accent", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { children: initials }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 169,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 168,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-sm truncate", children: p.full_name ?? "Learner" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
            lineNumber: 171,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 165,
          columnNumber: 21
        }, this) }, p.id, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
          lineNumber: 164,
          columnNumber: 20
        }, this);
      }) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
        lineNumber: 161,
        columnNumber: 121
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
      lineNumber: 157,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
    lineNumber: 93,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/cohorts.$id.tsx?tsr-split=component",
    lineNumber: 92,
    columnNumber: 10
  }, this);
}
export {
  CohortDetail as component
};
