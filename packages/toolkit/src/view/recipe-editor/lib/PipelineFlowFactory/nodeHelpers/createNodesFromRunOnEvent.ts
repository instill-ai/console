import { GeneralRecord, Nullable, PipelineRunOnEventMap } from "instill-sdk";
import { Node } from "reactflow";

import { NodeData, PipelineComponentMetadata } from "../../../flow/types";
import { checkIsValidComponentMetadata } from "../../checkIsValidComponentMetadata";

/**
 * Create nodes from pipeline run on event map
 */
export function createNodesFromRunOnEvent(
  runOnEvent: PipelineRunOnEventMap,
  metadata?: GeneralRecord,
  hideEventNodes: boolean = false,
) {
  const nodes: Node<NodeData>[] = [];

  for (const [id, e] of Object.entries(runOnEvent)) {
    let componentMetadata: Nullable<PipelineComponentMetadata> = null;

    if (checkIsValidComponentMetadata(metadata)) {
      componentMetadata = metadata.component[id] ?? null;
    }

    nodes.push({
      id: `on-${id}`,
      type: "runOnEventNode",
      hidden: hideEventNodes,
      data: e,
      position: componentMetadata
        ? { x: componentMetadata.x, y: componentMetadata.y }
        : { x: 0, y: 0 },
    });
  }

  return nodes;
}
