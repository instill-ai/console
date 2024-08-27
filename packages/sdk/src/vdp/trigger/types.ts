/* eslint-disable @typescript-eslint/no-explicit-any */

import { GeneralRecord, Operation } from "../../types";
import { PipelineTrace } from "../pipeline";

export type PipelineTriggerMetadata = {
  traces?: Record<string, PipelineTrace>;
};

export type TriggerNamespacePipelineRequest = {
  namespacePipelineName: string;
  inputs: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterUid?: string;
  stream?: boolean;
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
  namespacePipelineName: string;
  inputs: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterUid?: string;
};

export type TriggerAsyncNamespacePipelineResponse = {
  operation: Operation;
};

export type TriggerNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
  inputs: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterUid?: string;
  stream?: boolean;
};

export type TriggerNamespacePipelineReleaseResponse = {
  outputs: GeneralRecord[];
  metadata: PipelineTriggerMetadata;
};

export type TriggerAsyncNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
  inputs: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterUid?: string;
};

export type TriggerAsyncNamespacePipelineReleaseResponse = {
  operation: Operation;
};

export type TriggerUserPipelineWithStreamData = {
  outputs: GeneralRecord[];
  metadata: PipelineTriggerMetadata;
};
