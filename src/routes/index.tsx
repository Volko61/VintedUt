import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  return <Navigate to="/search" search={{ filter: "", query: "", sort: "newest" }} replace />;
}

