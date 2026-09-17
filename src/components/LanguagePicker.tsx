import { Box, Menu } from "@mantine/core";
import { IconCheck, IconLanguage } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../i18n";
import { NavItem } from "./NavItem";

/** Bottom-nav entry that switches the active UI language. */
export function LanguagePicker() {
  const { t, i18n } = useTranslation();

  const resolved = i18n.resolvedLanguage ?? i18n.language;
  const currentLanguage: SupportedLanguage = (
    SUPPORTED_LANGUAGES as readonly string[]
  ).includes(resolved)
    ? (resolved as SupportedLanguage)
    : "en";

  return (
    <Menu position="top" withArrow>
      <Menu.Target>
        <NavItem icon={<IconLanguage size={22} />} label={t("nav.language")} />
      </Menu.Target>
      <Menu.Dropdown>
        {SUPPORTED_LANGUAGES.map((lng) => (
          <Menu.Item
            key={lng}
            leftSection={
              lng === currentLanguage ? <IconCheck size={16} /> : <Box w={16} />
            }
            onClick={() => void i18n.changeLanguage(lng)}
          >
            {t(`language.${lng}`)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
