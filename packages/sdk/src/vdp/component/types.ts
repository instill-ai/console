import { z } from "zod";

import { GeneralRecord } from "../../types";
import { Spec, SpecSchema } from "../pipeline";

export type ConnectorType =
  | "CONNECTOR_TYPE_UNSPECIFIED"
  | "CONNECTOR_TYPE_OPERATOR"
  | "CONNECTOR_TYPE_DATA"
  | "CONNECTOR_TYPE_AI"
  | "CONNECTOR_TYPE_APPLICATION";

export const ConnectorTypeSchema = z.enum([
  "CONNECTOR_TYPE_UNSPECIFIED",
  "CONNECTOR_TYPE_OPERATOR",
  "CONNECTOR_TYPE_DATA",
  "CONNECTOR_TYPE_AI",
  "CONNECTOR_TYPE_APPLICATION",
]);

export type ConnectorDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentationUrl: string;
  icon: string;
  iconUrl: string;
  type: ConnectorType;
  spec: Spec;
  tombstone: boolean;
  public: boolean;
  custom: boolean;
  vendor: string;
  vendorAttributes: GeneralRecord;
};

export const ConnectorDefinitionSchema = z.object({
  name: z.string(),
  uid: z.string(),
  id: z.string(),
  title: z.string(),
  documentationUrl: z.string(),
  icon: z.string(),
  iconUrl: z.string(),
  type: ConnectorTypeSchema,
  spec: SpecSchema,
  tombstone: z.boolean(),
  public: z.boolean(),
  custom: z.boolean(),
  vendor: z.string(),
  vendorAttributes: z.record(z.any()),
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
  iconUrl: string;
};

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

export type GetConnectorDefinitionRequest = {
  connectorDefinitionName: string;
  view?: string;
};

export type GetConnectorDefinitionResponse = {
  connectorDefinition: ConnectorDefinition;
};

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

export type GetOperatorDefinitionRequest = {
  operatorDefinitionName: string;
  view?: string;
};

export type GetOperatorDefinitionResponse = {
  operatorDefinition: OperatorDefinition;
};
