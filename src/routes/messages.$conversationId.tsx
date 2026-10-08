import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Chat } from "@/components/Chat";

export const Route = createFileRoute("/messages/$conversationId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { conversationId: conversationIdRaw } = Route.useParams();
  const conversationId = conversationIdRaw as Id<"conversations">;
  const { data: conversations } = useSuspenseQuery(
    convexQuery(api.conversations.get, { conversationId }),
  );
  return (
    <Chat conversationId={conversationId} />
  );
}
