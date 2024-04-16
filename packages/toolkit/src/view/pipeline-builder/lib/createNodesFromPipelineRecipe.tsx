import { Node } from "reactflow";
import {
  GeneralRecord,
  Nullable,
  PipelineRecipe,
  TriggerByRequest,
} from "../../../lib";
import { NodeData, PipelineComponentMetadata } from "../type";
import { createNodesFromPipelineComponents } from "./createNodesFromPipelineComponents";
import { isTriggerByRequest } from "./isTriggerByRequest";

export type CreateNodesFromPipelineRecipeOptions = {
  metadata?: GeneralRecord;
};

export function createNodesFromPipelineRecipe(
  recipe: PipelineRecipe,
  options?: CreateNodesFromPipelineRecipeOptions
) {
  const metadata = options ? options.metadata : null;
  const nodes: Node<NodeData>[] = [];

  const componentNodes = createNodesFromPipelineComponents(recipe.components);
  nodes.push(...componentNodes);

  // create trigger node

  let triggerMetadata: Nullable<PipelineComponentMetadata> = null;

  if (
    metadata &&
    "components" in metadata &&
    Array.isArray(metadata.components)
  ) {
    triggerMetadata = metadata.components.find((c) => c.id === "trigger");
  }

  let triggerByRequest: Nullable<TriggerByRequest> = null;

  if (isTriggerByRequest(recipe.trigger)) {
    triggerByRequest = recipe.trigger;
  }

  nodes.push({
    id: "trigger",
    type: "triggerNode",
    data: {
      id: "trigger",
      fields: triggerByRequest?.trigger_by_request.request_fields ?? {},
      note: triggerMetadata ? triggerMetadata.note : null,
    },
    position: triggerMetadata
      ? { x: triggerMetadata.x, y: triggerMetadata.y }
      : { x: 0, y: 0 },
  });

  // create response node

  let responseMetadata: Nullable<PipelineComponentMetadata> = null;

  if (
    metadata &&
    "components" in metadata &&
    Array.isArray(metadata.components)
  ) {
    responseMetadata = metadata.components.find((c) => c.id === "response");
  }

  nodes.push({
    id: "response",
    type: "responseNode",
    data: {
      id: "response",
      fields: triggerByRequest?.trigger_by_request.response_fields ?? {},
      note: responseMetadata ? responseMetadata.note : null,
    },
    position: responseMetadata
      ? { x: responseMetadata.x, y: responseMetadata.y }
      : { x: 0, y: 0 },
  });

  return nodes;
}
