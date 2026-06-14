import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { R as Root, I as Indicator } from "../_libs/radix-ui__react-progress.mjs";
import { c as cn } from "./button-s-7T9USx.mjs";
const Progress = reactExports.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      },
      void 0,
      false,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/progress.tsx",
        lineNumber: 17,
        columnNumber: 5
      },
      void 0
    )
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/progress.tsx",
    lineNumber: 12,
    columnNumber: 3
  },
  void 0
));
Progress.displayName = Root.displayName;
export {
  Progress as P
};
