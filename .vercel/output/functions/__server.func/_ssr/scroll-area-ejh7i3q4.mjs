import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { R as Root, V as Viewport, C as Corner, S as ScrollAreaScrollbar, a as ScrollAreaThumb } from "../_libs/radix-ui__react-scroll-area.mjs";
import { c as cn } from "./button-s-7T9USx.mjs";
const ScrollArea = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Root,
  {
    ref,
    className: cn("relative overflow-hidden", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Viewport, { className: "h-full w-full rounded-[inherit]", children }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/scroll-area.tsx",
        lineNumber: 15,
        columnNumber: 5
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ScrollBar, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/scroll-area.tsx",
        lineNumber: 18,
        columnNumber: 5
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Corner, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/scroll-area.tsx",
        lineNumber: 19,
        columnNumber: 5
      }, void 0)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/scroll-area.tsx",
    lineNumber: 10,
    columnNumber: 3
  },
  void 0
));
ScrollArea.displayName = Root.displayName;
const ScrollBar = reactExports.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  ScrollAreaScrollbar,
  {
    ref,
    orientation,
    className: cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/scroll-area.tsx",
      lineNumber: 39,
      columnNumber: 5
    }, void 0)
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/scroll-area.tsx",
    lineNumber: 28,
    columnNumber: 3
  },
  void 0
));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
export {
  ScrollArea as S
};
