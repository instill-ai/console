import { Node } from "reactflow";
import { NodeData } from "../type";
import {
  Pipeline,
  PipelineConnectorComponent,
  PipelineOperatorComponent,
} from "@instill-ai/toolkit";
import {
  PipelineComponentReference,
  extractReferencesFromConfiguration,
  recursivelyTransformToString,
} from ".";
import { composeEdgesFromReferences } from "./composeEdgesFromReferences";

export type CreateInitialGraphDataProps = {
  pipeline: Pipeline;
};

export function createInitialGraphData(props: CreateInitialGraphDataProps) {
  const { pipeline } = props;

  const nodes: Node<NodeData>[] = [];

  for (const component of pipeline.recipe.components) {
    if (component.id === "start") {
      nodes.push({
        id: component.id,
        type: "startNode",
        data: {
          nodeType: "start",
          component: {
            ...component,
            id: "start",
            configuration: recursivelyTransformToString(
              component.configuration
            ),
            operator_definition: (component as PipelineOperatorComponent)
              .operator_definition,
          },
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
          component: {
            ...component,
            id: "end",
            configuration: recursivelyTransformToString(
              component.configuration
            ),
            operator_definition: (component as PipelineOperatorComponent)
              .operator_definition,
          },
        },
        position: { x: 0, y: 0 },
      });
      continue;
    }

    if (component.type === "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN") {
      nodes.push({
        id: component.id,
        type: "connectorNode",
        data: {
          nodeType: "connector",
          component: {
            ...component,
            configuration: recursivelyTransformToString(
              component.configuration
            ),
            connector_definition: (component as PipelineConnectorComponent)
              .connector_definition,
          },
        },
        position: { x: 0, y: 0 },
      });
      continue;
    }

    if (component.type === "COMPONENT_TYPE_CONNECTOR_AI") {
      nodes.push({
        id: component.id,
        type: "connectorNode",
        data: {
          nodeType: "connector",
          component: {
            ...component,
            configuration: recursivelyTransformToString(
              component.configuration
            ),
            connector_definition: (component as PipelineConnectorComponent)
              .connector_definition,
          },
        },
        position: { x: 0, y: 0 },
      });
      continue;
    }
  }

  const allReferences: PipelineComponentReference[] = [];

  nodes.forEach((node) => {
    if (node.data.component?.configuration) {
      allReferences.push(
        ...extractReferencesFromConfiguration(
          node.data.component?.configuration,
          node.id
        )
      );
    }
  });

  const edges = composeEdgesFromReferences(allReferences, nodes);

  return {
    nodes,
    edges,
  };
}
