/**
 * BadgeCriteriaEngine.ts
 * Client & server utility for evaluating and formatting badge criteria.
 * Secure: strictly declarative logic, no eval() or dynamic code execution.
 */
import type { BadgeCriteria, BadgeCriteriaType } from "./types";

export interface LearnerCompletionContext {
  score?: number;
  total?: number;
  completed?: boolean;
  completionTimeMs?: number;
  fastLearnerThresholdMs?: number;
  projectApproved?: boolean;
  communityContributions?: number;
}

export interface CriteriaEvaluationResult {
  eligible: boolean;
  passedCriteria: string[];
  failedCriteria: string[];
}

export const CRITERIA_DEFINITIONS: Record<
  BadgeCriteriaType,
  {
    label: string;
    description: string;
    requiresThreshold: boolean;
    defaultThreshold?: number;
    unit?: string;
  }
> = {
  score_gte: {
    label: "Score at least (>= %)",
    description: "Learner achieves a score percentage equal to or higher than the threshold.",
    requiresThreshold: true,
    defaultThreshold: 90,
    unit: "%",
  },
  score_eq: {
    label: "Perfect score (= 100%)",
    description: "Learner achieves an exact 100% score.",
    requiresThreshold: true,
    defaultThreshold: 100,
    unit: "%",
  },
  course_completed: {
    label: "Course completed",
    description: "Learner finishes all required lessons and modules in the course.",
    requiresThreshold: false,
  },
  fast_learner: {
    label: "Fast learner (speed completion)",
    description: "Learner completes the course faster than the course speed benchmark.",
    requiresThreshold: false,
  },
  project_approved: {
    label: "Capstone project approved",
    description: "Learner submits a capstone project that receives instructor approval.",
    requiresThreshold: false,
  },
  community_contributions_gte: {
    label: "Community contributions (>= count)",
    description: "Learner makes at least this many verified discussions or forum answers.",
    requiresThreshold: true,
    defaultThreshold: 5,
    unit: "contributions",
  },
  custom: {
    label: "Special recognition (manual / award)",
    description: "Awarded manually or through specific accredited events.",
    requiresThreshold: false,
  },
};

/**
 * Returns a human-friendly label for a specific badge criteria rule.
 */
export function getCriteriaLabel(criterion: BadgeCriteria): string {
  if (criterion.description) return criterion.description;

  switch (criterion.type) {
    case "score_gte":
      return `Scored ${criterion.threshold ?? 90}% or higher`;
    case "score_eq":
      return `Achieved a perfect score of ${criterion.threshold ?? 100}%`;
    case "course_completed":
      return "Successfully completed all curriculum modules";
    case "fast_learner":
      return "Completed curriculum in record time";
    case "project_approved":
      return "Submitted an approved capstone project";
    case "community_contributions_gte":
      return `Contributed ${criterion.threshold ?? 5}+ answers or discussions`;
    case "custom":
      return "Awarded for exceptional merit and distinction";
    default:
      return "Course achievement requirement met";
  }
}

/**
 * Evaluates whether a completion context passes an array of badge criteria.
 */
export function evaluateBadgeCriteria(
  criteria: BadgeCriteria[],
  context: LearnerCompletionContext
): CriteriaEvaluationResult {
  if (!criteria || criteria.length === 0) {
    return { eligible: true, passedCriteria: [], failedCriteria: [] };
  }

  const passedCriteria: string[] = [];
  const failedCriteria: string[] = [];

  const pct =
    context.total && context.total > 0
      ? Math.round(((context.score ?? 0) / context.total) * 100)
      : (context.score ?? 0);

  for (const c of criteria) {
    const label = getCriteriaLabel(c);
    let passed = false;

    switch (c.type) {
      case "score_gte":
        passed = pct >= (c.threshold ?? 0);
        break;
      case "score_eq":
        passed = pct === (c.threshold ?? 100);
        break;
      case "course_completed":
        passed = context.completed === true;
        break;
      case "fast_learner":
        passed =
          context.completionTimeMs !== undefined &&
          context.fastLearnerThresholdMs !== undefined &&
          context.completionTimeMs <= context.fastLearnerThresholdMs;
        break;
      case "project_approved":
        passed = context.projectApproved === true;
        break;
      case "community_contributions_gte":
        passed = (context.communityContributions ?? 0) >= (c.threshold ?? 0);
        break;
      case "custom":
        passed = false; // Custom badges must be awarded via admin action
        break;
      default:
        passed = false;
    }

    if (passed) {
      passedCriteria.push(label);
    } else {
      failedCriteria.push(label);
    }
  }

  return {
    eligible: failedCriteria.length === 0,
    passedCriteria,
    failedCriteria,
  };
}

/**
 * Standard badge criteria preset configurations for the admin badge designer.
 */
export const CRITERIA_PRESETS: Array<{
  name: string;
  category: string;
  criteria: BadgeCriteria[];
  iconName: string;
  primaryColor: string;
  accentColor: string;
}> = [
  {
    name: "Course Champion",
    category: "Completion",
    criteria: [{ type: "course_completed" }],
    iconName: "Trophy",
    primaryColor: "#4f46e5",
    accentColor: "#a5b4fc",
  },
  {
    name: "Honor Roll (90%+)",
    category: "Achievement",
    criteria: [{ type: "score_gte", threshold: 90 }],
    iconName: "Star",
    primaryColor: "#d97706",
    accentColor: "#fcd34d",
  },
  {
    name: "Perfect Mastery (100%)",
    category: "Mastery",
    criteria: [{ type: "score_gte", threshold: 100 }],
    iconName: "Crown",
    primaryColor: "#059669",
    accentColor: "#6ee7b7",
  },
  {
    name: "Speed Demon",
    category: "Speed",
    criteria: [{ type: "fast_learner" }],
    iconName: "Zap",
    primaryColor: "#0891b2",
    accentColor: "#67e8f9",
  },
  {
    name: "Capstone Distinction",
    category: "Project",
    criteria: [{ type: "project_approved" }, { type: "score_gte", threshold: 85 }],
    iconName: "Award",
    primaryColor: "#9333ea",
    accentColor: "#d8b4fe",
  },
];
