import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/sponsor")({
  beforeLoad: () => {
    throw redirect({ to: "/support-us" });
  },
  component: () => null,
});
