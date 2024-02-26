/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Owner, Spec } from "../types";

export type ConnectorState =
  | "STATE_CONNECTED"
  | "STATE_DISCONNECTED"
  | "STATE_ERROR"
  | "STATE_UNSPECIFIED";

export type ConnectorVisibility =
  | "VISIBILITY_UNSPECIFIED"
  | "VISIBILITY_PRIVATE"
  | "VISIBILITY_PUBLIC";

export type ConnectorType =
  | "CONNECTOR_TYPE_UNSPECIFIED"
  | "CONNECTOR_TYPE_OPERATOR"
  | "CONNECTOR_TYPE_DATA"
  | "CONNECTOR_TYPE_AI"
  | "CONNECTOR_TYPE_APPLICATION";

export type Connector = {
  name: string;
  uid: string;
  id: string;
  connector_definition: null;
  connector_definition_name: string;
  type: ConnectorType;
  task: string;
  description: string;
  configuration: Record<string, any> | Record<string, never>;
  state: ConnectorState;
  tombstone: boolean;
  user: string;
  create_time: string;
  update_time: string;
  visibility: ConnectorVisibility;
  owner: Owner;
};

export type ConnectorWithDefinition = Omit<
  Connector,
  "connector_definition"
> & {
  connector_definition: ConnectorDefinition;
};

export type ConnectorDefinition = {
  name: string;
  uid: string;
  id: string;
  title: string;
  documentation_url: string;
  icon: string;
  icon_url: string;
  type: ConnectorType;
  spec: Spec;
  tombstone: boolean;
  public: boolean;
  custom: boolean;
  vendor: string;
  vendor_attributes: Record<string, any>;
};

export type ConnectorWatchState = {
  state: ConnectorState;
};

export type ConnectorsWatchState = Record<string, ConnectorWatchState>;

export type ConnectorWithWatchState = {
  watchState: ConnectorState;
} & ConnectorWithDefinition;
