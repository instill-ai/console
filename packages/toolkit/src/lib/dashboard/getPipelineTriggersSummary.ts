import type {
  PipelineTriggerStatus,
  PipelineTriggerTableRecord,
} from "instill-sdk";

import { calculatePercentageDelta } from "./calculatePercentageDelta";

export type PipelineTriggersStatusSummaryItem = {
  statusType: PipelineTriggerStatus;
  amount: number;
  type: "pipeline" | "model";
  delta: number;
};

export type PipelineTriggersStatusSummary = {
  completed: PipelineTriggersStatusSummaryItem;
  errored: PipelineTriggersStatusSummaryItem;
};

export function getPipelineTriggersSummary(
  pipelines: PipelineTriggerTableRecord[],
  pipelinesPrevious: PipelineTriggerTableRecord[],
): PipelineTriggersStatusSummary {
  let pipelineCompleteAmount = 0;
  let pipelineCompleteAmountPrevious = 0;
  let pipelineErroredAmount = 0;
  let pipelineErroredAmountPrevious = 0;

  pipelines.forEach((pipeline) => {
    pipelineCompleteAmount += parseInt(pipeline.triggerCountCompleted);
    pipelineErroredAmount += parseInt(pipeline.triggerCountErrored);
  });

  pipelinesPrevious.forEach((pipeline) => {
    pipelineCompleteAmountPrevious += parseInt(pipeline.triggerCountCompleted);
    pipelineErroredAmountPrevious += parseInt(pipeline.triggerCountErrored);
  });

  return getPipelineTriggersStatusSummary(
    pipelineCompleteAmount,
    pipelineCompleteAmountPrevious,
    pipelineErroredAmount,
    pipelineErroredAmountPrevious,
  );
}

export function getPipelineTriggersStatusSummary(
  pipelineCompleteAmount: number,
  pipelineCompleteAmountPrevious: number,
  pipelineErroredAmount: number,
  pipelineErroredAmountPrevious: number,
): PipelineTriggersStatusSummary {
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
