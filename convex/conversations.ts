import { v } from "convex/values";

import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { notifications } from "./notifications/client";
import { paginationOptsValidator } from "convex/server";
import { crud } from "convex-helpers/server/crud";
import schema from "./schema";
import { customCtx, customMutation, customQuery } from "convex-helpers/server/customFunctions";
import { Rules, wrapDatabaseWriter } from "convex-helpers/server/rowLevelSecurity";
import { DataModel, Id } from "./_generated/dataModel";

export const listMine = query({
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    return ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(q.eq(q.field("seller"), userId), q.eq(q.field("buyer"), userId)),
      )
      .collect();
  },
});

export const get = query({
  args: {
    conversationId: v.id("conversations"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .paginate(args.paginationOpts);
    if (messages == null) throw Error(`Cannot find the messages for conversation ${args.conversationId}`)

    return messages
  },
});

export const latestMessage = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);
    const message = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .order("desc")
      .first();
    if (message == null) throw Error(`Cannot find the latest message for conversation ${args.conversationId}`)

    return message
  },
});

export const createConversation = mutation({
  args: {
    itemId: v.id("items"),
    content: v.string()
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const itemId = args.itemId;
    const item = await ctx.db.get("items", itemId);
    if (!item) throw new Error(`Article ${itemId} introuvable`);

    // One conversation per (item, buyer): reuse it if this user already contacted the seller.
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_item", (q) => q.eq("itemId", itemId))
      .filter((q) => q.eq(q.field("buyer"), userId))
      .first();

    const conversationId =
      existing?._id ??
      (await ctx.db.insert("conversations", {
        itemId,
        seller: item.authorId,
        buyer: userId,
      }));

    await sendMessage(ctx, userId, conversationId, args.content);
    return conversationId;
  },
});

async function sendMessage(
  ctx: MutationCtx,
  userId: Id<"users">,
  conversationId: Id<"conversations">,
  content: string,
) {
  const conversation = await ctx.db.get("conversations", conversationId);
  if (!conversation) throw new Error(`Conversation ${conversationId} not found`)

  const targetId = conversation.seller === userId ? conversation.buyer : conversation.seller;
  if (targetId) {
    await notifications.create(ctx, {
      targetId,
      kind: "newMessage",
      data: {
        content,
        href: "/messages/",
      },
    });
  }
  return await ctx.db.insert("messages", {
    conversationId: conversation._id,
    authorId: userId,
    content,
  });
}

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return await sendMessage(ctx, userId, args.conversationId, args.content);
  },
});


async function rlsRules(ctx: QueryCtx) {
  const userId = await requireUserId(ctx);
  return {
    conversations: {
      read: async (_, conversation) => {
        return conversation.buyer === userId || conversation.seller === userId;
      },
    },
  } satisfies Rules<QueryCtx, DataModel>;
}

const mutationWithRLS = customMutation(
  mutation,
  customCtx(async (ctx) => ({
    db: wrapDatabaseWriter(ctx, ctx.db, await rlsRules(ctx)),
  })),
);
export const { read } = crud(
  schema,
  "conversations",
  customQuery(query, customCtx(async () => ({}))),
  mutationWithRLS,
);