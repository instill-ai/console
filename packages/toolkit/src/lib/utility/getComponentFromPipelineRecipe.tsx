import { ConnectorType, PipelineRecipe } from "../vdp-sdk";

export type getComponentsFromPipelineRecipeProps = {
  recipe: PipelineRecipe;
  connectorType: ConnectorType;
};

export function getComponentsFromPipelineRecipe(
  props: getComponentsFromPipelineRecipeProps
) {
  const { recipe, connectorType } = props;

  return recipe.components.filter((e) => e.resource?.type === connectorType);
}
