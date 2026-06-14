import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./router-BGh9Ntsg.mjs";
import { I as Input } from "./input-BHvIASyb.mjs";
import { R as Root2, I as Item, H as Header, T as Trigger2, C as Content2 } from "../_libs/radix-ui__react-accordion.mjs";
import { c as cn } from "./button-s-7T9USx.mjs";
import { B as Badge } from "./badge-LGfgVerF.mjs";
import { M as MarketingPage } from "./MarketingPage-CGOjau1k.mjs";
import "../_libs/sonner.mjs";
import { n as Search, L as LoaderCircle, o as CircleQuestionMark, p as ChevronDown } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./client.server-BbcUHF3e.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-collapsible.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./SiteFooter-CadeW0CQ.mjs";
import "./ThemeToggle-DNuVEMie.mjs";
import "./learnify-logo-CyXPmSny.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const Accordion = Root2;
const AccordionItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Item, { ref, className: cn("border-b", className), ...props }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/accordion.tsx",
  lineNumber: 13,
  columnNumber: 3
}, void 0));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Header, { className: "flex", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Trigger2,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/accordion.tsx",
        lineNumber: 31,
        columnNumber: 7
      }, void 0)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/accordion.tsx",
    lineNumber: 22,
    columnNumber: 5
  },
  void 0
) }, void 0, false, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/accordion.tsx",
  lineNumber: 21,
  columnNumber: 3
}, void 0));
AccordionTrigger.displayName = Trigger2.displayName;
const AccordionContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Content2,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: cn("pb-4 pt-0", className), children }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/accordion.tsx",
      lineNumber: 46,
      columnNumber: 5
    }, void 0)
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/accordion.tsx",
    lineNumber: 41,
    columnNumber: 3
  },
  void 0
));
AccordionContent.displayName = Content2.displayName;
const defaultFaqs = [{
  id: "default-1",
  question: "What is Learnify AI?",
  answer: "Learnify AI is an AI-powered learning operating system. It brings together interactive courses, personalized 1-on-1 AI tutoring, note-taking tools, and community-driven learning into a single, cohesive experience.",
  category: "General",
  order_index: 1
}, {
  id: "default-2",
  question: "How do I enroll in a course?",
  answer: "Simply browse our course catalog, click on any course you are interested in, and click the 'Enroll' button to add it to your learning dashboard and start studying.",
  category: "Courses",
  order_index: 2
}, {
  id: "default-3",
  question: "How do the AI study tools work?",
  answer: "Each course is equipped with direct access to an AI Tutor, Quiz Generator, Doubt Solver, and Auto Flashcards. They analyze the course material and video transcriptions to generate study resources custom-tailored to your learning progress.",
  category: "AI Tools",
  order_index: 3
}, {
  id: "default-4",
  question: "Are certificates verified?",
  answer: "Yes, once you pass a course's final assessment, Learnify AI generates a verified digital certificate with a unique code. Anyone can verify its authenticity by visiting the public verification URL.",
  category: "Certificates",
  order_index: 4
}, {
  id: "default-5",
  question: "Is there a free tier?",
  answer: "Yes! You can sign up and start learning for free. We offer a premium subscription plan that grants unlimited access to advanced AI sessions, certificate generation, and creator studio tools.",
  category: "Pricing",
  order_index: 5
}];
function FaqPage() {
  const [q, setQ] = reactExports.useState("");
  const [cat, setCat] = reactExports.useState("All");
  const {
    data: faqsDb = [],
    isLoading
  } = useQuery({
    queryKey: ["public-faqs"],
    queryFn: async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("faqs").select("id, question, answer, category, order_index").eq("published", true).order("category", {
          ascending: true
        }).order("order_index", {
          ascending: true
        });
        if (error) {
          console.warn("FAQ DB Query failed, falling back to static defaults:", error);
          return [];
        }
        return data ?? [];
      } catch (err) {
        console.warn("FAQ fetch caught exception, falling back to static defaults:", err);
        return [];
      }
    }
  });
  const faqs = faqsDb.length > 0 ? faqsDb : defaultFaqs;
  const categories = reactExports.useMemo(() => ["All", ...Array.from(new Set(faqs.map((f) => f.category)))], [faqs]);
  const filtered = reactExports.useMemo(() => {
    const ql = q.trim().toLowerCase();
    return faqs.filter((f) => {
      if (cat !== "All" && f.category !== cat) return false;
      if (!ql) return true;
      return f.question.toLowerCase().includes(ql) || f.answer.toLowerCase().includes(ql);
    });
  }, [faqs, q, cat]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MarketingPage, { eyebrow: "Help Center", title: "Frequently asked questions", subtitle: "Answers about certificates, courses, billing, and creators.", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "px-6 py-16 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground text-center", children: [
      "Can't find what you're looking for?",
      " ",
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/contact", className: "text-primary hover:underline", children: "Contact us" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 91,
        columnNumber: 11
      }, this),
      "."
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 89,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 relative", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 98,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search questions...", className: "pl-9 h-11" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 99,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 97,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-4 flex flex-wrap gap-2", children: categories.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setCat(c), className: "rounded-full", "aria-pressed": cat === c, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Badge, { variant: cat === c ? "default" : "outline", className: "cursor-pointer", children: c }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 104,
      columnNumber: 15
    }, this) }, c, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 103,
      columnNumber: 32
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 102,
      columnNumber: 9
    }, this),
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "py-20 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-5 w-5 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 111,
      columnNumber: 13
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 110,
      columnNumber: 22
    }, this) : filtered.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-10 rounded-2xl border bg-card p-12 text-center", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleQuestionMark, { className: "h-10 w-10 mx-auto text-muted-foreground" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 113,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mt-3 font-medium", children: "No matching questions." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 114,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground", children: "Try another search term." }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 115,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 112,
      columnNumber: 44
    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Accordion, { type: "single", collapsible: true, className: "mt-8 space-y-2", children: filtered.map((f) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AccordionItem, { value: f.id, className: "rounded-xl border bg-card px-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AccordionTrigger, { className: "text-left hover:no-underline", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium", children: f.question }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 119,
        columnNumber: 19
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 118,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AccordionContent, { className: "text-sm text-muted-foreground whitespace-pre-line", children: f.answer }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
        lineNumber: 121,
        columnNumber: 17
      }, this)
    ] }, f.id, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 117,
      columnNumber: 32
    }, this)) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
      lineNumber: 116,
      columnNumber: 20
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
    lineNumber: 88,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/faq.tsx?tsr-split=component",
    lineNumber: 87,
    columnNumber: 10
  }, this);
}
export {
  FaqPage as component
};
