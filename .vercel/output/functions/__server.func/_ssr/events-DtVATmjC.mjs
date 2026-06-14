import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import { s as supabase } from "./router-BGh9Ntsg.mjs";
import "../_libs/sonner.mjs";
import { L as LoaderCircle, q as Calendar, r as Clock, s as MapPin } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./SiteFooter-CadeW0CQ.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "./button-s-7T9USx.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
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
const defaultEvents = [{
  id: "default-event-1",
  title: "Next.js & React 19 Live Workshop",
  description: "Learn forms Actions, server components, and performance optimization hands-on with live building exercises.",
  starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3).toISOString(),
  location: "Online (Discord Live Channel)",
  rsvp_url: "https://discord.gg/learnify"
}, {
  id: "default-event-2",
  title: "AI Creators Panel & AMA Session",
  description: "Connect with successful creators and coaches launching cohorts and study systems. Q&A on monetization and scaling.",
  starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString(),
  location: "Online (Zoom Webinar Room)",
  rsvp_url: "https://zoom.us"
}, {
  id: "default-event-3",
  title: "Bangalore Creator & Coach Meetup",
  description: "Meet up offline in Bangalore with other educators, coaches, and tech builders in the Learnify AI network.",
  starts_at: new Date(Date.now() + 12 * 24 * 60 * 60 * 1e3).toISOString(),
  location: "Innov8 Koramangala, Bangalore",
  rsvp_url: "https://meetup.com"
}];
function EventsPage() {
  const {
    data: events = [],
    isLoading
  } = useQuery({
    queryKey: ["events-public"],
    queryFn: async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("events").select("*").gte("starts_at", new Date(Date.now() - 864e5).toISOString()).order("starts_at", {
          ascending: true
        });
        if (error) {
          console.warn("Events DB Query failed, falling back to static defaults:", error);
          return [];
        }
        return data ?? [];
      } catch (err) {
        console.warn("Events fetch caught exception, falling back to static defaults:", err);
        return [];
      }
    }
  });
  const displayEvents = events.length > 0 ? events : defaultEvents;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "Events", title: "Learn together. In real time.", subtitle: "Workshops, AMAs, and creator showcases — both online and IRL.", children: isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
    lineNumber: 64,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
    lineNumber: 63,
    columnNumber: 20
  }, this) : displayEvents.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-center text-muted-foreground py-12", children: "No upcoming events. Check back soon." }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
    lineNumber: 65,
    columnNumber: 47
  }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-5", children: displayEvents.map((e) => {
    const d = new Date(e.starts_at);
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border border-border/60 bg-card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display text-xl font-semibold", children: e.title }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
          lineNumber: 72,
          columnNumber: 19
        }, this),
        e.description && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-1", children: e.description }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
          lineNumber: 73,
          columnNumber: 37
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
              lineNumber: 76,
              columnNumber: 23
            }, this),
            format(d, "MMM d, yyyy")
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
            lineNumber: 75,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
              lineNumber: 80,
              columnNumber: 23
            }, this),
            format(d, "p")
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
            lineNumber: 79,
            columnNumber: 21
          }, this),
          e.location && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MapPin, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
              lineNumber: 84,
              columnNumber: 25
            }, this),
            e.location
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
            lineNumber: 83,
            columnNumber: 36
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
          lineNumber: 74,
          columnNumber: 19
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
        lineNumber: 71,
        columnNumber: 17
      }, this),
      e.rsvp_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: e.rsvp_url, target: "_blank", rel: "noreferrer", className: "rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition self-start md:self-center", children: "RSVP" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
        lineNumber: 89,
        columnNumber: 31
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "rounded-full bg-muted text-muted-foreground px-5 py-2 text-sm font-medium self-start md:self-center", children: "Details soon" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
        lineNumber: 91,
        columnNumber: 26
      }, this)
    ] }, e.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
      lineNumber: 70,
      columnNumber: 16
    }, this);
  }) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
    lineNumber: 67,
    columnNumber: 16
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/events.tsx?tsr-split=component",
    lineNumber: 62,
    columnNumber: 10
  }, this);
}
export {
  EventsPage as component
};
