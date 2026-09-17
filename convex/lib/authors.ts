import { v } from "convex/values";

import type { Doc, Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import schema from "../schema";

export const publicAuthor = schema.tables.users.validator
  .pick("name", "image")
  .extend({ _id: v.id("users") });

export type PublicAuthor = {
  _id: Id<"users">;
  name?: string;
  image?: string;
};

export function toPublicAuthor(author: Doc<"users">): PublicAuthor {
  return {
    _id: author._id,
    ...(author.name === undefined ? {} : { name: author.name }),
    ...(author.image === undefined ? {} : { image: author.image }),
  };
}

export async function loadAuthors(
  ctx: QueryCtx,
  authorIds: Id<"users">[],
): Promise<Map<Id<"users">, Doc<"users">>> {
  const uniqueIds = [...new Set(authorIds)];
  const docs = await Promise.all(uniqueIds.map((id) => ctx.db.get("users", id)));

  const authors = new Map<Id<"users">, Doc<"users">>();
  uniqueIds.forEach((id, index) => {
    const doc = docs[index];
    if (doc !== null) {
      authors.set(id, doc);
    }
  });

  return authors;
}
