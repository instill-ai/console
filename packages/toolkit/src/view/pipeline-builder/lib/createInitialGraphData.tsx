import { Node } from "reactflow";

import { NodeData, PipelineComponentMetadata } from "../type";
import { composeEdgesFromNodes, recursiveHelpers } from ".";
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

    // Because we will recursively transform the configuration's value to string
    // So we need to deep clone the configuration to avoid mutating the original
    // Especially the original configuration connect back to the react-query object
    // It will pollute other components
    const _deepClonedConfiguration = structuredClone(component.configuration);

    // The reason we need to transform all the value back to string is due to some
    // constraint of the auto-form, most of the auto-form field value is string
    // for example, number field. (But boolean field is using boolean)

    if (component.id === "start") {
      nodes.push({
        id: component.id,
        type: "startNode",
        data: {
          nodeType: "start",
          component: {
            ...component,
            id: "start",
            configuration: recursiveHelpers.parseNumberToString(
              _deepClonedConfiguration
            ),
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
            configuration: recursiveHelpers.parseNumberToString(
              _deepClonedConfiguration
            ),
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
            configuration: recursiveHelpers.parseNumberToString(
              _deepClonedConfiguration
            ),
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

    if (component.type === "COMPONENT_TYPE_CONNECTOR_APPLICATION") {
      nodes.push({
        id: component.id,
        type: "connectorNode",
        data: {
          nodeType: "connector",
          component: {
            ...component,
            configuration: recursiveHelpers.parseNumberToString(
              _deepClonedConfiguration
            ),
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
            configuration: recursiveHelpers.parseNumberToString(
              _deepClonedConfiguration
            ),
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
            configuration: recursiveHelpers.parseNumberToString(
              _deepClonedConfiguration
            ),
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
  const edges = composeEdgesFromNodes(nodes);

  return {
    nodes,
    edges,
  };
}
