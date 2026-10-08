import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { LanguagePicker } from "@/components/LanguagePicker";
import { ThemePicker } from "@/components/ThemePicker";
import { useAuthActions } from "@convex-dev/auth/react";
import { Avatar, Button, Group, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useConvexAuth } from "convex/react";
import { PagePlaceholder } from "../components/PagePlaceholder";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";

export const Route = createFileRoute("/me")({
  component: MePage,
});

function MePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useConvexAuth();
  const { data: me } = useSuspenseQuery(convexQuery(api.me.me, {}));

  const { signOut } = useAuthActions();

  return (
    <>
      <PagePlaceholder
        title={t("pages.me.title")}
        description={t("pages.me.description")}
      />
      {isAuthenticated && (
        <Group>
          <Avatar src={me.image} radius="xl" />
          <div>
            <Text fw={600}>{me.name ?? "Anonymous"}</Text>
          </div>
        </Group>
      )}

      <LanguagePicker />

      <ThemePicker />

      {isAuthenticated && (
        <Button
          leftSection={<IconLogout size={22} />}
          onClick={() => void signOut()}
        >
          {t("nav.signOut")}
        </Button>
      )}
    </>
  );
}
