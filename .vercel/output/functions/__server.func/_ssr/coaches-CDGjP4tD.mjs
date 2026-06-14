import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { S as StaggerGroup, a as StaggerItem } from "./Reveal-Bq96pMeu.mjs";
import "../_libs/sonner.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { q as Calendar, v as MessageCircle, w as Compass, x as TrendingUp, L as LoaderCircle, k as Sparkles, c as Check, y as Send } from "../_libs/lucide-react.mjs";
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
import "./SiteFooter-CadeW0CQ.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
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
import "./router-BGh9Ntsg.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
const perks = [{
  id: "scheduling",
  icon: Calendar,
  title: "Smart Scheduling",
  desc: "Bookable slots synced to your calendar."
}, {
  id: "messaging",
  icon: MessageCircle,
  title: "Native Messaging",
  desc: "Async chat + voice notes with every client."
}, {
  id: "roadmaps",
  icon: Compass,
  title: "Client Roadmaps",
  desc: "AI-generated learning paths per client."
}, {
  id: "outcomes",
  icon: TrendingUp,
  title: "Outcome Tracking",
  desc: "Show progress with real data, not vibes."
}];
function CoachesPage() {
  const [selectedPerk, setSelectedPerk] = reactExports.useState("scheduling");
  const [selectedSlot, setSelectedSlot] = reactExports.useState(null);
  const [bookingStatus, setBookingStatus] = reactExports.useState("idle");
  const slots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];
  const handleBookSlot = () => {
    if (!selectedSlot) return;
    setBookingStatus("booking");
    setTimeout(() => {
      setBookingStatus("booked");
    }, 1e3);
  };
  const [messages, setMessages] = reactExports.useState([{
    sender: "client",
    text: "Hey Coach! Quick question about the system design homework."
  }, {
    sender: "coach",
    text: "Sure, go ahead! Are you analyzing the horizontal scaling or caching layer?"
  }]);
  const [typedMessage, setTypedMessage] = reactExports.useState("");
  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;
    const clientMsg = {
      sender: "client",
      text: typedMessage
    };
    setMessages((prev) => [...prev, clientMsg]);
    setTypedMessage("");
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        sender: "coach",
        text: "Got it! That looks correct. I'd recommend using Redis for the read-heavy session cache and PostgreSQL for persistent user metadata."
      }]);
    }, 1500);
  };
  const [roadmapPhases, setRoadmapPhases] = reactExports.useState([{
    id: 1,
    title: "Phase 1: Foundations (JS/TS & Git)",
    completed: true
  }, {
    id: 2,
    title: "Phase 2: Database Design & Normalization",
    completed: false
  }, {
    id: 3,
    title: "Phase 3: Backend API Integration & Services",
    completed: false
  }]);
  const togglePhase = (id) => {
    setRoadmapPhases((prev) => prev.map((p) => p.id === id ? {
      ...p,
      completed: !p.completed
    } : p));
  };
  const completedCount = roadmapPhases.filter((p) => p.completed).length;
  const progressPercent = Math.round(completedCount / roadmapPhases.length * 100);
  const [runAudit, setRunAudit] = reactExports.useState("idle");
  const handleRunAudit = () => {
    setRunAudit("auditing");
    setTimeout(() => {
      setRunAudit("done");
    }, 1200);
  };
  const renderInteractiveDemo = () => {
    switch (selectedPerk) {
      case "scheduling":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 108,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Interactive Scheduling Sandbox" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 109,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 107,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mb-4", children: "Test booking a session. Select a slot below to schedule with your coach." }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 113,
              columnNumber: 15
            }, this),
            bookingStatus === "idle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-2.5", children: slots.map((slot) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setSelectedSlot(slot), className: `py-2 px-3 text-xs border rounded-lg transition-all cursor-pointer ${selectedSlot === slot ? "bg-primary text-primary-foreground border-transparent font-medium" : "bg-muted/50 border-border hover:bg-muted"}`, children: slot }, slot, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 118,
              columnNumber: 38
            }, this)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 117,
              columnNumber: 44
            }, this),
            bookingStatus === "booking" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-8 flex flex-col items-center justify-center gap-3", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 124,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
                "Securing slot ",
                selectedSlot,
                "..."
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 125,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 123,
              columnNumber: 47
            }, this),
            bookingStatus === "booked" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-5 w-5" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 130,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 129,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-semibold text-sm text-foreground", children: "Coaching Session Scheduled!" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 132,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
                "Confirmed for",
                " ",
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-foreground", children: selectedSlot }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                  lineNumber: 137,
                  columnNumber: 21
                }, this),
                ". Calendar invite sent."
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 135,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 128,
              columnNumber: 46
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 106,
            columnNumber: 13
          }, this),
          bookingStatus === "idle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { disabled: !selectedSlot, onClick: handleBookSlot, size: "sm", className: "w-full text-xs", children: "Book Session" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 143,
            columnNumber: 42
          }, this),
          bookingStatus === "booked" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", onClick: () => {
            setBookingStatus("idle");
            setSelectedSlot(null);
          }, className: "w-full text-xs", children: "Schedule Another Slot" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 147,
            columnNumber: 44
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
          lineNumber: 105,
          columnNumber: 16
        }, this);
      case "messaging":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageCircle, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 158,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "Async Messaging Preview" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 159,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 157,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2 max-h-[200px] overflow-y-auto pr-1", children: messages.map((m, idx) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `flex ${m.sender === "client" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${m.sender === "client" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`, children: m.text }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 166,
              columnNumber: 21
            }, this) }, idx, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 165,
              columnNumber: 43
            }, this)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 164,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 156,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mt-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: typedMessage, onChange: (e) => setTypedMessage(e.target.value), placeholder: "Ask coach a question...", className: "bg-muted/50 h-8 text-xs flex-1", onKeyDown: (e) => {
              if (e.key === "Enter") handleSendMessage();
            } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 174,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", onClick: handleSendMessage, disabled: !typedMessage.trim(), className: "h-8 w-8 shrink-0 cursor-pointer", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { className: "h-3.5 w-3.5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 178,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 177,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 173,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
          lineNumber: 155,
          columnNumber: 16
        }, this);
      case "roadmaps":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Compass, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 186,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "AI Learning Roadmap Editor" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 187,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 185,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mb-4", children: "Toggle the items below to simulate client progress. AI dynamically updates outcomes." }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 191,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: roadmapPhases.map((phase) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { onClick: () => togglePhase(phase.id), className: "flex items-center gap-3 p-2.5 rounded-lg border bg-muted/20 border-border/60 hover:bg-muted/50 cursor-pointer transition-colors", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-all ${phase.completed ? "bg-primary border-transparent text-primary-foreground" : "border-muted-foreground/30 bg-transparent"}`, children: phase.completed && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-3 w-3" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 198,
                columnNumber: 43
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 197,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: `text-xs text-left ${phase.completed ? "line-through text-muted-foreground" : "text-foreground font-medium"}`, children: phase.title }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 200,
                columnNumber: 21
              }, this)
            ] }, phase.id, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 196,
              columnNumber: 45
            }, this)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 195,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 184,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex justify-between text-[10px] font-bold text-muted-foreground uppercase", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "CLIENT PROGRESS" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 209,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                progressPercent,
                "%"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 210,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 208,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { className: "h-full bg-primary", animate: {
              width: `${progressPercent}%`
            }, transition: {
              duration: 0.3
            } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 213,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 212,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 207,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
          lineNumber: 183,
          columnNumber: 16
        }, this);
      case "outcomes":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col h-full justify-between gap-6", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mb-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingUp, { className: "h-5 w-5 text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 225,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-sm text-foreground", children: "AI Skills & Outcomes Audit" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 226,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 224,
              columnNumber: 15
            }, this),
            runAudit === "idle" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Trigger an automated AI scan on client performance to see data-driven skill gaps." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 232,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3 text-[11px] p-2 bg-muted/40 rounded-lg border", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground", children: "Mock Interviews" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                    lineNumber: 238,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-foreground", children: "8.2 / 10" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                    lineNumber: 239,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                  lineNumber: 237,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground", children: "Code Submissions" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                    lineNumber: 242,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold text-foreground", children: "94% score" }, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                    lineNumber: 243,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                  lineNumber: 241,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 236,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: handleRunAudit, size: "sm", className: "w-full text-xs", children: "Run Skill Audit" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 246,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 231,
              columnNumber: 39
            }, this),
            runAudit === "auditing" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-12 flex flex-col items-center justify-center gap-3 text-center", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 252,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground font-medium", children: "Scanning client codebase and logs..." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 253,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 251,
              columnNumber: 43
            }, this),
            runAudit === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3.5", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5 text-primary text-xs font-semibold", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-3.5 w-3.5" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                  lineNumber: 261,
                  columnNumber: 23
                }, this),
                " AI ANALYSIS REPORT"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 260,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-foreground leading-relaxed", children: "Client is extremely proficient with asynchronous patterns. Highlighted recommendation: Focus on **database indexing** and query profiling optimizations." }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
                lineNumber: 263,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 259,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 258,
              columnNumber: 39
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 223,
            columnNumber: 13
          }, this),
          runAudit === "done" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", onClick: () => setRunAudit("idle"), className: "w-full text-xs", children: "Reset Audit" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 272,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
          lineNumber: 222,
          columnNumber: 16
        }, this);
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "For Coaches", title: "Run your coaching practice on autopilot.", subtitle: "Scheduling, payments, content, and AI insight — in one place.", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-3xl p-8 md:p-12 relative overflow-hidden", style: {
      background: "var(--gradient-brand)"
    }, children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { className: "absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]", animate: {
        opacity: [0.2, 0.4, 0.2]
      }, transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      } }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
        lineNumber: 284,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerGroup, { className: "lg:col-span-5 grid grid-cols-1 gap-2.5", stagger: 0.05, children: perks.map((p) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(StaggerItem, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => {
          setSelectedPerk(p.id);
          setSelectedSlot(null);
          setBookingStatus("idle");
        }, className: `w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${selectedPerk === p.id ? "bg-background text-foreground border-transparent shadow-lg scale-[1.01]" : "bg-white/10 border-white/10 text-primary-foreground hover:bg-white/15"}`, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `p-2.5 rounded-lg shrink-0 ${selectedPerk === p.id ? "bg-primary/10 text-primary" : "bg-white/10 text-white"}`, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(p.icon, { className: "h-5 w-5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 302,
            columnNumber: 21
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 301,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-semibold text-sm leading-none", children: p.title }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 305,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: `text-xs mt-1.5 leading-relaxed ${selectedPerk === p.id ? "text-muted-foreground" : "opacity-80"}`, children: p.desc }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
              lineNumber: 306,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
            lineNumber: 304,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
          lineNumber: 296,
          columnNumber: 17
        }, this) }, p.id, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
          lineNumber: 295,
          columnNumber: 29
        }, this)) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
          lineNumber: 294,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "lg:col-span-7 bg-background/95 border border-border shadow-2xl rounded-2xl p-6 min-h-[340px] flex flex-col justify-between transition-all duration-300", children: renderInteractiveDemo() }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
          lineNumber: 315,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
        lineNumber: 292,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
      lineNumber: 281,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-14 text-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/contact", children: "Talk to our coach team" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
      lineNumber: 323,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
      lineNumber: 322,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
      lineNumber: 321,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/coaches.tsx?tsr-split=component",
    lineNumber: 280,
    columnNumber: 10
  }, this);
}
export {
  CoachesPage as component
};
