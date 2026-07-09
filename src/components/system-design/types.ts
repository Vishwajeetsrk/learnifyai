export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  companies: string[];
  prerequisites: string[];
  sections: Section[];
  quiz: QuizQuestion[];
  architecture?: ArchitectureDiagram;
  comparisons?: Comparison[];
  caseStudies?: CaseStudy[];
}

export interface Section {
  id: string;
  title: string;
  type: "text" | "visual" | "code" | "story" | "comparison" | "simulation";
  content: string;
  visual?: ArchitectureDiagram;
  story?: { context: string; analogy: string; transition: string };
}

export interface ArchitectureDiagram {
  nodes: ArchNode[];
  edges: ArchEdge[];
  description: string;
}

export interface ArchNode {
  id: string;
  label: string;
  type: "user" | "service" | "database" | "cache" | "queue" | "gateway" | "cdn" | "loadbalancer";
  x?: number;
  y?: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

export interface Comparison {
  title: string;
  items: { name: string; icon: string; pros: string[]; cons: string[]; useCases: string[] }[];
}

export interface CaseStudy {
  company: string;
  title: string;
  description: string;
  architecture: ArchitectureDiagram;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface KnowledgeNode {
  id: string;
  label: string;
  group: string;
  description: string;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  label: string;
}
