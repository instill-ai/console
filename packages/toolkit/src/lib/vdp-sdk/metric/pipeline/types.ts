import { PipelineMode, PipelineReleaseState } from "../../pipeline";

export type PipelineTriggerCount = {
  pipelineId: string;
  pipelineUid: string;
  pipelineCompleted: number;
  pipelineErrored: number;
  watchState: PipelineReleaseState;
  counts: Count[];
};

export type TriggeredPipeline = {
  pipelineId: string;
  pipelineUid: string;
  triggerCountCompleted: string;
  triggerCountErrored: string;
  watchState?: PipelineReleaseState;
};

export type PipelinesChart = {
  pipelineId: string;
  pipelineUid: string;
  triggerMode: PipelineMode;
  status: PipelineTriggerStatus;
  timeBuckets: string[];
  triggerCounts: number[] | string[];
  computeTimeDuration: number[] | string[];
  watchState?: PipelineReleaseState;
};

export type PipelineTriggerStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_COMPLETED"
  | "STATUS_ERRORED";

export type Count = {
  triggerTime: string | Date;
  count: number;
};

export type PipelineTriggerRecord = {
  triggerTime: string;
  pipelineTriggerId: string;
  pipelineId: string;
  pipelineUid: string;
  pipelineMode: PipelineMode;
  computeTimeDuration: number;
  status: PipelineTriggerStatus;
};

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
