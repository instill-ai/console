import { PipelineMode, PipelineState } from "@instill-ai/toolkit";

export type PipelineTriggerCount = {
  pipeline_id: string;
  pipeline_uid: string;
  pipeline_completed: number;
  pipeline_errored: number;
  watchState: PipelineState;
  counts: Count[];
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
