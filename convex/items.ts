import { v } from "convex/values";

import { paginationOptsValidator } from "convex/server";
import { query, QueryCtx } from "./_generated/server";
import { mutation } from "./functions";
import { requireUserId } from "./lib/auth";
import schema, { colorValidator, sizeValidator, sortValidator, stateValidator } from "./schema";


import { crud } from "convex-helpers/server/crud";
import { stream } from "convex-helpers/server/stream";
import { customCtx, customMutation, customQuery } from "convex-helpers/server/customFunctions";
import { Rules, wrapDatabaseWriter } from "convex-helpers/server/rowLevelSecurity";
import { DataModel } from "./_generated/dataModel";


export const search = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchString: v.optional(v.string()),
    sort: v.optional(sortValidator),
  },
  handler: async (ctx, args) => {
    const words = (args.searchString ?? "").toLowerCase().split(/\s+/).filter(Boolean);
    const sort = args.sort ?? "newest";

    // Search indexes can't be ordered, so scan the sorted index and filter (WHERE ... ORDER BY).
    const items = stream(ctx.db, schema).query("items");
    const sorted =
      sort === "price"
        ? items.withIndex("by_price")
        : items.order(sort === "oldest" ? "asc" : "desc");
    const matching = sorted.filterWith(async (item) => {
      const title = item.title.toLowerCase();
      return words.every((word) => title.includes(word));
    });

    // A short page with isDone=false just means the row limit was hit; the client loads more.
    return await matching.paginate({
      ...args.paginationOpts,
      maximumRowsRead: 500,
    });
  },
});


export const listOfUser = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("items").withIndex("by_author", (q) => q.eq("authorId", args.userId)).paginate({
      ...args.paginationOpts,
      maximumRowsRead: 500,
    });
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    imageIds: v.array(v.id("_storage")),
    size: v.optional(sizeValidator),
    colors: v.optional(v.array(colorValidator)),
    state: v.optional(stateValidator)
  },
  returns: v.id("items"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return await ctx.db.insert("items", {
      ...args,
      authorId: userId,
    });
  },
});

// Toggles the current user's like on an item. Returns true if now liked, false if unliked.
export const like = mutation({
  args: {
    itemId: v.id("items")
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db.query("likes")
      .withIndex("by_item_liker", (q) => q.eq("itemId", args.itemId).eq("likerId", userId)).collect();

    if (existing.length > 0) {
      await Promise.all(existing.map((like) => ctx.db.delete(like._id)));
      return false;
    }

    await ctx.db.insert("likes", {
      itemId: args.itemId,
      likerId: userId
    });
    return true;
  },
});


export const getLikeValue = query({
  args: {
    itemId: v.id("items")
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db.query("likes")
      .withIndex("by_item_liker", (q) => q.eq("itemId", args.itemId).eq("likerId", userId)).collect();
    return (existing.length > 0);
  },
});

async function rlsRules(ctx: QueryCtx) {
  const userId = await requireUserId(ctx);
  return {
    items: {
      read: async () => true,
      modify: async (_, item) => {
        return item.authorId === userId;
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

export const { read, update, destroy } = crud(
  schema,
  "items",
  customQuery(query, customCtx(async () => ({}))),
  mutationWithRLS,
);