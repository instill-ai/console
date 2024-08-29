import { ResourceView, RunSource, RunStatus } from "..";
import { Organization, User } from "../core";
import {
  GeneralRecord,
  InstillJSONSchema,
  Nullable,
  Operation,
  Permission,
  Visibility,
} from "../types";

export type ModelReleaseStage =
  | "RELEASE_STAGE_UNSPECIFIED"
  | "RELEASE_STAGE_ALPHA"
  | "RELEASE_STAGE_BETA"
  | "RELEASE_STAGE_GENERALLY_AVAILABLE"
  | "RELEASE_STAGE_CUSTOM";

export type ModelState =
  | "STATE_UNSPECIFIED"
  | "STATE_STARTING"
  | "STATE_OFFLINE"
  | "STATE_SCALING_UP"
  | "STATE_SCALING_DOWN"
  | "STATE_ACTIVE"
  | "STATE_IDLE"
  | "STATE_ERROR";

export type ModelTask =
  | "TASK_CLASSIFICATION"
  | "TASK_DETECTION"
  | "TASK_KEYPOINT"
  | "TASK_OCR"
  | "TASK_INSTANCE_SEGMENTATION"
  | "TASK_SEMANTIC_SEGMENTATION"
  | "TASK_TEXT_GENERATION"
  | "TASK_TEXT_GENERATION_CHAT"
  | "TASK_TEXT_TO_IMAGE"
  | "TASK_IMAGE_TO_IMAGE"
  | "TASK_VISUAL_QUESTION_ANSWERING";

export type ModelReadme = {
  name: string;
  size: number;
  type: string;
  content: string;
  encoding: string;
};

export type ModelDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentationUrl: string;
  icon: string;
  releaseStage: ModelReleaseStage;
  modelSpec: GeneralRecord;
  createTime: string;
  updateTime: string;
};

export type Model = {
  name: string;
  uid: string;
  id: string;
  description: string;
  modelDefinition: string;
  configuration: Record<string, string>;
  task: ModelTask;
  visibility: Visibility;
  createTime: string;
  updateTime: string | null;
  deleteTime: string | null;
  ownerName: string;
  owner: {
    user?: User;
    organization?: Organization;
  };
  region: string;
  hardware: string;
  readme: string;
  sourceUrl: string;
  documentationUrl: string;
  license: string;
  profileImage: string;
  permission: Permission;
  inputSchema: InstillJSONSchema | null;
  outputSchema: InstillJSONSchema | null;
  sampleInput: Record<string, GeneralRecord>;
  sampleOutput: Record<string, GeneralRecord>;
  stats: {
    numberOfRuns: number;
    lastRunTime: string;
  };
  versions: string[];
};

export type ModelRegion = {
  regionName: string;
  hardware: string[];
};

export type ModelWatchState = {
  state: ModelState;
  message: string;
};

export type ModelVersion = {
  name: string;
  version: string;
  digest: string;
  state: ModelState;
  updateTime: string;
};

export type GetModelDefinitionRequest = {
  modelDefinitionName: string;
};

export type GetModelDefinitionResponse = {
  modelDefinition: ModelDefinition;
};

export type ListModelDefinitionsRequest = {
  pageSize?: number;
  pageToken?: string;
  view?: string;
};

export type ListModelDefinitionsResponse = {
  modelDefinitions: ModelDefinition[];
  nextPageToken: string;
  totalSize: number;
};

export type ListAvailableRegionResponse = {
  regions: ModelRegion[];
};

export type ListAccessibleModelsRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  visibility?: string;
  orderBy?: string;
  view?: string;
};

export type ListAccessibleModelsResponse = {
  models: Model[];
  nextPageToken: string;
  totalSize: number;
};

export type GetNamespaceModelRequest = {
  namespaceModelName: string;
  view?: string;
};

export type GetNamespaceModelResponse = {
  model: Model;
};

export type ListNamespaceModelsRequest = {
  namespaceName: string;
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  visibility?: string;
  orderBy?: string;
  view?: string;
};

export type ListNamespaceModelsResponse = {
  models: Model[];
  nextPageToken: string;
  totalSize: number;
};

