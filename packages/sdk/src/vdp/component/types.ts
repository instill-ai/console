import { z } from "zod";

import { GeneralRecord, Spec, SpecSchema } from "../../types";

export type ConnectorType =
  | "COMPONENT_TYPE_UNSPECIFIED"
  | "COMPONENT_TYPE_OPERATOR"
  | "COMPONENT_TYPE_DATA"
  | "COMPONENT_TYPE_AI"
  | "COMPONENT_TYPE_APPLICATION"
  | "COMPONENT_TYPE_GENERIC";

export const ConnectorTypeSchema = z.enum([
  "COMPONENT_TYPE_UNSPECIFIED",
  "COMPONENT_TYPE_OPERATOR",
  "COMPONENT_TYPE_DATA",
  "COMPONENT_TYPE_AI",
  "COMPONENT_TYPE_APPLICATION",
  "COMPONENT_TYPE_GENERIC",
]);

export type Task = {
  title: string;
  name: string;
  description?: string;
};

export const TaskSchema = z.object({
  title: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type ConnectorDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentationUrl: string;
  icon: string;
  type: ConnectorType;
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
  type: ConnectorTypeSchema,
  spec: SpecSchema,
  tombstone: z.boolean(),
  public: z.boolean(),
  custom: z.boolean(),
  vendor: z.string(),
  vendorAttributes: z.record(z.any()),
  tasks: z.array(TaskSchema),
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
