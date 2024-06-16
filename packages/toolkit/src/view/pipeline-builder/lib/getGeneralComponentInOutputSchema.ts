import {
  InstillJSONSchema,
  Nullable,
  PipelineGeneralComponent,
} from "../../../lib";
import { JSONSchema7 } from "json-schema";

export function getGeneralComponentInOutputSchema(
  component: PipelineGeneralComponent,
  task?: string
) {
  let inputSchema: Nullable<InstillJSONSchema> = null;
  let outputSchema: Nullable<InstillJSONSchema> = null;

  // Additional guard
  if (!component.input) {
    return { outputSchema, inputSchema };
  }

  const targetTask = task ?? component.task;

  // We need to support the breaking changes that maybe the previous selected task's
  // definition is not support anymore. Console need to check this.
  if (
    targetTask &&
    component?.definition?.spec.dataSpecifications &&
    component?.definition?.spec.dataSpecifications[targetTask]
  ) {
    inputSchema = component?.definition?.spec.dataSpecifications[targetTask]
      .input as InstillJSONSchema;
    outputSchema = component?.definition?.spec.dataSpecifications[targetTask]
      .output as InstillJSONSchema;
  } else if (
    component.definition?.spec.componentSpecification.oneOf &&
    component.definition?.spec.componentSpecification.oneOf.length > 0
  ) {
    const defaultTask =
      ((
        (
          component.definition?.spec.componentSpecification
            .oneOf[0] as JSONSchema7
        )?.properties?.task as JSONSchema7
      )?.const as string) ?? null;

    if (!defaultTask) {
      return { outputSchema, inputSchema };
    }

    if (component?.definition?.spec.dataSpecifications) {
      inputSchema = component?.definition?.spec.dataSpecifications[defaultTask]
        .input as InstillJSONSchema;
      outputSchema = component?.definition?.spec.dataSpecifications[defaultTask]
        .output as InstillJSONSchema;
    }
  }

  return { outputSchema, inputSchema };
}
