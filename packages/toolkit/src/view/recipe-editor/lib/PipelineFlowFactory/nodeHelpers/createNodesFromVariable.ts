import { GeneralRecord, Nullable, PipelineVariableFieldMap } from "instill-sdk";
import { Node } from "reactflow";

import { NodeData, PipelineComponentMetadata } from "../../../flow/types";
import { checkIsValidComponentMetadata } from "../../checkIsValidComponentMetadata";

/**
 * Create nodes from pipeline variable map
 */
export function createNodesFromVariable(
  variable: PipelineVariableFieldMap,
  metadata?: GeneralRecord,
) {
  let triggerMetadata: Nullable<PipelineComponentMetadata> = null;

  if (checkIsValidComponentMetadata(metadata)) {
    triggerMetadata = metadata.component["trigger"] ?? null;
  }

  const nodes: Node<NodeData>[] = [
    {
      id: "variable",
      type: "variableNode",
      data: variable,
      position: triggerMetadata
        ? { x: triggerMetadata.x, y: triggerMetadata.y }
        : { x: 0, y: 0 },
    },
  ];

  return nodes;
}
