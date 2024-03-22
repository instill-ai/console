import { recursiveHelpers } from "./recursive-helpers";
import { PipelineComponent } from "../../../lib";
import {
  isConnectorComponent,
  isEndComponent,
  isIteratorComponent,
  isStartComponent,
} from "./checkComponentType";

export type ComponentNode = {
  component: PipelineComponent;
  id: string;
};

export function constructPipelineRecipe(
  components: ComponentNode[],
  removeConnectorName?: boolean
) {
  const recipeComponents: PipelineComponent[] = [];

  for (const component of components) {
    if (isStartComponent(component.component)) {
      recipeComponents.push(component.component);
      continue;
    }

    if (isEndComponent(component.component)) {
      recipeComponents.push(component.component);
      continue;
    }

    if (isIteratorComponent(component.component)) {
      recipeComponents.push({
        id: component.id,
        iterator_component: {
          ...component.component.iterator_component,
          components: constructPipelineRecipe(
            component.component.iterator_component.components.map((node) => {
              return {
                component: node,
                id: node.id,
              };
            })
          ).components,
        },
      });
      continue;
    }

    if (isConnectorComponent(component.component)) {
      recipeComponents.push({
        id: component.id,
        connector_component: {
          ...component.component.connector_component,
          connector_name: removeConnectorName
            ? ""
            : component.component.connector_component.connector_name,
          input: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
            recursiveHelpers.parseToNum(
              structuredClone(component.component.connector_component.input)
            )
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
        ...component.component.operator_component,
        input: recursiveHelpers.replaceNullAndEmptyStringWithUndefined(
          recursiveHelpers.parseToNum(
            structuredClone(component.component.operator_component.input)
          )
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
