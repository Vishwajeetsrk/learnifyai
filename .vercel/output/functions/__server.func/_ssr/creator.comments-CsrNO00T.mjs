import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell, a as Avatar, b as AvatarImage, c as AvatarFallback } from "./AppShell-BXcQmjDj.mjs";
import { C as CreatorGate, a as CreatorTabs } from "./CreatorTabs-BevizuQm.mjs";
import { C as Card } from "./card-1p_vtslP.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { M as MessageSquare, L as LoaderCircle, ah as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
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
function CreatorCommentsPage() {
  const {
    user,
    isAdmin
  } = useAuth();
  const qc = useQueryClient();
  const q = useQuery({
    enabled: !!user,
    queryKey: ["creator-comments", user?.id],
    queryFn: async () => {
      const {
        data: courses
      } = await supabase.from("courses").select("id, title").eq("created_by", user.id);
      const cIds = (courses ?? []).map((c) => c.id);
      if (!cIds.length) return {
        comments: []
      };
      const {
        data: lessons
      } = await supabase.from("lessons").select("id, title, course_id").in("course_id", cIds);
      const lIds = (lessons ?? []).map((l) => l.id);
      if (!lIds.length) return {
        comments: []
      };
      const lessonMap = new Map((lessons ?? []).map((l) => [l.id, l]));
      const {
        data: comments,
        error
      } = await supabase.from("lesson_comments").select("id, body, created_at, user_id, lesson_id").in("lesson_id", lIds).order("created_at", {
        ascending: false
      }).limit(200);
      if (error) throw error;
      const userIds = Array.from(new Set((comments ?? []).map((c) => c.user_id)));
      const {
        data: profiles
      } = userIds.length ? await supabase.from("profiles").select("id, full_name, email, avatar_url").in("id", userIds) : {
        data: []
      };
      const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
      return {
        comments: (comments ?? []).map((c) => ({
          ...c,
          lesson: lessonMap.get(c.lesson_id),
          profile: pmap.get(c.user_id)
        }))
      };
    }
  });
  const remove = async (id) => {
    const {
      error
    } = await supabase.from("lesson_comments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Comment deleted");
    qc.invalidateQueries({
      queryKey: ["creator-comments", user?.id]
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-8 max-w-4xl", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorTabs, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 77,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3 mt-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageSquare, { className: "h-5 w-5 text-primary" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
        lineNumber: 79,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl font-display font-semibold", children: "Comments on your lessons" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
        lineNumber: 80,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 78,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: [
      "Latest 200 comments across your courses.",
      !isAdmin && " Only your own comments and admin moderation can remove others."
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 82,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "mt-6 p-0 overflow-hidden", children: q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 89,
      columnNumber: 15
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 88,
      columnNumber: 26
    }, this) : !q.data?.comments.length ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-16 text-center text-sm text-muted-foreground", children: "No comments yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 90,
      columnNumber: 49
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y", children: q.data.comments.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "p-4 flex gap-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: "h-9 w-9 shrink-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarImage, { src: c.profile?.avatar_url ?? void 0 }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
          lineNumber: 93,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { children: (c.profile?.full_name ?? "?").slice(0, 1).toUpperCase() }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
          lineNumber: 94,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
        lineNumber: 92,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-foreground", children: c.profile?.full_name ?? "Anonymous" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
            lineNumber: 100,
            columnNumber: 23
          }, this),
          " · ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            Link,
            {
              to: "/courses/$slug",
              params: {
                slug: ""
              },
              className: "hover:underline",
              children: c.lesson?.title ?? "Lesson"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
              lineNumber: 104,
              columnNumber: 23
            },
            this
          ),
          " · ",
          new Date(c.created_at).toLocaleString()
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
          lineNumber: 99,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm mt-1 whitespace-pre-wrap", children: c.body }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
          lineNumber: 114,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
        lineNumber: 98,
        columnNumber: 19
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "ghost", size: "icon", onClick: () => remove(c.id), "aria-label": "Delete comment", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4 text-destructive" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
        lineNumber: 117,
        columnNumber: 21
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
        lineNumber: 116,
        columnNumber: 19
      }, this)
    ] }, c.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 91,
      columnNumber: 48
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 90,
      columnNumber: 139
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
      lineNumber: 87,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
    lineNumber: 76,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
    lineNumber: 75,
    columnNumber: 10
  }, this);
}
const SplitComponent = () => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorGate, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CreatorCommentsPage, {}, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
  lineNumber: 126,
  columnNumber: 7
}, void 0) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/creator.comments.tsx?tsr-split=component",
  lineNumber: 125,
  columnNumber: 30
}, void 0);
export {
  SplitComponent as component
};
