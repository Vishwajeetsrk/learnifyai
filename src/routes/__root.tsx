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
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center space-y-6">
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-primary/5 flex items-center justify-center">
            <span className="text-6xl font-black text-primary/30 select-none">?</span>
          </div>
        </div>
        <div>
          <h1 className="text-8xl font-black tracking-tighter text-foreground">404</h1>
          <h2 className="mt-3 text-2xl font-bold text-foreground">Page not found</h2>
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
          <a href="mailto:support@learnify.ai" className="text-primary underline underline-offset-2">
            support@learnify.ai
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
          <a href="mailto:support@learnify.ai" className="text-primary underline underline-offset-2">
            support@learnify.ai
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
        content: "https://learnifyaitool.vercel.app/assets/learnify-logo-DVspKPzy.png",
      },
      { property: "og:url", content: "https://learnifyaitool.vercel.app" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@LearnifyAI" },
      {
        name: "twitter:image",
        content: "https://learnifyaitool.vercel.app/assets/learnify-logo-DVspKPzy.png",
      },
    ],
    links: [
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
    ],
    scripts: [
      {
        children: `(function(){try{var m=localStorage.getItem('ui.mode')||'system';var c=localStorage.getItem('ui.color')||'indigo';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;if(d)r.classList.add('dark');if(c&&c!=='indigo')r.setAttribute('data-theme',c);r.classList.add('no-theme-transition');setTimeout(function(){r.classList.remove('no-theme-transition')},0);}catch(e){}})();`,
      },
      {
        children: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})});}`,
      },
      {
        children: `(function(){var m=document.createElement('meta');m.name='theme-color';m.content='#6366f1';document.head.appendChild(m);})();`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Learnify AI",
          url: "https://learnifyaitool.vercel.app",
          logo: "https://learnifyaitool.vercel.app/assets/learnify-logo-DVspKPzy.png",
          description:
            "The AI-native learning OS: intelligent tutoring, creator economy, gamification, and career growth.",
          sameAs: [],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "hello@learnify.ai",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Learnify AI",
          url: "https://learnifyaitool.vercel.app",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://learnifyaitool.vercel.app/courses?search={search_term_string}",
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
  return (
    <html lang="en" suppressHydrationWarning>
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

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MotionPrefProvider>
          <CursorProvider>
            <AuthProvider>
              <FeatureProvider>
                <ThemeSync />
                <NavigationProgress />
                <InteractiveCursor />
                <PageTransition>
                  {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                  <Outlet />
                </PageTransition>
                <Toaster richColors position="top-right" />
                <CookieConsent />
              </FeatureProvider>
            </AuthProvider>
          </CursorProvider>
        </MotionPrefProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
