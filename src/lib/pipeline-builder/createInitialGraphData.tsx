import { ConnectorNodeData, ConnectorWithWatchState } from "@/types";
import { Nullable, Pipeline } from "@instill-ai/toolkit";
import { Edge, Node } from "reactflow";

export type CreateInitialGraphDataProps = {
  pipeline: Pipeline;
  ais: ConnectorWithWatchState[];
  sources: ConnectorWithWatchState[];
  destinations: ConnectorWithWatchState[];
  blockchains: ConnectorWithWatchState[];
};

export function createInitialGraphData(props: CreateInitialGraphDataProps) {
  const { pipeline, ais, sources, destinations, blockchains } = props;

  let sourceId: Nullable<string> = null;
  let destinationId: Nullable<string> = null;
  let modelId: Nullable<string> = null;
  let blockchainId: Nullable<string> = null;

  const nodes: Node<ConnectorNodeData>[] = [];

  for (const component of pipeline.recipe.components) {
    switch (component.type) {
      case "CONNECTOR_TYPE_SOURCE": {
        const target = sources.find(
          (source) => source.name === component.resource_name
        );

        if (target) {
          nodes.push({
            id: component.id,
            type: "sourceNode",
            data: {
              connectorType: "CONNECTOR_TYPE_SOURCE",
              connector: target,
            },
            position: { x: 0, y: 0 },
          });
          sourceId = component.id;
        }
        break;
      }
      case "CONNECTOR_TYPE_DESTINATION": {
        const target = destinations.find(
          (destination) => destination.name === component.resource_name
        );
        if (target) {
          nodes.push({
            id: component.id,
            type: "destinationNode",
            data: {
              connectorType: "CONNECTOR_TYPE_DESTINATION",
              connector: target,
            },
            position: { x: 0, y: 0 },
          });
          destinationId = component.id;
        }
        break;
      }
      case "CONNECTOR_TYPE_BLOCKCHAIN": {
        const target = blockchains.find(
          (blockchain) => blockchain.name === component.resource_name
        );

        if (target) {
          nodes.push({
            id: component.id,
            type: "blockchainNode",
            data: {
              connectorType: "CONNECTOR_TYPE_BLOCKCHAIN",
              connector: target,
            },
            position: { x: 0, y: 0 },
          });
          blockchainId = component.id;
        }
        break;
      }
      case "CONNECTOR_TYPE_AI": {
        const target = ais.find((ai) => ai.name === component.resource_name);

        if (target) {
          nodes.push({
            id: component.id,
            type: "aiNode",
            data: {
              connectorType: "CONNECTOR_TYPE_AI",
              connector: target,
            },
            position: { x: 0, y: 0 },
          });
          modelId = component.id;
        }
        break;
      }
      default:
        console.error(`Unknown component type: ${component.type}`);
    }
  }

  const edges: Edge[] = [];

  if (sourceId && modelId) {
    edges.push({
      id: "source-to-model",
      type: "customEdge",
      source: sourceId,
      target: modelId,
      animated: true,
    });
  }

  if (modelId && blockchainId) {
    edges.push({
      id: "model-to-blockchain",
      type: "customEdge",
      source: modelId,
      target: blockchainId,
      animated: true,
    });
  }

  if (blockchainId && destinationId) {
    edges.push({
      id: "blockchain-to-destination",
      type: "customEdge",
      source: blockchainId,
      target: destinationId,
      animated: true,
    });
  }

  return {
    nodes,
    edges,
  };
}