export type ListModelRunsRequest = {
  modelName: string;
  view: ResourceView;
  pageSize: number;
  page: number;
  orderBy: Nullable<string>;
  filter: Nullable<string>;
};

export type ModelRun = {
  uid: string;
  modelUid: string;
  runnerId: string;
  status: RunStatus;
  source: RunSource;
  totalDuration: number;
  endTime: string;
  createTime: string;
  updateTime: string;
  version: string;
  taskInputs: GeneralRecord[];
  taskOutputs: GeneralRecord[];
  creditAmount: Nullable<number>;
};

export type ListModelRunsResponse = {
  runs: ModelRun[];
  totalSize: number;
  pageSize: number;
  page: number;
};

export type CreateNamespaceModelRequest = {
  namespaceName: string;
  id: string;
  description?: string;
  visibility: Visibility;
  region: string;
  hardware: string;
  task: ModelTask;
  modelDefinition: string;
  configuration: Record<string, string>;
};

export type CreateNamespaceModelResponse = {
  model: Model;
};

export type DeleteNamespaceModelRequest = {
  namespaceModelName: string;
};

export type UpdateNamespaceModelRequest = {
  namespaceModelName: string;
  description?: string;
  visibility: Visibility;
  region: string;
  hardware: string;
  task: ModelTask;
  modelDefinition: string;
  configuration: Record<string, string>;
};

export type UpdateNamespaceModelResponse = {
  model: Model;
};

export type RenameNamespaceModelRequest = {
  namespaceModelName: string;
  newModelId: string;
};

export type RenameNamespaceModelResponse = {
  model: Model;
};

export type PublishNamespaceModelRequest = {
  namespaceModelName: string;
};

export type PublishNamespaceModelResponse = {
  model: Model;
};

export type UnPublishNamespaceModelRequest = {
  namespaceModelName: string;
};

export type UnPublishNamespaceModelResponse = {
  model: Model;
};

export type GetNamespaceModelReadmeRequest = {
  namespaceModelName: string;
};

export type GetNamespaceModelReadmeResponse = {
  readme: ModelReadme;
};

export type WatchNamespaceModelVersionStateRequest = {
  namespaceModelVersionName: string;
};

export type WatchNamespaceModelVersionStateResponse = {
  state: ModelWatchState;
};

export type WatchNamespaceModelLatestVersionStateRequest = {
  namespaceModelName: string;
};

export type WatchNamespaceModelLatestVersionStateResponse = ModelWatchState;

export type ListNamespaceModelVersionsRequest = {
  namespaceModelName: string;
  pageSize?: number;
  page?: number;
};

export type ListNamespaceModelVersionsResponse = {
  versions: ModelVersion[];
  totalSize: number;
  pageSize: number;
  page: number;
};

export type DeleteNamespaceModelVersionRequest = {
  namespaceModelVersionName: string;
};

export type TriggerNamespaceModelVersionRequest = {
  namespaceModelVersionName: string;
  taskInputs: Record<string, unknown>[];
  isConsole?: boolean;
};

export type TriggerNamespaceModelVersionResponse = {
  task: ModelTask;
  taskOutputs: Record<string, Record<string, unknown>>[];
};

export type TriggerAsyncNamespaceModelVersionRequest = {
  namespaceModelVersionName: string;
  taskInputs: Record<string, unknown>[];
  returnTraces?: boolean;
  requesterUid?: string;
  isConsole?: boolean;
};

export type TriggerAsyncNamespaceModelVersionResponse = {
  operation: Operation;
};

export type TriggerNamespaceModelLatestVersionRequest = {
  namespaceModelName: string;
  taskInputs: Record<string, unknown>[];
};

export type TriggerNamespaceModelLatestVersionResponse = {
  task: ModelTask;
  taskOutputs: Record<string, Record<string, unknown>>[];
};

export type TriggerAsyncNamespaceModelLatestVersionRequest = {
  namespaceModelName: string;
  taskInputs: Record<string, unknown>[];
};

export type TriggerAsyncNamespaceModelLatestVersionResponse = {
  operation: Operation;
};

export type GetNamespaceModelOperationResultResponse = {
  operation: Nullable<Operation>;
};
