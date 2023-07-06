import {
  ConnectorState,
  ConnectorDefinition,
  ConnectorType,
  ConnectorWithDefinition,
  Connector,
} from "@instill-ai/toolkit";

export type IncompleteConnectorWithWatchState = {
  id: string;
  name: string;
  connector_definition: ConnectorDefinition;
  connector_definition_name: string;
  watchState: ConnectorState;
} & Pick<ConnectorWithDefinition, "configuration" | "connector_type">;

export type ConnectorWithWatchState = {
  watchState: ConnectorState;
} & ConnectorWithDefinition;

export type ConnectorNodeData = {
  connectorType: ConnectorType;
  connector: ConnectorWithWatchState | IncompleteConnectorWithWatchState;
};

export type ConnectorPreset = {
  connector_definition_name: string;
  id: string;
  name: string;
} & Pick<Connector, "configuration">;
