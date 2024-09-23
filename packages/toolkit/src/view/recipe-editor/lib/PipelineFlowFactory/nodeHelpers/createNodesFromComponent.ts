import { GeneralRecord, Nullable, PipelineComponentMap } from "instill-sdk";
import { Node } from "reactflow";

import { recursiveHelpers } from "../../../../pipeline-builder";
import { NodeData, PipelineComponentMetadata } from "../../../flow/types";
import { checkComponentTypeHelper } from "../../checkComponentTypeHelper";
import { checkIsValidComponentMetadata } from "../../checkIsValidComponentMetadata";

/**
 * Create nodes from pipeline component map
 */
export function createNodesFromComponent(
  component: PipelineComponentMap,
  metadata?: GeneralRecord,
) {
  const nodes: Node<NodeData>[] = [];

  for (const [id, c] of Object.entries(component)) {
    let componentMetadata: Nullable<PipelineComponentMetadata> = null;

    if (checkIsValidComponentMetadata(metadata)) {
      componentMetadata = metadata.component[id] ?? null;
    }

    // The reason we need to transform all the value back to string is due to some
    // constraint of the auto-form, most of the auto-form field value is string
    // for example, number field. (But boolean field is using boolean)

    if (checkComponentTypeHelper.isPipelineIteratorComponent(c)) {
      nodes.push({
        id,
        type: "iteratorNode",
        data: {
          ...c,
          metadata: c.metadata,
          component: c.component ? c.component : {},
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

    if (checkComponentTypeHelper.isPipelineGeneralComponent(c)) {
      nodes.push({
        id,
        type: "generalNode",
        data: {
          ...c,
          setup: c.setup
            ? recursiveHelpers.parseNumberToString(structuredClone(c.setup))
            : null,
          input: recursiveHelpers.parseNumberToString(structuredClone(c.input)),
          metadata: c.metadata,
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
