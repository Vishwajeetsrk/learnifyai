import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Bug,
  Lightbulb,
  Wrench,
  Sparkles,
  FileText,
  Code2,
  Loader2,
  Send,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantPanelProps {
  code: string;
  language: string;
  onApplyFix?: (fixedCode: string) => void;
}

const AI_ACTIONS = [
  {
    id: "diagnose",
    label: "Diagnose Issues",
    icon: Bug,
    description: "Find bugs and errors in your code",
    color: "text-red-500",
    bgColor: "bg-red-500/10 hover:bg-red-500/20",
  },
  {
    id: "explain",
    label: "Explain Code",
    icon: Lightbulb,
    description: "Get a detailed explanation of what the code does",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10 hover:bg-yellow-500/20",
  },
  {
    id: "fix",
    label: "Fix Bugs",
    icon: Wrench,
    description: "Automatically fix detected issues",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20",
  },
  {
    id: "optimize",
    label: "Optimize",
    icon: Sparkles,
    description: "Improve performance and code quality",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20",
  },
  {
    id: "document",
    label: "Add Docs",
    icon: FileText,
    description: "Generate documentation and comments",
    color: "text-green-500",
    bgColor: "bg-green-500/10 hover:bg-green-500/20",
  },
  {
    id: "convert",
    label: "Convert",
    icon: Code2,
    description: "Convert code to another language or format",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 hover:bg-orange-500/20",
  },
];

export function AIAssistantPanel({ code, language, onApplyFix }: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAction, setExpandedAction] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAction = async (actionId: string) => {
    if (!code.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Please write some code first!", timestamp: new Date() },
      ]);
      return;
    }

    setIsLoading(true);
    const action = AI_ACTIONS.find((a) => a.id === actionId);

    // Add user message
    const userMessage: AIMessage = {
      role: "user",
      content: `${action?.label || actionId}`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response (in real implementation, this would call an AI API)
    setTimeout(() => {
      let response = "";

      switch (actionId) {
        case "diagnose":
          response = `## Code Analysis\n\n**Language:** ${language}\n**Lines:** ${code.split("\n").length}\n\n### Potential Issues:\n1. **No immediate syntax errors detected** - The code appears to be syntactically correct.\n2. **Code Structure:** The code follows reasonable patterns.\n3. **Suggestions:**\n   - Consider adding error handling for edge cases\n   - Add input validation if applicable\n   - Consider adding unit tests`;
          break;

        case "explain":
          response = `## Code Explanation\n\nThis ${language} code appears to:\n\n1. **Initialize** necessary variables and dependencies\n2. **Process** the main logic flow\n3. **Return** or output results\n\n### Key Components:\n- The code uses standard ${language} patterns\n- Functions are organized in a logical structure\n- Variables are properly declared and used\n\n### Flow:\nThe execution flows from top to bottom, with functions being called as needed.`;
          break;

        case "fix":
          response = `## Suggested Fixes\n\nHere are some improvements:\n\n\`\`\`javascript\n// Add error handling\ntry {\n  // Your existing code here\n} catch (error) {\n  console.error('Error:', error);\n  // Handle error gracefully\n}\n\`\`\`\n\n### Changes Made:\n1. Added try-catch block for error handling\n2. Added console logging for debugging\n3. Improved code structure`;
          break;

        case "optimize":
          response = `## Optimization Suggestions\n\n### Performance Improvements:\n1. **Reduce DOM operations** - Batch updates when possible\n2. **Use memoization** - Cache expensive computations\n3. **Lazy loading** - Load resources only when needed\n\n### Code Quality:\n1. **Extract functions** - Break complex logic into smaller functions\n2. **Use constants** - Define magic numbers as named constants\n3. **Add TypeScript types** - Improve type safety`;
          break;

        case "document":
          response = `## Generated Documentation\n\n\`\`\`javascript\n/**\n * Main function description\n * @param {type} param - Parameter description\n * @returns {type} Return description\n */\n\`\`\`\n\n### JSDoc Comments:\n- Added function documentation\n- Parameter descriptions\n- Return value documentation\n- Example usage`;
          break;

        case "convert":
          response = `## Conversion Options\n\n### To TypeScript:\n- Add type annotations\n- Define interfaces\n- Use generics where appropriate\n\n### To Modern JavaScript:\n- Use arrow functions\n- Use const/let instead of var\n- Use template literals\n- Use async/await`;
          break;

        default:
          response = "AI analysis complete. The code looks good!";
      }

      const assistantMessage: AIMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: AIMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: AIMessage = {
        role: "assistant",
        content: `I understand your question: "${userMessage.content}"\n\nBased on your ${language} code, here's my analysis:\n\nThe code appears to be well-structured. Let me know if you'd like me to:\n- Explain any specific part\n- Suggest optimizations\n- Add error handling\n- Convert to another format`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const copyMessage = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedMessage(index);
    setTimeout(() => setCopiedMessage(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-card border-l">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b bg-card">
        <Brain className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">AI Assistant</span>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b">
        <div className="grid grid-cols-2 gap-2">
          {AI_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                className={cn("h-auto py-2 px-3 justify-start text-left", action.bgColor)}
                onClick={() => handleAction(action.id)}
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", action.color)} />
                  <span className="text-xs font-medium">{action.label}</span>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Ask me anything about your code!</p>
            <p className="text-xs mt-2">Use the quick actions above or type a question</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-2",
                message.role === "user" ? "items-end" : "items-start",
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-3 text-sm max-w-full",
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => copyMessage(message.content, index)}
                  >
                    {copiedMessage === index ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your code..."
            className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button size="sm" onClick={handleSend} disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
