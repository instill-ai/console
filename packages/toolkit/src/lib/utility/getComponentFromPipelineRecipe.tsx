import { ConnectorResourceType, PipelineRecipe } from "../vdp-sdk";

export type getComponentsFromPipelineRecipeProps = {
  recipe: PipelineRecipe;
  connectorResourceType: ConnectorResourceType;
};

export function getComponentsFromPipelineRecipe(
  props: getComponentsFromPipelineRecipeProps
) {
  const { recipe, connectorResourceType } = props;

  return recipe.components.filter(
    (e) => e.resource?.type === connectorResourceType
  );
}
