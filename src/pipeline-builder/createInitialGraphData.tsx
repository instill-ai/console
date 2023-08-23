import { Edge, Node } from "reactflow";
import {
  NewPipelineWithWatchState,
  NodeData,
  PipelineConnectorComponentSchema,
  PipelineEndComponentSchema,
  PipelineStartComponentSchema,
} from "./type";

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
        const startComponent = PipelineStartComponentSchema.parse(component);
        nodes.push({
          id: component.id,
          type: "startNode",
          data: {
            nodeType: "start",
            component: startComponent,
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
        const endComponent = PipelineEndComponentSchema.parse(component);
        nodes.push({
          id: component.id,
          type: "endNode",
          data: {
            nodeType: "end",
            component: endComponent,
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
      const connectorComponent =
        PipelineConnectorComponentSchema.parse(component);

      if (connectorComponent.type === "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN") {
        nodes.push({
          id: connectorComponent.id,
          type: "blockchainNode",
          data: {
            nodeType: "connector",
            component: connectorComponent,
          },
          position: { x: 0, y: 0 },
        });
        continue;
      }

      if (connectorComponent.type === "COMPONENT_TYPE_CONNECTOR_AI") {
        nodes.push({
          id: connectorComponent.id,
          type: "aiNode",
          data: {
            nodeType: "connector",
            component: connectorComponent,
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
