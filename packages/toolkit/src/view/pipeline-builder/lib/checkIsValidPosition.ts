import { GeneralRecord, PipelineRecipe } from "../../../lib";
import { PipelineComponentMetadata } from "../type";

export function checkIsValidPosition(
  recipe: PipelineRecipe,
  metadata: GeneralRecord
): boolean {
  if ("components" in metadata) {
    if (Array.isArray(metadata.components) && metadata.components.length > 0) {
      const componentMetadatas =
        metadata.components as PipelineComponentMetadata[];

      const componentIDs = componentMetadatas.map((e) => e.id);

      let isValid = true;

      for (const component of recipe.components) {
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
