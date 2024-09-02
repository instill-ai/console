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
