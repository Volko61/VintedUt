import { query } from "./_generated/server";
import { requireUserId } from "./lib/auth";
import { toPublicAuthor } from "./lib/authors";

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    
    const user = await ctx.db.get("users", userId);
    if (!user) throw new Error("Utilisateur introuvable");

    return toPublicAuthor(user);
  },
});