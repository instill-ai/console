import { GeneralRecord, Nullable, PipelineComponent } from "../../../lib";
import { PipelineComponentMetadata } from "../type";

export function checkIsValidPosition(
  components: PipelineComponent[],
  metadata: Nullable<GeneralRecord>
): boolean {
  if (metadata && "components" in metadata) {
    if (Array.isArray(metadata.components) && metadata.components.length > 0) {
      // Check whether we have metadata for trigger
      if (metadata.components.findIndex((e) => e.id === "trigger") === -1) {
        return false;
      }

      // check whether we have metadata for response
      if (metadata.components.findIndex((e) => e.id === "response") === -1) {
        return false;
      }

      // Check whether we have metadata for other components in the builder
      const componentMetadatas =
        metadata.components as PipelineComponentMetadata[];

      const componentIDs = componentMetadatas.map((e) => e.id);

      let isValid = true;

      for (const component of components) {
        if (!componentIDs.includes(component.id)) {
          isValid = false;
          break;
        }
      }

      return isValid;
    }
  }

  return false;
}
