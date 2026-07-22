import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import fontsCss from "../fonts.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import "@/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center space-y-6">
        <div className="mx-auto w-64 h-64">
          <img
            src="/illustrations/404_Page_not_found.svg"
            alt="404"
            className="w-full h-full"
            loading="lazy"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">Page not found</h1>
          <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
            The page you're looking for doesn't exist, was moved, or is temporarily unavailable.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            Go home
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:shadow-lg"
          >
            Browse courses
          </Link>
          <Link
            to="/pricing"
            search={{ subscribe: undefined }}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:shadow-lg"
          >
            View plans
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          If you think this is a mistake, contact{" "}
          <a
            href="mailto:support.learnifyai@gmail.com"
            className="text-primary underline underline-offset-2"
          >
            support.learnifyai@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
    // Auto-reload on stale build chunk error (when a new deployment replaces old JS chunks)
    if (
      error?.message?.includes("Failed to fetch dynamically imported module") ||
      error?.message?.includes("Importing a module script failed") ||
      error?.message?.includes("Cannot access") ||
      error?.message?.includes("before initialization") ||
      error?.name === "ChunkLoadError" ||
      (error?.name === "ReferenceError" && error?.message?.includes("before initialization"))
    ) {
      if (typeof window !== "undefined" && "caches" in window) {
        caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
      }
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center space-y-6">
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-destructive/5 flex items-center justify-center">
            <span className="text-5xl select-none">&#9888;</span>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
            An unexpected error occurred. You can try refreshing the page or head back home.
          </p>
          {import.meta.env.DEV && (
            <details className="mt-4 mx-auto max-w-md text-left">
              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors">
                Error details (dev only)
              </summary>
              <pre className="mt-2 rounded-lg bg-muted p-3 text-xs overflow-x-auto text-foreground/80">
                {error.message}
                {"\n"}
                {error.stack}
              </pre>
            </details>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:shadow-lg"
          >
            Go home
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          If this keeps happening, contact{" "}
          <a
            href="mailto:support.learnifyai@gmail.com"
            className="text-primary underline underline-offset-2"
          >
            support.learnifyai@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Learnify AI" },
      {
        name: "description",
        content: "Learnify AI is the intelligent learning OS for learners, creators, and teams.",
      },
      { name: "author", content: "Learnify AI" },
      { property: "og:title", content: "Learnify AI" },
      {
        property: "og:description",
        content:
          "AI-native tutoring, creator tools, gamification, and career growth in one platform.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://www.learnifyai.in/logo.png",
      },
      { property: "og:url", content: "https://www.learnifyai.in" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@LearnifyAI" },
      {
        name: "twitter:image",
        content: "https://www.learnifyai.in/logo.png",
      },
      // Keywords for Search Engines
      {
        name: "keywords",
        content:
          "Learnify AI, Learnify, LearnifyAI, AI Learning OS, Career OS, AI Tutor, Career Roadmap, Resume Builder, ATS Checker, Online Courses India",
      },
      // Google Search Console verification
      {
        name: "google-site-verification",
        content: "Db6NEdI6bZznQUQMkJ78jEPpWnrob9JXegQ99O7s3z0",
      },
      // Theme color
      { name: "theme-color", content: "#0f172a" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://www.learnifyai.in",
      },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
      {
        rel: "apple-touch-icon",
        href: "/logo.png",
        sizes: "192x192",
      },
      {
        rel: "stylesheet",
        href: fontsCss,
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "sitemap",
        type: "application/xml",
        href: "/sitemap.xml",
      },
      {
        rel: "manifest",
        href: "/manifest.json",
      },
      // Performance: DNS preconnect for critical third-party origins
      { rel: "preconnect", href: "https://gnvsqwyexjuuwkjibxrr.supabase.co" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://sdk.cashfree.com" },
      { rel: "dns-prefetch", href: "https://api.cashfree.com" },
      { rel: "preconnect", href: "https://www.googletagmanager.com" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-8GJS0MXEMJ",
        async: true,
      },
      {
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-8GJS0MXEMJ');`,
      },
      {
        children: `(function(){try{var m=localStorage.getItem('ui.mode')||'system';var c=localStorage.getItem('ui.color')||'indigo';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');if(c&&c!=='indigo')r.setAttribute('data-theme',c);r.classList.add('no-theme-transition');setTimeout(function(){r.classList.remove('no-theme-transition')},0);}catch(e){}})();`,
      },
      {
        children: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})});}`,
      },
      {
        children: `window.addEventListener('vite:preloadError',function(){window.location.reload()});`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Learnify AI",
          operatingSystem: "Web",
          applicationCategory: "EducationalApplication",
          url: "https://www.learnifyai.in",
          image: "https://www.learnifyai.in/logo.png",
          description:
            "Learnify AI is the intelligent Career Operating System offering AI-driven learning, verified credentials, and career placement roadmaps.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "@id": "https://www.learnifyai.in/#organization",
          name: "Learnify AI",
          url: "https://www.learnifyai.in",
          logo: "https://www.learnifyai.in/logo.png",
          description:
            "Learnify AI is the intelligent Career Operating System offering AI-driven learning, verified credentials, and career placement roadmaps.",
          sameAs: [
            "https://twitter.com/LearnifyAI",
            "https://linkedin.com/company/learnify-ai",
            "https://github.com/Vishwajeetsrk/learnifyai",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Learnify AI",
          url: "https://www.learnifyai.in",
          logo: "https://www.learnifyai.in/logo.png",
          description:
            "The AI-native learning OS: intelligent tutoring, creator economy, gamification, and career growth.",
          sameAs: [],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "support.learnifyai@gmail.com",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Learnify AI",
          url: "https://www.learnifyai.in",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.learnifyai.in/courses?search={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const lang = typeof document !== "undefined" ? document.documentElement.lang || "en" : "en";
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased overflow-x-hidden bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { AuthProvider } from "../hooks/use-auth";
import { ThemeProvider } from "../hooks/use-theme";
import { MotionPrefProvider } from "../hooks/use-motion-pref";
import { FeatureProvider } from "../hooks/use-features";
import { CursorProvider } from "../hooks/use-cursor";
import { ThemeSync } from "../components/ThemeSync";
import { Toaster } from "../components/ui/sonner";
import { NavigationProgress } from "../components/NavigationProgress";
import { PageTransition } from "../components/PageTransition";
import { InteractiveCursor } from "../components/ui/InteractiveCursor";
import { CookieConsent } from "../components/CookieConsent";
import { TourProvider, TourTrigger } from "../components/ProductTour";
import { HelmetProvider } from "react-helmet-async";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <MotionPrefProvider>
            <CursorProvider>
              <AuthProvider>
                <FeatureProvider>
                  <TourProvider>
                    <ThemeSync />
                    <NavigationProgress />
                    <InteractiveCursor />
                    <PageTransition>
                      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                      <Outlet />
                    </PageTransition>
                    <TourTrigger />
                    <Toaster richColors position="top-right" />
                    <CookieConsent />
                    <SpeedInsights />
                    <Analytics />
                  </TourProvider>
                </FeatureProvider>
              </AuthProvider>
            </CursorProvider>
          </MotionPrefProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
