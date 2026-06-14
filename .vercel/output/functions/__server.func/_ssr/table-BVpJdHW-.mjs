import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { c as cn } from "./button-s-7T9USx.mjs";
const Table = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
    lineNumber: 8,
    columnNumber: 7
  }, void 0) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
    lineNumber: 7,
    columnNumber: 5
  }, void 0)
);
Table.displayName = "Table";
const TableHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
  lineNumber: 18,
  columnNumber: 3
}, void 0));
TableHeader.displayName = "TableHeader";
const TableBody = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
  lineNumber: 26,
  columnNumber: 3
}, void 0));
TableBody.displayName = "TableBody";
const TableFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
    lineNumber: 34,
    columnNumber: 3
  },
  void 0
));
TableFooter.displayName = "TableFooter";
const TableRow = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    },
    void 0,
    false,
    {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
      lineNumber: 44,
      columnNumber: 5
    },
    void 0
  )
);
TableRow.displayName = "TableRow";
const TableHead = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
    lineNumber: 60,
    columnNumber: 3
  },
  void 0
));
TableHead.displayName = "TableHead";
const TableCell = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
    lineNumber: 75,
    columnNumber: 3
  },
  void 0
));
TableCell.displayName = "TableCell";
const TableCaption = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/table.tsx",
  lineNumber: 90,
  columnNumber: 3
}, void 0));
TableCaption.displayName = "TableCaption";
export {
  Table as T,
  TableHeader as a,
  TableRow as b,
  TableHead as c,
  TableBody as d,
  TableCell as e
};
