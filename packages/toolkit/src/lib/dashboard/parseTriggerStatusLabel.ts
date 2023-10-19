import { PipelineTriggerStatus } from "../vdp-sdk";

export function parseTriggerStatusLabel(status: PipelineTriggerStatus): string {
  const convertedStatus = status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())[1]

  return convertedStatus;
}
