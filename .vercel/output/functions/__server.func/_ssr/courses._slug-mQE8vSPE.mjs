import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { A as AppShell, a as Avatar, b as AvatarImage, c as AvatarFallback } from "./AppShell-BXcQmjDj.mjs";
import { B as Button, c as cn } from "./button-s-7T9USx.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { P as Progress } from "./progress-BdEZ1sO8.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CCbL2pbx.mjs";
import { T as Textarea } from "./textarea-7FPcqnpF.mjs";
import { I as Input$1 } from "./input-BHvIASyb.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CxVLEfDB.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CV-3vits.mjs";
import { e as Route$5, u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { e as enrollFree, m as markCourseStarted, r as recomputeProgress, a as CelebrationOverlay } from "./CelebrationOverlay-Dehe7viu.mjs";
import { h as hasCourseToolAccess, c as choosePlayableResumeLessonId, a as chooseResumeLessonId, b as buildCourseVideoEmbedUrl } from "./course-player-MW9-dEKE.mjs";
import "../_libs/seroval.mjs";
import { L as LoaderCircle, av as ArrowLeft, r as Clock, F as CirclePlay, N as ShoppingCart, aF as NotebookPen, b as CircleCheck, a$ as Lock, C as Circle, as as TriangleAlert, a9 as RefreshCcw, k as Sparkles, y as Send, aH as CodeXml, I as Heart, M as MessageSquare, ah as Trash2, O as FileCheckCorner, aq as Upload, T as Trophy, J as Award, ai as ExternalLink, aj as Paperclip, $ as X, c as Check } from "../_libs/lucide-react.mjs";
import { M as Markdown$1 } from "../_libs/react-markdown.mjs";
import { r as remarkGfm } from "../_libs/remark-gfm.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
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
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/devlop.mjs";
import "../_libs/unified.mjs";
import "../_libs/bail.mjs";
import "../_libs/extend.mjs";
import "../_libs/is-plain-obj.mjs";
import "../_libs/trough.mjs";
import "../_libs/vfile.mjs";
import "../_libs/vfile-message.mjs";
import "../_libs/unist-util-stringify-position.mjs";
import "node:process";
import "node:path";
import "node:url";
import "../_libs/remark-parse.mjs";
import "../_libs/mdast-util-from-markdown.mjs";
import "../_libs/micromark-util-decode-numeric-character-reference+[...].mjs";
import "../_libs/micromark-util-decode-string.mjs";
import "../_libs/decode-named-character-reference+[...].mjs";
import "../_libs/character-entities.mjs";
import "../_libs/micromark-util-normalize-identifier+[...].mjs";
import "../_libs/micromark.mjs";
import "../_libs/micromark-util-combine-extensions+[...].mjs";
import "../_libs/micromark-util-chunked.mjs";
import "../_libs/micromark-factory-space.mjs";
import "../_libs/micromark-util-character.mjs";
import "../_libs/micromark-core-commonmark.mjs";
import "../_libs/micromark-util-classify-character+[...].mjs";
import "../_libs/micromark-util-resolve-all.mjs";
import "../_libs/micromark-util-subtokenize.mjs";
import "../_libs/micromark-factory-destination.mjs";
import "../_libs/micromark-factory-label.mjs";
import "../_libs/micromark-factory-title.mjs";
import "../_libs/micromark-factory-whitespace.mjs";
import "../_libs/micromark-util-html-tag-name.mjs";
import "../_libs/mdast-util-to-string.mjs";
import "../_libs/remark-rehype.mjs";
import "../_libs/mdast-util-to-hast.mjs";
import "../_libs/ungap__structured-clone.mjs";
import "../_libs/micromark-util-sanitize-uri.mjs";
import "../_libs/unist-util-position.mjs";
import "../_libs/trim-lines.mjs";
import "../_libs/unist-util-visit.mjs";
import "../_libs/unist-util-visit-parents.mjs";
import "../_libs/unist-util-is.mjs";
import "../_libs/hast-util-to-jsx-runtime.mjs";
import "../_libs/comma-separated-tokens.mjs";
import "../_libs/property-information.mjs";
import "../_libs/space-separated-tokens.mjs";
import "../_libs/style-to-js.mjs";
import "../_libs/style-to-object.mjs";
import "../_libs/inline-style-parser.mjs";
import "../_libs/hast-util-whitespace.mjs";
import "../_libs/estree-util-is-identifier-name.mjs";
import "../_libs/html-url-attributes.mjs";
import "../_libs/micromark-extension-gfm.mjs";
import "../_libs/micromark-extension-gfm-autolink-literal+[...].mjs";
import "../_libs/micromark-extension-gfm-footnote+[...].mjs";
import "../_libs/micromark-extension-gfm-strikethrough+[...].mjs";
import "../_libs/micromark-extension-gfm-table.mjs";
import "../_libs/micromark-extension-gfm-task-list-item+[...].mjs";
import "../_libs/mdast-util-gfm.mjs";
import "../_libs/mdast-util-gfm-autolink-literal+[...].mjs";
import "../_libs/ccount.mjs";
import "../_libs/mdast-util-find-and-replace.mjs";
import "../_libs/escape-string-regexp.mjs";
import "../_libs/mdast-util-gfm-footnote.mjs";
import "../_libs/mdast-util-gfm-strikethrough.mjs";
import "../_libs/mdast-util-gfm-table.mjs";
import "../_libs/markdown-table.mjs";
import "../_libs/mdast-util-to-markdown.mjs";
import "../_libs/longest-streak.mjs";
import "../_libs/mdast-util-phrasing.mjs";
import "../_libs/mdast-util-gfm-task-list-item.mjs";
const Input = objectType({
  action: enumType(["summary", "exercise", "doubt"]),
  courseId: stringType().uuid(),
  lessonId: stringType().uuid(),
  courseTitle: stringType().min(1).max(300),
  lessonTitle: stringType().min(1).max(300),
  lessonDescription: stringType().max(4e3).optional(),
  question: stringType().max(4e3).optional()
});
const lessonAiHelper = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => Input.parse(d)).handler(createSsrRpc("bc9f1bbb4d7a46ef2c51ed471408f0417d9d858da2193d33c0ff9f36cfe7653e"));
function formatRelative(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1e3;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
function LessonSocial({ lessonId }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [body, setBody] = reactExports.useState("");
  const [posting, setPosting] = reactExports.useState(false);
  const likesKey = ["lesson-likes", lessonId, user?.id];
  const likesQuery = useQuery({
    queryKey: likesKey,
    queryFn: async () => {
      const [{ count }, mine] = await Promise.all([
        supabase.from("lesson_likes").select("*", { count: "exact", head: true }).eq("lesson_id", lessonId),
        user ? supabase.from("lesson_likes").select("id").eq("lesson_id", lessonId).eq("user_id", user.id).maybeSingle() : Promise.resolve({ data: null })
      ]);
      return { count: count ?? 0, liked: !!mine.data };
    }
  });
  const commentsQuery = useQuery({
    queryKey: ["lesson-comments", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase.from("lesson_comments").select("id, user_id, body, created_at").eq("lesson_id", lessonId).order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      const userIds = Array.from(new Set((data ?? []).map((c) => c.user_id)));
      let profilesById = {};
      if (userIds.length) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name, avatar_url").in("id", userIds);
        (profs ?? []).forEach((p) => {
          profilesById[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
        });
      }
      return (data ?? []).map((c) => ({ ...c, profile: profilesById[c.user_id] }));
    }
  });
  const toggleLike = async () => {
    if (!user) return toast.error("Sign in to like");
    if (likesQuery.data?.liked) {
      await supabase.from("lesson_likes").delete().eq("lesson_id", lessonId).eq("user_id", user.id);
    } else {
      await supabase.from("lesson_likes").insert({ lesson_id: lessonId, user_id: user.id });
    }
    qc.invalidateQueries({ queryKey: likesKey });
  };
  const postComment = async () => {
    if (!user) return toast.error("Sign in to comment");
    const text = body.trim();
    if (!text) return;
    setPosting(true);
    const { error } = await supabase.from("lesson_comments").insert({ lesson_id: lessonId, user_id: user.id, body: text });
    setPosting(false);
    if (error) return toast.error(error.message);
    setBody("");
    qc.invalidateQueries({ queryKey: ["lesson-comments", lessonId] });
  };
  const deleteComment = async (id) => {
    const { error } = await supabase.from("lesson_comments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["lesson-comments", lessonId] });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border-t pt-4 mt-2 space-y-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Button,
        {
          size: "sm",
          variant: likesQuery.data?.liked ? "default" : "outline",
          onClick: toggleLike,
          "aria-pressed": !!likesQuery.data?.liked,
          "aria-label": likesQuery.data?.liked ? "Unlike lesson" : "Like lesson",
          className: "rounded-full",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Heart, { className: cn("h-4 w-4", likesQuery.data?.liked && "fill-current") }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
              lineNumber: 115,
              columnNumber: 11
            }, this),
            likesQuery.data?.count ?? 0
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
          lineNumber: 107,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageSquare, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
          lineNumber: 119,
          columnNumber: 11
        }, this),
        " ",
        commentsQuery.data?.length ?? 0,
        " comments"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
        lineNumber: 118,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this),
    user && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Textarea,
        {
          value: body,
          onChange: (e) => setBody(e.target.value),
          placeholder: "Add a public comment…",
          rows: 2,
          maxLength: 4e3,
          className: "flex-1 resize-none",
          "aria-label": "Write a comment"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
          lineNumber: 125,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Button,
        {
          onClick: postComment,
          disabled: posting || !body.trim(),
          size: "sm",
          className: "self-end",
          children: posting ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
            lineNumber: 140,
            columnNumber: 24
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
            lineNumber: 140,
            columnNumber: 71
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
          lineNumber: 134,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
      lineNumber: 124,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-3", children: [
      (commentsQuery.data ?? []).map((c) => {
        const name = c.profile?.full_name ?? "User";
        const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: "h-8 w-8", children: [
            c.profile?.avatar_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarImage, { src: c.profile.avatar_url, alt: "" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
              lineNumber: 157,
              columnNumber: 43
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { className: "text-xs", children: initials }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
              lineNumber: 158,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
            lineNumber: 156,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-sm font-medium truncate", children: name }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
                lineNumber: 162,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[11px] text-muted-foreground", children: formatRelative(c.created_at) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
                lineNumber: 163,
                columnNumber: 19
              }, this),
              user?.id === c.user_id && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => deleteComment(c.id),
                  className: "ml-auto text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1",
                  "aria-label": "Delete comment",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-3.5 w-3.5" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
                    lineNumber: 172,
                    columnNumber: 23
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
                  lineNumber: 167,
                  columnNumber: 21
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
              lineNumber: 161,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm whitespace-pre-wrap break-words", children: c.body }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
              lineNumber: 176,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
            lineNumber: 160,
            columnNumber: 15
          }, this)
        ] }, c.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
          lineNumber: 155,
          columnNumber: 13
        }, this);
      }),
      commentsQuery.data && commentsQuery.data.length === 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "text-xs text-muted-foreground", children: "Be the first to comment." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
        lineNumber: 182,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
      lineNumber: 145,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/LessonSocial.tsx",
    lineNumber: 105,
    columnNumber: 5
  }, this);
}
const inr = (n) => n === 0 ? "Free" : new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
function formatDuration(minutes) {
  if (!minutes) return "0m";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursStr = hours > 0 ? `${hours}h` : "";
  const minutesStr = remainingMinutes > 0 ? `${remainingMinutes}m` : "";
  const durationStr = [hoursStr, minutesStr].filter(Boolean).join(" ");
  const daysLoad = Math.max(1, Math.ceil(minutes / 45));
  return `${durationStr} (${daysLoad} ${daysLoad === 1 ? "day" : "days"} load)`;
}
function CourseDetail() {
  const {
    slug
  } = Route$5.useParams();
  const {
    tab: initialTab
  } = Route$5.useSearch();
  const {
    user,
    isAdmin
  } = useAuth();
  const qc = useQueryClient();
  const [activeLessonId, setActiveLessonId] = reactExports.useState(null);
  const [speed, setSpeed] = reactExports.useState(1);
  const [enrollCelebration, setEnrollCelebration] = reactExports.useState(false);
  const [playerRetry, setPlayerRetry] = reactExports.useState(0);
  const [playerLoadFailed, setPlayerLoadFailed] = reactExports.useState(false);
  const courseQuery = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const {
        data: course2,
        error
      } = await supabase.from("courses").select("*").eq("slug", slug).single();
      if (error) throw error;
      const {
        data: lessons2,
        error: lErr
      } = await supabase.from("lessons").select("*").eq("course_id", course2.id).order("order_index", {
        ascending: true
      });
      if (lErr) throw lErr;
      let instructorProfile2 = null;
      if (course2.created_by) {
        const {
          data: profile
        } = await supabase.from("profiles").select("*").eq("id", course2.created_by).maybeSingle();
        instructorProfile2 = profile;
      }
      return {
        course: course2,
        lessons: lessons2 ?? [],
        instructorProfile: instructorProfile2
      };
    }
  });
  const progressQuery = useQuery({
    enabled: !!user && !!courseQuery.data?.course.id,
    queryKey: ["progress", courseQuery.data?.course.id, user?.id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("lesson_progress").select("lesson_id, completed, watched_seconds, updated_at").eq("course_id", courseQuery.data.course.id).eq("user_id", user.id);
      if (error) throw error;
      return data ?? [];
    }
  });
  const enrollmentQuery = useQuery({
    enabled: !!user && !!courseQuery.data?.course.id,
    queryKey: ["enrollment", courseQuery.data?.course.id, user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("enrollments").select("*").eq("user_id", user.id).eq("course_id", courseQuery.data.course.id).maybeSingle();
      return data;
    }
  });
  const cartQuery = useQuery({
    enabled: !!user && !!courseQuery.data?.course.id,
    queryKey: ["cart-item", courseQuery.data?.course.id, user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("cart_items").select("id").eq("user_id", user.id).eq("course_id", courseQuery.data.course.id).maybeSingle();
      return data;
    }
  });
  const enrollFreeFn = useServerFn(enrollFree);
  const markStarted = useServerFn(markCourseStarted);
  const recompute = useServerFn(recomputeProgress);
  const navigate = useNavigate();
  const isEnrolled = !!enrollmentQuery.data;
  const inCart = !!cartQuery.data;
  const isFree = courseQuery.data ? Number(courseQuery.data.course.price_inr) === 0 : false;
  const progressRows = progressQuery.data ?? [];
  const completed = reactExports.useMemo(() => new Set(progressRows.filter((d) => d.completed).map((d) => d.lesson_id)), [progressRows]);
  const lessons = courseQuery.data?.lessons ?? [];
  const course = courseQuery.data?.course;
  const instructorProfile = courseQuery.data?.instructorProfile;
  const hasFullToolAccess = hasCourseToolAccess({
    isAdmin,
    isEnrolled,
    enrollmentStatus: enrollmentQuery.data?.status,
    progressPct: enrollmentQuery.data?.progress_pct,
    hasSavedProgress: progressRows.length > 0
  });
  const unlocked = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (let i = 0; i < lessons.length; i++) {
      const l = lessons[i];
      if (hasFullToolAccess) set.add(l.id);
      else if (i === 0 || l.is_preview) set.add(l.id);
      else if (completed.has(lessons[i - 1].id)) set.add(l.id);
    }
    return set;
  }, [lessons, completed, hasFullToolAccess]);
  reactExports.useEffect(() => {
    if (!lessons.length || activeLessonId) return;
    const nextId = choosePlayableResumeLessonId(lessons, progressRows, unlocked) ?? chooseResumeLessonId(lessons, progressRows, unlocked);
    if (nextId) setActiveLessonId(nextId);
  }, [lessons, unlocked, completed, progressRows, activeLessonId]);
  const active = lessons.find((l) => l.id === activeLessonId);
  const activeProgress = active ? progressRows.find((p) => p.lesson_id === active.id) : void 0;
  const activeVideo = active ? buildCourseVideoEmbedUrl(active.video_url, activeProgress?.watched_seconds ?? 0, typeof window !== "undefined" ? window.location.origin : void 0) : null;
  const pct = lessons.length ? Math.round(completed.size / lessons.length * 100) : 0;
  reactExports.useEffect(() => {
    setPlayerLoadFailed(false);
  }, [active?.id, activeVideo?.ok, activeVideo?.ok ? activeVideo.src : null, playerRetry]);
  reactExports.useEffect(() => {
    if (!active?.id) return;
    const key = `lv:${active.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
    }
    supabase.from("lesson_views").insert({
      lesson_id: active.id,
      user_id: user?.id ?? null
    }).then(() => {
    });
  }, [active?.id, user?.id]);
  reactExports.useEffect(() => {
    if (!user || !course || !active?.id || !isEnrolled) return;
    const key = `started:${course.id}:${active.id}`;
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      markStarted({
        data: {
          courseId: course.id,
          lessonId: active.id
        }
      }).then(() => {
        qc.invalidateQueries({
          queryKey: ["progress", course.id, user.id]
        });
        qc.invalidateQueries({
          queryKey: ["enrollments", user.id]
        });
      }).catch(() => {
      });
    }
    const base = progressRows.find((p) => p.lesson_id === active.id)?.watched_seconds ?? 0;
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const watched = Math.max(base + Math.floor((Date.now() - startedAt) / 1e3), 1);
      supabase.from("lesson_progress").upsert({
        user_id: user.id,
        course_id: course.id,
        lesson_id: active.id,
        watched_seconds: watched
      }, {
        onConflict: "user_id,lesson_id"
      }).then(() => {
      });
    }, 15e3);
    return () => window.clearInterval(interval);
  }, [active?.id, course?.id, isEnrolled, markStarted, progressRows, qc, user?.id]);
  const addToCart = async () => {
    if (!user || !course) return;
    const {
      error
    } = await supabase.from("cart_items").insert({
      user_id: user.id,
      course_id: course.id
    });
    if (error) return toast.error(error.message);
    toast.success("Added to cart");
    qc.invalidateQueries({
      queryKey: ["cart-item", course.id, user.id]
    });
    qc.invalidateQueries({
      queryKey: ["cart-count"]
    });
  };
  const startFree = async () => {
    if (!course) return;
    try {
      await enrollFreeFn({
        data: {
          courseId: course.id
        }
      });
      toast.success("Enrolled — let's start learning!");
      const firstPlayable = choosePlayableResumeLessonId(lessons, [], new Set(lessons.map((lesson) => lesson.id))) ?? lessons[0]?.id;
      if (firstPlayable) setActiveLessonId(firstPlayable);
      setEnrollCelebration(true);
      qc.invalidateQueries({
        queryKey: ["enrollment", course.id, user?.id]
      });
      qc.invalidateQueries({
        queryKey: ["enrollments"]
      });
      if (firstPlayable) markStarted({
        data: {
          courseId: course.id,
          lessonId: firstPlayable
        }
      }).catch(() => {
      });
    } catch (e) {
      toast.error(e?.message ?? "Could not enroll");
    }
  };
  const toggleComplete = async (lessonId) => {
    if (!user || !course) return;
    if (!isEnrolled) return toast.error("Enroll first to track progress");
    const isDone = completed.has(lessonId);
    const {
      error
    } = await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      course_id: course.id,
      lesson_id: lessonId,
      completed: !isDone
    }, {
      onConflict: "user_id,lesson_id"
    });
    if (error) return toast.error(error.message);
    toast.success(!isDone ? "Lesson completed 🎉" : "Marked as not done");
    qc.invalidateQueries({
      queryKey: ["progress", course.id, user.id]
    });
    recompute({
      data: {
        courseId: course.id
      }
    }).then(() => {
      qc.invalidateQueries({
        queryKey: ["enrollment", course.id, user.id]
      });
      qc.invalidateQueries({
        queryKey: ["enrollments", user.id]
      });
    }).catch(() => {
    });
  };
  if (courseQuery.isLoading) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 298,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 297,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 296,
      columnNumber: 12
    }, this);
  }
  if (courseQuery.error || !course) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 text-center", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: "Course not found." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 305,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses", className: "text-primary text-sm underline mt-2 inline-block", children: "Back to courses" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 306,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 304,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 303,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CelebrationOverlay, { show: enrollCelebration, title: "You’re enrolled!", message: lessons.length ? "Your first lesson is ready." : "This course is now in your dashboard.", withSound: true, durationMs: 1400, onDone: () => setEnrollCelebration(false) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 313,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 sm:px-6 lg:px-10 py-6 max-w-7xl", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/courses", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 316,
          columnNumber: 11
        }, this),
        " Back to courses"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 315,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", children: course.category }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 320,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", children: course.level }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 321,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 323,
            columnNumber: 13
          }, this),
          " ",
          formatDuration(course.duration_minutes)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 322,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs font-semibold ml-auto", children: inr(Number(course.price_inr)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 325,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 319,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-2 text-2xl sm:text-3xl font-display font-semibold tracking-tight", children: course.title }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 328,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground mt-1 text-sm max-w-3xl", children: course.description }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 331,
        columnNumber: 9
      }, this),
      course.cover_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 overflow-hidden rounded-2xl border bg-muted max-w-4xl aspect-video", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: course.cover_url, alt: `${course.title} cover`, className: "h-full w-full object-cover", loading: "lazy" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 333,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 332,
        columnNumber: 30
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-2", children: [
        "By",
        " ",
        course.created_by ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/creators/$id", params: {
          id: course.created_by
        }, className: "text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded", children: course.instructor }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 337,
          columnNumber: 32
        }, this) : course.instructor
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 335,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 flex flex-wrap items-center gap-2", children: [
        isEnrolled ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { className: "bg-emerald-500 hover:bg-emerald-500 text-white", children: "Enrolled · Continue learning" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 346,
          columnNumber: 25
        }, this) : isFree ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: startFree, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CirclePlay, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 349,
            columnNumber: 15
          }, this),
          " Start free course"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 348,
          columnNumber: 33
        }, this) : inCart ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: () => navigate({
          to: "/cart"
        }), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShoppingCart, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 353,
            columnNumber: 15
          }, this),
          " View cart"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 350,
          columnNumber: 34
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: addToCart, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShoppingCart, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 355,
            columnNumber: 15
          }, this),
          " Add to cart · ",
          inr(Number(course.price_inr))
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 354,
          columnNumber: 25
        }, this),
        !isEnrolled && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: "Preview lessons are free. Enroll to unlock the full course, tests, and certificate." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 357,
          columnNumber: 27
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 345,
        columnNumber: 9
      }, this),
      isEnrolled && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between text-xs text-muted-foreground mb-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Your progress" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 364,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
            completed.size,
            " / ",
            lessons.length,
            " lessons · ",
            pct,
            "%"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 365,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 363,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Progress, { value: pct, className: "h-2" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 369,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 362,
        columnNumber: 24
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4 min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-video rounded-2xl border bg-black overflow-hidden", children: activeVideo?.ok && !playerLoadFailed ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("iframe", { id: "learnify-player", src: activeVideo.src, title: active?.title ?? course.title, className: "w-full h-full", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true, onLoad: () => {
            setPlayerLoadFailed(false);
            if (activeVideo.isYoutube) toast.message("Video loaded. If it stays paused, press play — your browser may block autoplay.");
          }, onError: () => setPlayerLoadFailed(true) }, `${active?.id}-${playerRetry}`, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 376,
            columnNumber: 55
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full h-full grid place-items-center text-muted-foreground text-sm text-center px-6", children: playerLoadFailed ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(VideoFallback, { message: "The video player could not load this lesson. Check the URL, your connection, or retry the embed.", canRetry: true, onRetry: () => {
            setPlayerLoadFailed(false);
            setPlayerRetry((n) => n + 1);
          } }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 380,
            columnNumber: 39
          }, this) : activeVideo && !activeVideo.ok ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(VideoFallback, { message: activeVideo.message, canRetry: activeVideo.reason !== "missing-url", onRetry: () => setPlayerRetry((n) => n + 1) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 383,
            columnNumber: 56
          }, this) : lessons.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: "No lessons added yet for this course." }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 384,
              columnNumber: 23
            }, this),
            isAdmin && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "sm", variant: "secondary", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/studio", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NotebookPen, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 387,
                columnNumber: 29
              }, this),
              " Open Course Builder"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 386,
              columnNumber: 27
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 385,
              columnNumber: 35
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 383,
            columnNumber: 220
          }, this) : "Select a lesson from the list to begin." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 379,
            columnNumber: 63
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 375,
            columnNumber: 13
          }, this),
          active && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-5 shadow-card space-y-4", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: active.title }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 397,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  active.duration_minutes,
                  " min",
                  active.is_preview ? " · Free preview" : ""
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 398,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 396,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Select, { value: String(speed), onValueChange: (v) => {
                  const n = Number(v);
                  setSpeed(n);
                  setYouTubeSpeed(n);
                }, children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectTrigger, { className: "h-8 w-[88px] text-xs", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectValue, { placeholder: "Speed" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 409,
                    columnNumber: 25
                  }, this) }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 408,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectContent, { children: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectItem, { value: String(s), children: [
                    s,
                    "x"
                  ] }, s, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 412,
                    columnNumber: 70
                  }, this)) }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 411,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 403,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: () => toggleComplete(active.id), variant: completed.has(active.id) ? "secondary" : "default", size: "sm", children: completed.has(active.id) ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-4 w-4" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 419,
                    columnNumber: 27
                  }, this),
                  " Completed"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 418,
                  columnNumber: 51
                }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CirclePlay, { className: "h-4 w-4" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 421,
                    columnNumber: 27
                  }, this),
                  " Mark complete"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 420,
                  columnNumber: 31
                }, this) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 417,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 402,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 395,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: "Captions & quality are available in the player's built-in controls (⚙ icon)." }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 426,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LessonAiTabs, { courseId: course.id, courseTitle: course.title, lesson: active, initialTab, hasToolAccess: hasFullToolAccess }, active.id, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 430,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LessonSocial, { lessonId: active.id }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 432,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 394,
            columnNumber: 24
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 374,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-5 shadow-card space-y-4", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm", children: "Course Details" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 440,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg bg-muted/40 p-2.5", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground block mb-0.5", children: "Duration" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 443,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 445,
                    columnNumber: 21
                  }, this),
                  formatDuration(course.duration_minutes)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 444,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 442,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg bg-muted/40 p-2.5", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground block mb-0.5", children: "Level" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 450,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium capitalize", children: course.level }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 451,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 449,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg bg-muted/40 p-2.5", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground block mb-0.5", children: "Category" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 454,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium capitalize", children: course.category }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 455,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 453,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg bg-muted/40 p-2.5", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground block mb-0.5", children: "Lessons" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 458,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium", children: [
                  lessons.length,
                  " lessons"
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 459,
                  columnNumber: 19
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 457,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 441,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 439,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card shadow-card overflow-hidden", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 py-3 border-b", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm", children: "Course content" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 467,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: [
                lessons.length,
                " lessons"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 468,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 466,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y max-h-[60vh] overflow-y-auto", children: lessons.map((l, i) => {
              const isUnlocked = unlocked.has(l.id);
              const isDone = completed.has(l.id);
              const isActive = activeLessonId === l.id;
              return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => isUnlocked && setActiveLessonId(l.id), disabled: !isUnlocked, className: cn("w-full text-left px-4 py-3 flex items-center gap-3 transition", isActive && "bg-primary/5", isUnlocked ? "hover:bg-accent cursor-pointer" : "opacity-50 cursor-not-allowed"), children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "shrink-0", children: !isUnlocked ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Lock, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 478,
                  columnNumber: 42
                }, this) : isDone ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-4 w-4 text-emerald-500" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 478,
                  columnNumber: 104
                }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Circle, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 478,
                  columnNumber: 160
                }, this) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 477,
                  columnNumber: 25
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: cn("text-sm truncate", isActive && "font-semibold text-primary"), children: [
                    i + 1,
                    ". ",
                    l.title
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 481,
                    columnNumber: 27
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { className: "h-3 w-3" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                      lineNumber: 485,
                      columnNumber: 29
                    }, this),
                    " ",
                    l.duration_minutes,
                    " min",
                    l.is_preview && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[9px] py-0", children: "Preview" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                      lineNumber: 486,
                      columnNumber: 46
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                    lineNumber: 484,
                    columnNumber: 27
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 480,
                  columnNumber: 25
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 476,
                columnNumber: 23
              }, this) }, l.id, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 475,
                columnNumber: 24
              }, this);
            }) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 470,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 465,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-5 shadow-card space-y-4", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm", children: "Your Instructor" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 499,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
              instructorProfile?.avatar_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: instructorProfile.avatar_url, alt: instructorProfile.full_name || course.instructor, className: "h-12 w-12 rounded-full object-cover border-2 border-primary/20" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 501,
                columnNumber: 50
              }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-lg border-2 border-primary/20 shrink-0", children: (instructorProfile?.full_name || course.instructor).charAt(0).toUpperCase() }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 501,
                columnNumber: 225
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-display font-semibold text-sm truncate", children: instructorProfile?.full_name || course.instructor }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 505,
                  columnNumber: 19
                }, this),
                instructorProfile?.email && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground truncate", children: instructorProfile.email }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                  lineNumber: 508,
                  columnNumber: 48
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 504,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 500,
              columnNumber: 15
            }, this),
            instructorProfile?.bio ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground leading-relaxed", children: instructorProfile.bio }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 513,
              columnNumber: 41
            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground italic", children: "Expert instructor delivering high-quality learning experiences." }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 515,
              columnNumber: 24
            }, this),
            instructorProfile?.social_links && typeof instructorProfile.social_links === "object" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-2 pt-2 border-t text-xs", children: Object.entries(instructorProfile.social_links).map(([platform, url]) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: url, target: "_blank", rel: "noreferrer", className: "text-primary hover:underline capitalize", children: platform }, platform, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 519,
              columnNumber: 118
            }, this)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 518,
              columnNumber: 105
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 498,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 437,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 372,
        columnNumber: 9
      }, this),
      course && user && isEnrolled && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AssignmentsPanel, { courseId: course.id, userId: user.id }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 527,
        columnNumber: 42
      }, this),
      course && user && isEnrolled && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FinalTestSection, { courseId: course.id, userId: user.id, allComplete: lessons.length > 0 && completed.size >= lessons.length }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 529,
        columnNumber: 42
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 314,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 312,
    columnNumber: 10
  }, this);
}
function VideoFallback({
  message,
  canRetry,
  onRetry
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-sm space-y-3", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TriangleAlert, { className: "h-8 w-8 text-primary mx-auto" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 546,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-medium text-foreground", children: "Video can’t load" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 547,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { children: message }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 548,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs", children: "If the video is quota-limited or restricted by YouTube, ask an admin or creator to refresh the lesson video status." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 549,
      columnNumber: 7
    }, this),
    canRetry && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "secondary", onClick: onRetry, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefreshCcw, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 554,
        columnNumber: 11
      }, this),
      " Retry player"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 553,
      columnNumber: 20
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 545,
    columnNumber: 10
  }, this);
}
function setYouTubeSpeed(rate) {
  const iframe = document.getElementById("learnify-player");
  if (!iframe?.contentWindow) return;
  iframe.contentWindow.postMessage(JSON.stringify({
    event: "command",
    func: "setPlaybackRate",
    args: [rate]
  }), "*");
}
function LessonAiTabs({
  courseId,
  courseTitle,
  lesson,
  initialTab,
  hasToolAccess
}) {
  const helper = useServerFn(lessonAiHelper);
  const [summary, setSummary] = reactExports.useState("");
  const [exercise, setExercise] = reactExports.useState("");
  const [doubt, setDoubt] = reactExports.useState("");
  const [doubtQ, setDoubtQ] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState("");
  const run = async (action) => {
    setBusy(action);
    try {
      const res = await helper({
        data: {
          action,
          courseId,
          lessonId: lesson.id,
          courseTitle,
          lessonTitle: lesson.title,
          lessonDescription: lesson.description ?? "",
          question: action === "doubt" ? doubtQ : void 0
        }
      });
      if (action === "summary") setSummary(res.content);
      if (action === "exercise") setExercise(res.content);
      if (action === "doubt") setDoubt(res.content);
    } catch (e) {
      toast.error(e?.message ?? "AI request failed");
    } finally {
      setBusy("");
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tabs, { defaultValue: hasToolAccess ? initialTab ?? "notes" : "notes", className: "mt-2", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsList, { className: "w-full overflow-x-auto flex justify-start", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "notes", className: "gap-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NotebookPen, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 620,
          columnNumber: 11
        }, this),
        " Notes"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 619,
        columnNumber: 9
      }, this),
      hasToolAccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "summary", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 624,
            columnNumber: 15
          }, this),
          " Summary"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 623,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "doubt", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 627,
            columnNumber: 15
          }, this),
          " Ask AI"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 626,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "exercise", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CirclePlay, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 630,
            columnNumber: 15
          }, this),
          " Exercise"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 629,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsTrigger, { value: "playground", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CodeXml, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 633,
            columnNumber: 15
          }, this),
          " Playground"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 632,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 622,
        columnNumber: 27
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 618,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "notes", className: "pt-4", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground whitespace-pre-wrap", children: lesson.description || "No instructor notes for this lesson." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 639,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 638,
      columnNumber: 7
    }, this),
    !hasToolAccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LockedCourseTools, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 644,
      columnNumber: 26
    }, this),
    hasToolAccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "summary", className: "pt-4 space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => run("summary"), disabled: busy === "summary", children: [
          busy === "summary" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 649,
            columnNumber: 37
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 649,
            columnNumber: 84
          }, this),
          "Generate summary"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 648,
          columnNumber: 13
        }, this),
        summary && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", onClick: () => run("summary"), disabled: busy === "summary", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefreshCcw, { className: "h-3.5 w-3.5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 653,
            columnNumber: 17
          }, this),
          " Regenerate"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 652,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 647,
        columnNumber: 11
      }, this),
      summary && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Markdown, { children: summary }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 656,
        columnNumber: 23
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 646,
      columnNumber: 25
    }, this),
    hasToolAccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "doubt", className: "pt-4 space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { placeholder: "Ask anything about this lesson — concepts, code, errors, real-world use…", value: doubtQ, onChange: (e) => setDoubtQ(e.target.value), rows: 3 }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 660,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => run("doubt"), disabled: busy === "doubt" || !doubtQ.trim(), children: [
        busy === "doubt" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 662,
          columnNumber: 33
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 662,
          columnNumber: 80
        }, this),
        "Get answer"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 661,
        columnNumber: 11
      }, this),
      doubt && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Markdown, { children: doubt }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 665,
        columnNumber: 21
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 659,
      columnNumber: 25
    }, this),
    hasToolAccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "exercise", className: "pt-4 space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => run("exercise"), disabled: busy === "exercise", children: [
        busy === "exercise" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 670,
          columnNumber: 36
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CirclePlay, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 670,
          columnNumber: 83
        }, this),
        "Generate practical exercise"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 669,
        columnNumber: 11
      }, this),
      exercise && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Markdown, { children: exercise }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 673,
        columnNumber: 24
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 668,
      columnNumber: 25
    }, this),
    hasToolAccess && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TabsContent, { value: "playground", className: "pt-4", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CodePlayground, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 677,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 676,
      columnNumber: 25
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 617,
    columnNumber: 10
  }, this);
}
function LockedCourseTools() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 rounded-lg border border-dashed bg-muted/30 p-4 text-sm text-muted-foreground", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Lock, { className: "h-4 w-4 mt-0.5 text-primary" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 684,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-medium text-foreground", children: "Course tools unlock after access is active." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 686,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-1", children: "Enroll or purchase the course to use Playground, AI hints, suggestions, solving help, and lesson summaries." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 687,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 685,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 683,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 682,
    columnNumber: 10
  }, this);
}
function Markdown({
  children
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:text-foreground prose-code:before:hidden prose-code:after:hidden", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Markdown$1, { remarkPlugins: [remarkGfm], children }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 701,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 700,
    columnNumber: 10
  }, this);
}
const DEFAULT_HTML = `<!doctype html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <h1>Hello, Learnify!</h1>
    <p id="msg">Edit me — preview updates live.</p>
    <button onclick="document.getElementById('msg').innerText = 'Clicked at ' + new Date().toLocaleTimeString()">
      Click me
    </button>
  </body>
</html>`;
const DEFAULT_CSS = `body { font-family: ui-sans-serif, system-ui; padding: 24px; color: #111; }
h1 { color: #4f46e5; }
button { padding: 8px 14px; border-radius: 8px; border: 1px solid #ddd; cursor: pointer; }`;
const DEFAULT_JS = `console.log("Playground ready");`;
function CodePlayground() {
  const [html, setHtml] = reactExports.useState(DEFAULT_HTML);
  const [css, setCss] = reactExports.useState(DEFAULT_CSS);
  const [js, setJs] = reactExports.useState(DEFAULT_JS);
  const [tab, setTab] = reactExports.useState("html");
  const [doc, setDoc] = reactExports.useState("");
  reactExports.useEffect(() => {
    const id = setTimeout(() => {
      setDoc(`${html}<style>${css}</style><script>${js}<\/script>`);
    }, 350);
    return () => clearTimeout(id);
  }, [html, css, js]);
  const value = tab === "html" ? html : tab === "css" ? css : js;
  const setValue = tab === "html" ? setHtml : tab === "css" ? setCss : setJs;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border bg-card overflow-hidden flex flex-col", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex border-b bg-muted/40 text-xs", children: ["html", "css", "js"].map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setTab(t), className: cn("px-3 py-2 font-mono uppercase tracking-wide", tab === t ? "bg-background text-primary font-semibold" : "text-muted-foreground hover:text-foreground"), children: t }, t, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 739,
        columnNumber: 54
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 738,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { value, onChange: (e) => setValue(e.target.value), className: "font-mono text-xs min-h-[260px] rounded-none border-0 resize-none focus-visible:ring-0", spellCheck: false }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 743,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 737,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border bg-white overflow-hidden min-h-[260px]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("iframe", { title: "Live preview", sandbox: "allow-scripts", srcDoc: doc, className: "w-full h-full min-h-[260px]" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 746,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 745,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 736,
    columnNumber: 10
  }, this);
}
function FinalTestSection({
  courseId,
  userId,
  allComplete
}) {
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [celebratePass, setCelebratePass] = reactExports.useState(false);
  const cert = useQuery({
    queryKey: ["cert", courseId, userId],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("certificates").select("*").eq("course_id", courseId).eq("user_id", userId).maybeSingle();
      return data;
    }
  });
  const mcqs = useQuery({
    queryKey: ["mcq-count", courseId],
    queryFn: async () => {
      const {
        count
      } = await supabase.from("mcq_questions").select("*", {
        count: "exact",
        head: true
      }).eq("course_id", courseId);
      return count ?? 0;
    }
  });
  if (cert.data) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-12 w-12 rounded-xl bg-emerald-500 text-white grid place-items-center shrink-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trophy, { className: "h-6 w-6" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 794,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 793,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-lg", children: "Course completed 🎉" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 797,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: [
          "Score: ",
          cert.data.score,
          "/",
          cert.data.total,
          " · Issued",
          " ",
          new Date(cert.data.issued_at).toLocaleDateString()
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 798,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 796,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/certificates/$code", params: {
        code: cert.data.code
      }, className: "inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 806,
          columnNumber: 11
        }, this),
        " View certificate"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 803,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 792,
      columnNumber: 12
    }, this);
  }
  if (!allComplete) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-6 w-6 mx-auto mb-2 opacity-50" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 812,
        columnNumber: 9
      }, this),
      "Complete all lessons to unlock the final test and claim your certificate."
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 811,
      columnNumber: 12
    }, this);
  }
  if ((mcqs.data ?? 0) === 0) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground", children: "Final test not yet available for this course." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 817,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CelebrationOverlay, { show: celebratePass, title: "Certificate unlocked!", message: "Great work — your course certificate is ready.", withSound: true, durationMs: 1800, onDone: () => setCelebratePass(false) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 822,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-gradient-to-br from-primary/10 to-fuchsia-500/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-12 w-12 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-6 w-6" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 825,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 824,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-lg", children: "Ready for your certificate?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 828,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: [
          "Pass the final test (",
          mcqs.data,
          " questions, ≥70%) to claim your certificate."
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 829,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 827,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "lg", onClick: () => setOpen(true), children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trophy, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 834,
          columnNumber: 11
        }, this),
        " Take final test"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 833,
        columnNumber: 9
      }, this),
      open && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FinalTestDialog, { courseId, userId, onClose: () => setOpen(false), onPassed: () => {
        qc.invalidateQueries({
          queryKey: ["cert", courseId, userId]
        });
        qc.invalidateQueries({
          queryKey: ["my-certs"]
        });
        qc.invalidateQueries({
          queryKey: ["my-attempts"]
        });
        qc.invalidateQueries({
          queryKey: ["enrollments"]
        });
        setOpen(false);
        setCelebratePass(true);
      } }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 837,
        columnNumber: 18
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 823,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 821,
    columnNumber: 10
  }, this);
}
function FinalTestDialog({
  courseId,
  userId,
  onClose,
  onPassed
}) {
  const [picks, setPicks] = reactExports.useState({});
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [localCelebrate, setLocalCelebrate] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const q = useQuery({
    queryKey: ["mcqs", courseId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("mcq_questions").select("id, course_id, question, options, order_index").eq("course_id", courseId).order("order_index");
      if (error) throw error;
      return data ?? [];
    }
  });
  const questions = q.data ?? [];
  const score = result?.score ?? 0;
  const pct = result && result.total ? Math.round(result.score / result.total * 100) : 0;
  const passed = result?.passed ?? false;
  const submit = async () => {
    setSubmitting(true);
    try {
      const {
        data,
        error
      } = await supabase.rpc("submit_final_test", {
        _course_id: courseId,
        _answers: picks
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      const row = Array.isArray(data) ? data[0] : data;
      if (row) {
        setResult({
          score: row.score,
          total: row.total,
          passed: row.passed
        });
        if (row.passed) {
          toast.success("Certificate issued!");
          setLocalCelebrate(true);
        }
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CelebrationOverlay, { show: localCelebrate, title: "You passed!", message: "Your certificate has been issued.", withSound: true, durationMs: 1600, onDone: () => setLocalCelebrate(false) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 925,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-start sm:items-center justify-center p-4 overflow-y-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-card border rounded-2xl shadow-2xl w-full max-w-3xl my-4 sm:my-0 max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-6 border-b flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-xl font-semibold", children: "Final Test" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 930,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: "Pass ≥ 70% to claim your certificate" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 931,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 929,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "ghost", onClick: onClose, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 934,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 933,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 928,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-6 space-y-4", children: q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin mx-auto" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 939,
        columnNumber: 28
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
        submitted && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: cn("rounded-xl p-4 text-center", passed ? "bg-emerald-500/10 border border-emerald-500/40" : "bg-rose-500/10 border border-rose-500/40"), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-2xl font-display font-bold", children: [
            score,
            " / ",
            questions.length,
            " · ",
            pct,
            "%"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 941,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm mt-1", children: passed ? "🎉 You passed!" : "Not yet — review and try again." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 944,
            columnNumber: 21
          }, this),
          passed && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { className: "mt-3", onClick: onPassed, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Award, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 948,
              columnNumber: 25
            }, this),
            " Claim certificate"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 947,
            columnNumber: 32
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 940,
          columnNumber: 31
        }, this),
        questions.map((qq, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg border p-4 space-y-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium", children: [
            i + 1,
            ". ",
            qq.question
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 953,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid gap-1.5", children: qq.options.map((opt, idx) => {
            const picked = picks[i] === idx;
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { disabled: submitted, onClick: () => setPicks((p) => ({
              ...p,
              [i]: idx
            })), className: cn("text-left text-sm rounded-md border px-3 py-2 flex items-center gap-2 transition", !submitted && picked && "border-primary bg-primary/5", submitted && picked && "border-primary/60 bg-primary/10"), children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-muted-foreground w-5", children: [
                String.fromCharCode(65 + idx),
                "."
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 963,
                columnNumber: 29
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex-1", children: opt }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 966,
                columnNumber: 29
              }, this),
              submitted && picked && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-4 w-4 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 967,
                columnNumber: 53
              }, this)
            ] }, idx, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 959,
              columnNumber: 26
            }, this);
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 956,
            columnNumber: 21
          }, this),
          submitted && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground pt-1", children: "Your answer was recorded. The final result is shown above." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 971,
            columnNumber: 35
          }, this)
        ] }, qq.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 952,
          columnNumber: 43
        }, this)),
        !submitted && questions.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: submit, disabled: submitting || Object.keys(picks).length < questions.length, className: "w-full", size: "lg", children: [
          submitting ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 977,
            columnNumber: 35
          }, this) : null,
          "Submit final test"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 976,
          columnNumber: 56
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 939,
        columnNumber: 83
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 938,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 927,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 926,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 924,
    columnNumber: 10
  }, this);
}
function AssignmentsPanel({
  courseId,
  userId
}) {
  const qc = useQueryClient();
  const [openFor, setOpenFor] = reactExports.useState(null);
  const aq = useQuery({
    queryKey: ["course-assignments", courseId],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("course_assignments").select("*").eq("course_id", courseId).order("order_index");
      if (error) throw error;
      return data ?? [];
    }
  });
  const sq = useQuery({
    queryKey: ["my-submissions-for", courseId, userId],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("assignment_submissions").select("*").eq("course_id", courseId).eq("user_id", userId).order("submitted_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const latestByAssignment = /* @__PURE__ */ new Map();
  (sq.data ?? []).forEach((s) => {
    if (!latestByAssignment.has(s.assignment_id)) latestByAssignment.set(s.assignment_id, s);
  });
  if ((aq.data ?? []).length === 0) return null;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card p-5 sm:p-6 shadow-card", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-lg flex items-center gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(FileCheckCorner, { className: "h-5 w-5 text-primary" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1034,
        columnNumber: 9
      }, this),
      " Practice & Projects"
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 1033,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: "Hands-on assignments and projects for this course." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 1036,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 space-y-3", children: (aq.data ?? []).map((a, i) => {
      const sub = latestByAssignment.get(a.id);
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border rounded-lg p-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "font-medium", children: [
              i + 1,
              ". ",
              a.title
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 1045,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1 whitespace-pre-wrap line-clamp-3", children: a.prompt }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 1048,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 1044,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 shrink-0", children: [
            sub && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px] capitalize", children: String(sub.status).replace("_", " ") }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 1053,
              columnNumber: 27
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: sub ? "outline" : "default", onClick: () => setOpenFor(a), children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Upload, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
                lineNumber: 1057,
                columnNumber: 21
              }, this),
              " ",
              sub ? "Resubmit" : "Submit"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 1056,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 1052,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 1043,
          columnNumber: 15
        }, this),
        sub?.feedback && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 rounded bg-muted/50 border p-2 text-xs", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium", children: "Feedback: " }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 1062,
            columnNumber: 19
          }, this),
          sub.feedback
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 1061,
          columnNumber: 33
        }, this)
      ] }, a.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1042,
        columnNumber: 16
      }, this);
    }) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 1039,
      columnNumber: 7
    }, this),
    openFor && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SubmitAssignmentDialog, { assignment: openFor, courseId, userId, onClose: () => setOpenFor(null), onSaved: () => {
      setOpenFor(null);
      qc.invalidateQueries({
        queryKey: ["my-submissions-for", courseId, userId]
      });
      qc.invalidateQueries({
        queryKey: ["my-submissions"]
      });
    } }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 1069,
      columnNumber: 19
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 1032,
    columnNumber: 10
  }, this);
}
function SubmitAssignmentDialog({
  assignment,
  courseId,
  userId,
  onClose,
  onSaved
}) {
  const [content, setContent] = reactExports.useState("");
  const [linkUrl, setLinkUrl] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const submit = async () => {
    if (!content.trim() && !linkUrl.trim() && !file) {
      return toast.error("Add notes, a link, or a file");
    }
    setSaving(true);
    try {
      let attachment_url = null;
      if (file) {
        if (file.size > 20 * 1024 * 1024) throw new Error("File too large (max 20 MB)");
        const path = `${userId}/${courseId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const {
          error: upErr
        } = await supabase.storage.from("submissions").upload(path, file, {
          upsert: false
        });
        if (upErr) throw upErr;
        const {
          data: signed
        } = await supabase.storage.from("submissions").createSignedUrl(path, 60 * 60 * 24 * 365);
        attachment_url = signed?.signedUrl ?? null;
      }
      const {
        error
      } = await supabase.from("assignment_submissions").insert({
        user_id: userId,
        course_id: courseId,
        assignment_id: assignment.id,
        content: content.trim() || null,
        link_url: linkUrl.trim() || null,
        attachment_url,
        status: "submitted"
      });
      if (error) throw error;
      toast.success("Submitted");
      onSaved();
    } catch (e) {
      toast.error(e?.message ?? "Submit failed");
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: [
        "Submit · ",
        assignment.title
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1141,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Notes, a public link, or a file (≤ 20 MB)." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1142,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 1140,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-lg bg-muted/50 border p-3 text-xs whitespace-pre-wrap", children: assignment.prompt }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1145,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Textarea, { rows: 6, value: content, onChange: (e) => setContent(e.target.value), placeholder: "Your notes, summary, or code…" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1148,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ExternalLink, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 1152,
              columnNumber: 17
            }, this),
            " Project link (Replit, GitHub, CodeSandbox)"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 1151,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$1, { value: linkUrl, onChange: (e) => setLinkUrl(e.target.value), placeholder: "https://…" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 1154,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 1150,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Paperclip, { className: "h-3 w-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
              lineNumber: 1158,
              columnNumber: 17
            }, this),
            " Attachment"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 1157,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input$1, { type: "file", onChange: (e) => setFile(e.target.files?.[0] ?? null) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
            lineNumber: 1160,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 1156,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1149,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 1144,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: onClose, children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1165,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: submit, disabled: saving, children: [
        saving ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 1169,
          columnNumber: 23
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Upload, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
          lineNumber: 1169,
          columnNumber: 70
        }, this),
        " ",
        "Submit"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
        lineNumber: 1168,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
      lineNumber: 1164,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 1139,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/courses.$slug.tsx?tsr-split=component",
    lineNumber: 1138,
    columnNumber: 10
  }, this);
}
export {
  CourseDetail as component
};
