import { Nullable } from "./type";
import { Model } from "./vdp-sdk";

export function isPublicModel(model: Nullable<Model>) {
  if (!model) {
    return false;
  }

  return model.visibility === "VISIBILITY_PUBLIC";
}
