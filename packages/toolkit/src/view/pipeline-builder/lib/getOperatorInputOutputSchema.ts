import {
  InstillJSONSchema,
  Nullable,
  PipelineOperatorComponent,
} from "../../../lib";
import { JSONSchema7 } from "json-schema";

export function getOperatorInputOutputSchema(
  component: PipelineOperatorComponent,
  task?: string
) {
  let inputSchema: Nullable<InstillJSONSchema> = null;
  let outputSchema: Nullable<InstillJSONSchema> = null;

  // Sometime the component don't have complete data (Like the response of mutating the pipeline)
  if (!component.operator_component) {
    return { outputSchema, inputSchema };
  }

  // Additional guard
  if (!component.operator_component.input) {
    return { outputSchema, inputSchema };
  }

  const targetTask = task ?? component.operator_component.task;

  // We need to support the breaking changes that maybe the previous selected task's
  // definition is not support anymore. Console need to check this.
  if (
    targetTask &&
    component?.operator_component.definition?.spec.data_specifications[
      targetTask
    ]
  ) {
    inputSchema = component?.operator_component.definition?.spec
      .data_specifications[targetTask].input as InstillJSONSchema;
    outputSchema = component?.operator_component.definition?.spec
      .data_specifications[targetTask].output as InstillJSONSchema;
  } else if (
    component.operator_component.definition?.spec.component_specification
      .oneOf &&
    component.operator_component.definition?.spec.component_specification.oneOf
      .length > 0
  ) {
    const defaultTask =
      ((
        (
          component.operator_component.definition?.spec.component_specification
            .oneOf[0] as JSONSchema7
        )?.properties?.task as JSONSchema7
      )?.const as string) ?? null;

    if (!defaultTask) {
      return { outputSchema, inputSchema };
    }

    inputSchema = component?.operator_component.definition?.spec
      .data_specifications[defaultTask].input as InstillJSONSchema;
    outputSchema = component?.operator_component.definition?.spec
      .data_specifications[defaultTask].output as InstillJSONSchema;
  }

  return { outputSchema, inputSchema };
}
