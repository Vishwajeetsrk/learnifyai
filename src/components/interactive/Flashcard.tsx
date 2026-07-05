import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit } from "lucide-react";

interface FlashcardProps {
  question: string;
  answer: string;
}

export function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto h-[250px] perspective-1000">
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={isFlipped}
        className="w-full h-full relative preserve-3d cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
        onClick={() => setIsFlipped(!isFlipped)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <div 
          className="absolute inset-0 backface-hidden bg-card border border-border rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center text-center space-y-4 hover:border-primary/50 transition-colors"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-medium leading-tight">{question}</h3>
          <p className="text-xs text-muted-foreground absolute bottom-4">Tap to flip</p>
        </div>

        {/* Back of Card */}
        <div 
          className="absolute inset-0 backface-hidden bg-primary/5 border border-primary/30 rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center text-center space-y-4"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-md font-semibold text-foreground leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}
