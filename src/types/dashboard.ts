import {
  PaginationListContainerProps,
  PipelineMode,
} from "@instill-ai/toolkit";

export type PipelineTriggerCount = {
  pipeline_id: string;
  pipeline_uid: string;
  pipeline_completed: number;
  pipeline_error: number;
  status?: string;
  compute_time_duration: number[];
};

export type PipelineTrigger = {
  trigger_time: string;
  pipeline_trigger_id: string;
  pipeline_id: string;
  pipeline_uid: string;
  pipeline_mode: PipelineMode;
  compute_time_duration: number;
  status: string;
};

export interface Status {
  statusname: "completed" | "errored";
  amount: number;
  type: "pipeline" | "model";
  change?: number;
}

export type PipelinesTableProps = {
  pipelines: PipelineTrigger[];
  isError: boolean;
  isLoading: boolean;
  statusCount: Status[];
} & Pick<
  PaginationListContainerProps,
  "marginBottom" | "currentPage" | "setCurrentPage"
>;
