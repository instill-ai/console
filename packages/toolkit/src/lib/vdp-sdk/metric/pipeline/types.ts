import { PipelineMode, PipelineReleaseState } from "../../pipeline";

export type PipelineTriggerCount = {
  pipeline_id: string;
  pipeline_uid: string;
  pipeline_completed: number;
  pipeline_errored: number;
  watchState: PipelineReleaseState;
  counts: Count[];
};

export type TriggeredPipeline = {
  pipeline_id: string;
  pipeline_uid: string;
  trigger_count_completed: string;
  trigger_count_errored: string;
  watchState?: PipelineReleaseState;
};

export type PipelinesChart = {
  pipeline_id: string;
  pipeline_uid: string;
  trigger_mode: "MODE_SYNC" | "MODE_ASYNC";
  status: PipelineReleaseState;
  time_buckets: string[];
  trigger_counts: number[] | string[];
  compute_time_duration: number[] | string[];
  watchState?: PipelineReleaseState;
};

export type PipelineTriggerStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_COMPLETED"
  | "STATUS_ERRORED";

export type Count = {
  trigger_time: string | Date;
  count: number;
};

export type PipelineTriggerRecord = {
  trigger_time: string;
  pipeline_trigger_id: string;
  pipeline_id: string;
  pipeline_uid: string;
  pipeline_mode: PipelineMode;
  compute_time_duration: number;
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
