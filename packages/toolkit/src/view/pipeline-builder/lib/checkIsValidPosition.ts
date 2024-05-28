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
    Object.keys(component).length > 0
  ) {
    // Check whether we have metadata for trigger
    if (!metadata.component["trigger"] && !isIteratorNode) {
      return false;
    }

    // check whether we have metadata for response
    if (!metadata.component["response"] && !isIteratorNode) {
      return false;
    }

    // Check whether we have metadata for other components in the builder
    const componentMetadatas =
      metadata.component satisfies PipelineComponentMetadataMap;

    let isValid = true;

    for (const componentID in Object.keys(componentMetadatas)) {
      if (!component[componentID]) {
        isValid = false;
        break;
      }
    }

    return isValid;
  }

  return false;
}
