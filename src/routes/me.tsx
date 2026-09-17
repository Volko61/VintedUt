import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PagePlaceholder } from "../components/PagePlaceholder";

export const Route = createFileRoute("/me")({
  component: MePage,
});

function MePage() {
  const { t } = useTranslation();

  return (
    <PagePlaceholder
      title={t("pages.me.title")}
      description={t("pages.me.description")}
    />
  );
}

