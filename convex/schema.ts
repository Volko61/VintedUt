import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  messages: defineTable({
    authorId: v.id("users"),
    content: v.string(),
  }).index("by_author", ["authorId"]),
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
});
