import { createFileRoute } from "@tanstack/react-router";
import { CareerRoadmapPage } from "@/components/career-studio/CareerRoadmapPage";

export const Route = createFileRoute("/_authenticated/career-roadmap")({
  head: () => ({ meta: [{ title: "Career Roadmap — Learnify AI" }] }),
  component: CareerRoadmapPage,
});
