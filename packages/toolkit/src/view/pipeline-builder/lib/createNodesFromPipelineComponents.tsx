import { Node } from "reactflow";

import { NodeData, PipelineComponentMetadata } from "../type";
import { recursiveHelpers } from ".";
import { GeneralRecord, Nullable, PipelineComponentMap } from "../../../lib";
import {
  isPipelineGeneralComponent,
  isPipelineIteratorComponent,
} from "./checkComponentType";
import { checkIsValidComponentMetadata } from "./checkIsValidComponentMetadata";

export type CreateNodesFromPipelineComponentsOptions = {
  metadata?: GeneralRecord;
};

export function createNodesFromPipelineComponents(
  component: PipelineComponentMap,
  options?: CreateNodesFromPipelineComponentsOptions
) {
  const nodes: Node<NodeData>[] = [];

  const metadata = options ? options.metadata : null;

  for (const [id, e] of Object.entries(component)) {
    let componentMetadata: Nullable<PipelineComponentMetadata> = null;

    if (checkIsValidComponentMetadata(metadata)) {
      componentMetadata = metadata.component[id];
    }

    // The reason we need to transform all the value back to string is due to some
    // constraint of the auto-form, most of the auto-form field value is string
    // for example, number field. (But boolean field is using boolean)

    if (isPipelineIteratorComponent(e)) {
      nodes.push({
        id,
        type: "iteratorNode",
        data: {
          ...e,
          note: componentMetadata ? componentMetadata.note : null,
          metadata: e.metadata,
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

    if (isPipelineGeneralComponent(e)) {
      nodes.push({
        id,
        type: "operatorNode",
        data: {
          ...e,
          connection: e.connection
            ? recursiveHelpers.parseNumberToString(e.input)
            : null,
          input: recursiveHelpers.parseNumberToString(e.input),
          metadata: e.metadata,
          note: componentMetadata ? componentMetadata.note : null,
        },
        position: componentMetadata
          ? { x: componentMetadata.x, y: componentMetadata.y }
          : { x: 0, y: 0 },
      });
      continue;
    }
  }

  return nodes;
}
