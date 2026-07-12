import { createFileRoute } from "@tanstack/react-router";
import { AtsCheckerPage } from "@/components/career-studio/AtsCheckerPage";

export const Route = createFileRoute("/_authenticated/ats-checker")({
  head: () => ({ meta: [{ title: "ATS Checker — Learnify AI" }] }),
  component: AtsCheckerPage,
});
