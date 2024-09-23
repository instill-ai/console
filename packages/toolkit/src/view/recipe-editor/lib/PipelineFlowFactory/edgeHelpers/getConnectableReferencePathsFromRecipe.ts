import { InstillJSONSchema, Nullable, PipelineRecipe } from "instill-sdk";

import {
  getGeneralComponentInOutputSchema,
  getPropertiesFromOpenAPISchema,
  InstillAIOpenAPIProperty,
} from "../../../../pipeline-builder";
import { checkComponentTypeHelper } from "../../checkComponentTypeHelper";

/**
 * Hepler function to get all the connectable reference target, Take variable
 * for example, something like variable.foo or variable.bar. And for
 * other component, something like comp_1.output.foo or comp_1.output.bar
 */
export function getConnectableReferencePathsFromRecipe(
  recipe: Nullable<PipelineRecipe>,
): {
  variableNodeConnectableReferencePaths: string[];
  componentNodeConnectableReferencePaths: string[];
} {
  const variableNodeConnectableReferencePaths: string[] = [];
  const componentNodeConnectableReferencePaths: string[] = [];

  // 1. Extract connectable references for variable
  if (recipe && recipe.variable) {
    for (const [key] of Object.entries(recipe.variable)) {
      variableNodeConnectableReferencePaths.push(`variable.${key}`);
    }
  }

  // 2. Extract connectable for component's output
  if (recipe && recipe.component) {
    for (const [cId, c] of Object.entries(recipe.component)) {
      if (!c) {
        continue;
      }

      let outputSchema: Nullable<InstillJSONSchema> = null;

      if (checkComponentTypeHelper.isPipelineIteratorComponent(c)) {
        outputSchema = c.dataSpecification?.output ?? null;
      } else if (checkComponentTypeHelper.isPipelineGeneralComponent(c)) {
        const { outputSchema: GeneralNodeOutputSchema } =
          getGeneralComponentInOutputSchema(c);
        outputSchema = GeneralNodeOutputSchema;
      }

      let outputProperties: InstillAIOpenAPIProperty[] = [];

      if (outputSchema) {
        outputProperties = getPropertiesFromOpenAPISchema(outputSchema);
      }

      // We only need to have the key, not the full path. And we will enhance this
      // part by adapting InstillFormTree

      for (const outputProperty of outputProperties) {
        componentNodeConnectableReferencePaths.push(
          `${cId}.output.${
            outputProperty.path?.includes(".")
              ? outputProperty.path?.split(".").pop()
              : outputProperty.path
          }`,
        );
      }

      // User can also reference the whole component's output object
      componentNodeConnectableReferencePaths.push(`${cId}.output`);
    }
  }

  // 3. Extract connectable references for runon
  // if (recipe && recipe.on) {
  // }

  return {
    variableNodeConnectableReferencePaths,
    componentNodeConnectableReferencePaths,
  };
}
