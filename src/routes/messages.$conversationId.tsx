import { createFileRoute } from "@tanstack/react-router";
import { Id } from "../../convex/_generated/dataModel";
import { Chat } from "@/components/Chat";

export const Route = createFileRoute("/messages/$conversationId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { conversationId: conversationIdRaw } = Route.useParams();
  const conversationId = conversationIdRaw as Id<"conversations">;
  return (
    <Chat conversationId={conversationId} />
  );
}
