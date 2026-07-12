import { createFileRoute } from "@tanstack/react-router";
import { InterviewPage } from "@/components/career-studio/InterviewPage";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({ meta: [{ title: "Interview Prep — Learnify AI" }] }),
  component: InterviewPage,
});
