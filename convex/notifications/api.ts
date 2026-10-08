// convex/notifications/api.ts
import { makeNotificationAPI } from "convex-notification/server";
import { notifications } from "./client";
import { requireUserId } from "../lib/auth";

export const userNotifications = makeNotificationAPI(notifications, {
  resolveTargetId: async (ctx) => {
    const userId = await requireUserId(ctx as Parameters<typeof requireUserId>[0]);
    return userId;
  },
});