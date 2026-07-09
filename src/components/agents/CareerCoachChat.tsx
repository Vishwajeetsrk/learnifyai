import { Briefcase } from "lucide-react";
import { AgentChat } from "./AgentChat";
import { careerCoachChat } from "@/lib/career-coach.functions";

const SUGGESTIONS = [
  { label: "Resume review tips for FAANG", prompt: "What are the key things FAANG recruiters look for in a resume? I'm a senior engineer with 5 years experience." },
  { label: "SWE interview prep strategy", prompt: "I have 3 months to prepare for Google L4 interviews. What should my study plan look like?" },
  { label: "Service-based to product switch", prompt: "I'm at Infosys as a senior developer. How do I transition to a product-based company?" },
  { label: "Salary negotiation tactics", prompt: "I have an offer from a startup for ₹25 LPA. How should I negotiate for more?" },
];

export function CareerCoachChat() {
  return (
    <AgentChat
      agentName="Career Coach"
      agentIcon={<Briefcase className="h-3.5 w-3.5 text-white" />}
      agentColor="bg-blue-600"
      accentGradient="bg-gradient-to-br from-blue-600 to-blue-700"
      chatFn={careerCoachChat}
      placeholder="Get career advice, resume tips, interview prep..."
      suggestions={SUGGESTIONS}
    />
  );
}
