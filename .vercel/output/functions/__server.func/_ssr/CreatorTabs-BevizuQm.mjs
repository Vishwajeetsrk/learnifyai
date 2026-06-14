import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link, d as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-BGh9Ntsg.mjs";
import { B as Button, c as cn } from "./button-s-7T9USx.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { L as LoaderCircle, k as Sparkles, e as ChartColumn, ad as IndianRupee, U as Users, M as MessageSquare, V as Settings } from "../_libs/lucide-react.mjs";
function CreatorGate({ children }) {
  const { loading, isCreator } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
      lineNumber: 14,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
      lineNumber: 13,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
      lineNumber: 12,
      columnNumber: 7
    }, this);
  }
  if (!isCreator) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-xl mx-auto mt-16 rounded-2xl border bg-card p-8 shadow-card text-center", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-10 w-10 text-primary mx-auto mb-3" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
        lineNumber: 23,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "font-display text-2xl font-semibold", children: "Creator access required" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
        lineNumber: 24,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-2", children: "This area is for approved creators. Apply to publish courses, earn revenue, and grow an audience on Learnify AI." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
        lineNumber: 25,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, className: "mt-5", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/apply-creator", children: "Apply to become a creator" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
        lineNumber: 30,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
        lineNumber: 29,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
      lineNumber: 22,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
      lineNumber: 21,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorGate.tsx",
    lineNumber: 36,
    columnNumber: 10
  }, this);
}
const tabs = [
  { to: "/creator", label: "Hub", icon: ChartColumn, exact: true },
  { to: "/creator/earnings", label: "Earnings", icon: IndianRupee, exact: false },
  { to: "/creator/subscribers", label: "Subscribers", icon: Users, exact: false },
  { to: "/creator/comments", label: "Comments", icon: MessageSquare, exact: false },
  { to: "/creator/settings", label: "Settings", icon: Settings, exact: false }
];
function CreatorTabs() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border-b sticky top-0 z-30 bg-background/85 backdrop-blur -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("nav", { className: "flex gap-1 overflow-x-auto", "aria-label": "Creator sections", children: tabs.map((t) => {
    const active = t.exact ? path === t.to : path === t.to || path.startsWith(t.to + "/");
    const Icon = t.icon;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Link,
      {
        to: t.to,
        preload: "intent",
        "aria-current": active ? "page" : void 0,
        className: cn(
          "relative inline-flex items-center gap-1.5 px-3 py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-md",
          active ? "border-primary text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
        ),
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: cn("h-3.5 w-3.5", active && "text-primary") }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorTabs.tsx",
            lineNumber: 34,
            columnNumber: 15
          }, this),
          " ",
          t.label
        ]
      },
      t.to,
      true,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorTabs.tsx",
        lineNumber: 22,
        columnNumber: 13
      },
      this
    );
  }) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorTabs.tsx",
    lineNumber: 17,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/CreatorTabs.tsx",
    lineNumber: 16,
    columnNumber: 5
  }, this);
}
export {
  CreatorGate as C,
  CreatorTabs as a
};
