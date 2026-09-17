import { createFileRoute } from "@tanstack/react-router";

import { HelloBoard } from "../components/HelloBoard";

export const Route = createFileRoute("/search")({
  component: HelloBoard,
});

