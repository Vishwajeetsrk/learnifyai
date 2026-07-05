import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowLeft, Play, Layout, Code2, BookOpen, Volume2, Lock } from "lucide-react";
import projectsData from "@/data/projects.json";

export const Route = createFileRoute("/course/$projectId")({
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { projectId } = Route.useParams();
  const { data: dbProject, isLoading } = useQuery({
    queryKey: ["design-project", projectId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("design_projects")
          .select("*")
          .eq("id", projectId)
          .maybeSingle();
        if (error || !data) return projectsData.find((p) => p.id === projectId) || null;
        return data;
      } catch {
        return projectsData.find((p) => p.id === projectId) || null;
      }
    }
  });

  const project = dbProject;
  const [activeTab, setActiveTab] = useState<"curriculum" | "tech" | "preview">("curriculum");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-display font-semibold mb-2 text-foreground">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">The template course you're looking for doesn't exist.</p>
        <Link to="/projects" className="text-primary hover:underline">
          &larr; Back to Projects
        </Link>
      </div>
    );
  }

  // @ts-ignore - course_modules is loosely typed in projects.json for now
  const modules = project.course_modules?.length > 0 ? project.course_modules : [
    {
      step: 1,
      title: "Project Setup & Environment",
      text: "Initialize a Vite + React + TypeScript workspace. Set up Tailwind CSS."
    },
    {
      step: 2,
      title: "UI Architecture & Layout",
      text: "Structure the main components. Build the navigation and responsive grid layouts."
    },
    {
      step: 3,
      title: "Implementing Core Features",
      text: `Develop the core functionality: ${project.description?.substring(0, 60) || project.title}...`
    },
    {
      step: 4,
      title: "Animations & Polish",
      text: "Add smooth transitions, hover effects, and animations to bring the template to life."
    }
  ];

  const descLower = (project.description || "").toLowerCase();
  const techStack = project.tech_stack || [
    { icon: Code2, title: "React + Vite", desc: "Frontend framework" },
    { icon: Layout, title: "Tailwind CSS", desc: "Styling engine" },
    ...(descLower.includes("gsap") ? [{ icon: Play, title: "GSAP", desc: "Animation library" }] : []),
    ...(descLower.includes("3d") || descLower.includes("spline") ? [{ icon: BookOpen, title: "Spline / 3D", desc: "Interactive 3D" }] : []),
    ...(descLower.includes("video") ? [{ icon: Play, title: "React Player", desc: "Video handling" }] : []),
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Breadcrumb */}
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Video / Hero Preview */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="aspect-video w-full bg-black rounded-2xl border border-border shadow-2xl overflow-hidden relative group">
                <iframe
                  src={project.path}
                  title={project.title}
                  className="w-full h-full pointer-events-none opacity-60 mix-blend-screen"
                />
                
                {/* Overlay Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all group-hover:bg-black/20">
                   <div className="flex flex-col items-center gap-3">
                     <button className="h-16 w-16 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center hover:scale-110 hover:bg-primary transition-all shadow-glow">
                        <Play className="h-6 w-6 ml-1" />
                     </button>
                     <span className="text-sm font-medium text-white/90">Watch Course Teaser</span>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground tracking-tight">
                   Build: {project.title}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                   <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">GSAP</span>
                   <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">React</span>
                   <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">Tailwind CSS</span>
                   <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">Advanced</span>
                </div>
              </div>

            </div>

            {/* Right Column: Curriculum & CTA */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-xl">
                 <h3 className="font-display font-semibold text-xl mb-4">Course Content</h3>
                 
                 <div className="flex items-center gap-4 border-b border-border mb-6">
                   <button 
                     onClick={() => setActiveTab("curriculum")}
                     className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "curriculum" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                   >
                     Curriculum
                   </button>
                   <button 
                     onClick={() => setActiveTab("tech")}
                     className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "tech" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                   >
                     Tech Stack
                   </button>
                 </div>

                 <div className="min-h-[250px]">
                   {activeTab === "curriculum" && (
                     <div className="space-y-4">
                       {modules.length > 0 ? (
                         modules.map((mod: any, i: number) => (
                           <div key={i} className="flex gap-4 group">
                             <div className="flex flex-col items-center">
                               <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                 {mod.step}
                               </div>
                               {i !== modules.length - 1 && <div className="w-[1px] h-full bg-border mt-2" />}
                             </div>
                             <div className="pb-4">
                               <h4 className="text-sm font-semibold text-foreground">{mod.title}</h4>
                               <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mod.text}</p>
                             </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-sm text-muted-foreground italic">
                           Curriculum is being updated...
                         </div>
                       )}
                     </div>
                   )}

                   {activeTab === "tech" && (
                     <div className="space-y-3">
                       {techStack.map((tech: any, idx: number) => {
                         const Icon = tech.icon;
                         return (
                           <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 border border-border/50 group hover:border-primary/50 transition-colors">
                             <Icon className="h-5 w-5 text-primary" />
                             <div>
                               <p className="text-sm font-medium">{tech.title}</p>
                               <p className="text-xs text-muted-foreground">{tech.desc}</p>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   )}
                 </div>

                 <div className="mt-8 space-y-3">
                   <Link to="/studio/$projectId" params={{ projectId: project.id }} className="w-full bg-primary text-primary-foreground font-semibold h-14 rounded-xl hover:bg-primary/90 transition-all flex flex-col items-center justify-center shadow-glow">
                     <div className="flex items-center gap-2">
                       <BookOpen className="h-4 w-4" /> Start Building Now
                     </div>
                     <div className="text-[10px] text-primary-foreground/80 font-normal uppercase tracking-wider flex items-center gap-1 mt-0.5">
                       <Lock className="h-2.5 w-2.5" /> Career Pro
                     </div>
                   </Link>
                   <a href={project.path} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center bg-secondary text-secondary-foreground font-medium h-12 rounded-xl hover:bg-secondary/80 transition-all">
                     View Live Template
                   </a>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
