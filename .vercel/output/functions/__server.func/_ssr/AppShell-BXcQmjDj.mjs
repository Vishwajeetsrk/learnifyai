import { r as reactExports, e as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { d as useRouterState, L as Link, e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useAuth, s as supabase } from "./router-BGh9Ntsg.mjs";
import { B as Button, c as cn } from "./button-s-7T9USx.mjs";
import { R as Root, b as Trigger, P as Portal, C as Content, a as Close, T as Title, O as Overlay, D as Description } from "../_libs/radix-ui__react-dialog.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { L as Logo, T as ThemeToggle, D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuLabel, d as DropdownMenuSeparator, e as DropdownMenuItem } from "./ThemeToggle-DNuVEMie.mjs";
import { R as Root$1, F as Fallback, I as Image } from "../_libs/radix-ui__react-avatar.mjs";
import { K as LayoutDashboard, l as GraduationCap, N as ShoppingCart, O as FileCheckCorner, J as Award, k as Sparkles, Q as WandSparkles, R as Inbox, W as Wallet, V as Settings, e as ChartColumn, X as Clapperboard, Y as Shield, _ as Menu, $ as X, a0 as User, a1 as LogOut } from "../_libs/lucide-react.mjs";
const Sheet = Root;
const SheetTrigger = Trigger;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
    lineNumber: 22,
    columnNumber: 3
  },
  void 0
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SheetPortal, { children: [
  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SheetOverlay, {}, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
    lineNumber: 62,
    columnNumber: 5
  }, void 0),
  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { className: "h-4 w-4" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
        lineNumber: 65,
        columnNumber: 9
      }, void 0),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "sr-only", children: "Close" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, void 0)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
      lineNumber: 64,
      columnNumber: 7
    }, void 0),
    children
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
    lineNumber: 63,
    columnNumber: 5
  }, void 0)
] }, void 0, true, {
  fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
  lineNumber: 61,
  columnNumber: 3
}, void 0));
SheetContent.displayName = Content.displayName;
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
    lineNumber: 91,
    columnNumber: 3
  },
  void 0
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/sheet.tsx",
    lineNumber: 103,
    columnNumber: 3
  },
  void 0
));
SheetDescription.displayName = Description.displayName;
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Root$1,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/avatar.tsx",
    lineNumber: 12,
    columnNumber: 3
  },
  void 0
));
Avatar.displayName = Root$1.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/avatar.tsx",
    lineNumber: 24,
    columnNumber: 3
  },
  void 0
));
AvatarImage.displayName = Image.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  },
  void 0,
  false,
  {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/ui/avatar.tsx",
    lineNumber: 36,
    columnNumber: 3
  },
  void 0
));
AvatarFallback.displayName = Fallback.displayName;
function UserAvatarMenu({ size = "md", showName = false, className }) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [signed, setSigned] = reactExports.useState(null);
  const profileQuery = useQuery({
    enabled: !!user,
    queryKey: ["profile-mini", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", user.id).single();
      return data;
    }
  });
  reactExports.useEffect(() => {
    const path = profileQuery.data?.avatar_url;
    if (!path) return setSigned(null);
    let cancelled = false;
    supabase.storage.from("avatars").createSignedUrl(path, 60 * 60).then(({ data }) => !cancelled && setSigned(data?.signedUrl ?? null));
    return () => {
      cancelled = true;
    };
  }, [profileQuery.data?.avatar_url]);
  const name = profileQuery.data?.full_name ?? user?.email ?? "User";
  const initials = name.toString().split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const sizeCls = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenu, { children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      DropdownMenuTrigger,
      {
        className: cn(
          "flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className
        ),
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: sizeCls, children: [
            signed && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarImage, { src: signed, alt: name }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
              lineNumber: 75,
              columnNumber: 22
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { className: "bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs font-semibold", children: initials }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
              lineNumber: 76,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
            lineNumber: 74,
            columnNumber: 9
          }, this),
          showName && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hidden sm:block text-left min-w-0", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-medium truncate max-w-[140px]", children: name }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
              lineNumber: 82,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[10px] text-muted-foreground", children: isAdmin ? "Admin" : "Member" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
              lineNumber: 83,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
            lineNumber: 81,
            columnNumber: 11
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 68,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuContent, { align: "end", className: "w-56", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuLabel, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Avatar, { className: "h-8 w-8", children: [
          signed && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarImage, { src: signed, alt: name }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
            lineNumber: 90,
            columnNumber: 24
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AvatarFallback, { className: "text-[10px]", children: initials }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
            lineNumber: 91,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
          lineNumber: 89,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-sm font-medium truncate", children: name }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
            lineNumber: 94,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-muted-foreground truncate", children: user?.email }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
            lineNumber: 95,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
          lineNumber: 93,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 88,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuSeparator, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 98,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/settings", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(User, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
          lineNumber: 101,
          columnNumber: 13
        }, this),
        " Profile"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 99,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/settings", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Settings, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
          lineNumber: 106,
          columnNumber: 13
        }, this),
        " Settings"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 105,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 104,
        columnNumber: 9
      }, this),
      isAdmin && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuItem, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/admin", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Shield, { className: "h-4 w-4" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
          lineNumber: 112,
          columnNumber: 15
        }, this),
        " Admin"
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 111,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 110,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(DropdownMenuSeparator, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        DropdownMenuItem,
        {
          onClick: async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          },
          className: "text-destructive focus:text-destructive",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LogOut, { className: "h-4 w-4" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
              lineNumber: 124,
              columnNumber: 11
            }, this),
            " Sign out"
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
          lineNumber: 117,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
      lineNumber: 87,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/UserAvatarMenu.tsx",
    lineNumber: 67,
    columnNumber: 5
  }, this);
}
const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/courses", label: "Courses", icon: GraduationCap },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/submissions", label: "Submissions", icon: FileCheckCorner },
  { to: "/certificates", label: "Certificates", icon: Award },
  { to: "/ai", label: "AI Chat", icon: Sparkles },
  { to: "/ai-tools", label: "AI Tools", icon: WandSparkles },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/creator", label: "Creator", icon: ChartColumn, creatorOnly: true },
  { to: "/studio", label: "Studio", icon: Clapperboard, creatorOnly: true },
  { to: "/admin", label: "Admin", icon: Shield, adminOnly: true }
];
function AppShell({ children }) {
  const { user, isAdmin, isCreator } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const navItems = nav.filter((n) => {
    if (n.adminOnly && !isAdmin) return false;
    if (n.creatorOnly && !isCreator) return false;
    return true;
  });
  const cartCount = useQuery({
    enabled: !!user,
    queryKey: ["cart-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase.from("cart_items").select("*", { count: "exact", head: true }).eq("user_id", user.id);
      return count ?? 0;
    }
  });
  const NavList = ({ onClick }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("nav", { className: "flex-1 p-3 space-y-1", children: navItems.map((item) => {
    const active = path === item.to || path.startsWith(item.to + "/");
    const Icon = item.icon;
    const showBadge = item.to === "/cart" && (cartCount.data ?? 0) > 0;
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      Link,
      {
        to: item.to,
        onClick,
        className: cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
          active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { className: "h-4 w-4" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 94,
            columnNumber: 13
          }, this),
          " ",
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex-1", children: item.label }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 94,
            columnNumber: 42
          }, this),
          showBadge && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold", children: cartCount.data }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 96,
            columnNumber: 15
          }, this)
        ]
      },
      item.to,
      true,
      {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
        lineNumber: 83,
        columnNumber: 11
      },
      this
    );
  }) }, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
    lineNumber: 77,
    columnNumber: 5
  }, this);
  const UserFooter = () => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "border-t p-3 flex items-center gap-2", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(UserAvatarMenu, { showName: true }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
      lineNumber: 108,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "ml-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThemeToggle, {}, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
      lineNumber: 110,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
      lineNumber: 109,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
    lineNumber: 107,
    columnNumber: 5
  }, this);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen bg-background flex", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("aside", { className: "hidden md:flex w-60 shrink-0 flex-col border-r bg-card/40 backdrop-blur", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/", className: "flex items-center px-5 h-16 border-b", "aria-label": "Learnify AI", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Logo, { height: "h-10" }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
        lineNumber: 119,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
        lineNumber: 118,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NavList, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
        lineNumber: 122,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(UserFooter, {}, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
        lineNumber: 123,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
      lineNumber: 117,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex-1 min-w-0 flex flex-col", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("header", { className: "md:hidden sticky top-0 z-40 flex items-center justify-between gap-2 h-14 px-3 border-b bg-background/90 backdrop-blur", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Button, { variant: "ghost", size: "icon", "aria-label": "Open menu", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Menu, { className: "h-5 w-5" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 131,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 130,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 129,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SheetContent, { side: "left", className: "w-64 p-0 flex flex-col", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(SheetTitle, { className: "sr-only", children: "Navigation" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
              lineNumber: 135,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center px-5 h-16 border-b", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Logo, { height: "h-9" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
              lineNumber: 137,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
              lineNumber: 136,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(NavList, { onClick: () => setMobileOpen(false) }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
              lineNumber: 140,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(UserFooter, {}, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
              lineNumber: 141,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 134,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
          lineNumber: 128,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/", "aria-label": "Learnify AI", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Logo, { height: "h-8" }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
          lineNumber: 145,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
          lineNumber: 144,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/cart", className: "relative p-2 rounded-md hover:bg-accent", "aria-label": "Cart", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShoppingCart, { className: "h-5 w-5" }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
              lineNumber: 150,
              columnNumber: 15
            }, this),
            (cartCount.data ?? 0) > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "absolute -top-0.5 -right-0.5 text-[9px] bg-primary text-primary-foreground rounded-full h-4 min-w-4 px-1 grid place-items-center font-semibold", children: cartCount.data }, void 0, false, {
              fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
              lineNumber: 152,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 149,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ThemeToggle, {}, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 157,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(UserAvatarMenu, { size: "sm" }, void 0, false, {
            fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
            lineNumber: 158,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
          lineNumber: 148,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
        lineNumber: 127,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("main", { className: "flex-1 min-w-0", children }, void 0, false, {
        fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
        lineNumber: 162,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
      lineNumber: 126,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/components/AppShell.tsx",
    lineNumber: 116,
    columnNumber: 5
  }, this);
}
export {
  AppShell as A,
  Avatar as a,
  AvatarImage as b,
  AvatarFallback as c
};
