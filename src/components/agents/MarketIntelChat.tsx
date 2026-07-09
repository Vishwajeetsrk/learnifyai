import { TrendingUp } from "lucide-react";
import { AgentChat } from "./AgentChat";
import { marketIntelChat } from "@/lib/market-intel.functions";

const SUGGESTIONS = [
  { label: "AI/ML engineer salary India", prompt: "What's the current salary range for AI/ML engineers in India across experience levels? Include Bengaluru vs Pune data." },
  { label: "Most in-demand skills 2026", prompt: "What are the top 10 most in-demand tech skills in India for 2026? I want to know which ones have the highest growth." },
  { label: "Frontend vs Backend demand", prompt: "Which has more job openings in India right now — frontend or backend development? Include fresher vs experienced data." },
  { label: "Company hiring trends Q3 2026", prompt: "Which tech companies are hiring the most in India right now? Are there any recent layoffs or hiring freezes I should know about?" },
];

export function MarketIntelChat() {
  return (
    <AgentChat
      agentName="Market Intelligence"
      agentIcon={<TrendingUp className="h-3.5 w-3.5 text-white" />}
      agentColor="bg-violet-600"
      accentGradient="bg-gradient-to-br from-violet-600 to-violet-700"
      chatFn={marketIntelChat}
      placeholder="Ask about salary trends, skill demand, job market data..."
      suggestions={SUGGESTIONS}
    />
  );
}
