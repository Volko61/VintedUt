// convex/notifications.ts
import { userNotifications } from "./notifications/api";

export const {
  list,
  listPage,
  counts,
  unseenCount,
  markSeen,
  markAllSeen,
  dismiss,
  dismissAll,
} = userNotifications;