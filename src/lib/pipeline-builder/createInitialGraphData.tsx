import { ConnectorNodeData, ConnectorWithWatchState } from "@/types";
import { Pipeline } from "@instill-ai/toolkit";
import { Edge, Node } from "reactflow";
import { parseDependencyComponents } from "./parseDependencyComponents";

export type CreateInitialGraphDataProps = {
  pipeline: Pipeline;
  ais: ConnectorWithWatchState[];
  sources: ConnectorWithWatchState[];
  destinations: ConnectorWithWatchState[];
  blockchains: ConnectorWithWatchState[];
};

export function createInitialGraphData(props: CreateInitialGraphDataProps) {
  const { pipeline, ais, sources, destinations, blockchains } = props;

  const nodes: Node<ConnectorNodeData>[] = [];
  const edges: Edge[] = [];

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
        }

        // There are 4 type of dependencies: images, texts, structured_data, metadata
        // Because we are only support single handler right now, we only need to have read
        // metadata dependency
        const dependentComponents = parseDependencyComponents(
          component.dependencies.metadata
        );

        for (const dependentComponent of dependentComponents) {
          edges.push({
            id: `${dependentComponent}-${component.id}`,
            type: "customEdge",
            source: dependentComponent,
            target: component.id,
            animated: true,
          });
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
        }

        // There are 4 type of dependencies: images, texts, structured_data, metadata
        // Because we are only support single handler right now, we only need to have read
        // metadata dependency
        const dependentComponents = parseDependencyComponents(
          component.dependencies.metadata
        );

        for (const dependentComponent of dependentComponents) {
          edges.push({
            id: `${dependentComponent}-${component.id}`,
            type: "customEdge",
            source: dependentComponent,
            target: component.id,
            animated: true,
          });
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
        }

        // There are 4 type of dependencies: images, texts, structured_data, metadata
        // Because we are only support single handler right now, we only need to have read
        // metadata dependency
        const dependentComponents = parseDependencyComponents(
          component.dependencies.metadata
        );

        for (const dependentComponent of dependentComponents) {
          edges.push({
            id: `${dependentComponent}-${component.id}`,
            type: "customEdge",
            source: dependentComponent,
            target: component.id,
            animated: true,
          });
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
        }

        // There are 4 type of dependencies: images, texts, structured_data, metadata
        // Because we are only support single handler right now, we only need to have read
        // metadata dependency

        const dependentComponents = parseDependencyComponents(
          component.dependencies.metadata
        );

        for (const dependentComponent of dependentComponents) {
          edges.push({
            id: `${dependentComponent}-${component.id}`,
            type: "customEdge",
            source: dependentComponent,
            target: component.id,
            animated: true,
          });
        }
        break;
      }
      default:
        console.error(`Unknown component type: ${component.type}`);
    }
  }

  return {
    nodes,
    edges,
  };
}
