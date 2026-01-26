import { z } from "zod";

import { InstillJSONSchema, Nullable } from "../../types";
import { ResourceView, ResourceViewSchema } from "../../pipeline";

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

export type Integration = {
  // Integration ID, which references a component definition
  id: string;
  // Title, reflects the app name
  title: string;
  // Short description of the integrated app
  description: string;
  // Integrated app vendor name
  vendor: string;
  // Integration icon path
  icon: string;
  // Reference to the vendor's documentation
  helpLink?: HelpLink;
  // Connection setup field definitions (JSON Schema)
  setupSchema: InstillJSONSchema;
  // OAuth 2.0 configuration parameters (if supported)
  oAuthConfig: Nullable<OAuthConfig>;
  // View defines how the integration is presented
  view: ResourceView;
};

export const IntegrationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  vendor: z.string(),
  icon: z.string(),
  helpLink: HelpLinkSchema.optional(),
  setupSchema: z.any(),
  oAuthConfig: OAuthConfigSchema.nullable(),
  view: ResourceViewSchema,
});

export type IntegrationConnection = {
  // ===== Standard AIP fields =====
  // Canonical resource name. Format: `namespaces/{namespace}/connections/{connection}`
  name: string;
  // Immutable canonical resource ID (e.g., "con-8f3a2k9E7c1")
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
  updateTime: string;
  // ===== Resource-specific fields =====
  // ID of the namespace owning the connection
  namespaceId: string;
  // Integration ID (determines which components can use this connection)
  integrationId: string;
  // Integration title (for display purposes)
  integrationTitle: string;
  // Connection method (METHOD_DICTIONARY or METHOD_OAUTH)
  method: IntegrationMethod;
  // Connection details (setup values may be redacted in responses)
  setup: Record<string, unknown>;
  // View defines how the connection is presented
  view: ResourceView;
  // OAuth scopes (if applicable)
  scopes?: string[];
  // OAuth access details (vendor-specific metadata)
  oAuthAccessDetails?: Record<string, unknown>;
  // OAuth identity (email/username used for the access token)
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
