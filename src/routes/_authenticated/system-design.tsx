import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/system-design")({
  loader: () => {
    throw redirect({ to: "/system-design" });
  },
});
