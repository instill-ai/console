import type { PipelineTriggerStatus } from "instill-sdk";

export function parseTriggerStatusLabel(status: PipelineTriggerStatus) {
  const convertedStatus = status
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )[1];

  return convertedStatus;
}
