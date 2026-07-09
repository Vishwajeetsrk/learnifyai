import { useRef, useState, useMemo } from "react";
import { Download, Printer, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { Topic } from "@/components/system-design/types";
import { formatTimestamp } from "@/components/video-player/types";

interface CheatSheetGeneratorProps {
  topic: Topic;
  onClose?: () => void;
}

type SectionToggle = "summary" | "keyPoints" | "architecture" | "comparisons" | "quiz" | "companies";

export function CheatSheetGenerator({ topic, onClose }: CheatSheetGeneratorProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const [sections, setSections] = useState<Record<SectionToggle, boolean>>({
    summary: true,
    keyPoints: true,
    architecture: true,
    comparisons: true,
    quiz: true,
    companies: true,
  });

  const toggleSection = (key: SectionToggle) => {
    setSections((s) => ({ ...s, [key]: !s[key] }));
  };

  const keyPoints = useMemo(() => {
    const points: string[] = [];
    points.push(topic.description.split(". ").slice(0, 3).join(". ") + ".");
    for (const section of topic.sections) {
      const sentences = section.content.split(". ");
      points.push(sentences.slice(0, 2).join(". ") + ".");
    }
    return points.slice(0, 8);
  }, [topic]);

  const handleExportPDF = async () => {
    if (!sheetRef.current) return;
    setGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(sheetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`${topic.id}-cheat-sheet.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const content = sheetRef.current?.innerHTML || "";
    printWindow.document.write(`
      <html>
        <head>
          <title>${topic.title} - Cheat Sheet</title>
          <style>
            @page { margin: 15mm; }
            body { font-family: Inter, system-ui, sans-serif; color: #111; line-height: 1.5; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            h2 { font-size: 14px; margin-top: 16px; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
            p, li { font-size: 11px; }
            ul { padding-left: 16px; }
            .cheat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .card { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; margin-bottom: 6px; }
            .arch-diagram { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; margin: 8px 0; }
            .meta { font-size: 10px; color: #6b7280; margin-bottom: 8px; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-card">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold">Sections to include</p>
          <div className="flex flex-wrap gap-2 mt-1.5">
            {Object.entries(sections).map(([key, val]) => (
              <label key={key} className="flex items-center gap-1.5 cursor-pointer">
                <Switch
                  checked={val}
                  onCheckedChange={() => toggleSection(key as SectionToggle)}
                  aria-label={`Toggle ${key}`}
                />
                <span className="text-[10px] capitalize text-muted-foreground">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Button variant="outline" size="sm" className="text-xs" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5 mr-1.5" /> Print
          </Button>
          <Button size="sm" className="text-xs" onClick={handleExportPDF} disabled={generating}>
            {generating ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5 mr-1.5" />
            )}
            {generating ? "Generating..." : "PDF"}
          </Button>
        </div>
      </div>

      {/* Cheat Sheet Content */}
      <div
        ref={sheetRef}
        className="bg-white text-black rounded-xl border border-border overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <div className="p-6 space-y-5">
          {/* Header */}
          <div>
            <h1 className="text-xl font-bold">{topic.title}</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">{topic.subtitle}</p>
            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400 flex-wrap">
              <span className={cn(
                "inline-block px-1.5 py-0.5 rounded border text-[9px] font-medium capitalize",
                topic.difficulty === "beginner" && "text-green-600 border-green-300 bg-green-50",
                topic.difficulty === "intermediate" && "text-yellow-600 border-yellow-300 bg-yellow-50",
                topic.difficulty === "advanced" && "text-red-600 border-red-300 bg-red-50",
              )}>
                {topic.difficulty}
              </span>
              <span>{topic.duration}</span>
              {topic.prerequisites.length > 0 && <span>Prerequisites: {topic.prerequisites.join(", ")}</span>}
            </div>
          </div>

          {/* Companies */}
          {sections.companies && topic.companies.length > 0 && (
            <div>
              <p className="text-[9px] text-gray-400 uppercase tracking-wider font-semibold mb-1">Used by</p>
              <div className="flex flex-wrap gap-1.5">
                {topic.companies.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded text-[10px] border border-gray-200 bg-gray-50 font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {sections.summary && (
            <div>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-2">Summary</h2>
              <p className="text-[11px] leading-relaxed text-gray-700">{topic.description}</p>
            </div>
          )}

          {/* Key Points */}
          {sections.keyPoints && keyPoints.length > 0 && (
            <div>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-2">Key Points</h2>
              <ul className="space-y-1">
                {keyPoints.map((point, i) => (
                  <li key={i} className="text-[11px] text-gray-700 flex items-start gap-1.5">
                    <span className="text-gray-300 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Architecture */}
          {sections.architecture && topic.architecture && (
            <div>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-2">Architecture</h2>
              <div className="p-3 rounded-lg border border-gray-200 bg-gray-50/50 text-center">
                <p className="text-[10px] text-gray-500">{topic.architecture.description}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {topic.architecture.nodes.map((n) => (
                    <span key={n.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] border font-mono">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        n.type === "user" && "bg-purple-500",
                        n.type === "service" && "bg-blue-500",
                        n.type === "database" && "bg-red-500",
                        n.type === "cache" && "bg-yellow-500",
                        n.type === "queue" && "bg-emerald-500",
                        n.type === "gateway" && "bg-pink-500",
                        n.type === "cdn" && "bg-cyan-500",
                        n.type === "loadbalancer" && "bg-orange-500",
                      )} />
                      {n.label}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  {topic.architecture.edges.map((e, i) => (
                    <span key={i} className="text-[8px] text-gray-400 font-mono">
                      {e.from} → {e.to}{e.label ? ` (${e.label})` : ""}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comparisons */}
          {sections.comparisons && topic.comparisons && topic.comparisons.length > 0 && (
            <div>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-2">Comparisons</h2>
              {topic.comparisons.map((comp, ci) => (
                <div key={ci} className="grid grid-cols-2 gap-2 mb-2">
                  {comp.items.map((item) => (
                    <div key={item.name} className="p-2 rounded border border-gray-200">
                      <p className="text-[10px] font-bold mb-1">{item.name}</p>
                      <p className="text-[9px] text-gray-500">Pros: {item.pros.slice(0, 3).join(", ")}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">Cons: {item.cons.slice(0, 2).join(", ")}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Quiz */}
          {sections.quiz && topic.quiz.length > 0 && (
            <div>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-2">Quick Quiz</h2>
              <div className="space-y-2">
                {topic.quiz.slice(0, 4).map((q) => (
                  <div key={q.id} className="p-2 rounded border border-gray-200">
                    <p className="text-[10px] font-medium">{q.question}</p>
                    <p className="text-[9px] text-gray-500 mt-0.5">
                      Answer: {q.options[q.correctIndex]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case Studies */}
          {topic.caseStudies && topic.caseStudies.length > 0 && (
            <div>
              <h2 className="text-sm font-bold border-b border-gray-200 pb-1 mb-2">Case Studies</h2>
              {topic.caseStudies.map((cs, i) => (
                <div key={i} className="p-2 rounded border border-gray-200 mb-1.5">
                  <p className="text-[10px] font-bold">{cs.company}: {cs.title}</p>
                  <p className="text-[9px] text-gray-600 mt-0.5">{cs.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="text-[8px] text-gray-400 border-t border-gray-200 pt-2 flex justify-between">
            <span>Generated by Learnify AI</span>
            <span>{topic.title} Cheat Sheet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
