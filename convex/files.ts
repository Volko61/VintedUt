import { v } from "convex/values";

import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";

export const generateUploadUrl = mutation({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    await requireUserId(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

const ORPHAN_AGE_MS = 72 * 60 * 60 * 1000;
const BATCH_SIZE = 100;

// Deletes storage files older than 72h that no item references.
// Files linked to an item are already cleaned up by the items triggers.
export const deleteOrphanFiles = internalMutation({
  args: { cursor: v.optional(v.union(v.string(), v.null())) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const threshold = Date.now() - ORPHAN_AGE_MS;

    const referenced = new Set<Id<"_storage">>();
    for await (const item of ctx.db.query("items")) {
      for (const imageId of item.imageIds) referenced.add(imageId);
    }

    const result = await ctx.db.system
      .query("_storage")
      .order("asc")
      .paginate({ numItems: BATCH_SIZE, cursor: args.cursor ?? null });

    let reachedRecent = false;
    for (const file of result.page) {
      if (file._creationTime > threshold) {
        reachedRecent = true;
        break;
      }
      if (!referenced.has(file._id)) {
        await ctx.storage.delete(file._id);
      }
    }

    // Files are ordered by creation time, so stop once we hit recent ones.
    if (!result.isDone && !reachedRecent) {
      await ctx.scheduler.runAfter(0, internal.files.deleteOrphanFiles, {
        cursor: result.continueCursor,
      });
    }
    return null;
  },
});


export const get = query({
  args: {
    fileId: v.id("_storage")
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId)
  },
});