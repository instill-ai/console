import {
  InstillJSONSchema,
  Nullable,
  PipelineConnectorComponent,
} from "../../../lib";
import { JSONSchema7 } from "json-schema";

export function getConnectorInputOutputSchema(
  component: PipelineConnectorComponent,
  task?: string
) {
  let inputSchema: Nullable<InstillJSONSchema> = null;
  let outputSchema: Nullable<InstillJSONSchema> = null;

  // Sometime the component don't have complete data (Like the response of mutating the pipeline)
  if (!component.connector_component) {
    return { outputSchema, inputSchema };
  }

  // Additional guard
  if (!component.connector_component.input) {
    return { outputSchema, inputSchema };
  }

  const targetTask = task ?? component.connector_component.task;

  // We need to support the breaking changes that maybe the previous selected task's
  // definition is not support anymore. Console need to check this.
  if (
    targetTask &&
    component?.connector_component.definition?.spec.data_specifications &&
    component?.connector_component.definition?.spec.data_specifications[
      targetTask
    ]
  ) {
    inputSchema = component?.connector_component.definition?.spec
      .data_specifications[targetTask].input as InstillJSONSchema;
    outputSchema = component?.connector_component.definition?.spec
      .data_specifications[targetTask].output as InstillJSONSchema;
  } else if (
    component.connector_component.definition?.spec.component_specification
      .oneOf &&
    component.connector_component.definition.spec.component_specification.oneOf
      .length > 0
  ) {
    const defaultTask =
      ((
        (
          component?.connector_component.definition?.spec
            .component_specification.oneOf[0] as JSONSchema7
        )?.properties?.task as JSONSchema7
      )?.const as string) ?? null;

    if (!defaultTask) {
      return { outputSchema, inputSchema };
    }

    if (component?.connector_component.definition?.spec.data_specifications) {
      inputSchema = component?.connector_component.definition?.spec
        .data_specifications[defaultTask].input as InstillJSONSchema;
      outputSchema = component?.connector_component.definition?.spec
        .data_specifications[defaultTask].output as InstillJSONSchema;
    }
  }

  return { outputSchema, inputSchema };
}
