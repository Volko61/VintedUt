// convex/notifications/client.ts
import { v } from "convex/values";
import { components } from "../_generated/api";
import { defineNotifications } from "convex-notification";

export const notifications = defineNotifications(components.notification, {
  defaultListLimit: 50, // Used when querying without pagination.
  batchChunkSize: 100, // Page size when querying with pagination.
  kinds: {
    // These can be configured to your needs
    // team_invite: v.object({
    //   title: v.string(),
    //   body: v.optional(v.string()),
    //   href: v.string(),
    //   inviteId: v.string(),
    // }),
    // admin_broadcast: v.object({
    //   title: v.string(),
    //   body: v.optional(v.string()),
    //   href: v.optional(v.string()),
    // }),
    newMessage: v.object({
        content: v.string(),
        href: v.optional(v.string()),
    })
  },
});