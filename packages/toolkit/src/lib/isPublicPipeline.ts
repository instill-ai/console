import { Nullable } from "./type";
import { Pipeline } from "./vdp-sdk";

export function isPublicPipeline(pipeline: Nullable<Pipeline>) {
  if (!pipeline) {
    return false;
  }

  const topLevelSharing = pipeline.sharing.users["*/*"];

  if (!topLevelSharing) {
    return false;
  }

  return topLevelSharing.enabled;
}
