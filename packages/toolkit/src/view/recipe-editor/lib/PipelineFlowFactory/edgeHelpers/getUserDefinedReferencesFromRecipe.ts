import { Nullable, PipelineRecipe } from "instill-sdk";

import { getReferencesFromAny } from "../../../../pipeline-builder/lib/getReferencesFromAny";
import { InstillReferenceWithID } from "../../../flow/types";
import { checkComponentTypeHelper } from "../../checkComponentTypeHelper";

export function getUserDefinedReferencesFromRecipe(
  recipe: Nullable<PipelineRecipe>,
): InstillReferenceWithID[] {
  const references: InstillReferenceWithID[] = [];

  if (recipe && recipe.variable) {
    const userDefinedReferencesForVariable = getReferencesFromAny(
      recipe.variable,
    );

    references.push(
      ...userDefinedReferencesForVariable.map((reference) => ({
        id: "variable",
        ...reference,
      })),
    );
  }

  if (recipe && recipe.output && recipe.output) {
    const userDefinedReferencesForOutput = getReferencesFromAny(recipe.output);

    references.push(
      ...userDefinedReferencesForOutput.map((reference) => ({
        id: "output",
        ...reference,
      })),
    );
  }

  if (recipe && recipe.component) {
    for (const [cId, c] of Object.entries(recipe.component)) {
      if (!c) {
        continue;
      }

      if (checkComponentTypeHelper.isPipelineGeneralComponent(c)) {
        const configuration = {
          input: c.input,
          task: c.task,
          condition: c.condition,
          setup: c.setup,
        };

        const userDefinedReferencesForGeneralComponent =
          getReferencesFromAny(configuration);

        references.push(
          ...userDefinedReferencesForGeneralComponent.map((reference) => ({
            id: cId,
            ...reference,
          })),
        );
      }
    }
  }

  return references;
}
