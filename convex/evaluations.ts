import { crud } from "convex-helpers/server/crud";
import { query } from "./_generated/server";
import schema from "./schema";

export const { read } = crud(
    schema,
    "evaluations",
    query
);