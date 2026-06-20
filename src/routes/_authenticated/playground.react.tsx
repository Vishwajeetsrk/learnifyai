import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ReactPlayground } from "@/components/playground/ReactPlayground";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/playground/react")({
  head: () => ({ meta: [{ title: "React Sandbox — Learnify AI" }] }),
  component: () => (
    <AppShell>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b bg-card shrink-0 text-sm">
          <Link to="/playground" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="font-medium">React Sandbox</span>
          <span className="text-xs text-muted-foreground">— powered by Sandpack</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <ReactPlayground />
        </div>
      </div>
    </AppShell>
  ),
});
