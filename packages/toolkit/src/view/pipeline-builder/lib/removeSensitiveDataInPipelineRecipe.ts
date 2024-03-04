import { PipelineRecipe } from "../../../lib";
import {
  isEndComponent,
  isIteratorComponent,
  isOperatorComponent,
  isStartComponent,
} from "./checkComponentType";

export function removeSensitiveDataInPipelineRecipe(
  recipe: PipelineRecipe,
  removeConnectorName = false
): PipelineRecipe {
  const raw: PipelineRecipe = {
    ...recipe,
    components: recipe.components.map((component) => {
      if (
        isStartComponent(component) ||
        isEndComponent(component) ||
        isOperatorComponent(component)
      ) {
        return component;
      }

      if (isIteratorComponent(component)) {
        return component;
      }
      return {
        ...component,
        connector_component: {
          ...component.connector_component,
          connector: null,
          connector_name: removeConnectorName
            ? ""
            : component.connector_component.connector_name,
        },
      };
    }),
  };

  return raw;
}
