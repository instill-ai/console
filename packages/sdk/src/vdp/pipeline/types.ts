import { JSONSchema7TypeName } from "json-schema";
import { z } from "zod";

import {
  GeneralRecord,
  InstillJSONSchema,
  Nullable,
  Owner,
  Permission,
} from "../../types";
import { ConnectorDefinition, OperatorDefinition } from "../component";
import { PipelineRelease } from "../release";

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineReleaseState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR"
  | "STATE_DELETED";

export type PipelineRecipe = {
  version: string;
  component?: PipelineComponentMap;
  variable?: PipelineVariableFieldMap;
  output?: PipelineOutputFieldMap;
};

export type PipelineVariableField = {
  title: string;
  description?: string;
  instillFormat: string;
  instillUiOrder?: number;
  instillUiMultiline?: boolean;
};

export type PipelineVariableFieldMap = Record<string, PipelineVariableField>;

export type PipelineOutputField = {
  title: string;
  description?: string;
  value: string;
  instillUiOrder?: number;
};

export type PipelineOutputFieldMap = Record<string, PipelineOutputField>;

export type PipelineReleaseWatchState = {
  state: PipelineReleaseState;
  progress: number;
};

export type DataSpecification = {
  input: Nullable<InstillJSONSchema>;
  output: Nullable<InstillJSONSchema>;
};

export type Spec = {
  componentSpecification: InstillJSONSchema;
  dataSpecifications: Nullable<Record<string, DataSpecification>>;
};

export const SpecSchema = z.object({
  componentSpecification: z.record(z.any()),
  dataSpecifications: z
    .record(
      z.object({
        input: z.any().nullable(),
        output: z.any().nullable(),
      }),
    )
    .nullable(),
});

export type PipelineComponentType =
  | "COMPONENT_TYPE_UNSPECIFIED"
  | "COMPONENT_TYPE_CONNECTOR_AI"
  | "COMPONENT_TYPE_CONNECTOR_DATA"
  | "COMPONENT_TYPE_CONNECTOR_APPLICATION"
  | "COMPONENT_TYPE_OPERATOR";

export type PipelineReleasesWatchState = Record<
  string,
  PipelineReleaseWatchState
>;

export type PipelineStats = {
  lastRunTime: string;
  numberOfRuns: number;
};

export type Pipeline = {
  updated_at: string | number | Date;
  name: string;
  uid: string;
  id: string;
  description: string;
  readme: string;
  createTime: string;
  updateTime: string;
  recipe: PipelineRecipe;
  dataSpecification: DataSpecification;
  owner: Owner;
  ownerName: string;
  releases: PipelineRelease[];
  sharing: PipelineSharing;
  metadata: GeneralRecord;
  permission: Permission;
  tags: string[];
  stats: PipelineStats;
  profileImage: string;
  sourceUrl: string;
  documentationUrl: string;
  license: string;
};

export type PipelineSharing = {
  users: PipelineSharingUserRules;
  shareCode: Nullable<PipelineSharingCodeRule>;
};

export type PipelineSharingUserRules = Record<
  string,
  | {
      enabled: boolean;
      role: PermissionRole;
    }
  | undefined
>;

export type PipelineSharingCodeRule = {
  user: string;
  code?: string;
  enabled: boolean;
  role: PermissionRole;
};

export type PermissionRole =
  | "ROLE_UNSPECIFIED"
  | "ROLE_VIEWER"
  | "ROLE_EXECUTOR";

export type PipelineTrace = {
  success: boolean;
  inputs: GeneralRecord[];
  outputs: GeneralRecord[];
  error: GeneralRecord;
  computeYimeInSeconds: number;
};

export type ComponentBasicFields = {
  metadata?: GeneralRecord;
  type: string;
};

export type PipelineGeneralComponent = {
  definition?: Nullable<ConnectorDefinition | OperatorDefinition>;
  task: string;
  input: GeneralRecord;
  condition: Nullable<string>;
  setup: Nullable<GeneralRecord>;
} & ComponentBasicFields;

export type PipelineIteratorComponent = {
  input: string;
  outputElements: Record<string, string>;
  component: PipelineComponentMap;
  condition: Nullable<string>;
  dataSpecification: Nullable<DataSpecification>;
} & ComponentBasicFields;

export type PipelineComponentMap = Record<string, PipelineComponent>;

export type PipelineComponent =
  | PipelineIteratorComponent
  | PipelineGeneralComponent;

export type StartOperatorInputType =
  | "audio/*"
  | "image/*"
  | "long_string"
  | "array:image/*"
  | "array:audio/*"
  | "array:string"
  | "*/*"
  | "array:*/*"
  | "semi-structured/json"
  | "video/*"
  | "array:video/*"
  | JSONSchema7TypeName;

export type IteratorDefinition = {
  name: "iterator/iterator";
  uid: "uid";
  id: "iterator";
  title: "Iterator";
  icon: "iterator.svg";
};

export type HubStatsResponse = {
  numberOfPublicPipelines: number;
  numberOfFeaturedPipelines: number;
};

export type ListAccessiblePipelinesRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  view?: string;
  showDeleted?: boolean;
  visibility?: string;
  orderBy?: string;
};

export type ListAccessiblePipelineResponse = {
  pipelines: Pipeline[];
  nextPageToken: string;
  totalSize: number;
};

export type ListNamespacePipelinesRequest = {
  namespaceName: string;
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  view?: string;
  showDeleted?: boolean;
  visibility?: string;
  orderBy?: string;
};

export type ListNamespacePipelinesResponse = {
  pipelines: Pipeline[];
  nextPageToken: string;
  totalSize: number;
};

export type GetNamespacePipelineRequest = {
  namespacePipelineName: string;
  view?: string;
  shareCode?: string;
};

export type GetNamespacePipelineResponse = {
  pipeline: Pipeline;
};

export type CreateNamespacePipelineRequest = {
  namespaceName: string;
  id: string;
  description?: string;
  recipe: PipelineRecipe;
  metadata: GeneralRecord;
  sharing?: PipelineSharing;
  readme?: string;
  rawRecipe?: string;
};

export type CreateNamespacePipelineResponse = {
  pipeline: Pipeline;
};

export type DeleteNamespacePipelineRequest = {
  namespacePipelineName: string;
};

export type UpdateNamespacePipelineRequest = {
  namespacePipelineName: string;
  description?: string;
  recipe?: PipelineRecipe;
  sharing?: PipelineSharing;
  metadata?: GeneralRecord;
  readme?: string;
  sourceUrl?: string;
  documentationUrl?: string;
  license?: string;
  profileImage?: string;
  tags?: string[];
};

export type UpdateNamespacePipelineResponse = {
  pipeline: Pipeline;
};

export type ValidatePipelineRecipeError = {
  location: string;
  error: string;
};

export type ValidateNamespacePipelineRequest = {
  namespacePipelineName: string;
};

export type ValidateNamespacePipelineResponse = {
  success: boolean;
  errors: ValidatePipelineRecipeError[];
};

export type RenameNamespacePipelineRequest = {
  namespacePipelineName: string;
  newPipelineId: string;
};

export type RenameNamespacePipelineResponse = {
  pipeline: Pipeline;
};

export type CloneNamespacePipelineRequest = {
  namespacePipelineName: string;
  target: string;
  description?: string;
  sharing?: PipelineSharing;
};

export type CloneNamespacePipelineReleaseRequest = {
  namespacePipelineReleaseName: string;
  target: string;
  description?: string;
  sharing?: PipelineSharing;
};
