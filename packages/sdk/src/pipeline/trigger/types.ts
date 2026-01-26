/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  DataSpecification,
  FileReference,
  GeneralRecord,
  Nullable,
  Operation,
} from "../../types";
import { PipelineTrace } from "../pipeline";
import { ResourceView, RunSource, RunStatus } from "../types";

export type PipelineRun = {
  pipelineNamespaceId: string;
  pipelineId: string;
  pipelineRunUid: string;
  pipelineVersion: string;
  status: RunStatus;
  source: RunSource;
  totalDuration: number;
  runnerId: string;
  inputsReference: FileReference[];
  inputs: GeneralRecord[];
  outputsReference: FileReference[];
  outputs: GeneralRecord[];
  recipeSnapshot: Nullable<GeneralRecord>;
  startTime: string;
  completeTime: string;
  creditAmount: Nullable<number>;
  error: Nullable<string>;
  dataSpecification: DataSpecification;
  requesterId: string;
};

export type ListPaginatedNamespacePipelineRunsRequest = {
  namespaceId: string;
  pipelineId: string;
  view?: ResourceView;
  pageSize?: number;
  page?: number;
  orderBy?: string;
  filter?: string;
  requesterId?: string;
};

export type ListPaginatedNamespacePipelineRunsResponse = {
  pipelineRuns: PipelineRun[];
  totalSize: number;
  page: number;
  pageSize: number;
};

export type ComponentRun = {
  pipelineRunUid: string;
  componentId: string;
  status: RunStatus;
  totalDuration: number;
  startTime: string;
  completeTime: string;
  inputs: GeneralRecord[];
  outputs: GeneralRecord[];
};

export type ListPaginatedNamespacePipelineComponentRunsRequest = {
  namespaceId: string;
  pipelineId: string;
  pipelineRunId: string;
  pageSize?: number;
  page?: number;
  view?: ResourceView;
  orderBy?: string;
  filter?: string;
  requesterId?: string;
};

export type ListPaginatedNamespacePipelineComponentRunsResponse = {
  componentRuns: ComponentRun[];
  totalSize: number;
  page: number;
  pageSize: number;
};

export type PipelineTriggerMetadata = {
  traces?: Record<string, PipelineTrace>;
};

export type TriggerNamespacePipelineRequest = {
  namespaceId: string;
  pipelineId: string;
  inputs: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterId?: string;
  stream?: boolean;
  isConsole?: boolean;
};

export type TriggerNamespacePipelineResponse = {
  outputs: GeneralRecord[];
  metadata: PipelineTriggerMetadata;
};

export type PipelineStreamStatus = {
  started: boolean;
  completed: boolean;
  errored: boolean;
  skipped: boolean;
};

export type TriggerNamespacePipelineStreamEventType =
  | "PIPELINE_STATUS_UPDATED"
  | "PIPELINE_OUTPUT_UPDATED"
  | "PIPELINE_ERROR_UPDATED"
  | "COMPONENT_STATUS_UPDATED"
  | "COMPONENT_INPUT_UPDATED"
  | "COMPONENT_OUTPUT_UPDATED"
  | "COMPONENT_ERROR_UPDATED";

export type PipelineStatusUpdatedEvent = {
  event: "PIPELINE_STATUS_UPDATED";
  data: {
    updateTime: string;
    batchIndex: number;
    variable: GeneralRecord;
    status: PipelineStreamStatus;
  };
};

export type PipelineOutputUpdatedEvent = {
  event: "PIPELINE_OUTPUT_UPDATED";
  data: {
    updateTime: string;
    batchIndex: number;
    status: PipelineStreamStatus;
    output: GeneralRecord;
  };
};

export type PipelineErrorUpdatedEvent = {
  event: "PIPELINE_ERROR_UPDATED";
  data: {
    updateTime: string;
    batchIndex: number;
    status: PipelineStreamStatus;
    error: GeneralRecord;
  };
};

export type ComponentStatusUpdatedEvent = {
  event: "COMPONENT_STATUS_UPDATED";
  data: {
    updateTime: string;
    componentID: string;
    batchIndex: number;
    status: PipelineStreamStatus;
  };
};

export type ComponentInputUpdatedEvent = {
  event: "COMPONENT_INPUT_UPDATED";
  data: {
    updateTime: string;
    componentID: string;
    batchIndex: number;
    status: PipelineStreamStatus;
    input: GeneralRecord;
  };
};

export type ComponentOutputUpdatedEvent = {
  event: "COMPONENT_OUTPUT_UPDATED";
  data: {
    updateTime: string;
    componentID: string;
    batchIndex: number;
    status: PipelineStreamStatus;
    output: GeneralRecord;
  };
};

export type ComponentErrorUpdatedEvent = {
  event: "COMPONENT_ERROR_UPDATED";
  data: {
    updateTime: string;
    componentID: string;
    batchIndex: number;
    status: PipelineStreamStatus;
    error: GeneralRecord;
  };
};

export type TriggerNamespacePipelineStreamEvent =
  | PipelineStatusUpdatedEvent
  | PipelineOutputUpdatedEvent
  | PipelineErrorUpdatedEvent
  | ComponentStatusUpdatedEvent
  | ComponentInputUpdatedEvent
  | ComponentOutputUpdatedEvent
  | ComponentErrorUpdatedEvent;

export type TriggerNamespacePipelineWithStreamResponse = any;

export type TriggerAsyncNamespacePipelineRequest = {
  namespaceId: string;
  pipelineId: string;
  inputs: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterId?: string;
};

export type TriggerAsyncNamespacePipelineResponse = {
  operation: Operation;
};

export type TriggerNamespacePipelineReleaseRequest = {
  namespaceId: string;
  pipelineId: string;
  releaseId: string;
  inputs: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterId?: string;
  stream?: boolean;
};

export type TriggerNamespacePipelineReleaseResponse = {
  outputs: GeneralRecord[];
  metadata: PipelineTriggerMetadata;
};

export type TriggerAsyncNamespacePipelineReleaseRequest = {
  namespaceId: string;
  pipelineId: string;
  releaseId: string;
  inputs: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterId?: string;
};

export type TriggerNamespacePipelineReleaseWithStreamResponse = any;

export type TriggerAsyncNamespacePipelineReleaseResponse = {
  operation: Operation;
};

export type TriggerUserPipelineWithStreamData = {
  outputs: GeneralRecord[];
  metadata: PipelineTriggerMetadata;
};
