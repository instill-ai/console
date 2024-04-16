import { PipelineComponent } from "../../../lib";
import { isIteratorComponent, isOperatorComponent } from "./checkComponentType";

export function removeSensitiveDataInPipelineRecipe(
  components: PipelineComponent[],
  removeConnectorName = false
): PipelineComponent[] {
  return components.map((component) => {
    if (isOperatorComponent(component)) {
      return component;
    }

    if (isIteratorComponent(component)) {
      return {
        ...component,
        iterator_component: {
          ...component.iterator_component,
          components: removeSensitiveDataInPipelineRecipe(
            component.iterator_component.components,
            removeConnectorName
          ),
        },
      };
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
  });
}
