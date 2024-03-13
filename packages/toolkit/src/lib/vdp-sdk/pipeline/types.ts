/* eslint-disable @typescript-eslint/no-explicit-any */

import { OpenAPIV3 } from "openapi-types";
import { ConnectorDefinition, Connector } from "../connector";
import {
  DataSpecification,
  Owner,
  Permission,
  Spec,
  Visibility,
} from "../types";
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

export type Pipeline = {
  name: string;
  uid: string;
  id: string;
  description: string;
  readme: string;
  create_time: string;
  update_time: string;
  recipe: PipelineRecipe;
  data_specification: DataSpecification;
  owner: Owner;
  owner_name: string;
  releases: PipelineRelease[];
  sharing: PipelineSharing;
  metadata: GeneralRecord;
  permission: Permission;
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

export type PipelineSharing = {
  users: PipelineSharingUserRules;
  share_code: Nullable<PipelineSharingCodeRule>;
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
  create_time: string;
  update_time: string;
  visibility: Visibility;
  openapi_schema: OpenAPIV3.Document;
  metadata: GeneralRecord;
  alias?: string;
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

export type PipelineStartComponentField = {
  title: string;
  description?: string;
  instill_format: string;
  instill_ui_order?: number;
  instill_ui_multiline?: boolean;
};

export type PipelineStartComponentFields = Record<
  string,
  PipelineStartComponentField
>;

export type PipelineStartComponent = {
  id: "start";
  metadata?: GeneralRecord;
  start_component: {
    fields: PipelineStartComponentFields;
  };
};

export type PipelineEndComponentField = {
  title: string;
  description?: string;
  value: string;
  instill_ui_order?: number;
};

export type PipelineEndComponentFields = Record<
  string,
  PipelineEndComponentField
>;

export type PipelineEndComponent = {
  id: "end";
  metadata?: GeneralRecord;
  end_component: {
    fields: PipelineEndComponentFields;
  };
};

export type PipelineConnectorComponent = {
  id: string;
  metadata?: GeneralRecord;
  connector_component: {
    definition_name: string;
    definition: Nullable<ConnectorDefinition>;
    connector_name: Nullable<string>;
    connector: Nullable<Connector>;
    task: string;
    input: GeneralRecord;
    condition: Nullable<string>;
  };
};

export type PipelineOperatorComponent = {
  id: string;
  metadata?: GeneralRecord;
  operator_component: {
    definition_name: string;
    definition: Nullable<OperatorDefinition>;
    task: string;
    input: GeneralRecord;
    condition: Nullable<string>;
  };
};

export type PipelineIteratorComponent = {
  id: string;
  metadata?: GeneralRecord;
  iterator_component: {
    input: string;
    output_elements: Record<string, string>;
    components: PipelineComponent[];
    condition: Nullable<string>;
    data_specification: Nullable<DataSpecification>;
  };
};

export type PipelineComponent =
  | PipelineStartComponent
  | PipelineEndComponent
  | PipelineConnectorComponent
  | PipelineOperatorComponent
  | PipelineIteratorComponent;

export type StartOperatorMetadata = Record<string, StartOperatorInput>;

export type StartOperatorInput = {
  title: string;
  type?: StartOperatorInputType;
  instillFormat: string;
  items?: {
    type: string;
  };
  instillUiOrder?: number;
  instillUIMultiline?: boolean;
  description?: string;
};

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
