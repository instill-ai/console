import { Node } from "reactflow";
import { NodeData } from "../type";
import { recursiveHelpers } from "./recursive-helpers";
import { PipelineComponent } from "../../../lib";
import {
  isConnectorComponent,
  isEndComponent,
  isIteratorComponent,
  isStartComponent,
} from "./checkComponentType";

export function constructPipelineRecipe(
  nodes: Node<NodeData>[],
  removeConnectorName?: boolean
) {
  const components: PipelineComponent[] = [];

  for (const node of nodes) {
    if (isStartComponent(node.data)) {
      components.push({
        id: "start",
        start_component: {
          fields: node.data.start_component.fields,
        },
      });
      continue;
    }

    if (isEndComponent(node.data)) {
      components.push({
        id: "end",
        end_component: {
          fields: node.data.end_component.fields,
        },
      });
      continue;
    }

    if (isIteratorComponent(node.data)) {
      continue;
    }

    if (isConnectorComponent(node.data)) {
      components.push({
        id: node.id,
        connector_component: {
          ...node.data.connector_component,
          connector_name: removeConnectorName
            ? ""
            : node.data.connector_component.connector_name,
          input: recursiveHelpers.parseToNum(
            structuredClone(node.data.connector_component.input)
          ),
        },
      });
      continue;
    }

    components.push({
      id: node.id,
      operator_component: {
        ...node.data.operator_component,
        input: recursiveHelpers.parseToNum(
          structuredClone(node.data.operator_component.input)
        ),
      },
    });
  }

  return {
    version: "v1beta",
    components: components,
  };
}
