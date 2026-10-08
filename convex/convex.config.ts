import { defineApp } from "convex/server";
import notification from "convex-notification/convex.config.js";

const app = defineApp();
app.use(notification);

export default app;