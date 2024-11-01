import { ModelReleaseStage, ModelTriggerStatus } from "../../model";
import { Nullable } from "../../types";
import { PipelineMode, PipelineReleaseState, PipelineRun } from "../../vdp";

export type Mode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineTriggerStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_COMPLETED"
  | "STATUS_ERRORED";

export type PipelineTriggerCount = {
  triggerCount: number;
  status?: PipelineTriggerStatus;
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

export type TriggeredPipeline = {
  pipelineId: string;
  pipelineUid: string;
  triggerCountCompleted: string;
  triggerCountErrored: string;
  watchState?: PipelineReleaseState;
};

export type CreditConsumptionChartRecord = {
  namespaceId: string;
  timeBuckets: string[];
  amount: number[];
  source: string;
  creditOwner: string;
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

export type ModelTriggerTableRecord = {
  modelId: string;
  modelUid: string;
  triggerCountCompleted: string;
  triggerCountErrored: string;
  watchState?: ModelReleaseStage;
};

export type ListModelTriggerMetricRequest = {
  pageSize?: number;
  page?: Nullable<number>;
  filter?: string;
  requesterUid?: string;
  requesterId?: Nullable<string>;
  start?: string;
};

export type ListModelTriggerMetricResponse = {
  modelTriggerTableRecords: ModelTriggerTableRecord[];
  nextPageToken?: string;
  totalSize: number;
};

export type ModelMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type ModelTriggerChartRecord = {
  modelId: string;
  modelUid: string;
  triggerMode?: ModelMode;
  status?: ModelTriggerStatus;
  timeBuckets?: string[];
  triggerCounts?: number[];
  computeTimeDuration?: number[];
  watchState?: ModelReleaseStage;
};

export type ModelTrigger = ModelTriggerChartRecord;

export type ListModelTriggersChartResponse = {
  modelTriggerChartRecords: ModelTriggerChartRecord[];
};

export type ListPipelineRunsByRequesterResponse = {
  pipelineRuns: PipelineRun[];
  nextPageToken: string;
  totalSize: number;
};

export type ListPipelineRunsByRequesterRequest = {
  pageSize?: number;
  page: Nullable<number>;
  orderBy?: string;
  requesterUid?: string;
  requesterId?: string;
  start?: string;
};
