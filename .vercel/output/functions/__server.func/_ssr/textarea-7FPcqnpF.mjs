import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./button-s-7T9USx.mjs";
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      },
      void 0,
      false,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/textarea.tsx",
        lineNumber: 8,
        columnNumber: 7
      },
      void 0
    );
  }
);
Textarea.displayName = "Textarea";
export {
  Textarea as T
};
