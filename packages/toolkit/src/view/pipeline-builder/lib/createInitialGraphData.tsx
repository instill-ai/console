import { Node } from "reactflow";

import {
  NodeData,
  PipelineComponentMetadata,
  PipelineComponentReference,
} from "../type";
import {
  extractReferencesFromConfiguration,
  recursiveTransformToString,
} from ".";
import { composeEdgesFromReferences } from "./composeEdgesFromReferences";
import {
  GeneralRecord,
  Nullable,
  PipelineConnectorComponent,
  PipelineEndComponent,
  PipelineOperatorComponent,
  PipelineRecipe,
  PipelineStartComponent,
} from "../../../lib";

export type CreateInitialGraphDataOptions = {
  metadata?: GeneralRecord;
};

export function createInitialGraphData(
  recipe: PipelineRecipe,
  options?: CreateInitialGraphDataOptions
) {
  const nodes: Node<NodeData>[] = [];

  const metadata = options ? options.metadata : null;

  for (const component of recipe.components) {
    let componentMetadata: Nullable<PipelineComponentMetadata> = null;

    if (
      metadata &&
      "components" in metadata &&
      Array.isArray(metadata.components)
    ) {
      componentMetadata =
        metadata.components.find((c) => c.id === component.id) ?? null;
    }

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
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
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
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
      });
      continue;
    }

    if (component.type === "COMPONENT_TYPE_OPERATOR") {
      nodes.push({
        id: component.id,
        type: "operatorNode",
        data: {
          nodeType: "operator",
          component: {
            ...component,
            configuration: recursiveTransformToString(component.configuration),
            operator_definition: (component as PipelineOperatorComponent)
              .operator_definition,
            resource_name: null,
          },
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
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
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
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
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
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
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
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
