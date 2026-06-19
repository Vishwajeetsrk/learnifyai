import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/playground")({
  loader: () => {
    throw redirect({ to: "/playground/editor" });
  },
});
