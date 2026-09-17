import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { loadAuthors, publicAuthor, toPublicAuthor } from "./lib/authors";
import schema from "./schema";

export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.object({
    messages: v.array(
      v.object({
        message: schema.doc("messages"),
        author: publicAuthor,
      }),
    ),
  }),
  handler: async (ctx, args) => {
    await requireUserId(ctx);

    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);

    const messages = await ctx.db.query("messages").order("desc").take(limit);

    const authors = await loadAuthors(
      ctx,
      messages.map((message) => message.authorId),
    );

    const withAuthors = messages.flatMap((message) => {
      const author = authors.get(message.authorId);
      return author === undefined
        ? []
        : [{ message, author: toPublicAuthor(author) }];
    });

    return {
      messages: withAuthors.reverse(),
    };
  },
});

export const send = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return await ctx.db.insert("messages", {
      authorId: userId,
      content: args.content,
    });
  },
});
