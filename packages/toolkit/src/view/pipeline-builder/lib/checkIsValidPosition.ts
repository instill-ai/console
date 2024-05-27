import { GeneralRecord, Nullable, PipelineComponent } from "../../../lib";
import { PipelineComponentMetadata } from "../type";

export function checkIsValidPosition({
  component,
  metadata,
  isIteratorNode,
}: {
  component: PipelineComponent[];
  metadata: Nullable<GeneralRecord>;
  isIteratorNode?: boolean;
}): boolean {
  if (metadata && "components" in metadata) {
    if (Array.isArray(metadata.components) && metadata.components.length > 0) {
      // Check whether we have metadata for trigger
      if (
        metadata.components.findIndex((e) => e.id === "trigger") === -1 &&
        !isIteratorNode
      ) {
        return false;
      }

      // check whether we have metadata for response
      if (
        metadata.components.findIndex((e) => e.id === "response") === -1 &&
        !isIteratorNode
      ) {
        return false;
      }

      // Check whether we have metadata for other components in the builder
      const componentMetadatas =
        metadata.components as PipelineComponentMetadata[];

      const componentIDs = componentMetadatas.map((e) => e.id);

      let isValid = true;

      for (const e of component) {
        if (!componentIDs.includes(e.id)) {
          isValid = false;
          break;
        }
      }

      return isValid;
    }
  }

  return false;
}
