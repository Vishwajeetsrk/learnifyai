import { BookOpen } from "lucide-react";
import { AgentChat } from "./AgentChat";
import { learningAssistantChat } from "@/lib/learning-assistant.functions";

const SUGGESTIONS = [
  {
    label: "Explain React Server Components",
    prompt:
      "Can you explain React Server Components to me like I'm a junior developer? Include a simple code example.",
  },
  {
    label: "Study plan for TypeScript",
    prompt:
      "I'm a Python developer new to TypeScript. Create a 4-week study plan to get job-ready.",
  },
  {
    label: "Practice: Binary search problem",
    prompt: "Generate a LeetCode-style binary search practice problem with test cases.",
  },
  {
    label: "Review my code",
    prompt:
      "I wrote a Python function to fetch and paginate API data. Can you review it for best practices?",
  },
];

export function LearningAssistantChat() {
  return (
    <AgentChat
      agentName="Learning Assistant"
      agentIcon={<BookOpen className="h-3.5 w-3.5 text-white" />}
      agentColor="bg-emerald-600"
      accentGradient="bg-gradient-to-br from-emerald-600 to-emerald-700"
      chatFn={learningAssistantChat}
      placeholder="Ask about any tech topic, get study plans or practice problems..."
      suggestions={SUGGESTIONS}
    />
  );
}
