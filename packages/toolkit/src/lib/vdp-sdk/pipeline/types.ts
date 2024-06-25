/* eslint-disable @typescript-eslint/no-explicit-any */

import { JSONSchema7TypeName } from "json-schema";
import { OpenAPIV3 } from "openapi-types";

import { GeneralRecord, Nullable } from "../../type";
import { ConnectorDefinition } from "../connector";
import {
  DataSpecification,
  Owner,
  Permission,
  Spec,
  Visibility,
} from "../types";

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
}

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
};

export type OperatorDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentationUrl: string;
  icon: string;
  spec: Spec;
  tombstone: boolean;
  public: boolean;
  custom: boolean;
  iconUrl: string;
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

export type PipelineRelease = {
  name: string;
  uid: string;
  id: string;
  description: string;
  recipe: PipelineRecipe;
  createTime: string;
  updateTime: string;
  visibility: Visibility;
  openapiSchema: OpenAPIV3.Document;
  metadata: GeneralRecord;
  alias?: string;
};

export type PipelineTrace = {
  success: boolean;
  inputs: Record<string, any>[];
  outputs: Record<string, any>[];
  error: Record<string, any>;
  computeYimeInSeconds: number;
};

export type PipelineTriggerMetadata = {
  traces: Record<string, PipelineTrace>;
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

export type Secret = {
  name: string;
  uid: string;
  id: string;
  createTime: string;
  updateTime: string;
  description: Nullable<string>;

  // The value of the secret, which is input-only and will never be returned in API responses.
  value: Nullable<string>;
};
