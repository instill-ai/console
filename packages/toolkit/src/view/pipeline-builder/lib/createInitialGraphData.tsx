import { Node } from "reactflow";

import { NodeData, PipelineComponentMetadata } from "../type";
import { composeEdgesFromComponents, recursiveHelpers } from ".";
import { GeneralRecord, Nullable, PipelineComponent } from "../../../lib";
import {
  isConnectorComponent,
  isEndComponent,
  isIteratorComponent,
  isOperatorComponent,
  isStartComponent,
} from "./checkComponentType";

export type CreateInitialGraphDataOptions = {
  metadata?: GeneralRecord;
};

export function createInitialGraphData(
  components: PipelineComponent[],
  options?: CreateInitialGraphDataOptions
) {
  const nodes: Node<NodeData>[] = [];

  const metadata = options ? options.metadata : null;

  for (const component of components) {
    let componentMetadata: Nullable<PipelineComponentMetadata> = null;

    if (
      metadata &&
      "components" in metadata &&
      Array.isArray(metadata.components)
    ) {
      componentMetadata =
        metadata.components.find((c) => c.id === component.id) ?? null;
    }

    // The reason we need to transform all the value back to string is due to some
    // constraint of the auto-form, most of the auto-form field value is string
    // for example, number field. (But boolean field is using boolean)

    if (isStartComponent(component)) {
      nodes.push({
        id: component.id,
        type: "startNode",
        data: {
          id: "start",
          start_component: {
            fields: recursiveHelpers.parseNumberToString(
              component.start_component.fields
            ),
          },
          note: componentMetadata ? componentMetadata.note : null,
          metadata: component.metadata,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
      });
      continue;
    }

    if (isEndComponent(component)) {
      nodes.push({
        id: component.id,
        type: "endNode",
        data: {
          id: "end",
          end_component: {
            fields: recursiveHelpers.parseNumberToString(
              component.end_component.fields
            ),
          },
          metadata: component.metadata,
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
      });
      continue;
    }

    if (isIteratorComponent(component)) {
      nodes.push({
        id: component.id,
        type: "iteratorNode",
        data: {
          id: component.id,
          iterator_component: component.iterator_component,
          note: componentMetadata ? componentMetadata.note : null,
          metadata: component.metadata,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
      });
      continue;
    }

    // Because we will recursively transform the configuration's value to string
    // So we need to deep clone the configuration to avoid mutating the original
    // Especially the original configuration connect back to the react-query object
    // It will pollute other components

    if (isOperatorComponent(component)) {
      nodes.push({
        id: component.id,
        type: "operatorNode",
        data: {
          id: component.id,
          operator_component: {
            ...component.operator_component,
            input: recursiveHelpers.parseNumberToString(
              component.operator_component.input
            ),
          },
          metadata: component.metadata,
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
      });
      continue;
    }

    if (isConnectorComponent(component)) {
      nodes.push({
        id: component.id,
        type: "connectorNode",
        data: {
          id: component.id,
          connector_component: {
            ...component.connector_component,
            input: recursiveHelpers.parseNumberToString(
              component.connector_component.input
            ),
          },
          metadata: component.metadata,
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
      });
      continue;
    }
  }

  const edges = composeEdgesFromComponents(nodes.map((node) => node.data));

  return {
    nodes,
    edges,
  };
}
