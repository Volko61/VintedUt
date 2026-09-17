import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { loadAuthors, publicAuthor, toPublicAuthor } from "./lib/authors";
import schema from "./schema";

const editableItemFields = schema.tables.items.validator
  .pick("title", "description", "price", "imageIds")
  .partial();

function assertValidPrice(price: number) {
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a finite, non-negative number.");
  }
}

async function assertImagesExist(
  ctx: MutationCtx,
  imageIds: Id<"_storage">[],
) {
  for (const imageId of imageIds) {
    const metadata = await ctx.db.system.get("_storage", imageId);
    if (metadata === null) {
      throw new Error(`Image ${imageId} does not exist.`);
    }
  }
}

async function requireOwnedItem(ctx: MutationCtx, id: Id<"items">) {
  const userId = await requireUserId(ctx);
  const item = await ctx.db.get("items", id);
  if (item === null || item.authorId !== userId) {
    throw new Error("You must own this listing to modify it.");
  }
  return item;
}

export const list = query({
  args: {
    limit: v.optional(v.number()),
    order: v.optional(v.union(v.literal("desc"), v.literal("asc"))),
  },
  returns: v.array(
    v.object({
      item: schema.doc("items"),
      author: publicAuthor,
    }),
  ),
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);
    const order = args.order ?? "asc";
    const items = await ctx.db.query("items").order(order).take(limit);

    const authors = await loadAuthors(
      ctx,
      items.map((item) => item.authorId),
    );

    return items.flatMap((item) => {
      const author = authors.get(item.authorId);
      return author === undefined
        ? []
        : [{ item, author: toPublicAuthor(author) }];
    });
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
    assertValidPrice(args.price);
    await assertImagesExist(ctx, args.imageIds);

    return await ctx.db.insert("items", {
      ...args,
      authorId: userId,
      likes: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("items"),
    patch: editableItemFields,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const item = await requireOwnedItem(ctx, args.id);

    if (args.patch.price !== undefined) {
      assertValidPrice(args.patch.price);
    }

    const nextImageIds = args.patch.imageIds;
    if (nextImageIds !== undefined) {
      await assertImagesExist(ctx, nextImageIds);

      const removed = item.imageIds.filter((id) => !nextImageIds.includes(id));
      await Promise.all(removed.map((id) => ctx.storage.delete(id)));
    }

    return await ctx.db.patch("items", args.id, args.patch);
  },
});

export const remove = mutation({
  args: {
    id: v.id("items"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const item = await requireOwnedItem(ctx, args.id);

    await Promise.all(item.imageIds.map((id) => ctx.storage.delete(id)));

    return await ctx.db.delete("items", args.id);
  },
});
