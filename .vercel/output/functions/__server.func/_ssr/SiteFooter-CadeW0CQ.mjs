import { e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { L as Logo, T as ThemeToggle } from "./ThemeToggle-DNuVEMie.mjs";
import { B as Button } from "./button-s-7T9USx.mjs";
import { s as supabase, u as useAuth } from "./router-BGh9Ntsg.mjs";
import { l as logoUrl } from "./learnify-logo-CyXPmSny.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { f as Twitter, G as Github, M as MessageSquare } from "../_libs/lucide-react.mjs";
function SiteHeader() {
  const { isAuthenticated, loading } = useAuth();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("header", { className: "sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "container mx-auto px-6 h-16 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/", className: "flex items-center", "aria-label": "Learnify AI", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Logo, { height: "h-10" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
      lineNumber: 13,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
      lineNumber: 12,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("nav", { className: "hidden md:flex items-center gap-8 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/features", className: "hover:text-foreground transition", children: "Features" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
        lineNumber: 17,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/features", hash: "ai-tools", className: "hover:text-foreground transition", children: "AI Tools" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
        lineNumber: 20,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/creators", className: "hover:text-foreground transition", children: "Creators" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
        lineNumber: 23,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/pricing", className: "hover:text-foreground transition", children: "Pricing" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
        lineNumber: 26,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
      lineNumber: 16,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThemeToggle, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
        lineNumber: 31,
        columnNumber: 11
      }, this),
      loading ? null : isAuthenticated ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Button,
        {
          asChild: true,
          size: "sm",
          className: "bg-foreground text-background hover:bg-foreground/90",
          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/dashboard", children: "Open app" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
            lineNumber: 38,
            columnNumber: 15
          }, this)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
          lineNumber: 33,
          columnNumber: 13
        },
        this
      ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { asChild: true, variant: "ghost", size: "sm", className: "hidden sm:inline-flex", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/login", children: "Sign in" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
          lineNumber: 43,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
          lineNumber: 42,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Button,
          {
            asChild: true,
            size: "sm",
            className: "bg-foreground text-background hover:bg-foreground/90",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/signup", children: "Get started" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
              lineNumber: 50,
              columnNumber: 17
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
            lineNumber: 45,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
        lineNumber: 41,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
      lineNumber: 30,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
    lineNumber: 11,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteHeader.tsx",
    lineNumber: 10,
    columnNumber: 5
  }, this);
}
const defaults = {
  contact_email: "hello@learnify.ai",
  discord_url: "https://discord.gg/learnify",
  discord_label: "Chat with the community in real time.",
  twitter_url: "https://x.com/learnifyai",
  twitter_handle: "@learnifyai",
  github_url: "https://github.com/Vishwajeetsrk/learnifyai",
  careers_email: "careers@learnify.ai"
};
function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key,value");
      if (error) throw error;
      const map = {};
      (data ?? []).forEach((r) => {
        if (r.value != null && r.value !== "#" && r.value !== "") map[r.key] = r.value;
      });
      return { ...defaults, ...map };
    },
    staleTime: 6e4
  });
}
function SiteFooter() {
  const { data: s } = useSiteSettings();
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("footer", { className: "border-t border-border/60 mt-32 bg-gradient-to-b from-background to-muted/20", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "container mx-auto px-6 py-16 grid gap-10 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/", className: "inline-flex items-center", "aria-label": "Learnify AI", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: logoUrl, alt: "Learnify AI", className: "h-10 w-auto" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 13,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 12,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Learn smarter. Grow faster. The intelligent learning OS." }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 15,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3 pt-2", children: [
          s?.twitter_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "a",
            {
              href: s.twitter_url,
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "X",
              className: "h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition",
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Twitter, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
                lineNumber: 27,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
              lineNumber: 20,
              columnNumber: 15
            },
            this
          ),
          s?.github_url && s.github_url !== "#" && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "a",
            {
              href: s.github_url,
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "GitHub",
              className: "h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition",
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Github, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
                lineNumber: 38,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
              lineNumber: 31,
              columnNumber: 15
            },
            this
          ),
          s?.discord_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "a",
            {
              href: s.discord_url,
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Discord",
              className: "h-9 w-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition",
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageSquare, { className: "h-4 w-4" }, void 0, false, {
                fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
                lineNumber: 49,
                columnNumber: 17
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
              lineNumber: 42,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 18,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
        lineNumber: 11,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-display font-semibold text-sm mb-4", children: "Product" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 56,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-2.5 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/features", className: "hover:text-foreground transition", children: "Features" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 59,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 58,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: "/features#ai-tools", className: "hover:text-foreground transition", children: "AI Tools" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 64,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 63,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/pricing", className: "hover:text-foreground transition", children: "Pricing" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 69,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 68,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/roadmap", className: "hover:text-foreground transition", children: "Roadmap" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 74,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 73,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 57,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
        lineNumber: 55,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-display font-semibold text-sm mb-4", children: "Community" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 82,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-2.5 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/creators", className: "hover:text-foreground transition", children: "Creators" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 85,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 84,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/coaches", className: "hover:text-foreground transition", children: "Coaches" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 90,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 89,
            columnNumber: 13
          }, this),
          s?.discord_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "a",
            {
              href: s.discord_url,
              target: "_blank",
              rel: "noreferrer",
              className: "hover:text-foreground transition",
              children: "Discord"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
              lineNumber: 96,
              columnNumber: 17
            },
            this
          ) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 95,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/events", className: "hover:text-foreground transition", children: "Events" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 107,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 106,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 83,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "font-display font-semibold text-sm mb-4", children: "Company" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 115,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-2.5 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/about", className: "hover:text-foreground transition", children: "About" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 118,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 117,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/careers", className: "hover:text-foreground transition", children: "Careers" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 123,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 122,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/contact", className: "hover:text-foreground transition", children: "Contact" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 128,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 127,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/faq", className: "hover:text-foreground transition", children: "FAQ" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 133,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 132,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/privacy", className: "hover:text-foreground transition", children: "Privacy" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 138,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
            lineNumber: 137,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
          lineNumber: 116,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
        lineNumber: 114,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
      lineNumber: 10,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border-t border-border/60 py-6 text-center text-xs text-muted-foreground", children: "© 2026 Learnify AI · Learn Smarter. Grow Faster." }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
      lineNumber: 145,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/SiteFooter.tsx",
    lineNumber: 9,
    columnNumber: 5
  }, this);
}
export {
  SiteHeader as S,
  SiteFooter as a,
  useSiteSettings as u
};
