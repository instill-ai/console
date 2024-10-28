import type { Model, Nullable } from "instill-sdk";

export function isPublicModel(model: Nullable<Model>) {
  if (!model) {
    return false;
  }

  return model.visibility === "VISIBILITY_PUBLIC";
}
