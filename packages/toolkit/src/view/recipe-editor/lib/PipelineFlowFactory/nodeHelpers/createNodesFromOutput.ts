import { GeneralRecord, Nullable, PipelineOutputFieldMap } from "instill-sdk";
import { Node } from "reactflow";

import { NodeData, PipelineComponentMetadata } from "../../../flow/types";
import { checkIsValidComponentMetadata } from "../../checkIsValidComponentMetadata";

/**
 * Create nodes from pipeline output map
 */
export function createNodesFromOutput(
  output: PipelineOutputFieldMap,
  metadata?: GeneralRecord,
) {
  let triggerMetadata: Nullable<PipelineComponentMetadata> = null;

  if (checkIsValidComponentMetadata(metadata)) {
    triggerMetadata = metadata.component["trigger"] ?? null;
  }

  const nodes: Node<NodeData>[] = [
    {
      id: "output",
      type: "outputNode",
      data: output,
      position: triggerMetadata
        ? { x: triggerMetadata.x, y: triggerMetadata.y }
        : { x: 0, y: 0 },
    },
  ];

  return nodes;
}
