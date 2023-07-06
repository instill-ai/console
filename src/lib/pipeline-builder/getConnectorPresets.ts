import { ConnectorPreset, IncompleteConnectorWithWatchState } from "@/types";
import { ConnectorDefinition, ConnectorType } from "@instill-ai/toolkit";

export const blockchains: ConnectorPreset[] = [
  {
    id: "Numbers",
    name: "connectors/numbers",
    connector_definition_name: "connector-definitions/blockchain-numbers",
    configuration: {
      asset_type: "images",
    },
  },
];

export const ais: ConnectorPreset[] = [
  {
    id: "Instill Model",
    name: "connectors/instill-model",
    connector_definition_name: "connector-definitions/ai-instill-model",
    configuration: {},
  },
  {
    id: "Stability AI",
    name: "connectors/stability-ai",
    connector_definition_name: "connector-definitions/ai-stability-ai",
    configuration: {},
  },
];

const sources: ConnectorPreset[] = [
  {
    id: "source-http",
    name: "connectors/source-http",
    connector_definition_name: "connector-definitions/source-http",
    configuration: {},
  },
  {
    id: "source-grpc",
    name: "connectors/source-grpc",
    connector_definition_name: "connector-definitions/source-grpc",
    configuration: {},
  },
];

const destinations: ConnectorPreset[] = [
  {
    id: "destination-http",
    name: "connectors/destination-http",
    connector_definition_name: "connector-definitions/destination-http",
    configuration: {},
  },
  {
    id: "destination-grpc",
    name: "connectors/destination-grpc",
    connector_definition_name: "connector-definitions/destination-grpc",
    configuration: {},
  },
  {
    id: "PostgresSQL",
    name: "connectors/airbyte-destination-postgres",
    connector_definition_name:
      "connector-definitions/airbyte-destination-postgres",
    configuration: {},
  },
];

export function getAllConnectorPresets(definitions: ConnectorDefinition[]) {
  const constructedPresets: IncompleteConnectorWithWatchState[] = [];

  [...blockchains, ...ais, ...sources, ...destinations].forEach((preset) => {
    const definition = definitions.find(
      (definition) => definition.name === preset.connector_definition_name
    );

    if (definition) {
      constructedPresets.push({
        ...preset,
        connector_definition: definition,
        watchState: "STATE_UNSPECIFIED",
        connector_type: definition.connector_type,
      });
    }
  });

  return constructedPresets;
}

export function getConnectorPresets(
  type: ConnectorType,
  definitions: ConnectorDefinition[]
) {
  switch (type) {
    case "CONNECTOR_TYPE_SOURCE": {
      const constructedPresets: IncompleteConnectorWithWatchState[] = [];

      sources.forEach((preset) => {
        const definition = definitions.find(
          (definition) => definition.name === preset.connector_definition_name
        );

        if (definition) {
          constructedPresets.push({
            ...preset,
            connector_definition: definition,
            watchState: "STATE_UNSPECIFIED",
            connector_type: definition.connector_type,
          });
        }
      });

      return constructedPresets;
    }
    case "CONNECTOR_TYPE_DESTINATION": {
      const constructedPresets: IncompleteConnectorWithWatchState[] = [];

      destinations.forEach((preset) => {
        const definition = definitions.find(
          (definition) => definition.name === preset.connector_definition_name
        );

        if (definition) {
          constructedPresets.push({
            ...preset,
            connector_definition: definition,
            watchState: "STATE_UNSPECIFIED",
            connector_type: definition.connector_type,
          });
        }
      });

      return constructedPresets;
    }

    case "CONNECTOR_TYPE_AI": {
      const constructedPresets: IncompleteConnectorWithWatchState[] = [];

      ais.forEach((preset) => {
        const definition = definitions.find(
          (definition) => definition.name === preset.connector_definition_name
        );

        if (definition) {
          constructedPresets.push({
            ...preset,
            connector_definition: definition,
            watchState: "STATE_UNSPECIFIED",
            connector_type: definition.connector_type,
          });
        }
      });

      return constructedPresets;
    }

    case "CONNECTOR_TYPE_BLOCKCHAIN": {
      const constructedPresets: IncompleteConnectorWithWatchState[] = [];

      blockchains.forEach((preset) => {
        const definition = definitions.find(
          (definition) => definition.name === preset.connector_definition_name
        );

        if (definition) {
          constructedPresets.push({
            ...preset,
            connector_definition: definition,
            watchState: "STATE_UNSPECIFIED",
            connector_type: definition.connector_type,
          });
        }
      });

      return constructedPresets;
    }

    default:
      throw new Error("Invalid connector type");
  }
}
