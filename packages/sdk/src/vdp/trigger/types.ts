import { GeneralRecord, Operation } from "../../types";
import { PipelineTrace } from "../pipeline";

export type PipelineTriggerMetadata = {
  traces?: Record<string, PipelineTrace>;
};

export type TriggerNamespacePipelineRequest = {
  namespacePipelineName: string;
  input: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterUid?: string;
};

export type TriggerNamespacePipelineResponse = {
  outputs: Record<string, any>[];
  metadata: PipelineTriggerMetadata;
};

export type TriggerAsyncNamespacePipelineRequest = {
  namespacePipelineName: string;
  input: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterUid?: string;
};

export type TriggerAsyncNamespacePipelineResponse = {
  operation: Operation;
};

export type TriggerNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
  input: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterUid?: string;
};

export type TriggerNamespacePipelineReleaseResponse = {
  outputs: Record<string, any>[];
  metadata: PipelineTriggerMetadata;
};

export type TriggerAsyncNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
  input: GeneralRecord[];
  returnTraces?: boolean;
  shareCode?: string;
  requesterUid?: string;
};

export type TriggerAsyncNamespacePipelineReleaseResponse = {
  operation: Operation;
};
