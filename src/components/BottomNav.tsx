import { Group } from "@mantine/core";
import {
    IconMessage,
    IconPlus,
    IconSearch,
    IconUser
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { NavLink } from "./NavLink";

/**
 * Mobile-first bottom navigation bar.
 *
 * Holds the app's primary navigation and quick actions (language, theme,
 * sign-out) within thumb reach. Respects the device safe-area inset so it
 * clears the home indicator on notched phones.
 */
export function BottomNav() {
  const { t } = useTranslation();

  return (
    <Group
      h="100%"
      px="xs"
      gap={0}
      wrap="nowrap"
      align="stretch"
      pb="env(safe-area-inset-bottom, 0px)"
      style={{ boxSizing: "content-box" }}
    >
      <NavLink
        to="/search"
        icon={<IconSearch size={22} />}
        label={t("nav.search")}
      />

      <NavLink to="/sell" icon={<IconPlus size={22} />} label={t("nav.sell")} />

      <NavLink
        to="/messages"
        icon={<IconMessage size={22} />}
        label={t("nav.messages")}
      />

      <NavLink to="/me" icon={<IconUser size={22} />} label={t("nav.me")} />
    </Group>
  );
}
