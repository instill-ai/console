import { PipelineTriggersStatusSummary, TriggeredPipeline } from "../vdp-sdk";
import { calculatePercentageDelta } from "./calculatePercentageDelta";

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

  return getPipelineTriggersStatusSummary(
    pipelineCompleteAmount,
    pipelineCompleteAmountPrevious,
    pipelineErroredAmount,
    pipelineErroredAmountPrevious
  );
}

export function getPipelineTriggersStatusSummary(
  pipelineCompleteAmount: number,
  pipelineCompleteAmountPrevious: number,
  pipelineErroredAmount: number,
  pipelineErroredAmountPrevious: number
): PipelineTriggersStatusSummary {
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
