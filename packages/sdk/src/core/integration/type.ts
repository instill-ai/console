import { InstillJSONSchema, Nullable } from "../../types";
import { ResourceView } from "../../vdp";

export type IntegrationMethod = "METHOD_DICTIONARY" | "METHOD_OAUTH";

export type Integration = {
  id: string;
  title: string;
  description: string;
  vendor: string;
  icon: string;
  featured: boolean;
  schemas: {
    method: IntegrationMethod;
    schema: InstillJSONSchema;
  }[];
  view: ResourceView;
};

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
};

export type GetIntegrationsRequest = {
  pageToken?: string;
  pageSize: number;
  filter: Nullable<string>;
};

export type GetIntegrationsResponse = {
  integrations: Integration[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export type GetIntegrationRequest = {
  view?: ResourceView;
  integrationId: string;
};

export type GetIntegrationResponse = {
  integration: Integration;
};

export type GetIntegrationConnectionRequest = {
  view?: ResourceView;
  namespaceId: string;
  connectionId: string;
};

export type GetIntegrationConnectionResponse = {
  connection: IntegrationConnection;
};

export type AddIntegrationRequest = {
  namespaceId: string;
  id: string;
  integrationId: string;
  setup: Record<string, unknown>;
  method: IntegrationMethod;
  oAuthAccessDetails?: Record<string, unknown>;
};

export type AddIntegrationResponse = {
  connection: IntegrationConnection;
};

export type GetIntegrationConnectionsRequest = {
  namespaceId: string;
  pageToken?: string;
  pageSize: number;
  filter: Nullable<string>;
};

export type GetIntegrationConnectionsResponse = {
  connections: IntegrationConnection[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export type UpdateIntegrationConnectionRequest = {
  namespaceId: string;
  connectionId: string;
  payload: {
    setup: Record<string, unknown>;
  };
};

export type UpdateIntegrationConnectionResponse = {
  connection: IntegrationConnection;
};

export type GetConnectionPipelinesRequest = {
  namespaceId: string;
  connectionId: string;
  pageToken?: string;
  pageSize: number;
  filter: Nullable<string>;
};

export type GetConnectionPipelinesResponse = {
  pipelineIds: string[];
  nextPageToken: Nullable<string>;
  totalSize: number;
};

export type DeleteIntegrationConnectionRequest = {
  namespaceId: string;
  connectionId: string;
};

export type TestIntegrationConnectionRequest = {
  namespaceId: string;
  connectionId: string;
};

export type TestIntegrationConnectionResponse = unknown;
