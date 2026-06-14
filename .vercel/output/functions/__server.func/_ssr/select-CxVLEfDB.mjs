import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { R as Root2, V as Value, T as Trigger, I as Icon, P as Portal, C as Content2, a as Viewport, b as Item, c as ItemIndicator, d as ItemText, S as ScrollUpButton, e as ScrollDownButton, L as Label, f as Separator } from "../_libs/radix-ui__react-select.mjs";
import { c as cn } from "./button-s-7T9USx.mjs";
import { p as ChevronDown, c as Check, aJ as ChevronUp } from "../_libs/lucide-react.mjs";
const Select = Root2;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronDown, { className: "h-4 w-4 opacity-50" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
        lineNumber: 29,
        columnNumber: 7
      }, void 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
        lineNumber: 28,
        columnNumber: 5
      }, void 0)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
    lineNumber: 19,
    columnNumber: 3
  },
  void 0
));
SelectTrigger.displayName = Trigger.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronUp, { className: "h-4 w-4" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
      lineNumber: 44,
      columnNumber: 5
    }, void 0)
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
    lineNumber: 39,
    columnNumber: 3
  },
  void 0
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronDown, { className: "h-4 w-4" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
      lineNumber: 58,
      columnNumber: 5
    }, void 0)
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
    lineNumber: 53,
    columnNumber: 3
  },
  void 0
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Portal, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Content2,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectScrollUpButton, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
        lineNumber: 79,
        columnNumber: 7
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
          lineNumber: 80,
          columnNumber: 7
        },
        void 0
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SelectScrollDownButton, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
        lineNumber: 89,
        columnNumber: 7
      }, void 0)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
    lineNumber: 68,
    columnNumber: 5
  },
  void 0
) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
  lineNumber: 67,
  columnNumber: 3
}, void 0));
SelectContent.displayName = Content2.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
    lineNumber: 99,
    columnNumber: 3
  },
  void 0
));
SelectLabel.displayName = Label.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ItemIndicator, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
        lineNumber: 121,
        columnNumber: 9
      }, void 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
        lineNumber: 120,
        columnNumber: 7
      }, void 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
        lineNumber: 119,
        columnNumber: 5
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ItemText, { children }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
        lineNumber: 124,
        columnNumber: 5
      }, void 0)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
    lineNumber: 111,
    columnNumber: 3
  },
  void 0
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/select.tsx",
    lineNumber: 133,
    columnNumber: 3
  },
  void 0
));
SelectSeparator.displayName = Separator.displayName;
export {
  Select as S,
  SelectTrigger as a,
  SelectValue as b,
  SelectContent as c,
  SelectItem as d
};
