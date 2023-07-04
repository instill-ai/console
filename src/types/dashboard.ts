import { PipelineMode } from "@instill-ai/toolkit";

export type PipelineTriggerCount = {
  pipeline_name: string;
  pipeline_permalink: string;
  pipeline_completed: number;
  pipeline_error: number;
  status?: string;
  compute_time_duration: number[];
};

export type PipelineTrigger = {
  trigger_time: string;
  pipeline_trigger_id: string;
  pipeline_name: string;
  pipeline_permalink: string;
  pipeline_mode: PipelineMode;
  compute_time_duration: number;
  status: string;
};

export interface Status {
  statusname: "completed" | "error";
  amount: number;
  type: "pipeline" | "model";
}
