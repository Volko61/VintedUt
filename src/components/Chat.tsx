import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function Chat({ conversationId }: { conversationId: Id<"conversations"> }) {
  const { t } = useTranslation();
  const { data: messages } = useSuspenseQuery(
    convexQuery(api.conversations.get, { conversationId }),
  );
  const { data: members } = useSuspenseQuery(
    convexQuery(api.conversations.getMembers, { conversationId }),
  );
  return (
    <>
      <div>
        Conversation between {members[0].userId} and {members[1].userId}
      </div>
      <div>
        {messages.map((message)=>{
            return <>
                <div>{message.sender.name + "->" + message.content}</div>
            </>
        })}
      </div>
    </>
  );
}
