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

export type TriggerNamespacePipelineStreamEvent =
  | "pipeline_output_updated"
  | "pipeline_completed"
  | "component_status_updated"
  | "component_input_updated"
  | "component_output_updated"
  | "component_error";

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
