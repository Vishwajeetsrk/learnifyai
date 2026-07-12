import { createFileRoute } from "@tanstack/react-router";
import { PortfolioBuilderPage } from "@/components/career-studio/PortfolioBuilderPage";

export const Route = createFileRoute("/_authenticated/portfolio-builder")({
  head: () => ({ meta: [{ title: "Portfolio Builder — Learnify AI" }] }),
  component: PortfolioBuilderPage,
});
