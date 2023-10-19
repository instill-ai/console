import {
  PipelineTriggerRecord,
  PipelineTriggersStatusSummary,
} from "../vdp-sdk";
import { getPipelineTriggersStatusSummary } from "./getPipelineTriggersSummary";

export function getTriggersSummary(
  triggers: PipelineTriggerRecord[],
  triggersPrevious: PipelineTriggerRecord[]
): PipelineTriggersStatusSummary {
  let pipelineCompleteAmount = 0;
  let pipelineCompleteAmountPrevious = 0;
  let pipelineErroredAmount = 0;
  let pipelineErroredAmountPrevious = 0;

  triggers.forEach((trigger) => {
    pipelineCompleteAmount += trigger.status === "STATUS_COMPLETED" ? 1 : 0;
    pipelineErroredAmount += trigger.status === "STATUS_ERRORED" ? 1 : 0;
  });

  triggersPrevious.forEach((trigger) => {
    pipelineCompleteAmountPrevious +=
      trigger.status === "STATUS_COMPLETED" ? 1 : 0;
    pipelineErroredAmountPrevious +=
      trigger.status === "STATUS_ERRORED" ? 1 : 0;
  });

  return getPipelineTriggersStatusSummary(
    pipelineCompleteAmount,
    pipelineCompleteAmountPrevious,
    pipelineErroredAmount,
    pipelineErroredAmountPrevious
  );
}
