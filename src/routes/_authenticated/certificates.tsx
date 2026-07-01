import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Loader2, Download, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { AppShell } from "@/components/AppShell";
import { CertificatesListSkeleton } from "@/components/Skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/certificates")({
  head: () => ({ meta: [{ title: "Certificates — Learnify AI" }] }),
  component: CertsPage,
});

function CertsPage() {
  const { user } = useAuth();

  const q = useQuery({
    enabled: !!user,
    queryKey: ["certificates-list", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select(
          "id, code, score, total, issued_at, course_id, courses:course_id (title, instructor, cover_url, slug, category)",
        )
        .eq("user_id", user!.id)
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const certs = q.data ?? [];

  return (
    <AppShell>
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-6xl">
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl">
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-amber-300/30 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur grid place-items-center">
              <Award className="h-7 w-7" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] opacity-80">Learnify AI</div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold">Your Certificates</h1>
              <p className="text-sm opacity-90 mt-1">
                Download as PDF, share publicly, or email a verified copy.
              </p>
            </div>
            <div className="ml-auto hidden sm:block text-right">
              <div className="text-4xl font-display font-semibold">{certs.length}</div>
              <div className="text-xs opacity-80">earned</div>
            </div>
          </div>
        </div>

        {q.isLoading ? (
          <CertificatesListSkeleton />
        ) : certs.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-card p-12 text-center shadow-card">
            <ShieldCheck className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-3 font-medium">No certificates yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Complete a course and pass the final test to earn one.
            </p>
            <Link to="/courses" className="text-sm text-primary mt-3 inline-block">
              Browse courses →
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((c: any) => {
              const pct = c.total ? Math.round((c.score / c.total) * 100) : 0;
              const url = `/certificates/${c.code}`;
              return (
                <div
                  key={c.id}
                  className="rounded-2xl border bg-card overflow-hidden shadow-card flex flex-col"
                >
                  <div className="aspect-video relative bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <Award className="h-5 w-5" />
                      <Badge className="bg-white/15 hover:bg-white/15 text-[10px] backdrop-blur">
                        {pct}%
                      </Badge>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">
                        Certificate of Completion
                      </p>
                      <p className="font-display font-semibold leading-tight line-clamp-2">
                        {c.courses?.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Badge variant="outline" className="text-[10px]">
                        {c.courses?.category}
                      </Badge>
                      <span>· {format(new Date(c.issued_at), "dd MMM yyyy")}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono break-all">#{c.code}</p>
                    <div className="mt-auto pt-3 grid grid-cols-3 gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/certificates/$code" params={{ code: c.code }}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link
                          to="/certificates/$code"
                          params={{ code: c.code }}
                          search={{ download: 1 } as any}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link
                          to="/certificates/$code"
                          params={{ code: c.code }}
                          search={{ email: 1 } as any}
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
