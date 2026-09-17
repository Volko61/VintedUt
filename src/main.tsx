import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "@tanstack/react-router";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";

import "./i18n";
import { router } from "./router";
import { theme } from "./theme";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications />
      <ConvexAuthProvider client={convex}>
        <RouterProvider router={router} />
      </ConvexAuthProvider>
    </MantineProvider>
  </StrictMode>,
);
