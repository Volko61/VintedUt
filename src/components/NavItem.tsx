import { Box, Stack, Text, UnstyledButton } from "@mantine/core";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type NavItemContentProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

/** Shared icon + label visual used by every bottom-nav entry. */
export function NavItemContent({
  icon,
  label,
  active = false,
}: NavItemContentProps) {
  const color = active
    ? "var(--mantine-primary-color-filled)"
    : "var(--mantine-color-dimmed)";

  return (
    <Stack align="center" gap={2}>
      <Box c={color}>{icon}</Box>
      <Text size="xs" c={color} fw={active ? 600 : 500} lh={1}>
        {label}
      </Text>
    </Stack>
  );
}

type NavItemProps = NavItemContentProps &
  Omit<ComponentPropsWithoutRef<"button">, "children">;

/** A single icon + label entry in the bottom navigation bar. */
export function NavItem({
  icon,
  label,
  active = false,
  ...others
}: NavItemProps) {
  return (
    <UnstyledButton
      {...others}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <NavItemContent icon={icon} label={label} active={active} />
    </UnstyledButton>
  );
}
