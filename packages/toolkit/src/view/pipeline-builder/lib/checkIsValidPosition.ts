import { GeneralRecord, Nullable, PipelineComponentMap } from "../../../lib";
import { PipelineComponentMetadataMap } from "../type";

export function checkIsValidPosition({
  component,
  metadata,
  isIteratorNode,
}: {
  component: Nullable<PipelineComponentMap>;
  metadata: Nullable<GeneralRecord>;
  isIteratorNode?: boolean;
}): boolean {
  if (
    component &&
    metadata &&
    "component" in metadata &&
    Object.keys(metadata.component).length > 0
  ) {
    // Check whether we have metadata for variable
    if (!metadata.component["variable"] && !isIteratorNode) {
      return false;
    }

    // check whether we have metadata for response
    if (!metadata.component["response"] && !isIteratorNode) {
      return false;
    }

    // Check whether we have metadata for other components in the editor
    const componentMetadatas =
      metadata.component satisfies PipelineComponentMetadataMap;

    let isValid = true;

    for (const componentID in componentMetadatas) {
      if (
        componentID !== "variable" &&
        componentID !== "response" &&
        !component[componentID]
      ) {
        isValid = false;
        break;
      }
    }

    return isValid;
  }

  return false;
}
