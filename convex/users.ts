import { crud } from "convex-helpers/server/crud";
import { query } from "./_generated/server";
import schema from "./schema";
import { requireUserId } from "./lib/auth";
import { v } from "convex/values";

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

export const getEvalsAboutUser = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("evaluations").withIndex("by_reviewUserId",
            (q) => q.eq("aboutUserId", args.userId)
        ).collect()
    },
});


export const getEvalAverageAboutUser = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        const evaluations = await ctx.db.query("evaluations").withIndex("by_reviewUserId",
            (q) => q.eq("aboutUserId", args.userId)
        ).collect()
        let average = 0
        evaluations.map((evaluation) => {
            average += evaluation.stars
        })
        average /= evaluations.length
        return { average, numberOfReviews: evaluations.length }
    },
});