import { z } from "zod";

import { InstillJSONSchema, Nullable } from "../../types";
import { ResourceView, ResourceViewSchema } from "../../vdp";

export type IntegrationMethod = "METHOD_DICTIONARY" | "METHOD_OAUTH";

export type HelpLink = {
  text: string;
  url: string;
};

export const HelpLinkSchema = z.object({
  text: z.string(),
  url: z.string(),
});

export type OAuthConfig = {
  authUrl: string;
  accessUrl: string;
  scopes: string[];
};

export const OAuthConfigSchema = z.object({
  authUrl: z.string(),
  accessUrl: z.string(),
  scopes: z.array(z.string()),
});

export type IntegrationSchema = {
  method: IntegrationMethod;
  schema: InstillJSONSchema;
};

export const IntegrationSchemaSchema = z.object({
  method: z.string(),
  schema: z.any(),
});

export type Integration = {
  uid: string;
  id: string;
  title: string;
  description: string;
  vendor: string;
  icon: string;
  helpLink: HelpLink;
  setupSchema: InstillJSONSchema;
  oAuthConfig: Nullable<OAuthConfig>;
  view: ResourceView;
  schemas: IntegrationSchema[];
};

export const IntegrationSchema = z.object({
  uid: z.string(),
  id: z.string(),
  title: z.string(),
  description: z.string(),
  vendor: z.string(),
  icon: z.string(),
  helpLink: HelpLinkSchema,
  setupSchema: z.any(),
  oAuthConfig: OAuthConfigSchema.nullable(),
  view: ResourceViewSchema,
  schemas: z.array(IntegrationSchemaSchema),
});

export type IntegrationConnection = {
  uid: string;
  id: string;
  namespaceId: string;
  integrationId: string;
  integrationTitle: string;
  pipelineIds: string[];
  method: IntegrationMethod;
  setup: Record<string, unknown>;
  view: ResourceView;
  createTime: string;
  updateTime: string;
  oAuthAccessDetails?: Record<string, unknown>;
  identity?: string;
};

export type ListPaginatedIntegrationsRequest = {
  pageToken?: string;
  pageSize?: number;
  filter?: string;
};

export type ListPaginatedIntegrationsResponse = {
  integrations: Integration[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export const listPaginatedIntegrationsResponseValidator = z.object({
  integrations: z.array(IntegrationSchema),
  nextPageToken: z.string().nullable(),
  totalSize: z.number(),
});

export type ListIntegrationsRequest = {
  pageToken?: string;
  pageSize?: number;
  filter?: string;
};

export type ListIntegrationsResponse = {
  integrations: Integration[];
};

export type GetIntegrationRequest = {
  view?: ResourceView;
  integrationId: string;
};

export type GetIntegrationResponse = {
  integration: Integration;
};

export type GetNamespaceConnectionRequest = {
  view?: ResourceView;
  namespaceId: string;
  connectionId: string;
};

export type GetNamespaceConnectionResponse = {
  connection: IntegrationConnection;
};

export type CreateNamespaceConnectionRequest = {
  namespaceId: string;
  id: string;
  integrationId: string;
  setup: Record<string, unknown>;
  method: IntegrationMethod;
  oAuthAccessDetails?: Record<string, unknown>;
  identity?: string;
  scopes?: string[];
};

export type CreateNamespaceConnectionResponse = {
  connection: IntegrationConnection;
};

export type ListPaginatedNamespaceConnectionsRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
  filter?: string;
};

export type ListPaginatedNamespaceConnectionsResponse = {
  connections: IntegrationConnection[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export type ListNamespaceConnectionsRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize?: number;
  filter?: string;
};

export type ListNamespaceConnectionsResponse = {
  connections: IntegrationConnection[];
};

export type UpdateNamespaceConnectionRequest = {
  namespaceId: string;
  connectionId: string;
  id?: string;
  setup: Record<string, unknown>;
};

export type UpdateNamespaceConnectionResponse = {
  connection: IntegrationConnection;
};

export type GetConnectionPipelinesRequest = {
  namespaceId: string;
  connectionId: string;
  pageToken?: string;
  pageSize: number;
  filter: Nullable<string>;
};

export type ListPaginatedNamespaceConnectionReferencedPipelinesRequest = {
  namespaceId: string;
  connectionId: string;
  pageToken?: string;
  pageSize?: number;
  filter?: string;
};

export type ListPaginatedNamespaceConnectionReferencedPipelinesResponse = {
  pipelineIds: string[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export type ListNamespaceConnectionReferencedPipelinesRequest = {
  namespaceId: string;
  connectionId: string;
  pageToken?: string;
  pageSize?: number;
  filter?: string;
};

export type ListNamespaceConnectionReferencedPipelinesResponse = {
  pipelineIds: string[];
};

export type GetConnectionPipelinesResponse = {
  pipelineIds: string[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export type DeleteNamespaceConnectionRequest = {
  namespaceId: string;
  connectionId: string;
};

export type TestNamespaceConnectionRequest = {
  namespaceId: string;
  connectionId: string;
};

export type TestNamespaceConnectionResponse = unknown;
