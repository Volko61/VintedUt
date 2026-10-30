import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { PagePlaceholder } from "../components/PagePlaceholder";
import SellForm from "@/components/SellForm";

export const Route = createFileRoute("/sell")({
  component: SellPage,
});

function SellPage() {
  const { t } = useTranslation();

  return (
    <>
      <PagePlaceholder
        title={t("pages.sell.title")}
        description={t("pages.sell.description")}
      />
      <SellForm />
    </>
  );
}

