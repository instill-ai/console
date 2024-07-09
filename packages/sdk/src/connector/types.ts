import { GeneralRecord, Spec } from "../types";

export type ConnectorType =
  | "CONNECTOR_TYPE_UNSPECIFIED"
  | "CONNECTOR_TYPE_OPERATOR"
  | "CONNECTOR_TYPE_DATA"
  | "CONNECTOR_TYPE_AI"
  | "CONNECTOR_TYPE_APPLICATION";

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

export type ListConnectorDefinitionsResponse = {
  connectorDefinitions: ConnectorDefinition[];
  nextPageToken: string;
  totalSize: number;
};

export type GetConnectorDefinitionResponse = {
  connectorDefinition: ConnectorDefinition;
};
