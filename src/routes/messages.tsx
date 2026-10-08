import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { api } from "../../convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { data: getMine } = useSuspenseQuery(
    convexQuery(api.conversations.listMine, {}),
  );

  return (
    <>
      {getMine.map((conversation) => {
        return (
          <Link
            to="/messages/$conversationId"
            params={{ conversationId: conversation.conversationId }}
            key={conversation._id}
          >
            {conversation.conversationId}
          </Link>
        );
      })}
      <Outlet />
    </>
  );
}
