import { createFileRoute } from "@tanstack/react-router";
import { ResumeBuilderPage } from "@/components/career-studio/ResumeBuilderPage";

export const Route = createFileRoute("/_authenticated/resume-builder")({
  head: () => ({ meta: [{ title: "Resume Builder — Learnify AI" }] }),
  component: ResumeBuilderPage,
});
