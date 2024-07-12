import { PipelineMode, PipelineReleaseState } from "../../vdp";

export type CreditConsumptionChartRecord = {
  creditOwner: string;
  timeBuckets: string[];
  amount: number[];
};

export type ListCreditConsumptionChartRecordResponse = {
  creditConsumptionChartRecords: CreditConsumptionChartRecord[];
  totalAmount: number;
};

export type PipelineTriggerStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_COMPLETED"
  | "STATUS_ERRORED";

export type PipelineTriggerRecord = {
  triggerTime: string;
  pipelineTriggerId: string;
  pipelineId: string;
  pipelineUid: string;
  pipelineMode: PipelineMode;
  computeTimeDuration: number;
  status: PipelineTriggerStatus;
};

export type ListPipelineTriggerRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
};

export type ListPipelineTriggersResponse = {
  pipelineTriggerRecords: PipelineTriggerRecord[];
  nextPageToken: string;
  totalSize: number;
};

export type ListPipelineTriggerMetricRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
};

export type PipelineTriggerTableRecord = {
  pipelineId: string;
  pipelineUid: string;
  triggerCountCompleted: string;
  triggerCountErrored: string;
  watchState?: PipelineReleaseState;
};

export type ListPipelineTriggerMetricResponse = {
  pipelineTriggerTableRecords: PipelineTriggerTableRecord[];
  nextPageToken: string;
  totalSize: number;
};

export type ListPipelineTriggerComputationTimeChartsRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
};

export type PipelineTriggerChartRecord = {
  pipelineId: string;
  pipelineUid: string;
  triggerMode: PipelineMode;
  status: PipelineTriggerStatus;
  timeBuckets: string[];
  triggerCounts: number[];
  computeTimeDuration: number[];
  watchState?: PipelineReleaseState;
};

export type ListPipelineTriggerComputationTimeChartsResponse = {
  pipelineTriggerChartRecords: PipelineTriggerChartRecord[];
};
