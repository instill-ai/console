import { ResourceView, RunSource, RunStatus } from "..";
import { User } from "../mgmt";
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
  | "TASK_TEXT_TO_IMAGE"
  | "TASK_EMBEDDING"
  //| "TASK_SPEECH_RECOGNITION"
  | "TASK_CHAT"
  | "TASK_COMPLETION"
  | "TASK_CUSTOM";

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

export type Hardware = {
  title: string;
  value: string;
};

export type Model = {
  // ===== Standard AIP fields =====
  // Canonical resource name. Format: `namespaces/{namespace}/models/{model}`
  name: string;
  // Immutable canonical resource ID (e.g., "mod-8f3a2k9E7c1")
  id: string;
  // Human-readable display name for UI
  displayName: string;
  // URL-friendly slug (NO prefix)
  slug?: string;
  // Previous slugs for backward compatibility
  aliases?: string[];
  // Optional description
  description?: string;
  // ===== Timestamps =====
  createTime: string;
  updateTime: string | null;
  deleteTime?: string | null;
  // ===== Resource-specific fields =====
  modelDefinition: string;
  configuration: Record<string, string>;
  task: ModelTask;
  visibility: Visibility;
  ownerName: string;
  // NOTE: organization owner is EE-only (available in console-ee)
  owner: {
    user?: User;
    organization?: GeneralRecord;
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
  tags: string[];
};

export type ModelRegion = {
  regionName: string;
  hardware: Hardware[];
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
  view?: ResourceView;
};

export type ListModelDefinitionsResponse = {
  modelDefinitions: ModelDefinition[];
  nextPageToken: string;
  totalSize: number;
};

export type ListAvailableRegionResponse = {
  regions: ModelRegion[];
};

export type ListModelsRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  visibility?: string;
  orderBy?: string;
  view?: ResourceView;
};

export type ListModelsResponse = {
  models: Model[];
  nextPageToken: string;
  totalSize: number;
};

export type GetNamespaceModelRequest = {
  namespaceId: string;
  modelId: string;
  view?: ResourceView;
};

export type GetNamespaceModelResponse = {
  model: Model;
};

export type ListNamespaceModelsRequest = {
  namespaceId: string;
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  visibility?: Visibility;
  orderBy?: string;
  view?: ResourceView;
};

export type ListNamespaceModelsResponse = {
  models: Model[];
  nextPageToken: string;
  totalSize: number;
};

export type ListModelRunsRequest = {
  namespaceId: string;
  modelId: string;
  view?: ResourceView;
  pageSize?: number;
  page?: number;
  orderBy?: string;
  filter?: string;
  requesterId?: string;
};

export type ModelRun = {
  uid: string;
  runnerId: string;
  modelNamespaceId: string;
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
  requesterId: string;
  modelId?: string;
};

export type ListModelRunsResponse = {
  runs: ModelRun[];
  totalSize: number;
  pageSize: number;
  page: number;
};

export type CreateNamespaceModelRequest = {
  namespaceId: string;
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
  namespaceId: string;
  modelId: string;
};

export type UpdateNamespaceModelRequest = {
  namespaceId: string;
  modelId: string;
  id?: string;
  description?: string;
  visibility?: Visibility;
  region?: string;
  hardware?: string;
  task?: ModelTask;
  configuration?: Record<string, string>;
  readme?: string;
  license?: string;
  profileImage?: string;
  sourceUrl?: string;
  documentationUrl?: string;
  tags?: string[];
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
  namespaceId: string;
  modelId: string;
};

export type WatchNamespaceModelLatestVersionStateResponse = ModelWatchState;

export type ListNamespaceModelVersionsRequest = {
  namespaceId: string;
  modelId: string;
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
  namespaceId: string;
  modelId: string;
  versionId: string;
  taskInputs: Record<string, unknown>[];
  returnTraces?: boolean;
  requesterId?: string;
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

export type GetNamespaceModelOperationResultRequest = {
  namespaceId: string;
  modelId: string;
  view?: ResourceView;
  requesterId?: string;
};

export type GetNamespaceModelOperationResultResponse = {
  operation: Nullable<Operation>;
};

export type GetNamespaceModelVersionOperationResultRequest = {
  namespaceId: string;
  modelId: string;
  versionId: string;
  view?: ResourceView;
  requesterId?: string;
};

export type GetNamespaceModelVersionOperationResultResponse = {
  operation: Nullable<Operation>;
};

export type ModelTriggerStatus =
  | "STATUS_UNSPECIFIED"
  | "STATUS_COMPLETED"
  | "STATUS_ERRORED";

export type ModelTriggersStatusSummaryItem = {
  statusType: ModelTriggerStatus;
  amount: number;
  type: "pipeline" | "model";
  delta: number;
};

export type ModelTriggersStatusSummary = {
  completed: ModelTriggersStatusSummaryItem;
  errored: ModelTriggersStatusSummaryItem;
};

export type ModelsWatchState = Record<string, Nullable<ModelWatchState>>;

export type ListModelRunsByRequesterRequest = {
  pageSize?: number;
  page: Nullable<number>;
  orderBy?: string;
  requesterId?: string;
  start?: string;
};

export type ListModelRunsByRequesterResponse = {
  runs: ModelRun[];
  nextPageToken: string;
  totalSize: number;
};
