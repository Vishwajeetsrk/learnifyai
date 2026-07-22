import { useLocation, useNavigate, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  Briefcase,
  ArrowLeft,
  Tag,
  Settings,
  X,
  Eye,
  Award,
  HelpCircle,
  Send,
  FileText,
  GitBranch,
  Percent,
  ShieldCheck,
  Users,
  RefreshCw,
  Globe,
  ImageIcon,
  Sparkles,
  Menu,
  Layout,
  Layers,
  BarChart3,
  FolderTree,
  LayoutTemplate,
  Upload,
} from "lucide-react";
import {
  CertificateRender,
  DEFAULT_DESIGN,
  FONT_OPTIONS,
  BORDER_STYLES,
  CORNER_STYLES,
  BACKGROUND_PATTERNS,
  LAYOUTS,
  type CertDesign,
} from "@/components/CertificateDesign";
import { CertificateFullPreviewDialog } from "@/components/CertificateFullPreviewDialog";
import { Maximize2, GripVertical, PlayCircle } from "lucide-react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { getCleanBannerUrl, cn } from "@/lib/utils";
import { savePlan, deletePlan, syncPlanToCashfree } from "@/lib/subscription.functions";
import {
  adminContentAction,
  adminContentUpsert,
  adminContentQuery,
  cleanupTestEvents,
  cleanDuplicateSiteSettings,
} from "@/lib/admin-content.functions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FeaturesManager from "@/components/admin/FeaturesManager";
import PageManager from "@/components/admin/PageManager";
import MediaLibrary from "@/components/admin/MediaLibrary";
import FeaturesCatalog from "@/components/admin/FeaturesCatalog";
import MenuManager from "@/components/admin/MenuManager";
import BlogManager from "@/components/admin/BlogManager";
const DesignProjectsManager = lazy(() => import("@/components/admin/DesignProjectsManager"));
const CouponManager = lazy(() => import("@/components/admin/CouponManager"));
const InvoiceDesigner = lazy(() => import("@/components/admin/InvoiceDesigner"));
import { CertDesignerAdmin } from "@/components/certificate-designer/CertDesignerAdmin";

const AVATAR_URLS = {
  rishabh: "/avatars/Rishabh-Sharma.png",
  anjali: "/avatars/Anjali-Verma.png",
  priya: "/avatars/Priya-Kapoor.png",
  vikram: "/avatars/Vikram-Singh.png",
};

// Heavy admin panels — code-split so initial admin page paints fast.
const IssueCertificate = lazy(() => import("@/components/admin/IssueCertificate"));

function LazyFallback() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}

const SITE_LOGO_URL = "/favicon.ico";

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  location: string | null;
  rsvp_url: string | null;
  image_url: string | null;
};

type JobRow = {
  id: string;
  title: string;
  team: string;
  location: string;
  description: string | null;
  apply_url: string | null;
  active: boolean;
  closes_at: string | null;
};

type SectionEntry = { title: string; tab: string };

const SECTION_TOURS: Record<string, { what: string; how: string; where: string }> = {
  events: {
    what: "Create and manage events for the community — workshops, webinars, meetups, and conferences.",
    how: "Click 'Add Event' to create a new one. Fill in title, date, location, and optional image. Edit or delete existing events from the list.",
    where:
      "Events appear on the Events page and the Dashboard in the Upcoming Events section. Public events are visible to all logged-in users.",
  },
  jobs: {
    what: "Post job openings from partner companies directly on the platform for students and alumni.",
    how: "Click 'Add Job' and fill in title, team, location, and apply URL. Toggle active/inactive to control visibility.",
    where:
      "Jobs appear on the Careers page and the Dashboard in the Latest Jobs section. Active jobs are visible to all logged-in users.",
  },
  "design-projects": {
    what: "Manage design templates and projects for the Template Mastery Studio.",
    how: "Add or edit projects, providing course modules and architecture node JSON structures.",
    where: "Projects appear in the Template Mastery section, gated by the Career Pro subscription.",
  },
  pricing: {
    what: "Manage subscription plans (Free, Pro, Career Pro, Enterprise), pricing tiers, and plan features for the platform.",
    how: "Edit plan name, price, description, and toggle features. Use the 'Sync to Cashfree' button to push changes to the payment gateway.",
    where:
      "Pricing plans are displayed on the Pricing page. Changes take effect immediately for new subscriptions.",
  },
  site: {
    what: "Configure global site settings — AI credits per plan, referral bonuses, and platform-wide configuration.",
    how: "Adjust credit amounts, referral rewards, and toggle features like AI tutor or playground access.",
    where: "Site settings apply globally across the entire platform. Changes affect all users.",
  },
  "cert-templates": {
    what: "Design and manage certificate templates with custom text, colors, fonts, borders, and backgrounds.",
    how: "Use the visual editor to customize each template. Live preview updates in real-time. Add elements like logos, signatures, and student details.",
    where:
      "Certificate templates are used when issuing certificates to students. They appear as options in the 'Issue Cert' section.",
  },
  "issue-cert": {
    what: "Issue certificates to students individually or in bulk. Upload a CSV to issue to multiple students at once.",
    how: "Use the single-issue form to award a certificate to one student, or upload a CSV file with name/email/course columns for bulk issuance.",
    where:
      "Students see issued certificates on their Certificates page. Each certificate has a unique verification link they can share on LinkedIn.",
  },
  faqs: {
    what: "Manage the FAQ section displayed on the Pricing page. Organize questions by category.",
    how: "Click 'Add FAQ' to create a new question-answer pair. Group them under categories like Plans, Billing, Features. Edit or reorder as needed.",
    where:
      "FAQs appear on the Pricing page organized by category tabs. They help users find answers to common questions.",
  },
  pages: {
    what: "Create and manage custom legal and informational pages like Privacy Policy, Terms of Service, Refund Policy, and About Us.",
    how: "Click 'Add Page' to create a new page with a rich text editor. Support for dynamic variables like {{company_name}} and {{email}}.",
    where: "Custom pages are linked in the footer and other public areas of the site.",
  },
  roadmap: {
    what: "Manage the public product roadmap showing upcoming features, in-progress work, and shipped items.",
    how: "Add roadmap items with title, description, status (planned, in-progress, shipped), and category. Drag to reorder within each status column.",
    where:
      "The roadmap is displayed on the Roadmap page visible to all users. It helps communicate product direction.",
  },
  coupons: {
    what: "Create and manage discount coupons for subscriptions. Set discount percentage, max uses, and expiry.",
    how: "Click 'Add Coupon' to generate a coupon code. Set discount type (percentage or flat), max redemptions, and expiration date. Copy coupon code to share.",
    where:
      "Coupons are applied at checkout on the Pricing page. Users enter the code to get the discount.",
  },
  community: {
    what: "Create and manage community groups for focused discussions. Each group has its own feed and members.",
    how: "Click 'Add Group' to create a new community group. Set name, description, cover image, and privacy settings. Monitor active members and posts.",
    where:
      "Community groups appear on the Community page. Users can join groups and participate in discussions.",
  },
  features: {
    what: "Toggle feature visibility across the platform. Enable, disable, or set maintenance mode for any feature.",
    how: "Use the switches to enable/disable features. Toggle maintenance mode to show a maintenance banner. Changes take effect immediately.",
    where:
      "Feature visibility affects the entire platform — nav items, routes, and feature access.",
  },
  blog: {
    what: "Write and publish blog posts. Manage the blog with markdown editor, featured images, and publish controls.",
    how: "Click 'New Post' to write a blog post. Set title, slug, excerpt, featured image, and publish date. Toggle published status to go live.",
    where:
      "Blog posts appear on the public Blog page at /blog. Recent posts are also highlighted on the Dashboard.",
  },
  "wcms-pages": {
    what: "Build custom landing pages using the drag-and-drop WCMS (Web Content Management System) page builder.",
    how: "Click 'Add Page' to create a new page. Use the visual builder to add sections, rows, and content blocks. Preview before publishing.",
    where:
      "WCMS pages are served at their configured URL paths. They support custom layouts beyond standard routes.",
  },
  "wcms-media": {
    what: "Upload and manage media files — images, SVGs, PDFs, and documents used across the platform.",
    how: "Upload files by clicking the upload area or drag-and-drop. Files are organized by type. Click to copy the URL or delete unwanted files.",
    where:
      "Media library items can be used in WCMS pages, blog posts, email templates, and anywhere content is edited.",
  },
  "wcms-features": {
    what: "Create and manage feature cards showcasing platform capabilities, used on landing pages and marketing sections.",
    how: "Add features with icon, title, description, and optional link. Drag to reorder. Toggle visibility per feature.",
    where:
      "Features appear on WCMS pages through the Features Section block. They highlight platform capabilities.",
  },
  "wcms-menus": {
    what: "Build and manage navigation menus for the site header and footer with custom links.",
    how: "Add menu items with custom labels and URLs. Drag to reorder. Support for nested sub-menus and separator items.",
    where:
      "Menus are rendered in the site header (top navigation) and footer based on the configured menu location.",
  },
  "wcms-sections": {
    what: "Manage reusable WCMS content sections that can be embedded across multiple pages.",
    how: "Create sections with the visual builder. Use them in any WCMS page by selecting from the sections library. Updates sync everywhere.",
    where:
      "Sections are reusable blocks that can appear on any WCMS page. Great for headers, CTAs, and recurring content patterns.",
  },
};

const TAB_LABELS: Record<string, string> = {
  events: "Events",
  jobs: "Jobs",
  "design-projects": "Design Projects",
  pricing: "Pricing",
  site: "Site",
  "cert-templates": "Certificates",
  "issue-cert": "Bulk Issue",
  faqs: "FAQs",
  pages: "Pages",
  roadmap: "Roadmap",
  coupons: "Coupons",
  community: "Community Groups",
  features: "Visibility",
  blog: "Blog",
  "wcms-pages": "WCMS Pages",
  "wcms-media": "Media Library",
  "wcms-features": "Features Catalog",
  "wcms-menus": "Menus",
  "wcms-sections": "Sections",
  "promo-banner": "Promo Banner",
};

