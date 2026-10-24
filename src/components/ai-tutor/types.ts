export type ArtifactType =
  | "quiz"
  | "diagram"
  | "flashcards"
  | "exam"
  | "plan"
  | "actions"
  | "clarification";

export interface QuizOption {
  text: string;
}

export interface QuizArtifact {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  topic?: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  sub?: string;
  badge?: string;
  icon?: string;
}

export interface DiagramArtifact {
  title: string;
  type?: "flowchart" | "architecture" | "timeline" | "layers";
  nodes: DiagramNode[];
}

export interface FlashcardItem {
  front: string;
  back: string;
  hint?: string;
}

export type FlashcardsArtifact = FlashcardItem[];

export interface ExamArtifact {
  topic: string;
  marks2?: string;
  marks5?: string;
  marks8?: string;
  marks10?: string;
}

export interface StudyPlanDay {
  day: number | string;
  topic: string;
  tasks: string[];
}

export interface StudyPlanArtifact {
  title: string;
  duration?: string;
  days: StudyPlanDay[];
}

export type ActionsArtifact = string[];

export interface ClarificationArtifact {
  prompt: string;
  options: Array<{
    label: string;
    value: string;
    description?: string;
  }>;
}

export interface ArtifactBlock {
  type: ArtifactType;
  data: any;
  raw: string;
}

export interface ParsedSegment {
  type: "markdown" | "artifact";
  content: string;
  artifact?: ArtifactBlock;
}

export type ActivityStep =
  | "understanding"
  | "planning"
  | "generating"
  | "finalizing";
