import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { NavItem } from "./NavItem";

/** Bottom-nav entry that toggles between the light and dark color schemes. */
export function ThemePicker() {
  const { t } = useTranslation();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light");

  const isDark = computedColorScheme === "dark";

  return (
    <NavItem
      icon={isDark ? <IconSun size={22} /> : <IconMoon size={22} />}
      label={t("nav.theme")}
      onClick={() => setColorScheme(isDark ? "light" : "dark")}
    />
  );
}
