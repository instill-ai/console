import { ConnectorNodeData, ConnectorWithWatchState } from "@/types";
import { Nullable, Pipeline } from "@instill-ai/toolkit";
import { Edge, Node } from "reactflow";

export type CreateInitialGraphDataProps = {
  pipeline: Pipeline;
  ais: ConnectorWithWatchState[];
  sources: ConnectorWithWatchState[];
  destinations: ConnectorWithWatchState[];
};

export function createInitialGraphData(props: CreateInitialGraphDataProps) {
  const { pipeline, ais, sources, destinations } = props;

  let sourceId: Nullable<string> = null;
  let destinationId: Nullable<string> = null;
  let modelId: Nullable<string> = null;

  const nodes: Node<ConnectorNodeData>[] = [];

  for (const component of pipeline.recipe.components) {
    if (component.resource_name.includes("source")) {
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
    } else if (component.resource_name.includes("destination")) {
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
    } else {
      const target = ais.find((ai) => ai.name === component.resource_name);

      if (target) {
        nodes.push({
          id: component.id,
          type: "modelNode",
          data: {
            connectorType: "CONNECTOR_TYPE_AI",
            connector: target,
          },
          position: { x: 0, y: 0 },
        });
        modelId = component.id;
      }
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

  if (modelId && destinationId) {
    edges.push({
      id: "model-to-destination",
      type: "customEdge",
      source: modelId,
      target: destinationId,
      animated: true,
    });
  }

  return {
    nodes,
    edges,
  };
}