export default function AdminContentPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showTour, setShowTour] = useState<string | null>(null);
  const requestedTab = (() => {
    const search = location.search as unknown;
    if (search && typeof search === "object" && "tab" in search)
      return String((search as { tab?: unknown }).tab ?? "");
    if (typeof window !== "undefined")
      return new URLSearchParams(window.location.search).get("tab") ?? "";
    return "";
  })();
  const tabAlias =
    (
      {
        templates: "cert-templates",
        certificate: "cert-templates",
        certificates: "cert-templates",
      } as Record<string, string>
    )[requestedTab] ?? requestedTab;
  const tabFromUrl = [
    "events",
    "jobs",
    "design-projects",
    "pricing",
    "site",
    "cert-templates",
    "issue-cert",
    "faqs",
    "pages",
    "roadmap",
    "coupons",
    "community",
    "features",
    "wcms-pages",
    "wcms-media",
    "wcms-features",
    "wcms-menus",
    "blog",
    "wcms-sections",
    "promo-banner",
    "invoice-designer",
  ].includes(tabAlias)
    ? tabAlias
    : "events";
  const [tab, setTab] = useState(tabFromUrl || "events");

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/dashboard" });
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    setTab(tabFromUrl || "events");
  }, [tabFromUrl]);

  if (loading || !isAdmin) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold">Content Manager</h1>
              <button
                onClick={() => setShowTour(showTour === tab ? null : tab)}
                className="h-7 w-7 rounded-full border border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors flex items-center justify-center text-xs font-bold"
                title={`About ${TAB_LABELS[tab] || tab}`}
              >
                ?
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage events, jobs, pricing, FAQs, pages, roadmaps, coupons, community groups,
              certificate templates, feature visibility, page builder, media library, features
              catalog, and navigation menus — all in one place.
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left navigation sidebar */}
            <div className="col-span-1 md:col-span-3 space-y-4 bg-card/65 backdrop-blur-md rounded-2xl border p-4 shadow-sm md:sticky md:top-24">
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
                Content Menu
              </h2>
              
              {/* Mobile quick-select dropdown */}
              <div className="block md:hidden">
                <Select value={tab} onValueChange={setTab}>
                  <SelectTrigger className="w-full bg-card">
                    <SelectValue placeholder="Select Tab" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="jobs">Jobs</SelectItem>
                    <SelectItem value="design-projects">Design Projects</SelectItem>
                    <SelectItem value="pricing">Pricing Tiers</SelectItem>
                    <SelectItem value="site">Site Settings</SelectItem>
                    <SelectItem value="demo-video">Demo Video</SelectItem>
                    <SelectItem value="cert-templates">Certificates</SelectItem>
                    <SelectItem value="faqs">FAQs</SelectItem>
                    <SelectItem value="pages">Pages</SelectItem>
                    <SelectItem value="roadmap">Roadmap</SelectItem>
                    <SelectItem value="coupons">Coupons</SelectItem>
                    <SelectItem value="community">Community Groups</SelectItem>
                    <SelectItem value="features">Feature Visibility</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="wcms-pages">WCMS Pages</SelectItem>
                    <SelectItem value="wcms-media">Media Library</SelectItem>
                    <SelectItem value="wcms-features">Features Catalog</SelectItem>
                    <SelectItem value="wcms-menus">Navigation Menus</SelectItem>
                    <SelectItem value="promo-banner">Promo Banner</SelectItem>
                    <SelectItem value="invoice-designer">Invoice Designer</SelectItem>
                    <SelectItem value="wcms-sections">Sections</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop categorized list */}
              <div className="hidden md:flex flex-col gap-4">
                {/* Category 1: Core Content */}
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/70 px-2 py-1 flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-indigo-500" />
                    Core Content
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { id: "events", label: "Events", icon: CalendarIcon },
                      { id: "jobs", label: "Jobs", icon: Briefcase },
                      { id: "design-projects", label: "Design Projects", icon: FolderTree },
                      { id: "faqs", label: "FAQs", icon: HelpCircle },
                      { id: "coupons", label: "Coupons", icon: Percent },
                      { id: "community", label: "Groups", icon: Users },
                      { id: "blog", label: "Blog", icon: FileText },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = tab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTab(item.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition text-left cursor-pointer",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category 2: Page Builder */}
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/70 px-2 py-1 flex items-center gap-1.5">
                    <Globe className="h-3 w-3 text-sky-500" />
                    Page Builder
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { id: "wcms-pages", label: "WCMS Pages", icon: Globe },
                      { id: "wcms-sections", label: "Sections", icon: Layers },
                      { id: "wcms-menus", label: "Menus", icon: Menu },
                      { id: "wcms-features", label: "Features Catalog", icon: Sparkles },
                      { id: "promo-banner", label: "Promo Banner", icon: Tag },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = tab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTab(item.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition text-left cursor-pointer",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category 3: Credentials */}
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/70 px-2 py-1 flex items-center gap-1.5">
                    <Award className="h-3 w-3 text-emerald-500" />
                    Credentials
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { id: "cert-templates", label: "Certificates", icon: Award },
                      { id: "invoice-designer", label: "Invoice Designer", icon: FileText },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = tab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTab(item.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition text-left cursor-pointer",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category 4: Settings & Operations */}
                <div className="space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/70 px-2 py-1 flex items-center gap-1.5">
                    <Settings className="h-3 w-3 text-amber-500" />
                    Settings & Operations
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {[
                      { id: "pricing", label: "Pricing Tiers", icon: Tag },
                      { id: "site", label: "Site Settings", icon: Settings },
                      { id: "features", label: "Visibility", icon: Eye },
                      { id: "demo-video", label: "Demo Video", icon: PlayCircle },
                      { id: "wcms-media", label: "Media Library", icon: ImageIcon },
                      { id: "pages", label: "Custom Pages", icon: FileText },
                      { id: "roadmap", label: "Product Roadmap", icon: GitBranch },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = tab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTab(item.id)}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition text-left cursor-pointer",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side container */}
            <div className="col-span-1 md:col-span-9 bg-card border rounded-2xl p-6 shadow-sm min-h-[500px]">
              <TabsContent value="events" className="mt-0">
                <EventsManager />
              </TabsContent>
              <TabsContent value="jobs" className="mt-0">
                <JobsManager />
              </TabsContent>
              <TabsContent value="design-projects" className="mt-0">
                <Suspense fallback={<LazyFallback />}>
                  <DesignProjectsManager />
                </Suspense>
              </TabsContent>
              <TabsContent value="pricing" className="mt-0">
                <PricingManager />
              </TabsContent>
              <TabsContent value="site" className="mt-0">
                <SiteSettingsManager />
              </TabsContent>
              <TabsContent value="demo-video" className="mt-0">
                <DemoVideoManager />
              </TabsContent>
              <TabsContent value="cert-templates" className="mt-0">
                <CertDesignerAdmin />
              </TabsContent>
              <TabsContent value="faqs" className="mt-0">
                <FaqsManager />
              </TabsContent>
              <TabsContent value="pages" className="mt-0">
                <PagesManager />
              </TabsContent>
              <TabsContent value="roadmap" className="mt-0">
                <RoadmapManager />
              </TabsContent>
              <TabsContent value="coupons" className="mt-0">
                <Suspense fallback={<LazyFallback />}>
                  <CouponManager />
                </Suspense>
              </TabsContent>
              <TabsContent value="invoice-designer" className="mt-0">
                <Suspense fallback={<LazyFallback />}>
                  <InvoiceDesigner />
                </Suspense>
              </TabsContent>
              <TabsContent value="community" className="mt-0">
                <CohortsManager />
              </TabsContent>
              <TabsContent value="features" className="mt-0">
                <FeaturesManager />
              </TabsContent>
              <TabsContent value="wcms-pages" className="mt-0">
                <div className="flex items-center justify-end mb-2">
                  <div className="w-20 h-20">
                    <img
                      src="/illustrations/Web_Designing.svg"
                      alt=""
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                </div>
                <PageManager />
              </TabsContent>
              <TabsContent value="wcms-media" className="mt-0">
                <MediaLibrary />
              </TabsContent>
              <TabsContent value="wcms-features" className="mt-0">
                <FeaturesCatalog />
              </TabsContent>
              <TabsContent value="wcms-menus" className="mt-0">
                <MenuManager />
              </TabsContent>
              <TabsContent value="promo-banner" className="mt-0">
                <PromoBannerManager />
              </TabsContent>
              <TabsContent value="wcms-sections" className="mt-0">
                <SectionsManager />
              </TabsContent>
              <TabsContent value="blog" className="mt-0">
                <Suspense fallback={<LazyFallback />}>
                  <BlogManager />
                </Suspense>
              </TabsContent>
            </div>
          </div>
        </Tabs>

        {/* Tour Popup */}
        {showTour && SECTION_TOURS[showTour] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowTour(null)}
          >
            <div
              className="bg-background rounded-2xl border shadow-2xl max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{TAB_LABELS[showTour] || showTour}</h3>
                <button
                  onClick={() => setShowTour(null)}
                  className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                  <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4" /> What is this?
                  </h4>
                  <p className="text-sm text-muted-foreground">{SECTION_TOURS[showTour].what}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                  <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                    <ArrowLeft className="h-4 w-4 rotate-45" /> How to use?
                  </h4>
                  <p className="text-sm text-muted-foreground">{SECTION_TOURS[showTour].how}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                  <h4 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
                    <Eye className="h-4 w-4" /> Where it shows?
                  </h4>
                  <p className="text-sm text-muted-foreground">{SECTION_TOURS[showTour].where}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

// ─────────────────────────── Events ───────────────────────────

function EventsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [brokenEvents, setBrokenEvents] = useState<Set<string>>(new Set());
  const doAdminAction = useServerFn(adminContentAction);
  const doQuery = useServerFn(adminContentQuery);
  const doCleanupTestEvents = useServerFn(cleanupTestEvents);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const result = await doQuery({
        data: { table: "events", orderBy: "starts_at", ascending: true },
      });
      return (result ?? []) as unknown as EventRow[];
    },
  });

  const newEvent = () => {
    setEditing({
      id: "",
      title: "",
      description: "",
      starts_at: new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 16),
      location: "",
      rsvp_url: "",
      image_url: "",
    });
    setOpen(true);
  };

  const seedDefaultEvents = async () => {
    const defaults = [
      {
        title: "Next.js 15 & React 19 Live Workshop",
        description: "Build full-stack AI SaaS apps with TanStack Start, React 19, Supabase, and Cashfree payments.",
        starts_at: new Date("2026-08-15T18:00:00Z").toISOString(),
        location: "Online (Discord Live Channel)",
        rsvp_url: "https://discord.gg/learnifyai",
        image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "AI Creators Panel & AMA Session",
        description: "Live Q&A with top AI course creators, prompt engineers, and tech coaches on Learnify AI.",
        starts_at: new Date("2026-08-22T18:00:00Z").toISOString(),
        location: "Online (Zoom Webinar Room)",
        rsvp_url: "https://zoom.us/j/learnifyai",
        image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      },
      {
        title: "Bangalore Creator & Coach Meetup",
        description: "In-person networking, live lightning talks, and hands-on AI prompt engineering demos.",
        starts_at: new Date("2026-08-29T10:00:00Z").toISOString(),
        location: "Innov8 Koramangala, Bangalore",
        rsvp_url: "https://www.learnifyai.in/events",
        image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
      },
    ];

    try {
      for (const d of defaults) {
        await doAdminAction({ data: { table: "events", action: "insert", data: d } });
      }
      toast.success("Default events seeded successfully!");
      qc.invalidateQueries({ queryKey: ["admin-events"] });
      qc.invalidateQueries({ queryKey: ["events-public"] });
    } catch (e: any) {
      toast.error(e?.message || "Seeding failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Manage live workshops, AMAs, and tech meetups.</p>
        <div className="flex gap-2">
          {events.length === 0 && (
            <Button variant="outline" size="sm" onClick={seedDefaultEvents}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Seed Default Events
            </Button>
          )}
          {events.some((e) => e.title?.startsWith("Test Event")) && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const result = await doCleanupTestEvents({ data: undefined });
                if (result?.deleted) {
                  toast.success(`Deleted ${result.deleted} test events`);
                  qc.invalidateQueries({ queryKey: ["admin-events"] });
                }
              }}
            >
              Clean up test events
            </Button>
          )}
          <Button onClick={newEvent}>
            <Plus className="h-4 w-4 mr-2" />
            New event
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl space-y-3">
          <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold">No events in database yet</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click 'Seed Default Events' to populate initial live workshops and meetups.
          </p>
          <Button size="sm" onClick={seedDefaultEvents}>
            Seed Default Events
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center gap-3"
            >
              {e.image_url && !brokenEvents.has(e.id) ? (
                <img
                  src={getCleanBannerUrl(e.image_url) ?? e.image_url}
                  alt=""
                  className="h-14 w-20 rounded-md object-cover shrink-0"
                  loading="lazy"
                  decoding="async"
                  onError={() => setBrokenEvents((p) => new Set(p).add(e.id))}
                />
              ) : (
                <div className="h-14 w-20 rounded-md bg-muted grid place-items-center shrink-0">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{e.title}</div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                  <span>{format(new Date(e.starts_at), "PPp")}</span>
                  {e.location && <span>· {e.location}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(e);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(e.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <EventDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        event={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-events"] });
          qc.invalidateQueries({ queryKey: ["events-public"] });
        }}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => {
          if (!v) setDeleteId(null);
        }}
      >
        <AlertDialogContent className="max-w-sm">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-7 w-7 text-destructive" />
            </div>
            <div className="text-center space-y-1">
              <AlertDialogTitle className="text-lg">Delete this event?</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground">
                This action cannot be undone. The event will be permanently removed from the site.
              </AlertDialogDescription>
            </div>
          </div>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={async () => {
                const id = deleteId;
                if (!id) return;
                try {
                  await doAdminAction({ data: { table: "events", action: "delete", id } });
                  toast.success("Event deleted");
                  qc.invalidateQueries({ queryKey: ["admin-events"] });
                  qc.invalidateQueries({ queryKey: ["events-public"] });
                } catch (err: any) {
                  toast.error(err?.message || "Delete failed");
                } finally {
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EventDialog({
  open,
  onOpenChange,
  event,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event: EventRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<EventRow | null>(event);
  const [saving, setSaving] = useState(false);
  const doAdminAction = useServerFn(adminContentAction);

  useEffect(() => {
    setForm(event);
  }, [event]);

  if (!form) return null;

  const save = async () => {
    if (!form.title.trim() || !form.starts_at) {
      toast.error("Title and date are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description?.trim() || null,
      starts_at: new Date(form.starts_at).toISOString(),
      location: form.location?.trim() || null,
      rsvp_url: form.rsvp_url?.trim() || null,
      image_url: form.image_url?.trim() || null,
    };
    try {
      if (form.id) {
        await doAdminAction({
          data: { table: "events", action: "update", id: form.id, data: payload },
        });
      } else {
        await doAdminAction({ data: { table: "events", action: "insert", data: payload } });
      }
    } catch (e: any) {
      setSaving(false);
      console.error("[EventsManager] Save error:", e);
      return toast.error(e?.message || "Save failed");
    }
    setSaving(false);
    toast.success(form.id ? "Event updated" : "Event created");
    onSaved();
    onOpenChange(false);
  };

  const localValue = (() => {
    try {
      return format(new Date(form.starts_at), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit event" : "New event"}</DialogTitle>
          <DialogDescription>Public on the /events page until 24h after start.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date & time</Label>
              <Input
                type="datetime-local"
                value={localValue}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location ?? ""}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Online · Zoom"
              />
            </div>
          </div>
          <div>
            <Label>RSVP URL</Label>
            <Input
              value={form.rsvp_url ?? ""}
              onChange={(e) => setForm({ ...form, rsvp_url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Cover image URL</Label>
            <Input
              value={form.image_url ?? ""}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://... (banner shown on dashboard)"
            />
            {form.image_url ? (
              <img
                src={getCleanBannerUrl(form.image_url) ?? form.image_url}
                alt=""
                className="mt-2 h-24 w-full rounded-md object-cover border"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────── Jobs ───────────────────────────

function JobsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<JobRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const doAdminAction = useServerFn(adminContentAction);
  const doQuery = useServerFn(adminContentQuery);

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const result = await doQuery({
        data: { table: "job_postings", orderBy: "created_at", ascending: false },
      });
      return (result ?? []) as unknown as JobRow[];
    },
  });

  const newJob = () => {
    setEditing({
      id: "",
      title: "",
      team: "Engineering",
      location: "Remote · India",
      description: "",
      apply_url: "",
      active: true,
      closes_at: null,
    });
    setOpen(true);
  };

  const removeJob = async () => {
    if (!deleteId) return;
    try {
      await doAdminAction({ data: { table: "job_postings", action: "delete", id: deleteId } });
    } catch (e: any) {
      return toast.error(e?.message || "Delete failed");
    }
    toast.success("Job deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    qc.invalidateQueries({ queryKey: ["dashboard-jobs"] });
    qc.invalidateQueries({ queryKey: ["jobs-public"] });
  };

  const seedDefaultJobs = async () => {
    const defaults = [
      {
        title: "Senior Full-Stack AI Engineer",
        team: "Engineering",
        location: "Remote · India / Global",
        description: "Build production AI agent orchestration platforms, Supabase real-time pipelines, and TanStack Start UI features.",
        apply_url: "https://www.learnifyai.in/careers",
        active: true,
      },
      {
        title: "AI Course Creator & Technical Educator",
        team: "Content & Curriculum",
        location: "Remote · India",
        description: "Design cutting-edge course curriculum, code playgrounds, and interactive workshops for modern software engineers.",
        apply_url: "https://www.learnifyai.in/apply-creator",
        active: true,
      },
      {
        title: "Developer Relations & Community Advocate",
        team: "Community",
        location: "Bangalore, KA / Hybrid",
        description: "Engage with educators, host live Discord webinars, run hackathons, and support creator growth on Learnify AI.",
        apply_url: "https://www.learnifyai.in/community",
        active: true,
      },
    ];

    try {
      for (const d of defaults) {
        await doAdminAction({ data: { table: "job_postings", action: "insert", data: d } });
      }
      toast.success("Default job postings seeded!");
      qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      qc.invalidateQueries({ queryKey: ["jobs-public"] });
    } catch (e: any) {
      toast.error(e?.message || "Seeding failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Manage open career roles and job postings.</p>
        <div className="flex gap-2">
          {jobs.length === 0 && (
            <Button variant="outline" size="sm" onClick={seedDefaultJobs}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Seed Default Jobs
            </Button>
          )}
          <Button onClick={newJob}>
            <Plus className="h-4 w-4 mr-2" />
            New job
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl space-y-3">
          <Briefcase className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold">No open jobs in database yet</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click 'Seed Default Jobs' to populate initial career roles.
          </p>
          <Button size="sm" onClick={seedDefaultJobs}>
            Seed Default Jobs
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-semibold truncate flex items-center gap-2">
                  {j.title}
                  {!j.active && (
                    <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                      Closed
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {j.team} · {j.location}
                  {j.closes_at && <> · closes {format(new Date(j.closes_at), "PP")}</>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(j);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(j.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <JobDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        job={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-jobs"] });
          qc.invalidateQueries({ queryKey: ["dashboard-jobs"] });
          qc.invalidateQueries({ queryKey: ["jobs-public"] });
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeJob}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function JobDialog({
  open,
  onOpenChange,
  job,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  job: JobRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<JobRow | null>(job);
  const [saving, setSaving] = useState(false);
  const doAdminAction = useServerFn(adminContentAction);

  useEffect(() => {
    setForm(job);
  }, [job]);

  if (!form) return null;

  const save = async () => {
    if (!form.title.trim() || !form.team.trim() || !form.location.trim()) {
      toast.error("Title, team, and location are required");
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      team: form.team.trim(),
      location: form.location.trim(),
      description: form.description?.trim() || null,
      apply_url: form.apply_url?.trim() || null,
      active: form.active,
      closes_at: form.closes_at ? new Date(form.closes_at).toISOString() : null,
    };
    try {
      if (form.id) {
        await doAdminAction({
          data: { table: "job_postings", action: "update", id: form.id, data: payload },
        });
      } else {
        await doAdminAction({ data: { table: "job_postings", action: "insert", data: payload } });
      }
    } catch (e: any) {
      setSaving(false);
      console.error("[JobsManager] Save error:", e);
      return toast.error(e?.message || "Save failed");
    }
    setSaving(false);
    toast.success(form.id ? "Job updated" : "Job created");
    onSaved();
    onOpenChange(false);
  };

  const closesLocal = form.closes_at
    ? (() => {
        try {
          return format(new Date(form.closes_at!), "yyyy-MM-dd'T'HH:mm");
        } catch {
          return "";
        }
      })()
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit job" : "New job"}</DialogTitle>
          <DialogDescription>Public on the /careers page while active.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Team</Label>
              <Input
                value={form.team}
                onChange={(e) => setForm({ ...form, team: e.target.value })}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Apply URL</Label>
            <Input
              value={form.apply_url ?? ""}
              onChange={(e) => setForm({ ...form, apply_url: e.target.value })}
              placeholder="mailto:careers@learnify.ai or https://..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <Label>Auto-close on</Label>
              <Input
                type="datetime-local"
                value={closesLocal}
                onChange={(e) => setForm({ ...form, closes_at: e.target.value || null })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              <Label className="cursor-pointer">Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────── Pricing Plans ───────────────────────────

type PlanRow = {
  id: string;
  name: string;
  price_label: string;
  description: string | null;
  features: string[];
  cta_label: string;
  cta_to: string;
  highlighted: boolean;
  order_index: number;
  active: boolean;
  price_inr: number;
  yearly_price?: number | null;
  interval: string | null;
  ai_credits_monthly: number;
  max_courses: number;
  badge: string | null;
  color: string | null;
  cashfree_plan_id: string | null;
};

function PricingManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<PlanRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const doSavePlan = useServerFn(savePlan);
  const doDeletePlan = useServerFn(deletePlan);
  const doSyncPlan = useServerFn(syncPlanToCashfree);
  const doQuery = useServerFn(adminContentQuery);
  const doAdminAction = useServerFn(adminContentAction);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["admin-plans"],
    queryFn: async () => {
      const result = await doQuery({
        data: { table: "pricing_plans", orderBy: "order_index", ascending: true },
      });
      return ((result ?? []) as unknown as any[]).map((p: any) => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : [],
      })) as PlanRow[];
    },
  });

  const newPlan = () => {
    setEditing({
      id: "",
      name: "",
      price_label: "Free",
      description: "",
      features: [],
      cta_label: "Get started",
      cta_to: "/signup",
      highlighted: false,
      order_index: (plans.length + 1) * 10,
      active: true,
      price_inr: 0,
      yearly_price: null,
      interval: "month",
      ai_credits_monthly: 0,
      max_courses: -1,
      badge: "",
      color: "",
      cashfree_plan_id: null,
    });
    setOpen(true);
  };

  const removePlan = async () => {
    if (!deleteId) return;
    try {
      await doDeletePlan({ data: { planId: deleteId } });
      toast.success("Plan deleted");
      setDeleteId(null);
      qc.invalidateQueries({ queryKey: ["admin-plans"] });
      qc.invalidateQueries({ queryKey: ["pricing-plans"] });
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    }
  };

  const seedDefaultPlans = async () => {
    const defaults = [
      {
        name: "Free",
        price_label: "Free",
        price_inr: 0,
        yearly_price: null,
        interval: null,
        ai_credits_monthly: 500,
        max_courses: 3,
        description: "1–3 free courses, limited daily AI credits, community access.",
        features: [
          "1–3 free courses",
          "Limited daily AI credits",
          "Community access",
          "Basic progress tracking",
          "Basic certificates",
          "Email support",
          "500 AI credits / month",
          "Course notes & summaries",
          "Basic quiz access",
        ],
        cta_label: "Get Started Free",
        cta_to: "/signup",
        highlighted: false,
        order_index: 10,
        active: true,
        badge: null,
        color: "#2563EB",
        cashfree_plan_id: null,
      },
      {
        name: "Pro",
        price_label: "₹199/mo",
        price_inr: 199,
        yearly_price: 1990,
        interval: "month",
        ai_credits_monthly: 10000,
        max_courses: -1,
        description:
          "Casual learners — full course library, higher AI credit cap, notes & flashcards.",
        features: [
          "Full course library",
          "Higher AI credit cap",
          "Notes & flashcards",
          "Unlimited courses",
          "Advanced AI tutor",
          "All certificates",
          "Download resources",
          "Community challenges",
          "Priority support",
          "10,000 AI credits / month",
        ],
        cta_label: "Start Pro",
        cta_to: "/signup?plan=pro",
        highlighted: true,
        order_index: 20,
        active: true,
        badge: "Most Popular",
        color: "#6366F1",
        cashfree_plan_id: null,
      },
      {
        name: "Career Pro",
        price_label: "₹499/mo",
        price_inr: 499,
        yearly_price: 4990,
        interval: "month",
        ai_credits_monthly: 25000,
        max_courses: -1,
        description:
          "Job-seekers — everything in Pro + Resume / ATS / Interview Prep / Career Roadmap, verified certificates included.",
        features: [
          "Everything in Pro",
          "Resume Builder",
          "ATS Checker",
          "Interview Prep",
          "Career Roadmap",
          "Verified certificates included",
          "Custom certificate templates",
          "Portfolio Builder",
          "LinkedIn Optimizer",
          "Internship Tracker",
          "Career Analytics",
          "Interview recording & playback",
          "Advanced ATS optimization",
          "Skill gap analysis",
          "Project recommendations",
          "Lifetime certificate access",
          "Priority support",
          "25,000 AI credits / month",
        ],
        cta_label: "Become Job Ready",
        cta_to: "/signup?plan=career-pro",
        highlighted: false,
        order_index: 30,
        active: true,
        badge: "Best Value",
        color: "#8B5CF6",
        cashfree_plan_id: null,
      },
      {
        name: "Enterprise",
        price_label: "Custom",
        price_inr: 0,
        yearly_price: null,
        interval: null,
        ai_credits_monthly: 0,
        max_courses: -1,
        description: "Colleges & companies — seats, SSO, admin reporting, custom branding.",
        features: [
          "Everything in Career Pro",
          "Seats",
          "SSO + RBAC",
          "Admin reporting",
          "Custom branding",
          "Admin dashboard",
          "Team management",
          "Bulk enrollment",
          "Attendance tracking",
          "Batch management",
          "White label",
          "Custom domain",
          "Department analytics",
          "Certificate automation",
          "API access",
          "Dedicated support",
        ],
        cta_label: "Book Demo",
        cta_to: "/contact",
        highlighted: false,
        order_index: 40,
        active: true,
        badge: null,
        color: "#7c3aed",
        cashfree_plan_id: null,
      },
    ];
    setSaving(true);
    try {
      const existing = (await doQuery({
        data: { table: "pricing_plans", orderBy: "order_index", ascending: true },
      })) as any[] | null;
      const existingPlans = existing ?? [];
      for (const plan of defaults) {
        const { yearly_price: _yp, ...planData } = plan as any;
        const match = existingPlans.find(
          (p: any) => p.name?.toLowerCase() === plan.name?.toLowerCase(),
        );
        if (match) {
          await doAdminAction({
            data: { table: "pricing_plans", action: "update", id: match.id, data: planData },
          });
        } else {
          await doSavePlan({ data: { plan: planData } });
        }
      }
      toast.success("Default plans seeded!");
      qc.invalidateQueries({ queryKey: ["admin-plans"] });
      qc.invalidateQueries({ queryKey: ["pricing-plans"] });
    } catch (e: any) {
      toast.error(e?.message || "Seed failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={seedDefaultPlans} disabled={saving}>
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          )}
          Seed Default Plans
        </Button>
        <Button onClick={newPlan}>
          <Plus className="h-4 w-4 mr-2" />
          New plan
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No plans yet.</p>
      ) : (
        <div className="space-y-2">
          {plans.map((p) => (
            <div key={p.id} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate flex items-center gap-2">
                    {p.name}{" "}
                    <span className="text-xs text-muted-foreground">· {p.price_label}</span>
                    {p.highlighted && (
                      <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">
                        Featured
                      </span>
                    )}
                    {!p.active && (
                      <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 break-words">
                    {p.interval?.startsWith("month")
                      ? "monthly"
                      : p.interval
                        ? `${p.interval}ly`
                        : "One-time"}{" "}
                    · {p.yearly_price ? `₹${p.yearly_price}/yr · ` : ""}
                    {p.ai_credits_monthly > 0
                      ? `${p.ai_credits_monthly.toLocaleString("en-IN")} AI credits/mo`
                      : "No AI credits"}
                    {p.cashfree_plan_id
                      ? ` · Synced to Cashfree`
                      : p.price_inr > 0 && p.interval
                        ? ` · Not synced`
                        : ` · No recurring billing`}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                  {!p.cashfree_plan_id && p.price_inr > 0 && p.interval && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full"
                      disabled={syncingId === p.id}
                      onClick={async () => {
                        setSyncingId(p.id);
                        try {
                          await doSyncPlan({ data: { planId: p.id } });
                          toast.success(`${p.name} synced to Cashfree`);
                          qc.invalidateQueries({ queryKey: ["admin-plans"] });
                        } catch (e: any) {
                          toast.error(e?.message || "Sync failed");
                        } finally {
                          setSyncingId(null);
                        }
                      }}
                    >
                      {syncingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3.5 w-3.5" />
                      )}
                      <span className="sm:hidden ml-2">Sync</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEditing(p);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 sm:mr-0 mr-2" />{" "}
                    <span className="sm:hidden">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => setDeleteId(p.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:mr-0 mr-2" />{" "}
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PlanDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        plan={editing}
        onSaved={async (form) => {
          try {
            await doSavePlan({ data: { plan: form } });
            toast.success(form.id ? "Plan updated" : "Plan created");
            qc.invalidateQueries({ queryKey: ["admin-plans"] });
            qc.invalidateQueries({ queryKey: ["pricing-plans"] });
            setOpen(false);
            setEditing(null);
          } catch (e: any) {
            toast.error(e?.message || "Failed to save plan");
          }
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete plan?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removePlan}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PlanDialog({
  open,
  onOpenChange,
  plan,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plan: PlanRow | null;
  onSaved: (form: any) => Promise<void>;
}) {
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (plan) {
      setForm({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
      });
    }
  }, [plan]);

  if (!form) return null;

  const save = async () => {
    if (!form.name.trim() || !form.price_label.trim()) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      features: form.features
        .split("\n")
        .map((s: string) => s.trim())
        .filter(Boolean),
    };
    await onSaved(payload);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit plan" : "New plan"}</DialogTitle>
          <DialogDescription>Shown publicly on the /pricing page.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Pro"
              />
            </div>
            <div>
              <Label>Price label</Label>
              <Input
                value={form.price_label}
                onChange={(e) => setForm({ ...form, price_label: e.target.value })}
                placeholder="₹499/mo"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Price INR</Label>
              <Input
                type="number"
                value={form.price_inr}
                onChange={(e) => setForm({ ...form, price_inr: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Yearly price</Label>
              <Input
                type="number"
                value={form.yearly_price ?? ""}
                onChange={(e) =>
                  setForm({ ...form, yearly_price: e.target.value ? Number(e.target.value) : null })
                }
                placeholder="Auto-calculated"
              />
            </div>
            <div>
              <Label>Interval</Label>
              <Select
                value={form.interval || "none"}
                onValueChange={(v) => setForm({ ...form, interval: v === "none" ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>AI credits / mo</Label>
              <Input
                type="number"
                value={form.ai_credits_monthly}
                onChange={(e) =>
                  setForm({ ...form, ai_credits_monthly: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <Label>Max courses (-1 = unlimited)</Label>
              <Input
                type="number"
                value={form.max_courses}
                onChange={(e) => setForm({ ...form, max_courses: Number(e.target.value) || -1 })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Badge</Label>
              <Input
                value={form.badge || ""}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="Most popular"
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                value={form.color || ""}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="#7c3aed"
              />
              <div className="flex gap-2 mt-2">
                {[
                  { hex: "#2563EB", name: "Blue" },
                  { hex: "#6366F1", name: "Indigo" },
                  { hex: "#8B5CF6", name: "Purple" },
                  { hex: "#10B981", name: "Green" },
                  { hex: "#F59E0B", name: "Amber" },
                  { hex: "#EC4899", name: "Pink" },
                  { hex: "#7c3aed", name: "Violet" },
                  { hex: "#0ea5e9", name: "Sky" },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    title={c.name}
                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                      form.color === c.hex
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-110"
                    }`}
                    style={{ background: c.hex }}
                    onClick={() => setForm({ ...form, color: c.hex })}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label>Cashfree Plan ID</Label>
            <Input
              value={form.cashfree_plan_id ?? ""}
              onChange={(e) => setForm({ ...form, cashfree_plan_id: e.target.value || null })}
              placeholder="e.g. plan_xxxxx"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={2}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Features (one per line)</Label>
            <Textarea
              rows={4}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="Unlimited courses&#10;Advanced AI tools&#10;Certificates"
            />
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <Label>Order</Label>
              <Input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.highlighted}
                onCheckedChange={(v) => setForm({ ...form, highlighted: v })}
              />
              <Label className="cursor-pointer">Featured</Label>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.active !== false}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              <Label className="cursor-pointer">Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────── Site Settings ───────────────────────────

const SETTING_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "contact_email", label: "Contact email", placeholder: "hello@learnify.ai" },
  { key: "careers_email", label: "Careers email", placeholder: "careers@learnify.ai" },
  { key: "discord_url", label: "Discord URL", placeholder: "https://discord.gg/..." },
  {
    key: "discord_label",
    label: "Discord tagline",
    placeholder: "Chat with the community in real time.",
  },
  { key: "twitter_url", label: "X (Twitter) URL", placeholder: "https://x.com/learnifyai" },
  { key: "twitter_handle", label: "X handle", placeholder: "@learnifyai" },
  { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/..." },
  { key: "linkedin_url", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/..." },
  { key: "youtube_url", label: "YouTube URL", placeholder: "https://youtube.com/@..." },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
  {
    key: "events_auto_delete_enabled",
    label: "Auto-delete past events (true/false)",
    placeholder: "true",
  },
  { key: "events_auto_delete_hours", label: "Auto-delete events after (hours)", placeholder: "24" },
  {
    key: "jobs_auto_close_enabled",
    label: "Auto-close jobs past close date (true/false)",
    placeholder: "true",
  },
  // Invoice customization
  { key: "invoice_company_name", label: "Invoice company name", placeholder: "Learnify AI" },
  {
    key: "invoice_legal_name",
    label: "Invoice legal name",
    placeholder: "Learnify EdTech Pvt. Ltd.",
  },
  { key: "invoice_gstin", label: "Invoice GSTIN", placeholder: "29XXXXX1234X1Z5" },
  { key: "invoice_prefix", label: "Invoice number prefix", placeholder: "LRN" },
  {
    key: "invoice_footer",
    label: "Invoice footer text",
    placeholder: "This is a computer generated invoice...",
  },
  {
    key: "invoice_logo_url",
    label: "Invoice logo URL",
    placeholder: "https://example.com/logo.png",
  },
  {
    key: "invoice_contact",
    label: "Invoice contact (email/phone)",
    placeholder: "hello@learnify.ai · +91 98765 43210",
  },
  {
    key: "tour_video_url",
    label: "Tour / Demo video URL",
    placeholder: "https://youtube.com/watch?v=... or .mp4 URL",
  },
  { key: "hero_title", label: "Hero title", placeholder: "The intelligent Career OS" },
  { key: "hero_subtitle", label: "Hero subtitle", placeholder: "AI-powered learning..." },
];

function DemoVideoManager() {
  const qc = useQueryClient();
  const [videoUrl, setVideoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const doQuery = useServerFn(adminContentQuery);
  const doUpsert = useServerFn(adminContentUpsert);
  const doAdminAction = useServerFn(adminContentAction);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-demo-video"],
    queryFn: async () => {
      const result = await doQuery({
        data: {
          table: "site_settings",
          columns: "value",
          eqFilter: { column: "key", value: "tour_video_url" },
          single: true,
        },
      });
      return ((result as any)?.value as string) || "";
    },
  });

  useEffect(() => {
    if (data !== undefined) setVideoUrl(data);
  }, [data]);

  const save = async () => {
    setSaving(true);
    try {
      await doUpsert({
        data: {
          table: "site_settings",
          data: { key: "tour_video_url", value: videoUrl },
          onConflict: "key",
        },
      });
      toast.success("Demo video saved");
      qc.invalidateQueries({ queryKey: ["admin-demo-video"] });
      qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Remove the demo video?")) return;
    setSaving(true);
    try {
      await doAdminAction({
        data: { table: "site_settings", action: "delete", id: "tour_video_url", matchKey: "key" },
      });
      setVideoUrl("");
      toast.success("Demo video removed");
      qc.invalidateQueries({ queryKey: ["admin-demo-video"] });
      qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings"] });
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) return toast.error("Please select a video file");
    if (file.size > 50 * 1024 * 1024) return toast.error("Video too large. Max 50MB.");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "mp4";
      const path = `demo-videos/tour-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
      setVideoUrl(urlData.publicUrl);
      toast.success("Video uploaded! Click Save to apply.");
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isMP4 = videoUrl.endsWith(".mp4") || videoUrl.includes("media/storage");

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg">Demo / Tour Video</h3>
          <p className="text-sm text-muted-foreground">
            This video plays in the "Watch Demo" modal on the homepage. Supports YouTube embeds or
            direct MP4 URLs.
          </p>
        </div>

        {/* Current video preview */}
        {videoUrl && (
          <div className="rounded-lg overflow-hidden border bg-black aspect-video">
            {isYouTube ? (
              <iframe
                src={videoUrl.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video src={videoUrl} controls className="w-full h-full object-contain" />
            )}
          </div>
        )}

        {/* URL input */}
        <div className="space-y-2">
          <Label>Video URL</Label>
          <div className="flex gap-2">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
              className="flex-1"
            />
          </div>
        </div>

        {/* File upload */}
        <div className="space-y-2">
          <Label>Or upload a video file</Label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="demo-video-upload"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("demo-video-upload")?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {uploading ? "Uploading..." : "Choose Video"}
            </Button>
            <span className="text-xs text-muted-foreground">Max 50MB · MP4, WebM</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button onClick={save} disabled={saving || !videoUrl.trim()}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Video
          </Button>
          {videoUrl && (
            <Button variant="outline" onClick={remove} disabled={saving}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SiteSettingsManager() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);
  const doAdminAction = useServerFn(adminContentAction);
  const doUpsert = useServerFn(adminContentUpsert);
  const doQuery = useServerFn(adminContentQuery);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const result = await doQuery({ data: { table: "site_settings", columns: "key,value" } });
      const m: Record<string, string> = {};
      ((result ?? []) as unknown as any[]).forEach((r: any) => {
        m[r.key] = r.value ?? "";
      });
      return m;
    },
  });

  const doClean = useServerFn(cleanDuplicateSiteSettings);

  useEffect(() => {
    doClean()
      .then((res) => {
        if (res.deletedKeys && res.deletedKeys.length > 0) {
          toast.success(`Merged and cleaned ${res.deletedKeys.length} duplicate settings`);
          qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
          qc.invalidateQueries({ queryKey: ["site-settings"] });
        }
      })
      .catch((err) => {
        console.error("Site settings auto-clean error:", err);
      });
  }, []);

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const settingMeta = (key: string) => SETTING_FIELDS.find((f) => f.key === key);
  const settingKeys = [
    ...SETTING_FIELDS.map((f) => f.key),
    ...Object.keys(values)
      .filter((key) => !SETTING_FIELDS.some((f) => f.key === key))
      .sort(),
  ];

  const save = async () => {
    setSaving(true);
    const rows = settingKeys
      .filter((key) => key.trim())
      .map((key) => ({ key: key.trim(), value: values[key] ?? "" }));
    try {
      await doUpsert({ data: { table: "site_settings", data: rows, onConflict: "key" } });
    } catch (e: any) {
      setSaving(false);
      return toast.error(e?.message || "Save failed");
    }
    setSaving(false);
    toast.success("Site settings saved");
    qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  const addSetting = async () => {
    const key = newKey
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_");
    if (!key) return toast.error("Setting key is required");
    if (values[key] !== undefined) return toast.error("That setting already exists");
    setSaving(true);
    try {
      await doUpsert({
        data: { table: "site_settings", data: { key, value: newValue }, onConflict: "key" },
      });
    } catch (e: any) {
      setSaving(false);
      return toast.error(e?.message || "Add failed");
    }
    setSaving(false);
    setValues({ ...values, [key]: newValue });
    setNewKey("");
    setNewValue("");
    toast.success("Setting added");
    qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  const deleteSetting = async (key: string) => {
    if (!window.confirm(`Delete ${key}?`)) return;
    try {
      await doAdminAction({
        data: { table: "site_settings", action: "delete", id: key, matchKey: "key" },
      });
    } catch (e: any) {
      return toast.error(e?.message || "Delete failed");
    }
    const next = { ...values };
    delete next[key];
    setValues(next);
    toast.success("Setting deleted");
    qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
        <div className="font-semibold">Add custom setting</div>
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <div>
            <Label>Key</Label>
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="support_url"
            />
          </div>
          <div>
            <Label>Value</Label>
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button onClick={addSetting} disabled={saving}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {settingKeys.map((key) => {
        const meta = settingMeta(key);
        return (
          <div key={key} className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <Label>{meta?.label ?? key.replaceAll("_", " ")}</Label>
                {!meta && <div className="text-[11px] text-muted-foreground font-mono">{key}</div>}
              </div>
              <Button size="sm" variant="outline" onClick={() => deleteSetting(key)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Input
              value={values[key] ?? ""}
              onChange={(e) => setValues({ ...values, [key]: e.target.value })}
              placeholder={meta?.placeholder ?? "Value"}
            />
          </div>
        );
      })}
      <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur py-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save all changes
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────── Certificate Templates ───────────────────────────

type TemplateRow = CertDesign & { id: string; name: string; is_default: boolean };

const PREVIEW_CTX = {
  name: "Ada Lovelace",
  course: "Introduction to AI & LLMs",
  date: "02 Jun 2026",
  role: "Lead Engineer",
  from: "01 Apr 2026",
  to: "02 Jun 2026",
  instructor: "Learnify AI",
  code: "LRN-PREVIEW-001",
  score: 18,
  total: 20,
  qrDataUrl: "",
};

function CertTemplatesManager() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<TemplateRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const doAdminAction = useServerFn(adminContentAction);
  const doQuery = useServerFn(adminContentQuery);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["admin-cert-templates"],
    queryFn: async () => {
      const result = await doQuery({
        data: { table: "certificate_templates", orderBy: "created_at", ascending: true },
      });
      return (result ?? []) as unknown as TemplateRow[];
    },
  });

  const newTemplate = () => {
    setEditing({ ...DEFAULT_DESIGN, id: "", name: "New template", is_default: false });
    setOpen(true);
  };

  const loadPresets = async () => {
    const presets = buildPresetTemplates();
    try {
      await doAdminAction({
        data: { table: "certificate_templates", action: "insert", data: presets },
      });
    } catch (e: any) {
      return toast.error(e?.message || "Failed to load presets");
    }
    toast.success(`${presets.length} preset templates added`);
    qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
  };

  const removeTemplate = async () => {
    if (!deleteId) return;
    try {
      await doAdminAction({
        data: { table: "certificate_templates", action: "delete", id: deleteId },
      });
    } catch (e: any) {
      return toast.error(e?.message || "Delete failed");
    }
    toast.success("Template deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
  };

  // ── Export all templates as JSON ────────────────────────────────────────
  const exportTemplates = () => {
    const payload = {
      kind: "learnify-certificate-templates",
      version: 1,
      exported_at: new Date().toISOString(),
      palettes: COLOR_PALETTES,
      templates: templates.map(
        ({ id: _id, created_by: _cb, created_at: _ca, updated_at: _ua, ...rest }: any) => rest,
      ),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `learnify-cert-templates-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${templates.length} template(s) exported`);
  };

  // ── Import templates from JSON ──────────────────────────────────────────
  const importTemplates = async (file: File) => {
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const rows: any[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.templates)
          ? json.templates
          : json?.name
            ? [json]
            : [];
      if (!rows.length) return toast.error("No templates found in file");
      const clean = rows.map((r) => {
        const { id, created_by, created_at, updated_at, is_default, ...rest } = r ?? {};
        return { ...rest, name: String(rest.name ?? "Imported template"), is_default: false };
      });
      try {
        await doAdminAction({
          data: { table: "certificate_templates", action: "insert", data: clean },
        });
      } catch (e: any) {
        return toast.error(e?.message || "Import failed");
      }
      toast.success(`Imported ${clean.length} template(s)`);
      qc.invalidateQueries({ queryKey: ["admin-cert-templates"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Invalid JSON file");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
        <Button variant="default" size="sm" onClick={() => navigate({ to: "/admin/certificates" })}>
          <ShieldCheck className="h-4 w-4 mr-2" />
          Full Designer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("/admin/certificates?tab=canva", "_self")}
        >
          <LayoutTemplate className="h-4 w-4 mr-2" />
          Canva Templates
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("/admin/certificates?tab=analytics", "_self")}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open("/admin/certificates?tab=categories", "_self")}
        >
          <FolderTree className="h-4 w-4 mr-2" />
          Categories
        </Button>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <input
          id="cert-import-file"
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importTemplates(f);
            e.target.value = "";
          }}
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById("cert-import-file")?.click()}
        >
          Import JSON
        </Button>
        <Button variant="outline" onClick={exportTemplates} disabled={!templates.length}>
          Export JSON
        </Button>
        <Button variant="outline" onClick={loadPresets}>
          Load preset templates
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: "/admin/certificates" })}>
          <ShieldCheck className="h-4 w-4 mr-2" />
          Open Designer
        </Button>
        <Button onClick={newTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          New template
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No templates yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold truncate flex items-center gap-2">
                    {t.name}
                    {t.is_default && (
                      <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-0.5">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.font_family}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: "/admin/certificates" })}
                    title="Edit in Certificate Designer"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(t);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteId(t.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 rounded-md overflow-hidden border border-border/60">
                <div
                  style={{
                    transform: "scale(0.34)",
                    transformOrigin: "top left",
                    width: "294%",
                    height: "200px",
                  }}
                >
                  <CertificateRender design={t} ctx={PREVIEW_CTX} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TemplateDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        template={editing}
        onSaved={() => qc.invalidateQueries({ queryKey: ["admin-cert-templates"] })}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete template?</AlertDialogTitle>
            <AlertDialogDescription>
              Certificates already issued keep their saved design.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeTemplate}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template: TemplateRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<TemplateRow | null>(template);
  const [saving, setSaving] = useState(false);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const doAdminAction = useServerFn(adminContentAction);

  useEffect(() => {
    setForm(template);
  }, [template]);

  if (!form) return null;
  const set = (patch: Partial<TemplateRow>) => setForm({ ...form, ...patch });

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    setSaving(true);
    const payload: any = {
      name: form.name.trim(),
      title_text: form.title_text,
      subtitle: form.subtitle,
      body_template: form.body_template,
      signatory_name: form.signatory_name,
      signatory_title: form.signatory_title,
      accent_color: form.accent_color,
      bg_color: form.bg_color,
      text_color: form.text_color,
      font_family: form.font_family,
      logo_url: form.logo_url || null,
      signature_url: form.signature_url || null,
      stamp_url: form.stamp_url || null,
      is_default: form.is_default,
      title_font: form.title_font || null,
      body_font: form.body_font || null,
      title_size: form.title_size ?? 1,
      name_size: form.name_size ?? 1,
      body_size: form.body_size ?? 1,
      border_style: form.border_style ?? "double",
      border_width: form.border_width ?? 10,
      corner_style: form.corner_style ?? "diagonal",
      background_pattern: form.background_pattern ?? "none",
      accent_color_2: form.accent_color_2 || null,
      layout: form.layout ?? "classic",
    };
    try {
      if (form.id) {
        await doAdminAction({
          data: { table: "certificate_templates", action: "update", id: form.id, data: payload },
        });
      } else {
        await doAdminAction({
          data: { table: "certificate_templates", action: "insert", data: payload },
        });
      }
    } catch (e: any) {
      setSaving(false);
      return toast.error(e?.message || "Save failed");
    }
    setSaving(false);
    toast.success(form.id ? "Template updated" : "Template created");
    onSaved();
    onOpenChange(false);
  };

  const exportSingle = () => {
    const { id: _id, ...rest } = form as any;
    const blob = new Blob(
      [
        JSON.stringify(
          { kind: "learnify-certificate-templates", version: 1, templates: [rest] },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.name || "template").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl w-[96vw] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-3">
              <span>{form.id ? "Edit template" : "New template"}</span>
              <Button type="button" size="sm" variant="outline" onClick={exportSingle}>
                Export JSON
              </Button>
            </DialogTitle>
            <DialogDescription>
              Customize text, colors, fonts, borders and background. Live preview updates instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="grid lg:grid-cols-5 gap-4">
            {/* Preview — full width on mobile, 3 cols on lg, sticky so it stays in view */}
            <div className="lg:col-span-3 lg:order-2 sticky top-0 lg:top-2 z-30 bg-background/95 backdrop-blur pb-2 lg:pb-0 mb-4 lg:mb-0">
              <div className="rounded-md border border-border/60 overflow-hidden shadow-sm">
                <div className="bg-muted/40 px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Live preview · A4 landscape</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px]"
                    onClick={() => setFullPreviewOpen(true)}
                  >
                    <Maximize2 className="h-3.5 w-3.5 mr-1" /> Full
                  </Button>
                </div>
                <div className="p-2 sm:p-3 bg-muted/20 flex justify-center">
                  <div
                    className="w-full"
                    style={{ maxWidth: "min(100%, calc((78vh - 120px) * 1.414))" }}
                  >
                    <CertificateRender key={JSON.stringify(form)} design={form} ctx={PREVIEW_CTX} />
                  </div>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="lg:col-span-2 lg:order-1 space-y-3 pr-2">
              <div>
                <Label>Template name</Label>
                <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={form.title_text}
                    onChange={(e) => set({ title_text: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={form.subtitle}
                    onChange={(e) => set({ subtitle: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>
                  Body (use {"{name}"} {"{course}"} {"{date}"} {"{role}"} {"{from}"} {"{to}"})
                </Label>
                <Textarea
                  rows={3}
                  value={form.body_template}
                  onChange={(e) => set({ body_template: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Signatory name</Label>
                  <Input
                    value={form.signatory_name}
                    onChange={(e) => set({ signatory_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Signatory title</Label>
                  <Input
                    value={form.signatory_title}
                    onChange={(e) => set({ signatory_title: e.target.value })}
                  />
                </div>
              </div>

              {/* Branding */}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Branding
                </div>
                <div>
                  <Label className="text-xs">Color palette</Label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {COLOR_PALETTES.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() =>
                          set({ accent_color: p.accent, bg_color: p.bg, text_color: p.text })
                        }
                        className="rounded-md border border-border/60 px-2 py-1.5 text-left hover:border-primary transition"
                        title={p.name}
                      >
                        <div className="flex gap-1 mb-1">
                          <span className="h-3 w-3 rounded-full" style={{ background: p.accent }} />
                          <span
                            className="h-3 w-3 rounded-full border"
                            style={{ background: p.bg }}
                          />
                          <span className="h-3 w-3 rounded-full" style={{ background: p.text }} />
                        </div>
                        <div className="text-[10px] leading-tight">{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <Label className="text-xs">Accent</Label>
                    <Input
                      type="color"
                      value={form.accent_color}
                      onChange={(e) => set({ accent_color: e.target.value })}
                      className="h-8 p-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Accent 2</Label>
                    <Input
                      type="color"
                      value={form.accent_color_2 ?? form.accent_color}
                      onChange={(e) => set({ accent_color_2: e.target.value })}
                      className="h-8 p-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Background</Label>
                    <Input
                      type="color"
                      value={form.bg_color}
                      onChange={(e) => set({ bg_color: e.target.value })}
                      className="h-8 p-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Text</Label>
                    <Input
                      type="color"
                      value={form.text_color}
                      onChange={(e) => set({ text_color: e.target.value })}
                      className="h-8 p-1"
                    />
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Typography
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Title font</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.title_font ?? form.font_family}
                      onChange={(e) => set({ title_font: e.target.value })}
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Body font</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={form.body_font ?? form.font_family}
                      onChange={(e) =>
                        set({ body_font: e.target.value, font_family: e.target.value })
                      }
                    >
                      {FONT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">
                      Title size ({(form.title_size ?? 1).toFixed(2)}×)
                    </Label>
                    <Input
                      type="range"
                      min={0.6}
                      max={1.6}
                      step={0.05}
                      value={form.title_size ?? 1}
                      onChange={(e) => set({ title_size: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">
                      Name size ({(form.name_size ?? 1).toFixed(2)}×)
                    </Label>
                    <Input
                      type="range"
                      min={0.6}
                      max={1.8}
                      step={0.05}
                      value={form.name_size ?? 1}
                      onChange={(e) => set({ name_size: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">
                      Body size ({(form.body_size ?? 1).toFixed(2)}×)
                    </Label>
                    <Input
                      type="range"
                      min={0.7}
                      max={1.4}
                      step={0.05}
                      value={form.body_size ?? 1}
                      onChange={(e) => set({ body_size: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Layout & decoration */}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Layout & decoration
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Layout</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      value={form.layout ?? "classic"}
                      onChange={(e) => set({ layout: e.target.value })}
                    >
                      {LAYOUTS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Background pattern</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      value={form.background_pattern ?? "none"}
                      onChange={(e) => set({ background_pattern: e.target.value })}
                    >
                      {BACKGROUND_PATTERNS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Border style</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      value={form.border_style ?? "double"}
                      onChange={(e) => set({ border_style: e.target.value })}
                    >
                      {BORDER_STYLES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Corners</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                      value={form.corner_style ?? "diagonal"}
                      onChange={(e) => set({ corner_style: e.target.value })}
                    >
                      {CORNER_STYLES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Border width ({form.border_width ?? 10}px)</Label>
                  <Input
                    type="range"
                    min={0}
                    max={24}
                    step={1}
                    value={form.border_width ?? 10}
                    onChange={(e) => set({ border_width: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Assets */}
              <div className="rounded-lg border border-dashed border-border/60 p-3 space-y-3 bg-muted/20">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Assets
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Logo URL</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 text-[11px]"
                      onClick={() => set({ logo_url: SITE_LOGO_URL })}
                    >
                      Use site logo
                    </Button>
                  </div>
                  <Input
                    value={form.logo_url ?? ""}
                    onChange={(e) => set({ logo_url: e.target.value })}
                    placeholder="https://..."
                  />
                  {form.logo_url && (
                    <img
                      src={form.logo_url}
                      alt="Logo preview"
                      className="h-10 object-contain bg-white rounded border p-1"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
                <div>
                  <Label className="text-xs">Signature image URL</Label>
                  <Input
                    value={form.signature_url ?? ""}
                    onChange={(e) => set({ signature_url: e.target.value })}
                    placeholder="https://...signature.png"
                  />
                </div>
                <div>
                  <Label className="text-xs">Stamp image URL</Label>
                  <Input
                    value={form.stamp_url ?? ""}
                    onChange={(e) => set({ stamp_url: e.target.value })}
                    placeholder="https://...stamp.png"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Switch checked={form.is_default} onCheckedChange={(v) => set({ is_default: v })} />
                <Label className="cursor-pointer">Default template</Label>
              </div>
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-background/95 backdrop-blur border-t z-40 mt-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CertificateFullPreviewDialog
        open={fullPreviewOpen}
        onOpenChange={setFullPreviewOpen}
        design={form}
        ctx={PREVIEW_CTX}
        title={form.name || "Certificate preview"}
      />
    </>
  );
}

function buildPresetTemplates() {
  return [
    {
      name: "Learnify Official (Navy + Gold)",
      title_text: "Certificate of Completion",
      subtitle: "This is proudly presented to",
      body_template:
        "for successfully completing the {course} program on {date}. This achievement reflects dedication, curiosity and rigor.",
      signatory_name: "Learnify AI",
      signatory_title: "Director of Learning",
      accent_color: "#c9a84c",
      bg_color: "#fdfbf5",
      text_color: "#0f1b3d",
      font_family: "Playfair Display",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: true,
    },
    {
      name: "Executive Black & Gold",
      title_text: "Certificate of Excellence",
      subtitle: "Awarded to",
      body_template: "in recognition of outstanding performance in {course}, completed on {date}.",
      signatory_name: "Learnify AI",
      signatory_title: "Chief Academic Officer",
      accent_color: "#d4af37",
      bg_color: "#0d0d0d",
      text_color: "#f5f0e0",
      font_family: "Cinzel",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: false,
    },
    {
      name: "Modern Indigo",
      title_text: "Certificate of Achievement",
      subtitle: "This certifies that",
      body_template:
        "has successfully completed the {course} curriculum on {date} with distinction.",
      signatory_name: "Learnify AI",
      signatory_title: "Head of Programs",
      accent_color: "#6366f1",
      bg_color: "#ffffff",
      text_color: "#1e1b4b",
      font_family: "Montserrat",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: false,
    },
    {
      name: "Editorial Cream",
      title_text: "Certificate of Completion",
      subtitle: "Presented to",
      body_template: "for completing {course} on {date} as part of the Learnify AI learning track.",
      signatory_name: "Learnify AI",
      signatory_title: "Director of Learning",
      accent_color: "#8b6f3d",
      bg_color: "#f7f1e3",
      text_color: "#2c2416",
      font_family: "Cormorant Garamond",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: false,
    },
    {
      name: "Calligraphic Blush",
      title_text: "Certificate of Participation",
      subtitle: "Awarded with appreciation to",
      body_template: "for active participation and completion of {course} on {date}.",
      signatory_name: "Learnify AI",
      signatory_title: "Program Lead",
      accent_color: "#b76e79",
      bg_color: "#fff8f5",
      text_color: "#3a1d24",
      font_family: "Great Vibes",
      logo_url: SITE_LOGO_URL,
      signature_url: null,
      stamp_url: null,
      is_default: false,
    },
    ...EXTRA_PRESETS,
  ];
}

const COLOR_PALETTES: { name: string; accent: string; bg: string; text: string }[] = [
  { name: "Navy & Gold", accent: "#c9a84c", bg: "#fdfbf5", text: "#0f1b3d" },
  { name: "Black & Gold", accent: "#d4af37", bg: "#0d0d0d", text: "#f5f0e0" },
  { name: "Indigo Modern", accent: "#6366f1", bg: "#ffffff", text: "#1e1b4b" },
  { name: "Emerald Prestige", accent: "#c9a84c", bg: "#f8faf7", text: "#064e3b" },
  { name: "Burgundy Classic", accent: "#b08d57", bg: "#fbf6ef", text: "#581c1c" },
  { name: "Slate Minimal", accent: "#64748b", bg: "#ffffff", text: "#0f172a" },
  { name: "Rose & Charcoal", accent: "#b76e79", bg: "#fff8f5", text: "#1f1f1f" },
  { name: "Teal Editorial", accent: "#0d9488", bg: "#f0fdfa", text: "#134e4a" },
  { name: "Royal Purple", accent: "#a855f7", bg: "#faf5ff", text: "#3b0764" },
  { name: "Sunset Amber", accent: "#f59e0b", bg: "#fffbeb", text: "#7c2d12" },
  { name: "Forest & Cream", accent: "#4a6741", bg: "#f7f4ec", text: "#1c2e1a" },
  { name: "Steel Blue", accent: "#1e40af", bg: "#f1f5f9", text: "#0c1d4f" },
];

const EXTRA_PRESETS = [
  {
    name: "Emerald Prestige",
    title_text: "Certificate of Achievement",
    subtitle: "Awarded to",
    body_template: "in recognition of completing {course} on {date} with academic distinction.",
    signatory_name: "Learnify AI",
    signatory_title: "Dean of Programs",
    accent_color: "#c9a84c",
    bg_color: "#f8faf7",
    text_color: "#064e3b",
    font_family: "Playfair Display",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Burgundy Classic",
    title_text: "Certificate of Completion",
    subtitle: "Proudly presented to",
    body_template: "for the successful completion of {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Registrar",
    accent_color: "#b08d57",
    bg_color: "#fbf6ef",
    text_color: "#581c1c",
    font_family: "Cormorant Garamond",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Minimal Slate",
    title_text: "Certificate",
    subtitle: "This certifies that",
    body_template: "completed {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Program Director",
    accent_color: "#64748b",
    bg_color: "#ffffff",
    text_color: "#0f172a",
    font_family: "Inter",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Teal Editorial",
    title_text: "Certificate of Mastery",
    subtitle: "Awarded to",
    body_template: "for demonstrated mastery of {course} as of {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Head of Curriculum",
    accent_color: "#0d9488",
    bg_color: "#f0fdfa",
    text_color: "#134e4a",
    font_family: "Montserrat",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Royal Purple",
    title_text: "Certificate of Honour",
    subtitle: "Presented with distinction to",
    body_template: "for outstanding completion of {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Academic Council",
    accent_color: "#a855f7",
    bg_color: "#faf5ff",
    text_color: "#3b0764",
    font_family: "Cinzel",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Sunset Amber",
    title_text: "Certificate of Participation",
    subtitle: "With appreciation to",
    body_template: "for participating in {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Community Lead",
    accent_color: "#f59e0b",
    bg_color: "#fffbeb",
    text_color: "#7c2d12",
    font_family: "Montserrat",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Forest & Cream",
    title_text: "Certificate of Completion",
    subtitle: "Granted to",
    body_template: "for completing the {course} program on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Director of Learning",
    accent_color: "#4a6741",
    bg_color: "#f7f4ec",
    text_color: "#1c2e1a",
    font_family: "Cormorant Garamond",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Steel Blue Corporate",
    title_text: "Professional Certificate",
    subtitle: "This is to certify that",
    body_template: "has completed the professional curriculum of {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Director, Professional Programs",
    accent_color: "#1e40af",
    bg_color: "#f1f5f9",
    text_color: "#0c1d4f",
    font_family: "Inter",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Rose Charcoal",
    title_text: "Certificate of Recognition",
    subtitle: "Awarded to",
    body_template: "for excellence demonstrated in {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Faculty Lead",
    accent_color: "#b76e79",
    bg_color: "#fff8f5",
    text_color: "#1f1f1f",
    font_family: "Playfair Display",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Onyx Calligraphy",
    title_text: "Certificate of Excellence",
    subtitle: "Presented to",
    body_template: "for exemplary work in {course}, completed {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Chancellor",
    accent_color: "#caa472",
    bg_color: "#111111",
    text_color: "#f4ebd6",
    font_family: "Great Vibes",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Ivory Academic",
    title_text: "Diploma",
    subtitle: "Conferred upon",
    body_template: "having fulfilled all requirements of {course} on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Provost",
    accent_color: "#7a5e2b",
    bg_color: "#fbf7ec",
    text_color: "#2b210f",
    font_family: "Cinzel",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
  {
    name: "Skyline Tech",
    title_text: "Certificate of Skill",
    subtitle: "Issued to",
    body_template: "for completing the {course} technical track on {date}.",
    signatory_name: "Learnify AI",
    signatory_title: "Head of Engineering Education",
    accent_color: "#0ea5e9",
    bg_color: "#f0f9ff",
    text_color: "#0c4a6e",
    font_family: "Inter",
    logo_url: SITE_LOGO_URL,
    signature_url: null,
    stamp_url: null,
    is_default: false,
  },
];

// IssueCertificate moved to src/components/admin/IssueCertificate.tsx (lazy-loaded).

// ─────────────────────────── FAQs ───────────────────────────

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  published: boolean;
};

function FaqsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const doAdminAction = useServerFn(adminContentAction);
  const doQuery = useServerFn(adminContentQuery);

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const result = await doQuery({
        data: {
          table: "faqs",
          orderBy: "category",
          ascending: true,
          orderBy2: "order_index",
          ascending2: true,
        },
      });
      return (result ?? []) as unknown as FaqRow[];
    },
  });

  const newFaq = () => {
    setEditing({
      id: "",
      question: "",
      answer: "",
      category: "General",
      order_index: (faqs.length + 1) * 10,
      published: true,
    });
    setOpen(true);
  };

  const remove = async () => {
    if (!deleteId) return;
    try {
      await doAdminAction({ data: { table: "faqs", action: "delete", id: deleteId } });
    } catch (e: any) {
      return toast.error(e?.message || "Delete failed");
    }
    toast.success("FAQ deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-faqs"] });
    qc.invalidateQueries({ queryKey: ["public-faqs"] });
  };

  const seedDefaultFaqs = async () => {
    const defaults: {
      question: string;
      answer: string;
      category: string;
      order_index: number;
      published: boolean;
    }[] = [
      // Plans & Pricing
      {
        question: "Can I switch plans anytime?",
        answer:
          "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and your billing will be prorated.",
        category: "Plans & Pricing",
        order_index: 10,
        published: true,
      },
      {
        question: "Is there a free trial?",
        answer:
          "The Free plan is free forever with basic features. All premium plans come with a 30-day money-back guarantee so you can try risk-free.",
        category: "Plans & Pricing",
        order_index: 20,
        published: true,
      },
      {
        question: "What happens when I run out of AI credits?",
        answer:
          "You can purchase additional AI credit top-ups at any time, or upgrade to a higher plan for more monthly credits.",
        category: "Plans & Pricing",
        order_index: 30,
        published: true,
      },
      {
        question: "Do you offer student discounts?",
        answer:
          "Yes! We offer a 50% discount for verified students. Contact support with your student ID to apply the discount.",
        category: "Plans & Pricing",
        order_index: 40,
        published: true,
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes, you can cancel anytime. Your access continues until the end of the current billing period.",
        category: "Plans & Pricing",
        order_index: 50,
        published: true,
      },
      // Billing
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards, debit cards, UPI, Net Banking, and popular wallets through our secure payment partner Cashfree.",
        category: "Billing",
        order_index: 60,
        published: true,
      },
      {
        question: "Can I get a refund?",
        answer:
          "Yes, we offer a 30-day money-back guarantee on all premium plans. Contact our support team within 30 days of purchase for a full refund.",
        category: "Billing",
        order_index: 70,
        published: true,
      },
      {
        question: "How do I download my invoice?",
        answer:
          "Invoices are available in your account settings under Billing History. You can download PDF invoices for all past payments.",
        category: "Billing",
        order_index: 80,
        published: true,
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely. We use PCI-compliant payment processing through Cashfree. Your card details are never stored on our servers.",
        category: "Billing",
        order_index: 90,
        published: true,
      },
      {
        question: "Do you offer GST invoices?",
        answer:
          "Yes, GST invoices are available for all Indian customers. Make sure your GST number is added in your billing settings.",
        category: "Billing",
        order_index: 100,
        published: true,
      },
      // Features
      {
        question: "What AI features are included?",
        answer:
          "AI Tutor, Resume Builder, Interview Coach, Certificate Generator, and Career Roadmap are included in Pro and above plans.",
        category: "Features",
        order_index: 110,
        published: true,
      },
      {
        question: "How do certificates work?",
        answer:
          "Complete a course and pass the assessment to earn a verified certificate with a unique QR code and ID. Certificates can be shared on LinkedIn.",
        category: "Features",
        order_index: 120,
        published: true,
      },
      {
        question: "Is there a mobile app?",
        answer:
          "Learnify AI is fully responsive and works on all devices. A dedicated mobile app is coming soon.",
        category: "Features",
        order_index: 130,
        published: true,
      },
      {
        question: "Can I download course materials?",
        answer:
          "Yes, you can download video transcripts, notes, and code samples for offline reference.",
        category: "Features",
        order_index: 140,
        published: true,
      },
      {
        question: "Do you offer placement assistance?",
        answer:
          "Pro and Enterprise plans include resume review, mock interviews, and career guidance. Enterprise plans also include direct company referrals.",
        category: "Features",
        order_index: 150,
        published: true,
      },
      // Technical
      {
        question: "Is my data secure?",
        answer:
          "Yes, we use SSL encryption, secure payment processing, and follow industry best practices for data protection. Your data is stored securely on Cloudflare.",
        category: "Technical",
        order_index: 160,
        published: true,
      },
      {
        question: "Can I access courses offline?",
        answer:
          "Currently, courses are available online only. However, you can save video transcripts and notes for offline reading.",
        category: "Technical",
        order_index: 170,
        published: true,
      },
      {
        question: "What browsers are supported?",
        answer:
          "Learnify AI works on all modern browsers including Chrome, Firefox, Safari, and Edge.",
        category: "Technical",
        order_index: 180,
        published: true,
      },
      {
        question: "How do I reset my password?",
        answer:
          "Click 'Forgot Password' on the login page. We'll send a password reset link to your registered email.",
        category: "Technical",
        order_index: 190,
        published: true,
      },
      {
        question: "What is the AI Tutor and how does it work?",
        answer:
          "The AI Tutor is an intelligent chatbot powered by GPT-4 that can explain concepts, debug code, answer questions, and guide you through your learning journey in real-time.",
        category: "Technical",
        order_index: 200,
        published: true,
      },
      // Account
      {
        question: "How do I update my profile?",
        answer:
          "Go to your Account Settings to update your name, email, password, and profile picture.",
        category: "Account",
        order_index: 210,
        published: true,
      },
      {
        question: "How do I delete my account?",
        answer:
          "Go to Account Settings > Danger Zone. Enter your password to confirm. All your data will be permanently deleted within 30 days.",
        category: "Account",
        order_index: 220,
        published: true,
      },
      {
        question: "How do I change my email address?",
        answer:
          "Go to Account Settings and update your email. You'll receive a verification link at the new address.",
        category: "Account",
        order_index: 230,
        published: true,
      },
      {
        question: "Can I have multiple devices logged in?",
        answer: "Yes, you can access your account from multiple devices simultaneously.",
        category: "Account",
        order_index: 240,
        published: true,
      },
      {
        question: "How do I view my learning progress?",
        answer:
          "Your dashboard shows course progress, completed courses, certificates earned, and AI credit usage.",
        category: "Account",
        order_index: 250,
        published: true,
      },
      // Students
      {
        question: "Is Learnify suitable for beginners?",
        answer:
          "Absolutely! Our courses range from beginner to advanced. The AI Tutor adapts to your skill level and explains concepts at your pace.",
        category: "Students",
        order_index: 260,
        published: true,
      },
      {
        question: "How do I get verified as a student?",
        answer:
          "Upload your valid student ID or university email in Account Settings. Verification is processed within 24 hours.",
        category: "Students",
        order_index: 270,
        published: true,
      },
      {
        question: "Can I get a discount as a student?",
        answer:
          "Yes, verified students get 50% off on all premium plans. Complete student verification first, then the discount will be applied automatically.",
        category: "Students",
        order_index: 280,
        published: true,
      },
      {
        question: "Can I refer a friend?",
        answer:
          "Yes! Share your referral link from the dashboard. Both you and your friend get 500 bonus AI credits when they sign up.",
        category: "Students",
        order_index: 290,
        published: true,
      },
      {
        question: "Do you offer college partnerships?",
        answer:
          "Yes, we partner with colleges and universities to provide bulk access. Contact our enterprise sales team for custom pricing.",
        category: "Students",
        order_index: 300,
        published: true,
      },
    ];
    setSaving(true);
    try {
      for (const faq of defaults) {
        await doAdminAction({
          data: {
            table: "faqs",
            action: "insert",
            data: faq,
          },
        });
      }
      toast.success("Default FAQs seeded!");
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
      qc.invalidateQueries({ queryKey: ["public-faqs"] });
    } catch (e: any) {
      toast.error(e?.message || "Seed failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={seedDefaultFaqs} disabled={saving}>
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          )}
          Seed Default FAQs
        </Button>
        <Button onClick={newFaq}>
          <Plus className="h-4 w-4 mr-2" />
          New FAQ
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : faqs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No FAQs yet.</p>
      ) : (
        <div className="space-y-2">
          {faqs.map((f) => (
            <div
              key={f.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-medium truncate flex items-center gap-2">
                  {f.question}
                  <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                    {f.category}
                  </span>
                  {!f.published && (
                    <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-1">{f.answer}</div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(f);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(f.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        faq={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-faqs"] });
          qc.invalidateQueries({ queryKey: ["public-faqs"] });
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function FaqDialog({
  open,
  onOpenChange,
  faq,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  faq: FaqRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FaqRow | null>(faq);
  const [saving, setSaving] = useState(false);
  const doAdminAction = useServerFn(adminContentAction);
  useEffect(() => {
    setForm(faq);
  }, [faq]);
  if (!form) return null;

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim())
      return toast.error("Question and answer are required");
    setSaving(true);
    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim() || "General",
      order_index: form.order_index,
      published: form.published,
    };
    try {
      if (form.id) {
        await doAdminAction({
          data: { table: "faqs", action: "update", id: form.id, data: payload },
        });
      } else {
        await doAdminAction({ data: { table: "faqs", action: "insert", data: payload } });
      }
    } catch (e: any) {
      setSaving(false);
      console.error("[FAQsManager] Save error:", e);
      return toast.error(e?.message || "Save failed");
    }
    setSaving(false);
    toast.success(form.id ? "FAQ updated" : "FAQ created");
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          <DialogDescription>Shown publicly on /faq.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Question</Label>
            <Input
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </div>
          <div>
            <Label>Answer</Label>
            <Textarea
              rows={4}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 items-end">
            <div>
              <Label>Category</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div>
              <Label>Order</Label>
              <Input
                type="number"
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Switch
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <Label className="cursor-pointer">Published</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════
// Sections Manager (wcms_sections)
// ═══════════════════════════════════════════════

function SectionsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [jsonText, setJsonText] = useState("{}");
  const doQuery = useServerFn(adminContentQuery);
  const doUpsert = useServerFn(adminContentUpsert);
  const doDelete = useServerFn(adminContentAction);

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["admin-sections"],
    queryFn: async () => {
      const result = await doQuery({
        data: { table: "wcms_sections", orderBy: "key", ascending: true },
      });
      return (result ?? []) as unknown as any[];
    },
  });

  const save = async () => {
    if (!editing?.key || !editing?.name) {
      toast.error("Key and name are required");
      return;
    }
    let parsedContent = {};
    try {
      parsedContent = JSON.parse(jsonText);
    } catch (err: any) {
      toast.error("Invalid JSON content: " + err.message);
      return;
    }

    setSaving(true);
    try {
      await doUpsert({
        data: {
          table: "wcms_sections",
          data: {
            key: editing.key,
            name: editing.name,
            description: editing.description,
            content: parsedContent,
            block_type: "custom",
          },
          onConflict: "key",
        },
      });
      toast.success("Section saved");
      qc.invalidateQueries({ queryKey: ["admin-sections"] });
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const seedDefaultSections = async () => {
    const defaults = [
      {
        key: "pricing-hero",
        name: "Pricing Hero",
        description: "Headline and subtitle for the pricing page hero section",
        content: {
          headline: "Simple, transparent pricing",
          subheadline:
            "Start free, upgrade when you're ready. All plans include AI-powered learning tools.",
          cta: "Get Started Free",
          trust: "10,000+ learners trust Learnify AI",
        },
      },
      {
        key: "pricing-faq",
        name: "Pricing FAQ",
        description: "FAQ items for the pricing page",
        content: {
          categories: ["Plans", "Billing", "Features", "Technical", "Students"],
          items: [
            {
              q: "Can I switch plans anytime?",
              a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately.",
              category: "Plans",
            },
            {
              q: "Is there a free trial?",
              a: "The Free plan is free forever with basic features. Premium plans have a 30-day money-back guarantee.",
              category: "Plans",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, debit cards, UPI, and Net Banking through our secure payment partner Cashfree.",
              category: "Billing",
            },
            {
              q: "Can I get a refund?",
              a: "Yes, we offer a 30-day money-back guarantee on all premium plans. Contact support for assistance.",
              category: "Billing",
            },
            {
              q: "What AI features are included?",
              a: "AI Tutor, Resume Builder, Interview Coach, Certificate Generator, and Career Roadmap are included in Pro and above.",
              category: "Features",
            },
            {
              q: "Do you offer team or enterprise plans?",
              a: "Yes, we offer custom plans for teams and organizations. Contact our sales team for a quote.",
              category: "Plans",
            },
            {
              q: "How do certificates work?",
              a: "Complete a course and pass the assessment to earn a verified certificate with QR code, unique ID, and LinkedIn sharing.",
              category: "Features",
            },
            {
              q: "Is my data secure?",
              a: "Yes, we use SSL encryption, secure payment processing, and follow industry best practices for data protection.",
              category: "Technical",
            },
            {
              q: "Can I access courses offline?",
              a: "Currently, courses are available online only. However, you can save materials for offline reading.",
              category: "Technical",
            },
            {
              q: "Is Learnify suitable for beginners?",
              a: "Absolutely! Our courses range from beginner to advanced. AI tutor adapts to your skill level.",
              category: "Students",
            },
          ],
        },
      },
      {
        key: "pricing-testimonials",
        name: "Pricing Testimonials",
        description: "Testimonials shown on the pricing page",
        content: {
          items: [
            {
              name: "Rishabh Sharma",
              college: "Delhi University",
              role: "CS Student",
              rating: 5,
              review:
                "Learnify AI helped me create my resume and get interview ready. The AI tutor is amazing — it explained DSA concepts way better than my textbooks.",
              achievement: "Landed Internship at Microsoft",
              avatar: AVATAR_URLS.rishabh,
            },
            {
              name: "Anjali Verma",
              college: "IIT Bombay",
              role: "Placement Prep",
              rating: 5,
              review:
                "I went from zero coding confidence to cracking 3 company interviews. The mock interview feature is a game changer.",
              achievement: "Got Placement at Google",
              avatar: AVATAR_URLS.anjali,
            },
            {
              name: "Priya Kapoor",
              college: "SRM University",
              role: "Final Year Student",
              rating: 5,
              review:
                "I completed 3 certifications in one month and landed my first freelance project!",
              achievement: "Freelance Success — Earned ₹50K/mo",
              avatar: AVATAR_URLS.priya,
            },
            {
              name: "Vikram Singh",
              college: "NIT Trichy",
              role: "Career Switcher",
              rating: 5,
              review: "Switched from mechanical engineering to software development in 6 months.",
              achievement: "Successfully Career Switched",
              avatar: AVATAR_URLS.vikram,
            },
          ],
        },
      },
      {
        key: "pricing-trust",
        name: "Pricing Trust Badges",
        description: "Trust signals shown on the pricing page",
        content: {
          items: [
            { label: "Secure Payments", color: "#2563EB" },
            { label: "Money Back Guarantee", color: "#10B981" },
            { label: "Instant Activation", color: "#F59E0B" },
            { label: "Human Support", color: "#8B5CF6" },
            { label: "Made For India", color: "#EC4899" },
            { label: "SSL Secured", color: "#6366F1" },
          ],
        },
      },
      {
        key: "promo-banner",
        name: "Promotional Banner",
        description: "Launch offer banner shown across the site",
        content: {
          enabled: true,
          headline: "Launch Offer",
          discount: "20% Off",
          subtitle: "Limited Time",
          cta: "Claim Now",
          ctaLink: "/signup",
          timerEndDate: "",
          bgGradient: "from-blue-600 via-indigo-600 to-purple-700",
          dismissible: true,
        },
      },
    ];
    setSaving(true);
    try {
      for (const section of defaults) {
        await doUpsert({
          data: {
            table: "wcms_sections",
            data: { ...section, block_type: "custom" },
            onConflict: "key",
          },
        });
      }
      toast.success("Default sections seeded!");
      qc.invalidateQueries({ queryKey: ["admin-sections"] });
    } catch (e: any) {
      toast.error(e?.message || "Seed failed");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sections</h3>
          <p className="text-sm text-muted-foreground">
            Manage reusable content sections used across marketing pages.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing({ key: "", name: "", description: "", content: {} });
            setJsonText("{}");
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> New Section
        </Button>
      </div>
      <div className="flex justify-end -mt-2 mb-2">
        <Button size="sm" variant="outline" onClick={seedDefaultSections}>
          <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Seed Default Sections
        </Button>
      </div>
      {sections.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No sections yet.</p>
      ) : (
        <div className="grid gap-3">
          {sections.map((s: any) => (
            <div
              key={s.id}
              className="rounded-lg border bg-card p-4 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-mono">{s.key}</div>
                {s.description && (
                  <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                )}
                <div className="text-[10px] text-muted-foreground/60 mt-1">
                  Updated {format(new Date(s.updated_at), "MMM d, yyyy")}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(s);
                    setJsonText(JSON.stringify(s.content || {}, null, 2));
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeletingId(s.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Section" : "New Section"}</DialogTitle>
            <DialogDescription>
              Content is rendered on marketing pages. Use JSON format for structured content.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <Label>Key</Label>
                <Input
                  value={editing.key}
                  onChange={(e) => setEditing({ ...editing, key: e.target.value })}
                  placeholder="certificate-journey"
                />
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Certificate Journey"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Shown on the pricing page"
                />
              </div>
              <div>
                <Label>Content (JSON)</Label>
                <Textarea
                  rows={16}
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  className="font-mono text-xs"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(v) => !v && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Section?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The section will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                const id = deletingId;
                if (!id) return;
                doDelete({ data: { table: "wcms_sections", action: "delete", id, matchKey: "id" } })
                  .then(() => {
                    toast.success("Section deleted");
                    qc.invalidateQueries({ queryKey: ["admin-sections"] });
                  })
                  .catch((e: any) => toast.error(e?.message || "Delete failed"))
                  .finally(() => setDeletingId(null));
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
// ─────────────────────────── Pages (Terms, Refund, Privacy) ───────────────────────────

const PAGE_KEYS = [
  { key: "page_terms", label: "Terms of Service", slug: "/terms" },
  { key: "page_refund", label: "Refund Policy", slug: "/refund-policy" },
  { key: "page_privacy", label: "Privacy Policy", slug: "/privacy" },
];

function PagesManager() {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const doQuery = useServerFn(adminContentQuery);
  const doUpsert = useServerFn(adminContentUpsert);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-page-content"],
    queryFn: async () => {
      const keys = PAGE_KEYS.map((p) => p.key);
      const result = await doQuery({
        data: {
          table: "site_settings",
          columns: "key,value",
          inFilter: { column: "key", values: keys },
        },
      });
      const m: Record<string, string> = {};
      ((result ?? []) as unknown as any[]).forEach((r: any) => {
        m[r.key] = r.value ?? "";
      });
      keys.forEach((k) => {
        if (!(k in m)) m[k] = "";
      });
      return m;
    },
  });

  useEffect(() => {
    if (data) setValues(data);
  }, [data]);

  const save = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    const rows = PAGE_KEYS.map((p) => ({
      key: p.key,
      value: values[p.key] ?? "",
      updated_at: now,
    }));
    try {
      await doUpsert({ data: { table: "site_settings", data: rows, onConflict: "key" } });
    } catch (e: any) {
      setSaving(false);
      return toast.error(e?.message || "Save failed");
    }
    setSaving(false);
    toast.success("Page content saved");
    qc.invalidateQueries({ queryKey: ["admin-page-content"] });
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-3xl">
      <p className="text-sm text-muted-foreground">
        Edit the HTML content for each legal page. These are rendered on the public site.
      </p>
      {PAGE_KEYS.map((page) => (
        <div key={page.key} className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{page.label}</Label>
            <span className="text-xs text-muted-foreground font-mono">{page.slug}</span>
          </div>
          <Textarea
            rows={12}
            value={values[page.key] ?? ""}
            onChange={(e) => setValues({ ...values, [page.key]: e.target.value })}
            placeholder="Paste HTML content here..."
            className="font-mono text-xs"
          />
        </div>
      ))}
      <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur py-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save page content
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────── Roadmap Manager ───────────────────────────

type RoadmapItem = {
  id: string;
  status: "done" | "progress" | "planned";
  title: string;
  desc: string;
};

const ROADMAP_KEY = "roadmap_items";
const DEFAULT_ROADMAP: RoadmapItem[] = [
  {
    id: "1",
    status: "done",
    title: "AI Tutor & Doubt Solver",
    desc: "Multi-model chat with course context.",
  },
  {
    id: "2",
    status: "done",
    title: "Courses, Modules & Lessons",
    desc: "Full course builder with assignments and MCQ tests.",
  },
  {
    id: "3",
    status: "done",
    title: "Wallet & Cart Checkout",
    desc: "Top-up, paid course enrollment, transaction history.",
  },
  {
    id: "4",
    status: "done",
    title: "Certificates",
    desc: "Issue, design, PDF download, QR verify, email delivery.",
  },
  {
    id: "5",
    status: "progress",
    title: "Cohort Live Sessions",
    desc: "Scheduled live rooms with recordings.",
  },
  {
    id: "6",
    status: "progress",
    title: "Creator Payouts",
    desc: "Automatic monthly creator settlements.",
  },
  {
    id: "7",
    status: "planned",
    title: "Mobile App",
    desc: "iOS + Android with offline lessons.",
  },
  {
    id: "8",
    status: "planned",
    title: "Skill Graph & Career AI",
    desc: "Personalized career paths with skill gap analysis.",
  },
];

function RoadmapManager() {
  const qc = useQueryClient();
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<RoadmapItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const doQuery = useServerFn(adminContentQuery);
  const doUpsert = useServerFn(adminContentUpsert);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-roadmap"],
    queryFn: async () => {
      const result: any = await doQuery({
        data: {
          table: "site_settings",
          columns: "value",
          eqFilter: { column: "key", value: ROADMAP_KEY },
          single: true,
        },
      });
      if (result?.value) {
        try {
          return JSON.parse(result.value as string) as RoadmapItem[];
        } catch {
          return DEFAULT_ROADMAP;
        }
      }
      return DEFAULT_ROADMAP;
    },
  });

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const save = async () => {
    setSaving(true);
    try {
      await doUpsert({
        data: {
          table: "site_settings",
          data: {
            key: ROADMAP_KEY,
            value: JSON.stringify(items),
            updated_at: new Date().toISOString(),
          },
          onConflict: "key",
        },
      });
    } catch (e: any) {
      setSaving(false);
      return toast.error(e?.message || "Save failed");
    }
    setSaving(false);
    toast.success("Roadmap saved");
    qc.invalidateQueries({ queryKey: ["admin-roadmap"] });
  };

  const addItem = () => {
    const newItem: RoadmapItem = {
      id: Date.now().toString(),
      status: "planned",
      title: "",
      desc: "",
    };
    setItems([...items, newItem]);
    setEditing(newItem);
  };

  const deleteItem = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDeleteItem = () => {
    if (!deleteTargetId) return;
    setItems(items.filter((i) => i.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  const updateItem = (id: string, updates: Partial<RoadmapItem>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage the public roadmap shown at /roadmap. Add, edit, or reorder items.
        </p>
        <Button onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" /> Add item
        </Button>
      </div>

      <DragDropContext
        onDragEnd={(result: DropResult) => {
          if (!result.destination) return;
          const reordered = Array.from(items);
          const [moved] = reordered.splice(result.source.index, 1);
          reordered.splice(result.destination.index, 0, moved);
          setItems(reordered);
        }}
      >
        <Droppable droppableId="roadmap">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
              {items.map((item, idx) => (
                <Draggable key={item.id} draggableId={item.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`rounded-xl border bg-card p-4 transition-shadow ${snapshot.isDragging ? "shadow-lg border-primary/40" : "border-border/60"}`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <button
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-0.5"
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateItem(item.id, {
                                status: e.target.value as RoadmapItem["status"],
                              })
                            }
                            className="text-xs border rounded px-1.5 py-0.5 bg-background"
                          >
                            <option value="done">Shipped</option>
                            <option value="progress">In progress</option>
                            <option value="planned">Planned</option>
                          </select>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditing(editing?.id === item.id ? null : item)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      {editing?.id === item.id ? (
                        <div className="space-y-2">
                          <Input
                            value={item.title}
                            onChange={(e) => updateItem(item.id, { title: e.target.value })}
                            placeholder="Title"
                          />
                          <Input
                            value={item.desc}
                            onChange={(e) => updateItem(item.id, { desc: e.target.value })}
                            placeholder="Description"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold text-sm">{item.title || "Untitled"}</div>
                          {item.desc && (
                            <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {items.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No roadmap items yet. Click "Add item" to start.
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="pt-2 sticky bottom-0 bg-background/95 backdrop-blur py-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save roadmap
        </Button>
      </div>

      <AlertDialog open={!!deleteTargetId} onOpenChange={(v) => !v && setDeleteTargetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this roadmap item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "
              {items.find((i) => i.id === deleteTargetId)?.title || "Untitled"}" from the public
              roadmap.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteItem}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─────────────────────────── Community Groups (Cohorts) ───────────────────────────

type CohortRow = {
  id: string;
  title: string;
  description: string | null;
  kind: string;
  starts_at: string;
  capacity: number | null;
  status: string;
  group_link: string | null;
  creator_id: string;
};

function CohortsManager() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<CohortRow | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const doAdminAction = useServerFn(adminContentAction);
  const doQuery = useServerFn(adminContentQuery);

  const { data: cohorts = [], isLoading } = useQuery({
    queryKey: ["admin-cohorts"],
    queryFn: async () => {
      const result = await doQuery({
        data: {
          table: "cohorts",
          columns:
            "id, title, description, kind, starts_at, capacity, status, group_link, creator_id",
          orderBy: "starts_at",
          ascending: false,
          limit: 100,
        },
      });
      return (result ?? []) as unknown as CohortRow[];
    },
  });

  const newCohort = () => {
    setEditing({
      id: "",
      title: "",
      description: "",
      kind: "study_group",

      starts_at: new Date().toISOString().slice(0, 16),
      capacity: 50,
      status: "draft",
      group_link: "",
      creator_id: "",
    });
    setOpen(true);
  };

  const removeCohort = async () => {
    if (!deleteId) return;
    try {
      await doAdminAction({ data: { table: "cohorts", action: "delete", id: deleteId } });
    } catch (e: any) {
      return toast.error(e?.message || "Delete failed");
    }
    toast.success("Cohort deleted");
    setDeleteId(null);
    qc.invalidateQueries({ queryKey: ["admin-cohorts"] });
    qc.invalidateQueries({ queryKey: ["cohorts"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={newCohort}>
          <Plus className="h-4 w-4 mr-2" />
          New group
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : cohorts.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-10">No community groups yet.</p>
      ) : (
        <div className="space-y-2">
          {cohorts.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-border/60 bg-card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate flex items-center gap-2">
                  {c.title}
                  <Badge
                    variant={c.status === "live" ? "default" : "outline"}
                    className="text-[10px] capitalize"
                  >
                    {c.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    {c.kind?.replace("_", " ")}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                  <span>{c.starts_at ? format(new Date(c.starts_at), "PP") : "—"}</span>
                  {c.capacity && <span>· {c.capacity} seats</span>}
                  {c.group_link && <span>· 🔗 link set</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(c);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDeleteId(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CohortDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        cohort={editing}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-cohorts"] });
          qc.invalidateQueries({ queryKey: ["cohorts"] });
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the cohort and associated member data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeCohort}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CohortDialog({
  open,
  onOpenChange,
  cohort,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  cohort: CohortRow | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<CohortRow | null>(cohort);
  const [saving, setSaving] = useState(false);
  const doAdminAction = useServerFn(adminContentAction);

  useEffect(() => {
    setForm(cohort);
  }, [cohort]);

  if (!form) return null;

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload: Record<string, any> = {
      title: form.title.trim(),
      description: form.description?.trim() || null,
      kind: form.kind,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : new Date().toISOString(),
      capacity: form.capacity || null,
      status: form.status,
      group_link: form.group_link?.trim() || null,
    };
    try {
      if (form.id) {
        await doAdminAction({
          data: { table: "cohorts", action: "update", id: form.id, data: payload },
        });
      } else {
        await doAdminAction({
          data: { table: "cohorts", action: "insert", data: { ...payload, creator_id: "" } },
        });
      }
    } catch (e: any) {
      setSaving(false);
      return toast.error(e?.message || "Save failed");
    }
    setSaving(false);
    toast.success(form.id ? "Group updated" : "Group created");
    onSaved();
    onOpenChange(false);
  };

  const localStarts = (() => {
    try {
      return format(new Date(form.starts_at), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit group" : "New group"}</DialogTitle>
          <DialogDescription>
            Manage community groups, study groups, and office hours.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Kind</Label>
              <select
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="cohort">Live cohort</option>
                <option value="study_group">Study group</option>
                <option value="office_hours">Office hours</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start date</Label>
              <Input
                type="datetime-local"
                value={localStarts}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input
                type="number"
                value={form.capacity ?? ""}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) || null })}
              />
            </div>
          </div>
          <div>
            <Label>Group chat link (WhatsApp / Discord / Telegram)</Label>
            <Input
              value={form.group_link ?? ""}
              onChange={(e) => setForm({ ...form, group_link: e.target.value })}
              placeholder="https://chat.whatsapp.com/... or https://discord.gg/..."
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              This link will be shown on the dashboard so members can join the group chat.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  PROMO BANNER MANAGER                                                */
/* ------------------------------------------------------------------ */
function PromoBannerManager() {
  const qc = useQueryClient();
  const doUpsert = useServerFn(adminContentUpsert);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [form, setForm] = useState({
    enabled: true,
    headline: "Launch Offer",
    discount: "20% Off",
    subtitle: "Limited Time",
    cta: "Claim Now",
    ctaLink: "/pricing?coupon=LAUNCH20",
    timerEndDate: "",
    bgGradient: "from-blue-600 via-indigo-600 to-purple-700",
    dismissible: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("wcms_sections")
          .select("content")
          .eq("key", "promo-banner")
          .maybeSingle();
        if (data?.content) {
          const c = data.content as any;
          setForm({
            enabled: c.enabled ?? true,
            headline: c.headline ?? "Launch Offer",
            discount: c.discount ?? "20% Off",
            subtitle: c.subtitle ?? "Limited Time",
            cta: c.cta ?? "Claim Now",
            ctaLink: c.ctaLink ?? "/pricing?coupon=LAUNCH20",
            timerEndDate: c.timerEndDate ?? "",
            bgGradient: c.bgGradient ?? "from-blue-600 via-indigo-600 to-purple-700",
            dismissible: c.dismissible ?? true,
          });
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await doUpsert({
        data: {
          table: "wcms_sections" as any,
          data: {
            key: "promo-banner",
            name: "Promotional Banner",
            description: "Launch offer banner shown across the site",
            block_type: "custom",
            content: {
              enabled: form.enabled,
              headline: form.headline,
              discount: form.discount,
              subtitle: form.subtitle,
              cta: form.cta,
              ctaLink: form.ctaLink,
              timerEndDate: form.timerEndDate,
              bgGradient: form.bgGradient,
              dismissible: form.dismissible,
            },
          },
          onConflict: "key",
        },
      });
      toast.success("Promo banner saved!");
      qc.invalidateQueries({ queryKey: ["admin-sections"] });
    } catch (e: any) {
      toast.error(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const resetDismissed = () => {
    localStorage.removeItem("learnify_promo_banner_dismissed");
    toast.success("Dismiss state cleared for all users (local only)");
  };

  if (!loaded) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const GRADIENTS = [
    { value: "from-blue-600 via-indigo-600 to-purple-700", label: "Indigo" },
    { value: "from-emerald-600 via-teal-600 to-cyan-700", label: "Emerald" },
    { value: "from-orange-500 via-red-600 to-pink-700", label: "Fire" },
    { value: "from-gray-900 via-slate-800 to-gray-700", label: "Dark" },
    { value: "from-violet-600 via-purple-600 to-pink-600", label: "Violet" },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Promo Banner Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure the launch offer banner shown at the top of the pricing page.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <Label>Enable Banner</Label>
            <p className="text-xs text-muted-foreground">Show or hide the banner site-wide</p>
          </div>
          <Switch
            checked={form.enabled}
            onCheckedChange={(v) => setForm({ ...form, enabled: v })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Headline</Label>
            <Input
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="Launch Offer"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Discount Text</Label>
            <Input
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              placeholder="20% Off"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Subtitle</Label>
            <Input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="Limited Time"
            />
          </div>
          <div className="space-y-1.5">
            <Label>CTA Text</Label>
            <Input
              value={form.cta}
              onChange={(e) => setForm({ ...form, cta: e.target.value })}
              placeholder="Claim Now"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>CTA Link</Label>
          <Input
            value={form.ctaLink}
            onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
            placeholder="/pricing?coupon=LAUNCH20"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Timer End Date</Label>
          <Input
            type="datetime-local"
            value={form.timerEndDate}
            onChange={(e) => setForm({ ...form, timerEndDate: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to use timerDays (default 7 days from now)
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Background Gradient</Label>
          <Select
            value={form.bgGradient}
            onValueChange={(v) => setForm({ ...form, bgGradient: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GRADIENTS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className={`mt-2 h-8 rounded-lg bg-gradient-to-r ${form.bgGradient}`} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Dismissible</Label>
            <p className="text-xs text-muted-foreground">Allow users to close the banner</p>
          </div>
          <Switch
            checked={form.dismissible}
            onCheckedChange={(v) => setForm({ ...form, dismissible: v })}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
        <Button variant="outline" size="sm" onClick={resetDismissed}>
          Reset Dismiss State
        </Button>
      </div>
    </div>
  );
}
