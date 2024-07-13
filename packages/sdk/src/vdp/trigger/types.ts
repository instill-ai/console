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
};

export type TriggerNamespacePipelineResponse = {
  outputs: GeneralRecord[];
  metadata: PipelineTriggerMetadata;
};

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
