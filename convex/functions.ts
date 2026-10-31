/* eslint-disable no-restricted-imports */
import { mutation as rawMutation, internalMutation as rawInternalMutation } from "./_generated/server";
/* eslint-enable no-restricted-imports */
import { DataModel } from "./_generated/dataModel";
import { Triggers } from "convex-helpers/server/triggers";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";

const triggers = new Triggers<DataModel>();

triggers.register("items", async (ctx, change) => {
  if (change.operation === "delete") {
    const imageIds = change.oldDoc.imageIds;
    await Promise.all((imageIds.map((imageId) => ctx.storage.delete(imageId))))
  }
  else if (change.operation == "update") {
    const oldImageIds = change.oldDoc.imageIds
    const newImageIds = change.newDoc.imageIds
    const imageIdToDelete = oldImageIds.filter((imageId) => !newImageIds.includes(imageId))
    await Promise.all((imageIdToDelete.map((imageId) => ctx.storage.delete(imageId))))
  }
});

triggers.register("items", async (_ctx, change) => {
  const changedItem = change.newDoc
  if (changedItem) {
    if (!Number.isFinite(changedItem.price) || changedItem.price < 0) {
      throw new Error(`Price must be a finite, non-negative number. ${changedItem.price}`);
    }
  }
});

// Export wrapped versions — these replace the built-in mutation/internalMutation
export const mutation = customMutation(rawMutation, customCtx(triggers.wrapDB));
export const internalMutation = customMutation(rawInternalMutation, customCtx(triggers.wrapDB));