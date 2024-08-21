import { z } from "zod";

import { GeneralRecord, Spec, SpecSchema } from "../../types";

export type ComponentType =
  | "COMPONENT_TYPE_UNSPECIFIED"
  | "COMPONENT_TYPE_OPERATOR"
  | "COMPONENT_TYPE_DATA"
  | "COMPONENT_TYPE_AI"
  | "COMPONENT_TYPE_APPLICATION"
  | "COMPONENT_TYPE_GENERIC";

export const ComponentTypeSchema = z.enum([
  "COMPONENT_TYPE_UNSPECIFIED",
  "COMPONENT_TYPE_OPERATOR",
  "COMPONENT_TYPE_DATA",
  "COMPONENT_TYPE_AI",
  "COMPONENT_TYPE_APPLICATION",
  "COMPONENT_TYPE_GENERIC",
]);

export type Task = {
  name: string;
  title: string;
  description: string;
};

export const TaskSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
});

export type ConnectorDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentationUrl: string;
  icon: string;
  type: ComponentType;
  spec: Spec;
  tombstone: boolean;
  public: boolean;
  custom: boolean;
  vendor: string;
  vendorAttributes: GeneralRecord;
  tasks: Task[];
};

export const ConnectorDefinitionSchema = z.object({
  name: z.string(),
  uid: z.string(),
  id: z.string(),
  title: z.string(),
  documentationUrl: z.string(),
  icon: z.string(),
  type: ComponentTypeSchema,
  spec: SpecSchema,
  tombstone: z.boolean(),
  public: z.boolean(),
  custom: z.boolean(),
  vendor: z.string(),
  vendorAttributes: z.record(z.any()),
});

export type ComponentDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentationUrl: string;
  icon: string;
  spec: Spec;
  type: ComponentType;
  tombstone: boolean;
  public: boolean;
  custom: boolean;
  vendor: string;
  vendorAttributes: GeneralRecord;
  sourceUrl: string;
  version: string;
  tasks: Task[];
  description: string;
  releaseStage: string;
};

export const ComponentDefinitionSchema = z.object({
  name: z.string(),
  uid: z.string(),
  id: z.string(),
  title: z.string(),
  documentationUrl: z.string(),
  icon: z.string(),
  spec: SpecSchema,
  type: ComponentTypeSchema,
  tombstone: z.boolean(),
  public: z.boolean(),
  custom: z.boolean(),
  vendor: z.string(),
  vendorAttributes: z.record(z.any()),
  sourceUrl: z.string(),
  version: z.string(),
  tasks: z.array(TaskSchema),
  description: z.string(),
  releaseStage: z.string(),
});

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
  tasks: Task[];
  type: ComponentType;
};

export const OperatorDefinitionSchema = z.object({
  name: z.string(),
  uid: z.string(),
  id: z.string(),
  title: z.string(),
  documentationUrl: z.string(),
  icon: z.string(),
  spec: SpecSchema,
  tombstone: z.boolean(),
  public: z.boolean(),
  custom: z.boolean(),
  tasks: z.array(TaskSchema),
  type: ComponentTypeSchema,
});

export type ListConnectorDefinitionsRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  view?: string;
};

export type ListConnectorDefinitionsResponse = {
  connectorDefinitions: ConnectorDefinition[];
  nextPageToken: string;
  totalSize: number;
};

export const listConnectorDefinitionsWithPaginationResponseValidator = z.object(
  {
    connectorDefinitions: z.array(ConnectorDefinitionSchema),
    nextPageToken: z.string(),
    totalSize: z.number(),
  },
);

export type ListComponentDefinitionsRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  view?: string;
};

export type ListComponentDefinitionsResponse = {
  componentDefinitions: ComponentDefinition[];
  nextPageToken: string;
  totalSize: number;
};

export const listComponentDefinitionsWithPaginationResponseValidator = z.object(
  {
    componentDefinitions: z.array(ComponentDefinitionSchema),
    nextPageToken: z.string(),
    totalSize: z.number(),
  },
);

export type GetConnectorDefinitionRequest = {
  connectorDefinitionName: string;
  view?: string;
};

export type GetConnectorDefinitionResponse = {
  connectorDefinition: ConnectorDefinition;
};

export const getConnectorDefinitionResponseValidator =
  ConnectorDefinitionSchema;

export type ListOperatorDefinitionsRequest = {
  pageSize?: number;
  pageToken?: string;
  filter?: string;
  view?: string;
};

export type ListOperatorDefinitionsResponse = {
  operatorDefinitions: OperatorDefinition[];
  nextPageToken: string;
  totalSize: number;
};

export const listOperatorDefinitionsWithPaginationResponseValidator = z.object({
  operatorDefinitions: z.array(OperatorDefinitionSchema),
  nextPageToken: z.string(),
  totalSize: z.number(),
});

export type GetOperatorDefinitionRequest = {
  operatorDefinitionName: string;
  view?: string;
};

export type GetOperatorDefinitionResponse = {
  operatorDefinition: OperatorDefinition;
};

export const getOperatorDefinitionResponseValidator = OperatorDefinitionSchema;
