import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  conversations: defineTable({
    itemId: v.id("items"),
  }).index("by_item", ["itemId"]),
  conversationMembers: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_users", ["userId"]),
  messages: defineTable({
    authorId: v.id("users"),
    conversationId: v.id("conversations"),
    content: v.string(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_author", ["authorId"]),
  items: defineTable({
    authorId: v.id("users"),
    title: v.string(),
    description: v.string(),
    imageIds: v.array(v.id("_storage")),
    price: v.number(),
    likes: v.number(),
  })
    .index("by_author", ["authorId"])
    .index("by_price", ["price"]),
  evaluations: defineTable({
    authorId: v.id("users"),
    aboutUserId: v.id("users"),
    stars: v.union(
      v.literal(1),
      v.literal(2),
      v.literal(3),
      v.literal(4),
      v.literal(5),
    ),
    review: v.string(),
  })
    .index("by_authorId", ["authorId"])
    .index("by_reviewUserId", ["aboutUserId"]),
});
