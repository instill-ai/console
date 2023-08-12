import {
  ConnectorWithWatchState,
  PipelineWithWatchState,
} from "@instill-ai/toolkit";
import { Edge, Node } from "reactflow";
import { NodeData } from "./type";

export type CreateInitialGraphDataProps = {
  pipeline: PipelineWithWatchState;
  ais: ConnectorWithWatchState[];
  blockchains: ConnectorWithWatchState[];
};

export function createInitialGraphData(props: CreateInitialGraphDataProps) {
  const { pipeline, ais, blockchains } = props;

  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  for (const component of pipeline.recipe.components) {
    if (component.id === "start") {
      nodes.push({
        id: component.id,
        type: "startNode",
        data: {
          nodeType: "start",
        },
        position: { x: 0, y: 0 },
      });
      continue;
    }

    if (component.id === "end") {
      nodes.push({
        id: component.id,
        type: "endNode",
        data: {
          nodeType: "end",
        },
        position: { x: 0, y: 0 },
      });
      continue;
    }

    switch (component.resource_detail.connector_type) {
      case "CONNECTOR_TYPE_BLOCKCHAIN": {
        const target = blockchains.find(
          (blockchain) => blockchain.name === component.resource_name
        );

        if (target) {
          nodes.push({
            id: component.id,
            type: "blockchainNode",
            data: {
              nodeType: "connector",
              connector: target,
            },
            position: { x: 0, y: 0 },
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
              nodeType: "connector",
              connector: target,
            },
            position: { x: 0, y: 0 },
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

function composeEdges() {
  const edges: Edge[] = [];
}
