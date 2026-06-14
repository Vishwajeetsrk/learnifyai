import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { C as Checkbox$1, a as CheckboxIndicator } from "../_libs/radix-ui__react-checkbox.mjs";
import { c as cn } from "./button-s-7T9USx.mjs";
import { c as Check } from "../_libs/lucide-react.mjs";
const Checkbox = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Checkbox$1,
  {
    ref,
    className: cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CheckboxIndicator, { className: cn("grid place-content-center text-current"), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-4 w-4" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/checkbox.tsx",
      lineNumber: 20,
      columnNumber: 7
    }, void 0) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/checkbox.tsx",
      lineNumber: 19,
      columnNumber: 5
    }, void 0)
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/checkbox.tsx",
    lineNumber: 11,
    columnNumber: 3
  },
  void 0
));
Checkbox.displayName = Checkbox$1.displayName;
export {
  Checkbox as C
};
