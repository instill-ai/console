import {
  PipelineTriggerRecord,
  PipelineTriggersStatusSummary,
  calculatePercentageDelta,
  getPipelineTriggerCounts,
} from "@instill-ai/toolkit";
import { TriggeredPipeline } from "./triggers";

export function getPipelineTriggersSummary(
  pipelines: TriggeredPipeline[],
  pipelinesPrevious: TriggeredPipeline[]
): PipelineTriggersStatusSummary {
  let pipelineCompleteAmount = 0;
  let pipelineCompleteAmountPrevious = 0;
  let pipelineErroredAmount = 0;
  let pipelineErroredAmountPrevious = 0;

  pipelines.forEach((pipeline) => {
    pipelineCompleteAmount += parseInt(pipeline.trigger_count_completed);
    pipelineErroredAmount += parseInt(pipeline.trigger_count_errored);
  });

  pipelinesPrevious.forEach((pipeline) => {
    pipelineCompleteAmountPrevious += parseInt(
      pipeline.trigger_count_completed
    );
    pipelineErroredAmountPrevious += parseInt(pipeline.trigger_count_errored);
  });

  return {
    completed: {
      statusType: "STATUS_COMPLETED",
      amount: pipelineCompleteAmount,
      type: "pipeline",
      delta: calculatePercentageDelta(
        pipelineCompleteAmountPrevious,
        pipelineCompleteAmount
      ),
    },
    errored: {
      statusType: "STATUS_ERRORED",
      amount: pipelineErroredAmount,
      type: "pipeline",
      delta: calculatePercentageDelta(
        pipelineErroredAmountPrevious,
        pipelineErroredAmount
      ),
    },
  };
}
