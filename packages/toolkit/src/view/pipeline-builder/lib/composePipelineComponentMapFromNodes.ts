import { Node } from "reactflow";
import { NodeData } from "../type";
import { PipelineComponentMap } from "../../../lib";
import { isGeneralNode, isIteratorNode } from "./checkNodeType";
import { isPipelineGeneralComponent } from "./checkComponentType";
import { recursiveHelpers } from "./recursive-helpers";

export function composePipelineComponentMapFromNodes(nodes: Node<NodeData>[]) {
  const componentMap: PipelineComponentMap = {};

  for (const node of nodes) {
    if (isIteratorNode(node)) {
      componentMap[node.id] = {
        ...node.data,
        component: Object.fromEntries(
          Object.entries(node.data.component).map(([key, e]) => {
            if (isPipelineGeneralComponent(e)) {
              return [
                key,
                {
                  ...e,
                  definition: undefined,
                  input:
                    recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                      recursiveHelpers.parseToNum(structuredClone(e.input))
                    ),
                  setup: e.setup
                    ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
                        recursiveHelpers.parseToNum(structuredClone(e.setup))
                      )
                    : undefined,
                },
              ];
            }

            return [key, e];
          })
        ),
      };

      continue;
    }

    if (isGeneralNode(node)) {
      componentMap[node.id] = {
        ...node.data,
        input: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
          recursiveHelpers.parseToNum(structuredClone(node.data.input))
        ),
        setup: node.data.setup
          ? recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
              recursiveHelpers.parseToNum(structuredClone(node.data.setup))
            )
          : undefined,
        definition: undefined,
        metadata: node.data.metadata ?? undefined,
      };

      continue;
    }
  }

  return componentMap;
}
