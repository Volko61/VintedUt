import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

export function Chat({ conversationId }: { conversationId: Id<"conversations"> }) {
  const { data: conversation } = useSuspenseQuery(
    convexQuery(api.conversations.read, { id: conversationId }),
  );
  const { results: messages } = usePaginatedQuery(
    api.conversations.get, { conversationId }, { initialNumItems: 5 },
  );
  if (!conversation) throw new Error(`Conversation ${conversationId} not found`)
  const { data: me } = useSuspenseQuery(convexQuery(api.users.me, {}))
  const { data: seller } = useSuspenseQuery(convexQuery(api.users.read, { id: conversation.seller }))
  const { data: buyer } = useSuspenseQuery(convexQuery(api.users.read, { id: conversation.buyer }))
  const { data: item } = useSuspenseQuery(convexQuery(api.items.read, { id: conversation.itemId }))
  if (me == null) throw Error("Cannot find me")
  if (seller == null) throw Error("Cannot find the seller")
  if (buyer == null) throw Error("Cannot find the buyer")
  if (item == null) throw Error("Cannot find the item")
  return (
    <>
      <div>
        Conversation between {seller.name} and {buyer.name}
      </div>
      <div>
        {messages.map((message) => (
          <ChatMessage key={message._id} message={message} />
        ))}
      </div>
    </>
  );
}

function ChatMessage({ message }: { message: Doc<"messages"> }) {
  const { data: user } = useSuspenseQuery(
    convexQuery(api.users.read, { id: message.authorId }),
  );
  if (!user) throw new Error(`User ${message.authorId} not found`)

  return <div>{user.name + "->" + message.content}</div>;
}
