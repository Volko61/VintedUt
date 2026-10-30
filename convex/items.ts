import { v } from "convex/values";

import { paginationOptsValidator } from "convex/server";
import { query, QueryCtx } from "./_generated/server";
import { mutation } from "./functions";
import { requireUserId } from "./lib/auth";
import schema from "./schema";


import { crud } from "convex-helpers/server/crud";
import { customCtx, customMutation, customQuery } from "convex-helpers/server/customFunctions";
import { Rules, wrapDatabaseWriter } from "convex-helpers/server/rowLevelSecurity";
import { DataModel } from "./_generated/dataModel";


export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("items").paginate(args.paginationOpts);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    imageIds: v.array(v.id("_storage")),
  },
  returns: v.id("items"),
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);

    return await ctx.db.insert("items", {
      ...args,
      authorId: userId,
      likes: 0,
    });
  },
});

export const search = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchString: v.string()
  },
  handler: async (ctx, args) => {
    const [byDescription, byTitle] = await Promise.all([
      ctx.db
        .query("items")
        .withSearchIndex("search_in_desc", (q) =>
          q.search("description", args.searchString),
        )
        .collect(),
      ctx.db
        .query("items")
        .withSearchIndex("search_in_title", (q) =>
          q.search("title", args.searchString),
        )
        .collect(),
    ]);

    const seen = new Set<string>();
    const merged = [];
    for (const item of [...byDescription, ...byTitle]) {
      if (!seen.has(item._id)) {
        seen.add(item._id);
        merged.push(item);
      }
    }

    return merged;
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