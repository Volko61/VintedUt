import { v } from "convex/values";

import { internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireUserId } from "./lib/auth";
import { loadAuthors, publicAuthor, toPublicAuthor } from "./lib/authors";
import schema from "./schema";
import { notifications } from "./notifications/client";
import { cp } from "fs";

export const listMine = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    return ctx.db
      .query("conversationMembers")
      .withIndex("by_users", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const getMembers = query({
  args: {
    conversationId: v.id("conversations")
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("conversationMembers").withIndex("by_conversation", (q)=>q.eq("conversationId", args.conversationId)).collect()
  },
});

export const get = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireUserId(ctx);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    return await Promise.all(
      messages.map(async (msg) => {
        const sender = await ctx.db.get(msg.authorId);
        return {
          ...msg,
          sender: sender
            ? {
                name: sender.name,
                avatarUrl: sender.image,
              }
            : {
                name: "Unknown user name",
                avatarUrl: "/default-avatar.png",
              },
        };
      }),
    );
  },
});

export const getSellerAndBuyer = internalQuery({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) {
      throw new Error("Conversation introuvable");
    }

    const item = await ctx.db.get(conversation.itemId);
    if (!item) throw new Error("Article introuvable");

    const members = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    const sellerId = item.authorId;

    const buyerMember = members.find((m) => m.userId !== sellerId);
    const buyerId = buyerMember ? buyerMember.userId : null;

    const [seller, buyer] = await Promise.all([
      ctx.db.get(sellerId),
      buyerId ? ctx.db.get(buyerId) : null,
    ]);

    return {
      seller,
      buyer,
    };
  },
});

export const send = mutation({
  args: {
    itemId: v.id("items"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const itemId = args.itemId;
    const item = await ctx.db.get("items", itemId);
    if (!item) throw new Error("Article introuvable");

    const existingConversation = await ctx.db
      .query("conversations")
      .withIndex("by_item", (q) => q.eq("itemId", itemId))
      .first();

    const conversationId =
      existingConversation?._id ??
      (await ctx.db.insert("conversations", { itemId }));

    const { seller, buyer } = await ctx.runQuery(
      internal.conversations.getSellerAndBuyer,
      { conversationId },
    );
    const targetId = seller?._id === userId ? buyer?._id : seller?._id;
    if (targetId) {
      await notifications.create(ctx, {
        targetId,
        kind: "newMessage",
        data: {
          content: args.content,
          href: "/messages/",
        },
      });
    }
    return await ctx.db.insert("messages", {
      conversationId,
      authorId: userId,
      content: args.content,
    });
  },
});
