import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { l as logoUrl } from "./learnify-logo-CyXPmSny.mjs";
import { c as cn, B as Button } from "./button-s-7T9USx.mjs";
import { R as Root2, T as Trigger, P as Portal2, C as Content2, I as Item2, S as Separator2, L as Label2, a as SubTrigger2, b as SubContent2, c as CheckboxItem2, d as ItemIndicator2, e as RadioItem2 } from "../_libs/radix-ui__react-dropdown-menu.mjs";
import { a as useTheme, b as useMotionPref, C as COLOR_THEMES } from "./router-BGh9Ntsg.mjs";
import { g as Moon, S as Sun, P as Palette, h as Monitor, c as Check, Z as Zap, i as ZapOff, j as ChevronRight, C as Circle } from "../_libs/lucide-react.mjs";
function Logo({ className, height = "h-10" }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "span",
    {
      className: cn(
        "inline-flex items-center justify-center rounded-md transition-colors",
        "dark:bg-white/95 dark:px-1.5 dark:py-0.5 dark:shadow-sm",
        className
      ),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "img",
        {
          src: logoUrl,
          alt: "Learnify AI",
          className: cn(height, "w-auto object-contain"),
          draggable: false
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/Logo.tsx",
          lineNumber: 18,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/Logo.tsx",
      lineNumber: 11,
      columnNumber: 5
    },
    this
  );
}
const DropdownMenu = Root2;
const DropdownMenuTrigger = Trigger;
const DropdownMenuSubTrigger = reactExports.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  SubTrigger2,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronRight, { className: "ml-auto" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
        lineNumber: 37,
        columnNumber: 5
      }, void 0)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
    lineNumber: 27,
    columnNumber: 3
  },
  void 0
));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
const DropdownMenuSubContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  SubContent2,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
    lineNumber: 46,
    columnNumber: 3
  },
  void 0
));
DropdownMenuSubContent.displayName = SubContent2.displayName;
const DropdownMenuContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Portal2, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
    lineNumber: 62,
    columnNumber: 5
  },
  void 0
) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
  lineNumber: 61,
  columnNumber: 3
}, void 0));
DropdownMenuContent.displayName = Content2.displayName;
const DropdownMenuItem = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Item2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",
      inset && "pl-8",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
    lineNumber: 82,
    columnNumber: 3
  },
  void 0
));
DropdownMenuItem.displayName = Item2.displayName;
const DropdownMenuCheckboxItem = reactExports.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  CheckboxItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ItemIndicator2, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
        lineNumber: 109,
        columnNumber: 9
      }, void 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
        lineNumber: 108,
        columnNumber: 7
      }, void 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
        lineNumber: 107,
        columnNumber: 5
      }, void 0),
      children
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
    lineNumber: 98,
    columnNumber: 3
  },
  void 0
));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
const DropdownMenuRadioItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  RadioItem2,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ItemIndicator2, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Circle, { className: "h-2 w-2 fill-current" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
        lineNumber: 131,
        columnNumber: 9
      }, void 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
        lineNumber: 130,
        columnNumber: 7
      }, void 0) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
        lineNumber: 129,
        columnNumber: 5
      }, void 0),
      children
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
    lineNumber: 121,
    columnNumber: 3
  },
  void 0
));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
const DropdownMenuLabel = reactExports.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Label2,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
    lineNumber: 145,
    columnNumber: 3
  },
  void 0
));
DropdownMenuLabel.displayName = Label2.displayName;
const DropdownMenuSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Separator2,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/dropdown-menu.tsx",
    lineNumber: 157,
    columnNumber: 3
  },
  void 0
));
DropdownMenuSeparator.displayName = Separator2.displayName;
const MODES = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor }
];
const MOTIONS = [
  { id: "auto", label: "Match system", icon: Monitor },
  { id: "full", label: "Full motion", icon: Zap },
  { id: "reduced", label: "Reduce motion", icon: ZapOff }
];
function ThemeToggle({ size = "icon" }) {
  const { mode, color, resolvedMode, setMode, setColor } = useTheme();
  const { pref: motionPref, setPref: setMotionPref } = useMotionPref();
  const Icon = resolvedMode === "dark" ? Moon : Sun;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenu, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Button,
      {
        variant: "ghost",
        size: size === "icon" ? "icon" : "sm",
        "aria-label": "Theme and motion preferences",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-4 w-4 transition-transform hover:rotate-12 motion-reduce:transition-none motion-reduce:hover:rotate-0" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
          lineNumber: 40,
          columnNumber: 11
        }, this)
      },
      void 0,
      false,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
        lineNumber: 35,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
      lineNumber: 34,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuContent, { align: "end", className: "w-60", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuLabel, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Palette, { className: "h-3.5 w-3.5" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
          lineNumber: 45,
          columnNumber: 11
        }, this),
        " Appearance"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
        lineNumber: 44,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuSeparator, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
        lineNumber: 47,
        columnNumber: 9
      }, this),
      MODES.map((m) => {
        const MIcon = m.icon;
        const active = mode === m.id;
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { onSelect: () => setMode(m.id), className: "gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MIcon, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
            lineNumber: 53,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex-1", children: m.label }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
            lineNumber: 54,
            columnNumber: 15
          }, this),
          active && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
            lineNumber: 55,
            columnNumber: 26
          }, this)
        ] }, m.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
          lineNumber: 52,
          columnNumber: 13
        }, this);
      }),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuSeparator, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
        lineNumber: 60,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuLabel, { className: "text-xs text-muted-foreground", children: "Color theme" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
        lineNumber: 61,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-6 gap-1.5 px-2 pb-2 pt-1", children: COLOR_THEMES.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "button",
        {
          onClick: () => setColor(t.id),
          "aria-label": t.label,
          title: t.label,
          className: cn(
            "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring motion-reduce:transition-none motion-reduce:hover:scale-100",
            color === t.id ? "border-foreground" : "border-transparent"
          ),
          style: { background: t.swatch },
          children: color === t.id && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-3.5 w-3.5 text-white mx-auto drop-shadow" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
            lineNumber: 75,
            columnNumber: 34
          }, this)
        },
        t.id,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
          lineNumber: 64,
          columnNumber: 13
        },
        this
      )) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuSeparator, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
        lineNumber: 80,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuLabel, { className: "text-xs text-muted-foreground", children: "Motion" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      MOTIONS.map((m) => {
        const MIcon = m.icon;
        const active = motionPref === m.id;
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { onSelect: () => setMotionPref(m.id), className: "gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MIcon, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
            lineNumber: 87,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex-1", children: m.label }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
            lineNumber: 88,
            columnNumber: 15
          }, this),
          active && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "h-3.5 w-3.5 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
            lineNumber: 89,
            columnNumber: 26
          }, this)
        ] }, m.id, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
          lineNumber: 86,
          columnNumber: 13
        }, this);
      })
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
      lineNumber: 43,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ThemeToggle.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}
export {
  DropdownMenu as D,
  Logo as L,
  ThemeToggle as T,
  DropdownMenuTrigger as a,
  DropdownMenuContent as b,
  DropdownMenuLabel as c,
  DropdownMenuSeparator as d,
  DropdownMenuItem as e
};
