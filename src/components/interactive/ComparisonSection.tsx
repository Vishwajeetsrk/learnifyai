import { Check, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ComparisonSection() {
  const features = [
    {
      name: "24/7 Context-Aware AI Tutor",
      learnify: true,
      coursera: false,
      udemy: false,
      bootcamps: false,
    },
    {
      name: "Instant AI Resume & ATS Optimization",
      learnify: true,
      coursera: false,
      udemy: false,
      bootcamps: false,
    },
    {
      name: "Voice & Text AI Mock Interviews",
      learnify: true,
      coursera: false,
      udemy: false,
      bootcamps: "Partial",
    },
    {
      name: "Verified QR Certificates & 1-Click LinkedIn",
      learnify: true,
      coursera: true,
      udemy: false,
      bootcamps: true,
    },
    {
      name: "80/20 Creator & Coach Payout Share",
      learnify: true,
      coursera: false,
      udemy: false,
      bootcamps: false,
    },
    {
      name: "100+ Skill Tracks (Tech, Design, Marketing, Academic)",
      learnify: true,
      coursera: true,
      udemy: true,
      bootcamps: false,
    },
    {
      name: "Affordable Pricing (Free / ₹199/mo)",
      learnify: true,
      coursera: false,
      udemy: false,
      bootcamps: false,
    },
  ];

  return (
    <section className="container mx-auto px-6 py-24 border-t border-border/60">
      <div className="max-w-3xl mx-auto text-center mb-14">
        <Badge variant="secondary" className="mb-3 text-xs uppercase tracking-wider text-primary">
          <Sparkles className="w-3 h-3 mr-1" /> Platform Comparison
        </Badge>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          How Learnify AI Compares
        </h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg">
          See why 10,000+ modern learners choose Learnify AI over passive video catalogs and
          overpriced bootcamps.
        </p>
      </div>

      <div className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border bg-card shadow-lg">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 font-semibold text-muted-foreground">Key Capability</th>
              <th className="p-4 font-bold text-primary bg-primary/10 text-center">Learnify AI</th>
              <th className="p-4 font-semibold text-muted-foreground text-center">Coursera</th>
              <th className="p-4 font-semibold text-muted-foreground text-center">Udemy</th>
              <th className="p-4 font-semibold text-muted-foreground text-center">Bootcamps</th>
            </tr>
          </thead>
          <tbody>
            {features.map((row, i) => (
              <tr
                key={row.name}
                className={`border-b hover:bg-muted/20 ${i % 2 === 0 ? "bg-card" : "bg-muted/10"}`}
              >
                <td className="p-4 font-medium text-foreground">{row.name}</td>
                <td className="p-4 text-center bg-primary/5 font-bold">
                  {row.learnify ? (
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="p-4 text-center">
                  {row.coursera === true ? (
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : row.coursera === false ? (
                    <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{row.coursera}</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {row.udemy === true ? (
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : row.udemy === false ? (
                    <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{row.udemy}</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {row.bootcamps === true ? (
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  ) : row.bootcamps === false ? (
                    <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                  ) : (
                    <span className="text-xs text-muted-foreground">{row.bootcamps}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
