/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as conversations from "../conversations.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as items from "../items.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_authors from "../lib/authors.js";
import type * as notifications from "../notifications.js";
import type * as notifications_api from "../notifications/api.js";
import type * as notifications_client from "../notifications/client.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  conversations: typeof conversations;
  functions: typeof functions;
  http: typeof http;
  items: typeof items;
  "lib/auth": typeof lib_auth;
  "lib/authors": typeof lib_authors;
  notifications: typeof notifications;
  "notifications/api": typeof notifications_api;
  "notifications/client": typeof notifications_client;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  notification: import("convex-notification/_generated/component.js").ComponentApi<"notification">;
};
