import { e as jsxDevRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { f as useLocation, O as Outlet, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./useServerFn-DL2oePlL.mjs";
import { C as Checkbox } from "./checkbox-BBQBtFN5.mjs";
import { u as utils, w as writeFileSync } from "../_libs/xlsx.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as AppShell } from "./AppShell-BXcQmjDj.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { B as Button, c as cn, b as buttonVariants } from "./button-s-7T9USx.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { L as Label } from "./label-Dmhuxdmf.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-CV-3vits.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-Dn0qHyRx.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, e as DropdownMenuItem, d as DropdownMenuSeparator } from "./ThemeToggle-DNuVEMie.mjs";
import { c as createSsrRpc } from "./createSsrRpc-BR3wbl1z.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-BVm8xUae.mjs";
import { C as Card } from "./card-1p_vtslP.mjs";
import "../_libs/seroval.mjs";
import { H as subDays, C as startOfDay, I as endOfDay, F as startOfWeek, E as startOfMonth, J as eachDayOfInterval, f as format, g as differenceInCalendarDays, K as parse } from "../_libs/date-fns.mjs";
import { ak as ShieldAlert, U as Users, aT as Activity, W as Wallet, m as Bell, q as Calendar$1, aU as VideoOff, aV as RefreshCw, a5 as Download, e as ChartColumn, L as LoaderCircle, aW as UserPlus, k as Sparkles, b as CircleCheck, aX as Ellipsis, an as Pencil, a6 as ShieldCheck, aC as KeyRound, az as Ban, ah as Trash2, x as TrendingUp, ab as TrendingDown, aY as ChevronLeft, j as ChevronRight, p as ChevronDown } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, A as AreaChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Area, B as BarChart, b as Bar } from "../_libs/recharts.mjs";
import { g as getDefaultClassNames, D as DayPicker } from "../_libs/react-day-picker.mjs";
import { o as objectType, b as booleanType, s as stringType, n as numberType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/use-sync-external-store.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
import "../_libs/date-fns__tz.mjs";
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Portal, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/popover.tsx",
    lineNumber: 17,
    columnNumber: 5
  },
  void 0
) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/popover.tsx",
  lineNumber: 16,
  columnNumber: 3
}, void 0));
PopoverContent.displayName = Content2.displayName;
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/calendar.tsx",
            lineNumber: 109,
            columnNumber: 18
          }, this);
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronLeft, { className: cn("size-4", className2), ...props2 }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/calendar.tsx",
              lineNumber: 113,
              columnNumber: 20
            }, this);
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronRight, { className: cn("size-4", className2), ...props2 }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/calendar.tsx",
              lineNumber: 117,
              columnNumber: 20
            }, this);
          }
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronDown, { className: cn("size-4", className2), ...props2 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/calendar.tsx",
            lineNumber: 120,
            columnNumber: 18
          }, this);
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { ...props2, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/calendar.tsx",
            lineNumber: 126,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/calendar.tsx",
            lineNumber: 125,
            columnNumber: 13
          }, this);
        },
        ...components
      },
      ...props
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/calendar.tsx",
      lineNumber: 25,
      columnNumber: 5
    },
    this
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/calendar.tsx",
      lineNumber: 153,
      columnNumber: 5
    },
    this
  );
}
createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b2c2671ec0dd0443e3dd92fb41a7adab672c40eb8e471dcf5a2b8f70ad13090c"));
const adminListUsers = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("75a41eaad6e8e420ff959bd09f5f09676e4cb6e6827615b69002573eecffdcbe"));
const adminSetAiCredits = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  creditsRemaining: numberType().int().min(0).max(1e6)
}).parse(d)).handler(createSsrRpc("3c02686d94d9737600d5b12d69cb30c7db2128447be23835394818cbbd1c30fa"));
const adminUpdateUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  fullName: stringType().trim().min(1).max(120).optional(),
  email: stringType().email().max(255).optional()
}).parse(d)).handler(createSsrRpc("7e44cff770ce63c7f54ff4f42a5f1198b6c13b6bb706edd2e84253ce3272ea47"));
const adminSetPassword = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  password: stringType().min(8).max(128)
}).parse(d)).handler(createSsrRpc("0d0c07a65c0857a08946e2697199515335f20099bc56aa4650be6a1beb0700ce"));
const adminSetDisabled = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  disabled: booleanType()
}).parse(d)).handler(createSsrRpc("487fc7f6282ce4b544a9e6bbd96bcce70e405455d873c1697dd8e5d1283872d9"));
const adminDeleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid()
}).parse(d)).handler(createSsrRpc("31cd0087befaea9f28691dcd70f4a21113aea1822989cc6cf42e905d3993bf14"));
const APP_ROLES$1 = ["super_admin", "admin", "creator", "student"];
const appRoleSchema = enumType(APP_ROLES$1);
const adminSetUserRoles = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  userId: stringType().uuid(),
  roles: arrayType(appRoleSchema).max(4)
}).parse(d)).handler(createSsrRpc("16419254d84a19e25f489cee6157c632467f7e6774668931578e88439b949377"));
const adminCreateUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({
  email: stringType().email().max(255),
  password: stringType().min(8).max(128),
  fullName: stringType().trim().min(1).max(120),
  roles: arrayType(appRoleSchema).min(1).max(4)
}).parse(d)).handler(createSsrRpc("7cdf308c08cefa76b5aff91881d47d0a7c38e57c538ac8578cbcc0b0323f57c2"));
const getDemandForecast = createServerFn({
  method: "GET"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("7b5e03bcc1a55c5b8bb598a5c6532a41d70167cde51cd5e8e78b48542eed3214"));
const workloadColor = {
  Low: "bg-muted text-muted-foreground",
  Moderate: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  High: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Surging: "bg-rose-500/10 text-rose-600 dark:text-rose-400"
};
function DemandForecastWidget() {
  const fn = useServerFn(getDemandForecast);
  const q = useQuery({
    queryKey: ["admin", "demand-forecast"],
    queryFn: () => fn(),
    staleTime: 5 * 60 * 1e3
  });
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Card, { className: "p-5", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-3 w-3" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 29,
            columnNumber: 13
          }, this),
          " AI forecast"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 28,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "font-display font-semibold text-lg mt-1", children: "Course demand · next 7 days" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 31,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
        lineNumber: 27,
        columnNumber: 9
      }, this),
      q.data && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "font-display text-3xl font-semibold leading-none", children: q.data.next7Forecast }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 35,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground mt-1", children: [
          "vs last 7d: ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-foreground", children: q.data.totalLast7 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 39,
            columnNumber: 27
          }, this),
          " ",
          q.data.next7Forecast >= q.data.totalLast7 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingUp, { className: "inline h-3 w-3 text-emerald-500" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 41,
            columnNumber: 17
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TrendingDown, { className: "inline h-3 w-3 text-rose-500" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 43,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 38,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
        lineNumber: 34,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
      lineNumber: 26,
      columnNumber: 7
    }, this),
    q.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-12 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
      lineNumber: 52,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
      lineNumber: 51,
      columnNumber: 9
    }, this) : q.isError ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-destructive mt-4", children: "Couldn't load forecast." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
      lineNumber: 55,
      columnNumber: 9
    }, this) : q.data ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground mt-3", children: q.data.insight }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
        lineNumber: 58,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-32 mt-4 -mx-1", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AreaChart, { data: q.data.series, children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("defs", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("linearGradient", { id: "demandFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("stop", { offset: "0%", stopColor: "hsl(var(--primary))", stopOpacity: 0.4 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 65,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("stop", { offset: "100%", stopColor: "hsl(var(--primary))", stopOpacity: 0 }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 66,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 64,
          columnNumber: 19
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 63,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          XAxis,
          {
            dataKey: "date",
            tickLine: false,
            axisLine: false,
            tick: { fontSize: 10 },
            hide: true
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 69,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(YAxis, { hide: true }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 76,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Tooltip,
          {
            contentStyle: {
              fontSize: 12,
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8
            },
            labelStyle: { color: "var(--muted-foreground)" }
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 77,
            columnNumber: 17
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Area,
          {
            type: "monotone",
            dataKey: "enrollments",
            stroke: "var(--primary)",
            strokeWidth: 2,
            fill: "url(#demandFill)"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 86,
            columnNumber: 17
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
        lineNumber: 62,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
        lineNumber: 61,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
        lineNumber: 60,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] uppercase tracking-widest text-muted-foreground mb-2 font-medium", children: "By category" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 98,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-1.5", children: [
          q.data.byCategory.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex-1 truncate", children: c.category }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
              lineNumber: 104,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-muted-foreground tabular-nums", children: [
              "7d ",
              c.last7,
              " · ~",
              c.next7Forecast
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
              lineNumber: 105,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: `text-[10px] ${workloadColor[c.workload]}`, children: c.workload }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
              lineNumber: 108,
              columnNumber: 19
            }, this)
          ] }, c.category, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 103,
            columnNumber: 17
          }, this)),
          q.data.byCategory.length === 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "text-xs text-muted-foreground", children: "No enrollment data yet." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
            lineNumber: 114,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
          lineNumber: 101,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
      lineNumber: 57,
      columnNumber: 9
    }, this) : null
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/DemandForecastWidget.tsx",
    lineNumber: 25,
    columnNumber: 5
  }, this);
}
const APP_ROLES = ["super_admin", "admin", "creator", "student"];
const inr = (n) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
}).format(n);
const fmtDate = (d) => format(d, "dd-MM-yyyy");
function AdminPage() {
  const location = useLocation();
  if (location.pathname !== "/admin") return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Outlet, {}, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
    lineNumber: 37,
    columnNumber: 46
  }, this);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AdminOverview, {}, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
    lineNumber: 38,
    columnNumber: 10
  }, this);
}
function AdminOverview() {
  const {
    user,
    isAdmin,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [forbidden, setForbidden] = reactExports.useState(false);
  const today = reactExports.useMemo(() => /* @__PURE__ */ new Date(), []);
  const [preset, setPreset] = reactExports.useState("30d");
  const [from, setFrom] = reactExports.useState(subDays(today, 29));
  const [to, setTo] = reactExports.useState(today);
  const applyPreset = (p) => {
    setPreset(p);
    const now = /* @__PURE__ */ new Date();
    if (p === "7d") {
      setFrom(subDays(now, 6));
      setTo(now);
    } else if (p === "30d") {
      setFrom(subDays(now, 29));
      setTo(now);
    } else if (p === "month") {
      setFrom(startOfMonth(now));
      setTo(now);
    } else if (p === "90d") {
      setFrom(subDays(now, 89));
      setTo(now);
    }
  };
  reactExports.useEffect(() => {
    if (!loading && !isAdmin) setForbidden(true);
  }, [loading, isAdmin]);
  const aiReq24hQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "ai24"],
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1e3).toISOString();
      const {
        count,
        error
      } = await supabase.from("chat_messages").select("id", {
        count: "exact",
        head: true
      }).gte("created_at", since);
      if (error) throw error;
      return count ?? 0;
    }
  });
  const notificationsQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      const {
        count,
        error
      } = await supabase.from("notifications").select("id", {
        count: "exact",
        head: true
      });
      if (error) throw error;
      return count ?? 0;
    }
  });
  const fromIso = startOfDay(from).toISOString();
  const toIso = endOfDay(to).toISOString();
  const txQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "transactions", fromIso, toIso],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("wallet_transactions").select("id, user_id, amount_inr, type, status, description, created_at").gte("created_at", fromIso).lte("created_at", toIso).order("created_at", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const listUsersFn = useServerFn(adminListUsers);
  const usersQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "users"],
    queryFn: () => listUsersFn()
  });
  const topupsQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "topups"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("wallet_topup_requests").select("id, user_id, amount_inr, method, reference, status, created_at, admin_notes").order("created_at", {
        ascending: false
      }).limit(100);
      if (error) throw error;
      return data ?? [];
    }
  });
  const withdrawalsQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "withdrawals"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("creator_withdrawals").select("id, user_id, amount_inr, method, destination, status, admin_notes, created_at, processed_at").order("created_at", {
        ascending: false
      }).limit(100);
      if (error) throw error;
      return data ?? [];
    }
  });
  const aiCostQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "ai-cost", fromIso, toIso],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("ai_usage").select("model, cost_usd, cost_inr, total_tokens, created_at").gte("created_at", fromIso).lte("created_at", toIso).order("created_at", {
        ascending: false
      }).limit(5e3);
      if (error) throw error;
      return data ?? [];
    }
  });
  const creatorAppsQuery = useQuery({
    enabled: isAdmin,
    queryKey: ["admin", "creator-apps"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("creator_applications").select("id, user_id, motivation, portfolio_url, expertise, status, created_at").order("created_at", {
        ascending: false
      }).limit(100);
      if (error) throw error;
      return data ?? [];
    }
  });
  reactExports.useEffect(() => {
    if (!isAdmin) return;
    const ch = supabase.channel("admin-live").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "wallet_transactions"
    }, () => qc.invalidateQueries({
      queryKey: ["admin", "transactions"]
    })).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "profiles"
    }, () => qc.invalidateQueries({
      queryKey: ["admin", "users"]
    })).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "chat_messages"
    }, () => qc.invalidateQueries({
      queryKey: ["admin", "ai24"]
    })).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "notifications"
    }, () => qc.invalidateQueries({
      queryKey: ["admin", "notifications"]
    })).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "ai_usage"
    }, () => qc.invalidateQueries({
      queryKey: ["admin", "ai-cost"]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [isAdmin, qc]);
  const tx = txQuery.data ?? [];
  const rangeRevenue = reactExports.useMemo(() => tx.filter((t) => t.status === "completed" && t.type === "credit").reduce((s, t) => s + Number(t.amount_inr), 0), [tx]);
  const weeklyRevenue = reactExports.useMemo(() => {
    const wkStart = startOfWeek(/* @__PURE__ */ new Date(), {
      weekStartsOn: 1
    });
    return tx.filter((t) => t.status === "completed" && t.type === "credit" && new Date(t.created_at) >= wkStart).reduce((s, t) => s + Number(t.amount_inr), 0);
  }, [tx]);
  const monthlyRevenue = reactExports.useMemo(() => {
    const mStart = startOfMonth(/* @__PURE__ */ new Date());
    return tx.filter((t) => t.status === "completed" && t.type === "credit" && new Date(t.created_at) >= mStart).reduce((s, t) => s + Number(t.amount_inr), 0);
  }, [tx]);
  const dailySeries = reactExports.useMemo(() => {
    const days = eachDayOfInterval({
      start: from,
      end: to
    });
    const buckets = new Map(days.map((d) => [format(d, "yyyy-MM-dd"), 0]));
    for (const t of tx) {
      if (t.status !== "completed" || t.type !== "credit") continue;
      const k = format(new Date(t.created_at), "yyyy-MM-dd");
      if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + Number(t.amount_inr));
    }
    return Array.from(buckets, ([date, revenue]) => ({
      date: format(new Date(date), "dd-MM"),
      revenue
    }));
  }, [tx, from, to]);
  const weeklySeries = reactExports.useMemo(() => {
    const totalDays = Math.max(1, differenceInCalendarDays(to, from) + 1);
    const weeks = Math.max(1, Math.ceil(totalDays / 7));
    const out = [];
    for (let i = 0; i < weeks; i++) {
      const ws = subDays(to, (weeks - i) * 7 - 1);
      const we = subDays(to, (weeks - i - 1) * 7 - 1);
      const sum = tx.filter((t) => t.status === "completed" && t.type === "credit" && new Date(t.created_at) >= ws && new Date(t.created_at) <= we).reduce((s, t) => s + Number(t.amount_inr), 0);
      out.push({
        week: format(ws, "dd-MM"),
        revenue: sum
      });
    }
    return out;
  }, [tx, from, to]);
  const rangeLabel = `${fmtDate(from)} → ${fmtDate(to)}`;
  const handleExport = () => {
    const wb = utils.book_new();
    utils.book_append_sheet(wb, utils.json_to_sheet([{
      Metric: "Date range",
      Value: rangeLabel
    }, {
      Metric: "Total users",
      Value: usersQuery.data?.total ?? 0
    }, {
      Metric: "AI requests (24h)",
      Value: aiReq24hQuery.data ?? 0
    }, {
      Metric: "Range revenue (INR)",
      Value: rangeRevenue
    }, {
      Metric: "Weekly revenue (INR)",
      Value: weeklyRevenue
    }, {
      Metric: "Monthly revenue (INR)",
      Value: monthlyRevenue
    }, {
      Metric: "Notifications sent",
      Value: notificationsQuery.data ?? 0
    }, {
      Metric: "Generated at",
      Value: format(/* @__PURE__ */ new Date(), "dd-MM-yyyy HH:mm")
    }]), "Summary");
    utils.book_append_sheet(wb, utils.json_to_sheet(dailySeries), "Daily Revenue");
    utils.book_append_sheet(wb, utils.json_to_sheet(weeklySeries), "Weekly Revenue");
    utils.book_append_sheet(wb, utils.json_to_sheet(tx.map((t) => ({
      id: t.id,
      user_id: t.user_id,
      amount_inr: Number(t.amount_inr),
      type: t.type,
      status: t.status,
      description: t.description ?? "",
      created_at: format(new Date(t.created_at), "dd-MM-yyyy HH:mm")
    }))), "Transactions");
    utils.book_append_sheet(wb, utils.json_to_sheet((usersQuery.data?.rows ?? []).map((u) => ({
      id: u.id,
      full_name: u.full_name ?? "",
      email: u.email ?? "",
      roles: u.roles.join(", "),
      disabled: u.disabled,
      joined: format(new Date(u.created_at), "dd-MM-yyyy")
    }))), "Users");
    writeFileSync(wb, `learnify-report-${fmtDate(from)}_${fmtDate(to)}.xlsx`);
  };
  const refreshAll = () => qc.invalidateQueries({
    queryKey: ["admin"]
  });
  const [editing, setEditing] = reactExports.useState(null);
  const [pwdFor, setPwdFor] = reactExports.useState(null);
  const [deleting, setDeleting] = reactExports.useState(null);
  const [creditsFor, setCreditsFor] = reactExports.useState(null);
  const [creditsValue, setCreditsValue] = reactExports.useState("");
  const [rolesFor, setRolesFor] = reactExports.useState(null);
  const [rolesValue, setRolesValue] = reactExports.useState([]);
  const [creating, setCreating] = reactExports.useState(false);
  const [newEmail, setNewEmail] = reactExports.useState("");
  const [newName, setNewName] = reactExports.useState("");
  const [newPwd, setNewPwd] = reactExports.useState("");
  const [newRoles, setNewRoles] = reactExports.useState(["student"]);
  const [busy, setBusy] = reactExports.useState(false);
  const updateUser = useServerFn(adminUpdateUser);
  const setPassword = useServerFn(adminSetPassword);
  const setDisabled = useServerFn(adminSetDisabled);
  const deleteUser = useServerFn(adminDeleteUser);
  const setAiCredits = useServerFn(adminSetAiCredits);
  const setUserRoles = useServerFn(adminSetUserRoles);
  const createUser = useServerFn(adminCreateUser);
  const [editName, setEditName] = reactExports.useState("");
  const [editEmail, setEditEmail] = reactExports.useState("");
  const [pwdValue, setPwdValue] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (rolesFor) setRolesValue(rolesFor.roles ?? []);
  }, [rolesFor]);
  reactExports.useEffect(() => {
    if (editing) {
      setEditName(editing.full_name ?? "");
      setEditEmail(editing.email ?? "");
    }
  }, [editing]);
  reactExports.useEffect(() => {
    if (creditsFor) setCreditsValue(String(creditsFor.credits_remaining ?? 0));
  }, [creditsFor]);
  async function saveEdit() {
    if (!editing) return;
    setBusy(true);
    try {
      await updateUser({
        data: {
          userId: editing.id,
          fullName: editName.trim(),
          email: editEmail.trim()
        }
      });
      toast.success("User updated");
      setEditing(null);
      qc.invalidateQueries({
        queryKey: ["admin", "users"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function savePassword() {
    if (!pwdFor) return;
    if (pwdValue.length < 8) return toast.error("At least 8 characters");
    setBusy(true);
    try {
      await setPassword({
        data: {
          userId: pwdFor.id,
          password: pwdValue
        }
      });
      toast.success("Password reset");
      setPwdFor(null);
      setPwdValue("");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function toggleDisabled(u) {
    setBusy(true);
    try {
      await setDisabled({
        data: {
          userId: u.id,
          disabled: !u.disabled
        }
      });
      toast.success(u.disabled ? "User enabled" : "User disabled");
      qc.invalidateQueries({
        queryKey: ["admin", "users"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteUser({
        data: {
          userId: deleting.id
        }
      });
      toast.success("User deleted");
      setDeleting(null);
      qc.invalidateQueries({
        queryKey: ["admin", "users"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function saveCredits() {
    if (!creditsFor) return;
    const n = Number(creditsValue);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) {
      return toast.error("Enter a whole number ≥ 0");
    }
    setBusy(true);
    try {
      await setAiCredits({
        data: {
          userId: creditsFor.id,
          creditsRemaining: n
        }
      });
      toast.success(`AI credits updated to ${n.toLocaleString("en-IN")}`);
      setCreditsFor(null);
      qc.invalidateQueries({
        queryKey: ["admin", "users"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  function toggleRole(list, r, set) {
    set(list.includes(r) ? list.filter((x) => x !== r) : [...list, r]);
  }
  async function saveRoles() {
    if (!rolesFor) return;
    setBusy(true);
    try {
      await setUserRoles({
        data: {
          userId: rolesFor.id,
          roles: rolesValue
        }
      });
      toast.success("Roles updated");
      setRolesFor(null);
      qc.invalidateQueries({
        queryKey: ["admin", "users"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function saveCreate() {
    const email = newEmail.trim();
    const name = newName.trim();
    if (!email || !name) return toast.error("Name and email are required");
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (newRoles.length === 0) return toast.error("Pick at least one role");
    setBusy(true);
    try {
      await createUser({
        data: {
          email,
          fullName: name,
          password: newPwd,
          roles: newRoles
        }
      });
      toast.success("User created");
      setCreating(false);
      setNewEmail("");
      setNewName("");
      setNewPwd("");
      setNewRoles(["student"]);
      qc.invalidateQueries({
        queryKey: ["admin", "users"]
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  }
  if (forbidden) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-[60vh] grid place-items-center p-10 text-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldAlert, { className: "h-10 w-10 mx-auto text-destructive" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 542,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-4 text-2xl font-display font-semibold", children: "Restricted area" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 543,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-2 text-muted-foreground", children: "You need admin privileges to view this page." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 544,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { className: "mt-6 text-sm text-primary underline", onClick: () => navigate({
        to: "/dashboard"
      }), children: "Back to dashboard" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 547,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 541,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 540,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 539,
      columnNumber: 12
    }, this);
  }
  const stats = [{
    label: "Total users",
    value: usersQuery.isLoading ? "…" : usersQuery.data?.total ?? 0,
    icon: Users,
    tint: "from-primary/30 to-primary/0"
  }, {
    label: "AI requests (24h)",
    value: aiReq24hQuery.isLoading ? "…" : (aiReq24hQuery.data ?? 0).toLocaleString("en-IN"),
    icon: Activity,
    tint: "from-violet-500/30 to-violet-500/0"
  }, {
    label: `Revenue · ${rangeLabel}`,
    value: txQuery.isLoading ? "…" : inr(rangeRevenue),
    icon: Wallet,
    tint: "from-emerald-500/30 to-emerald-500/0"
  }, {
    label: "Notifications sent",
    value: notificationsQuery.isLoading ? "…" : (notificationsQuery.data ?? 0).toLocaleString("en-IN"),
    icon: Bell,
    tint: "from-amber-500/30 to-amber-500/0"
  }];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AppShell, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-4 md:px-10 py-8 max-w-7xl", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-end justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-primary font-medium", children: "Command Center" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 581,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "mt-1 text-2xl md:text-3xl font-display font-semibold tracking-tight", children: "Admin overview" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 584,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-muted-foreground mt-1 text-sm", children: "Realtime view of the platform." }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 587,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 580,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "gap-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 591,
              columnNumber: 15
            }, this),
            " Live"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 590,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", onClick: () => navigate({
            to: "/admin/content"
          }), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar$1, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 596,
              columnNumber: 15
            }, this),
            " Events & Jobs"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 593,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", onClick: () => navigate({
            to: "/admin/missing-videos"
          }), children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(VideoOff, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 601,
              columnNumber: 15
            }, this),
            " Missing videos"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 598,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", size: "sm", onClick: refreshAll, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(RefreshCw, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 604,
              columnNumber: 15
            }, this),
            " Refresh"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 603,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: handleExport, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Download, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 607,
              columnNumber: 15
            }, this),
            " Export Excel"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 606,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 589,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 579,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-2xl border bg-card p-4 shadow-card", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium mr-2 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar$1, { className: "h-4 w-4 text-primary" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 616,
              columnNumber: 15
            }, this),
            " Report range"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 615,
            columnNumber: 13
          }, this),
          ["7d", "30d", "month", "90d"].map((p) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: preset === p ? "default" : "outline", onClick: () => applyPreset(p), children: p === "7d" ? "Last 7 days" : p === "30d" ? "Last 30 days" : p === "month" ? "This month" : "Last 90 days" }, p, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 618,
            columnNumber: 64
          }, this)),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 ml-auto", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DateField, { label: "From", value: from, onChange: (d) => {
              setFrom(d);
              setPreset("custom");
            } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 622,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground", children: "→" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 626,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DateField, { label: "To", value: to, onChange: (d) => {
              setTo(d);
              setPreset("custom");
            } }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 627,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 621,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 614,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 text-xs text-muted-foreground", children: [
          "Showing data for ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-foreground", children: rangeLabel }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 634,
            columnNumber: 30
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 633,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 613,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6", children: stats.map((s) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative overflow-hidden rounded-xl border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: `absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br ${s.tint} blur-2xl` }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 640,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(s.icon, { className: "h-5 w-5 text-primary relative" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 641,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-3 text-xl md:text-2xl font-display font-semibold relative", children: s.value }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 642,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1 relative", children: s.label }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 645,
          columnNumber: 15
        }, this)
      ] }, s.label, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 639,
        columnNumber: 27
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 638,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-6", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-6 shadow-card", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "This week" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 651,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 text-3xl font-display font-semibold", children: inr(weeklyRevenue) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 652,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1", children: [
            "Revenue since ",
            fmtDate(startOfWeek(/* @__PURE__ */ new Date(), {
              weekStartsOn: 1
            }))
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 653,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 650,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-6 shadow-card", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs uppercase tracking-widest text-muted-foreground", children: "This month" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 660,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-2 text-3xl font-display font-semibold", children: inr(monthlyRevenue) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 663,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground mt-1", children: [
            "Revenue since ",
            fmtDate(startOfMonth(/* @__PURE__ */ new Date()))
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 664,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 659,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 649,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DemandForecastWidget, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 672,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 671,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AiCostPanel, { rows: aiCostQuery.data ?? [], loading: aiCostQuery.isLoading, rangeLabel }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 676,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 grid lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "lg:col-span-2 rounded-2xl border bg-card p-6 shadow-card", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Daily revenue" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 683,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: rangeLabel }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 684,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 682,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChartColumn, { className: "h-4 w-4 text-muted-foreground" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 686,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 681,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-64", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AreaChart, { data: dailySeries, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("defs", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("linearGradient", { id: "rev", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("stop", { offset: "0%", stopColor: "oklch(0.72 0.18 245)", stopOpacity: 0.6 }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 693,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("stop", { offset: "100%", stopColor: "oklch(0.72 0.18 245)", stopOpacity: 0 }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 694,
                columnNumber: 23
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 692,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 691,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0 0 0 / 0.06)" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 697,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(XAxis, { dataKey: "date", stroke: "oklch(0.5 0.03 260)", fontSize: 11 }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 698,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(YAxis, { stroke: "oklch(0.5 0.03 260)", fontSize: 11, tickFormatter: (v) => `₹${v}` }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 699,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tooltip, { contentStyle: {
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)"
            }, formatter: (v) => inr(v) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 700,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Area, { type: "monotone", dataKey: "revenue", stroke: "oklch(0.72 0.18 245)", fill: "url(#rev)", strokeWidth: 2 }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 705,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 690,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 689,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 688,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 680,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card p-6 shadow-card", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Weekly revenue" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 712,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground mb-4", children: "Per-week totals in range" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 713,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-64", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(BarChart, { data: weeklySeries, children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CartesianGrid, { strokeDasharray: "3 3", stroke: "oklch(0 0 0 / 0.06)" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 717,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(XAxis, { dataKey: "week", stroke: "oklch(0.5 0.03 260)", fontSize: 11 }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 718,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(YAxis, { stroke: "oklch(0.5 0.03 260)", fontSize: 11, tickFormatter: (v) => `₹${v}` }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 719,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Tooltip, { contentStyle: {
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--card)"
            }, formatter: (v) => inr(v) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 720,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Bar, { dataKey: "revenue", fill: "oklch(0.55 0.22 260)", radius: [6, 6, 0, 0] }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 725,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 716,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 715,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 714,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 711,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 679,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card shadow-card overflow-hidden", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Transactions" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 735,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
            tx.length,
            " in ",
            rangeLabel
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 736,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 734,
          columnNumber: 11
        }, this),
        txQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 741,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 740,
          columnNumber: 32
        }, this) : tx.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 text-sm text-muted-foreground text-center", children: "No transactions in this range." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 742,
          columnNumber: 40
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { className: "bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-6 py-3 font-medium", children: "When" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 748,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-6 py-3 font-medium", children: "Type" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 749,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-6 py-3 font-medium", children: "Status" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 750,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-6 py-3 font-medium", children: "Description" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 751,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-6 py-3 font-medium", children: "Amount" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 752,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 747,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 746,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { children: tx.slice(0, 50).map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-t hover:bg-accent/30", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-muted-foreground text-xs", children: format(new Date(t.created_at), "dd-MM-yyyy HH:mm") }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 757,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: t.type === "credit" ? "default" : "secondary", className: "text-[10px]", children: t.type }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 761,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 760,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-xs", children: t.status }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 765,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-muted-foreground", children: t.description ?? "—" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 766,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-right font-medium", children: inr(Number(t.amount_inr)) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 767,
              columnNumber: 23
            }, this)
          ] }, t.id, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 756,
            columnNumber: 45
          }, this)) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 755,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 745,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 744,
          columnNumber: 22
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 733,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ApprovalsSection, { topups: topupsQuery.data ?? [], isLoading: topupsQuery.isLoading, creatorApps: creatorAppsQuery.data ?? [], appsLoading: creatorAppsQuery.isLoading, userMap: new Map((usersQuery.data?.rows ?? []).map((u) => [u.id, u])), adminId: user?.id ?? "", onChanged: () => {
        qc.invalidateQueries({
          queryKey: ["admin", "topups"]
        });
        qc.invalidateQueries({
          queryKey: ["admin", "creator-apps"]
        });
        qc.invalidateQueries({
          queryKey: ["admin", "transactions"]
        });
      } }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 777,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WithdrawalsSection, { withdrawals: withdrawalsQuery.data ?? [], isLoading: withdrawalsQuery.isLoading, userMap: new Map((usersQuery.data?.rows ?? []).map((u) => [u.id, u])), adminId: user?.id ?? "", onChanged: () => {
        qc.invalidateQueries({
          queryKey: ["admin", "withdrawals"]
        });
        qc.invalidateQueries({
          queryKey: ["admin", "transactions"]
        });
      } }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 789,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card shadow-card overflow-hidden", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Users" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 802,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
              usersQuery.data?.total ?? 0,
              " total · manage profile, roles, password, status"
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 803,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 801,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => setCreating(true), className: "gap-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(UserPlus, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 808,
              columnNumber: 15
            }, this),
            " Add user"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 807,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 800,
          columnNumber: 11
        }, this),
        usersQuery.isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 812,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 811,
          columnNumber: 35
        }, this) : usersQuery.error ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-10 text-sm text-destructive text-center", children: usersQuery.error.message }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 813,
          columnNumber: 41
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { className: "bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3 font-medium", children: "User" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 819,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3 font-medium", children: "Email" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 820,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3 font-medium", children: "Roles" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 821,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3 font-medium", children: "AI credits" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 822,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3 font-medium", children: "Status" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 823,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-4 md:px-6 py-3 font-medium", children: "Joined" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 824,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "px-4 md:px-6 py-3" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 825,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 818,
            columnNumber: 19
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 817,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { children: (usersQuery.data?.rows ?? []).map((u) => {
            const isMe = u.id === user?.id;
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: cn("border-t hover:bg-accent/30", u.disabled && "opacity-60"), children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 font-medium", children: u.full_name ?? "—" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 832,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 text-muted-foreground", children: u.email }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 833,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-1", children: u.roles.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-xs text-muted-foreground", children: "—" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 836,
                columnNumber: 53
              }, this) : u.roles.map((r) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: r === "super_admin" ? "default" : "secondary", className: "text-[10px]", children: r }, r, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 836,
                columnNumber: 129
              }, this)) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 835,
                columnNumber: 27
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 834,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => setCreditsFor(u), className: "inline-flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs font-medium hover:bg-accent transition", title: "Edit AI credits", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-3 w-3 text-violet-500" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                  lineNumber: 843,
                  columnNumber: 29
                }, this),
                (u.credits_remaining ?? 0).toLocaleString("en-IN"),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-muted-foreground font-normal", children: [
                  "· used ",
                  (u.credits_used ?? 0).toLocaleString("en-IN")
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                  lineNumber: 845,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 842,
                columnNumber: 27
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 841,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3", children: u.disabled ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "destructive", className: "text-[10px]", children: "Disabled" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 851,
                columnNumber: 41
              }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "outline", className: "text-[10px]", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { className: "h-3 w-3 mr-1" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                  lineNumber: 854,
                  columnNumber: 31
                }, this),
                "Active"
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 853,
                columnNumber: 40
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 850,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 text-muted-foreground text-xs", children: format(new Date(u.created_at), "dd-MM-yyyy") }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 858,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-4 md:px-6 py-3 text-right", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenu, { children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "ghost", size: "icon", disabled: busy, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Ellipsis, { className: "h-4 w-4" }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                  lineNumber: 865,
                  columnNumber: 33
                }, this) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                  lineNumber: 864,
                  columnNumber: 31
                }, this) }, void 0, false, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                  lineNumber: 863,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuContent, { align: "end", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { onClick: () => setEditing(u), children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Pencil, { className: "h-4 w-4" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                      lineNumber: 870,
                      columnNumber: 33
                    }, this),
                    " Edit"
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                    lineNumber: 869,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { onClick: () => setRolesFor(u), children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldCheck, { className: "h-4 w-4" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                      lineNumber: 873,
                      columnNumber: 33
                    }, this),
                    " Manage roles"
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                    lineNumber: 872,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { onClick: () => setPwdFor(u), children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(KeyRound, { className: "h-4 w-4" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                      lineNumber: 876,
                      columnNumber: 33
                    }, this),
                    " Change password"
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                    lineNumber: 875,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { onClick: () => setCreditsFor(u), children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                      lineNumber: 879,
                      columnNumber: 33
                    }, this),
                    " Edit AI credits"
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                    lineNumber: 878,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuSeparator, {}, void 0, false, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                    lineNumber: 881,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { disabled: isMe, onClick: () => toggleDisabled(u), children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Ban, { className: "h-4 w-4" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                      lineNumber: 883,
                      columnNumber: 33
                    }, this),
                    " ",
                    u.disabled ? "Enable user" : "Disable user"
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                    lineNumber: 882,
                    columnNumber: 31
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { disabled: isMe, className: "text-destructive focus:text-destructive", onClick: () => setDeleting(u), children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Trash2, { className: "h-4 w-4" }, void 0, false, {
                      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                      lineNumber: 887,
                      columnNumber: 33
                    }, this),
                    " Delete user"
                  ] }, void 0, true, {
                    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                    lineNumber: 886,
                    columnNumber: 31
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                  lineNumber: 868,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 862,
                columnNumber: 27
              }, this) }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
                lineNumber: 861,
                columnNumber: 25
              }, this)
            ] }, u.id, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 831,
              columnNumber: 24
            }, this);
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 828,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 816,
          columnNumber: 15
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 815,
          columnNumber: 22
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 799,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 578,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: "Edit user" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 904,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Update profile and email." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 905,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 903,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Full name" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 909,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: editName, onChange: (e) => setEditName(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 910,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 908,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Email" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 913,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "email", value: editEmail, onChange: (e) => setEditEmail(e.target.value) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 914,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 912,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 907,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => setEditing(null), disabled: busy, children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 918,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: saveEdit, disabled: busy, children: [
          busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 922,
            columnNumber: 23
          }, this) : null,
          " Save"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 921,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 917,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 902,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 901,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: !!pwdFor, onOpenChange: (o) => {
      if (!o) {
        setPwdFor(null);
        setPwdValue("");
      }
    }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { children: "Set new password" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 937,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "This will overwrite the user's current password." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 938,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 936,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "New password" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 941,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "password", value: pwdValue, onChange: (e) => setPwdValue(e.target.value) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 942,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 940,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => {
          setPwdFor(null);
          setPwdValue("");
        }, disabled: busy, children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 945,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: savePassword, disabled: busy, children: [
          busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 952,
            columnNumber: 23
          }, this) : null,
          " Update"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 951,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 944,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 935,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 929,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: !!creditsFor, onOpenChange: (o) => {
      if (!o) {
        setCreditsFor(null);
        setCreditsValue("");
      }
    }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { className: "h-4 w-4 text-violet-500" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 968,
            columnNumber: 15
          }, this),
          " Edit AI credits"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 967,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: [
          "Set the remaining AI credits for ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("b", { children: creditsFor?.email }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 971,
            columnNumber: 48
          }, this),
          ". Used so far:",
          " ",
          (creditsFor?.credits_used ?? 0).toLocaleString("en-IN"),
          "."
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 970,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 966,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Credits remaining" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 976,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "number", min: 0, step: 1, value: creditsValue, onChange: (e) => setCreditsValue(e.target.value), placeholder: "e.g. 500" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 977,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-muted-foreground", children: "Whole number, between 0 and 1,000,000." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 978,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 975,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => {
          setCreditsFor(null);
          setCreditsValue("");
        }, disabled: busy, children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 983,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: saveCredits, disabled: busy, children: [
          busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 990,
            columnNumber: 23
          }, this) : null,
          " Save credits"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 989,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 982,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 965,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 959,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: !!rolesFor, onOpenChange: (o) => !o && setRolesFor(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldCheck, { className: "h-4 w-4 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1002,
            columnNumber: 15
          }, this),
          " Manage roles"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1001,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: [
          "Control role-based access for ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("b", { children: rolesFor?.email }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1005,
            columnNumber: 45
          }, this),
          ". A user can have multiple roles."
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1004,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1e3,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-2", children: APP_ROLES.map((r) => {
        const checked = rolesValue.includes(r);
        const isSelfSuper = rolesFor?.id === user?.id && r === "super_admin";
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: cn("flex items-center gap-3 rounded-md border p-2.5 cursor-pointer hover:bg-accent/40", checked && "border-primary/50 bg-primary/5"), children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Checkbox, { checked, disabled: isSelfSuper && checked, onCheckedChange: () => toggleRole(rolesValue, r, setRolesValue) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1014,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium capitalize", children: r.replace("_", " ") }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 1016,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground", children: [
              r === "super_admin" && "Full access to everything, including this admin console.",
              r === "admin" && "Manage content, courses, certificates, and most settings.",
              r === "creator" && "Create and publish courses & lessons; access creator studio.",
              r === "student" && "Default learner role; enroll, learn, and earn certificates."
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 1017,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1015,
            columnNumber: 19
          }, this)
        ] }, r, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1013,
          columnNumber: 20
        }, this);
      }) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1009,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => setRolesFor(null), disabled: busy, children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1028,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: saveRoles, disabled: busy, children: [
          busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1032,
            columnNumber: 23
          }, this) : null,
          " Save roles"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1031,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1027,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 999,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 998,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Dialog, { open: creating, onOpenChange: (o) => {
      if (!o) setCreating(false);
    }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(UserPlus, { className: "h-4 w-4 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1045,
            columnNumber: 15
          }, this),
          " Add new user"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1044,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogDescription, { children: "Create an account and assign one or more roles. The user can sign in immediately." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1047,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1043,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Full name" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1053,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "Jane Doe" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1054,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1052,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Email" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1057,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "email", value: newEmail, onChange: (e) => setNewEmail(e.target.value), placeholder: "jane@example.com" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1058,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1056,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Temporary password" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1061,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { type: "password", value: newPwd, onChange: (e) => setNewPwd(e.target.value), placeholder: "At least 8 characters" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1062,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1060,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { children: "Roles" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1065,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-2", children: APP_ROLES.map((r) => {
            const checked = newRoles.includes(r);
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { type: "button", onClick: () => toggleRole(newRoles, r, setNewRoles), className: cn("px-2.5 py-1 rounded-full border text-xs capitalize transition", checked ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-accent"), children: r.replace("_", " ") }, r, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 1069,
              columnNumber: 24
            }, this);
          }) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1066,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1064,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1051,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "outline", onClick: () => setCreating(false), disabled: busy, children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1077,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { onClick: saveCreate, disabled: busy, children: [
          busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1081,
            columnNumber: 23
          }, this) : null,
          " Create user"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1080,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1076,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1042,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1039,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialog, { open: !!deleting, onOpenChange: (o) => !o && setDeleting(null), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogTitle, { children: "Delete this user?" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1090,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogDescription, { children: [
          "This permanently removes ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("b", { children: deleting?.email }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1092,
            columnNumber: 40
          }, this),
          " and all their auth/profile data. This cannot be undone."
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1091,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1089,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogCancel, { disabled: busy, children: "Cancel" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1097,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AlertDialogAction, { onClick: confirmDelete, disabled: busy, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: [
          busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-4 w-4 animate-spin" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1099,
            columnNumber: 23
          }, this) : null,
          " Delete"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1098,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1096,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1088,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1087,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
    lineNumber: 577,
    columnNumber: 10
  }, this);
}
function DateField({
  label,
  value,
  onChange
}) {
  const [text, setText] = reactExports.useState(format(value, "dd-MM-yyyy"));
  reactExports.useEffect(() => setText(format(value, "dd-MM-yyyy")), [value]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Popover, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Label, { className: "text-xs text-muted-foreground hidden sm:inline", children: label }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1119,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { className: "h-9 w-32 font-mono text-xs", value: text, onChange: (e) => setText(e.target.value), onBlur: () => {
        const parsed = parse(text, "dd-MM-yyyy", /* @__PURE__ */ new Date());
        if (!isNaN(parsed.getTime())) onChange(parsed);
        else setText(format(value, "dd-MM-yyyy"));
      }, placeholder: "DD-MM-YYYY" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1120,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "icon", variant: "outline", className: "h-9 w-9", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar$1, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1126,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1125,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1124,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1118,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PopoverContent, { className: "w-auto p-0", align: "end", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Calendar, { mode: "single", selected: value, onSelect: (d) => d && onChange(d), initialFocus: true, className: "p-3 pointer-events-auto" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1131,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1130,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
    lineNumber: 1117,
    columnNumber: 10
  }, this);
}
function ApprovalsSection({
  topups,
  isLoading,
  creatorApps,
  appsLoading,
  userMap,
  adminId,
  onChanged
}) {
  const pendingTopups = topups.filter((t) => t.status === "pending");
  const pendingApps = creatorApps.filter((a) => a.status === "pending");
  async function approveTopup(t) {
    const {
      error: txErr
    } = await supabase.from("wallet_transactions").insert({
      user_id: t.user_id,
      amount_inr: t.amount_inr,
      type: "credit",
      status: "completed",
      description: `Wallet top-up · ${t.method}${t.reference ? ` · ${t.reference}` : ""}`
    });
    if (txErr) return toast.error(txErr.message);
    const {
      error
    } = await supabase.from("wallet_topup_requests").update({
      status: "approved",
      approved_at: (/* @__PURE__ */ new Date()).toISOString(),
      approved_by: adminId
    }).eq("id", t.id);
    if (error) return toast.error(error.message);
    await supabase.from("notifications").insert({
      user_id: t.user_id,
      title: "Wallet top-up approved",
      body: `₹${t.amount_inr} has been credited to your wallet.`,
      type: "success"
    });
    toast.success("Top-up approved & credited");
    onChanged();
  }
  async function rejectTopup(t) {
    const {
      error
    } = await supabase.from("wallet_topup_requests").update({
      status: "rejected"
    }).eq("id", t.id);
    if (error) return toast.error(error.message);
    await supabase.from("notifications").insert({
      user_id: t.user_id,
      title: "Wallet top-up rejected",
      body: `Your ₹${t.amount_inr} top-up was not approved. Contact support if needed.`,
      type: "warning"
    });
    toast.success("Rejected");
    onChanged();
  }
  async function decideApp(a, approve) {
    const status = approve ? "approved" : "rejected";
    const {
      error
    } = await supabase.from("creator_applications").update({
      status
    }).eq("id", a.id);
    if (error) return toast.error(error.message);
    if (approve) {
      await supabase.from("user_roles").insert({
        user_id: a.user_id,
        role: "creator"
      });
    }
    await supabase.from("notifications").insert({
      user_id: a.user_id,
      title: approve ? "Creator application approved" : "Creator application rejected",
      body: approve ? "You can now publish courses from Creator Studio." : "Your application wasn't accepted this time.",
      type: approve ? "success" : "info"
    });
    toast.success(approve ? "Creator approved" : "Application rejected");
    onChanged();
  }
  const fmtUser = (id) => {
    const u = userMap.get(id);
    return u?.full_name || u?.email || id.slice(0, 8);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 grid lg:grid-cols-2 gap-6", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Wallet top-ups" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1256,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
            pendingTopups.length,
            " pending · ",
            topups.length,
            " total"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1257,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1255,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: pendingTopups.length ? "default" : "secondary", className: "text-[10px]", children: [
          pendingTopups.length,
          " to approve"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1261,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1254,
        columnNumber: 9
      }, this),
      isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1266,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1265,
        columnNumber: 22
      }, this) : topups.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No top-up requests yet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1267,
        columnNumber: 42
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y", children: topups.slice(0, 20).map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "px-6 py-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium", children: [
            inr(Number(t.amount_inr)),
            " · ",
            fmtUser(t.user_id)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1272,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground truncate", children: [
            t.method,
            t.reference ? ` · ${t.reference}` : "",
            " ·",
            " ",
            format(new Date(t.created_at), "dd-MM-yyyy HH:mm")
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1275,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1271,
          columnNumber: 17
        }, this),
        t.status === "pending" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => approveTopup(t), children: "Approve" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1282,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => rejectTopup(t), children: "Reject" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1285,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1281,
          columnNumber: 43
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: t.status === "approved" ? "default" : "secondary", className: "text-[10px] capitalize", children: t.status }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1288,
          columnNumber: 28
        }, this)
      ] }, t.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1270,
        columnNumber: 43
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1269,
        columnNumber: 20
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1253,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border bg-card shadow-card overflow-hidden", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b flex items-center justify-between", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Creator applications" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1299,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
            pendingApps.length,
            " pending · ",
            creatorApps.length,
            " total"
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1300,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1298,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: pendingApps.length ? "default" : "secondary", className: "text-[10px]", children: [
          pendingApps.length,
          " to review"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1304,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1297,
        columnNumber: 9
      }, this),
      appsLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1309,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1308,
        columnNumber: 24
      }, this) : creatorApps.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No applications yet." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1310,
        columnNumber: 47
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y", children: creatorApps.slice(0, 20).map((a) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "px-6 py-3", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium", children: fmtUser(a.user_id) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 1314,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground", children: [
              a.expertise ?? "—",
              " · ",
              format(new Date(a.created_at), "dd-MM-yyyy")
            ] }, void 0, true, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 1315,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1313,
            columnNumber: 19
          }, this),
          a.status === "pending" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => decideApp(a, true), children: "Approve" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 1320,
              columnNumber: 23
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => decideApp(a, false), children: "Reject" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
              lineNumber: 1323,
              columnNumber: 23
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1319,
            columnNumber: 45
          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: a.status === "approved" ? "default" : "secondary", className: "text-[10px] capitalize", children: a.status }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1326,
            columnNumber: 30
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1312,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-1 text-xs text-muted-foreground line-clamp-2", children: a.motivation }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1330,
          columnNumber: 17
        }, this),
        a.portfolio_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: a.portfolio_url, target: "_blank", rel: "noreferrer", className: "text-xs text-primary underline", children: a.portfolio_url }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1331,
          columnNumber: 37
        }, this)
      ] }, a.id, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1311,
        columnNumber: 48
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1310,
        columnNumber: 139
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1296,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
    lineNumber: 1251,
    columnNumber: 10
  }, this);
}
function AiCostPanel({
  rows,
  loading,
  rangeLabel
}) {
  const totalUsd = rows.reduce((s, r) => s + Number(r.cost_usd), 0);
  const totalInr = rows.reduce((s, r) => s + Number(r.cost_inr), 0);
  const totalTokens = rows.reduce((s, r) => s + Number(r.total_tokens), 0);
  const byModel = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const k = r.model;
    const cur = byModel.get(k) ?? {
      usd: 0,
      inr: 0,
      tokens: 0,
      calls: 0
    };
    cur.usd += Number(r.cost_usd);
    cur.inr += Number(r.cost_inr);
    cur.tokens += Number(r.total_tokens);
    cur.calls += 1;
    byModel.set(k, cur);
  }
  const modelRows = Array.from(byModel, ([model, v]) => ({
    model,
    ...v
  })).sort((a, b) => b.usd - a.usd);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 rounded-2xl border bg-card shadow-card overflow-hidden", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Activity, { className: "h-4 w-4 text-primary" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1385,
            columnNumber: 13
          }, this),
          " AI cost (real-time)"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1384,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
          rangeLabel,
          " · ",
          rows.length.toLocaleString("en-IN"),
          " requests"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1387,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1383,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: "secondary", className: "gap-1.5", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1392,
          columnNumber: 11
        }, this),
        " Live"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1391,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1382,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 p-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Metric, { label: "Total cost (USD)", value: `$${totalUsd.toFixed(4)}` }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1396,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Metric, { label: "Total cost (INR)", value: `₹${totalInr.toFixed(2)}` }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1397,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Metric, { label: "Total tokens", value: totalTokens.toLocaleString("en-IN") }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1398,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Metric, { label: "Requests", value: rows.length.toLocaleString("en-IN") }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1399,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1395,
      columnNumber: 7
    }, this),
    loading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1402,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1401,
      columnNumber: 18
    }, this) : modelRows.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No AI usage in this range yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1403,
      columnNumber: 43
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { className: "bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-left px-6 py-3 font-medium", children: "Model" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1409,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-6 py-3 font-medium", children: "Calls" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1410,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-6 py-3 font-medium", children: "Tokens" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1411,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-6 py-3 font-medium", children: "Cost (USD)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1412,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("th", { className: "text-right px-6 py-3 font-medium", children: "Cost (INR)" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1413,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1408,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1407,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { children: modelRows.map((r) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tr", { className: "border-t hover:bg-accent/30", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 font-mono text-xs", children: r.model }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1418,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-right", children: r.calls.toLocaleString("en-IN") }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1419,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-right", children: r.tokens.toLocaleString("en-IN") }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1420,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-right", children: [
          "$",
          r.usd.toFixed(4)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1421,
          columnNumber: 19
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("td", { className: "px-6 py-3 text-right font-medium", children: [
          "₹",
          r.inr.toFixed(2)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1422,
          columnNumber: 19
        }, this)
      ] }, r.model, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1417,
        columnNumber: 35
      }, this)) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1416,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1406,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1405,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
    lineNumber: 1381,
    columnNumber: 10
  }, this);
}
function Metric({
  label,
  value
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border bg-background/40 p-4", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: label }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1437,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-1 text-xl font-display font-semibold", children: value }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1438,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
    lineNumber: 1436,
    columnNumber: 10
  }, this);
}
function WithdrawalsSection({
  withdrawals,
  isLoading,
  userMap,
  adminId,
  onChanged
}) {
  const pending = withdrawals.filter((w) => w.status === "pending");
  const fmtUser = (id) => {
    const u = userMap.get(id);
    return u?.full_name || u?.email || id.slice(0, 8);
  };
  async function approve(w) {
    const {
      error: txErr
    } = await supabase.from("wallet_transactions").insert({
      user_id: w.user_id,
      amount_inr: w.amount_inr,
      type: "debit",
      status: "completed",
      description: `Withdrawal · ${w.method}`
    });
    if (txErr) return toast.error(txErr.message);
    const {
      error
    } = await supabase.from("creator_withdrawals").update({
      status: "paid",
      processed_at: (/* @__PURE__ */ new Date()).toISOString(),
      processed_by: adminId
    }).eq("id", w.id);
    if (error) return toast.error(error.message);
    await supabase.from("notifications").insert({
      user_id: w.user_id,
      title: "Withdrawal paid",
      body: `₹${w.amount_inr} withdrawal via ${w.method} has been processed.`,
      type: "success"
    });
    toast.success("Withdrawal approved & paid");
    onChanged();
  }
  async function reject(w) {
    const notes = window.prompt("Rejection reason (optional):") ?? "";
    const {
      error
    } = await supabase.from("creator_withdrawals").update({
      status: "rejected",
      admin_notes: notes || null,
      processed_at: (/* @__PURE__ */ new Date()).toISOString(),
      processed_by: adminId
    }).eq("id", w.id);
    if (error) return toast.error(error.message);
    await supabase.from("notifications").insert({
      user_id: w.user_id,
      title: "Withdrawal rejected",
      body: notes ? `Reason: ${notes}` : "Your withdrawal request was rejected.",
      type: "warning"
    });
    toast.success("Rejected");
    onChanged();
  }
  async function editDestination(w) {
    const current = formatDest(w);
    const next = window.prompt("Edit payout destination (admin only):", current);
    if (next == null) return;
    const merged = {
      ...w.destination ?? {},
      details: next.trim(),
      edited_by_admin: true
    };
    const {
      error
    } = await supabase.from("creator_withdrawals").update({
      destination: merged
    }).eq("id", w.id);
    if (error) return toast.error(error.message);
    toast.success("Destination updated");
    onChanged();
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 rounded-2xl border bg-card shadow-card overflow-hidden", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "px-6 py-4 border-b flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "font-display text-lg font-semibold", children: "Creator withdrawals · Payouts" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1539,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-muted-foreground", children: [
          pending.length,
          " pending · ",
          withdrawals.length,
          " total"
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1540,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1538,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: pending.length ? "default" : "secondary", className: "text-[10px]", children: [
        pending.length,
        " to process"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1544,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1537,
      columnNumber: 7
    }, this),
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1549,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1548,
      columnNumber: 20
    }, this) : withdrawals.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "No withdrawal requests yet." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1550,
      columnNumber: 45
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "divide-y", children: withdrawals.slice(0, 30).map((w) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "px-6 py-3 flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium", children: [
          inr(Number(w.amount_inr)),
          " · ",
          fmtUser(w.user_id)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1555,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs text-muted-foreground truncate", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "uppercase font-medium text-foreground", children: w.method }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
            lineNumber: 1559,
            columnNumber: 19
          }, this),
          " ·",
          " ",
          formatDest(w) || "—",
          " · ",
          format(new Date(w.created_at), "dd-MM-yyyy HH:mm")
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1558,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1554,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1 shrink-0", children: w.status === "pending" ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "ghost", onClick: () => editDestination(w), children: "Edit" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1565,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", onClick: () => approve(w), children: "Approve & pay" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1568,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { size: "sm", variant: "outline", onClick: () => reject(w), children: "Reject" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
          lineNumber: 1571,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1564,
        columnNumber: 43
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: w.status === "paid" ? "default" : w.status === "rejected" ? "destructive" : "secondary", className: "text-[10px] capitalize", children: w.status }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1574,
        columnNumber: 25
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
        lineNumber: 1563,
        columnNumber: 15
      }, this)
    ] }, w.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1553,
      columnNumber: 46
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
      lineNumber: 1552,
      columnNumber: 18
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated/admin.tsx?tsr-split=component",
    lineNumber: 1536,
    columnNumber: 10
  }, this);
}
function formatDest(w) {
  const d = w.destination ?? {};
  if (d.details) return String(d.details);
  const saved = d.saved ?? {};
  if (w.method === "upi") return saved.upi_id ?? "";
  if (w.method === "paypal") return saved.paypal_email ?? "";
  if (w.method === "bank") return [saved.account_name, saved.account_number, saved.ifsc].filter(Boolean).join(" · ");
  return "";
}
export {
  AdminPage as component
};
