import { cronJobs } from "convex/server";

import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete orphan storage files",
  { hours: 6 },
  internal.files.deleteOrphanFiles,
  {},
);

export default crons;
