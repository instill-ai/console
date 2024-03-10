import { GeneralRecord, Nullable, PipelineComponent } from "../../../lib";
import { PipelineComponentMetadata } from "../type";

export function checkIsValidPosition(
  components: PipelineComponent[],
  metadata: Nullable<GeneralRecord>
): boolean {
  if (metadata && "components" in metadata) {
    if (Array.isArray(metadata.components) && metadata.components.length > 0) {
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
