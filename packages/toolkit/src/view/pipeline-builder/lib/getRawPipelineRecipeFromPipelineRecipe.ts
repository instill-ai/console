import { PipelineRecipe, RawPipelineRecipe } from "../../../lib";

export function getRawPipelineRecipeFromPipelineRecipe(
  recipe: PipelineRecipe
): RawPipelineRecipe {
  const raw: RawPipelineRecipe = {
    ...recipe,
    components: recipe.components.map((component) => ({
      ...component,
      resource_name: component.resource_name ?? "",
      connector_definition: undefined,
      resource: undefined,
      operator_definition: undefined,
    })),
  };

  return raw;
}
