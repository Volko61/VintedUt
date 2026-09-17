import { useMutation, useQuery } from "convex/react";
import {
  Alert,
  Button,
  Card,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAlertCircle, IconSend } from "@tabler/icons-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { api } from "../../convex/_generated/api";

/** Signed-in view: greets the viewer and lists realtime hello messages. */
export function HelloBoard() {
  const { t } = useTranslation();
  const data = useQuery(api.messages.list, { limit: 50 });
  const send = useMutation(api.messages.send);

  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.trim().length === 0) {
      return;
    }

    setSending(true);
    setError(null);
    try {
      await send({ content: draft });
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSending(false);
    }
  }

  if (data === undefined) {
    return (
      <Center mih="40vh">
        <Stack align="center" gap="sm">
          <Loader />
          <Text c="dimmed">{t("hello.loading")}</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="lg" maw={640} mx="auto" w="100%">
      <div>
        <Title order={1}>{t("hello.title")}</Title>
        <Text c="dimmed" mt="xs">
          {t("hello.intro")}
        </Text>
      </div>

      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <Group align="flex-start" gap="sm" wrap="nowrap">
          <TextInput
            flex={1}
            value={draft}
            onChange={(event) => setDraft(event.currentTarget.value)}
            placeholder={t("hello.placeholder")}
            maxLength={280}
            aria-label={t("hello.placeholder")}
          />
          <Button
            type="submit"
            loading={sending}
            leftSection={<IconSend size={16} />}
          >
            {t("hello.send")}
          </Button>
        </Group>
      </form>

      {error && (
        <Alert color="red" variant="light" icon={<IconAlertCircle size={16} />}>
          {error}
        </Alert>
      )}

      {data.messages.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          {t("hello.empty")}
        </Text>
      ) : (
        <ScrollArea.Autosize mah={420}>
          <Stack gap="sm">
            {data.messages.map(({ message, author }) => (
              <Card key={message._id} withBorder radius="md" padding="md">
                <Text size="sm" fw={600}>
                  {author.name ?? "—"}
                </Text>
                <Text mt={4}>{message.content}</Text>
              </Card>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      )}
    </Stack>
  );
}
