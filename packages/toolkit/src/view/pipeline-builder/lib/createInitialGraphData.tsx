import { Node } from "reactflow";
import { NodeData, PipelineComponentReference } from "../type";

import {
  extractReferencesFromConfiguration,
  recursiveTransformToString,
} from ".";
import { composeEdgesFromReferences } from "./composeEdgesFromReferences";
import {
  PipelineConnectorComponent,
  PipelineEndComponent,
  PipelineRecipe,
  PipelineStartComponent,
} from "../../../lib";

export function createInitialGraphData(recipe: PipelineRecipe) {
  const nodes: Node<NodeData>[] = [];

  for (const component of recipe.components) {
    if (component.id === "start") {
      nodes.push({
        id: component.id,
        type: "startNode",
        data: {
          nodeType: "start",
          component: {
            ...component,
            id: "start",
            configuration: recursiveTransformToString(component.configuration),
            operator_definition: (component as PipelineStartComponent)
              .operator_definition,
            resource_name: null,
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
            configuration: recursiveTransformToString(component.configuration),
            operator_definition: (component as PipelineEndComponent)
              .operator_definition,
            resource_name: null,
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
            configuration: recursiveTransformToString(component.configuration),
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
            configuration: recursiveTransformToString(component.configuration),
            connector_definition: (component as PipelineConnectorComponent)
              .connector_definition,
          },
        },
        position: { x: 0, y: 0 },
      });
      continue;
    }

    if (component.type === "COMPONENT_TYPE_CONNECTOR_DATA") {
      nodes.push({
        id: component.id,
        type: "connectorNode",
        data: {
          nodeType: "connector",
          component: {
            ...component,
            configuration: recursiveTransformToString(component.configuration),
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
