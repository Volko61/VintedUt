import { crud } from "convex-helpers/server/crud";
import { query } from "./_generated/server";
import schema from "./schema";
import { requireUserId } from "./lib/auth";

export const { read } = crud(schema, "users", query);

export const me = query({
    args: {},
    handler: async (ctx) => {
        const userId = await requireUserId(ctx);

        const user = await ctx.db.get("users", userId);
        if (!user) throw new Error("Utilisateur introuvable");
        return user
    },
});