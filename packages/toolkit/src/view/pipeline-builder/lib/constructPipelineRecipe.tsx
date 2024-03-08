import { recursiveHelpers } from "./recursive-helpers";
import { PipelineComponent } from "../../../lib";
import {
  isConnectorComponent,
  isEndComponent,
  isIteratorComponent,
  isStartComponent,
} from "./checkComponentType";

export function constructPipelineRecipe(
  components: PipelineComponent[],
  removeConnectorName?: boolean
) {
  const recipeComponents: PipelineComponent[] = [];

  for (const component of components) {
    if (isStartComponent(component)) {
      recipeComponents.push(component);
      continue;
    }

    if (isEndComponent(component)) {
      recipeComponents.push(component);
      continue;
    }

    if (isIteratorComponent(component)) {
      recipeComponents.push({
        id: component.id,
        iterator_component: {
          ...component.iterator_component,
          components: constructPipelineRecipe(
            component.iterator_component.components
          ).components,
        },
      });
      continue;
    }

    if (isConnectorComponent(component)) {
      recipeComponents.push({
        id: component.id,
        connector_component: {
          ...component.connector_component,
          connector_name: removeConnectorName
            ? ""
            : component.connector_component.connector_name,
          input: recursiveHelpers.parseToNum(
            structuredClone(component.connector_component.input)
          ),
          definition: null,
          connector: null,
        },
      });

      continue;
    }

    recipeComponents.push({
      id: component.id,
      operator_component: {
        ...component.operator_component,
        input: recursiveHelpers.parseToNum(
          structuredClone(component.operator_component.input)
        ),
        definition: null,
      },
    });
  }

  return {
    version: "v1beta",
    components: recipeComponents,
  };
}
