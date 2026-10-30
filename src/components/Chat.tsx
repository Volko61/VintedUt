import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePaginatedQuery } from "convex/react";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function Chat({ conversationId }: { conversationId: Id<"conversations"> }) {
  const { t } = useTranslation();
  const { data: conversation } = useSuspenseQuery(
    convexQuery(api.conversations.read, { id: conversationId }),
  );
  const { results: messages, status, loadMore } = usePaginatedQuery(
    api.conversations.get, { conversationId }, { initialNumItems: 5 },
  );
  if (!conversation) throw new Error(`Conversation ${conversationId} not found`)

  return (
    <>
      <div>
        Conversation between {conversation.seller} and {conversation.buyer}
      </div>
      <div>
        {messages.map((message) => {
          const { data: user } = useSuspenseQuery(
            convexQuery(api.users.read, { id: message.authorId }),
          );
          if (!user) throw new Error(`User ${message.authorId} not found`)

          return <>
            <div>{user.name + "->" + message.content}</div>
          </>
        })}
      </div>
    </>
  );
}
