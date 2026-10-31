import { createFileRoute, Link, Outlet, useMatch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { api } from "../../convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import ConversationItem from "@/components/ConversationItem";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { t } = useTranslation();
  const inConversation = useMatch({
    from: "/messages/$conversationId",
    shouldThrow: false,
  });
  const { data: getMine } = useSuspenseQuery(
    convexQuery(api.conversations.listMine, {}),
  );

  if (inConversation) {
    return (
      <>
        <Link to="/messages">← {t("nav.messages")}</Link>
        <Outlet />
      </>
    );
  }

  return (
    <>
      {getMine.map((conversation) => {
        return (
          <ConversationItem key={conversation._id} conversation={conversation} />
        );
      })}
      <Outlet />
    </>
  );
}
