import {
  PaginationListContainerProps,
  PipelineMode,
  ResourceState,
} from "@instill-ai/toolkit";

export type PipelineTriggerCount = {
  pipeline_id: string;
  pipeline_uid: string;
  pipeline_completed: number;
  pipeline_error: number;
  status?: ResourceState;
  counts: Count[];
};

export type Count = {
  trigger_time: string | Date;
  count: number;
};

export type TriggerCount = {
  pipeline_id: string;
  counts: Count[];
};

export type PipelineTrigger = {
  trigger_time: string;
  pipeline_trigger_id: string;
  pipeline_id: string;
  pipeline_uid: string;
  pipeline_mode: PipelineMode;
  compute_time_duration: number;
  status: State;
};

export type State = ResourceState | "completed" | "errored";

export type Status = {
  state: State;
  amount: number;
  type: "pipeline" | "model";
  change: number;
};

export type PipelinesTableProps = {
  pipelines: PipelineTrigger[];
  isError: boolean;
  isLoading: boolean;
  statusCount: StatusCount;
} & Pick<
  PaginationListContainerProps,
  "marginBottom" | "currentPage" | "setCurrentPage"
>;

export type StatusCount = {
  completed: Status;
  errored: Status;
};
