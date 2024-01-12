import { OpenAPIV3 } from "openapi-types";
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
  if (!component.operator_definition) {
    return { outputSchema, inputSchema };
  }

  // Additional guard
  if (!component.configuration) {
    return { outputSchema, inputSchema };
  }

  const targetTask = task ?? component.configuration.task;

  if (targetTask) {
    inputSchema = (
      (
        (
          component?.operator_definition?.spec.openapi_specifications[
            targetTask
          ].paths["/execute"]?.post?.requestBody as OpenAPIV3.RequestBodyObject
        ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
      ).properties?.inputs as OpenAPIV3.ArraySchemaObject
    ).items as InstillJSONSchema;
    outputSchema = (
      (
        (
          (
            component?.operator_definition?.spec.openapi_specifications[
              targetTask
            ].paths["/execute"]?.post?.responses[
              "200"
            ] as OpenAPIV3.ResponseObject
          ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
        )["application/json"]?.schema as OpenAPIV3.SchemaObject
      ).properties?.outputs as OpenAPIV3.ArraySchemaObject
    ).items as InstillJSONSchema;
  } else if (
    component.operator_definition.spec.component_specification.oneOf &&
    component.operator_definition.spec.component_specification.oneOf.length > 0
  ) {
    const defaultTask =
      ((
        (
          component.operator_definition.spec.component_specification
            .oneOf[0] as JSONSchema7
        )?.properties?.task as JSONSchema7
      )?.const as string) ?? null;

    if (!defaultTask) {
      return { outputSchema, inputSchema };
    }

    inputSchema = (
      (
        (
          component?.operator_definition?.spec.openapi_specifications[
            defaultTask
          ].paths["/execute"]?.post?.requestBody as OpenAPIV3.RequestBodyObject
        ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
      ).properties?.inputs as OpenAPIV3.ArraySchemaObject
    ).items as InstillJSONSchema;
    outputSchema = (
      (
        (
          (
            component?.operator_definition?.spec.openapi_specifications[
              defaultTask
            ].paths["/execute"]?.post?.responses[
              "200"
            ] as OpenAPIV3.ResponseObject
          ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
        )["application/json"]?.schema as OpenAPIV3.SchemaObject
      ).properties?.outputs as OpenAPIV3.ArraySchemaObject
    ).items as InstillJSONSchema;
  }

  return { outputSchema, inputSchema };
}
