import { Stack, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";

type PagePlaceholderProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

/** Shared page shell: a title, a short description and optional content. */
export function PagePlaceholder({
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <Stack gap="lg" maw={640} mx="auto" w="100%">
      <div>
        <Title order={1}>{title}</Title>
        <Text c="dimmed" mt="xs">
          {description}
        </Text>
      </div>

      {children}
    </Stack>
  );
}
