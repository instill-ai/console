import { Edge, Node } from "reactflow";
import { NewPipelineWithWatchState, NodeData } from "./type";

export type CreateInitialGraphDataProps = {
  pipeline: NewPipelineWithWatchState;
};

export function createInitialGraphData(props: CreateInitialGraphDataProps) {
  const { pipeline } = props;

  const nodes: Node<NodeData>[] = [];
  const edges: Edge[] = [];

  for (const component of pipeline.recipe.components) {
    if (component.id === "start") {
      try {
        nodes.push({
          id: component.id,
          type: "startNode",
          data: {
            nodeType: "start",
            component: {
              ...component,
              id: "start",
            },
          },
          position: { x: 0, y: 0 },
        });
      } catch (err) {
        console.error(
          "Something went wrong when parsing start component schema",
          err
        );
      }
      continue;
    }

    if (component.id === "end") {
      try {
        nodes.push({
          id: component.id,
          type: "endNode",
          data: {
            nodeType: "end",
            component: { ...component, id: "end" },
          },
          position: { x: 0, y: 0 },
        });
      } catch (err) {
        console.error(
          "Something went wrong when parsing end component schema",
          err
        );
      }
      continue;
    }

    try {
      if (component.type === "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN") {
        nodes.push({
          id: component.id,
          type: "blockchainNode",
          data: {
            nodeType: "connector",
            component,
          },
          position: { x: 0, y: 0 },
        });
        continue;
      }

      if (component.type === "COMPONENT_TYPE_CONNECTOR_AI") {
        nodes.push({
          id: component.id,
          type: "aiNode",
          data: {
            nodeType: "connector",
            component,
          },
          position: { x: 0, y: 0 },
        });
        continue;
      }
    } catch (err) {
      console.error(
        "Something went wrong when parsing connector component schema",
        err
      );
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
