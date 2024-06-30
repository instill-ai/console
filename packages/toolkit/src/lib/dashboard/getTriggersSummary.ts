import {
  PipelineTriggerRecord,
  PipelineTriggersStatusSummary,
} from "../vdp-sdk";
import { calculatePercentageDelta } from "./calculatePercentageDelta";

export function getTriggersSummary(
  triggers: PipelineTriggerRecord[],
  triggersPrevious: PipelineTriggerRecord[],
): PipelineTriggersStatusSummary {
  let pipelineCompleteAmount = 0;
  let pipelineCompleteAmountPrevious = 0;
  let pipelineErroredAmount = 0;
  let pipelineErroredAmountPrevious = 0;

  triggers.forEach((trigger) => {
    if (trigger.status === "STATUS_COMPLETED") {
      pipelineCompleteAmount += 1;
    }

    if (trigger.status === "STATUS_ERRORED") {
      pipelineErroredAmount += 1;
    }
  });

  triggersPrevious.forEach((trigger) => {
    if (trigger.status === "STATUS_COMPLETED") {
      pipelineCompleteAmountPrevious += 1;
    }

    if (trigger.status === "STATUS_ERRORED") {
      pipelineErroredAmountPrevious += 1;
    }
  });

  return {
    completed: {
      statusType: "STATUS_COMPLETED",
      amount: pipelineCompleteAmount,
      type: "pipeline",
      delta: calculatePercentageDelta(
        pipelineCompleteAmountPrevious,
        pipelineCompleteAmount,
      ),
    },
    errored: {
      statusType: "STATUS_ERRORED",
      amount: pipelineErroredAmount,
      type: "pipeline",
      delta: calculatePercentageDelta(
        pipelineErroredAmountPrevious,
        pipelineErroredAmount,
      ),
    },
  };
}
