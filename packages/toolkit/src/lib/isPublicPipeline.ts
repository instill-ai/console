import type { Pipeline } from "instill-sdk";

import type { Nullable } from "./type";

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
