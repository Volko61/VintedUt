import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PagePlaceholder } from "../components/PagePlaceholder";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { t } = useTranslation();

  return (
    <PagePlaceholder
      title={t("pages.messages.title")}
      description={t("pages.messages.description")}
    />
  );
}

