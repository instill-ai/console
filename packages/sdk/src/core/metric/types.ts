import { PipelineMode, PipelineReleaseState } from "../../vdp";

export type Mode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineTriggerStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_COMPLETED"
  | "STATUS_ERRORED";

export type PipelineTriggerCount = {
  triggerCount: number;
  status?: PipelineTriggerStatus;
};

export type GetPipelineTriggerCountRequest = {
  namespaceId: string;
  start?: string;
  stop?: string;
};

export type GetPipelineTriggerCountResponse = {
  pipelineTriggerCounts: PipelineTriggerCount[];
};

export type CreditConsumptionChartRecord = {
  namespaceId: string;
  timeBuckets: string[];
  amount: number[];
  source: string;
  creditOwner: string;
};

export type ListCreditConsumptionChartRecordsRequest = {
  namespaceId: string;
  aggregationWindow?: string;
  start?: string;
  stop?: string;
};

export type ListCreditConsumptionChartRecordsResponse = {
  creditConsumptionChartRecords: CreditConsumptionChartRecord[];
};

export type ListCreditConsumptionChartRecordResponse = {
  creditConsumptionChartRecords: CreditConsumptionChartRecord[];
  totalAmount: number;
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
  pipelineReleaseId?: string;
  pipelineReleaseUid?: string;
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
  namespaceId?: string;
  pipelineReleaseId?: string;
  pipelineReleaseUid?: string;
};

export type ListPipelineTriggerComputationTimeChartsResponse = {
  pipelineTriggerChartRecords: PipelineTriggerChartRecord[];
};
