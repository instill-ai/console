import { getGeneralComponentInOutputSchema } from "../../../view";
import {
  isPipelineGeneralComponent,
  isPipelineIteratorComponent,
} from "../../../view/pipeline-builder/lib/checkComponentType";
import { transformInstillJSONSchemaToFormTree } from "../../use-instill-form/transform";
import { PipelineComponent } from "../../vdp-sdk";
import { transformFormTreeToSmartHints } from "../transformFormTreeToSmartHints";
import { SmartHint } from "../types";

export function pickOutputReferenceHintsFromComponent({
  component,
  task,
  consoleComposedIteratorSchema,
}: {
  component: PipelineComponent;
  task?: string;
  consoleComposedIteratorSchema?: boolean;
}) {
  let outputReferenceHints: SmartHint[] = [];

  if (isPipelineIteratorComponent(component)) {
    let iteratorHints: SmartHint[] = [];

    if (consoleComposedIteratorSchema) {
      Object.entries(component.output_elements).forEach(([key, value]) => {
        const referencePathArray = value
          .replace("${", "")
          .replace("}", "")
          .split(".");

        const componentKey = referencePathArray[0];
        const targetComponent = component.component.find(
          (e) => e.id === componentKey
        );

        if (targetComponent) {
          const componentHints = pickOutputReferenceHintsFromComponent({
            component: targetComponent,
          });

          const targetHint = componentHints.find(
            (hint) => hint.path === value.replace("${", "").replace("}", "")
          );

          if (targetHint) {
            iteratorHints.push(targetHint);
          }

          // Deal with user directly reference the whole output of specific component in
          // the iterator
          if (value === "${" + targetComponent.id + ".output" + "}") {
            iteratorHints.push({
              path: `${component.id}.output.${key}`,
              key,
              instillFormat: "null",
              type: "array",
              properties: componentHints,
            });
          }
        }
      });
    } else {
      const outputSchema = component.data_specification?.output;

      if (outputSchema) {
        const outputFormTree =
          transformInstillJSONSchemaToFormTree(outputSchema);

        iteratorHints = transformFormTreeToSmartHints(
          outputFormTree,
          component.id
        );
      }
    }

    outputReferenceHints = [...outputReferenceHints, ...iteratorHints];
  }

  if (isPipelineGeneralComponent(component)) {
    const { outputSchema } = getGeneralComponentInOutputSchema(component, task);

    if (outputSchema) {
      const outputFormTree = transformInstillJSONSchemaToFormTree(outputSchema);
      const hints = transformFormTreeToSmartHints(outputFormTree, component.id);

      outputReferenceHints = [...outputReferenceHints, ...hints];
    }
  }

  return outputReferenceHints;
}
