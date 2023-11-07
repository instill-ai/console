/* eslint-disable @typescript-eslint/no-explicit-any */

import { OpenAPIV3 } from "openapi-types";
import { ConnectorDefinition, ConnectorResource } from "../connector";
import { Spec, Visibility } from "../types";
import { GeneralRecord, Nullable } from "../../type";
import { JSONSchema7TypeName } from "json-schema";

export type PipelineMode = "MODE_UNSPECIFIED" | "MODE_SYNC" | "MODE_ASYNC";

export type PipelineReleaseState =
  | "STATE_UNSPECIFIED"
  | "STATE_ACTIVE"
  | "STATE_INACTIVE"
  | "STATE_ERROR"
  | "STATE_DELETED";

export type PipelineRecipe = {
  version: string;
  components: PipelineComponent[];
};

export type RawPipelineRecipe = {
  version: string;
  components: RawPipelineComponent[];
};

export type RawPipelineComponent = {
  id: string;
  resource_name: string;
  configuration: Record<string, any>;
  definition_name: string;
};

export type PipelineReleaseWatchState = {
  state: PipelineReleaseState;
  progress: number;
};

export type PipelineComponentType =
  | "COMPONENT_TYPE_UNSPECIFIED"
  | "COMPONENT_TYPE_CONNECTOR_AI"
  | "COMPONENT_TYPE_CONNECTOR_DATA"
  | "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN"
  | "COMPONENT_TYPE_OPERATOR";

export type PipelineReleasesWatchState = Record<
  string,
  PipelineReleaseWatchState
>;

export type Pipeline = {
  name: string;
  uid: string;
  id: string;
  description: string;
  user: string;
  create_time: string;
  update_time: string;
  recipe: PipelineRecipe;
  openapi_schema: OpenAPIV3.Document;
  owner: string;
  permission: PipelinePermission;
  metadata: GeneralRecord;
};

export type OperatorDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentation_url: string;
  icon: string;
  spec: Spec;
  tombstone: boolean;
  public: boolean;
  custom: boolean;
  icon_url: string;
};

export type PipelinePermission = {
  users: PermissionUsers;
  share_code: Nullable<PermissionShareCode>;
};

export type PermissionUsers = Record<
  string,
  {
    enabled: boolean;
    role: PermissionRole;
  }
>;

export type PermissionShareCode = {
  user: string;
  code: string;
  enabled: boolean;
  role: PermissionRole;
};

export type PermissionRole = "ROLE_UNSPECIFIED" | "ROLE_VIEWER";

export type PipelineRelease = {
  name: string;
  uid: string;
  id: string;
  description: string;
  recipe: PipelineRecipe;
  create_time: string;
  update_time: string;
  visibility: Visibility;
  openapi_schema: OpenAPIV3.Document;
  metadata: GeneralRecord;
};

export type PipelineTrace = {
  success: boolean;
  inputs: Record<string, any>[];
  outputs: Record<string, any>[];
  error: Record<string, any>;
  compute_time_in_seconds: number;
};

export type PipelineTriggerMetadata = {
  traces: Record<string, PipelineTrace>;
};

export type PipelineStartComponent = {
  id: "start";
  resource_name: Nullable<string>;
  resource: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  operator_definition: Nullable<OperatorDefinition>;
  configuration: {
    metadata?: StartOperatorMetadata;
  } & GeneralRecord;
};

export type PipelineEndComponent = {
  id: "end";
  resource_name: Nullable<string>;
  resource: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  operator_definition: Nullable<OperatorDefinition>;
  configuration: Record<string, Record<string, any>>;
};

export type PipelineConnectorComponent = {
  id: string;
  resource_name: Nullable<string>;
  resource: Nullable<ConnectorResource>;
  type: PipelineComponentType;
  definition_name: string;
  connector_definition: Nullable<ConnectorDefinition>;
  configuration: Record<string, any>;
};

export type PipelineComponent =
  | PipelineStartComponent
  | PipelineEndComponent
  | PipelineConnectorComponent;

export type StartOperatorMetadata = Record<string, StartOperatorInput>;

export type StartOperatorInput = {
  title: string;
  type: StartOperatorInputType;
  instillFormat: string;
  items?: {
    type: string;
  };
};

export type StartOperatorInputType = "audio" | "image" | JSONSchema7TypeName;
