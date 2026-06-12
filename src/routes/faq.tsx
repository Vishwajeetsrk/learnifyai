import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { HelpCircle, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MarketingPage } from "@/components/MarketingPage";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Learnify AI" },
      {
        name: "description",
        content:
          "Answers to the most common questions about Learnify AI: certificates, courses, billing, and more.",
      },
      { property: "og:title", content: "FAQ — Learnify AI" },
      { property: "og:description", content: "Answers to common questions about Learnify AI." },
    ],
  }),
  component: FaqPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen grid place-items-center p-10 text-center">
      <p className="text-sm text-muted-foreground">Couldn't load FAQs: {error.message}</p>
    </div>
  ),
});

type FaqRow = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
};

function FaqPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["public-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer, category, order_index")
        .eq("published", true)
        .order("category", { ascending: true })
        .order("order_index", { ascending: true });
      if (error) throw error;
      return (data ?? []) as FaqRow[];
    },
  });

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(faqs.map((f) => f.category)))],
    [faqs],
  );
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return faqs.filter((f) => {
      if (cat !== "All" && f.category !== cat) return false;
      if (!ql) return true;
      return f.question.toLowerCase().includes(ql) || f.answer.toLowerCase().includes(ql);
    });
  }, [faqs, q, cat]);

  return (
    <MarketingPage
      eyebrow="Help Center"
      title="Frequently asked questions"
      subtitle="Answers about certificates, courses, billing, and creators."
    >
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground text-center">
          Can't find what you're looking for?{" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact us
          </Link>
          .
        </p>

        <div className="mt-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions..."
            className="pl-9 h-11"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="rounded-full"
              aria-pressed={cat === c}
            >
              <Badge variant={cat === c ? "default" : "outline"} className="cursor-pointer">
                {c}
              </Badge>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 grid place-items-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border bg-card p-12 text-center">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-3 font-medium">No matching questions.</p>
            <p className="text-sm text-muted-foreground">Try another search term.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="mt-8 space-y-2">
            {filtered.map((f) => (
              <AccordionItem key={f.id} value={f.id} className="rounded-xl border bg-card px-4">
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{f.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>
    </MarketingPage>
  );
}
