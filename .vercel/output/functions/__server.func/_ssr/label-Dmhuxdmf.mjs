import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { R as Root } from "../_libs/radix-ui__react-label.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as cn } from "./button-s-7T9USx.mjs";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Root, { ref, className: cn(labelVariants(), className), ...props }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/label.tsx",
  lineNumber: 17,
  columnNumber: 3
}, void 0));
Label.displayName = Root.displayName;
export {
  Label as L
};
