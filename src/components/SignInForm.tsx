import { useAuthActions } from "@convex-dev/auth/react";
import {
  Alert,
  Anchor,
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

type Flow = "signIn" | "signUp";

/** Email + password sign-in / sign-up card backed by Convex Auth. */
export function SignInForm() {
  const { t } = useTranslation();
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<Flow>("signIn");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignIn = flow === "signIn";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("flow", flow);

    setSubmitting(true);
    setError(null);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Center mih="60vh">
      <Card withBorder shadow="sm" radius="md" padding="xl" w={380}>
        <Title order={2} mb="lg">
          {isSignIn ? t("auth.signInTitle") : t("auth.signUpTitle")}
        </Title>

        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <Stack gap="sm">
            <TextInput
              name="email"
              type="email"
              label={t("auth.email")}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <PasswordInput
              name="password"
              label={t("auth.password")}
              description={t("auth.passwordHint")}
              required
              autoComplete={isSignIn ? "current-password" : "new-password"}
            />

            {error && (
              <Alert
                color="red"
                variant="light"
                icon={<IconAlertCircle size={16} />}
              >
                {t("auth.error", { message: error })}
              </Alert>
            )}

            <Button type="submit" loading={submitting} fullWidth mt="xs">
              {isSignIn ? t("auth.signIn") : t("auth.signUp")}
            </Button>

            <Text size="sm" ta="center" c="dimmed">
              {isSignIn ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
              <Anchor
                component="button"
                type="button"
                onClick={() => {
                  setFlow(isSignIn ? "signUp" : "signIn");
                  setError(null);
                }}
              >
                {isSignIn ? t("auth.switchToSignUp") : t("auth.switchToSignIn")}
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
