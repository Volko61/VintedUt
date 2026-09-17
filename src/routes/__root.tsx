import { AppShell, Center, Stack, Text, Title } from "@mantine/core";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Authenticated, Unauthenticated } from "convex/react";
import { useTranslation } from "react-i18next";

import { BottomNav } from "../components/BottomNav";
import { SignInForm } from "../components/SignInForm";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <AppShell
      footer={{ height: "calc(4rem + env(safe-area-inset-bottom, 0px))" }}
      padding="md"
      styles={{
        footer: {
          borderTop: "1px solid var(--mantine-color-default-border)",
        },
      }}
    >
      <Authenticated>
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>

        <AppShell.Footer>
          <BottomNav />
        </AppShell.Footer>
      </Authenticated>

      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>
    </AppShell>
  );
}

function NotFound() {
  const { t } = useTranslation();

  return (
    <Center mih="60vh">
      <Stack align="center" gap="xs">
        <Title order={2}>{t("notFound.title")}</Title>
        <Text c="dimmed">{t("notFound.description")}</Text>
        <Link
          to="/search"
          style={{ color: "var(--mantine-primary-color-filled)" }}
        >
          {t("notFound.back")}
        </Link>
      </Stack>
    </Center>
  );
}
