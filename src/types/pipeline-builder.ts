import {
  ConnectorState,
  ConnectorDefinition,
  ConnectorType,
  ConnectorWithDefinition,
} from "@instill-ai/toolkit";

export type IncompleteConnectorWithWatchState = {
  id: string;
  name: string;
  connector_definition: ConnectorDefinition;
  connector_definition_name: string;
  watchState: ConnectorState;
} & Pick<ConnectorWithDefinition, "configuration">;

export type ConnectorWithWatchState = {
  watchState: ConnectorState;
} & ConnectorWithDefinition;

export type ConnectorNodeData = {
  connectorType: ConnectorType;
  connector: ConnectorWithWatchState | IncompleteConnectorWithWatchState;
};
